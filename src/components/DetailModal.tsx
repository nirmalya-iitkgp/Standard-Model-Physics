/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Particle } from '../types';
import ThreeInspector from './ThreeInspector';
import DecayVisualizer from './DecayVisualizer';
import { Info, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface DetailModalProps {
  particle: Particle;
  isAntimatter: boolean;
}

export default function DetailModal({ particle, isAntimatter }: DetailModalProps) {
  const displaySymbol = isAntimatter ? particle.antiSymbol : particle.symbol;
  const displayName = isAntimatter ? particle.antiName : particle.name;
  
  // Mathematically reversed charge in antimatter mode
  const rawCharge = isAntimatter ? -particle.charge : particle.charge;
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

  // Map interaction strings to compact chips
  const renderInteractionBadge = (name: string) => {
    let color = 'bg-slate-900 border-slate-800 text-slate-400';
    if (name === 'Strong') color = 'bg-violet-950/40 border-violet-800/40 text-violet-300';
    if (name === 'Electromagnetic') color = 'bg-orange-950/40 border-orange-800/40 text-orange-300';
    if (name === 'Weak') color = 'bg-cyan-950/40 border-cyan-800/40 text-cyan-300';
    if (name === 'Higgs') color = 'bg-yellow-950/40 border-yellow-800/40 text-yellow-300';

    return (
      <span
        key={name}
        className={`px-2 py-0.5 rounded border text-[10px] font-mono leading-none flex items-center gap-1 uppercase tracking-wider ${color}`}
      >
        <Zap className="w-2.5 h-2.5" />
        {name}
      </span>
    );
  };

  return (
    <div
      id="particle-holographic-inspector"
      className="w-full flex flex-col p-5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md gap-4 leading-normal"
    >
      {/* 1. Header with Name & Symbol */}
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <div className="flex flex-col">
          <span className="font-mono text-[9px] text-blue-400 uppercase tracking-widest leading-none mb-1">
            {particle.type} Diagnostic
          </span>
          <h3 className="text-lg font-bold text-slate-100 tracking-tight leading-tight">
            {displayName}
          </h3>
        </div>
        <div className="font-mono text-xl font-bold text-blue-400 bg-black/50 px-3.5 py-1 rounded-lg border border-white/10 leading-none">
          {displaySymbol}
        </div>
      </div>

      {/* 2. Top Metric Strip: Fixed horizontal strip for key constants */}
      <div className="grid grid-cols-4 gap-2 font-mono text-xs">
        <div className="p-2 bg-black/40 border border-white/10 rounded-lg flex flex-col justify-center text-center">
          <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none mb-1">Mass</span>
          <span className="text-slate-100 font-semibold truncate leading-tight">{particle.mass}</span>
        </div>
        <div className="p-2 bg-black/40 border border-white/10 rounded-lg flex flex-col justify-center text-center">
          <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none mb-1">Charge</span>
          <span className="text-slate-100 font-semibold truncate leading-tight">{displayCharge}e</span>
        </div>
        <div className="p-2 bg-black/40 border border-white/10 rounded-lg flex flex-col justify-center text-center">
          <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none mb-1">Spin</span>
          <span className="text-slate-100 font-semibold truncate leading-tight">{particle.spin}</span>
        </div>
        <div className="p-2 bg-black/40 border border-white/10 rounded-lg flex flex-col justify-center text-center">
          <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none mb-1">Lifetime</span>
          <span className="text-slate-100 font-semibold truncate leading-tight text-[10px]">
            {particle.isStable ? 'Stable' : (particle.lifetime || 'Unstable')}
          </span>
        </div>
      </div>

      {/* 3. 3D Particle Inspector Canvas */}
      <ThreeInspector particle={particle} isAntimatter={isAntimatter} />

      {/* 4. Visual Symmetry Indicators: Color-coded status badges */}
      <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
            Field Symmetry & Invariance
          </span>
          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
            isAntimatter
              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            {isAntimatter ? 'CPT Conjugated' : 'Standard Metric'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {/* CPT Symmetry */}
          <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5 text-[10px] font-mono">
            <span className="text-slate-300">CPT Theorem</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> Conserved
            </span>
          </div>

          {/* Gauge Group Symmetry */}
          <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5 text-[10px] font-mono">
            <span className="text-slate-300">
              {particle.type === 'quark' || particle.id === 'gluon' ? 'Color SU(3)' : 'Electroweak'}
            </span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> Conserved
            </span>
          </div>

          {/* Parity & Electroweak */}
          {particle.symmetries && particle.symmetries.length > 0 ? (
            particle.symmetries.slice(0, 2).map((sym, idx) => (
              <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5 text-[10px] font-mono">
                <span className="text-slate-300 truncate max-w-[90px]">{sym.name}</span>
                <span className={`flex items-center gap-1 font-semibold ${
                  sym.status === 'conserved' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {sym.status === 'conserved' ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {sym.status === 'conserved' ? 'Conserved' : 'Broken'}
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5 text-[10px] font-mono">
              <span className="text-slate-300">Gauge Invariance</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Exact
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 5. Decay Channel Visualizer: Interactive decay tree for unstable, ground state for stable */}
      <DecayVisualizer particle={particle} isAntimatter={isAntimatter} />

      {/* 6. Concrete Physical Explanation & Active Interactions */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex gap-2 items-start text-xs text-slate-300">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans">{particle.explanation}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-white/10">
          <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">
            Forces:
          </span>
          {particle.interactions.map((name) => renderInteractionBadge(name))}
        </div>
      </div>
    </div>
  );
}
