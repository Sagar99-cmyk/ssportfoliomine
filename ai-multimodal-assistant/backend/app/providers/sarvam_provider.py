import base64
import httpx
from typing import AsyncGenerator, List, Dict, Any, Optional
from app.config import settings

class SarvamProvider:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.SARVAM_API_KEY
        self.base_url = "https://api.sarvam.ai"

    async def is_available(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def chat_generate(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = "sarvam-2b",
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        if not self.api_key:
            raise ValueError("Sarvam API Key is not configured.")

        payload_messages = []
        if system_prompt:
            payload_messages.append({"role": "system", "content": system_prompt})
        payload_messages.extend(messages)

        headers = {
            "api-subscription-key": self.api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "model": model or "sarvam-2b",
            "messages": payload_messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
            if res.status_code != 200:
                raise RuntimeError(f"Sarvam Chat error ({res.status_code}): {res.text}")
            data = res.json()
            return data["choices"][0]["message"]["content"]

    async def synthesize(
        self,
        text: str,
        target_language_code: str = "hi-IN",
        speaker: str = "shubh",
    ) -> bytes:
        if not self.api_key:
            raise ValueError("Sarvam API Key is not configured.")

        headers = {
            "api-subscription-key": self.api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "inputs": [text],
            "target_language_code": target_language_code,
            "speaker": speaker,
            "pitch": 0,
            "pace": 1.0,
            "loudness": 1.5,
            "speech_sample_rate": 22050,
            "enable_preprocessing": True,
            "model": "bulbul:v1"
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(f"{self.base_url}/text-to-speech", headers=headers, json=payload)
            if res.status_code != 200:
                raise RuntimeError(f"Sarvam TTS error ({res.status_code}): {res.text}")
            data = res.json()
            audios = data.get("audios", [])
            if not audios:
                raise RuntimeError("Sarvam TTS returned no audio data.")
            return base64.b64decode(audios[0])

    async def transcribe(
        self,
        audio_bytes: bytes,
        language_code: str = "hi-IN",
    ) -> Dict[str, Any]:
        if not self.api_key:
            raise ValueError("Sarvam API Key is not configured.")

        headers = {"api-subscription-key": self.api_key}
        files = {"file": ("audio.wav", audio_bytes, "audio/wav")}
        data = {
            "model": "saaras:v1",
            "language_code": language_code,
            "with_diarization": "false"
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(
                f"{self.base_url}/speech-to-text",
                headers=headers,
                files=files,
                data=data
            )
            if res.status_code != 200:
                raise RuntimeError(f"Sarvam STT error ({res.status_code}): {res.text}")
            res_data = res.json()
            return {
                "text": res_data.get("transcript", ""),
                "language": res_data.get("language_code", language_code),
                "provider": "sarvam",
            }

