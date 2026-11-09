/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Trash2, ShieldCheck, Scale, AlertTriangle, ArrowRight, ChevronDown, ChevronUp, Move } from 'lucide-react';

interface HadronBuilderProps {
  isAntimatter: boolean;
}

interface QuarkItem {
  id: string;
  name: string;
  symbol: string;
  charge: number;
  color: string;
}

export default function HadronBuilder({ isAntimatter }: HadronBuilderProps) {
  const [selectedQuarks, setSelectedQuarks] = useState<QuarkItem[]>([]);
  const [higgsStrength, setHiggsStrength] = useState<number>(0.3); // 0.05 to 1.0
  const [isDragOverRing, setIsDragOverRing] = useState<boolean>(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);

  // Available quarks depending on Antimatter setting
  const quarkPool: QuarkItem[] = [
    { id: 'up', name: isAntimatter ? 'Anti-Up' : 'Up', symbol: isAntimatter ? 'ū' : 'u', charge: isAntimatter ? -2/3 : 2/3, color: 'from-violet-500 to-violet-700' },
    { id: 'down', name: isAntimatter ? 'Anti-Down' : 'Down', symbol: isAntimatter ? 'd̄' : 'd', charge: isAntimatter ? 1/3 : -1/3, color: 'from-fuchsia-500 to-fuchsia-700' },
    { id: 'strange', name: isAntimatter ? 'Anti-Strange' : 'Strange', symbol: isAntimatter ? 's̄' : 's', charge: isAntimatter ? 1/3 : -1/3, color: 'from-purple-600 to-purple-800' },
    { id: 'charm', name: isAntimatter ? 'Anti-Charm' : 'Charm', symbol: isAntimatter ? 'c̄' : 'c', charge: isAntimatter ? -2/3 : 2/3, color: 'from-indigo-500 to-indigo-700' },
  ];

  // Extra antimatter counterpart pool to allow meson combos
  const oppositePool: QuarkItem[] = [
    { id: 'anti_up', name: isAntimatter ? 'Up' : 'Anti-Up', symbol: isAntimatter ? 'u' : 'ū', charge: isAntimatter ? 2/3 : -2/3, color: 'from-pink-500 to-pink-700' },
    { id: 'anti_down', name: isAntimatter ? 'Down' : 'Anti-Down', symbol: isAntimatter ? 'd' : 'd̄', charge: isAntimatter ? -1/3 : 1/3, color: 'from-red-500 to-red-700' },
    { id: 'anti_strange', name: isAntimatter ? 'Strange' : 'Anti-Strange', symbol: isAntimatter ? 's' : 's̄', charge: isAntimatter ? -1/3 : 1/3, color: 'from-rose-500 to-rose-700' },
  ];

  const allQuarks = [...quarkPool, ...oppositePool];

  const addQuark = (q: QuarkItem) => {
    if (selectedQuarks.length >= 3) return;
    setSelectedQuarks((prev) => [...prev, q]);
  };

  const removeQuark = (index: number) => {
    setSelectedQuarks((prev) => prev.filter((_, i) => i !== index));
  };

  const clearWorkspace = () => {
    setSelectedQuarks([]);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, quark: QuarkItem) => {
    e.dataTransfer.setData('text/plain', quark.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOverRing) setIsDragOverRing(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverRing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverRing(false);
    const quarkId = e.dataTransfer.getData('text/plain');
    const quark = allQuarks.find((q) => q.id === quarkId);
    if (quark && selectedQuarks.length < 3) {
      addQuark(quark);
    }
  };

  // Combined metrics calculation
  const totalCharge = selectedQuarks.reduce((sum, q) => sum + q.charge, 0);

  // Parse names and symbols to identify particles
  const getHadronClassification = () => {
    if (selectedQuarks.length === 0) return { name: 'Empty Workspace', valid: false, type: 'None', desc: 'Drag or click quarks to assemble a hadron.' };
    
    const symbols = [...selectedQuarks].map((q) => q.symbol).sort().join('');
    const count = selectedQuarks.length;

    // Standard matter
    if (!isAntimatter) {
      if (count === 3) {
        if (symbols === 'ddu') return { name: 'Neutron', valid: true, type: 'Baryon', desc: 'Neutral nucleon in atomic nuclei (Composition: udd).' };
        if (symbols === 'duu') return { name: 'Proton', valid: true, type: 'Baryon', desc: 'Positively charged stable nucleon (Composition: uud).' };
        if (symbols === 'dsu') return { name: 'Sigma-0 Hyperon', valid: true, type: 'Baryon', desc: 'Unstable hyperon that decays rapidly (Composition: uds).' };
        if (symbols === 'dss') return { name: 'Xi-Minus Baryon', valid: true, type: 'Baryon', desc: 'Exotic strange cascade baryon (Composition: dss).' };
        return { name: 'Unstable Resonance', valid: Math.abs(totalCharge % 1) < 0.01, type: 'Baryon', desc: 'Three-quark bound state with integer charge.' };
      }
      if (count === 2) {
        if (symbols === 'd̄u') return { name: 'Pion+', valid: true, type: 'Meson', desc: 'Charged meson mediating strong nuclear force (ud̄).' };
        if (symbols === 'dū') return { name: 'Pion-', valid: true, type: 'Meson', desc: 'Negatively charged pion (dū).' };
        if (symbols === 's̄u') return { name: 'Kaon+', valid: true, type: 'Meson', desc: 'Strange meson carrying strange antiquark (us̄).' };
        if (symbols === 'sū') return { name: 'Kaon-', valid: true, type: 'Meson', desc: 'Strange meson carrying strange quark (sū).' };
        return { name: 'Exotic Meson', valid: Math.abs(totalCharge % 1) < 0.01, type: 'Meson', desc: 'Quark-antiquark bound meson state.' };
      }
    } else {
      // Antimatter universe classification
      if (count === 3) {
        if (symbols === 'duū' || symbols === 'd̄ūū') return { name: 'Antiproton', valid: true, type: 'Antibaryon', desc: 'Negative antimatter partner of the proton (ūūd̄).' };
        if (symbols === 'dd̄ū' || symbols === 'd̄d̄u') return { name: 'Antineutron', valid: true, type: 'Antibaryon', desc: 'Neutral antimatter partner of the neutron (ūd̄d̄).' };
        return { name: 'Antimatter Resonance', valid: Math.abs(totalCharge % 1) < 0.01, type: 'Antibaryon', desc: 'Bound state of three antiquarks.' };
      }
      if (count === 2) {
        if (symbols === 'dū') return { name: 'Pion-', valid: true, type: 'Meson', desc: 'Antimatter pion state.' };
        if (symbols === 'd̄u') return { name: 'Pion+', valid: true, type: 'Meson', desc: 'Matter-antimatter bound pair.' };
        return { name: 'Exotic Meson', valid: Math.abs(totalCharge % 1) < 0.01, type: 'Meson', desc: 'Meson state in antimatter field.' };
      }
    }

    return {
      name: count === 1 ? 'Isolated Quark Singlet' : 'Exotic Cluster',
      valid: false,
      type: count === 1 ? 'Fractional' : 'Exotic',
      desc: count === 1 ? 'Color confinement strictly forbids free isolated fractional quarks.' : 'Color-neutral states require 3 quarks (Baryon) or quark-antiquark pair (Meson).'
    };
  };

  const classification = getHadronClassification();
  const isChargeInteger = Math.abs(totalCharge % 1) < 0.01 || Math.abs(totalCharge % 1 - 1) < 0.01;

  const formatFraction = (num: number) => {
    if (Math.abs(num) < 0.01) return '0';
    const sign = num > 0 ? '+' : '-';
    const abs = Math.abs(num);
    if (Math.abs(abs - 1/3) < 0.01) return `${sign}1/3`;
    if (Math.abs(abs - 2/3) < 0.01) return `${sign}2/3`;
    if (Math.abs(abs - 1) < 0.01) return `${sign}1`;
    if (Math.abs(abs - 4/3) < 0.01) return `${sign}4/3`;
    if (Math.abs(abs - 5/3) < 0.01) return `${sign}5/3`;
    if (Math.abs(abs - 2) < 0.01) return `${sign}2`;
    return num.toFixed(2);
  };

  const applyHadronPreset = (preset: string) => {
    if (preset === 'proton') {
      setSelectedQuarks([
        { id: 'up', name: isAntimatter ? 'Anti-Up' : 'Up', symbol: isAntimatter ? 'ū' : 'u', charge: isAntimatter ? -2/3 : 2/3, color: 'from-violet-500 to-violet-700' },
        { id: 'up', name: isAntimatter ? 'Anti-Up' : 'Up', symbol: isAntimatter ? 'ū' : 'u', charge: isAntimatter ? -2/3 : 2/3, color: 'from-violet-500 to-violet-700' },
        { id: 'down', name: isAntimatter ? 'Anti-Down' : 'Down', symbol: isAntimatter ? 'd̄' : 'd', charge: isAntimatter ? 1/3 : -1/3, color: 'from-fuchsia-500 to-fuchsia-700' },
      ]);
    } else if (preset === 'neutron') {
      setSelectedQuarks([
        { id: 'up', name: isAntimatter ? 'Anti-Up' : 'Up', symbol: isAntimatter ? 'ū' : 'u', charge: isAntimatter ? -2/3 : 2/3, color: 'from-violet-500 to-violet-700' },
        { id: 'down', name: isAntimatter ? 'Anti-Down' : 'Down', symbol: isAntimatter ? 'd̄' : 'd', charge: isAntimatter ? 1/3 : -1/3, color: 'from-fuchsia-500 to-fuchsia-700' },
        { id: 'down', name: isAntimatter ? 'Anti-Down' : 'Down', symbol: isAntimatter ? 'd̄' : 'd', charge: isAntimatter ? 1/3 : -1/3, color: 'from-fuchsia-500 to-fuchsia-700' },
      ]);
    } else if (preset === 'pion') {
      setSelectedQuarks([
        { id: 'up', name: isAntimatter ? 'Anti-Up' : 'Up', symbol: isAntimatter ? 'ū' : 'u', charge: isAntimatter ? -2/3 : 2/3, color: 'from-violet-500 to-violet-700' },
        { id: 'anti_down', name: isAntimatter ? 'Down' : 'Anti-Down', symbol: isAntimatter ? 'd' : 'd̄', charge: isAntimatter ? -1/3 : 1/3, color: 'from-red-500 to-red-700' },
      ]);
    }
  };

  // Inertial multiplier for pronounced Higgs Drag
  const inertialMultiplier = (1 + higgsStrength * 4.5).toFixed(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 leading-normal">
      {/* Left Column: Selector Deck (with collapsible elements) */}
      <div className="lg:col-span-4 flex flex-col gap-3.5">
        {/* Quark Palette */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Quark Assembly Deck
            </h4>
            <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
              <Move className="w-2.5 h-2.5" /> Drag or Click
            </span>
          </div>

          {/* Collapsible rule note */}
          <div className="mb-3">
            <button
              onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
              className="text-[10px] text-slate-400 hover:text-slate-300 font-mono flex items-center gap-1 cursor-pointer focus:outline-none"
            >
              <span>Color Confinement Rules</span>
              {isInstructionsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {isInstructionsOpen && (
              <p className="text-[11px] text-slate-400 mt-1.5 p-2 rounded bg-black/40 border border-white/5 leading-relaxed">
                Hadrons must be color-singlets: exactly 3 quarks (Baryon) or 2 quarks (Meson) with integer net elementary charge.
              </p>
            )}
          </div>

          {/* Primary Quarks */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
              Valence Quarks:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {quarkPool.map((q) => (
                <div
                  key={q.id}
                  draggable={selectedQuarks.length < 3}
                  onDragStart={(e) => handleDragStart(e, q)}
                  onClick={() => addQuark(q)}
                  id={`hadron-add-${q.id}`}
                  className={`p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-purple-500/50 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all select-none group text-center ${
                    selectedQuarks.length >= 3 ? 'opacity-40 cursor-not-allowed' : 'hover:-translate-y-0.5'
                  }`}
                >
                  <span className="font-mono text-base font-bold text-purple-300 group-hover:scale-110 transition-transform">
                    {q.symbol}
                  </span>
                  <span className="text-[10px] text-slate-300 truncate w-full mt-0.5 font-medium">{q.name}</span>
                  <span className="text-[9px] font-mono text-slate-400">
                    {q.charge > 0 ? '+' : ''}{q.charge === 2/3 ? '2/3' : q.charge === -2/3 ? '-2/3' : q.charge === 1/3 ? '1/3' : '-1/3'}e
                  </span>
                </div>
              ))}
            </div>

            {/* Antiquarks for Mesons */}
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-2">
              Antiquark Partners (Mesons):
            </span>
            <div className="grid grid-cols-3 gap-2">
              {oppositePool.map((q) => (
                <div
                  key={q.id}
                  draggable={selectedQuarks.length < 3}
                  onDragStart={(e) => handleDragStart(e, q)}
                  onClick={() => addQuark(q)}
                  id={`hadron-add-${q.id}`}
                  className={`p-2 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-pink-500/50 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all select-none group text-center ${
                    selectedQuarks.length >= 3 ? 'opacity-40 cursor-not-allowed' : 'hover:-translate-y-0.5'
                  }`}
                >
                  <span className="font-mono text-sm font-bold text-pink-400 group-hover:scale-110 transition-transform">
                    {q.symbol}
                  </span>
                  <span className="text-[9px] text-slate-400 truncate w-full mt-0.5">{q.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Collapsible Presets Accordion */}
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setIsPresetsOpen(!isPresetsOpen)}
            className="w-full flex items-center justify-between text-[10px] text-slate-300 uppercase tracking-widest font-semibold cursor-pointer focus:outline-none"
          >
            <span>Collider Presets</span>
            <span className="text-slate-400 flex items-center gap-1 font-normal lowercase">
              {isPresetsOpen ? 'hide' : 'show'}
              {isPresetsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          </button>

          {isPresetsOpen && (
            <div className="flex flex-col gap-2 mt-3 animate-in fade-in duration-150">
              <button
                onClick={() => applyHadronPreset('proton')}
                id="hadron-preset-proton"
                className="px-3 py-2 text-left bg-slate-950/70 hover:bg-slate-900 rounded border border-slate-800 hover:border-purple-500/40 flex justify-between items-center cursor-pointer transition-all"
              >
                <span>{isAntimatter ? 'Antiproton (ūūd̄)' : 'Proton (uud)'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <button
                onClick={() => applyHadronPreset('neutron')}
                id="hadron-preset-neutron"
                className="px-3 py-2 text-left bg-slate-950/70 hover:bg-slate-900 rounded border border-slate-800 hover:border-purple-500/40 flex justify-between items-center cursor-pointer transition-all"
              >
                <span>{isAntimatter ? 'Antineutron (uūd̄)' : 'Neutron (udd)'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <button
                onClick={() => applyHadronPreset('pion')}
                id="hadron-preset-pion"
                className="px-3 py-2 text-left bg-slate-950/70 hover:bg-slate-900 rounded border border-slate-800 hover:border-purple-500/40 flex justify-between items-center cursor-pointer transition-all"
              >
                <span>{isAntimatter ? 'Pion- (dū)' : 'Pion+ (ud̄)'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Interactive Collider Ring with Drag-and-Drop + Higgs Drag feedback */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {/* Dynamic Workspace Canvas Area (Drop Zone) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative h-[260px] rounded-xl bg-slate-950 border transition-all duration-300 overflow-hidden flex flex-col justify-center items-center ${
            isDragOverRing
              ? 'border-purple-400 ring-2 ring-purple-500/50 bg-purple-950/20 scale-[1.01]'
              : 'border-slate-800'
          }`}
        >
          {/* Background Grid Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e1e38_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>

          {/* Visual Drop Target Highlight */}
          {isDragOverRing && (
            <div className="absolute inset-0 bg-purple-500/10 backdrop-blur-[1px] flex items-center justify-center z-30 pointer-events-none">
              <div className="px-4 py-2 rounded-lg bg-black/80 border border-purple-400 text-purple-300 font-mono text-xs uppercase tracking-wider flex items-center gap-2 animate-bounce">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Release to Inject Quark</span>
              </div>
            </div>
          )}

          {/* Glowing Accretion Center Ring */}
          <div
            className="absolute w-44 h-44 rounded-full border border-dashed border-purple-900/40 animate-[spin_40s_linear_infinite]"
            style={{ animationDuration: `${40 / (0.3 + higgsStrength)}s` }}
          />
          <div className="absolute w-56 h-56 rounded-full border border-purple-500/10 animate-[pulse_3s_ease-in-out_infinite]" />

          {/* Active Quarks in Assembly Ring with Pronounced Higgs Drag Effects */}
          {selectedQuarks.length === 0 ? (
            <div className="text-center font-mono text-slate-500 select-none max-w-sm z-10 px-4">
              <span className="block text-2xl mb-1 text-slate-700 font-bold">∅</span>
              <p className="text-[11px] uppercase tracking-wider mb-1 text-slate-400 font-semibold">
                Collider Vacuum Chamber Empty
              </p>
              <p className="text-[10px] text-slate-500 normal-case">
                Drag quarks here from the left palette or select a preset to begin hadron synthesis.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-12 z-10">
              {selectedQuarks.map((q, idx) => {
                // Higgs drag inertia animation duration
                const lagDuration = `${2.0 * (1 + higgsStrength * 2.5)}s`;
                return (
                  <div
                    key={idx}
                    className="relative flex flex-col items-center group select-none"
                    style={{
                      transition: `transform ${350 * (1 + higgsStrength * 3)}ms cubic-bezier(0.34, 1.56, 0.64, 1)`
                    }}
                  >
                    {/* Concentric Inertial Weight Trails (Pronounced Higgs Drag) */}
                    <div
                      className="absolute -inset-4 rounded-full border border-amber-400/30 opacity-60 animate-ping"
                      style={{ animationDuration: lagDuration }}
                    />
                    <div
                      className={`absolute -inset-2.5 rounded-full bg-gradient-to-r ${q.color} opacity-40 blur-md transition-all animate-pulse`}
                      style={{ transform: `scale(${1 + higgsStrength * 0.8})` }}
                    />

                    {/* Viscous field wave ripples */}
                    <div
                      className="absolute w-20 h-20 rounded-full border border-purple-400/20 -z-10"
                      style={{
                        transform: `scale(${1 + higgsStrength * 0.5})`,
                        transition: 'transform 300ms ease'
                      }}
                    />

                    {/* Quark Core Sphere */}
                    <button
                      onClick={() => removeQuark(idx)}
                      id={`hadron-remove-${idx}`}
                      title="Click to remove from chamber"
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${q.color} flex items-center justify-center font-mono text-lg font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] relative cursor-pointer group border border-white/20 z-10`}
                    >
                      {q.symbol}
                      <span className="absolute inset-0 bg-red-950/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4 text-red-300" />
                      </span>
                    </button>

                    <span className="text-[10px] font-mono text-slate-300 mt-2 z-10 font-semibold">{q.name}</span>
                    <span className="text-[9px] font-mono text-slate-400 z-10">
                      {q.charge > 0 ? '+' : ''}{q.charge === 2/3 ? '2/3' : q.charge === -2/3 ? '-2/3' : q.charge === 1/3 ? '1/3' : '-1/3'}e
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active stats bar at bottom of ring */}
          {selectedQuarks.length > 0 && (
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center font-mono text-[10px] text-slate-400 border-t border-slate-900 pt-2 bg-slate-950/90 z-20 px-3 rounded">
              <div className="flex gap-4">
                <span>VALENCE: {selectedQuarks.length}/3</span>
                <span>
                  CHARGE: {selectedQuarks.map((q) => (q.charge > 0 ? `+${q.charge === 2/3 ? '2/3' : '1/3'}` : `-${Math.abs(q.charge) === 2/3 ? '2/3' : '1/3'}`)).join(' ')} = <span className={isChargeInteger ? 'text-emerald-400 font-bold' : 'text-amber-400'}>{formatFraction(totalCharge)}e</span>
                </span>
              </div>
              <button
                onClick={clearWorkspace}
                id="hadron-clear-all"
                className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Flush
              </button>
            </div>
          )}
        </div>

        {/* Pronounced Higgs Drag Viscosity Controls with tangible feedback */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
            <div className="flex flex-col">
              <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-400" /> Higgs Coupling & Viscous Inertia
              </h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Moving through the non-zero Higgs vacuum grants inertial mass via viscous Yukawa friction.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded border border-slate-800 font-mono text-xs text-amber-400 uppercase shrink-0">
              <span>DRAG: {inertialMultiplier}× ({(higgsStrength * 100).toFixed(0)}%)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Massless</span>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              value={higgsStrength}
              onChange={(e) => setHiggsStrength(parseFloat(e.target.value))}
              className="flex-grow h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none accent-amber-500 hover:accent-amber-400 transition-all"
              id="higgs-viscosity-slider"
            />
            <span className="text-[10px] font-mono text-slate-500 uppercase">Heavy Drag</span>
          </div>
        </div>

        {/* Hadron Stability Classification */}
        {selectedQuarks.length > 0 && (
          <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center gap-3 justify-between transition-all ${
            classification.valid
              ? 'bg-emerald-950/20 border-emerald-800/50'
              : 'bg-amber-950/20 border-amber-800/50'
          }`}>
            <div className="flex gap-3 items-start">
              {classification.valid ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className={`text-sm font-semibold tracking-tight ${classification.valid ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {classification.name}
                  </span>
                  <span className="font-mono text-[9px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300 uppercase">
                    {classification.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {classification.desc}
                </p>
              </div>
            </div>

            <div className="flex flex-col shrink-0 text-right leading-tight">
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider mb-1">
                Confinement Status
              </span>
              <span className={`font-mono text-[11px] font-bold uppercase ${
                classification.valid ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {classification.valid ? '✓ STABLE COMPOSITE' : '⚠ FRACTIONAL CHARGE'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
