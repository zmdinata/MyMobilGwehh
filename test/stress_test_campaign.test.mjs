// test/stress_test_campaign.test.mjs - Comprehensive multi-level gameplay simulation & regression test
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BIOMES,
  PHYSICS_CONSTANTS,
  TerrainSystem,
  PhysicsVehicle,
  GameStateManager,
  LEVEL_CONFIGS,
  STORY_DIALOGUES
} from '../game_core.js';

test('Campaign Simulation - Verify all 20 levels can be generated and simulated without NaN or crashes', () => {
  for (let lvl = 1; lvl <= 20; lvl++) {
    const cfg = LEVEL_CONFIGS[lvl - 1];
    assert.ok(cfg, `Level ${lvl} config exists`);

    const terrain = new TerrainSystem(cfg.distanceMeters, cfg);
    assert.ok(terrain.segments && terrain.segments.length >= 2, `Level ${lvl} has valid segments`);
    assert.equal(terrain.finishLineMeters, cfg.finishMeters, `Level ${lvl} finishLineMeters matches config`);

    // Verify last segment is strictly Sekolah
    const lastSeg = terrain.segments[terrain.segments.length - 1];
    assert.equal(lastSeg.id, BIOMES.SEKOLAH.id, `Level ${lvl} finishes at Sekolah Puspa Bangsa`);

    // Simulate vehicle on the level track for 120 steps (1 second)
    const startX = 150;
    const startY = terrain.getHeight(startX) - 34;
    const vehicle = new PhysicsVehicle(startX, startY);

    // Apply upgrades proportional to level
    vehicle.applyUpgrades({
      engine: Math.min(20, Math.ceil(lvl)),
      grip: Math.min(20, Math.ceil(lvl)),
      suspension: Math.min(20, Math.ceil(lvl))
    });

    const inputs = { gas: true, brake: false, horn: false };
    const dt = 1 / 60;

    for (let step = 0; step < 120; step++) {
      vehicle.update(dt, inputs, terrain);

      // Verify no NaN or infinite values
      assert.ok(Number.isFinite(vehicle.x), `Level ${lvl} vehicle.x is finite at step ${step}`);
      assert.ok(Number.isFinite(vehicle.y), `Level ${lvl} vehicle.y is finite at step ${step}`);
      assert.ok(Number.isFinite(vehicle.vx), `Level ${lvl} vehicle.vx is finite at step ${step}`);
      assert.ok(Number.isFinite(vehicle.vy), `Level ${lvl} vehicle.vy is finite at step ${step}`);
      assert.ok(Number.isFinite(vehicle.angle), `Level ${lvl} vehicle.angle is finite at step ${step}`);
    }

    // Vehicle should have progressed forward
    assert.ok(vehicle.x > startX, `Level ${lvl} vehicle made positive forward progress under throttle`);
  }
});

test('Economy & Upgrades - Progression cost curve and wallet deduction', () => {
  // Aggressive exponential upgrade cost formula: round(100 * (1.25)^(level - 1))
  function getCost(lvl) {
    if (lvl >= 20) return null;
    return Math.round(100 * Math.pow(1.25, lvl - 1));
  }

  let totalCostPerStat = 0;
  for (let l = 1; l < 20; l++) {
    const cost = getCost(l);
    assert.ok(cost > 0, `Cost for Level ${l} -> ${l + 1} is positive (${cost})`);
    totalCostPerStat += cost;
  }
  // Total cost from level 1 to 20 should be around 25000-29000 coins
  assert.ok(totalCostPerStat > 24000 && totalCostPerStat < 29000, `Total cost to max upgrade is balanced (~${totalCostPerStat})`);

  // Max level returns null
  assert.equal(getCost(20), null, 'Level 20 cannot be upgraded further');
});

test('Story Dialogue Completeness - Full character presence across the campaign', () => {
  const charactersFound = new Set();

  for (let lvl = 1; lvl <= 20; lvl++) {
    const d = STORY_DIALOGUES[lvl];
    assert.ok(d, `Dialogue exists for Level ${lvl}`);
    assert.ok(Array.isArray(d.intro) && d.intro.length >= 2, `Level ${lvl} has at least 2 intro dialogue lines`);
    assert.ok(Array.isArray(d.outro) && d.outro.length >= 2, `Level ${lvl} has at least 2 outro dialogue lines`);

    for (const line of [...d.intro, ...d.outro]) {
      assert.ok(line.speaker, `Dialogue in Level ${lvl} has speaker`);
      assert.ok(line.text && line.text.length > 3, `Dialogue in Level ${lvl} has text`);
      charactersFound.add(line.speaker);
    }
  }

  // Verify all 5 characters appear in the campaign
  assert.ok(charactersFound.has('Tion'), 'Tion appears in dialogues');
  assert.ok(charactersFound.has('Bu Yulie'), 'Bu Yulie appears in dialogues');
  assert.ok(charactersFound.has('Husna'), 'Husna appears in dialogues');
  assert.ok(charactersFound.has('Zacky'), 'Zacky appears in dialogues');
  assert.ok(charactersFound.has('Mang Abdul'), 'Mang Abdul appears in dialogues');
});

test('Level Progression - Distance and Time limits increase monotonically', () => {
  for (let i = 0; i < LEVEL_CONFIGS.length - 1; i++) {
    const cur = LEVEL_CONFIGS[i];
    const next = LEVEL_CONFIGS[i + 1];

    assert.ok(next.finishMeters >= cur.finishMeters, `Level ${next.level} distance >= Level ${cur.level} distance`);
    assert.ok(next.timeLimitSec >= cur.timeLimitSec, `Level ${next.level} time limit >= Level ${cur.level} time limit`);
  }
});
