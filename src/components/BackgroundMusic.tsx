import React, { useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Chord frequencies for warm acoustic guitar & grand piano arpeggios
// Cmaj9, Am9, Fmaj7, G6/9
const CHORD_PROGRESSIONS = [
  [130.81, 196.00, 246.94, 329.63, 587.33], // Cmaj9
  [110.00, 164.81, 196.00, 261.63, 493.88], // Am9
  [87.31, 130.81, 164.81, 220.00, 392.00],  // Fmaj7
  [98.00, 146.83, 196.00, 246.94, 329.63],  // G6/9
];

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isRunning = false;
  private isMuted = false;
  private chordIndex = 0;
  private noteIndex = 0;
  private intervalId: number | null = null;

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  private playAcousticPluck(freq: number, isBass: boolean) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * (isBass ? 1 : 2), now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isBass ? 450 : 1200, now);
    filter.frequency.exponentialRampToValueAtTime(isBass ? 180 : 350, now + (isBass ? 1.6 : 1.2));

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(isBass ? 0.35 : 0.22, now + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + (isBass ? 2.4 : 1.8));

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.5);
    osc2.stop(now + 2.5);
  }

  start() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.isRunning) return;
    this.isRunning = true;
    this.chordIndex = 0;
    this.noteIndex = 0;

    const stepTimeMs = 420;
    this.intervalId = window.setInterval(() => {
      if (!this.isRunning || this.isMuted) return;

      const currentChord = CHORD_PROGRESSIONS[this.chordIndex];
      const freq = currentChord[this.noteIndex];
      const isBass = this.noteIndex === 0;

      this.playAcousticPluck(freq, isBass);

      this.noteIndex++;
      if (this.noteIndex >= currentChord.length) {
        this.noteIndex = 0;
        this.chordIndex = (this.chordIndex + 1) % CHORD_PROGRESSIONS.length;
      }
    }, stepTimeMs);
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    if (muted) {
      this.masterGain.gain.setTargetAtTime(0, now, 0.08);
    } else {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this.masterGain.gain.setTargetAtTime(0.12, now, 0.08);
      if (!this.isRunning) {
        this.start();
      }
    }
  }

  getIsMuted() {
    return this.isMuted;
  }
}

export const globalAudioEngine = new AmbientAudioEngine();

interface SoundButtonProps {
  className?: string;
}

export const SoundButton: React.FC<SoundButtonProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  // Automatic music on at first time
  useEffect(() => {
    // Attempt instant autoplay
    globalAudioEngine.start();
    globalAudioEngine.setMuted(false);
    setIsPlaying(true);

    // Browser autoplay policy handler: resume on any initial gesture
    const handleAutoResume = () => {
      if (!globalAudioEngine.getIsMuted()) {
        globalAudioEngine.start();
        globalAudioEngine.setMuted(false);
        setIsPlaying(true);
      }
    };

    window.addEventListener('click', handleAutoResume, { once: true });
    window.addEventListener('keydown', handleAutoResume, { once: true });
    window.addEventListener('scroll', handleAutoResume, { once: true });
    window.addEventListener('touchstart', handleAutoResume, { once: true });

    return () => {
      window.removeEventListener('click', handleAutoResume);
      window.removeEventListener('keydown', handleAutoResume);
      window.removeEventListener('scroll', handleAutoResume);
      window.removeEventListener('touchstart', handleAutoResume);
    };
  }, []);

  const toggleSound = useCallback(() => {
    if (isPlaying) {
      globalAudioEngine.setMuted(true);
      setIsPlaying(false);
    } else {
      globalAudioEngine.setMuted(false);
      globalAudioEngine.start();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return (
    <button
      onClick={toggleSound}
      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer backdrop-blur-md select-none ${
        isPlaying
          ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.25)]'
          : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
      } ${className}`}
      title={isPlaying ? 'Mute Background Music (Guitar & Piano)' : 'Play Background Music (Guitar & Piano)'}
      aria-label="Toggle Background Music"
    >
      {isPlaying ? (
        <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
      ) : (
        <VolumeX className="w-3.5 h-3.5" />
      )}

      {isPlaying && (
        <div className="flex items-end gap-0.5 h-3">
          <span className="w-0.5 bg-rose-400 rounded-full animate-[musicBar_0.8s_ease-in-out_infinite]" style={{ height: '70%' }} />
          <span className="w-0.5 bg-rose-300 rounded-full animate-[musicBar_0.8s_ease-in-out_0.2s_infinite]" style={{ height: '100%' }} />
          <span className="w-0.5 bg-rose-400 rounded-full animate-[musicBar_0.8s_ease-in-out_0.4s_infinite]" style={{ height: '50%' }} />
        </div>
      )}

      <span className="text-[11px] font-mono tracking-tight font-medium">
        {isPlaying ? 'Music ON' : 'Music OFF'}
      </span>

      <style>{`
        @keyframes musicBar {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
      `}</style>
    </button>
  );
};
