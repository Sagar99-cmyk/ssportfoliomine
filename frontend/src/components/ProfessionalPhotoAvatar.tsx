import React, { useState, useEffect, useRef } from 'react';

interface ProfessionalPhotoAvatarProps {
  className?: string;
  sizeClassName?: string;
  showStatusIndicator?: boolean;
}

export const ProfessionalPhotoAvatar: React.FC<ProfessionalPhotoAvatarProps> = ({
  className = '',
  sizeClassName = 'w-44 h-44 xs:w-48 xs:h-48 sm:w-60 sm:h-60 md:w-68 md:h-68 lg:w-76 lg:h-76',
  showStatusIndicator = true,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isNodding, setIsNodding] = useState(false);

  // 3D Parallax & Tilt State
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const animFrameRef = useRef<number | null>(null);
  const targetTiltRef = useRef({ x: 0, y: 0, gx: 50, gy: 50 });
  const currentTiltRef = useRef({ x: 0, y: 0, gx: 50, gy: 50 });

  // Natural Human Eye Blink Cycle (4.5s to 6.2s intervals, 140ms duration, occasional double-blink)
  useEffect(() => {
    let blinkTimer: number;
    let finishTimer: number;

    const scheduleNextBlink = () => {
      // Natural randomized interval between 4500ms and 6200ms
      const intervalMs = Math.floor(Math.random() * 1700) + 4500;

      blinkTimer = window.setTimeout(() => {
        setIsBlinking(true);

        finishTimer = window.setTimeout(() => {
          setIsBlinking(false);

          // 12% probability of a natural human micro-double-blink
          if (Math.random() < 0.12) {
            window.setTimeout(() => {
              setIsBlinking(true);
              window.setTimeout(() => {
                setIsBlinking(false);
                scheduleNextBlink();
              }, 110);
            }, 90);
          } else {
            scheduleNextBlink();
          }
        }, 135);
      }, intervalMs);
    };

    scheduleNextBlink();

    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  // 3D Smooth Tilt Parallax Animation Loop
  useEffect(() => {
    let clock = 0;

    const animate = () => {
      clock += 0.02;

      // Gentle organic idle breathing lift
      const idleLiftX = Math.sin(clock * 0.8) * 1.2;
      const idleLiftY = Math.cos(clock * 1.1) * 1.5;

      // Smooth interpolation (lerp)
      currentTiltRef.current.x += (targetTiltRef.current.x + idleLiftX - currentTiltRef.current.x) * 0.085;
      currentTiltRef.current.y += (targetTiltRef.current.y + idleLiftY - currentTiltRef.current.y) * 0.085;
      currentTiltRef.current.gx += (targetTiltRef.current.gx - currentTiltRef.current.gx) * 0.085;
      currentTiltRef.current.gy += (targetTiltRef.current.gy - currentTiltRef.current.gy) * 0.085;

      setTilt({
        rotateX: currentTiltRef.current.x,
        rotateY: currentTiltRef.current.y,
        glareX: currentTiltRef.current.gx,
        glareY: currentTiltRef.current.gy,
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Pointer Move Handler for 3D Perspective Tilt
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1

    // Clamped 3D rotation angles
    targetTiltRef.current.x = -ny * 13; // Pitch
    targetTiltRef.current.y = nx * 15;  // Yaw
    targetTiltRef.current.gx = (nx + 1) * 50;
    targetTiltRef.current.gy = (ny + 1) * 50;
  };

  const handlePointerLeave = () => {
    targetTiltRef.current.x = 0;
    targetTiltRef.current.y = 0;
    targetTiltRef.current.gx = 50;
    targetTiltRef.current.gy = 50;
  };

  // Mobile Touch Tilt Handlers
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const nx = ((touch.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const ny = ((touch.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1

    targetTiltRef.current.x = -Math.max(-1, Math.min(1, ny)) * 14;
    targetTiltRef.current.y = Math.max(-1, Math.min(1, nx)) * 16;
    targetTiltRef.current.gx = (nx + 1) * 50;
    targetTiltRef.current.gy = (ny + 1) * 50;
  };

  const handleTouchEnd = () => {
    targetTiltRef.current.x = 0;
    targetTiltRef.current.y = 0;
    targetTiltRef.current.gx = 50;
    targetTiltRef.current.gy = 50;
  };

  // Interactive Click / Tap: triggers a conscious eye blink & nodding reaction
  const handleInteraction = () => {
    setIsBlinking(true);
    setIsNodding(true);

    setTimeout(() => {
      setIsBlinking(false);
    }, 160);

    setTimeout(() => {
      setIsNodding(false);
    }, 380);
  };

  return (
    <div
      className={`relative flex flex-col items-center select-none bg-transparent ${className}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 
        3D Interactive Responsive Avatar Container:
        - Perspective container with smooth rotation
        - Glowing crimson border ring
        - Zero background box (translucent)
      */}
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleInteraction}
        title="Interactive 3D Profile · Move to tilt in 3D · Click to blink / nod"
        className={`relative ${sizeClassName} rounded-full border-2 border-rose-500/80 ring-4 ring-rose-500/20 shadow-[0_0_35px_rgba(225,29,72,0.36)] flex items-center justify-center overflow-hidden bg-transparent cursor-pointer group select-none transition-transform duration-200 active:scale-95`}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          transform: `perspective(900px) rotateX(${tilt.rotateX + (isNodding ? 7 : 0)}deg) rotateY(${tilt.rotateY}deg) scale3d(1, 1, 1)`,
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      >
        {/* Soft, warm 3D dynamic specular reflection (Warm Cyber-Crimson/Amber - No harsh white glare) */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-300 z-20"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(225, 29, 72, 0.22) 0%, rgba(245, 158, 11, 0.12) 35%, rgba(0, 0, 0, 0) 70%)`,
          }}
        />

        {/* Inner Image Frame */}
        <div
          className="relative w-full h-full bg-transparent flex items-center justify-center select-none pointer-events-none"
          style={{
            transform: 'translateZ(18px)',
            filter: 'drop-shadow(0 12px 28px rgba(0, 0, 0, 0.45))',
          }}
        >
          {/* Base Open Eyes Portrait (100% Solid, Never Fades, Zero Flash) */}
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
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/profile2.png';
            }}
          />

          {/* Eyelid Closed Overlay (Instant Cut - Natural Eye Blink) */}
          <img
            src="/profile-transparent-closed.png"
            alt="Sagar Singh Blink"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className="absolute inset-0 w-full h-full object-contain object-bottom select-none pointer-events-none z-10"
            style={{
              imageRendering: 'auto',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(1px)',
              display: isBlinking ? 'block' : 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
            }}
            loading="eager"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/profile2-closed.png';
            }}
          />
        </div>

        {/* Online Availability Pulse Indicator */}
        {showStatusIndicator && (
          <span className="absolute bottom-3 right-6 xs:right-8 flex h-3.5 w-3.5 pointer-events-none z-30">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white shadow-xs"></span>
          </span>
        )}
      </div>
    </div>
  );
};
