/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Particle, DecayChannel } from '../types';
import { ShieldCheck, GitFork, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface DecayVisualizerProps {
  particle: Particle;
  isAntimatter: boolean;
}

export default function DecayVisualizer({ particle, isAntimatter }: DecayVisualizerProps) {
  const displaySymbol = isAntimatter ? particle.antiSymbol : particle.symbol;
  const channels = particle.decayChannels || [];
  const [activeChannelIdx, setActiveChannelIdx] = useState<number>(0);

  // If particle is stable
  if (particle.isStable || channels.length === 0) {
    return (
      <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-xs font-semibold text-emerald-300">
              Ground State • Stable Particle
            </span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400/80 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-500/20">
            τ = {particle.lifetime || 'Infinite'}
          </span>
        </div>

        {/* Stability visual representation */}
        <div className="relative h-14 rounded-lg bg-black/40 border border-emerald-500/20 flex items-center justify-center overflow-hidden">
          {/* Subtle concentric wave */}
          <div className="absolute w-20 h-20 rounded-full border border-emerald-500/20 animate-ping opacity-30" />
          <div className="flex items-center gap-3 z-10">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-sm font-bold flex items-center justify-center">
              {displaySymbol}
            </span>
            <div className="flex flex-col text-left">
              <span className="font-mono text-[11px] text-slate-200 font-medium">No Open Decay Channels</span>
              <span className="text-[10px] text-slate-400">Strictly protected by gauge & quantum number conservation</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeChannel: DecayChannel = channels[activeChannelIdx] || channels[0];

  return (
    <div className="p-3.5 rounded-xl border border-white/10 bg-black/30 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono text-xs text-amber-400 font-semibold">
          <GitFork className="w-3.5 h-3.5 text-amber-400" />
          <span>Decay Tree & Transition Paths</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
          τ ≈ {particle.lifetime || '10⁻¹² s'}
        </span>
      </div>

      {/* Visual Decay Tree Canvas */}
      <div className="relative p-3 rounded-lg bg-black/50 border border-white/10 flex flex-col gap-2.5">
        {/* Parent particle to products visual diagram */}
        <div className="flex items-center justify-between gap-3">
          {/* Parent Node */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-mono text-sm font-bold flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              {displaySymbol}
            </div>
            <span className="font-mono text-[9px] text-slate-400 mt-1 uppercase">Parent</span>
          </div>

          {/* Mediator / Vector Transition */}
          <div className="flex-1 flex flex-col items-center px-1">
            <div className="flex items-center gap-1 text-[9px] font-mono text-amber-400/90 mb-1">
              <Zap className="w-2.5 h-2.5" />
              <span>{activeChannel.mediator || 'Weak Transition'}</span>
            </div>
            <div className="w-full flex items-center">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 relative">
                <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400 rotate-45" />
              </div>
            </div>
            <span className="font-mono text-[9px] text-cyan-400 font-semibold mt-1">
              {activeChannel.branchingRatio} BR
            </span>
          </div>

          {/* Product Nodes */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              {activeChannel.products.map((prod, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-full bg-cyan-950/40 border border-cyan-400/80 text-cyan-200 font-mono text-xs font-bold flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                >
                  {prod}
                </div>
              ))}
            </div>
            <span className="font-mono text-[9px] text-slate-400 mt-1 uppercase">Products</span>
          </div>
        </div>

        {/* Active Channel Explanation */}
        <p className="text-[11px] text-slate-300 font-sans border-t border-white/5 pt-2 leading-relaxed">
          {activeChannel.description}
        </p>
      </div>

      {/* Channel Switcher Buttons if multiple channels */}
      {channels.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {channels.map((ch, idx) => (
            <button
              key={idx}
              onClick={() => setActiveChannelIdx(idx)}
              className={`px-2 py-1 rounded text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChannelIdx === idx
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              <span>{ch.branchingRatio}</span>
              <span className="text-slate-500">→</span>
              <span>{ch.products.join(' + ')}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
