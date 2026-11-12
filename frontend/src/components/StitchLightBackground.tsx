import React, { useEffect, useRef } from 'react';

export const StitchLightBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number;
    const ease = 0.065;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) - 0.5;
      targetY = (e.clientY / window.innerHeight) - 0.5;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      targetX = (e.touches[0].clientX / window.innerWidth) - 0.5;
      targetY = (e.touches[0].clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const animate = () => {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      const px = currentX * 42; // max parallax shift in px
      const py = currentY * 42;

      el.style.setProperty('--parallax-x', `${px}px`);
      el.style.setProperty('--parallax-y', `${py}px`);

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="tech-bg-light"
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #faf9f6 0%, #f6f3ed 50%, #f2ede4 100%)',
      }}
    >
      <style>{`
        #tech-bg-light svg {
          width: 100%;
          height: 100%;
          opacity: 0.38;
          transition: opacity 0.5s ease;
        }

        @keyframes techFloatA {
          0%, 100% {
            transform: translate(calc(var(--parallax-x, 0px) * 0.8), calc(var(--parallax-y, 0px) * 0.8)) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translate(calc(var(--parallax-x, 0px) * 0.8), calc(var(--parallax-y, 0px) * 0.8)) translateY(-16px) rotate(2.5deg);
          }
        }

        @keyframes techFloatB {
          0%, 100% {
            transform: translate(calc(var(--parallax-x, 0px) * -1.1), calc(var(--parallax-y, 0px) * -1.1)) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translate(calc(var(--parallax-x, 0px) * -1.1), calc(var(--parallax-y, 0px) * -1.1)) translateY(14px) rotate(-3deg);
          }
        }

        @keyframes techFloatC {
          0%, 100% {
            transform: translate(calc(var(--parallax-x, 0px) * 0.55), calc(var(--parallax-y, 0px) * -0.55)) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translate(calc(var(--parallax-x, 0px) * 0.55), calc(var(--parallax-y, 0px) * -0.55)) translateY(-10px) rotate(3.5deg);
          }
        }

        @keyframes techPulseGlow {
          0%, 100% { opacity: 0.28; }
          50% { opacity: 0.55; }
        }

        @keyframes techDashFlow {
          0% { stroke-dashoffset: 60; }
          100% { stroke-dashoffset: 0; }
        }

        .tech-float-a { animation: techFloatA 10s ease-in-out infinite; }
        .tech-float-b { animation: techFloatB 12s ease-in-out infinite; }
        .tech-float-c { animation: techFloatC 14s ease-in-out infinite; }
        .tech-pulse { animation: techPulseGlow 4s ease-in-out infinite; }
        .tech-flow { animation: techDashFlow 3.5s linear infinite; }
      `}</style>

      {/* 
        Responsive SVG 3D Isometric Tech Background 
        Auto-scales on mobile, tablet, and desktop without pixelation
      */}
      <svg
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Cylinder Gradients for Database */}
          <linearGradient id="cyl1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#C084FC" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#BE123C" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="cyl2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
          </linearGradient>

          {/* 3D Isometric Cube Face Gradients */}
          <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5D0FE" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4C0519" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#881337" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7E22CE" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#9333EA" stopOpacity="0.3" />
          </linearGradient>

          {/* Golden Rose Cube */}
          <linearGradient id="cubeGoldTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="cubeGoldLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B45309" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#92400E" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="cubeGoldRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
          </linearGradient>

          {/* Horizontal Glow Bands */}
          <linearGradient id="glowLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
            <stop offset="50%" stopColor="#E11D48" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="glowLine2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" stopOpacity="0" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </linearGradient>

          {/* Polyhedral Shading Gradients (Image 2) */}
          <linearGradient id="polyCyan1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="polyCyan2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="polyRose1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#E11D48" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="polyRose2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="polyTeal1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="polyTeal2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="polyPurple1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="polyAmber1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* ── 1. CIRCUIT GRID & DATA BUS LINES ── */}
        <g opacity="0.3" className="tech-pulse">
          <line x1="0" y1="180" x2="1400" y2="180" stroke="#8B5CF6" strokeWidth="0.8" strokeDasharray="6 14" />
          <line x1="0" y1="420" x2="1400" y2="420" stroke="#BE123C" strokeWidth="0.8" strokeDasharray="6 14" />
          <line x1="0" y1="680" x2="1400" y2="680" stroke="#7C3AED" strokeWidth="0.8" strokeDasharray="6 14" />
          <line x1="260" y1="0" x2="260" y2="900" stroke="#F59E0B" strokeWidth="0.8" strokeDasharray="6 14" />
          <line x1="680" y1="0" x2="680" y2="900" stroke="#E11D48" strokeWidth="0.8" strokeDasharray="6 14" />
          <line x1="1120" y1="0" x2="1120" y2="900" stroke="#8B5CF6" strokeWidth="0.8" strokeDasharray="6 14" />
        </g>

        {/* ── 2. GLOWING HORIZONTAL ACCENT BANDS ── */}
        <rect x="0" y="176" width="1400" height="8" fill="url(#glowLine)" opacity="0.3" className="tech-pulse" />
        <rect x="0" y="416" width="1400" height="8" fill="url(#glowLine2)" opacity="0.28" className="tech-pulse" style={{ animationDelay: '-2s' }} />
        <rect x="0" y="676" width="1400" height="8" fill="url(#glowLine)" opacity="0.25" className="tech-pulse" style={{ animationDelay: '-1s' }} />

        {/* ── 3. RUNNING DATA FLOW LINES ── */}
        <line className="tech-flow" x1="100" y1="70" x2="420" y2="300" stroke="#E11D48" strokeWidth="1.5" strokeDasharray="8 12" opacity="0.45" />
        <line className="tech-flow" x1="960" y1="110" x2="1280" y2="360" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="8 12" opacity="0.45" style={{ animationDelay: '-1.5s' }} />
        <line className="tech-flow" x1="180" y1="580" x2="520" y2="820" stroke="#F59E0B" strokeWidth="1.3" strokeDasharray="6 10" opacity="0.4" style={{ animationDelay: '-0.8s' }} />
        <line className="tech-flow" x1="1060" y1="540" x2="740" y2="760" stroke="#E11D48" strokeWidth="1.3" strokeDasharray="6 10" opacity="0.4" style={{ animationDelay: '-2s' }} />

        {/* ── 4. 3D DATABASE CYLINDER (TOP-RIGHT) ── */}
        <g className="tech-float-b" style={{ transformOrigin: '1250px 150px' }}>
          <rect x="1200" y="100" width="100" height="80" rx="4" fill="url(#cyl1)" stroke="#8B5CF6" strokeWidth="1.2" opacity="0.75" />
          <ellipse cx="1250" cy="100" rx="50" ry="14" fill="#F5D0FE" fillOpacity="0.65" stroke="#C084FC" strokeWidth="1.4" opacity="0.8" />
          <ellipse cx="1250" cy="180" rx="50" ry="14" fill="#8B5CF6" fillOpacity="0.25" stroke="#8B5CF6" strokeWidth="1.1" opacity="0.55" />
          <line x1="1200" y1="120" x2="1300" y2="120" stroke="#C084FC" strokeWidth="0.8" opacity="0.5" />
          <line x1="1200" y1="140" x2="1300" y2="140" stroke="#C084FC" strokeWidth="0.8" opacity="0.45" />
          <line x1="1200" y1="160" x2="1300" y2="160" stroke="#C084FC" strokeWidth="0.8" opacity="0.4" />
          <text x="1250" y="148" textAnchor="middle" fontSize="12" fill="#7E22CE" opacity="0.9" fontFamily="'Inter', sans-serif" fontWeight="700" letterSpacing="1">
            DATA
          </text>
        </g>

        {/* ── 5. 3D ISOMETRIC CUBE (BOTTOM-LEFT) ── */}
        <g className="tech-float-c" style={{ transformOrigin: '200px 720px' }}>
          <polygon points="200,670 260,690 200,710 140,690" fill="url(#cubeTop)" stroke="#A855F7" strokeWidth="1.1" opacity="0.75" />
          <polygon points="140,690 200,710 200,770 140,750" fill="url(#cubeLeft)" stroke="#BE123C" strokeWidth="1.1" opacity="0.7" />
          <polygon points="200,710 260,690 260,750 200,770" fill="url(#cubeRight)" stroke="#8B5CF6" strokeWidth="1.1" opacity="0.65" />
          <line x1="170" y1="700" x2="230" y2="700" stroke="#E9D5FF" strokeWidth="0.8" opacity="0.5" />
        </g>

        {/* ── 6. 3D ISOMETRIC GOLD CUBE (TOP-CENTER-RIGHT) ── */}
        <g className="tech-float-a" style={{ transformOrigin: '880px 80px' }}>
          <polygon points="880,50 940,70 880,90 820,70" fill="url(#cubeGoldTop)" stroke="#F59E0B" strokeWidth="1" opacity="0.75" />
          <polygon points="820,70 880,90 880,130 820,110" fill="url(#cubeGoldLeft)" stroke="#B45309" strokeWidth="1" opacity="0.7" />
          <polygon points="880,90 940,70 940,110 880,130" fill="url(#cubeGoldRight)" stroke="#D97706" strokeWidth="1" opacity="0.65" />
        </g>

        {/* ── 7. 3D ISOMETRIC CUBE (MID-PAGE) ── */}
        <g className="tech-float-b" style={{ transformOrigin: '540px 380px' }}>
          <polygon points="540,348 600,368 540,388 480,368" fill="url(#cubeTop)" stroke="#8B5CF6" strokeWidth="1" opacity="0.65" />
          <polygon points="480,368 540,388 540,428 480,408" fill="url(#cubeLeft)" stroke="#BE123C" strokeWidth="1" opacity="0.6" />
          <polygon points="540,388 600,368 600,408 540,428" fill="url(#cubeRight)" stroke="#7C3AED" strokeWidth="1" opacity="0.58" />
        </g>

        {/* ── 8. NEURAL NETWORK NODE CLUSTER (TOP-LEFT) ── */}
        <g className="tech-float-a" style={{ animationDuration: '9s' }}>
          <circle cx="60" cy="130" r="7" fill="none" stroke="#E11D48" strokeWidth="1.5" opacity="0.65" />
          <circle cx="60" cy="165" r="7" fill="none" stroke="#E11D48" strokeWidth="1.5" opacity="0.65" />
          <circle cx="60" cy="200" r="7" fill="none" stroke="#E11D48" strokeWidth="1.5" opacity="0.65" />
          <circle cx="115" cy="140" r="8" fill="#E11D48" fillOpacity="0.25" stroke="#E11D48" strokeWidth="1.5" opacity="0.7" />
          <circle cx="115" cy="175" r="8" fill="#E11D48" fillOpacity="0.25" stroke="#E11D48" strokeWidth="1.5" opacity="0.7" />
          <circle cx="168" cy="158" r="10" fill="#8B5CF6" fillOpacity="0.35" stroke="#C084FC" strokeWidth="1.8" opacity="0.75" />
          <line x1="67" y1="130" x2="107" y2="140" stroke="#E11D48" strokeWidth="0.9" opacity="0.5" />
          <line x1="67" y1="165" x2="107" y2="140" stroke="#E11D48" strokeWidth="0.9" opacity="0.5" />
          <line x1="67" y1="200" x2="107" y2="175" stroke="#E11D48" strokeWidth="0.9" opacity="0.5" />
          <line x1="123" y1="140" x2="159" y2="158" stroke="#8B5CF6" strokeWidth="1.1" opacity="0.6" />
          <line x1="123" y1="175" x2="159" y2="158" stroke="#8B5CF6" strokeWidth="1.1" opacity="0.6" />
        </g>

        {/* ── 9. ORBITAL DATA RINGS (CENTER BACKGROUND) ── */}
        <g className="tech-float-c" style={{ animationDuration: '16s' }} opacity="0.35">
          <ellipse cx="700" cy="450" rx="220" ry="70" fill="none" stroke="#8B5CF6" strokeWidth="1.2" strokeDasharray="10 8" />
          <ellipse cx="700" cy="450" rx="320" ry="100" fill="none" stroke="#E11D48" strokeWidth="1" strokeDasharray="14 12" />
        </g>

        {/* ── 10. FLOATING 3D POLYHEDRONS (IMAGE 2 STITCH GEOMETRIC CLUSTER) ── */}
        {/* Cyan Prism */}
        <g className="tech-float-a" style={{ transformOrigin: '320px 180px', animationDuration: '11s' }}>
          <polygon points="320,130 360,190 280,180" fill="url(#polyCyan1)" stroke="#0284C7" strokeWidth="1" opacity="0.8" />
          <polygon points="360,190 410,160 320,130" fill="url(#polyCyan2)" stroke="#38BDF8" strokeWidth="1" opacity="0.75" />
          <polygon points="280,180 360,190 340,230" fill="#0369A1" opacity="0.65" stroke="#0284C7" strokeWidth="0.8" />
        </g>

        {/* Faceted Crimson / Rose Polyhedron */}
        <g className="tech-float-b" style={{ transformOrigin: '480px 220px', animationDuration: '13s' }}>
          <polygon points="480,170 530,200 480,240 430,200" fill="url(#polyRose1)" stroke="#BE123C" strokeWidth="1" opacity="0.82" />
          <polygon points="480,170 430,200 460,250" fill="url(#polyRose2)" stroke="#FB7185" strokeWidth="0.9" opacity="0.75" />
          <polygon points="530,200 480,240 540,250" fill="#9F1239" opacity="0.7" stroke="#881337" strokeWidth="0.8" />
          <line x1="480" y1="170" x2="480" y2="240" stroke="#FFE4E6" strokeWidth="0.8" opacity="0.6" />
        </g>

        {/* Teal Hexagonal Crystal */}
        <g className="tech-float-c" style={{ transformOrigin: '180px 480px', animationDuration: '15s' }}>
          <polygon points="180,440 230,460 230,510 180,530 130,510 130,460" fill="url(#polyTeal1)" stroke="#059669" strokeWidth="1" opacity="0.78" />
          <polygon points="180,440 230,460 180,485 130,460" fill="url(#polyTeal2)" opacity="0.8" />
          <polygon points="130,460 180,485 180,530 130,510" fill="#047857" opacity="0.65" />
          <line x1="180" y1="485" x2="230" y2="510" stroke="#A7F3D0" strokeWidth="0.8" opacity="0.5" />
        </g>

        {/* Purple Slanted Prism */}
        <g className="tech-float-a" style={{ transformOrigin: '680px 480px', animationDuration: '14s' }}>
          <polygon points="640,430 730,450 710,540 620,520" fill="url(#polyPurple1)" stroke="#7E22CE" strokeWidth="1" opacity="0.75" />
          <polygon points="640,430 730,450 710,480 620,460" fill="#E9D5FF" opacity="0.55" />
        </g>

        {/* Amber Dodecahedron */}
        <g className="tech-float-b" style={{ transformOrigin: '580px 600px', animationDuration: '12s' }}>
          <polygon points="580,550 630,570 650,620 600,650 550,620 540,570" fill="url(#polyAmber1)" stroke="#B45309" strokeWidth="1" opacity="0.8" />
          <polygon points="580,550 630,570 590,600" fill="#FDE68A" opacity="0.6" />
          <polygon points="590,600 650,620 600,650" fill="#D97706" opacity="0.7" />
        </g>

        {/* Violet Inverted Pyramid */}
        <g className="tech-float-c" style={{ transformOrigin: '1180px 380px', animationDuration: '10s' }}>
          <polygon points="1130,340 1230,340 1180,420" fill="#A855F7" stroke="#7E22CE" strokeWidth="1" opacity="0.8" />
          <polygon points="1130,340 1180,360 1180,420" fill="#C084FC" opacity="0.6" />
          <polygon points="1230,340 1180,360 1180,420" fill="#6B21A8" opacity="0.7" />
        </g>

        {/* Ruby Octahedron Diamond */}
        <g className="tech-float-a" style={{ transformOrigin: '1200px 580px', animationDuration: '13s' }}>
          <polygon points="1200,530 1240,580 1200,640 1160,580" fill="url(#polyRose1)" stroke="#BE123C" strokeWidth="1" opacity="0.82" />
          <polygon points="1200,530 1240,580 1200,590" fill="#FDA4AF" opacity="0.75" />
          <polygon points="1160,580 1200,590 1200,640" fill="#9F1239" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
};
