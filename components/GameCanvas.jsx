// components/GameCanvas.jsx
'use client';

import React, { useRef, useEffect } from 'react';
import {
  PHYSICS_CONSTANTS,
  TerrainSystem,
  GameStateManager,
  LEVEL_CONFIGS,
  BIOMES,
  SoundSynthesizer,
  detectSurfaceMaterial
} from '@/game_core.js';
import { GameRenderer, Vehicle } from '@/components/GameRenderer.js';

export default function GameCanvas({
  level = 1,
  upgrades = { engine: 1, grip: 1, suspension: 1 },
  selectedSkin = 'standard',
  selectedRim = 'standard',
  inputs = { gas: false, brake: false, horn: false },
  isAudioMuted = false,
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

    const sound = new SoundSynthesizer();
    sound.setSkin(selectedSkin);
    sound.setMuted(isAudioMuted);
    vehicle.soundEngine = sound;

    const game = {
      canvas,
      terrain,
      vehicle,
      gameState,
      renderer,
      sound,
      lastTime: performance.now(),
      running: true
    };
    gameRef.current = game;

    // First user gesture handler to ensure audio is initialized
    const handleGesture = () => {
      sound.init();
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
    window.addEventListener('pointerdown', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });

    // Main animation frame loop
    let animId;
    let hasPlayedEndSound = false;

    const loop = (now) => {
      if (!game.running) return;

      const dt = Math.min((now - game.lastTime) / 1000, 0.05);
      game.lastTime = now;

      if (!isPaused && gameState.state === 'PLAYING') {
        if ((inputs.gas || inputs.brake) && !sound.isEngineRunning) {
          sound.init();
        }

        vehicle.update(dt, inputs, terrain);
        gameState.update(dt, vehicle, terrain);

        const isAirborne = !vehicle.rearWheel.onGround && !vehicle.frontWheel.onGround;
        const onGround = !isAirborne;
        const meterX = vehicle.x / PHYSICS_CONSTANTS.METER_SCALE;
        const surfaceType = detectSurfaceMaterial(terrain, meterX);
        const biome = terrain.getBiomeAt ? terrain.getBiomeAt(meterX) : null;
        const biomeId = biome ? biome.id : 'pantura';

        sound.updateEngine(vehicle.vx, inputs.gas, isAirborne, selectedSkin);
        sound.updateSurfaceContact(vehicle.vx, surfaceType, onGround);
        sound.updateWindAndAmbient(vehicle.vx, isAirborne, biomeId);

        // Telemetry update to React parent (throttled)
        onTelemetry({
          dist: vehicle.x / PHYSICS_CONSTANTS.METER_SCALE,
          targetDist: lvlCfg.finishMeters,
          cargo: vehicle.cargoIntegrity,
          speed: Math.abs(vehicle.vx) * (3600 / (1000 * PHYSICS_CONSTANTS.METER_SCALE)),
          fuel: (vehicle.fuel / vehicle.maxFuel) * 100,
          timeRemaining: gameState.timeRemaining,
          coins: gameState.coinsCollected,
          biomeName: biome ? biome.name : 'Pantura'
        });

        if (gameState.state === 'GAMEOVER') {
          if (!hasPlayedEndSound) {
            hasPlayedEndSound = true;
            sound.pauseEngine();
            sound.playCrashSound();
          }
          onGameOver(gameState.gameOverReason);
        } else if (gameState.state === 'VICTORY') {
          if (!hasPlayedEndSound) {
            hasPlayedEndSound = true;
            sound.pauseEngine();
            sound.playVictoryFanfare();
          }
          onVictory({
            stars: gameState.starRating || 3,
            cargo: vehicle.cargoIntegrity,
            coins: gameState.coinsCollected,
            timeRemaining: gameState.timeRemaining
          });
        }
      } else if (isPaused) {
        sound.pauseEngine();
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
      sound.stopEngine();
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [level, isPaused, selectedSkin, selectedRim, upgrades]);

  // Handle mute changes
  useEffect(() => {
    if (gameRef.current && gameRef.current.sound) {
      gameRef.current.sound.setMuted(isAudioMuted);
    }
  }, [isAudioMuted]);

  // Handle horn trigger
  useEffect(() => {
    if (inputs.horn && gameRef.current) {
      if (gameRef.current.vehicle) {
        gameRef.current.vehicle.triggerTeloletNotes();
      }
      if (gameRef.current.sound) {
        gameRef.current.sound.init();
        gameRef.current.sound.playTeloletHorn();
      }
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
