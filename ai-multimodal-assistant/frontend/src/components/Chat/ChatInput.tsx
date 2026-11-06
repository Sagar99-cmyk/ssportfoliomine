import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Mic, MicOff, Sparkles, Loader2 } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  onOpenVoiceMode: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStop,
  isStreaming,
  onOpenVoiceMode,
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Browser speech recognition quick dictation
  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onOpenVoiceMode();
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch {
      onOpenVoiceMode();
    }
  };

  return (
    <div className="p-4 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800/80">
      <div className="max-w-4xl mx-auto space-y-2">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 focus-within:border-indigo-500/80 transition-all shadow-lg shadow-black/20">
          {/* Quick Voice Input */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2 rounded-xl transition-all flex-shrink-0 ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title="Voice Dictation"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${settings.llmModel} (${settings.llmProvider})... Shift+Enter for newline`}
            className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none py-1.5 px-1 max-h-44"
          />

          {/* Action button: Send or Stop */}
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all flex-shrink-0 shadow-sm"
              title="Stop generating"
            >
              <Square className="w-4 h-4 fill-white" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                input.trim()
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'text-zinc-600 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Footer info pill */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Active: {settings.llmProvider} / {settings.llmModel}</span>
          </div>
          <button
            onClick={onOpenVoiceMode}
            className="hover:text-indigo-400 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Switch to Mode 4 Voice Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

