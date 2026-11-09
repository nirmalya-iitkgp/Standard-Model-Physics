/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Atom, Compass, Layers } from 'lucide-react';

export type LabTab = 'hadron' | 'feynman' | 'bsm' | 'zoo' | 'tunneling';

interface StickySubNavProps {
  currentTab: LabTab;
  onSelectTab: (tab: LabTab) => void;
  isAntimatter: boolean;
}

const LABS: { id: LabTab; label: string; number: string }[] = [
  { id: 'hadron', label: 'Hadron & Higgs Drag', number: '01' },
  { id: 'feynman', label: 'Feynman Canvas', number: '02' },
  { id: 'bsm', label: 'BSM Theories', number: '03' },
  { id: 'zoo', label: 'Particle Zoo', number: '04' },
  { id: 'tunneling', label: 'Quantum Tunneling', number: '05' },
];

export default function StickySubNav({ currentTab, onSelectTab, isAntimatter }: StickySubNavProps) {
  const handleTabClick = (tab: LabTab) => {
    onSelectTab(tab);
    // Smoothly scroll down to interactive labs panel
    const panel = document.getElementById('interactive-labs-panel');
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToGrid = () => {
    const grid = document.getElementById('model-grid-and-detail-pane');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      id="sticky-sub-nav"
      className="w-full bg-slate-950/85 backdrop-blur-md border-b border-white/10 sticky top-[72px] z-20 px-4 md:px-8 py-2 select-none shadow-md transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 overflow-x-auto">
        {/* Navigation Shortcut to Grid */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleScrollToGrid}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Scroll to Particle Matrix & Holographic Inspector"
          >
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>Particle Matrix</span>
          </button>
          <span className="text-slate-600 font-mono text-xs hidden sm:inline">|</span>
        </div>

        {/* 5 Lab Modules */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto w-full sm:w-auto py-0.5">
          {LABS.map((lab) => {
            const isActive = currentTab === lab.id;
            return (
              <button
                key={lab.id}
                onClick={() => handleTabClick(lab.id)}
                id={`subnav-tab-${lab.id}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer transition-all duration-200 shrink-0 ${
                  isActive
                    ? isAntimatter
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="text-[10px] opacity-60">LAB {lab.number}:</span>
                <span>{lab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
