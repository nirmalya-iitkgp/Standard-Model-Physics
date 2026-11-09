/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ChangeEvent } from 'react';
import { Epoch } from '../types';
import { EPOCHS } from '../data/particles';
import { Flame, Clock, Thermometer, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface TimelineSliderProps {
  activeEpoch: Epoch;
  onEpochChange: (epoch: Epoch) => void;
}

export default function TimelineSlider({ activeEpoch, onEpochChange }: TimelineSliderProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const currentIndex = EPOCHS.findIndex((e) => e.id === activeEpoch.id);

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value);
    onEpochChange(EPOCHS[idx]);
  };

  return (
    <div id="cosmic-timeline" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 md:p-5 backdrop-blur-md transition-all">
      {/* Accordion Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 cursor-pointer group text-left focus:outline-none"
          id="toggle-timeline-collapse"
        >
          <Clock className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-semibold tracking-wide text-slate-200 font-mono uppercase group-hover:text-blue-300 transition-colors">
            Cosmic Evolution Timeline
          </h3>
          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
            {isCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            {isCollapsed ? 'Expand' : 'Collapse'}
          </span>
        </button>

        {/* Compact stats pill strip */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            <span className="text-blue-400 font-medium">{activeEpoch.name}</span>
            <span className="text-slate-500">•</span>
            <span>{activeEpoch.time}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            <Thermometer className="w-3 h-3 text-amber-500" />
            <span>{activeEpoch.temp}</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            <Flame className="w-3 h-3 text-red-500" />
            <span>{activeEpoch.energy}</span>
          </div>
        </div>
      </div>

      {/* Collapsible Body */}
      {!isCollapsed && (
        <div className="mt-4 flex flex-col gap-4 animate-in fade-in duration-200">
          {/* Interactive Range Slider */}
          <div className="relative py-2 select-none">
            <input
              type="range"
              min="0"
              max={EPOCHS.length - 1}
              value={currentIndex}
              onChange={handleSliderChange}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer focus:outline-none accent-blue-500 hover:accent-blue-400 transition-all"
              id="timeline-input-slider"
            />

            {/* Custom Tick Marks */}
            <div className="flex justify-between mt-2.5 px-1">
              {EPOCHS.map((epoch, index) => {
                const isActive = index === currentIndex;
                const isPassed = index <= currentIndex;
                return (
                  <button
                    key={epoch.id}
                    onClick={() => onEpochChange(epoch)}
                    className="flex flex-col items-center group focus:outline-none cursor-pointer"
                    id={`timeline-tick-${epoch.id}`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? 'bg-blue-400 border-white scale-125 shadow-[0_0_10px_rgba(59,130,246,0.8)]'
                          : isPassed
                          ? 'bg-blue-950 border-blue-500'
                          : 'bg-white/5 border-white/10'
                      }`}
                    />
                    <span
                      className={`mt-1.5 font-mono text-[9px] tracking-tight transition-colors duration-300 ${
                        isActive ? 'text-blue-400 font-bold' : 'text-slate-500 group-hover:text-slate-400'
                      } hidden sm:inline`}
                    >
                      {epoch.time}
                    </span>
                    <span
                      className={`mt-0.5 font-sans text-[10px] font-medium leading-none transition-colors duration-300 ${
                        isActive ? 'text-slate-200' : 'text-slate-600 group-hover:text-slate-400'
                      } hidden md:inline`}
                    >
                      {epoch.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Epoch Detail Board */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-black/20 border border-white/10 leading-normal">
            <div className="md:col-span-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10 pb-2 md:pb-0 md:pr-3">
              <span className="font-mono text-[9px] text-blue-400 uppercase tracking-widest mb-0.5">
                Current Era
              </span>
              <span className="text-sm font-semibold text-slate-100 tracking-tight">
                {activeEpoch.name}
              </span>
              <span className="font-mono text-[10px] text-slate-400 mt-0.5">
                {activeEpoch.time} post-singularity
              </span>
            </div>
            <div className="md:col-span-3 flex gap-2.5 items-start">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeEpoch.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="text-slate-500 uppercase tracking-wider">
                    Physics Consequence:
                  </span>
                  {activeEpoch.id === 'planck' && (
                    <span className="text-red-400 bg-red-950/20 px-2 py-0.5 rounded border border-red-900/30">
                      Forces unified • All particles massless pure energy plasma
                    </span>
                  )}
                  {activeEpoch.id === 'electroweak' && (
                    <span className="text-amber-400 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/30">
                      Higgs Field freezes • Quarks, Leptons & Weak Bosons acquire mass
                    </span>
                  )}
                  {activeEpoch.id === 'hadron' && (
                    <span className="text-violet-400 bg-violet-950/20 px-2 py-0.5 rounded border border-violet-900/30">
                      Strong confinement • Quarks form bound protons & neutrons
                    </span>
                  )}
                  {activeEpoch.id === 'lepton' && (
                    <span className="text-cyan-400 bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-900/30">
                      Leptons dominate • Rapid particle-antiparticle annihilation
                    </span>
                  )}
                  {activeEpoch.id === 'nucleosynthesis' && (
                    <span className="text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
                      Primordial fusion • H, He, and Li nuclei freeze out
                    </span>
                  )}
                  {activeEpoch.id === 'present' && (
                    <span className="text-sky-400 bg-sky-950/20 px-2 py-0.5 rounded border border-sky-900/30">
                      Stable atoms form stars, chemical elements, and macroscopic life
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
