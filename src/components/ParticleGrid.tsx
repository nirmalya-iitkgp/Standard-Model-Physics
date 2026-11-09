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
  
  // Categorize particles for structured grid columns
  const upQuarks = PARTICLES.filter((p) => p.type === 'quark' && ['up', 'charm', 'top'].includes(p.id));
  const downQuarks = PARTICLES.filter((p) => p.type === 'quark' && ['down', 'strange', 'bottom'].includes(p.id));
  const chargedLeptons = PARTICLES.filter((p) => p.type === 'lepton' && ['electron', 'muon', 'tau'].includes(p.id));
  const neutralLeptons = PARTICLES.filter((p) => p.type === 'lepton' && ['ele_neutrino', 'mu_neutrino', 'tau_neutrino'].includes(p.id));
  const gaugeBosons = PARTICLES.filter((p) => p.type === 'boson');
  const higgsBoson = PARTICLES.filter((p) => p.type === 'higgs')[0];

  // Check if particle is dissolved in active cosmic epoch
  const isLockedInEpoch = (p: Particle) => {
    return activeEpoch.unstableParticles.includes(p.id);
  };

  const renderParticleCard = (p: Particle) => {
    const isSelected = selectedParticle.id === p.id;
    const isLocked = isLockedInEpoch(p);

    // Dynamic styling per category
    let categoryBorder = 'border-slate-800';
    let hoverBorder = 'hover:border-slate-500';
    let textGlow = '';
    let categoryBg = 'bg-slate-900/40';
    let hoverShadow = 'hover:shadow-blue-500/10';

    if (!isLocked) {
      if (p.type === 'quark') {
        categoryBorder = isSelected 
          ? 'border-violet-500 ring-2 ring-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
          : 'border-violet-500/25';
        hoverBorder = 'hover:border-violet-400 hover:bg-violet-500/15';
        textGlow = 'text-violet-400 font-bold';
        categoryBg = isSelected ? 'bg-violet-500/20' : 'bg-violet-950/20';
        hoverShadow = 'hover:shadow-violet-500/20';
      } else if (p.type === 'lepton') {
        categoryBorder = isSelected 
          ? 'border-cyan-500 ring-2 ring-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
          : 'border-cyan-500/25';
        hoverBorder = 'hover:border-cyan-400 hover:bg-cyan-500/15';
        textGlow = 'text-cyan-400 font-bold';
        categoryBg = isSelected ? 'bg-cyan-500/20' : 'bg-cyan-950/20';
        hoverShadow = 'hover:shadow-cyan-500/20';
      } else if (p.type === 'boson') {
        categoryBorder = isSelected 
          ? 'border-orange-500 ring-2 ring-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.5)]' 
          : 'border-orange-500/25';
        hoverBorder = 'hover:border-orange-400 hover:bg-orange-500/15';
        textGlow = 'text-orange-400 font-bold';
        categoryBg = isSelected ? 'bg-orange-500/20' : 'bg-orange-950/20';
        hoverShadow = 'hover:shadow-orange-500/20';
      } else if (p.type === 'higgs') {
        categoryBorder = isSelected 
          ? 'border-yellow-500 ring-2 ring-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.6)]' 
          : 'border-yellow-500/25';
        hoverBorder = 'hover:border-yellow-400 hover:bg-yellow-500/15';
        textGlow = 'text-yellow-400 font-bold';
        categoryBg = isSelected ? 'bg-yellow-500/20' : 'bg-yellow-950/20';
        hoverShadow = 'hover:shadow-yellow-500/20';
      }
    }

    const displaySymbol = isAntimatter ? p.antiSymbol : p.symbol;
    const displayName = isAntimatter ? p.antiName : p.name;
    const rawCharge = isAntimatter ? -p.charge : p.charge;

    // Clean charge formatting
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
        className={`relative flex flex-col justify-between p-3 rounded-xl border ${categoryBg} ${categoryBorder} ${
          isLocked
            ? 'opacity-25 bg-slate-950/60 cursor-not-allowed border-slate-950/30'
            : `cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${hoverShadow} ${hoverBorder} active:translate-y-0 active:scale-[0.99]`
        } text-left select-none overflow-hidden h-28 group`}
      >
        {/* Top Header: Big prioritized symbol on left + consolidated metadata chip on right */}
        <div className="flex justify-between items-start w-full">
          <div className={`font-mono text-2xl font-bold tracking-tight leading-none ${textGlow}`}>
            {displaySymbol}
          </div>
          {/* Consolidated metadata chip */}
          <div className="px-2 py-0.5 rounded bg-black/50 border border-white/10 text-[9px] font-mono text-slate-300 flex items-center gap-1 shadow-sm shrink-0">
            <span>{displayCharge}e</span>
            <span className="text-slate-600">•</span>
            <span>s={p.spin}</span>
          </div>
        </div>

        {/* Quieter Sub-row: Full name and mass */}
        <div className="w-full mt-auto">
          <div className="text-xs font-semibold text-slate-200 truncate leading-tight group-hover:text-white transition-colors">
            {displayName}
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mt-1 leading-none">
            <span className="capitalize">{p.type}</span>
            <span className="text-slate-400 font-medium">{p.mass}</span>
          </div>
        </div>

        {/* Lock Overlay for dissolved epoch */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-[1px]">
            <Lock className="w-4 h-4 text-slate-400 mb-0.5" />
            <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest leading-none">
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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-[10px] text-slate-300">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_6px_rgba(139,92,246,0.6)]"></span>
            <span>Quarks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.6)]"></span>
            <span>Leptons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.6)]"></span>
            <span>Gauge Bosons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.6)]"></span>
            <span>Higgs Boson</span>
          </div>
        </div>
        <div className="text-[9px] text-slate-400 font-mono">
          Click any card to inspect quantum states and decay pathways
        </div>
      </div>

      {/* Responsive Grid Scaling across viewports */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Quarks Column 1: Up Charge */}
        <div className="flex flex-col gap-2.5">
          <div className="text-[10px] font-mono text-violet-400 uppercase tracking-wider text-center border-b border-violet-900/50 pb-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>Quarks (+2/3)</span>
          </div>
          <div className="grid grid-rows-3 gap-2.5">
            {upQuarks.map((p) => renderParticleCard(p))}
          </div>
        </div>

        {/* Quarks Column 2: Down Charge */}
        <div className="flex flex-col gap-2.5">
          <div className="text-[10px] font-mono text-violet-400 uppercase tracking-wider text-center border-b border-violet-900/50 pb-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>Quarks (-1/3)</span>
          </div>
          <div className="grid grid-rows-3 gap-2.5">
            {downQuarks.map((p) => renderParticleCard(p))}
          </div>
        </div>

        {/* Leptons Column 3: Charged */}
        <div className="flex flex-col gap-2.5">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider text-center border-b border-cyan-900/50 pb-1 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>Leptons (-1)</span>
          </div>
          <div className="grid grid-rows-3 gap-2.5">
            {chargedLeptons.map((p) => renderParticleCard(p))}
          </div>
        </div>

        {/* Leptons Column 4: Neutrinos */}
        <div className="flex flex-col gap-2.5">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider text-center border-b border-cyan-900/50 pb-1 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>Neutrinos (0)</span>
          </div>
          <div className="grid grid-rows-3 gap-2.5">
            {neutralLeptons.map((p) => renderParticleCard(p))}
          </div>
        </div>

        {/* Bosons Column 5: Gauge carriers */}
        <div className="flex flex-col gap-2.5 sm:col-span-1">
          <div className="text-[10px] font-mono text-orange-400 uppercase tracking-wider text-center border-b border-orange-900/50 pb-1 flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-orange-400" />
            <span>Gauge Bosons</span>
          </div>
          <div className="flex flex-col gap-2.5 h-full justify-between">
            {gaugeBosons.map((p) => renderParticleCard(p))}
          </div>
        </div>

        {/* Higgs Column 6: Scalar Boson + Generation info */}
        <div className="flex flex-col gap-2.5 sm:col-span-1">
          <div className="text-[10px] font-mono text-yellow-400 uppercase tracking-wider text-center border-b border-yellow-900/50 pb-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
            <span>Scalar Boson</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {renderParticleCard(higgsBoson)}
            <div className="hidden lg:flex flex-col p-3 rounded-xl border border-white/10 bg-black/30 text-[10px] font-mono text-slate-400 leading-normal gap-1 h-44 justify-center">
              <span><strong className="text-slate-200">GEN 1</strong>: Everyday matter (u, d, e⁻, νe)</span>
              <span><strong className="text-slate-200">GEN 2</strong>: Cosmic shower (c, s, μ⁻, νμ)</span>
              <span><strong className="text-slate-200">GEN 3</strong>: High-energy tier (t, b, τ⁻, ντ)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
