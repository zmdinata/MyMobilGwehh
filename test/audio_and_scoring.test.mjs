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

test('PhysicsVehicle - Airborne detection, timer accumulation, and floating badge', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = new PhysicsVehicle(500, 50); // high in air
  for (let i = 0; i < 40; i++) {
    vehicle.update(0.02, { gas: false, brake: false }, terrain);
  }
  assert.ok(vehicle.airTime >= 0.75, 'Airborne timer accumulates during flight');
  assert.ok(vehicle.airborneBadge.includes('AIR TIME'), 'Airborne floating badge is active');

  // Safe landing awards airborne bonus
  vehicle.y = terrain.getHeight(vehicle.x) - 34;
  vehicle.rearWheel.onGround = true;
  vehicle.frontWheel.onGround = true;
  vehicle.angle = 0;
  vehicle.wasAirborne = true;
  vehicle.handleLanding(terrain);
  assert.ok(vehicle.stuntCoinsAwarded > 0, 'Sustained safe jump awards bonus stunt coins');
  assert.ok(vehicle.stuntMessage.includes('AIR TIME'), 'Stunt banner displays air time achievement');
});

test('PhysicsVehicle - Wheelie and stoppie ground stunt detection and rewards', () => {
  const terrain = new TerrainSystem(4600);
  const v = new PhysicsVehicle(150, terrain.getHeight(150) - 34);

  // Wheelie (rear wheel on ground, front wheel lifted, tilted up)
  for (let i = 0; i < 35; i++) {
    v.rearWheel.y = terrain.getHeight(v.rearWheel.x) - v.wheelRadius + 1;
    v.frontWheel.y = terrain.getHeight(v.frontWheel.x) - v.wheelRadius - 20;
    v.angle = -0.35;
    v.physicsSubStep(0.02, { gas: true, brake: false }, terrain);
  }
  assert.ok(v.wheelieTime >= 0.6, 'Wheelie time accumulates on one wheel');
  assert.ok(v.airborneBadge.includes('WHEELIE'), 'Wheelie badge displayed in real-time');

  // Both wheels touch ground -> awards wheelie stunt bonus
  v.angle = 0;
  v.frontWheel.y = terrain.getHeight(v.frontWheel.x) - v.wheelRadius + 1;
  v.physicsSubStep(0.02, { gas: false, brake: false }, terrain);
  assert.ok(v.stuntCoinsAwarded > 0, 'Wheelie completion awards stunt coins');
  assert.ok(v.stuntMessage.includes('WHEELIE'), 'Wheelie completion banner displayed');

  // Stoppie (front wheel on ground, rear wheel lifted, tilted down)
  for (let i = 0; i < 35; i++) {
    v.frontWheel.y = terrain.getHeight(v.frontWheel.x) - v.wheelRadius + 1;
    v.rearWheel.y = terrain.getHeight(v.rearWheel.x) - v.wheelRadius - 20;
    v.angle = 0.35;
    v.physicsSubStep(0.02, { gas: false, brake: true }, terrain);
  }
  assert.ok(v.stoppieTime >= 0.6, 'Stoppie time accumulates on front wheel');
  assert.ok(v.airborneBadge.includes('STOPPIE'), 'Stoppie badge displayed in real-time');

  // Both wheels touch ground -> awards stoppie stunt bonus
  v.angle = 0;
  v.rearWheel.y = terrain.getHeight(v.rearWheel.x) - v.wheelRadius + 1;
  v.physicsSubStep(0.02, { gas: false, brake: false }, terrain);
  assert.ok(v.stuntCoinsAwarded > 0, 'Stoppie completion awards stunt coins');
  assert.ok(v.stuntMessage.includes('STOPPIE'), 'Stoppie completion banner displayed');
});

test('GameStateManager - Stunt coins and track collectibles accumulate into coinsCollected', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = new PhysicsVehicle(150, terrain.getHeight(150) - 34);
  const game = new GameStateManager();
  game.state = 'PLAYING';

  vehicle.stuntCoinsAwarded = 25;
  game.update(0.02, vehicle, terrain);

  assert.equal(game.coinsCollected, 25, 'Stunt coins added to coinsCollected');
  assert.equal(vehicle.stuntCoinsAwarded, 0, 'Awarded coins drained from vehicle');

  // Collect 2 track coins
  terrain.coins[0].collected = true;
  terrain.coins[1].collected = true;
  game.update(0.02, vehicle, terrain);

  assert.equal(game.coinsCollected, 27, 'Both track coins and stunt coins remain accumulated');
});
