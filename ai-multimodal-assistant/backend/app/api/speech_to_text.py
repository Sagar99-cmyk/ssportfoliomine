from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from app.schemas.audio import TranscribeResponse
from app.services.stt_service import stt_service

router = APIRouter(prefix="/api/stt", tags=["Speech-to-Text"])

@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    language: Optional[str] = Form(None),
    provider: Optional[str] = Form(None),
):
    try:
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Audio file is empty.")

        result = await stt_service.transcribe(
            audio_bytes=content,
            language=language,
            provider_name=provider,
        )

        return TranscribeResponse(
            text=result["text"],
            language=result.get("language", "en"),
            duration=result.get("duration"),
            segments=result.get("segments"),
            provider=result.get("provider", "faster-whisper"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

