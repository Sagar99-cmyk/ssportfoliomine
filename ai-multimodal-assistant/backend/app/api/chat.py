import uuid
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm_service import llm_service
from app.config import settings

router = APIRouter(prefix="/api/chat", tags=["Text-to-Text Chat"])

@router.post("", response_model=ChatResponse)
async def chat_completion(request: ChatRequest):
    try:
        messages_dicts = [{"role": m.role, "content": m.content} for m in request.messages]
        result = await llm_service.generate_response(
            messages=messages_dicts,
            provider_name=request.provider,
            model=request.model,
            system_prompt=request.system_prompt or settings.DEFAULT_SYSTEM_PROMPT,
            temperature=request.temperature,
            max_tokens=request.max_tokens or 1024,
        )

        return ChatResponse(
            id=f"chatcmpl-{uuid.uuid4().hex[:12]}",
            role="assistant",
            content=result["content"],
            provider=result["provider"],
            model=result["model"],
            finish_reason="stop",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stream")
async def chat_streaming(request: ChatRequest):
    try:
        messages_dicts = [{"role": m.role, "content": m.content} for m in request.messages]
        
        async def event_generator():
            generator = llm_service.stream_response(
                messages=messages_dicts,
                provider_name=request.provider,
                model=request.model,
                system_prompt=request.system_prompt or settings.DEFAULT_SYSTEM_PROMPT,
                temperature=request.temperature,
                max_tokens=request.max_tokens or 1024,
            )
            async for chunk in generator:
                yield f"data: {chunk}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

