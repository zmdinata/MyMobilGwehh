// components/GameOverModal.jsx
'use client';

import React from 'react';
import {
  AlertOctagon,
  Fuel,
  Clock,
  Utensils,
  RotateCcw,
  Home
} from 'lucide-react';

export default function GameOverModal({
  reason = 'ROLLOVER',
  distance = 0,
  coinsEarned = 0,
  cargoLeft = 0,
  onRestart = () => {},
  onMenu = () => {}
}) {
  let iconComponent = <AlertOctagon className="w-12 h-12 text-red-500 mx-auto mb-2 drop-shadow-lg" />;
  let title = 'MOBIL GWEH TERGULING';
  let subtitle = 'Omprengmu telah tumpah!';
  let desc = 'MOBIL GWEH TERGULING! Atap truk menghantam tanah, boks toska ambyar, 500 botol susu meletus, kuah sayur lodeh tumpah ambyar ke layar kaca, dan Mas Tion terduduk lemas meratapi rantang gizi yang berserakan di depan Mang Ucup!';

  if (reason === 'FUEL') {
    iconComponent = <Fuel className="w-12 h-12 text-amber-500 mx-auto mb-2 drop-shadow-lg" />;
    title = 'BENSIN LUDES!';
    subtitle = 'Mogok di Tanjakan Curam!';
    desc = 'Bensin habis saat menanjak bukit curam! Truk melorot mundur tak terkendali diiringi sorakan riang warga kampung yang menonton!';
  } else if (reason === 'DEADLINE') {
    iconComponent = <Clock className="w-12 h-12 text-orange-500 mx-auto mb-2 drop-shadow-lg" />;
    title = 'TELAT! BEL SUDAH BUNYI!';
    subtitle = 'Melewati Pukul 09:45 WIB!';
    desc = 'Waktu habis tepat pukul 09:45 WIB! Siswa lemas kelaparan di depan gerbang Puspa Bangsa, dan Mas Tion harus menanggung malu di hadapan Bu Yulie!';
  } else if (reason === 'CARGO') {
    iconComponent = <Utensils className="w-12 h-12 text-rose-500 mx-auto mb-2 drop-shadow-lg" />;
    title = 'PAKET GIZI HANCUR!';
    subtitle = 'Integritas Muatan 0%!';
    desc = 'Integritas muatan menyentuh 0%! Tahu-tempe orek dan sayur lodeh gurih berceceran ambyar jadi bubur jalanan akibat guncangan ekstrem!';
  }

  return (
    <div id="gameOverModal" className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-red-500 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        <div id="goIcon">{iconComponent}</div>
        <h2 id="goTitle" className="font-fredoka text-2xl sm:text-3xl text-red-500 drop-shadow mb-1">
          {title}
        </h2>
        <p id="goSubtitle" className="text-xs text-red-300 font-mono mb-3">
          {subtitle}
        </p>

        <p id="goDesc" className="text-xs sm:text-sm text-slate-300 mb-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700 leading-relaxed text-left">
          {desc}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-mono">
          <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">JARAK</span>
            <span id="goDist" className="font-bold text-cyan-300">{Math.round(distance)}m</span>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">KOIN</span>
            <span id="goCoins" className="font-bold text-amber-300">+{coinsEarned}</span>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">SISA GIZI</span>
            <span id="goCargo" className="font-bold text-emerald-300">{Math.round(cargoLeft)}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            id="goRestartBtn"
            onClick={onRestart}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-fredoka text-base sm:text-lg font-bold shadow-lg shadow-red-500/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>GAS LAGI DARI AWAL!</span>
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            id="goMenuBtn"
            onClick={onMenu}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-fredoka text-xs sm:text-sm border border-slate-700 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>KEMBALI KE MENU UTAMA</span>
            <Home className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
