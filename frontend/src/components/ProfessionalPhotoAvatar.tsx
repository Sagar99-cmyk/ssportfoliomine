import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

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
      // Natural interval strictly between 5 and 6 seconds (5000ms - 6000ms)
      const intervalMs = Math.floor(Math.random() * 1000) + 5000;
      
      timer = window.setTimeout(() => {
        setIsBlinking(true);

        // Fast natural human eye blink (140ms) with zero transition flash
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
      {/* Main Avatar Container - Fixed, Unmovable & Drag-Protected */}
      <div
        onMouseEnter={handleInteraction}
        onClick={handleInteraction}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center overflow-visible bg-transparent cursor-pointer group select-none"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      >
        {/* Transparent Container with Shadow on Parent to Prevent Blink Shadow Flicker */}
        <div
          className="relative w-full h-full bg-transparent flex items-center justify-center select-none pointer-events-none"
          style={{
            filter: 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.75))',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
          }}
        >
          {/* Base Portrait (Always 100% Solid, Never Fades, Zero Flash, Unmovable & Drag-Protected) */}
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

          {/* Eyelid Closed Overlay (Instant Cut - Zero Dissolve Flash, Unmovable & Drag-Protected) */}
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
