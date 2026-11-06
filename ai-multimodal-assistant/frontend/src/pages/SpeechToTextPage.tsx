import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Upload,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Loader2,
  FileAudio,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';

export const SpeechToTextPage: React.FC = () => {
  const { settings } = useSettings();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    setError(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const localUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(localUrl);
        await performTranscription(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setError(
        'Microphone access was denied or not found. Please check your browser microphone permissions.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const performTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    setError(null);
    try {
      const res = await api.transcribeAudio(blob, {
        provider: settings.sttProvider,
      });
      setTranscript(res.text || 'No speech detected in audio recording.');
    } catch (err: any) {
      setError(err.message || 'Transcription failed');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const localUrl = URL.createObjectURL(file);
    setAudioUrl(localUrl);
    await performTranscription(file);
  };

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!transcript) return;
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${Date.now()}.txt`;
    a.click();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 overflow-y-auto">
      {/* Header */}
      <div className="h-14 px-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-white">Mode 3: Speech-to-Text Transcriber</h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Whisper & Vosk Engine
        </span>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-6">
        {/* Record & Upload Action Box */}
        <div className="p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-5">
          {/* Record Button */}
          <div className="relative">
            {isRecording && (
              <span className="absolute -inset-3 rounded-full bg-rose-500/20 animate-ping" />
            )}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isRecording ? <Square className="w-7 h-7 fill-white" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-white">
              {isRecording ? 'Listening to Microphone...' : 'Click to Record Microphone'}
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              {isRecording ? `Recording Duration: ${formatTime(recordingSeconds)}` : 'Supports clear speech, dictation, and lectures'}
            </p>
          </div>

          {/* Upload Audio File Alternative */}
          <div className="pt-2 flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700/80 hover:border-zinc-600 bg-zinc-950 text-xs font-medium text-zinc-300 hover:text-white transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Audio File (WAV, MP3, M4A)</span>
            </button>
          </div>
        </div>

        {/* Processing Indicator */}
        {isTranscribing && (
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center gap-3 text-indigo-300 text-xs">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Transcribing audio using {settings.sttProvider}...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Audio Player */}
        {audioUrl && (
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
            <div className="text-xs font-medium text-zinc-400 flex items-center gap-2">
              <FileAudio className="w-4 h-4 text-indigo-400" />
              <span>Recorded Audio Playback</span>
            </div>
            <audio src={audioUrl} controls className="w-full" />
          </div>
        )}

        {/* Transcript Output Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-400">Transcription Result (Editable)</label>
            <div className="flex items-center gap-2">
              {transcript && (
                <>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-[11px] text-zinc-300 hover:text-white transition-all font-mono"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-[11px] text-zinc-300 hover:text-white transition-all font-mono"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download TXT</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <textarea
            rows={8}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your spoken words will appear here automatically once transcription completes..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 leading-relaxed resize-none shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

