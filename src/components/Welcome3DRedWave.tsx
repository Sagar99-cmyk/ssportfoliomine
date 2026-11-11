import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SatelliteData {
  mesh: THREE.Mesh;
  baseRadius: number;
  angle: number;
  speed: number;
  axis: THREE.Vector3;
  rotSpeed: { x: number; y: number; z: number };
  // Distribution burst state
  scatterPos: THREE.Vector3;
  scatterVel: THREE.Vector3;
  isScattered: boolean;
}

export const Welcome3DRedWave: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [clickNotice, setClickNotice] = useState<boolean>(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.012);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    camera.position.set(0, 0, 36);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting (Crimson Key + Amber Gold Rim + Cyan Atmospheric Fill)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyRose = new THREE.DirectionalLight(0xf43f5e, 2.8);
    keyRose.position.set(25, 30, 25);
    scene.add(keyRose);

    const rimGold = new THREE.DirectionalLight(0xf59e0b, 2.2);
    rimGold.position.set(-25, -20, 20);
    scene.add(rimGold);

    const fillCyan = new THREE.DirectionalLight(0x06b6d4, 1.4);
    fillCyan.position.set(0, 35, -15);
    scene.add(fillCyan);

    // 3. Ambient Deep Background Starfield & Floating Particles
    const starCount = 350;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colRose = new THREE.Color(0xf43f5e);
    const colGold = new THREE.Color(0xfbbf24);
    const colCyan = new THREE.Color(0x38bdf8);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 120;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10;

      const pickColor = i % 3 === 0 ? colRose : i % 3 === 1 ? colGold : colCyan;
      starColors[i * 3] = pickColor.r;
      starColors[i * 3 + 1] = pickColor.g;
      starColors[i * 3 + 2] = pickColor.b;
    }

    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeom.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeom, starMat);
    scene.add(starField);

    // =========================================================================
    // 4. CENTRAL 3D ZOOM-IN DATA CORE ("When comes it comes - Zoom in Object")
    // =========================================================================
    const coreMasterGroup = new THREE.Group();
    scene.add(coreMasterGroup);

    // Initial Zoom-In Coordinates (Starts deep at z = -90, zooms to z = 0)
    coreMasterGroup.position.set(0, 0, -90);
    coreMasterGroup.scale.set(0.08, 0.08, 0.08);

    // 4a. Outer Geodesic Icosahedron Faceted Frame
    const outerGeo = new THREE.IcosahedronGeometry(6.2, 1);
    const outerWireMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const outerWireMesh = new THREE.Mesh(outerGeo, outerWireMat);
    coreMasterGroup.add(outerWireMesh);

    // 4b. Inner Faceted Crystal Jewel
    const innerGeo = new THREE.OctahedronGeometry(3.8, 0);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x9f1239,
      roughness: 0.15,
      metalness: 0.75,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.88,
      wireframe: false,
    });
    const innerCrystal = new THREE.Mesh(innerGeo, innerMat);
    coreMasterGroup.add(innerCrystal);

    // 4c. Inner Glowing Core Sphere
    const sphereGeo = new THREE.SphereGeometry(1.8, 24, 24);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      wireframe: false,
      transparent: true,
      opacity: 0.9,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    coreMasterGroup.add(coreSphere);

    // 4d. 3 Concentric Glowing Orbital Data Rings (Torus)
    const ringMaterials = [
      new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending }),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending }),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending }),
    ];

    const rings: { mesh: THREE.Mesh; rotSpeed: { x: number; y: number; z: number } }[] = [];
    const ringRadii = [8.2, 9.8, 11.4];

    ringRadii.forEach((r, idx) => {
      const ringGeo = new THREE.TorusGeometry(r, 0.08, 16, 90);
      const ringMesh = new THREE.Mesh(ringGeo, ringMaterials[idx]);
      ringMesh.rotation.x = (idx * Math.PI) / 3.2;
      ringMesh.rotation.y = (idx * Math.PI) / 4.1;
      coreMasterGroup.add(ringMesh);
      rings.push({
        mesh: ringMesh,
        rotSpeed: {
          x: (idx + 1) * 0.008 * (idx % 2 === 0 ? 1 : -1),
          y: (idx + 1) * 0.012 * (idx % 2 === 0 ? -1 : 1),
          z: (idx + 1) * 0.006,
        },
      });
    });

    // 4e. 72 Orbiting Crystal Satellites (Mini Polyhedra ready to DISTRIBUTE on click)
    const satelliteCount = 72;
    const satellites: SatelliteData[] = [];
    const polyGeos = [
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      new THREE.TetrahedronGeometry(0.65),
      new THREE.OctahedronGeometry(0.6),
      new THREE.IcosahedronGeometry(0.55),
    ];

    const satMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.2, metalness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.2, metalness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.6 }),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.3, metalness: 0.5 }),
    ];

    for (let i = 0; i < satelliteCount; i++) {
      const geo = polyGeos[i % polyGeos.length];
      const mat = satMaterials[i % satMaterials.length];
      const satMesh = new THREE.Mesh(geo, mat);

      const baseR = 10 + Math.random() * 8.5;
      const angle = (i / satelliteCount) * Math.PI * 2;
      const axis = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();

      satMesh.position.set(
        Math.cos(angle) * baseR,
        (Math.random() - 0.5) * 6,
        Math.sin(angle) * baseR
      );

      coreMasterGroup.add(satMesh);

      satellites.push({
        mesh: satMesh,
        baseRadius: baseR,
        angle: angle,
        speed: 0.012 + Math.random() * 0.018,
        axis: axis,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.08,
          y: (Math.random() - 0.5) * 0.08,
          z: (Math.random() - 0.5) * 0.08,
        },
        scatterPos: satMesh.position.clone(),
        scatterVel: new THREE.Vector3(),
        isScattered: false,
      });
    }

    // 4f. Expanding Shockwave Energy Rings for Click Dispersion
    interface Shockwave {
      mesh: THREE.Mesh;
      scale: number;
      opacity: number;
      speed: number;
    }
    const shockwaves: Shockwave[] = [];
    const shockwaveGeo = new THREE.RingGeometry(1, 1.4, 64);

    const spawnShockwave = (origin: THREE.Vector3) => {
      const shockMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0xf43f5e : 0xf59e0b,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const shockMesh = new THREE.Mesh(shockwaveGeo, shockMat);
      shockMesh.position.copy(origin);
      shockMesh.lookAt(camera.position);
      scene.add(shockMesh);
      shockwaves.push({
        mesh: shockMesh,
        scale: 1,
        opacity: 0.9,
        speed: 35 + Math.random() * 15,
      });
    };

    // =========================================================================
    // 5. INTERACTION: CLICK / TAP TO DISTRIBUTE ELEMENTS IN 3D
    // =========================================================================
    let distributionTimer = 0;

    const triggerElementDistribution = (clickX?: number, clickY?: number) => {
      // 1. Scatter Satellites Outward with High Radial Velocities
      satellites.forEach((sat) => {
        sat.isScattered = true;
        // Direction from center outwards, plus random tangential burst
        const dir = sat.mesh.position.clone().normalize();
        const burstSpeed = 22 + Math.random() * 26;
        sat.scatterVel.set(
          (dir.x + (Math.random() - 0.5) * 0.6) * burstSpeed,
          (dir.y + (Math.random() - 0.5) * 0.6) * burstSpeed,
          (dir.z + (Math.random() - 0.5) * 0.6) * burstSpeed
        );
      });

      // 2. Shockwave Burst
      spawnShockwave(new THREE.Vector3(0, 0, 0));
      setTimeout(() => spawnShockwave(new THREE.Vector3(0, 0, 0)), 120);

      // 3. Pulse Core
      coreMasterGroup.scale.multiplyScalar(1.25);

      distributionTimer = 2.8; // Duration before gentle re-orbit
      setClickNotice(false);
    };

    // Pointer move for 3D Camera Parallax
    let targetCamX = 0;
    let targetCamY = 0;

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

      const normX = (clientX / (window.innerWidth || 1000)) * 2 - 1;
      const normY = (clientY / (window.innerHeight || 800)) * 2 - 1;

      targetCamX = normX * 6;
      targetCamY = -normY * 4;
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
      triggerElementDistribution(clientX, clientY);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    // =========================================================================
    // 6. 60 FPS ANIMATION LOOP
    // =========================================================================
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Camera smooth tracking
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // --- ZOOM-IN ENTRY ANIMATION (from z = -90 to z = 0) ---
      if (coreMasterGroup.position.z < -0.2) {
        // Smooth logarithmic approach to center
        coreMasterGroup.position.z += (0 - coreMasterGroup.position.z) * 0.045;
        const currentScale = coreMasterGroup.scale.x;
        const targetScale = 1.0;
        coreMasterGroup.scale.setScalar(currentScale + (targetScale - currentScale) * 0.045);
      } else {
        // Settle smoothly at 1.0 scale with gentle breathing pulse
        const breathe = 1.0 + Math.sin(elapsed * 1.5) * 0.035;
        coreMasterGroup.scale.set(breathe, breathe, breathe);
      }

      // Continuous slow majestic rotation of the core
      coreMasterGroup.rotation.y = elapsed * 0.12;
      coreMasterGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.15;

      outerWireMesh.rotation.y = -elapsed * 0.22;
      outerWireMesh.rotation.z = elapsed * 0.14;

      innerCrystal.rotation.x = elapsed * 0.35;
      innerCrystal.rotation.y = elapsed * 0.28;

      // Rotate Concentric Rings
      rings.forEach((r) => {
        r.mesh.rotation.x += r.rotSpeed.x;
        r.mesh.rotation.y += r.rotSpeed.y;
        r.mesh.rotation.z += r.rotSpeed.z;
      });

      // Update Satellites (Orbit vs Distributed Element Scattering)
      if (distributionTimer > 0) {
        distributionTimer -= delta;
      }

      satellites.forEach((sat) => {
        sat.mesh.rotation.x += sat.rotSpeed.x;
        sat.mesh.rotation.y += sat.rotSpeed.y;
        sat.mesh.rotation.z += sat.rotSpeed.z;

        if (sat.isScattered && distributionTimer > 0) {
          // Flying outwards in explosive distribution
          sat.mesh.position.addScaledVector(sat.scatterVel, delta);
          // Apply gentle drag
          sat.scatterVel.multiplyScalar(0.96);
        } else {
          // Orbiting smoothly around the central core
          sat.isScattered = false;
          sat.angle += sat.speed;
          const targetX = Math.cos(sat.angle) * sat.baseRadius;
          const targetZ = Math.sin(sat.angle) * sat.baseRadius;
          const targetY = Math.sin(sat.angle * 2 + sat.baseRadius) * 4.5;

          // Smooth interpolation back into orbit
          sat.mesh.position.x += (targetX - sat.mesh.position.x) * 0.06;
          sat.mesh.position.y += (targetY - sat.mesh.position.y) * 0.06;
          sat.mesh.position.z += (targetZ - sat.mesh.position.z) * 0.06;
        }
      });

      // Update Shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.scale += sw.speed * delta;
        sw.opacity -= delta * 0.95;
        sw.mesh.scale.set(sw.scale, sw.scale, 1);
        (sw.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, sw.opacity);

        if (sw.opacity <= 0) {
          scene.remove(sw.mesh);
          shockwaves.splice(s, 1);
        }
      }

      // Rotate background stars slowly
      starField.rotation.y = elapsed * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-auto cursor-pointer"
      title="Click anywhere to trigger 3D element distribution!"
    >
      {/* Click Interaction Prompt Pill */}
      {clickNotice && (
        <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-700">
          <div className="px-4 py-1.5 rounded-full bg-stone-900/80 border border-rose-500/40 text-rose-300 text-[11px] font-mono shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>✨ Tap anywhere to distribute 3D elements in space</span>
          </div>
        </div>
      )}
    </div>
  );
};
