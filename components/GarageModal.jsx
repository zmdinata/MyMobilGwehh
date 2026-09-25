// components/GarageModal.jsx
'use client';

import React, { useRef, useEffect } from 'react';

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

  const getUpgradeCost = (lvl) => Math.round(50 * Math.pow(1.35, lvl - 1));

  const skins = [
    { id: 'standard', name: 'Standard Tosca MBG', unlockLevel: 1, cost: 0, color: '#0d9488' },
    { id: 'speedy', name: 'Speedy Pantura Blue', unlockLevel: 3, cost: 100, color: '#0284c7' },
    { id: 'mountain', name: 'Mountain Hunter Red', unlockLevel: 7, cost: 250, color: '#dc2626' },
    { id: 'retro', name: 'Retro Cirebon Brown', unlockLevel: 12, cost: 450, color: '#78350f' },
    { id: 'sport', name: 'Sport Gizi Lime', unlockLevel: 16, cost: 700, color: '#16a34a' }
  ];

  const rims = [
    { id: 'stock', name: 'Velg Kaleng Bawaan', unlockLevel: 1, cost: 0 },
    { id: 'gold', name: 'Bintang Emas 5-Spoke', unlockLevel: 4, cost: 120 },
    { id: 'beadlock', name: 'Offroad Beadlock Heavy Duty', unlockLevel: 9, cost: 300 },
    { id: 'whitewall', name: 'Klasik Whitewall Pantura', unlockLevel: 14, cost: 500 }
  ];

  // Draw truck live preview
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Workshop ground line
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(10, 115);
    ctx.lineTo(290, 115);
    ctx.stroke();

    const skinObj = skins.find(s => s.id === selectedSkin) || skins[0];

    // Truck body box
    ctx.fillStyle = skinObj.color;
    ctx.fillRect(80, 45, 90, 45);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 45, 90, 45);

    // Cabin
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(170, 55, 35, 35);
    ctx.strokeRect(170, 55, 35, 35);

    // Windshield
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(185, 60, 15, 15);

    // Wheels
    const rimColor = selectedRim === 'gold' ? '#facc15' : selectedRim === 'whitewall' ? '#f1f5f9' : '#475569';
    [105, 180].forEach(wx => {
      // Tire
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(wx, 105, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rim
      ctx.fillStyle = rimColor;
      ctx.beginPath();
      ctx.arc(wx, 105, 7, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [selectedSkin, selectedRim, upgrades]);

  return (
    <div id="garageModal" className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-2xl w-full bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🔧</span>
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
            <span className="bg-amber-500/20 border border-amber-400 text-amber-300 px-3 py-1 rounded-full text-xs sm:text-sm font-bold font-mono">
              🪙 <span id="garageCoins">{coins}</span> Koin
            </span>
            <button
              id="btnGarageClose"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-fredoka text-sm border border-slate-600 active:scale-95 cursor-pointer"
            >
              KEMBALI ✕
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
                <span className="font-fredoka text-sm text-cyan-300">⚡ Mesin Turbo</span>
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
              {upgrades.engine >= 20 ? 'MAX' : `UPGRADE (🪙 ${getUpgradeCost(upgrades.engine)})`}
            </button>
          </div>

          {/* Grip */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-fredoka text-sm text-emerald-300">🛞 Ban Kompon</span>
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
              {upgrades.grip >= 20 ? 'MAX' : `UPGRADE (🪙 ${getUpgradeCost(upgrades.grip)})`}
            </button>
          </div>

          {/* Suspension */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-fredoka text-sm text-amber-300">🪓 Suspensi</span>
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
              {upgrades.suspension >= 20 ? 'MAX' : `UPGRADE (🪙 ${getUpgradeCost(upgrades.suspension)})`}
            </button>
          </div>
        </div>

        {/* Skins & Rims Section */}
        <div className="border-t border-slate-800 pt-3">
          <span className="font-fredoka text-sm text-slate-300 block mb-2">🎨 Kustomisasi Body Truk:</span>
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
                  className={`px-3 py-1 rounded-xl text-xs font-fredoka transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold border-2 border-amber-300'
                      : isUnlocked
                      ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  {s.name} {!isUnlocked && `🔒 Lvl ${s.unlockLevel}`}
                </button>
              );
            })}
          </div>

          <span className="font-fredoka text-sm text-slate-300 block mb-2">⚙️ Pilihan Velg:</span>
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
                  className={`px-3 py-1 rounded-xl text-xs font-fredoka transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold border-2 border-amber-300'
                      : isUnlocked
                      ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  {r.name} {!isUnlocked && `🔒 Lvl ${r.unlockLevel}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
