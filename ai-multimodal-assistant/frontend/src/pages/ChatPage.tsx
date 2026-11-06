import React from 'react';
import { useChat } from '../contexts/ChatContext';
import { MessageList } from '../components/Chat/MessageList';
import { ChatInput } from '../components/Chat/ChatInput';
import { AppMode } from '../types';
import { AlertCircle, Trash2, Plus } from 'lucide-react';

interface ChatPageProps {
  onSelectMode: (mode: AppMode) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ onSelectMode }) => {
  const {
    activeSession,
    sendMessage,
    regenerateResponse,
    stopStreaming,
    isStreaming,
    clearCurrentSession,
    createNewSession,
    error,
    clearError,
  } = useChat();

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 overflow-hidden">
      {/* Top Header */}
      <div className="h-14 px-4 sm:px-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <h2 className="text-xs sm:text-sm font-semibold text-zinc-100 truncate max-w-[200px] sm:max-w-md">
            {activeSession?.title || 'New Conversation'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={createNewSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 text-zinc-300 text-xs font-medium hover:text-white transition-all"
            title="Start new conversation"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {activeSession && activeSession.messages.length > 0 && (
            <button
              onClick={clearCurrentSession}
              className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-900 transition-colors"
              title="Clear messages"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={clearError} className="font-mono text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Messages */}
      <MessageList
        messages={activeSession?.messages || []}
        isStreaming={isStreaming}
        onRegenerate={regenerateResponse}
      />

      {/* Input Form */}
      <ChatInput
        onSendMessage={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
        onOpenVoiceMode={() => onSelectMode('s2s')}
      />
    </div>
  );
};

