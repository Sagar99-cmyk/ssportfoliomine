import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const WelcomeTechBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    // Deep luxurious cyber-space fog
    scene.fog = new THREE.FogExp2(0x060810, 0.012);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 2, 42);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Create Custom Glowing Radial Sprite Texture
    const createParticleTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(251, 191, 36, 0.9)'); // Gold center
        gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.5)'); // Cyan halo
        gradient.addColorStop(0.8, 'rgba(225, 29, 72, 0.2)'); // Subtle magenta edge
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createParticleTexture();

    // 4. Central Interactive 3D Tech Core (Concentric Gyroscopic Holographic Rings)
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, -5);
    scene.add(coreGroup);

    // Outer Tech Ring (Champagne Gold / Amber)
    const ring1Geom = new THREE.TorusGeometry(14, 0.06, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    coreGroup.add(ring1);

    // Middle Tech Ring (Cyber Cyan)
    const ring2Geom = new THREE.TorusGeometry(10.5, 0.05, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    coreGroup.add(ring2);

    // Inner Tech Ring (Radiant Rose)
    const ring3Geom = new THREE.TorusGeometry(7.5, 0.04, 16, 80);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0xe11d48,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.y = Math.PI / 4;
    coreGroup.add(ring3);

    // Core Luminous Wireframe Icosphere (Data Nucleus)
    const icoGeom = new THREE.IcosahedronGeometry(3.6, 2);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const icoCore = new THREE.Mesh(icoGeom, icoMat);
    coreGroup.add(icoCore);

    // Orbiting Data Nodes around the Rings
    const nodeCount = 18;
    const nodeGeom = new THREE.SphereGeometry(0.22, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
    });
    const nodes: THREE.Mesh[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeom, nodeMat);
      coreGroup.add(node);
      nodes.push(node);
    }

    // 5. Flowing 3D Particle Field (Cyber Ocean & Cosmic Constellation)
    const particleCount = 2200;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const palette = [
      new THREE.Color('#38bdf8'), // Cyber Cyan
      new THREE.Color('#818cf8'), // Soft Indigo
      new THREE.Color('#fbbf24'), // Warm Gold
      new THREE.Color('#f59e0b'), // Amber
      new THREE.Color('#e11d48'), // Ruby Rose
      new THREE.Color('#ffffff'), // Stellar White
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Volume distribution with organic wave topology
      const radius = 6 + Math.random() * 55;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i3 + 1] = radius * Math.sin(phi) * 0.7;
      positions[i3 + 2] = -80 + Math.random() * 120;

      originalPositions[i3] = positions[i3];
      originalPositions[i3 + 1] = positions[i3 + 1];
      originalPositions[i3 + 2] = positions[i3 + 2];

      velocities[i3] = (Math.random() - 0.5) * 0.015;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.015;
      velocities[i3 + 2] = 0.02 + Math.random() * 0.05; // Gentle, relaxing forward drift

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 3.5 + 1.2;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      size: 3.2,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(particleGeom, particleMat);
    scene.add(particleSystem);

    // 6. Interactive Cursor Mechanics & Shockwave
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let mouseWorldX = 0;
    let mouseWorldY = 0;
    let shockwaveRadius = -1;
    let shockwaveOriginX = 0;
    let shockwaveOriginY = 0;
    let isInteracting = false;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      mouseX = (clientX / width) * 2 - 1;
      mouseY = -(clientY / height) * 2 + 1;

      // Damped smooth camera orbit
      targetCameraX = mouseX * 8;
      targetCameraY = mouseY * 5;

      mouseWorldX = mouseX * 26;
      mouseWorldY = mouseY * 16;

      if (!hasInteracted) setHasInteracted(true);
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isInteracting = true;
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      const normX = (clientX / width) * 2 - 1;
      const normY = -(clientY / height) * 2 + 1;

      shockwaveOriginX = normX * 26;
      shockwaveOriginY = normY * 16;
      shockwaveRadius = 0;

      if (!hasInteracted) setHasInteracted(true);
    };

    const handlePointerUp = () => {
      isInteracting = false;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 7. Animation Loop (60 FPS with Calming Good Vibe Easing)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera interpolation (relaxed, luxury tilt)
      camera.position.x += (targetCameraX - camera.position.x) * 0.025;
      camera.position.y += (targetCameraY - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      // Rotate central holographic rings with distinct orbital speeds
      ring1.rotation.z = elapsed * 0.12;
      ring1.rotation.y = elapsed * 0.08;

      ring2.rotation.x = Math.PI / 3 + elapsed * 0.15;
      ring2.rotation.z = -elapsed * 0.1;

      ring3.rotation.y = Math.PI / 4 - elapsed * 0.18;
      ring3.rotation.x = elapsed * 0.12;

      // Pulsing icosphere data core (gentle harmonic respiration)
      const corePulse = 1 + Math.sin(elapsed * 1.5) * 0.06;
      icoCore.scale.set(corePulse, corePulse, corePulse);
      icoCore.rotation.y = elapsed * 0.2;
      icoCore.rotation.x = elapsed * 0.1;

      // Position orbiting data nodes along the outer ring
      nodes.forEach((node, idx) => {
        const ringAngle = (idx / nodeCount) * Math.PI * 2 + elapsed * 0.25;
        node.position.x = Math.cos(ringAngle) * 14;
        node.position.y = Math.sin(ringAngle) * 14 * Math.sin(elapsed * 0.1);
        node.position.z = Math.sin(ringAngle) * 7;
      });

      // Expand click shockwave if triggered
      if (shockwaveRadius >= 0) {
        shockwaveRadius += delta * 32;
        if (shockwaveRadius > 60) {
          shockwaveRadius = -1;
        }
      }

      // Update particle field positions with gentle wave & cursor interaction
      const posAttr = particleGeom.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Slow cinematic forward drift
        posArray[i3 + 2] += velocities[i3 + 2];

        // Harmonic cosmic ocean wave undulation
        posArray[i3 + 1] = originalPositions[i3 + 1] + Math.sin(elapsed * 0.8 + originalPositions[i3] * 0.08) * 1.8;

        // Reset particle if past camera
        if (posArray[i3 + 2] > 40) {
          posArray[i3 + 2] = -80;
          const radius = 6 + Math.random() * 55;
          const theta = Math.random() * Math.PI * 2;
          const phi = (Math.random() - 0.5) * Math.PI;
          posArray[i3] = radius * Math.cos(theta) * Math.cos(phi);
          originalPositions[i3] = posArray[i3];
          originalPositions[i3 + 1] = radius * Math.sin(phi) * 0.7;
        }

        // Interactive Cursor Magnetic Vortex
        const dx = mouseWorldX - posArray[i3];
        const dy = mouseWorldY - posArray[i3 + 1];
        const distSq = dx * dx + dy * dy;

        if (distSq < 160) {
          const force = (1 - distSq / 160) * 0.16;
          posArray[i3] += (-dy * 0.06 + dx * 0.02) * force;
          posArray[i3 + 1] += (dx * 0.06 + dy * 0.02) * force;
        }

        // Interactive Energy Shockwave
        if (shockwaveRadius >= 0) {
          const sdx = posArray[i3] - shockwaveOriginX;
          const sdy = posArray[i3 + 1] - shockwaveOriginY;
          const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
          const diff = Math.abs(sdist - shockwaveRadius);

          if (diff < 8) {
            const push = (1 - diff / 8) * 1.8;
            const normSDX = sdist > 0 ? sdx / sdist : 0;
            const normSDY = sdist > 0 ? sdy / sdist : 0;
            posArray[i3] += normSDX * push;
            posArray[i3 + 1] += normSDY * push;
          }
        }
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      ring3Geom.dispose();
      ring3Mat.dispose();
      icoGeom.dispose();
      icoMat.dispose();
      nodeGeom.dispose();
      nodeMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-auto">
      {/* 1. Deep Space Atmospheric Vignette for Maximum Contrast & Readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, rgba(13,16,27,0.3) 0%, rgba(6,8,16,0.85) 60%, #060810 100%)',
        }}
      />

      {/* 2. Interactive 3D Holographic Canvas */}
      <div ref={containerRef} className="absolute inset-0 cursor-crosshair" />

      {/* 3. Subtle Interactive Hint Badge */}
      {!hasInteracted && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-pulse">
          <div className="px-4 py-1.5 rounded-full bg-[#0d111c]/90 border border-white/10 backdrop-blur-md text-[11px] font-mono text-amber-300 flex items-center gap-2 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span>Interactive 3D Galaxy · Move cursor or tap to warp cosmic rings</span>
          </div>
        </div>
      )}
    </div>
  );
};
