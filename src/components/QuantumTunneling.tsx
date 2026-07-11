/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  HelpCircle, 
  Activity, 
  Layers, 
  Zap, 
  Waves,
  Sparkles
} from 'lucide-react';

export default function QuantumTunneling() {
  // Simulator Parameters
  const [barrierHeight, setBarrierHeight] = useState<number>(3.0); // eV
  const [barrierWidth, setBarrierWidth] = useState<number>(0.3);  // nm
  const [particleEnergy, setParticleEnergy] = useState<number>(1.8); // eV
  const [particleMass, setParticleMass] = useState<number>(1.0);   // in units of electron mass (m_e)

  // Simulation controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [time, setTime] = useState<number>(-120); // timeline position from -150 to +250
  const [waveType, setWaveType] = useState<'wavepacket' | 'stationary'>('wavepacket');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Constants
  const minX = -1.5; // nm
  const maxX = 1.5;  // nm

  // 1. Quantum Tunneling Calculation
  // All parameters scaled to eV and nm.
  // scaling constant derived from: hbar = 1.054e-34 J.s, m_e = 9.109e-31 kg, 1eV = 1.602e-19 J, 1nm = 1e-9 m
  // hbar^2 / (2 * m_e) = 0.0381 eV nm^2
  // 2 * m_e / hbar^2 = 26.25 eV^-1 nm^-2
  const calcTunneling = () => {
    const V0 = barrierHeight;
    const E = particleEnergy;
    const a = barrierWidth;
    const mr = particleMass;

    let T = 0;
    let R = 1;
    let kappa = 0;
    let kPrime = 0;

    if (V0 <= 0.01) {
      return { T: 1, R: 0, kappa: 0, kPrime: 0 };
    }

    if (Math.abs(E - V0) < 0.01) {
      // Near threshold limit
      const factor = 26.25 * mr * V0 * a * a;
      T = 1 / (1 + factor / 4);
      R = 1 - T;
    } else if (E < V0) {
      // Quantum Tunneling Regime
      kappa = Math.sqrt(26.25 * mr * (V0 - E));
      const sinhVal = Math.sinh(kappa * a);
      const denominator = 1 + (V0 * V0 * sinhVal * sinhVal) / (4 * E * (V0 - E));
      T = 1 / denominator;
      R = 1 - T;
    } else {
      // Over-barrier Transmission Regime
      kPrime = Math.sqrt(26.25 * mr * (E - V0));
      const sinVal = Math.sin(kPrime * a);
      const denominator = 1 + (V0 * V0 * sinVal * sinVal) / (4 * E * (E - V0));
      T = 1 / denominator;
      R = 1 - T;
    }

    // Numerical safety guards
    if (isNaN(T) || T < 0) T = 0;
    if (T > 1) T = 1;
    R = 1 - T;

    return { T, R, kappa, kPrime };
  };

  const { T, R, kappa, kPrime } = calcTunneling();

  // Reset timeline
  const resetSimulation = () => {
    setTime(-120);
  };

  // 2. Continuous time stepping
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    const update = () => {
      setTime((prev) => {
        const next = prev + 1.2;
        return next > 220 ? -120 : next; // loops packet
      });
      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  // 3. Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;

    // Coordinate conversion helper (nm to pixels)
    // x range: -1.5 nm to +1.5 nm
    const getXPixel = (xNm: number) => {
      return ((xNm - minX) / (maxX - minX)) * width;
    };

    const getYPixel = (psiY: number, offset: number = height / 2) => {
      return offset - psiY * 70;
    };

    // Draw Potential Energy Barrier
    const barrierLeft = -barrierWidth / 2;
    const barrierRight = barrierWidth / 2;
    const bL_px = getXPixel(barrierLeft);
    const bR_px = getXPixel(barrierRight);
    const bW_px = bR_px - bL_px;
    
    // Scale barrier height visually
    // Let 5.0 eV correspond to 120 pixels of height
    const bH_px = (barrierHeight / 5.0) * 110;
    const zeroEnergyY = height * 0.72; // Baseline

    // Background energy level lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, zeroEnergyY);
    ctx.lineTo(width, zeroEnergyY);
    ctx.stroke();

    // Barrier shaded rectangle
    ctx.fillStyle = 'rgba(100, 116, 139, 0.15)';
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 2;
    ctx.fillRect(bL_px, zeroEnergyY - bH_px, bW_px, bH_px);
    ctx.strokeRect(bL_px, zeroEnergyY - bH_px, bW_px, bH_px);

    // Draw particle energy level
    const energyY = zeroEnergyY - (particleEnergy / 5.0) * 110;
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, energyY);
    ctx.lineTo(width, energyY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Energy label
    ctx.fillStyle = '#eab308';
    ctx.font = '10px monospace';
    ctx.fillText(`E = ${particleEnergy.toFixed(2)} eV`, 15, energyY - 6);

    // Barrier V0 label
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`V₀ = ${barrierHeight.toFixed(2)} eV`, bL_px + 4, zeroEnergyY - bH_px - 8);

    // Draw Wavefunction Wave
    // We will draw:
    // 1. The probability density |psi(x)|^2 filled underneath (cyan/indigo)
    // 2. The real part Re(psi) as a solid wavy line (cyan)
    // 3. The imaginary part Im(psi) as a faint dashed wavy line
    ctx.lineWidth = 2;

    const wavePacketSigma = 0.18; // nm (width of packet)
    const wavePacketK0 = 22.0;    // base wavevector

    ctx.beginPath();
    let isFirst = true;

    // Scan through all X values on the canvas grid
    for (let px = 0; px < width; px++) {
      // Map pixel to nm
      const x = minX + (px / width) * (maxX - minX);

      let psiReal = 0;
      let psiImag = 0;
      let probDensity = 0;

      if (waveType === 'wavepacket') {
        const v = 0.008; // wave packet velocity
        const collisionX = barrierLeft - 0.1; // point of splitting
        const t = time;

        // Peak center coordinates for branches
        const xInc = collisionX + v * Math.min(t, 0);
        const xRef = collisionX - v * Math.max(t, 0);
        const xTrans = barrierRight + 0.1 + v * Math.max(t, 0);

        // Standard incident envelope amplitude
        const ampInc = Math.exp(-Math.pow(x - xInc, 2) / (2 * wavePacketSigma * wavePacketSigma));
        
        // Decaying envelope inside barrier during collision
        const overlapFactor = Math.max(0, 1 - Math.abs(t) / 100);

        if (x < barrierLeft) {
          // Incident + Reflected waves
          const incPartReal = ampInc * Math.cos(wavePacketK0 * (x - xInc));
          const incPartImag = ampInc * Math.sin(wavePacketK0 * (x - xInc));

          // Reflected packet
          const ampRef = Math.sqrt(R) * Math.exp(-Math.pow(x - xRef, 2) / (2 * wavePacketSigma * wavePacketSigma));
          // Phase shift upon reflection adds physical authenticity
          const refPartReal = ampRef * Math.cos(-wavePacketK0 * (x - xRef) + 1.2);
          const refPartImag = ampRef * Math.sin(-wavePacketK0 * (x - xRef) + 1.2);

          // Sum waves depending on time
          if (t <= 0) {
            psiReal = incPartReal;
            psiImag = incPartImag;
          } else {
            psiReal = incPartReal * (1 - overlapFactor) + refPartReal;
            psiImag = incPartImag * (1 - overlapFactor) + refPartImag;
          }
        } else if (x >= barrierLeft && x <= barrierRight) {
          // Inside the barrier (exponentially decaying/coupling region)
          // We interpolate the tunneling tail based on collision timing
          const distanceIntoBarrier = x - barrierLeft;
          
          let tailAmp = 0;
          let kPhase = 0;

          if (particleEnergy < barrierHeight) {
            // Exponential decay
            tailAmp = Math.exp(-kappa * distanceIntoBarrier);
          } else {
            // Oscillating over-barrier wave
            tailAmp = 1.0;
            kPhase = kPrime * distanceIntoBarrier;
          }

          // Scale by the incident wave hitting the barrier
          const envelopeAtEdge = Math.exp(-Math.pow(barrierLeft - xInc, 2) / (2 * wavePacketSigma * wavePacketSigma));
          const actualAmp = envelopeAtEdge * tailAmp;

          if (particleEnergy < barrierHeight) {
            psiReal = actualAmp * Math.cos(wavePacketK0 * (barrierLeft - xInc));
            psiImag = actualAmp * Math.sin(wavePacketK0 * (barrierLeft - xInc));
          } else {
            psiReal = actualAmp * Math.cos(wavePacketK0 * (barrierLeft - xInc) + kPhase);
            psiImag = actualAmp * Math.sin(wavePacketK0 * (barrierLeft - xInc) + kPhase);
          }
        } else {
          // Transmitted region
          const ampTrans = Math.sqrt(T) * Math.exp(-Math.pow(x - xTrans, 2) / (2 * wavePacketSigma * wavePacketSigma));
          
          // Transmitted wave has altered wavelength if E > V0, or same if E < V0
          const kTrans = particleEnergy > barrierHeight ? wavePacketK0 * Math.sqrt(particleEnergy / (particleEnergy - barrierHeight)) : wavePacketK0;
          
          psiReal = ampTrans * Math.cos(kTrans * (x - xTrans));
          psiImag = ampTrans * Math.sin(kTrans * (x - xTrans));
        }

        probDensity = psiReal * psiReal + psiImag * psiImag;
      } else {
        // Stationary State mode (Continuum plane wave)
        // Displays a continuous stream to clearly visualize transmission/reflection ratios
        const omega = performance.now() * 0.006;
        const k0 = wavePacketK0;

        if (x < barrierLeft) {
          // Incident plane wave + Reflected plane wave
          const incReal = Math.cos(k0 * x - omega);
          const refReal = Math.sqrt(R) * Math.cos(-k0 * x - omega + 1.2);
          psiReal = incReal + refReal;
          probDensity = 1 + R + 2 * Math.sqrt(R) * Math.cos(2 * k0 * x - 1.2); // standing wave pattern
        } else if (x >= barrierLeft && x <= barrierRight) {
          // Barrier transmission coupling
          const distance = x - barrierLeft;
          if (particleEnergy < barrierHeight) {
            // Exponentially decay
            const decay = Math.exp(-kappa * distance);
            psiReal = decay * Math.cos(k0 * barrierLeft - omega);
            probDensity = Math.max(T, decay * decay);
          } else {
            // Transmitted oscillation inside barrier
            const phase = kPrime * distance;
            psiReal = Math.cos(k0 * barrierLeft + phase - omega);
            probDensity = 1.0;
          }
        } else {
          // Transmitted plane wave
          const distance = x - barrierRight;
          const kTrans = particleEnergy > barrierHeight ? k0 * Math.sqrt(particleEnergy / (particleEnergy - barrierHeight)) : k0;
          psiReal = Math.sqrt(T) * Math.cos(k0 * barrierLeft + kTrans * distance - omega);
          probDensity = T;
        }

        // Scale stationary visual height down so it sits comfortably
        psiReal *= 0.45;
        probDensity *= 0.45;
      }

      // Render probability envelope shading (fill under curve)
      const pY = getYPixel(probDensity, zeroEnergyY);
      
      if (isFirst) {
        ctx.beginPath();
        ctx.moveTo(px, zeroEnergyY);
        isFirst = false;
      }
      ctx.lineTo(px, pY);
    }
    ctx.lineTo(width, zeroEnergyY);
    ctx.closePath();
    ctx.fillStyle = waveType === 'wavepacket' ? 'rgba(34, 211, 238, 0.08)' : 'rgba(99, 102, 241, 0.08)';
    ctx.fill();

    // Now draw the Wave's actual Real Part Re(psi)
    ctx.beginPath();
    isFirst = true;
    for (let px = 0; px < width; px++) {
      const x = minX + (px / width) * (maxX - minX);
      let psiReal = 0;

      if (waveType === 'wavepacket') {
        const v = 0.008;
        const collisionX = barrierLeft - 0.1;
        const t = time;

        const xInc = collisionX + v * Math.min(t, 0);
        const xRef = collisionX - v * Math.max(t, 0);
        const xTrans = barrierRight + 0.1 + v * Math.max(t, 0);

        const ampInc = Math.exp(-Math.pow(x - xInc, 2) / (2 * wavePacketSigma * wavePacketSigma));
        const overlapFactor = Math.max(0, 1 - Math.abs(t) / 100);

        if (x < barrierLeft) {
          const incPartReal = ampInc * Math.cos(wavePacketK0 * (x - xInc));
          const ampRef = Math.sqrt(R) * Math.exp(-Math.pow(x - xRef, 2) / (2 * wavePacketSigma * wavePacketSigma));
          const refPartReal = ampRef * Math.cos(-wavePacketK0 * (x - xRef) + 1.2);

          if (t <= 0) {
            psiReal = incPartReal;
          } else {
            psiReal = incPartReal * (1 - overlapFactor) + refPartReal;
          }
        } else if (x >= barrierLeft && x <= barrierRight) {
          const distanceIntoBarrier = x - barrierLeft;
          let tailAmp = 0;
          let kPhase = 0;

          if (particleEnergy < barrierHeight) {
            tailAmp = Math.exp(-kappa * distanceIntoBarrier);
          } else {
            tailAmp = 1.0;
            kPhase = kPrime * distanceIntoBarrier;
          }

          const envelopeAtEdge = Math.exp(-Math.pow(barrierLeft - xInc, 2) / (2 * wavePacketSigma * wavePacketSigma));
          const actualAmp = envelopeAtEdge * tailAmp;

          if (particleEnergy < barrierHeight) {
            psiReal = actualAmp * Math.cos(wavePacketK0 * (barrierLeft - xInc));
          } else {
            psiReal = actualAmp * Math.cos(wavePacketK0 * (barrierLeft - xInc) + kPhase);
          }
        } else {
          const ampTrans = Math.sqrt(T) * Math.exp(-Math.pow(x - xTrans, 2) / (2 * wavePacketSigma * wavePacketSigma));
          const kTrans = particleEnergy > barrierHeight ? wavePacketK0 * Math.sqrt(particleEnergy / (particleEnergy - barrierHeight)) : wavePacketK0;
          psiReal = ampTrans * Math.cos(kTrans * (x - xTrans));
        }
      } else {
        const omega = performance.now() * 0.006;
        const k0 = wavePacketK0;

        if (x < barrierLeft) {
          const incReal = Math.cos(k0 * x - omega);
          const refReal = Math.sqrt(R) * Math.cos(-k0 * x - omega + 1.2);
          psiReal = (incReal + refReal) * 0.45;
        } else if (x >= barrierLeft && x <= barrierRight) {
          const distance = x - barrierLeft;
          if (particleEnergy < barrierHeight) {
            const decay = Math.exp(-kappa * distance);
            psiReal = decay * Math.cos(k0 * barrierLeft - omega) * 0.45;
          } else {
            const phase = kPrime * distance;
            psiReal = Math.cos(k0 * barrierLeft + phase - omega) * 0.45;
          }
        } else {
          const distance = x - barrierRight;
          const kTrans = particleEnergy > barrierHeight ? k0 * Math.sqrt(particleEnergy / (particleEnergy - barrierHeight)) : k0;
          psiReal = Math.sqrt(T) * Math.cos(k0 * barrierLeft + kTrans * distance - omega) * 0.45;
        }
      }

      const wY = getYPixel(psiReal, zeroEnergyY);
      if (isFirst) {
        ctx.beginPath();
        ctx.moveTo(px, wY);
        isFirst = false;
      } else {
        ctx.lineTo(px, wY);
      }
    }
    ctx.strokeStyle = waveType === 'wavepacket' ? '#06b6d4' : '#6366f1';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Render barrier vertical boundary lines explicitly
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(bL_px, 20);
    ctx.lineTo(bL_px, height - 20);
    ctx.moveTo(bR_px, 20);
    ctx.lineTo(bR_px, height - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Quantum Probability Split Components HUD
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(15, 15, 210, 50);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.strokeRect(15, 15, 210, 50);

    ctx.font = '10px monospace';
    ctx.fillStyle = '#ef4444';
    ctx.fillText(`Reflection (R): ${(R * 100).toFixed(2)}%`, 25, 32);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`Tunneling (T) : ${(T * 100).toFixed(2)}%`, 25, 48);

    // Labels for areas
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('INCIDENT & REFLECTED', 25, height - 12);
    ctx.fillText('BARRIER REGION', bL_px + bW_px / 2 - 35, height - 12);
    ctx.fillText('TRANSMITTED / TUNNELED', width - 150, height - 12);

    // Request another frame if stationary wave
    if (waveType === 'stationary' && isPlaying) {
      animationRef.current = requestAnimationFrame(() => {});
    }

  }, [barrierHeight, barrierWidth, particleEnergy, particleMass, time, waveType, isPlaying, T, R, kappa, kPrime]);

  return (
    <div id="quantum-tunneling-lab" className="flex flex-col gap-6 leading-normal text-slate-100">
      
      {/* Tab Header Description */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold tracking-wide text-slate-200 font-mono uppercase flex items-center gap-2">
            <Waves className="w-5 h-5 text-indigo-400 animate-pulse" />
            Quantum Tunneling Wavefunction Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Observe the probability density of a quantum wavepacket as it encounters a potential energy barrier. Slide parameters to witness wave-particle splitting in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWaveType(waveType === 'wavepacket' ? 'stationary' : 'wavepacket')}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono transition-all cursor-pointer ${
              waveType === 'wavepacket' 
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
            }`}
          >
            {waveType === 'wavepacket' ? '📊 Packet Propagation' : '🔁 Stationary Stream'}
          </button>
        </div>
      </div>

      {/* Simulator Interface Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* INTERACTIVE CONTROLS COLUMN (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 font-mono text-xs">
          
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-5 backdrop-blur-md">
            
            <div className="flex items-center gap-2 text-indigo-400 uppercase tracking-widest text-[10px] font-bold border-b border-white/5 pb-2">
              <Sliders className="w-4 h-4" />
              Adjust Barrier & Wave Mechanics
            </div>

            {/* Slider 1: Barrier Height (V0) */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-500" /> Barrier Height (V₀)
                </span>
                <span className="text-indigo-400 font-bold">{barrierHeight.toFixed(2)} eV</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={barrierHeight}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setBarrierHeight(val);
                }}
                className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-[9px] text-slate-500 italic">Potential energy step width threshold inside space.</span>
            </div>

            {/* Slider 2: Barrier Width (a) */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-slate-500" /> Barrier Width (a)
                </span>
                <span className="text-indigo-400 font-bold">{barrierWidth.toFixed(2)} nm</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={barrierWidth}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setBarrierWidth(val);
                }}
                className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-[9px] text-slate-500 italic">Physical width of the energy wall in nanometers.</span>
            </div>

            {/* Slider 3: Particle Energy (E) */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Particle Energy (E)
                </span>
                <span className="text-amber-400 font-bold">{particleEnergy.toFixed(2)} eV</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="6.0"
                step="0.1"
                value={particleEnergy}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setParticleEnergy(val);
                }}
                className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-[9px] text-slate-500 italic">Energy of incident packet. Below V₀ is tunneling, above is classical passage.</span>
            </div>

            {/* Slider 4: Particle Mass (m) */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Particle Mass (m_r)
                </span>
                <span className="text-cyan-400 font-bold">
                  {particleMass === 1 ? '1.00 m_e (Electron)' : `${particleMass.toFixed(0)} m_e`}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="5"
                value={particleMass}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setParticleMass(val);
                }}
                className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="text-[9px] text-slate-500 italic">Heavier particles decay exponentially quicker inside the barrier.</span>
            </div>

            {/* Stats Dashboard */}
            <div className="bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col gap-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Barrier Regime:</span>
                <span className={`font-bold uppercase tracking-wider ${particleEnergy < barrierHeight ? 'text-red-400' : 'text-emerald-400'}`}>
                  {particleEnergy < barrierHeight ? 'Quantum Tunneling' : 'Classical Passing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Decay Constant (κ):</span>
                <span className="text-slate-300 font-semibold">{particleEnergy < barrierHeight ? `${kappa.toFixed(2)} nm⁻¹` : 'N/A (Oscillating)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transmission Prob (T):</span>
                <span className="text-emerald-400 font-bold">{(T * 100).toFixed(3)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reflection Prob (R):</span>
                <span className="text-red-400 font-bold">{(R * 100).toFixed(3)}%</span>
              </div>
            </div>

            {/* Animation Controls Row */}
            <div className="flex gap-2 border-t border-white/5 pt-4 mt-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 py-2 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-red-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isPlaying ? 'Pause Wave' : 'Resume Wave'}</span>
              </button>

              {waveType === 'wavepacket' && (
                <button
                  onClick={resetSimulation}
                  className="py-2 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                  title="Reset Wavepacket"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                  <span>Reset Packet</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* VISUALIZER GRAPH CANVAS COLUMN (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          <div className="p-4 bg-black/40 border border-white/10 rounded-xl flex flex-col gap-4 backdrop-blur-md relative overflow-hidden">
            
            {/* Visual HUD Header */}
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                Wavefunction Phase Space [ψ(x)]
              </div>
              <div>Grid: -1.5nm to 1.5nm</div>
            </div>

            {/* Render Canvas */}
            <div className="relative bg-black/80 rounded-lg border border-white/5 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={640}
                height={300}
                className="w-full aspect-[640/300] block"
              />
            </div>

            {/* Quantum Physics Insight Box */}
            <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-xl text-[11px] leading-relaxed text-slate-300 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-200 mb-0.5">Tunneling Phenomenon Explanation</p>
                <p className="font-sans text-slate-400">
                  In classical physics, a particle with energy <span className="text-amber-400">E</span> less than the barrier height <span className="text-slate-300">V₀</span> is always reflected. However, quantum wavefunctions satisfy the Schrödinger Equation, which requires continuous derivatives at the boundary. This leads to an <span className="font-bold text-indigo-300">exponential decay wavefunction</span> inside the barrier. If the barrier is thin enough (<span className="text-indigo-400">a</span>), the amplitude remains non-zero on the other side, allowing the wavepacket to emerge and propagate as a free particle with reduced amplitude.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
