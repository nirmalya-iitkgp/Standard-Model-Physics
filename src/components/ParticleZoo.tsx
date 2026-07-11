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
  Dna,
  Split
} from 'lucide-react';

interface DecayProduct {
  symbol: string;
  name: string;
  color: string;
}

interface DecayBranch {
  probability: number;
  products: DecayProduct[];
}

const DECAY_PATHS: Record<string, DecayBranch[]> = {
  zoo_strange: [
    { probability: 100.0, products: [{ symbol: 'u', name: 'Up Quark', color: '#a78bfa' }, { symbol: 'e⁻', name: 'Electron', color: '#22d3ee' }, { symbol: 'ν̄_e', name: 'Electron Antineutrino', color: '#67e8f9' }] }
  ],
  zoo_charm: [
    { probability: 95.0, products: [{ symbol: 's', name: 'Strange Quark', color: '#a855f7' }, { symbol: 'u', name: 'Up Quark', color: '#a78bfa' }, { symbol: 'd̄', name: 'Anti-Down Quark', color: '#c084fc' }] }
  ],
  zoo_bottom: [
    { probability: 99.0, products: [{ symbol: 'c', name: 'Charm Quark', color: '#8b5cf6' }, { symbol: 'ū', name: 'Anti-Up Quark', color: '#a78bfa' }, { symbol: 'd', name: 'Down Quark', color: '#c084fc' }] }
  ],
  zoo_top: [
    { probability: 100.0, products: [{ symbol: 'b', name: 'Bottom Quark', color: '#6d28d9' }, { symbol: 'W⁺', name: 'W+ Boson', color: '#0284c7' }] }
  ],
  zoo_muon: [
    { probability: 100.0, products: [
      { symbol: 'e⁻', name: 'Electron', color: '#22d3ee' },
      { symbol: 'ν̄_e', name: 'Electron Antineutrino', color: '#67e8f9' },
      { symbol: 'ν_μ', name: 'Muon Neutrino', color: '#06b6d4' }
    ] }
  ],
  zoo_tau: [
    { probability: 17.8, products: [
      { symbol: 'e⁻', name: 'Electron', color: '#22d3ee' },
      { symbol: 'ν̄_e', name: 'Electron Antineutrino', color: '#67e8f9' },
      { symbol: 'ν_τ', name: 'Tau Neutrino', color: '#0891b2' }
    ] },
    { probability: 17.4, products: [
      { symbol: 'μ⁻', name: 'Muon', color: '#06b6d4' },
      { symbol: 'ν̄_μ', name: 'Muon Antineutrino', color: '#06b6d4' },
      { symbol: 'ν_τ', name: 'Tau Neutrino', color: '#0891b2' }
    ] },
    { probability: 64.8, products: [
      { symbol: 'π⁻', name: 'Pion-', color: '#c084fc' },
      { symbol: 'ν_τ', name: 'Tau Neutrino', color: '#0891b2' }
    ] }
  ],
  zoo_w_minus: [
    { probability: 32.2, products: [{ symbol: 'l⁻', name: 'Lepton', color: '#22d3ee' }, { symbol: 'ν̄', name: 'Antineutrino', color: '#67e8f9' }] },
    { probability: 67.8, products: [{ symbol: 'q̄', name: 'Anti-Quark', color: '#a78bfa' }, { symbol: 'q', name: 'Quark', color: '#c084fc' }] }
  ],
  zoo_w_plus: [
    { probability: 32.2, products: [{ symbol: 'l⁺', name: 'Anti-Lepton', color: '#22d3ee' }, { symbol: 'ν', name: 'Neutrino', color: '#67e8f9' }] },
    { probability: 67.8, products: [{ symbol: 'q̄', name: 'Anti-Quark', color: '#a78bfa' }, { symbol: 'q', name: 'Quark', color: '#c084fc' }] }
  ],
  zoo_z: [
    { probability: 69.9, products: [{ symbol: 'hadrons', name: 'Hadrons', color: '#a855f7' }] },
    { probability: 20.1, products: [{ symbol: 'ν', name: 'Neutrinos', color: '#67e8f9' }, { symbol: 'ν̄', name: 'Antineutrinos', color: '#67e8f9' }] },
    { probability: 10.0, products: [{ symbol: 'l⁻', name: 'Lepton', color: '#22d3ee' }, { symbol: 'l⁺', name: 'Anti-Lepton', color: '#22d3ee' }] }
  ],
  zoo_higgs: [
    { probability: 58.1, products: [{ symbol: 'b', name: 'Bottom Quark', color: '#6d28d9' }, { symbol: 'b̄', name: 'Anti-Bottom', color: '#6d28d9' }] },
    { probability: 21.5, products: [{ symbol: 'W⁺', name: 'W+ Boson', color: '#0284c7' }, { symbol: 'W⁻', name: 'W- Boson', color: '#38bdf8' }] },
    { probability: 8.2, products: [{ symbol: 'g', name: 'Gluons', color: '#a855f7' }] }
  ],
  zoo_neutron: [
    { probability: 100.0, products: [
      { symbol: 'p', name: 'Proton', color: '#a855f7' },
      { symbol: 'e⁻', name: 'Electron', color: '#22d3ee' },
      { symbol: 'ν̄_e', name: 'Electron Antineutrino', color: '#67e8f9' }
    ] }
  ],
  zoo_pion_plus: [
    { probability: 99.9, products: [{ symbol: 'μ⁺', name: 'Antimuon', color: '#06b6d4' }, { symbol: 'ν_μ', name: 'Muon Neutrino', color: '#06b6d4' }] }
  ],
  zoo_pion_neutral: [
    { probability: 98.8, products: [{ symbol: 'γ', name: 'Photon', color: '#facc15' }, { symbol: 'γ', name: 'Photon', color: '#facc15' }] }
  ],
  zoo_kaon_plus: [
    { probability: 63.5, products: [{ symbol: 'μ⁺', name: 'Antimuon', color: '#06b6d4' }, { symbol: 'ν_μ', name: 'Muon Neutrino', color: '#06b6d4' }] },
    { probability: 20.7, products: [{ symbol: 'π⁺', name: 'Pion+', color: '#c084fc' }, { symbol: 'π⁰', name: 'Pion 0', color: '#d8b4fe' }] }
  ],
  zoo_jpsi: [
    { probability: 88.0, products: [{ symbol: 'hadrons', name: 'Hadrons', color: '#a855f7' }] },
    { probability: 6.0, products: [{ symbol: 'e⁺', name: 'Positron', color: '#22d3ee' }, { symbol: 'e⁻', name: 'Electron', color: '#22d3ee' }] }
  ],
  zoo_lambda: [
    { probability: 63.9, products: [{ symbol: 'p', name: 'Proton', color: '#a855f7' }, { symbol: 'π⁻', name: 'Pion-', color: '#c084fc' }] },
    { probability: 35.8, products: [{ symbol: 'n', name: 'Neutron', color: '#8b5cf6' }, { symbol: 'π⁰', name: 'Pion 0', color: '#d8b4fe' }] }
  ],
  zoo_delta: [
    { probability: 99.0, products: [{ symbol: 'p', name: 'Proton', color: '#a855f7' }, { symbol: 'π⁺', name: 'Pion+', color: '#c084fc' }] }
  ]
};

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
  const [higgsVEV, setHiggsVEV] = useState<number>(246);

  // VEV mass calculator
  const getModulatedMass = (p: ZooParticle) => {
    const scale = higgsVEV / 246;
    
    // Non-Higgs QCD binding masses (Hadrons/Composites)
    if (p.zooType === 'Hadron') {
      let qcdBinding = 0;
      let valenceQuarkFactor = 0;
      
      if (p.id === 'zoo_proton') {
        qcdBinding = 929.1;
        valenceQuarkFactor = 9.17;
      } else if (p.id === 'zoo_neutron') {
        qcdBinding = 930.5;
        valenceQuarkFactor = 11.6;
      } else if (p.id === 'zoo_pion_plus' || p.id === 'zoo_pion_minus') {
        qcdBinding = 130.47;
        valenceQuarkFactor = 9.1;
      } else if (p.id === 'zoo_pion_neutral') {
        qcdBinding = 130.58;
        valenceQuarkFactor = 4.4;
      } else if (p.id === 'zoo_kaon_plus') {
        qcdBinding = 393.0;
        valenceQuarkFactor = 100.7; // up + strange
      } else if (p.id === 'zoo_jpsi') {
        qcdBinding = 536.9;
        valenceQuarkFactor = 2560.0; // charm + anticharm
      } else if (p.id === 'zoo_lambda') {
        qcdBinding = 1012.8;
        valenceQuarkFactor = 102.9; // up + down + strange
      } else if (p.id === 'zoo_delta') {
        qcdBinding = 1215.0;
        valenceQuarkFactor = 17.0; // three up/down quarks
      } else {
        qcdBinding = p.massMeV * 0.9;
        valenceQuarkFactor = p.massMeV * 0.1;
      }
      
      const massVal = qcdBinding + valenceQuarkFactor * scale;
      return {
        massMeV: massVal,
        label: massVal >= 1000 ? `${(massVal / 1000).toFixed(3)} GeV/c²` : `${massVal.toFixed(2)} MeV/c²`
      };
    }

    // Photons and gluons are always massless
    if (p.id === 'zoo_photon' || p.id === 'zoo_gluon') {
      return { massMeV: 0, label: '0 eV/c²' };
    }

    // Elementary particles scale 100% linearly with Higgs VEV
    const massVal = p.massMeV * scale;
    if (massVal === 0) return { massMeV: 0, label: '0 eV/c²' };
    if (massVal < 0.001) {
      return { massMeV: massVal, label: `${(massVal * 1000000).toFixed(2)} eV/c²` };
    }
    if (massVal < 1.0) {
      return { massMeV: massVal, label: `${(massVal * 1000).toFixed(2)} keV/c²` };
    }
    return {
      massMeV: massVal,
      label: massVal >= 1000 ? `${(massVal / 1000).toFixed(3)} GeV/c²` : `${massVal.toFixed(2)} MeV/c²`
    };
  };

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

      {/* HIGGS FIELD MASS MODULATOR TERMINAL */}
      <div className="p-5 rounded-xl border border-white/10 bg-gradient-to-r from-yellow-950/15 via-black/40 to-yellow-950/5 relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none mix-blend-color-dodge animate-pulse" />
        
        <div className="flex-grow w-full flex flex-col gap-3 font-mono">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
              Higgs Field Vacuum Expectation Value (VEV)
            </span>
            <button
              onClick={() => setHiggsVEV(246)}
              className="text-[10px] bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-2 py-0.5 rounded hover:bg-yellow-500/20 transition-all cursor-pointer"
            >
              Reset to SM (246 GeV)
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="500"
              step="5"
              value={higgsVEV}
              onChange={(e) => setHiggsVEV(parseInt(e.target.value))}
              className="flex-grow h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <span className="text-sm font-bold text-yellow-400 min-w-[70px] text-right bg-black/40 px-2.5 py-1 rounded border border-white/5">
              {higgsVEV} GeV
            </span>
          </div>
          
          <p className="text-[10px] text-slate-400 leading-normal font-sans">
            Modulating the vacuum expectation value (<span className="font-mono text-yellow-500">v</span>) scales the Yukawa couplings. Free elementary particles obtain rest mass linearly proportional to this field intensity.
          </p>
        </div>

        {/* Dynamic Warning Explanation Badge */}
        <div className="w-full md:w-56 shrink-0 p-3 rounded-lg bg-black/30 border border-white/5 flex flex-col gap-1 text-[11px] leading-relaxed">
          <span className="font-mono font-bold text-[9px] uppercase tracking-wider text-slate-500">Universe State Summary:</span>
          {higgsVEV === 0 ? (
            <span className="text-red-400 font-bold">
              ⚠️ Massless Chaos! Electrons are massless. Atoms disintegrate instantly. Everything moves at speed of light.
            </span>
          ) : higgsVEV < 246 ? (
            <span className="text-amber-400 font-semibold">
              ❄️ Dilated Atoms: Weak coupled universe. Matter is light, chemistry is slow, star lifetimes are shortened.
            </span>
          ) : higgsVEV === 246 ? (
            <span className="text-emerald-400 font-bold font-semibold">
              🌌 Stable Chemistry: The standard physical universe of our reality. Atoms, molecules, and stars are stable.
            </span>
          ) : (
            <span className="text-cyan-400 font-semibold">
              🔥 Dense Core: Dense universe. Matter is heavy, stars collapse into black holes, atomic shells contract.
            </span>
          )}
        </div>
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
                          <Scale className="w-3 h-3 text-cyan-500" /> {getModulatedMass(p).label}
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
                  <span className="text-slate-200 font-semibold truncate">
                    {getModulatedMass(selectedParticle).label}
                  </span>
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
                  {isAntimatter && selectedParticle.decayModes
                    ? selectedParticle.decayModes
                        .replace('Proton', 'Antiproton')
                        .replace('Electron', 'Positron')
                        .replace('Quark', 'Antiquark')
                    : selectedParticle.decayModes || 'Stable (Does not decay under Standard Model conditions)'}
                </span>
              </div>

              {/* Dynamic Common Decay Paths Visual Tree */}
              {DECAY_PATHS[selectedParticle.id] && (
                <div className="p-3.5 bg-black/30 border border-white/10 rounded-xl text-xs flex flex-col gap-2 font-mono">
                  <div className="flex items-center gap-1.5 text-yellow-400 uppercase tracking-wider text-[9px] font-bold border-b border-white/5 pb-1.5">
                    <Split className="w-3.5 h-3.5" />
                    Common Decay Paths & Products
                  </div>
                  <div className="flex flex-col gap-2">
                    {DECAY_PATHS[selectedParticle.id].map((branch, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded bg-black/40 border border-white/5">
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 min-w-[36px]">{branch.probability}%</span>
                          <span className="text-slate-600">➔</span>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {branch.products.map((prod, pIdx) => {
                            let displaySymbol = prod.symbol;
                            let displayName = prod.name;
                            if (isAntimatter) {
                              if (displaySymbol === 'e⁻') displaySymbol = 'e⁺';
                              else if (displaySymbol === 'e⁺') displaySymbol = 'e⁻';
                              else if (displaySymbol === 'μ⁻') displaySymbol = 'μ⁺';
                              else if (displaySymbol === 'μ⁺') displaySymbol = 'μ⁻';
                              else if (displaySymbol === 'π⁻') displaySymbol = 'π⁺';
                              else if (displaySymbol === 'π⁺') displaySymbol = 'π⁻';
                              else if (displaySymbol === 'p') displaySymbol = 'p̄';
                              else if (displaySymbol === 'n') displaySymbol = 'n̄';
                              else if (displaySymbol === 'u') displaySymbol = 'ū';
                              else if (displaySymbol === 'd') displaySymbol = 'd̄';
                              else if (displaySymbol === 's') displaySymbol = 's̄';
                              else if (displaySymbol === 'c') displaySymbol = 'c̄';
                              else if (displaySymbol === 'b') displaySymbol = 'b̄';
                              else if (displaySymbol === 't') displaySymbol = 't̄';
                              else if (displaySymbol === 'W⁺') displaySymbol = 'W⁻';
                              else if (displaySymbol === 'W⁻') displaySymbol = 'W⁺';
                              
                              if (displayName === 'Electron') displayName = 'Positron';
                              else if (displayName === 'Positron') displayName = 'Electron';
                              else if (displayName.toLowerCase().startsWith('anti')) displayName = displayName.substring(4);
                              else displayName = 'Anti-' + displayName;
                            }
                            return (
                              <span
                                key={pIdx}
                                className="px-1.5 py-0.5 rounded text-[8px] border font-bold flex items-center gap-1 select-none"
                                style={{
                                  borderColor: prod.color + '30',
                                  color: prod.color,
                                  background: prod.color + '0a'
                                }}
                                title={displayName}
                              >
                                {displaySymbol}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
