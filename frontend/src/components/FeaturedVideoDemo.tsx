import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Sparkles, CheckCircle2, Film } from 'lucide-react';

interface FeaturedVideoDemoProps {
  isLight?: boolean;
}

export const FeaturedVideoDemo: React.FC<FeaturedVideoDemoProps> = ({ isLight = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setDuration(video.duration);
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border shadow-xl transition-all duration-300 p-4 sm:p-6 lg:p-7 ${
        isLight
          ? 'bg-gradient-to-br from-white via-stone-50 to-rose-50/30 border-stone-200/90 shadow-stone-200/60'
          : 'bg-gradient-to-br from-[#121217] via-[#0e0e13] to-[#1c0e14] border-rose-500/30 shadow-black/80'
      }`}
    >
      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200/40 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-rose-500 dark:text-rose-400">
            FEATURED LIVE SYSTEM DEMO
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
            <CheckCircle2 className="w-3 h-3" />
            Verified Showcase
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono font-medium ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
            Blender 3D • Three.js • WebGL 60 FPS
          </span>
        </div>
      </div>

      {/* Main Grid: Video Screen + Architecture Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-center pt-5">
        
        {/* Video Player Container */}
        <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden shadow-2xl bg-black border border-stone-800">
          <video
            ref={videoRef}
            src="/videos/sagar-avatar-demo.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-auto aspect-video object-contain bg-black cursor-pointer"
            onClick={togglePlay}
          />

          {/* Video Floating Controls Bar */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between gap-3 text-white z-20 opacity-90 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                title={isPlaying ? 'Pause Video' : 'Play Video'}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all cursor-pointer active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all cursor-pointer active:scale-95"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-stone-300" /> : <Volume2 className="w-4 h-4 text-rose-400" />}
              </button>
            </div>

            {/* Scrubber Progress Line */}
            <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden mx-2">
              <div
                className="h-full bg-rose-500 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              onClick={toggleFullscreen}
              title="Fullscreen"
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all cursor-pointer active:scale-95"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Narrative & Engineering Specs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-rose-500 dark:text-rose-400">
              <Film className="w-4 h-4" />
              <span>Interactive 3D Demo Walkthrough</span>
            </div>
            <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${isLight ? 'text-stone-900' : 'text-white'}`}>
              Realistic 3D Digital Twin & Full-Stack Platform
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
              High-fidelity digital human reconstruction and system demo. Engineered using real photographic reference, 
              Blender facial topology, Three.js shaders, and real-time natural eye blink & expression morph targets.
            </p>
          </div>

          {/* Core Feature Matrix */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-stone-200' : 'bg-white/5 border-white/10'}`}>
              <span className="text-[10px] text-stone-400 block uppercase">Framerate</span>
              <span className="font-bold text-emerald-500">60 FPS Hardware WebGL</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-stone-200' : 'bg-white/5 border-white/10'}`}>
              <span className="text-[10px] text-stone-400 block uppercase">3D Pipeline</span>
              <span className="font-bold text-rose-500">Blender + KeenTools</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-stone-200' : 'bg-white/5 border-white/10'}`}>
              <span className="text-[10px] text-stone-400 block uppercase">Facial Motion</span>
              <span className="font-bold text-amber-500">Real-time Saccades & Blinks</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-stone-200' : 'bg-white/5 border-white/10'}`}>
              <span className="text-[10px] text-stone-400 block uppercase">Lighting Rig</span>
              <span className="font-bold text-sky-500">Studio 3-Point Warm Key</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

