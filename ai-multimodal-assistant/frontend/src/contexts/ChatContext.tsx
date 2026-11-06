import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatSession } from '../types';
import { api } from '../services/api';
import { useSettings } from './SettingsContext';

interface ChatContextType {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  createNewSession: () => void;
  deleteSession: (id: string) => void;
  clearCurrentSession: () => void;
  sendMessage: (content: string) => Promise<void>;
  regenerateResponse: (messageId: string) => Promise<void>;
  stopStreaming: () => void;
  isStreaming: boolean;
  error: string | null;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('omni_ai_sessions');
      if (saved) return JSON.parse(saved);
    } catch {}
    const initialSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      messages: [],
      provider: settings.llmProvider,
      model: settings.llmModel,
    };
    return [initialSession];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || `session-${Date.now()}`;
  });

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    localStorage.setItem('omni_ai_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || null;

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      messages: [],
      provider: settings.llmProvider,
      model: settings.llmModel,
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fresh: ChatSession = {
          id: `session-${Date.now()}`,
          title: 'New Conversation',
          createdAt: new Date().toISOString(),
          messages: [],
          provider: settings.llmProvider,
          model: settings.llmModel,
        };
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === id) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  const clearCurrentSession = () => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [], title: 'New Conversation' } : s))
    );
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;
    setError(null);

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    const assistantPlaceholderId = `msg-${Date.now() + 1}`;
    const assistantMessage: ChatMessage = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      provider: settings.llmProvider,
      model: settings.llmModel,
    };

    // Update session title on first message
    const currentMessages = activeSession ? [...activeSession.messages, userMessage] : [userMessage];
    const isFirstMessage = currentMessages.length === 1;
    const sessionTitle = isFirstMessage ? content.slice(0, 32).trim() + (content.length > 32 ? '...' : '') : activeSession?.title || 'New Conversation';

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: sessionTitle,
              messages: [...currentMessages, assistantMessage],
            }
          : s
      )
    );

    setIsStreaming(true);
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const payloadMessages = currentMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    await api.streamChatMessage(payloadMessages, {
      provider: settings.llmProvider,
      model: settings.llmModel,
      systemPrompt: settings.systemPrompt,
      temperature: settings.temperature,
      signal: abortController.signal,
      onChunk: (chunk: string) => {
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== activeSessionId) return s;
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantPlaceholderId ? { ...m, content: m.content + chunk } : m
              ),
            };
          })
        );
      },
      onDone: () => {
        setIsStreaming(false);
        abortControllerRef.current = null;
      },
      onError: (err: Error) => {
        setIsStreaming(false);
        setError(err.message || 'Error generating response');
        abortControllerRef.current = null;
      },
    });
  };

  const regenerateResponse = async (messageId: string) => {
    if (!activeSession || isStreaming) return;
    const msgIndex = activeSession.messages.findIndex((m) => m.id === messageId);
    if (msgIndex <= 0) return;

    // Remove the message and subsequent messages
    const trimmedMessages = activeSession.messages.slice(0, msgIndex);
    const lastUserMessage = trimmedMessages[trimmedMessages.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user') {
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, messages: trimmedMessages.slice(0, -1) } : s))
      );
      await sendMessage(lastUserMessage.content);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSession,
        activeSessionId,
        setActiveSessionId,
        createNewSession,
        deleteSession,
        clearCurrentSession,
        sendMessage,
        regenerateResponse,
        stopStreaming,
        isStreaming,
        error,
        clearError: () => setError(null),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};

