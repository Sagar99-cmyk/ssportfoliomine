import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { Volume2, VolumeX, ChevronLeft, ChevronRight, ExternalLink, BookOpen, Sparkles, Layers } from 'lucide-react';
import { Project } from '../types';

interface PopUpBookShowcaseProps {
  projects?: Project[];
  onOpenCaseStudy?: (project: Project) => void;
  className?: string;
}

interface BookChapter {
  id: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  description: string;
  technologies: string[];
  accentColor: string;
  modelType: 'dashboard' | 'housing' | 'hospital' | 'supplychain';
  projectRef?: Project;
}

export const PopUpBookShowcase: React.FC<PopUpBookShowcaseProps> = ({
  projects = [],
  onOpenCaseStudy,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 0 = Cover, 1..4 = Spreads
  const [isAnimating, setIsAnimating] = useState(false);

  // Map portfolio projects to book chapters
  const chapters: BookChapter[] = useMemo(() => {
    const defaults: BookChapter[] = [
      {
        id: 'sales-bi',
        chapterNumber: 'CHAPTER I',
        title: 'Sales Performance & Intelligence',
        subtitle: 'Enterprise BI Dashboard & SQL Relational Engine',
        metric: '+24.8% YoY',
        metricLabel: 'Revenue Expansion & Customer Retention',
        description: 'Multi-tiered star-schema relational model processing 1.2M+ transaction records with dynamic DAX time intelligence and drill-through KPIs.',
        technologies: ['Power BI', 'DAX', 'MySQL', 'Star Schema', 'ETL'],
        accentColor: '#f43f5e',
        modelType: 'dashboard',
      },
      {
        id: 'pg-rental',
        chapterNumber: 'CHAPTER II',
        title: 'PG Rental Property Analytics',
        subtitle: 'Urban Housing Intelligence & Occupancy Matrix',
        metric: '94.2%',
        metricLabel: 'Peak Occupancy & Dynamic Pricing Yield',
        description: 'Comprehensive property analytics examining tenant churn, geographic density clusters, rental yield optimization, and cash flow forecasts.',
        technologies: ['Advanced Excel', 'MySQL', 'Power Query', 'Financial Modeling'],
        accentColor: '#38bdf8',
        modelType: 'housing',
      },
      {
        id: 'hospital-flow',
        chapterNumber: 'CHAPTER III',
        title: 'Hospital Emergency Patient Flow',
        subtitle: 'Healthcare Capacity Optimization & Triage Predictor',
        metric: '-38.5%',
        metricLabel: 'Emergency Room Wait Time Reduction',
        description: 'Bed occupancy simulation, triage bottleneck analysis, and nurse-to-patient staffing allocation model to streamline emergency department workflow.',
        technologies: ['Python', 'Pandas', 'Healthcare Analytics', 'Time Series'],
        accentColor: '#10b981',
        modelType: 'hospital',
      },
      {
        id: 'supply-chain',
        chapterNumber: 'CHAPTER IV',
        title: 'Global Supply Chain Logistics',
        subtitle: 'Route Minimization & Inventory Turnover Matrix',
        metric: '$1.4M',
        metricLabel: 'Annual Freight & Safety Stock Savings',
        description: 'End-to-end logistics tracking modeling freight vendor lead times, safety stock replenishment, fuel burn rates, and inventory turnover velocity.',
        technologies: ['Tableau', 'MySQL', 'Supply Chain Analytics', 'Cost Modeling'],
        accentColor: '#fbbf24',
        modelType: 'supplychain',
      },
    ];

    return defaults.map((ch, idx) => {
      const match = projects.find(
        (p) =>
          p.title.toLowerCase().includes(ch.title.split(' ')[0].toLowerCase()) ||
          p.category?.toLowerCase().includes('sales') && idx === 0
      ) || projects[idx % projects.length];
      return { ...ch, projectRef: match };
    });
  }, [projects]);

  // Synthetic Web Audio API Sound Generator for Paper Rustle and Chimes
  const playPaperRustle = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // 1. Filtered White Noise for Paper Rustle / Page Turn Swoosh
      const bufferSize = ctx.sampleRate * 0.45; // 450ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.18));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.42);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      // 2. Soft Ambient Chime harmonic
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.25);

      oscGain.gain.setValueAtTime(0.001, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.04);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.38);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio not permitted or supported
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next && !audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      return next;
    });
  };

  // Three.js References for Animation & Scene Controls
  const sceneStateRef = useRef<{
    targetPageAngle: number;
    currentPageAngle: number;
    bookGroup: THREE.Group | null;
    turningPageMesh: THREE.Group | null;
    popupGroup: THREE.Group | null;
    popupPillars: THREE.Mesh[];
    leftPageMesh: THREE.Mesh | null;
    rightPageMesh: THREE.Mesh | null;
    pageTextures: THREE.CanvasTexture[];
  }>({
    targetPageAngle: 0,
    currentPageAngle: 0,
    bookGroup: null,
    turningPageMesh: null,
    popupGroup: null,
    popupPillars: [],
    leftPageMesh: null,
    rightPageMesh: null,
    pageTextures: [],
  });

  // Generate High-Resolution Canvas Textures for Book Pages
  const createPageTexture = useCallback((content: {
    isLeft: boolean;
    chapter?: BookChapter;
    isCover?: boolean;
  }) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1360;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const W = canvas.width;
    const H = canvas.height;

    if (content.isCover) {
      // Antique Royal Maroon/Ebony Leather Cover with Gold Foil
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#381014');
      grad.addColorStop(0.5, '#22080a');
      grad.addColorStop(1, '#110304');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Gold Foil Border Fillets
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, W - 80, H - 80);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 60, W - 120, H - 120);

      // Corner flourishes
      const drawCorner = (x: number, y: number) => {
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCorner(70, 70);
      drawCorner(W - 70, 70);
      drawCorner(70, H - 70);
      drawCorner(W - 70, H - 70);

      // Center Crest
      ctx.save();
      ctx.translate(W / 2, H * 0.38);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, 160, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 88px "Cinzel", "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SS', 0, -10);

      ctx.font = '600 24px monospace';
      ctx.fillStyle = '#d4af37';
      ctx.fillText('ANALYTICS & BI', 0, 60);
      ctx.restore();

      // Title Gold Emboss
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 52px "Cinzel", "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText('SAGAR SINGH', W / 2, H * 0.64);

      ctx.fillStyle = '#d4af37';
      ctx.font = '600 28px monospace';
      ctx.fillText('DATA ANALYST PORTFOLIO', W / 2, H * 0.71);

      ctx.fillStyle = 'rgba(254, 240, 138, 0.7)';
      ctx.font = 'italic 24px "Times New Roman", serif';
      ctx.fillText('Interactive 3D Pop-Up Storybook', W / 2, H * 0.77);

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('TURN PAGE TO EXPLORE CAPSTONES →', W / 2, H * 0.88);
    } else {
      // Aged Parchment Paper Background
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#f9f6ee');
      grad.addColorStop(0.5, '#f5efe1');
      grad.addColorStop(1, '#ede3cb');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Subtle paper edge shadow
      ctx.fillStyle = 'rgba(120, 80, 40, 0.08)';
      if (content.isLeft) {
        ctx.fillRect(W - 40, 0, 40, H); // spine shadow
      } else {
        ctx.fillRect(0, 0, 40, H);
      }

      const ch = content.chapter;
      if (ch) {
        if (content.isLeft) {
          // LEFT PAGE: Project Dossier & Narrative
          ctx.fillStyle = ch.accentColor;
          ctx.font = 'bold 22px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(ch.chapterNumber, 80, 120);

          ctx.fillStyle = '#1c1917';
          ctx.font = 'bold 48px "Cinzel", "Times New Roman", serif';
          const titleWords = ch.title.split(' ');
          let line1 = '';
          let line2 = '';
          titleWords.forEach((w) => {
            if ((line1 + w).length < 18) line1 += w + ' ';
            else line2 += w + ' ';
          });
          ctx.fillText(line1.trim(), 80, 200);
          if (line2) ctx.fillText(line2.trim(), 80, 260);

          // Subtitle
          ctx.fillStyle = '#78716c';
          ctx.font = '600 24px sans-serif';
          ctx.fillText(ch.subtitle, 80, 330);

          // Divider rule
          ctx.strokeStyle = ch.accentColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(80, 370);
          ctx.lineTo(W - 80, 370);
          ctx.stroke();

          // Paragraph
          ctx.fillStyle = '#44403c';
          ctx.font = '24px "Georgia", serif';
          const pWords = ch.description.split(' ');
          let pLine = '';
          let py = 430;
          pWords.forEach((w) => {
            if ((pLine + w).length < 32) {
              pLine += w + ' ';
            } else {
              ctx.fillText(pLine.trim(), 80, py);
              py += 38;
              pLine = w + ' ';
            }
          });
          if (pLine) ctx.fillText(pLine.trim(), 80, py);

          // Tech Stack Badges
          ctx.fillStyle = '#1c1917';
          ctx.font = 'bold 20px monospace';
          ctx.fillText('PRIMARY TECHNOLOGY STACK', 80, 720);

          let bx = 80;
          let by = 760;
          ch.technologies.forEach((t) => {
            const bWidth = t.length * 16 + 32;
            if (bx + bWidth > W - 80) {
              bx = 80;
              by += 54;
            }
            ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
            ctx.strokeStyle = ch.accentColor;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(bx, by, bWidth, 42, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#1c1917';
            ctx.font = '600 18px monospace';
            ctx.fillText(t, bx + 16, by + 27);
            bx += bWidth + 14;
          });

          // Page Number
          ctx.fillStyle = '#a8a29e';
          ctx.font = '600 22px monospace';
          ctx.fillText('0' + (ch.chapterNumber.length ? ch.chapterNumber.slice(-1) : '1'), 80, H - 80);
        } else {
          // RIGHT PAGE: Quantitative Results & 3D Pop-Up Base
          ctx.fillStyle = '#1c1917';
          ctx.font = 'bold 26px monospace';
          ctx.textAlign = 'left';
          ctx.fillText('IMPACT & MEASUREMENT', 80, 120);

          // Big Metric Plaque
          ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
          ctx.strokeStyle = ch.accentColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(80, 160, W - 160, 220, 20);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = ch.accentColor;
          ctx.font = 'bold 78px monospace';
          ctx.fillText(ch.metric, 120, 265);

          ctx.fillStyle = '#44403c';
          ctx.font = '600 24px sans-serif';
          ctx.fillText(ch.metricLabel, 120, 330);

          // Folded paper shadow illustration under pop-up
          ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
          ctx.beginPath();
          ctx.ellipse(W / 2, H * 0.65, 280, 90, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#78716c';
          ctx.font = 'italic 20px "Georgia", serif';
          ctx.textAlign = 'center';
          ctx.fillText('↑ 3D Paper Mechanism Rises Out of Page Spine', W / 2, H * 0.88);

          ctx.fillStyle = '#a8a29e';
          ctx.font = '600 22px monospace';
          ctx.textAlign = 'right';
          ctx.fillText('0' + (parseInt(ch.chapterNumber.slice(-1) || '1') + 1), W - 80, H - 80);
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }, []);

  // Update Page Textures on Spread Change
  const updateSpreadTextures = useCallback((pageIndex: number) => {
    const s = sceneStateRef.current;
    if (pageIndex === 0) {
      // Cover closed
      const coverTex = createPageTexture({ isLeft: false, isCover: true });
      const backCoverTex = createPageTexture({ isLeft: true, isCover: true });
      if (s.rightPageMesh) {
        (s.rightPageMesh.material as THREE.MeshStandardMaterial).map = coverTex;
        (s.rightPageMesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
      }
      if (s.leftPageMesh) {
        (s.leftPageMesh.material as THREE.MeshStandardMaterial).map = backCoverTex;
        (s.leftPageMesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
      }
    } else {
      const ch = chapters[pageIndex - 1];
      const leftTex = createPageTexture({ isLeft: true, chapter: ch });
      const rightTex = createPageTexture({ isLeft: false, chapter: ch });
      if (s.leftPageMesh) {
        (s.leftPageMesh.material as THREE.MeshStandardMaterial).map = leftTex;
        (s.leftPageMesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
      }
      if (s.rightPageMesh) {
        (s.rightPageMesh.material as THREE.MeshStandardMaterial).map = rightTex;
        (s.rightPageMesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
      }
    }
  }, [chapters, createPageTexture]);

  // Main Three.js Scene Setup & Animation Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 6.2, 8.8);
    camera.lookAt(0, -0.4, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Warm Antique Desk Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.35);
    scene.add(ambientLight);

    // Warm Banker's Lamp Key Light
    const lampLight = new THREE.SpotLight(0xffedd5, 3.2, 24, Math.PI * 0.35, 0.45);
    lampLight.position.set(4.5, 9.5, 5.0);
    lampLight.castShadow = true;
    lampLight.shadow.mapSize.width = 1024;
    lampLight.shadow.mapSize.height = 1024;
    scene.add(lampLight);

    // Crimson Silhouette Rim Light
    const rimLight = new THREE.DirectionalLight(0xf43f5e, 1.8);
    rimLight.position.set(-6, 4, -4);
    scene.add(rimLight);

    // Desk Base Surface
    const deskGeo = new THREE.PlaneGeometry(32, 24);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x140f0c,
      roughness: 0.75,
      metalness: 0.05,
    });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.rotation.x = -Math.PI * 0.5;
    desk.position.y = -1.2;
    desk.receiveShadow = true;
    scene.add(desk);

    // Master Book Group
    const bookGroup = new THREE.Group();
    bookGroup.position.set(0, -0.9, 0);
    scene.add(bookGroup);
    sceneStateRef.current.bookGroup = bookGroup;

    // Leather Spine Base
    const spineGeo = new THREE.CylinderGeometry(0.35, 0.35, 6.4, 16);
    spineGeo.rotateX(Math.PI * 0.5);
    const spineMat = new THREE.MeshStandardMaterial({ color: 0x24070a, roughness: 0.5 });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(0, 0.1, 0);
    bookGroup.add(spine);

    // Left Page (stationary / folds as book opens)
    const pageW = 4.4;
    const pageH = 6.2;
    const pageGeo = new THREE.PlaneGeometry(pageW, pageH, 16, 16);
    pageGeo.translate(pageW * 0.5, 0, 0); // hinge along x=0

    const leftPageMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.85,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    const leftPageMesh = new THREE.Mesh(pageGeo, leftPageMat);
    leftPageMesh.rotation.y = Math.PI; // lying on left side
    leftPageMesh.position.set(-0.02, 0.12, 0);
    leftPageMesh.receiveShadow = true;
    bookGroup.add(leftPageMesh);
    sceneStateRef.current.leftPageMesh = leftPageMesh;

    // Right Page (stationary right side)
    const rightPageMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.85,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    const rightPageMesh = new THREE.Mesh(pageGeo, rightPageMat);
    rightPageMesh.rotation.y = 0; // lying on right side
    rightPageMesh.position.set(0.02, 0.12, 0);
    rightPageMesh.receiveShadow = true;
    bookGroup.add(rightPageMesh);
    sceneStateRef.current.rightPageMesh = rightPageMesh;

    // =========================================================================
    // POP-UP PAPER MECHANISM (V-Folds and Architectural Pillars rising from spine)
    // =========================================================================
    const popupGroup = new THREE.Group();
    popupGroup.position.set(0, 0.14, 0);
    bookGroup.add(popupGroup);
    sceneStateRef.current.popupGroup = popupGroup;

    // Central V-Fold Paper Structure
    const vfoldWingGeo = new THREE.PlaneGeometry(1.6, 2.4);
    vfoldWingGeo.translate(0.8, 1.2, 0);

    const vfoldMatLeft = new THREE.MeshStandardMaterial({
      color: 0xfffdfa,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });
    const vfoldWingLeft = new THREE.Mesh(vfoldWingGeo, vfoldMatLeft);
    vfoldWingLeft.rotation.y = Math.PI * 0.65;
    popupGroup.add(vfoldWingLeft);

    const vfoldMatRight = new THREE.MeshStandardMaterial({
      color: 0xfffdfa,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });
    const vfoldWingRight = new THREE.Mesh(vfoldWingGeo, vfoldMatRight);
    vfoldWingRight.rotation.y = -Math.PI * 0.65;
    popupGroup.add(vfoldWingRight);

    // Architectural Data Pillars (3D Bars rising out of the centerfold)
    const pillars: THREE.Mesh[] = [];
    const pillarHeights = [1.2, 1.9, 1.5, 2.3, 1.7];
    const pillarColors = [0xf43f5e, 0x38bdf8, 0x10b981, 0xfbbf24, 0xa855f7];

    pillarHeights.forEach((h, i) => {
      const pGeo = new THREE.BoxGeometry(0.35, h, 0.35);
      pGeo.translate(0, h * 0.5, 0);
      const pMat = new THREE.MeshStandardMaterial({
        color: pillarColors[i % pillarColors.length],
        roughness: 0.45,
        metalness: 0.15,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set((i - 2) * 0.55, 0, 0.8 - Math.abs(i - 2) * 0.2);
      pMesh.castShadow = true;
      popupGroup.add(pMesh);
      pillars.push(pMesh);
    });
    sceneStateRef.current.popupPillars = pillars;

    // Initial page textures
    updateSpreadTextures(0);

    // Pointer Interaction Engine (smooth camera tilt following mouse / touch)
    let targetRotY = 0;
    let targetRotX = 0;
    let curRotY = 0;
    let curRotX = 0;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const rect = container.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = nx * 0.22;
      targetRotX = -ny * 0.14;
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('touchmove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 560;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    // Animation Render Loop
    let animId: number;
    let clock = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.016;

      // Smooth pointer damping
      curRotY += (targetRotY - curRotY) * 0.07;
      curRotX += (targetRotX - curRotX) * 0.07;
      bookGroup.rotation.y = curRotY;
      bookGroup.rotation.x = curRotX;

      // Pop-Up paper kinematic animation
      // When book is open (currentPage > 0), pillars rise and wings open
      const s = sceneStateRef.current;
      const isBookOpen = currentPage > 0;
      const targetPopScale = isBookOpen ? 1.0 : 0.001;

      popupGroup.scale.y += (targetPopScale - popupGroup.scale.y) * 0.09;
      popupGroup.scale.x += (targetPopScale - popupGroup.scale.x) * 0.09;
      popupGroup.scale.z += (targetPopScale - popupGroup.scale.z) * 0.09;

      // Subtle breathing idle movement for paper pillars
      if (isBookOpen && popupGroup.scale.y > 0.8) {
        pillars.forEach((p, idx) => {
          const wave = Math.sin(clock * 2.2 + idx * 0.8) * 0.04;
          p.scale.y = 1.0 + wave;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [currentPage, updateSpreadTextures]);

  // Turn to Next Page
  const handleNextPage = () => {
    if (isAnimating || currentPage >= chapters.length) return;
    setIsAnimating(true);
    playPaperRustle();
    const next = currentPage + 1;
    setCurrentPage(next);
    updateSpreadTextures(next);
    setTimeout(() => {
      setIsAnimating(false);
    }, 450);
  };

  // Turn to Previous Page
  const handlePrevPage = () => {
    if (isAnimating || currentPage <= 0) return;
    setIsAnimating(true);
    playPaperRustle();
    const prev = currentPage - 1;
    setCurrentPage(prev);
    updateSpreadTextures(prev);
    setTimeout(() => {
      setIsAnimating(false);
    }, 450);
  };

  // Jump to specific chapter
  const handleSelectChapter = (idx: number) => {
    if (isAnimating || currentPage === idx + 1) return;
    setIsAnimating(true);
    playPaperRustle();
    setCurrentPage(idx + 1);
    updateSpreadTextures(idx + 1);
    setTimeout(() => {
      setIsAnimating(false);
    }, 450);
  };

  const currentChapter = currentPage > 0 ? chapters[currentPage - 1] : null;

  return (
    <div
      className={`relative w-full rounded-3xl border border-rose-500/20 bg-stone-950/80 shadow-[0_0_50px_rgba(0,0,0,0.85)] overflow-hidden select-none ${className}`}
    >
      {/* Top Header & Interactive Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md z-30 relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center text-white shadow-md">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">
                Interactive 3D Pop-Up Storybook
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                WebGL Paper Physics
              </span>
            </div>
            <p className="text-xs text-stone-400 font-mono">
              {currentPage === 0
                ? 'Cover · Turn page to unfold Data Capstones'
                : `${currentChapter?.chapterNumber} · ${currentChapter?.title}`}
            </p>
          </div>
        </div>

        {/* Action Controls: Sound Toggle & Chapter Select */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs shadow-amber-500/30'
                : 'bg-white/5 text-stone-400 border-white/10 hover:border-white/30'
            }`}
            title={soundEnabled ? 'Paper Sound Active (Click to mute)' : 'Turn on paper-turn rustle sound'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span>Sound ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Sound OFF</span>
              </>
            )}
          </button>

          {/* Page Turn Controls */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 0 || isAnimating}
              className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-stone-300 font-bold">
              {currentPage === 0 ? 'Cover' : `${currentPage} / ${chapters.length}`}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= chapters.length || isAnimating}
              className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D WebGL Canvas Viewport */}
      <div className="relative w-full h-[520px] sm:h-[580px] md:h-[640px] flex items-center justify-center bg-radial from-stone-900/50 via-[#0a0808] to-[#040303] cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Ambient Corner Label */}
        <div className="absolute top-4 left-5 pointer-events-none text-[11px] font-mono text-stone-500/80 tracking-widest uppercase">
          Drag to tilt 3D perspective · Click controls to flip pages
        </div>

        {/* View Case Study Button Overlay for Active Project */}
        {currentChapter?.projectRef && onOpenCaseStudy && (
          <div className="absolute bottom-5 right-5 z-20">
            <button
              onClick={() => onOpenCaseStudy(currentChapter.projectRef!)}
              className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer active:scale-95"
            >
              <span>Explore Case Study</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Chapter Quick Switcher Tabs */}
      <div className="px-5 py-3 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              if (currentPage !== 0) {
                playPaperRustle();
                setCurrentPage(0);
                updateSpreadTextures(0);
              }
            }}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
              currentPage === 0
                ? 'bg-rose-500 text-white font-bold shadow-xs'
                : 'text-stone-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            Cover
          </button>
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => handleSelectChapter(idx)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                currentPage === idx + 1
                  ? 'bg-rose-500 text-white font-bold shadow-xs'
                  : 'text-stone-400 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: ch.accentColor }}
              />
              <span className="hidden sm:inline">{ch.title.split(' ')[0]}</span>
              <span className="sm:hidden">{idx + 1}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>V-Fold & Parallel Fold Kinetic Links</span>
        </div>
      </div>
    </div>
  );
};
