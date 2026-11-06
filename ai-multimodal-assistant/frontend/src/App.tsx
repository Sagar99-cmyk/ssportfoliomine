import React, { useState } from 'react';
import { SettingsProvider } from './contexts/SettingsContext';
import { ChatProvider } from './contexts/ChatContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ChatPage } from './pages/ChatPage';
import { TextToSpeechPage } from './pages/TextToSpeechPage';
import { SpeechToTextPage } from './pages/SpeechToTextPage';
import { VoiceChatPage } from './pages/VoiceChatPage';
import { SettingsPage } from './pages/SettingsPage';
import { AppMode } from './types';
import { Menu } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* Sidebar */}
      <Sidebar
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Mobile Nav Toggle */}
        <div className="lg:hidden absolute top-3 left-4 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {currentMode === 'chat' && <ChatPage onSelectMode={setCurrentMode} />}
        {currentMode === 'tts' && <TextToSpeechPage />}
        {currentMode === 'stt' && <SpeechToTextPage />}
        {currentMode === 's2s' && <VoiceChatPage />}
        {currentMode === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <SettingsProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </SettingsProvider>
  );
}

