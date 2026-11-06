import httpx
from typing import List, Dict, Any, Optional
from app.config import settings
from app.providers.base_provider import BaseTTSProvider

class ElevenLabsProvider(BaseTTSProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.ELEVENLABS_API_KEY
        self.base_url = "https://api.elevenlabs.io/v1"
        self._voices_cache = []

    async def is_available(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def list_voices(self) -> List[Dict[str, Any]]:
        if self._voices_cache:
            return self._voices_cache

        if not self.api_key:
            return [
                {"id": "21m00Tcm4TlvDq8ikWAM", "name": "Rachel (Calm & Natural)", "gender": "Female", "language": "en", "locale": "en-US", "provider": "elevenlabs"},
                {"id": "AZnzlk1XvdvUeBnXmlld", "name": "Domi (Confident)", "gender": "Female", "language": "en", "locale": "en-US", "provider": "elevenlabs"},
                {"id": "EXAVITQu4vr4xnSDxMaL", "name": "Bella (Warm & Expressive)", "gender": "Female", "language": "en", "locale": "en-US", "provider": "elevenlabs"},
                {"id": "ErXwobaYiN019PkySvjV", "name": "Antoni (Deep & Professional)", "gender": "Male", "language": "en", "locale": "en-US", "provider": "elevenlabs"},
                {"id": "VR6AewLTigWG4xSOukaG", "name": "Arnold (Crisp & Clear)", "gender": "Male", "language": "en", "locale": "en-US", "provider": "elevenlabs"},
            ]

        try:
            headers = {"xi-api-key": self.api_key}
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(f"{self.base_url}/voices", headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    voices = []
                    for v in data.get("voices", []):
                        voices.append({
                            "id": v["voice_id"],
                            "name": v["name"],
                            "gender": v.get("labels", {}).get("gender", "Female"),
                            "language": v.get("labels", {}).get("language", "en"),
                            "locale": v.get("labels", {}).get("accent", "en-US"),
                            "provider": "elevenlabs",
                        })
                    self._voices_cache = voices
                    return voices
        except Exception:
            pass

        return [
            {"id": "21m00Tcm4TlvDq8ikWAM", "name": "Rachel (Calm & Natural)", "gender": "Female", "language": "en", "locale": "en-US", "provider": "elevenlabs"},
            {"id": "ErXwobaYiN019PkySvjV", "name": "Antoni (Deep & Professional)", "gender": "Male", "language": "en", "locale": "en-US", "provider": "elevenlabs"},
        ]

    async def synthesize(
        self,
        text: str,
        voice: Optional[str] = None,
        speed: float = 1.0,
    ) -> bytes:
        if not self.api_key:
            raise ValueError("ElevenLabs API Key is not configured.")

        voice_id = voice or "21m00Tcm4TlvDq8ikWAM"
        headers = {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        }
        payload = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75,
            }
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(
                f"{self.base_url}/text-to-speech/{voice_id}",
                headers=headers,
                json=payload
            )
            if res.status_code != 200:
                raise RuntimeError(f"ElevenLabs TTS error ({res.status_code}): {res.text}")
            return res.content

