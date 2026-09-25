// components/WelcomeModal.jsx
'use client';

import React from 'react';
import {
  Target,
  AlertTriangle,
  Monitor,
  Smartphone,
  Truck
} from 'lucide-react';

export default function WelcomeModal({ onStart = () => {} }) {
  return (
    <div id="startModal" className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-cyan-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
        {/* Glow ambient backgrounds */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Badge row */}
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Unit Antar Pangan & Gizi
          </span>
          <span className="bg-amber-500/20 border border-amber-400/60 text-amber-300 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Cirebon - Kuningan
          </span>
        </div>

        {/* Official Game Logo Image */}
        <img
          id="gameLogo"
          src="/assets/refresh/v11/sprites/logo.png"
          alt="MBG: Road To School"
          className="w-48 sm:w-56 h-auto max-h-36 object-contain drop-shadow-[0_10px_25px_rgba(13,43,82,0.8)] mb-2"
        />
        <h1 id="gameLogoFallback" className="sr-only">MBG: Road To School</h1>
        <p className="text-xs sm:text-sm text-cyan-200 font-mono tracking-wide mb-4">
          MBG (My Mobil Gweh) - Misi Antar 500 Porsi Gizi Hangat
        </p>

        {/* Story Narrative Box */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-300 leading-relaxed text-left space-y-2 mb-4 w-full">
          <p>
            <b className="text-cyan-300">Kisah Mas Tion:</b> Driver muda tangguh armada MBG yang berjuang mengantar <b>500 porsi</b> paket gizi hangat demi Bu Yulie dan siswa-siswi <b>SD, SMP, dan SMA Puspa Bangsa Cirebon</b>, didampingi petuah bijak sang legenda supir elf Pantura, <b>Mang Abdul</b>!
          </p>
          <p className="flex items-start gap-2">
            <Target className="text-rose-400 w-4 h-4 mt-0.5 shrink-0" />
            <span>
              <b className="text-white">Misi Kamu:</b> Antar <b>500 porsi paket gizi hangat</b> (nasi pulen, ayam serundeng, tahu-tempe orek, sayur lodeh, dan susu murni) menuju kawasan sekolah fiktif <b>SD, SMP, dan SMA Puspa Bangsa Cirebon</b> sebelum bel masuk berbunyi tepat pukul <b>09:45 WIB!</b>
            </span>
          </p>
          <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-2.5 text-left text-xs text-emerald-200 flex items-start gap-2 shadow-inner">
            <img
              src="/assets/refresh/v11/ui/icon_cargo.png"
              className="w-5 h-5 object-contain shrink-0 mt-0.5 drop-shadow"
              alt="Gizi"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div>
              <b className="text-emerald-300 block font-fredoka">Standar Gizi Isi Piringku Kemenkes RI (~650–700 kkal):</b>
              <span className="text-[11px] text-emerald-100/90 leading-tight block mt-0.5">
                Karbohidrat kompleks, protein hewani pencegah stunting, protein nabati, aneka sayuran kaya serat, buah lokal manis, dan susu murni Kuningan untuk stamina belajar murid-murid!
              </span>
            </div>
          </div>
          <p className="text-amber-200/90 text-[11px] sm:text-xs flex items-center gap-1.5">
            <AlertTriangle className="text-amber-400 shrink-0 w-3.5 h-3.5" />
            <span>Hati-hati: Rob Pantura licin, kubangan lumpur sawah seret, dan balok kayu gunung bisa merontokkan sayur lodeh!</span>
          </p>
        </div>

        {/* Controls Guide */}
        <div className="grid grid-cols-2 gap-2 w-full text-[11px] sm:text-xs mb-5">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-2.5 text-left">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
              <Monitor className="text-cyan-400 w-4 h-4" /> Desktop Web
            </span>
            <span className="text-slate-300 block">Gas / Pitch Up: <b>[D] / [→]</b></span>
            <span className="text-slate-300 block">Rem / Pitch Down: <b>[A] / [←]</b></span>
            <span className="text-slate-300 block">Telolet: <b>[H] / [Spasi]</b> | Reset: <b>[R]</b></span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-2.5 text-left">
            <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
              <Smartphone className="text-amber-400 w-4 h-4" /> HP / Mobile Touch
            </span>
            <span className="text-slate-300 block">Pedal Kanan: <b>Gas / Pitch Up</b></span>
            <span className="text-slate-300 block">Pedal Kiri: <b>Rem / Pitch Down</b></span>
            <span className="text-slate-300 block">Tombol Tengah: <b>Klakson Telolet</b></span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mb-4 max-w-md">
          *Disclaimer: Game dan sekolah Puspa Bangsa (SD, SMP, SMA) adalah fiktif untuk hiburan dan edukasi gizi; tidak berafiliasi dengan institusi nyata.
        </p>

        {/* Start Game Action Button */}
        <button
          id="btnStartGame"
          onClick={onStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-fredoka text-lg sm:text-xl shadow-lg shadow-blue-500/30 transform active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>MASUK KE MENU UTAMA (TAP TO START)</span>
          <Truck className="w-5 h-5" />
        </button>
        <span className="text-[10px] text-slate-400 font-mono mt-2">
          [ Sentuh layar atau klik tombol untuk mengaktifkan audio & masuk Menu Utama ]
        </span>
      </div>
    </div>
  );
}
