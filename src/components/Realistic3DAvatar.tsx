import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Realistic3DAvatarProps {
  className?: string;
  onExpressionChange?: (expr: string) => void;
}

export type AvatarExpression = 'happy' | 'confident' | 'thinking' | 'surprised' | 'winking' | 'sad';

export const Realistic3DAvatar: React.FC<Realistic3DAvatarProps> = ({ className = '', onExpressionChange }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentExpression, setCurrentExpression] = useState<AvatarExpression>('confident');
  const [isNoddingUI, setIsNoddingUI] = useState(false);

  // References to communicate with Three.js animation loop
  const setExpressionRef = useRef<((expr: AvatarExpression) => void) | null>(null);
  const triggerNodRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 300;
    let height = container.clientHeight || 300;

    const scene = new THREE.Scene();

    // 1. MATCH CAMERA ANGLE: 85mm portrait telephoto studio lens (low-angle perspective tilted slightly upward)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, -0.15, 4.9);
    camera.lookAt(0, 0.25, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // =========================================================================
    // STUDIO 3-POINT LIGHTING RIG (Warm Portrait Key + Sky Fill + Rim Kicker)
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0xfff7f0, 1.05);
    scene.add(ambientLight);

    // Key Light (Warm softbox from top right, casting realistic soft shadows under jawline)
    const keyLight = new THREE.DirectionalLight(0xfff3ea, 2.5);
    keyLight.position.set(2.6, 3.8, 3.2);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill Light (Soft cool bounce from left to illuminate cheek contours)
    const fillLight = new THREE.DirectionalLight(0xe2f0fe, 1.45);
    fillLight.position.set(-3.2, 1.0, 2.8);
    scene.add(fillLight);

    // Crimson Rim / Edge Kicker (Brand accent silhouette edge pop)
    const rimLight = new THREE.DirectionalLight(0xe11d48, 2.9);
    rimLight.position.set(-1.9, 3.2, -3.0);
    scene.add(rimLight);

    // Subtle Cyan Accent Rim
    const rimLightCyan = new THREE.DirectionalLight(0x38bdf8, 1.6);
    rimLightCyan.position.set(2.4, -1.0, -2.5);
    scene.add(rimLightCyan);

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
    headGroup.rotation.x = -0.12;
    neckGroup.add(headGroup);

    // Procedural Micro-Texture Generation for Skin Pores & Fabric Weave
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

    const skinJawMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xbd8462,
      roughness: 0.58,
      metalness: 0.0,
      clearcoat: 0.08,
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

    // Sculpted Jawline & Tilted Chin
    const chinGeo = new THREE.CylinderGeometry(0.36, 0.28, 0.52, 20);
    chinGeo.scale(1.1, 1.0, 0.88);
    const chinMesh = new THREE.Mesh(chinGeo, skinJawMaterial);
    chinMesh.position.set(0, -0.66, 0.20);
    chinMesh.rotation.x = 0.24;
    headGroup.add(chinMesh);

    // Cheekbones
    const cheekGeo = new THREE.SphereGeometry(0.25, 20, 20);
    const leftCheek = new THREE.Mesh(cheekGeo, skinMaterial);
    leftCheek.position.set(-0.52, -0.06, 0.44);
    const rightCheek = new THREE.Mesh(cheekGeo, skinMaterial);
    rightCheek.position.set(0.52, -0.06, 0.44);
    headGroup.add(leftCheek);
    headGroup.add(rightCheek);

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

    // --- EYES, ASYNCHRONOUS BLINKING & ARKIT-STYLE BLENDSHAPES ---
    const eyeSocketLeft = new THREE.Group();
    eyeSocketLeft.position.set(-0.28, 0.13, 0.67);
    headGroup.add(eyeSocketLeft);

    const eyeSocketRight = new THREE.Group();
    eyeSocketRight.position.set(0.28, 0.13, 0.67);
    headGroup.add(eyeSocketRight);

    function createEyeball() {
      const eyeGroup = new THREE.Group();
      const scleraGeo = new THREE.SphereGeometry(0.125, 24, 24);
      const scleraMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.15 });
      const sclera = new THREE.Mesh(scleraGeo, scleraMat);
      eyeGroup.add(sclera);

      // Deep warm brown iris
      const irisGeo = new THREE.CircleGeometry(0.068, 24);
      const irisMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.22 });
      const iris = new THREE.Mesh(irisGeo, irisMat);
      iris.position.set(0, 0, 0.122);
      eyeGroup.add(iris);

      // Pupil
      const pupilGeo = new THREE.CircleGeometry(0.034, 16);
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
      const pupil = new THREE.Mesh(pupilGeo, pupilMat);
      pupil.position.set(0, 0, 0.123);
      eyeGroup.add(pupil);

      // Specular catchlight reflection
      const glintGeo = new THREE.CircleGeometry(0.016, 12);
      const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const glint = new THREE.Mesh(glintGeo, glintMat);
      glint.position.set(0.02, 0.028, 0.124);
      eyeGroup.add(glint);

      return eyeGroup;
    }

    const leftEyeBall = createEyeball();
    eyeSocketLeft.add(leftEyeBall);

    const rightEyeBall = createEyeball();
    eyeSocketRight.add(rightEyeBall);

    // Upper Eyelids for natural organic blinking & winking
    const eyelidGeo = new THREE.SphereGeometry(0.135, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const upperLidLeft = new THREE.Mesh(eyelidGeo, skinMaterial);
    upperLidLeft.rotation.x = -Math.PI * 0.35;
    eyeSocketLeft.add(upperLidLeft);

    const upperLidRight = new THREE.Mesh(eyelidGeo, skinMaterial);
    upperLidRight.rotation.x = -Math.PI * 0.35;
    eyeSocketRight.add(upperLidRight);

    // Eyebrows
    const browGeo = new THREE.BoxGeometry(0.26, 0.048, 0.06);
    const leftBrow = new THREE.Mesh(browGeo, hairMaterial);
    leftBrow.position.set(-0.28, 0.32, 0.69);
    leftBrow.rotation.z = 0.06;
    headGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, hairMaterial);
    rightBrow.position.set(0.28, 0.32, 0.69);
    rightBrow.rotation.z = -0.06;
    headGroup.add(rightBrow);

    // Nose
    const noseBridgeGeo = new THREE.CylinderGeometry(0.05, 0.085, 0.33, 16);
    const noseBridge = new THREE.Mesh(noseBridgeGeo, skinMaterial);
    noseBridge.position.set(0, 0.03, 0.78);
    noseBridge.rotation.x = -0.16;
    headGroup.add(noseBridge);

    const noseTipGeo = new THREE.SphereGeometry(0.082, 18, 18);
    const noseTip = new THREE.Mesh(noseTipGeo, skinMaterial);
    noseTip.position.set(0, -0.13, 0.82);
    headGroup.add(noseTip);

    // --- DYNAMIC MOUTH & FACIAL EXPRESSION APPARATUS ---
    const lipMat = new THREE.MeshStandardMaterial({ color: 0xa86052, roughness: 0.38 });
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(0, -0.37, 0.72);
    headGroup.add(mouthGroup);

    const upperLipGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.30, 16);
    upperLipGeo.scale(1.0, 1.0, 0.65);
    upperLipGeo.rotateZ(Math.PI * 0.5);
    const upperLip = new THREE.Mesh(upperLipGeo, lipMat);
    upperLip.position.y = 0.02;
    mouthGroup.add(upperLip);

    const lowerLipGeo = new THREE.SphereGeometry(0.085, 18, 14);
    lowerLipGeo.scale(1.65, 0.48, 0.65);
    const lowerLip = new THREE.Mesh(lowerLipGeo, lipMat);
    lowerLip.position.set(0, -0.04, 0.01);
    mouthGroup.add(lowerLip);

    // Oral cavity
    const mouthInnerGeo = new THREE.CircleGeometry(0.07, 16);
    const mouthInnerMat = new THREE.MeshBasicMaterial({ color: 0x180808 });
    const mouthCavity = new THREE.Mesh(mouthInnerGeo, mouthInnerMat);
    mouthCavity.position.set(0, -0.02, 0.005);
    mouthCavity.scale.set(0.001, 0.001, 1);
    mouthGroup.add(mouthCavity);

    // Lip Corners
    const cornerGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const leftLipCorner = new THREE.Mesh(cornerGeo, lipMat);
    leftLipCorner.position.set(-0.16, 0, 0.01);
    mouthGroup.add(leftLipCorner);

    const rightLipCorner = new THREE.Mesh(cornerGeo, lipMat);
    rightLipCorner.position.set(0.16, 0, 0.01);
    mouthGroup.add(rightLipCorner);

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
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xe11d48, transparent: true, opacity: 0.28, side: THREE.DoubleSide });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = -Math.PI * 0.5;
    halo.position.y = -1.48;
    avatarRoot.add(halo);

    // =========================================================================
    // EXPRESSION TARGETS & INTERPOLATION
    // =========================================================================
    let targetSmile = 0.45;
    let targetSad = 0.0;
    let targetSurprise = 0.0;
    let targetThinking = 0.0;
    let targetWink = 0.0;

    let targetLeftBrowTilt = 0.02;
    let targetRightBrowTilt = -0.02;
    let targetLeftBrowY = 0.325;
    let targetRightBrowY = 0.325;
    let targetHeadPitchOffset = 0.09;
    let targetHeadYawOffset = 0.0;
    let targetHeadRollOffset = 0.0;

    let curSmile = 0.45;
    let curSad = 0.0;
    let curSurprise = 0.0;
    let curThinking = 0.0;
    let curWink = 0.0;

    let curLeftBrowTilt = 0.02;
    let curRightBrowTilt = -0.02;
    let curLeftBrowY = 0.325;
    let curRightBrowY = 0.325;
    let curHeadPitchOffset = 0.09;
    let curHeadYawOffset = 0.0;
    let curHeadRollOffset = 0.0;

    let activeExpr: AvatarExpression = 'confident';

    function setExpression(expr: AvatarExpression) {
      activeExpr = expr;
      targetSmile = 0.0;
      targetSad = 0.0;
      targetSurprise = 0.0;
      targetThinking = 0.0;
      targetWink = 0.0;
      targetHeadYawOffset = 0.0;
      targetHeadRollOffset = 0.0;

      if (expr === 'happy') {
        targetSmile = 1.0;
        targetLeftBrowTilt = 0.08;
        targetRightBrowTilt = -0.08;
        targetLeftBrowY = 0.33;
        targetRightBrowY = 0.33;
        targetHeadPitchOffset = 0.03;
        haloMat.color.setHex(0xe11d48);
      } else if (expr === 'sad') {
        targetSad = 1.0;
        targetLeftBrowTilt = -0.18;
        targetRightBrowTilt = 0.18;
        targetLeftBrowY = 0.30;
        targetRightBrowY = 0.30;
        targetHeadPitchOffset = -0.16;
        haloMat.color.setHex(0x64748b);
      } else if (expr === 'confident') {
        targetSmile = 0.45;
        targetLeftBrowTilt = 0.02;
        targetRightBrowTilt = -0.02;
        targetLeftBrowY = 0.325;
        targetRightBrowY = 0.325;
        targetHeadPitchOffset = 0.09;
        haloMat.color.setHex(0x38bdf8);
      } else if (expr === 'surprised') {
        targetSurprise = 1.0;
        targetLeftBrowTilt = 0.16;
        targetRightBrowTilt = -0.16;
        targetLeftBrowY = 0.39;
        targetRightBrowY = 0.39;
        targetHeadPitchOffset = -0.06;
        haloMat.color.setHex(0xf59e0b);
      } else if (expr === 'thinking') {
        targetThinking = 1.0;
        targetSmile = 0.18;
        targetLeftBrowTilt = 0.22;
        targetRightBrowTilt = 0.04;
        targetLeftBrowY = 0.37;
        targetRightBrowY = 0.30;
        targetHeadPitchOffset = 0.05;
        targetHeadYawOffset = 0.14;
        targetHeadRollOffset = 0.12;
        haloMat.color.setHex(0x8b5cf6);
      } else if (expr === 'winking') {
        targetWink = 1.0;
        targetSmile = 0.85;
        targetLeftBrowTilt = 0.12;
        targetRightBrowTilt = -0.05;
        targetLeftBrowY = 0.35;
        targetRightBrowY = 0.31;
        targetHeadPitchOffset = 0.04;
        targetHeadRollOffset = -0.07;
        haloMat.color.setHex(0x10b981);
      }
    }

    setExpressionRef.current = setExpression;

    // Kinematics & Pointer Engine
    let breathingSpeed = 1.35;
    let breathingDepth = 0.028;
    let cursorSensitivityX = 0.55;
    let cursorSensitivityY = 0.42;
    let eyeSensitivityX = 0.65;
    let eyeSensitivityY = 0.52;
    let dampingFactor = 0.092;

    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    function onPointerMove(e: PointerEvent | TouchEvent) {
      const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as PointerEvent).clientX;
      const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : (e as PointerEvent).clientY;
      targetMouseX = (clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(clientY / window.innerHeight) * 2 + 1;
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    // Interactive Head Nod
    let isNodding = false;
    let nodStartTime = 0;
    const nodDuration = 1.4;
    let clickHaloImpulse = 0;

    function triggerHeadNod() {
      isNodding = true;
      nodStartTime = clock;
      clickHaloImpulse = 1.0;
      keyLight.intensity = 3.2;
      setIsNoddingUI(true);
      setTimeout(() => {
        keyLight.intensity = 2.5;
        setIsNoddingUI(false);
      }, 350);
    }

    triggerNodRef.current = triggerHeadNod;

    // Real-Time Blinking & Saccades
    let nextBlinkTime = 2.0;
    let isBlinking = false;
    let blinkProgress = 0;
    let saccadeX = 0, saccadeY = 0;
    let nextSaccadeTime = 1.0;
    let clock = 0;
    let animId: number;

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 300;
      height = container.clientHeight || 300;
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
      curSad += (targetSad - curSad) * 0.09;
      curSurprise += (targetSurprise - curSurprise) * 0.09;
      curThinking += (targetThinking - curThinking) * 0.09;
      curWink += (targetWink - curWink) * 0.09;

      curLeftBrowTilt += (targetLeftBrowTilt - curLeftBrowTilt) * 0.09;
      curRightBrowTilt += (targetRightBrowTilt - curRightBrowTilt) * 0.09;
      curLeftBrowY += (targetLeftBrowY - curLeftBrowY) * 0.09;
      curRightBrowY += (targetRightBrowY - curRightBrowY) * 0.09;

      curHeadPitchOffset += (targetHeadPitchOffset - curHeadPitchOffset) * 0.09;
      curHeadYawOffset += (targetHeadYawOffset - curHeadYawOffset) * 0.09;
      curHeadRollOffset += (targetHeadRollOffset - curHeadRollOffset) * 0.09;

      // Pointer tracking
      mouseX += (targetMouseX - mouseX) * dampingFactor;
      mouseY += (targetMouseY - mouseY) * dampingFactor;

      // Breathing
      const breathFreq = activeExpr === 'sad' ? 0.95 : (activeExpr === 'surprised' ? 1.75 : breathingSpeed);
      const breathCycle = Math.sin(clock * breathFreq);
      const breathLift = breathCycle * (activeExpr === 'sad' ? 0.016 : breathingDepth);
      spineGroup.position.y = -1.35 + breathLift;
      torso.scale.x = 1.48 + breathCycle * (breathingDepth * 1.1);
      torso.scale.z = 0.96 + breathCycle * (breathingDepth * 1.4);

      // Nod reaction
      let nodAngleX = 0;
      let nodAngleNeckX = 0;
      let nodSmileBonus = 0;
      let nodBrowBonus = 0;

      if (isNodding) {
        const elapsed = clock - nodStartTime;
        if (elapsed < nodDuration) {
          const progress = elapsed / nodDuration;
          const nodWave = Math.sin(progress * Math.PI * 3.8) * Math.exp(-progress * 2.8);
          nodAngleX = nodWave * 0.38;
          nodAngleNeckX = nodWave * 0.16;
          nodSmileBonus = Math.sin(progress * Math.PI) * 0.045;
          nodBrowBonus = Math.sin(progress * Math.PI) * 0.038;
        } else {
          isNodding = false;
        }
      }

      // Armature rotations
      headGroup.rotation.x = -0.14 - mouseY * cursorSensitivityY + nodAngleX + Math.sin(clock * 0.8) * 0.012 + curHeadPitchOffset;
      headGroup.rotation.y = mouseX * cursorSensitivityX + curHeadYawOffset;
      headGroup.rotation.z = -mouseX * 0.12 + (activeExpr === 'sad' ? 0.04 : 0) + curHeadRollOffset;

      neckGroup.rotation.x = -0.04 - mouseY * (cursorSensitivityY * 0.35) + nodAngleNeckX + breathCycle * 0.01 + (curHeadPitchOffset * 0.4);
      neckGroup.rotation.y = mouseX * (cursorSensitivityX * 0.38) + (curHeadYawOffset * 0.5);

      // Micro-Saccades
      if (clock > nextSaccadeTime) {
        saccadeX = (Math.random() - 0.5) * 0.06;
        saccadeY = (Math.random() - 0.5) * 0.04;
        nextSaccadeTime = clock + 1.2 + Math.random() * 2.0;
      }

      const thinkingGazeX = curThinking * 0.22;
      const thinkingGazeY = curThinking * 0.28;

      const eyeYaw = mouseX * eyeSensitivityX + saccadeX + thinkingGazeX;
      const eyePitch = -mouseY * eyeSensitivityY + saccadeY + (isNodding ? -nodAngleX * 0.5 : 0) + (activeExpr === 'sad' ? -0.1 : 0) + thinkingGazeY;
      leftEyeBall.rotation.y = eyeYaw;
      leftEyeBall.rotation.x = eyePitch;
      rightEyeBall.rotation.y = eyeYaw;
      rightEyeBall.rotation.x = eyePitch;

      // Blinking
      if (!isBlinking && clock > nextBlinkTime && curWink < 0.3) {
        isBlinking = true;
        blinkProgress = 0;
      }

      let leftLidAngle = -Math.PI * 0.35;
      let rightLidAngle = -Math.PI * 0.35;

      if (isBlinking) {
        blinkProgress += delta * 15.0;
        if (blinkProgress < Math.PI) {
          const blinkAmount = Math.sin(blinkProgress) * 0.78;
          leftLidAngle += blinkAmount;
          rightLidAngle += blinkAmount;
        } else {
          isBlinking = false;
          nextBlinkTime = clock + 2.2 + Math.random() * 3.0;
        }
      }

      leftLidAngle -= curSurprise * 0.16;
      rightLidAngle -= curSurprise * 0.16;
      rightLidAngle += curWink * 0.78;

      upperLidLeft.rotation.x = leftLidAngle;
      upperLidRight.rotation.x = rightLidAngle;

      // Mouth Morphing
      const smileFactor = Math.max(0, 1.0 - Math.abs(mouseX) * 1.3) * curSmile + nodSmileBonus;
      mouthGroup.scale.x = 0.88 + curSmile * 0.28 - curSad * 0.15 - curSurprise * 0.35 + curWink * 0.15;
      mouthGroup.scale.y = 1.0 + curSurprise * 0.85 - curSad * 0.1;
      mouthGroup.position.z = 0.72 + smileFactor * 0.024 - curSad * 0.015 + curSurprise * 0.035;
      mouthGroup.position.y = -0.37 + curSmile * 0.015 - curSad * 0.028 - curSurprise * 0.03;

      mouthCavity.scale.set(curSurprise * 1.0 + 0.001, curSurprise * 1.4 + 0.001, 1);
      lowerLip.position.y = -0.04 - (curSurprise * 0.06);

      leftLipCorner.position.y = (curSmile * 0.035) - (curSad * 0.038) + (curWink * 0.04);
      rightLipCorner.position.y = (curSmile * 0.035) - (curSad * 0.038) + (curWink * 0.015);
      lowerLip.scale.y = 0.48 + curSad * 0.22 + curSurprise * 0.3;

      // Eyebrows
      leftBrow.position.y = curLeftBrowY + Math.sin(clock * 1.4) * 0.007 + nodBrowBonus;
      rightBrow.position.y = curRightBrowY + Math.sin(clock * 1.4) * 0.007 + nodBrowBonus;

      leftBrow.rotation.z = curLeftBrowTilt;
      rightBrow.rotation.z = curRightBrowTilt;

      // Halo
      if (clickHaloImpulse > 0.001) {
        clickHaloImpulse *= 0.94;
        halo.scale.set(1.0 + clickHaloImpulse * 0.22, 1.0 + clickHaloImpulse * 0.22, 1.0);
        haloMat.opacity = 0.28 + clickHaloImpulse * 0.45;
      } else {
        halo.scale.set(1.0, 1.0, 1.0);
        haloMat.opacity = 0.28;
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
    { key: 'confident', label: 'Confident', icon: '💼' },
    { key: 'happy', label: 'Smile', icon: '✨' },
    { key: 'thinking', label: 'Analytical', icon: '🧠' },
    { key: 'winking', label: 'Charismatic', icon: '😉' },
  ];

  return (
    <div className={`relative flex flex-col items-center select-none bg-transparent ${className}`}>
      {/* 
        3D Interactive Realistic Avatar Container:
        Zero background box, glowing crimson border ring, fully responsive 
      */}
      <div
        onClick={handleAvatarClick}
        title="Interactive 3D Avatar · Click to interact / nod"
        className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full border-2 border-rose-500/60 ring-4 ring-rose-500/20 shadow-[0_0_35px_rgba(225,29,72,0.38)] flex items-center justify-center overflow-hidden bg-transparent cursor-pointer group select-none transition-transform duration-300 hover:scale-[1.02]"
      >
        <div ref={mountRef} className="w-full h-full bg-transparent flex items-center justify-center pointer-events-auto" />

        {/* Subtle Online Availability Pulse Indicator */}
        <span className="absolute bottom-3 right-8 flex h-3.5 w-3.5 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-[#09090b] shadow-sm"></span>
        </span>
      </div>

      {/* Interactive Expression Selector Chips */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3">
        {expressions.map((e) => (
          <button
            key={e.key}
            onClick={() => switchExpression(e.key)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer border ${
              currentExpression === e.key
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-500/30 scale-105'
                : 'bg-white/80 dark:bg-stone-900/60 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-white/10 hover:border-rose-400'
            }`}
          >
            <span>{e.icon}</span>
            <span>{e.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
