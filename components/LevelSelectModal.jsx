// components/LevelSelectModal.jsx
'use client';

import React from 'react';

export default function LevelSelectModal({
  currentUnlockedLevel = 1,
  levelStars = {},
  onSelectLevel = () => {},
  onClose = () => {}
}) {
  const levels = Array.from({ length: 20 }, (_, i) => {
    const lvl = i + 1;
    const baseDist = 800 + (lvl - 1) * 190;
    return {
      level: lvl,
      dist: baseDist,
      isUnlocked: lvl <= currentUnlockedLevel,
      stars: levelStars[lvl] || 0
    };
  });

  return (
    <div id="levelSelectModal" className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-3xl w-full bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col my-auto max-h-[92vh]">
        <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
          <div>
            <h2 className="font-fredoka text-xl sm:text-2xl text-cyan-300">
              PILIH LEVEL PERJALANAN 🗺️
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              20 Level Menuju Gerbang Puspa Bangsa Cirebon
            </p>
          </div>
          <button
            id="btnLevelSelectClose"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-fredoka text-sm border border-slate-600 active:scale-95 cursor-pointer"
          >
            KEMBALI ✕
          </button>
        </div>

        {/* 20 Levels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3 overflow-y-auto p-1 max-h-[68vh]">
          {levels.map((item) => {
            const isCurrent = item.level === currentUnlockedLevel;
            const starsText = item.stars === 3 ? '⭐⭐⭐' : item.stars === 2 ? '⭐⭐' : item.stars === 1 ? '⭐' : 'Belum Bintang';

            return (
              <div
                key={item.level}
                onClick={() => {
                  if (item.isUnlocked) onSelectLevel(item.level);
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all select-none ${
                  !item.isUnlocked
                    ? 'bg-slate-950/50 border-slate-800/80 opacity-50 cursor-not-allowed'
                    : isCurrent
                    ? 'bg-blue-950/70 border-cyan-400 shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-95'
                    : 'bg-slate-800/70 border-slate-700 hover:border-cyan-400/60 hover:bg-slate-800 cursor-pointer active:scale-95'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-fredoka font-bold text-sm sm:text-base text-white">
                    Level {item.level}
                  </span>
                  {!item.isUnlocked ? (
                    <span className="text-xs">🔒</span>
                  ) : (
                    <span className="text-xs text-amber-400">{starsText}</span>
                  )}
                </div>

                <div className="text-[10px] sm:text-xs text-slate-400 font-mono flex items-center justify-between mt-2 pt-1 border-t border-slate-700/50">
                  <span>📏 {item.dist}m</span>
                  {item.isUnlocked && (
                    <span className="text-cyan-300 font-bold">GAS ▶</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
