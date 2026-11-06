from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from app.schemas.audio import SynthesizeRequest, SynthesizeResponse, VoiceInfo
from app.services.tts_service import tts_service

router = APIRouter(prefix="/api/tts", tags=["Text-to-Speech"])

@router.post("/synthesize", response_model=SynthesizeResponse)
async def synthesize_text(request: SynthesizeRequest):
    try:
        result = await tts_service.synthesize_to_base64(
            text=request.text,
            voice=request.voice,
            speed=request.speed or 1.0,
            provider_name=request.provider,
        )
        return SynthesizeResponse(
            audio_base64=result["audio_base64"],
            format=result["format"],
            voice=result["voice"],
            provider=result["provider"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/voices", response_model=List[VoiceInfo])
async def list_available_voices(provider: Optional[str] = Query(None)):
    try:
        voices = await tts_service.list_voices(provider)
        return [
            VoiceInfo(
                id=v["id"],
                name=v["name"],
                gender=v.get("gender", "Female"),
                language=v.get("language", "en"),
                locale=v.get("locale", "en-US"),
                provider=v.get("provider", "edge-tts"),
            )
            for v in voices
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

