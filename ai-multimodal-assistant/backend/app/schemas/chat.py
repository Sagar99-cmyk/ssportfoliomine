from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    provider: Optional[str] = None
    model: Optional[str] = None
    system_prompt: Optional[str] = None
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(default=1024, ge=1, le=8192)
    stream: bool = False

class ChatResponse(BaseModel):
    id: str
    role: str = "assistant"
    content: str
    provider: str
    model: str
    finish_reason: Optional[str] = "stop"
    usage: Optional[dict] = None

class StreamChunk(BaseModel):
    id: str
    delta: str
    finish_reason: Optional[str] = None

