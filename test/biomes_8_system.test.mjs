// test/biomes_8_system.test.mjs
// Comprehensive verification of the 8 distinct biomes system across game_core, manifest, and index.html

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BIOMES, LEVEL_CONFIGS, TerrainSystem } from '../game_core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manifestPath = path.resolve(__dirname, '../assets/manifest.json');
const indexPath = path.resolve(__dirname, '../index.html');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const indexHtml = fs.readFileSync(indexPath, 'utf8');

test('BIOMES defines 8 dedicated biomes with unique IDs 1..8 and valid metadata', () => {
  const expectedBiomes = [
    { key: 'PESISIR_PANTURA', id: 1, name: 'Pesisir Pantai Pantura' },
    { key: 'JALUR_PANTURA', id: 2, name: 'Jalur Arteri Pantura' },
    { key: 'LEMBAH_SAWAH', id: 3, name: 'Hamparan Lembah Sawah' },
    { key: 'DESA_SAWAH', id: 4, name: 'Pedesaan Lumbung Padi' },
    { key: 'PUNCAK_GUNUNG', id: 5, name: 'Puncak Siluet Gn. Ciremai' },
    { key: 'LERENG_GUNUNG', id: 6, name: 'Lereng Hutan Pinus Terjal' },
    { key: 'PEMUKIMAN', id: 7, name: 'Kawasan Pemukiman Suburb' },
    { key: 'SEKOLAH', id: 8, name: 'Kompleks Sekolah Puspa Bangsa' }
  ];

  for (const b of expectedBiomes) {
    assert.ok(BIOMES[b.key], `BIOMES.${b.key} should be defined`);
    assert.equal(BIOMES[b.key].id, b.id, `BIOMES.${b.key} id should be ${b.id}`);
    assert.equal(BIOMES[b.key].name, b.name, `BIOMES.${b.key} name should be '${b.name}'`);
    assert.ok(BIOMES[b.key].assetKey, `BIOMES.${b.key} has assetKey`);
  }

  // Legacy aliases
  assert.equal(BIOMES.PANTURA.id, 1, 'Legacy alias PANTURA has id 1');
  assert.equal(BIOMES.SAWAH.id, 3, 'Legacy alias SAWAH has id 3');
  assert.equal(BIOMES.GUNUNG.id, 5, 'Legacy alias GUNUNG has id 5');
});

test('All 20 LEVEL_CONFIGS end at BIOMES.SEKOLAH (id 8)', () => {
  assert.equal(LEVEL_CONFIGS.length, 20, 'There are exactly 20 level configs');
  for (const cfg of LEVEL_CONFIGS) {
    assert.ok(Array.isArray(cfg.biomes) && cfg.biomes.length >= 2, `Level ${cfg.level} has biomes array`);
    const lastBiome = cfg.biomes[cfg.biomes.length - 1];
    assert.equal(lastBiome.id, 8, `Level ${cfg.level} final biome must be SEKOLAH (id 8)`);
    assert.equal(lastBiome.name, 'Kompleks Sekolah Puspa Bangsa');
  }
});

test('manifest.json defines all 8 biome assets (biome1..biome8) pointing to existing webp files', () => {
  const assets = manifest.assets;
  for (let i = 1; i <= 8; i++) {
    const key = `biome${i}`;
    assert.ok(assets[key], `manifest.assets should define ${key}`);
    const filePath = path.resolve(__dirname, '..', assets[key].src);
    assert.ok(fs.existsSync(filePath), `Asset file ${assets[key].src} exists on disk`);
  }

  // Also verify legacy test keys exist
  for (let b = 1; b <= 4; b++) {
    assert.ok(assets[`biome${b}Distant`], `manifest defines biome${b}Distant`);
    assert.ok(assets[`biome${b}Midground`], `manifest defines biome${b}Midground`);
  }
});

test('index.html contains skyPalettes and terrainPalettes for all 8 biomes', () => {
  for (let i = 1; i <= 8; i++) {
    assert.ok(indexHtml.includes(`${i}: { top:`), `skyPalettes defines biome ${i}`);
    assert.ok(indexHtml.includes(`${i}: { surface:`), `terrainPalettes defines biome ${i}`);
  }
});

test('TerrainSystem generates safe elevations across custom 8-biome levels', () => {
  const customCfg = {
    finishMeters: 4600,
    totalMeters: 4800,
    biomes: [
      BIOMES.PESISIR_PANTURA,
      BIOMES.JALUR_PANTURA,
      BIOMES.LEMBAH_SAWAH,
      BIOMES.DESA_SAWAH,
      BIOMES.PUNCAK_GUNUNG,
      BIOMES.LERENG_GUNUNG,
      BIOMES.PEMUKIMAN,
      BIOMES.SEKOLAH
    ]
  };

  const terrain = new TerrainSystem(customCfg);
  assert.equal(terrain.getHeight(150), 520, 'Start height at 150px is grounded at 520px');

  for (let x = 0; x <= 4600 * 20; x += 100) {
    const h = terrain.getHeight(x);
    assert.ok(!isNaN(h), `Height at x=${x} is not NaN`);
    assert.ok(h >= 140 && h <= 660, `Height ${h} at x=${x} within safe envelope [140, 660]`);
  }
});
