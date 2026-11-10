import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const StitchLightBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    // Camera positioned with optimized vertical FOV for responsive screens
    const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 1000);
    camera.position.set(0, 0, 90);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Studio Lighting tuned for Light Mode contrast & refraction
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLightRose = new THREE.DirectionalLight(0xf43f5e, 2.8);
    dirLightRose.position.set(35, 55, 45);
    scene.add(dirLightRose);

    const dirLightCyan = new THREE.DirectionalLight(0x06b6d4, 2.4);
    dirLightCyan.position.set(-40, -30, 40);
    scene.add(dirLightCyan);

    const dirLightViolet = new THREE.DirectionalLight(0x8b5cf6, 2.0);
    dirLightViolet.position.set(0, -50, -20);
    scene.add(dirLightViolet);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. Central High-Refraction Diamond Glass Icosahedron Core
    const coreGeo = new THREE.IcosahedronGeometry(14.5, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.04,
      metalness: 0.08,
      transmission: 0.92,
      ior: 1.58,
      thickness: 9.5,
      specularIntensity: 1.0,
      specularColor: 0xffffff,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      transparent: true,
      opacity: 0.88,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // 2. Prismatic internal diamond core facet
    const innerGeo = new THREE.OctahedronGeometry(8.0, 0);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0xffe4e6,
      roughness: 0.02,
      metalness: 0.15,
      transmission: 0.88,
      ior: 1.65,
      thickness: 5.0,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.82,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreMesh.add(innerMesh);

    // 3. Architectural outer wireframe cage
    const wireGeo = new THREE.IcosahedronGeometry(18.5, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    masterGroup.add(wireMesh);

    // 4. Floating Magnetic Polyhedrons
    const crystalGeometries = [
      new THREE.OctahedronGeometry(4.0, 0),
      new THREE.TetrahedronGeometry(4.5, 0),
      new THREE.DodecahedronGeometry(3.5, 0),
      new THREE.IcosahedronGeometry(3.4, 0),
    ];

    const crystalMaterials = [
      new THREE.MeshPhysicalMaterial({ color: 0xff1744, roughness: 0.05, transmission: 0.85, ior: 1.56, thickness: 4.5, clearcoat: 1.0, transparent: true, opacity: 0.85 }),
      new THREE.MeshPhysicalMaterial({ color: 0x00b4d8, roughness: 0.05, transmission: 0.88, ior: 1.56, thickness: 4.5, clearcoat: 1.0, transparent: true, opacity: 0.88 }),
      new THREE.MeshPhysicalMaterial({ color: 0x10b981, roughness: 0.06, transmission: 0.86, ior: 1.54, thickness: 4.5, clearcoat: 1.0, transparent: true, opacity: 0.84 }),
      new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.05, transmission: 0.87, ior: 1.58, thickness: 4.5, clearcoat: 1.0, transparent: true, opacity: 0.85 }),
      new THREE.MeshPhysicalMaterial({ color: 0x8b5cf6, roughness: 0.05, transmission: 0.86, ior: 1.57, thickness: 4.5, clearcoat: 1.0, transparent: true, opacity: 0.86 }),
    ];

    const crystals: THREE.Mesh[] = [];
    const crystalCount = 12;

    for (let i = 0; i < crystalCount; i++) {
      const geo = crystalGeometries[i % crystalGeometries.length];
      const mat = crystalMaterials[i % crystalMaterials.length];
      const mesh = new THREE.Mesh(geo, mat);

      const angle = (i / crystalCount) * Math.PI * 2;
      const radius = 22 + (i % 3) * 8;
      const yOffset = Math.sin(i * 1.5) * 18;

      mesh.position.set(
        Math.cos(angle) * radius * 0.8,
        yOffset,
        Math.sin(angle) * radius * 0.7
      );

      const wireOutline = new THREE.LineSegments(
        new THREE.WireframeGeometry(geo),
        new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.35 })
      );
      mesh.add(wireOutline);

      // Tuned for elegant, graceful slow-motion floating
      mesh.userData = {
        orbitSpeed: 0.0032 + (i % 4) * 0.0014, // Silky slow-motion orbit
        angle: angle,
        radius: radius,
        yBase: yOffset,
        rotX: (Math.random() - 0.5) * 0.04,
        rotY: (Math.random() - 0.5) * 0.04,
        pulseSpeed: 1.1 + (i % 3) * 0.35,
        followWeight: 1.1 + (i % 4) * 0.25,
        elasticity: 0.09 + (i % 3) * 0.025,
      };

      crystals.push(mesh);
      masterGroup.add(mesh);
    }

    // Pointer Parallax
    let pointerX = 0, pointerY = 0;
    let targetRotX = 0, targetRotY = 0;
    let cursorWorldX = 0, cursorWorldY = 0;
    const TOUCH_SENSITIVITY = 1.2;

    const updateCoordinates = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect ? container.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
      const px = (((clientX - rect.left) / rect.width) * 2 - 1) * TOUCH_SENSITIVITY;
      const py = -((((clientY - rect.top) / rect.height) * 2 - 1) * TOUCH_SENSITIVITY);
      pointerX = Math.max(-1.5, Math.min(1.5, px));
      pointerY = Math.max(-1.5, Math.min(1.5, py));

      targetRotY = pointerX * 0.45;
      targetRotX = -pointerY * 0.35;

      cursorWorldX = pointerX * 28;
      cursorWorldY = pointerY * 22;
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateCoordinates(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const onWindowResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onWindowResize);

    let clock = 0;
    let animFrameId: number;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      clock += 0.010; // Slow-motion progression

      masterGroup.rotation.y += (targetRotY - masterGroup.rotation.y) * 0.045;
      masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.045;

      coreMesh.rotation.x += 0.004 + pointerY * 0.008;
      coreMesh.rotation.y += 0.006 + pointerX * 0.008;
      innerMesh.rotation.x -= 0.009;
      innerMesh.rotation.y -= 0.010;
      wireMesh.rotation.x -= 0.0025;
      wireMesh.rotation.y -= 0.0035;

      const coreScale = 1 + Math.sin(clock * 1.2) * 0.035;
      coreMesh.scale.setScalar(coreScale);

      for (let c = 0; c < crystals.length; c++) {
        const item = crystals[c];
        item.userData.angle += item.userData.orbitSpeed;
        const rad = item.userData.radius + Math.sin(clock * 1.1 + c) * 2.8;

        const baseOrbX = Math.cos(item.userData.angle) * rad * 0.8;
        const baseOrbZ = Math.sin(item.userData.angle) * rad * 0.7;
        const baseOrbY = item.userData.yBase + Math.sin(clock * item.userData.pulseSpeed + c) * 3.6;

        const followOffset = item.userData.followWeight;
        const targetX = baseOrbX * 0.35 + (cursorWorldX * followOffset);
        const targetY = baseOrbY * 0.35 + (cursorWorldY * followOffset);
        const targetZ = baseOrbZ + (Math.sin(clock * 1.6 + c) * 4.5) + (Math.abs(pointerX) * 8);

        const lerpSpeed = item.userData.elasticity;
        item.position.x += (targetX - item.position.x) * lerpSpeed;
        item.position.y += (targetY - item.position.y) * lerpSpeed;
        item.position.z += (targetZ - item.position.z) * lerpSpeed;

        item.rotation.x += item.userData.rotX * (0.8 + Math.abs(pointerY) * 2.2);
        item.rotation.y += item.userData.rotY * (0.8 + Math.abs(pointerX) * 2.2);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', onWindowResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-transparent"
      style={{ opacity: 0.95 }}
    />
  );
};
