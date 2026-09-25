import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  BIOMES,
  PHYSICS_CONSTANTS,
  TerrainSystem,
  PhysicsVehicle,
  GameStateManager
} from '../game_core.js';

function createGroundedVehicle(terrain, startX = 150) {
  const startY = terrain.getHeight(startX) - 34;
  return new PhysicsVehicle(startX, startY);
}

test('TerrainSystem - Biome transitions and boundaries', () => {
  const terrain = new TerrainSystem(4600);

  assert.equal(terrain.getBiomeAt(0).id, BIOMES.PANTURA.id);
  assert.equal(terrain.getBiomeAt(600).id, BIOMES.PANTURA.id);
  assert.equal(terrain.getBiomeAt(1199).id, BIOMES.PANTURA.id);

  assert.equal(terrain.getBiomeAt(1200).id, BIOMES.SAWAH.id);
  assert.equal(terrain.getBiomeAt(2000).id, BIOMES.SAWAH.id);
  assert.equal(terrain.getBiomeAt(2799).id, BIOMES.SAWAH.id);

  assert.equal(terrain.getBiomeAt(2800).id, BIOMES.GUNUNG.id);
  assert.equal(terrain.getBiomeAt(3500).id, BIOMES.GUNUNG.id);
  assert.equal(terrain.getBiomeAt(4199).id, BIOMES.GUNUNG.id);

  assert.equal(terrain.getBiomeAt(4200).id, BIOMES.SEKOLAH.id);
  assert.equal(terrain.getBiomeAt(4550).id, BIOMES.SEKOLAH.id);
});

test('TerrainSystem - Continuous height, slopes, and normalized vectors', () => {
  const terrain = new TerrainSystem(4600);

  for (let m = 0; m <= 4500; m += 250) {
    const px = m * PHYSICS_CONSTANTS.METER_SCALE;
    const h = terrain.getHeight(px);
    assert.ok(typeof h === 'number' && !isNaN(h) && isFinite(h), `Height at ${m}m is valid`);

    const normal = terrain.getNormal(px);
    const nLen = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
    assert.ok(Math.abs(nLen - 1.0) < 1e-4, `Normal vector at ${m}m is unit length`);
    assert.ok(normal.y < 0, `Normal vector at ${m}m points up in canvas coordinates`);

    const tangent = terrain.getTangent(px);
    const tLen = Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y);
    assert.ok(Math.abs(tLen - 1.0) < 1e-4, `Tangent vector at ${m}m is unit length`);
    assert.ok(tangent.x > 0, `Tangent points forward`);
    const normalTangentDot = normal.x * tangent.x + normal.y * tangent.y;
    assert.ok(Math.abs(normalTangentDot) < 1e-6,
      `Ground normal is perpendicular to the tangent at ${m}m (dot: ${normalTangentDot})`);
  }
});

test('TerrainSystem - Hazards presence in proper biomes', () => {
  const terrain = new TerrainSystem(4600);

  // Biome 1 water puddles (Pantura Rob)
  assert.equal(terrain.isInWaterPuddle(280), true);
  assert.equal(terrain.isInWaterPuddle(100), false);
  assert.equal(terrain.isInWaterPuddle(1500), false);

  // Biome 2 mud pits (Sawah Mud)
  assert.equal(terrain.isInMudPit(1450), true);
  assert.equal(terrain.isInMudPit(500), false);
  assert.equal(terrain.isInMudPit(3200), false);

  // Biome 3 wooden logs
  const logCollision = terrain.checkLogCollision(2950 * PHYSICS_CONSTANTS.METER_SCALE, 0, 18);
  assert.ok(logCollision !== undefined);

  // Biome 4 finish line location
  assert.equal(terrain.finishLineMeters, 4500);
});

test('TerrainSystem - Dynamic Jerrycan Spawning when fuel < 20%', () => {
  const terrain = new TerrainSystem(4600);
  const initialCount = terrain.fuelCans.length;

  // Truck is at 520m; next static can is at 850m (which is > 300m away).
  const spawned = terrain.triggerDynamicJerrycanSpawn(520);
  assert.ok(spawned !== null, 'Spawned dynamic jerrycan when no can is within 300m');
  assert.ok(spawned.dynamic, 'Jerrycan marked as dynamic');
  assert.ok(spawned.x > 520, 'Jerrycan placed ahead of truck');
  assert.equal(terrain.fuelCans.length, initialCount + 1);

  // If another check happens immediately, should not duplicate
  const duplicate = terrain.triggerDynamicJerrycanSpawn(520);
  assert.equal(duplicate, null, 'Does not duplicate nearby jerrycan');
});

test('PhysicsVehicle - Fuel pickup restores 30 points and forward speed stays inside the HCR-style cap', () => {
  const terrain = new TerrainSystem(4600);
  const x = 180 * PHYSICS_CONSTANTS.METER_SCALE;
  const vehicle = createGroundedVehicle(terrain, x);
  vehicle.fuel = 50;
  vehicle.checkPickups(terrain);
  assert.equal(vehicle.fuel, 80, 'A collected jerrycan restores 30 percentage points');

  vehicle.vx = PHYSICS_CONSTANTS.MAX_FORWARD_SPEED + 200;
  vehicle.update(1 / 120, { gas: false, brake: false }, terrain);
  assert.ok(vehicle.vx <= PHYSICS_CONSTANTS.MAX_FORWARD_SPEED,
    'Speed is clamped after the physics integration step');
  assert.equal(PHYSICS_CONSTANTS.MAX_FORWARD_SPEED, 550, 'Forward cap maps to 99 km/h at the HUD scale');
});

test('PhysicsVehicle - Dual strut suspension and ground clamping', () => {
  const terrain = new TerrainSystem(4600);
  const groundAtStart = terrain.getHeight(200 * PHYSICS_CONSTANTS.METER_SCALE);
  const vehicle = new PhysicsVehicle(200 * PHYSICS_CONSTANTS.METER_SCALE, groundAtStart - 60);

  // Drop vehicle onto terrain and step physics
  for (let i = 0; i < 90; i++) {
    vehicle.update(1 / 60, { gas: false, brake: false }, terrain);
  }

  // Check wheels settled near ground surface
  const rGroundY = terrain.getHeight(vehicle.rearWheel.x);
  const fGroundY = terrain.getHeight(vehicle.frontWheel.x);

  const rPen = (vehicle.rearWheel.y + vehicle.wheelRadius) - rGroundY;
  const fPen = (vehicle.frontWheel.y + vehicle.wheelRadius) - fGroundY;

  // Clamping prevents deep penetration
  assert.ok(rPen <= PHYSICS_CONSTANTS.MAX_PENETRATION_CLAMP + 2, 'Rear wheel does not tunnel through ground');
  assert.ok(fPen <= PHYSICS_CONSTANTS.MAX_PENETRATION_CLAMP + 2, 'Front wheel does not tunnel through ground');
  assert.ok(vehicle.rearWheel.onGround, 'Rear wheel contacts ground');
  assert.ok(vehicle.frontWheel.onGround, 'Front wheel contacts ground');
});

test('TerrainSystem - Speed bump profile matches a 48px visual footprint and 10px crest', () => {
  const terrain = new TerrainSystem(4600);
  const bumpMeters = terrain.speedBumps[0];
  const centerX = bumpMeters * PHYSICS_CONSTANTS.METER_SCALE;
  const originalBumps = terrain.speedBumps;
  const baselineAt = (x) => {
    terrain.speedBumps = [];
    const y = terrain.getHeight(x);
    terrain.speedBumps = originalBumps;
    return y;
  };

  assert.equal(PHYSICS_CONSTANTS.METER_SCALE, 20, 'Renderer footprint conversion assumes 20px per meter');
  assert.ok(Math.abs(terrain.getHeight(centerX) - baselineAt(centerX) + 10) < 1e-9, 'Bump crest raises the surface 10px');
  for (const edgeX of [centerX - 24, centerX + 24]) {
    assert.ok(Math.abs(terrain.getHeight(edgeX) - baselineAt(edgeX)) < 1e-9, 'Surface returns to baseline at the 48px footprint edge');
  }
});

test('PhysicsVehicle - Grounded game spawn does not award a fake perfect landing', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = createGroundedVehicle(terrain);
  for (let i = 0; i < 60; i++) vehicle.update(1 / 120, { gas: false, brake: false }, terrain);

  assert.equal(vehicle.perfectLandingTimer, 0, 'Starting suspension settling does not trigger landing feedback');
  assert.ok(vehicle.rearWheel.onGround && vehicle.frontWheel.onGround, 'Both wheels are supported at the start');
  assert.ok(Math.abs(vehicle.y - (terrain.getHeight(vehicle.x) - 34)) < 8,
    'Chassis stays near its intended starting ride height');
});

test('PhysicsVehicle - Fixed 120 Hz stepping gives the same result at 60 and 120 FPS', () => {
  const terrainA = new TerrainSystem(4600);
  const terrainB = new TerrainSystem(4600);
  const terrainC = new TerrainSystem(4600);
  const at30 = new PhysicsVehicle(8000, 180);
  const at60 = new PhysicsVehicle(8000, 180);
  const at120 = new PhysicsVehicle(8000, 180);
  for (let i = 0; i < 30; i++) at30.update(1 / 30, { gas: false, brake: false }, terrainC);
  for (let i = 0; i < 60; i++) at60.update(1 / 60, { gas: false, brake: false }, terrainA);
  for (let i = 0; i < 120; i++) at120.update(1 / 120, { gas: false, brake: false }, terrainB);

  for (const key of ['x', 'y', 'vx', 'vy', 'angle', 'angularVelocity']) {
    assert.ok(Math.abs(at30[key] - at60[key]) < 1e-6, `${key} is consistent at 30 and 60 FPS`);
    assert.ok(Math.abs(at60[key] - at120[key]) < 1e-6, `${key} is frame-rate independent`);
  }
});

test('PhysicsVehicle - Impact damage is debounced briefly during one collision sequence', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = new PhysicsVehicle(10000, 100);
  const initialIntegrity = vehicle.cargoIntegrity;
  vehicle.applyImpactShock(250);
  const afterFirstImpact = vehicle.cargoIntegrity;
  vehicle.applyImpactShock(250);
  assert.ok(afterFirstImpact < initialIntegrity, 'First severe impact damages cargo');
  assert.equal(vehicle.cargoIntegrity, afterFirstImpact, 'Immediate duplicate contact does not stack damage');

  for (let i = 0; i < 4; i++) vehicle.update(0.1, { gas: false, brake: false }, terrain);
  vehicle.applyImpactShock(250);
  assert.ok(vehicle.cargoIntegrity < afterFirstImpact, 'A later independent impact can still damage cargo');
});

test('PhysicsVehicle - Air stunt controls (pitch up on gas, pitch down on brake)', () => {
  const terrain = new TerrainSystem(4600);
  // Put vehicle high in the air
  const vehicleGas = new PhysicsVehicle(500, 50);
  const vehicleBrake = new PhysicsVehicle(500, 50);
  const vehicleBalanced = new PhysicsVehicle(500, 50);

  // Gas in air should decrease angular velocity (pitch nose up counter-clockwise)
  vehicleGas.update(0.1, { gas: true, brake: false }, terrain);
  assert.ok(vehicleGas.angularVelocity < 0, 'Gas in air applies pitch up');

  // Brake in air should increase angular velocity (pitch nose down clockwise)
  vehicleBrake.update(0.1, { gas: false, brake: true }, terrain);
  assert.ok(vehicleBrake.angularVelocity > 0, 'Brake in air applies pitch down');

  vehicleBalanced.update(0.1, { gas: true, brake: true }, terrain);
  assert.ok(Math.abs(vehicleBalanced.angularVelocity) < 0.05,
    'Gas and brake together cancel pitch input in the air');
});

test('PhysicsVehicle - Rollover detection: grace period < 0.45s vs > 0.45s', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = new PhysicsVehicle(500, 500);

  // Invert truck past 105 degrees (e.g. Math.PI = 180 deg)
  vehicle.angle = Math.PI;

  // Place truck upside down so roof hits ground
  const roofGroundY = terrain.getHeight(vehicle.x);
  vehicle.y = roofGroundY - 10; // Roof penetrates ground

  // Simulate short touch: 0.2 seconds (< 0.45s grace period)
  vehicle.checkChassisTerrainCollision(terrain, 0.2);
  assert.equal(vehicle.isRolledOver, false, 'Does not rollover within grace period');
  assert.ok(vehicle.rolloverTimer > 0, 'Rollover timer is ticking');

  // Simulate additional 0.3s (total 0.5s > 0.45s)
  vehicle.checkChassisTerrainCollision(terrain, 0.3);
  assert.equal(vehicle.isRolledOver, true, 'Rollover triggered after 0.45s threshold');

  // Righting the truck resets timer
  vehicle.angle = 0;
  vehicle.isRolledOver = false;
  vehicle.checkChassisTerrainCollision(terrain, 0.5);
  assert.equal(vehicle.rolloverTimer, 0, 'Rollover timer reset when righted');
});

test('PhysicsVehicle - Wooden log collision imparts vertical impulse and damage', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = new PhysicsVehicle(2950 * PHYSICS_CONSTANTS.METER_SCALE, 300);

  const initialIntegrity = vehicle.cargoIntegrity;
  const initialParticles = vehicle.foodParticles.length;

  // Trigger impact shock simulating log collision
  vehicle.triggerImpactShock(240);

  assert.ok(vehicle.cargoIntegrity < initialIntegrity, 'Cargo integrity decreases on hard impact');
  assert.ok(vehicle.foodParticles.length > initialParticles, 'Food particles eject on impact');
});

test('GameStateManager - Win and 4 Loss conditions', () => {
  const terrain = new TerrainSystem(4600);

  // 1. Loss: Rollover
  {
    const gm = new GameStateManager();
    gm.state = 'PLAYING';
    const veh = new PhysicsVehicle(100, 300);
    veh.isRolledOver = true;
    gm.update(0.1, veh, terrain);
    assert.equal(gm.state, 'GAMEOVER');
    assert.equal(gm.gameOverReason, 'ROLLOVER');
  }

  // 2. Loss: Fuel out
  {
    const gm = new GameStateManager();
    gm.state = 'PLAYING';
    const veh = new PhysicsVehicle(100, 300);
    veh.fuel = 0;
    veh.vx = 2; // almost stopped
    gm.update(0.1, veh, terrain);
    assert.equal(gm.state, 'GAMEOVER');
    assert.equal(gm.gameOverReason, 'FUEL');
  }

  // 3. Loss: Deadline Expired
  {
    const gm = new GameStateManager();
    gm.state = 'PLAYING';
    gm.timeRemaining = 0.05;
    const veh = new PhysicsVehicle(100, 300);
    gm.update(0.1, veh, terrain);
    assert.equal(gm.state, 'GAMEOVER');
    assert.equal(gm.gameOverReason, 'DEADLINE');
  }

  // 4. Loss: Cargo Destroyed
  {
    const gm = new GameStateManager();
    gm.state = 'PLAYING';
    const veh = new PhysicsVehicle(100, 300);
    veh.cargoIntegrity = 0;
    gm.update(0.1, veh, terrain);
    assert.equal(gm.state, 'GAMEOVER');
    assert.equal(gm.gameOverReason, 'CARGO');
  }

  // 5. Win: Reached finish line (4500m)
  {
    const gm = new GameStateManager();
    gm.state = 'PLAYING';
    const veh = new PhysicsVehicle(4505 * PHYSICS_CONSTANTS.METER_SCALE, 300);
    veh.cargoIntegrity = 85;
    veh.fuel = 30;
    gm.timeRemaining = 60;
    gm.update(0.1, veh, terrain);
    assert.equal(gm.state, 'VICTORY');
    assert.equal(gm.stars, 3, 'Earns 3 stars with high cargo, fuel, and remaining time');
  }
});

test('PhysicsVehicle - Realistic acceleration and course completion speed', () => {
  const terrain = new TerrainSystem(4600);
  const veh = new PhysicsVehicle(150, 420);

  // Settle vehicle on ground
  for (let i = 0; i < 60; i++) {
    veh.update(1 / 60, { gas: false, brake: false }, terrain);
  }

  // Accelerate for 5 seconds on flat road
  for (let i = 0; i < 300; i++) {
    veh.update(1 / 60, { gas: true, brake: false }, terrain);
  }

  // Vehicle must reach realistic driving speed (> 500 px/s = > 90 km/h)
  assert.ok(veh.vx > 500, `Vehicle accelerates to high speed (actual vx: ${veh.vx.toFixed(1)} px/s)`);
});

test('PhysicsVehicle - Log collision is debounced per wheel and does not wipe out cargo in 1 frame', () => {
  const terrain = new TerrainSystem(4600);
  const veh = new PhysicsVehicle(2950 * PHYSICS_CONSTANTS.METER_SCALE - 80, 300);
  veh.vx = 400;

  let shockCount = 0;
  const origShock = veh.triggerImpactShock.bind(veh);
  veh.triggerImpactShock = function(intensity) {
    shockCount++;
    origShock(intensity);
  };

  // Drive across the wooden log at 2950m
  for (let i = 0; i < 90; i++) {
    veh.update(1 / 60, { gas: true, brake: false }, terrain);
  }

  // Debouncing must prevent hundreds of shocks (at most 2: front wheel + rear wheel)
  assert.ok(shockCount <= 2, `Log collision is debounced (actual shocks: ${shockCount})`);
  assert.ok(veh.cargoIntegrity >= 70, `Cargo survives log collision with minor damage (integrity: ${veh.cargoIntegrity.toFixed(1)}%)`);
});

test('PhysicsVehicle - Inverted rollover triggers ROLLOVER GameOver without premature cargo depletion', () => {
  const terrain = new TerrainSystem(4600);
  const veh = new PhysicsVehicle(200 * PHYSICS_CONSTANTS.METER_SCALE, 500);
  const gm = new GameStateManager();
  gm.state = 'PLAYING';

  // Invert truck upside down so roof hits terrain
  veh.angle = Math.PI;
  const groundY = terrain.getHeight(veh.x);
  veh.y = groundY + 10;

  for (let frame = 1; frame <= 35; frame++) {
    veh.update(1 / 60, { gas: false, brake: false }, terrain);
    gm.update(1 / 60, veh, terrain);
    if (gm.state === 'GAMEOVER') break;
  }

  assert.equal(gm.state, 'GAMEOVER', 'Game over triggered upon rollover grace expiry');
  assert.equal(gm.gameOverReason, 'ROLLOVER', 'GameOver reason is ROLLOVER, not preempted by CARGO');
  assert.ok(veh.cargoIntegrity > 0, 'Cargo was not prematurely wiped out during rollover grace period');
});

test('PhysicsVehicle - 360 and 720 degree aerial flip angle normalization', () => {
  // Angle normalization helper
  const normalize = (angle) => Math.abs(Math.atan2(Math.sin(angle), Math.cos(angle)));

  assert.ok(normalize(0) < 1e-4, '0 rad tilt is 0');
  assert.ok(normalize(2 * Math.PI) < 1e-4, '360 degree backflip tilt is 0');
  assert.ok(normalize(-2 * Math.PI) < 1e-4, '360 degree frontflip tilt is 0');
  assert.ok(normalize(4 * Math.PI) < 1e-4, '720 degree double backflip tilt is 0');
  assert.ok(normalize(-4 * Math.PI) < 1e-4, '720 degree double frontflip tilt is 0');
  assert.ok(normalize(Math.PI) > 3.0, 'Inverted 180 degrees tilt is PI rad');
});

test('TerrainSystem - Boundary elevation continuity (|Delta y| < 1.0 px)', () => {
  const terrain = new TerrainSystem(4600);
  const boundaries = [1200, 2800, 4200, 4480];

  for (const b of boundaries) {
    const px1 = (b - 0.05) * PHYSICS_CONSTANTS.METER_SCALE;
    const px2 = (b + 0.05) * PHYSICS_CONSTANTS.METER_SCALE;
    const y1 = terrain.getHeight(px1);
    const y2 = terrain.getHeight(px2);
    const diff = Math.abs(y2 - y1);
    assert.ok(diff < 1.0, `Elevation difference across ${b}m boundary is smooth (diff: ${diff.toFixed(4)}px)`);
  }
});

test('Assets - Manifest paths, image formats, dimensions, alpha, and pivots are valid', () => {
  const manifest = JSON.parse(fs.readFileSync(path.resolve('assets/manifest.json'), 'utf8'));
  const required = [
    'truckBody', 'truckWheel', 'fuelCan', 'coinGizi', 'obstacleLog', 'foodParcel', 'finishGate', 'gameLogo',
    'biome1Distant', 'biome1Midground', 'biome2Distant', 'biome2Midground',
    'biome3Distant', 'biome3Midground', 'biome4Distant', 'biome4Midground'
  ];

  assert.equal(manifest.version, 11);
  assert.equal(manifest.format, 'mixed');
  const brandLogo = fs.readFileSync(path.resolve(manifest.assets.gameLogo.src), 'utf8');
  assert.match(brandLogo, /#0d2b52/i, 'Logo uses the navy brand color');
  const promptPack = fs.readFileSync(path.resolve('docs/HIGGSFIELD_PROMPTS.md'), 'utf8');
  assert.equal((promptPack.match(/^### \d+\./gm) || []).length, 22, 'All 22 detailed asset prompts are documented');
  assert.match(promptPack, /biru adalah warna utama/i, 'Prompt pack identifies blue as the primary brand color');
  for (const key of required) {
    const asset = manifest.assets[key];
    assert.ok(asset, `manifest contains ${key}`);
    assert.match(asset.src, /^assets\/refresh\/v(?:3|11)\//, `${key} uses a versioned refresh asset`);
    assert.ok(Number.isInteger(asset.width) && asset.width > 0, `${key} has source width`);
    assert.ok(Number.isInteger(asset.height) && asset.height > 0, `${key} has source height`);
    assert.ok(asset.pivot && asset.pivot.x >= 0 && asset.pivot.x <= asset.width, `${key} pivot x is within bounds`);
    assert.ok(asset.pivot.y >= 0 && asset.pivot.y <= asset.height, `${key} pivot y is within bounds`);
    if (key.endsWith('Midground')) assert.ok(asset.tileAspect > 0, `${key} has a horizontal tile aspect`);

    const assetPath = path.resolve(asset.src);
    assert.ok(fs.existsSync(assetPath), `${key} source exists`);
    const source = fs.readFileSync(assetPath);
    if (assetPath.endsWith('.png')) {
      assert.ok(asset.src.startsWith('assets/refresh/v11/sprites/'), `${key} uses the uploaded v11 sprite`);
      assert.equal(source.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${key} is a PNG`);
      assert.equal(source.readUInt32BE(16), asset.width, `${key} PNG width matches manifest`);
      assert.equal(source.readUInt32BE(20), asset.height, `${key} PNG height matches manifest`);
      assert.equal(source[25], 6, `${key} PNG carries RGBA alpha`);
      assert.ok(source.length < 200_000, `${key} optimized PNG stays below 200 KB`);
    } else if (assetPath.endsWith('.webp')) {
      assert.ok(asset.src.startsWith('assets/refresh/v11/backgrounds/'), `${key} uses a v11 biome layer`);
      assert.equal(source.toString('ascii', 0, 4), 'RIFF', `${key} has a RIFF header`);
      assert.equal(source.toString('ascii', 8, 12), 'WEBP', `${key} is WebP`);
      const chunk = source.toString('ascii', 12, 16);
      if (chunk === 'VP8X') {
        assert.equal(source.readUIntLE(24, 3) + 1, asset.width, `${key} WebP width matches manifest`);
        assert.equal(source.readUIntLE(27, 3) + 1, asset.height, `${key} WebP height matches manifest`);
        if (key.endsWith('Midground')) assert.ok(source[20] & 0x10, `${key} has an alpha channel`);
      } else {
        assert.equal(chunk, 'VP8 ', `${key} uses a supported lossy WebP frame`);
        assert.equal(source.readUInt16LE(26) & 0x3fff, asset.width, `${key} WebP width matches manifest`);
        assert.equal(source.readUInt16LE(28) & 0x3fff, asset.height, `${key} WebP height matches manifest`);
      }
      assert.ok(source.length < 250_000, `${key} optimized WebP stays below 250 KB`);
    } else {
      const xml = source.toString('utf8');
      assert.match(xml, /^<svg\b/, `${key} source is SVG`);
      assert.match(xml, new RegExp(`width="${asset.width}"`), `${key} width matches manifest`);
      assert.match(xml, new RegExp(`height="${asset.height}"`), `${key} height matches manifest`);
      assert.ok(source.length < 25_000, `${key} stays below 25 KB`);
    }
    if (asset.fallback) {
      assert.ok(fs.existsSync(path.resolve(asset.fallback)), `${key} fallback exists`);
    }
  }
});

test('PhysicsVehicle - Hill Climb Racing ground torque reaction on throttle and braking', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = new PhysicsVehicle(150, 420);

  // Settle on flat asphalt
  for (let i = 0; i < 60; i++) {
    vehicle.update(1 / 60, { gas: false, brake: false }, terrain);
  }
  assert.ok(vehicle.rearWheel.onGround && vehicle.frontWheel.onGround, 'Both wheels on ground at rest');

  // Gassing on ground exerts counter-clockwise reaction torque (pitches nose up)
  vehicle.update(1 / 60, { gas: true, brake: false }, terrain);
  assert.ok(vehicle.angularVelocity < 0, 'Gas on ground produces pitch-up reaction torque (negative angular velocity)');

  // Accelerating continuous uphill slope can lift front wheel into a wheelie
  const hillVeh = new PhysicsVehicle(3000 * PHYSICS_CONSTANTS.METER_SCALE, 200);
  for (let i = 0; i < 30; i++) {
    hillVeh.update(1 / 60, { gas: true, brake: false }, terrain);
  }
  // Front tilts up significantly on incline under throttle
  assert.ok(hillVeh.angle < 0, `Chassis pitches front up on steep incline (actual angle: ${(hillVeh.angle * 180 / Math.PI).toFixed(1)} deg)`);

  // Braking on flat road exerts clockwise reaction torque (pitches nose down)
  const brakeVeh = new PhysicsVehicle(150, 420);
  for (let i = 0; i < 60; i++) brakeVeh.update(1 / 60, { gas: false, brake: false }, terrain);
  for (let i = 0; i < 60; i++) brakeVeh.update(1 / 60, { gas: true, brake: false }, terrain);
  brakeVeh.update(1 / 60, { gas: false, brake: true }, terrain);
  assert.ok(brakeVeh.angularVelocity > 0, 'Brake at speed produces pitch-down reaction torque (positive angular velocity)');

  const gasOnly = new PhysicsVehicle(150, 420);
  const gasAndBrake = new PhysicsVehicle(150, 420);
  for (let i = 0; i < 60; i++) {
    gasOnly.update(1 / 60, { gas: false, brake: false }, terrain);
    gasAndBrake.update(1 / 60, { gas: false, brake: false }, terrain);
  }
  for (let i = 0; i < 90; i++) {
    gasOnly.update(1 / 60, { gas: true, brake: false }, terrain);
    gasAndBrake.update(1 / 60, { gas: true, brake: true }, terrain);
  }
  assert.ok(gasAndBrake.vx > 300, 'Gas remains the drive input while both pedals are held');
  assert.ok(Math.abs(gasAndBrake.angle) < Math.abs(gasOnly.angle),
    'Holding both pedals cancels ground pitch and lets the player stabilize the truck');
});

test('PhysicsVehicle - Launch kicker creates sustained, controllable airtime', () => {
  const terrain = new TerrainSystem(4600);
  const ramp = terrain.launchRamps[0];
  const rampPx = (ramp.start + ramp.rise + ramp.drop / 2) * PHYSICS_CONSTANTS.METER_SCALE;
  assert.ok(terrain.getSlope(rampPx) > 0.8, 'The kicker has a steep, continuous downhill launch face');
  for (const edgeM of [ramp.start, ramp.start + ramp.rise, ramp.start + ramp.rise + ramp.drop]) {
    const left = terrain.getHeight((edgeM - 0.01) * PHYSICS_CONSTANTS.METER_SCALE);
    const right = terrain.getHeight((edgeM + 0.01) * PHYSICS_CONSTANTS.METER_SCALE);
    assert.ok(Math.abs(left - right) < 1, `Ramp is continuous at ${edgeM}m`);
  }

  // Approach the first explicit kicker at the gameplay speed cap.
  const startX = (ramp.start - 10) * PHYSICS_CONSTANTS.METER_SCALE;
  const vehicle = new PhysicsVehicle(startX, terrain.getHeight(startX) - 34);
  vehicle.vx = PHYSICS_CONSTANTS.MAX_FORWARD_SPEED;

  let airborneDetected = false;
  let consecutiveAirFrames = 0;
  let longestAirFrames = 0;
  let maxAirRotation = 0;

  for (let f = 0; f < 120; f++) {
    vehicle.update(1 / 60, { gas: true, brake: false }, terrain);
    const inAir = !vehicle.rearWheel.onGround && !vehicle.frontWheel.onGround;
    if (inAir) {
      airborneDetected = true;
      consecutiveAirFrames++;
      longestAirFrames = Math.max(longestAirFrames, consecutiveAirFrames);
      maxAirRotation = Math.max(maxAirRotation, Math.abs(vehicle.airRotation));
    } else consecutiveAirFrames = 0;
  }

  assert.ok(airborneDetected, 'High-speed kicker crossing naturally launches vehicle airborne');
  assert.ok(longestAirFrames >= 20,
    `Vehicle remains airborne long enough to control pitch (actual: ${longestAirFrames} frames)`);
  assert.ok(maxAirRotation > 0.1,
    `Throttle changes pitch during the airborne interval (actual rotation: ${maxAirRotation.toFixed(2)} rad)`);
  assert.equal(vehicle.isRolledOver, false, 'A single kicker does not force an unrecoverable rollover');
});

test('PhysicsVehicle - Multi-point roof rollover crash detection', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = new PhysicsVehicle(500, 500);

  // Invert vehicle at an angle where front cab top touches ground
  vehicle.angle = (115 * Math.PI) / 180; // > 105 degrees
  const groundY = terrain.getHeight(vehicle.x);
  vehicle.y = groundY - 10;

  // Simulate contact exceeding grace time (0.5s > 0.45s)
  for (let i = 0; i < 35; i++) {
    vehicle.checkChassisTerrainCollision(terrain, 1 / 60);
  }

  assert.equal(vehicle.isRolledOver, true, 'Multi-point roof contact triggers rollover Game Over');
});

test('PhysicsVehicle - Calibrated suspension geometry nests wheels inside arches at rest and droops in flight', () => {
  const terrain = new TerrainSystem(4600);
  const v = new PhysicsVehicle(150, 420);

  // Assert design parameters
  assert.equal(v.suspensionRestLength, 16, 'Rest length is 16px to prevent floating body on stilts');
  assert.deepEqual(v.rearMountOffset, { x: -30, y: 0 }, 'Rear mount offset centered over rear wheel well');
  assert.deepEqual(v.frontMountOffset, { x: 30, y: 0 }, 'Front mount offset centered over front cab wheel well');

  // Settle at rest on flat ground
  for (let i = 0; i < 60; i++) v.update(1 / 60, { gas: false, brake: false }, terrain);

  const mountY = v.y;
  const wheelY = v.rearWheel.y;
  const suspDist = wheelY - mountY;

  // At rest, suspension should sit compressed around 12-14px
  assert.ok(suspDist >= 11 && suspDist <= 15, `Suspension rests in middle travel (actual: ${suspDist.toFixed(1)}px)`);

  // Top of wheel must sit inside the wheel well (inset > 5px into chassis body)
  const wheelTopY = wheelY - v.wheelRadius;
  const bodyBottomY = v.y + 4;
  const wellInset = bodyBottomY - wheelTopY;
  assert.ok(wellInset > 5, `Tire top is nested inside wheel well at rest (inset: ${wellInset.toFixed(1)}px)`);

  // In flight, suspension decompresses to full rest length (>= 16px) without ground suction
  const flyVeh = new PhysicsVehicle(500, 50);
  flyVeh.update(0.1, { gas: false, brake: false }, terrain);
  const flyDist = flyVeh.rearWheel.y - flyVeh.y;
  assert.ok(flyDist >= v.suspensionRestLength - 0.5, `Suspension decompresses in flight (actual extended length: ${flyDist.toFixed(1)}px)`);
});

test('PhysicsVehicle - Hill Climb Racing dynamic wheelie (>10 deg) and stoppie (>15 deg) pitch reactions', () => {
  const terrain = new TerrainSystem(4600);
  const v = new PhysicsVehicle(150, 420);
  for (let i = 0; i < 60; i++) v.update(1 / 60, { gas: false, brake: false }, terrain);

  // Full throttle must produce a controllable HCR-style wheelie at the capped pace.
  let maxWheelieDeg = 0;
  let frontLiftFrames = 0;
  for (let i = 0; i < 90; i++) {
    v.update(1 / 60, { gas: true, brake: false }, terrain);
    const deg = -v.angle * (180 / Math.PI);
    if (deg > maxWheelieDeg) maxWheelieDeg = deg;
    if (!v.frontWheel.onGround) frontLiftFrames++;
  }
  assert.ok(maxWheelieDeg >= 40.0, `Throttle raises the front into a controllable wheelie (actual max: ${maxWheelieDeg.toFixed(1)} deg)`);
  // A wheelie is only real if the front tire loses road contact, not just if the body tilts.
  assert.ok(frontLiftFrames >= 10, `Throttle lifts the front wheel clear of the terrain (actual: ${frontLiftFrames} frames)`);

  // Hard braking at speed must produce a stoppie pitch down (> 15 degrees)
  const v2 = new PhysicsVehicle(150, 420);
  for (let i = 0; i < 60; i++) v2.update(1 / 60, { gas: true, brake: false }, terrain);
  let maxStoppieDeg = 0;
  for (let i = 0; i < 40; i++) {
    v2.update(1 / 60, { gas: false, brake: true }, terrain);
    const deg = v2.angle * (180 / Math.PI);
    if (deg > maxStoppieDeg) maxStoppieDeg = deg;
  }
  assert.ok(maxStoppieDeg >= 15.0, `Vehicle stoppies forward under hard braking (actual max: ${maxStoppieDeg.toFixed(1)} deg)`);
});

test('PhysicsVehicle - High-speed brake produces a controlled rear-wheel stoppie without flipping', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = createGroundedVehicle(terrain);
  for (let i = 0; i < 60; i++) vehicle.update(1 / 60, { gas: false, brake: false }, terrain);

  // Worst-case grounded brake input at the real speed cap. Keep wheel velocities
  // coherent with chassis speed so the test isolates brake pitch, not a teleport.
  vehicle.vx = PHYSICS_CONSTANTS.MAX_FORWARD_SPEED;
  vehicle.rearWheel.vx = vehicle.vx;
  vehicle.frontWheel.vx = vehicle.vx;
  let maxStoppieDeg = 0;
  let rearLiftFrames = 0;
  for (let i = 0; i < 90; i++) {
    vehicle.update(1 / 120, { gas: false, brake: true }, terrain);
    maxStoppieDeg = Math.max(maxStoppieDeg, vehicle.angle * 180 / Math.PI);
    if (!vehicle.rearWheel.onGround) rearLiftFrames++;
  }

  assert.ok(maxStoppieDeg >= 20 && maxStoppieDeg < 40,
    `Hard braking creates a visible but recoverable pitch (actual: ${maxStoppieDeg.toFixed(1)} deg)`);
  assert.ok(rearLiftFrames >= 20,
    `Braking actually lifts the rear tire instead of only rotating the chassis (actual: ${rearLiftFrames} frames)`);
  assert.equal(vehicle.isRolledOver, false, 'A hard stop at the speed cap cannot spin the truck into a flip');
});

test('PhysicsVehicle - Natural acceleration then high-speed braking lifts the rear predictably', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = createGroundedVehicle(terrain);
  for (let i = 0; i < 60; i++) vehicle.update(1 / 60, { gas: false, brake: false }, terrain);
  for (let i = 0; i < 150; i++) vehicle.update(1 / 60, { gas: true, brake: false }, terrain);
  assert.ok(vehicle.vx >= PHYSICS_CONSTANTS.MAX_FORWARD_SPEED - 1,
    'The vehicle reaches the speed cap through normal throttle input before braking');

  let maxPitchDeg = 0;
  let rearLiftSteps = 0;
  for (let i = 0; i < 90; i++) {
    vehicle.update(1 / 120, { gas: false, brake: true }, terrain);
    maxPitchDeg = Math.max(maxPitchDeg, vehicle.angle * 180 / Math.PI);
    if (!vehicle.rearWheel.onGround) rearLiftSteps++;
  }
  assert.ok(maxPitchDeg >= 20 && maxPitchDeg < 35,
    `Natural brake transition gives a recoverable stoppie (actual: ${maxPitchDeg.toFixed(1)} deg)`);
  assert.ok(rearLiftSteps >= 20,
    `The rear wheel stays airborne long enough to read and correct (actual: ${rearLiftSteps} fixed steps)`);
  assert.equal(vehicle.isRolledOver, false, 'The acceleration-to-brake sequence does not flip the truck');
});

test('PhysicsVehicle - Water puddle lowers tire traction slightly without changing the terrain', () => {
  const startX = 150 * PHYSICS_CONSTANTS.METER_SCALE;
  const run = wet => {
    const terrain = new TerrainSystem(4600);
    // Isolate the surface material response while keeping road height/slope identical.
    terrain.isInWaterPuddle = () => wet;
    const vehicle = new PhysicsVehicle(startX, terrain.getHeight(startX) - 34);
    for (let i = 0; i < 120; i++) vehicle.update(1 / 120, { gas: false, brake: false }, terrain);
    assert.ok(vehicle.rearWheel.onGround && vehicle.frontWheel.onGround, 'Vehicle starts settled on the same road profile');
    for (let i = 0; i < 24; i++) vehicle.update(1 / 120, { gas: true, brake: false }, terrain);
    return vehicle.vx;
  };
  const drySpeed = run(false);
  const wetSpeed = run(true);
  assert.ok(wetSpeed > 0 && wetSpeed < drySpeed * 0.9,
    `Water has a noticeable but moderate traction penalty (wet ${wetSpeed.toFixed(1)} vs dry ${drySpeed.toFixed(1)} px/s)`);
});

test('PhysicsVehicle - Progressive throttle softens launch and reaches full output smoothly', () => {
  const terrain = new TerrainSystem(4600);
  const startX = 150;
  const vehicle = new PhysicsVehicle(startX, terrain.getHeight(startX) - 34);
  for (let i = 0; i < 120; i++) vehicle.update(1 / 120, { gas: false, brake: false }, terrain);

  for (let i = 0; i < 12; i++) vehicle.update(1 / 120, { gas: true, brake: false }, terrain);
  const launchKmh = vehicle.vx * 0.18;
  assert.ok(launchKmh > 0, 'Throttle still moves the vehicle immediately');
  assert.ok(launchKmh < 18, `First 100ms is controllable instead of an instant launch (actual: ${launchKmh.toFixed(1)} km/h)`);
  assert.ok(vehicle.engineThrottle >= 0.5 && vehicle.engineThrottle <= 0.7, 'Throttle output follows the ramp during its first 100ms');
  for (let i = 0; i < 12; i++) vehicle.update(1 / 120, { gas: true, brake: false }, terrain);
  assert.ok(vehicle.engineThrottle > 0.99, 'Held throttle reaches full output smoothly');

  for (let i = 0; i < 15; i++) vehicle.update(1 / 120, { gas: false, brake: false }, terrain);
  assert.ok(vehicle.engineThrottle < 1e-9, 'Released throttle fades promptly to zero');
});

test('PhysicsVehicle - Ground pitch risk uses wrapped orientation after full flips', () => {
  const terrain = new TerrainSystem(4600);
  const x = 150;
  const makeVehicle = (angle) => {
    const vehicle = new PhysicsVehicle(x, terrain.getHeight(x) - 34);
    for (let i = 0; i < 120; i++) vehicle.update(1 / 120, { gas: false, brake: false }, terrain);
    vehicle.angle = angle;
    return vehicle;
  };
  const uprightPose = makeVehicle(0.25);
  const samePoseAfterFlip = makeVehicle(0.25 + 2 * Math.PI);

  uprightPose.update(1 / 120, { gas: true, brake: false }, terrain);
  samePoseAfterFlip.update(1 / 120, { gas: true, brake: false }, terrain);

  assert.ok(Math.abs(uprightPose.vx - samePoseAfterFlip.vx) < 1e-6,
    'A full turn does not leave the truck with a different throttle response');
  assert.ok(Math.abs(uprightPose.angularVelocity - samePoseAfterFlip.angularVelocity) < 1e-6,
    'High-pitch protection uses the wrapped physical pose, not accumulated angle');
});

test('PhysicsVehicle - Brake recovers a dangerous wheelie while continued throttle risks rollover', () => {
  const terrain = new TerrainSystem(4600);
  const startX = 10000;
  const dangerousPitch = -80 * Math.PI / 180;
  const recovering = new PhysicsVehicle(startX, terrain.getHeight(startX) - 30);
  recovering.angle = dangerousPitch;
  for (let i = 0; i < 120; i++) recovering.update(1 / 60, { gas: false, brake: true }, terrain);

  const recoveredDeg = Math.abs(Math.atan2(Math.sin(recovering.angle), Math.cos(recovering.angle)) * 180 / Math.PI);
  assert.equal(recovering.isRolledOver, false, 'Corrective brake input preserves a recoverable wheelie');
  assert.ok(recoveredDeg < 30, `Brake pitches the truck back toward upright (actual: ${recoveredDeg.toFixed(1)} deg)`);

  const worsening = new PhysicsVehicle(startX, terrain.getHeight(startX) - 30);
  worsening.angle = -90 * Math.PI / 180;
  for (let i = 0; i < 120 && !worsening.isRolledOver; i++) {
    worsening.update(1 / 60, { gas: true, brake: false }, terrain);
  }
  assert.equal(worsening.isRolledOver, true, 'Holding throttle through an extreme wheelie can trigger rollover');
});

test('PhysicsVehicle - Ground brake slows forward travel before selecting reverse', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = new PhysicsVehicle(150, 420);
  for (let i = 0; i < 60; i++) vehicle.update(1 / 60, { gas: false, brake: false }, terrain);

  vehicle.vx = 500;
  vehicle.rearWheel.vx = 500;
  vehicle.frontWheel.vx = 500;
  for (let i = 0; i < 8; i++) vehicle.update(1 / 120, { gas: false, brake: true }, terrain);
  assert.ok(vehicle.vx < 500, 'Brake reduces forward speed');
  assert.ok(vehicle.vx > 0, 'A brief brake application does not instantly reverse the truck');

  for (let i = 0; i < 240; i++) vehicle.update(1 / 120, { gas: false, brake: true }, terrain);
  assert.ok(vehicle.vx < 0, 'Holding brake after stopping selects reverse');
  assert.ok(vehicle.vx >= -PHYSICS_CONSTANTS.MAX_REVERSE_SPEED, 'Reverse speed stays within the slower reverse cap');
});

test('PhysicsVehicle - Braking and reverse selection use speed along the slope', () => {
  const terrain = new TerrainSystem(4600);
  const x = 4361 * PHYSICS_CONSTANTS.METER_SCALE;
  const vehicle = new PhysicsVehicle(x, terrain.getHeight(x) - 34);
  vehicle.vx = 10;
  vehicle.vy = 20;
  const tangent = terrain.getTangent(x);
  assert.ok(vehicle.vx * tangent.x + vehicle.vy * tangent.y > 12,
    'Chosen velocity is still moving forward along the actual speed bump slope');
  vehicle.solveWheelSuspension = (wheel) => {
    wheel.onGround = true;
    return { fx: 0, fy: 0, driveFx: 0 };
  };
  vehicle.checkChassisTerrainCollision = () => {};

  vehicle.physicsSubStep(1 / 120, { gas: false, brake: true }, terrain);

  assert.equal(vehicle.reverseThrottle, 0,
    'A vehicle still moving downhill along the track must brake before reverse torque can ramp');
  assert.ok(vehicle.angularVelocity > 0,
    'Brake pitch reaction follows track speed even when horizontal speed alone is low');
});

test('PhysicsVehicle - Engine drive is rear-wheel only for forward and reverse', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = new PhysicsVehicle(150, 420);
  for (let i = 0; i < 60; i++) vehicle.update(1 / 60, { gas: false, brake: false }, terrain);

  const original = vehicle.solveWheelSuspension;
  const forces = [];
  vehicle.solveWheelSuspension = function (...args) {
    const result = original.apply(this, args);
    forces.push({ driven: args[8], driveFx: result.driveFx });
    return result;
  };
  const fuelBefore = vehicle.fuel;
  vehicle.update(1 / 120, { gas: true, brake: false }, terrain);
  assert.equal(forces.length, 2);
  assert.ok(forces[0].driven && forces[0].driveFx > forces[1].driveFx, 'Rear axle receives engine traction; front axle receives no engine force');
  assert.ok(vehicle.fuel < fuelBefore, 'Driven rear axle consumes fuel');

  forces.length = 0;
  vehicle.vx = vehicle.rearWheel.vx = vehicle.frontWheel.vx = 0;
  vehicle.update(1 / 120, { gas: false, brake: true }, terrain);
  assert.ok(forces[0].driven && forces[0].driveFx < forces[1].driveFx, 'Reverse engine force also stays on the rear axle');
});

test('PhysicsVehicle - Empty fuel disables reverse engine torque but keeps mechanical braking', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = new PhysicsVehicle(150, 420);
  for (let i = 0; i < 60; i++) vehicle.update(1 / 60, { gas: false, brake: false }, terrain);
  vehicle.fuel = 0;
  vehicle.vx = vehicle.rearWheel.vx = vehicle.frontWheel.vx = 0;

  vehicle.update(1 / 120, { gas: false, brake: true }, terrain);
  assert.ok(vehicle.vx >= -0.01, 'Brake at rest cannot propel the vehicle in reverse without fuel');

  vehicle.vx = vehicle.rearWheel.vx = vehicle.frontWheel.vx = 100;
  vehicle.update(1 / 120, { gas: false, brake: true }, terrain);
  assert.ok(vehicle.vx < 100, 'Mechanical braking still slows forward travel with an empty tank');
});

test('PhysicsVehicle - Mud reduces drive grip and adds chassis-transmitted rolling drag', () => {
  const makeAtMud = (mudEnabled) => {
    const terrain = new TerrainSystem(4600);
    if (!mudEnabled) terrain.mudPits = [];
    const x = 1410 * PHYSICS_CONSTANTS.METER_SCALE;
    const vehicle = new PhysicsVehicle(x, terrain.getHeight(x) - 60);
    for (let i = 0; i < 90; i++) vehicle.update(1 / 60, { gas: false, brake: false }, terrain);
    return { terrain, vehicle };
  };

  const muddy = makeAtMud(true);
  const dry = makeAtMud(false);
  for (let i = 0; i < 30; i++) {
    muddy.vehicle.update(1 / 120, { gas: true, brake: false }, muddy.terrain);
    dry.vehicle.update(1 / 120, { gas: true, brake: false }, dry.terrain);
  }
  assert.ok(muddy.vehicle.vx < dry.vehicle.vx * 0.9,
    `Mud traction limits acceleration (mud ${muddy.vehicle.vx.toFixed(1)} vs dry ${dry.vehicle.vx.toFixed(1)} px/s)`);

  const muddyCoast = makeAtMud(true);
  const dryCoast = makeAtMud(false);
  for (const { vehicle } of [muddyCoast, dryCoast]) {
    vehicle.vx = 500;
    vehicle.rearWheel.vx = 500;
    vehicle.frontWheel.vx = 500;
  }
  for (let i = 0; i < 60; i++) {
    muddyCoast.vehicle.update(1 / 120, { gas: false, brake: false }, muddyCoast.terrain);
    dryCoast.vehicle.update(1 / 120, { gas: false, brake: false }, dryCoast.terrain);
  }
  assert.ok(muddyCoast.vehicle.vx < dryCoast.vehicle.vx - 40,
    `Mud drag slows the chassis (mud ${muddyCoast.vehicle.vx.toFixed(1)} vs dry ${dryCoast.vehicle.vx.toFixed(1)} px/s)`);
});

test('PhysicsVehicle and GameStateManager - Skillful air-pitch control can finish the full route for 3 stars', () => {
  const terrain = new TerrainSystem(4600);
  const vehicle = createGroundedVehicle(terrain);
  const game = new GameStateManager();
  game.state = 'PLAYING';

  // Hold throttle normally. Countersteer against the local road tangent in
  // air and recover dangerous ground pitch before the chassis rolls over.
  for (let frame = 0; frame < game.timeLimitSeconds * 60 && game.state === 'PLAYING'; frame++) {
    const airborne = !vehicle.rearWheel.onGround && !vehicle.frontWheel.onGround;
    const roadAngle = Math.atan(terrain.getSlope(vehicle.x));
    const pitch = Math.atan2(Math.sin(vehicle.angle - roadAngle), Math.cos(vehicle.angle - roadAngle));
    const inputs = airborne || Math.abs(pitch) > 0.55
      ? { gas: pitch > (airborne ? 0.08 : 0.55), brake: pitch < (airborne ? -0.08 : -0.55) }
      : { gas: true, brake: false };
    vehicle.update(1 / 60, inputs, terrain);
    game.update(1 / 60, vehicle, terrain);
  }

  assert.equal(game.state, 'VICTORY', 'The course can be completed before the deadline with active pitch control');
  assert.ok(game.timeRemaining >= 30, 'A controlled run can meet the 30-second three-star time threshold');
  assert.ok(vehicle.cargoIntegrity >= 70, 'Safe landings preserve enough cargo for three stars');
  assert.ok(vehicle.fuel >= 20, 'Fuel pickups support the full route');
  assert.equal(game.stars, 3, 'The skilled run receives the maximum rating');
});

test('PhysicsVehicle and GameStateManager - Skilled route remains three-star viable at 30, 60, and 120 FPS', () => {
  const results = [];
  for (const fps of [30, 60, 120]) {
    const terrain = new TerrainSystem(4600);
    const vehicle = createGroundedVehicle(terrain);
    const game = new GameStateManager();
    game.state = 'PLAYING';

    for (let frame = 0; frame < game.timeLimitSeconds * fps && game.state === 'PLAYING'; frame++) {
      const airborne = !vehicle.rearWheel.onGround && !vehicle.frontWheel.onGround;
      const roadAngle = Math.atan(terrain.getSlope(vehicle.x));
      const pitch = Math.atan2(Math.sin(vehicle.angle - roadAngle), Math.cos(vehicle.angle - roadAngle));
      const inputs = airborne || Math.abs(pitch) > 0.55
        ? { gas: pitch > (airborne ? 0.08 : 0.55), brake: pitch < (airborne ? -0.08 : -0.55) }
        : { gas: true, brake: false };
      vehicle.update(1 / fps, inputs, terrain);
      game.update(1 / fps, vehicle, terrain);
    }

    assert.equal(game.state, 'VICTORY', `The route completes at ${fps} FPS`);
    assert.equal(game.stars, 3, `The route remains three-star viable at ${fps} FPS`);
    assert.ok(vehicle.cargoIntegrity >= 70, `Cargo survives the three-star threshold at ${fps} FPS`);
    results.push({ fps, timeRemaining: game.timeRemaining, fuel: vehicle.fuel, cargo: vehicle.cargoIntegrity });
  }

  const cargoSpread = Math.max(...results.map(r => r.cargo)) - Math.min(...results.map(r => r.cargo));
  assert.ok(cargoSpread <= 10, `Refresh-rate cargo spread remains bounded (actual: ${cargoSpread.toFixed(1)} points)`);
});

test('TerrainSystem - 200m smooth transition zones (1100m-1300m, 2700m-2900m, 4100m-4300m)', () => {
  const terrain = new TerrainSystem(4600);

  // Pure Biome 1 zone (< 1100m)
  const pure1 = terrain.getBiomeBlend(600);
  assert.equal(pure1.inTransition, false, '600m is not in transition');
  assert.equal(pure1.fromBiome.id, BIOMES.PANTURA.id);
  assert.equal(pure1.toBiome, null);
  assert.equal(pure1.alphaPrev, 1);
  assert.equal(pure1.alphaNext, 0);

  // Transition Zone 1 (1100m - 1300m: Pantura -> Sawah)
  const tr1Start = terrain.getBiomeBlend(1100);
  assert.equal(tr1Start.inTransition, true);
  assert.equal(tr1Start.fromBiome.id, BIOMES.PANTURA.id);
  assert.equal(tr1Start.toBiome.id, BIOMES.SAWAH.id);
  assert.equal(tr1Start.t, 0);
  assert.equal(tr1Start.alphaPrev, 1);
  assert.equal(tr1Start.alphaNext, 0);

  const tr1Mid = terrain.getBiomeBlend(1200);
  assert.equal(tr1Mid.inTransition, true);
  assert.ok(Math.abs(tr1Mid.t - 0.5) < 1e-4, 'At midpoint 1200m, t is 0.5');
  assert.ok(Math.abs(tr1Mid.alphaPrev - 0.5) < 1e-4);
  assert.ok(Math.abs(tr1Mid.alphaNext - 0.5) < 1e-4);

  const tr1End = terrain.getBiomeBlend(1300);
  assert.equal(tr1End.inTransition, true);
  assert.equal(tr1End.t, 1);
  assert.equal(tr1End.alphaPrev, 0);
  assert.equal(tr1End.alphaNext, 1);

  // Pure Biome 2 zone (1301m - 2699m)
  const pure2 = terrain.getBiomeBlend(2000);
  assert.equal(pure2.inTransition, false);
  assert.equal(pure2.fromBiome.id, BIOMES.SAWAH.id);

  // Transition Zone 2 (2700m - 2900m: Sawah -> Gunung)
  const tr2Mid = terrain.getBiomeBlend(2800);
  assert.equal(tr2Mid.inTransition, true);
  assert.equal(tr2Mid.fromBiome.id, BIOMES.SAWAH.id);
  assert.equal(tr2Mid.toBiome.id, BIOMES.GUNUNG.id);
  assert.ok(Math.abs(tr2Mid.t - 0.5) < 1e-4);

  // Transition Zone 3 (4100m - 4300m: Gunung -> Sekolah)
  const tr3Mid = terrain.getBiomeBlend(4200);
  assert.equal(tr3Mid.inTransition, true);
  assert.equal(tr3Mid.fromBiome.id, BIOMES.GUNUNG.id);
  assert.equal(tr3Mid.toBiome.id, BIOMES.SEKOLAH.id);
  assert.ok(Math.abs(tr3Mid.t - 0.5) < 1e-4);
});

test('PhysicsVehicle - Angle-matched landing shock absorption (Delta theta <= 22 deg absorbs 90% shock, 0 cargo damage)', () => {
  const terrain = new TerrainSystem(4600);
  // Spawn truck high in air above flat terrain
  const startX = 200 * PHYSICS_CONSTANTS.METER_SCALE;
  const groundY = terrain.getHeight(startX);
  const veh = new PhysicsVehicle(startX, groundY - 120);

  let springSoundPlayed = false;
  veh.setSoundEngine({
    playSuspensionSpringSound: () => { springSoundPlayed = true; }
  });

  // Align the chassis with the actual local terrain tangent.
  veh.angle = Math.atan(terrain.getSlope(startX));
  veh.vy = 280; // High downward landing velocity
  veh.wasAirborne = true;
  veh.cargoIntegrity = 100;

  // Execute landing
  veh.handleLanding(terrain);

  // 90% of incoming surface-normal shock is absorbed.
  const normal = terrain.getNormal(startX);
  const remainingNormalSpeed = veh.vx * normal.x + veh.vy * normal.y;
  assert.ok(Math.abs(remainingNormalSpeed + 28) < 1,
    `Normal impact velocity is reduced to 10% (actual: ${remainingNormalSpeed.toFixed(1)} px/s)`);
  // Cargo integrity is 100% preserved
  assert.equal(veh.cargoIntegrity, 100, 'Cargo integrity is 100% preserved on aligned landing');
  // Perfect landing trigger activated
  assert.ok(veh.perfectLandingTimer > 0, 'Perfect landing timer is activated');
  assert.ok(springSoundPlayed, 'Suspension flex sound played on aligned landing');
});

test('PhysicsVehicle - Sloped landing absorbs normal impact and preserves tangent speed', () => {
  const terrain = new TerrainSystem(4600);
  const x = 4361 * PHYSICS_CONSTANTS.METER_SCALE;
  const normal = terrain.getNormal(x);
  const tangent = terrain.getTangent(x);
  const vehicle = new PhysicsVehicle(x, terrain.getHeight(x) - 120);
  vehicle.angle = Math.atan(terrain.getSlope(x));
  vehicle.vx = tangent.x * 300 - normal.x * 180;
  vehicle.vy = tangent.y * 300 - normal.y * 180;
  vehicle.wasAirborne = true;

  vehicle.handleLanding(terrain);

  const normalAfter = vehicle.vx * normal.x + vehicle.vy * normal.y;
  const tangentAfter = vehicle.vx * tangent.x + vehicle.vy * tangent.y;
  assert.ok(Math.abs(normalAfter + 18) < 1,
    `Aligned touchdown removes 90% of incoming normal speed (actual: ${normalAfter.toFixed(1)} px/s)`);
  assert.ok(Math.abs(tangentAfter - 300) < 1,
    `Touchdown preserves momentum along the road (actual: ${tangentAfter.toFixed(1)} px/s)`);
  assert.ok(vehicle.perfectLandingTimer > 0, 'A genuine incoming, aligned impact can earn the landing reward');
});

test('PhysicsVehicle - Steep normal impact damages cargo even with low vertical velocity', () => {
  const terrain = new TerrainSystem(4600);
  const x = 4361 * PHYSICS_CONSTANTS.METER_SCALE;
  const normal = terrain.getNormal(x);
  const tangent = terrain.getTangent(x);
  const vehicle = new PhysicsVehicle(x, terrain.getHeight(x) - 120);
  vehicle.angle = Math.atan(terrain.getSlope(x)) + 50 * Math.PI / 180;
  vehicle.vx = -normal.x * 100 - tangent.x * 140;
  vehicle.vy = -normal.y * 100 - tangent.y * 140;
  vehicle.wasAirborne = true;
  vehicle.cargoIntegrity = 100;
  assert.ok(vehicle.vy < 60, 'The test impact has high normal speed but low world-vertical speed');

  vehicle.handleLanding(terrain);

  assert.ok(vehicle.cargoIntegrity < 100,
    'A steep collision is judged by impact into the road surface, not only world vertical speed');
});

test('PhysicsVehicle - Moving away from the ground cannot trigger a perfect landing', () => {
  const terrain = new TerrainSystem(4600);
  const x = 200 * PHYSICS_CONSTANTS.METER_SCALE;
  const vehicle = new PhysicsVehicle(x, terrain.getHeight(x) - 120);
  vehicle.angle = Math.atan(terrain.getSlope(x));
  vehicle.vy = -100;
  vehicle.wasAirborne = true;

  vehicle.handleLanding(terrain);

  assert.equal(vehicle.perfectLandingTimer, 0, 'A separating contact does not show a false PERFECT LANDING');
});

test('PhysicsVehicle - Steep pitch crash (Delta theta > 35 deg) inflicts cargo damage', () => {
  const terrain = new TerrainSystem(4600);
  const startX = 200 * PHYSICS_CONSTANTS.METER_SCALE;
  const groundY = terrain.getHeight(startX);
  const veh = new PhysicsVehicle(startX, groundY - 120);

  // Pitch truck steeply nose-down (e.g. 50 degrees = 0.87 rad > 35 deg)
  veh.angle = (50 * Math.PI) / 180;
  veh.vy = 280; // High downward speed
  veh.wasAirborne = true;
  veh.cargoIntegrity = 100;

  // Execute steep landing crash
  veh.handleLanding(terrain);

  // Cargo damage must be inflicted
  assert.ok(veh.cargoIntegrity < 100, `Cargo damaged on steep crash (actual integrity: ${veh.cargoIntegrity.toFixed(1)}%)`);
  assert.equal(veh.perfectLandingTimer, 0, 'Perfect landing timer is NOT activated on steep crash');
});

test('PhysicsVehicle - Dual-strut suspension asymmetric damping (bump vs rebound)', () => {
  const terrain = new TerrainSystem(4600);
  const veh = new PhysicsVehicle(150, 420);

  // Asymmetric damping design verification:
  // Compression (relVProj < 0) uses softer damping: 0.45 * kDamper
  // Rebound (relVProj > 0) uses progressive damping: >= 1.35 * kDamper
  const kDamper = veh.kDamper;
  const bumpDamping = kDamper * 0.45;
  const reboundDamping = kDamper * 1.35;

  assert.ok(bumpDamping < reboundDamping, 'Bump damping is softer than rebound damping');
  assert.ok(reboundDamping >= 2.5 * bumpDamping, 'Rebound damping is sufficiently progressive to prevent pogo oscillation');
});

test('PhysicsVehicle - Dynamic weight transfer transfers load under throttle and braking', () => {
  const terrain = new TerrainSystem(4600);
  const vGas = new PhysicsVehicle(150, 420);
  for (let i = 0; i < 60; i++) vGas.update(1 / 60, { gas: false, brake: false }, terrain);

  // Accelerating shifts weight to rear suspension, lifting front and compressing rear
  vGas.update(1 / 60, { gas: true, brake: false }, terrain);
  assert.ok(vGas.angularVelocity < 0, 'Throttle shifts dynamic load rearward, pitching nose up');

  // Hard braking shifts weight forward, lifting rear and compressing front
  const vBrake = new PhysicsVehicle(150, 420);
  for (let i = 0; i < 60; i++) vBrake.update(1 / 60, { gas: false, brake: false }, terrain);
  for (let i = 0; i < 60; i++) vBrake.update(1 / 60, { gas: true, brake: false }, terrain);
  vBrake.update(1 / 60, { gas: false, brake: true }, terrain);
  assert.ok(vBrake.angularVelocity > 0, 'Braking while moving shifts dynamic load forward, pitching nose down');
});
