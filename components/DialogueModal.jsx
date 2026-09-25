// components/DialogueModal.jsx
'use client';

import React, { useState } from 'react';
import {
  FaTruckFast,
  FaGraduationCap,
  FaFaceSmileWink,
  FaWrench,
  FaUserTie,
  FaUserShield,
  FaUser,
  FaForward,
  FaPlay,
  FaFlagCheckered
} from 'react-icons/fa6';

export default function DialogueModal({
  level = 1,
  dialogues = [],
  onComplete = () => {}
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!dialogues || dialogues.length === 0) return null;

  const currentLine = dialogues[currentIndex] || dialogues[0];

  const handleNext = () => {
    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const speakerAvatars = {
    'Tion': <FaTruckFast className="text-cyan-200" />,
    'Bu Yulie': <FaGraduationCap className="text-pink-300" />,
    'Husna': <FaFaceSmileWink className="text-yellow-300" />,
    'Zacky': <FaWrench className="text-amber-300" />,
    'Mang Ucup': <FaUserTie className="text-sky-300" />,
    'Pak RT': <FaUserShield className="text-emerald-300" />
  };

  const avatar = speakerAvatars[currentLine.speaker] || <FaUser className="text-slate-300" />;

  return (
    <div id="dialogueModal" className="absolute inset-0 z-40 bg-slate-950/75 backdrop-blur-sm flex items-end justify-center p-3 sm:p-6 pb-6 sm:pb-8">
      <div className="max-w-2xl w-full bg-slate-900/95 border-2 border-cyan-500/70 rounded-3xl p-4 sm:p-5 shadow-2xl flex items-center gap-4">
        {/* Character Portrait Avatar */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-cyan-600 to-blue-900 border-2 border-cyan-300 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
          <span id="dialogueAvatar">{avatar}</span>
        </div>

        {/* Dialogue Box */}
        <div className="flex-1 flex flex-col justify-between w-full min-h-[90px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span id="dialogueSpeakerName" className="font-fredoka text-lg text-amber-300 drop-shadow">
                {currentLine.speaker}
              </span>
              <span id="dialogueLevelBadge" className="text-[10px] text-cyan-300 font-mono bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded-full">
                LEVEL {level} • {currentIndex + 1}/{dialogues.length}
              </span>
            </div>
            <p id="dialogueText" className="text-xs sm:text-sm text-slate-200 leading-relaxed min-h-[44px]">
              {currentLine.text}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-800">
            <button
              id="dialogueSkipBtn"
              onClick={onComplete}
              className="py-1 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-fredoka text-xs border border-slate-700 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>LEWATI / SKIP</span>
              <FaForward className="text-[10px]" />
            </button>
            <button
              id="dialogueNextBtn"
              onClick={handleNext}
              className="py-1.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-fredoka text-sm shadow active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {currentIndex < dialogues.length - 1 ? (
                <>
                  <span>LANJUT</span>
                  <FaPlay className="text-[10px]" />
                </>
              ) : (
                <>
                  <span>MULAI GAS!</span>
                  <FaFlagCheckered className="text-xs" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
