export interface VoiceEventCallbacks {
  onReady?: (msg: string) => void;
  onTranscript?: (role: string, text: string) => void;
  onTextChunk?: (delta: string) => void;
  onAudioChunk?: (audioBase64: string, text: string) => void;
  onTurnComplete?: (fullText: string) => void;
  onInterrupted?: () => void;
  onError?: (err: string) => void;
}

export class VoiceWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private callbacks: VoiceEventCallbacks = {};
  private reconnectTimeout: any = null;

  constructor() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    this.url = `${protocol}//${host}/api/ws/voice`;
  }

  connect(callbacks: VoiceEventCallbacks) {
    this.callbacks = callbacks;
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[VoiceWS] Connected to Voice Server');
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          switch (payload.type) {
            case 'ready':
              this.callbacks.onReady?.(payload.message);
              break;
            case 'transcript':
              this.callbacks.onTranscript?.(payload.role, payload.text);
              break;
            case 'text_chunk':
              this.callbacks.onTextChunk?.(payload.delta);
              break;
            case 'audio_chunk':
              this.callbacks.onAudioChunk?.(payload.audio, payload.text);
              break;
            case 'turn_complete':
              this.callbacks.onTurnComplete?.(payload.full_text);
              break;
            case 'interrupted':
              this.callbacks.onInterrupted?.();
              break;
            case 'error':
              this.callbacks.onError?.(payload.message);
              break;
          }
        } catch (e) {
          console.error('[VoiceWS] Error parsing frame:', e);
        }
      };

      this.ws.onerror = (e) => {
        this.callbacks.onError?.('WebSocket communication error');
      };

      this.ws.onclose = () => {
        console.log('[VoiceWS] Disconnected');
      };
    } catch (err: any) {
      this.callbacks.onError?.(err.message || 'Connection failed');
    }
  }

  sendAudio(audioBase64: string, options?: { systemPrompt?: string; voice?: string; speed?: number }) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'user_audio',
        audio: audioBase64,
        system_prompt: options?.systemPrompt,
        voice: options?.voice,
        speed: options?.speed,
      }));
    }
  }

  interrupt() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'interrupt' }));
    }
  }

  reset() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'reset' }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

