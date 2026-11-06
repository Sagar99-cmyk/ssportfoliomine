import React, { useEffect, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SoundButton } from './BackgroundMusic';
import { Welcome3DRedWave } from './Welcome3DRedWave';

interface WelcomeScreenProps {
  onEnter: () => void;
  onOpenAdmin?: () => void;
}

const InteractiveLetter: React.FC<{ char: string; className?: string; style?: React.CSSProperties }> = ({ char, className, style }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <motion.span
      className={`inline-block pointer-events-auto cursor-pointer select-none ${className || ''}`}
      style={style}
      whileHover={{ y: -6, scale: 1.12, transition: { type: 'spring', stiffness: 450, damping: 12 } }}
      whileTap={{ y: 5, scale: 0.9, rotate: -3 }}
      animate={clicked ? { y: [-12, 5, -2, 0], rotate: [-6, 6, -2, 0], scale: [1.25, 0.95, 1.05, 1] } : {}}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      onClick={(e) => {
        e.stopPropagation();
        setClicked(true);
        setTimeout(() => setClicked(false), 450);
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter, onOpenAdmin }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const totalSeconds = 10;

  // Handle instant entry transition directly without sluggish delay
  const handleEnter = useCallback(() => {
    onEnter();
  }, [onEnter]);

  // Automatic transition countdown (10s auto-entry)
  useEffect(() => {
    if (secondsRemaining <= 0) {
      handleEnter();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, handleEnter]);

  const progressPercent = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;

  // Phase 1 (10s down to 4s): Exact "Welcome to my portfolio / • INTERACTIVE 3D EXPERIENCE"
  // Phase 2 (last 3-4 seconds): "Let's see our portfolio"
  const isLastSeconds = secondsRemaining <= 3;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden select-none"
      style={{
        background: '#09090b',
        color: '#f5f0eb',
      }}
    >
      {/* Interactive 3D Red Wave Background - Converts Crimson Image into Dynamic 3D Waves with User-Click Ripples */}
      <Welcome3DRedWave />

      {/* Subtle warm atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(225,29,72,0.14) 0%, transparent 65%)',
        }}
      />

      {/* TOP HEADER - Minimalist Bar with Ambient Music Control & Admin Portal Access */}
      <header className="relative z-30 w-full px-6 sm:px-12 pt-6 sm:pt-8 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-stone-200 font-bold drop-shadow flex">
            {'SAGAR SINGH'.split('').map((char, cIdx) => (
              <InteractiveLetter key={`ss-${cIdx}`} char={char} />
            ))}
          </span>
          <span className="text-stone-600 hidden sm:inline">·</span>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-rose-400 font-bold hidden sm:inline">
            DATA ANALYTICS & BI
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Built-in Guitar & Piano Background Music Mute/Unmute */}
          <SoundButton />
        </div>
      </header>

      {/* CENTER / UPPER HEADLINE - Exact Match to Reference Image */}
      <div className="relative z-30 w-full flex-1 flex flex-col items-center justify-start pt-6 sm:pt-10 md:pt-12 px-6 text-center select-none pointer-events-none">
        <AnimatePresence mode="wait">
          {!isLastSeconds ? (
            /* PHASE 1: Exact Reference Typography "Welcome to my portfolio / • INTERACTIVE 3D EXPERIENCE" */
            <motion.div
              key="phase-welcome"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-0 tracking-tight max-w-4xl mx-auto flex flex-col items-center"
            >
              {/* "Welcome to" - Clean Off-White Serif with Interactive Physical Letters */}
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut' }}
                className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-normal text-[#f8f5f0] leading-none flex flex-wrap justify-center pointer-events-auto"
                style={{
                  letterSpacing: '-0.01em',
                  textShadow: '0 4px 24px rgba(0, 0, 0, 0.9), 0 1px 4px rgba(0,0,0,0.8)',
                }}
              >
                {'Welcome to'.split('').map((char, cIdx) => (
                  <InteractiveLetter key={`wt-${cIdx}`} char={char} />
                ))}
              </motion.h1>

              {/* "my portfolio" - Rich Golden Ochre Italic Calligraphic Serif with Interactive Physical Letters */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.2, ease: 'easeOut' }}
                className="font-serif-luxury italic text-6xl sm:text-8xl md:text-9xl lg:text-[8.5rem] font-normal leading-none flex flex-wrap justify-center pointer-events-auto"
                style={{
                  background: 'linear-gradient(135deg, #fef08a 0%, #e2a850 40%, #caa040 70%, #b88628 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginTop: '-0.12em',
                  filter: 'drop-shadow(0 4px 25px rgba(202, 160, 64, 0.35))',
                }}
              >
                {'my portfolio'.split('').map((char, cIdx) => (
                  <InteractiveLetter key={`mp-${cIdx}`} char={char} />
                ))}
              </motion.h2>

              {/* Glowing Badge Pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-4 sm:mt-5 inline-flex items-center gap-2.5 px-4 sm:px-5 py-1.5 rounded-full border border-rose-900/60 bg-stone-950/75 backdrop-blur-md shadow-2xl pointer-events-auto"
                style={{
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse" />
                <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-rose-200 font-semibold">
                  DATA ANALYTICS & INSIGHTS
                </span>
              </motion.div>
            </motion.div>
          ) : (
            /* PHASE 2 (Last 3-4 seconds): "Let's see our portfolio!" */
            <motion.div
              key="phase-portfolio-enter"
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
              transition={{ duration: 0.7, type: 'spring', damping: 16 }}
              className="space-y-3 tracking-tight max-w-4xl mx-auto flex flex-col items-center"
            >
              {/* Executive Ready Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 backdrop-blur-md shadow-lg pointer-events-auto"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs sm:text-sm font-mono tracking-widest uppercase font-bold text-amber-300">
                  Ready to Enter
                </span>
                <span className="text-stone-500">•</span>
                <span className="text-xs font-mono text-stone-300">
                  Launching Portfolio
                </span>
              </motion.div>

              {/* Main Callout: "Let's see our portfolio" */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-tight"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #fef08a 30%, #f59e0b 70%, #d97706 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 6px 30px rgba(245,158,11,0.35))',
                }}
              >
                Let's see our portfolio
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-stone-300 text-sm sm:text-base font-mono max-w-xl mx-auto"
              >
                Power BI · Sales Performance Analytics · MySQL · Python
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM CONTROLS & AUTO-TIMER */}
      <footer className="relative z-30 w-full px-6 sm:px-12 pb-8 sm:pb-10 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
        {/* Auto Transition Countdown & Progress Bar */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="space-y-1.5 min-w-[200px]">
            <div className="flex items-center justify-between text-xs font-mono text-stone-300">
              <span className="tracking-wide">
                {isLastSeconds ? 'Launching Portal...' : 'Auto-Entering Portal'}
              </span>
              <span className="text-amber-400 font-bold">{secondsRemaining}s</span>
            </div>
            
            {/* Smooth animated progress line */}
            <div className="w-full h-1 bg-stone-800/90 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-300 transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Enter Portfolio Button */}
        <button
          onClick={handleEnter}
          className="group relative px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide overflow-hidden flex items-center gap-3 transition-all duration-300 cursor-pointer shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #e2a850 0%, #b87b28 100%)',
            color: '#1a140e',
            boxShadow: '0 4px 25px rgba(226,168,80,0.35)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.02)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 35px rgba(226,168,80,0.55)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0) scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 25px rgba(226,168,80,0.35)';
          }}
        >
          <span className="font-bold tracking-wider">
            {isLastSeconds ? "Let's Explore Now" : "Enter Portfolio"}
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </footer>
    </div>
  );
};