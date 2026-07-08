/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { ZOO_PARTICLES, ZooParticle } from '../data/zooParticles';
import ThreeInspector from './ThreeInspector';
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  RotateCcw, 
  Eye, 
  Zap, 
  Scale, 
  Shield, 
  Info, 
  Atom, 
  HelpCircle,
  Hash,
  Activity,
  Dna
} from 'lucide-react';

interface ParticleZooProps {
  isAntimatter: boolean;
}

export default function ParticleZoo({ isAntimatter }: ParticleZooProps) {
  // States
  const [selectedParticle, setSelectedParticle] = useState<ZooParticle>(ZOO_PARTICLES[0]);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [chargeFilter, setChargeFilter] = useState<string>('ALL');
  const [massFilter, setMassFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('MASS_ASC');

  // Reset all filters
  const resetFilters = () => {
    setTypeFilter('ALL');
    setChargeFilter('ALL');
    setMassFilter('ALL');
    setSearchQuery('');
    setSortOption('MASS_ASC');
  };

  // 1. Filtering Logic
  const filteredParticles = useMemo(() => {
    return ZOO_PARTICLES.filter((p) => {
      // 1. Search Query
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.quarkContent && p.quarkContent.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // 2. Type Filter
      if (typeFilter !== 'ALL' && p.zooType.toUpperCase() !== typeFilter) {
        return false;
      }

      // 3. Charge Filter (accounting for antimatter reversal)
      const charge = isAntimatter ? -p.charge : p.charge;
      if (chargeFilter === 'POSITIVE' && charge <= 0.01) return false;
      if (chargeFilter === 'NEGATIVE' && charge >= -0.01) return false;
      if (chargeFilter === 'NEUTRAL' && Math.abs(charge) > 0.01) return false;

      // 4. Mass Filter
      if (massFilter === 'SUB_MEV' && p.massMeV >= 1.0) return false;
      if (massFilter === 'MEV_RANGE' && (p.massMeV < 1.0 || p.massMeV > 1000.0)) return false;
      if (massFilter === 'GEV_RANGE' && (p.massMeV <= 1000.0 || p.massMeV > 50000.0)) return false;
      if (massFilter === 'HEAVY_COLLIDER' && p.massMeV <= 50000.0) return false;

      return true;
    });
  }, [typeFilter, chargeFilter, massFilter, searchQuery, isAntimatter]);

  // 2. Sorting Logic
  const sortedParticles = useMemo(() => {
    const list = [...filteredParticles];
    list.sort((a, b) => {
      const chargeA = isAntimatter ? -a.charge : a.charge;
      const chargeB = isAntimatter ? -b.charge : b.charge;

      switch (sortOption) {
        case 'MASS_ASC':
          return a.massMeV - b.massMeV;
        case 'MASS_DESC':
          return b.massMeV - a.massMeV;
        case 'CHARGE_ASC':
          return chargeA - chargeB;
        case 'CHARGE_DESC':
          return chargeB - chargeA;
        case 'NAME_ASC':
          return a.name.localeCompare(b.name);
        case 'NAME_DESC':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
    return list;
  }, [filteredParticles, sortOption, isAntimatter]);

  // Render fractions safely
  const formatCharge = (charge: number) => {
    const rawCharge = isAntimatter ? -charge : charge;
    if (Math.abs(rawCharge) < 0.01) return '0';
    const sign = rawCharge > 0 ? '+' : '-';
    const abs = Math.abs(rawCharge);
    if (Math.abs(abs - 2/3) < 0.01) return `${sign}2/3`;
    if (Math.abs(abs - 1/3) < 0.01) return `${sign}1/3`;
    if (Math.abs(abs - 4/3) < 0.01) return `${sign}4/3`;
    if (Math.abs(abs - 5/3) < 0.01) return `${sign}5/3`;
    return `${sign}${Math.round(abs)}`;
  };

  return (
    <div id="particle-zoo-section" className="flex flex-col gap-6 leading-normal text-slate-100">
      
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold tracking-wide text-slate-200 font-mono uppercase flex items-center gap-2">
            <Atom className="w-5 h-5 text-purple-400 animate-spin" style={{ animationDuration: '12s' }} />
            The Particle Zoo Archive
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Browse and inspect all known quarks, leptons, hadrons, gauge bosons, and speculative Beyond Standard Model candidates.
          </p>
        </div>

        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-300 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Search
        </button>
      </div>

      {/* FILTER & SORT CONTROLS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl border border-white/10 bg-black/20 font-mono text-xs">
        
        {/* Search Input */}
        <div className="md:col-span-4 flex flex-col gap-1.5">
          <label className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Search className="w-3 h-3 text-slate-400" /> Search Archive
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, symbol, quarks..."
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>

        {/* Charge Filter dropdown */}
        <div className="md:col-span-2.5 flex flex-col gap-1.5">
          <label className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" /> Charge State
          </label>
          <select
            value={chargeFilter}
            onChange={(e) => setChargeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-slate-300 focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
          >
            <option value="ALL">All Charges</option>
            <option value="POSITIVE">Positive (+)</option>
            <option value="NEGATIVE">Negative (-)</option>
            <option value="NEUTRAL">Neutral (0)</option>
          </select>
        </div>

        {/* Mass Filter dropdown */}
        <div className="md:col-span-2.5 flex flex-col gap-1.5">
          <label className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Scale className="w-3 h-3 text-cyan-400" /> Mass Range
          </label>
          <select
            value={massFilter}
            onChange={(e) => setMassFilter(e.target.value)}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-slate-300 focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
          >
            <option value="ALL">All Masses</option>
            <option value="SUB_MEV">Sub-MeV (&lt; 1 MeV)</option>
            <option value="MEV_RANGE">MeV Range (1 - 1000 MeV)</option>
            <option value="GEV_RANGE">GeV Range (1 - 50 GeV)</option>
            <option value="HEAVY_COLLIDER">Collider Scale (&gt; 50 GeV)</option>
          </select>
        </div>

        {/* Sorting options */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <label className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-purple-400" /> Sort Order
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-slate-300 focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
          >
            <option value="MASS_ASC">Mass (Lightest First)</option>
            <option value="MASS_DESC">Mass (Heaviest First)</option>
            <option value="CHARGE_ASC">Charge (Low to High)</option>
            <option value="CHARGE_DESC">Charge (High to Low)</option>
            <option value="NAME_ASC">Name (A-Z)</option>
            <option value="NAME_DESC">Name (Z-A)</option>
          </select>
        </div>

      </div>

      {/* QUICK TYPE CATEGORY HORIZONTAL FILTER RAIL */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'QUARK', 'LEPTON', 'BOSON', 'HADRON', 'BSM'].map((cat) => {
          const isActive = typeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setTypeFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider transition-all cursor-pointer select-none uppercase ${
                isActive
                  ? isAntimatter
                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50 shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* TWO-COLUMN LAYOUT: MASTER LIST AND DETAIL INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LIST SECTION (8 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          
          {sortedParticles.length === 0 ? (
            <div className="text-center font-mono py-12 p-4 rounded-xl border border-dashed border-white/10 bg-black/10 text-slate-500 leading-normal">
              <span className="block text-3xl mb-1 text-slate-700">∅</span>
              <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">No Particles Match Search Filters</p>
              <p className="text-[10px] text-slate-600 mt-1 normal-case">Try resetting options or adjusting your search phrase.</p>
            </div>
          ) : (
            sortedParticles.map((p) => {
              const isSelected = selectedParticle.id === p.id;
              const displaySymbol = isAntimatter ? p.antiSymbol : p.symbol;
              const displayName = isAntimatter ? p.antiName : p.name;
              
              // Custom class depending on category
              let typeClass = 'bg-violet-500/10 border-violet-500/20 text-violet-300';
              if (p.zooType === 'Lepton') typeClass = 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300';
              if (p.zooType === 'Boson') typeClass = 'bg-orange-500/10 border-orange-500/20 text-orange-300';
              if (p.zooType === 'Hadron') typeClass = 'bg-purple-500/10 border-purple-500/20 text-purple-300';
              if (p.zooType === 'BSM') typeClass = 'bg-sky-500/10 border-sky-500/20 text-sky-300';

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedParticle(p)}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all group select-none leading-normal ${
                    isSelected
                      ? isAntimatter
                        ? 'border-pink-500/80 bg-pink-500/5 shadow-[0_0_15px_rgba(236,72,153,0.15)]'
                        : 'border-blue-500/80 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                      : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    
                    {/* Symbol Sphere */}
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-mono text-base font-black border transition-transform duration-300 group-hover:scale-105 shrink-0"
                      style={{
                        borderColor: p.glowColor + '40',
                        background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.08), ${p.glowColor}25)`,
                        color: p.glowColor,
                        boxShadow: isSelected ? `0 0 15px ${p.glowColor}40` : 'none'
                      }}
                    >
                      {displaySymbol}
                    </div>

                    <div className="flex flex-col min-w-0 leading-tight">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm tracking-tight truncate">
                          {displayName}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest ${typeClass}`}>
                          {p.zooType}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-mono text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Scale className="w-3 h-3 text-cyan-500" /> {p.mass}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" /> {formatCharge(p.charge)}e
                        </span>
                        {p.quarkContent && (
                          <span className="flex items-center gap-1 text-purple-400">
                            <Dna className="w-3 h-3" /> {p.quarkContent}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[9px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 group-hover:text-slate-300 transition-colors">
                      SPIN {p.spin}
                    </span>
                  </div>

                </div>
              );
            })
          )}

        </div>

        {/* 3D DETAIL INSPECTOR SECTION (5 Cols) */}
        <div className="lg:col-span-5 h-full lg:sticky lg:top-24 flex flex-col gap-4">
          
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-5 relative overflow-hidden backdrop-blur-md">
            
            {/* Embedded 3D Canvas visualizer */}
            <ThreeInspector particle={selectedParticle} isAntimatter={isAntimatter} />

            {/* Particle Diagnostic Details */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-1">
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] text-blue-400 uppercase tracking-widest leading-none mb-1">
                    Holographic Zoo Diagnostic
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight leading-none">
                    {isAntimatter ? selectedParticle.antiName : selectedParticle.name}
                  </h3>
                </div>
                <div className="font-mono text-base font-semibold text-blue-400 bg-black/40 px-3 py-1 rounded-lg border border-white/10 leading-none">
                  {isAntimatter ? selectedParticle.antiSymbol : selectedParticle.symbol}
                </div>
              </div>

              {/* Quantum statistics list */}
              <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
                <div className="p-2 bg-black/20 border border-white/10 rounded-xl flex flex-col justify-center">
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider mb-0.5">Mass</span>
                  <span className="text-slate-200 font-semibold truncate">{selectedParticle.mass}</span>
                </div>
                <div className="p-2 bg-black/20 border border-white/10 rounded-xl flex flex-col justify-center">
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider mb-0.5">Charge</span>
                  <span className="text-slate-200 font-semibold truncate">{formatCharge(selectedParticle.charge)}e</span>
                </div>
                <div className="p-2 bg-black/20 border border-white/10 rounded-xl flex flex-col justify-center">
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider mb-0.5">Spin</span>
                  <span className="text-slate-200 font-semibold truncate">{selectedParticle.spin}</span>
                </div>
              </div>

              {/* Decay Modes (if applicable) */}
              <div className="p-3 bg-black/20 border border-dashed border-white/15 rounded-xl text-xs flex flex-col gap-1.5 font-mono">
                <div className="flex items-center gap-1.5 text-pink-400 uppercase tracking-wider text-[9px] font-bold">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  Decay Profile / Stability
                </div>
                <span className="text-slate-300 leading-normal">
                  {selectedParticle.decayModes || 'Stable (Does not decay under Standard Model conditions)'}
                </span>
              </div>

              {/* Description explanation */}
              <div className="flex gap-2.5 items-start text-xs text-slate-300">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-sans">{selectedParticle.explanation}</p>
              </div>

              {/* Interactions badges */}
              <div className="flex flex-col gap-1.5 border-t border-white/10 pt-3 mt-1">
                <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest leading-none">
                  Couples with fundamental forces:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {selectedParticle.interactions.map((name) => {
                    let color = 'bg-slate-900 border-slate-800 text-slate-400';
                    if (name === 'Strong') color = 'bg-violet-950/20 border-violet-900/30 text-violet-400';
                    if (name === 'Electromagnetic') color = 'bg-orange-950/20 border-orange-900/30 text-orange-400';
                    if (name === 'Weak') color = 'bg-cyan-950/20 border-cyan-900/30 text-cyan-400';
                    if (name === 'Higgs') color = 'bg-yellow-950/20 border-yellow-900/30 text-yellow-400';

                    return (
                      <span
                        key={name}
                        className={`px-2 py-0.5 rounded border text-[9px] font-mono leading-none flex items-center gap-1 uppercase tracking-wider ${color}`}
                      >
                        <Zap className="w-2.5 h-2.5" />
                        {name}
                      </span>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
