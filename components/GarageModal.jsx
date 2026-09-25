// components/GarageModal.jsx
'use client';

import React, { useEffect, useRef } from 'react';
import {
  FaWrench,
  FaCoins,
  FaXmark,
  FaBolt,
  FaPalette,
  FaGear,
  FaLock
} from 'react-icons/fa6';
import { GiTireTracks, GiSpring } from 'react-icons/gi';

export default function GarageModal({
  coins = 0,
  upgrades = { engine: 1, grip: 1, suspension: 1 },
  selectedSkin = 'standard',
  selectedRim = 'stock',
  unlockedLevel = 1,
  onUpgrade = () => {},
  onSelectSkin = () => {},
  onSelectRim = () => {},
  onClose = () => {}
}) {
  const previewCanvasRef = useRef(null);

  const getUpgradeCost = (currentLvl) => {
    return Math.round(50 * Math.pow(1.35, currentLvl - 1));
  };

  const skins = [
    { id: 'standard', name: 'Standard MBG Box', unlockLevel: 1, color: '#0d9488' },
    { id: 'speedy', name: 'Speedy Courier', unlockLevel: 4, color: '#0284c7' },
    { id: 'mountain', name: 'Mountain 4x4', unlockLevel: 8, color: '#b45309' },
    { id: 'retro', name: 'Retro Classic', unlockLevel: 12, color: '#be123c' },
    { id: 'sport', name: 'Sport Tuned', unlockLevel: 16, color: '#4338ca' }
  ];

  const rims = [
    { id: 'stock', name: 'Stock Steelie', unlockLevel: 1, color: '#64748b' },
    { id: 'gold', name: 'Gold Racing Alloy', unlockLevel: 5, color: '#eab308' },
    { id: 'beadlock', name: 'Mud Offroad Beadlock', unlockLevel: 10, color: '#ef4444' },
    { id: 'whitewall', name: 'White-Wall Classic', unlockLevel: 15, color: '#f8fafc' }
  ];

  // Render live truck preview on mini canvas
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Floor line
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(10, 110);
    ctx.lineTo(290, 110);
    ctx.stroke();

    // Truck Body Box
    const curSkin = skins.find(s => s.id === selectedSkin) || skins[0];
    ctx.fillStyle = curSkin.color;
    ctx.beginPath();
    ctx.roundRect(80, 45, 140, 50, 8);
    ctx.fill();

    // Cabin Window
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.roundRect(175, 52, 35, 25, 4);
    ctx.fill();

    // Headlight
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(218, 75, 4, 0, Math.PI * 2);
    ctx.fill();

    // Suspension Linkages
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    // Rear strut
    ctx.beginPath();
    ctx.moveTo(110, 85);
    ctx.lineTo(110, 100);
    ctx.stroke();
    // Front strut
    ctx.beginPath();
    ctx.moveTo(190, 85);
    ctx.lineTo(190, 100);
    ctx.stroke();

    // Wheels
    const curRim = rims.find(r => r.id === selectedRim) || rims[0];
    const drawWheel = (wx, wy) => {
      // Tire
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(wx, wy, 16, 0, Math.PI * 2);
      ctx.fill();
      // Rim
      ctx.fillStyle = curRim.color;
      ctx.beginPath();
      ctx.arc(wx, wy, 8, 0, Math.PI * 2);
      ctx.fill();
      // Hub center
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(wx, wy, 3, 0, Math.PI * 2);
      ctx.fill();
    };

    drawWheel(110, 102);
    drawWheel(190, 102);
  }, [selectedSkin, selectedRim]);

  return (
    <div id="garageModal" className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-2xl w-full bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2.5">
            <FaWrench className="text-2xl sm:text-3xl text-amber-400" />
            <div>
              <h2 className="font-fredoka text-xl sm:text-2xl text-amber-300">
                BENGKEL RESMI ZACKY
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Upgrade Performa & Modifikasi Visual Armada Mas Tion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-amber-500/20 border border-amber-400 text-amber-300 px-3 py-1 rounded-full text-xs sm:text-sm font-bold font-mono flex items-center gap-1.5">
              <FaCoins className="text-amber-400 text-xs" />
              <span id="garageCoins">{coins}</span> Koin
            </span>
            <button
              id="btnGarageClose"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-fredoka text-sm border border-slate-600 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>KEMBALI</span>
              <FaXmark className="text-xs" />
            </button>
          </div>
        </div>

        {/* Live Preview Canvas */}
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-2 mb-4 flex flex-col items-center justify-center">
          <canvas
            id="garagePreviewCanvas"
            ref={previewCanvasRef}
            width={300}
            height={130}
            className="w-full max-w-xs h-auto"
          />
          <span className="text-[10px] text-slate-400 font-mono">
            Preview Armada: {skins.find(s => s.id === selectedSkin)?.name}
          </span>
        </div>

        {/* Performance Upgrades Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
          {/* Engine */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-fredoka text-sm text-cyan-300 flex items-center gap-1.5">
                  <FaBolt className="text-cyan-400 text-xs" /> Mesin Turbo
                </span>
                <span className="font-mono text-xs font-bold text-amber-400">LV {upgrades.engine}/20</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-2">Akselerasi & daya tanjak</p>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-cyan-400 h-full transition-all" style={{ width: `${(upgrades.engine / 20) * 100}%` }} />
              </div>
            </div>
            <button
              id="btnUpgradeEngine"
              disabled={upgrades.engine >= 20 || coins < getUpgradeCost(upgrades.engine)}
              onClick={() => onUpgrade('engine')}
              className={`w-full py-1.5 rounded-xl font-fredoka text-xs font-bold transition-all ${
                upgrades.engine >= 20
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : coins >= getUpgradeCost(upgrades.engine)
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 active:scale-95 cursor-pointer'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {upgrades.engine >= 20 ? 'MAX' : `UPGRADE (${getUpgradeCost(upgrades.engine)} Koin)`}
            </button>
          </div>

          {/* Grip */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-fredoka text-sm text-emerald-300 flex items-center gap-1.5">
                  <GiTireTracks className="text-emerald-400 text-base" /> Ban Kompon
                </span>
                <span className="font-mono text-xs font-bold text-amber-400">LV {upgrades.grip}/20</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-2">Grip lumpur & aspal basah</p>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-emerald-400 h-full transition-all" style={{ width: `${(upgrades.grip / 20) * 100}%` }} />
              </div>
            </div>
            <button
              id="btnUpgradeGrip"
              disabled={upgrades.grip >= 20 || coins < getUpgradeCost(upgrades.grip)}
              onClick={() => onUpgrade('grip')}
              className={`w-full py-1.5 rounded-xl font-fredoka text-xs font-bold transition-all ${
                upgrades.grip >= 20
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : coins >= getUpgradeCost(upgrades.grip)
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95 cursor-pointer'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {upgrades.grip >= 20 ? 'MAX' : `UPGRADE (${getUpgradeCost(upgrades.grip)} Koin)`}
            </button>
          </div>

          {/* Suspension */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-fredoka text-sm text-amber-300 flex items-center gap-1.5">
                  <GiSpring className="text-amber-400 text-base" /> Suspensi
                </span>
                <span className="font-mono text-xs font-bold text-amber-400">LV {upgrades.suspension}/20</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-2">Redam benturan kargo</p>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-amber-400 h-full transition-all" style={{ width: `${(upgrades.suspension / 20) * 100}%` }} />
              </div>
            </div>
            <button
              id="btnUpgradeSusp"
              disabled={upgrades.suspension >= 20 || coins < getUpgradeCost(upgrades.suspension)}
              onClick={() => onUpgrade('suspension')}
              className={`w-full py-1.5 rounded-xl font-fredoka text-xs font-bold transition-all ${
                upgrades.suspension >= 20
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : coins >= getUpgradeCost(upgrades.suspension)
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95 cursor-pointer'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {upgrades.suspension >= 20 ? 'MAX' : `UPGRADE (${getUpgradeCost(upgrades.suspension)} Koin)`}
            </button>
          </div>
        </div>

        {/* Skins & Rims Section */}
        <div className="border-t border-slate-800 pt-3">
          <span className="font-fredoka text-sm text-slate-300 flex items-center gap-1.5 mb-2">
            <FaPalette className="text-amber-400" /> Kustomisasi Body Truk:
          </span>
          <div className="flex flex-wrap gap-2 mb-3">
            {skins.map(s => {
              const isUnlocked = unlockedLevel >= s.unlockLevel;
              const isSelected = selectedSkin === s.id;
              return (
                <button
                  key={s.id}
                  id={`skinBtn_${s.id}`}
                  disabled={!isUnlocked}
                  onClick={() => onSelectSkin(s.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-fredoka transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold border-2 border-amber-300'
                      : isUnlocked
                      ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <span>{s.name}</span>
                  {!isUnlocked && (
                    <span className="inline-flex items-center gap-1 text-[10px] opacity-75">
                      <FaLock className="text-[9px]" /> Lvl {s.unlockLevel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <span className="font-fredoka text-sm text-slate-300 flex items-center gap-1.5 mb-2">
            <FaGear className="text-cyan-400" /> Pilihan Velg:
          </span>
          <div className="flex flex-wrap gap-2">
            {rims.map(r => {
              const isUnlocked = unlockedLevel >= r.unlockLevel;
              const isSelected = selectedRim === r.id;
              return (
                <button
                  key={r.id}
                  id={`rimBtn_${r.id}`}
                  disabled={!isUnlocked}
                  onClick={() => onSelectRim(r.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-fredoka transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold border-2 border-amber-300'
                      : isUnlocked
                      ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <span>{r.name}</span>
                  {!isUnlocked && (
                    <span className="inline-flex items-center gap-1 text-[10px] opacity-75">
                      <FaLock className="text-[9px]" /> Lvl {r.unlockLevel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
