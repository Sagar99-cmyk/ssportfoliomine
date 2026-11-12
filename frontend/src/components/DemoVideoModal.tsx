import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Autoplay video on modal open and pause on close
  useEffect(() => {
    if (isOpen) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Demo Video Player"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-[94vw] max-h-[92vh] flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-black shadow-[0_0_60px_rgba(0,0,0,0.95)] border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Demo Video"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-black text-white border border-white/30 flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player - Adaptive Portrait/Vertical Video Container */}
        <video
          ref={videoRef}
          src="/videos/sagar-avatar-demo.mp4"
          controls
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          className="max-h-[85vh] sm:max-h-[88vh] max-w-[90vw] sm:max-w-md md:max-w-lg w-auto h-auto object-contain rounded-xl bg-black"
        />
      </div>
    </div>
  );
};
