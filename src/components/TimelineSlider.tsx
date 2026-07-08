/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeEvent } from 'react';
import { Epoch } from '../types';
import { EPOCHS } from '../data/particles';
import { Flame, Clock, Thermometer, Info } from 'lucide-react';

interface TimelineSliderProps {
  activeEpoch: Epoch;
  onEpochChange: (epoch: Epoch) => void;
}

export default function TimelineSlider({ activeEpoch, onEpochChange }: TimelineSliderProps) {
  const currentIndex = EPOCHS.findIndex((e) => e.id === activeEpoch.id);

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value);
    onEpochChange(EPOCHS[idx]);
  };

  return (
    <div id="cosmic-timeline" className="w-full bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md">
      
      {/* Slider Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400 animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wide text-slate-200 font-mono uppercase">
            The Cosmic Evolution Timeline
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Time: <span className="text-slate-100 font-medium">{activeEpoch.time}</span></span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <Thermometer className="w-3.5 h-3.5 text-amber-500" />
            <span>Temp: <span className="text-slate-100 font-medium">{activeEpoch.temp}</span></span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Energy: <span className="text-slate-100 font-medium">{activeEpoch.energy}</span></span>
          </div>
        </div>
      </div>

      {/* Interactive Slider Input */}
      <div className="relative py-4 select-none">
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
        <div className="flex justify-between mt-3 px-1.5">
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
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-400 border-white scale-125 shadow-[0_0_12px_rgba(59,130,246,0.8)]'
                      : isPassed
                      ? 'bg-blue-950 border-blue-500'
                      : 'bg-white/5 border-white/10'
                  }`}
                />
                <span
                  className={`mt-2 font-mono text-[9px] tracking-tight transition-colors duration-300 ${
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
      <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-black/20 border border-white/10 leading-normal">
        <div className="md:col-span-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10 pb-3 md:pb-0 md:pr-4">
          <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-1">
            Active Epoch
          </span>
          <span className="text-base font-semibold text-slate-100 tracking-tight">
            {activeEpoch.name}
          </span>
          <span className="font-mono text-[11px] text-slate-400 mt-1">
            {activeEpoch.time} after Big Bang
          </span>
        </div>
        <div className="md:col-span-3 flex gap-3 items-start">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeEpoch.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="text-slate-500 uppercase tracking-wider">
                Physical Consequence:
              </span>
              {activeEpoch.id === 'planck' && (
                <span className="text-red-400 bg-red-950/20 px-2 py-0.5 rounded border border-red-900/30">
                  Zero standard matter - Forces unified in pure energy plasma
                </span>
              )}
              {activeEpoch.id === 'electroweak' && (
                <span className="text-amber-400 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/30">
                  Higgs Field Activates - Leptons & Quarks freeze with Rest Mass
                </span>
              )}
              {activeEpoch.id === 'hadron' && (
                <span className="text-violet-400 bg-violet-950/20 px-2 py-0.5 rounded border border-violet-900/30">
                  Quarks bind via Strong Force - First Protons and Neutrons emerge
                </span>
              )}
              {activeEpoch.id === 'lepton' && (
                <span className="text-cyan-400 bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-900/30">
                  Hadrons stabilize - Rapid Electron-Positron annihilation phase
                </span>
              )}
              {activeEpoch.id === 'nucleosynthesis' && (
                <span className="text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
                  Light Atomic Nuclei condense - Light elements freeze out
                </span>
              )}
              {activeEpoch.id === 'present' && (
                <span className="text-sky-400 bg-sky-950/20 px-2 py-0.5 rounded border border-sky-900/30">
                  Atoms orbit - Neutral matter forms stars, planets, and chemical life
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
