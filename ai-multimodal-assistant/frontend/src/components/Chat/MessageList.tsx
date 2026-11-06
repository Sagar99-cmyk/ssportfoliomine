import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  Volume2,
  Bot,
  User,
  Sparkles,
  Loader2,
  Terminal
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { api } from '../../services/api';

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onRegenerate: (messageId: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isStreaming, onRegenerate }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = async (id: string, text: string) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    setSpeakingId(id);
    try {
      const res = await api.synthesizeSpeech(text.slice(0, 500));
      const audio = new Audio(`data:audio/mp3;base64,${res.audioBase64}`);
      audio.onended = () => setSpeakingId(null);
      audio.onerror = () => setSpeakingId(null);
      await audio.play();
    } catch {
      // Fallback to browser SpeechSynthesis
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 500));
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center shadow-xl shadow-indigo-500/10">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">How can I help you today?</h2>
          <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
            I am your free multimodal AI assistant. Powered by local Ollama, Faster-Whisper, and Edge-TTS. Ask questions, generate code, summarize documents, or practice voice conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-2">
          {[
            { title: 'Explain a Concept', desc: 'How does Transformer self-attention work?' },
            { title: 'Write Clean Code', desc: 'Write a Python script for WebSocket streaming' },
            { title: 'Text-to-Speech Lab', desc: 'Convert text to natural speech in Mode 2' },
            { title: 'Live Voice Chat', desc: 'Switch to Mode 4 for real-time speech conversation' },
          ].map((sample) => (
            <div
              key={sample.title}
              className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-indigo-500/40 text-left transition-all hover:bg-zinc-900 cursor-pointer group"
            >
              <div className="font-semibold text-xs text-zinc-200 group-hover:text-indigo-400 transition-colors">
                {sample.title}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">{sample.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-4xl mx-auto w-full">
      {messages.map((msg, index) => {
        const isUser = msg.role === 'user';
        const isLastAssistant = !isUser && index === messages.length - 1;

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                isUser
                  ? 'bg-zinc-800 border border-zinc-700'
                  : 'bg-gradient-to-tr from-indigo-600 to-cyan-500 border border-indigo-400/30'
              }`}
            >
              {isUser ? <User className="w-4 h-4 text-zinc-300" /> : <Bot className="w-4 h-4 text-white" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] sm:max-w-[78%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 px-1">
                <span>{isUser ? 'You' : msg.provider ? `${msg.provider} (${msg.model || 'ai'})` : 'AI Assistant'}</span>
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md shadow-indigo-600/10'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm shadow-sm'
                }`}
              >
                {/* Content */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content || (
                    <span className="flex items-center gap-2 text-zinc-500">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      Generating response...
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons for Assistant */}
              {!isUser && msg.content && (
                <div className="flex items-center gap-2 px-1 pt-0.5 text-zinc-500">
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="p-1 hover:text-zinc-300 rounded hover:bg-zinc-800 transition-colors flex items-center gap-1 text-[11px]"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-mono">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px] font-mono">Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleSpeak(msg.id, msg.content)}
                    className={`p-1 rounded hover:bg-zinc-800 transition-colors flex items-center gap-1 text-[11px] ${
                      speakingId === msg.id ? 'text-indigo-400 font-bold' : 'hover:text-zinc-300'
                    }`}
                    title="Read aloud"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span className="text-[10px] font-mono">{speakingId === msg.id ? 'Speaking' : 'Speak'}</span>
                  </button>

                  <button
                    onClick={() => onRegenerate(msg.id)}
                    disabled={isStreaming}
                    className="p-1 hover:text-zinc-300 rounded hover:bg-zinc-800 transition-colors flex items-center gap-1 text-[11px]"
                    title="Regenerate response"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="text-[10px] font-mono">Regenerate</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

