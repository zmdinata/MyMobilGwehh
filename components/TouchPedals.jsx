// components/TouchPedals.jsx
'use client';

import React from 'react';
import { Megaphone, ChevronDown, ChevronUp, ArrowLeft, ArrowRight } from 'lucide-react';

export default function TouchPedals({
  onBrakeStart = () => {},
  onBrakeEnd = () => {},
  onGasStart = () => {},
  onGasEnd = () => {},
  onHorn = () => {},
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none flex items-end justify-between px-3 sm:px-8 pb-3 select-none">
      {/* Left Pedal: BRAKE / REVERSE / PITCH DOWN */}
      <div className="pointer-events-auto flex flex-col items-center">
        <button
          id="pedalBrake"
          onMouseDown={onBrakeStart}
          onMouseUp={onBrakeEnd}
          onMouseLeave={onBrakeEnd}
          onTouchStart={(e) => { e.preventDefault(); onBrakeStart(); }}
          onTouchEnd={(e) => { e.preventDefault(); onBrakeEnd(); }}
          className="pedal-btn group relative w-24 h-32 sm:w-28 sm:h-36 rounded-3xl bg-gradient-to-b from-red-600/85 via-red-800/90 to-slate-950/95 backdrop-blur-md border-2 border-red-400/80 shadow-[0_8px_25px_rgba(220,38,38,0.45)] flex flex-col items-center justify-between p-3 active:scale-95 transition-all"
        >
          {/* Tactile Grip Matrix */}
          <div className="w-full flex justify-center gap-1.5 opacity-80 mt-1">
            <span className="w-2 h-2 rounded-full bg-red-300 shadow-sm" />
            <span className="w-2 h-2 rounded-full bg-red-300 shadow-sm" />
            <span className="w-2 h-2 rounded-full bg-red-300 shadow-sm" />
            <span className="w-2 h-2 rounded-full bg-red-300 shadow-sm" />
          </div>
          <div className="text-center">
            <span className="block font-fredoka text-xl sm:text-2xl text-white tracking-wider drop-shadow group-hover:scale-105 transition-transform">
              REM
            </span>
            <span className="block text-[9px] sm:text-[10px] font-mono text-red-200 uppercase font-semibold flex items-center justify-center gap-0.5">
              Mundur / Pitch <ChevronDown className="w-3 h-3 inline" />
            </span>
          </div>
          <span className="text-[9px] text-red-300/80 font-mono hidden sm:inline flex items-center gap-1">
            [A] / [<ArrowLeft className="w-2.5 h-2.5 inline" />]
          </span>
        </button>
      </div>

      {/* Center: Telolet Horn Button */}
      <div className="pointer-events-auto flex flex-col items-center pb-1">
        <button
          id="hornBtn"
          onClick={onHorn}
          onTouchStart={(e) => { e.preventDefault(); onHorn(); }}
          className="pedal-btn relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-amber-400/95 via-amber-500/95 to-yellow-600/95 backdrop-blur-md border-2 border-amber-200 shadow-[0_8px_20px_rgba(245,158,11,0.5)] flex flex-col items-center justify-center p-1 active:scale-90 transition-transform"
        >
          <Megaphone className="w-7 h-7 text-slate-950 mb-0.5 drop-shadow" />
          <span className="font-fredoka text-[10px] sm:text-xs text-slate-950 font-bold tracking-tight">TELOLET</span>
          <span className="text-[8px] text-amber-950 font-mono hidden sm:inline font-bold">[H] / [Spasi]</span>
        </button>
      </div>

      {/* Right Pedal: GAS / ACCELERATE / PITCH UP */}
      <div className="pointer-events-auto flex flex-col items-center">
        <button
          id="pedalGas"
          onMouseDown={onGasStart}
          onMouseUp={onGasEnd}
          onMouseLeave={onGasEnd}
          onTouchStart={(e) => { e.preventDefault(); onGasStart(); }}
          onTouchEnd={(e) => { e.preventDefault(); onGasEnd(); }}
          className="pedal-btn group relative w-24 h-36 sm:w-28 sm:h-40 rounded-3xl bg-gradient-to-b from-cyan-500/85 via-blue-600/90 to-slate-950/95 backdrop-blur-md border-2 border-cyan-300/80 shadow-[0_8px_25px_rgba(6,182,212,0.45)] flex flex-col items-center justify-between p-3 active:scale-95 transition-all"
        >
          {/* Tactile Grip Matrix */}
          <div className="w-full flex justify-center gap-1.5 opacity-80 mt-1">
            <span className="w-2 h-2 rounded-full bg-cyan-200 shadow-sm" />
            <span className="w-2 h-2 rounded-full bg-cyan-200 shadow-sm" />
            <span className="w-2 h-2 rounded-full bg-cyan-200 shadow-sm" />
            <span className="w-2 h-2 rounded-full bg-cyan-200 shadow-sm" />
          </div>
          <div className="text-center">
            <span className="block font-fredoka text-2xl sm:text-3xl text-white tracking-wider drop-shadow group-hover:scale-105 transition-transform">
              GAS
            </span>
            <span className="block text-[9px] sm:text-[10px] font-mono text-cyan-200 uppercase font-semibold flex items-center justify-center gap-0.5">
              Maju / Pitch <ChevronUp className="w-3 h-3 inline" />
            </span>
          </div>
          <span className="text-[9px] text-cyan-300/80 font-mono hidden sm:inline flex items-center gap-1">
            [D] / [<ArrowRight className="w-2.5 h-2.5 inline" />]
          </span>
        </button>
      </div>
    </div>
  );
}
