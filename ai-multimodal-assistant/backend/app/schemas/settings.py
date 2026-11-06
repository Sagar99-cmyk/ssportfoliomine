from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class ProviderStatus(BaseModel):
    id: str
    name: str
    type: str # "llm", "stt", "tts"
    status: str # "available", "offline", "requires_key", "requires_download"
    description: str
    is_local: bool
    requires_api_key: bool
    has_api_key: bool
    models: List[str]

class SystemHealthResponse(BaseModel):
    status: str
    providers: List[ProviderStatus]
    hardware: Dict[str, Any]
    default_provider: str
    default_model: str

class SettingsUpdateRequest(BaseModel):
    llm_provider: Optional[str] = None
    llm_model: Optional[str] = None
    stt_provider: Optional[str] = None
    tts_provider: Optional[str] = None
    tts_voice: Optional[str] = None
    tts_speed: Optional[float] = None
    groq_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None
    openrouter_api_key: Optional[str] = None
    assemblyai_api_key: Optional[str] = None
    elevenlabs_api_key: Optional[str] = None
    sarvam_api_key: Optional[str] = None
    system_prompt: Optional[str] = None

