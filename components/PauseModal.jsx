// components/PauseModal.jsx
'use client';

import React from 'react';
import { FaPause, FaHouse } from 'react-icons/fa6';

export default function PauseModal({
  onResume = () => {},
  onRestart = () => {},
  onMenu = () => {}
}) {
  return (
    <div id="pauseModal" className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 text-center max-w-xs w-full shadow-2xl">
        <h3 className="font-fredoka text-2xl text-cyan-300 mb-2 flex items-center justify-center gap-2">
          <FaPause className="text-lg text-cyan-400" />
          <span>GAME DI-JEDA</span>
        </h3>
        <p className="text-xs text-slate-400 mb-5 font-mono">
          Mas Tion sedang mengatur napas dan memeriksa ikatan rantang gizi...
        </p>

        <div className="flex flex-col gap-2">
          <button
            id="resumeBtn"
            onClick={onResume}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-fredoka text-base shadow active:scale-95 cursor-pointer"
          >
            LANJUTKAN [ESC]
          </button>
          <button
            id="pauseRestartBtn"
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-fredoka text-sm border border-slate-700 active:scale-95 cursor-pointer"
          >
            ULANG DARI AWAL
          </button>
          <button
            id="pauseMenuBtn"
            onClick={onMenu}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-fredoka text-sm border border-slate-700 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>MENU UTAMA</span>
            <FaHouse className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
