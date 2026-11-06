import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Skill } from '../types';
import { Compass, Orbit } from 'lucide-react';

interface SkillsSolarSystem3DProps {
  skills: Skill[];
  onSelectSkill?: (skill: Skill) => void;
}

interface PlanetData {
  skill: Skill;
  name: string;
  iconType: string;
  radiusX: number; // Elliptical route X
  radiusZ: number; // Elliptical route Z
  tiltX: number;   // Unique 3D orbital inclination pitch (rad)
  tiltZ: number;   // Unique 3D orbital inclination roll (rad)
  size: number;    // Planet sphere size
  color: number;   // Planet color hex
  emissive: number;
  speed: number;   // Orbital revolution speed
  hasRings?: boolean;
  hasMoon?: boolean;
  simpleExplanation: string;
}

// Draw crisp, authentic vector-style logos onto offscreen 2D canvas
function drawLogoOnCanvas(ctx: CanvasRenderingContext2D, type: string, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);

  if (type === 'powerbi') {
    // 3 Gold / Yellow Power BI Bars (Ascending)
    const barW = size * 0.22;
    const gap = size * 0.08;
    // Bar 1 (Left, Short)
    ctx.fillStyle = '#E6AD10';
    ctx.beginPath();
    ctx.roundRect(-size * 0.45, -size * 0.1, barW, size * 0.55, 3);
    ctx.fill();
    // Bar 2 (Middle)
    ctx.fillStyle = '#F2C811';
    ctx.beginPath();
    ctx.roundRect(-size * 0.45 + barW + gap, -size * 0.3, barW, size * 0.75, 3);
    ctx.fill();
    // Bar 3 (Right, Tall)
    ctx.fillStyle = '#FFE066';
    ctx.beginPath();
    ctx.roundRect(-size * 0.45 + (barW + gap) * 2, -size * 0.5, barW, size * 0.95, 3);
    ctx.fill();
  } else if (type === 'excel') {
    // Microsoft Excel Green Grid & 'X'
    ctx.fillStyle = '#107C41';
    ctx.beginPath();
    ctx.roundRect(-size * 0.45, -size * 0.45, size * 0.9, size * 0.9, 6);
    ctx.fill();
    // Bold 'X'
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.65)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('X', 0, 1);
  } else if (type === 'mysql') {
    // MySQL Marine Dolphin & Database
    ctx.fillStyle = '#00758F';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
    // Stylized Dolphin accent
    ctx.fillStyle = '#F29111';
    ctx.beginPath();
    ctx.arc(size * 0.15, -size * 0.15, size * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.34)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SQL', 0, size * 0.05);
  } else if (type === 'python') {
    // Python Dual Snake
    // Top Blue Snake
    ctx.fillStyle = '#3776AB';
    ctx.beginPath();
    ctx.arc(-size * 0.1, -size * 0.2, size * 0.24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-size * 0.1, -size * 0.32, size * 0.35, size * 0.24);
    // Top Snake Eye
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-size * 0.12, -size * 0.25, size * 0.06, 0, Math.PI * 2);
    ctx.fill();
    // Bottom Yellow Snake
    ctx.fillStyle = '#FFD43B';
    ctx.beginPath();
    ctx.arc(size * 0.1, size * 0.2, size * 0.24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-size * 0.25, size * 0.08, size * 0.35, size * 0.24);
    // Bottom Snake Eye
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(size * 0.12, size * 0.25, size * 0.06, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'tableau') {
    // Tableau Multi-Color Plus Pattern
    const crossW = size * 0.22;
    // Center orange
    ctx.fillStyle = '#E97627';
    ctx.fillRect(-crossW / 2, -crossW / 2, crossW, crossW);
    // Top dark blue
    ctx.fillStyle = '#4E79A7';
    ctx.fillRect(-crossW / 2, -size * 0.45, crossW, size * 0.35);
    // Bottom red
    ctx.fillStyle = '#E15759';
    ctx.fillRect(-crossW / 2, size * 0.1, crossW, size * 0.35);
    // Left blue
    ctx.fillStyle = '#76B7B2';
    ctx.fillRect(-size * 0.45, -crossW / 2, size * 0.35, crossW);
    // Right green
    ctx.fillStyle = '#59A14F';
    ctx.fillRect(size * 0.1, -crossW / 2, size * 0.35, crossW);
  } else if (type === 'etl') {
    // Data Cleaning Funnel & Pipeline
    ctx.fillStyle = '#8B5CF6';
    ctx.beginPath();
    ctx.moveTo(-size * 0.4, -size * 0.35);
    ctx.lineTo(size * 0.4, -size * 0.35);
    ctx.lineTo(size * 0.12, size * 0.1);
    ctx.lineTo(size * 0.12, size * 0.4);
    ctx.lineTo(-size * 0.12, size * 0.3);
    ctx.lineTo(-size * 0.12, size * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#C4B5FD';
    ctx.fillRect(-size * 0.3, -size * 0.42, size * 0.6, size * 0.08);
  } else if (type === 'react' || type === 'web') {
    // React Atomic Ellipses
    ctx.strokeStyle = '#61DAFB';
    ctx.lineWidth = size * 0.08;
    // Central Nucleus
    ctx.fillStyle = '#61DAFB';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    // Orbit 1
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.42, size * 0.16, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Orbit 2
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.42, size * 0.16, Math.PI / 3, 0, Math.PI * 2);
    ctx.stroke();
    // Orbit 3
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.42, size * 0.16, -Math.PI / 3, 0, Math.PI * 2);
    ctx.stroke();
  } else if (type === 'supabase') {
    // Supabase Lightning Bolt
    ctx.fillStyle = '#3ECF8E';
    ctx.beginPath();
    ctx.moveTo(size * 0.15, -size * 0.45);
    ctx.lineTo(-size * 0.35, size * 0.05);
    ctx.lineTo(-size * 0.05, size * 0.05);
    ctx.lineTo(-size * 0.15, size * 0.45);
    ctx.lineTo(size * 0.35, -size * 0.05);
    ctx.lineTo(size * 0.05, -size * 0.05);
    ctx.closePath();
    ctx.fill();
  } else {
    // Generic Diamond / Circle
    ctx.fillStyle = '#F43F5E';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.38, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Generate high-resolution camera-facing billboard sprite with brand logo & title
function createPlanetBadgeSprite(name: string, colorHex: number, iconType: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 360;
  canvas.height = 130;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 360, 130);

  // Background glass pill badge
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 130);
  bgGrad.addColorStop(0, 'rgba(10, 10, 16, 0.92)');
  bgGrad.addColorStop(1, 'rgba(18, 18, 26, 0.96)');
  ctx.fillStyle = bgGrad;

  ctx.beginPath();
  ctx.roundRect(10, 12, 340, 106, 22);
  ctx.fill();

  // Glowing brand border
  const brandHex = '#' + colorHex.toString(16).padStart(6, '0');
  ctx.strokeStyle = brandHex;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw authentic tool logo icon
  drawLogoOnCanvas(ctx, iconType, 56, 65, 50);

  // Divider vertical bar
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(102, 30);
  ctx.lineTo(102, 100);
  ctx.stroke();

  // Skill Name text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = name.length > 15 ? 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'bold 23px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const displayTitle = name.length > 19 ? name.substring(0, 18) + '…' : name;
  ctx.fillText(displayTitle, 116, 52);

  // Tool / Tech badge subtitle
  ctx.fillStyle = brandHex;
  ctx.font = 'bold 13px monospace';
  ctx.fillText('CORE SKILL', 116, 80);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(2.85, 1.05, 1);
  return sprite;
}

export const SkillsSolarSystem3D: React.FC<SkillsSolarSystem3DProps> = ({ skills, onSelectSkill }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Map skills to solar system planet properties with unique 3D tilted routes, official tool logos & clear explanations
  const planetsData: PlanetData[] = useMemo(() => {
    // 8 distinct 3D tilted orbits (different inclination angles, routes & speeds)
    const routesConfig = [
      {
        iconType: 'powerbi',
        matchKeywords: ['power bi', 'powerbi'],
        radiusX: 3.5, radiusZ: 3.2,
        tiltX: 0.22, tiltZ: -0.15,
        color: 0xf2c811, emissive: 0xd19000, size: 0.52, speed: 0.42,
        simple: 'Building interactive executive dashboards, DAX calculated metrics, and visual KPI tracking.',
      },
      {
        iconType: 'excel',
        matchKeywords: ['excel', 'spreadsheet'],
        radiusX: 5.0, radiusZ: 4.5,
        tiltX: -0.32, tiltZ: 0.26,
        color: 0x10b981, emissive: 0x059669, size: 0.48, speed: 0.36,
        simple: 'Analyzing spreadsheets with Pivot Tables, XLOOKUP formulas, conditional formatting, and charts.',
      },
      {
        iconType: 'mysql',
        matchKeywords: ['mysql', 'sql', 'database'],
        radiusX: 6.5, radiusZ: 5.9,
        tiltX: 0.40, tiltZ: -0.22,
        color: 0x00758f, emissive: 0x004f60, size: 0.58, speed: 0.31, hasRings: true,
        simple: 'Writing relational database queries, table joins, aggregations, and grouped rollups in MySQL.',
      },
      {
        iconType: 'python',
        matchKeywords: ['python', 'pandas', 'numpy'],
        radiusX: 8.0, radiusZ: 7.3,
        tiltX: -0.25, tiltZ: -0.35,
        color: 0x38bdf8, emissive: 0x0284c7, size: 0.48, speed: 0.26, hasMoon: true,
        simple: 'Automating data processing, exploratory analysis (EDA), and data cleaning with Pandas & NumPy.',
      },
      {
        iconType: 'tableau',
        matchKeywords: ['tableau', 'data visualization'],
        radiusX: 9.5, radiusZ: 8.7,
        tiltX: 0.35, tiltZ: 0.30,
        color: 0xf43f5e, emissive: 0xe11d48, size: 0.46, speed: 0.21,
        simple: 'Creating visual storyboards, geographical maps, scatter plots, and customer retention charts.',
      },
      {
        iconType: 'etl',
        matchKeywords: ['etl', 'cleaning', 'preprocessing'],
        radiusX: 11.0, radiusZ: 10.0,
        tiltX: -0.45, tiltZ: 0.18,
        color: 0xa855f7, emissive: 0x7e22ce, size: 0.44, speed: 0.17,
        simple: 'Transforming messy spreadsheets, removing null duplicates, and validating data pipelines.',
      },
      {
        iconType: 'react',
        matchKeywords: ['web', 'react', 'javascript', 'html'],
        radiusX: 12.5, radiusZ: 11.4,
        tiltX: 0.18, tiltZ: -0.42,
        color: 0x06b6d4, emissive: 0x0891b2, size: 0.44, speed: 0.13,
        simple: 'Building modern responsive web interfaces and dynamic portals using React and JavaScript.',
      },
      {
        iconType: 'supabase',
        matchKeywords: ['supabase', 'cloud', 'firebase'],
        radiusX: 14.0, radiusZ: 12.8,
        tiltX: -0.28, tiltZ: -0.25,
        color: 0x10b981, emissive: 0x059669, size: 0.42, speed: 0.09,
        simple: 'Cloud database authentication, PostgreSQL tables, and real-time listeners in Supabase.',
      },
    ];

    return skills.slice(0, 8).map((skill, i) => {
      const lower = skill.name.toLowerCase();
      // Find matching config or fall back to index
      const found = routesConfig.find(rc => rc.matchKeywords.some(k => lower.includes(k))) || routesConfig[i % routesConfig.length];
      return {
        skill,
        name: skill.name,
        iconType: found.iconType,
        radiusX: routesConfig[i % routesConfig.length].radiusX,
        radiusZ: routesConfig[i % routesConfig.length].radiusZ,
        tiltX: routesConfig[i % routesConfig.length].tiltX,
        tiltZ: routesConfig[i % routesConfig.length].tiltZ,
        size: routesConfig[i % routesConfig.length].size,
        color: found.color,
        emissive: found.emissive,
        speed: routesConfig[i % routesConfig.length].speed,
        hasRings: routesConfig[i % routesConfig.length].hasRings,
        hasMoon: routesConfig[i % routesConfig.length].hasMoon,
        simpleExplanation: found.simple,
      };
    });
  }, [skills]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 540;

    const scene = new THREE.Scene();

    // Perspective camera positioned to view the multi-dimensional celestial orbits
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 16, 18);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let animId: number;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.domElement.style.touchAction = 'pan-y';
      container.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = false; // Never trap mouse wheel or touch scroll
      controls.maxDistance = 32;
      controls.minDistance = 6;
      controls.autoRotate = true; // Auto-rotate the galaxy in continuous smooth motion!
      controls.autoRotateSpeed = 0.75; // Cinematic, slow majestic rotation pace

      // --- LIGHTING ---
      // Radiant central Sun light
      const sunLight = new THREE.PointLight(0xffedd5, 3.8, 35, 0.6);
      sunLight.position.set(0, 0, 0);
      scene.add(sunLight);

      const ambientLight = new THREE.AmbientLight(0x221c33, 1.4);
      scene.add(ambientLight);

      // --- CENTRAL GLOWING SUN (Core Developer Knowledge) ---
      const sunGeom = new THREE.SphereGeometry(1.65, 32, 32);
      const sunMat = new THREE.MeshStandardMaterial({
        color: 0xffedd5,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.8,
        roughness: 0.2,
      });
      const sunMesh = new THREE.Mesh(sunGeom, sunMat);
      scene.add(sunMesh);

      // Glowing Corona Halo
      const coronaGeom = new THREE.SphereGeometry(1.95, 32, 32);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.25,
        side: THREE.BackSide,
      });
      const coronaMesh = new THREE.Mesh(coronaGeom, coronaMat);
      scene.add(coronaMesh);

      // --- PLANETS ON DIFFERENT TILTED 3D ROUTES WITH OFFICIAL LOGOS ---
      const planetItems: {
        orbitGroup: THREE.Group;
        planetAnchor: THREE.Group;
        planetMesh: THREE.Mesh;
        moonMesh?: THREE.Mesh;
        radiusX: number;
        radiusZ: number;
        speed: number;
        angle: number;
        spinSpeed: number;
        data: PlanetData;
      }[] = [];

      planetsData.forEach((p, idx) => {
        // Dedicated Orbit Group with unique 3D Inclination Pitch & Roll
        const orbitGroup = new THREE.Group();
        orbitGroup.rotation.x = p.tiltX;
        orbitGroup.rotation.z = p.tiltZ;
        scene.add(orbitGroup);

        // 1. Unique Elliptical Orbit Track Line in Space
        const curve = new THREE.EllipseCurve(0, 0, p.radiusX, p.radiusZ, 0, 2 * Math.PI, false, 0);
        const curvePoints = curve.getPoints(80);
        const orbitGeom = new THREE.BufferGeometry().setFromPoints(
          curvePoints.map(pt => new THREE.Vector3(pt.x, 0, pt.y))
        );
        const orbitMat = new THREE.LineBasicMaterial({
          color: p.color,
          transparent: true,
          opacity: 0.35,
        });
        const orbitLine = new THREE.Line(orbitGeom, orbitMat);
        orbitGroup.add(orbitLine);

        // 2. Planet Anchor Group (Carries the planet, badge, and moon along its orbital route around the Sun)
        const planetAnchor = new THREE.Group();
        const startAngle = (idx * Math.PI * 2) / planetsData.length;
        planetAnchor.position.set(
          Math.cos(startAngle) * p.radiusX,
          0,
          Math.sin(startAngle) * p.radiusZ
        );
        orbitGroup.add(planetAnchor);

        // Planet Sphere with natural axial tilt (like Earth's 23.5° / 0.41 rad)
        const planetGeom = new THREE.SphereGeometry(p.size, 32, 32);
        const planetMat = new THREE.MeshStandardMaterial({
          color: p.color,
          emissive: p.emissive,
          emissiveIntensity: 0.45,
          roughness: 0.35,
          metalness: 0.2,
        });
        const planetMesh = new THREE.Mesh(planetGeom, planetMat);
        planetMesh.rotation.z = 0.41; // Natural Earth-like axial inclination tilt
        planetAnchor.add(planetMesh);

        // 3. OFFICIAL TOOL LOGO BILLBOARD SPRITE HOVERING ABOVE PLANET (Faces camera cleanly)
        const badgeSprite = createPlanetBadgeSprite(p.name, p.color, p.iconType);
        badgeSprite.position.set(0, p.size + 0.95, 0);
        planetAnchor.add(badgeSprite);

        // Planetary Saturn-like Rings (e.g. for SQL/MySQL)
        if (p.hasRings) {
          const ringGeom = new THREE.RingGeometry(p.size * 1.35, p.size * 2.2, 32);
          const ringMat = new THREE.MeshBasicMaterial({
            color: p.color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.55,
          });
          const ring = new THREE.Mesh(ringGeom, ringMat);
          ring.rotation.x = Math.PI / 2.3;
          planetMesh.add(ring);
        }

        // Mini Orbiting Moon (e.g. for Python)
        let moonMesh: THREE.Mesh | undefined;
        if (p.hasMoon) {
          const moonGeom = new THREE.SphereGeometry(p.size * 0.3, 12, 12);
          const moonMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5 });
          moonMesh = new THREE.Mesh(moonGeom, moonMat);
          moonMesh.position.set(p.size * 1.8, 0.1, 0);
          planetAnchor.add(moonMesh);
        }

        planetItems.push({
          orbitGroup,
          planetAnchor,
          planetMesh,
          moonMesh,
          radiusX: p.radiusX,
          radiusZ: p.radiusZ,
          speed: p.speed,
          angle: startAngle,
          spinSpeed: 0.9 + (idx % 4) * 0.3, // Authentic self-spin on own axis (like Earth's 24-hr day)
          data: p,
        });
      });

      // Space Starfield Dust
      const starsCount = 200;
      const starsGeom = new THREE.BufferGeometry();
      const starsPos = new Float32Array(starsCount * 3);
      for (let i = 0; i < starsCount; i++) {
        starsPos[i * 3] = (Math.random() - 0.5) * 50;
        starsPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
        starsPos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      }
      starsGeom.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
      const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.65 });
      const starField = new THREE.Points(starsGeom, starsMat);
      scene.add(starField);

      // --- Interactive Click Detection via Raycaster ---
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const handleCanvasClick = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const meshes = planetItems.map(p => p.planetMesh);
        const intersects = raycaster.intersectObjects(meshes, true);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const found = planetItems.find(p => p.planetMesh === hit || p.planetMesh.children.includes(hit as any));
          if (found) {
            if (onSelectSkill) onSelectSkill(found.data.skill);
          }
        }
      };

      renderer.domElement.addEventListener('click', handleCanvasClick);

      // --- Animation Loop ---
      let clock = new THREE.Clock();

      const animate = () => {
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Sun Corona Breathing
        const sunPulse = 1.0 + Math.sin(time * 2.2) * 0.06;
        coronaMesh.scale.set(sunPulse, sunPulse, sunPulse);
        sunMesh.rotation.y += 0.004;

        // CONTINUOUS CELESTIAL ORBIT + AXIAL ROTATION
        planetItems.forEach(item => {
          // 1. Natural slow revolution around the SUN (Orbital Year cycle)
          item.angle += item.speed * 0.28 * delta;
          item.planetAnchor.position.x = Math.cos(item.angle) * item.radiusX;
          item.planetAnchor.position.z = Math.sin(item.angle) * item.radiusZ;

          // 2. Genuine natural rotation on its OWN vertical axis (like Earth's 24-hr day-night spin)
          item.planetMesh.rotation.y += item.spinSpeed * delta;

          // 3. Moon revolution around planet
          if (item.moonMesh) {
            item.moonMesh.position.x = Math.cos(time * 2.5) * (item.data.size * 1.8);
            item.moonMesh.position.z = Math.sin(time * 2.5) * (item.data.size * 1.8);
          }
        });

        controls.update();
        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        renderer.domElement.removeEventListener('click', handleCanvasClick);
      };
    } catch (e) {
      console.warn('SkillsSolarSystem3D error notice:', e);
    }

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 540;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [planetsData, onSelectSkill]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-rose-500/20 bg-stone-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.7)] select-none">
      
      {/* 3D Multi-Route Solar System Canvas with Tool Logos on Planets */}
      <div
        ref={mountRef}
        className="w-full h-[520px] sm:h-[600px] md:h-[660px] cursor-grab active:cursor-grabbing"
      />

      {/* Top Floating Badge & Controls */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-6 flex items-center justify-between pointer-events-none">
        
        {/* Dynamic Status Indicator */}
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 border border-stone-800 backdrop-blur-md text-xs font-mono shadow-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-stone-200">
            🌌 Orbiting Skills Galaxy · Continuous 3D Auto-Rotation
          </span>
        </div>

        {/* Orbit Drag Tip */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/80 border border-stone-800/80 text-[11px] font-mono text-stone-300 backdrop-blur-md">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Click & Drag to Orbit 360° View</span>
        </div>
      </div>
    </div>
  );
};
