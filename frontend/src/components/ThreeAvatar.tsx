import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type AvatarMood = 'normal' | 'smile' | 'happy' | 'sad' | 'blink';

const MOOD_EMOJIS: { mood: AvatarMood; emoji: string; label: string }[] = [
  { mood: 'normal', emoji: '😐', label: 'Normal' },
  { mood: 'smile', emoji: '🙂', label: 'Smile' },
  { mood: 'happy', emoji: '😄', label: 'Happy' },
  { mood: 'sad', emoji: '😢', label: 'Sad' },
  { mood: 'blink', emoji: '😉', label: 'Wink' },
];

const MOOD_COLORS: Record<AvatarMood, number> = {
  normal: 0xe11d48,
  smile: 0x22c55e,
  happy: 0xfbbf24,
  sad: 0x38bdf8,
  blink: 0xa855f7,
};

export const ThreeAvatar: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentMood, setCurrentMood] = useState<AvatarMood>('normal');
  const [showEmojis, setShowEmojis] = useState(false);
  const moodRef = useRef<AvatarMood>('normal');
  const sceneRef = useRef<{
    eyeL?: THREE.Mesh;
    eyeR?: THREE.Mesh;
    mouth?: THREE.Mesh;
    headMat?: THREE.MeshStandardMaterial;
    glowMat?: THREE.MeshStandardMaterial;
    outerRing?: THREE.Mesh;
    group?: THREE.Group;
  }>({});

  useEffect(() => {
    moodRef.current = currentMood;
  }, [currentMood]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0, 8);

    let renderer: THREE.WebGLRenderer;
    let animId: number;
    let mouse = { x: 0, y: 0 };
    let targetRot = { x: 0, y: 0 };

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const keyLight = new THREE.DirectionalLight(0xffffff, 2);
      keyLight.position.set(5, 8, 6);
      scene.add(keyLight);
      const rimLight = new THREE.DirectionalLight(0xe11d48, 1.5);
      rimLight.position.set(-5, -3, -4);
      scene.add(rimLight);
      const topLight = new THREE.PointLight(0x38bdf8, 1, 20);
      topLight.position.set(0, 6, 4);
      scene.add(topLight);

      // Avatar Group
      const group = new THREE.Group();
      sceneRef.current.group = group;

      // Outer glow ring
      const ringGeom = new THREE.TorusGeometry(2.1, 0.07, 16, 80);
      const glowMat = new THREE.MeshStandardMaterial({
        color: MOOD_COLORS.normal,
        emissive: MOOD_COLORS.normal,
        emissiveIntensity: 1.2,
        metalness: 0.9,
        roughness: 0.1,
      });
      const outerRing = new THREE.Mesh(ringGeom, glowMat);
      sceneRef.current.glowMat = glowMat;
      sceneRef.current.outerRing = outerRing;
      group.add(outerRing);

      // Second decorative ring
      const ring2Geom = new THREE.TorusGeometry(2.3, 0.03, 8, 60);
      const ring2Mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
        emissive: 0xffffff,
        emissiveIntensity: 0.3,
      });
      group.add(new THREE.Mesh(ring2Geom, ring2Mat));

      // Face base (sphere)
      const headGeom = new THREE.SphereGeometry(1.8, 64, 64);
      const headMat = new THREE.MeshStandardMaterial({
        color: 0xdeb887, // skin tone
        roughness: 0.7,
        metalness: 0.0,
        envMapIntensity: 0.5,
      });
      sceneRef.current.headMat = headMat;
      const head = new THREE.Mesh(headGeom, headMat);
      group.add(head);

      // Hair - dark cap on top
      const hairGeom = new THREE.SphereGeometry(1.82, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.45);
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a0a00, roughness: 0.9 });
      const hair = new THREE.Mesh(hairGeom, hairMat);
      hair.position.y = 0.2;
      hair.rotation.z = 0;
      group.add(hair);

      // Forehead hair detail
      const foreHairGeom = new THREE.CylinderGeometry(0.3, 0.5, 0.3, 12);
      const foreHair = new THREE.Mesh(foreHairGeom, hairMat);
      foreHair.position.set(0, 1.5, 1.2);
      foreHair.rotation.x = 0.4;
      group.add(foreHair);

      // Eyes - white sclera
      const eyeWhiteGeom = new THREE.SphereGeometry(0.28, 16, 16);
      const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const eyeL = new THREE.Mesh(eyeWhiteGeom, eyeWhiteMat);
      const eyeR = new THREE.Mesh(eyeWhiteGeom, eyeWhiteMat);
      eyeL.position.set(-0.58, 0.3, 1.6);
      eyeR.position.set(0.58, 0.3, 1.6);
      group.add(eyeL);
      group.add(eyeR);
      sceneRef.current.eyeL = eyeL;
      sceneRef.current.eyeR = eyeR;

      // Pupils
      const pupilGeom = new THREE.SphereGeometry(0.13, 12, 12);
      const pupilMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.5 });
      const pupilL = new THREE.Mesh(pupilGeom, pupilMat);
      const pupilR = new THREE.Mesh(pupilGeom, pupilMat);
      pupilL.position.set(0, 0, 0.18);
      pupilR.position.set(0, 0, 0.18);
      eyeL.add(pupilL);
      eyeR.add(pupilR);

      // Iris shine
      const shineGeom = new THREE.SphereGeometry(0.05, 6, 6);
      const shineMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 });
      const shineL = new THREE.Mesh(shineGeom, shineMat);
      shineL.position.set(0.06, 0.06, 0.22);
      const shineR = shineL.clone();
      eyeL.add(shineL);
      eyeR.add(shineR);

      // Eyebrows
      const browGeom = new THREE.BoxGeometry(0.4, 0.07, 0.07);
      const browMat = new THREE.MeshStandardMaterial({ color: 0x1a0a00, roughness: 0.9 });
      const browL = new THREE.Mesh(browGeom, browMat);
      const browR = new THREE.Mesh(browGeom, browMat);
      browL.position.set(-0.58, 0.72, 1.65);
      browR.position.set(0.58, 0.72, 1.65);
      group.add(browL);
      group.add(browR);

      // Nose
      const noseGeom = new THREE.ConeGeometry(0.12, 0.35, 8);
      const noseMat = new THREE.MeshStandardMaterial({ color: 0xc49a6c, roughness: 0.8 });
      const nose = new THREE.Mesh(noseGeom, noseMat);
      nose.position.set(0, -0.1, 1.75);
      nose.rotation.x = Math.PI / 2 + 0.3;
      group.add(nose);

      // Mouth/Smile
      const mouthGeom = new THREE.TorusGeometry(0.32, 0.07, 8, 20, Math.PI);
      const mouthMat = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.5 });
      const mouth = new THREE.Mesh(mouthGeom, mouthMat);
      mouth.position.set(0, -0.55, 1.65);
      mouth.rotation.z = Math.PI;
      sceneRef.current.mouth = mouth;
      group.add(mouth);

      // Cheeks
      const cheekGeom = new THREE.SphereGeometry(0.25, 12, 12);
      const cheekMat = new THREE.MeshStandardMaterial({ color: 0xe07070, transparent: true, opacity: 0.4, roughness: 0.9 });
      const cheekL = new THREE.Mesh(cheekGeom, cheekMat);
      const cheekR = new THREE.Mesh(cheekGeom, cheekMat);
      cheekL.position.set(-0.9, -0.1, 1.5);
      cheekR.position.set(0.9, -0.1, 1.5);
      group.add(cheekL);
      group.add(cheekR);

      // Ears
      const earGeom = new THREE.SphereGeometry(0.3, 16, 16);
      const earMat = new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.7 });
      const earL = new THREE.Mesh(earGeom, earMat);
      const earR = new THREE.Mesh(earGeom, earMat);
      earL.scale.set(0.6, 0.85, 0.5);
      earR.scale.set(0.6, 0.85, 0.5);
      earL.position.set(-1.85, 0, 0);
      earR.position.set(1.85, 0, 0);
      group.add(earL);
      group.add(earR);

      // Shirt collar
      const collarGeom = new THREE.CylinderGeometry(1.2, 1.5, 1.2, 32, 1, true);
      const collarMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        roughness: 0.6,
        metalness: 0.1,
        side: THREE.BackSide,
      });
      const collar = new THREE.Mesh(collarGeom, collarMat);
      collar.position.y = -2;
      group.add(collar);

      // Tie (red)
      const tieGeom = new THREE.BoxGeometry(0.2, 0.8, 0.05);
      const tieMat = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.4, metalness: 0.2 });
      const tie = new THREE.Mesh(tieGeom, tieMat);
      tie.position.set(0, -2.1, 1.1);
      group.add(tie);

      scene.add(group);

      // Mouse follow
      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      container.addEventListener('mousemove', handleMouseMove);

      // Blink animation state
      let blinkTimer = 0;
      let isBlinking = false;
      let blinkProgress = 0;

      const clock = new THREE.Clock();

      const animate = () => {
        const dt = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        // Smooth head follow mouse
        targetRot.y += (mouse.x * 0.4 - targetRot.y) * 0.06;
        targetRot.x += (mouse.y * 0.2 - targetRot.x) * 0.06;
        group.rotation.y = targetRot.y;
        group.rotation.x = targetRot.x;

        // Gentle idle float
        group.position.y = Math.sin(elapsed * 1.2) * 0.06;

        // Ring rotation
        outerRing.rotation.z = elapsed * 0.6;

        // Mood-based animations
        const mood = moodRef.current;

        // Blink logic
        blinkTimer += dt;
        if (!isBlinking && blinkTimer > (mood === 'blink' ? 1.5 : 3 + Math.random() * 2)) {
          isBlinking = true;
          blinkTimer = 0;
        }

        if (isBlinking) {
          blinkProgress += dt * 8;
          const scaleY = blinkProgress < 1 ? 1 - blinkProgress : blinkProgress - 1;
          sceneRef.current.eyeL!.scale.y = Math.max(0.05, scaleY);
          sceneRef.current.eyeR!.scale.y = Math.max(0.05, scaleY);
          if (blinkProgress >= 2) {
            isBlinking = false;
            blinkProgress = 0;
            sceneRef.current.eyeL!.scale.y = 1;
            sceneRef.current.eyeR!.scale.y = 1;
          }
        }

        // Mouth shape by mood
        if (sceneRef.current.mouth) {
          const m = sceneRef.current.mouth;
          if (mood === 'happy') {
            m.rotation.z = Math.PI;
            m.scale.set(1.3, 1.3, 1);
          } else if (mood === 'smile') {
            m.rotation.z = Math.PI;
            m.scale.set(1, 1, 1);
          } else if (mood === 'sad') {
            m.rotation.z = 0;
            m.scale.set(0.9, 0.9, 1);
          } else {
            m.rotation.z = Math.PI + 0.3;
            m.scale.set(0.7, 0.7, 1);
          }
        }

        // Color by mood
        if (sceneRef.current.glowMat) {
          const targetColor = MOOD_COLORS[mood];
          sceneRef.current.glowMat.color.set(targetColor);
          sceneRef.current.glowMat.emissive.set(targetColor);
        }

        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };
      animate();

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animId);
        if (container && renderer.domElement) container.removeChild(renderer.domElement);
        renderer.dispose();
      };
    } catch (e) {
      console.warn('Avatar WebGL error', e);
    }
  }, []);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* 3D Avatar Canvas */}
      <div
        ref={mountRef}
        className="w-72 h-72 cursor-pointer"
        style={{ borderRadius: '50%' }}
        onMouseEnter={() => setShowEmojis(true)}
        onMouseLeave={() => setShowEmojis(false)}
        title="Hover to change my mood!"
      />

      {/* Emoji Mood Selector - shows on hover */}
      <div
        className={`absolute top-0 right-0 flex flex-col gap-2 transition-all duration-300 ${
          showEmojis ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
        style={{ zIndex: 10 }}
      >
        {MOOD_EMOJIS.map(({ mood, emoji, label }) => (
          <button
            key={mood}
            onClick={() => setCurrentMood(mood)}
            title={label}
            className={`w-10 h-10 rounded-full text-lg flex items-center justify-center transition-all duration-200 border ${
              currentMood === mood
                ? 'border-rose-500 bg-rose-500/20 scale-110'
                : 'border-white/10 bg-black/40 hover:scale-110 hover:border-white/30'
            }`}
            style={{ backdropFilter: 'blur(8px)' }}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Mood label */}
      <div className="mt-2 text-xs font-mono text-center" style={{ color: '#64748b' }}>
        {showEmojis ? 'Click emoji to change mood' : `Mood: ${currentMood}`}
      </div>
    </div>
  );
};
