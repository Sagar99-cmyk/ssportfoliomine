import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Welcome3DRedWave: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, and Atmospheric Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.008);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    // Tilted camera angle to showcase the majestic 3D depth of the spiral galaxy disk
    camera.position.set(0, 22, 42);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Galaxy Hierarchy Root
    const galaxyRoot = new THREE.Group();
    // Tilt the galactic disk slightly for a dynamic astronomical view
    galaxyRoot.rotation.x = 0.48;
    galaxyRoot.rotation.z = -0.15;
    scene.add(galaxyRoot);

    // =========================================================================
    // 3. MILKY WAY SPIRAL GALAXY SIMULATION (22,000+ LUMINOUS STAR PARTICLES)
    // Inspired by ChatGPT Argon 4 cosmic particle design: serene, clean, zero zigzag
    // =========================================================================
    const particleCount = 24000;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    // Spiral Parameters
    const arms = 4;
    const maxRadius = 32.0;
    const coreRadius = 4.5;

    // Galaxy Color Palette (Golden Nucleus, Violet Dust, Cyan Nebula, Rose Starbursts)
    const colorCore = new THREE.Color(0xfef08a);    // Warm Golden Starlight Nucleus
    const colorAmber = new THREE.Color(0xf59e0b);   // Inner Arm Amber
    const colorRose = new THREE.Color(0xf43f5e);    // Hydrogen Nebular Pink/Rose
    const colorViolet = new THREE.Color(0xa855f7);  // Interstellar Violet
    const colorCyan = new THREE.Color(0x38bdf8);    // Outer Arm Cyan Starlight

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Distance from galactic center with higher density towards the nucleus
      const radiusRatio = Math.pow(Math.random(), 1.7);
      const radius = radiusRatio * maxRadius;

      // Spiral Arm Angle: Theta = ArmAngle + SpiralCurve
      const armIndex = i % arms;
      const spinAngle = (armIndex / arms) * Math.PI * 2;
      const curveAngle = radius * 0.42; // Logarithmic spiral twist

      // Natural random interstellar dispersion / thickness
      const randomSpreadX = (Math.pow(Math.random(), 2.5) * (Math.random() < 0.5 ? 1 : -1)) * (radius * 0.16 + 0.3);
      const randomSpreadZ = (Math.pow(Math.random(), 2.5) * (Math.random() < 0.5 ? 1 : -1)) * (radius * 0.16 + 0.3);
      // Disk vertical thickness (thicker at core, razor-thin at spiral periphery)
      const diskHeight = Math.max(0.2, (1 - radius / maxRadius) * 2.8);
      const randomSpreadY = (Math.random() - 0.5) * diskHeight;

      positions[i3] = Math.cos(spinAngle + curveAngle) * radius + randomSpreadX;
      positions[i3 + 1] = randomSpreadY;
      positions[i3 + 2] = Math.sin(spinAngle + curveAngle) * radius + randomSpreadZ;

      // Color Mixing based on distance from galactic core
      const mixedColor = new THREE.Color();
      if (radius < coreRadius) {
        // Deep luminous nucleus
        mixedColor.lerpColors(colorCore, colorAmber, radius / coreRadius);
      } else {
        // Arms transition smoothly: Amber -> Rose -> Violet -> Cyan
        const t = (radius - coreRadius) / (maxRadius - coreRadius);
        if (t < 0.35) {
          mixedColor.lerpColors(colorAmber, colorRose, t / 0.35);
        } else if (t < 0.7) {
          mixedColor.lerpColors(colorRose, colorViolet, (t - 0.35) / 0.35);
        } else {
          mixedColor.lerpColors(colorViolet, colorCyan, (t - 0.7) / 0.3);
        }
      }

      // Add occasional pure diamond star brilliance
      if (Math.random() < 0.08) {
        mixedColor.addScalar(0.4);
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      // Variable particle scales for realistic depth
      scales[i] = radius < coreRadius ? Math.random() * 1.8 + 1.2 : Math.random() * 1.2 + 0.6;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Particle Material with Soft Additive Glow
    const galaxyMaterial = new THREE.PointsMaterial({
      size: 0.95,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const galaxyPoints = new THREE.Points(geometry, galaxyMaterial);
    galaxyRoot.add(galaxyPoints);

    // =========================================================================
    // 4. GALACTIC NUCLEUS AURA (Warm Golden Core Glow Sphere)
    // =========================================================================
    const coreGlowGeo = new THREE.SphereGeometry(3.2, 32, 32);
    const coreGlowMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
    });
    const coreGlow = new THREE.Mesh(coreGlowGeo, coreGlowMat);
    galaxyRoot.add(coreGlow);

    // Secondary Outer Core Corona
    const coronaGeo = new THREE.SphereGeometry(5.8, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    galaxyRoot.add(corona);

    // =========================================================================
    // 5. DEEP BACKGROUND STARFIELD & CELESTIAL DUST (Calm, Non-Jittering)
    // =========================================================================
    const deepStarCount = 1200;
    const deepStarGeo = new THREE.BufferGeometry();
    const deepStarPos = new Float32Array(deepStarCount * 3);

    for (let i = 0; i < deepStarCount; i++) {
      deepStarPos[i * 3] = (Math.random() - 0.5) * 220;
      deepStarPos[i * 3 + 1] = (Math.random() - 0.5) * 140;
      deepStarPos[i * 3 + 2] = (Math.random() - 0.5) * 140 - 20;
    }

    deepStarGeo.setAttribute('position', new THREE.BufferAttribute(deepStarPos, 3));
    const deepStarMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.45,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const deepStars = new THREE.Points(deepStarGeo, deepStarMat);
    scene.add(deepStars);

    // =========================================================================
    // 6. INTERACTIVE PARALLAX & SERENE SLOW ROTATION
    // =========================================================================
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      mouseX = (clientX / width - 0.5) * 2;
      mouseY = -(clientY / height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    let clock = 0;
    let animId: number;

    const animate = () => {
      clock += 0.005;

      // Serene, tranquil galactic rotation (No zigzag, perfectly smooth cosmic spin)
      galaxyRoot.rotation.y = clock * 0.12;

      // Gentle breathing pulse on the core corona
      const pulse = 1.0 + Math.sin(clock * 1.8) * 0.06;
      coreGlow.scale.set(pulse, pulse, pulse);

      // Deep stars very subtle drift
      deepStars.rotation.y = clock * 0.015;

      // Fluid damped pointer parallax (Subtle, luxurious camera response)
      targetRotY += (mouseX * 0.28 - targetRotY) * 0.04;
      targetRotX += (mouseY * 0.18 - targetRotX) * 0.04;

      camera.position.x = Math.sin(targetRotY) * 42;
      camera.position.y = 22 + targetRotX * 6;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

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
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      galaxyMaterial.dispose();
      coreGlowGeo.dispose();
      coreGlowMat.dispose();
      coronaGeo.dispose();
      coronaMat.dispose();
      deepStarGeo.dispose();
      deepStarMat.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};
