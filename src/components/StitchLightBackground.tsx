import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const StitchLightBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    // Camera with optimized FOV: 52 deg portrait studio view
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1000);
    camera.position.set(0, 0, 85);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    // Studio Ambient & Directional Lighting for translucent crystal refraction
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLightRose = new THREE.DirectionalLight(0xf43f5e, 2.4);
    dirLightRose.position.set(40, 50, 45);
    scene.add(dirLightRose);

    const dirLightCyan = new THREE.DirectionalLight(0x06b6d4, 2.2);
    dirLightCyan.position.set(-45, -30, 40);
    scene.add(dirLightCyan);

    const dirLightAmber = new THREE.DirectionalLight(0xf59e0b, 1.9);
    dirLightAmber.position.set(10, -45, 30);
    scene.add(dirLightAmber);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // =========================================================================
    // 10 DISTINCT GEOMETRIC OBJECTS (MATCHING EXACT USER SCREENSHOT)
    // 1. Cyan truncated hexagonal cone/prism
    // 2. Magenta/rose faceted icosahedron
    // 3. Teal 12-sided dodecahedron
    // 4. Emerald green hexagonal cylinder
    // 5. Red sharp tetrahedron
    // 6. Purple 4-sided pyramid
    // 7. Amber-gold cube
    // 8. Sky-blue faceted icosahedron
    // 9. Warm golden dodecahedron
    // 10. Crimson red octahedron
    // =========================================================================
    const shapeConfigs = [
      {
        // 1. Cyan truncated cone / hexagonal prism
        geo: new THREE.CylinderGeometry(1.8, 3.4, 4.8, 6),
        color: 0x00b4d8,
        wireColor: 0x0e7490,
      },
      {
        // 2. Rose / magenta faceted icosahedron
        geo: new THREE.IcosahedronGeometry(3.6, 0),
        color: 0xf43f5e,
        wireColor: 0xbe123c,
      },
      {
        // 3. Teal dodecahedron
        geo: new THREE.DodecahedronGeometry(3.5, 0),
        color: 0x14b8a6,
        wireColor: 0x0f766e,
      },
      {
        // 4. Emerald green hexagonal cylinder
        geo: new THREE.CylinderGeometry(2.4, 2.4, 4.6, 6),
        color: 0x10b981,
        wireColor: 0x047857,
      },
      {
        // 5. Red tetrahedron
        geo: new THREE.TetrahedronGeometry(4.2, 0),
        color: 0xef4444,
        wireColor: 0xb91c1c,
      },
      {
        // 6. Purple 4-sided pyramid
        geo: new THREE.ConeGeometry(3.2, 4.8, 4),
        color: 0x8b5cf6,
        wireColor: 0x6d28d9,
      },
      {
        // 7. Amber-gold cube
        geo: new THREE.BoxGeometry(3.8, 3.8, 3.8),
        color: 0xf59e0b,
        wireColor: 0xb45309,
      },
      {
        // 8. Sky-blue faceted icosahedron
        geo: new THREE.IcosahedronGeometry(3.4, 0),
        color: 0x38bdf8,
        wireColor: 0x0369a1,
      },
      {
        // 9. Warm amber dodecahedron
        geo: new THREE.DodecahedronGeometry(3.3, 0),
        color: 0xd97706,
        wireColor: 0x92400e,
      },
      {
        // 10. Crimson red octahedron
        geo: new THREE.OctahedronGeometry(3.8, 0),
        color: 0xbe123c,
        wireColor: 0x881337,
      },
      {
        // 11. Extra Cyan crystal variant
        geo: new THREE.OctahedronGeometry(3.5, 0),
        color: 0x06b6d4,
        wireColor: 0x0e7490,
      },
      {
        // 12. Extra Violet crystal variant
        geo: new THREE.DodecahedronGeometry(3.2, 0),
        color: 0xa855f7,
        wireColor: 0x7e22ce,
      },
    ];

    // =========================================================================
    // RESPONSIVE DISPERSED ANCHOR GRID
    // Separate coordinates across the entire viewport - prevents horizontal clumping
    // =========================================================================
    const normalizedAnchors = [
      // Top row (High corners & mid)
      { nx: -0.78, ny: 0.78, z: -8 },
      { nx: -0.32, ny: 0.86, z: 5 },
      { nx: 0.28, ny: 0.82, z: -6 },
      { nx: 0.78, ny: 0.80, z: 4 },

      // Mid-high row (Flanks)
      { nx: -0.72, ny: 0.38, z: 6 },
      { nx: 0.74, ny: 0.42, z: -8 },

      // Center flanks (Leaving center open for clean UI reading)
      { nx: -0.84, ny: -0.04, z: -4 },
      { nx: 0.82, ny: -0.06, z: 8 },

      // Mid-low row (Flanks)
      { nx: -0.70, ny: -0.46, z: 6 },
      { nx: 0.72, ny: -0.48, z: -6 },

      // Bottom row (Low corners & mid)
      { nx: -0.76, ny: -0.82, z: -4 },
      { nx: -0.22, ny: -0.88, z: 6 },
      { nx: 0.32, ny: -0.85, z: -6 },
      { nx: 0.78, ny: -0.80, z: 4 },
    ];

    const crystals: THREE.Mesh[] = [];

    const computeWorldPosition = (nx: number, ny: number, z: number, w: number, h: number) => {
      const aspect = w / h;
      // On narrow mobile screen, scale X within visible frustum (-20 to +20)
      // On wide desktop screen, scale X out to (-60 to +60)
      const xSpread = aspect < 1 ? Math.max(16, aspect * 38) : Math.min(62, aspect * 34);
      const ySpread = aspect < 1 ? 40 : 34;

      return {
        x: nx * xSpread,
        y: ny * ySpread,
        z: z,
      };
    };

    shapeConfigs.forEach((cfg, i) => {
      const anchor = normalizedAnchors[i % normalizedAnchors.length];
      const pos = computeWorldPosition(anchor.nx, anchor.ny, anchor.z, width, height);

      // Translucent physical jewel facet material
      const mat = new THREE.MeshPhysicalMaterial({
        color: cfg.color,
        roughness: 0.08,
        transmission: 0.82,
        ior: 1.55,
        thickness: 4.5,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.88,
      });

      const mesh = new THREE.Mesh(cfg.geo, mat);
      mesh.position.set(pos.x, pos.y, pos.z);

      // Crisp facet wireframe outline (matching screenshot facet lines)
      const wireOutline = new THREE.LineSegments(
        new THREE.WireframeGeometry(cfg.geo),
        new THREE.LineBasicMaterial({
          color: cfg.wireColor,
          transparent: true,
          opacity: 0.45,
        })
      );
      mesh.add(wireOutline);

      // Independent slow-motion floating kinematics
      mesh.userData = {
        anchorNx: anchor.nx,
        anchorNy: anchor.ny,
        anchorZ: anchor.z,
        baseX: pos.x,
        baseY: pos.y,
        baseZ: pos.z,
        driftSpeedX: 0.22 + (i % 4) * 0.06,
        driftSpeedY: 0.28 + (i % 5) * 0.05,
        driftSpeedZ: 0.18 + (i % 3) * 0.04,
        amplitudeX: 2.8 + (i % 3) * 0.8,
        amplitudeY: 3.2 + (i % 4) * 0.9,
        amplitudeZ: 2.0 + (i % 2) * 0.6,
        phaseX: (i * Math.PI) / 4,
        phaseY: (i * Math.PI) / 3,
        phaseZ: (i * Math.PI) / 5,
        rotSpeedX: 0.0032 + (i % 3) * 0.0012,
        rotSpeedY: 0.0038 + (i % 4) * 0.0014,
        rotSpeedZ: 0.0026 + (i % 2) * 0.0010,
      };

      crystals.push(mesh);
      masterGroup.add(mesh);
    });

    // Pointer Parallax
    let pointerX = 0, pointerY = 0;
    let targetParallaxX = 0, targetParallaxY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const px = (e.clientX / window.innerWidth) * 2 - 1;
      const py = -(e.clientY / window.innerHeight) * 2 + 1;
      targetParallaxX = px * 3.2;
      targetParallaxY = py * 2.2;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      // Re-calculate dispersed base positions for new screen dimensions
      for (let i = 0; i < crystals.length; i++) {
        const c = crystals[i];
        const ud = c.userData;
        const newPos = computeWorldPosition(ud.anchorNx, ud.anchorNy, ud.anchorZ, width, height);
        ud.baseX = newPos.x;
        ud.baseY = newPos.y;
        ud.baseZ = newPos.z;
      }
    };

    window.addEventListener('resize', onResize);

    let clock = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.010; // Silky slow-motion flow

      // Smooth parallax damping
      pointerX += (targetParallaxX - pointerX) * 0.04;
      pointerY += (targetParallaxY - pointerY) * 0.04;

      masterGroup.position.x = pointerX;
      masterGroup.position.y = pointerY;

      // Update each crystal's independent slow-motion drift
      for (let i = 0; i < crystals.length; i++) {
        const c = crystals[i];
        const ud = c.userData;

        // Gentle sinusoidal floating in 3D space
        c.position.x = ud.baseX + Math.sin(clock * ud.driftSpeedX + ud.phaseX) * ud.amplitudeX;
        c.position.y = ud.baseY + Math.cos(clock * ud.driftSpeedY + ud.phaseY) * ud.amplitudeY;
        c.position.z = ud.baseZ + Math.sin(clock * ud.driftSpeedZ + ud.phaseZ) * ud.amplitudeZ;

        // Elegant tumbling rotations revealing faceted light reflections
        c.rotation.x += ud.rotSpeedX;
        c.rotation.y += ud.rotSpeedY;
        c.rotation.z += ud.rotSpeedZ;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ overflow: 'hidden' }}
    />
  );
};
