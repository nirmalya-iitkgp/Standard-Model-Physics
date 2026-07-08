/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PARTICLES, EPOCHS } from './data/particles';
import { Particle, Epoch } from './types';

// Component imports
import ParticleGrid from './components/ParticleGrid';
import TimelineSlider from './components/TimelineSlider';
import DetailModal from './components/DetailModal';
import HadronBuilder from './components/HadronBuilder';
import FeynmanBuilder from './components/FeynmanBuilder';
import BSMExplorer from './components/BSMExplorer';
import CloudChamberGame from './components/CloudChamberGame';
import ParticleZoo from './components/ParticleZoo';

// Icon imports
import { Sparkles, Zap, Shield, Atom, Flame, Eye, RefreshCw, Target } from 'lucide-react';

export default function App() {
  // 1. Global State Orchestration
  const [isAntimatter, setIsAntimatter] = useState<boolean>(false);
  const [selectedParticle, setSelectedParticle] = useState<Particle>(PARTICLES[0]); // Default to Up Quark
  const [activeEpoch, setActiveEpoch] = useState<Epoch>(EPOCHS[5]); // Default to Present Era
  const [currentTab, setCurrentTab] = useState<'hadron' | 'feynman' | 'bsm' | 'zoo'>('hadron');
  const [isDetectorOpen, setIsDetectorOpen] = useState<boolean>(false);

  // Synchronize selected particle if it gets locked out during epoch dragging
  const handleEpochChange = (epoch: Epoch) => {
    setActiveEpoch(epoch);
    if (epoch.unstableParticles.includes(selectedParticle.id)) {
      // Switch selection to a standard stable particle in that epoch (e.g., photon)
      const available = PARTICLES.find((p) => !epoch.unstableParticles.includes(p.id));
      if (available) {
        setSelectedParticle(available);
      }
    }
  };

  return (
    <div
      id="app-root-container"
      className={`min-h-screen ${
        isAntimatter ? 'bg-[#0a050d] text-pink-100' : 'bg-[#050810] text-slate-100'
      } flex flex-col transition-colors duration-500 overflow-x-hidden relative`}
      style={{
        fontFamily: '"Inter", system-ui, sans-serif',
      }}
    >
      {/* Dynamic Sleek Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none z-0" 
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${isAntimatter ? '#ec4899' : '#3b82f6'} 1.5px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* 1. FUTURISTIC HUD LAB HEADER */}
      <header
        id="lab-header"
        className="w-full border-b border-white/10 px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-black/40 backdrop-blur-md z-30 sticky top-0"
      >
        <div className="flex items-center gap-4 select-none">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${isAntimatter ? 'from-pink-600 to-purple-600 shadow-[0_0_20px_rgba(236,72,153,0.4)]' : 'from-blue-600 to-violet-600 shadow-[0_0_20px_rgba(59,130,246,0.4)]'} flex items-center justify-center`}>
            <Atom className="w-6 h-6 text-slate-100 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none flex items-center gap-1.5">
              Standard <span className={isAntimatter ? "text-pink-400" : "text-blue-400"}>Model</span>
              <span className="text-[9px] not-italic font-bold tracking-widest uppercase opacity-40 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ml-2">EXPLORER</span>
            </h1>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-1">
              Quantum Physics Exploration Terminal
            </span>
          </div>
        </div>

        {/* Global Controls Row */}
        <div className="flex flex-wrap items-center gap-4 z-10">
          
          {/* Floating mini-game detector button matching 'Sleek Interface' styles */}
          <button
            onClick={() => setIsDetectorOpen(true)}
            id="open-detector-game-btn"
            className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all hover:bg-yellow-500 hover:text-black hover:scale-105 active:scale-95"
          >
            <Target className="w-3.5 h-3.5 animate-pulse" />
            <span>Detect! [Cosmic Ray]</span>
          </button>

          {/* Glowing Antimatter Toggle Switch with pill shape */}
          <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 select-none transition-all duration-300 hover:bg-white/10">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
              Antimatter
            </span>
            <button
              onClick={() => setIsAntimatter(!isAntimatter)}
              id="antimatter-symmetry-toggle"
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                isAntimatter 
                  ? 'bg-pink-950 shadow-[0_0_10px_rgba(219,39,119,0.5)]' 
                  : 'bg-blue-950 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${
                  isAntimatter ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`font-mono text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                isAntimatter ? 'text-pink-400' : 'text-blue-400'
              }`}
            >
              {isAntimatter ? 'ACTIVE' : 'OFF'}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-[9px] font-mono text-slate-500 leading-none">
            <span className={`w-2 h-2 ${isAntimatter ? 'bg-pink-500' : 'bg-emerald-500'} rounded-full animate-ping`}></span>
            <span>BEAM_ACTIVE</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER AREA */}
      <main id="app-main" className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6 z-10">
        
        {/* UPPER PORTION: GRID + SLIDER + HOLOGRAPHIC SIDEBAR PANEL */}
        <section id="model-grid-and-detail-pane" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT 2/3 COLUMN: GRID & TIMELINE */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <ParticleGrid
              selectedParticle={selectedParticle}
              onSelectParticle={setSelectedParticle}
              isAntimatter={isAntimatter}
              activeEpoch={activeEpoch}
            />

            <TimelineSlider activeEpoch={activeEpoch} onEpochChange={handleEpochChange} />
          </div>

          {/* RIGHT 1/3 COLUMN: HOLOGRAPHIC DETAIL BAR */}
          <div className="lg:col-span-4 h-full">
            <DetailModal particle={selectedParticle} isAntimatter={isAntimatter} />
          </div>

        </section>

        {/* LOWER PORTION: TABBED INTERACTIVE SIMULATION LABS */}
        <section id="interactive-labs-panel" className="w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
          
          {/* Tab Headers */}
          <div className="flex border-b border-white/10 bg-black/40 select-none">
            <button
              onClick={() => setCurrentTab('hadron')}
              id="lab-tab-hadron"
              className={`flex-1 py-4 px-4 text-center font-bold text-xs uppercase tracking-wider cursor-pointer border-r border-white/10 border-b-2 transition-all duration-300 ${
                currentTab === 'hadron'
                  ? isAntimatter
                    ? 'bg-pink-500/20 text-pink-400 border-b-pink-500'
                    : 'bg-blue-500/20 text-blue-400 border-b-blue-500'
                  : 'text-white/50 border-b-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              Lab 01: Hadron Assembly & Higgs Drag
            </button>
            <button
              onClick={() => setCurrentTab('feynman')}
              id="lab-tab-feynman"
              className={`flex-1 py-4 px-4 text-center font-bold text-xs uppercase tracking-wider cursor-pointer border-r border-white/10 border-b-2 transition-all duration-300 ${
                currentTab === 'feynman'
                  ? isAntimatter
                    ? 'bg-pink-500/20 text-pink-400 border-b-pink-500'
                    : 'bg-blue-500/20 text-blue-400 border-b-blue-500'
                  : 'text-white/50 border-b-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              Lab 02: Feynman Diagram Canvas
            </button>
            <button
              onClick={() => setCurrentTab('bsm')}
              id="lab-tab-bsm"
              className={`flex-1 py-4 px-4 text-center font-bold text-xs uppercase tracking-wider cursor-pointer border-r border-white/10 border-b-2 transition-all duration-300 ${
                currentTab === 'bsm'
                  ? isAntimatter
                    ? 'bg-pink-500/20 text-pink-400 border-b-pink-500'
                    : 'bg-blue-500/20 text-blue-400 border-b-blue-500'
                  : 'text-white/50 border-b-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              Lab 03: Beyond Standard Model (BSM)
            </button>
            <button
              onClick={() => setCurrentTab('zoo')}
              id="lab-tab-zoo"
              className={`flex-1 py-4 px-4 text-center font-bold text-xs uppercase tracking-wider cursor-pointer border-b-2 transition-all duration-300 ${
                currentTab === 'zoo'
                  ? isAntimatter
                    ? 'bg-pink-500/20 text-pink-400 border-b-pink-500'
                    : 'bg-blue-500/20 text-blue-400 border-b-blue-500'
                  : 'text-white/50 border-b-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              Lab 04: The Particle Zoo
            </button>
          </div>

          {/* Active Tab Workspace Container */}
          <div className="p-6">
            {currentTab === 'hadron' && <HadronBuilder isAntimatter={isAntimatter} />}
            {currentTab === 'feynman' && <FeynmanBuilder />}
            {currentTab === 'bsm' && <BSMExplorer />}
            {currentTab === 'zoo' && <ParticleZoo isAntimatter={isAntimatter} />}
          </div>

        </section>

      </main>

      {/* COSMIC RAY DETECTOR CHAMBER MINI-GAME OVERLAY MODAL */}
      <CloudChamberGame isOpen={isDetectorOpen} onClose={() => setIsDetectorOpen(false)} />

      {/* FUTURISTIC HUD LAB FOOTER */}
      <footer id="lab-footer" className="w-full h-12 border-t border-white/10 bg-black/60 flex items-center px-8 justify-between text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 select-none">
        <div>
          Status: <span className={isAntimatter ? "text-pink-500" : "text-green-500"}>Symmetry Conserved</span>
        </div>
        <div className="hidden md:block">
          Lab Core: <span className={isAntimatter ? "text-pink-400" : "text-blue-400"}>LHC-ALICE Node 4</span>
        </div>
        <div>Reference: CERN Standard V2.4</div>
      </footer>

    </div>
  );
}
