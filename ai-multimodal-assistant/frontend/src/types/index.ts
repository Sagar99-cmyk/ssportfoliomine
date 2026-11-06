export type AppMode = 'chat' | 'tts' | 'stt' | 's2s' | 'settings' | 'about';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
  provider?: string;
  audioUrl?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
  provider: string;
  model: string;
}

export interface VoiceInfo {
  id: string;
  name: string;
  gender: string;
  language: string;
  locale: string;
  provider: string;
}

export interface ProviderStatus {
  id: string;
  name: string;
  type: 'llm' | 'stt' | 'tts';
  status: 'available' | 'offline' | 'requires_key' | 'requires_download';
  description: string;
  is_local: boolean;
  requires_api_key: boolean;
  has_api_key: boolean;
  models: string[];
}

export interface SystemHealth {
  status: string;
  providers: ProviderStatus[];
  hardware: {
    os: string;
    architecture: string;
    cpu: string;
    cores: number;
    ram_gb: number;
    gpu: string;
  };
  default_provider: string;
  default_model: string;
}

export interface AppSettings {
  llmProvider: string;
  llmModel: string;
  sttProvider: string;
  ttsProvider: string;
  ttsVoice: string;
  ttsSpeed: number;
  groqApiKey: string;
  geminiApiKey: string;
  systemPrompt: string;
  temperature: number;
  darkMode: boolean;
}

