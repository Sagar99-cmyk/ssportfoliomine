import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Volume2, VolumeX } from 'lucide-react';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Lock background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Autoplay video on modal open and pause on close
  useEffect(() => {
    if (isOpen) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          // If browser policy blocks autoplay with sound, fall back to muted autoplay
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isOpen]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Demo Video Player"
      className="fixed inset-0 !z-[999999] flex items-center justify-center bg-black/92 backdrop-blur-md p-2 sm:p-6 animate-fadeIn select-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
      }}
      onClick={onClose}
    >
      <div
        className="relative max-w-[94vw] max-h-[92vh] flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-black shadow-[0_0_80px_rgba(0,0,0,0.95)] border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top Bar Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 flex items-center gap-2">
          {/* Mute / Unmute Quick Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (videoRef.current) {
                videoRef.current.muted = !videoRef.current.muted;
                setIsMuted(videoRef.current.muted);
              }
            }}
            aria-label={isMuted ? 'Unmute Video' : 'Mute Video'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-black text-white border border-white/30 flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-90"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close Demo Video"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-black text-white border border-white/30 flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-90"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player - Adaptive Portrait/Vertical Video Container */}
        <video
          ref={videoRef}
          src="/videos/sagar-avatar-demo.mp4"
          controls
          autoPlay
          playsInline
          loop
          preload="auto"
          className="max-h-[85vh] sm:max-h-[88vh] max-w-[90vw] sm:max-w-md md:max-w-lg w-auto h-auto object-contain rounded-xl bg-black"
        >
          <source src="/videos/sagar-avatar-demo.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
