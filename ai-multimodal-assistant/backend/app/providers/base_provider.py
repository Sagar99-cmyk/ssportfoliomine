from abc import ABC, abstractmethod
from typing import AsyncGenerator, List, Dict, Any, Optional

class BaseLLMProvider(ABC):
    @abstractmethod
    async def is_available(self) -> bool:
        """Check if provider is online and ready."""
        pass

    @abstractmethod
    async def list_models(self) -> List[str]:
        """Return available models."""
        pass

    @abstractmethod
    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        """Generate complete text response."""
        pass

    @abstractmethod
    async def stream_response(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> AsyncGenerator[str, None]:
        """Stream chunks of text response."""
        pass

class BaseTTSProvider(ABC):
    @abstractmethod
    async def is_available(self) -> bool:
        pass

    @abstractmethod
    async def list_voices(self) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    async def synthesize(
        self,
        text: str,
        voice: Optional[str] = None,
        speed: float = 1.0,
    ) -> bytes:
        pass

class BaseSTTProvider(ABC):
    @abstractmethod
    async def is_available(self) -> bool:
        pass

    @abstractmethod
    async def transcribe(
        self,
        audio_bytes: bytes,
        language: Optional[str] = None,
    ) -> Dict[str, Any]:
        pass

