import React, { useState } from 'react';
import { Box, Sparkles, Video } from 'lucide-react';
import { Realistic3DAvatar } from './Realistic3DAvatar';
import { ProfessionalPhotoAvatar } from './ProfessionalPhotoAvatar';
import { DemoVideoModal } from './DemoVideoModal';
import { useTheme } from '../context/ThemeContext';

interface Sagar3DModelCanvasProps {
  className?: string;
  sizeClassName?: string;
  modelUrl?: string;
}

export const Sagar3DModelCanvas: React.FC<Sagar3DModelCanvasProps> = ({
  className = '',
  sizeClassName = 'w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80',
  modelUrl = '/models/sagar-avatar.glb',
}) => {
  const [avatarMode, setAvatarMode] = useState<'3d' | 'photo'>('3d');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`relative flex flex-col items-center select-none bg-transparent ${className}`}>
      {/* Interactive Avatar Mode Switcher Bar */}
      <div className="flex items-center gap-1.5 p-1 mb-3 rounded-full bg-stone-900/70 dark:bg-stone-900/80 light:bg-stone-100 border border-white/10 dark:border-white/10 light:border-stone-200 shadow-md backdrop-blur-md z-20">
        <button
          onClick={() => setAvatarMode('3d')}
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            avatarMode === '3d'
              ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/40'
              : 'text-stone-300 dark:text-stone-400 light:text-stone-600 hover:text-white dark:hover:text-white light:hover:text-stone-900'
          }`}
          title="Switch to Real-time 3D WebGL Digital Avatar"
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D WebGL Avatar</span>
        </button>

        <button
          onClick={() => setAvatarMode('photo')}
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            avatarMode === 'photo'
              ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/40'
              : 'text-stone-300 dark:text-stone-400 light:text-stone-600 hover:text-white dark:hover:text-white light:hover:text-stone-900'
          }`}
          title="Switch to 3D Living Photo Profile"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Living Twin</span>
        </button>

        <button
          onClick={() => setIsDemoModalOpen(true)}
          className="px-2.5 py-1 rounded-full text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
          title="Watch 3D Avatar Video Reference Demo"
        >
          <Video className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Reference</span>
        </button>
      </div>

      {/* Main Avatar View */}
      <div className="relative">
        {avatarMode === '3d' ? (
          <Realistic3DAvatar showChips={true} modelUrl={modelUrl} />
        ) : (
          <ProfessionalPhotoAvatar sizeClassName={sizeClassName} />
        )}
      </div>

      {/* Reference Demo Video Modal */}
      <DemoVideoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
};
