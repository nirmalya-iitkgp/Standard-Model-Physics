/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ParticleType = 'quark' | 'lepton' | 'boson' | 'higgs';

export interface Particle {
  id: string;
  name: string;
  antiName: string;
  symbol: string;
  antiSymbol: string;
  type: ParticleType;
  generation?: number;
  mass: string; // e.g., "2.2 MeV/c²"
  charge: number; // elementary charge e e.g. 2/3, -1/3, -1, 0, 1
  spin: string; // e.g., "1/2", "1"
  explanation: string;
  interactions: string[]; // e.g. ["Electromagnetic", "Weak", "Strong"]
  stableEpoch: number; // index of epoch where it becomes stable/exists
  glowColor: string; // Tailwind glow color class or hex
}

export interface Epoch {
  id: string;
  time: string;
  temp: string; // e.g. "10^32 K"
  energy: string; // e.g. "10^19 GeV"
  name: string;
  description: string;
  visibleParticleTypes: ParticleType[];
  unstableParticles: string[]; // particle IDs that cannot exist yet due to high energy (not yet formed or dissolved)
}

export interface BSMParticle {
  id: string;
  name: string;
  symbol: string;
  mass: string;
  spin: string;
  role: string;
  explanation: string;
}
