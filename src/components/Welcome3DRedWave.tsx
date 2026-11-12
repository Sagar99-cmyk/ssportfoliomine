import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// =========================================================================
// 1. FAST, ROBUST 3D SIMPLEX NOISE ALGORITHM (Zero External Dependencies)
// =========================================================================
class SimplexNoise {
  private grad3: number[][];
  private p: number[];
  private perm: number[];

  constructor() {
    this.grad3 = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];
    this.p = [];
    for (let i = 0; i < 256; i++) {
      this.p[i] = Math.floor(Math.random() * 256);
    }
    this.perm = [];
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
    }
  }

  private dot(g: number[], x: number, y: number, z: number): number {
    return g[0] * x + g[1] * y + g[2] * z;
  }

  public noise3D(xin: number, yin: number, zin: number): number {
    let n0: number, n1: number, n2: number, n3: number;
    const F3 = 1.0 / 3.0;
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const G3 = 1.0 / 6.0;
    const t = (i + j + k) * G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    const z0 = zin - Z0;

    let i1: number, j1: number, k1: number;
    let i2: number, j2: number, k2: number;

    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
      } else {
        i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
      }
    } else {
      if (y0 < z0) {
        i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
      } else if (x0 < z0) {
        i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
      } else {
        i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
      }
    }

    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2.0 * G3;
    const y2 = y0 - j2 + 2.0 * G3;
    const z2 = z0 - k2 + 2.0 * G3;
    const x3 = x0 - 1.0 + 3.0 * G3;
    const y3 = y0 - 1.0 + 3.0 * G3;
    const z3 = z0 - 1.0 + 3.0 * G3;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    const gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
    const gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
    const gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
    const gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) n0 = 0.0;
    else {
      t0 *= t0;
      n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0);
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) n1 = 0.0;
    else {
      t1 *= t1;
      n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1);
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) n2 = 0.0;
    else {
      t2 *= t2;
      n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2);
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) n3 = 0.0;
    else {
      t3 *= t3;
      n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3);
    }

    return 32.0 * (n0 + n1 + n2 + n3);
  }
}

// Procedural Glowing Star Texture Generator (Fallback & Instant Zero-Lag)
const generateGlowingParticleTexture = (color = '#ffffff', haloColor = '#ffe600') => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.2, color);
  gradient.addColorStop(0.5, haloColor);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

// Procedural Cosmic Deep Sky Texture Generator
const generateCosmicNebulaTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  // Dark deep space background
  ctx.fillStyle = '#06060c';
  ctx.fillRect(0, 0, 512, 512);

  // Soft cosmic dust clusters
  const gradients = [
    { x: 120, y: 140, r: 240, c: 'rgba(225, 29, 72, 0.25)' },
    { x: 380, y: 340, r: 260, c: 'rgba(245, 158, 11, 0.22)' },
    { x: 260, y: 220, r: 200, c: 'rgba(56, 189, 248, 0.18)' },
    { x: 420, y: 100, r: 180, c: 'rgba(168, 85, 247, 0.20)' },
  ];

  gradients.forEach(g => {
    const rad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
    rad.addColorStop(0, g.c);
    rad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 512, 512);
  });

  // Tiny distant star specks
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 1.5;
    ctx.fillStyle = Math.random() > 0.4 ? '#ffffff' : '#fef08a';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

// Procedural Molten Nucleus Texture Generator
const generateNucleusTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  // Warm golden-amber cosmic star core
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#f59e0b');
  grad.addColorStop(0.3, '#e11d48');
  grad.addColorStop(0.65, '#fbbf24');
  grad.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Surface cellular filaments
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * 512,
      Math.random() * 512,
      Math.random() * 90 + 20,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = i % 2 === 0 ? 'rgba(254, 240, 138, 0.15)' : 'rgba(225, 29, 72, 0.2)';
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

export const Welcome3DRedWave: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.01, 1000);
    camera.position.set(0, 0, width < 768 ? 260 : 230);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Volumetric Studio Lighting
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1.8);
    directionalLight.position.set(0, 50, -20);
    scene.add(directionalLight);

    const keyWarmLight = new THREE.DirectionalLight('#ffe600', 1.4);
    keyWarmLight.position.set(40, -30, 40);
    scene.add(keyWarmLight);

    const ambientLight = new THREE.AmbientLight('#ffffff', 0.85);
    ambientLight.position.set(0, 20, 20);
    scene.add(ambientLight);

    // 3. OrbitControls with Slow, Majestic Damped Auto-Rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45; // Slow-motion, majestic, cool movement
    controls.maxDistance = 350;
    controls.minDistance = 150;
    controls.enablePan = false;
    controls.enableZoom = false; // Smooth background without scroll capture

    // 4. Textures with instant procedural fallbacks
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    const defaultStarTex = generateGlowingParticleTexture('#ffffff', '#ffe600');
    const defaultNebulaTex = generateCosmicNebulaTexture();
    const defaultNucleusTex = generateNucleusTexture();

    const texturenucleus = defaultNucleusTex;
    texturenucleus.anisotropy = 16;

    // Try loading custom remote textures if online, fall back silently
    textureLoader.load(
      'https://i.ibb.co/hcN2qXk/star-nc8wkw.jpg',
      (tex) => {
        tex.anisotropy = 16;
        if (nucleus) (nucleus.material as THREE.MeshStandardMaterial).map = tex;
      },
      undefined,
      () => {}
    );

    const textureSphereBg = defaultNebulaTex;
    textureLoader.load(
      'https://i.ibb.co/HC0vxMw/sky2.jpg',
      (tex) => {
        tex.anisotropy = 16;
        if (sphereBg) (sphereBg.material as THREE.MeshBasicMaterial).map = tex;
      },
      undefined,
      () => {}
    );

    // 5. Central Organic Deforming Cosmic Nucleus
    const baseRadius = 30;
    const blobScale = 3.8;
    const nucleusGeometry = new THREE.IcosahedronGeometry(baseRadius, 10);
    const nucleusPosAttr = nucleusGeometry.attributes.position;
    const basePositions = Float32Array.from(nucleusPosAttr.array);
    const vertexCount = nucleusPosAttr.count;

    const nucleusMaterial = new THREE.MeshStandardMaterial({
      map: texturenucleus,
      roughness: 0.35,
      metalness: 0.25,
      emissive: new THREE.Color(0xf59e0b),
      emissiveIntensity: 0.35,
    });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    scene.add(nucleus);

    // 6. Celestial Background Sphere
    const geometrySphereBg = new THREE.SphereGeometry(150, 40, 40);
    const materialSphereBg = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      map: textureSphereBg,
      transparent: true,
      opacity: 0.95,
    });
    const sphereBg = new THREE.Mesh(geometrySphereBg, materialSphereBg);
    scene.add(sphereBg);

    // 7. Helper: Uniform random point on sphere surface
    const randomPointSphere = (radius: number): THREE.Vector3 => {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const dx = radius * Math.sin(phi) * Math.cos(theta);
      const dy = radius * Math.sin(phi) * Math.sin(theta);
      const dz = radius * Math.cos(phi);
      return new THREE.Vector3(dx, dy, dz);
    };

    // 8. Moving Warp Stars
    const movingStarCount = 60;
    const movingStarPositions = new Float32Array(movingStarCount * 3);
    const movingStarVelocities = new Float32Array(movingStarCount);
    const movingStarStartPos = new Float32Array(movingStarCount * 3);

    for (let i = 0; i < movingStarCount; i++) {
      const pt = randomPointSphere(150);
      const i3 = i * 3;
      movingStarPositions[i3] = pt.x;
      movingStarPositions[i3 + 1] = pt.y;
      movingStarPositions[i3 + 2] = pt.z;

      movingStarStartPos[i3] = pt.x;
      movingStarStartPos[i3 + 1] = pt.y;
      movingStarStartPos[i3 + 2] = pt.z;

      movingStarVelocities[i] = Math.floor(Math.random() * 200) + 80;
    }

    const movingStarGeo = new THREE.BufferGeometry();
    movingStarGeo.setAttribute('position', new THREE.BufferAttribute(movingStarPositions, 3));

    const movingStarMat = new THREE.PointsMaterial({
      size: 5,
      color: '#ffffff',
      transparent: true,
      opacity: 0.85,
      map: defaultStarTex,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const movingStars = new THREE.Points(movingStarGeo, movingStarMat);
    scene.add(movingStars);

    // 9. Fixed Twinkling Star Clusters
    const createStars = (tex: THREE.Texture, size: number, total: number, colorHex = '#ffffff') => {
      const positions = new Float32Array(total * 3);
      for (let i = 0; i < total; i++) {
        const radius = Math.floor(Math.random() * 79) + 70;
        const pt = randomPointSphere(radius);
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = pt.z;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        size,
        color: colorHex,
        map: tex,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return new THREE.Points(geo, mat);
    };

    const goldStarTex = generateGlowingParticleTexture('#ffe600', '#f59e0b');
    const cyanStarTex = generateGlowingParticleTexture('#38bdf8', '#0284c7');

    const starCluster1 = createStars(defaultStarTex, 14, 25, '#ffffff');
    const starCluster2 = createStars(goldStarTex, 6, 12, '#fef08a');
    const starCluster3 = createStars(cyanStarTex, 8, 10, '#bae6fd');

    scene.add(starCluster1);
    scene.add(starCluster2);
    scene.add(starCluster3);

    // 10. Organic Simplex Noise Engine
    const noise = new SimplexNoise();
    const tempVec = new THREE.Vector3();
    const clock = new THREE.Clock();

    // 11. 60 FPS Animation Loop
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Slow, majestic auto-orbiting controls
      controls.update();

      // A. Moving Stars Animation (Smooth Slow-Motion Warp Glide)
      const starPosAttr = movingStarGeo.attributes.position as THREE.BufferAttribute;
      const starPosArr = starPosAttr.array as Float32Array;

      for (let i = 0; i < movingStarCount; i++) {
        const i3 = i * 3;
        const vel = movingStarVelocities[i];

        starPosArr[i3] += (0 - starPosArr[i3]) / (vel * 2.2);
        starPosArr[i3 + 1] += (0 - starPosArr[i3 + 1]) / (vel * 2.2);
        starPosArr[i3 + 2] += (0 - starPosArr[i3 + 2]) / (vel * 2.2);

        movingStarVelocities[i] -= 0.035;

        if (
          Math.abs(starPosArr[i3]) <= 6 &&
          Math.abs(starPosArr[i3 + 1]) <= 6 &&
          Math.abs(starPosArr[i3 + 2]) <= 6
        ) {
          starPosArr[i3] = movingStarStartPos[i3];
          starPosArr[i3 + 1] = movingStarStartPos[i3 + 1];
          starPosArr[i3 + 2] = movingStarStartPos[i3 + 2];
          movingStarVelocities[i] = Math.floor(Math.random() * 260) + 100;
        }
      }
      starPosAttr.needsUpdate = true;

      // B. Organic Nucleus Simplex Noise Surface Morphing (Slow & Serene)
      const nucleusPos = nucleusPosAttr.array as Float32Array;
      const timeScale = elapsed * 0.12; // 3x slower for serene organic motion

      for (let i = 0; i < vertexCount; i++) {
        const i3 = i * 3;
        tempVec.set(basePositions[i3], basePositions[i3 + 1], basePositions[i3 + 2]).normalize();

        const distance =
          baseRadius +
          noise.noise3D(
            tempVec.x + timeScale * 0.4,
            tempVec.y + timeScale * 0.28,
            tempVec.z + timeScale * 0.32
          ) *
            blobScale;

        tempVec.multiplyScalar(distance);
        nucleusPos[i3] = tempVec.x;
        nucleusPos[i3 + 1] = tempVec.y;
        nucleusPos[i3 + 2] = tempVec.z;
      }

      nucleusPosAttr.needsUpdate = true;
      nucleusGeometry.computeVertexNormals();

      // Gentle Slow Nucleus Rotation
      nucleus.rotation.y += 0.0006;
      nucleus.rotation.x += 0.0003;

      // C. Celestial Background Sphere Slow Motion Rotation
      sphereBg.rotation.x += 0.0002;
      sphereBg.rotation.y += 0.00025;
      sphereBg.rotation.z += 0.0002;

      // D. Fixed Star Clusters Micro-Twinkle
      starCluster1.rotation.y += 0.00015;
      starCluster2.rotation.y -= 0.0002;
      starCluster3.rotation.z += 0.00015;

      renderer.render(scene, camera);
    };

    animate();

    // 12. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.position.z = width < 768 ? 260 : 230;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);

      controls.dispose();
      renderer.dispose();
      nucleusGeometry.dispose();
      nucleusMaterial.dispose();
      geometrySphereBg.dispose();
      materialSphereBg.dispose();
      movingStarGeo.dispose();
      movingStarMat.dispose();

      [starCluster1, starCluster2, starCluster3].forEach(cluster => {
        cluster.geometry.dispose();
        (cluster.material as THREE.Material).dispose();
      });

      defaultStarTex.dispose();
      defaultNebulaTex.dispose();
      defaultNucleusTex.dispose();
      goldStarTex.dispose();
      cyanStarTex.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden select-none">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Bottom Footer Exploration Hint: DRAG TO EXPLORE */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-none hidden sm:flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#ffe600]/80 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#ffe600]/30 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ffe600] animate-pulse" />
        <span>Drag to Explore</span>
      </div>
    </div>
  );
};
