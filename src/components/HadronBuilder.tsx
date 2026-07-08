/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Particle } from '../types';
import { Sparkles, Trash2, ShieldCheck, Scale, AlertTriangle, ArrowRight } from 'lucide-react';

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
  const [higgsStrength, setHiggsStrength] = useState<number>(0.2); // 0 to 1
  const [dragEffectMultiplier, setDragEffectMultiplier] = useState<number>(1);

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

  const addQuark = (q: QuarkItem) => {
    if (selectedQuarks.length >= 3) return;
    setSelectedQuarks([...selectedQuarks, q]);
  };

  const removeQuark = (index: number) => {
    const updated = [...selectedQuarks];
    updated.splice(index, 1);
    setSelectedQuarks(updated);
  };

  const clearWorkspace = () => {
    setSelectedQuarks([]);
  };

  // Higgs mass multiplier effect
  useEffect(() => {
    // Simulates "visual drag latency" in a state
    setDragEffectMultiplier(1 + higgsStrength * 4);
  }, [higgsStrength]);

  // Combined metrics calculation
  const totalCharge = selectedQuarks.reduce((sum, q) => sum + q.charge, 0);

  // Parse names and symbols to identify particles
  const getHadronClassification = () => {
    if (selectedQuarks.length === 0) return { name: 'Empty Workspace', valid: false, type: 'None', desc: 'Add quarks to start building.' };
    
    // Sort symbols to identify combinations
    const symbols = [...selectedQuarks].map(q => q.symbol).sort().join('');
    const count = selectedQuarks.length;

    // Standard matter
    if (!isAntimatter) {
      if (count === 3) {
        if (symbols === 'ddu') return { name: 'Neutron', valid: true, type: 'Baryon', desc: 'A stable neutral baryon found in atomic nuclei (Composition: udd).' };
        if (symbols === 'duu') return { name: 'Proton', valid: true, type: 'Baryon', desc: 'A stable positively charged baryon in atomic nuclei (Composition: uud).' };
        if (symbols === 'dsu') return { name: 'Sigma-0 Hyperon', valid: true, type: 'Baryon', desc: 'An unstable hyperon that decays rapidly (Composition: uds).' };
        if (symbols === 'dss') return { name: 'Xi-Minus Baryon', valid: true, type: 'Baryon', desc: 'A rare three-quark cascade baryon (Composition: dss).' };
        return { name: 'Unstable Resonance', valid: Math.abs(totalCharge % 1) < 0.01, type: 'Baryon', desc: 'Three quarks bound together, but highly unstable or exotic resonance.' };
      }
      if (count === 2) {
        if (symbols === 'd̄u') return { name: 'Pion+', valid: true, type: 'Meson', desc: 'A light, short-lived meson that mediates the nuclear force between nucleons.' };
        if (symbols === 'dū') return { name: 'Pion-', valid: true, type: 'Meson', desc: 'The antimatter counterpart of the positive pion.' };
        if (symbols === 's̄u') return { name: 'Kaon+', valid: true, type: 'Meson', desc: 'An exotic meson carrying a strange antiquark.' };
        if (symbols === 'sū') return { name: 'Kaon-', valid: true, type: 'Meson', desc: 'An exotic meson carrying a strange quark.' };
        return { name: 'Exotic Meson', valid: Math.abs(totalCharge % 1) < 0.01, type: 'Meson', desc: 'A quark-antiquark pair bound by gluons.' };
      }
    } else {
      // Antimatter universe classification
      if (count === 3) {
        if (symbols === 'duū' || symbols === 'd̄ūū') return { name: 'Antiproton', valid: true, type: 'Antibaryon', desc: 'The antimatter partner of the proton with negative charge.' };
        if (symbols === 'dd̄ū' || symbols === 'd̄d̄u') return { name: 'Antineutron', valid: true, type: 'Antibaryon', desc: 'The neutral antimatter partner of the neutron.' };
        return { name: 'Antimatter Resonance', valid: Math.abs(totalCharge % 1) < 0.01, type: 'Antibaryon', desc: 'An unstable combination of three antiquarks.' };
      }
      if (count === 2) {
        if (symbols === 'dū') return { name: 'Pion-', valid: true, type: 'Meson', desc: 'An antimatter-dominated pion resonance.' };
        if (symbols === 'd̄u') return { name: 'Pion+', valid: true, type: 'Meson', desc: 'A meson containing standard up and down quarks.' };
        return { name: 'Exotic Meson', valid: Math.abs(totalCharge % 1) < 0.01, type: 'Meson', desc: 'A bound meson state.' };
      }
    }

    return {
      name: count === 1 ? 'Quark Singlet' : 'Exotic Cluster',
      valid: false,
      type: count === 1 ? 'Fractional' : 'Exotic',
      desc: count === 1 ? 'Color confinement prevents single quarks from existing in isolation.' : 'Quarks must combine into triplets (Baryons) or pairs (Mesons) to satisfy color neutrality.'
    };
  };

  const classification = getHadronClassification();
  const isChargeInteger = Math.abs(totalCharge % 1) < 0.01 || Math.abs(totalCharge % 1 - 1) < 0.01;

  // Render a fraction cleanly
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-normal">
      
      {/* Selector Deck */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Quark Assembly Deck
          </h4>
          <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
            Select and add quarks to the collider ring. Hadrons require a color-neutral state: exactly 3 quarks (Baryon) or 2 quarks of matter/antimatter (Meson) with integer net charges.
          </p>

          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">
              Primary Valence Quarks:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {quarkPool.map((q) => (
                <button
                  key={q.id}
                  onClick={() => addQuark(q)}
                  disabled={selectedQuarks.length >= 3}
                  id={`hadron-add-${q.id}`}
                  className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-950/40 hover:bg-slate-900/60 hover:border-purple-900/50 flex flex-col items-center justify-center cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed group text-center"
                >
                  <span className="font-mono text-base font-semibold text-purple-300 group-hover:scale-110 transition-transform">
                    {q.symbol}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">{q.name}</span>
                  <span className="text-[9px] font-mono text-slate-500">{q.charge > 0 ? '+' : ''}{q.charge === 2/3 ? '2/3' : q.charge === -2/3 ? '-2/3' : q.charge === 1/3 ? '1/3' : '-1/3'}e</span>
                </button>
              ))}
            </div>

            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-3 mb-1">
              Meson Partner Antiquarks:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {oppositePool.map((q) => (
                <button
                  key={q.id}
                  onClick={() => addQuark(q)}
                  disabled={selectedQuarks.length >= 3}
                  id={`hadron-add-${q.id}`}
                  className="p-2 rounded-lg border border-slate-800/80 bg-slate-950/40 hover:bg-slate-900/60 hover:border-pink-900/50 flex flex-col items-center justify-center cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed group text-center"
                >
                  <span className="font-mono text-sm font-semibold text-pink-400 group-hover:scale-110 transition-transform">
                    {q.symbol}
                  </span>
                  <span className="text-[9px] text-slate-400 truncate w-full mt-0.5">{q.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe Cards */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 font-mono text-xs">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-2 leading-none">
            Collider Presets
          </span>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => applyHadronPreset('proton')}
              id="hadron-preset-proton"
              className="px-3 py-2 text-left bg-slate-950/40 hover:bg-slate-900/80 rounded border border-slate-800/80 hover:border-purple-900/40 flex justify-between items-center cursor-pointer transition-all group"
            >
              <span>{isAntimatter ? 'Antiproton (ūūd̄)' : 'Proton (uud)'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => applyHadronPreset('neutron')}
              id="hadron-preset-neutron"
              className="px-3 py-2 text-left bg-slate-950/40 hover:bg-slate-900/80 rounded border border-slate-800/80 hover:border-purple-900/40 flex justify-between items-center cursor-pointer transition-all group"
            >
              <span>{isAntimatter ? 'Antineutron (uūd̄)' : 'Neutron (udd)'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => applyHadronPreset('pion')}
              id="hadron-preset-pion"
              className="px-3 py-2 text-left bg-slate-950/40 hover:bg-slate-900/80 rounded border border-slate-800/80 hover:border-purple-900/40 flex justify-between items-center cursor-pointer transition-all group"
            >
              <span>{isAntimatter ? 'Pion- (dū)' : 'Pion+ (ud̄)'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Assembly Workspace */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        {/* Dynamic Workspace Canvas Area */}
        <div className="relative h-[250px] rounded-xl bg-slate-950 border border-slate-900 overflow-hidden flex flex-col justify-center items-center">
          
          {/* Background Grid Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e1e38_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

          {/* Glowing Accretion Center Ring */}
          <div className="absolute w-44 h-44 rounded-full border border-dashed border-purple-900/30 animate-[spin_40s_linear_infinite]"></div>
          <div className="absolute w-52 h-52 rounded-full border border-purple-500/5 animate-[pulse_3s_ease-in-out_infinite]"></div>

          {/* Active Quarks in Assembly Ring */}
          {selectedQuarks.length === 0 ? (
            <div className="text-center font-mono text-slate-500 select-none max-w-sm z-10 px-4">
              <span className="block text-2xl mb-2 text-slate-700">∅</span>
              <p className="text-[11px] uppercase tracking-wider mb-1">
                Hadron Assembly Ring Empty
              </p>
              <p className="text-[10px] text-slate-600 normal-case">
                Click quarks on the left panel or choose a recipe preset to inject valence particles into the chamber.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-10 z-10">
              {selectedQuarks.map((q, idx) => {
                // Apply visual Higgs-drag delay effect (simulated by pulsing scales and shadows)
                const pulseScale = 1 + (Math.sin(Date.now() / 200 + idx) * 0.05 * dragEffectMultiplier);
                return (
                  <div
                    key={idx}
                    className="relative flex flex-col items-center group"
                    style={{
                      transform: `scale(${pulseScale})`,
                      transition: `transform ${300 * dragEffectMultiplier}ms cubic-bezier(0.34, 1.56, 0.64, 1)`
                    }}
                  >
                    {/* Glowing Trail / Drag Ring */}
                    <div
                      className={`absolute -inset-2.5 rounded-full bg-gradient-to-r ${q.color} opacity-40 blur-md transition-all duration-300 animate-pulse`}
                      style={{
                        transform: `scale(${1 + higgsStrength * 0.6})`,
                      }}
                    />

                    {/* Quark Core Sphere */}
                    <button
                      onClick={() => removeQuark(idx)}
                      id={`hadron-remove-${idx}`}
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${q.color} flex items-center justify-center font-mono text-lg font-bold text-slate-100 shadow-[0_0_15px_rgba(168,85,247,0.4)] relative cursor-pointer group border border-white/10 z-10`}
                    >
                      {q.symbol}
                      {/* Trash Hover overlay */}
                      <span className="absolute inset-0 bg-red-950/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </span>
                    </button>

                    <span className="text-[10px] font-mono text-slate-400 mt-2 z-10">{q.name}</span>
                    <span className="text-[9px] font-mono text-slate-500 z-10">{q.charge > 0 ? '+' : ''}{q.charge === 2/3 ? '2/3' : q.charge === -2/3 ? '-2/3' : q.charge === 1/3 ? '1/3' : '-1/3'}e</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active stats bar at bottom of ring */}
          {selectedQuarks.length > 0 && (
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center font-mono text-[10px] text-slate-400 border-t border-slate-900 pt-2 bg-slate-950/80 z-20 px-2 rounded">
              <div className="flex gap-4">
                <span>VALENCE: {selectedQuarks.length}/3</span>
                <span>CHARGE CALC: {selectedQuarks.map(q => (q.charge > 0 ? `+${q.charge === 2/3 ? '2/3' : '1/3'}` : `-${Math.abs(q.charge) === 2/3 ? '2/3' : '1/3'}`)).join(' ')} = <span className={isChargeInteger ? 'text-emerald-400 font-bold' : 'text-amber-500'}>{formatFraction(totalCharge)}e</span></span>
              </div>
              <button
                onClick={clearWorkspace}
                id="hadron-clear-all"
                className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
          )}
        </div>

        {/* Higgs Viscosity Slider Controls */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
            <div className="flex flex-col">
              <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4" /> Higgs Field Coupling (Viscosity)
              </h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Increase the Higgs coupling to grant inertial mass. Notice the extra visual lag, inertia, and pulsation weight on the quarks.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1 rounded border border-slate-800 font-mono text-xs text-amber-400 uppercase tracking-widest shrink-0 select-none">
              <span>DRAG_FACTOR: {(higgsStrength * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Light</span>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={higgsStrength}
              onChange={(e) => setHiggsStrength(parseFloat(e.target.value))}
              className="flex-grow h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none accent-amber-500 hover:accent-amber-400 transition-all"
              id="higgs-viscosity-slider"
            />
            <span className="text-[10px] font-mono text-slate-500 uppercase">Viscous</span>
          </div>
        </div>

        {/* Classification Diagnostics */}
        {selectedQuarks.length > 0 && (
          <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center gap-4 justify-between transition-all ${
            classification.valid 
              ? 'bg-emerald-950/10 border-emerald-900/50' 
              : 'bg-amber-950/10 border-amber-900/50'
          }`}>
            <div className="flex gap-3 items-start">
              {classification.valid ? (
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className={`text-sm font-semibold tracking-tight ${classification.valid ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {classification.name}
                  </span>
                  <span className="font-mono text-[9px] bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 uppercase tracking-widest leading-none">
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
                Hadron Stability Status
              </span>
              <span className={`font-mono text-[11px] font-semibold uppercase ${
                classification.valid ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {classification.valid ? '✓ PHYSICS VALIDATED' : '⚠ COLOR CONFINED'}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
