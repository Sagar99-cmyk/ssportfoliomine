import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export const Welcome3DRedWave: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // 2. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Keep smooth perspective for background
    controls.autoRotate = false;

    // 3. Lighting
    const light = new THREE.PointLight(0xffffff, 1.2);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // 4. Central Rotating Group
    const rotatingGroup = new THREE.Group();
    scene.add(rotatingGroup);

    // 1000 Cyan Background Stars
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const starsPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starsPositions[i] = (Math.random() - 0.5) * 200;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.1,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Inner Metallic Flat-Shaded Icosahedron
    const innerGeometry = new THREE.IcosahedronGeometry(1, 3);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.5,
      metalness: 1,
      flatShading: true,
      transparent: true,
      opacity: 0.7,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    rotatingGroup.add(innerMesh);

    // Outer Wireframe Icosahedron
    const outerGeometry = new THREE.IcosahedronGeometry(1.15, 3);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const wireframeMesh = new THREE.Mesh(outerGeometry, wireframeMaterial);
    rotatingGroup.add(wireframeMesh);

    // Cyan Particles on Outer Vertices
    const positions: number[] = [];
    const posAttr = outerGeometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      positions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.025,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    rotatingGroup.add(particles);

    // 5. Postprocessing: EffectComposer & UnrealBloomPass
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.5,
      0.4,
      0.05
    );
    composer.addPass(bloomPass);

    // 6. ShockWave Ripple ShaderPass II
    const maxRipples = 10;
    const RippleShader = {
      uniforms: {
        tDiffuse: { value: null },
        centers: { value: Array(maxRipples).fill(null).map(() => new THREE.Vector2(0.5, 0.5)) },
        times: { value: Array(maxRipples).fill(0.0) },
        rippleActive: { value: Array(maxRipples).fill(0.0) },
        maxRadius: { value: 1.0 },
        amplitude: { value: 0.03 },
        secondaryAmplitude: { value: 0.01 },
        speed: { value: 0.3 },
        frequency: { value: 10.0 },
        aspect: { value: width / height },
        smoothing: { value: 0.95 },
        sigma: { value: 0.6 },
        fadeDuration: { value: 6.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        #define PI 3.14159265359
        #define MAX_RIPPLES 10
        uniform sampler2D tDiffuse;
        uniform vec2 centers[MAX_RIPPLES];
        uniform float times[MAX_RIPPLES];
        uniform float rippleActive[MAX_RIPPLES];
        uniform float maxRadius;
        uniform float amplitude;
        uniform float secondaryAmplitude;
        uniform float speed;
        uniform float frequency;
        uniform float aspect;
        uniform float smoothing;
        uniform float sigma;
        uniform float fadeDuration;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          vec2 totalWave = vec2(0.0);
          for (int i = 0; i < MAX_RIPPLES; i++) {
            if (rippleActive[i] > 0.0) {
              vec2 aspectUV = vec2((uv.x - centers[i].x) * aspect, uv.y - centers[i].y);
              float dist = length(aspectUV);
              float t = times[i] * speed;
              if (dist < t) {
                float normDist = dist / maxRadius;
                float decay = 1.0 / (1.0 + sigma * normDist * normDist);
                float timeFade = pow(smoothstep(fadeDuration, fadeDuration - 2.0, times[i]), 2.0);
                float smoothFactor = smoothstep(1.0 - smoothing, 1.0, normDist);
                float primaryWave = amplitude * sin(frequency * (t - dist)) * decay * (1.0 - smoothFactor) * timeFade;
                float secondaryWave = secondaryAmplitude * sin(0.5 * frequency * (t - dist) + PI) * decay * (1.0 - smoothFactor) * timeFade;
                totalWave += normalize(aspectUV) * (primaryWave + secondaryWave);
              }
            }
          }
          uv += totalWave;
          gl_FragColor = texture2D(tDiffuse, clamp(uv, 0.0, 1.0));
        }
      `,
    };

    const ripplePass = new ShaderPass(RippleShader);
    ripplePass.renderToScreen = true;
    composer.addPass(ripplePass);

    interface RippleEvent {
      center: THREE.Vector2;
      startTime: number;
    }

    let ripples: RippleEvent[] = [];
    const rippleDuration = 25;

    const updateRippleUniforms = () => {
      const centers = ripplePass.uniforms.centers.value as THREE.Vector2[];
      const times = ripplePass.uniforms.times.value as number[];
      const active = ripplePass.uniforms.rippleActive.value as number[];
      const now = performance.now() / 1000;

      for (let i = 0; i < maxRipples; i++) {
        if (i < ripples.length) {
          centers[i].copy(ripples[i].center);
          times[i] = now - ripples[i].startTime;
          active[i] = times[i] < rippleDuration ? 1.0 : 0.0;
        } else {
          active[i] = 0.0;
        }
      }
    };

    const addRipple = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1.0 - (clientY - rect.top) / rect.height; // UV Y inversion
      const center = new THREE.Vector2(Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y)));
      const startTime = performance.now() / 1000;

      ripples.push({ center, startTime });
      if (ripples.length > maxRipples) {
        ripples.shift();
      }
      updateRippleUniforms();
    };

    // Trigger initial welcoming ripple
    const initTimer = window.setTimeout(() => {
      addRipple(width / 2, height / 2);
    }, 400);

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let clientX = width / 2;
      let clientY = height / 2;
      if ('touches' in e && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      addRipple(clientX, clientY);
    };

    renderer.domElement.addEventListener('click', handlePointerDown);
    renderer.domElement.addEventListener('dblclick', handlePointerDown);
    renderer.domElement.addEventListener('touchstart', handlePointerDown, { passive: true });

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      composer.setSize(width, height);
      bloomPass.setSize(width, height);
      ripplePass.uniforms.aspect.value = width / height;
    };

    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();

      rotatingGroup.rotation.x += 0.002;
      rotatingGroup.rotation.y += 0.003;

      if (ripples.length > 0) {
        updateRippleUniforms();
        const now = performance.now() / 1000;
        ripples = ripples.filter((r) => now - r.startTime < rippleDuration);
      }

      composer.render();
    };

    animate();

    return () => {
      window.clearTimeout(initTimer);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement) {
        renderer.domElement.removeEventListener('click', handlePointerDown);
        renderer.domElement.removeEventListener('dblclick', handlePointerDown);
        renderer.domElement.removeEventListener('touchstart', handlePointerDown);
      }

      controls.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      outerGeometry.dispose();
      wireframeMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      bloomPass.dispose();
      composer.dispose();
      renderer.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      {/* Discreet interactive badge at bottom left */}
      <div className="absolute bottom-4 left-6 z-20 pointer-events-none hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-wider uppercase text-cyan-400/70 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>ShockWave ShaderPass II · Tap or Double-Click for Ripples · Drag to Orbit</span>
      </div>
    </div>
  );
};
