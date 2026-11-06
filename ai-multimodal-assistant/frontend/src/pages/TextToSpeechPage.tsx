import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Download,
  RotateCcw,
  Sliders,
  Sparkles,
  Loader2,
  CheckCircle,
  FileAudio
} from 'lucide-react';
import { VoiceInfo } from '../types';
import { api } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';

export const TextToSpeechPage: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const [text, setText] = useState(
    'Welcome to the Text-to-Speech laboratory. This speech is generated using free neural voices with zero API key dependencies. You can adjust the speed, select different speakers, and download your audio files.'
  );
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [selectedVoice, setSelectedVoice] = useState(settings.ttsVoice);
  const [speed, setSpeed] = useState(settings.ttsSpeed || 1.0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadVoices();
  }, [settings.ttsProvider]);

  const loadVoices = async () => {
    try {
      const data = await api.getVoices(settings.ttsProvider);
      setVoices(data);
      if (data.length > 0 && !data.some((v) => v.id === selectedVoice)) {
        setSelectedVoice(data[0].id);
      }
    } catch {
      // Fallback
    }
  };

  const handleSynthesize = async () => {
    if (!text.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await api.synthesizeSpeech(text.trim(), {
        voice: selectedVoice,
        speed: speed,
        provider: settings.ttsProvider,
      });

      const url = `data:${res.format};base64,${res.audioBase64}`;
      setAudioUrl(url);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.playbackRate = 1.0;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err: any) {
      setError(err.message || 'Speech synthesis failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `synthesized-speech-${Date.now()}.mp3`;
    a.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 overflow-y-auto">
      {/* Header */}
      <div className="h-14 px-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">Mode 2: Text-to-Speech Lab</h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Neural Audio Engine
        </span>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-6">
        {/* Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          {/* Voice Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Voice Speaker</label>
            <select
              value={selectedVoice}
              onChange={(e) => {
                setSelectedVoice(e.target.value);
                updateSetting('ttsVoice', e.target.value);
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            >
              {voices.length > 0 ? (
                voices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.locale})
                  </option>
                ))
              ) : (
                <option value="en-US-JennyNeural">Jenny (US Female)</option>
              )}
            </select>
          </div>

          {/* Speed Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-400">Speech Rate</label>
              <span className="text-xs font-mono text-indigo-400">{speed.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={speed}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSpeed(val);
                updateSetting('ttsSpeed', val);
              }}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Provider Pill */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">TTS Engine</label>
            <div className="h-9 px-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-300">
              <span className="capitalize">{settings.ttsProvider}</span>
              <span className="text-[10px] text-emerald-400 font-sans">Zero Cost</span>
            </div>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-400 flex items-center justify-between">
            <span>Text to Synthesize</span>
            <span className="text-zinc-500 font-mono text-[11px]">{text.length} characters</span>
          </label>
          <textarea
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text here to convert into spoken audio..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 leading-relaxed resize-none shadow-sm"
          />
        </div>

        {/* Generate Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSynthesize}
            disabled={!text.trim() || isGenerating}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-xs sm:text-sm text-white transition-all shadow-md ${
              isGenerating || !text.trim()
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Synthesizing Audio...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Speech</span>
              </>
            )}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Audio Player Card */}
        {audioUrl && (
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <FileAudio className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-white">Generated Audio Stream</div>
                  <div className="text-[11px] text-zinc-500 font-mono">
                    {selectedVoice} · {speed}x speed
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlayback}
                  className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow-md shadow-indigo-600/30"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <button
                  onClick={handleDownload}
                  className="p-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-300 hover:text-white transition-all"
                  title="Download MP3"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              className="w-full"
              controls
            />
          </div>
        )}
      </div>
    </div>
  );
};

