import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, SystemHealth } from '../types';
import { api } from '../services/api';

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  saveSettingsToBackend: () => Promise<void>;
  health: SystemHealth | null;
  refreshHealth: () => Promise<void>;
  isLoading: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  llmProvider: 'ollama',
  llmModel: 'llama3.2:1b',
  sttProvider: 'faster-whisper',
  ttsProvider: 'edge-tts',
  ttsVoice: 'en-US-JennyNeural',
  ttsSpeed: 1.0,
  groqApiKey: '',
  geminiApiKey: '',
  systemPrompt: 'You are an advanced, empathetic, and highly capable AI assistant. Provide direct, concise, and helpful responses.',
  temperature: 0.7,
  darkMode: true,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('omni_ai_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('omni_ai_settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  useEffect(() => {
    refreshHealth();
  }, []);

  const refreshHealth = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSystemHealth();
      setHealth(data);
    } catch (err) {
      console.warn('[Settings] Health fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettingsToBackend = async () => {
    try {
      await api.updateSettings({
        llm_provider: settings.llmProvider,
        llm_model: settings.llmModel,
        stt_provider: settings.sttProvider,
        tts_provider: settings.ttsProvider,
        tts_voice: settings.ttsVoice,
        tts_speed: settings.ttsSpeed,
        groq_api_key: settings.groqApiKey,
        gemini_api_key: settings.geminiApiKey,
        system_prompt: settings.systemPrompt,
      });
      await refreshHealth();
    } catch (err) {
      console.error('Failed to sync settings with backend:', err);
      throw err;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        saveSettingsToBackend,
        health,
        refreshHealth,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

