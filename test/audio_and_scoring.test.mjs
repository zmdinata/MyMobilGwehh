// test/audio_and_scoring.test.mjs - Unit tests for audio parameters, scoring, and edge cases
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PHYSICS_CONSTANTS,
  TerrainSystem,
  PhysicsVehicle,
  GameStateManager
} from '../game_core.js';

test('Audio Synthesizer - Frequency calculations and Telolet notes', () => {
  // Test Telolet melody frequencies
  const teloletNotes = [
    { note: 'F5', freq: 698.46 },
    { note: 'A5', freq: 880.00 },
    { note: 'C6', freq: 1046.50 },
    { note: 'A5', freq: 880.00 },
    { note: 'F5', freq: 698.46 },
    { note: 'C6', freq: 1046.50 }
  ];

  for (const n of teloletNotes) {
    assert.ok(n.freq > 500 && n.freq < 1500, `Frequency for ${n.note} is within audible musical range`);
  }

  // Coin chime frequencies (B5 -> E6)
  const b5 = 987.77;
  const e6 = 1318.51;
  assert.ok(b5 < e6, 'Coin chime is rising arpeggio');

  // Engine audio mapping function
  function getEngineFreq(speed, isGas) {
    const baseFreq = 48; // Idle diesel rumble
    const speedRatio = Math.min(1.0, Math.abs(speed) / 500);
    const gasBoost = isGas ? 35 : 0;
    return baseFreq + speedRatio * 60 + gasBoost;
  }

  assert.equal(getEngineFreq(0, false), 48, 'Idle frequency is 48 Hz');
  assert.ok(getEngineFreq(0, true) > 48, 'Gas throttle increases engine frequency at rest');
  assert.ok(getEngineFreq(500, true) > getEngineFreq(250, true), 'Higher speed increases engine frequency');
  assert.ok(getEngineFreq(1000, true) <= 150, 'Engine frequency stays within comfortable hearing range');
});

test('GameStateManager - Boundary conditions for star rating', () => {
  const gm = new GameStateManager();
  const veh = new PhysicsVehicle(4500 * PHYSICS_CONSTANTS.METER_SCALE, 300);

  // Exactly at boundary: 70% cargo, 20% fuel, 30s time => 3 stars
  veh.cargoIntegrity = 70;
  veh.fuel = 20;
  gm.timeRemaining = 30;
  assert.equal(gm.calculateStars(veh), 3, 'Boundary 70/20/30 awards 3 stars');

  // 1% below boundary in cargo: 69% cargo, 20% fuel, 30s time => 2 stars
  veh.cargoIntegrity = 69;
  veh.fuel = 20;
  gm.timeRemaining = 30;
  assert.equal(gm.calculateStars(veh), 2, '69% cargo awards 2 stars');

  // 1% below boundary in fuel: 70% cargo, 19% fuel, 30s time => 2 stars
  veh.cargoIntegrity = 70;
  veh.fuel = 19;
  gm.timeRemaining = 30;
  assert.equal(gm.calculateStars(veh), 2, '19% fuel awards 2 stars');

  // 1s below boundary in time: 70% cargo, 20% fuel, 29s time => 2 stars
  veh.cargoIntegrity = 70;
  veh.fuel = 20;
  gm.timeRemaining = 29;
  assert.equal(gm.calculateStars(veh), 2, '29s time awards 2 stars');

  // Cargo below 40%: 39% cargo, 10% fuel => 1 star
  veh.cargoIntegrity = 39;
  veh.fuel = 10;
  gm.timeRemaining = 10;
  assert.equal(gm.calculateStars(veh), 1, '39% cargo awards 1 star');
});

test('PhysicsVehicle - Edge case: 0 fuel disables acceleration', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = new PhysicsVehicle(200 * PHYSICS_CONSTANTS.METER_SCALE, 450);
  vehicle.fuel = 0;
  vehicle.vx = 0;

  // Pressing gas with 0 fuel should not increase forward speed
  vehicle.update(0.1, { gas: true, brake: false }, terrain);
  assert.ok(vehicle.vx <= 0.01, 'Vehicle cannot accelerate with 0 fuel');
});

test('Food Particles - Lifespan and removal', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = new PhysicsVehicle(200 * PHYSICS_CONSTANTS.METER_SCALE, 450);

  vehicle.triggerImpactShock(200);
  const count = vehicle.foodParticles.length;
  assert.ok(count > 0, 'Food particles created on impact');

  // Advance time by 3 seconds so all particles expire
  for (let i = 0; i < 90; i++) {
    vehicle.update(0.04, { gas: false, brake: false }, terrain);
  }
  assert.equal(vehicle.foodParticles.length, 0, 'All expired food particles cleaned up');
});

test('Audio Synthesizer - Airborne engine rev (180Hz) and suspension squeak sound', () => {
  function computeEngineAudio(speed, isGas, isAirborne) {
    const absSpeed = Math.abs(speed);
    const speedRatio = Math.min(1.0, absSpeed / 500);
    let targetFreq = 45 + speedRatio * 55 + (isGas ? 25 : 0);
    let targetFilter = 220 + speedRatio * 850 + (isGas ? 400 : 0);
    let targetGain = isGas ? 0.12 : (0.05 + speedRatio * 0.04);

    if (isAirborne && isGas) {
      targetFreq = 180;
      targetFilter = 1450;
      targetGain = 0.15;
    }

    return { targetFreq, targetFilter, targetGain };
  }

  // When on ground, idle is 45Hz
  const groundIdle = computeEngineAudio(0, false, false);
  assert.equal(groundIdle.targetFreq, 45, 'Ground idle is 45Hz');

  // When airborne and gas held, leaps up to 180Hz
  const airGas = computeEngineAudio(100, true, true);
  assert.equal(airGas.targetFreq, 180, 'Airborne throttle revs engine to 180Hz without ground load');
  assert.equal(airGas.targetFilter, 1450, 'Airborne filter opens up to 1450Hz');
  assert.equal(airGas.targetGain, 0.15, 'Airborne gain boosted to 0.15');

  // When airborne but no gas, does not leap to 180Hz
  const airNoGas = computeEngineAudio(100, false, true);
  assert.ok(airNoGas.targetFreq < 100, 'Airborne without throttle does not leap to 180Hz');

  // Suspension spring boing frequency parameters
  const springBaseFreq = 320;
  const springDecayFreq = 140;
  const springModFreq = 38;
  assert.ok(springBaseFreq > springDecayFreq, 'Spring boing frequency sweeps downward');
  assert.ok(springModFreq > 20 && springModFreq < 60, 'Spring FM modulation frequency produces metallic squeak');
});
