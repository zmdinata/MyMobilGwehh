// app/page.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import GameCanvas from '@/components/GameCanvas';
import GameHud from '@/components/GameHud';
import TouchPedals from '@/components/TouchPedals';
import WelcomeModal from '@/components/WelcomeModal';
import MainMenuModal from '@/components/MainMenuModal';
import LevelSelectModal from '@/components/LevelSelectModal';
import GarageModal from '@/components/GarageModal';
import DialogueModal from '@/components/DialogueModal';
import PauseModal from '@/components/PauseModal';
import VictoryModal from '@/components/VictoryModal';
import GameOverModal from '@/components/GameOverModal';
import { STORY_DIALOGUES, LEVEL_CONFIGS } from '@/game_core.js';

export default function GamePage() {
  // Game state
  const [screen, setScreen] = useState('WELCOME'); // WELCOME, MENU, LEVEL_SELECT, GARAGE, DIALOGUE, PLAYING, PAUSED, VICTORY, GAMEOVER
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [coins, setCoins] = useState(0);
  const [levelStars, setLevelStars] = useState({});
  const [upgrades, setUpgrades] = useState({ engine: 1, grip: 1, suspension: 1 });
  const [selectedSkin, setSelectedSkin] = useState('standard');
  const [selectedRim, setSelectedRim] = useState('stock');
  const [purchasedSkins, setPurchasedSkins] = useState(['standard']);
  const [purchasedRims, setPurchasedRims] = useState(['stock']);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  // Input states
  const [inputs, setInputs] = useState({ gas: false, brake: false, horn: false });

  // Telemetry states for HUD
  const [telemetry, setTelemetry] = useState({
    dist: 0,
    targetDist: 800,
    cargo: 100,
    speed: 0,
    fuel: 100,
    timeRemaining: 90,
    coins: 0,
    biomeName: 'Pesisir Pantai Pantura'
  });

  const [centerNotice, setCenterNotice] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('ROLLOVER');
  const [victoryStats, setVictoryStats] = useState({ stars: 3, cargo: 100, coins: 50, timeTaken: '01:15' });

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        setInputs(prev => ({ ...prev, gas: true }));
      } else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        setInputs(prev => ({ ...prev, brake: true }));
      } else if (e.code === 'KeyH' || e.code === 'Space') {
        triggerHorn();
      } else if (e.code === 'Escape') {
        if (screen === 'PLAYING') setScreen('PAUSED');
        else if (screen === 'PAUSED') setScreen('PLAYING');
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        setInputs(prev => ({ ...prev, gas: false }));
      } else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        setInputs(prev => ({ ...prev, brake: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [screen]);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mmg_savedata_react') || localStorage.getItem('mbg_savedata_react');
      if (saved) {
        const parsed = JSON.parse(saved);
        const ul = typeof parsed.unlockedLevel === 'number' ? Math.max(1, Math.min(20, parsed.unlockedLevel)) : 1;
        if (typeof parsed.coins === 'number') setCoins(parsed.coins);
        setUnlockedLevel(ul);
        if (parsed.upgrades) setUpgrades(parsed.upgrades);

        const selSkin = parsed.selectedSkin || 'standard';
        const selRim = parsed.selectedRim || 'stock';
        setSelectedSkin(selSkin);
        setSelectedRim(selRim);

        const skinReqs = { standard: 1, speedy: 4, mountain: 8, retro: 12, sport: 16 };
        const rimReqs = { stock: 1, standard: 1, gold: 5, beadlock: 10, whitewall: 15 };

        let pSkins = Array.isArray(parsed.purchasedSkins) && parsed.purchasedSkins.length ? [...parsed.purchasedSkins] : ['standard'];
        if (!pSkins.includes('standard')) pSkins.push('standard');
        if (selSkin && !pSkins.includes(selSkin)) pSkins.push(selSkin);
        if (!parsed.purchasedSkins || parsed.purchasedSkins.length <= 1) {
          Object.entries(skinReqs).forEach(([k, req]) => {
            if (ul >= req && !pSkins.includes(k)) pSkins.push(k);
          });
        }
        setPurchasedSkins(Array.from(new Set(pSkins)));

        let pRims = Array.isArray(parsed.purchasedRims) && parsed.purchasedRims.length ? [...parsed.purchasedRims] : ['stock', 'standard'];
        if (!pRims.includes('stock')) pRims.push('stock');
        if (!pRims.includes('standard')) pRims.push('standard');
        if (selRim && !pRims.includes(selRim)) pRims.push(selRim);
        if (!parsed.purchasedRims || parsed.purchasedRims.length <= 1) {
          Object.entries(rimReqs).forEach(([k, req]) => {
            if (ul >= req && !pRims.includes(k)) pRims.push(k);
          });
        }
        setPurchasedRims(Array.from(new Set(pRims)));

        if (parsed.levelStars) setLevelStars(parsed.levelStars);
      }
    } catch (_) {}
    setLoadedFromStorage(true);
  }, []);

  // Save progress to localStorage whenever relevant state changes
  useEffect(() => {
    if (!loadedFromStorage) return;
    try {
      const data = {
        coins,
        unlockedLevel,
        upgrades,
        selectedSkin,
        selectedRim,
        purchasedSkins,
        purchasedRims,
        levelStars
      };
      localStorage.setItem('mmg_savedata_react', JSON.stringify(data));
      localStorage.setItem('mbg_savedata_react', JSON.stringify(data));
    } catch (_) {}
  }, [coins, unlockedLevel, upgrades, selectedSkin, selectedRim, purchasedSkins, purchasedRims, levelStars, loadedFromStorage]);

  const triggerHorn = () => {
    setCenterNotice('TELOLET MANIA!');
    setTimeout(() => setCenterNotice(null), 1800);
  };

  const handleStartStory = () => {
    const story = STORY_DIALOGUES[currentLevel];
    if (story && story.intro && story.intro.length > 0) {
      setScreen('DIALOGUE');
    } else {
      setScreen('PLAYING');
    }
  };

  const handleUpgrade = (type) => {
    const cost = Math.round(100 * Math.pow(1.25, upgrades[type] - 1));
    if (coins >= cost && upgrades[type] < 20) {
      setCoins(coins - cost);
      setUpgrades(prev => ({ ...prev, [type]: prev[type] + 1 }));
    }
  };

  const handleBuySkin = (skin) => {
    if (coins >= skin.price && !purchasedSkins.includes(skin.id)) {
      setCoins(prev => prev - skin.price);
      setPurchasedSkins(prev => Array.from(new Set([...prev, skin.id])));
      setSelectedSkin(skin.id);
    }
  };

  const handleBuyRim = (rim) => {
    if (coins >= rim.price && !purchasedRims.includes(rim.id)) {
      setCoins(prev => prev - rim.price);
      setPurchasedRims(prev => Array.from(new Set([...prev, rim.id])));
      setSelectedRim(rim.id);
    }
  };

  const handleGameOver = (reason) => {
    setGameOverReason(reason);
    setScreen('GAMEOVER');
  };

  const handleVictory = (data) => {
    const earned = 50 + currentLevel * 10;
    setCoins(prev => prev + earned);
    if (currentLevel >= unlockedLevel && unlockedLevel < 20) {
      setUnlockedLevel(currentLevel + 1);
    }
    setLevelStars(prev => ({ ...prev, [currentLevel]: Math.max(prev[currentLevel] || 0, data.stars) }));
    setVictoryStats({
      stars: data.stars,
      cargo: data.cargo,
      coins: earned,
      timeTaken: '01:20'
    });
    setScreen('VICTORY');
  };

  const currentDialogues = STORY_DIALOGUES[currentLevel]?.intro || [];

  return (
    <main className="relative w-full h-full overflow-hidden bg-slate-950">
      {/* 2D Physics Game Canvas (Rendered at 60 FPS) */}
      <GameCanvas
        level={currentLevel}
        upgrades={upgrades}
        selectedSkin={selectedSkin}
        selectedRim={selectedRim}
        inputs={inputs}
        isAudioMuted={isAudioMuted}
        onTelemetry={setTelemetry}
        onGameOver={handleGameOver}
        onVictory={handleVictory}
        isPaused={screen !== 'PLAYING'}
      />

      {/* In-Game HUD (Visible during gameplay or pause) */}
      {(screen === 'PLAYING' || screen === 'PAUSED') && (
        <>
          <GameHud
            level={currentLevel}
            targetDist={telemetry.targetDist}
            currentDist={telemetry.dist}
            cargoIntegrity={telemetry.cargo}
            speedKmh={telemetry.speed}
            coins={coins}
            fuelPercent={telemetry.fuel}
            biomeName={telemetry.biomeName}
            timeRemaining={telemetry.timeRemaining}
            isAudioMuted={isAudioMuted}
            onToggleAudio={() => setIsAudioMuted(!isAudioMuted)}
            onPause={() => setScreen('PAUSED')}
            centerNotice={centerNotice}
          />

          {/* Sleek Glassmorphic Touch Pedals */}
          <TouchPedals
            onBrakeStart={() => setInputs(prev => ({ ...prev, brake: true }))}
            onBrakeEnd={() => setInputs(prev => ({ ...prev, brake: false }))}
            onGasStart={() => setInputs(prev => ({ ...prev, gas: true }))}
            onGasEnd={() => setInputs(prev => ({ ...prev, gas: false }))}
            onHorn={triggerHorn}
          />
        </>
      )}

      {/* Screen Modals */}
      {screen === 'WELCOME' && (
        <WelcomeModal onStart={() => setScreen('MENU')} />
      )}

      {screen === 'MENU' && (
        <MainMenuModal
          currentLevel={currentLevel}
          coins={coins}
          onStartStory={handleStartStory}
          onOpenLevelSelect={() => setScreen('LEVEL_SELECT')}
          onOpenGarage={() => setScreen('GARAGE')}
          onOpenLore={() => setScreen('WELCOME')}
        />
      )}

      {screen === 'LEVEL_SELECT' && (
        <LevelSelectModal
          currentUnlockedLevel={unlockedLevel}
          levelStars={levelStars}
          onSelectLevel={(lvl) => {
            setCurrentLevel(lvl);
            setScreen('MENU');
          }}
          onClose={() => setScreen('MENU')}
        />
      )}

      {screen === 'GARAGE' && (
        <GarageModal
          coins={coins}
          upgrades={upgrades}
          selectedSkin={selectedSkin}
          selectedRim={selectedRim}
          purchasedSkins={purchasedSkins}
          purchasedRims={purchasedRims}
          unlockedLevel={unlockedLevel}
          onUpgrade={handleUpgrade}
          onSelectSkin={setSelectedSkin}
          onSelectRim={setSelectedRim}
          onBuySkin={handleBuySkin}
          onBuyRim={handleBuyRim}
          onClose={() => setScreen('MENU')}
        />
      )}

      {screen === 'DIALOGUE' && (
        <DialogueModal
          level={currentLevel}
          dialogues={currentDialogues}
          onComplete={() => setScreen('PLAYING')}
        />
      )}

      {screen === 'PAUSED' && (
        <PauseModal
          onResume={() => setScreen('PLAYING')}
          onRestart={() => setScreen('PLAYING')}
          onMenu={() => setScreen('MENU')}
        />
      )}

      {screen === 'VICTORY' && (
        <VictoryModal
          stars={victoryStats.stars}
          cargoIntegrity={victoryStats.cargo}
          timeTaken={victoryStats.timeTaken}
          coinsEarned={victoryStats.coins}
          onNextLevel={() => {
            if (currentLevel < 20) {
              setCurrentLevel(currentLevel + 1);
              setScreen('MENU');
            } else {
              setScreen('MENU');
            }
          }}
          onReplay={() => setScreen('PLAYING')}
          onMenu={() => setScreen('MENU')}
        />
      )}

      {screen === 'GAMEOVER' && (
        <GameOverModal
          reason={gameOverReason}
          distance={telemetry.dist}
          coinsEarned={telemetry.coins}
          cargoLeft={telemetry.cargo}
          onRestart={() => setScreen('PLAYING')}
          onMenu={() => setScreen('MENU')}
        />
      )}
    </main>
  );
}
