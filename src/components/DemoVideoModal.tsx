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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-white/15 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Demo Video"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white/90 hover:text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player - Pure Video Only (No Text, No Clutter) */}
        <video
          ref={videoRef}
          src="/videos/sagar-avatar-demo.mp4"
          controls
          autoPlay
          playsInline
          loop
          className="w-full h-full object-contain bg-black"
        />
      </div>
    </div>
  );
};
