import React, { useState, useCallback } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { motion } from 'motion/react';
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

// Smooth Real-Time Typing Text Animator with Pre-Reserved Layout (Zero Reflow / Zero Vertical Shift)
const WelcomeTypewriter: React.FC<{
  line1?: string;
  line2?: string;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({
  line1 = 'Welcome to our',
  line2 = 'portfolio',
  speed = 55,
  className = '',
  style,
}) => {
  const [ticks, setTicks] = useState(0);
  const pauseTicks = 3;
  const totalTicks = line1.length + pauseTicks + line2.length;

  React.useEffect(() => {
    setTicks(0);
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setTicks(count);
      if (count >= totalTicks) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [line1, line2, totalTicks, speed]);

  const displayedLine1 = line1.slice(0, Math.min(ticks, line1.length));
  const isLine1Active = ticks <= line1.length + pauseTicks;

  const line2Chars = ticks > line1.length + pauseTicks
    ? Math.min(ticks - (line1.length + pauseTicks), line2.length)
    : 0;
  const displayedLine2 = line2.slice(0, line2Chars);
  const isLine2Active = !isLine1Active;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center text-center ${className}`}
      style={style}
    >
      {/* 
        PRE-EXISTING OCCUPIED LAYOUT (GHOST SIZER)
        Renders both line 1 ("Welcome to our") and line 2 ("portfolio") in standard document flow
        with invisible opacity. This reserves the complete 2-line height and spacing right from mount,
        ensuring zero layout shift so 'Data Analytics & BI Engineering' below never moves down!
      */}
      <div
        className="invisible pointer-events-none select-none flex flex-col items-center leading-[1.08] text-center"
        aria-hidden="true"
      >
        <span className="block whitespace-nowrap">{line1}</span>
        <span className="block whitespace-nowrap">{line2}</span>
      </div>

      {/* 
        ACTIVE TYPEWRITER OVERLAY
        Positioned absolutely over the ghost layout.
        Line 1 types first with cursor, then Line 2 types on its dedicated second line.
      */}
      <div className="absolute inset-0 flex flex-col items-center justify-start leading-[1.08] pointer-events-auto text-center">
        {/* Line 1: Welcome to our */}
        <div className="h-1/2 flex items-center justify-center whitespace-nowrap">
          <span>{displayedLine1}</span>
          {isLine1Active && (
            <span className="inline-block w-1 sm:w-1.5 h-[0.85em] ml-1.5 bg-amber-400 animate-pulse align-middle rounded-xs" />
          )}
        </div>

        {/* Line 2: portfolio (Word goes second on its own line) */}
        <div className="h-1/2 flex items-center justify-center whitespace-nowrap">
          <span>{displayedLine2}</span>
          {isLine2Active && (
            <span className="inline-block w-1 sm:w-1.5 h-[0.85em] ml-1.5 bg-amber-400 animate-pulse align-middle rounded-xs" />
          )}
        </div>
      </div>
    </div>
  );
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter, onOpenAdmin }) => {
  // Manual Entry Only - No auto-redirect timer
  const handleEnter = useCallback(() => {
    onEnter();
  }, [onEnter]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden select-none"
      style={{
        background: '#09090b',
        color: '#f5f0eb',
      }}
    >
      {/* 3D Cosmic Nucleus & Starry Space Background */}
      <Welcome3DRedWave />

      {/* Subtle warm atmospheric radial glow */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at 50% 35%, rgba(225,29,72,0.12) 0%, transparent 70%)',
        }}
      />

      {/* TOP HEADER - Minimalist Bar with Ambient Music Control */}
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

      {/* CENTER HEADLINE */}
      <div className="relative z-30 w-full flex-1 flex flex-col items-center justify-start pt-6 sm:pt-10 md:pt-14 px-6 text-center select-none pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="tracking-tight max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Typewriter Header: "Welcome to our" (Line 1) and "portfolio" (Line 2) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="font-serif-luxury text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[#f8f5f0] leading-[1.08] flex justify-center pointer-events-auto"
            style={{
              letterSpacing: '-0.01em',
              textShadow: '0 4px 24px rgba(0, 0, 0, 0.9), 0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            <WelcomeTypewriter line1="Welcome to our" line2="portfolio" speed={50} />
          </motion.div>

          {/* Interactive Bouncing Callout Subhead: "Data Analytics & BI Engineering" */}
          {/* Pre-existing occupied space below with generous elegant spacing so it never shifts down */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.25, ease: 'easeOut' }}
            className="mt-5 sm:mt-7 md:mt-8 font-serif-luxury italic text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-tight flex flex-wrap justify-center pointer-events-auto"
            style={{
              background: 'linear-gradient(135deg, #fef08a 0%, #e2a850 40%, #caa040 70%, #b88628 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 25px rgba(202, 160, 64, 0.35))',
            }}
          >
            {'Data Analytics & BI Engineering'.split('').map((char, cIdx) => (
              <InteractiveLetter key={`mp-${cIdx}`} char={char} />
            ))}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-stone-300 text-sm sm:text-base font-mono max-w-xl mx-auto mt-3 sm:mt-4"
          >
            Power BI · Sales Performance Analytics · MySQL · Python
          </motion.p>

          {/* Glowing Badge Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-4 sm:mt-5 inline-flex items-center gap-2.5 px-4 sm:px-5 py-1.5 rounded-full border border-rose-900/60 bg-stone-950/75 backdrop-blur-md shadow-2xl pointer-events-auto"
            style={{
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-rose-200 font-semibold">
              INTERACTIVE 3D COSMIC DATA EXPERIENCE
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* BOTTOM CONTROLS (Manual Enter Button Only - No Auto Transition) */}
      <footer className="relative z-30 w-full px-6 sm:px-12 pb-8 sm:pb-10 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
        {/* Exploration Status on Left */}
        <div className="flex items-center gap-2 text-xs font-mono text-stone-300/90 bg-stone-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="tracking-wider uppercase text-[11px] font-semibold text-stone-200">
            Drag space to orbit · Scroll to navigate
          </span>
        </div>

        {/* Enter Portfolio Button */}
        <button
          onClick={handleEnter}
          className="group relative px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide overflow-hidden flex items-center gap-3 transition-all duration-300 cursor-pointer shadow-xl active:scale-95"
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
            Enter Portfolio
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </footer>
    </div>
  );
};
