// components/GameRenderer.js
import { PHYSICS_CONSTANTS, BIOMES, PhysicsVehicle } from '@/game_core.js';

export class Vehicle extends PhysicsVehicle {
  constructor(startX = 100, startY = 400) {
    super(startX, startY);
    this.exhaustPuffs = [];
    this.teloletNotes = [];
    this.burnoutSmoke = [];
    this.tireMarks = [];
  }

  update(dt, inputs, terrain) {
    super.update(dt, inputs, terrain);
    const elapsed = Number.isFinite(dt) ? Math.max(0, Math.min(0.1, dt)) : 0;
    const emit = (rate) => Math.random() < 1 - Math.exp(-rate * elapsed);

    if (inputs && inputs.gas && this.fuel > 0 && Math.abs(this.vx) < 160 && this.rearWheel.onGround && emit(24)) {
      const wheel = this.rearWheel;
      this.burnoutSmoke.push({
        x: wheel.x + (Math.random() * 8 - 4), y: wheel.y + this.wheelRadius - 2,
        vx: -40 - Math.random() * 60, vy: -15 - Math.random() * 25,
        size: 6 + Math.random() * 6, maxLife: 0.55, life: 0.55
      });
      this.tireMarks.push({ x: wheel.x, y: wheel.y + this.wheelRadius, rot: this.angle, life: 2.5, maxLife: 2.5 });
    }

    if (inputs && inputs.gas && emit(18)) {
      const cosA = Math.cos(this.angle), sinA = Math.sin(this.angle);
      this.exhaustPuffs.push({
        x: this.x - 42 * cosA - 16 * sinA,
        y: this.y - 42 * sinA + 16 * cosA,
        vx: -30 - Math.random() * 40, vy: -10 - Math.random() * 20,
        size: 4 + Math.random() * 5, life: 0.6, maxLife: 0.6
      });
    }

    this.updateEffects(this.burnoutSmoke, elapsed, (item) => {
      item.x += item.vx * elapsed; item.y += item.vy * elapsed;
      item.size += 22 * elapsed; item.life -= elapsed;
    });
    this.updateEffects(this.exhaustPuffs, elapsed, (item) => {
      item.x += item.vx * elapsed; item.y += item.vy * elapsed;
      item.size += 15 * elapsed; item.life -= elapsed;
    });
    this.updateEffects(this.tireMarks, elapsed, (item) => { item.life -= elapsed; });
    this.updateEffects(this.teloletNotes, elapsed, (item) => {
      item.x += item.vx * elapsed; item.y += item.vy * elapsed; item.life -= elapsed;
    });
  }

  updateEffects(items, dt, update) {
    for (let i = items.length - 1; i >= 0; i--) {
      update(items[i]);
      if (items[i].life <= 0) items.splice(i, 1);
    }
  }

  triggerTeloletNotes() {
    const symbols = ['♪', '♫', '♬'];
    const colors = ['#fbbf24', '#22d3ee', '#f43f5e', '#a855f7'];
    for (let i = 0; i < 5; i++) {
      this.teloletNotes.push({
        char: symbols[Math.floor(Math.random() * symbols.length)],
        x: this.x + (Math.random() * 20 - 10), y: this.y - 45,
        vx: (Math.random() - 0.5) * 60, vy: -80 - Math.random() * 50,
        life: 1.2, color: colors[i % colors.length]
      });
    }
  }
}

export class GameRenderer {
      constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;
        this.camera = { x: 0, y: 0, targetX: 0, targetY: 0, zoom: 1.0 };
        this.confetti = [];
        this.splatters = [];
        this.selectedSkin = 'standard';
        this.selectedRim = 'standard';
        this.initAssets();
        this.resize();
        window.addEventListener('resize', () => this.resize());
      }

      initAssets() {
        this.assets = {
          truckBody: { img: null, loaded: false, failed: false },
          truckWheel: { img: null, loaded: false, failed: false },
          fuelCan: { img: null, loaded: false, failed: false },
          coinGizi: { img: null, loaded: false, failed: false },
          obstacleLog: { img: null, loaded: false, failed: false },
          finishGate: { img: null, loaded: false, failed: false }
        };
        this.backgroundAssets = {};
        if (typeof Image === 'undefined' || typeof fetch === 'undefined') return;

        fetch('/assets/manifest.json', { cache: 'no-cache' })
          .then(response => {
            if (!response.ok) throw new Error(`Asset manifest returned ${response.status}`);
            return response.json();
          })
          .then(manifest => {
            const logoEntry = manifest.assets && manifest.assets.gameLogo;
            const logoElement = document.getElementById('gameLogo');
            const logoFallback = document.getElementById('gameLogoFallback');
            if (logoElement && logoEntry && logoEntry.src) {
              logoElement.onerror = () => {
                logoElement.hidden = true;
                if (logoFallback) logoFallback.classList.remove('sr-only');
              };
              logoElement.src = logoEntry.src;
            }

            const parcelEntry = manifest.assets && manifest.assets.foodParcel;
            const parcelElement = document.getElementById('vicFoodParcel');
            const parcelFallback = document.getElementById('vicFoodParcelFallback');
            const cargoParcelIcon = document.getElementById('cargoParcelIcon');
            const cargoParcelFallback = document.getElementById('cargoParcelFallback');
            if (cargoParcelIcon && parcelEntry && parcelEntry.src) {
              cargoParcelIcon.onload = () => {
                cargoParcelIcon.classList.remove('hidden');
                if (cargoParcelFallback) cargoParcelFallback.classList.add('hidden');
              };
              cargoParcelIcon.onerror = () => {
                cargoParcelIcon.classList.add('hidden');
                if (cargoParcelFallback) cargoParcelFallback.classList.remove('hidden');
              };
              cargoParcelIcon.src = parcelEntry.src;
            }
            if (parcelElement && parcelEntry && parcelEntry.src) {
              parcelElement.onload = () => {
                parcelElement.classList.remove('hidden');
                if (parcelFallback) parcelFallback.classList.add('hidden');
              };
              parcelElement.onerror = () => {
                parcelElement.classList.add('hidden');
                if (parcelFallback) parcelFallback.classList.remove('hidden');
              };
              parcelElement.src = parcelEntry.src;
            }

            for (const [key, entry] of Object.entries(manifest.assets || {})) {
              const isBiomeLayer = key.startsWith('biome');
              const target = isBiomeLayer
                ? (this.backgroundAssets[key] = { img: null, loaded: false, failed: false })
                : this.assets[key];
              if (!target || !entry.src) continue;
              target.width = entry.width;
              target.height = entry.height;
              target.pivot = entry.pivot;
              target.tileAspect = entry.tileAspect;
              this.loadAsset(target, entry.src, entry.fallback);
            }
          })
          .catch(error => console.warn('Asset manifest unavailable; using procedural artwork.', error));
      }

      async loadAsset(target, src, fallback) {
        const attempt = async path => {
          const image = new Image();
          image.decoding = 'async';
          const norm = path.startsWith('/') ? path : '/' + path;
          if (typeof image.decode === 'function') {
            image.src = norm;
            await image.decode();
          } else {
            await new Promise((resolve, reject) => {
              image.onload = resolve;
              image.onerror = () => reject(new Error(`Could not load ${norm}`));
              image.src = norm;
            });
          }
          return image;
        };

        try {
          target.img = await attempt(src);
          target.loaded = true;
          return;
        } catch (primaryError) {
          if (fallback && fallback !== src) {
            try {
              target.img = await attempt(fallback);
              target.loaded = true;
              return;
            } catch (fallbackError) {
              console.warn(`Asset and fallback failed: ${src}`, fallbackError);
            }
          }
          target.loaded = false;
          target.failed = true;
        }
      }

      drawTiledBackground(assetKey, w, h, scroll, topRatio, heightRatio) {
        const asset = this.backgroundAssets && this.backgroundAssets[assetKey];
        if (!asset || !asset.loaded || !asset.img) return false;
        const ctx = this.ctx;
        const drawHeight = h * heightRatio;
        const drawWidth = drawHeight * (asset.tileAspect || asset.width / asset.height);
        if (!drawWidth || !drawHeight) return false;
        const offset = ((scroll % drawWidth) + drawWidth) % drawWidth;
        const y = h * topRatio;
        for (let x = -offset; x < w; x += drawWidth) {
          const tileIndex = Math.round((x + scroll) / drawWidth);
          if (Math.abs(tileIndex % 2) === 1) {
            ctx.save();
            ctx.translate(x + drawWidth, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(asset.img, 0, y, drawWidth, drawHeight);
            ctx.restore();
          } else {
            ctx.drawImage(asset.img, x, y, drawWidth, drawHeight);
          }
        }
        return true;
      }

      resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
      }

      render(vehicle, terrain, gameState, inputs) {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        // Smooth Camera Follow
        this.camera.targetX = vehicle.x - w * 0.32;
        this.camera.targetY = vehicle.y - h * 0.65;
        this.camera.x += (this.camera.targetX - this.camera.x) * 0.1;
        this.camera.y += (this.camera.targetY - this.camera.y) * 0.1;

        const meterX = vehicle.x / PHYSICS_CONSTANTS.METER_SCALE;
        const currentBiome = terrain.getBiomeAt(meterX);
        const biomeBlend = terrain.getBiomeBlend(meterX);

        ctx.clearRect(0, 0, w, h);

        // 1. Parallax Background Layers with 200m smooth cross-fade & skybox lerp
        this.drawParallaxBackdrop(meterX, currentBiome, biomeBlend);

        // 2. World Coordinate Space
        ctx.save();
        ctx.translate(-this.camera.x, -this.camera.y);

        // Draw Tire Skid Marks on terrain
        if (vehicle.tireMarks && vehicle.tireMarks.length > 0) {
          ctx.save();
          for (const tm of vehicle.tireMarks) {
            const alpha = Math.min(0.65, (tm.life / tm.maxLife) * 0.65);
            ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
            ctx.beginPath();
            ctx.ellipse(tm.x, tm.y, 8, 3, tm.rot, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // Draw Terrain Surface and Soil with continuous road material blending
        this.drawTerrain(terrain, meterX, currentBiome, biomeBlend);

        // Draw Hazards (Puddles, Mud pits, Logs, Speed bumps)
        this.drawHazards(terrain);

        // Draw Collectibles (Jerrycans, Coins)
        this.drawCollectibles(terrain);

        // Draw the fictional Puspa Bangsa SD, SMP, and SMA school district.
        this.drawSchoolFinishGate(terrain.finishLinePx, terrain);

        // Draw Burnout Smoke Puffs from spinning wheels
        if (vehicle.burnoutSmoke && vehicle.burnoutSmoke.length > 0) {
          ctx.save();
          for (const sm of vehicle.burnoutSmoke) {
            const alpha = Math.min(0.65, (sm.life / sm.maxLife) * 0.65);
            ctx.fillStyle = `rgba(226, 232, 240, ${alpha})`;
            ctx.beginPath();
            ctx.arc(sm.x, sm.y, sm.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // Draw Vehicle Exhaust Puffs
        this.drawExhaustPuffs(vehicle.exhaustPuffs);

        // Draw Food Particles Ejected
        this.drawFoodParticles(vehicle.foodParticles);

        // Draw Floating Telolet Musical Notes
        this.drawTeloletNotes(vehicle.teloletNotes);

        // Draw Truck Vehicle (Chassis, Boks Tosca, Mang Ucup, Rims)
        this.drawVehicle(vehicle, inputs);

        // Draw Perfect Landing Floating Banner
        if (vehicle.perfectLandingTimer > 0) {
          ctx.save();
          const popAlpha = Math.min(1.0, vehicle.perfectLandingTimer / 0.4);
          ctx.globalAlpha = popAlpha;
          ctx.textAlign = 'center';
          ctx.font = 'bold 18px Fredoka One, sans-serif';
          ctx.strokeStyle = '#065f46';
          ctx.lineWidth = 4;
          ctx.strokeText('✨ PERFECT LANDING! 100% SHOCK ABSORPTION ✨', vehicle.x, vehicle.y - 70);
          ctx.fillStyle = '#34d399';
          ctx.fillText('✨ PERFECT LANDING! 100% SHOCK ABSORPTION ✨', vehicle.x, vehicle.y - 70);
          ctx.restore();
        }

        // Draw Flip Stunt Banner
        if (vehicle.stuntTimer > 0 && vehicle.stuntMessage) {
          ctx.save();
          const stuntAlpha = Math.min(1.0, vehicle.stuntTimer / 0.4);
          ctx.globalAlpha = stuntAlpha;
          ctx.textAlign = 'center';
          ctx.font = 'bold 20px Fredoka One, sans-serif';
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 4;
          ctx.strokeText(vehicle.stuntMessage, vehicle.x, vehicle.y - 95);
          ctx.fillStyle = '#fbbf24';
          ctx.fillText(vehicle.stuntMessage, vehicle.x, vehicle.y - 95);
          ctx.restore();
        }

        // Draw Victory Confetti
        if (gameState.state === 'VICTORY') {
          this.drawConfetti();
        }

        ctx.restore();

        // 3. Screen Overlay Effects (Sayur Lodeh Monitor Splatter on Rollover Crash)
        if (gameState.state === 'GAMEOVER' && gameState.reason === 'ROLLOVER') {
          this.drawLodehSplatter();
        }
      }

      drawLodehSplatter() {
        const ctx = this.ctx;
        if (this.splatters.length === 0) {
          for (let i = 0; i < 24; i++) {
            this.splatters.push({
              x: (0.08 + Math.random() * 0.84) * this.width,
              y: (0.08 + Math.random() * 0.84) * this.height,
              r: 16 + Math.random() * 36,
              drips: Math.floor(2 + Math.random() * 3),
              color: ['rgba(234, 179, 8, 0.75)', 'rgba(132, 204, 22, 0.7)', 'rgba(254, 240, 138, 0.8)', 'rgba(202, 138, 4, 0.8)'][i % 4]
            });
          }
        }

        ctx.save();
        for (const s of this.splatters) {
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();

          for (let d = 0; d < s.drips; d++) {
            const dx = s.x + (d - 1) * (s.r * 0.45);
            const dLen = s.r * (1.2 + d * 0.6);
            ctx.beginPath();
            ctx.moveTo(dx - 4, s.y);
            ctx.quadraticCurveTo(dx, s.y + dLen * 0.7, dx, s.y + dLen);
            ctx.quadraticCurveTo(dx, s.y + dLen * 0.7, dx + 4, s.y);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.arc(dx, s.y + dLen, 5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Floating tofu cubes in soup
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(s.x - 6, s.y - 6, 12, 12);
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(s.x - 6, s.y - 6, 12, 12);
        }

        ctx.fillStyle = '#fde047';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.font = 'bold 22px Fredoka One, sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeText('KUAH LODEH & SUSU AMBYAR! 🍲💥', this.width / 2, this.height * 0.28);
        ctx.fillText('KUAH LODEH & SUSU AMBYAR! 🍲💥', this.width / 2, this.height * 0.28);
        ctx.restore();
      }

      drawParallaxBackdrop(meterX, biome, blend) {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        // Dynamic Skybox Color Interpolation (RGBA Lerp) across 200m zone
        const skyPalettes = {
          1: { top: [6, 182, 212], mid: [103, 232, 249], bot: [254, 215, 170], midStop: 0.6 },  // 1: Pesisir Pantura (cyan-peach)
          2: { top: [14, 165, 233], mid: [125, 211, 252], bot: [253, 230, 138], midStop: 0.55 }, // 2: Jalur Arteri Pantura (azure-amber)
          3: { top: [56, 189, 248], mid: [186, 230, 253], bot: [254, 240, 138], midStop: 0.5 },  // 3: Lembah Sawah (golden-green)
          4: { top: [34, 197, 94], mid: [134, 239, 172], bot: [254, 249, 195], midStop: 0.65 },  // 4: Pedesaan Sawah (lush green)
          5: { top: [51, 65, 85], mid: [100, 116, 139], bot: [148, 163, 184], midStop: 0.6 },    // 5: Puncak Gn. Ciremai (slate mist)
          6: { top: [30, 58, 79], mid: [74, 107, 130], bot: [178, 190, 195], midStop: 0.55 },   // 6: Lereng Hutan Pinus (alpine fog)
          7: { top: [59, 130, 246], mid: [147, 197, 253], bot: [254, 205, 211], midStop: 0.6 },  // 7: Kawasan Pemukiman (morning pink)
          8: { top: [2, 132, 199], mid: [125, 211, 252], bot: [251, 207, 232], midStop: 0.7 }    // 8: Sekolah Puspa Bangsa (bright cyan-pink)
        };

        const lerpColor = (c1, c2, t) => {
          const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
          const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
          const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
          return `rgb(${r},${g},${b})`;
        };

        let topColor, midColor, botColor, midStop;
        if (blend && blend.inTransition && blend.toBiome) {
          const p1 = skyPalettes[blend.fromBiome.id] || skyPalettes[1];
          const p2 = skyPalettes[blend.toBiome.id] || skyPalettes[8] || skyPalettes[1];
          const t = blend.t;
          topColor = lerpColor(p1.top, p2.top, t);
          midColor = lerpColor(p1.mid, p2.mid, t);
          botColor = lerpColor(p1.bot, p2.bot, t);
          midStop = p1.midStop + (p2.midStop - p1.midStop) * t;
        } else {
          const p = skyPalettes[biome.id] || skyPalettes[1];
          topColor = `rgb(${p.top.join(',')})`;
          midColor = `rgb(${p.mid.join(',')})`;
          botColor = `rgb(${p.bot.join(',')})`;
          midStop = p.midStop;
        }

        const skyGradient = ctx.createLinearGradient(0, 0, 0, h);
        skyGradient.addColorStop(0, topColor);
        skyGradient.addColorStop(midStop, midColor);
        skyGradient.addColorStop(1, botColor);
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, w, h);

        // Distant Sun / Morning Glare
        ctx.save();
        ctx.fillStyle = 'rgba(255, 253, 231, 0.4)';
        ctx.beginPath();
        ctx.arc(w * 0.78, h * 0.22, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 249, 196, 0.15)';
        ctx.beginPath();
        ctx.arc(w * 0.78, h * 0.22, 110, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Layer 2: Distant Mountains / Sea Horizon (Parallax Alpha Cross-Fade)
        const scroll2 = this.camera.x * 0.08;
        if (blend && blend.inTransition && blend.toBiome) {
          ctx.save();
          ctx.globalAlpha = blend.alphaPrev;
          this.drawDistantParallaxLayer(blend.fromBiome.id, w, h, scroll2);
          ctx.restore();

          ctx.save();
          ctx.globalAlpha = blend.alphaNext;
          this.drawDistantParallaxLayer(blend.toBiome.id, w, h, scroll2);
          ctx.restore();
        } else {
          this.drawDistantParallaxLayer(biome.id, w, h, scroll2);
        }

        // Layer 3: Midground (Warteg, Terraces, Tea Hills, Suburban Houses - Alpha Cross-Fade)
        const scroll3 = this.camera.x * 0.25;
        if (blend && blend.inTransition && blend.toBiome) {
          ctx.save();
          ctx.globalAlpha = blend.alphaPrev;
          this.drawMidgroundParallaxLayer(blend.fromBiome.id, w, h, scroll3);
          ctx.restore();

          ctx.save();
          ctx.globalAlpha = blend.alphaNext;
          this.drawMidgroundParallaxLayer(blend.toBiome.id, w, h, scroll3);
          ctx.restore();
        } else {
          this.drawMidgroundParallaxLayer(biome.id, w, h, scroll3);
        }
      }

      drawDistantParallaxLayer(biomeId, w, h, scroll2) {
        const ctx = this.ctx;
        ctx.save();
        const distantMap = {
          1: 'biome1Distant',
          2: 'biome1Distant',
          3: 'biome2Distant',
          4: 'biome2Distant',
          5: 'biome3Distant',
          6: 'biome3Distant',
          7: 'biome4Distant',
          8: 'biome4Distant'
        };
        const distantKey = distantMap[biomeId] || `biome${biomeId}Distant`;
        if (this.drawTiledBackground(distantKey, w, h, scroll2, 0.12, 0.75) ||
            this.drawTiledBackground(`biome${biomeId}Distant`, w, h, scroll2, 0.12, 0.75)) {
          ctx.restore();
          return;
        }
        if (biomeId === 1 || biomeId === 2) {
          // Pantura Sea with Traditional Fishing Boats (Perahu Nelayan)
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(0, h * 0.48, w, h * 0.2);
          for (let i = 0; i < 4; i++) {
            const bx = ((i * 320 - scroll2) % w + w) % w;
            const by = h * 0.49 + (i % 2) * 8;
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + 18, by);
            ctx.lineTo(bx + 14, by + 5);
            ctx.lineTo(bx + 4, by + 5);
            ctx.closePath();
            ctx.fill();
            // Triangular sail
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.moveTo(bx + 8, by);
            ctx.lineTo(bx + 8, by - 14);
            ctx.lineTo(bx + 16, by - 3);
            ctx.closePath();
            ctx.fill();
          }
        } else if (biomeId === 3 || biomeId === 4) {
          // Hamparan Sawah green mountain horizon
          ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
          ctx.beginPath();
          ctx.moveTo(0, h * 0.65);
          for (let x = 0; x <= w + 40; x += 40) {
            const worldX = x + scroll2;
            const my = h * 0.46 + Math.sin(worldX * 0.0025) * 50 + Math.cos(worldX * 0.0012) * 35;
            ctx.lineTo(x, my);
          }
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.fill();
        } else if (biomeId === 5 || biomeId === 6) {
          // Silhouette of Mt. Ciremai in misty blue
          ctx.fillStyle = 'rgba(51, 65, 85, 0.45)';
          ctx.beginPath();
          ctx.moveTo(0, h * 0.65);
          for (let x = 0; x <= w + 40; x += 40) {
            const worldX = x + scroll2;
            const my = h * 0.42 + Math.sin(worldX * 0.003) * 60 + Math.cos(worldX * 0.001) * 45;
            ctx.lineTo(x, my);
          }
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.fill();
        } else {
          // Suburban skyline and school arrival horizon
          ctx.fillStyle = 'rgba(14, 116, 144, 0.35)';
          ctx.beginPath();
          ctx.moveTo(0, h * 0.65);
          for (let x = 0; x <= w + 40; x += 40) {
            const worldX = x + scroll2;
            const my = h * 0.44 + Math.sin(worldX * 0.002) * 40;
            ctx.lineTo(x, my);
          }
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      drawMidgroundParallaxLayer(biomeId, w, h, scroll3) {
        const ctx = this.ctx;
        ctx.save();
        // Midground artwork maps even biomes to their dedicated midground scenery
        const midMap = {
          2: 'biome1Midground',
          4: 'biome2Midground',
          6: 'biome3Midground',
          8: 'biome4Midground'
        };
        const midKey = midMap[biomeId];
        if (midKey && this.drawTiledBackground(midKey, w, h, scroll3, 0.12, 0.68)) {
          ctx.restore();
          return;
        }
        // Midground PNGs include a broad foreground band near their lower edge.
        // Keep that band above the physical terrain; the old 0.28/0.80 placement
        // put the beach/fields/buildings behind the terrain fill on most screens.
        if (this.drawTiledBackground(`biome${biomeId}Midground`, w, h, scroll3, 0.12, 0.68)) {
          ctx.restore();
          return;
        }
        if (biomeId === 1 || biomeId === 2) {
          // Coconut palms & Warteg Bahari roadside stalls
          for (let i = 0; i < 5; i++) {
            const px = ((i * 280 - scroll3) % w + w) % w;
            const py = h * 0.62;
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.quadraticCurveTo(px + 15, py - 40, px + 10, py - 90);
            ctx.stroke();

            ctx.fillStyle = '#15803d';
            for (let l = 0; l < 6; l++) {
              const la = (l * Math.PI) / 3;
              ctx.beginPath();
              ctx.ellipse(px + 10 + Math.cos(la) * 20, py - 90 + Math.sin(la) * 12, 22, 6, la, 0, Math.PI * 2);
              ctx.fill();
            }

            if (i % 2 === 0) {
              const wx = px + 60;
              ctx.fillStyle = '#38bdf8';
              ctx.fillRect(wx, py - 40, 50, 40);
              ctx.fillStyle = '#0284c7';
              ctx.beginPath();
              ctx.moveTo(wx - 5, py - 40);
              ctx.lineTo(wx + 55, py - 40);
              ctx.lineTo(wx + 50, py - 30);
              ctx.lineTo(wx - 10, py - 30);
              ctx.closePath();
              ctx.fill();
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 9px sans-serif';
              ctx.fillText('WARTEG', wx + 4, py - 18);
            }
          }
        } else if (biomeId === 3 || biomeId === 4) {
          // Lush terraced sawah layers & bamboo saung
          ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
          ctx.beginPath();
          ctx.moveTo(0, h * 0.72);
          for (let x = 0; x <= w + 30; x += 30) {
            const sx = x + scroll3;
            const sy = h * 0.58 + Math.sin(sx * 0.007) * 35;
            ctx.lineTo(x, sy);
          }
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.fill();
        } else if (biomeId === 5 || biomeId === 6) {
          // Rolling tea plantation hills with pine trees
          ctx.fillStyle = 'rgba(21, 128, 61, 0.5)';
          ctx.beginPath();
          ctx.moveTo(0, h * 0.72);
          for (let x = 0; x <= w + 40; x += 40) {
            const tx = x + scroll3;
            const ty = h * 0.55 + Math.sin(tx * 0.009) * 45;
            ctx.lineTo(x, ty);
          }
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.fill();
        } else {
          // Indonesian Suburban Houses & Umbul-Umbul (Red-White Banners)
          for (let i = 0; i < 6; i++) {
            const hx = ((i * 220 - scroll3) % w + w) % w;
            const hy = h * 0.65;
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(hx, hy - 35, 45, 35);
            ctx.fillStyle = '#b91c1c';
            ctx.beginPath();
            ctx.moveTo(hx - 6, hy - 35);
            ctx.lineTo(hx + 22, hy - 55);
            ctx.lineTo(hx + 51, hy - 35);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(hx + 55, hy);
            ctx.lineTo(hx + 55, hy - 60);
            ctx.stroke();

            ctx.fillStyle = '#dc2626';
            ctx.fillRect(hx + 55, hy - 58, 16, 8);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(hx + 55, hy - 50, 16, 8);
          }
        }
        ctx.restore();
      }

      drawTerrain(terrain, meterX, biome, blend) {
        const ctx = this.ctx;
        const startX = this.camera.x - 50;
        const endX = this.camera.x + this.width + 50;
        const step = 8;

        // Road & Surface Material Blending (200m smooth transition)
        const terrainPalettes = {
          1: { surface: [30, 41, 59], subsoil: [15, 23, 42], dashAlpha: 1.0 },   // 1: Pesisir Pantura asphalt
          2: { surface: [40, 50, 68], subsoil: [20, 28, 45], dashAlpha: 1.0 },   // 2: Jalur Arteri highway asphalt
          3: { surface: [77, 124, 15], subsoil: [113, 63, 18], dashAlpha: 0.0 }, // 3: Lembah Sawah earthen bunds
          4: { surface: [65, 105, 20], subsoil: [85, 45, 12], dashAlpha: 0.0 },  // 4: Pedesaan Sawah packed mud/soil
          5: { surface: [120, 53, 15], subsoil: [69, 26, 3], dashAlpha: 0.0 },   // 5: Puncak Gunung rock/gravel
          6: { surface: [92, 64, 40], subsoil: [50, 30, 15], dashAlpha: 0.0 },   // 6: Lereng Pinus pine loam
          7: { surface: [71, 85, 105], subsoil: [30, 41, 59], dashAlpha: 0.8 },  // 7: Pemukiman asphalt & curb
          8: { surface: [51, 65, 85], subsoil: [30, 41, 59], dashAlpha: 1.0 }    // 8: Sekolah Puspa Bangsa pavement
        };

        const lerpColor = (c1, c2, t) => {
          const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
          const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
          const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
          return `rgb(${r},${g},${b})`;
        };

        let surfaceColor, subsoilColor, dashAlpha;
        if (blend && blend.inTransition && blend.toBiome) {
          const pal1 = terrainPalettes[blend.fromBiome.id] || terrainPalettes[1];
          const pal2 = terrainPalettes[blend.toBiome.id] || terrainPalettes[8] || terrainPalettes[1];
          surfaceColor = lerpColor(pal1.surface, pal2.surface, blend.t);
          subsoilColor = lerpColor(pal1.subsoil, pal2.subsoil, blend.t);
          dashAlpha = pal1.dashAlpha * blend.alphaPrev + pal2.dashAlpha * blend.alphaNext;
        } else {
          const pal = terrainPalettes[biome.id] || terrainPalettes[1];
          surfaceColor = `rgb(${pal.surface.join(',')})`;
          subsoilColor = `rgb(${pal.subsoil.join(',')})`;
          dashAlpha = pal.dashAlpha;
        }

        // Draw Subsoil Deep Polygon
        ctx.fillStyle = subsoilColor;
        ctx.beginPath();
        ctx.moveTo(startX, this.height + this.camera.y + 200);
        for (let x = startX; x <= endX; x += step) {
          ctx.lineTo(x, terrain.getHeight(x));
        }
        ctx.lineTo(endX, this.height + this.camera.y + 200);
        ctx.closePath();
        ctx.fill();

        // Draw Surface Road / Topsoil Ribbon
        ctx.strokeStyle = surfaceColor;
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        for (let x = startX; x <= endX; x += step) {
          const gy = terrain.getHeight(x);
          if (x === startX) ctx.moveTo(x, gy);
          else ctx.lineTo(x, gy);
        }
        ctx.stroke();

        // Road Center Dashed Line (smooth alpha transition)
        if (dashAlpha > 0.02) {
          ctx.save();
          ctx.globalAlpha = dashAlpha;
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([16, 16]);
          ctx.beginPath();
          for (let x = startX; x <= endX; x += step) {
            const gy = terrain.getHeight(x);
            if (x === startX) ctx.moveTo(x, gy + 1);
            else ctx.lineTo(x, gy + 1);
          }
          ctx.stroke();
          ctx.restore();
        }
      }

      drawHazards(terrain) {
        const ctx = this.ctx;

        // 1. Water Puddles (Rob Pantura)
        for (const p of terrain.puddles) {
          const pxStart = p.start * PHYSICS_CONSTANTS.METER_SCALE;
          const pxEnd = p.end * PHYSICS_CONSTANTS.METER_SCALE;
          if (pxEnd < this.camera.x - 100 || pxStart > this.camera.x + this.width + 100) continue;

          // Water must rise above the terrain fill; the old +4/-2px band sat
          // entirely inside the soil and looked like an invisible hitbox.
          ctx.fillStyle = 'rgba(14, 165, 233, 0.9)';
          ctx.beginPath();
          ctx.moveTo(pxStart, terrain.getHeight(pxStart) - 7);
          for (let x = pxStart; x <= pxEnd; x += 6) {
            const ripple = Math.sin(x * 0.035) * 1.5;
            ctx.lineTo(x, terrain.getHeight(x) - 7 + ripple);
          }
          for (let x = pxEnd; x >= pxStart; x -= 6) {
            ctx.lineTo(x, terrain.getHeight(x) + 7);
          }
          ctx.closePath();
          ctx.fill();

          // High contrast surface edge keeps the slippery area readable on blue soil.
          ctx.strokeStyle = 'rgba(224, 242, 254, 0.95)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(pxStart + 10, terrain.getHeight(pxStart + 10) - 7);
          for (let x = pxStart + 16; x < pxEnd - 8; x += 20) {
            ctx.lineTo(x, terrain.getHeight(x) - 7 + Math.sin(x * 0.035) * 1.5);
          }
          ctx.lineTo(pxEnd - 8, terrain.getHeight(pxEnd - 8) - 7);
          ctx.stroke();
        }

        // 2. Mud Pits (Sawah)
        for (const m of terrain.mudPits) {
          const mxStart = m.start * PHYSICS_CONSTANTS.METER_SCALE;
          const mxEnd = m.end * PHYSICS_CONSTANTS.METER_SCALE;
          if (mxEnd < this.camera.x - 100 || mxStart > this.camera.x + this.width + 100) continue;

          // Mud also needs a visible lip above the ground surface. The previous
          // polygon was fully buried inside the already-filled terrain.
          ctx.fillStyle = '#3b2417';
          ctx.beginPath();
          ctx.moveTo(mxStart, terrain.getHeight(mxStart) - 5);
          for (let x = mxStart; x <= mxEnd; x += 6) {
            ctx.lineTo(x, terrain.getHeight(x) - 5);
          }
          for (let x = mxEnd; x >= mxStart; x -= 6) {
            ctx.lineTo(x, terrain.getHeight(x) + 10);
          }
          ctx.closePath();
          ctx.fill();

          // Sludge droplets along edge
          ctx.fillStyle = '#a16207';
          for (let x = mxStart + 12; x < mxEnd; x += 30) {
            ctx.beginPath();
            ctx.ellipse(x, terrain.getHeight(x) - 2, 6, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 3. Wooden Logs (Mountain)
        for (const log of terrain.logs) {
          const logPxX = log.x * PHYSICS_CONSTANTS.METER_SCALE;
          if (logPxX < this.camera.x - 100 || logPxX > this.camera.x + this.width + 100) continue;
          const groundY = terrain.getHeight(logPxX);

          ctx.save();
          ctx.translate(logPxX, groundY);

          if (this.assets && this.assets.obstacleLog.loaded) {
            // The uploaded log is a wide sprite with transparent padding. Draw
            // it wide enough to match its circular collision footprint.
            ctx.drawImage(this.assets.obstacleLog.img, -36, -27, 72, 30);
          } else {
            // Procedural fallback has the same wide, raised silhouette.
            ctx.fillStyle = '#854d0e';
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(-27, -16, 54, 15, 7);
            ctx.fill();
            ctx.stroke();

            // Visible cut ends, grain, and moss make the collision readable.
            ctx.fillStyle = '#d6a66b';
            ctx.beginPath();
            ctx.ellipse(-25, -8.5, 3.2, 7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#f3d3a1';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(-25, -8.5, 1.5, 4.5, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = '#5b3214';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(-18, -11); ctx.lineTo(19, -11);
            ctx.moveTo(-12, -6); ctx.lineTo(22, -6);
            ctx.stroke();

            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.ellipse(-9, -14, 6, 2, -0.15, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // 4. Speed Bumps (Suburb)
        for (const sb of terrain.speedBumps) {
          const sbPxX = sb * PHYSICS_CONSTANTS.METER_SCALE;
          // getHeight() shapes each bump across +/-1.2m (24px) with a 10px crest.
          // Paint that same sampled surface so the visible obstacle cannot drift
          // away from its collision/ride profile when physics is tuned later.
          const halfWidth = 1.2 * PHYSICS_CONSTANTS.METER_SCALE;
          if (sbPxX + halfWidth < this.camera.x - 8 || sbPxX - halfWidth > this.camera.x + this.width + 8) continue;
          ctx.save();
          ctx.lineCap = 'butt';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 8;
          ctx.beginPath();
          for (let x = sbPxX - halfWidth; x <= sbPxX + halfWidth; x += 2) {
            const y = terrain.getHeight(x);
            if (x === sbPxX - halfWidth) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Three short transverse marks make the raised strip read as a
          // traffic-calming bump while remaining aligned to the local slope.
          ctx.strokeStyle = 'rgba(255,255,255,0.9)';
          ctx.lineWidth = 2;
          for (const offset of [-12, 0, 12]) {
            const x = sbPxX + offset;
            const y = terrain.getHeight(x);
            ctx.beginPath();
            ctx.moveTo(x - 2, y - 3);
            ctx.lineTo(x + 2, y + 3);
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      drawCollectibles(terrain) {
        const ctx = this.ctx;
        const now = Date.now() * 0.004;

        // Jerrycans
        for (const can of terrain.fuelCans) {
          if (can.collected) continue;
          const canPxX = can.x * PHYSICS_CONSTANTS.METER_SCALE;
          if (canPxX < this.camera.x - 60 || canPxX > this.camera.x + this.width + 60) continue;
          const canPxY = terrain.getHeight(canPxX) - 28 + Math.sin(now + can.x) * 4;

          ctx.save();
          ctx.translate(canPxX, canPxY);

          // Glowing aura
          ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
          ctx.beginPath();
          ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.fill();

          if (this.assets && this.assets.fuelCan.loaded) {
            ctx.drawImage(this.assets.fuelCan.img, -12, -14, 24, 28);
          } else {
            // Red Jerrycan canister
            ctx.fillStyle = '#dc2626';
            ctx.strokeStyle = '#991b1b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(-10, -12, 20, 24, 4);
            ctx.fill();
            ctx.stroke();

            // Handle & Cap
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-6, -17, 12, 5);
            ctx.fillRect(4, -18, 5, 4);

            // Text "BENSIN"
            ctx.fillStyle = '#fde047';
            ctx.font = 'bold 6px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('BENSIN', 0, 4);
          }
          ctx.restore();
        }

        // Coins
        for (const coin of terrain.coins) {
          if (coin.collected) continue;
          const coinPxX = coin.x * PHYSICS_CONSTANTS.METER_SCALE;
          if (coinPxX < this.camera.x - 40 || coinPxX > this.camera.x + this.width + 40) continue;
          const coinPxY = terrain.getHeight(coinPxX) - 30 + Math.sin(now * 1.5 + coin.x) * 3;

          const wobble = Math.abs(Math.cos(now * 1.8 + coin.x));
          ctx.save();
          ctx.translate(coinPxX, coinPxY);
          ctx.scale(Math.max(0.15, wobble), 1);

          if (this.assets && this.assets.coinGizi.loaded) {
            ctx.drawImage(this.assets.coinGizi.img, -11, -11, 22, 22);
          } else {
            // Gold coin
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 11, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Embossed letter "G" for Gizi
            ctx.fillStyle = '#78350f';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('G', 0, 0);
          }
          ctx.restore();
        }
      }

      drawSchoolFinishGate(finishPx, terrain) {
        const ctx = this.ctx;
        if (finishPx < this.camera.x - 200 || finishPx > this.camera.x + this.width + 400) return;

        const groundY = terrain ? terrain.getHeight(finishPx) : 420;

        if (this.assets && this.assets.finishGate && this.assets.finishGate.loaded) {
          ctx.save();
          ctx.translate(finishPx, groundY);
          ctx.drawImage(this.assets.finishGate.img, -50, -200, 520, 200);
          ctx.restore();
          return;
        }

        ctx.save();
        ctx.translate(finishPx, groundY);

        // 1. Fictional separate buildings for elementary, middle, and high school.
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 4;
        ctx.fillRect(20, -155, 105, 155);
        ctx.strokeRect(20, -155, 105, 155);
        ctx.fillRect(145, -220, 135, 220);
        ctx.strokeRect(145, -220, 135, 220);
        ctx.fillRect(300, -175, 105, 175);
        ctx.strokeRect(300, -175, 105, 175);

        // Windows and concise, exact school-level labels.
        ctx.fillStyle = '#38bdf8';
        for (const school of [{ x: 38, top: -125, count: 2 }, { x: 165, top: -190, count: 3 }, { x: 318, top: -145, count: 2 }]) {
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < school.count; col++) {
              ctx.fillRect(school.x + col * 38, school.top + row * 45, 25, 28);
            }
          }
        }

        // Neutral signs identify the three fictional school levels.
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 3;
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        for (const school of [{ x: 72, y: -178, label: 'SD' }, { x: 212, y: -243, label: 'SMP' }, { x: 352, y: -198, label: 'SMA' }]) {
          ctx.fillStyle = '#facc15';
          ctx.fillRect(school.x - 30, school.y - 17, 60, 24);
          ctx.strokeRect(school.x - 30, school.y - 17, 60, 24);
          ctx.fillStyle = '#0f172a';
          ctx.fillText(school.label, school.x, school.y);
        }

        // 2. Maroon Welcome Archway
        ctx.fillStyle = '#881337';
        ctx.fillRect(-20, -140, 24, 140);
        ctx.fillRect(140, -140, 24, 140);
        ctx.fillRect(-25, -150, 194, 28);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('SELAMAT DATANG', 72, -132);

        // 3. Checkered Finish Line Arch
        const checkWidth = 14;
        for (let i = 0; i < 10; i++) {
          ctx.fillStyle = (i % 2 === 0) ? '#ffffff' : '#000000';
          ctx.fillRect(0, -120 + i * 12, 12, 12);
        }

        // 4. Cheering Indonesian Students holding spoons & bowls
        for (let s = 0; s < 4; s++) {
          const sx = 20 + s * 30;
          const sy = 0;
          // Uniform: White top, red shorts/skirt
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(sx - 5, sy - 38, 10, 18);
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(sx - 6, sy - 20, 12, 14);
          // Head
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.arc(sx, sy - 44, 7, 0, Math.PI * 2);
          ctx.fill();
          // Raised Spoon & Bowl
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sx + 5, sy - 34);
          ctx.lineTo(sx + 10, sy - 52);
          ctx.stroke();
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(sx + 10, sy - 52, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      drawVehicle(vehicle, inputs) {
        const ctx = this.ctx;
        const cosA = Math.cos(vehicle.angle);
        const sinA = Math.sin(vehicle.angle);

        // 1. Calculate world positions of chassis suspension mounting points
        const rmx = vehicle.x + (vehicle.rearMountOffset.x * cosA - vehicle.rearMountOffset.y * sinA);
        const rmy = vehicle.y + (vehicle.rearMountOffset.x * sinA + vehicle.rearMountOffset.y * cosA);
        const fmx = vehicle.x + (vehicle.frontMountOffset.x * cosA - vehicle.frontMountOffset.y * sinA);
        const fmy = vehicle.y + (vehicle.frontMountOffset.x * sinA + vehicle.frontMountOffset.y * cosA);

        // 2. Draw Visible Mechanical Suspension Struts, Springs & Axle Linkages (WORLD SPACE)
        this.drawSuspensionStrut(rmx, rmy, vehicle.rearWheel.x, vehicle.rearWheel.y);
        this.drawSuspensionStrut(fmx, fmy, vehicle.frontWheel.x, vehicle.frontWheel.y);

        // 3. Draw Chassis & Cargo Box (LOCAL CHASSIS SPACE)
        ctx.save();
        ctx.translate(vehicle.x, vehicle.y);
        ctx.rotate(vehicle.angle);

        const skin = this.selectedSkin || 'standard';
        if (skin === 'speedy') {
          this.drawSpeedyCourierSkin(ctx);
        } else if (skin === 'mountain') {
          this.drawMountainExplorerSkin(ctx);
        } else if (skin === 'retro') {
          this.drawRetroOpletSkin(ctx);
        } else if (skin === 'sport') {
          this.drawSportDeliverySkin(ctx);
        } else {
          if (this.assets && this.assets.truckBody.loaded) {
            ctx.drawImage(this.assets.truckBody.img, -50, -45, 100, 50);
          } else {
            this.drawStandardTruckBody(ctx);
          }
        }

        ctx.restore();

        // 4. Draw Wheel Rims & Knobby Tires (WORLD SPACE)
        this.drawWheel(vehicle.rearWheel);
        this.drawWheel(vehicle.frontWheel);
      }

      drawSuspensionStrut(mx, my, wx, wy, targetCtx = null) {
        const ctx = targetCtx || this.ctx;
        const dx = wx - mx;
        const dy = wy - my;
        const dist = Math.max(6, Math.sqrt(dx * dx + dy * dy));
        const angle = Math.atan2(dy, dx);

        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(angle);

        // A. Heavy-duty chassis mounting bracket at (0, 0)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-6, -7, 12, 14);
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        // B. Trailing suspension control arm / wishbone linkage
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(dist, 0);
        ctx.stroke();

        // C. Polished Chrome Piston Rod
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(dist * 0.25, 0);
        ctx.lineTo(dist, 0);
        ctx.stroke();

        // Specular chrome highlight
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(dist * 0.25, -0.8);
        ctx.lineTo(dist, -0.8);
        ctx.stroke();

        // D. Hydraulic Damper Body (Upper section)
        const damperLen = Math.max(3, dist * 0.42);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(damperLen, 0);
        ctx.stroke();

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(damperLen, 0);
        ctx.stroke();

        // E. 3D Metallic Coil Spring wrapped around strut
        const coilStart = Math.min(2, dist * 0.1);
        const coilEnd = Math.max(coilStart + 4, dist - 2);
        const coilSpan = coilEnd - coilStart;
        const coils = 5;
        const pitch = coilSpan / coils;
        const coilHalfH = Math.min(5.5, Math.max(3.5, dist * 0.28 + 1));

        // Back coil loops (dark shadow)
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3.0;
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (let i = 0; i < coils; i++) {
          const sx = coilStart + i * pitch;
          ctx.moveTo(sx, coilHalfH);
          ctx.lineTo(sx + pitch * 0.5, -coilHalfH);
        }
        ctx.stroke();

        // Front coil loops (bright metallic steel)
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let i = 0; i < coils; i++) {
          const sx = coilStart + i * pitch;
          ctx.moveTo(sx + pitch * 0.5, -coilHalfH);
          ctx.lineTo(sx + pitch, coilHalfH);
        }
        ctx.stroke();

        // Front coil specular gleam
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i < coils; i++) {
          const sx = coilStart + i * pitch;
          ctx.moveTo(sx + pitch * 0.6, -coilHalfH * 0.6);
          ctx.lineTo(sx + pitch * 0.9, coilHalfH * 0.6);
        }
        ctx.stroke();

        // F. Lower wheel knuckle & axle hub collar at (dist, 0)
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(dist, 0, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(dist, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      drawCoilSpring(mountX, mountY, wheel, vx, vy, vAngle) {
        const cosA = Math.cos(vAngle);
        const sinA = Math.sin(vAngle);
        const worldMx = vx + (mountX * cosA - mountY * sinA);
        const worldMy = vy + (mountX * sinA + mountY * cosA);
        this.drawSuspensionStrut(worldMx, worldMy, wheel.x, wheel.y);
      }

      drawWheel(wheel, targetCtx = null) {
        const ctx = targetCtx || this.ctx;
        ctx.save();
        ctx.translate(wheel.x, wheel.y);
        ctx.rotate(wheel.rotation);

        const r = 18;
        const rim = this.selectedRim || 'standard';

        if (rim === 'gold') {
          this.drawGoldRacingRim(ctx, r);
        } else if (rim === 'beadlock') {
          this.drawBeadlockRim(ctx, r);
        } else if (rim === 'whitewall') {
          this.drawWhiteWallRim(ctx, r);
        } else {
          if (this.assets && this.assets.truckWheel.loaded) {
            ctx.drawImage(this.assets.truckWheel.img, -r, -r, r * 2, r * 2);
          } else {
            this.drawStandardRim(ctx, r);
          }
        }

        ctx.restore();
      }

      drawStandardRim(ctx, r) {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        for (let t = 0; t < 8; t++) {
          const ta = (t * Math.PI) / 4;
          ctx.fillRect(Math.cos(ta) * (r - 2) - 2, Math.sin(ta) * (r - 2) - 2, 4, 4);
        }

        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e2e8f0';
        for (let n = 0; n < 5; n++) {
          const na = (n * Math.PI * 2) / 5;
          ctx.fillRect(Math.cos(na) * 6 - 1, Math.sin(na) * 6 - 1, 2.5, 2.5);
        }
      }

      drawGoldRacingRim(ctx, r) {
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        for (let i = 0; i < 5; i++) {
          const a = (i * Math.PI * 2) / 5;
          ctx.save();
          ctx.rotate(a);
          ctx.fillRect(-2, 0, 4, r * 0.7);
          ctx.restore();
        }

        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      drawBeadlockRim(ctx, r) {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        for (let t = 0; t < 10; t++) {
          const ta = (t * Math.PI * 2) / 10;
          ctx.fillRect(Math.cos(ta) * (r - 2) - 2.5, Math.sin(ta) * (r - 2) - 2.5, 5, 5);
        }

        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        for (let b = 0; b < 8; b++) {
          const ba = (b * Math.PI * 2) / 8;
          ctx.fillRect(Math.cos(ba) * (r * 0.65) - 1, Math.sin(ba) * (r * 0.65) - 1, 2, 2);
        }

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      drawWhiteWallRim(ctx, r) {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.58, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(-2, -2, r * 0.35, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      drawStandardTruckBody(ctx) {
        const blueGrad = ctx.createLinearGradient(-48, -45, 10, 15);
        blueGrad.addColorStop(0, '#58b7f2');
        blueGrad.addColorStop(1, '#1769c2');

        ctx.fillStyle = blueGrad;
        ctx.strokeStyle = '#0d2b52';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-48, -40, 60, 48, [6, 2, 2, 6]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-48, -40, 60, 4);
        ctx.fillRect(-48, 4, 60, 4);
        ctx.fillRect(-48, -40, 4, 48);

        ctx.save();
        ctx.translate(-18, -16);
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(0, -2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-1, -8, 3, 4);
        ctx.restore();

        ctx.fillStyle = '#0d2b52';
        ctx.font = 'bold 5.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SATUAN GIZI', -18, 2);

        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(12, -40);
        ctx.lineTo(26, -40);
        ctx.lineTo(44, -18);
        ctx.lineTo(48, 8);
        ctx.lineTo(12, 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(38, 6, 12, 5);

        ctx.fillStyle = '#fef08a';
        ctx.fillRect(45, -12, 4, 8);

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(15, -37);
        ctx.lineTo(25, -37);
        ctx.lineTo(39, -20);
        ctx.lineTo(15, -20);
        ctx.closePath();
        ctx.fill();

        ctx.save();
        ctx.translate(22, -26);
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(0, -3, 6, Math.PI, Math.PI * 2);
        ctx.lineTo(4, -3);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(1, 1, 4, 2);
        ctx.restore();

        const sirenColor = (Date.now() % 300 < 150) ? '#f59e0b' : '#38bdf8';
        ctx.fillStyle = sirenColor;
        ctx.fillRect(-2, -45, 10, 5);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-48, 8, 4, 12);
        ctx.fillStyle = '#ffffff';
        ctx.font = '3.5px sans-serif';
        ctx.fillText('SABAR', -46, 14);

        ctx.fillStyle = '#64748b';
        ctx.fillRect(-47, 2, 4, 5);

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-48, 6, 96, 5);
        ctx.fillStyle = '#334155';
        ctx.fillRect(-48, 7, 96, 1.5);

        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.arc(-30, 8, 14, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(30, 8, 14, Math.PI, 0);
        ctx.fill();

        ctx.fillStyle = '#475569';
        ctx.fillRect(-12, 7, 24, 6);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-11, 8, 22, 2);
      }

      drawSpeedyCourierSkin(ctx) {
        const grad = ctx.createLinearGradient(-48, -40, 10, 15);
        grad.addColorStop(0, '#0284c7');
        grad.addColorStop(1, '#1e40af');

        ctx.fillStyle = '#fef08a';
        ctx.strokeStyle = '#0d2b52';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-48, -25, 54, 30, [4, 2, 2, 4]);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-40, -25); ctx.lineTo(-40, 5);
        ctx.moveTo(-24, -25); ctx.lineTo(-24, 5);
        ctx.moveTo(-8, -25); ctx.lineTo(-8, 5);
        ctx.stroke();

        ctx.fillStyle = grad;
        ctx.strokeStyle = '#0d2b52';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(6, -25);
        ctx.lineTo(16, -38);
        ctx.lineTo(34, -38);
        ctx.lineTo(48, -12);
        ctx.lineTo(48, 8);
        ctx.lineTo(6, 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(18, -35);
        ctx.lineTo(32, -35);
        ctx.lineTo(44, -14);
        ctx.lineTo(18, -14);
        ctx.closePath();
        ctx.fill();

        ctx.save();
        ctx.translate(24, -22);
        ctx.fillStyle = '#f4b28c';
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1d4ed8';
        ctx.fillRect(-3, 4, 7, 5);
        ctx.restore();

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(8, -42, 26, 3.5);
        ctx.fillStyle = '#0d2b52';
        ctx.fillRect(10, -39, 4, 3);
        ctx.fillRect(28, -39, 4, 3);

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-44, -6);
        ctx.lineTo(10, -6);
        ctx.lineTo(32, -18);
        ctx.stroke();

        ctx.fillStyle = '#a5f3fc';
        ctx.fillRect(45, -8, 4, 6);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(38, 6, 12, 4);

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-48, 6, 96, 4);

        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.arc(-30, 8, 14, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(30, 8, 14, Math.PI, 0);
        ctx.fill();
      }

      drawMountainExplorerSkin(ctx) {
        ctx.fillStyle = '#1e3a5f';
        ctx.strokeStyle = '#0d2b52';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-48, -40, 58, 46, [4, 4, 2, 2]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.fillRect(-48, -2, 58, 8);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        for (let x = -44; x < 6; x += 6) {
          ctx.beginPath();
          ctx.moveTo(x, -1); ctx.lineTo(x + 3, 5);
          ctx.stroke();
        }

        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-46, -46, 54, 6);

        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-38, -52, 10, 8);
        ctx.fillRect(-24, -52, 10, 8);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(-35, -54, 4, 2.5);
        ctx.fillRect(-21, -54, 4, 2.5);

        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#0d2b52';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(10, -40);
        ctx.lineTo(24, -40);
        ctx.lineTo(42, -18);
        ctx.lineTo(46, 8);
        ctx.lineTo(10, 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(14, -36);
        ctx.lineTo(22, -36);
        ctx.lineTo(37, -19);
        ctx.lineTo(14, -19);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(44, 7);
        ctx.lineTo(50, -4);
        ctx.lineTo(42, -10);
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(48, -3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-48, 6, 96, 5);

        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.arc(-30, 8, 14, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(30, 8, 14, Math.PI, 0);
        ctx.fill();
      }

      drawRetroOpletSkin(ctx) {
        ctx.fillStyle = '#fef3c7';
        ctx.strokeStyle = '#0d2b52';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-48, -40, 58, 22, [8, 4, 0, 0]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.roundRect(-48, -18, 58, 24, [0, 0, 4, 4]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#92400e';
        ctx.fillRect(-46, -14, 54, 4);
        ctx.fillRect(-46, -8, 54, 4);
        ctx.fillRect(-46, -2, 54, 4);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(-46, -13, 54, 1.5);
        ctx.fillRect(-46, -7, 54, 1.5);

        ctx.fillStyle = '#fef3c7';
        ctx.strokeStyle = '#0d2b52';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(10, -38);
        ctx.quadraticCurveTo(24, -40, 30, -32);
        ctx.lineTo(46, -14);
        ctx.quadraticCurveTo(48, 0, 46, 8);
        ctx.lineTo(10, 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(14, -34, 12, 16);
        ctx.fillRect(28, -34, 12, 16);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(14, -34, 12, 16);
        ctx.strokeRect(28, -34, 12, 16);

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(46, -4, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(12, -26, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(-20, -29, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-48, 6, 96, 5);

        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.arc(-30, 8, 14, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(30, 8, 14, Math.PI, 0);
        ctx.fill();
      }

      drawSportDeliverySkin(ctx) {
        const grad = ctx.createLinearGradient(-48, -42, 48, 8);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(0.5, '#1e40af');
        grad.addColorStop(1, '#0284c7');

        ctx.fillStyle = grad;
        ctx.strokeStyle = '#0d2b52';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-48, -40, 58, 46, [6, 2, 2, 6]);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(-48, -40, 58, 46, [6, 2, 2, 6]);
        ctx.clip();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-32, -40); ctx.lineTo(-18, -40); ctx.lineTo(-28, 8); ctx.lineTo(-42, 8);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.moveTo(-15, -40); ctx.lineTo(-9, -40); ctx.lineTo(-19, 8); ctx.lineTo(-25, 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold italic 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('77', 0, -14);
        ctx.restore();

        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(10, -38);
        ctx.lineTo(24, -38);
        ctx.lineTo(44, -16);
        ctx.lineTo(48, 6);
        ctx.lineTo(10, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0284c7';
        ctx.fillRect(36, 6, 14, 5);

        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-48, -45, 18, 4);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-46, -41, 4, 3);
        ctx.fillRect(-34, -41, 4, 3);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-48, 6, 96, 4);

        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.arc(-30, 8, 14, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(30, 8, 14, Math.PI, 0);
        ctx.fill();
      }

      renderGaragePreview(canvas, skin = this.selectedSkin, rim = this.selectedRim) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.save();
        ctx.clearRect(0, 0, w, h);

        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#090d16');
        bgGrad.addColorStop(0.68, '#1e293b');
        bgGrad.addColorStop(1, '#090d16');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        const floorY = 86;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, floorY);
        ctx.lineTo(w, floorY);
        for (let x = 10; x < w; x += 35) {
          ctx.moveTo(x, floorY);
          ctx.lineTo(x - 25, h);
        }
        ctx.stroke();

        const spotGrad = ctx.createRadialGradient(w / 2, 25, 10, w / 2, 60, 80);
        spotGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
        spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = spotGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.ellipse(w / 2, floorY, 62, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        const cx = w / 2;
        const cy = 48;

        this.drawSuspensionStrut(cx - 30, cy, cx - 30, floorY - 10, ctx);
        this.drawSuspensionStrut(cx + 30, cy, cx + 30, floorY - 10, ctx);

        ctx.save();
        ctx.translate(cx, cy);
        if (skin === 'speedy') {
          this.drawSpeedyCourierSkin(ctx);
        } else if (skin === 'mountain') {
          this.drawMountainExplorerSkin(ctx);
        } else if (skin === 'retro') {
          this.drawRetroOpletSkin(ctx);
        } else if (skin === 'sport') {
          this.drawSportDeliverySkin(ctx);
        } else {
          if (this.assets && this.assets.truckBody.loaded) {
            ctx.drawImage(this.assets.truckBody.img, -50, -45, 100, 50);
          } else {
            this.drawStandardTruckBody(ctx);
          }
        }
        ctx.restore();

        const dummyRear = { x: cx - 30, y: floorY - 10, rotation: 0 };
        const dummyFront = { x: cx + 30, y: floorY - 10, rotation: 0 };
        const oldRim = this.selectedRim;
        this.selectedRim = rim;
        this.drawWheel(dummyRear, ctx);
        this.drawWheel(dummyFront, ctx);
        this.selectedRim = oldRim;

        ctx.restore();
      }

      drawExhaustPuffs(puffs) {
        const ctx = this.ctx;
        for (const ep of puffs) {
          const alpha = Math.max(0, ep.life / ep.maxLife);
          ctx.fillStyle = `rgba(100, 116, 139, ${alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(ep.x, ep.y, ep.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      drawFoodParticles(particles) {
        const ctx = this.ctx;
        for (const p of particles) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);

          if (p.type === 'tofu') {
            // Golden Tahu Pong Cube
            ctx.fillStyle = '#fde047';
            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 1.5;
            ctx.fillRect(-5, -5, 10, 10);
            ctx.strokeRect(-5, -5, 10, 10);
          } else if (p.type === 'tempe') {
            // Textured Tempe Orek
            ctx.fillStyle = '#78350f';
            ctx.fillRect(-7, -4, 14, 8);
            ctx.fillStyle = '#d97706';
            ctx.fillRect(-4, -2, 4, 3);
          } else if (p.type === 'milk') {
            // Mint-White Milk Carton
            ctx.fillStyle = '#f8fafc';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1;
            ctx.fillRect(-4, -6, 8, 12);
            ctx.strokeRect(-4, -6, 8, 12);
          } else if (p.type === 'serundeng') {
            // Golden Serundeng Flake
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Sayur Lodeh Droplet
            ctx.fillStyle = '#84cc16';
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      drawTeloletNotes(notes) {
        const ctx = this.ctx;
        ctx.font = 'bold 18px sans-serif';
        for (const tn of notes) {
          ctx.fillStyle = tn.color;
          ctx.fillText(tn.char, tn.x, tn.y);
        }
      }

      drawConfetti() {
        const ctx = this.ctx;
        if (this.confetti.length < 80) {
          const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#4ade80', '#c084fc'];
          for (let i = 0; i < 80; i++) {
            this.confetti.push({
              x: this.camera.x + Math.random() * this.width,
              y: this.camera.y - Math.random() * 200,
              vx: (Math.random() - 0.5) * 80,
              vy: 120 + Math.random() * 140,
              rot: Math.random() * Math.PI * 2,
              vrot: (Math.random() - 0.5) * 8,
              color: colors[Math.floor(Math.random() * colors.length)],
              w: 7 + Math.random() * 6,
              h: 4 + Math.random() * 4
            });
          }
        }

        for (const c of this.confetti) {
          c.x += c.vx * 0.016;
          c.y += c.vy * 0.016;
          c.rot += c.vrot * 0.016;
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.rot);
          ctx.fillStyle = c.color;
          ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
          ctx.restore();
        }
      }
    }