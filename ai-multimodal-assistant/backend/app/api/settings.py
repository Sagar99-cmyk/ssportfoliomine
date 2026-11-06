import platform
import os
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.schemas.settings import SystemHealthResponse, SettingsUpdateRequest, ProviderStatus
from app.services.llm_service import llm_service
from app.services.tts_service import tts_service
from app.services.stt_service import stt_service
from app.config import settings

router = APIRouter(prefix="/api/settings", tags=["Settings & Model Configuration"])

@router.get("/health", response_model=SystemHealthResponse)
async def get_system_health():
    llm_providers = await llm_service.get_available_providers()
    tts_providers = await tts_service.get_available_providers()
    stt_providers = await stt_service.get_available_providers()

    all_providers = []
    for p in llm_providers + tts_providers + stt_providers:
        all_providers.append(ProviderStatus(
            id=p["id"],
            name=p["name"],
            type=p["type"],
            status=p["status"],
            description=p["description"],
            is_local=p["is_local"],
            requires_api_key=p["requires_api_key"],
            has_api_key=p["has_api_key"],
            models=p["models"],
        ))

    hardware_info = {
        "os": f"{platform.system()} {platform.release()}",
        "architecture": platform.machine(),
        "cpu": platform.processor() or "Intel64 Family 6 (12 vCPUs)",
        "cores": os.cpu_count() or 4,
        "ram_gb": 8.0,
        "gpu": "CPU Inference (Quantized INT8 / Free-Tier Cloud Optimized)",
    }

    return SystemHealthResponse(
        status="healthy",
        providers=all_providers,
        hardware=hardware_info,
        default_provider=settings.DEFAULT_LLM_PROVIDER,
        default_model=settings.DEFAULT_LLM_MODEL,
    )

@router.post("/update")
async def update_settings(update: SettingsUpdateRequest):
    if update.llm_provider:
        settings.DEFAULT_LLM_PROVIDER = update.llm_provider
    if update.llm_model:
        settings.DEFAULT_LLM_MODEL = update.llm_model
    if update.stt_provider:
        settings.DEFAULT_STT_PROVIDER = update.stt_provider
    if update.tts_provider:
        settings.DEFAULT_TTS_PROVIDER = update.tts_provider
    if update.tts_voice:
        settings.DEFAULT_TTS_VOICE = update.tts_voice
    if update.tts_speed:
        settings.DEFAULT_TTS_SPEED = update.tts_speed
    if update.groq_api_key is not None:
        settings.GROQ_API_KEY = update.groq_api_key
        llm_service.groq.api_key = update.groq_api_key
    if update.gemini_api_key is not None:
        settings.GEMINI_API_KEY = update.gemini_api_key
        llm_service.gemini.api_key = update.gemini_api_key
    if update.openrouter_api_key is not None:
        settings.OPENROUTER_API_KEY = update.openrouter_api_key
        llm_service.openrouter.api_key = update.openrouter_api_key
    if update.assemblyai_api_key is not None:
        settings.ASSEMBLYAI_API_KEY = update.assemblyai_api_key
        stt_service.assemblyai.api_key = update.assemblyai_api_key
    if update.elevenlabs_api_key is not None:
        settings.ELEVENLABS_API_KEY = update.elevenlabs_api_key
        tts_service.elevenlabs.api_key = update.elevenlabs_api_key
    if update.sarvam_api_key is not None:
        settings.SARVAM_API_KEY = update.sarvam_api_key
        llm_service.sarvam.api_key = update.sarvam_api_key
        tts_service.sarvam.api_key = update.sarvam_api_key
        stt_service.sarvam.api_key = update.sarvam_api_key
    if update.system_prompt:
        settings.DEFAULT_SYSTEM_PROMPT = update.system_prompt

    return {
        "success": True,
        "message": "Configuration updated successfully.",
        "active_settings": {
            "llm_provider": settings.DEFAULT_LLM_PROVIDER,
            "llm_model": settings.DEFAULT_LLM_MODEL,
            "stt_provider": settings.DEFAULT_STT_PROVIDER,
            "tts_provider": settings.DEFAULT_TTS_PROVIDER,
            "tts_voice": settings.DEFAULT_TTS_VOICE,
            "has_groq_key": bool(settings.GROQ_API_KEY),
            "has_gemini_key": bool(settings.GEMINI_API_KEY),
            "has_openrouter_key": bool(settings.OPENROUTER_API_KEY),
            "has_assemblyai_key": bool(settings.ASSEMBLYAI_API_KEY),
            "has_elevenlabs_key": bool(settings.ELEVENLABS_API_KEY),
            "has_sarvam_key": bool(settings.SARVAM_API_KEY),
            "system_prompt": settings.DEFAULT_SYSTEM_PROMPT,
        }
    }

