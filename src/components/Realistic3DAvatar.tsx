import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

interface Realistic3DAvatarProps {
  className?: string;
  onExpressionChange?: (expr: string) => void;
  selectedExpression?: AvatarExpression;
  showChips?: boolean;
}

export type AvatarExpression = 'happy' | 'confident' | 'thinking' | 'surprised' | 'winking' | 'sad';

export const Realistic3DAvatar: React.FC<Realistic3DAvatarProps> = ({
  className = '',
  onExpressionChange,
  selectedExpression,
  showChips = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentExpression, setCurrentExpression] = useState<AvatarExpression>(selectedExpression || 'confident');
  const [isNoddingUI, setIsNoddingUI] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // References to communicate with Three.js animation loop
  const setExpressionRef = useRef<((expr: AvatarExpression) => void) | null>(null);
  const triggerNodRef = useRef<(() => void) | null>(null);
  const updateLightingThemeRef = useRef<((lightMode: boolean) => void) | null>(null);

  useEffect(() => {
    if (selectedExpression && setExpressionRef.current) {
      setExpressionRef.current(selectedExpression);
      setCurrentExpression(selectedExpression);
    }
  }, [selectedExpression]);

  // Update Three.js lighting dynamically when theme changes
  useEffect(() => {
    if (updateLightingThemeRef.current) {
      updateLightingThemeRef.current(isLight);
    }
  }, [isLight]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 320;
    let height = container.clientHeight || 320;

    const scene = new THREE.Scene();

    // 1. MATCH CAMERA ANGLE: 85mm portrait telephoto studio lens (low-angle perspective tilted slightly upward)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, -0.12, 4.8);
    camera.lookAt(0, 0.22, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLight ? 1.25 : 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // =========================================================================
    // STUDIO 3-POINT LIGHTING RIG (Adapts dynamically to Light & Dark Theme)
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(isLight ? 0xffffff : 0xfff7f0, isLight ? 1.45 : 1.05);
    scene.add(ambientLight);

    // Key Light (Warm softbox from top right, casting realistic soft shadows)
    const keyLight = new THREE.DirectionalLight(isLight ? 0xfffbf5 : 0xfff3ea, isLight ? 2.6 : 2.5);
    keyLight.position.set(2.6, 3.8, 3.2);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill Light (Soft cool bounce from left to illuminate cheek contours)
    const fillLight = new THREE.DirectionalLight(isLight ? 0xf8fafc : 0xe2f0fe, isLight ? 1.3 : 1.45);
    fillLight.position.set(-3.2, 1.0, 2.8);
    scene.add(fillLight);

    // Crimson Rim / Edge Kicker (Brand accent silhouette edge pop)
    const rimLight = new THREE.DirectionalLight(isLight ? 0xf43f5e : 0xe11d48, isLight ? 1.8 : 2.9);
    rimLight.position.set(-1.9, 3.2, -3.0);
    scene.add(rimLight);

    // Subtle Cyan Accent Rim
    const rimLightCyan = new THREE.DirectionalLight(0x38bdf8, isLight ? 1.1 : 1.6);
    rimLightCyan.position.set(2.4, -1.0, -2.5);
    scene.add(rimLightCyan);

    // Update lighting theme callback
    updateLightingThemeRef.current = (light: boolean) => {
      renderer.toneMappingExposure = light ? 1.25 : 1.18;
      ambientLight.color.setHex(light ? 0xffffff : 0xfff7f0);
      ambientLight.intensity = light ? 1.45 : 1.05;
      keyLight.intensity = light ? 2.6 : 2.5;
      fillLight.intensity = light ? 1.3 : 1.45;
      rimLight.color.setHex(light ? 0xf43f5e : 0xe11d48);
      rimLight.intensity = light ? 1.8 : 2.9;
    };

    // =========================================================================
    // AVATAR ARMATURE HIERARCHY
    // =========================================================================
    const avatarRoot = new THREE.Group();
    scene.add(avatarRoot);

    const spineGroup = new THREE.Group();
    spineGroup.position.set(0, -1.35, 0);
    avatarRoot.add(spineGroup);

    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 1.18, 0);
    spineGroup.add(neckGroup);

    // Initial upward-facing tilt
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.46, 0);
    headGroup.rotation.x = -0.10;
    neckGroup.add(headGroup);

    // Procedural Micro-Texture Generation for Skin Pores
    function createPoreNoiseTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imgData = ctx.createImageData(128, 128);
        for (let i = 0; i < imgData.data.length; i += 4) {
          const val = 128 + (Math.random() - 0.5) * 35;
          imgData.data[i] = val;
          imgData.data[i + 1] = val;
          imgData.data[i + 2] = val;
          imgData.data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(8, 8);
      return tex;
    }

    const poreNoiseTex = createPoreNoiseTexture();

    // HIGH-END PHYSICAL SHADING (MeshPhysicalMaterial with Subsurface Scattering)
    const skinMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc88f6c,              // Warm photorealistic skin tone
      roughness: 0.55,              // Soft matte skin with realistic gloss balance
      roughnessMap: poreNoiseTex,
      metalness: 0.0,
      clearcoat: 0.12,              // Fine moisture layer on human skin
      clearcoatRoughness: 0.25,
      transmission: 0.08,           // Translucency for ears/nose bridge SSS feel
      thickness: 0.55,
      reflectivity: 0.45,
    });

    const hairMaterial = new THREE.MeshStandardMaterial({
      color: 0x161311,
      roughness: 0.88,
      metalness: 0.08,
    });

    const suitMaterial = new THREE.MeshStandardMaterial({
      color: 0x12151e, // Sharp formal midnight black suit jacket
      roughness: 0.78,
      metalness: 0.12,
    });

    const shirtMaterial = new THREE.MeshStandardMaterial({
      color: 0xfafafa, // Crisp formal white collared shirt
      roughness: 0.55,
      metalness: 0.04,
    });

    const tieMaterial = new THREE.MeshStandardMaterial({
      color: 0x9f1239, // Rich crimson-red satin tie
      roughness: 0.32,
      metalness: 0.28,
    });

    // --- HEAD BASE & FACIAL ANATOMY ---
    const headGeo = new THREE.SphereGeometry(0.72, 36, 36);
    headGeo.scale(1.0, 1.24, 1.05);
    const headMesh = new THREE.Mesh(headGeo, skinMaterial);
    headGroup.add(headMesh);

    // Realistic Ears with SSS feel
    const earGeo = new THREE.SphereGeometry(0.19, 16, 16);
    earGeo.scale(0.38, 1.25, 0.72);
    const leftEar = new THREE.Mesh(earGeo, skinMaterial);
    leftEar.position.set(-0.76, 0.04, -0.04);
    leftEar.rotation.z = -0.16;
    const rightEar = new THREE.Mesh(earGeo, skinMaterial);
    rightEar.position.set(0.76, 0.04, -0.04);
    rightEar.rotation.z = 0.16;
    headGroup.add(leftEar);
    headGroup.add(rightEar);

    // --- SHORT-TRIMMED CLEAN-CUT HAIR SCULPT ---
    const hairCapGeo = new THREE.SphereGeometry(0.76, 36, 28, 0, Math.PI * 2, 0, Math.PI * 0.58);
    hairCapGeo.scale(1.02, 1.18, 1.06);
    const hairCap = new THREE.Mesh(hairCapGeo, hairMaterial);
    hairCap.position.set(0, 0.12, -0.04);
    headGroup.add(hairCap);

    for (let h = 0; h < 16; h++) {
      const angle = (h / 16 - 0.5) * 1.55;
      const strandGeo = new THREE.ConeGeometry(0.08, 0.34, 8);
      const strand = new THREE.Mesh(strandGeo, hairMaterial);
      strand.position.set(Math.sin(angle) * 0.65, 0.74 - Math.abs(angle) * 0.15, Math.cos(angle) * 0.52);
      strand.rotation.set(-0.62, 0, -angle * 0.85);
      headGroup.add(strand);
    }

    // --- SAGAR SINGH'S AUTHENTIC FACIAL IDENTITY TEXTURE PROJECTION ---
    // Curved facial mask conforming to Sagar's actual face structure and photograph
    const texLoader = new THREE.TextureLoader();
    const sagarFaceOpenTex = texLoader.load('/profile-transparent-open.png');
    const sagarFaceClosedTex = texLoader.load('/profile-transparent-closed.png');
    sagarFaceOpenTex.generateMipmaps = true;
    sagarFaceOpenTex.minFilter = THREE.LinearMipmapLinearFilter;
    sagarFaceClosedTex.generateMipmaps = true;
    sagarFaceClosedTex.minFilter = THREE.LinearMipmapLinearFilter;

    const facePlateGeo = new THREE.PlaneGeometry(1.48, 1.62, 20, 20);
    const posAttr = facePlateGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      // Parabolic curve wrapping around facial contours
      const z = -Math.pow(x, 2) * 0.28;
      posAttr.setZ(i, z);
    }
    facePlateGeo.computeVertexNormals();

    const facePlateMat = new THREE.MeshStandardMaterial({
      map: sagarFaceOpenTex,
      transparent: true,
      roughness: 0.48,
      metalness: 0.04,
      alphaTest: 0.05,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const facePlateMesh = new THREE.Mesh(facePlateGeo, facePlateMat);
    facePlateMesh.position.set(0, 0.04, 0.74);
    headGroup.add(facePlateMesh);

    // --- NECK, FORMAL COLLARED SHIRT, CRIMSON SATIN TIE & BLACK SUIT ---
    const neckGeo = new THREE.CylinderGeometry(0.33, 0.39, 0.76, 24);
    const neck = new THREE.Mesh(neckGeo, skinMaterial);
    neck.position.set(0, 0.06, -0.04);
    neckGroup.add(neck);

    // Crisp White Collared Dress Shirt
    const collarLeftGeo = new THREE.BoxGeometry(0.13, 0.36, 0.33);
    const collarLeft = new THREE.Mesh(collarLeftGeo, shirtMaterial);
    collarLeft.position.set(-0.25, 0.45, 0.36);
    collarLeft.rotation.set(0.32, 0.22, -0.42);
    spineGroup.add(collarLeft);

    const collarRightGeo = new THREE.BoxGeometry(0.13, 0.36, 0.33);
    const collarRight = new THREE.Mesh(collarRightGeo, shirtMaterial);
    collarRight.position.set(0.25, 0.45, 0.36);
    collarRight.rotation.set(0.32, -0.22, 0.42);
    spineGroup.add(collarRight);

    // Crimson-Red Satin Necktie
    const tieKnotGeo = new THREE.ConeGeometry(0.12, 0.19, 4);
    tieKnotGeo.rotateY(Math.PI * 0.25);
    const tieKnot = new THREE.Mesh(tieKnotGeo, tieMaterial);
    tieKnot.position.set(0, 0.41, 0.45);
    tieKnot.rotation.x = Math.PI;
    spineGroup.add(tieKnot);

    const tieBladeGeo = new THREE.BoxGeometry(0.19, 0.96, 0.04);
    const tieBlade = new THREE.Mesh(tieBladeGeo, tieMaterial);
    tieBlade.position.set(0, -0.16, 0.47);
    tieBlade.rotation.x = 0.06;
    spineGroup.add(tieBlade);

    // Sharp Formal Black Suit Jacket & Shoulders
    const torsoGeo = new THREE.CylinderGeometry(0.88, 1.06, 1.62, 28);
    torsoGeo.scale(1.48, 1.0, 0.96);
    const torso = new THREE.Mesh(torsoGeo, suitMaterial);
    torso.position.set(0, -0.46, -0.02);
    spineGroup.add(torso);

    // Suit Lapels
    const lapelLeftGeo = new THREE.BoxGeometry(0.16, 0.82, 0.11);
    const lapelLeft = new THREE.Mesh(lapelLeftGeo, suitMaterial);
    lapelLeft.position.set(-0.39, 0.11, 0.47);
    lapelLeft.rotation.set(0.16, 0.16, -0.22);
    spineGroup.add(lapelLeft);

    const lapelRightGeo = new THREE.BoxGeometry(0.16, 0.82, 0.11);
    const lapelRight = new THREE.Mesh(lapelRightGeo, suitMaterial);
    lapelRight.position.set(0.39, 0.11, 0.47);
    lapelRight.rotation.set(0.16, -0.16, 0.22);
    spineGroup.add(lapelRight);

    // Formal Monogram Crest / Insignia Badge
    const badgeGeo = new THREE.CircleGeometry(0.082, 20);
    const badgeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25, metalness: 0.5 });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(0.64, 0.02, 0.47);
    badge.rotation.y = 0.26;
    spineGroup.add(badge);

    // Pedestal Ambient Studio Lighting Halo
    const haloGeo = new THREE.RingGeometry(1.65, 1.9, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: isLight ? 0xf43f5e : 0xe11d48,
      transparent: true,
      opacity: isLight ? 0.22 : 0.28,
      side: THREE.DoubleSide
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = -Math.PI * 0.5;
    halo.position.y = -1.48;
    avatarRoot.add(halo);

    // =========================================================================
    // EXPRESSION TARGETS & INTERPOLATION
    // =========================================================================
    let targetSmile = 0.45;
    let targetHeadPitchOffset = 0.06;
    let targetHeadYawOffset = 0.0;
    let targetHeadRollOffset = 0.0;

    let curSmile = 0.45;
    let curHeadPitchOffset = 0.06;
    let curHeadYawOffset = 0.0;
    let curHeadRollOffset = 0.0;

    let activeExpr: AvatarExpression = 'confident';

    function setExpression(expr: AvatarExpression) {
      activeExpr = expr;
      targetSmile = 0.0;
      targetHeadYawOffset = 0.0;
      targetHeadRollOffset = 0.0;

      if (expr === 'happy') {
        targetSmile = 1.0;
        targetHeadPitchOffset = 0.03;
        haloMat.color.setHex(0xe11d48);
      } else if (expr === 'sad') {
        targetSmile = 0.0;
        targetHeadPitchOffset = -0.14;
        haloMat.color.setHex(0x64748b);
      } else if (expr === 'confident') {
        targetSmile = 0.45;
        targetHeadPitchOffset = 0.06;
        haloMat.color.setHex(0x38bdf8);
      } else if (expr === 'surprised') {
        targetSmile = 0.2;
        targetHeadPitchOffset = -0.06;
        haloMat.color.setHex(0xf59e0b);
      } else if (expr === 'thinking') {
        targetSmile = 0.18;
        targetHeadPitchOffset = 0.05;
        targetHeadYawOffset = 0.12;
        targetHeadRollOffset = 0.10;
        haloMat.color.setHex(0x8b5cf6);
      } else if (expr === 'winking') {
        targetSmile = 0.85;
        targetHeadPitchOffset = 0.04;
        targetHeadRollOffset = -0.06;
        haloMat.color.setHex(0x10b981);
      }
    }

    setExpressionRef.current = setExpression;

    // Kinematics & Pointer Engine
    let breathingSpeed = 1.35;
    let breathingDepth = 0.024;
    let cursorSensitivityX = 0.42; // Clamped natural range
    let cursorSensitivityY = 0.32;
    let dampingFactor = 0.085;

    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    function onPointerMove(e: PointerEvent | TouchEvent) {
      const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as PointerEvent).clientX;
      const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : (e as PointerEvent).clientY;
      targetMouseX = Math.max(-1, Math.min(1, (clientX / window.innerWidth) * 2 - 1));
      targetMouseY = Math.max(-1, Math.min(1, -(clientY / window.innerHeight) * 2 + 1));
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    // Interactive Head Nod
    let isNodding = false;
    let nodStartTime = 0;
    const nodDuration = 1.3;
    let clickHaloImpulse = 0;

    function triggerHeadNod() {
      isNodding = true;
      nodStartTime = clock;
      clickHaloImpulse = 0.45;
      keyLight.intensity = isLight ? 2.9 : 2.7;
      setIsNoddingUI(true);
      setTimeout(() => {
        keyLight.intensity = isLight ? 2.6 : 2.5;
        setIsNoddingUI(false);
      }, 350);
    }

    triggerNodRef.current = triggerHeadNod;

    // Real-Time Natural Blinking
    let nextBlinkTime = 2.4;
    let isBlinking = false;
    let blinkProgress = 0;
    let clock = 0;
    let animId: number;

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 320;
      height = container.clientHeight || 320;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    function animate() {
      animId = requestAnimationFrame(animate);
      const delta = 0.016;
      clock += delta;

      // Blendshape interpolation
      curSmile += (targetSmile - curSmile) * 0.09;
      curHeadPitchOffset += (targetHeadPitchOffset - curHeadPitchOffset) * 0.09;
      curHeadYawOffset += (targetHeadYawOffset - curHeadYawOffset) * 0.09;
      curHeadRollOffset += (targetHeadRollOffset - curHeadRollOffset) * 0.09;

      // Pointer tracking
      mouseX += (targetMouseX - mouseX) * dampingFactor;
      mouseY += (targetMouseY - mouseY) * dampingFactor;

      // Subtle Breathing
      const breathFreq = activeExpr === 'sad' ? 0.95 : breathingSpeed;
      const breathCycle = Math.sin(clock * breathFreq);
      const breathLift = breathCycle * breathingDepth;
      spineGroup.position.y = -1.35 + breathLift;
      torso.scale.x = 1.48 + breathCycle * (breathingDepth * 1.1);
      torso.scale.z = 0.96 + breathCycle * (breathingDepth * 1.4);

      // Nod reaction
      let nodAngleX = 0;
      let nodAngleNeckX = 0;

      if (isNodding) {
        const elapsed = clock - nodStartTime;
        if (elapsed < nodDuration) {
          const progress = elapsed / nodDuration;
          const nodWave = Math.sin(progress * Math.PI * 3.8) * Math.exp(-progress * 2.8);
          nodAngleX = nodWave * 0.35;
          nodAngleNeckX = nodWave * 0.15;
        } else {
          isNodding = false;
        }
      }

      // Armature rotations (clamped to natural restrained ranges)
      headGroup.rotation.x = -0.10 - mouseY * cursorSensitivityY + nodAngleX + Math.sin(clock * 0.8) * 0.010 + curHeadPitchOffset;
      headGroup.rotation.y = mouseX * cursorSensitivityX + curHeadYawOffset;
      headGroup.rotation.z = -mouseX * 0.10 + curHeadRollOffset;

      neckGroup.rotation.x = -0.03 - mouseY * (cursorSensitivityY * 0.35) + nodAngleNeckX + breathCycle * 0.008 + (curHeadPitchOffset * 0.3);
      neckGroup.rotation.y = mouseX * (cursorSensitivityX * 0.35) + (curHeadYawOffset * 0.4);

      // Blinking Logic
      if (!isBlinking && clock > nextBlinkTime && activeExpr !== 'winking') {
        isBlinking = true;
        blinkProgress = 0;
        facePlateMat.map = sagarFaceClosedTex;
        facePlateMat.needsUpdate = true;
      }

      if (isBlinking) {
        blinkProgress += delta * 14.0;
        if (blinkProgress >= Math.PI) {
          isBlinking = false;
          facePlateMat.map = sagarFaceOpenTex;
          facePlateMat.needsUpdate = true;
          // Natural randomized interval between 3.5s and 6.5s
          nextBlinkTime = clock + 3.2 + Math.random() * 3.3;
        }
      }

      // Halo impulse
      if (clickHaloImpulse > 0.001) {
        clickHaloImpulse *= 0.94;
        halo.scale.set(1.0 + clickHaloImpulse * 0.22, 1.0 + clickHaloImpulse * 0.22, 1.0);
        haloMat.opacity = (isLight ? 0.22 : 0.28) + clickHaloImpulse * 0.45;
      } else {
        halo.scale.set(1.0, 1.0, 1.0);
        haloMat.opacity = isLight ? 0.22 : 0.28;
      }
      halo.rotation.z = clock * 0.25;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const switchExpression = (expr: AvatarExpression) => {
    setCurrentExpression(expr);
    if (setExpressionRef.current) {
      setExpressionRef.current(expr);
    }
    if (onExpressionChange) {
      onExpressionChange(expr);
    }
  };

  const handleAvatarClick = () => {
    if (triggerNodRef.current) {
      triggerNodRef.current();
    }
  };

  const expressions: { key: AvatarExpression; label: string; icon: string }[] = [
    { key: 'confident', label: 'Confident', icon: '😎' },
    { key: 'happy', label: 'Smile', icon: '😊' },
    { key: 'thinking', label: 'Thinking', icon: '🤔' },
    { key: 'winking', label: 'Wink', icon: '😉' },
  ];

  return (
    <div className={`relative flex flex-col items-center select-none bg-transparent ${className}`}>
      {/* 
        3D Interactive Realistic Avatar Container:
        Zero background box, glowing crimson border ring, fully responsive 
      */}
      <div
        onClick={handleAvatarClick}
        title="Interactive 3D Avatar · Move pointer to track · Click to nod"
        className={`relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full border-2 ${
          isLight
            ? 'border-rose-400 ring-4 ring-rose-400/20 shadow-[0_0_28px_rgba(244,63,94,0.25)]'
            : 'border-rose-500/60 ring-4 ring-rose-500/20 shadow-[0_0_35px_rgba(225,29,72,0.38)]'
        } flex items-center justify-center overflow-hidden bg-transparent cursor-pointer group select-none transition-transform duration-300 hover:scale-[1.02]`}
      >
        <div ref={mountRef} className="w-full h-full bg-transparent flex items-center justify-center pointer-events-auto" />

        {/* Subtle Online Availability Pulse Indicator */}
        <span className="absolute bottom-3 right-8 flex h-3.5 w-3.5 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-[#09090b] shadow-sm"></span>
        </span>
      </div>

      {/* Interactive Expression Selector Chips */}
      {showChips && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2.5">
          {expressions.map((e) => (
            <button
              key={e.key}
              onClick={() => switchExpression(e.key)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer border ${
                currentExpression === e.key
                  ? 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-500/30 scale-105'
                  : isLight
                    ? 'bg-stone-100 text-stone-700 border-stone-200 hover:border-rose-400'
                    : 'bg-stone-900/60 text-stone-300 border-white/10 hover:border-rose-400'
              }`}
            >
              <span>{e.icon}</span>
              <span>{e.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
