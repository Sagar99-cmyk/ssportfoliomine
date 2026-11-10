import React, { useState, useEffect } from 'react';

interface ProfessionalPhotoAvatarProps {
  className?: string;
}

export const ProfessionalPhotoAvatar: React.FC<ProfessionalPhotoAvatarProps> = ({ className = '' }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Fast, natural human eye blink cycle (140ms duration, natural interval of 5 to 6 seconds)
  useEffect(() => {
    let blinkTimeout: number;
    let timer: number;

    const scheduleNextBlink = () => {
      const intervalMs = Math.floor(Math.random() * 1000) + 5000;
      
      timer = window.setTimeout(() => {
        setIsBlinking(true);

        blinkTimeout = window.setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 140);
      }, intervalMs);
    };

    scheduleNextBlink();

    return () => {
      clearTimeout(timer);
      clearTimeout(blinkTimeout);
    };
  }, []);

  // Quick manual blink on cursor interaction
  const handleInteraction = () => {
    if (!isBlinking) {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center select-none bg-transparent ${className}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 
        Main Avatar Container - Zero Background, Pure Transparent Backdrop
        Framed with an elegant glowing border ring with full responsiveness 
      */}
      <div
        onMouseEnter={handleInteraction}
        onClick={handleInteraction}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full border-2 border-rose-500/60 ring-4 ring-rose-500/20 shadow-[0_0_30px_rgba(225,29,72,0.35)] flex items-center justify-center overflow-hidden bg-transparent cursor-pointer group select-none transition-transform duration-300 hover:scale-[1.02]"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      >
        {/* Transparent Frame - No Card or Background Box */}
        <div
          className="relative w-full h-full bg-transparent flex items-center justify-center select-none pointer-events-none"
        >
          {/* Base Portrait (Clean cutout, transparent backdrop) */}
          <img
            src="/profile-transparent-open.png"
            alt="Sagar Singh"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className="absolute inset-0 w-full h-full object-contain object-bottom select-none pointer-events-none"
            style={{
              imageRendering: 'auto',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
            }}
            loading="eager"
          />

          {/* Eyelid Closed Overlay */}
          <img
            src="/profile-transparent-closed.png"
            alt="Sagar Singh Blink"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className="absolute inset-0 w-full h-full object-contain object-bottom select-none pointer-events-none"
            style={{
              imageRendering: 'auto',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              display: isBlinking ? 'block' : 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
            }}
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};
