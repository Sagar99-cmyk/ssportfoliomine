from typing import List, Dict, Any, Optional
from app.config import settings
from app.providers.whisper_provider import FasterWhisperProvider
from app.providers.assemblyai_provider import AssemblyAIProvider
from app.providers.sarvam_provider import SarvamProvider

class STTService:
    def __init__(self):
        self.faster_whisper = FasterWhisperProvider()
        self.assemblyai = AssemblyAIProvider()
        self.sarvam = SarvamProvider()

    def get_provider(self, provider_name: Optional[str] = None):
        name = (provider_name or settings.DEFAULT_STT_PROVIDER).lower()
        if name == "assemblyai":
            return self.assemblyai
        elif name == "sarvam":
            return self.sarvam
        else:
            return self.faster_whisper

    async def get_available_providers(self) -> List[Dict[str, Any]]:
        fw_ok = await self.faster_whisper.is_available()
        assembly_ok = await self.assemblyai.is_available()
        sarvam_ok = await self.sarvam.is_available()

        return [
            {
                "id": "assemblyai",
                "name": "AssemblyAI (Pro Cloud Transcription)",
                "type": "stt",
                "status": "available" if assembly_ok else "requires_key",
                "description": "High-accuracy cloud transcription with automatic punctuation.",
                "is_local": False,
                "requires_api_key": True,
                "has_api_key": assembly_ok,
                "models": ["Universal-2"]
            },
            {
                "id": "faster-whisper",
                "name": "Faster Whisper (Local & Offline)",
                "type": "stt",
                "status": "available" if fw_ok else "requires_download",
                "description": "High-accuracy, INT8 CPU-optimized local speech transcription.",
                "is_local": True,
                "requires_api_key": False,
                "has_api_key": True,
                "models": ["tiny", "base", "small"]
            },
            {
                "id": "sarvam",
                "name": "Sarvam AI (Indic Speech-to-Text)",
                "type": "stt",
                "status": "available" if sarvam_ok else "requires_key",
                "description": "Transcribes 10+ Indian languages (Hindi, Bengali, Tamil, etc.).",
                "is_local": False,
                "requires_api_key": True,
                "has_api_key": sarvam_ok,
                "models": ["saaras:v1"]
            }
        ]

    async def transcribe(
        self,
        audio_bytes: bytes,
        language: Optional[str] = None,
        provider_name: Optional[str] = None,
    ) -> Dict[str, Any]:
        name = (provider_name or settings.DEFAULT_STT_PROVIDER).lower()
        if name == "assemblyai" and await self.assemblyai.is_available():
            return await self.assemblyai.transcribe(audio_bytes=audio_bytes, language=language)
        elif name == "sarvam" and await self.sarvam.is_available():
            return await self.sarvam.transcribe(audio_bytes=audio_bytes, language_code=language or "hi-IN")
        else:
            return await self.faster_whisper.transcribe(audio_bytes=audio_bytes, language=language)

stt_service = STTService()
