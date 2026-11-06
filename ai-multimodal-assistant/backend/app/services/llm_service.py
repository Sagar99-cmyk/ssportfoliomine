from typing import AsyncGenerator, List, Dict, Any, Optional
from app.config import settings
from app.providers.ollama_provider import OllamaProvider
from app.providers.groq_provider import GroqProvider
from app.providers.gemini_provider import GeminiProvider
from app.providers.openrouter_provider import OpenRouterProvider
from app.providers.sarvam_provider import SarvamProvider

class LLMService:
    def __init__(self):
        self.ollama = OllamaProvider()
        self.groq = GroqProvider()
        self.gemini = GeminiProvider()
        self.openrouter = OpenRouterProvider()
        self.sarvam = SarvamProvider()

    def get_provider(self, provider_name: Optional[str] = None):
        name = (provider_name or settings.DEFAULT_LLM_PROVIDER).lower()
        if name == "groq":
            return self.groq
        elif name == "gemini":
            return self.gemini
        elif name == "openrouter":
            return self.openrouter
        elif name == "sarvam":
            return self.sarvam
        elif name == "ollama":
            return self.ollama
        else:
            return self.groq if settings.GROQ_API_KEY else self.ollama

    async def get_available_providers(self) -> List[Dict[str, Any]]:
        ollama_ok = await self.ollama.is_available()
        groq_ok = await self.groq.is_available()
        gemini_ok = await self.gemini.is_available()
        openrouter_ok = await self.openrouter.is_available()
        sarvam_ok = await self.sarvam.is_available()

        return [
            {
                "id": "groq",
                "name": "Groq Cloud (Fast Free Tier)",
                "type": "llm",
                "status": "available" if groq_ok else "requires_key",
                "description": "Ultra-fast LPU inference (Llama 3.3 70B, Llama 3.1 8B).",
                "is_local": False,
                "requires_api_key": True,
                "has_api_key": groq_ok,
                "models": await self.groq.list_models()
            },
            {
                "id": "openrouter",
                "name": "OpenRouter (DeepSeek R1 / Claude / GPT)",
                "type": "llm",
                "status": "available" if openrouter_ok else "requires_key",
                "description": "Universal LLM gateway (DeepSeek R1, Claude 3.5, GPT-4o).",
                "is_local": False,
                "requires_api_key": True,
                "has_api_key": openrouter_ok,
                "models": await self.openrouter.list_models()
            },
            {
                "id": "gemini",
                "name": "Google Gemini (Flash 2.0)",
                "type": "llm",
                "status": "available" if gemini_ok else "requires_key",
                "description": "Multimodal reasoning with free tier (Flash 2.0 / 1.5).",
                "is_local": False,
                "requires_api_key": True,
                "has_api_key": gemini_ok,
                "models": await self.gemini.list_models()
            },
            {
                "id": "ollama",
                "name": "Ollama (Local & Offline)",
                "type": "llm",
                "status": "available" if ollama_ok else "offline",
                "description": "100% private, free local inference running on your CPU.",
                "is_local": True,
                "requires_api_key": False,
                "has_api_key": True,
                "models": await self.ollama.list_models()
            },
            {
                "id": "sarvam",
                "name": "Sarvam AI (Indic Language LLM)",
                "type": "llm",
                "status": "available" if sarvam_ok else "requires_key",
                "description": "Native conversational LLM for Indian languages.",
                "is_local": False,
                "requires_api_key": True,
                "has_api_key": sarvam_ok,
                "models": ["sarvam-2b"]
            }
        ]

    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        provider_name: Optional[str] = None,
        model: Optional[str] = None,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> Dict[str, Any]:
        provider = self.get_provider(provider_name)
        active_name = provider_name or settings.DEFAULT_LLM_PROVIDER
        sys_prompt = system_prompt or settings.DEFAULT_SYSTEM_PROMPT

        if active_name == "sarvam":
            content = await self.sarvam.chat_generate(
                messages=messages,
                model=model,
                system_prompt=sys_prompt,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return {"content": content, "provider": "sarvam", "model": model or "sarvam-2b"}

        content = await provider.generate_response(
            messages=messages,
            model=model,
            system_prompt=sys_prompt,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return {
            "content": content,
            "provider": active_name,
            "model": model or settings.DEFAULT_LLM_MODEL,
        }

    async def stream_response(
        self,
        messages: List[Dict[str, str]],
        provider_name: Optional[str] = None,
        model: Optional[str] = None,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> AsyncGenerator[str, None]:
        provider = self.get_provider(provider_name)
        active_name = provider_name or settings.DEFAULT_LLM_PROVIDER
        sys_prompt = system_prompt or settings.DEFAULT_SYSTEM_PROMPT

        if active_name == "sarvam":
            full = await self.sarvam.chat_generate(
                messages=messages,
                model=model,
                system_prompt=sys_prompt,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            yield full
            return

        async for chunk in provider.stream_response(
            messages=messages,
            model=model,
            system_prompt=sys_prompt,
            temperature=temperature,
            max_tokens=max_tokens,
        ):
            yield chunk

llm_service = LLMService()
