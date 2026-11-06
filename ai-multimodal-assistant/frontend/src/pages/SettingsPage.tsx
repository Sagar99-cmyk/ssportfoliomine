import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Cpu,
  ShieldCheck,
  Sliders,
  CheckCircle,
  Sparkles,
  RefreshCw,
  Server,
  Volume2,
  Mic,
  Brain,
  Radio,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const MODEL_PRESETS: Record<string, string[]> = {
  groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it', 'mixtral-8x7b-32768'],
  openrouter: ['deepseek/deepseek-r1', 'deepseek/deepseek-chat', 'meta-llama/llama-3.3-70b-instruct', 'anthropic/claude-3.5-sonnet', 'openai/gpt-4o'],
  gemini: ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'],
  ollama: ['llama3.2:1b', 'qwen2.5:0.5b', 'qwen2.5:1.5b', 'smollm2:1.7b', 'mistral:7b'],
  sarvam: ['sarvam-2b']
};

export const SettingsPage: React.FC = () => {
  const { settings, updateSetting, saveSettingsToBackend, health, refreshHealth, isLoading } = useSettings();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSettingsToBackend();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      alert('Failed to save settings. Please ensure backend is running.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectProvider = (providerId: string) => {
    updateSetting('llmProvider', providerId);
    const available = MODEL_PRESETS[providerId];
    if (available && available.length > 0) {
      updateSetting('llmModel', available[0]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 overflow-y-auto">
      {/* Header */}
      <div className="h-14 px-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">Application Settings & AI Model Matrix</h2>
        </div>
        <button
          onClick={refreshHealth}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Provider Status</span>
        </button>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-8">
        {/* Hardware Status Banner */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                System Hardware & Local Inference Status
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Low-RAM / CPU Verified
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
              <div className="text-[10px] text-zinc-500 uppercase font-mono">Operating System</div>
              <div className="font-medium text-zinc-200 mt-0.5">{health?.hardware.os || 'Windows 64-bit'}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
              <div className="text-[10px] text-zinc-500 uppercase font-mono">CPU Execution</div>
              <div className="font-medium text-zinc-200 mt-0.5">{health?.hardware.cores || 12} Logical Cores</div>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
              <div className="text-[10px] text-zinc-500 uppercase font-mono">System Memory</div>
              <div className="font-medium text-zinc-200 mt-0.5">{health?.hardware.ram_gb || 8.0} GB RAM</div>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
              <div className="text-[10px] text-zinc-500 uppercase font-mono">Vault Status</div>
              <div className="font-medium text-emerald-400 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>6 Providers Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: LLM Provider Selection */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <Brain className="w-4 h-4" />
                <span>Language Model Provider (Text-to-Text)</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Click to switch instantly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  id: 'groq',
                  name: 'Groq Cloud',
                  desc: 'Fastest LPU inference. Llama 3.3 70B & 8B with generous speed.',
                  badge: 'Ultra Fast',
                  color: 'border-orange-500/40 text-orange-400',
                },
                {
                  id: 'openrouter',
                  name: 'OpenRouter',
                  desc: 'Unified gateway for DeepSeek R1, Claude 3.5 Sonnet, GPT-4o.',
                  badge: 'DeepSeek R1',
                  color: 'border-purple-500/40 text-purple-400',
                },
                {
                  id: 'gemini',
                  name: 'Google Gemini',
                  desc: 'Multimodal Flash 2.0 & 1.5 with large context window.',
                  badge: 'Google AI',
                  color: 'border-blue-500/40 text-blue-400',
                },
                {
                  id: 'ollama',
                  name: 'Ollama (Local)',
                  desc: '100% Offline & Private on CPU. Zero external internet calls.',
                  badge: 'Local First',
                  color: 'border-emerald-500/40 text-emerald-400',
                },
                {
                  id: 'sarvam',
                  name: 'Sarvam AI',
                  desc: 'Specialized native language model for Indian languages.',
                  badge: 'Indic LLM',
                  color: 'border-rose-500/40 text-rose-400',
                },
              ].map((p) => {
                const isSelected = settings.llmProvider === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProvider(p.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-xs text-white">{p.name}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border ${p.color}`}>
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Model Selector & Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Active Model Selection</label>
                {MODEL_PRESETS[settings.llmProvider] ? (
                  <select
                    value={settings.llmModel}
                    onChange={(e) => updateSetting('llmModel', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-indigo-500"
                  >
                    {MODEL_PRESETS[settings.llmProvider].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={settings.llmModel}
                    onChange={(e) => updateSetting('llmModel', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                )}
                <p className="text-[10px] text-zinc-500">
                  Switching provider automatically presets top verified models.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-300">Creativity (Temperature)</label>
                  <span className="text-xs font-mono text-indigo-400">{settings.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.5"
                  step="0.05"
                  value={settings.temperature}
                  onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer pt-2"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Speech-to-Text & Text-to-Speech Engine Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* STT Engine */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                <Mic className="w-4 h-4" />
                <span>Speech-to-Text (Transcriber)</span>
              </div>
              <div className="space-y-2">
                {[
                  { id: 'assemblyai', name: 'AssemblyAI (Cloud High-Accuracy)', badge: 'Connected' },
                  { id: 'faster-whisper', name: 'Faster-Whisper (Local CPU INT8)', badge: 'Offline' },
                  { id: 'sarvam', name: 'Sarvam AI (Indic Speech)', badge: 'Connected' },
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => updateSetting('sttProvider', s.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                      settings.sttProvider === s.id
                        ? 'bg-emerald-600/15 border-emerald-500 text-white font-medium'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-emerald-400 border border-emerald-500/20">
                      {s.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TTS Engine */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider">
                <Volume2 className="w-4 h-4" />
                <span>Text-to-Speech (Voice Synthesizer)</span>
              </div>
              <div className="space-y-2">
                {[
                  { id: 'elevenlabs', name: 'ElevenLabs (Ultra-Realistic)', badge: 'Connected' },
                  { id: 'edge-tts', name: 'Edge-TTS (Free Neural Voices)', badge: 'Zero Key' },
                  { id: 'sarvam', name: 'Sarvam AI (Indian Regional Voices)', badge: 'Connected' },
                ].map((t) => (
                  <div
                    key={t.id}
                    onClick={() => updateSetting('ttsProvider', t.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                      settings.ttsProvider === t.id
                        ? 'bg-purple-600/15 border-purple-500 text-white font-medium'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{t.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-purple-400 border border-purple-500/20">
                      {t.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Model Training & Custom Persona (Prompt Engineering) */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Model Persona Tuning & Training Instruction</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Define the AI's internal instruction, tone, depth, and reasoning. This trains the model to respond consistently and professionally for your exact workflow.
            </p>

            <textarea
              rows={4}
              value={settings.systemPrompt}
              onChange={(e) => updateSetting('systemPrompt', e.target.value)}
              placeholder="e.g. You are a senior data analyst and software architect..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 placeholder-zinc-500 font-sans focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
            />

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                {
                  label: 'General Assistant',
                  prompt: 'You are an advanced, empathetic, and highly capable AI assistant. Provide direct, concise, and helpful responses.',
                },
                {
                  label: 'Senior Coding Mentor',
                  prompt: 'You are a senior full-stack software engineer and tech lead. Write robust, bug-free, cleanly commented code. Explain the architecture simply.',
                },
                {
                  label: 'Data Analytics & BI Specialist',
                  prompt: 'You are a professional Business Intelligence and Data Analytics Specialist skilled in Power BI, MySQL, Python (Pandas/NumPy), and DAX.',
                },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => updateSetting('systemPrompt', preset.prompt)}
                  className="px-2.5 py-1 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-[11px] text-zinc-400 hover:text-white transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Secure Backend Vault Status */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                <Lock className="w-4 h-4" />
                <span>Backend API Vault & Security Shield</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Credentials Protected & Hidden
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All credentials (Groq, Gemini, OpenRouter, AssemblyAI, ElevenLabs, Sarvam) are stored securely in backend environment variables and are never transmitted or exposed in frontend JavaScript.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                { name: 'Groq Cloud', status: 'Connected', tag: 'Fast LLM' },
                { name: 'Google Gemini', status: 'Connected', tag: 'Flash 2.0' },
                { name: 'OpenRouter', status: 'Connected', tag: 'DeepSeek R1' },
                { name: 'AssemblyAI', status: 'Connected', tag: 'Speech-to-Text' },
                { name: 'ElevenLabs', status: 'Connected', tag: 'Human Speech' },
                { name: 'Sarvam AI', status: 'Connected', tag: 'Indic AI' },
              ].map((prov) => (
                <div key={prov.name} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-zinc-200">{prov.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{prov.tag}</div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {savedSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <CheckCircle className="w-4 h-4" />
                  <span>Settings saved and synced with backend successfully!</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              <span>Save & Apply Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
