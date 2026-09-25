// components/PauseModal.jsx
'use client';

import React from 'react';
import { Pause, Home } from 'lucide-react';

export default function PauseModal({
  onResume = () => {},
  onRestart = () => {},
  onMenu = () => {}
}) {
  return (
    <div id="pauseModal" className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/95 backdrop-blur-xl border border-cyan-500/40 rounded-3xl p-6 text-center max-w-sm w-full shadow-[0_12px_40px_rgba(2,132,199,0.3)] relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-center mb-3">
          <img
            src="/assets/refresh/v11/ui/icon_pause.png"
            alt="Pause"
            className="w-16 h-16 object-contain drop-shadow-[0_4px_16px_rgba(245,158,11,0.5)] animate-pulse"
          />
        </div>
        <h3 className="font-fredoka text-2xl sm:text-3xl text-cyan-300 mb-1 flex items-center justify-center gap-2">
          <span>GAME DI-JEDA</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4 font-mono">
          Mas Tion sedang mengatur napas dan memeriksa suhu boks 500 porsi paket gizi...
        </p>

        {/* Dynamic Nutri-Fact MMG Card */}
        <div id="pauseNutriFactCard" className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-3 mb-4 text-left font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
            <img src="/assets/refresh/v11/ui/icon_cargo.png" className="w-4 h-4 object-contain" alt="" />
            <span>INFO GIZI MMG KEMENKES RI</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Makanan Mantap Gurih (MMG) dirancang memenuhi 30–35% AKG (Angka Kecukupan Gizi) harian anak sekolah: ~650 kkal karbohidrat kompleks, protein hewani pencegah stunting, serat sayur, buah lokal, & susu murni.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            id="resumeBtn"
            onClick={onResume}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-fredoka text-base shadow-lg shadow-blue-500/25 active:scale-95 cursor-pointer transition-all"
          >
            LANJUTKAN [ESC]
          </button>
          <button
            id="pauseRestartBtn"
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 font-fredoka text-sm border border-slate-700 active:scale-95 cursor-pointer flex items-center justify-center gap-2 transition-all"
          >
            <img src="/assets/refresh/v11/ui/icon_restart.png" className="w-4 h-4 object-contain" alt="" />
            <span>ULANG DARI AWAL</span>
          </button>
          <button
            id="pauseMenuBtn"
            onClick={onMenu}
            className="w-full py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 font-fredoka text-sm border border-slate-700 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
          >
            <span>MENU UTAMA</span>
            <Home className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
