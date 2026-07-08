/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Particle } from '../types';
import ThreeInspector from './ThreeInspector';
import { Info, ShieldAlert, Sparkles, Zap, Shield, Atom } from 'lucide-react';

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

  // Map interaction strings to beautiful badges
  const renderInteractionBadge = (name: string) => {
    let color = 'bg-slate-900 border-slate-800 text-slate-400';
    if (name === 'Strong') color = 'bg-violet-950/20 border-violet-900/30 text-violet-400';
    if (name === 'Electromagnetic') color = 'bg-orange-950/20 border-orange-900/30 text-orange-400';
    if (name === 'Weak') color = 'bg-cyan-950/20 border-cyan-900/30 text-cyan-400';
    if (name === 'Higgs') color = 'bg-yellow-950/20 border-yellow-900/30 text-yellow-400';

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
      className="w-full flex flex-col p-5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md h-full justify-between gap-5 leading-normal"
    >
      
      {/* 3D Render Screen container */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-1">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-blue-400 uppercase tracking-widest leading-none mb-1">
              {particle.type} Class Diagnostic
            </span>
            <h3 className="text-lg font-bold text-slate-100 tracking-tight leading-tight">
              {displayName}
            </h3>
          </div>
          <div className="font-mono text-lg font-semibold text-blue-400 bg-black/40 px-3 py-1 rounded-lg border border-white/10 leading-none">
            {displaySymbol}
          </div>
        </div>

        {/* 3D Canvas component */}
        <ThreeInspector particle={particle} isAntimatter={isAntimatter} />

        {/* Interactive stats grid */}
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <div className="p-2.5 bg-black/20 border border-white/10 rounded-xl flex flex-col justify-center text-center">
            <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none mb-1">Mass</span>
            <span className="text-slate-100 font-semibold truncate leading-tight">{particle.mass}</span>
          </div>
          <div className="p-2.5 bg-black/20 border border-white/10 rounded-xl flex flex-col justify-center text-center">
            <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none mb-1">Charge</span>
            <span className="text-slate-100 font-semibold truncate leading-tight">{displayCharge}e</span>
          </div>
          <div className="p-2.5 bg-black/20 border border-white/10 rounded-xl flex flex-col justify-center text-center">
            <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none mb-1">Spin</span>
            <span className="text-slate-100 font-semibold truncate leading-tight">{particle.spin}</span>
          </div>
        </div>
      </div>

      {/* Narrative and Field interactions */}
      <div className="flex flex-col gap-4 mt-1">
        
        {/* Explanation text */}
        <div className="flex gap-2 items-start text-xs text-slate-300">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans">{particle.explanation}</p>
        </div>

        {/* Active physical interactions */}
        <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
          <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest leading-none">
            Active Quantum Interactions:
          </span>
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {particle.interactions.map((name) => renderInteractionBadge(name))}
          </div>
        </div>

        {/* Dynamic Physics Diagnostic Note (Dashed Border Option) */}
        <div className="p-3.5 border border-dashed border-white/20 rounded-xl bg-black/20 text-[10px] font-mono text-slate-400 leading-normal gap-1.5 flex flex-col">
          <div className="flex justify-between">
            <span>DIAG_STATUS:</span>
            <span className="text-emerald-400 font-bold">STABLE_FIELD</span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-1">
            <span>FIELD_SYMMETRY:</span>
            <span className={isAntimatter ? 'text-pink-400 font-bold' : 'text-blue-400 font-bold'}>
              {isAntimatter ? 'ANTI_SYMMETRIC' : 'SYMMETRIC_CHARGE'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
