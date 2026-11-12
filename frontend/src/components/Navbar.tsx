import React, { useState, useEffect } from 'react';
import { Sun, Moon, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { SoundButton } from './BackgroundMusic';
import { DemoVideoModal } from './DemoVideoModal';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenAdmin?: () => void;
  isAdminOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { theme, toggleTheme } = useTheme();
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled
          ? (theme === 'light' ? 'rgba(255,255,255,0.92)' : 'rgba(9,9,11,0.96)')
          : (theme === 'light' ? 'rgba(255,255,255,0.80)' : 'rgba(9,9,11,0.90)'),
        backdropFilter: 'blur(24px)',
        borderBottom: theme === 'light' ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: scrolled ? (theme === 'light' ? '0 4px 20px rgba(0,0,0,0.06)' : '0 4px 30px rgba(0,0,0,0.5)') : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand: "Sagar Singh" */}
        <a
          href="#"
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <motion.div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
            style={{ background: 'linear-gradient(135deg, #e11d48, #9f1239)' }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <span className="text-white font-bold text-xs font-mono">SS</span>
          </motion.div>
          <span
            className="text-lg font-bold tracking-tight transition-colors"
            style={{ color: theme === 'light' ? '#0f172a' : '#f1f5f9' }}
          >
            Sagar Singh
          </span>
        </a>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Demo Video Modal Trigger Button */}
          <button
            onClick={() => setIsDemoOpen(true)}
            title="Watch 3D Avatar & System Video Demo"
            className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 border ${
              theme === 'light'
                ? 'border-rose-300/80 bg-rose-50/90 hover:bg-rose-100 text-rose-700 shadow-rose-200/40'
                : 'border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 shadow-rose-950/40'
            }`}
            aria-label="Open Demo Video"
          >
            <Play className="w-3.5 h-3.5 fill-current text-rose-500 shrink-0" />
            <span className="font-semibold text-[11px] tracking-wide">Demo</span>
          </button>

          {/* Clean Executive Light / 3D Dark Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Executive Light Theme' : 'Switch to 3D Dark Space Theme'}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95 border ${
              theme === 'light'
                ? 'border-stone-300/80 bg-white hover:bg-stone-100 text-stone-800 shadow-stone-200/50'
                : 'border-white/15 bg-white/5 hover:bg-white/10 text-stone-200 shadow-black/40'
            }`}
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <span className="hidden sm:inline font-semibold text-[11px] tracking-wide text-amber-300">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="hidden sm:inline font-semibold text-[11px] tracking-wide text-stone-700">Dark Mode</span>
              </>
            )}
          </button>

          {/* Background Ambient Music (Guitar & Piano) */}
          <SoundButton />
        </div>
      </div>

      {/* Pure Video Demo Modal (No text, no clutter) */}
      <DemoVideoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </motion.header>
  );
};
