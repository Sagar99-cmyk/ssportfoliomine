import base64
from typing import List, Dict, Any, Optional
from app.config import settings
from app.providers.edge_tts_provider import EdgeTTSProvider
from app.providers.elevenlabs_provider import ElevenLabsProvider
from app.providers.sarvam_provider import SarvamProvider

class TTSService:
    def __init__(self):
        self.edge_tts = EdgeTTSProvider()
        self.elevenlabs = ElevenLabsProvider()
        self.sarvam = SarvamProvider()

    def get_provider(self, provider_name: Optional[str] = None):
        name = (provider_name or settings.DEFAULT_TTS_PROVIDER).lower()
        if name == "elevenlabs":
            return self.elevenlabs
        elif name == "sarvam":
            return self.sarvam
        else:
            return self.edge_tts

    async def get_available_providers(self) -> List[Dict[str, Any]]:
        edge_ok = await self.edge_tts.is_available()
        eleven_ok = await self.elevenlabs.is_available()
        sarvam_ok = await self.sarvam.is_available()

        return [
            {
                "id": "elevenlabs",
                "name": "ElevenLabs (Ultra-Realistic AI Speech)",
                "type": "tts",
                "status": "available" if eleven_ok else "requires_key",
                "description": "State-of-the-art human voice synthesis with emotional cadence.",
                "is_local": False,
                "requires_api_key": True,
                "has_api_key": eleven_ok,
                "models": ["eleven_monolingual_v1", "eleven_multilingual_v2"]
            },
            {
                "id": "edge-tts",
                "name": "Edge TTS (Free Neural Voices)",
                "type": "tts",
                "status": "available" if edge_ok else "offline",
                "description": "Completely free, natural neural voices with zero API key required.",
                "is_local": False,
                "requires_api_key": False,
                "has_api_key": True,
                "models": ["Neural TTS"]
            },
            {
                "id": "sarvam",
                "name": "Sarvam AI (Indic Regional Voices)",
                "type": "tts",
                "status": "available" if sarvam_ok else "requires_key",
                "description": "Authentic regional Indian voices in Hindi, Bengali, Tamil, etc.",
                "is_local": False,
                "requires_api_key": True,
                "has_api_key": sarvam_ok,
                "models": ["bulbul:v1"]
            }
        ]

    async def list_voices(self, provider_name: Optional[str] = None) -> List[Dict[str, Any]]:
        name = (provider_name or settings.DEFAULT_TTS_PROVIDER).lower()
        if name == "elevenlabs":
            return await self.elevenlabs.list_voices()
        elif name == "sarvam":
            return [
                {"id": "shubh", "name": "Shubh (Hindi Male)", "gender": "Male", "language": "hi", "locale": "hi-IN", "provider": "sarvam"},
                {"id": "arvind", "name": "Arvind (Hindi Male)", "gender": "Male", "language": "hi", "locale": "hi-IN", "provider": "sarvam"},
                {"id": "amartya", "name": "Amartya (Bengali Male)", "gender": "Male", "language": "bn", "locale": "bn-IN", "provider": "sarvam"},
            ]
        else:
            return await self.edge_tts.list_voices()

    async def synthesize_to_bytes(
        self,
        text: str,
        voice: Optional[str] = None,
        speed: float = 1.0,
        provider_name: Optional[str] = None,
    ) -> bytes:
        name = (provider_name or settings.DEFAULT_TTS_PROVIDER).lower()
        if name == "elevenlabs":
            return await self.elevenlabs.synthesize(text=text, voice=voice, speed=speed)
        elif name == "sarvam":
            return await self.sarvam.synthesize(text=text, speaker=voice or "shubh")
        else:
            return await self.edge_tts.synthesize(text=text, voice=voice, speed=speed)

    async def synthesize_to_base64(
        self,
        text: str,
        voice: Optional[str] = None,
        speed: float = 1.0,
        provider_name: Optional[str] = None,
    ) -> Dict[str, Any]:
        audio_bytes = await self.synthesize_to_bytes(
            text=text,
            voice=voice,
            speed=speed,
            provider_name=provider_name
        )
        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
        return {
            "audio_base64": audio_b64,
            "format": "audio/mp3",
            "voice": voice or settings.DEFAULT_TTS_VOICE,
            "provider": provider_name or settings.DEFAULT_TTS_PROVIDER,
        }

tts_service = TTSService()
