// components/GameCanvas.jsx
'use client';

import React, { useRef, useEffect } from 'react';
import {
  PHYSICS_CONSTANTS,
  TerrainSystem,
  PhysicsVehicle,
  GameStateManager,
  LEVEL_CONFIGS,
  BIOMES
} from '@/game_core.js';

export default function GameCanvas({
  level = 1,
  upgrades = { engine: 1, grip: 1, suspension: 1 },
  selectedSkin = 'standard',
  selectedRim = 'stock',
  inputs = { gas: false, brake: false, horn: false },
  onTelemetry = () => {},
  onGameOver = () => {},
  onVictory = () => {},
  isPaused = false
}) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load level config
    const lvlCfg = LEVEL_CONFIGS[level - 1] || LEVEL_CONFIGS[0];
    const terrain = new TerrainSystem(lvlCfg.distanceMeters, lvlCfg);
    const startX = 150;
    const startY = terrain.getHeight(startX) - 34;
    const vehicle = new PhysicsVehicle(startX, startY);
    vehicle.applyUpgrades(upgrades);

    const gameState = new GameStateManager({
      targetDistanceMeters: lvlCfg.finishMeters,
      timeLimitSec: lvlCfg.timeLimitSec,
      level: lvlCfg.level
    });
    gameState.state = 'PLAYING';

    const game = {
      canvas,
      ctx,
      terrain,
      vehicle,
      gameState,
      camera: { x: 0, y: 0, targetX: 0, targetY: 0 },
      lastTime: performance.now(),
      running: true,
      assets: {},
      backgroundAssets: {}
    };
    gameRef.current = game;

    // Load assets from manifest
    fetch('/assets/manifest.json')
      .then(res => res.json())
      .then(manifest => {
        for (const [key, entry] of Object.entries(manifest.assets || {})) {
          if (!entry.src) continue;
          const img = new Image();
          img.src = entry.src.startsWith('/') ? entry.src : `/${entry.src}`;
          img.onload = () => {
            if (key.startsWith('biome')) {
              game.backgroundAssets[key] = { img, loaded: true, ...entry };
            } else {
              game.assets[key] = { img, loaded: true, ...entry };
            }
          };
        }
      })
      .catch(() => {});

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Main animation frame loop
    let animId;
    const loop = (now) => {
      if (!game.running) return;

      const dt = Math.min((now - game.lastTime) / 1000, 0.05);
      game.lastTime = now;

      if (!isPaused && gameState.state === 'PLAYING') {
        vehicle.update(dt, inputs, terrain);
        gameState.update(dt, vehicle, terrain);

        // Telemetry update to React parent (throttled)
        onTelemetry({
          dist: vehicle.x / PHYSICS_CONSTANTS.METER_SCALE,
          targetDist: lvlCfg.finishMeters,
          cargo: vehicle.cargoIntegrity,
          speed: Math.abs(vehicle.vx) * (3600 / (1000 * PHYSICS_CONSTANTS.METER_SCALE)),
          fuel: (vehicle.fuel / vehicle.maxFuel) * 100,
          timeRemaining: gameState.timeRemaining,
          coins: gameState.coinsCollected,
          biomeName: terrain.getBiomeAt(vehicle.x / PHYSICS_CONSTANTS.METER_SCALE).name
        });

        if (gameState.state === 'GAMEOVER') {
          onGameOver(gameState.gameOverReason);
        } else if (gameState.state === 'VICTORY') {
          onVictory({
            stars: gameState.starRating || 3,
            cargo: vehicle.cargoIntegrity,
            coins: gameState.coinsCollected,
            timeRemaining: gameState.timeRemaining
          });
        }
      }

      // Render scene
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Smooth camera
      game.camera.targetX = vehicle.x - w * 0.32;
      game.camera.targetY = vehicle.y - h * 0.65;
      game.camera.x += (game.camera.targetX - game.camera.x) * 0.1;
      game.camera.y += (game.camera.targetY - game.camera.y) * 0.1;

      ctx.clearRect(0, 0, w, h);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(0.6, '#bae6fd');
      skyGrad.addColorStop(1, '#fef08a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Distant sun
      ctx.fillStyle = 'rgba(255, 253, 231, 0.4)';
      ctx.beginPath();
      ctx.arc(w * 0.78, h * 0.22, 60, 0, Math.PI * 2);
      ctx.fill();

      // World rendering
      ctx.save();
      ctx.translate(-game.camera.x, -game.camera.y);

      // Terrain subsoil
      const startRenderX = game.camera.x - 50;
      const endRenderX = game.camera.x + w + 50;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(startRenderX, h + game.camera.y + 200);
      for (let x = startRenderX; x <= endRenderX; x += 10) {
        ctx.lineTo(x, terrain.getHeight(x));
      }
      ctx.lineTo(endRenderX, h + game.camera.y + 200);
      ctx.closePath();
      ctx.fill();

      // Road surface ribbon
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      for (let x = startRenderX; x <= endRenderX; x += 10) {
        if (x === startRenderX) ctx.moveTo(x, terrain.getHeight(x));
        else ctx.lineTo(x, terrain.getHeight(x));
      }
      ctx.stroke();

      // Finish Gate
      const finishPx = lvlCfg.finishMeters * PHYSICS_CONSTANTS.METER_SCALE;
      const finishGateAsset = game.assets.finishGate;
      if (finishGateAsset && finishGateAsset.img && finishGateAsset.loaded) {
        const gh = 180;
        const gw = (finishGateAsset.width / finishGateAsset.height) * gh;
        ctx.drawImage(finishGateAsset.img, finishPx - 40, terrain.getHeight(finishPx) - gh + 5, gw, gh);
      }

      // Draw Vehicle Truck
      ctx.save();
      ctx.translate(vehicle.x, vehicle.y);
      ctx.rotate(vehicle.theta);

      // Chassis body
      const truckAsset = game.assets.truckBody;
      if (truckAsset && truckAsset.img && truckAsset.loaded) {
        ctx.drawImage(truckAsset.img, -50, -45, 100, 50);
      } else {
        ctx.fillStyle = '#0d9488';
        ctx.fillRect(-50, -40, 100, 40);
      }

      // Wheels
      const wheelAsset = game.assets.truckWheel;
      [vehicle.rearWheel, vehicle.frontWheel].forEach((wheel) => {
        ctx.save();
        ctx.translate(wheel.x - vehicle.x, wheel.y - vehicle.y);
        ctx.rotate(wheel.rot);
        if (wheelAsset && wheelAsset.img && wheelAsset.loaded) {
          ctx.drawImage(wheelAsset.img, -15, -15, 30, 30);
        } else {
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(0, 0, 15, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      ctx.restore(); // restore vehicle
      ctx.restore(); // restore world

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      game.running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [level, isPaused]);

  return (
    <canvas
      id="gameCanvas"
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 cursor-default"
    />
  );
}
