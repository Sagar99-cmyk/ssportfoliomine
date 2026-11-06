import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  amplitude: number;
  frequency: number;
  speed: number;
  age: number;
  lifetime: number;
}

export const Welcome3DRedWave: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [clickCount, setClickCount] = useState<number>(0);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    const canvasTest = document.createElement('canvas');
    const gl = canvasTest.getContext('webgl2') || canvasTest.getContext('webgl');
    if (!gl) {
      setWebGlSupported(false);
      return;
    }

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // Perspective view looking slightly down onto the rolling 3D wave plane
    camera.position.set(0, -3.5, 34);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    container.appendChild(renderer.domElement);

    // 2. Procedural Fallback Texture (High-Res Crimson & Gold Luxury Gradient)
    const createProceduralTexture = (): THREE.CanvasTexture => {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 1024;
      const ctx = c.getContext('2d');
      if (ctx) {
        // Deep obsidian-crimson radial background
        const grad = ctx.createRadialGradient(512, 450, 80, 512, 512, 700);
        grad.addColorStop(0, '#f43f5e'); // Radiant rose
        grad.addColorStop(0.3, '#be123c'); // Deep ruby
        grad.addColorStop(0.65, '#4c0519'); // Wine dark
        grad.addColorStop(1, '#09090b'); // Obsidian black
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Subtle diagonal energy streaks
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.12)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 40; i++) {
          ctx.beginPath();
          ctx.moveTo(i * 35, 0);
          ctx.lineTo(i * 35 + 400, 1024);
          ctx.stroke();
        }
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      return tex;
    };

    // Load actual background image, with graceful fallback
    const fallbackTexture = createProceduralTexture();
    const textureLoader = new THREE.TextureLoader();
    let waveTexture: THREE.Texture = fallbackTexture;

    textureLoader.load(
      '/red-welcome-bg.jpg',
      (loadedTex) => {
        loadedTex.wrapS = THREE.ClampToEdgeWrapping;
        loadedTex.wrapT = THREE.ClampToEdgeWrapping;
        loadedTex.generateMipmaps = true;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        waveMat.map = loadedTex;
        waveMat.needsUpdate = true;
        waveTexture = loadedTex;
      },
      undefined,
      (err) => {
        console.warn('Using procedural crimson wave texture fallback:', err);
      }
    );

    // 3. 3D Wave Plane Geometry (96x64 grid = 6,200 interactive vertices)
    const planeWidth = 72;
    const planeHeight = 44;
    const segX = 96;
    const segY = 64;
    const waveGeom = new THREE.PlaneGeometry(planeWidth, planeHeight, segX, segY);

    // Store base positions for dynamic displacement calculation
    const posAttr = waveGeom.attributes.position;
    const originalPositions = new Float32Array(posAttr.array.length);
    originalPositions.set(posAttr.array);

    // Material with high-end specular sheen & metallic reflection
    const waveMat = new THREE.MeshStandardMaterial({
      map: waveTexture,
      roughness: 0.28,
      metalness: 0.42,
      side: THREE.DoubleSide,
    });

    const waveMesh = new THREE.Mesh(waveGeom, waveMat);
    waveMesh.rotation.x = -0.32; // Tilted back to display 3D perspective depth
    waveMesh.position.set(0, 0, -2);
    scene.add(waveMesh);

    // Subtle 3D Wireframe Cyber Grid Overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
      transparent: true,
      opacity: 0.09,
      blending: THREE.AdditiveBlending,
    });
    const wireMesh = new THREE.Mesh(waveGeom, wireMat);
    wireMesh.rotation.copy(waveMesh.rotation);
    wireMesh.position.copy(waveMesh.position);
    wireMesh.position.z += 0.05;
    scene.add(wireMesh);

    // 5. 3D Lighting Setup (Refined Deep Ruby + Amber Gold Highlights - Reduced Glare)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const primaryLight = new THREE.DirectionalLight(0xe11d48, 1.6);
    primaryLight.position.set(18, 25, 22);
    scene.add(primaryLight);

    const rimGoldLight = new THREE.DirectionalLight(0xd97706, 1.0);
    rimGoldLight.position.set(-22, -15, 16);
    scene.add(rimGoldLight);

    // Interactive Point Light that follows user cursor in 3D
    const cursorLight = new THREE.PointLight(0xf43f5e, 2.2, 30);
    cursorLight.position.set(0, 0, 10);
    scene.add(cursorLight);

    // 6. Interactive Click Ripple Tracking
    const ripples: Ripple[] = [];
    const raycaster = new THREE.Raycaster();
    const mouseNorm = new THREE.Vector2(0, 0);
    let targetCameraX = 0;
    let targetCameraY = -3.5;
    let mouseWorldX = 0;
    let mouseWorldY = 0;

    // Track mouse move for camera tilt & subtle surface hover
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

      mouseNorm.x = (clientX / width) * 2 - 1;
      mouseNorm.y = -(clientY / height) * 2 + 1;

      targetCameraX = mouseNorm.x * 3.5;
      targetCameraY = -3.5 + mouseNorm.y * 2.2;

      // Approximate 3D plane coordinates for local hover elevation
      mouseWorldX = mouseNorm.x * (planeWidth * 0.45);
      mouseWorldY = mouseNorm.y * (planeHeight * 0.45);

      cursorLight.position.x = mouseWorldX;
      cursorLight.position.y = mouseWorldY;
    };

    // Trigger Dynamic 3D Ripple on Click / Tap
    const triggerWaveAtPoint = (clientX: number, clientY: number) => {
      mouseNorm.x = (clientX / width) * 2 - 1;
      mouseNorm.y = -(clientY / height) * 2 + 1;

      raycaster.setFromCamera(mouseNorm, camera);
      const intersects = raycaster.intersectObject(waveMesh);

      let rippleX = mouseNorm.x * (planeWidth * 0.45);
      let rippleY = mouseNorm.y * (planeHeight * 0.45);

      if (intersects.length > 0) {
        // Convert intersection point to local mesh space
        const localPt = waveMesh.worldToLocal(intersects[0].point.clone());
        rippleX = localPt.x;
        rippleY = localPt.y;
      }

      // Add a dynamic radiating ripple wave
      ripples.push({
        x: rippleX,
        y: rippleY,
        radius: 0,
        maxRadius: 55,
        amplitude: 5.5,
        frequency: 0.65,
        speed: 26,
        age: 0,
        lifetime: 2.5,
      });

      // Keep ripples list bounded
      if (ripples.length > 10) {
        ripples.shift();
      }

      setClickCount((c) => c + 1);
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      triggerWaveAtPoint(clientX, clientY);
    };

    // Attach listeners to window so clicks anywhere on the welcome screen trigger the wave
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    // Initial gentle introductory ripple
    setTimeout(() => {
      ripples.push({
        x: 0,
        y: 0,
        radius: 0,
        maxRadius: 45,
        amplitude: 4.0,
        frequency: 0.55,
        speed: 20,
        age: 0,
        lifetime: 2.2,
      });
    }, 600);

    // 7. 60 FPS Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Smooth camera orbit
      camera.position.x += (targetCameraX - camera.position.x) * 0.035;
      camera.position.y += (targetCameraY - camera.position.y) * 0.035;
      camera.lookAt(0, 1.2, 0);

      // Advance active user-click ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.age += delta;
        rip.radius += rip.speed * delta;
        if (rip.age >= rip.lifetime || rip.radius >= rip.maxRadius) {
          ripples.splice(r, 1);
        }
      }

      // Compute 3D wave deformation on plane vertices
      const pos = waveGeom.attributes.position;
      const count = pos.count;

      for (let i = 0; i < count; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];

        // A) Base Slow-Motion Wave Flow (Otherwise gentle, relaxing undulation)
        const wave1 = Math.sin(ox * 0.13 + elapsed * 0.42) * Math.cos(oy * 0.16 + elapsed * 0.32) * 2.3;
        const wave2 = Math.sin((ox + oy) * 0.09 + elapsed * 0.28) * 1.3;
        const wave3 = Math.cos(ox * 0.22 - elapsed * 0.2) * 0.6;
        let z = wave1 + wave2 + wave3;

        // B) Local cursor hover elevation
        const dCursor = Math.hypot(ox - mouseWorldX, oy - mouseWorldY);
        if (dCursor < 12) {
          z += (1 - dCursor / 12) * 1.4;
        }

        // C) Dynamic Radiating Waves According to User Clicks
        for (let rIdx = 0; rIdx < ripples.length; rIdx++) {
          const rip = ripples[rIdx];
          const dist = Math.hypot(ox - rip.x, oy - rip.y);
          const waveDist = dist - rip.radius;
          const envelope = 14; // wave packet width

          if (Math.abs(waveDist) < envelope) {
            const progress = rip.age / rip.lifetime;
            const fade = Math.max(0, 1 - progress) * Math.exp(-dist * 0.035);
            const shape = Math.cos((waveDist / envelope) * (Math.PI * 0.5));
            z += Math.sin(waveDist * rip.frequency) * rip.amplitude * fade * shape;
          }
        }

        pos.setZ(i, z);
      }

      pos.needsUpdate = true;
      waveGeom.computeVertexNormals();

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      waveGeom.dispose();
      waveMat.dispose();
      wireMat.dispose();
      fallbackTexture.dispose();
      renderer.dispose();
    };
  }, []);

  if (!webGlSupported) {
    // Graceful fallback for devices without WebGL
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src="/red-welcome-bg.jpg"
          alt="Welcome Crimson Background"
          className="w-full h-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-pointer select-none" />

      {/* Atmospheric dark red vignetting & contrast overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(225,29,72,0.03) 0%, rgba(13,6,10,0.55) 60%, rgba(6,3,5,0.94) 100%)',
        }}
      />

      {/* Top & bottom gentle gradient fades */}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#09090b]/90 via-[#09090b]/30 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#09090b]/95 via-[#09090b]/40 to-transparent pointer-events-none" />
    </div>
  );
};

