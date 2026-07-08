/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Target, RefreshCw, Zap, Award, Info, X } from 'lucide-react';

interface GameParticle {
  id: string;
  name: string;
  chargeSign: 'positive' | 'negative' | 'neutral';
  massCategory: 'light' | 'heavy';
  trackDescription: string;
  scientificFact: string;
}

const GAME_CANDIDATES: GameParticle[] = [
  {
    id: 'electron',
    name: 'Cosmic Electron',
    chargeSign: 'negative',
    massCategory: 'light',
    trackDescription: 'Thin, curly track curving sharply to the left.',
    scientificFact: 'Electrons are lightweight and negative, meaning they spiral tightly under a positive magnetic field.'
  },
  {
    id: 'positron',
    name: 'Positron (Antimatter)',
    chargeSign: 'positive',
    massCategory: 'light',
    trackDescription: 'Thin, curly track curving sharply to the right.',
    scientificFact: 'Positrons are antimatter partners to electrons, identical in mass but positive, so they curve in the exact opposite direction!'
  },
  {
    id: 'muon',
    name: 'Cosmic Muon',
    chargeSign: 'negative',
    massCategory: 'heavy',
    trackDescription: 'Thick, straight track curving slightly to the left.',
    scientificFact: 'Muons are 200 times heavier than electrons, granting them massive momentum that resists bending in magnetic fields.'
  },
  {
    id: 'neutrino',
    name: 'Solar Neutrino',
    chargeSign: 'neutral',
    massCategory: 'light',
    trackDescription: 'No visible track, then sudden V-shaped split of light.',
    scientificFact: 'Neutrinos carry no electric charge and do not cause ionization, remaining invisible until they collide head-on with a nucleus!'
  }
];

interface CloudChamberGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CloudChamberGame({ isOpen, onClose }: CloudChamberGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentTarget, setCurrentTarget] = useState<GameParticle | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [hasGuessed, setHasGuessed] = useState<boolean>(false);

  // Particles / condensation droplets arrays for canvas animation
  const dropletsRef = useRef<{ x: number; y: number; size: number; alpha: number }[]>([]);

  // Sound/feedback and visual track configuration
  const spawnTrack = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Choose random candidate
    const candidate = GAME_CANDIDATES[Math.floor(Math.random() * GAME_CANDIDATES.length)];
    setCurrentTarget(candidate);
    setHasGuessed(false);
    setFeedback(null);
    setGameStarted(true);

    // Generate tracks/droplets based on candidate physical behavior
    const droplets: { x: number; y: number; size: number; alpha: number }[] = [];
    const steps = 120;
    
    let x = canvas.width / 2;
    let y = canvas.height;
    let vx = (Math.random() * 0.8 - 0.4) * 2; // initial heading
    let vy = -3.5; // moving upwards

    // Mass affects velocity step, charge affects circular magnetic drift
    const magneticBending = candidate.chargeSign === 'neutral' ? 0 : (candidate.chargeSign === 'negative' ? -0.045 : 0.045);
    const weightResistance = candidate.massCategory === 'heavy' ? 0.25 : 1.0;

    // Standard track generation
    if (candidate.id !== 'neutrino') {
      for (let i = 0; i < steps; i++) {
        // Apply magnetic Lorentz curve: dtheta = q*B/m
        vx += magneticBending * weightResistance;
        x += vx;
        y += vy;

        // Spread droplets around core track coordinate
        const spread = candidate.massCategory === 'heavy' ? 4 : 2;
        const dropletCount = candidate.massCategory === 'heavy' ? 3 : 1;

        for (let d = 0; d < dropletCount; d++) {
          droplets.push({
            x: x + (Math.random() * spread - spread / 2),
            y: y + (Math.random() * spread - spread / 2),
            size: Math.random() * (candidate.massCategory === 'heavy' ? 2.5 : 1.5) + 0.5,
            alpha: 1.0 - (i / steps) * 0.1, // fade tail less
          });
        }
      }
    } else {
      // Neutrino: Invisible line until collision vertex, then V-shaped decay
      const vertex = Math.floor(steps * 0.45);
      
      // Part 1: Invisible drift (No droplets spawned)
      for (let i = 0; i < vertex; i++) {
        x += vx;
        y += vy;
      }

      // Part 2: Collision Vertex decay into 2 charged particles (split tracks)
      let x1 = x, y1 = y, vx1 = -1.8, vy1 = -2.8;
      let x2 = x, y2 = y, vx2 = 1.8, vy2 = -2.2;

      // Spawn bright star at vertex
      for (let s = 0; s < 15; s++) {
        droplets.push({
          x: x + (Math.random() * 8 - 4),
          y: y + (Math.random() * 8 - 4),
          size: Math.random() * 3 + 1,
          alpha: 1.0,
        });
      }

      // Decay paths
      for (let i = vertex; i < steps; i++) {
        // Curve decay tracks
        vx1 -= 0.02; // electron curves left
        x1 += vx1;
        y1 += vy1;

        vx2 += 0.02; // positron curves right
        x2 += vx2;
        y2 += vy2;

        droplets.push({ x: x1, y: y1, size: Math.random() * 1.5 + 0.5, alpha: 1.0 });
        droplets.push({ x: x2, y: y2, size: Math.random() * 1.5 + 0.5, alpha: 1.0 });
      }
    }

    dropletsRef.current = droplets;
  };

  // Canvas render loop
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // Clear with dark mist chamber style background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw faint background grid
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let i = 20; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 20; j < canvas.height; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw cloud chamber active grid circle
      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 135, 0, Math.PI * 2);
      ctx.stroke();

      // Render, fade and drift droplets
      const droplets = dropletsRef.current;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';

      for (let i = 0; i < droplets.length; i++) {
        const d = droplets[i];
        
        // Custom draw drop with glow
        ctx.fillStyle = `rgba(224, 242, 254, ${d.alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();

        // Slow droplet diffusion / evaporation decay
        d.alpha -= 0.0035;
        d.size += 0.005;
      }

      // Clean evaporated droplets
      dropletsRef.current = droplets.filter((d) => d.alpha > 0);

      animId = requestAnimationFrame(render);
    };

    render();

    // Spawn first track if opened
    if (isOpen) {
      spawnTrack();
    }

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen]);

  const handleGuess = (candidate: GameParticle) => {
    if (hasGuessed || !currentTarget) return;
    setHasGuessed(true);

    if (candidate.id === currentTarget.id) {
      const newScore = score + 100;
      setScore(newScore);
      if (newScore > highScore) setHighScore(newScore);
      setFeedback({
        isCorrect: true,
        message: `SUCCESS! Detector logged: ${currentTarget.name}. ${currentTarget.scientificFact}`
      });
    } else {
      // Deduct score or break streak
      setScore(Math.max(0, score - 50));
      setFeedback({
        isCorrect: false,
        message: `SIGNAL MISALIGNED! That was actually a ${currentTarget.name}. Hint: ${currentTarget.trackDescription} ${currentTarget.scientificFact}`
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="cloud-chamber-modal"
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all"
    >
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.35)] overflow-hidden flex flex-col leading-normal">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-sm font-semibold font-mono tracking-wider text-slate-100 uppercase">
              Cosmic Ray Detector Chamber
            </span>
          </div>
          <button
            onClick={onClose}
            id="close-game-btn"
            className="p-1 rounded-md text-slate-400 hover:text-slate-100 bg-slate-950/40 hover:bg-slate-950 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center gap-4">
          
          {/* Dashboard Telemetry */}
          <div className="w-full grid grid-cols-3 gap-2 text-center font-mono text-[10px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-950 select-none">
            <div className="flex flex-col border-r border-slate-800">
              <span className="text-[8px] text-slate-600 uppercase">Score</span>
              <span className="text-emerald-400 font-bold text-xs">{score} pts</span>
            </div>
            <div className="flex flex-col border-r border-slate-800">
              <span className="text-[8px] text-slate-600 uppercase">High Score</span>
              <span className="text-purple-400 font-bold text-xs">{highScore} pts</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-600 uppercase">Magnetic Field</span>
              <span className="text-cyan-400 font-semibold text-xs">+1.5 Tesla</span>
            </div>
          </div>

          {/* Detector Canvas Container */}
          <div className="relative w-full aspect-[4/3] max-w-[400px] border border-slate-800/80 rounded-xl overflow-hidden shadow-inner bg-slate-950">
            <canvas
              ref={canvasRef}
              width="400"
              height="300"
              className="w-full h-full block"
            />
            
            {/* Visual HUD grid alignment crosshair */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
              <div className="w-full h-0.5 bg-cyan-400" />
              <div className="h-full w-0.5 bg-cyan-400 absolute" />
            </div>

            {/* Injected Trigger indicator */}
            <div className="absolute bottom-3 left-4 flex items-center gap-1.5 font-mono text-[9px] text-cyan-400/70 select-none">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
              <span>COSMIC_SOURCE: ACTIVE</span>
            </div>
          </div>

          {/* Feedback details */}
          {feedback && (
            <div className={`p-4 rounded-xl border w-full text-xs transition-all flex gap-3 ${
              feedback.isCorrect 
                ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400' 
                : 'bg-red-950/20 border-red-900/50 text-red-400'
            }`}>
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-sans">{feedback.message}</p>
            </div>
          )}

          {/* Guesses control deck */}
          <div className="w-full mt-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block text-center mb-3 leading-none">
              Analyze Trajectory & Identify candidate particle
            </span>
            <div className="grid grid-cols-2 gap-2">
              {GAME_CANDIDATES.map((cand) => (
                <button
                  key={cand.id}
                  onClick={() => handleGuess(cand)}
                  disabled={hasGuessed}
                  id={`game-guess-${cand.id}`}
                  className="p-3 text-xs font-semibold rounded-lg border bg-slate-950/40 hover:bg-slate-950 hover:border-purple-900/50 text-slate-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all font-mono"
                >
                  {cand.name}
                </button>
              ))}
            </div>
          </div>

          {/* Next particle scan block */}
          {hasGuessed && (
            <button
              onClick={spawnTrack}
              id="game-scan-again"
              className="w-full mt-2 py-3 bg-purple-600 hover:bg-purple-500 text-slate-100 rounded-xl font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all animate-pulse"
            >
              <RefreshCw className="w-4 h-4" /> Inject Next Cosmic Ray
            </button>
          )}

        </div>

        {/* Footer info panel */}
        <div className="bg-slate-950/40 px-6 py-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase">
          <div className="flex items-center gap-1.5 leading-none">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Hunter Rank: {score >= 500 ? 'Quantum Master' : score >= 300 ? 'Expert Physicist' : 'Laboratory Intern'}</span>
          </div>
          <span>Lorentz Force Simulator v1.0</span>
        </div>

      </div>
    </div>
  );
}
