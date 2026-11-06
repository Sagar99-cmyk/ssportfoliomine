import { ChatMessage, SystemHealth, VoiceInfo } from '../types';

const API_BASE = '/api';

class ApiService {
  async getSystemHealth(): Promise<SystemHealth> {
    const res = await fetch(`${API_BASE}/settings/health`);
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
  }

  async updateSettings(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/settings/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  }

  // Mode 1: Text-to-Text Chat
  async sendChatMessage(
    messages: { role: string; content: string }[],
    options?: {
      provider?: string;
      model?: string;
      systemPrompt?: string;
      temperature?: number;
    }
  ): Promise<{ content: string; provider: string; model: string }> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        provider: options?.provider,
        model: options?.model,
        system_prompt: options?.systemPrompt,
        temperature: options?.temperature ?? 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Chat request failed' }));
      throw new Error(err.detail || 'Chat request failed');
    }

    return res.json();
  }

  async streamChatMessage(
    messages: { role: string; content: string }[],
    options: {
      provider?: string;
      model?: string;
      systemPrompt?: string;
      temperature?: number;
      onChunk: (chunk: string) => void;
      onDone: () => void;
      onError: (err: Error) => void;
      signal?: AbortSignal;
    }
  ): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          provider: options.provider,
          model: options.model,
          system_prompt: options.systemPrompt,
          temperature: options.temperature ?? 0.7,
        }),
        signal: options.signal,
      });

      if (!res.ok) {
        throw new Error(`Streaming failed (${res.status})`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Readable stream not supported');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              options.onDone();
              return;
            }
            options.onChunk(data);
          }
        }
      }
      options.onDone();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        options.onDone();
      } else {
        options.onError(err);
      }
    }
  }

  // Mode 2: Text-to-Speech
  async synthesizeSpeech(
    text: string,
    options?: { voice?: string; speed?: number; provider?: string }
  ): Promise<{ audioBase64: string; format: string; voice: string }> {
    const res = await fetch(`${API_BASE}/tts/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice: options?.voice,
        speed: options?.speed ?? 1.0,
        provider: options?.provider ?? 'edge-tts',
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'TTS request failed' }));
      throw new Error(err.detail || 'TTS request failed');
    }

    const data = await res.json();
    return {
      audioBase64: data.audio_base64,
      format: data.format,
      voice: data.voice,
    };
  }

  async getVoices(provider?: string): Promise<VoiceInfo[]> {
    const query = provider ? `?provider=${encodeURIComponent(provider)}` : '';
    const res = await fetch(`${API_BASE}/tts/voices${query}`);
    if (!res.ok) throw new Error('Failed to fetch voices');
    return res.json();
  }

  // Mode 3: Speech-to-Text
  async transcribeAudio(
    audioBlob: Blob,
    options?: { language?: string; provider?: string }
  ): Promise<{ text: string; language?: string; duration?: number }> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    if (options?.language) formData.append('language', options.language);
    if (options?.provider) formData.append('provider', options.provider);

    const res = await fetch(`${API_BASE}/stt/transcribe`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Transcription failed' }));
      throw new Error(err.detail || 'Transcription failed');
    }

    return res.json();
  }
}

export const api = new ApiService();

