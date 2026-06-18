"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Scène Three.js — entrepôt logistique PR+
 * Un conteneur 40HC + palettes qui orbitent doucement.
 * Thème : blanc / rouge pastel, wireframe + volumes solides légers.
 */
export function Scene3D({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    const W = mount.clientWidth;
    const H = mount.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ── Scene + Camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
    camera.position.set(8, 5, 14);
    camera.lookAt(0, 0, 0);

    // ── Lumières ─────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(10, 16, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 0.1;
    sun.shadow.camera.far = 60;
    sun.shadow.camera.left = -14;
    sun.shadow.camera.right = 14;
    sun.shadow.camera.top = 14;
    sun.shadow.camera.bottom = -14;
    scene.add(sun);

    // Lumière d'accentuation rouge douce
    const fill = new THREE.PointLight(0xe30613, 0.8, 30);
    fill.position.set(-8, 4, 4);
    scene.add(fill);

    // ── Palette couleurs ─────────────────────────────────────────────────
    const RED        = new THREE.Color(0xe30613);
    const RED_LIGHT  = new THREE.Color(0xfee2e2);
    const WHITE      = new THREE.Color(0xffffff);
    const GRAY_LIGHT = new THREE.Color(0xf3f4f6);
    const INK        = new THREE.Color(0x1b2a4a);

    function solidMat(color: THREE.Color, roughness = 0.55, metalness = 0.05) {
      return new THREE.MeshStandardMaterial({ color, roughness, metalness });
    }
    function wireMat(color: THREE.Color, opacity = 0.35) {
      return new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity });
    }

    // ── SOL ───────────────────────────────────────────────────────────────
    const floorGeo = new THREE.PlaneGeometry(28, 28);
    const floorMat = solidMat(GRAY_LIGHT, 0.9, 0);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.6;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grille au sol
    const grid = new THREE.GridHelper(28, 28, 0xe5d5d5, 0xe5d5d5);
    grid.position.y = -2.59;
    (grid.material as THREE.LineBasicMaterial).opacity = 0.5;
    (grid.material as THREE.LineBasicMaterial).transparent = true;
    scene.add(grid);

    // ── Groupe principal (pivot pour rotation) ───────────────────────────
    const pivot = new THREE.Group();
    scene.add(pivot);

    // ── CONTENEUR 40HC ────────────────────────────────────────────────────
    const container = new THREE.Group();
    pivot.add(container);

    // Corps principal
    const bodyGeo  = new THREE.BoxGeometry(9.6, 2.9, 2.4);
    const bodyMesh = new THREE.Mesh(bodyGeo, solidMat(WHITE, 0.6, 0.1));
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    container.add(bodyMesh);

    // Wireframe par-dessus
    const bodyWire = new THREE.Mesh(bodyGeo, wireMat(RED, 0.18));
    container.add(bodyWire);

    // Bande rouge horizontale (décoration)
    const stripe1 = new THREE.Mesh(
      new THREE.BoxGeometry(9.65, 0.18, 2.42),
      solidMat(RED, 0.5, 0.05)
    );
    stripe1.position.y = 0.9;
    stripe1.castShadow = true;
    container.add(stripe1);
    const stripe2 = stripe1.clone();
    stripe2.position.y = -0.9;
    container.add(stripe2);

    // Côtes verticales (nervures du conteneur)
    for (let x = -4.2; x <= 4.2; x += 1.4) {
      const rib = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 2.92, 2.42),
        solidMat(RED_LIGHT, 0.7)
      );
      rib.position.x = x;
      container.add(rib);
    }

    // Portes arrière (deux panneaux)
    const doorMat = solidMat(new THREE.Color(0xf9fafb), 0.5, 0.15);
    [-0.6, 0.6].forEach((dx) => {
      const door = new THREE.Mesh(new THREE.BoxGeometry(1.15, 2.88, 0.05), doorMat);
      door.position.set(4.83, 0, dx);
      door.castShadow = true;
      container.add(door);
      // Poignée
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8),
        solidMat(INK, 0.4, 0.8)
      );
      handle.rotation.x = Math.PI / 2;
      handle.position.set(4.86, 0, dx + (dx > 0 ? -0.3 : 0.3));
      container.add(handle);
    });

    // Cadre de fond
    const backFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 2.92, 2.42),
      solidMat(INK, 0.4, 0.3)
    );
    backFrame.position.x = -4.83;
    container.add(backFrame);

    container.position.set(0, 0.05, 0);

    // ── PALETTES (orbitent autour du conteneur) ───────────────────────────
    const palettes: THREE.Group[] = [];
    const paletteDefs = [
      { angle: 0.6,   dist: 6.5, y: -2.1, scale: 1 },
      { angle: 2.4,   dist: 6,   y: -2.1, scale: 0.9 },
      { angle: 4.0,   dist: 7,   y: -2.1, scale: 1.05 },
      { angle: -1.1,  dist: 6.2, y: -2.1, scale: 0.85 },
    ];

    paletteDefs.forEach((def) => {
      const pal = new THREE.Group();

      // Plateau palette
      const deck = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.12, 0.8),
        solidMat(new THREE.Color(0xd6b896), 0.9)
      );
      deck.castShadow = true;
      pal.add(deck);

      // Pieds
      [[-0.5, 0, -0.3], [-0.5, 0, 0], [-0.5, 0, 0.3],
       [0,    0, -0.3], [0,    0, 0], [0,    0, 0.3],
       [0.5,  0, -0.3], [0.5,  0, 0], [0.5,  0, 0.3]].forEach(([px, , pz]) => {
        const leg = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 0.14, 0.12),
          solidMat(new THREE.Color(0xbfa07a), 0.9)
        );
        leg.position.set(px, -0.13, pz);
        leg.castShadow = true;
        pal.add(leg);
      });

      // Cartons empilés dessus
      const colors = [0xfee2e2, 0xfecaca, 0xfca5a5];
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
          const boxH = 0.22 + Math.random() * 0.08;
          const box = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, boxH, 0.36),
            solidMat(new THREE.Color(colors[(row + col) % 3]), 0.7)
          );
          box.position.set(-0.28 + col * 0.56, 0.06 + boxH / 2, -0.2 + row * 0.4);
          box.castShadow = true;
          pal.add(box);
          // Trait rouge sur le carton
          const label = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.06, 0.01),
            solidMat(RED, 0.3)
          );
          label.position.set(-0.28 + col * 0.56, 0.06 + boxH / 2 + 0.04, -0.2 + row * 0.4 + 0.185);
          pal.add(label);
        }
      }

      pal.position.set(
        Math.cos(def.angle) * def.dist,
        def.y,
        Math.sin(def.angle) * def.dist
      );
      pal.scale.setScalar(def.scale);
      pal.userData.angle   = def.angle;
      pal.userData.dist    = def.dist;
      pal.userData.yBase   = def.y;
      pal.userData.speed   = 0.18 + Math.random() * 0.08;
      palettes.push(pal);
      pivot.add(pal);
    });

    // ── CHARIOT ÉLÉVATEUR (simplifié) ─────────────────────────────────────
    const forklift = new THREE.Group();

    // Corps
    const fBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.7, 1.4),
      solidMat(INK, 0.5, 0.3)
    );
    fBody.castShadow = true;
    forklift.add(fBody);

    // Cabine
    const fCab = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.55, 0.7),
      solidMat(new THREE.Color(0x374151), 0.5, 0.2)
    );
    fCab.position.set(0, 0.62, 0.2);
    fCab.castShadow = true;
    forklift.add(fCab);

    // Mât
    const mast = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 1.6, 0.08),
      solidMat(INK, 0.4, 0.5)
    );
    mast.position.set(0, 0.8, -0.7);
    forklift.add(mast);

    // Fourches
    [-0.2, 0.2].forEach((x) => {
      const fork = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.06, 0.9),
        solidMat(RED, 0.3, 0.6)
      );
      fork.position.set(x, -0.1, -1.1);
      forklift.add(fork);
    });

    // Roues
    [[-0.48, -0.4, 0.45], [0.48, -0.4, 0.45], [-0.48, -0.4, -0.45], [0.48, -0.4, -0.45]].forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.12, 12),
        solidMat(new THREE.Color(0x1f2937), 0.9)
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      wheel.castShadow = true;
      forklift.add(wheel);
    });

    forklift.position.set(-3.5, -2.26, 4.5);
    forklift.rotation.y = -0.4;
    pivot.add(forklift);

    // ── PARTICULES FLOTTANTES (poussières lumineuses) ─────────────────────
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 6 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: RED,
      size: 0.06,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Mouse parallax ────────────────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      mouseY = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────────────────
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotation lente du groupe principal
      pivot.rotation.y = t * 0.12;

      // Palettes : légère oscillation verticale
      palettes.forEach((pal) => {
        pal.position.y = pal.userData.yBase + Math.sin(t * pal.userData.speed * 2 + pal.userData.angle) * 0.12;
      });

      // Chariot : va-et-vient discret
      forklift.position.x = -3.5 + Math.sin(t * 0.35) * 1.2;

      // Conteneur : portes légèrement animées (les rib scintillent via fill light)
      fill.position.x = -8 + Math.sin(t * 0.4) * 4;
      fill.position.z = 4 + Math.cos(t * 0.3) * 3;

      // Particules flottantes
      particles.rotation.y = t * 0.015;

      // Parallax caméra
      camera.position.x += (mouseX * 1.5 - camera.position.x + 8) * 0.025;
      camera.position.y += (-mouseY * 1.0 - camera.position.y + 5) * 0.025;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
