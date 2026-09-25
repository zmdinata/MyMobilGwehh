// components/MainMenuModal.jsx
'use client';

import React from 'react';
import {
  Coins,
  Truck,
  Map,
  Wrench,
  BookOpen
} from 'lucide-react';

export default function MainMenuModal({
  currentLevel = 1,
  coins = 0,
  onStartStory = () => {},
  onOpenLevelSelect = () => {},
  onOpenGarage = () => {},
  onOpenLore = () => {}
}) {
  return (
    <div id="mainMenuModal" className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-lg w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center my-auto">
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Badge row */}
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-500/20 border border-blue-400/60 text-sky-300 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
            MBG Story Mode: 20 Level
          </span>
        </div>

        {/* Official Game Logo Image (High-Res PNG) */}
        <img
          id="mainMenuLogo"
          src="/assets/refresh/v11/sprites/logo.png"
          alt="MBG: Road To School"
          className="w-48 sm:w-56 h-auto max-h-32 object-contain drop-shadow-[0_8px_20px_rgba(13,43,82,0.7)] mb-2"
        />
        <h1 className="font-fredoka text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-amber-300 drop-shadow mb-1">
          MBG: Road To School
        </h1>
        <p className="text-xs text-slate-300 font-mono mb-4">
          Kisah Cinta & Misi Antar 500 Porsi Gizi Mas Tion Menuju Bu Yulie
        </p>

        {/* Player Save Status Bar */}
        <div className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-3 mb-5 flex items-center justify-between text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Progres:</span>
            <span className="text-cyan-300 font-bold">Level <span id="menuCurrentLevel">{currentLevel}</span> / 20</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Coins className="text-amber-400 w-4 h-4" />
            <span id="menuCoinCount">{coins}</span> Koin Gizi
          </div>
        </div>

        {/* Menu Navigation Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            id="btnStoryContinue"
            onClick={onStartStory}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-fredoka text-lg sm:text-xl shadow-lg shadow-blue-500/30 transform active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>MULAI CERITA</span>
            <Truck className="w-5 h-5" />
          </button>

          <button
            id="btnLevelSelect"
            onClick={onOpenLevelSelect}
            className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/90 text-cyan-300 font-fredoka text-base sm:text-lg border border-cyan-500/40 shadow-md transform active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>PILIH LEVEL (1 - 20)</span>
            <Map className="w-5 h-5 text-cyan-400" />
          </button>

          <button
            id="btnGarage"
            onClick={onOpenGarage}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-fredoka text-base sm:text-lg shadow-lg shadow-amber-500/30 transform active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>GARASI ZACKY (UPGRADE & SKIN)</span>
            <Wrench className="w-4 h-4 text-slate-950" />
          </button>

          <button
            id="btnHowToPlay"
            onClick={onOpenLore}
            className="w-full py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-400 font-fredoka text-xs sm:text-sm border border-slate-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <BookOpen className="text-cyan-400 w-3.5 h-3.5" />
            <span>PANDUAN KONTROL & KISAH MAS TION</span>
          </button>
        </div>
      </div>
    </div>
  );
}
