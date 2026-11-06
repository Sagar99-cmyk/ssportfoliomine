import json
import base64
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.llm_service import llm_service
from app.services.tts_service import tts_service
from app.services.stt_service import stt_service
from app.config import settings

router = APIRouter(tags=["Speech-to-Speech WebSocket"])

@router.websocket("/api/ws/voice")
async def voice_conversation_endpoint(websocket: WebSocket):
    await websocket.accept()
    interrupted = False
    conversation_history = []

    try:
        await websocket.send_json({
            "type": "ready",
            "message": "Voice conversation session connected. Ready for real-time speech."
        })

        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            action = payload.get("type")

            if action == "interrupt":
                interrupted = True
                await websocket.send_json({"type": "interrupted"})
                continue

            elif action == "reset":
                conversation_history = []
                await websocket.send_json({"type": "reset_ack"})
                continue

            elif action == "user_audio":
                # Audio base64 from client
                interrupted = False
                audio_b64 = payload.get("audio")
                audio_bytes = base64.b64decode(audio_b64)

                # 1. Transcribe audio
                try:
                    transcription = await stt_service.transcribe(audio_bytes)
                    user_text = transcription["text"]
                except Exception as stt_err:
                    user_text = payload.get("text_fallback", "")

                if not user_text:
                    await websocket.send_json({"type": "error", "message": "No speech detected."})
                    continue

                # Echo user speech to UI
                conversation_history.append({"role": "user", "content": user_text})
                await websocket.send_json({
                    "type": "transcript",
                    "role": "user",
                    "text": user_text
                })

                # 2. Stream LLM Response & Synthesize Audio
                full_reply = ""
                sentence_buffer = ""
                
                try:
                    generator = llm_service.stream_response(
                        messages=conversation_history,
                        system_prompt=payload.get("system_prompt") or settings.DEFAULT_SYSTEM_PROMPT,
                    )

                    async for chunk in generator:
                        if interrupted:
                            break

                        full_reply += chunk
                        sentence_buffer += chunk

                        # Emit live text token
                        await websocket.send_json({
                            "type": "text_chunk",
                            "delta": chunk
                        })

                        # When sentence boundary is reached, synthesize audio chunk
                        if any(sentence_buffer.endswith(punct) for punct in [". ", "? ", "! ", ".\n", "!\n"]):
                            clean_sentence = sentence_buffer.strip()
                            sentence_buffer = ""
                            if clean_sentence and not interrupted:
                                try:
                                    tts_res = await tts_service.synthesize_to_base64(
                                        text=clean_sentence,
                                        voice=payload.get("voice") or settings.DEFAULT_TTS_VOICE,
                                        speed=payload.get("speed", 1.0),
                                    )
                                    await websocket.send_json({
                                        "type": "audio_chunk",
                                        "audio": tts_res["audio_base64"],
                                        "text": clean_sentence
                                    })
                                except Exception:
                                    pass

                    # Process remaining sentence buffer
                    if sentence_buffer.strip() and not interrupted:
                        try:
                            tts_res = await tts_service.synthesize_to_base64(
                                text=sentence_buffer.strip(),
                                voice=payload.get("voice") or settings.DEFAULT_TTS_VOICE,
                                speed=payload.get("speed", 1.0),
                            )
                            await websocket.send_json({
                                "type": "audio_chunk",
                                "audio": tts_res["audio_base64"],
                                "text": sentence_buffer.strip()
                            })
                        except Exception:
                            pass

                    if not interrupted:
                        conversation_history.append({"role": "assistant", "content": full_reply})
                        await websocket.send_json({
                            "type": "turn_complete",
                            "full_text": full_reply
                        })

                except Exception as e:
                    await websocket.send_json({"type": "error", "message": str(e)})

    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except:
            pass

