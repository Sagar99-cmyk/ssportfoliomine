import React, { useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Fingerstyle Acoustic Guitar Chord Progressions (Cool Indie / Folk Arpeggios)
// Progression: Em9 -> Gmaj7 -> Dsus2 -> Cadd9 -> Bm11 -> Am9
const GUITAR_CHORDS = [
  // E minor 9 (Warm, deep, contemplative)
  { bass: 82.41, notes: [164.81, 246.94, 329.63, 392.00, 493.88, 587.33] },
  // G major 7 (Bright, resonant, open)
  { bass: 98.00, notes: [196.00, 246.94, 293.66, 370.00, 493.88, 587.33] },
  // D sus 2 (Flowing, modern, uplifting)
  { bass: 73.42, notes: [146.83, 220.00, 293.66, 370.00, 440.00, 587.33] },
  // C add 9 (Melodic, sweet, expressive)
  { bass: 65.41, notes: [130.81, 196.00, 261.63, 329.63, 392.00, 523.25] },
  // B minor 11 (Sophisticated, soulful)
  { bass: 61.74, notes: [123.47, 185.00, 246.94, 370.00, 440.00, 587.33] },
  // A minor 9 (Gentle, introspective resolution)
  { bass: 55.00, notes: [110.00, 164.81, 220.00, 261.63, 329.63, 440.00] },
];

class AcousticGuitarAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isRunning = false;
  private isMuted = false;
  private chordIndex = 0;
  private patternIndex = 0;
  private intervalId: number | null = null;

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.14, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  /**
   * High-fidelity plucked acoustic guitar string synthesis
   * Combines sharp nail/pick transient, dual harmonic oscillators,
   * wooden body resonance bandpass filter, and organic exponential string decay.
   */
  private pluckGuitarString(freq: number, isBass = false, velocity = 0.8) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // 1. Dual Harmonic Pluck Oscillators (Fundamental + String Harmonics)
    const oscFundamental = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const stringGain = this.ctx.createGain();

    // Triangle gives rich wooden warmth, sawtooth adds subtle metallic string shimmer
    oscFundamental.type = 'triangle';
    oscFundamental.frequency.setValueAtTime(freq, now);

    oscHarmonic.type = isBass ? 'sine' : 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * (isBass ? 2.002 : 1.998), now);

    // 2. Acoustic Wooden Body Resonance Filter
    // Acoustic guitars have primary air cavity resonance (~100Hz) and top plate resonance (~3000Hz)
    const bodyFilter = this.ctx.createBiquadFilter();
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(isBass ? 850 : 2800, now);
    bodyFilter.frequency.exponentialRampToValueAtTime(isBass ? 240 : 650, now + (isBass ? 1.8 : 1.4));
    bodyFilter.Q.setValueAtTime(2.2, now);

    // 3. String Transient Envelope (Instantaneous sharp pick attack + exponential acoustic tail)
    const peakGain = (isBass ? 0.38 : 0.24) * velocity;
    stringGain.gain.setValueAtTime(0.0001, now);
    stringGain.gain.linearRampToValueAtTime(peakGain, now + 0.008); // 8ms crisp finger pluck
    stringGain.gain.exponentialRampToValueAtTime(peakGain * 0.45, now + 0.18);
    stringGain.gain.exponentialRampToValueAtTime(0.0001, now + (isBass ? 3.2 : 2.4));

    // Connect audio node graph
    oscFundamental.connect(bodyFilter);
    oscHarmonic.connect(bodyFilter);
    bodyFilter.connect(stringGain);
    stringGain.connect(this.masterGain);

    // Start and auto-stop
    oscFundamental.start(now);
    oscHarmonic.start(now);
    oscFundamental.stop(now + 3.4);
    oscHarmonic.stop(now + 3.4);
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
    this.patternIndex = 0;

    // Fingerstyle fingerpicking pattern rhythm: Bass pluck -> note 1 -> note 2 -> note 3 -> note 4 ...
    const stepTimeMs = 380;
    this.intervalId = window.setInterval(() => {
      if (!this.isRunning || this.isMuted) return;

      const chord = GUITAR_CHORDS[this.chordIndex];
      if (!chord) return;

      if (this.patternIndex === 0) {
        // Thumb bass strike
        this.pluckGuitarString(chord.bass, true, 0.95);
        // Gentle dual string pluck on first beat
        const trebleNote = chord.notes[0];
        if (trebleNote) {
          setTimeout(() => this.pluckGuitarString(trebleNote, false, 0.65), 25);
        }
      } else {
        // Sequential fingerpicked treble strings
        const noteIdx = (this.patternIndex - 1) % chord.notes.length;
        const noteFreq = chord.notes[noteIdx];
        if (noteFreq) {
          // Slight humanized velocity variation
          const vel = 0.6 + Math.random() * 0.3;
          this.pluckGuitarString(noteFreq, false, vel);
        }
      }

      this.patternIndex++;
      // 8 steps per chord for standard 4/4 arpeggiated fingerpicking
      if (this.patternIndex >= 8) {
        this.patternIndex = 0;
        this.chordIndex = (this.chordIndex + 1) % GUITAR_CHORDS.length;
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
      this.masterGain.gain.setTargetAtTime(0.14, now, 0.08);
      if (!this.isRunning) {
        this.start();
      }
    }
  }

  getIsMuted(): boolean {
    return this.isMuted;
  }
}

// Global Singleton Engine
export const globalAudioEngine = new AcousticGuitarAudioEngine();

// Ambient Sound Toggle Button
export const SoundButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [muted, setMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    setMuted(globalAudioEngine.getIsMuted());

    const handleFirstUserInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        globalAudioEngine.start();
        window.removeEventListener('click', handleFirstUserInteraction);
        window.removeEventListener('keydown', handleFirstUserInteraction);
      }
    };

    window.addEventListener('click', handleFirstUserInteraction);
    window.addEventListener('keydown', handleFirstUserInteraction);

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
    };
  }, [hasInteracted]);

  const toggleSound = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !muted;
    setMuted(next);
    globalAudioEngine.setMuted(next);
    if (!next) {
      globalAudioEngine.start();
    }
  }, [muted]);

  return (
    <button
      onClick={toggleSound}
      title={muted ? 'Unmute Acoustic Guitar Melody' : 'Mute Acoustic Guitar Melody'}
      className={`p-2 rounded-full transition-all duration-200 cursor-pointer border shadow-2xs active:scale-95 flex items-center justify-center ${
        muted
          ? 'bg-stone-100 dark:bg-white/5 border-stone-200 dark:border-white/10 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40 text-[#e11d48] dark:text-rose-400 shadow-rose-500/10'
      } ${className}`}
      aria-label="Toggle ambient guitar audio"
    >
      {muted ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4 animate-pulse" />
      )}
    </button>
  );
};
