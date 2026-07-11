# The Standard Model Explorer 🌌

An elite, highly interactive, and visually breathtaking educational full-stack web application designed for students, educators, and particle physics enthusiasts to explore and understand **The Standard Model of Particle Physics**.

Built with modern **React 19**, **Vite**, **Tailwind CSS v4**, and **Three.js** to deliver high-performance 3D visual particle inspection, interactive assembly labs, and gamified detectors directly in the browser.

---

## 🚀 Key Features

### 1. Global UI & "Antimatter" Symmetry Toggle
- **Futuristic HUD Laboratory Theme**: Designed with an eye-safe, deep-space background (`#050810`) and modern "Inter" / "Space Grotesk" typography.
- **CPT Antimatter Symmetry Switch**: Flip the entire workspace into an "Antimatter Universe." Colors invert, particle symbols swap to antiparticle notations, names dynamically translate (e.g., *Electron* ➔ *Positron*, *Up Quark* ➔ *Anti-Up Quark*), and electric charges mathematically reverse signs.

### 2. Interactive 3D Particle Grid & Inspector
- **Iconic 4x4 Grid (+ Higgs)**: Organized cleanly by Quarks, Leptons, and Gauge Bosons, with generation badges (Gen 1: Everyday Matter, Gen 2: Cosmic Showers, Gen 3: High Energy Colliders).
- **Three.js 3D Particle Inspector**: Particles are rendered as animated, glowing quantum energy spheres.
  - **Spin Representation**: Rotation speeds correspond directly to quantum spin numbers (spin-1 bosons spin quickly, spin-1/2 fermions rotate at moderate speeds, and spin-0 Higgs slowly pulses waves).
  - **Charge Representation**: Active charge satellites orbit positive/negative particles, while neutral particles project diffuse, concentric halo fields.
  - **Mass Representation**: Visual size scales with physical rest mass, with heavy generation particles possessing denser, warping orbital wireframes.

### 3. Cosmic Timeline "Big Bang" Slider
- Drag the slider from the **Planck Epoch ($10^{-43}$ s)** to the **Present Era** to filter particles.
- Particles that cannot stably exist at an epoch's extreme temperature and energy density are dynamically dimmed and marked as **DISSOLVED**, showing how the universe cooled and structures formed as forces separated.

### 4. Interactive Physics Labs (Tabbed Interface)
- **Lab 1: Hadron Assembly & Higgs Drag**:
  - Combine quarks (or antiquarks if Antimatter is active) in triplets (Baryons) or pairs (Mesons) to form composite Hadrons (e.g., Protons, Neutrons, Pions).
  - Calculates and displays fractional electric charges (e.g., $+2/3 + 2/3 - 1/3 = +1e$).
  - **Higgs Field Coupling Slider**: Sliding the Higgs strength increases visual inertial drag, trails, and pulsation weights on quarks inside the ring.
- **Lab 2: Feynman Diagram Canvas**:
  - Click-to-connect nodes in an interactive HTML5 Canvas to map fundamental quantum interactions: **Electron-Positron Annihilation**, **Neutron Beta Decay**, **Compton Scattering**, and **Quark-Gluon Vertex**.
  - **Auto-Populate Presets Dropdown**: Includes a dedicated dropdown preset menu that instantly auto-constructs, renders, and validates diagrams without needing manual coordinate clicking.
  - Connect vertices to draw straight fermion arrows, wavy electroweak bosons, or curly gluon helixes, validating **Electric Charge (Q)**, **Lepton Number (L)**, and **Baryon Number (B)** conservation at each vertex.
  - Specially designed specs panel providing visual specs of the emitted gauge bosons ($W$, $Z$, Photon, Gluon).
- **Lab 3: Beyond the Standard Model (BSM)**:
  - Classified laboratory files displaying speculative candidates (Graviton, Dark Matter WIMPs, and Sparticles).
  - Visually explains the math loop incompatibility between Quantum Field Theory (discrete, self-interacting gravitons) and General Relativity (smooth space-time curves).
- **Lab 4: The Particle Zoo Archive**:
  - A comprehensive registry listing all known particles within and beyond the Standard Model, including hadrons (protons, neutrons, pions, kaons, J/Psi, Lambdas, Deltas, Omegas) and superpartners.
  - Rich interactive sorting (by mass or charge) and multi-tier filtering options (by particle type, charge, mass range, or text search).
  - Detailed diagnostic panel utilizing our WebGL 3D Inspector showing decay profiles, mass ranges, spins, electric charges, and force coupling parameters.
  - **Higgs Field Vacuum Expectation Value (VEV) Mass Modulator**: A master slider letting you adjust the Higgs VEV from 0 to 500 GeV, recalculating and rendering all elementary particle masses in real-time. Displays dynamic universe state scenarios (e.g. massless electrons or collapsed stars) and simulates QCD binding masses to keep hadrons physically stable under zero-coupling scenarios.
  - **Common Decay Paths Visualization**: A branching diagram tree mapping the decay modes of unstable particles, showing exact branching ratio percentages and final product symbols that conjugate dynamically when switching to the Antimatter universe.
- **Lab 5: Quantum Tunneling Wavefunction Simulator**:
  - A gorgeous, real-time, canvas-based quantum mechanics simulation displaying a probability wavepacket incident on a potential energy barrier.
  - Adjust physical parameters (particle energy, particle mass, barrier height, and barrier width) and see transmission ($T$) and reflection ($R$) coefficients calculated and plotted in real-time.
  - Includes a beautiful custom math display detailing the exact Schrödinger equation approximation used to solve the tunneling probability.

### 5. Gamification: "Cosmic Ray Hunter" Cloud Chamber
- Click the floating **Detect!** HUD button to open a physical **Cloud Chamber** simulation.
- Droplets condense to form fading paths that bend under a positive magnetic field.
- Analyze the track's physical traits (sharp left curve = lightweight negative electron, thick straight path = heavy muon, neutral V-split decay = solar neutrino) to identify the cosmic ray and earn points!

---

## 🧪 Scientific Validation & Physics Accuracy
The mathematical models used throughout this explorer are strictly mapped to real-world particle metrics:
- **Quarks fractional charges**: $+2/3e$ or $-1/3e$.
- **Hadron compositing**: Protons are ($uud$, $+1e$), Neutrons are ($udd$, $0e$), positive Pions are ($u\bar{d}$, $+1e$).
- **Feynman charge balances**:
  - *Beta Decay Vertex 1*: $d(-1/3) \rightarrow u(+2/3) + W^-(-1)$.
  - *Beta Decay Vertex 2*: $W^-(-1) \rightarrow e^-(-1) + \bar{\nu}_e(0)$.
- **Lorentz Force Law**: $\vec{F} = q(\vec{E} + \vec{v} \times \vec{B})$ is simulated in the cloud chamber to bend charges according to mass and charge sign.

---

## 🛠️ Tech Stack & Architecture

- **Runtime & UI**: React 18+ (bundled with Vite)
- **Styling**: Tailwind CSS v4.0 (Utility classes and custom themes)
- **3D Graphics Engine**: Three.js (WebGL renderer)
- **2D Physics & Simulations**: HTML5 Canvas API (optimized using `requestAnimationFrame`)
- **Icons**: Lucide React
- **Types**: Full TypeScript (type-safe standard model configurations)

---

## 🏗️ Getting Started

### Installation
1. Install base dependencies:
   ```bash
   npm install
   ```

### Run Development Server
1. Start the Vite server on port 3000:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000` to view the application.

### Build and Package
To build the static distribution bundle:
```bash
npm run build
```
Static files will be bundled inside `/dist` for easy hosting.
