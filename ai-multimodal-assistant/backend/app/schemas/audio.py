from typing import Optional, List
from pydantic import BaseModel, Field

class SynthesizeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)
    voice: Optional[str] = "en-US-JennyNeural"
    speed: Optional[float] = Field(default=1.0, ge=0.5, le=2.0)
    pitch: Optional[str] = "+0Hz"
    provider: Optional[str] = "edge-tts"

class SynthesizeResponse(BaseModel):
    audio_base64: str
    format: str = "audio/mp3"
    duration_seconds: Optional[float] = None
    voice: str
    provider: str

class TranscribeResponse(BaseModel):
    text: str
    language: Optional[str] = "en"
    duration: Optional[float] = None
    segments: Optional[List[dict]] = None
    provider: str

class VoiceInfo(BaseModel):
    id: str
    name: str
    gender: str
    language: str
    locale: str
    provider: str

