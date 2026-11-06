import io
import asyncio
from typing import List, Dict, Any, Optional
from app.providers.base_provider import BaseTTSProvider

class EdgeTTSProvider(BaseTTSProvider):
    def __init__(self):
        self._voices_cache = []

    async def is_available(self) -> bool:
        try:
            import edge_tts
            return True
        except ImportError:
            return False

    async def list_voices(self) -> List[Dict[str, Any]]:
        if self._voices_cache:
            return self._voices_cache

        try:
            import edge_tts
            voices = await edge_tts.list_voices()
            formatted = []
            for v in voices:
                formatted.append({
                    "id": v["ShortName"],
                    "name": v["FriendlyName"],
                    "gender": v["Gender"],
                    "language": v["Locale"].split("-")[0],
                    "locale": v["Locale"],
                    "provider": "edge-tts"
                })
            self._voices_cache = formatted
            return formatted
        except Exception:
            # Fallback curated top voices
            return [
                {"id": "en-US-JennyNeural", "name": "Jenny (US Female)", "gender": "Female", "language": "en", "locale": "en-US", "provider": "edge-tts"},
                {"id": "en-US-GuyNeural", "name": "Guy (US Male)", "gender": "Male", "language": "en", "locale": "en-US", "provider": "edge-tts"},
                {"id": "en-US-AriaNeural", "name": "Aria (US Expressive)", "gender": "Female", "language": "en", "locale": "en-US", "provider": "edge-tts"},
                {"id": "en-GB-SoniaNeural", "name": "Sonia (UK Female)", "gender": "Female", "language": "en", "locale": "en-GB", "provider": "edge-tts"},
                {"id": "en-IN-NeerjaNeural", "name": "Neerja (India Female)", "gender": "Female", "language": "en", "locale": "en-IN", "provider": "edge-tts"},
                {"id": "hi-IN-SwaraNeural", "name": "Swara (Hindi Female)", "gender": "Female", "language": "hi", "locale": "hi-IN", "provider": "edge-tts"},
            ]

    async def synthesize(
        self,
        text: str,
        voice: Optional[str] = None,
        speed: float = 1.0,
    ) -> bytes:
        import edge_tts

        selected_voice = voice or "en-US-JennyNeural"
        
        # Calculate rate offset percentage
        rate_percent = int((speed - 1.0) * 100)
        rate_str = f"{'+' if rate_percent >= 0 else ''}{rate_percent}%"

        communicate = edge_tts.Communicate(
            text=text,
            voice=selected_voice,
            rate=rate_str,
        )

        audio_buffer = bytearray()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_buffer.extend(chunk["data"])

        return bytes(audio_buffer)

