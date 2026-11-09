# Standard Model Explorer

Interactive particle physics terminal for exploring elementary particles, field symmetries, cosmic epochs, and quantum interactions.

Built with React 19, TypeScript, Three.js, and Tailwind CSS.

---

## Features

### Navigation & Layout
- **Sticky Sub-Navigation Bar**: Anchors LAB 01 through LAB 05 in a persistent bar directly below the header. Switch experiments from anywhere on the page with smooth viewport scrolling, plus quick jump to the Particle Matrix.
- **Unified Simulation Control Bar**: Combines the Cosmic Epoch filter, CPT Antimatter toggle, and Cosmic Ray Hunter launch button into a single toolbar at the top of the interface.
- **Collapsible Accordions**: Cosmic Evolution Timeline and Hadron Deck instructions/presets can be collapsed to minimize initial page length while keeping active states visible.

### Particle Matrix & Cards
- **Prioritized Symbol Typography**: Highlights primary symbols (`u`, `c`, `t`, `e⁻`, `γ`, `H⁰`) in large monospace font, with full names and masses in a quiet sub-row.
- **Consolidated Metadata Chips**: Charge and spin are merged into a single standardized chip (`+2/3e • s=½`).
- **Elevated Hover States**: Interactive cards raise with subtle shadows and category glow rings upon hover.
- **Fluid Responsive Scaling**: Scales across 2 columns (mobile), 3 columns (tablet), and 6 columns (desktop) without awkward wrapping.

### Diagnostics & Inspection Panel
- **Top Metric Strip**: Fixed horizontal strip displaying Mass, Charge, Spin, and Lifetime at the top of the panel.
- **Visual Symmetry Indicators**: Color-coded badges denote exact, broken, or approximate symmetries (CPT Invariance, Color SU(3), Electroweak symmetry breaking, Parity violation).
- **Interactive Decay Channel Visualizer**: Visual decay tree diagram illustrating parent-to-product transitions with branching ratios, force mediators, and lifetimes for unstable particles, or ground-state wave indicator for stable particles.
- **WebGL 3D Particle Inspector**: 3D particle visualization with spin-rate scaling, orbiting charge satellites, and quantum clouds.

### Simulation Laboratories
- **LAB 01: Hadron Assembly & Higgs Drag**:
  - Drag-and-drop quarks directly into the collider chamber or click to assemble baryons and mesons.
  - Tangible Higgs drag visual feedback with trailing wake rings, viscous delay, and inertial mass multipliers ($m_{\text{eff}} = m_0 \times (1 + \lambda)$).
- **LAB 02: Feynman Diagram Canvas**:
  - Node-based diagram editor supporting electron-positron annihilation, beta decay, Compton scattering, and quark-gluon vertices with conservation validation.
- **LAB 03: Beyond Standard Model (BSM)**:
  - Candidates including Gravitons, WIMP Dark Matter, and Supersymmetric sparticles.
- **LAB 04: The Particle Zoo**:
  - Filterable catalog of hadrons, leptons, and bosons with live Higgs VEV mass modulation ($0$ to $500\text{ GeV}$).
- **LAB 05: Quantum Tunneling**:
  - Real-time Schrödinger equation wavefunction simulator with barrier transmission and reflection plotting.
- **Cosmic Ray Cloud Chamber Minigame**:
  - Track curvature game simulating Lorentz force $\vec{F} = q(\vec{E} + \vec{v} \times \vec{B})$.

---

## Physics Validation & Testing

Unit tests validate quantum conservation laws and data integrity:
- Quarks fractional charges ($+2/3e$, $-1/3e$)
- Baryon and meson net charge arithmetic
- CPT charge inversion
- Weak vertex charge, baryon number ($B$), and lepton number ($L$) conservation
- Higgs VEV mass scaling and non-zero QCD chiral binding mass
- Tunneling transmission probability ($0 < T < 1$)
- Top quark, muon, and Higgs decay channels and branching ratios
- Particle stability classifications and symmetry invariants

To run the test suite:
```bash
npm test
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Run unit tests
npm test

# Typecheck / Lint
npm run lint

# Production build
npm run build
```
