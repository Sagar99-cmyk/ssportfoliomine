import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ExternalLink, X, ArrowRight, Layers, Sparkles, Compass } from 'lucide-react';
import { Project } from '../types';

export interface WorksShot {
  title: string;
  category?: string;
  description?: string;
  metrics?: string;
  url: string;
  image: string;
  technologies?: string[];
  projectRef?: Project;
}

export const SAGAR_WORKS_SHOTS: WorksShot[] = [
  {
    title: 'Sales Performance & Customer Analytics',
    category: 'Flagship Power BI Capstone',
    description: 'Executive-grade BI dashboard analyzing $2.4M across 50,000+ transactional records with DAX metrics and YoY trends.',
    metrics: '$2.4M Analyzed · 50K+ Records',
    url: 'https://github.com/Sagar99-cmyk',
    image: 'https://cdn.dribbble.com/userupload/48539267/file/a2b4e384fbb94b1f96dc7a19ae138092.png?format=webp&resize=1200x900',
    technologies: ['Power BI', 'DAX', 'MySQL', 'Excel', 'Python'],
  },
  {
    title: 'PG Rental Analytics & Housing Platform',
    category: 'Cloud RDBMS & Analytics',
    description: 'Cloud property market analysis tool evaluating rental yields, tenant demographics, and live pricing fluctuations.',
    metrics: '50K+ Live Data Points · Supabase RLS',
    url: 'https://github.com/Sagar99-cmyk',
    image: 'https://cdn.dribbble.com/userupload/17469058/file/original-3281c9a5cba68bd522aaa911e9848297.png?format=webp&resize=1200x900',
    technologies: ['React', 'Supabase', 'PostgreSQL', 'TailwindCSS'],
  },
  {
    title: 'Hospital Emergency Patient Flow Analytics',
    category: 'Healthcare Operational BI',
    description: 'Predictive patient intake modeling reducing emergency triage delays and optimizing ward bed capacity.',
    metrics: '32% Triage Delay Reduction',
    url: 'https://github.com/Sagar99-cmyk',
    image: 'https://cdn.dribbble.com/userupload/47373040/file/457ad343977ccf420ab30658f9b71531.png?format=webp&resize=1200x900',
    technologies: ['Power BI', 'Python', 'NumPy', 'EDA'],
  },
  {
    title: 'Global Supply Chain Freight Optimization',
    category: 'Logistics Predictive Intelligence',
    description: 'Container dwell-time forecasting and multi-echelon inventory replenishment platform across shipping hubs.',
    metrics: '$180K Annual Waste Eliminated',
    url: 'https://github.com/Sagar99-cmyk',
    image: 'https://cdn.dribbble.com/userupload/47603638/file/7c3cd868135a7ddc2c38e06d1194f78b.png?format=webp&resize=1200x900',
    technologies: ['Python', 'Pandas', 'MySQL', 'Seaborn'],
  },
  {
    title: 'E-Commerce Churn Prediction & Retention',
    category: 'Machine Learning Analytics',
    description: 'Customer cohort retention classifier identifying at-risk accounts with targeted promotional trigger workflows.',
    metrics: '94.2% ROC-AUC Accuracy',
    url: 'https://github.com/Sagar99-cmyk',
    image: 'https://cdn.dribbble.com/userupload/42920999/file/original-93660321e8852132642b3824614bc32f.png?format=webp&resize=1200x900',
    technologies: ['Scikit-Learn', 'Python', 'XGBoost', 'Power BI'],
  },
  {
    title: 'Financial Risk & Credit Scoring Engine',
    category: 'Banking Risk Analytics',
    description: 'Automated creditworthiness scoring model evaluating debt-to-income ratios and default risk factors.',
    metrics: '45,000+ Borrowers Evaluated',
    url: 'https://github.com/Sagar99-cmyk',
    image: 'https://cdn.dribbble.com/userupload/44924480/file/still-439f1b3427d2c6053c9bbfdc5debdbb2.png?format=webp&resize=1200x900',
    technologies: ['MySQL', 'Advanced Excel', 'Financial Modeling'],
  },
  {
    title: 'Owari — Energy Market Analytics',
    category: 'Commodity Trading & Power BI',
    description: 'High-frequency electricity demand grid monitoring and renewable generation load balancing dashboard.',
    metrics: 'Real-time MW Dispatch Analytics',
    url: 'https://dribbble.com/shots/27340771-Dashboard-Design-for-Stock-Trading-Platform',
    image: 'https://cdn.dribbble.com/userupload/44022519/file/still-91d6c4bfcf4accc97a75553bafe66b23.png?format=webp&resize=1200x900',
    technologies: ['Time Series', 'DAX', 'Power BI', 'Kafka'],
  },
  {
    title: 'Developer Analytics & Codebase Metrics',
    category: 'Engineering Intelligence',
    description: 'Repository health, pull-request turnaround velocity, and team throughput metrics for software teams.',
    metrics: 'Git Workflows & Team Telemetry',
    url: 'https://dribbble.com/shots/25764275-Social-Media-Platform-for-Developers',
    image: 'https://cdn.dribbble.com/userupload/41572827/file/original-ca56285eb604f6a12fe3e3c0e020bbd6.png?format=webp&resize=1200x900',
    technologies: ['React', 'Node.js', 'REST APIs', 'MySQL'],
  },
];

interface ShakuroWorksGalleryProps {
  onSelectProject?: (shot: WorksShot) => void;
  customShots?: WorksShot[];
}

const pad = (n: number) => String(n).padStart(2, '0');

export const ShakuroWorksGallery: React.FC<ShakuroWorksGalleryProps> = ({
  onSelectProject,
  customShots,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleCanvasRef = useRef<HTMLCanvasElement>(null);
  const titleElRef = useRef<HTMLSpanElement>(null);
  const indexElRef = useRef<HTMLSpanElement>(null);
  const linkElRef = useRef<HTMLAnchorElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLSpanElement>(null);

  const [activeShot, setActiveShot] = useState<WorksShot | null>(null);

  const shotsData = customShots && customShots.length > 0 ? customShots : SAGAR_WORKS_SHOTS;

  useEffect(() => {
    if (
      !containerRef.current ||
      !canvasRef.current ||
      !stripRef.current ||
      !viewerRef.current ||
      !closeBtnRef.current ||
      !titleCanvasRef.current ||
      !titleElRef.current ||
      !indexElRef.current ||
      !linkElRef.current ||
      !cursorRef.current ||
      !cursorLabelRef.current
    ) {
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const stripEl = stripRef.current;
    const viewer = viewerRef.current;
    const closeBtn = closeBtnRef.current;
    const titleCanvas = titleCanvasRef.current;
    const titleEl = titleElRef.current;
    const indexEl = indexElRef.current;
    const linkEl = linkElRef.current;
    const cursor = cursorRef.current;
    const cursorLabel = cursorLabelRef.current;

    const titleCtx = titleCanvas.getContext('2d');
    if (!titleCtx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const FOV = 30;
    const BG = new THREE.Color('#09090b');
    const CARD_ASPECT = 4 / 3;

    const pad = (n: number) => String(n).padStart(2, '0');
    const mod = (n: number, m: number) => ((n % m) + m) % m;
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

    const totalEl = viewer.querySelector('[data-total]');
    if (totalEl) totalEl.textContent = pad(shotsData.length);

    // Three.js Renderer Setup
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(DPR);
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = false;

    const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 10000);
    const bgScene = new THREE.Scene();
    const fgScene = new THREE.Scene();
    const sceneTarget = new THREE.WebGLRenderTarget(1, 1);

    const view = {
      w: 1,
      h: 1,
      dist: 1,
      stripY: 0,
      cardW: 1,
      cardH: 1,
      gap: 10,
      radius: 10,
      step: 1,
      fullStep: 1,
      curve: 0.22,
      frame: { top: 60, bottom: 60, side: 24 }
    };

    const shared = {
      uDist: { value: 1 },
      uViewport: { value: new THREE.Vector2(1, 1) },
    };

    const gallery = {
      uCurve: { value: 0 },
      uVelocity: { value: 0 },
      uRadius: { value: 10 },
      uOpacity: { value: 0 },
    };

    const full = { uVelocity: { value: 0 } };

    const vertexShader = /* glsl */ `
      uniform float uCurve;
      uniform float uDist;
      uniform vec2 uViewport;
      uniform float uVelocity;
      varying vec2 vUv;

      #define PI 3.141592653589793

      void main() {
        vUv = uv;
        vec4 world = modelMatrix * vec4(position, 1.0);

        // Concave strip: cards further from center curve closer to the viewer in 3D
        float nx = world.x / (uViewport.x * 0.5);
        world.z += uCurve * uDist * nx * nx;

        // Dynamic scroll drag: cards bow against the direction of travel
        world.x -= uVelocity * sin(uv.y * PI) * 28.0;
        world.z += abs(uVelocity) * sin(uv.x * PI) * 60.0;

        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `;

    const fragmentShader = /* glsl */ `
      uniform sampler2D uTexture;
      uniform vec2 uImage;
      uniform vec2 uPlane;
      uniform float uRadius;
      uniform float uVelocity;
      uniform float uHover;
      uniform float uLoaded;
      uniform float uOpacity;
      varying vec2 vUv;

      #define PI 3.141592653589793

      vec2 cover(vec2 uv) {
        float planeRatio = uPlane.x / uPlane.y;
        float imageRatio = uImage.x / uImage.y;
        vec2 scale = planeRatio > imageRatio
          ? vec2(1.0, imageRatio / planeRatio)
          : vec2(planeRatio / imageRatio, 1.0);
        return (uv - 0.5) * scale + 0.5;
      }

      float roundedBox(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + r;
        return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
      }

      void main() {
        vec2 uv = (vUv - 0.5) * (1.0 - uHover * 0.07) + 0.5;
        uv.x += sin(vUv.y * PI) * uVelocity * 0.05;
        uv.y += sin(vUv.x * PI * 2.0) * uVelocity * 0.012;
        uv = cover(uv);

        float shift = uVelocity * 0.01;
        vec3 color = vec3(
          texture2D(uTexture, uv + vec2(shift, 0.0)).r,
          texture2D(uTexture, uv).g,
          texture2D(uTexture, uv - vec2(shift, 0.0)).b
        );
        color = mix(vec3(0.08), color, uLoaded);

        float d = roundedBox((vUv - 0.5) * uPlane, uPlane * 0.5, uRadius);
        float aa = max(fwidth(d), 0.0001);
        float alpha = (1.0 - smoothstep(-aa, aa, d)) * uOpacity;

        gl_FragColor = vec4(color, alpha);
      }
    `;

    // Post-processing Shader Material: Pixel Mosaic + Block Noise Dissolve
    const postMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tScene: { value: sceneTarget.texture },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uPixel: { value: 1 },
        uBlock: { value: 32 },
        uDissolve: { value: 0 },
        uDim: { value: 0 },
        uSeed: { value: 0 },
        uBg: { value: BG },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D tScene;
        uniform vec2 uResolution;
        uniform float uPixel;
        uniform float uBlock;
        uniform float uDissolve;
        uniform float uDim;
        uniform float uSeed;
        uniform vec3 uBg;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453);
        }

        void main() {
          vec2 px = vUv * uResolution;
          vec2 cell = (floor(px / uPixel) + 0.5) * uPixel;
          vec4 scene = texture2D(tScene, cell / uResolution);
          scene.rgb *= 1.0 - uDim;

          vec2 block = floor(px / uBlock);
          float edge = length((block + 0.5) * uBlock / uResolution - 0.5) * 1.4;
          float threshold = hash(block) * 0.7 + (1.0 - edge) * 0.3;
          float b = step(threshold, uDissolve * 1.02);

          gl_FragColor = vec4(scene.rgb * (1.0 - b) + uBg * b, scene.a + b - scene.a * b);
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
    });

    const postScene = new THREE.Scene();
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial));

    const geometry = new THREE.PlaneGeometry(1, 1, 40, 20);
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Fallback Canvas Texture Generator for instant loading & offline durability
    function generateFallbackTexture(shot: WorksShot) {
      const c = document.createElement('canvas');
      c.width = 1200;
      c.height = 900;
      const ctx = c.getContext('2d')!;

      // Deep analytical card gradient
      const grad = ctx.createLinearGradient(0, 0, 1200, 900);
      grad.addColorStop(0, '#1c1917');
      grad.addColorStop(0.5, '#141113');
      grad.addColorStop(1, '#0c0a09');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 900);

      // Crimson highlight glow
      const radial = ctx.createRadialGradient(900, 200, 50, 900, 200, 600);
      radial.addColorStop(0, 'rgba(225, 29, 72, 0.35)');
      radial.addColorStop(1, 'transparent');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 1200, 900);

      // Top category pill
      ctx.fillStyle = 'rgba(225, 29, 72, 0.2)';
      ctx.strokeStyle = 'rgba(225, 29, 72, 0.5)';
      ctx.lineWidth = 3;
      ctx.roundRect(80, 80, 480, 64, 32);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 24px monospace';
      ctx.fillText((shot.category || 'DATA ANALYTICS CAPSTONE').toUpperCase(), 110, 122);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px sans-serif';
      const words = shot.title.split(' ');
      let line1 = '';
      let line2 = '';
      words.forEach(w => {
        if ((line1 + w).length < 24) line1 += w + ' ';
        else line2 += w + ' ';
      });
      ctx.fillText(line1.trim(), 80, 260);
      if (line2) ctx.fillText(line2.trim(), 80, 335);

      // Metric Badge Box
      if (shot.metrics) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2;
        ctx.roundRect(80, 420, 520, 90, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 32px monospace';
        ctx.fillText(shot.metrics, 110, 476);
      }

      // Tech Stack Tags
      if (shot.technologies && shot.technologies.length > 0) {
        let tx = 80;
        shot.technologies.forEach(t => {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.roundRect(tx, 560, t.length * 20 + 40, 48, 12);
          ctx.fill();
          ctx.fillStyle = '#e2e8f0';
          ctx.font = '600 20px monospace';
          ctx.fillText(t, tx + 20, 592);
          tx += t.length * 20 + 55;
        });
      }

      // Watermark branding
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('SAGAR SINGH · PORTFOLIO SHOWCASE', 80, 820);

      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = anisotropy;
      return tex;
    }

    const shots = shotsData.map((shot) => {
      const fallbackTex = generateFallbackTexture(shot);
      const data = {
        ...shot,
        uTexture: { value: fallbackTex as THREE.Texture },
        uImage: { value: new THREE.Vector2(1200, 900) },
        uLoaded: { value: 1 },
      };

      if (shot.image) {
        loader.load(
          shot.image,
          (texture) => {
            texture.anisotropy = anisotropy;
            data.uTexture.value = texture;
            if (texture.image) {
              data.uImage.value.set(texture.image.width || 1200, texture.image.height || 900);
            }
            gsap.to(data.uLoaded, { value: 1, duration: 0.8, ease: 'power2.out' });
          },
          undefined,
          () => {
            // Keep the dynamic canvas texture on error
            data.uTexture.value = fallbackTex;
          }
        );
      }

      return data;
    });

    function makeMaterial(shot: any, uniforms: any) {
      return new THREE.ShaderMaterial({
        uniforms: {
          ...shared,
          uTexture: shot.uTexture,
          uImage: shot.uImage,
          uLoaded: shot.uLoaded,
          uPlane: { value: new THREE.Vector2(1, 1) },
          uHover: { value: 0 },
          ...uniforms,
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });
    }

    // Fullscreen meshes
    const fullMeshes = shots.map((shot) => {
      const mesh = new THREE.Mesh(geometry, makeMaterial(shot, {
        uVelocity: full.uVelocity,
        uCurve: { value: 0 },
        uRadius: { value: 0 },
        uOpacity: { value: 1 },
      }));
      mesh.visible = false;
      fgScene.add(mesh);
      return mesh;
    });

    let items: any[] = [];

    function buildGallery() {
      const copies = Math.max(1, Math.ceil((view.w + view.step * 4) / (shots.length * view.step)));
      if (items.length === copies * shots.length) return;

      items.forEach((item) => {
        bgScene.remove(item.mesh);
        item.mesh.material.dispose();
      });

      items = Array.from({ length: copies * shots.length }, (_, slot) => {
        const shotIndex = slot % shots.length;
        const mesh = new THREE.Mesh(geometry, makeMaterial(shots[shotIndex], gallery));
        bgScene.add(mesh);
        return { mesh, slot, shotIndex, x: 0, hover: 0, hovered: false };
      });
    }

    function drawTitle() {
      const size = parseFloat(window.getComputedStyle(titleCanvas.parentElement!).fontSize) || 36;
      titleFont.size = size;
      titleFont.css = `600 ${size}px 'Plus Jakarta Sans', sans-serif`;

      titleCtx!.font = titleFont.css;
      const cssW = Math.ceil(titleCtx!.measureText(titleFx.text).width + size * 0.08);
      const cssH = Math.ceil(size * 1.15);
      const W = Math.round(cssW * DPR);
      const H = Math.round(cssH * DPR);

      if (titleCanvas.width !== W || titleCanvas.height !== H) {
        titleCanvas.width = W;
        titleCanvas.height = H;
        titleCanvas.style.width = `${cssW}px`;
        titleCanvas.style.height = `${cssH}px`;
      }

      titleCtx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      titleCtx!.clearRect(0, 0, cssW, cssH);
      titleCtx!.font = titleFont.css;
      titleCtx!.fillStyle = '#ffffff';
      titleCtx!.textBaseline = 'alphabetic';
      titleCtx!.fillText(titleFx.text, size * 0.02, size * 0.9);

      if (titleFx.cover > 0) {
        titleCtx!.globalCompositeOperation = 'destination-out';
        const cols = Math.ceil(cssW / TITLE_BLOCK);
        const rows = Math.ceil(cssH / TITLE_BLOCK);
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const delay = blockNoise(i, j) * 0.6;
            const t = clamp((titleFx.cover - delay) / 0.4, 0, 1);
            if (t <= 0) continue;
            const side = TITLE_BLOCK * t;
            const x = i * TITLE_BLOCK + (TITLE_BLOCK - side) / 2;
            const y = j * TITLE_BLOCK + (TITLE_BLOCK - side) / 2;
            titleCtx!.fillRect(x, y, side, side);
          }
        }
        titleCtx!.globalCompositeOperation = 'source-over';
      }
    }

    function setTitle(text: string) {
      titleFx.text = text;
      titleEl.textContent = text;
      drawTitle();
    }

    function updateViewerText(index: number, animate: boolean) {
      const shot = shots[index];
      indexEl.textContent = pad(index + 1);
      linkEl.href = shot.url;
      setActiveShot(shot);
      if (!animate) {
        setTitle(shot.title);
        return;
      }
      gsap.killTweensOf(titleFx);
      gsap.timeline()
        .to(titleFx, { cover: 1, duration: 0.45, ease: 'sine.in', onUpdate: drawTitle })
        .add(() => setTitle(shot.title))
        .to(titleFx, { cover: 0, duration: 0.55, ease: 'sine.out', onUpdate: drawTitle });
    }

    function measure() {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      view.w = rect.width || window.innerWidth;
      view.h = rect.height || window.innerHeight;
      view.dist = view.h / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));

      camera.aspect = view.w / view.h;
      camera.position.set(0, 0, view.dist);
      camera.far = view.dist * 4;
      camera.updateProjectionMatrix();

      const stripRect = stripEl.getBoundingClientRect();
      const mobile = view.w < 720;
      view.cardW = Math.min(stripRect.height * CARD_ASPECT, view.w / (mobile ? 1.35 : 3.6));
      view.cardH = view.cardW / CARD_ASPECT;
      view.stripY = view.h / 2 - (stripRect.top - rect.top + stripRect.height / 2);
      view.gap = clamp(view.w * 0.012, 8, 20);
      view.radius = clamp(view.cardW * 0.045, 6, 16);
      view.step = view.cardW + view.gap;
      view.fullStep = view.w + 32;

      const closeRect = closeBtn.getBoundingClientRect();
      drawTitle();
      const titleRect = titleCanvas.getBoundingClientRect();
      const side = closeRect.right > 0 ? view.w - closeRect.right + 14 : 24;
      view.frame = {
        top: Math.max(60, closeRect.bottom - rect.top + 8),
        bottom: Math.max(60, view.h - (titleRect.top - rect.top) + 24),
        side,
      };
      view.curve = mobile ? 0.12 : 0.22;

      shared.uDist.value = view.dist;
      shared.uViewport.value.set(view.w, view.h);
      gallery.uRadius.value = view.radius;

      renderer.setSize(view.w, view.h, false);
      sceneTarget.setSize(view.w * DPR, view.h * DPR);
      postMaterial.uniforms.uResolution.value.set(view.w * DPR, view.h * DPR);
      postMaterial.uniforms.uBlock.value = 32 * DPR;

      buildGallery();
    }

    function galleryX(slot: number) {
      const total = items.length * view.step;
      return mod(slot * view.step - scroll.gallery.current + total / 2, total) - total / 2;
    }

    function fullX(index: number) {
      const total = shots.length * view.fullStep;
      return mod(index * view.fullStep - scroll.full.current + total / 2, total) - total / 2;
    }

    function fitSize(shot: any) {
      const { x: iw, y: ih } = shot.uImage.value;
      const { top, bottom, side } = view.frame;
      const boxH = view.h - top - bottom;
      const scale = Math.min((view.w - side * 2) / iw, boxH / ih);
      return { w: iw * scale, h: ih * scale, y: view.h / 2 - (top + boxH / 2) };
    }

    function setPlane(mesh: THREE.Mesh, x: number, y: number, w: number, h: number) {
      mesh.position.set(x, y, 0);
      mesh.scale.set(w, h, 1);
      (mesh.material as THREE.ShaderMaterial).uniforms.uPlane.value.set(w, h);
    }

    function screenToStrip(px: number) {
      const s = px - view.w / 2;
      const k = gallery.uCurve.value * view.dist / Math.pow(view.w / 2, 2);
      if (Math.abs(s * k) < 1e-6) return s;
      const D = view.dist;
      return (-D + Math.sqrt(D * D + 4 * s * s * k * D)) / (2 * s * k);
    }

    function hitTest(px: number, py: number) {
      const x = screenToStrip(px);
      const k = gallery.uCurve.value * view.dist / Math.pow(view.w / 2, 2);
      const scale = view.dist / (view.dist - k * x * x);
      const top = view.h / 2 - (view.stripY + view.cardH / 2) * scale;
      const bottom = view.h / 2 - (view.stripY - view.cardH / 2) * scale;
      if (py < top || py > bottom) return null;
      return items.find((item) => Math.abs(x - item.x) <= view.cardW / 2) || null;
    }

    const scroll = {
      gallery: { current: 0, target: 0, prev: 0, velocity: 0 },
      full: { current: 0, target: 0, prev: 0, velocity: 0 },
    };
    const pixel = { mosaic: 0, dissolve: 0 };
    const state = { mode: 'intro', active: null as any, morph: null as any, fullIndex: 0 };
    const pointer = { x: -1, y: -1, down: false, startX: 0, startTarget: 0, moved: false };

    function setCursor(label: string | null) {
      if (label) cursorLabel.textContent = label;
      cursor.classList.toggle('is-visible', Boolean(label));
    }

    const titleFx = { text: '', cover: 0 };
    const TITLE_BLOCK = 12;
    const titleFont = { size: 0, css: '' };

    function blockNoise(i: number, j: number) {
      const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
      return v - Math.floor(v);
    }

    function open(item: any) {
      if (state.mode !== 'gallery' || !item) return;
      state.mode = 'opening';
      setCursor(null);

      const g = scroll.gallery;
      g.target = g.current;

      const mesh = fullMeshes[item.shotIndex];
      state.active = { item, mesh };
      state.fullIndex = item.shotIndex;
      scroll.full.current = scroll.full.target = scroll.full.prev = item.shotIndex * view.fullStep;
      updateViewerText(item.shotIndex, false);

      state.morph = {
        x: item.x,
        y: view.stripY,
        w: view.cardW,
        h: view.cardH,
        curve: gallery.uCurve.value,
        radius: view.radius,
      };

      item.mesh.visible = false;
      fullMeshes.forEach((m) => { m.visible = m === mesh; });
      postMaterial.uniforms.uSeed.value = Math.random() * 100;
      const hover = (mesh.material as THREE.ShaderMaterial).uniforms.uHover;
      hover.value = item.hover;

      gsap.timeline({
        onComplete: () => {
          state.mode = 'full';
          state.morph = null;
          fullMeshes.forEach((m) => { m.visible = true; });
          viewer.classList.add('is-open');
          viewer.setAttribute('aria-hidden', 'false');
          setCursor('Drag');
        },
      })
        .to(state.morph, {
          x: 0,
          y: () => fitSize(shots[item.shotIndex]).y,
          w: () => fitSize(shots[item.shotIndex]).w,
          h: () => fitSize(shots[item.shotIndex]).h,
          curve: 0,
          radius: 0,
          duration: 1.3,
          ease: 'expo.inOut',
        }, 0)
        .to(hover, { value: 0, duration: 1.3, ease: 'expo.inOut' }, 0)
        .to(pixel, { mosaic: 1, duration: 0.75, ease: 'power2.out' }, 0)
        .to(pixel, { dissolve: 1, duration: 0.9, ease: 'power1.inOut' }, 0.25)
        .to(viewer.querySelectorAll(':scope > *'), { autoAlpha: 1, duration: 0.6, stagger: 0.06, ease: 'power2.out' }, 1.0)
        .fromTo(titleFx, { cover: 1 }, { cover: 0, duration: 1.0, ease: 'sine.out', onUpdate: drawTitle, immediateRender: false }, 1.0);
    }

    function close() {
      if (state.mode !== 'full') return;
      state.mode = 'closing';
      setCursor(null);
      viewer.classList.remove('is-open', 'is-dragging');
      viewer.setAttribute('aria-hidden', 'true');

      const index = state.fullIndex;
      const mesh = fullMeshes[index];

      const g = scroll.gallery;
      const item = items
        .filter((it) => it.shotIndex === index)
        .reduce((a, b) => (Math.abs(galleryX(a.slot)) <= Math.abs(galleryX(b.slot)) ? a : b));

      g.current = g.target = g.prev = g.current + galleryX(item.slot);
      g.velocity = 0;
      items.forEach((it) => { it.mesh.visible = it !== item; });

      state.active = { item, mesh };
      const fit = fitSize(shots[index]);
      state.morph = {
        x: fullX(index),
        y: fit.y,
        w: fit.w,
        h: fit.h,
        curve: (mesh.material as THREE.ShaderMaterial).uniforms.uCurve.value,
        radius: 0,
      };
      fullMeshes.forEach((m) => { m.visible = m === mesh; });
      postMaterial.uniforms.uSeed.value = Math.random() * 100;

      gsap.timeline({
        onComplete: () => {
          item.mesh.visible = true;
          mesh.visible = false;
          state.mode = 'gallery';
          state.active = null;
          state.morph = null;
          updateHover();
        },
      })
        .to(viewer.querySelectorAll(':scope > *'), { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0)
        .to(state.morph, {
          x: 0,
          y: () => view.stripY,
          w: () => view.cardW,
          h: () => view.cardH,
          curve: () => view.curve,
          radius: () => view.radius,
          duration: 1.25,
          ease: 'expo.inOut',
        }, 0.05)
        .to(pixel, { dissolve: 0, duration: 0.85, ease: 'power1.inOut' }, 0.2)
        .to(pixel, { mosaic: 0, duration: 0.8, ease: 'power1.out' }, 0.6);
    }

    let wheelBase: number | null = null;
    let snapTimer = 0;

    function snapFull(base: number, raw: number) {
      const delta = raw - base;
      let index = base;
      if (delta > 0.08) index = Math.max(base + 1, Math.round(raw));
      else if (delta < -0.08) index = Math.min(base - 1, Math.round(raw));
      scroll.full.target = index * view.fullStep;
    }

    function nudgeFull(dir: number) {
      scroll.full.target = (Math.round(scroll.full.target / view.fullStep) + dir) * view.fullStep;
    }

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept global page scroll unless hovering directly over container
      const target = e.target as HTMLElement;
      if (!container.contains(target)) return;

      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? view.h : 1;
      const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * unit;

      if (state.mode === 'gallery') {
        scroll.gallery.target += delta * 0.85;
      } else if (state.mode === 'full') {
        e.preventDefault();
        if (wheelBase === null) wheelBase = Math.round(scroll.full.target / view.fullStep);
        scroll.full.target += clamp(delta * 1.2, -view.fullStep * 0.6, view.fullStep * 0.6);
        window.clearTimeout(snapTimer);
        snapTimer = window.setTimeout(() => {
          if (wheelBase !== null) snapFull(wheelBase, scroll.full.target / view.fullStep);
          wheelBase = null;
        }, 140);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || (e.target as HTMLElement).closest('a, button')) return;
      if (state.mode !== 'gallery' && state.mode !== 'full') return;
      const s = state.mode === 'gallery' ? scroll.gallery : scroll.full;
      Object.assign(pointer, { down: true, startX: e.clientX, startTarget: s.target, moved: false, x: e.clientX, y: e.clientY });
      if (state.mode === 'full') viewer.classList.add('is-dragging');
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;

      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.35, ease: 'power3.out', overwrite: true });

      if (pointer.down) {
        const dx = pointer.startX - e.clientX;
        if (Math.abs(dx) > 5) pointer.moved = true;
        if (state.mode === 'gallery') scroll.gallery.target = pointer.startTarget + dx * 1.5;
        else if (state.mode === 'full') scroll.full.target = pointer.startTarget + dx * 1.1;
      }

      if (state.mode === 'full') setCursor((e.target as HTMLElement).closest('a, button') ? null : 'Drag');
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!pointer.down) return;
      pointer.down = false;
      viewer.classList.remove('is-dragging');

      if (state.mode === 'gallery' && !pointer.moved) {
        const rect = container.getBoundingClientRect();
        const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
        if (hit) {
          open(hit);
        }
      } else if (state.mode === 'full') {
        snapFull(Math.round(pointer.startTarget / view.fullStep), scroll.full.target / view.fullStep);
      }
    };

    const handlePointerCancel = () => {
      pointer.down = false;
      viewer.classList.remove('is-dragging');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (state.mode === 'gallery') {
        if (dir) scroll.gallery.target += dir * view.step;
        if (e.key === 'Enter') open(hitTest(view.w / 2, view.h / 2 - view.stripY));
      } else if (state.mode === 'full') {
        if (dir) nudgeFull(dir);
        if (e.key === 'Escape') close();
      }
    };

    function updateHover() {
      const hovered = state.mode === 'gallery' && !pointer.down && pointer.x >= 0
        ? hitTest(pointer.x, pointer.y)
        : null;
      items.forEach((item) => { item.hovered = item === hovered; });
      if (state.mode === 'gallery') {
        setCursor(hovered ? 'Open' : null);
        container.style.cursor = hovered ? 'pointer' : '';
      } else {
        container.style.cursor = '';
      }
    }

    function step(s: any, ratio: number) {
      s.current += (s.target - s.current) * (1 - Math.pow(1 - 0.085, ratio));
      const v = (s.current - s.prev) / ratio;
      s.prev = s.current;
      s.velocity += (v - s.velocity) * 0.2;
    }

    function tick() {
      const ratio = gsap.ticker.deltaRatio(60);

      // Strip
      step(scroll.gallery, ratio);
      const gv = clamp(scroll.gallery.velocity / 60, -1, 1);
      gallery.uVelocity.value = gv;
      gallery.uCurve.value = view.curve + Math.abs(gv) * 0.06;

      updateHover();
      items.forEach((item) => {
        item.x = galleryX(item.slot);
        setPlane(item.mesh, item.x, view.stripY, view.cardW, view.cardH);
        item.hover += ((item.hovered ? 1 : 0) - item.hover) * 0.1 * ratio;
        (item.mesh.material as THREE.ShaderMaterial).uniforms.uHover.value = item.hover;
      });

      // Fullscreen slider
      step(scroll.full, ratio);
      const fv = clamp(scroll.full.velocity / 120, -1, 1);
      full.uVelocity.value = fv;

      if (state.mode === 'full') {
        fullMeshes.forEach((mesh, i) => {
          const fit = fitSize(shots[i]);
          setPlane(mesh, fullX(i), fit.y, fit.w, fit.h);
          (mesh.material as THREE.ShaderMaterial).uniforms.uCurve.value = Math.abs(fv) * 0.18;
        });
        const index = mod(Math.round(scroll.full.current / view.fullStep), shots.length);
        if (index !== state.fullIndex) {
          state.fullIndex = index;
          updateViewerText(index, true);
        }
      } else if (state.morph && state.active) {
        const { mesh } = state.active;
        const m = state.morph;
        setPlane(mesh, m.x, m.y, m.w, m.h);
        (mesh.material as THREE.ShaderMaterial).uniforms.uCurve.value = m.curve;
        (mesh.material as THREE.ShaderMaterial).uniforms.uRadius.value = m.radius;
      }

      const level = Math.min(6, Math.floor(pixel.mosaic * 7));
      postMaterial.uniforms.uPixel.value = Math.pow(2, level) * DPR;
      postMaterial.uniforms.uDim.value = pixel.mosaic * 0.35;
      postMaterial.uniforms.uDissolve.value = pixel.dissolve;

      renderer.setRenderTarget(sceneTarget);
      renderer.clear();
      renderer.render(bgScene, camera);
      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(postScene, postCamera);
      renderer.render(fgScene, camera);
    }

    function intro() {
      measure();
      updateViewerText(0, false);

      scroll.gallery.current = scroll.gallery.prev = -view.w * 1.4;
      scroll.gallery.target = 0;
      gsap.to(gallery.uOpacity, { value: 1, duration: 1.2, ease: 'power2.out' });
      gsap.delayedCall(0.5, () => { state.mode = 'gallery'; });

      gsap.ticker.add(tick);
    }

    intro();

    container.addEventListener('wheel', handleWheel, { passive: true });
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);
    window.addEventListener('keydown', handleKeyDown);
    closeBtn.addEventListener('click', close);

    const handleResize = () => {
      measure();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      window.removeEventListener('keydown', handleKeyDown);
      closeBtn.removeEventListener('click', close);
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(tick);

      renderer.dispose();
      sceneTarget.dispose();
      geometry.dispose();
      postMaterial.dispose();
    };
  }, [shotsData]);

  return (
    <div
      ref={containerRef}
      className="shakuro-works-stage relative w-full h-[580px] sm:h-[660px] md:h-[720px] rounded-[32px] overflow-hidden select-none border border-white/[0.08] bg-[#09090b] shadow-2xl transition-all"
    >
      {/* Visual Overlay: Top Strip Marker & Header Info */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-8 pointer-events-none">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-300">
              Concave 3D Project Strip
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-stone-400">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Drag or scroll to orbit · Click card to zoom</span>
            </span>
          </div>
        </div>

        {/* Anchor placeholder for measuring the curved strip's height and vertical center */}
        <div ref={stripRef} className="strip w-full h-[240px] sm:h-[280px] md:h-[320px] my-auto pointer-events-none" />

        {/* Bottom Hero & Status Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              Interactive 3D Workstream
            </h3>
            <p className="text-xs text-stone-400 font-mono">
              Concave parabolic strip · Dynamic bowing physics · Screen-space pixel dissolve
            </p>
          </div>

          <div className="text-[11px] font-mono text-stone-400 flex items-center gap-3">
            <span>{shotsData.length} Capstones Live</span>
            <span>·</span>
            <span className="text-rose-400">WebGL 60 FPS</span>
          </div>
        </div>
      </div>

      {/* Primary WebGL Canvas */}
      <canvas ref={canvasRef} className="webgl absolute inset-0 w-full h-full pointer-events-auto z-0" />

      {/* Fullscreen Zoom Viewer UI Overlay */}
      <div
        ref={viewerRef}
        className="viewer fixed inset-0 z-50 p-6 sm:p-12 pointer-events-none text-white select-none transition-all"
        style={{
          background: 'rgba(9, 9, 11, 0.4)',
          backdropFilter: 'blur(8px)',
        }}
        aria-hidden="true"
      >
        {/* Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          aria-label="Close fullscreen"
          className="viewer__close absolute top-6 right-6 sm:top-10 sm:right-10 w-12 h-12 rounded-full border border-white/20 bg-black/40 hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer pointer-events-auto hover:scale-110 active:scale-95"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Project Link */}
        <a
          ref={linkElRef}
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="viewer__link absolute right-6 bottom-6 sm:right-12 sm:bottom-12 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-xl pointer-events-auto cursor-pointer"
        >
          <span>View Live Case Study</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Dynamic Canvas Title with Block Noise Wipe */}
        <div className="viewer__title absolute left-6 bottom-6 sm:left-12 sm:bottom-12 max-w-[70vw] pointer-events-none">
          <canvas ref={titleCanvasRef} className="viewer__title-canvas block" aria-hidden="true" />
          <span ref={titleElRef} className="sr-only" data-title />
          {activeShot?.category && (
            <span className="block mt-2 text-xs sm:text-sm font-mono text-amber-300 uppercase tracking-widest">
              {activeShot.category} {activeShot.metrics ? `· ${activeShot.metrics}` : ''}
            </span>
          )}
        </div>

        {/* Counter */}
        <div className="viewer__count absolute top-6 left-6 sm:top-10 sm:left-12 font-mono text-xs sm:text-sm text-stone-300 font-bold tracking-widest">
          <span ref={indexElRef} data-index>01</span> / <span data-total>{pad(shotsData.length)}</span>
        </div>
      </div>

      {/* Custom Cursor Follower */}
      <div ref={cursorRef} className="cursor fixed top-0 left-0 z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity">
        <span
          ref={cursorLabelRef}
          className="cursor__label inline-block px-3 py-1 rounded-full bg-white text-stone-900 font-mono text-[10px] font-bold uppercase tracking-wider shadow-lg"
        >
          Open
        </span>
      </div>
    </div>
  );
};

