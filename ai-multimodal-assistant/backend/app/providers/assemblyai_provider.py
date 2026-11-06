import asyncio
import httpx
from typing import Dict, Any, Optional
from app.config import settings
from app.providers.base_provider import BaseSTTProvider

class AssemblyAIProvider(BaseSTTProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.ASSEMBLYAI_API_KEY
        self.base_url = "https://api.assemblyai.com/v2"

    async def is_available(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def transcribe(
        self,
        audio_bytes: bytes,
        language: Optional[str] = None,
    ) -> Dict[str, Any]:
        if not self.api_key:
            raise ValueError("AssemblyAI API Key is not configured.")

        headers = {"authorization": self.api_key}

        async with httpx.AsyncClient(timeout=60.0) as client:
            # 1. Upload audio
            upload_res = await client.post(
                f"{self.base_url}/upload",
                headers=headers,
                content=audio_bytes
            )
            if upload_res.status_code != 200:
                raise RuntimeError(f"AssemblyAI Upload failed ({upload_res.status_code}): {upload_res.text}")
            
            upload_url = upload_res.json().get("upload_url")

            # 2. Submit transcription job
            transcript_payload = {
                "audio_url": upload_url,
                "punctuate": True,
                "format_text": True,
            }
            if language:
                transcript_payload["language_code"] = language

            submit_res = await client.post(
                f"{self.base_url}/transcript",
                headers=headers,
                json=transcript_payload
            )
            if submit_res.status_code != 200:
                raise RuntimeError(f"AssemblyAI Submit failed ({submit_res.status_code}): {submit_res.text}")

            transcript_id = submit_res.json()["id"]

            # 3. Poll for completion
            for _ in range(30):
                await asyncio.sleep(1.0)
                poll_res = await client.get(
                    f"{self.base_url}/transcript/{transcript_id}",
                    headers=headers
                )
                if poll_res.status_code == 200:
                    data = poll_res.json()
                    status = data.get("status")
                    if status == "completed":
                        return {
                            "text": data.get("text", ""),
                            "language": data.get("language_code", "en"),
                            "confidence": data.get("confidence"),
                            "duration": data.get("audio_duration"),
                            "provider": "assemblyai",
                        }
                    elif status == "error":
                        raise RuntimeError(f"AssemblyAI transcription error: {data.get('error')}")

            raise TimeoutError("AssemblyAI transcription timed out.")

