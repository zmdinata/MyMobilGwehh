// components/VictoryModal.jsx
'use client';

import React from 'react';
import {
  FaTrophy,
  FaStar,
  FaCoins,
  FaForward,
  FaRotateRight,
  FaHouse
} from 'react-icons/fa6';

export default function VictoryModal({
  stars = 3,
  cargoIntegrity = 100,
  timeTaken = '01:15',
  coinsEarned = 50,
  onNextLevel = () => {},
  onReplay = () => {},
  onMenu = () => {}
}) {
  return (
    <div id="victoryModal" className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        <FaTrophy className="text-4xl sm:text-5xl text-yellow-400 mx-auto mb-2 drop-shadow-lg" />
        <h2 className="font-fredoka text-2xl sm:text-3xl text-emerald-400 drop-shadow mb-1">
          MISI BERHASIL!
        </h2>
        <p className="text-xs text-slate-300 font-mono mb-2">
          500 Porsi Paket Gizi Hangat Tiba di Puspa Bangsa!
        </p>

        {/* Food Parcel Icon */}
        <div className="flex justify-center mb-2">
          <img
            id="vicFoodParcel"
            src="/assets/refresh/v11/sprites/food_parcel.png"
            alt="Paket Gizi Hangat"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>

        {/* Star Rating */}
        <div id="vicStars" className="flex justify-center items-center gap-2 text-2xl sm:text-3xl text-amber-400 mb-3">
          {Array.from({ length: stars }).map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>

        <p className="text-xs text-slate-300 mb-4 italic">
          "Siswa-siswi bersorak gembira mengacungkan sendok gizi! Bu Yulie tersenyum bangga menyambut Mas Tion sang pahlawan katering MBG binaan Mang Ucup!"
        </p>

        {/* Victory Score Card */}
        <div className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-4 mb-4 text-xs sm:text-sm space-y-2 text-left font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Keutuhan Kargo:</span>
            <span id="vicCargo" className="text-emerald-400 font-bold">{Math.round(cargoIntegrity)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Waktu Tempuh:</span>
            <span id="vicTime" className="text-cyan-300 font-bold">{timeTaken}</span>
          </div>
          <div className="flex justify-between border-t border-slate-700 pt-1 text-amber-400 font-bold">
            <span>Koin Gizi Diperoleh:</span>
            <span id="vicCoins" className="flex items-center gap-1">
              <span>+{coinsEarned}</span>
              <FaCoins className="text-amber-400 text-xs" />
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            id="vicNextBtn"
            onClick={onNextLevel}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-fredoka text-base sm:text-lg font-bold shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>LANJUT TRAYEK BERIKUTNYA</span>
            <FaForward className="text-sm" />
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="vicRestartBtn"
              onClick={onReplay}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-fredoka text-xs border border-slate-700 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>ULANG LEVEL</span>
              <FaRotateRight className="text-[10px]" />
            </button>
            <button
              onClick={onMenu}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-fredoka text-xs border border-slate-700 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>MENU UTAMA</span>
              <FaHouse className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
