import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const ThreeDataBackground: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGlError, setHasWebGlError] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch (e) {
        return true;
      }
    })();

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animFrameId: number;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.set(0, 15, 38);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(isDark ? 0x1e1b2e : 0xf8fafc, 1.2);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xbe123c, 2.5); // Burgundy/Rose accent
      keyLight.position.set(20, 30, 20);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(isDark ? 0x38bdf8 : 0x0284c7, 1.2); // Cool blue fill
      fillLight.position.set(-20, -10, -10);
      scene.add(fillLight);

      // Root Group
      const mainGroup = new THREE.Group();
      scene.add(mainGroup);

      // 1. Geometric Data Grid Floor
      const gridHelper = new THREE.GridHelper(60, 30, isDark ? 0xbe123c : 0x9f1239, isDark ? 0x27272a : 0xe2e8f0);
      gridHelper.position.y = -6;
      (gridHelper.material as THREE.Material).opacity = isDark ? 0.25 : 0.4;
      (gridHelper.material as THREE.Material).transparent = true;
      mainGroup.add(gridHelper);

      // 2. 3D Chart Bars (Data Pillars)
      const barCount = 28;
      const barGroup = new THREE.Group();
      const barGeom = new THREE.BoxGeometry(0.8, 1, 0.8);

      const barMaterials = [
        new THREE.MeshStandardMaterial({
          color: isDark ? 0xbe123c : 0x9f1239,
          roughness: 0.3,
          metalness: 0.6,
          transparent: true,
          opacity: 0.85,
        }),
        new THREE.MeshStandardMaterial({
          color: isDark ? 0xe11d48 : 0xe11d48,
          roughness: 0.2,
          metalness: 0.8,
          transparent: true,
          opacity: 0.9,
        }),
        new THREE.MeshStandardMaterial({
          color: isDark ? 0x3f3f46 : 0x64748b,
          roughness: 0.4,
          metalness: 0.5,
          transparent: true,
          opacity: 0.7,
        }),
      ];

      const barData: { mesh: THREE.Mesh; initialY: number; targetScaleY: number; speed: number; offset: number }[] = [];

      for (let i = 0; i < barCount; i++) {
        const mat = barMaterials[i % barMaterials.length];
        const bar = new THREE.Mesh(barGeom, mat);
        
        const angle = (i / barCount) * Math.PI * 2;
        const radius = 12 + (i % 4) * 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const scaleY = 3 + Math.random() * 9;

        bar.position.set(x, -6 + scaleY / 2, z);
        bar.scale.set(1, scaleY, 1);
        barGroup.add(bar);

        barData.push({
          mesh: bar,
          initialY: -6,
          targetScaleY: scaleY,
          speed: 0.5 + Math.random() * 1.5,
          offset: Math.random() * Math.PI * 2,
        });
      }
      mainGroup.add(barGroup);

      // 3. Translucent Analytics Floating Panels
      const panelGroup = new THREE.Group();
      const panelGeom = new THREE.PlaneGeometry(8, 5);
      
      const panelMat = new THREE.MeshPhysicalMaterial({
        color: isDark ? 0x18181b : 0xffffff,
        transparent: true,
        opacity: isDark ? 0.35 : 0.6,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        side: THREE.DoubleSide,
      });

      for (let p = 0; p < 4; p++) {
        const panel = new THREE.Mesh(panelGeom, panelMat);
        panel.position.set((p - 1.5) * 10, 4 + p * 2, -5 + (p % 2) * 6);
        panel.rotation.y = (p - 1.5) * 0.2;
        panel.rotation.x = -0.1;
        panelGroup.add(panel);
      }
      mainGroup.add(panelGroup);

      // 4. Connected Data Nodes & Particles
      const nodeCount = 50;
      const nodeGeometry = new THREE.BufferGeometry();
      const nodePositions = new Float32Array(nodeCount * 3);
      const nodeColors = new Float32Array(nodeCount * 3);

      const color1 = new THREE.Color(isDark ? 0xf43f5e : 0xbe123c);
      const color2 = new THREE.Color(isDark ? 0x38bdf8 : 0x0284c7);

      for (let i = 0; i < nodeCount; i++) {
        nodePositions[i * 3] = (Math.random() - 0.5) * 50;
        nodePositions[i * 3 + 1] = Math.random() * 25 - 5;
        nodePositions[i * 3 + 2] = (Math.random() - 0.5) * 40;

        const mixedColor = i % 2 === 0 ? color1 : color2;
        nodeColors[i * 3] = mixedColor.r;
        nodeColors[i * 3 + 1] = mixedColor.g;
        nodeColors[i * 3 + 2] = mixedColor.b;
      }

      nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
      nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

      const nodeMaterial = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
      });

      const particleSystem = new THREE.Points(nodeGeometry, nodeMaterial);
      mainGroup.add(particleSystem);

      // Line connections between nearby nodes
      const lineMaterial = new THREE.LineBasicMaterial({
        color: isDark ? 0xbe123c : 0xcbd5e1,
        transparent: true,
        opacity: isDark ? 0.25 : 0.35,
      });

      const lineGeometry = new THREE.BufferGeometry();
      const linePositions: number[] = [];

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodePositions[i * 3] - nodePositions[j * 3];
          const dy = nodePositions[i * 3 + 1] - nodePositions[j * 3 + 1];
          const dz = nodePositions[i * 3 + 2] - nodePositions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 10) {
            linePositions.push(
              nodePositions[i * 3], nodePositions[i * 3 + 1], nodePositions[i * 3 + 2],
              nodePositions[j * 3], nodePositions[j * 3 + 1], nodePositions[j * 3 + 2]
            );
          }
        }
      }

      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
      mainGroup.add(lineSegments);

      // 5. Flowing 3D Cyber Analytics Wave Lattice (Calmer, subtle flow for Dark Mode)
      const waveGeom = new THREE.PlaneGeometry(75, 45, 44, 28);
      const waveMat = new THREE.MeshBasicMaterial({
        color: isDark ? 0xe11d48 : 0xbe123c,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.08 : 0.18,
        blending: THREE.AdditiveBlending,
      });
      const waveMesh = new THREE.Mesh(waveGeom, waveMat);
      waveMesh.rotation.x = -Math.PI / 2.3;
      waveMesh.position.set(0, -6.8, -4);
      mainGroup.add(waveMesh);

      // 6. User Interaction Mechanics (Mouse Follow & 3D Wave Ripples)
      interface BackgroundRipple {
        x: number;
        z: number;
        radius: number;
        maxRadius: number;
        amplitude: number;
        speed: number;
        age: number;
        lifetime: number;
      }

      const ripples: BackgroundRipple[] = [];
      let mouseNormX = 0;
      let mouseNormY = 0;
      let targetCamX = 0;
      let targetCamY = 15;
      let mouseWorldX = 0;
      let mouseWorldZ = 0;

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

        const w = window.innerWidth || 1000;
        const h = window.innerHeight || 800;
        mouseNormX = (clientX / w) * 2 - 1;
        mouseNormY = -(clientY / h) * 2 + 1;

        targetCamX = mouseNormX * 8;
        targetCamY = 15 + mouseNormY * 4;

        mouseWorldX = mouseNormX * 26;
        mouseWorldZ = -mouseNormY * 18;
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

        const w = window.innerWidth || 1000;
        const h = window.innerHeight || 800;
        const normX = (clientX / w) * 2 - 1;
        const normY = -(clientY / h) * 2 + 1;

        // Spawn interactive 3D ripple wave at click coordinate
        ripples.push({
          x: normX * 26,
          z: -normY * 18,
          radius: 0,
          maxRadius: 48,
          amplitude: 3.2,
          speed: 24,
          age: 0,
          lifetime: 2.2,
        });

        if (ripples.length > 8) {
          ripples.shift();
        }
      };

      window.addEventListener('mousemove', handlePointerMove, { passive: true });
      window.addEventListener('touchmove', handlePointerMove, { passive: true });
      window.addEventListener('mousedown', handlePointerDown);
      window.addEventListener('touchstart', handlePointerDown, { passive: true });

      // Animation Loop
      let clock = new THREE.Clock();

      const animate = () => {
        const delta = Math.min(clock.getDelta(), 0.1);
        const elapsed = clock.getElapsedTime();

        if (!prefersReducedMotion) {
          // Camera smoothly tracks user mouse tilt
          camera.position.x += (targetCamX - camera.position.x) * 0.05;
          camera.position.y += (targetCamY - camera.position.y) * 0.05;
          camera.lookAt(0, 0, 0);

          // Subtle responsive mouse rotation on mainGroup for organic parallax depth
          const targetRotY = elapsed * 0.006 + mouseNormX * 0.14;
          const targetRotX = mouseNormY * 0.08;
          mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.04;
          mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.04;

          // Advance active ripples
          for (let r = ripples.length - 1; r >= 0; r--) {
            const rip = ripples[r];
            rip.age += delta;
            rip.radius += rip.speed * delta;
            if (rip.age >= rip.lifetime || rip.radius >= rip.maxRadius) {
              ripples.splice(r, 1);
            }
          }

          // Calm, subtle undulating wave across data grid (Gentle flow for dark mode)
          const barSpeed = isDark ? 0.12 : 0.32;
          const barAmp = isDark ? 0.28 : 0.75;
          barData.forEach((b) => {
            const waveX = Math.sin(elapsed * barSpeed + b.mesh.position.x * 0.08);
            const waveZ = Math.cos(elapsed * (barSpeed * 0.85) + b.mesh.position.z * 0.08);
            let wave = (waveX + waveZ) * barAmp;

            // Cursor proximity elevation (Softened in dark mode)
            const dCursor = Math.hypot(b.mesh.position.x - mouseWorldX, b.mesh.position.z - mouseWorldZ);
            if (dCursor < 12) {
              wave += (1 - dCursor / 12) * (isDark ? 0.8 : 1.6);
            }

            // Click ripple surge across data pillars
            for (let rIdx = 0; rIdx < ripples.length; rIdx++) {
              const rip = ripples[rIdx];
              const dist = Math.hypot(b.mesh.position.x - rip.x, b.mesh.position.z - rip.z);
              const waveDist = dist - rip.radius;
              if (Math.abs(waveDist) < 12) {
                const fade = Math.max(0, 1 - rip.age / rip.lifetime);
                wave += Math.sin((waveDist / 12) * Math.PI) * (rip.amplitude * (isDark ? 0.4 : 1.0)) * fade;
              }
            }

            const currentScale = b.targetScaleY + wave * (isDark ? 0.7 : 1.5);
            b.mesh.scale.y = Math.max(1.2, currentScale);
            b.mesh.position.y = b.initialY + b.mesh.scale.y / 2;
          });

          // Gentle counter-drift on particles & lines for rich slow-motion depth
          particleSystem.rotation.y = -elapsed * 0.002;
          lineSegments.rotation.y = -elapsed * 0.002;

          // Float analytics panels slowly & smoothly
          panelGroup.children.forEach((p, idx) => {
            p.position.y = (4 + idx * 2) + Math.sin(elapsed * (isDark ? 0.12 : 0.25) + idx * 0.8) * (isDark ? 0.15 : 0.3);
          });

          // Undulate 3D cyber analytics wave lattice (Subtle & calm in dark mode)
          const wPos = waveGeom.attributes.position;
          const waveFreqX = isDark ? 0.06 : 0.12;
          const waveFreqY = isDark ? 0.08 : 0.15;
          const waveSpeedX = isDark ? 0.14 : 0.38;
          const waveSpeedY = isDark ? 0.10 : 0.28;
          const waveHeightA = isDark ? 0.75 : 2.2;
          const waveHeightB = isDark ? 0.35 : 1.1;

          for (let i = 0; i < wPos.count; i++) {
            const u = wPos.getX(i);
            const v = wPos.getY(i);
            let z = Math.sin(u * waveFreqX + elapsed * waveSpeedX) * Math.cos(v * waveFreqY + elapsed * waveSpeedY) * waveHeightA
                  + Math.sin((u + v) * 0.04 + elapsed * (waveSpeedX * 0.5)) * waveHeightB;

            // Cursor hover wave on lattice
            const dCur = Math.hypot(u - mouseWorldX * 0.8, v - mouseWorldZ * 0.8);
            if (dCur < 14) {
              z += (1 - dCur / 14) * (isDark ? 0.7 : 1.8);
            }

            // Click ripple propagation on wave lattice
            for (let rIdx = 0; rIdx < ripples.length; rIdx++) {
              const rip = ripples[rIdx];
              const dist = Math.hypot(u - rip.x * 0.8, v - rip.z * 0.8);
              const waveDist = dist - rip.radius;
              if (Math.abs(waveDist) < 14) {
                const fade = Math.max(0, 1 - rip.age / rip.lifetime);
                z += Math.sin((waveDist / 14) * Math.PI) * (rip.amplitude * (isDark ? 0.45 : 1.1)) * fade;
              }
            }

            wPos.setZ(i, z);
          }
          wPos.needsUpdate = true;
        }

        renderer.render(scene, camera);
        animFrameId = requestAnimationFrame(animate);
      };

      animate();

      // Resize Handler
      const handleResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('mousedown', handlePointerDown);
        window.removeEventListener('touchstart', handlePointerDown);
        if (animFrameId) cancelAnimationFrame(animFrameId);
        if (container && renderer.domElement) {
          container.removeChild(renderer.domElement);
        }
        barGeom.dispose();
        barMaterials.forEach(m => m.dispose());
        panelGeom.dispose();
        panelMat.dispose();
        nodeGeometry.dispose();
        nodeMaterial.dispose();
        lineGeometry.dispose();
        lineMaterial.dispose();
        waveGeom.dispose();
        waveMat.dispose();
        renderer.dispose();
      };
    } catch (e) {
      console.warn('WebGL initialization failed, using static background fallback.', e);
      setHasWebGlError(true);
    }
  }, [isDark]);

  if (hasWebGlError) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-stone-50 via-rose-50/20 to-stone-100 dark:from-stone-950 dark:via-rose-950/20 dark:to-stone-900 opacity-80" />
    );
  }

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-85 dark:opacity-80 transition-opacity duration-700 overflow-hidden"
      aria-hidden="true"
    />
  );
};
