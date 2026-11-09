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
import QuantumTunneling from './components/QuantumTunneling';
import StickySubNav, { LabTab } from './components/StickySubNav';

// Icon imports
import { Atom, Target, Zap } from 'lucide-react';

export default function App() {
  // Global State Orchestration
  const [isAntimatter, setIsAntimatter] = useState<boolean>(false);
  const [selectedParticle, setSelectedParticle] = useState<Particle>(PARTICLES[0]); // Default to Up Quark
  const [activeEpoch, setActiveEpoch] = useState<Epoch>(EPOCHS[5]); // Default to Present Era
  const [currentTab, setCurrentTab] = useState<LabTab>('hadron');
  const [isDetectorOpen, setIsDetectorOpen] = useState<boolean>(false);

  // Synchronize selected particle if it gets locked out during epoch changes
  const handleEpochChange = (epoch: Epoch) => {
    setActiveEpoch(epoch);
    if (epoch.unstableParticles.includes(selectedParticle.id)) {
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
      {/* Sleek Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none z-0" 
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${isAntimatter ? '#ec4899' : '#3b82f6'} 1.5px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />
      
      {/* 1. TOP SIMULATION CONTROL BAR & HEADER */}
      <header
        id="lab-header"
        className="w-full border-b border-white/10 px-4 md:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-3 bg-black/50 backdrop-blur-md z-30 sticky top-0"
      >
        {/* Brand */}
        <div className="flex items-center gap-3.5 select-none">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${isAntimatter ? 'from-pink-600 to-purple-600 shadow-[0_0_18px_rgba(236,72,153,0.4)]' : 'from-blue-600 to-violet-600 shadow-[0_0_18px_rgba(59,130,246,0.4)]'} flex items-center justify-center`}>
            <Atom className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight text-white uppercase italic leading-none flex items-center gap-1.5">
              Standard <span className={isAntimatter ? "text-pink-400" : "text-blue-400"}>Model</span>
              <span className="text-[9px] not-italic font-mono font-bold tracking-widest uppercase opacity-50 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ml-1.5">EXPLORER</span>
            </h1>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-1">
              Particle Physics Terminal
            </span>
          </div>
        </div>

        {/* Unified Simulation Control Bar */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          {/* Cosmic Epoch Filter */}
          <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-slate-400 uppercase hidden sm:inline">Epoch:</span>
            <select
              value={activeEpoch.id}
              onChange={(e) => {
                const found = EPOCHS.find((ep) => ep.id === e.target.value);
                if (found) handleEpochChange(found);
              }}
              id="unified-epoch-select"
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer pr-1 text-xs"
            >
              {EPOCHS.map((ep) => (
                <option key={ep.id} value={ep.id} className="bg-slate-900 text-slate-100">
                  {ep.name} ({ep.time})
                </option>
              ))}
            </select>
          </div>

          {/* Antimatter Symmetry Toggle */}
          <div className="flex items-center gap-2.5 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 select-none shadow-sm">
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              Antimatter
            </span>
            <button
              onClick={() => setIsAntimatter(!isAntimatter)}
              id="antimatter-symmetry-toggle"
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-white/20 transition-colors duration-200 focus:outline-none ${
                isAntimatter 
                  ? 'bg-pink-600 shadow-[0_0_10px_rgba(219,39,119,0.5)]' 
                  : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition duration-200 ease-in-out my-auto ml-0.5 mt-0.5 ${
                  isAntimatter ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`font-mono text-[10px] font-bold uppercase ${
                isAntimatter ? 'text-pink-400' : 'text-slate-400'
              }`}
            >
              {isAntimatter ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Cosmic Ray Detector Minigame Button */}
          <button
            onClick={() => setIsDetectorOpen(true)}
            id="open-detector-game-btn"
            className="px-3 py-1.5 bg-yellow-500/15 border border-yellow-500/60 text-yellow-400 hover:text-black hover:bg-yellow-400 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            <Target className="w-3.5 h-3.5 animate-pulse" />
            <span>Detect! [Cosmic Ray]</span>
          </button>
        </div>
      </header>

      {/* 2. STICKY SUB-NAVIGATION BAR (LABS 01 TO 05) */}
      <StickySubNav currentTab={currentTab} onSelectTab={setCurrentTab} isAntimatter={isAntimatter} />

      {/* 3. MAIN WORKSPACE AREA */}
      <main id="app-main" className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6 z-10">
        
        {/* UPPER PORTION: GRID + SLIDER + DIAGNOSTICS INSPECTOR */}
        <section id="model-grid-and-detail-pane" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT 2/3 COLUMN: PARTICLE GRID & COLLAPSIBLE TIMELINE */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            <ParticleGrid
              selectedParticle={selectedParticle}
              onSelectParticle={setSelectedParticle}
              isAntimatter={isAntimatter}
              activeEpoch={activeEpoch}
            />

            <TimelineSlider activeEpoch={activeEpoch} onEpochChange={handleEpochChange} />
          </div>

          {/* RIGHT 1/3 COLUMN: DIAGNOSTIC & INSPECTION PANEL */}
          <div className="lg:col-span-4 h-full">
            <DetailModal particle={selectedParticle} isAntimatter={isAntimatter} />
          </div>

        </section>

        {/* LOWER PORTION: TABBED INTERACTIVE SIMULATION LABS */}
        <section id="interactive-labs-panel" className="w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md scroll-mt-28">
          
          {/* Tab Headers */}
          <div className="flex border-b border-white/10 bg-black/40 select-none overflow-x-auto">
            <button
              onClick={() => setCurrentTab('hadron')}
              id="lab-tab-hadron"
              className={`flex-1 py-3.5 px-4 text-center font-mono font-bold text-xs uppercase tracking-wider cursor-pointer border-r border-white/10 border-b-2 transition-all shrink-0 ${
                currentTab === 'hadron'
                  ? isAntimatter
                    ? 'bg-pink-500/20 text-pink-300 border-b-pink-500'
                    : 'bg-blue-500/20 text-blue-300 border-b-blue-500'
                  : 'text-white/50 border-b-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              Lab 01: Hadron Assembly & Higgs Drag
            </button>
            <button
              onClick={() => setCurrentTab('feynman')}
              id="lab-tab-feynman"
              className={`flex-1 py-3.5 px-4 text-center font-mono font-bold text-xs uppercase tracking-wider cursor-pointer border-r border-white/10 border-b-2 transition-all shrink-0 ${
                currentTab === 'feynman'
                  ? isAntimatter
                    ? 'bg-pink-500/20 text-pink-300 border-b-pink-500'
                    : 'bg-blue-500/20 text-blue-300 border-b-blue-500'
                  : 'text-white/50 border-b-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              Lab 02: Feynman Diagram Canvas
            </button>
            <button
              onClick={() => setCurrentTab('bsm')}
              id="lab-tab-bsm"
              className={`flex-1 py-3.5 px-4 text-center font-mono font-bold text-xs uppercase tracking-wider cursor-pointer border-r border-white/10 border-b-2 transition-all shrink-0 ${
                currentTab === 'bsm'
                  ? isAntimatter
                    ? 'bg-pink-500/20 text-pink-300 border-b-pink-500'
                    : 'bg-blue-500/20 text-blue-300 border-b-blue-500'
                  : 'text-white/50 border-b-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              Lab 03: Beyond Standard Model
            </button>
            <button
              onClick={() => setCurrentTab('zoo')}
              id="lab-tab-zoo"
              className={`flex-1 py-3.5 px-4 text-center font-mono font-bold text-xs uppercase tracking-wider cursor-pointer border-r border-white/10 border-b-2 transition-all shrink-0 ${
                currentTab === 'zoo'
                  ? isAntimatter
                    ? 'bg-pink-500/20 text-pink-300 border-b-pink-500'
                    : 'bg-blue-500/20 text-blue-300 border-b-blue-500'
                  : 'text-white/50 border-b-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              Lab 04: The Particle Zoo
            </button>
            <button
              onClick={() => setCurrentTab('tunneling')}
              id="lab-tab-tunneling"
              className={`flex-1 py-3.5 px-4 text-center font-mono font-bold text-xs uppercase tracking-wider cursor-pointer border-b-2 transition-all shrink-0 ${
                currentTab === 'tunneling'
                  ? isAntimatter
                    ? 'bg-pink-500/20 text-pink-300 border-b-pink-500'
                    : 'bg-blue-500/20 text-blue-300 border-b-blue-500'
                  : 'text-white/50 border-b-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              Lab 05: Quantum Tunneling
            </button>
          </div>

          {/* Active Tab Workspace Container */}
          <div className="p-5 md:p-6">
            {currentTab === 'hadron' && <HadronBuilder isAntimatter={isAntimatter} />}
            {currentTab === 'feynman' && <FeynmanBuilder />}
            {currentTab === 'bsm' && <BSMExplorer />}
            {currentTab === 'zoo' && <ParticleZoo isAntimatter={isAntimatter} />}
            {currentTab === 'tunneling' && <QuantumTunneling />}
          </div>

        </section>

      </main>

      {/* CLOUD CHAMBER COSMIC RAY DETECTOR MODAL */}
      <CloudChamberGame isOpen={isDetectorOpen} onClose={() => setIsDetectorOpen(false)} />

      {/* LAB HUD FOOTER */}
      <footer id="lab-footer" className="w-full h-12 border-t border-white/10 bg-black/60 flex items-center px-4 md:px-8 justify-between text-[10px] uppercase font-mono font-semibold tracking-widest text-slate-400 select-none">
        <div>
          Status: <span className={isAntimatter ? "text-pink-400" : "text-emerald-400"}>Symmetry Conserved</span>
        </div>
        <div className="hidden md:block">
          Core: <span className={isAntimatter ? "text-pink-400" : "text-blue-400"}>LHCb & ALICE Invariant Terminal</span>
        </div>
        <div>CERN Standard Model V2.5</div>
      </footer>

    </div>
  );
}
