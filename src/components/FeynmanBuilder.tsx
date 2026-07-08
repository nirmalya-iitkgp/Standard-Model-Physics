/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  RefreshCw, 
  Zap, 
  ShieldAlert, 
  Check, 
  Scale, 
  ShieldCheck,
  Atom,
  Info
} from 'lucide-react';

interface FeynmanInteraction {
  id: string;
  name: string;
  incoming: string[];
  mediator: string;
  mediatorType: 'photon' | 'w_minus' | 'w_plus' | 'z' | 'gluon' | 'fermion';
  mediatorCharge: number;
  mediatorSpin: string;
  mediatorMass: string;
  mediatorForce: string;
  mediatorColorClass: string;
  outgoing: string[];
  description: string;
  // Conservation laws equations
  chargeEquation1: string;
  chargeEquation2: string;
  leptonEquation1: string;
  leptonEquation2: string;
  baryonEquation1: string;
  baryonEquation2: string;
}

const INTERACTIONS: FeynmanInteraction[] = [
  {
    id: 'annihilation',
    name: 'Electron-Positron Annihilation',
    incoming: ['Electron (e⁻)', 'Positron (e⁺)'],
    mediator: 'Photon (γ)',
    mediatorType: 'photon',
    mediatorCharge: 0,
    mediatorSpin: '1',
    mediatorMass: '0',
    mediatorForce: 'Electromagnetism',
    mediatorColorClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    outgoing: ['Muon (μ⁻)', 'Antimuon (μ⁺)'],
    description: 'An electron and its antiparticle (positron) annihilate into a virtual photon, which subsequently converts into a muon-antimuon pair. Total charge, lepton number, and baryon number are strictly conserved.',
    chargeEquation1: '-1 + (+1) = 0',
    chargeEquation2: '0 = -1 + (+1)',
    leptonEquation1: '+1 + (-1) = 0',
    leptonEquation2: '0 = +1 + (-1)',
    baryonEquation1: '0 + 0 = 0',
    baryonEquation2: '0 = 0 + 0'
  },
  {
    id: 'beta_decay',
    name: 'Neutron Beta Decay',
    incoming: ['Neutron (n)'],
    mediator: 'W- Boson (W⁻)',
    mediatorType: 'w_minus',
    mediatorCharge: -1,
    mediatorSpin: '1',
    mediatorMass: '80.38 GeV/c²',
    mediatorForce: 'Weak Nuclear Force',
    mediatorColorClass: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    outgoing: ['Proton (p)', 'Electron (e⁻)', 'Antineutrino (ν̄_e)'],
    description: 'A neutral neutron decays into a positively charged proton by emitting a virtual W- boson, which instantly materializes into an electron and an electron antineutrino. This illustrates Baryon and Lepton conservation in radioactive decay.',
    chargeEquation1: '0 = +1 + (-1)',
    chargeEquation2: '-1 = -1 + 0',
    leptonEquation1: '0 = 0 + 0',
    leptonEquation2: '0 = +1 + (-1)',
    baryonEquation1: '+1 = +1 + 0',
    baryonEquation2: '0 = 0 + 0'
  },
  {
    id: 'compton',
    name: 'Compton Scattering',
    incoming: ['Electron (e⁻)', 'Photon (γ)'],
    mediator: 'Virtual Electron (e⁻)',
    mediatorType: 'fermion',
    mediatorCharge: -1,
    mediatorSpin: '1/2',
    mediatorMass: '0.511 MeV/c²',
    mediatorForce: 'Electromagnetism',
    mediatorColorClass: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    outgoing: ['Electron (e⁻)', 'Photon (γ)'],
    description: 'A high-energy photon collides with a target electron, transferring energy and momentum. The scattered photon exhibits a longer wavelength, verifying the quantum particle nature of light. All charge, lepton, and baryon values balance perfectly.',
    chargeEquation1: '-1 + 0 = -1',
    chargeEquation2: '-1 = -1 + 0',
    leptonEquation1: '1 + 0 = 1',
    leptonEquation2: '1 = 1 + 0',
    baryonEquation1: '0 + 0 = 0',
    baryonEquation2: '0 = 0 + 0'
  },
  {
    id: 'gluon_exchange',
    name: 'Quark-Gluon Vertex',
    incoming: ['Up Quark (u)', 'Down Quark (d)'],
    mediator: 'Gluon (g)',
    mediatorType: 'gluon',
    mediatorCharge: 0,
    mediatorSpin: '1',
    mediatorMass: '0',
    mediatorForce: 'Strong Nuclear Force (QCD)',
    mediatorColorClass: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    outgoing: ['Up Quark (u)', 'Down Quark (d)'],
    description: 'Two quarks interact inside a hadron via the strong nuclear force, exchanging a color-charged Gluon. This keeps the quarks bound together while conserving total baryon number (each quark carries B = 1/3).',
    chargeEquation1: '+2/3 = +2/3 + 0',
    chargeEquation2: '0 + (-1/3) = -1/3',
    leptonEquation1: '0 = 0 + 0',
    leptonEquation2: '0 + 0 = 0',
    baryonEquation1: '+1/3 = +1/3 + 0',
    baryonEquation2: '0 + (+1/3) = +1/3'
  }
];

export default function FeynmanBuilder() {
  const [selectedInteraction, setSelectedInteraction] = useState<FeynmanInteraction>(INTERACTIONS[0]);
  const [step, setStep] = useState<'incoming' | 'mediator' | 'outgoing' | 'validated'>('incoming');
  const [canvasMessage, setCanvasMessage] = useState<string>('Step 1: Click the canvas to draw the incoming channels into the first vertex.');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [vertex1Connected, setVertex1Connected] = useState(false);
  const [mediatorConnected, setMediatorConnected] = useState(false);
  const [vertex2Connected, setVertex2Connected] = useState(false);

  // Restart builder states
  const resetDiagram = () => {
    setVertex1Connected(false);
    setMediatorConnected(false);
    setVertex2Connected(false);
    setStep('incoming');
    setCanvasMessage('Step 1: Click the canvas to draw the incoming channels into the first vertex.');
  };

  useEffect(() => {
    resetDiagram();
  }, [selectedInteraction]);

  // Handle canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Drawing helper: wavy line for electroweak bosons (W, Photon)
    const drawWavyLine = (x1: number, y1: number, x2: number, y2: number, frequency = 4, amplitude = 5) => {
      ctx.beginPath();
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      ctx.save();
      ctx.translate(x1, y1);
      ctx.rotate(angle);
      
      for (let d = 0; d <= distance; d += 1) {
        const y = Math.sin((d / distance) * Math.PI * 2 * frequency + time) * amplitude;
        if (d === 0) ctx.moveTo(d, y);
        else ctx.lineTo(d, y);
      }
      ctx.restore();
      ctx.stroke();
    };

    // Drawing helper: curly loop for gluons
    const drawCurlyLine = (x1: number, y1: number, x2: number, y2: number, loops = 8, size = 6) => {
      ctx.beginPath();
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      ctx.save();
      ctx.translate(x1, y1);
      ctx.rotate(angle);

      for (let i = 0; i <= distance; i += 0.5) {
        const theta = (i / distance) * loops * Math.PI * 2 + time * 1.5;
        const x = i + Math.sin(theta) * size;
        const y = Math.cos(theta) * size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.restore();
      ctx.stroke();
    };

    // Drawing helper: standard straight arrow fermion line
    const drawFermionLine = (x1: number, y1: number, x2: number, y2: number, reverseArrow = false) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Draw arrow in middle
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowLength = 9;
      const arrowAngle = reverseArrow ? angle + Math.PI : angle; // Antimatter arrows point backwards in time!

      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx - arrowLength * Math.cos(arrowAngle - Math.PI / 6), my - arrowLength * Math.sin(arrowAngle - Math.PI / 6));
      ctx.moveTo(mx, my);
      ctx.lineTo(mx - arrowLength * Math.cos(arrowAngle + Math.PI / 6), my - arrowLength * Math.sin(arrowAngle + Math.PI / 6));
      ctx.stroke();
    };

    // Render Canvas Loop
    const render = () => {
      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Vertices positions
      const v1x = 180;
      const v1y = 125;
      const v2x = 340;
      const v2y = 125;

      // 1. Draw grid backdrop lines (aesthetic quantum field simulation)
      ctx.strokeStyle = '#ffffff04';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 30) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw glowing ripple ring around active targets
      if (!vertex1Connected) {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(v1x, v1y, 14 + Math.sin(time * 3) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (!mediatorConnected) {
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(v2x, v2y, 14 + Math.sin(time * 3) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Vertex targets
      if (vertex1Connected) {
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(v1x, v1y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Label Vertex 1
        ctx.fillStyle = '#64748b';
        ctx.font = '8px monospace';
        ctx.fillText("VERTEX_α", v1x - 20, v1y - 12);
      } else {
        ctx.strokeStyle = '#475569';
        ctx.beginPath();
        ctx.arc(v1x, v1y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (mediatorConnected && vertex2Connected) {
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(v2x, v2y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Label Vertex 2
        ctx.fillStyle = '#64748b';
        ctx.font = '8px monospace';
        ctx.fillText("VERTEX_β", v2x - 20, v2y - 12);
      } else if (vertex1Connected) {
        ctx.strokeStyle = '#475569';
        ctx.beginPath();
        ctx.arc(v2x, v2y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 2. Draw lines based on active diagram state
      ctx.lineWidth = 2.5;

      // --- INCOMING CHANNELS ---
      if (selectedInteraction.id === 'annihilation') {
        // Electron: straight arrow (e-) forward
        ctx.strokeStyle = vertex1Connected ? '#22d3ee' : '#1e293b';
        drawFermionLine(50, 50, v1x, v1y, false);
        ctx.fillStyle = vertex1Connected ? '#e2e8f0' : '#475569';
        ctx.font = '10px monospace';
        ctx.fillText(selectedInteraction.incoming[0], 35, 40);

        // Positron (antiparticle): backward arrow (e+) backward
        ctx.strokeStyle = vertex1Connected ? '#ec4899' : '#1e293b';
        drawFermionLine(50, 200, v1x, v1y, true);
        ctx.fillText(selectedInteraction.incoming[1], 35, 215);
      } else if (selectedInteraction.id === 'beta_decay') {
        // Neutron: straight line (represented as standard baryon arrow forward)
        ctx.strokeStyle = vertex1Connected ? '#a78bfa' : '#1e293b';
        drawFermionLine(50, 125, v1x, v1y, false);
        ctx.fillStyle = vertex1Connected ? '#e2e8f0' : '#475569';
        ctx.font = '10px monospace';
        ctx.fillText(selectedInteraction.incoming[0], 35, 120);
      } else if (selectedInteraction.id === 'compton') {
        // Electron: straight arrow (e-) forward
        ctx.strokeStyle = vertex1Connected ? '#22d3ee' : '#1e293b';
        drawFermionLine(50, 50, v1x, v1y, false);
        ctx.fillStyle = vertex1Connected ? '#e2e8f0' : '#475569';
        ctx.font = '10px monospace';
        ctx.fillText(selectedInteraction.incoming[0], 35, 40);

        // Photon: wavy line
        ctx.strokeStyle = vertex1Connected ? '#f97316' : '#1e293b';
        drawWavyLine(50, 200, v1x, v1y);
        ctx.fillStyle = vertex1Connected ? '#e2e8f0' : '#475569';
        ctx.font = '10px monospace';
        ctx.fillText(selectedInteraction.incoming[1], 35, 215);
      } else if (selectedInteraction.id === 'gluon_exchange') {
        // Up Quark 1: straight arrow
        ctx.strokeStyle = vertex1Connected ? '#a78bfa' : '#1e293b';
        drawFermionLine(50, 50, v1x, v1y, false);
        ctx.fillStyle = vertex1Connected ? '#e2e8f0' : '#475569';
        ctx.font = '10px monospace';
        ctx.fillText(selectedInteraction.incoming[0], 35, 40);

        // Down Quark 2: straight arrow
        ctx.strokeStyle = vertex1Connected ? '#c084fc' : '#1e293b';
        drawFermionLine(50, 200, v2x, v2y, false);
        ctx.fillStyle = vertex1Connected ? '#e2e8f0' : '#475569';
        ctx.fillText(selectedInteraction.incoming[1], 35, 215);
      }

      // --- MEDIATOR CHANNEL ---
      if (vertex1Connected) {
        ctx.strokeStyle = mediatorConnected ? '#ea580c' : '#1e293b';
        if (selectedInteraction.mediatorType === 'gluon') {
          // Gluon is curly line
          drawCurlyLine(v1x, v1y, v2x, v2y);
        } else if (selectedInteraction.mediatorType === 'fermion') {
          // Virtual Fermion is standard straight arrow line
          drawFermionLine(v1x, v1y, v2x, v2y, false);
        } else {
          // Photons and W bosons are wavy lines
          drawWavyLine(v1x, v1y, v2x, v2y);
        }
        ctx.fillStyle = mediatorConnected ? '#f97316' : '#475569';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(selectedInteraction.mediator, (v1x + v2x) / 2 - 20, v1y - 12);
      }

      // --- OUTGOING CHANNELS ---
      if (mediatorConnected) {
        if (selectedInteraction.id === 'annihilation') {
          // Muon- muon+ pair
          ctx.strokeStyle = vertex2Connected ? '#06b6d4' : '#1e293b';
          drawFermionLine(v2x, v2y, 470, 50, false);
          ctx.fillStyle = vertex2Connected ? '#e2e8f0' : '#475569';
          ctx.font = '10px monospace';
          ctx.fillText(selectedInteraction.outgoing[0], 475, 55);

          ctx.strokeStyle = vertex2Connected ? '#ec4899' : '#1e293b';
          drawFermionLine(v2x, v2y, 470, 200, true);
          ctx.fillText(selectedInteraction.outgoing[1], 475, 205);
        } else if (selectedInteraction.id === 'beta_decay') {
          // Proton continuing from vertex 1, Electron & Antineutrino from vertex 2
          ctx.strokeStyle = vertex1Connected ? '#38bdf8' : '#1e293b';
          drawFermionLine(v1x, v1y, 470, 40, false);
          ctx.fillStyle = vertex1Connected ? '#e2e8f0' : '#475569';
          ctx.font = '10px monospace';
          ctx.fillText(selectedInteraction.outgoing[0], 475, 45);

          // Electron
          ctx.strokeStyle = vertex2Connected ? '#22d3ee' : '#1e293b';
          drawFermionLine(v2x, v2y, 470, 140, false);
          ctx.fillStyle = vertex2Connected ? '#e2e8f0' : '#475569';
          ctx.fillText(selectedInteraction.outgoing[1], 475, 145);

          // Antineutrino (points backward in time as anti-lepton)
          ctx.strokeStyle = vertex2Connected ? '#67e8f9' : '#1e293b';
          drawFermionLine(v2x, v2y, 470, 210, true);
          ctx.fillText(selectedInteraction.outgoing[2], 475, 215);
        } else if (selectedInteraction.id === 'compton') {
          // Scattered Electron
          ctx.strokeStyle = vertex2Connected ? '#22d3ee' : '#1e293b';
          drawFermionLine(v2x, v2y, 470, 50, false);
          ctx.fillStyle = vertex2Connected ? '#e2e8f0' : '#475569';
          ctx.font = '10px monospace';
          ctx.fillText(selectedInteraction.outgoing[0], 475, 55);

          // Scattered Photon (wavy)
          ctx.strokeStyle = vertex2Connected ? '#f97316' : '#1e293b';
          drawWavyLine(v2x, v2y, 470, 200);
          ctx.fillStyle = vertex2Connected ? '#e2e8f0' : '#475569';
          ctx.fillText(selectedInteraction.outgoing[1], 475, 205);
        } else if (selectedInteraction.id === 'gluon_exchange') {
          // Up Quark scattering out
          ctx.strokeStyle = vertex2Connected ? '#a78bfa' : '#1e293b';
          drawFermionLine(v1x, v1y, 470, 50, false);
          ctx.fillStyle = vertex2Connected ? '#e2e8f0' : '#475569';
          ctx.font = '10px monospace';
          ctx.fillText(selectedInteraction.outgoing[0], 475, 55);

          // Down Quark scattering out
          ctx.strokeStyle = vertex2Connected ? '#c084fc' : '#1e293b';
          drawFermionLine(v2x, v2y, 470, 200, false);
          ctx.fillText(selectedInteraction.outgoing[1], 475, 205);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [selectedInteraction, vertex1Connected, mediatorConnected, vertex2Connected]);

  // Click-to-connect handler simulating drawing/assembling stages
  const handleCanvasClick = () => {
    if (!vertex1Connected) {
      setVertex1Connected(true);
      setStep('mediator');
      setCanvasMessage(`Step 2: Connect the vertices by releasing the mediating boson: ${selectedInteraction.mediator}.`);
    } else if (!mediatorConnected) {
      setMediatorConnected(true);
      setStep('outgoing');
      setCanvasMessage('Step 3: Connect outgoing channels to trigger decay and scattering completion.');
    } else if (!vertex2Connected) {
      setVertex2Connected(true);
      setStep('validated');
      setCanvasMessage('Step 4: Quantum connections completed! Run full validation diagnostics below.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-normal text-slate-100">
      
      {/* Settings Selector */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* Interaction List Card */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1.5">
            <Zap className="w-4 h-4" /> Feynman Interaction Selector
          </h4>
          <p className="text-[11px] text-slate-400 mb-4 leading-relaxed font-sans">
            Select an interaction process to test. Use the canvas workspace to link nodes and run the conservation engine.
          </p>

          {/* Presets Dropdown Menu to Auto-Populate */}
          <div className="mb-4 pb-4 border-b border-white/5">
            <label htmlFor="feynman-presets-dropdown" className="block text-[10px] font-bold font-mono text-purple-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Auto-Populate Canvas Preset:
            </label>
            <select
              id="feynman-presets-dropdown"
              value={selectedInteraction.id}
              onChange={(e) => {
                const found = INTERACTIONS.find(item => item.id === e.target.value);
                if (found) {
                  setSelectedInteraction(found);
                  // Automatically populate the canvas diagrams
                  setVertex1Connected(true);
                  setMediatorConnected(true);
                  setVertex2Connected(true);
                  setStep('validated');
                  setCanvasMessage('Step 4: Quantum connections completed! Run full validation diagnostics below.');
                }
              }}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer"
            >
              {INTERACTIONS.map((item) => (
                <option key={item.id} value={item.id} className="bg-slate-900 text-slate-300">
                  {item.name}
                </option>
              ))}
            </select>
            <p className="text-[9px] text-slate-500 font-mono mt-1 leading-normal italic">
              Choosing an interaction from this preset menu instantly constructs the full Feynman diagram on the canvas.
            </p>
          </div>

          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-2 leading-none">
            Interactive Assemble:
          </span>
          <div className="flex flex-col gap-2">
            {INTERACTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedInteraction(item)}
                id={`feynman-select-${item.id}`}
                className={`p-3 rounded-xl text-left border cursor-pointer text-xs font-mono transition-all leading-normal ${
                  selectedInteraction.id === item.id
                    ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                    : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="font-semibold mb-0.5">{item.name}</div>
                <div className="text-[10px] text-slate-500 truncate">
                  {item.incoming.join(' + ')} ➔ {item.outgoing.join(' + ')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Emitted Gauge Boson Visual Card */}
        <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex flex-col gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-[9px] text-slate-500 uppercase tracking-widest leading-none border-b border-white/5 pb-2 mb-0.5">
            <Atom className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
            Mediating Boson Specification
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Boson:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${selectedInteraction.mediatorColorClass}`}>
              {selectedInteraction.mediator}
            </span>
          </div>

          <div className="flex justify-between border-t border-white/5 pt-2">
            <span className="text-slate-500">Force Carrier:</span>
            <span className="text-slate-300 font-semibold">{selectedInteraction.mediatorForce}</span>
          </div>

          <div className="flex justify-between border-t border-white/5 pt-2">
            <span className="text-slate-500">Rest Mass:</span>
            <span className="text-cyan-400">{selectedInteraction.mediatorMass}</span>
          </div>

          <div className="flex justify-between border-t border-white/5 pt-2">
            <span className="text-slate-500">Electric Charge:</span>
            <span className="text-amber-500">{selectedInteraction.mediatorCharge}e</span>
          </div>

          <div className="flex justify-between border-t border-white/5 pt-2">
            <span className="text-slate-500">Quantum Spin:</span>
            <span className="text-purple-400">Spin {selectedInteraction.mediatorSpin}</span>
          </div>
        </div>

        {/* How to read feynman lines card */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-sans text-xs">
          <div className="flex gap-2 items-start text-slate-400 leading-relaxed">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-semibold text-slate-300">How to Read Feynman Lines</span>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-[11px] text-slate-400">
                <li><strong className="text-slate-300">Straight lines with arrows:</strong> Fermions (quarks & leptons). Particles point forward in time, antiparticles point backward.</li>
                <li><strong className="text-slate-300">Wavy lines:</strong> Force carriers (Photons, W Bosons).</li>
                <li><strong className="text-slate-300">Curly helix loops:</strong> Gluons carrying strong nuclear binding forces.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Canvas Workspace and Validation */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        {/* Canvas Area wrapper */}
        <div className="flex flex-col rounded-xl border border-white/10 overflow-hidden bg-black/40 backdrop-blur-md">
          
          {/* Header tracker info */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/60 text-[10px] font-mono text-slate-400 select-none">
            <span>LAB_INSTRUMENT: FEYNMAN_COLLIDER_SIMULATOR</span>
            <div className="flex items-center gap-2">
              <span>DRAW STATE:</span>
              <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider ${
                step === 'validated' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              }`}>
                {step.toUpperCase()}
              </span>
            </div>
          </div>
 
          {/* Canvas itself */}
          <div className="relative flex justify-center items-center">
            <canvas
              ref={canvasRef}
              width="520"
              height="250"
              onClick={handleCanvasClick}
              id="feynman-canvas"
              className="block cursor-pointer bg-black/40 select-none w-full"
            />

            {/* Step prompt floating message banner */}
            <div className="absolute top-3 left-4 right-4 p-2.5 rounded-lg bg-black/90 border border-white/10 font-mono text-[10px] text-slate-300 flex items-center gap-2 leading-tight">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping shrink-0" />
              <span>{canvasMessage}</span>
            </div>
          </div>

          {/* Interactive panel below canvas */}
          <div className="flex justify-between items-center px-4 py-2 bg-black/20 border-t border-white/10 font-mono text-xs text-slate-400">
            <span>Click canvas coordinates to trigger interactions</span>
            <button
              onClick={resetDiagram}
              id="feynman-reset"
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset Diagram
            </button>
          </div>
        </div>

        {/* Validation Box with Lepton/Baryon Conservation */}
        {step === 'validated' ? (
          <div className="p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/30 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-5 h-5 text-emerald-400 animate-bounce" />
              </div>
              <div className="flex flex-col leading-relaxed">
                <span className="text-sm font-semibold text-emerald-400 font-mono flex items-center gap-2">
                  QUANTUM SYMMETRIES VALIDATED!
                </span>
                <p className="text-xs text-slate-300 mt-1">
                  {selectedInteraction.description}
                </p>
              </div>
            </div>

            {/* Quantum Conservation Equations Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[10px]">
              
              {/* Electric Charge (Q) */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between min-h-[90px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Charge (Q)</span>
                  <span className="text-emerald-400 text-[8px] font-bold bg-emerald-500/10 px-1 rounded">CONSERVED</span>
                </div>
                <div className="flex flex-col gap-1 text-slate-300">
                  <div className="truncate"><span className="text-slate-500">Vertex A:</span> {selectedInteraction.chargeEquation1}</div>
                  <div className="truncate"><span className="text-slate-500">Vertex B:</span> {selectedInteraction.chargeEquation2}</div>
                </div>
                <div className="text-[7px] text-slate-500 border-t border-white/5 pt-1.5 mt-1.5">
                  Charge conservation remains absolute.
                </div>
              </div>

              {/* Lepton Number (L) */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between min-h-[90px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Lepton (L)</span>
                  <span className="text-emerald-400 text-[8px] font-bold bg-emerald-500/10 px-1 rounded">CONSERVED</span>
                </div>
                <div className="flex flex-col gap-1 text-slate-300">
                  <div className="truncate"><span className="text-slate-500">Vertex A:</span> {selectedInteraction.leptonEquation1}</div>
                  <div className="truncate"><span className="text-slate-500">Vertex B:</span> {selectedInteraction.leptonEquation2}</div>
                </div>
                <div className="text-[7px] text-slate-500 border-t border-white/5 pt-1.5 mt-1.5">
                  Checked for weak lepton flavor rules.
                </div>
              </div>

              {/* Baryon Number (B) */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between min-h-[90px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Baryon (B)</span>
                  <span className="text-emerald-400 text-[8px] font-bold bg-emerald-500/10 px-1 rounded">CONSERVED</span>
                </div>
                <div className="flex flex-col gap-1 text-slate-300">
                  <div className="truncate"><span className="text-slate-500">Vertex A:</span> {selectedInteraction.baryonEquation1}</div>
                  <div className="truncate"><span className="text-slate-500">Vertex B:</span> {selectedInteraction.baryonEquation2}</div>
                </div>
                <div className="text-[7px] text-slate-500 border-t border-white/5 pt-1.5 mt-1.5">
                  Baryon number is fully conserved.
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-xs font-mono text-slate-500 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Assemble the full Feynman track (Vertex A ➔ Boson Mediator ➔ Vertex B ➔ Outgoing Pair) to trigger conservation rule check.</span>
          </div>
        )}

      </div>
    </div>
  );
}
