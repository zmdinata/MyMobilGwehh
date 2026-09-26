// test/verify_story_and_ui.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  BIOMES,
  PHYSICS_CONSTANTS,
  TerrainSystem,
  PhysicsVehicle,
  GameStateManager,
  LEVEL_CONFIGS,
  STORY_DIALOGUES,
  getCharacterAvatarMeta
} from '../game_core.js';

test('LEVEL_CONFIGS - All 20 levels defined with proper stepped distances & ending at Sekolah Puspa Bangsa', () => {
  assert.equal(LEVEL_CONFIGS.length, 20, 'Exactly 20 level configurations exist');

  let prevDistance = 0;
  for (let i = 0; i < 20; i++) {
    const cfg = LEVEL_CONFIGS[i];
    assert.equal(cfg.level, i + 1, `Level numbering is 1-indexed (Level ${i + 1})`);
    assert.ok(cfg.name && typeof cfg.name === 'string', `Level ${i + 1} has a name`);
    assert.ok(cfg.distanceMeters >= 3000 && cfg.distanceMeters <= 25000, `Distance ${cfg.distanceMeters}m is within 3000m-25000m`);
    assert.ok(cfg.distanceMeters >= prevDistance, `Distance monotonically increases or stays stepped (${cfg.distanceMeters} >= ${prevDistance})`);
    prevDistance = cfg.distanceMeters;

    assert.ok(cfg.timeLimitSec >= 240 && cfg.timeLimitSec <= 1800, `Time limit is balanced (${cfg.timeLimitSec}s)`);
    assert.ok(Array.isArray(cfg.biomes) && cfg.biomes.length >= 2, `Level has at least 2 biomes`);

    // ABSOLUTE RULE: Last biome must ALWAYS be BIOMES.SEKOLAH (id: 4)
    const lastBiome = cfg.biomes[cfg.biomes.length - 1];
    const lastBiomeId = typeof lastBiome === 'object' ? lastBiome.id : lastBiome;
    assert.equal(lastBiomeId, BIOMES.SEKOLAH.id, `Level ${i + 1} MUST finish at Sekolah Puspa Bangsa (id: 4)`);

    // Terrain instantiation with levelConfig
    const terrain = new TerrainSystem(cfg.distanceMeters, cfg);
    assert.ok(terrain.segments.length >= 2, `Terrain segments created for Level ${i + 1}`);
    const lastSeg = terrain.segments[terrain.segments.length - 1];
    assert.equal(lastSeg.id, BIOMES.SEKOLAH.id, `Terrain final segment for Level ${i + 1} is Sekolah`);
    assert.equal(lastSeg.end, cfg.totalMeters, `Terrain final segment ends at total track distance`);
  }
});

test('STORY_DIALOGUES - All 20 levels have rich Intro & Outro dialogues with all characters', () => {
  const charactersFound = new Set();

  for (let lvl = 1; lvl <= 20; lvl++) {
    const story = STORY_DIALOGUES[lvl];
    assert.ok(story, `Story exists for Level ${lvl}`);
    assert.ok(Array.isArray(story.intro) && story.intro.length >= 2 && story.intro.length <= 5, `Level ${lvl} has 2-5 intro dialogue lines (actual: ${story.intro?.length})`);
    assert.ok(Array.isArray(story.outro) && story.outro.length >= 2 && story.outro.length <= 5, `Level ${lvl} has 2-5 outro dialogue lines (actual: ${story.outro?.length})`);

    for (const line of [...story.intro, ...story.outro]) {
      assert.ok(line.speaker, `Dialogue line has speaker`);
      assert.ok(line.text && line.text.length > 5, `Dialogue line has substantial text`);
      assert.ok(line.mood, `Dialogue line has mood`);
      assert.equal(/\bMBG\b/.test(line.text), false, `Dialogue line in Level ${lvl} must not contain deprecated 'MBG': "${line.text}"`);
      assert.equal(/\bMBG\b/.test(line.role || ''), false, `Role in Level ${lvl} must not contain deprecated 'MBG'`);
      assert.equal(/\bJon\b/.test(line.text), false, `Dialogue line in Level ${lvl} must use nickname 'Yon' instead of 'Jon': "${line.text}"`);
      charactersFound.add(line.speaker);
    }
  }

  // Level 1 specific validation: Dialogue and tips must not mention Pantura or ocean winds
  const lvl1 = STORY_DIALOGUES[1];
  const lvl1Cfg = LEVEL_CONFIGS[0];
  const lvl1AllText = [...lvl1.intro, ...lvl1.outro].map(l => l.text).join(' ') + ' ' + lvl1Cfg.tips;
  assert.equal(/pesisir/i.test(lvl1AllText), false, 'Level 1 does not mention pesisir (Hamparan Lembah Sawah)');
  assert.equal(/angin laut/i.test(lvl1AllText), false, 'Level 1 does not mention angin laut (Hamparan Lembah Sawah)');
  assert.equal(/pantura/i.test(lvl1AllText), false, 'Level 1 does not mention pantura (Hamparan Lembah Sawah)');
  assert.ok(/sawah|pematang|irigasi/i.test(lvl1AllText), 'Level 1 mentions sawah/pematang/irigasi');

  assert.ok(charactersFound.has('Tion'), 'Protagonist Tion is featured');
  assert.ok(charactersFound.has('Bu Yulie'), 'Love interest Bu Yulie is featured');
  assert.ok(charactersFound.has('Husna'), 'Schoolgirl Husna is featured');
  assert.ok(charactersFound.has('Zacky'), 'Mechanic Zacky is featured');
  assert.ok(charactersFound.has('Mang Abdul'), 'Veteran driver Mang Abdul is featured');
});

test('PhysicsVehicle - Upgrades scaling (Engine power, Tire Grip, Suspension spring & damping)', () => {
  const v = new PhysicsVehicle(100, 300);

  // Baseline Level 1 (must match exact default physics)
  v.applyUpgrades({ engine: 1, grip: 1, suspension: 1 });
  assert.equal(v.enginePower, 2200, 'Level 1 Engine Power baseline is 2200');
  assert.equal(v.tireGrip, 1.0, 'Level 1 Tire Grip baseline is 1.0');
  assert.equal(v.kSpring, 180, 'Level 1 Suspension Spring baseline is 180');
  assert.equal(v.kDamper, 18.8, 'Level 1 Suspension Damper baseline is 18.8');

  // Max Level 20
  v.applyUpgrades({ engine: 20, grip: 20, suspension: 20 });
  assert.equal(v.enginePower, 2200 + 19 * 80, 'Level 20 Engine Power scales to 3720');
  assert.ok(Math.abs(v.tireGrip - (1.0 + 19 * 0.03)) < 1e-6, 'Level 20 Tire Grip scales to 1.57');
  assert.equal(v.kSpring, 180 + 19 * 4, 'Level 20 Suspension Spring scales to 256');
  assert.ok(Math.abs(v.kDamper - (18.8 + 19 * 0.4)) < 1e-6, 'Level 20 Suspension Damper scales to 26.4');
});

test('index.html DOM & Script Structure - UI components, modals, and event bindings', () => {
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');

  // Modals present
  assert.ok(html.includes('id="startModal"'), 'startModal exists');
  assert.ok(html.includes('id="mainMenuModal"'), 'mainMenuModal exists');
  assert.ok(html.includes('id="levelSelectModal"'), 'levelSelectModal exists');
  assert.ok(html.includes('id="garageModal"'), 'garageModal exists');
  assert.ok(html.includes('id="dialogueModal"'), 'dialogueModal exists');
  assert.ok(html.includes('id="victoryModal"'), 'victoryModal exists');
  assert.ok(html.includes('id="gameOverModal"'), 'gameOverModal exists');
  assert.ok(html.includes('id="pauseModal"'), 'pauseModal exists');

  // Garage components
  assert.ok(html.includes('id="garagePreviewCanvas"'), 'Garage live preview canvas exists');
  assert.ok(html.includes('id="btnUpgradeEngine"'), 'Engine upgrade button exists');
  assert.ok(html.includes('id="btnUpgradeGrip"'), 'Grip upgrade button exists');
  assert.ok(html.includes('id="btnUpgradeSusp"'), 'Suspension upgrade button exists');
  assert.ok(html.includes('skinBtn_speedy'), 'Speedy skin button exists');
  assert.ok(html.includes('skinBtn_mountain'), 'Mountain skin button exists');
  assert.ok(html.includes('skinBtn_retro'), 'Retro skin button exists');
  assert.ok(html.includes('skinBtn_sport'), 'Sport skin button exists');
  assert.ok(html.includes('rimBtn_gold'), 'Gold rim button exists');
  assert.ok(html.includes('rimBtn_beadlock'), 'Beadlock rim button exists');
  assert.ok(html.includes('rimBtn_whitewall'), 'Whitewall rim button exists');

  // React CDN & Mount point
  assert.ok(html.includes('id="reactAppRoot"'), 'React mount container exists');
  assert.ok(html.includes('initReactOverlay'), 'React 18 overlay bridge initialized');
});

test('TerrainSystem - All 20 levels have grounded start (y=520 at 150px) and safe elevation bounds', () => {
  for (let lvl = 1; lvl <= 20; lvl++) {
    const cfg = LEVEL_CONFIGS[lvl - 1];
    const terrain = new TerrainSystem(cfg.distanceMeters, cfg);

    // Initial vehicle spawn location is startX = 150 px (7.5 meters)
    const startH = terrain.getHeight(150);
    assert.equal(startH, 520, `Level ${lvl} (${cfg.name}) starts with flat runway at exact baseElevation 520`);

    // Verify terrain profile across entire track length
    const sampleStepMeters = 25;
    for (let m = 0; m <= cfg.finishMeters; m += sampleStepMeters) {
      const h = terrain.getHeight(m * PHYSICS_CONSTANTS.METER_SCALE);
      assert.ok(Number.isFinite(h), `Level ${lvl} height at ${m}m is finite`);
      // Altitude must stay within proven nominal track envelope [150, 650]
      assert.ok(h >= 150 && h <= 650, `Level ${lvl} height ${h} at ${m}m is within playable safe bounds [150, 650]`);
    }

    // School finish line elevation
    const finishH = terrain.getHeight(cfg.finishMeters * PHYSICS_CONSTANTS.METER_SCALE);
    assert.ok(finishH >= 380 && finishH <= 460, `Level ${lvl} finish line at ${cfg.finishMeters}m lands near school courtyard elevation`);
  }
});

test('GameRenderer - renderGaragePreview passes preview canvas context to struts and wheels', () => {
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');

  // Verify drawSuspensionStrut and drawWheel accept targetCtx parameter
  assert.match(html, /drawSuspensionStrut\s*\(\s*mx,\s*my,\s*wx,\s*wy,\s*targetCtx\s*=\s*null\s*\)/,
    'drawSuspensionStrut accepts optional targetCtx parameter');
  assert.match(html, /drawWheel\s*\(\s*wheel,\s*targetCtx\s*=\s*null\s*\)/,
    'drawWheel accepts optional targetCtx parameter');

  // Verify renderGaragePreview forwards its local preview ctx
  assert.match(html, /this\.drawSuspensionStrut\s*\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*ctx\s*\)/,
    'renderGaragePreview passes local preview ctx to drawSuspensionStrut');
  assert.match(html, /this\.drawWheel\s*\([^,]+,\s*ctx\s*\)/,
    'renderGaragePreview passes local preview ctx to drawWheel');
});

test('Garage - Skin & Rim unlock progression rules and badges', () => {
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');

  // Verify progressive skin level requirements (standard: 1, speedy: 4, mountain: 8, retro: 12, sport: 16)
  assert.ok(html.includes('speedy: 4'), 'Speedy skin requires level 4');
  assert.ok(html.includes('mountain: 8'), 'Mountain skin requires level 8');
  assert.ok(html.includes('retro: 12'), 'Retro skin requires level 12');
  assert.ok(html.includes('sport: 16'), 'Sport skin requires level 16');

  // Verify progressive rim level requirements (standard: 1, gold: 5, beadlock: 10, whitewall: 15)
  assert.ok(html.includes('gold: 5'), 'Gold rim requires level 5');
  assert.ok(html.includes('beadlock: 10'), 'Beadlock rim requires level 10');
  assert.ok(html.includes('whitewall: 15'), 'Whitewall rim requires level 15');
});

test('Character Avatars - All dialogue speakers and moods map to valid WebP and PNG assets', () => {
  const charactersDir = path.resolve('assets/refresh/v11/characters');
  assert.ok(fs.existsSync(charactersDir), 'assets/refresh/v11/characters directory exists');

  for (let lvl = 1; lvl <= 20; lvl++) {
    const story = STORY_DIALOGUES[lvl];
    for (const line of [...story.intro, ...story.outro]) {
      const meta = getCharacterAvatarMeta(line.speaker, line.mood);
      assert.ok(meta, `Metadata returned for ${line.speaker} (${line.mood})`);
      assert.ok(meta.slug, `Slug exists for ${line.speaker}`);
      assert.ok(meta.gradient, `Gradient styling exists for ${line.speaker}`);
      assert.ok(meta.border, `Border styling exists for ${line.speaker}`);

      // Check physical file on disk
      const webpPath = path.join(charactersDir, `${meta.slug}.webp`);
      const pngPath = path.join(charactersDir, `${meta.slug}.png`);
      assert.ok(fs.existsSync(webpPath), `WebP asset exists on disk: ${meta.slug}.webp`);
      assert.ok(fs.existsSync(pngPath), `PNG asset exists on disk: ${meta.slug}.png`);
    }
  }
});

test('Skins and Rims Assets - 5 skins and 5 rims exist in WebP and PNG formats', () => {
  const skinsDir = path.resolve('assets/refresh/v11/skins');
  const rimsDir = path.resolve('assets/refresh/v11/rims');
  assert.ok(fs.existsSync(skinsDir), 'assets/refresh/v11/skins exists');
  assert.ok(fs.existsSync(rimsDir), 'assets/refresh/v11/rims exists');

  const skins = ['standard', 'speedy', 'mountain', 'retro', 'sport'];
  for (const s of skins) {
    assert.ok(fs.existsSync(path.join(skinsDir, `skin_${s}.webp`)), `skin_${s}.webp exists`);
    assert.ok(fs.existsSync(path.join(skinsDir, `skin_${s}.png`)), `skin_${s}.png exists`);
  }

  const rims = ['default', 'standard', 'gold', 'beadlock', 'whitewall'];
  for (const r of rims) {
    assert.ok(fs.existsSync(path.join(rimsDir, `rim_${r}.webp`)), `rim_${r}.webp exists`);
    assert.ok(fs.existsSync(path.join(rimsDir, `rim_${r}.png`)), `rim_${r}.png exists`);
  }
});

test('PhysicsVehicle - Tactical buffs for all 5 skins and 5 rims', () => {
  const v = new PhysicsVehicle(100, 300);

  // Baseline standard + default
  v.applyUpgrades({ engine: 1, grip: 1, suspension: 1 }, 'standard', 'default');
  const baseSpeed = v.maxForwardSpeed;
  const basePower = v.enginePower;
  const basePitch = v.airPitchTorque;
  const baseDamper = v.kDamper;
  const baseSpring = v.kSpring;
  const baseRamp = v.throttleRampUp;

  assert.equal(v.fuelRateMultiplier, 1.0);
  assert.equal(v.landingShockMultiplier, 1.0);
  assert.equal(v.mudGripBonus, 1.0);
  assert.equal(v.asphaltGripBonus, 1.0);

  // Speedy skin (+6% Speed, +10% Air Pitch)
  v.applyUpgrades({ engine: 1, grip: 1, suspension: 1 }, 'speedy', 'default');
  assert.ok(Math.abs(v.maxForwardSpeed - baseSpeed * 1.06) < 1e-4);
  assert.ok(Math.abs(v.airPitchTorque - basePitch * 1.10) < 1e-4);

  // Sport skin (+12% Speed, +15% Throttle Ramp)
  v.applyUpgrades({ engine: 1, grip: 1, suspension: 1 }, 'sport', 'default');
  assert.ok(Math.abs(v.maxForwardSpeed - baseSpeed * 1.12) < 1e-4);
  assert.ok(Math.abs(v.throttleRampUp - baseRamp * 1.15) < 1e-4);

  // Mountain skin (+5% Engine Power, +7% Damper)
  v.applyUpgrades({ engine: 1, grip: 1, suspension: 1 }, 'mountain', 'default');
  assert.ok(Math.abs(v.enginePower - basePower * 1.05) < 1e-4);
  assert.ok(Math.abs(v.kDamper - baseDamper * 1.07) < 1e-4);

  // Retro skin (+10% Shock Absorption, +5% Spring & Damper)
  v.applyUpgrades({ engine: 1, grip: 1, suspension: 1 }, 'retro', 'default');
  assert.ok(Math.abs(v.kSpring - baseSpring * 1.05) < 1e-4);
  assert.ok(Math.abs(v.kDamper - baseDamper * 1.05) < 1e-4);
  assert.ok(Math.abs(v.landingShockMultiplier - 0.90) < 1e-4);

  // Standard rim (+8% Fuel Efficiency)
  v.applyUpgrades({ engine: 1, grip: 1, suspension: 1 }, 'standard', 'standard');
  assert.ok(Math.abs(v.fuelRateMultiplier - 0.92) < 1e-4);

  // Gold rim (+8% Asphalt/Highway Traction)
  v.applyUpgrades({ engine: 1, grip: 1, suspension: 1 }, 'standard', 'gold');
  assert.ok(Math.abs(v.asphaltGripBonus - 1.08) < 1e-4);

  // Beadlock rim (+35% Mud Traction)
  v.applyUpgrades({ engine: 1, grip: 1, suspension: 1 }, 'standard', 'beadlock');
  assert.ok(Math.abs(v.mudGripBonus - 1.35) < 1e-4);

  // Whitewall rim (+15% Cargo Landing Protection)
  v.applyUpgrades({ engine: 1, grip: 1, suspension: 1 }, 'standard', 'whitewall');
  assert.ok(Math.abs(v.landingShockMultiplier - 0.85) < 1e-4);
});

test('GameRenderer - Dynamic per-skin render calibration & visual wheel grounding', () => {
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');

  // Verify SKIN_RENDER_CONFIG contains calibrated offsets and dimensions for all 5 skins
  assert.ok(html.includes('SKIN_RENDER_CONFIG'), 'SKIN_RENDER_CONFIG is defined');
  for (const s of ['standard', 'speedy', 'mountain', 'retro', 'sport']) {
    assert.match(html, new RegExp(`${s}:\\s*\\{[^}]*wheelRadius`), `SKIN_RENDER_CONFIG defines wheelRadius for ${s}`);
  }

  // Verify getVisualWheelRadius method
  assert.ok(html.includes('getVisualWheelRadius('), 'GameRenderer defines getVisualWheelRadius');

  // Verify visual grounding logic in drawVehicle
  assert.match(html, /const\s+drop\s*=\s*Math\.max\(0,\s*18\s*-\s*rVis\)/, 'Visual wheel grounding derives drop offset from physics wheelRadius 18');
  assert.match(html, /dropX\s*=\s*-sinA\s*\*\s*drop/, 'Drop offset tilts along vehicle down-axis in X');
  assert.match(html, /dropY\s*=\s*cosA\s*\*\s*drop/, 'Drop offset tilts along vehicle down-axis in Y');
});

test('Garage - Strict two-stage economy (Level Unlock -> Coin Purchase -> Equip)', () => {
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');

  // Verify only standard skin and default rim are owned by default
  assert.match(html, /purchasedSkins:\s*\['standard'\]/, 'Only standard skin owned by default');
  assert.match(html, /purchasedRims:\s*\['default'\]/, 'Only default rim owned by default');
  assert.ok(html.includes('garageEconomyVersion: 2'), 'v2 strict garage economy version enabled');

  // Ensure no legacy auto-grant loop exists
  assert.equal(html.includes('unlockedLvl >= req && !skins.includes(k)'), false, 'Legacy auto-grant skin loop is removed');
  assert.equal(html.includes('unlockedLvl >= req && !rims.includes(k)'), false, 'Legacy auto-grant rim loop is removed');

  // Verify prices and level requirements
  assert.ok(html.includes('speedy: 580'), 'Speedy Courier costs 580 coins');
  assert.ok(html.includes('mountain: 1430'), 'Mountain Explorer costs 1430 coins');
  assert.ok(html.includes('standard: 350'), 'Standard Utility rim costs 350 coins');
  assert.ok(html.includes('gold: 730'), 'Gold Alloy rim costs 730 coins');
});

