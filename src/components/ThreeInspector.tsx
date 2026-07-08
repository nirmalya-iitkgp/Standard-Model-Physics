/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Particle } from '../types';

interface ThreeInspectorProps {
  particle: Particle;
  isAntimatter: boolean;
  higgsViscosity?: number; // 0 to 1, affects rotation/pulsing in hadron workspace or grid
}

export default function ThreeInspector({ particle, isAntimatter, higgsViscosity = 0.2 }: ThreeInspectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Get current container size
    let width = container.clientWidth;
    let height = container.clientHeight || 300;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x111625, 1.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0a101f, 1.5);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // 5. Determine Visual Colors based on standard particle and antimatter toggle
    let baseColorHex = 0x8b5cf6; // Default quark violet
    if (particle.type === 'quark') {
      baseColorHex = isAntimatter ? 0xec4899 : 0x8b5cf6; // Pink vs Violet
    } else if (particle.type === 'lepton') {
      baseColorHex = isAntimatter ? 0xf97316 : 0x06b6d4; // Orange vs Electric Cyan
    } else if (particle.type === 'boson') {
      baseColorHex = isAntimatter ? 0x10b981 : 0xf97316; // Green vs Orange
    } else if (particle.type === 'higgs') {
      baseColorHex = isAntimatter ? 0x3b82f6 : 0xeab308; // Blue vs Golden Glow
    }

    // 6. Parent Object Group (to hold all components for the particle)
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    // --- Core Sphere ---
    // Mass determines visual size slightly, but keeps within logical bounds
    // Map mass string (e.g. "173 GeV/c²" vs "2.2 MeV") to size
    let sizeScale = 1.0;
    if (particle.mass.includes('GeV')) {
      const val = parseFloat(particle.mass);
      sizeScale = val > 100 ? 1.4 : val > 10 ? 1.25 : 1.15;
    } else if (particle.mass === '0') {
      sizeScale = 0.85;
    } else {
      sizeScale = 0.95;
    }

    // Adjust sizeScale slightly for Higgs field strength (viscosity drag)
    const effectiveSize = sizeScale * (1 + higgsViscosity * 0.15);

    const sphereGeom = new THREE.SphereGeometry(effectiveSize, 32, 32);
    
    // Custom material with glowing properties
    const coreMat = new THREE.MeshStandardMaterial({
      color: baseColorHex,
      roughness: 0.1,
      metalness: 0.8,
      emissive: baseColorHex,
      emissiveIntensity: 0.4,
    });
    const coreMesh = new THREE.Mesh(sphereGeom, coreMat);
    particleGroup.add(coreMesh);

    // --- Wireframe shell (Quantum Cloud / Probability Field) ---
    const cloudGeom = new THREE.SphereGeometry(effectiveSize * 1.35, 16, 16);
    const cloudMat = new THREE.MeshBasicMaterial({
      color: baseColorHex,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
    particleGroup.add(cloudMesh);

    // --- Orbiting Quantum Rings ---
    // Number of rings depends on particle spin or charge
    const rings: THREE.Line[] = [];
    const ringCount = particle.spin === '1' ? 3 : particle.spin === '1/2' ? 2 : 1;

    for (let i = 0; i < ringCount; i++) {
      const radius = effectiveSize * (1.5 + i * 0.35);
      const ringGeom = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 64;

      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
      }
      ringGeom.setFromPoints(points);

      const ringMat = new THREE.LineBasicMaterial({
        color: baseColorHex,
        transparent: true,
        opacity: 0.4 - i * 0.1,
      });

      const ring = new THREE.Line(ringGeom, ringMat);
      
      // Randomize ring rotations
      if (i === 0) ring.rotation.x = Math.PI / 4;
      if (i === 1) ring.rotation.z = Math.PI / 4;
      if (i === 2) {
        ring.rotation.x = -Math.PI / 6;
        ring.rotation.y = Math.PI / 4;
      }
      particleGroup.add(ring);
      rings.push(ring);
    }

    // --- Charge Particles (Orbiting Satellites) ---
    // If charge is non-zero, create little orbiting energy spheres
    const chargeSatellites: THREE.Mesh[] = [];
    const absCharge = Math.abs(particle.charge);
    const satCount = absCharge > 0 ? (absCharge === 1 ? 3 : absCharge === 2/3 ? 2 : 1) : 0;

    if (satCount > 0) {
      const satGeom = new THREE.SphereGeometry(0.08, 8, 8);
      const satMat = new THREE.MeshBasicMaterial({
        color: particle.charge > 0 ? 0xffffff : 0xff3b30, // White for positive, Red/Magenta for negative
      });

      for (let k = 0; k < satCount; k++) {
        const sat = new THREE.Mesh(satGeom, satMat);
        particleGroup.add(sat);
        chargeSatellites.push(sat);
      }
    }

    // --- Antimatter Vortex Ring ---
    // If antimatter mode is on, add a distinctive glowing accretion torus that spins backwards
    let antimatterTorus: THREE.Mesh | null = null;
    if (isAntimatter) {
      const torusGeom = new THREE.TorusGeometry(effectiveSize * 1.15, 0.04, 8, 32);
      const torusMat = new THREE.MeshBasicMaterial({
        color: 0xff007f, // Deep hot pink/antimatter color
        transparent: true,
        opacity: 0.7,
      });
      antimatterTorus = new THREE.Mesh(torusGeom, torusMat);
      antimatterTorus.rotation.x = Math.PI / 2;
      particleGroup.add(antimatterTorus);
    }

    // 7. Animation Loop Configuration
    // Spin speed matches quantum spin properties: spin 1 fast, spin 1/2 moderate, spin 0 slow pulse
    let baseSpinSpeed = 0.015;
    if (particle.spin === '1') {
      baseSpinSpeed = 0.035;
    } else if (particle.spin === '0') {
      baseSpinSpeed = 0.003;
    }

    // Higgs field drag slows down the core rotation rate
    const dragFactor = Math.max(0.1, 1 - higgsViscosity * 0.85);
    const spinSpeed = baseSpinSpeed * dragFactor;

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Spin the core particle group
      particleGroup.rotation.y += spinSpeed;
      particleGroup.rotation.x += spinSpeed * 0.3;

      // Pulse the core sphere size slightly for quantum wave behavior
      const pulse = 1 + Math.sin(elapsed * (particle.spin === '0' ? 1.5 : 3.0)) * 0.04;
      coreMesh.scale.set(pulse, pulse, pulse);

      // Rotate cloud mesh in opposite direction
      cloudMesh.rotation.y -= spinSpeed * 1.5;
      cloudMesh.rotation.z += spinSpeed * 0.5;

      // Rotate orbit rings
      rings.forEach((ring, index) => {
        ring.rotation.y += (index + 1) * 0.005;
      });

      // Animate orbiting charge satellites
      chargeSatellites.forEach((sat, index) => {
        const angle = elapsed * 2.0 + (index * (Math.PI * 2)) / chargeSatellites.length;
        const radius = effectiveSize * 1.6;
        sat.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.3, // Squashed orbit
          Math.sin(angle) * radius
        );
      });

      // Antimatter disk wobble
      if (antimatterTorus) {
        antimatterTorus.rotation.z -= 0.05; // Quick counter-spin
        antimatterTorus.position.y = Math.sin(elapsed * 4.0) * 0.05; // Float
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. ResizeObserver (Dynamic Resizing)
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width: newWidth, height: newHeight } = entries[0].contentRect;
      
      const updatedHeight = newHeight || 300;
      
      camera.aspect = newWidth / updatedHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(newWidth, updatedHeight);
    });

    resizeObserver.observe(container);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      // Dispose of geometries & materials to prevent memory leaks
      sphereGeom.dispose();
      coreMat.dispose();
      cloudGeom.dispose();
      cloudMat.dispose();
      
      rings.forEach((ring) => {
        ring.geometry.dispose();
        if (Array.isArray(ring.material)) {
          ring.material.forEach((m) => m.dispose());
        } else {
          ring.material.dispose();
        }
      });

      chargeSatellites.forEach((sat) => {
        sat.geometry.dispose();
        if (Array.isArray(sat.material)) {
          sat.material.forEach((m) => m.dispose());
        } else {
          sat.material.dispose();
        }
      });

      if (antimatterTorus) {
        antimatterTorus.geometry.dispose();
        if (Array.isArray(antimatterTorus.material)) {
          antimatterTorus.material.forEach((m) => m.dispose());
        } else {
          antimatterTorus.material.dispose();
        }
      }

      renderer.dispose();
    };
  }, [particle, isAntimatter, higgsViscosity]);

  return (
    <div
      ref={containerRef}
      id="three-inspector-container"
      className="relative w-full h-[320px] bg-slate-950/40 rounded-xl border border-slate-800/80 flex items-center justify-center overflow-hidden backdrop-blur-sm"
    >
      {/* HUD Accent Elements */}
      <div className="absolute top-3 left-3 flex flex-col font-mono text-[9px] text-cyan-400/60 leading-tight select-none">
        <span>INSPECT_MODE: 3D_PARTICLE_RENDER</span>
        <span>RESOLUTION: DYNAMIC</span>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1.5 font-mono text-[9px] text-emerald-400/60 leading-tight select-none">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
        <span>ENGINE_OK</span>
      </div>

      <div className="absolute bottom-3 left-3 flex flex-col font-mono text-[9px] text-slate-500 leading-tight select-none">
        <span>MASS_SCALING: {particle.mass === '0' ? 'ZERO' : 'ACTIVE'}</span>
        <span>SPIN_ROT: {particle.spin === '0' ? 'ZERO' : 'TRUE'}</span>
      </div>

      <div className="absolute bottom-3 right-3 flex flex-col font-mono text-[9px] text-purple-400/50 leading-tight text-right select-none">
        <span>QUANTUM_VIBRATION: ON</span>
        <span>CHARGES: {particle.charge}e</span>
      </div>

      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" id="particle-canvas-3d" />
    </div>
  );
}
