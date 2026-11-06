import io
import os
import tempfile
from typing import Dict, Any, Optional
from app.config import settings
from app.providers.base_provider import BaseSTTProvider

class FasterWhisperProvider(BaseSTTProvider):
    def __init__(self, model_size: Optional[str] = None):
        self.model_size = model_size or settings.WHISPER_MODEL_SIZE
        self._model = None

    async def is_available(self) -> bool:
        try:
            import faster_whisper
            return True
        except ImportError:
            return False

    def _get_model(self):
        if self._model is None:
            from faster_whisper import WhisperModel
            self._model = WhisperModel(
                self.model_size,
                device=settings.WHISPER_DEVICE,
                compute_type=settings.WHISPER_COMPUTE_TYPE,
                cpu_threads=4,
            )
        return self._model

    async def transcribe(
        self,
        audio_bytes: bytes,
        language: Optional[str] = None,
    ) -> Dict[str, Any]:
        if not await self.is_available():
            raise RuntimeError(
                "Faster-Whisper is not installed. To enable local STT, install it via: "
                "pip install faster-whisper"
            )

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
            tmp_file.write(audio_bytes)
            tmp_path = tmp_file.name

        try:
            model = self._get_model()
            segments, info = model.transcribe(
                tmp_path,
                language=language,
                beam_size=5,
                vad_filter=True,
            )

            full_text = []
            segment_list = []
            for seg in segments:
                full_text.append(seg.text)
                segment_list.append({
                    "start": seg.start,
                    "end": seg.end,
                    "text": seg.text,
                })

            return {
                "text": " ".join(full_text).strip(),
                "language": info.language,
                "duration": info.duration,
                "segments": segment_list,
                "provider": "faster-whisper",
            }
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

