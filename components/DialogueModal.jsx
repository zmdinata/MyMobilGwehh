// components/DialogueModal.jsx
'use client';

import React, { useState } from 'react';
import {
  Truck,
  GraduationCap,
  Smile,
  Wrench,
  UserCheck,
  ShieldCheck,
  User,
  FastForward,
  Play,
  Flag
} from 'lucide-react';

import CharacterAvatar from './CharacterAvatar';

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

  return (
    <div id="dialogueModal" className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-end justify-center p-3 sm:p-6 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] pointer-events-auto">
      <div className="max-w-2xl w-full bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/80 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Character Portrait Avatar (Vector SVG Comic Art) */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-800 border-2 border-amber-400/60 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
          <span id="dialogueAvatar" className="w-full h-full flex items-center justify-center">
            <CharacterAvatar speaker={currentLine.speaker} mood={currentLine.mood} className="w-full h-full" />
          </span>
        </div>

        {/* Dialogue Box */}
        <div className="flex-1 flex flex-col justify-between w-full min-h-[90px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span id="dialogueSpeakerName" className="font-fredoka text-lg text-amber-300 drop-shadow">
                {currentLine.speaker} {currentLine.role && <span className="text-xs text-slate-400 font-mono font-normal">({currentLine.role})</span>}
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
              <FastForward className="w-3.5 h-3.5" />
            </button>
            <button
              id="dialogueNextBtn"
              onClick={handleNext}
              className="py-1.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-fredoka text-sm shadow active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {currentIndex < dialogues.length - 1 ? (
                <>
                  <span>LANJUT</span>
                  <Play className="w-3 h-3 fill-white" />
                </>
              ) : (
                <>
                  <span>MULAI GAS!</span>
                  <Flag className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
