/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BSM_PARTICLES } from '../data/particles';
import { AlertOctagon, HelpCircle, ShieldAlert, Sparkles, Binary } from 'lucide-react';

export default function BSMExplorer() {
  const [activeTab, setActiveTab] = useState<'gravity' | 'darkmatter' | 'susy'>('gravity');
  const [selectedSparticle, setSelectedSparticle] = useState(BSM_PARTICLES[1]); // Neutralino by default

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-normal">
      
      {/* Tab select sidebar */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-purple-500" /> BSM Speculative Files
          </h4>
          <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
            The Standard Model is highly successful, but incomplete. It does not account for gravity, dark matter, dark energy, or neutrino mass origins.
          </p>

          <div className="flex flex-col gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('gravity')}
              id="bsm-tab-gravity"
              className={`p-3 text-left rounded-lg border cursor-pointer transition-all leading-normal ${
                activeTab === 'gravity'
                  ? 'border-purple-500 bg-purple-950/20 text-purple-300'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:bg-slate-900/40'
              }`}
            >
              <div className="font-semibold">File 01: The Gravity Incompatibility</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Quantum vs Relativity</div>
            </button>

            <button
              onClick={() => setActiveTab('darkmatter')}
              id="bsm-tab-darkmatter"
              className={`p-3 text-left rounded-lg border cursor-pointer transition-all leading-normal ${
                activeTab === 'darkmatter'
                  ? 'border-purple-500 bg-purple-950/20 text-purple-300'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:bg-slate-900/40'
              }`}
            >
              <div className="font-semibold">File 02: Speculative Particles</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Neutralino, Graviton</div>
            </button>

            <button
              onClick={() => setActiveTab('susy')}
              id="bsm-tab-susy"
              className={`p-3 text-left rounded-lg border cursor-pointer transition-all leading-normal ${
                activeTab === 'susy'
                  ? 'border-purple-500 bg-purple-950/20 text-purple-300'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:bg-slate-900/40'
              }`}
            >
              <div className="font-semibold">File 03: Supersymmetry (SUSY)</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Sparticle Superpartners</div>
            </button>
          </div>
        </div>

        {/* Status board */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 font-mono text-[9px] leading-relaxed text-slate-500 uppercase tracking-wider">
          <div className="flex justify-between mb-1">
            <span>BSM_RESEARCH_DEPT</span>
            <span className="text-purple-500">CLASS_CLASSIFIED</span>
          </div>
          <div className="flex justify-between">
            <span>PROBABILITY_COEFFICIENT</span>
            <span>SPECULATIVE</span>
          </div>
          <div className="mt-2 border-t border-slate-900 pt-2 text-[10px] text-amber-500 font-semibold flex items-center gap-1 font-sans capitalize select-none leading-none">
            <ShieldAlert className="w-3.5 h-3.5" /> Speculative Research Node
          </div>
        </div>
      </div>

      {/* Workspace view */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        {/* FILE 1: Gravity Incompatibility */}
        {activeTab === 'gravity' && (
          <div className="flex flex-col gap-4">
            <div className="p-5 rounded-xl border border-slate-900 bg-slate-950 relative overflow-hidden flex flex-col gap-3">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
              
              <div className="flex items-center gap-2 font-mono text-xs text-red-400 border-b border-slate-900 pb-2">
                <AlertOctagon className="w-4 h-4" />
                <span>UNSOLVED QUANTUM DISASTER</span>
              </div>

              <h4 className="text-base font-semibold text-slate-200">
                Why does General Relativity break in Quantum Mechanics?
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <div className="p-3 bg-slate-900/30 border border-slate-800 rounded-lg">
                  <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
                    01. General Relativity (Einstein)
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Visualizes gravity as the smooth, continuous curvature of space-time fabric caused by mass. It operates with absolute geometric precision on smooth curves.
                  </p>
                </div>
                <div className="p-3 bg-slate-900/30 border border-slate-800 rounded-lg">
                  <span className="font-mono text-[10px] text-fuchsia-400 uppercase tracking-widest block mb-1">
                    02. Quantum Mechanics (Dirac/Feynman)
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Operates on chaotic, discrete fluctuations of fields at the Planck scale ($10^{-35}$ m). Particles exchange force-carrying bosons in packets (quanta).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-red-950/10 border border-red-900/30 text-xs text-slate-300 leading-relaxed flex gap-3">
                <HelpCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <strong className="text-red-400 font-mono">The Non-Renormalizability Loop Problem:</strong>
                  <p className="mt-1">
                    When physicists attempt to calculate gravitational interactions using Quantum Field Theory, they model gravity as exchanging massless spin-2 Gravitons. At very small scales, graviton-graviton self-interactions create infinitely repeating feedback loops. Unlike other forces (electromagnetic, weak, strong), these infinite values cannot be mathematically subtracted (renormalized), resulting in nonsense answers like "probability = infinity%."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FILE 2: Speculative Particles */}
        {activeTab === 'darkmatter' && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 animate-spin" /> Speculative Particle Database
              </h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Meet the prime candidates predicted by theories such as Quantum Gravity and Supersymmetry, currently being searched for at astronomical observatories and deep underground labs.
              </p>

              {/* Specs layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  {BSM_PARTICLES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedSparticle(p)}
                      id={`bsm-select-${p.id}`}
                      className={`p-3 text-left rounded-lg border cursor-pointer transition-all flex justify-between items-center ${
                        selectedSparticle.id === p.id
                          ? 'border-purple-500 bg-purple-950/20 text-purple-300'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">{p.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{p.role}</span>
                      </div>
                      <span className="font-mono text-base text-purple-400 font-bold bg-slate-900/80 w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center">
                        {p.symbol}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Particle description block */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 font-sans text-xs flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <span className="text-sm font-semibold text-purple-400 font-mono">
                        {selectedSparticle.name} ({selectedSparticle.symbol})
                      </span>
                      <span className="text-[9px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-500 uppercase tracking-widest leading-none">
                        Speculative
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-1 text-slate-400">
                      <div>Mass: <span className="text-slate-200">{selectedSparticle.mass}</span></div>
                      <div>Spin: <span className="text-slate-200">{selectedSparticle.spin}</span></div>
                    </div>

                    <p className="text-slate-300 mt-2 text-xs leading-relaxed">
                      {selectedSparticle.explanation}
                    </p>
                  </div>

                  <div className="mt-4 p-2.5 rounded bg-purple-950/10 border border-purple-900/20 font-mono text-[9px] text-purple-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <Binary className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Predicted by: {selectedSparticle.id === 'graviton' ? 'Superstring Theory / Quantum Gravity' : 'Supersymmetry'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FILE 3: Supersymmetry */}
        {activeTab === 'susy' && (
          <div className="flex flex-col gap-4">
            <div className="p-5 rounded-xl border border-slate-900 bg-slate-950 relative overflow-hidden flex flex-col gap-3">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
              
              <div className="flex items-center gap-2 font-mono text-xs text-indigo-400 border-b border-slate-900 pb-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>SUPERSYMMETRY UNIVERSE DUPLICATION</span>
              </div>

              <h4 className="text-base font-semibold text-slate-200">
                What is Supersymmetry (SUSY)?
              </h4>

              <p className="text-xs text-slate-400 leading-relaxed">
                Supersymmetry is a theoretical framework predicting that every elementary particle in the Standard Model has a heavy superpartner with a spin that differs by half a unit.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <div className="p-4 rounded bg-slate-900/30 border border-slate-800 leading-relaxed">
                  <h5 className="text-xs font-mono font-bold text-slate-300 mb-1">Standard Model</h5>
                  <p className="text-[11px] text-slate-400">
                    - Matter: Fermions (spin-1/2 like Electrons, Quarks)<br />
                    - Forces: Bosons (spin-1 like Photons, Gluons)
                  </p>
                </div>
                <div className="p-4 rounded bg-slate-900/30 border border-slate-800 leading-relaxed">
                  <h5 className="text-xs font-mono font-bold text-slate-300 mb-1">Speculative Superpartners</h5>
                  <p className="text-[11px] text-slate-400">
                    - Matter partners: Bosons (spin-0 like Selectrons, Squarks)<br />
                    - Force partners: Fermions (spin-1/2 like Photinos, Gluinos)
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-indigo-950/10 border border-indigo-900/30 text-xs text-slate-300 leading-relaxed">
                <h5 className="font-mono text-indigo-400 font-bold mb-1">Why SUSY solves major issues:</h5>
                <p>
                  1. **The Hierarchy Problem**: The Higgs boson\'s mass should theoretically explode to the Planck scale due to quantum corrections from massive particles. SUSY superpartners mathematically cancel out these quantum corrections exactly, keeping the Higgs stable.<br />
                  2. **Grand Unification**: Under SUSY, the strengths of the electromagnetic, weak, and strong nuclear forces converge perfectly at high energy scales, suggesting a single unified force.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
