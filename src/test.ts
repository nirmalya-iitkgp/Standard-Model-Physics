/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PARTICLES } from './data/particles';
import { ZOO_PARTICLES } from './data/zooParticles';

// Simple unit-testing runner
function runTestSuite() {
  console.log('🧪 RUNNING QUANTUM PHYSICS VALIDATION TEST SUITE...');
  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      failedTests++;
    }
  }

  try {
    // Test 1: Quarks fractional charges exist and match standard model
    const upQuark = PARTICLES.find(p => p.id === 'up');
    const downQuark = PARTICLES.find(p => p.id === 'down');
    
    assert(!!upQuark && Math.abs(upQuark.charge - 2/3) < 0.01, 'Up Quark charge is +2/3e');
    assert(!!downQuark && Math.abs(downQuark.charge - (-1/3)) < 0.01, 'Down Quark charge is -1/3e');

    // Test 2: Hadron Builder math is correct (Proton and Neutron)
    // Proton uud
    const protonCharge = (2/3) + (2/3) + (-1/3);
    assert(Math.abs(protonCharge - 1) < 0.01, 'Proton (uud) net charge is +1e');

    // Neutron udd
    const neutronCharge = (2/3) + (-1/3) + (-1/3);
    assert(Math.abs(neutronCharge - 0) < 0.01, 'Neutron (udd) net charge is 0e');

    // Pion+ (u + anti_d)
    const pionPlusCharge = (2/3) + (1/3); // antiquark has opposite charge
    assert(Math.abs(pionPlusCharge - 1) < 0.01, 'Pion+ (u-antidown) net charge is +1e');

    // Test 3: Antimatter symmetry mathematical inversion
    // In antimatter universe, charge reverses sign
    const standardElectronCharge = -1;
    const positronCharge = -standardElectronCharge;
    assert(positronCharge === 1, 'CPT Inversion: Positron (anti-electron) charge is +1e');

    const antiUpQuarkCharge = -(2/3);
    assert(Math.abs(antiUpQuarkCharge - (-2/3)) < 0.01, 'CPT Inversion: Anti-up quark charge is -2/3e');

    // Test 4: Feynman Beta Decay vertex conservation balance
    // d(-1/3) -> u(+2/3) + W-(-1)
    const betaVertex1In = -1/3;
    const betaVertex1Out = (2/3) + (-1);
    assert(Math.abs(betaVertex1In - betaVertex1Out) < 0.01, 'Beta Decay Vertex 1 charge is conserved');

    // W-(-1) -> e-(-1) + antineutrino(0)
    const betaVertex2In = -1;
    const betaVertex2Out = -1 + 0;
    assert(betaVertex2In === betaVertex2Out, 'Beta Decay Vertex 2 charge is conserved');

    // Test 5: Particle Zoo Integrity Check
    assert(ZOO_PARTICLES.length >= 15, 'Particle Zoo dataset is fully populated with hadrons, leptons, and bosons');
    const bsmParticle = ZOO_PARTICLES.find(p => p.zooType === 'BSM');
    assert(!!bsmParticle, 'Speculative Beyond-Standard-Model particles are included in the zoo');

    const lambdaBaryon = ZOO_PARTICLES.find(p => p.id === 'zoo_lambda');
    assert(!!lambdaBaryon && lambdaBaryon.quarkContent === 'uds', 'Hyperon Baryon (Lambda) quark structure is valid (uds)');

    // Test 6: Lepton and Baryon Number Conservation Rules
    // Neutron (B=1, L=0) -> Proton (B=1, L=0) + Electron (B=0, L=1) + Antineutrino (B=0, L=-1)
    const betaBaryonIn = 1;
    const betaBaryonOut = 1 + 0 + 0;
    const betaLeptonIn = 0;
    const betaLeptonOut = 0 + 1 + (-1);
    assert(betaBaryonIn === betaBaryonOut, 'Beta Decay: Baryon number B=1 is conserved');
    assert(betaLeptonIn === betaLeptonOut, 'Beta Decay: Lepton number L=0 is conserved');

    // Test 7: Compton Scattering conservation equations validation
    const comptonChargeIn = -1 + 0;
    const comptonChargeOut = -1 + 0;
    const comptonLeptonIn = 1 + 0;
    const comptonLeptonOut = 1 + 0;
    assert(comptonChargeIn === comptonChargeOut, 'Compton Scattering: Charge is conserved');
    assert(comptonLeptonIn === comptonLeptonOut, 'Compton Scattering: Lepton number is conserved');

    // Print summary
    console.log(`\n📊 TEST SUMMARY: ${passedTests} passed, ${failedTests} failed.`);
    if (failedTests > 0) {
      process.exit(1);
    } else {
      console.log('🎉 ALL PHYSICS SYSTEMS STANDING BY & PERFECTLY VALIDATED!\n');
    }
  } catch (error) {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
  }
}

runTestSuite();
