import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  X,
  Loader2,
  Code2,
  Database,
  GraduationCap,
  Trophy,
  Layers,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Globe,
  Radio,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioBase64?: string;
  isAudioPlaying?: boolean;
  fromCache?: boolean;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', name: 'English', native: 'English' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
  { code: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'od-IN', name: 'Odia', native: 'ଓଡ଼ିଆ' },
];

const TOP_SUGGESTED_QUESTIONS = [
  {
    id: 'top-1',
    category: 'Flagship Capstone',
    badge: 'Power BI & DAX',
    icon: <Layers className="w-3.5 h-3.5 text-amber-400" />,
    label: 'Sales Performance Dashboard ($2.4M Analyzed)',
    question: 'Tell me about Sagar’s flagship project: Sales Performance & Customer Analytics Dashboard built with Power BI, Advanced Excel, MySQL, and DAX ($2.4M analyzed across 50,000+ records).',
  },
  {
    id: 'top-2',
    category: 'Skills & Stack',
    badge: 'MySQL & Python',
    icon: <Code2 className="w-3.5 h-3.5 text-emerald-400" />,
    label: 'Core Skills: Power BI, MySQL & Python',
    question: 'What are Sagar’s core technical skills in Power BI, Advanced Excel, MySQL queries, Python (Pandas & NumPy), and Data Cleaning?',
  },
  {
    id: 'top-3',
    category: 'Achievements',
    badge: '2nd Place & NCC',
    icon: <Trophy className="w-3.5 h-3.5 text-rose-400" />,
    label: 'IT Quiz Winner & NCC Sergeant Rank',
    question: 'What are Sagar’s achievements, including 2nd place in Inter-College IT Quiz and NCC Sergeant "B" Certificate?',
  },
  {
    id: 'top-4',
    category: 'Education',
    badge: 'Presidency 2026',
    icon: <GraduationCap className="w-3.5 h-3.5 text-sky-400" />,
    label: 'Presidency College BCA Background',
    question: 'Tell me about Sagar’s BCA degree at Presidency College, Bengaluru and his academic focus in data analytics.',
  },
];

const INITIAL_GREETING: Message = {
  id: 'init-1',
  sender: 'assistant',
  text: "Hello! I am Sagar's AI Portfolio Assistant powered by OmniVoice AI and Groq free inference. I support Text-to-Text, Voice Speech-to-Text, and Text-to-Speech in 11+ languages with lightning-fast cached responses. Click any of the suggested questions above, speak into the mic, or ask anything about Sagar's projects, skills, or experience!",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ttsLoading, setTtsLoading] = useState<string | null>(null);
  const [autoVoice, setAutoVoice] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Client-side cache for 0ms instant repeated query response
  const clientCacheRef = useRef<Map<string, string>>(new Map());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Lock background body scroll and clean audio on close/unmount
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fast typewriter effect to render answers fluidly
  const renderTypewriter = (fullText: string, messageId: string) => {
    let index = 0;
    const step = Math.max(3, Math.floor(fullText.length / 35)); // Completes smoothly in ~800-1200ms
    const timer = setInterval(() => {
      index += step;
      if (index >= fullText.length) {
        clearInterval(timer);
        setMessages(prev => prev.map(m => (m.id === messageId ? { ...m, text: fullText } : m)));
      } else {
        setMessages(prev =>
          prev.map(m => (m.id === messageId ? { ...m, text: fullText.slice(0, index) } : m))
        );
      }
    }, 18);
  };

  // Clear chat history & reset cache
  const handleClearHistory = async () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    clientCacheRef.current.clear();
    setMessages([
      {
        ...INITIAL_GREETING,
        id: `init-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
    try {
      await fetch('/api/ai/clear-cache', { method: 'POST' });
    } catch {
      // ignore
    }
  };

  // Text-to-Speech Playback Helper using Sarvam Bulbul
  const playTtsAudio = async (messageId: string, text: string) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setMessages(prev => prev.map(m => ({ ...m, isAudioPlaying: false })));
      if (ttsLoading === messageId) {
        setTtsLoading(null);
        return;
      }
    }

    setTtsLoading(messageId);
    try {
      const res = await api.sarvamTts(text, selectedLanguage.code, 'shubh');
      const audioUrl = `data:${res.mimeType || 'audio/wav'};base64,${res.audioBase64}`;
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      setMessages(prev =>
        prev.map(m => (m.id === messageId ? { ...m, isAudioPlaying: true } : { ...m, isAudioPlaying: false }))
      );

      audio.onended = () => {
        setMessages(prev => prev.map(m => (m.id === messageId ? { ...m, isAudioPlaying: false } : m)));
        currentAudioRef.current = null;
      };

      await audio.play();
    } catch (err: any) {
      console.warn('Sarvam TTS play error:', err);
    } finally {
      setTtsLoading(null);
    }
  };

  // Send message with Fast Typewriter, Local & Server Caching
  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input.trim();
    if (!textToSend || loading) return;

    const cacheKey = `${selectedLanguage.code}_${textToSend.toLowerCase()}`;
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!questionText) setInput('');

    // Check Client-side Cache first for 0ms delay!
    if (clientCacheRef.current.has(cacheKey)) {
      const cachedReply = clientCacheRef.current.get(cacheKey)!;
      const assistantMsgId = `ai-cache-${Date.now()}`;
      setMessages(prev => [
        ...prev,
        {
          id: assistantMsgId,
          sender: 'assistant',
          text: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fromCache: true,
        },
      ]);
      renderTypewriter(cachedReply, assistantMsgId);
      if (autoVoice) {
        setTimeout(() => playTtsAudio(assistantMsgId, cachedReply), 500);
      }
      return;
    }

    setLoading(true);

    try {
      const res = await api.askSarvamAi(textToSend, selectedLanguage.code, selectedLanguage.name);
      const reply = res.reply || 'No response generated.';
      clientCacheRef.current.set(cacheKey, reply);

      const assistantMsgId = `ai-${Date.now()}`;
      setMessages(prev => [
        ...prev,
        {
          id: assistantMsgId,
          sender: 'assistant',
          text: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fromCache: (res as any).fromCache || false,
        },
      ]);

      renderTypewriter(reply, assistantMsgId);

      if (autoVoice) {
        setTimeout(() => playTtsAudio(assistantMsgId, reply), 500);
      }
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: err.message || 'Sorry, I encountered an issue. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Start Mic Voice Recording (Speech-to-Text)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        stream.getTracks().forEach(track => track.stop());

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          if (!base64Data) return;

          setLoading(true);
          try {
            const sttRes = await api.sarvamStt(base64Data, selectedLanguage.code);
            if (sttRes.transcript && sttRes.transcript.trim()) {
              handleSend(sttRes.transcript.trim());
            }
          } catch (err: any) {
            console.warn('STT Error:', err);
          } finally {
            setLoading(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordTimerRef.current = window.setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Mic access error:', err);
      alert('Microphone permission required for Speech-to-Text.');
    }
  };

  // Stop Mic Voice Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col h-[760px] max-h-[96vh] overflow-hidden text-stone-100">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-stone-800 flex items-center justify-between bg-stone-950/90 backdrop-blur">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-700 flex items-center justify-center text-white shadow-lg shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-sm text-white truncate">Sagar Singh's AI Assistant</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  OmniVoice & Groq Free Tier
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-400">
                <span>Fast T2T • TTS • STT • 11+ Languages</span>
                <span className="text-stone-600">|</span>
                <a
                  href="http://127.0.0.1:5173"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:text-amber-300 underline font-mono flex items-center gap-1"
                  title="Open live Speech-to-Speech Voice Studio"
                >
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>OmniVoice Studio (5173) ↗</span>
                </a>
                <a
                  href="http://127.0.0.1:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:text-sky-300 underline font-mono hidden md:inline"
                  title="FastAPI Swagger documentation"
                >
                  Swagger Docs (8000) ↗
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Refresh / Clear Chat History Button */}
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl text-stone-400 hover:text-amber-300 hover:bg-stone-800/80 transition-colors cursor-pointer border border-transparent hover:border-stone-700"
              title="Clear chat history & reset cache"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Auto-Voice Toggle Button */}
            <button
              onClick={() => setAutoVoice(!autoVoice)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
                autoVoice
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
              title="Automatically read responses aloud"
            >
              {autoVoice ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Voice</span>
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOP PINNED AUTOMATIC SUGGESTED QUESTIONS (Prominent at Top) */}
        <div className="px-4 py-2.5 bg-stone-950/90 border-b border-stone-800/90 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Suggested Inquiries (Click to Ask):</span>
            </div>
            <span className="text-[10px] text-stone-500">Fast In-Memory Cache</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TOP_SUGGESTED_QUESTIONS.map(q => (
              <button
                key={q.id}
                onClick={() => handleSend(q.question)}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/50 text-left transition-all cursor-pointer group shadow-sm disabled:opacity-50"
              >
                <div className="p-1 rounded-lg bg-stone-800/80 group-hover:scale-110 transition-transform shrink-0">
                  {q.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-stone-200 group-hover:text-amber-300 truncate">
                    {q.label}
                  </div>
                  <div className="text-[10px] font-mono text-stone-500 truncate">
                    {q.badge}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Multilingual Switcher Bar */}
        <div className="px-5 py-2 bg-stone-950/60 border-b border-stone-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono shrink-0 font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>Language:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2 py-0.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                  selectedLanguage.code === lang.code
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 font-bold shadow-sm'
                    : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800 hover:border-stone-700'
                }`}
              >
                <span>{lang.native}</span>
                <span className="text-[10px] ml-1 opacity-70">({lang.name})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-amber-600 to-rose-700 text-white shadow-md'
                      : 'bg-stone-800/90 border border-stone-700/60 text-stone-200 shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text || '...'}</p>

                  {/* Speaker Button on Assistant Replies (Sarvam Text-to-Speech) */}
                  {!isUser && (
                    <div className="mt-2 pt-2 border-t border-stone-700/50 flex items-center justify-between gap-3 text-xs">
                      <button
                        onClick={() => playTtsAudio(msg.id, msg.text)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all cursor-pointer ${
                          msg.isAudioPlaying
                            ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 animate-pulse'
                            : 'bg-stone-900/80 text-stone-300 hover:text-white border border-stone-700/80 hover:border-amber-500/40'
                        }`}
                      >
                        {ttsLoading === msg.id ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                            <span>Synthesizing Voice...</span>
                          </>
                        ) : msg.isAudioPlaying ? (
                          <>
                            <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
                            <span>Speaking...</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-amber-400" />
                            <span>Listen ({selectedLanguage.native})</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-mono">
                        {msg.fromCache && (
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" />
                            Cached
                          </span>
                        )}
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <span className="text-[10px] text-stone-500 font-mono px-1">
                    {msg.timestamp}
                  </span>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-stone-400 text-xs bg-stone-800/60 border border-stone-700/50 w-fit px-4 py-2.5 rounded-2xl">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Analyzing profile knowledge in {selectedLanguage.native}...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Mic (Speech-to-Text) & Send */}
        <div className="p-4 bg-stone-950 border-t border-stone-800">
          {/* Recording Status Bar */}
          {isRecording && (
            <div className="mb-2 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300 animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Listening in {selectedLanguage.native}... ({recordingSeconds}s)</span>
              </div>
              <button
                onClick={stopRecording}
                className="font-bold underline cursor-pointer text-white"
              >
                Done / Transcribe
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Microphone Button (Speech-to-Text via Sarvam Saaras) */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                isRecording
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-lg shadow-rose-900/50'
                  : 'bg-stone-900 text-amber-400 border-stone-800 hover:border-amber-500/50 hover:bg-stone-800'
              }`}
              title={isRecording ? 'Click to stop recording' : 'Click to speak via Sarvam Speech-to-Text'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Input Text Box */}
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={`Ask about Sagar in ${selectedLanguage.native} or English...`}
              disabled={loading}
              className="flex-1 bg-stone-900/90 border border-stone-800 rounded-2xl px-4 py-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/60 transition-colors"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-700 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:from-amber-500 hover:to-rose-600 transition-all shadow-md cursor-pointer shrink-0"
              title="Send Message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};