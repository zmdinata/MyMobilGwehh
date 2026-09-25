// components/GameCanvas.jsx
'use client';

import React, { useRef, useEffect } from 'react';
import {
  PHYSICS_CONSTANTS,
  TerrainSystem,
  GameStateManager,
  LEVEL_CONFIGS,
  BIOMES
} from '@/game_core.js';
import { GameRenderer, Vehicle } from '@/components/GameRenderer.js';

export default function GameCanvas({
  level = 1,
  upgrades = { engine: 1, grip: 1, suspension: 1 },
  selectedSkin = 'standard',
  selectedRim = 'standard',
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

    // Load level config
    const lvlCfg = LEVEL_CONFIGS[level - 1] || LEVEL_CONFIGS[0];
    const terrain = new TerrainSystem(lvlCfg.distanceMeters, lvlCfg);
    const startX = 150;
    const startY = terrain.getHeight(startX) - 34;
    const vehicle = new Vehicle(startX, startY);
    vehicle.applyUpgrades(upgrades, selectedSkin);

    const gameState = new GameStateManager({
      targetDistanceMeters: lvlCfg.finishMeters,
      timeLimitSec: lvlCfg.timeLimitSec,
      level: lvlCfg.level
    });
    gameState.state = 'PLAYING';

    const renderer = new GameRenderer(canvas);
    renderer.selectedSkin = selectedSkin;
    renderer.selectedRim = selectedRim;

    const game = {
      canvas,
      terrain,
      vehicle,
      gameState,
      renderer,
      lastTime: performance.now(),
      running: true
    };
    gameRef.current = game;

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

      // Render world with full GameRenderer (all 8 biomes, parallax, vehicle, struts, particles, finish gate)
      renderer.selectedSkin = selectedSkin;
      renderer.selectedRim = selectedRim;
      renderer.render(vehicle, terrain, gameState, inputs);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      game.running = false;
      cancelAnimationFrame(animId);
    };
  }, [level, isPaused, selectedSkin, selectedRim, upgrades]);

  // Handle horn trigger
  useEffect(() => {
    if (inputs.horn && gameRef.current && gameRef.current.vehicle) {
      gameRef.current.vehicle.triggerTeloletNotes();
    }
  }, [inputs.horn]);

  return (
    <canvas
      id="gameCanvas"
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 cursor-default"
    />
  );
}
