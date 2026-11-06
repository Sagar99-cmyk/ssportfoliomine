import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    # Server
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    # LLM Settings
    DEFAULT_LLM_PROVIDER: str = "groq"
    DEFAULT_LLM_MODEL: str = "llama-3.3-70b-versatile"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    GROQ_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""

    # STT Settings
    DEFAULT_STT_PROVIDER: str = "assemblyai"
    ASSEMBLYAI_API_KEY: str = ""
    WHISPER_MODEL_SIZE: str = "tiny"
    WHISPER_DEVICE: str = "cpu"
    WHISPER_COMPUTE_TYPE: str = "int8"

    # TTS Settings
    DEFAULT_TTS_PROVIDER: str = "elevenlabs"
    DEFAULT_TTS_VOICE: str = "21m00Tcm4TlvDq8ikWAM" # Rachel
    DEFAULT_TTS_SPEED: float = 1.0
    ELEVENLABS_API_KEY: str = ""

    # Sarvam AI Suite
    SARVAM_API_KEY: str = ""

    # Audio Directories
    AUDIO_CACHE_DIR: str = str(BASE_DIR / "temp_audio")
    MAX_AUDIO_UPLOAD_MB: int = 25

    # System Prompt & Model Training Defaults
    DEFAULT_SYSTEM_PROMPT: str = (
        "You are an advanced, empathetic, and highly capable AI assistant. "
        "Provide direct, concise, and helpful responses. Format code blocks with appropriate languages. "
        "Be conversational, articulate, and natural."
    )

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings()

# Ensure temp audio cache directory exists
os.makedirs(settings.AUDIO_CACHE_DIR, exist_ok=True)

