// components/GameHud.jsx
'use client';

import React from 'react';
import {
  Coins,
  Truck,
  Flag,
  Fuel,
  Volume2,
  VolumeX,
  Pause,
  Megaphone
} from 'lucide-react';

export default function GameHud({
  level = 1,
  targetDist = 1000,
  currentDist = 0,
  cargoIntegrity = 100,
  speedKmh = 0,
  coins = 0,
  fuelPercent = 100,
  biomeName = 'Pesisir Pantai Pantura',
  timeRemaining = 90,
  isAudioMuted = false,
  onToggleAudio = () => {},
  onPause = () => {},
  centerNotice = null
}) {
  const progressRatio = Math.min(100, Math.max(0, (currentDist / targetDist) * 100));

  const formatClock = (seconds) => {
    const s = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div id="hud" className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-2 sm:p-4">
      {/* Top HUD Row */}
      <div id="topHudRow" className="flex items-start justify-between gap-2 w-full">
        {/* Left: Cargo Health & Speed */}
        <div id="cargoHud" className="flex flex-col gap-1 pointer-events-auto bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-2.5 shadow-[0_8px_32px_rgba(2,132,199,0.2)] min-w-[155px] sm:min-w-[200px]">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <img
                id="cargoParcelIcon"
                src="/assets/refresh/v11/ui/icon_cargo.png"
                alt="Parcel"
                className="h-6 w-6 object-contain drop-shadow-[0_2px_8px_rgba(16,185,129,0.5)]"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="text-white tracking-wide">500 PORSI</span>
            </span>
            <span id="cargoVal" className="text-emerald-300 font-mono font-extrabold text-sm sm:text-base">{Math.round(cargoIntegrity)}%</span>
          </div>

          {/* Cargo Bar */}
          <div className="w-full h-3 sm:h-3.5 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-cyan-500/20">
            <div
              id="cargoBar"
              className="h-full bg-gradient-to-r from-blue-700 via-sky-500 to-emerald-400 rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
              style={{ width: `${Math.max(0, Math.min(100, cargoIntegrity))}%` }}
            />
          </div>

          {/* Speed & Coins */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-300 pt-0.5 font-mono">
            <span>KECEPATAN: <b id="speedVal" className="text-cyan-300 font-bold text-xs sm:text-sm">{Math.round(speedKmh)}</b> km/h</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span id="coinVal" className="font-mono">{coins}</span>
            </span>
          </div>
        </div>

        {/* Center: Track Progress Bar with Biome Badges */}
        <div id="progressHud" className="flex-1 max-w-xs sm:max-w-md md:max-w-xl mx-2 pointer-events-auto bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-2 sm:p-2.5 shadow-[0_8px_32px_rgba(2,132,199,0.2)] flex flex-col justify-center">
          <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-slate-300 mb-1 px-1">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold shadow-sm">
                LVL <span id="hudLevelVal">{level}</span>
              </span>
              <span id="biomeLabel" className="text-cyan-300 uppercase tracking-wider truncate">
                {biomeName}
              </span>
            </div>
            <span className="font-mono text-slate-300">
              <span id="distVal" className="text-amber-300 font-bold">{Math.round(currentDist)}</span> / <span id="hudTargetDist">{targetDist}</span>m
            </span>
          </div>

          {/* Progress track container */}
          <div className="relative w-full h-4 sm:h-5 bg-slate-950 rounded-full p-0.5 border border-cyan-500/30 overflow-visible flex items-center">
            {/* Dynamic progress bar fill */}
            <div
              id="progressFill"
              className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 rounded-full transition-all duration-75 relative z-0"
              style={{ width: `${progressRatio}%` }}
            />
            {/* Truck marker */}
            <div
              id="truckMarker"
              className="absolute z-10 -top-1.5 transform -translate-x-1/2 transition-all duration-75 pointer-events-none text-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              style={{ left: `${progressRatio}%` }}
            >
              <Truck className="w-4 h-4" />
            </div>
            {/* Finish Gate 3D Icon Badge */}
            <div className="absolute -right-1 z-10 drop-shadow-[0_2px_8px_rgba(16,185,129,0.7)]">
              <img
                src="/assets/refresh/v11/ui/icon_finish.png"
                alt="Finis"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain transform hover:scale-110 transition-transform"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>

          {/* Biome tick marks */}
          <div id="biomeTicks" className="flex justify-between text-[8px] sm:text-[9px] text-slate-400 mt-1 px-1 font-mono">
            <span>0m Pesisir</span>
            <span>Rute Perjalanan</span>
            <span title="Garis Finis SD · SMP · SMA Puspa Bangsa">SD · SMP · SMA</span>
          </div>
        </div>

        {/* Right: Fuel Status & Action Controls */}
        <div id="rightHud" className="flex items-start gap-2">
          {/* Fuel Widget */}
          <div id="fuelWidget" className="flex flex-col gap-1 pointer-events-auto bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-2.5 shadow-[0_8px_32px_rgba(245,158,11,0.15)] min-w-[135px] sm:min-w-[175px]">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="flex items-center gap-1.5 text-amber-400">
                <img
                  src="/assets/refresh/v11/ui/icon_fuel.png"
                  alt="Fuel"
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span>BENSIN</span>
              </span>
              <span id="fuelVal" className="text-amber-300 font-mono font-extrabold text-sm sm:text-base">{Math.round(fuelPercent)}%</span>
            </div>
            <div className="w-full h-3 sm:h-3.5 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-amber-500/20">
              <div
                id="fuelBar"
                className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-300 rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                style={{ width: `${Math.max(0, Math.min(100, fuelPercent))}%` }}
              />
            </div>
            {/* Countdown Clock */}
            <div className="flex items-center justify-between text-[11px] sm:text-xs pt-0.5 font-mono">
              <span className="text-slate-400">TARGET: <b className="text-white font-mono">09:45 WIB</b></span>
              <span id="clockVal" className="font-mono font-bold text-red-400 text-xs sm:text-sm">{formatClock(timeRemaining)}</span>
            </div>
          </div>

          {/* Audio & Pause Buttons with 3D Icons */}
          <div id="hudActions" className="flex flex-col gap-1.5 pointer-events-auto">
            <button
              id="audioBtn"
              onClick={onToggleAudio}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800/80 backdrop-blur-md border border-cyan-400/40 hover:bg-slate-700/80 active:scale-95 flex items-center justify-center p-1 text-cyan-400 shadow-[0_4px_16px_rgba(2,132,199,0.3)] transition-all"
              title="Toggle Audio"
            >
              <img
                src="/assets/refresh/v11/ui/icon_audio.png"
                alt="Audio"
                className={`w-full h-full object-contain pointer-events-none drop-shadow ${isAudioMuted ? 'opacity-40 grayscale' : ''}`}
              />
            </button>
            <button
              id="pauseBtn"
              onClick={onPause}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800/80 backdrop-blur-md border border-amber-400/40 hover:bg-slate-700/80 active:scale-95 flex items-center justify-center p-1 text-slate-200 shadow-[0_4px_16px_rgba(245,158,11,0.3)] transition-all"
              title="Jeda Permainan"
            >
              <img
                src="/assets/refresh/v11/ui/icon_pause.png"
                alt="Pause"
                className="w-full h-full object-contain pointer-events-none drop-shadow"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Center Floating Screen Notification / Telolet Floaters */}
      {centerNotice && (
        <div id="centerNotice" className="text-center font-fredoka text-xl sm:text-3xl text-amber-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] transition-opacity duration-300 pointer-events-none flex items-center justify-center gap-2">
          <Megaphone className="w-6 h-6 text-amber-400 animate-bounce" />
          <span>{centerNotice}</span>
        </div>
      )}
    </div>
  );
}
