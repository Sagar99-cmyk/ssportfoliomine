import React, { useState } from 'react';
import {
  MessageSquare,
  Volume2,
  Mic,
  Radio,
  Settings,
  Plus,
  Trash2,
  Search,
  Sparkles,
  Bot,
  Cpu,
  ChevronRight,
  ShieldCheck,
  Moon,
  Sun,
  X,
  Menu
} from 'lucide-react';
import { AppMode } from '../../types';
import { useChat } from '../../contexts/ChatContext';
import { useSettings } from '../../contexts/SettingsContext';

interface SidebarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, onSelectMode, isOpen, onClose }) => {
  const { sessions, activeSessionId, setActiveSessionId, createNewSession, deleteSession } = useChat();
  const { settings, updateSetting, health } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navItems: { mode: AppMode; label: string; icon: React.ReactNode; tag?: string }[] = [
    { mode: 'chat', label: 'Text Chat', icon: <MessageSquare className="w-4 h-4" />, tag: 'T2T' },
    { mode: 'tts', label: 'Text-to-Speech', icon: <Volume2 className="w-4 h-4" />, tag: 'TTS' },
    { mode: 'stt', label: 'Speech-to-Text', icon: <Mic className="w-4 h-4" />, tag: 'STT' },
    { mode: 's2s', label: 'Voice Conversation', icon: <Radio className="w-4 h-4 text-emerald-400" />, tag: 'Live S2S' },
    { mode: 'settings', label: 'Settings & Models', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-zinc-950 border-r border-zinc-800/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* App Header */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                OmniVoice AI
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  FREE
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400 font-mono">Multimodal Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Mode Selectors */}
        <div className="p-3 space-y-1">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-3 py-1">
            Core AI Modes
          </div>
          {navItems.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => {
                  onSelectMode(item.mode);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.tag && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-indigo-700/60 text-white'
                        : 'bg-zinc-800/80 text-zinc-400'
                    }`}
                  >
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* New Chat Button */}
        <div className="px-3 pt-2">
          <button
            onClick={() => {
              createNewSession();
              onSelectMode('chat');
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-zinc-700/80 hover:border-indigo-500/80 text-zinc-300 hover:text-white text-xs font-medium hover:bg-indigo-500/5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>New Chat Session</span>
          </button>
        </div>

        {/* Conversation History */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="flex items-center justify-between px-2 pb-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            <span>Conversations</span>
            <span className="font-mono text-[10px] text-zinc-600">{sessions.length}</span>
          </div>

          {/* Search */}
          {sessions.length > 3 && (
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>
          )}

          {filteredSessions.map((session) => {
            const isSelected = currentMode === 'chat' && session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => {
                  setActiveSessionId(session.id);
                  onSelectMode('chat');
                  onClose();
                }}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs transition-all ${
                  isSelected
                    ? 'bg-zinc-800/90 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-zinc-500" />
                  <span className="truncate">{session.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 rounded transition-opacity"
                  title="Delete conversation"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Hardware & Provider Status Card */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60">
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-[11px]">Inference Mode</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Free
              </span>
            </div>
            <div className="text-[11px] text-zinc-300 font-mono flex items-center justify-between">
              <span className="text-zinc-500">LLM Provider:</span>
              <span className="text-zinc-200 uppercase">{settings.llmProvider}</span>
            </div>
            <div className="text-[11px] text-zinc-300 font-mono flex items-center justify-between truncate">
              <span className="text-zinc-500">Active Model:</span>
              <span className="text-indigo-300 truncate max-w-[120px]">{settings.llmModel}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

