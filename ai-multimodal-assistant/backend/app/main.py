import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import chat, speech_to_text, text_to_speech, speech_to_speech, settings as settings_api

app = FastAPI(
    title="Free AI Multimodal Chatbot & Voice Assistant",
    description="Production-grade, zero-cost AI assistant with T2T, TTS, STT, and S2S capabilities.",
    version="1.0.0",
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(chat.router)
app.include_router(speech_to_text.router)
app.include_router(text_to_speech.router)
app.include_router(speech_to_speech.router)
app.include_router(settings_api.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Free AI Multimodal Chatbot & Voice Assistant API",
        "version": "1.0.0",
        "capabilities": [
            "Text-to-Text (T2T)",
            "Text-to-Speech (TTS)",
            "Speech-to-Text (STT)",
            "Speech-to-Speech (S2S) via WebSockets"
        ],
        "default_llm_provider": settings.DEFAULT_LLM_PROVIDER,
        "default_tts_provider": settings.DEFAULT_TTS_PROVIDER,
        "docs_url": "/docs",
    }

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)

