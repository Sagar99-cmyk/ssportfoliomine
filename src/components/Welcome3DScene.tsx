import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Welcome3DScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    // Warm deep charcoal/espresso background matching reference
    scene.background = new THREE.Color(0x191411);
    scene.fog = new THREE.FogExp2(0x191411, 0.032);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Camera positioned slightly lower and further back so pillars sit elegantly below the text
    camera.position.set(0, 1.4, 11.8);
    camera.lookAt(0, 1.2, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 3. Materials
    // Warm Ochre / Mustard Yellow for the 3 pedestal columns
    const columnMaterial = new THREE.MeshStandardMaterial({
      color: 0xc48c26, // Warm golden ochre matching reference
      roughness: 0.38,
      metalness: 0.15,
    });

    // Golden wooden floating shelf
    const shelfMaterial = new THREE.MeshStandardMaterial({
      color: 0xb57e20,
      roughness: 0.45,
      metalness: 0.12,
    });

    // Lush Emerald/Jade Green for succulent plant spheres
    const plantMaterial = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.55,
      metalness: 0.05,
    });

    // Vibrant Vine Green for hanging strands
    const vineMaterial = new THREE.MeshStandardMaterial({
      color: 0x166534,
      roughness: 0.65,
      metalness: 0.05,
    });

    // Pure White Matte Ceramic for sphere bowl and chess pawn
    const whiteCeramicMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.02,
    });

    // Dark Warm Ground Floor
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x14100e,
      roughness: 0.75,
      metalness: 0.08,
    });

    // Back Wall
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x191411,
      roughness: 0.95,
      metalness: 0.0,
    });

    // 4. Geometries & Meshes
    // (A) Back Wall
    const wallGeom = new THREE.PlaneGeometry(40, 25);
    const wallMesh = new THREE.Mesh(wallGeom, wallMaterial);
    wallMesh.position.set(0, 4.5, -3.2);
    wallMesh.receiveShadow = true;
    scene.add(wallMesh);

    // (B) Floor Plane
    const floorGeom = new THREE.PlaneGeometry(40, 40);
    const floorMesh = new THREE.Mesh(floorGeom, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.6;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Main group for architectural elements
    const sceneGroup = new THREE.Group();
    // Offset slightly downwards so title text sits clearly above
    sceneGroup.position.set(0, -0.2, 0);
    scene.add(sceneGroup);

    // (C) Three Golden Columns / Pedestals (Center)
    // Left Column: Medium height (3.4 units)
    const colLeftGeom = new THREE.BoxGeometry(1.3, 3.4, 1.25);
    const colLeft = new THREE.Mesh(colLeftGeom, columnMaterial);
    colLeft.position.set(-1.35, 0.1, 0);
    colLeft.castShadow = true;
    colLeft.receiveShadow = true;
    sceneGroup.add(colLeft);

    // Center Column: Tallest height (5.2 units)
    const colCenterGeom = new THREE.BoxGeometry(1.3, 5.2, 1.25);
    const colCenter = new THREE.Mesh(colCenterGeom, columnMaterial);
    colCenter.position.set(0, 1.0, 0);
    colCenter.castShadow = true;
    colCenter.receiveShadow = true;
    sceneGroup.add(colCenter);

    // Right Column: Medium-tall height (4.3 units)
    const colRightGeom = new THREE.BoxGeometry(1.3, 4.3, 1.25);
    const colRight = new THREE.Mesh(colRightGeom, columnMaterial);
    colRight.position.set(1.35, 0.55, 0);
    colRight.castShadow = true;
    colRight.receiveShadow = true;
    sceneGroup.add(colRight);

    // (D) White Ceramic Sphere on Left Column Top
    // Left column top is at 0.1 + 3.4 / 2 = 1.8.
    const sphereVaseGeom = new THREE.SphereGeometry(0.42, 36, 36);
    const sphereVase = new THREE.Mesh(sphereVaseGeom, whiteCeramicMaterial);
    sphereVase.position.set(-1.35, 2.22, 0);
    sphereVase.castShadow = true;
    sphereVase.receiveShadow = true;
    sceneGroup.add(sphereVase);

    // (E) Floating Wooden Shelf with Plant & Hanging Vines (Left Side)
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(-3.7, 2.7, 0.1);
    sceneGroup.add(shelfGroup);

    // Shelf plank
    const shelfPlankGeom = new THREE.BoxGeometry(2.4, 0.12, 0.75);
    const shelfPlank = new THREE.Mesh(shelfPlankGeom, shelfMaterial);
    shelfPlank.castShadow = true;
    shelfPlank.receiveShadow = true;
    shelfGroup.add(shelfPlank);

    // Plant succulent spheres clustered on the shelf
    const plantCluster = new THREE.Group();
    plantCluster.position.set(-0.3, 0.36, 0);
    shelfGroup.add(plantCluster);

    const plantSpheres = [
      { r: 0.44, x: 0, y: 0.1, z: 0 },
      { r: 0.38, x: -0.34, y: -0.06, z: 0.12 },
      { r: 0.35, x: 0.32, y: -0.08, z: -0.08 },
      { r: 0.28, x: -0.16, y: 0.3, z: 0.14 },
      { r: 0.25, x: 0.22, y: 0.24, z: 0.1 },
    ];

    plantSpheres.forEach(p => {
      const g = new THREE.SphereGeometry(p.r, 24, 24);
      const m = new THREE.Mesh(g, plantMaterial);
      m.position.set(p.x, p.y, p.z);
      m.castShadow = true;
      plantCluster.add(m);
    });

    // Hanging Vine Strands under the shelf
    const vineCount = 11;
    for (let i = 0; i < vineCount; i++) {
      const vineLen = 1.1 + Math.sin(i * 1.4) * 0.45 + (i % 3) * 0.2;
      const vineGeom = new THREE.CylinderGeometry(0.024, 0.016, vineLen, 8);
      const vine = new THREE.Mesh(vineGeom, vineMaterial);
      const xOffset = -0.92 + (i / (vineCount - 1)) * 1.84;
      vine.position.set(xOffset, -vineLen / 2 - 0.06, 0.14 + (Math.sin(i * 2) * 0.06));
      vine.rotation.z = (Math.sin(i * 3.3) * 0.04);
      vine.castShadow = true;
      shelfGroup.add(vine);
    }

    // (F) White Chess Pawn / Figurine on Floor (Bottom Left)
    const pawnGroup = new THREE.Group();
    // Sitting on floor at y = -1.6 (sceneGroup offset -0.2 -> y = -1.4)
    pawnGroup.position.set(-2.2, -1.4, 3.2);
    sceneGroup.add(pawnGroup);

    // Pawn Base disc
    const pawnBaseGeom = new THREE.CylinderGeometry(0.24, 0.32, 0.14, 28);
    const pawnBase = new THREE.Mesh(pawnBaseGeom, whiteCeramicMaterial);
    pawnBase.position.y = 0.07;
    pawnBase.castShadow = true;
    pawnBase.receiveShadow = true;
    pawnGroup.add(pawnBase);

    // Pawn Body
    const pawnBodyGeom = new THREE.CylinderGeometry(0.12, 0.22, 0.54, 28);
    const pawnBody = new THREE.Mesh(pawnBodyGeom, whiteCeramicMaterial);
    pawnBody.position.y = 0.4;
    pawnBody.castShadow = true;
    pawnBody.receiveShadow = true;
    pawnGroup.add(pawnBody);

    // Pawn Collar Ring
    const pawnNeckGeom = new THREE.TorusGeometry(0.14, 0.03, 16, 28);
    const pawnNeck = new THREE.Mesh(pawnNeckGeom, whiteCeramicMaterial);
    pawnNeck.rotation.x = Math.PI / 2;
    pawnNeck.position.y = 0.67;
    pawnNeck.castShadow = true;
    pawnGroup.add(pawnNeck);

    // Pawn Head Sphere
    const pawnHeadGeom = new THREE.SphereGeometry(0.2, 28, 28);
    const pawnHead = new THREE.Mesh(pawnHeadGeom, whiteCeramicMaterial);
    pawnHead.position.y = 0.88;
    pawnHead.castShadow = true;
    pawnHead.receiveShadow = true;
    pawnGroup.add(pawnHead);

    // (G) Atmospheric Floating Warm Golden Dust Bokeh Particles
    const particleCount = 55;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = Math.random() * 8 - 1;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8 + 1;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Glow circle texture for particles
    const createParticleTexture = () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const gctx = c.getContext('2d')!;
      const grad = gctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 230, 160, 1)');
      grad.addColorStop(0.35, 'rgba(235, 175, 75, 0.6)');
      grad.addColorStop(0.7, 'rgba(200, 120, 30, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      gctx.fillStyle = grad;
      gctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    };

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      map: createParticleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 5. Lighting Setup (Directional Sunlight with Soft Shadows + Ambient Fill)
    // Warm ambient light
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.35);
    scene.add(ambientLight);

    // Key Light from top-right casting soft shadows to the left
    const keyLight = new THREE.DirectionalLight(0xfffaea, 2.7);
    keyLight.position.set(7.5, 9.5, 6.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 28;
    keyLight.shadow.camera.left = -9;
    keyLight.shadow.camera.right = 9;
    keyLight.shadow.camera.top = 9;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 2.5; // Soft shadow edges
    scene.add(keyLight);

    // Warm Amber Fill Light from front-left
    const fillLight = new THREE.PointLight(0xd98d28, 1.4, 20);
    fillLight.position.set(-6, 3, 5);
    scene.add(fillLight);

    // Overhead subtle accent spotlight
    const spotTop = new THREE.SpotLight(0xffebc8, 1.6, 16, Math.PI / 4, 0.45, 1);
    spotTop.position.set(0, 7.5, 2.5);
    spotTop.target = colCenter;
    scene.add(spotTop);

    // 6. Interactive Mouse & Touch Parallax + Cinematic Video Drift
    let targetRotX = 0;
    let targetRotY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = normX * 0.08;
      targetRotX = -normY * 0.04;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const normX = (touch.clientX / window.innerWidth) * 2 - 1;
        const normY = -(touch.clientY / window.innerHeight) * 2 + 1;
        targetRotY = normX * 0.08;
        targetRotX = -normY * 0.04;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);

    // Window Resize
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // 7. Render Loop with Cinematic Video Drift
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Cinematic gentle floating camera drift (like a slow high-end video dolly)
      const cinematicPanX = Math.sin(elapsed * 0.35) * 0.15;
      const cinematicPanY = Math.cos(elapsed * 0.25) * 0.08;

      camera.position.x += (cinematicPanX + targetRotY * 2.5 - camera.position.x) * 0.05;
      camera.position.y += (1.4 + cinematicPanY + targetRotX * 1.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 1.2 + Math.sin(elapsed * 0.4) * 0.04, 0);

      // Subtle breathing rotation of model
      sceneGroup.rotation.y = Math.sin(elapsed * 0.25) * 0.015;

      // Drifting golden dust motes
      const posAttr = particleGeom.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        let py = posAttr.getY(i) + Math.sin(elapsed * 0.7 + i) * 0.003;
        if (py > 7) py = -1;
        posAttr.setY(i, py);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ overflow: 'hidden' }}
    />
  );
};
