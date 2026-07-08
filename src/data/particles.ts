/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Particle, Epoch, BSMParticle } from '../types';

export const PARTICLES: Particle[] = [
  // QUARKS
  {
    id: 'up',
    name: 'Up Quark',
    antiName: 'Anti-Up Quark',
    symbol: 'u',
    antiSymbol: 'ū',
    type: 'quark',
    generation: 1,
    mass: '2.2 MeV/c²',
    charge: 2/3,
    spin: '1/2',
    explanation: 'The lightest and most stable quark. Along with the down quark, it forms protons and neutrons which constitute the nuclei of standard matter.',
    interactions: ['Strong', 'Weak', 'Electromagnetic', 'Higgs'],
    stableEpoch: 2, // Electroweak / Quark epoch
    glowColor: '#a78bfa' // Neon Violet
  },
  {
    id: 'charm',
    name: 'Charm Quark',
    antiName: 'Anti-Charm Quark',
    symbol: 'c',
    antiSymbol: 'c̄',
    type: 'quark',
    generation: 2,
    mass: '1.28 GeV/c²',
    charge: 2/3,
    spin: '1/2',
    explanation: 'A heavy second-generation quark. It decays rapidly via the weak interaction and can only be produced in high-energy collisions.',
    interactions: ['Strong', 'Weak', 'Electromagnetic', 'Higgs'],
    stableEpoch: 1, // Electroweak
    glowColor: '#8b5cf6'
  },
  {
    id: 'top',
    name: 'Top Quark',
    antiName: 'Anti-Top Quark',
    symbol: 't',
    antiSymbol: 't̄',
    type: 'quark',
    generation: 3,
    mass: '173.1 GeV/c²',
    charge: 2/3,
    spin: '1/2',
    explanation: 'The most massive of all observed elementary particles. Its mass is comparable to an entire atom of gold, decaying before it can form hadrons.',
    interactions: ['Strong', 'Weak', 'Electromagnetic', 'Higgs'],
    stableEpoch: 1, // Electroweak
    glowColor: '#7c3aed'
  },
  {
    id: 'down',
    name: 'Down Quark',
    antiName: 'Anti-Down Quark',
    symbol: 'd',
    antiSymbol: 'd̄',
    type: 'quark',
    generation: 1,
    mass: '4.7 MeV/c²',
    charge: -1/3,
    spin: '1/2',
    explanation: 'The second-lightest quark. It forms protons (uud) and neutrons (udd) when bound to up quarks by gluons.',
    interactions: ['Strong', 'Weak', 'Electromagnetic', 'Higgs'],
    stableEpoch: 2, // Electroweak / Quark
    glowColor: '#c084fc'
  },
  {
    id: 'strange',
    name: 'Strange Quark',
    antiName: 'Anti-Strange Quark',
    symbol: 's',
    antiSymbol: 's̄',
    type: 'quark',
    generation: 2,
    mass: '96.0 MeV/c²',
    charge: -1/3,
    spin: '1/2',
    explanation: 'A second-generation quark possessing a property called "strangeness". It has a remarkably long lifetime compared to other unstable particles.',
    interactions: ['Strong', 'Weak', 'Electromagnetic', 'Higgs'],
    stableEpoch: 2,
    glowColor: '#a855f7'
  },
  {
    id: 'bottom',
    name: 'Bottom Quark',
    antiName: 'Anti-Bottom Quark',
    symbol: 'b',
    antiSymbol: 'b̄',
    type: 'quark',
    generation: 3,
    mass: '4.18 GeV/c²',
    charge: -1/3,
    spin: '1/2',
    explanation: 'A massive third-generation quark. It decays almost exclusively into a charm quark or an up quark via the weak nuclear force.',
    interactions: ['Strong', 'Weak', 'Electromagnetic', 'Higgs'],
    stableEpoch: 1,
    glowColor: '#6d28d9'
  },

  // LEPTONS
  {
    id: 'electron',
    name: 'Electron',
    antiName: 'Positron',
    symbol: 'e⁻',
    antiSymbol: 'e⁺',
    type: 'lepton',
    generation: 1,
    mass: '0.511 MeV/c²',
    charge: -1,
    spin: '1/2',
    explanation: 'The primary carrier of electricity and the foundation of chemical bonds. It orbits atomic nuclei to form neutral atoms.',
    interactions: ['Weak', 'Electromagnetic', 'Higgs'],
    stableEpoch: 3, // Hadron/Lepton epoch
    glowColor: '#22d3ee' // Electric Cyan
  },
  {
    id: 'muon',
    name: 'Muon',
    antiName: 'Antimuon',
    symbol: 'μ⁻',
    antiSymbol: 'μ⁺',
    type: 'lepton',
    generation: 2,
    mass: '105.7 MeV/c²',
    charge: -1,
    spin: '1/2',
    explanation: 'A heavier cousin of the electron. Highly penetrating, muons can pass through hundreds of meters of solid rock before absorbing.',
    interactions: ['Weak', 'Electromagnetic', 'Higgs'],
    stableEpoch: 2,
    glowColor: '#06b6d4'
  },
  {
    id: 'tau',
    name: 'Tau',
    antiName: 'Antitau',
    symbol: 'τ⁻',
    antiSymbol: 'τ⁺',
    type: 'lepton',
    generation: 3,
    mass: '1.777 GeV/c²',
    charge: -1,
    spin: '1/2',
    explanation: 'The heaviest and most unstable lepton, about 3,500 times more massive than an electron. It is the only lepton that can decay into hadrons.',
    interactions: ['Weak', 'Electromagnetic', 'Higgs'],
    stableEpoch: 1,
    glowColor: '#0891b2'
  },
  {
    id: 'ele_neutrino',
    name: 'Electron Neutrino',
    antiName: 'Electron Antineutrino',
    symbol: 'ν_e',
    antiSymbol: 'ν̄_e',
    type: 'lepton',
    generation: 1,
    mass: '< 0.8 eV/c²',
    charge: 0,
    spin: '1/2',
    explanation: 'An extremely light, neutral lepton that barely interacts with matter, able to fly through light-years of lead unimpeded.',
    interactions: ['Weak', 'Gravity'],
    stableEpoch: 3,
    glowColor: '#67e8f9'
  },
  {
    id: 'mu_neutrino',
    name: 'Muon Neutrino',
    antiName: 'Muon Antineutrino',
    symbol: 'ν_μ',
    antiSymbol: 'ν̄_μ',
    type: 'lepton',
    generation: 2,
    mass: '< 0.17 MeV/c²',
    charge: 0,
    spin: '1/2',
    explanation: 'A second-generation neutrino produced in muon decays. Neutrinos constantly fluctuate (oscillate) between their three generation types.',
    interactions: ['Weak', 'Gravity'],
    stableEpoch: 2,
    glowColor: '#22d3ee'
  },
  {
    id: 'tau_neutrino',
    name: 'Tau Neutrino',
    antiName: 'Tau Antineutrino',
    symbol: 'ν_τ',
    antiSymbol: 'ν̄_τ',
    type: 'lepton',
    generation: 3,
    mass: '< 18.2 MeV/c²',
    charge: 0,
    spin: '1/2',
    explanation: 'The heaviest and most elusive of the standard model neutrinos, finally directly detected in 2000 at Fermilab.',
    interactions: ['Weak', 'Gravity'],
    stableEpoch: 1,
    glowColor: '#0e7490'
  },

  // GAUGE BOSONS
  {
    id: 'gluon',
    name: 'Gluon',
    antiName: 'Gluon',
    symbol: 'g',
    antiSymbol: 'g',
    type: 'boson',
    mass: '0',
    charge: 0,
    spin: '1',
    explanation: 'The gauge boson responsible for the strong force, binding quarks into protons and neutrons. Gluons carry "color charge" and interact with themselves.',
    interactions: ['Strong'],
    stableEpoch: 2,
    glowColor: '#fdba74' // Blazing Orange light
  },
  {
    id: 'photon',
    name: 'Photon',
    antiName: 'Photon',
    symbol: 'γ',
    antiSymbol: 'γ',
    type: 'boson',
    mass: '0',
    charge: 0,
    spin: '1',
    explanation: 'The quantum of light and the mediator of electromagnetism. Photons have zero rest mass and travel at the absolute speed limit of the universe.',
    interactions: ['Electromagnetic'],
    stableEpoch: 3,
    glowColor: '#f97316' // Blazing Orange
  },
  {
    id: 'z_boson',
    name: 'Z Boson',
    antiName: 'Z Boson',
    symbol: 'Z⁰',
    antiSymbol: 'Z⁰',
    type: 'boson',
    mass: '91.19 GeV/c²',
    charge: 0,
    spin: '1',
    explanation: 'A massive, electrically neutral weak boson. It mediates neutral current weak interactions, enabling momentum transfer without charge swap.',
    interactions: ['Weak'],
    stableEpoch: 1,
    glowColor: '#ea580c'
  },
  {
    id: 'w_plus_boson',
    name: 'W+ Boson',
    antiName: 'W- Boson',
    symbol: 'W⁺',
    antiSymbol: 'W⁻',
    type: 'boson',
    mass: '80.38 GeV/c²',
    charge: 1,
    spin: '1',
    explanation: 'The positively charged weak force carrier. It changes the flavor of quarks (e.g. down to up quark in beta minus decay).',
    interactions: ['Weak', 'Electromagnetic'],
    stableEpoch: 1,
    glowColor: '#c2410c'
  },
  {
    id: 'w_minus_boson',
    name: 'W- Boson',
    antiName: 'W+ Boson',
    symbol: 'W⁻',
    antiSymbol: 'W⁺',
    type: 'boson',
    mass: '80.38 GeV/c²',
    charge: -1,
    spin: '1',
    explanation: 'The negatively charged weak force carrier. It acts as the antiparticle to the W+ Boson, and plays a key role in radioactive beta decay.',
    interactions: ['Weak', 'Electromagnetic'],
    stableEpoch: 1,
    glowColor: '#9a3412'
  },

  // HIGGS BOSON
  {
    id: 'higgs',
    name: 'Higgs Boson',
    antiName: 'Higgs Boson',
    symbol: 'H⁰',
    antiSymbol: 'H⁰',
    type: 'higgs',
    mass: '125.1 GeV/c²',
    charge: 0,
    spin: '0',
    explanation: 'The excitation of the Higgs field, which permeates all of space. Particles moving through this field experience a drag that manifests as inertial rest mass.',
    interactions: ['Higgs', 'Weak'],
    stableEpoch: 1, // Becomes active when Electroweak Symmetry breaks
    glowColor: '#facc15' // Golden Cosmic Glow
  }
];

export const EPOCHS: Epoch[] = [
  {
    id: 'planck',
    time: '10⁻⁴³ s',
    temp: '10³² K',
    energy: '10¹⁹ GeV',
    name: 'Planck Epoch',
    description: 'The ultimate high-energy state. Gravity is unified with the other three forces. The Higgs field is inactive, meaning all particles have zero rest mass. Standard matter dissolves into pure energy.',
    visibleParticleTypes: [], // Standard particles cannot exist in this state
    unstableParticles: ['up', 'down', 'charm', 'strange', 'top', 'bottom', 'electron', 'muon', 'tau', 'ele_neutrino', 'mu_neutrino', 'tau_neutrino', 'higgs']
  },
  {
    id: 'electroweak',
    time: '10⁻¹² s',
    temp: '10¹⁵ K',
    energy: '10² GeV',
    name: 'Electroweak Epoch',
    description: 'The Higgs field cools and "freezes" into a non-zero value, turning on the Higgs mechanism! Quarks, leptons, and weak bosons acquire rest mass. Forces split, but the universe is still a boiling quark-gluon plasma.',
    visibleParticleTypes: ['quark', 'lepton', 'boson', 'higgs'],
    unstableParticles: ['up', 'down', 'electron', 'ele_neutrino'] // Standard stable building blocks are dissolved/highly energetic, heavy generation particles dominate the plasma
  },
  {
    id: 'hadron',
    time: '10⁻⁶ s',
    temp: '10¹² K',
    energy: '1 GeV',
    name: 'Hadron Epoch',
    description: 'The universe cools enough for the strong nuclear force to bind quarks together into hadrons (protons, neutrons). All heavy quarks (charm, top, bottom) have decayed into the stable Up and Down quarks.',
    visibleParticleTypes: ['quark', 'lepton', 'boson', 'higgs'],
    unstableParticles: ['top', 'bottom', 'charm']
  },
  {
    id: 'lepton',
    time: '1 s',
    temp: '10¹⁰ K',
    energy: '1 MeV',
    name: 'Lepton Epoch',
    description: 'Hadrons have finished forming. Leptons (electrons and neutrinos) dominate the universe\'s mass and energy, engaging in rapid particle-antiparticle annihilation.',
    visibleParticleTypes: ['quark', 'lepton', 'boson', 'higgs'],
    unstableParticles: ['top', 'bottom', 'charm', 'strange']
  },
  {
    id: 'nucleosynthesis',
    time: '3 min',
    temp: '10⁹ K',
    energy: '0.1 MeV',
    name: 'Nucleosynthesis',
    description: 'The temperature drops to a point where protons and neutrons fuse to form the first atomic nuclei (Hydrogen, Helium, and Lithium). High-energy electrons fly freely, preventing complete atoms from binding.',
    visibleParticleTypes: ['quark', 'lepton', 'boson', 'higgs'],
    unstableParticles: ['top', 'bottom', 'charm', 'strange', 'tau', 'muon']
  },
  {
    id: 'present',
    time: 'Present Day',
    temp: '2.7 K',
    energy: '10⁻⁴ eV',
    name: 'Present Era',
    description: 'The modern universe. Atoms have formed, stars and galaxies are born. Light quarks exist bound in atomic nuclei, electrons orbit them, and light neutrinos drift across the cosmos. Heavy particles are only seen in high-energy laboratory collisions.',
    visibleParticleTypes: ['quark', 'lepton', 'boson', 'higgs'],
    unstableParticles: [] // All particles can be created in labs, standard stable particles form the universe
  }
];

export const BSM_PARTICLES: BSMParticle[] = [
  {
    id: 'graviton',
    name: 'Graviton',
    symbol: 'G',
    mass: '0',
    spin: '2',
    role: 'Mediator of Gravity',
    explanation: 'A speculative, massless spin-2 particle that would mediate the force of gravity at the quantum scale. Its existance is predicted by quantum gravity theories but it has never been detected due to the extreme weakness of gravitational interactions.'
  },
  {
    id: 'neutralino',
    name: 'Neutralino (WIMP)',
    symbol: 'χ⁰',
    mass: '> 100 GeV/c²',
    spin: '1/2',
    role: 'Dark Matter Candidate',
    explanation: 'A stable, electrically neutral particle predicted by Supersymmetry. As a Weakly Interacting Massive Particle (WIMP), it only interacts via gravity and the weak force, making it the leading scientific candidate for the universe\'s missing Dark Matter.'
  },
  {
    id: 'selectron',
    name: 'Selectron',
    symbol: 'ẽ',
    mass: '> 100 GeV/c²',
    spin: '0',
    role: 'Supersymmetric Partner (Sparticle)',
    explanation: 'The speculative spin-0 boson partner to the electron. Supersymmetry suggests every fermion has a boson partner and vice versa, which would solve major fine-tuning problems in the Higgs field energy but requires particles much heavier than observed.'
  },
  {
    id: 'squark',
    name: 'Squark',
    symbol: 'q̃',
    mass: '> 1 TeV/c²',
    spin: '0',
    role: 'Supersymmetric Partner of Quarks',
    explanation: 'The scalar (spin-0) boson partner of quarks. Searches at the Large Hadron Collider continue to push the lower mass limit of squarks higher, suggesting that if they exist, they are extremely heavy.'
  }
];
