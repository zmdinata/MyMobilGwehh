// test/verify_index_html.test.mjs - HTML and JS syntax & DOM ID verification
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';

const htmlPath = path.resolve('index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const coreContent = fs.readFileSync(path.resolve('game_core.js'), 'utf8');

test('index.html exists and is not empty', () => {
  assert.ok(htmlContent.length > 5000, 'index.html has substantial content');
});

test('index.html contains required Tailwind and Google Fonts', () => {
  assert.ok(htmlContent.includes('cdn.tailwindcss.com'), 'Tailwind CSS CDN is present');
  assert.ok(htmlContent.includes('Fredoka+One'), 'Fredoka One font is linked');
  assert.ok(htmlContent.includes('Chakra+Petch'), 'Chakra Petch font is linked');
  assert.ok(htmlContent.includes('Rajdhani'), 'Rajdhani font is linked');
});

test('index.html contains all required narrative & lore elements', () => {
  assert.ok(htmlContent.includes('MBG (My Mobil Gweh)'), 'Title included');
  assert.ok(htmlContent.includes('Mang Ucup'), 'Mang Ucup lore included');
  assert.ok(htmlContent.includes('SD, SMP, dan SMA Puspa Bangsa Cirebon'), 'Fictional school district destination included');
  assert.ok(htmlContent.includes('Unit Antar Pangan & Gizi'), 'Fictional delivery unit included');
  assert.ok(htmlContent.includes('Sekolah Puspa Bangsa'), 'Fictional school identity included');
  assert.ok(htmlContent.includes('drawSchoolFinishGate'), 'School gate has a procedural fallback');
  assert.equal(htmlContent.includes('STMIK IKMI'), false, 'No real school name remains in the runtime page');
  assert.equal(htmlContent.includes('TERAKREDITASI'), false, 'No unsupported accreditation claim remains in the runtime page');
  assert.ok(htmlContent.includes('500 porsi'), '500 portions goal included');
  assert.ok(htmlContent.includes('09:45 WIB'), '09:45 WIB deadline included');
  assert.ok(htmlContent.includes('MOBIL GWEH TERGULING'), 'Rollover gameover text included');
  assert.ok(htmlContent.includes('Game Over'), 'Exact Game Over text included');
  assert.ok(htmlContent.includes('Omprengmu telah tumpah!'), 'Exact Omprengmu telah tumpah text included');
  assert.ok(htmlContent.includes('BENSIN LUDES DI TANJAKAN'), 'Fuel out gameover text included');
  assert.ok(htmlContent.includes('TELAT! BEL SEKOLAH SUDAH BUNYI'), 'Deadline expired text included');
  assert.ok(htmlContent.includes('PAKET GIZI HANCUR LEBUR'), 'Cargo destroyed text included');
});

test('index.html contains mechanical suspension strut linkage rendering', () => {
  assert.ok(htmlContent.includes('drawSuspensionStrut'), 'drawSuspensionStrut method exists');
  assert.ok(htmlContent.includes('id="goSubtitle"'), 'goSubtitle element exists in DOM');
});

test('Visible hazard art protrudes above the terrain and log sprite matches its wide silhouette', () => {
  const hazardRenderer = htmlContent.slice(htmlContent.indexOf('      drawHazards(terrain) {'), htmlContent.indexOf('      drawCollectibles(terrain) {'));
  assert.match(hazardRenderer, /terrain\.getHeight\(pxStart\) - 7/, 'Water is visible above the road surface');
  assert.match(hazardRenderer, /terrain\.getHeight\(mxStart\) - 5/, 'Mud is visible above the road surface');
  assert.ok(hazardRenderer.includes('ctx.drawImage(this.assets.obstacleLog.img, -36, -27, 72, 30)'), 'Wide obstacle sprite is not squeezed into a circle');
  assert.ok(hazardRenderer.includes('const halfWidth = 1.2 * PHYSICS_CONSTANTS.METER_SCALE'), 'Speed bump visible width derives from the physics footprint');
  assert.ok(hazardRenderer.includes('const y = terrain.getHeight(x)'), 'Speed bump stroke samples the same terrain profile as collision physics');
  assert.equal(hazardRenderer.includes('ctx.arc(sbPxX, sbPxY + 2, 10'), false, 'Old narrow speed bump art is removed');
});

test('index.html contains all mobile pedals and desktop controls', () => {
  assert.ok(htmlContent.includes('id="pedalGas"'), 'Gas pedal element exists');
  assert.ok(htmlContent.includes('id="pedalBrake"'), 'Brake pedal element exists');
  assert.ok(htmlContent.includes('id="hornBtn"'), 'Horn button element exists');
  assert.match(htmlContent, /@media\s*\(max-width:\s*480px\)/, 'Compact phone widths use a responsive HUD');
  assert.ok(htmlContent.includes('id="fuelWidget"'), 'Fuel status fits the responsive HUD');
  assert.ok(htmlContent.includes('id="hudActions"'), 'Audio and pause controls fit the responsive HUD');
  assert.ok(htmlContent.includes('touch-action: none'), 'touch-action none applied');
});

test('index.html JavaScript extracts and compiles without syntax errors', () => {
  // Extract content between <script> ... </script> (excluding external src scripts)
  const scriptRegex = /<script((?![^>]*\bsrc=)[^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptCount = 0;

  while ((match = scriptRegex.exec(htmlContent)) !== null) {
    const attributes = match[1];
    const code = match[2];
    scriptCount++;
    if (/\btype=[\"']module[\"']/i.test(attributes)) {
      const result = spawnSync(process.execPath, ['--input-type=module', '--check', '-'], { input: code, encoding: 'utf8' });
      assert.equal(result.status, 0, `Module script block #${scriptCount} must compile: ${result.stderr}`);
    } else {
      assert.doesNotThrow(() => new vm.Script(code), `Inline script block #${scriptCount} must compile without syntax errors`);
    }
  }

  assert.ok(scriptCount >= 2, 'Found at least tailwind config script and game engine script');
  assert.match(htmlContent, /import \{ BIOMES, PHYSICS_CONSTANTS, TerrainSystem as WorldTerrain, PhysicsVehicle, GameStateManager \} from '\.\/game_core\.js(?:\?[^']*)?'/, 'Browser imports tested terrain, vehicle physics, and state logic from game_core.js');
});

test('All getElementById calls in index.html match elements in the DOM', () => {
  const idRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
  let match;
  const queriedIds = new Set();
  while ((match = idRegex.exec(htmlContent)) !== null) {
    queriedIds.add(match[1]);
  }

  assert.ok(queriedIds.size > 10, 'Found expected getElementById calls');

  for (const id of queriedIds) {
    const elementRegex = new RegExp(`id=["']${id}["']`);
    assert.ok(
      elementRegex.test(htmlContent),
      `DOM element with id="${id}" must exist in index.html`
    );
  }
});

test('index.html contains calibrated vehicle geometry and alignment (16px rest length, 100x50 body)', () => {
  assert.ok(coreContent.includes('suspensionRestLength = 16'), 'Shared physics vehicle rest length is 16');
  assert.ok(coreContent.includes('rearMountOffset = { x: -30, y: 0 }'), 'Shared physics rear mount offset is (-30, 0)');
  assert.ok(coreContent.includes('frontMountOffset = { x: 30, y: 0 }'), 'Shared physics front mount offset is (30, 0)');
  assert.ok(htmlContent.includes('drawImage(this.assets.truckBody.img, -50, -45, 100, 50)'), 'Truck body drawn at 100x50 centered over wheel wells');
});

test('Browser start and restart place the truck at terrain ride height', () => {
  const groundedStart = /const startX = 150;\s*const startY = this\.terrain\.getHeight\(startX\) - 34;[^\n]*\n\s*this\.vehicle = new Vehicle\(startX, startY\);/g;
  assert.equal([...htmlContent.matchAll(groundedStart)].length, 2,
    'Initial start and restart both use the local terrain height and suspension geometry');
});

test('index.html contains 200m transition blend, skybox RGBA lerp, and road material blending', () => {
  assert.ok(coreContent.includes('getBiomeBlend(meterX)'), 'Shared terrain has getBiomeBlend method');
  assert.ok(coreContent.includes('1100, end: 1300'), 'Transition zone 1 covers 1100m - 1300m');
  assert.ok(coreContent.includes('2700, end: 2900'), 'Transition zone 2 covers 2700m - 2900m');
  assert.ok(coreContent.includes('4100, end: 4300'), 'Transition zone 3 covers 4100m - 4300m');
  assert.ok(htmlContent.includes('skyPalettes'), 'Renderer defines skyPalettes for RGBA Lerp');
  assert.ok(htmlContent.includes('terrainPalettes'), 'Renderer defines terrainPalettes for material blending');
  assert.ok(htmlContent.includes('drawDistantParallaxLayer'), 'Renderer has drawDistantParallaxLayer');
  assert.ok(htmlContent.includes('drawMidgroundParallaxLayer'), 'Renderer has drawMidgroundParallaxLayer');
  assert.ok(htmlContent.includes('`biome${biomeId}Midground`, w, h, scroll3, 0.12, 0.68'), 'Midground scenery is placed high enough for foreground landmarks to clear the physical terrain');
});

test('index.html loads manifest assets asynchronously and keeps procedural fallbacks', () => {
  assert.ok(htmlContent.includes("fetch('assets/manifest.json'"), 'Renderer loads the runtime asset manifest');
  assert.ok(htmlContent.includes('id="gameLogo"'), 'Start modal contains a manifest-driven game logo');
  assert.ok(htmlContent.includes('gameLogoFallback'), 'Logo failures reveal a readable text title');
  assert.ok(htmlContent.includes('id="cargoParcelIcon"'), 'Uploaded food parcel is visible in the gameplay cargo HUD');
  assert.ok(htmlContent.includes('cargoParcelFallback'), 'Cargo HUD falls back if the uploaded parcel fails to load');
  assert.ok(htmlContent.includes('await image.decode()'), 'Renderer waits for image decoding');
  assert.ok(htmlContent.includes('if (fallback && fallback !== src)'), 'Failed primary image gets at most one fallback attempt');
  assert.ok(htmlContent.includes('using procedural artwork'), 'Manifest failures keep procedural rendering available');
  assert.ok(htmlContent.includes('drawTiledBackground(`biome${biomeId}Distant`'), 'Distant biome art is tiled by the renderer');
  assert.ok(htmlContent.includes('drawTiledBackground(`biome${biomeId}Midground`'), 'Midground biome art is tiled by the renderer');
  assert.ok(htmlContent.includes('ctx.scale(-1, 1)'), 'Alternating mirrored tiles hide hard seams at the loop boundary');
});

test('index.html contains engine rev 180Hz, spring squeak boing, and burnout FX', () => {
  assert.ok(htmlContent.includes('targetFreq = 180'), 'Airborne gas revs engine frequency to 180Hz');
  assert.ok(coreContent.includes('playSuspensionSpringSound'), 'Shared physics calls suspension feedback when available');
  assert.ok(htmlContent.includes('burnoutSmoke'), 'Vehicle contains burnoutSmoke particle array');
  assert.ok(htmlContent.includes('tireMarks'), 'Vehicle contains tireMarks skid marks array');
  assert.ok(htmlContent.includes('PERFECT LANDING!'), 'Renderer contains PERFECT LANDING banner');
  assert.ok(coreContent.includes('handleLanding(terrain)'), 'Shared vehicle physics contains landing handling');
});
