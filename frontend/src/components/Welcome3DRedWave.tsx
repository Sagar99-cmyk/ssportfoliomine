import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Welcome3DRedWave: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Three.js Scene, Atmospheric Fog & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 24);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // =========================================================================
    // 2. STUDIO 3-POINT VOLUMETRIC LIGHTING (Soft Key + Cyber Rim + Golden Glow)
    // =========================================================================
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));

    const keyLight = new THREE.DirectionalLight(0xf43f5e, 2.6);
    keyLight.position.set(15, 20, 15);
    scene.add(keyLight);

    const goldLight = new THREE.DirectionalLight(0xf59e0b, 2.2);
    goldLight.position.set(-15, -10, 15);
    scene.add(goldLight);

    const cyanLight = new THREE.PointLight(0x38bdf8, 1.8, 40);
    cyanLight.position.set(0, -12, 10);
    scene.add(cyanLight);

    // =========================================================================
    // 3. CENTRAL KINETIC DATA CORE HIERARCHY
    // =========================================================================
    const masterGroup = new THREE.Group();
    // Positioned slightly above center so it frames the central typography like a high-tech hologram
    masterGroup.position.set(0, 1.2, 0);
    scene.add(masterGroup);

    // Inner Crystalline Data Octahedron
    const coreGeo = new THREE.OctahedronGeometry(2.4, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x1f0e14,
      emissive: 0xe11d48,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.85,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // Faceted Outer Wireframe Cage with Glowing Vertices
    const wireGeo = new THREE.IcosahedronGeometry(3.2, 1);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.8,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.9,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    masterGroup.add(wireMesh);

    // Internal Glowing Core Orb
    const orbGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const orbMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const orbMesh = new THREE.Mesh(orbGeo, orbMat);
    masterGroup.add(orbMesh);

    // =========================================================================
    // 4. TRIPLE KINETIC GYROSCOPIC DATA RINGS (Analytical Coordinate System)
    // =========================================================================
    // Ring 1: Equatorial Torus (Crimson Holographic Ring)
    const ring1Geo = new THREE.TorusGeometry(4.8, 0.05, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 1.2,
      roughness: 0.15,
      metalness: 0.8,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    masterGroup.add(ring1);

    // Ring 2: Polar Orbital Torus (Amber Gold Ring)
    const ring2Geo = new THREE.TorusGeometry(6.0, 0.04, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.1,
      roughness: 0.2,
      metalness: 0.75,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI * 0.38;
    masterGroup.add(ring2);

    // Ring 3: Deep Orbital Inclination Torus (Cyan Telemetry Ring)
    const ring3Geo = new THREE.TorusGeometry(7.2, 0.035, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.25,
      metalness: 0.7,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI * 0.45;
    masterGroup.add(ring3);

    // =========================================================================
    // 5. ORBITING ANALYTICAL DATA NODES & DYNAMIC LASER SYNAPSE LINES
    // =========================================================================
    const nodeCount = 20;
    const nodeGroup = new THREE.Group();
    masterGroup.add(nodeGroup);

    const nodeMeshes: { mesh: THREE.Mesh; orbitRadius: number; speed: number; angle: number; yOffset: number }[] = [];
    const nodeGeometry = new THREE.OctahedronGeometry(0.22, 0);

    for (let i = 0; i < nodeCount; i++) {
      const isCrimson = i % 2 === 0;
      const nodeMaterial = new THREE.MeshStandardMaterial({
        color: isCrimson ? 0xf43f5e : 0xf59e0b,
        emissive: isCrimson ? 0xe11d48 : 0xd97706,
        emissiveIntensity: 1.4,
        roughness: 0.1,
        metalness: 0.9,
      });

      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      const orbitRadius = 4.2 + (i % 4) * 0.9;
      const angle = (i / nodeCount) * Math.PI * 2;
      const yOffset = ((i % 5) - 2) * 0.8;

      mesh.position.set(Math.cos(angle) * orbitRadius, yOffset, Math.sin(angle) * orbitRadius);
      nodeGroup.add(mesh);

      nodeMeshes.push({
        mesh,
        orbitRadius,
        speed: (0.3 + (i % 3) * 0.15) * (i % 2 === 0 ? 1 : -1),
        angle,
        yOffset,
      });
    }

    // Dynamic Synapse Laser Lines connecting nodes to each other & the core
    const lineCount = 14;
    const linePositions = new Float32Array(lineCount * 2 * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    masterGroup.add(lineSegments);

    // =========================================================================
    // 6. AMBIENT CELESTIAL BACKGROUND STAR PARTICLES (Subtle, Non-Jittering)
    // =========================================================================
    const starCount = 380;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const cRose = new THREE.Color(0xf43f5e);
    const cAmber = new THREE.Color(0xfbbf24);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 110;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 70;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 8;

      const pick = i % 3 === 0 ? cRose : i % 3 === 1 ? cAmber : cWhite;
      starColors[i * 3] = pick.r;
      starColors[i * 3 + 1] = pick.g;
      starColors[i * 3 + 2] = pick.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.65,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // =========================================================================
    // 7. SMOOTH INTERACTIVE MOUSE PARALLAX & FLUID 60 FPS ANIMATION LOOP
    // =========================================================================
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

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
      clock += 0.012;

      // 1. Crystalline Core & Cage Independent Rotations
      coreMesh.rotation.y = clock * 0.45;
      coreMesh.rotation.x = clock * 0.25;

      wireMesh.rotation.y = -clock * 0.32;
      wireMesh.rotation.z = clock * 0.18;

      // Gentle Breathing Pulse on the Inner Energy Core
      const pulse = 1.0 + Math.sin(clock * 2.2) * 0.09;
      orbMesh.scale.set(pulse, pulse, pulse);

      // 2. Gyroscopic Kinetic Ring Rotations (Three Distinct Spatial Axes)
      ring1.rotation.z = clock * 0.35;
      ring2.rotation.y = -clock * 0.28;
      ring3.rotation.x = clock * 0.22;

      // 3. Orbiting Analytical Data Nodes
      for (let i = 0; i < nodeMeshes.length; i++) {
        const item = nodeMeshes[i];
        item.angle += item.speed * 0.015;
        const x = Math.cos(item.angle) * item.orbitRadius;
        const z = Math.sin(item.angle) * item.orbitRadius;
        const y = item.yOffset + Math.sin(clock * 1.8 + i) * 0.25;
        item.mesh.position.set(x, y, z);
        item.mesh.rotation.y = clock * 1.5;
      }

      // 4. Update Laser Synapse Line Segments between nodes and core
      const posAttr = lineGeo.attributes.position as THREE.BufferAttribute;
      const positionsArr = posAttr.array as Float32Array;

      for (let i = 0; i < lineCount; i++) {
        const n1 = nodeMeshes[i % nodeMeshes.length];
        const n2 = nodeMeshes[(i + 4) % nodeMeshes.length];

        const idx = i * 6;
        positionsArr[idx] = n1.mesh.position.x;
        positionsArr[idx + 1] = n1.mesh.position.y;
        positionsArr[idx + 2] = n1.mesh.position.z;

        positionsArr[idx + 3] = n2.mesh.position.x;
        positionsArr[idx + 4] = n2.mesh.position.y;
        positionsArr[idx + 5] = n2.mesh.position.z;
      }
      posAttr.needsUpdate = true;

      // 5. Smooth Damped Camera Perspective Tracking (No erratic jumping)
      targetX += (mouseX * 0.32 - targetX) * 0.05;
      targetY += (mouseY * 0.22 - targetY) * 0.05;

      masterGroup.rotation.y = targetX * 0.8;
      masterGroup.rotation.x = -targetY * 0.6;

      starField.rotation.y = clock * 0.02;

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
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      orbGeo.dispose();
      orbMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      nodeGeometry.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};
