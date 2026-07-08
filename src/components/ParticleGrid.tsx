/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Particle, Epoch } from '../types';
import { PARTICLES } from '../data/particles';
import { Lock, Zap, Shield, Sparkles } from 'lucide-react';

interface ParticleGridProps {
  selectedParticle: Particle;
  onSelectParticle: (p: Particle) => void;
  isAntimatter: boolean;
  activeEpoch: Epoch;
}

export default function ParticleGrid({
  selectedParticle,
  onSelectParticle,
  isAntimatter,
  activeEpoch,
}: ParticleGridProps) {
  
  // Categorize particles for structured grid layout
  const upQuarks = PARTICLES.filter((p) => p.type === 'quark' && ['up', 'charm', 'top'].includes(p.id));
  const downQuarks = PARTICLES.filter((p) => p.type === 'quark' && ['down', 'strange', 'bottom'].includes(p.id));
  const chargedLeptons = PARTICLES.filter((p) => p.type === 'lepton' && ['electron', 'muon', 'tau'].includes(p.id));
  const neutralLeptons = PARTICLES.filter((p) => p.type === 'lepton' && ['ele_neutrino', 'mu_neutrino', 'tau_neutrino'].includes(p.id));
  const gaugeBosons = PARTICLES.filter((p) => p.type === 'boson');
  const higgsBoson = PARTICLES.filter((p) => p.type === 'higgs')[0];

  // Helper to check if a particle is unstable / cannot exist in the active epoch
  const isLockedInEpoch = (p: Particle) => {
    return activeEpoch.unstableParticles.includes(p.id);
  };

  const renderParticleCard = (p: Particle) => {
    const isSelected = selectedParticle.id === p.id;
    const isLocked = isLockedInEpoch(p);

    // Dynamic styles based on state & category
    let categoryBorder = 'border-slate-800';
    let hoverBorder = 'hover:border-slate-500';
    let textGlow = '';
    let categoryBg = 'bg-slate-900/40';

    if (!isLocked) {
      if (p.type === 'quark') {
        categoryBorder = isSelected 
          ? 'border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.6)]' 
          : 'border-violet-500/30';
        hoverBorder = 'hover:border-violet-400 hover:bg-violet-500/20';
        textGlow = 'text-violet-400 font-bold';
        categoryBg = isSelected ? 'bg-violet-500/20' : 'bg-violet-500/10';
      } else if (p.type === 'lepton') {
        categoryBorder = isSelected 
          ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)]' 
          : 'border-cyan-500/30';
        hoverBorder = 'hover:border-cyan-400 hover:bg-cyan-500/20';
        textGlow = 'text-cyan-400 font-bold';
        categoryBg = isSelected ? 'bg-cyan-500/20' : 'bg-cyan-500/10';
      } else if (p.type === 'boson') {
        categoryBorder = isSelected 
          ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.6)]' 
          : 'border-orange-500/30';
        hoverBorder = 'hover:border-orange-400 hover:bg-orange-500/20';
        textGlow = 'text-orange-400 font-bold';
        categoryBg = isSelected ? 'bg-orange-500/20' : 'bg-orange-500/10';
      } else if (p.type === 'higgs') {
        categoryBorder = isSelected 
          ? 'border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.7)]' 
          : 'border-yellow-500/30';
        hoverBorder = 'hover:border-yellow-400 hover:bg-yellow-500/20';
        textGlow = 'text-yellow-400 font-bold';
        categoryBg = isSelected ? 'bg-yellow-500/20' : 'bg-yellow-500/10';
      }
    }

    const displaySymbol = isAntimatter ? p.antiSymbol : p.symbol;
    const displayName = isAntimatter ? p.antiName : p.name;
    // Calculate mathematically reversed charge
    const rawCharge = isAntimatter ? -p.charge : p.charge;
    // Format charge cleanly (e.g. +2/3, -1/3, -1, 0)
    let displayCharge = '0';
    if (rawCharge !== 0) {
      const sign = rawCharge > 0 ? '+' : '-';
      const abs = Math.abs(rawCharge);
      if (Math.abs(abs - 2/3) < 0.01) {
        displayCharge = `${sign}2/3`;
      } else if (Math.abs(abs - 1/3) < 0.01) {
        displayCharge = `${sign}1/3`;
      } else {
        displayCharge = `${sign}${Math.round(abs)}`;
      }
    }

    return (
      <button
        key={p.id}
        id={`particle-card-${p.id}`}
        disabled={isLocked}
        onClick={() => onSelectParticle(p)}
        className={`relative flex flex-col p-3 rounded-xl border ${categoryBg} ${categoryBorder} ${
          isLocked ? 'opacity-25 bg-slate-950/60 cursor-not-allowed border-slate-950/30' : `cursor-pointer transition-all duration-300 ${hoverBorder}`
        } text-left select-none overflow-hidden h-28 group`}
      >
        {/* Background Subtle Gradient */}
        {!isLocked && (
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${
              p.type === 'quark'
                ? 'from-violet-600/30'
                : p.type === 'lepton'
                ? 'from-cyan-600/30'
                : p.type === 'boson'
                ? 'from-orange-600/30'
                : 'from-yellow-600/30'
            } to-transparent`}
          />
        )}

        {/* Top Header: Symbol & Charge/Spin */}
        <div className="flex justify-between items-start w-full">
          <div className={`font-mono text-xl font-semibold tracking-wide ${textGlow}`}>
            {displaySymbol}
          </div>
          <div className="flex flex-col items-end text-[9px] font-mono text-slate-400">
            <span>Q: {displayCharge}</span>
            <span>S: {p.spin}</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Footer: Name & Mass */}
        <div className="w-full">
          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-0.5 leading-none">
            {p.type}
          </div>
          <div className="text-xs font-medium text-slate-200 truncate leading-none mb-1">
            {displayName}
          </div>
          <div className="text-[9px] font-mono text-slate-400 truncate leading-none">
            {p.mass}
          </div>
        </div>

        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[1px]">
            <Lock className="w-4 h-4 text-slate-500 mb-1" />
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">
              DISSOLVED
            </span>
          </div>
        )}
      </button>
    );
  };

  return (
    <div id="particle-grid-section" className="w-full flex flex-col">
      
      {/* Legend Block */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-[10px] text-slate-300">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500/80 shadow-[0_0_6px_rgba(139,92,246,0.6)]"></span>
            <span>Quarks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/80 shadow-[0_0_6px_rgba(6,182,212,0.6)]"></span>
            <span>Leptons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500/80 shadow-[0_0_6px_rgba(249,115,22,0.6)]"></span>
            <span>Gauge Bosons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_6px_rgba(234,179,8,0.6)]"></span>
            <span>Higgs Boson</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>Epoch Filter: <span className="text-slate-200 font-semibold">{activeEpoch.name}</span></span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Quarks Column 1: Up Charge */}
        <div className="flex flex-col gap-3.5">
          <div className="text-[10px] font-mono text-violet-400 uppercase tracking-widest text-center border-b border-violet-950 pb-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-500" />
            <span>Quarks (+2/3)</span>
          </div>
          <div className="grid grid-rows-3 gap-3">
            {upQuarks.map((p) => renderParticleCard(p))}
          </div>
        </div>

        {/* Quarks Column 2: Down Charge */}
        <div className="flex flex-col gap-3.5">
          <div className="text-[10px] font-mono text-violet-400 uppercase tracking-widest text-center border-b border-violet-950 pb-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-500" />
            <span>Quarks (-1/3)</span>
          </div>
          <div className="grid grid-rows-3 gap-3">
            {downQuarks.map((p) => renderParticleCard(p))}
          </div>
        </div>

        {/* Leptons Column 3: Charged */}
        <div className="flex flex-col gap-3.5">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest text-center border-b border-cyan-950 pb-1 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-cyan-500" />
            <span>Leptons (-1)</span>
          </div>
          <div className="grid grid-rows-3 gap-3">
            {chargedLeptons.map((p) => renderParticleCard(p))}
          </div>
        </div>

        {/* Leptons Column 4: Neutrinos */}
        <div className="flex flex-col gap-3.5">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest text-center border-b border-cyan-950 pb-1 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-cyan-500" />
            <span>Neutrinos (0)</span>
          </div>
          <div className="grid grid-rows-3 gap-3">
            {neutralLeptons.map((p) => renderParticleCard(p))}
          </div>
        </div>

        {/* Bosons Column 5: Gauge carriers */}
        <div className="flex flex-col gap-3.5 md:col-span-2 lg:col-span-1">
          <div className="text-[10px] font-mono text-orange-400 uppercase tracking-widest text-center border-b border-orange-950 pb-1 flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-orange-500" />
            <span>Gauge Bosons</span>
          </div>
          <div className="flex flex-col gap-3 h-full justify-between">
            {gaugeBosons.map((p) => renderParticleCard(p))}
          </div>
        </div>

        {/* Higgs Column 6: Higgs mechanism */}
        <div className="flex flex-col gap-3.5 md:col-span-1">
          <div className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest text-center border-b border-yellow-950 pb-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />
            <span>Scalar Boson</span>
          </div>
          <div className="flex flex-col gap-3">
            {renderParticleCard(higgsBoson)}
            <div className="hidden lg:flex flex-col p-3.5 rounded-xl border border-white/10 bg-black/20 text-[10px] font-mono text-slate-400 leading-normal gap-1.5 h-44 justify-center">
              <span><strong className="text-slate-200">GEN 1</strong>: Everyday matter (Up, Down, Electron, νe)</span>
              <span><strong className="text-slate-200">GEN 2</strong>: Cosmic shower (Charm, Strange, Muon, νμ)</span>
              <span><strong className="text-slate-200">GEN 3</strong>: Collider tier (Top, Bottom, Tau, ντ)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
