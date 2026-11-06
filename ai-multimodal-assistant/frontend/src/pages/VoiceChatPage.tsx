import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  Volume2,
  Square,
  Sparkles,
  PhoneOff,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { VoiceWebSocketClient } from '../services/websocket';
import { useSettings } from '../contexts/SettingsContext';

interface VoiceTurn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export const VoiceChatPage: React.FC = () => {
  const { settings } = useSettings();
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [liveAssistantText, setLiveAssistantText] = useState('');
  const [turns, setTurns] = useState<VoiceTurn[]>([]);
  const [statusMessage, setStatusMessage] = useState('Click "Start Voice Call" to begin speaking.');
  const [error, setError] = useState<string | null>(null);

  const wsClientRef = useRef<VoiceWebSocketClient | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      stopVoiceSession();
    };
  }, []);

  const startVoiceSession = async () => {
    setError(null);
    setStatusMessage('Connecting to real-time voice server...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const client = new VoiceWebSocketClient();
      wsClientRef.current = client;

      client.connect({
        onReady: () => {
          setIsConnected(true);
          setStatusMessage('Connected. Speak naturally through your microphone.');
          beginAudioStreaming(stream);
        },
        onTranscript: (role, text) => {
          setTurns((prev) => [...prev, { id: `turn-${Date.now()}`, role: role as any, text }]);
          if (role === 'user') {
            setLiveAssistantText('');
          }
        },
        onTextChunk: (delta) => {
          setLiveAssistantText((prev) => prev + delta);
        },
        onAudioChunk: (audioBase64) => {
          setIsAiSpeaking(true);
          playAudioChunk(audioBase64);
        },
        onTurnComplete: (fullText) => {
          setTurns((prev) => [
            ...prev,
            { id: `turn-${Date.now()}`, role: 'assistant', text: fullText },
          ]);
          setLiveAssistantText('');
        },
        onInterrupted: () => {
          if (currentAudioSourceRef.current) {
            currentAudioSourceRef.current.pause();
          }
          setIsAiSpeaking(false);
          setStatusMessage('Interrupted. Listening to you...');
        },
        onError: (err) => {
          setError(err);
          setIsConnected(false);
        },
      });
    } catch (err: any) {
      setError('Microphone access denied. Please allow microphone permissions in your browser.');
    }
  };

  const beginAudioStreaming = (stream: MediaStream) => {
    try {
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (e) => {
        if (e.data.size > 0 && wsClientRef.current) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = (reader.result as string).split(',')[1];
            wsClientRef.current?.sendAudio(base64Audio, {
              systemPrompt: settings.systemPrompt,
              voice: settings.ttsVoice,
              speed: settings.ttsSpeed,
            });
          };
          reader.readAsDataURL(e.data);
        }
      };

      mediaRecorder.start(3000); // Send 3s chunks
      setIsListening(true);
    } catch (e) {
      console.error('Streaming start error:', e);
    }
  };

  const playAudioChunk = (audioBase64: string) => {
    try {
      const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
      currentAudioSourceRef.current = audio;
      audio.onended = () => setIsAiSpeaking(false);
      audio.play().catch(() => {});
    } catch (e) {
      console.error('Audio chunk play failed:', e);
    }
  };

  const handleInterrupt = () => {
    wsClientRef.current?.interrupt();
    if (currentAudioSourceRef.current) {
      currentAudioSourceRef.current.pause();
      currentAudioSourceRef.current = null;
    }
    setIsAiSpeaking(false);
  };

  const stopVoiceSession = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      mediaRecorderRef.current = null;
    }
    if (currentAudioSourceRef.current) {
      currentAudioSourceRef.current.pause();
      currentAudioSourceRef.current = null;
    }
    if (wsClientRef.current) {
      wsClientRef.current.disconnect();
      wsClientRef.current = null;
    }
    setIsConnected(false);
    setIsListening(false);
    setIsAiSpeaking(false);
    setStatusMessage('Voice call disconnected.');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="h-14 px-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-white">Mode 4: Speech-to-Speech (Live Call)</h2>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Duplex WebSocket
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
              <WifiOff className="w-3 h-3" />
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Main Call View */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full space-y-8 text-center">
        {/* Animated Audio Orb */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing Aura */}
          {isConnected && (
            <div
              className={`absolute -inset-8 rounded-full transition-all duration-700 ${
                isAiSpeaking
                  ? 'bg-gradient-to-tr from-cyan-500/30 to-indigo-500/40 animate-pulse blur-xl'
                  : 'bg-emerald-500/20 animate-ping blur-lg'
              }`}
            />
          )}

          <div
            className={`relative w-44 h-44 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-500 ${
              isAiSpeaking
                ? 'bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 scale-105 shadow-cyan-500/30 ring-4 ring-cyan-400/30'
                : isListening
                ? 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 shadow-emerald-500/20'
                : 'bg-zinc-900 border border-zinc-800'
            }`}
          >
            {isAiSpeaking ? (
              <Volume2 className="w-16 h-16 text-white animate-bounce" />
            ) : isListening ? (
              <Mic className="w-16 h-16 text-white animate-pulse" />
            ) : (
              <Radio className="w-16 h-16 text-zinc-600" />
            )}
            <span className="text-[11px] font-mono font-medium text-white/90 mt-2">
              {isAiSpeaking ? 'AI Speaking' : isListening ? 'Listening...' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Status Message */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-200">{statusMessage}</p>
          <p className="text-xs text-zinc-500 font-mono">
            Provider: {settings.llmProvider} ({settings.llmModel}) · Voice: {settings.ttsVoice}
          </p>
        </div>

        {/* Live Subtitle Transcript */}
        {(liveAssistantText || turns.length > 0) && (
          <div className="w-full max-h-36 overflow-y-auto p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-left text-xs leading-relaxed space-y-2">
            {turns.slice(-2).map((t) => (
              <div key={t.id} className="text-zinc-400">
                <span className="font-mono text-zinc-500 mr-2 uppercase text-[10px]">
                  {t.role}:
                </span>
                <span>{t.text}</span>
              </div>
            ))}
            {liveAssistantText && (
              <div className="text-indigo-300">
                <span className="font-mono text-indigo-400 mr-2 uppercase text-[10px]">
                  assistant (streaming):
                </span>
                <span>{liveAssistantText}</span>
              </div>
            )}
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {!isConnected ? (
            <button
              onClick={startVoiceSession}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-600/30"
            >
              <Mic className="w-4 h-4" />
              <span>Start Voice Call</span>
            </button>
          ) : (
            <>
              {isAiSpeaking && (
                <button
                  onClick={handleInterrupt}
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-all shadow-md shadow-amber-600/20"
                  title="Interrupt AI speaking"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>Interrupt AI</span>
                </button>
              )}

              <button
                onClick={stopVoiceSession}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-all shadow-lg shadow-rose-600/30"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

