import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ProfessionalPhotoAvatar } from './ProfessionalPhotoAvatar';

interface Sagar3DModelCanvasProps {
  className?: string;
  sizeClassName?: string;
  modelUrl?: string;
}

export const Sagar3DModelCanvas: React.FC<Sagar3DModelCanvasProps> = ({
  className = '',
  sizeClassName = 'w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80',
  modelUrl = '/models/sagar-avatar.glb',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check if model file actually exists before attempting Three.js GLTF load
    fetch(modelUrl, { method: 'HEAD' })
      .then(res => {
        if (!res.ok) {
          setLoadError(true);
          return;
        }
        initThreeScene();
      })
      .catch(() => {
        setLoadError(true);
      });

    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number;

    const initThreeScene = () => {
      const width = container.clientWidth || 320;
      const height = container.clientHeight || 320;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
      camera.position.set(0, 0, 3.8);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);

      // Studio 3-Point Portrait Lighting
      scene.add(new THREE.AmbientLight(0xfff7ed, 1.1));
      const keyLight = new THREE.DirectionalLight(0xfff1e6, 2.2);
      keyLight.position.set(3, 4, 3);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xbae6fd, 1.2);
      fillLight.position.set(-3, 1, 2);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xe11d48, 2.4);
      rimLight.position.set(-2, 3, -3);
      scene.add(rimLight);

      const avatarGroup = new THREE.Group();
      scene.add(avatarGroup);

      // GLTF Loader
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;
          model.position.set(0, -1.2, 0);
          model.scale.set(1.5, 1.5, 1.5);
          avatarGroup.add(model);
          setModelLoaded(true);
        },
        undefined,
        (err) => {
          console.warn('GLB load note: Falling back to living 3D photo avatar', err);
          setLoadError(true);
        }
      );

      let mouseX = 0, mouseY = 0;
      let targetRotY = 0, targetRotX = 0;

      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      window.addEventListener('mousemove', onMouseMove);

      let clock = 0;
      const animate = () => {
        clock += 0.02;
        targetRotY += (mouseX * 0.35 - targetRotY) * 0.08;
        targetRotX += (mouseY * 0.2 - targetRotX) * 0.08;

        avatarGroup.rotation.y = targetRotY;
        avatarGroup.rotation.x = targetRotX;
        avatarGroup.position.y = Math.sin(clock * 1.5) * 0.03; // Gentle breathing

        if (renderer) renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };
      animate();
    };

    return () => {
      cancelAnimationFrame(animId);
      if (container && renderer && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      if (renderer) renderer.dispose();
    };
  }, [modelUrl]);

  // If model is not found or fails to load, render the high-fidelity living 3D photo profile
  if (loadError || !modelLoaded) {
    return <ProfessionalPhotoAvatar className={className} sizeClassName={sizeClassName} />;
  }

  return (
    <div className={`relative flex flex-col items-center select-none bg-transparent ${className}`}>
      <div
        className={`relative ${sizeClassName} rounded-full border-2 border-rose-500/80 ring-4 ring-rose-500/20 shadow-[0_0_35px_rgba(225,29,72,0.36)] flex items-center justify-center overflow-hidden bg-transparent cursor-pointer`}
      >
        <div ref={mountRef} className="w-full h-full" />
      </div>
    </div>
  );
};

