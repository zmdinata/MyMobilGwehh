// components/CharacterAvatar.jsx
'use client';

import React from 'react';

export function getCharacterAvatarSvg(speaker = 'Tion', mood = 'normal') {
  const s = String(speaker).toLowerCase();
  const m = String(mood).toLowerCase();

  // 1. Tion (Protagonis / Driver Muda)
  if (s.includes('tion') || s.includes('supir')) {
    const isBlush = m.includes('blush') || m.includes('shy') || m.includes('salting');
    const isFocus = m.includes('focus') || m.includes('drive') || m.includes('menanjak');
    return `
      <svg viewBox="0 0 120 120" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="tionBg" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.05"/>
          </radialGradient>
          <linearGradient id="tionShirt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#2563eb"/>
            <stop offset="100%" stop-color="#1e40af"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="url(#tionBg)" stroke="#38bdf8" stroke-width="2"/>
        <path d="M22 114 C24 92 36 84 60 84 C84 84 96 92 98 114 Z" fill="url(#tionShirt)" stroke="#0d2b52" stroke-width="2.5"/>
        <polygon points="60,84 46,96 52,106 60,94 68,106 74,96" fill="#0d2b52"/>
        <polygon points="56,86 60,92 64,86" fill="#fef3c7"/>
        <circle cx="78" cy="100" r="4.5" fill="#f59e0b" stroke="#b45309" stroke-width="1"/>
        <path d="M78 97 C76 99 76 102 78 103 C80 102 80 99 78 97 Z" fill="#fef3c7"/>
        <rect x="52" y="70" width="16" height="18" fill="#f4b28c" stroke="#0d2b52" stroke-width="2"/>
        <ellipse cx="60" cy="56" rx="22" ry="24" fill="#f4b28c" stroke="#0d2b52" stroke-width="2.5"/>
        <circle cx="38" cy="56" r="5" fill="#f4b28c" stroke="#0d2b52" stroke-width="2"/>
        <circle cx="82" cy="56" r="5" fill="#f4b28c" stroke="#0d2b52" stroke-width="2"/>
        <path d="M37 50 C36 32 46 22 60 22 C74 22 84 32 83 50 C80 40 74 38 68 38 C62 38 58 35 52 38 C46 38 40 42 37 50 Z" fill="#0f172a" stroke="#0d2b52" stroke-width="2.5"/>
        <path d="M48 38 L54 44 L60 38 L66 45" fill="none" stroke="#0f172a" stroke-width="2"/>
        ${isFocus
          ? '<path d="M44 48 L55 51" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round"/><path d="M76 48 L65 51" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round"/>'
          : '<path d="M44 49 Q50 46 56 49" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M64 49 Q70 46 76 49" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" fill="none"/>'
        }
        <circle cx="50" cy="55" r="3.2" fill="#0f172a"/>
        <circle cx="70" cy="55" r="3.2" fill="#0f172a"/>
        <circle cx="51" cy="54" r="1" fill="#ffffff"/>
        <circle cx="71" cy="54" r="1" fill="#ffffff"/>
        <path d="M60 55 L58 60 L62 60" fill="none" stroke="#d97706" stroke-width="1.8" stroke-linecap="round"/>
        ${isBlush
          ? '<path d="M54 66 Q60 69 66 66" fill="none" stroke="#991b1b" stroke-width="2.5" stroke-linecap="round"/>'
          : isFocus
          ? '<path d="M52 66 L68 65" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>'
          : '<path d="M53 65 Q60 72 67 65" fill="#991b1b" stroke="#0d2b52" stroke-width="2" stroke-linecap="round"/>'
        }
        ${isBlush
          ? '<ellipse cx="44" cy="62" rx="6" ry="3.5" fill="#f43f5e" opacity="0.6"/><ellipse cx="76" cy="62" rx="6" ry="3.5" fill="#f43f5e" opacity="0.6"/><path d="M42 61 L46 63 M74 61 L78 63" stroke="#e11d48" stroke-width="1.5"/>'
          : ''
        }
        ${isFocus
          ? '<path d="M78 44 C76 40 80 38 81 42 C82 45 79 46 78 44 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1"/>'
          : ''
        }
      </svg>`;
  }

  // 2. Bu Yulie (Ibu Guru)
  if (s.includes('yulie') || s.includes('guru')) {
    const isConcern = m.includes('concern') || m.includes('worry') || m.includes('khawatir');
    const isHappy = m.includes('happy') || m.includes('joy') || m.includes('gembira');
    return `
      <svg viewBox="0 0 120 120" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="yulieBg" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stop-color="#fbcfe8" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.05"/>
          </radialGradient>
          <linearGradient id="hijabGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#7dd3fc"/>
            <stop offset="100%" stop-color="#0284c7"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="url(#yulieBg)" stroke="#f472b6" stroke-width="2"/>
        <path d="M24 114 C26 86 38 74 60 74 C82 74 94 86 96 114 Z" fill="url(#hijabGrad)" stroke="#0d2b52" stroke-width="2.5"/>
        <polygon points="60,94 48,114 72,114" fill="#0d2b52"/>
        <circle cx="60" cy="98" r="3.5" fill="#f59e0b" stroke="#b45309" stroke-width="1"/>
        <path d="M34 56 C34 32 44 20 60 20 C76 20 86 32 86 56 C86 78 74 86 60 86 C46 86 34 78 34 56 Z" fill="url(#hijabGrad)" stroke="#0d2b52" stroke-width="2.5"/>
        <ellipse cx="60" cy="52" rx="19" ry="22" fill="#fef3c7"/>
        <ellipse cx="60" cy="55" rx="16" ry="19" fill="#fed7aa" stroke="#0d2b52" stroke-width="2"/>
        ${isConcern
          ? '<path d="M46 47 Q52 50 56 48" stroke="#78350f" stroke-width="2" fill="none"/><path d="M64 48 Q68 50 74 47" stroke="#78350f" stroke-width="2" fill="none"/>'
          : '<path d="M46 48 Q51 45 56 48" stroke="#78350f" stroke-width="2" fill="none"/><path d="M64 48 Q69 45 74 48" stroke="#78350f" stroke-width="2" fill="none"/>'
        }
        ${isHappy
          ? '<path d="M47 55 Q51 51 55 55" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M65 55 Q69 51 73 55" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
          : '<circle cx="51" cy="54" r="3" fill="#0f172a"/><circle cx="69" cy="54" r="3" fill="#0f172a"/><circle cx="52" cy="53" r="1.1" fill="#ffffff"/><circle cx="70" cy="53" r="1.1" fill="#ffffff"/><path d="M48 51 L46 50 M72 51 L74 50" stroke="#0f172a" stroke-width="1.5"/>'
        }
        <path d="M60 55 L59 59 L61 59" fill="none" stroke="#d97706" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M54 65 Q60 70 66 65" fill="#f43f5e" stroke="#0d2b52" stroke-width="1.8" stroke-linecap="round"/>
        <ellipse cx="46" cy="61" rx="4" ry="2.5" fill="#fda4af" opacity="0.6"/>
        <ellipse cx="74" cy="61" rx="4" ry="2.5" fill="#fda4af" opacity="0.6"/>
      </svg>`;
  }

  // 3. Husna (Siswi SMA Puspa Bangsa)
  if (s.includes('husna') || s.includes('siswi')) {
    const isFlirt = m.includes('flirt') || m.includes('wink') || m.includes('jahil') || m.includes('tease');
    const isCheer = m.includes('cheer') || m.includes('happy') || m.includes('semangat');
    return `
      <svg viewBox="0 0 120 120" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="husnaBg" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stop-color="#fef08a" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#eab308" stop-opacity="0.05"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="url(#husnaBg)" stroke="#facc15" stroke-width="2"/>
        <circle cx="86" cy="40" r="8" fill="#e66b5d" stroke="#0d2b52" stroke-width="2"/>
        <path d="M86 42 C98 48 102 62 94 74 C90 66 90 54 86 46 Z" fill="#0f172a" stroke="#0d2b52" stroke-width="2"/>
        <path d="M26 114 C28 92 40 84 60 84 C80 84 92 92 94 114 Z" fill="#ffffff" stroke="#0d2b52" stroke-width="2.5"/>
        <polygon points="60,86 52,98 56,114 64,114 68,98" fill="#0d2b52"/>
        <rect x="53" y="72" width="14" height="15" fill="#fbcfe8" stroke="#0d2b52" stroke-width="2"/>
        <ellipse cx="60" cy="56" rx="21" ry="23" fill="#fbcfe8" stroke="#0d2b52" stroke-width="2.5"/>
        <path d="M38 52 C36 34 46 24 60 24 C74 24 82 34 82 52 C76 42 70 38 62 42 C56 46 48 40 38 52 Z" fill="#0f172a" stroke="#0d2b52" stroke-width="2.5"/>
        <path d="M45 47 Q50 44 55 47" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M65 47 Q70 44 75 47" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        ${isFlirt
          ? '<circle cx="50" cy="54" r="3.2" fill="#0f172a"/><circle cx="51" cy="53" r="1.1" fill="#ffffff"/><path d="M66 54 Q71 50 76 54" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" fill="none"/>'
          : isCheer
          ? '<polygon points="50,50 52,55 57,55 53,58 55,63 50,60 45,63 47,58 43,55 48,55" fill="#f59e0b"/><polygon points="70,50 72,55 77,55 73,58 75,63 70,60 65,63 67,58 63,55 68,55" fill="#f59e0b"/>'
          : '<circle cx="50" cy="54" r="3.2" fill="#0f172a"/><circle cx="70" cy="54" r="3.2" fill="#0f172a"/><circle cx="51" cy="53" r="1.1" fill="#ffffff"/><circle cx="71" cy="53" r="1.1" fill="#ffffff"/>'
        }
        <circle cx="60" cy="59" r="1.5" fill="#f43f5e"/>
        ${isFlirt || isCheer
          ? '<path d="M52 65 Q60 74 68 65 Z" fill="#e11d48" stroke="#0d2b52" stroke-width="2"/>'
          : '<path d="M54 65 Q60 70 66 65" fill="none" stroke="#e11d48" stroke-width="2.2" stroke-linecap="round"/>'
        }
        <ellipse cx="44" cy="62" rx="5" ry="3" fill="#fb7185" opacity="0.6"/>
        <ellipse cx="76" cy="62" rx="5" ry="3" fill="#fb7185" opacity="0.6"/>
      </svg>`;
  }

  // 4. Zacky (Montir Jenius)
  if (s.includes('zacky') || s.includes('montir')) {
    const isThinking = m.includes('think') || m.includes('analisis');
    return `
      <svg viewBox="0 0 120 120" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="zackyBg" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stop-color="#fb923c" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#ea580c" stop-opacity="0.05"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="url(#zackyBg)" stroke="#f97316" stroke-width="2"/>
        <path d="M22 114 C24 92 36 84 60 84 C84 84 96 92 98 114 Z" fill="#475569" stroke="#0d2b52" stroke-width="2.5"/>
        <path d="M22 114 C26 94 36 86 52 86 L48 114 Z" fill="#0d2b52"/>
        <path d="M98 114 C94 94 84 86 68 86 L72 114 Z" fill="#0d2b52"/>
        <rect x="74" y="90" width="6" height="20" rx="2" fill="#cbd5e1" stroke="#0d2b52" stroke-width="1.5" transform="rotate(15 77 100)"/>
        <circle cx="75" cy="92" r="5" fill="none" stroke="#cbd5e1" stroke-width="2.5"/>
        <rect x="52" y="70" width="16" height="18" fill="#f4b28c" stroke="#0d2b52" stroke-width="2"/>
        <ellipse cx="60" cy="56" rx="22" ry="24" fill="#f4b28c" stroke="#0d2b52" stroke-width="2.5"/>
        <ellipse cx="44" cy="62" rx="5" ry="3" fill="#334155" opacity="0.6" transform="rotate(-15 44 62)"/>
        <circle cx="38" cy="56" r="5" fill="#f4b28c" stroke="#0d2b52" stroke-width="2"/>
        <circle cx="82" cy="56" r="5" fill="#f4b28c" stroke="#0d2b52" stroke-width="2"/>
        <path d="M37 46 C37 28 47 22 60 22 C73 22 83 28 83 46 Z" fill="#0d2b52" stroke="#0d2b52" stroke-width="2.5"/>
        <path d="M48 44 Q60 38 72 44" fill="#0369a1" stroke="#0d2b52" stroke-width="2"/>
        <ellipse cx="60" cy="45" rx="5" ry="3" fill="#f4b28c"/>
        <path d="M36 50 L32 54 L38 56 M84 50 L88 54 L82 56" stroke="#0f172a" stroke-width="2.5" fill="none"/>
        ${isThinking
          ? '<path d="M44 46 L55 49" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/><path d="M65 48 L76 45" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>'
          : '<path d="M44 48 Q50 45 56 48" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M64 48 Q70 45 76 48" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none"/>'
        }
        <circle cx="50" cy="54" r="3.2" fill="#0f172a"/>
        <circle cx="70" cy="54" r="3.2" fill="#0f172a"/>
        <circle cx="51" cy="53" r="1.1" fill="#ffffff"/>
        <circle cx="71" cy="53" r="1.1" fill="#ffffff"/>
        <path d="M60 54 L58 60 L62 60" fill="none" stroke="#d97706" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M52 66 Q62 70 69 64" fill="none" stroke="#0d2b52" stroke-width="2.5" stroke-linecap="round"/>
      </svg>`;
  }

  // 5. Default / Mang Abdul (Sopir Senior Veteran)
  return `
    <svg viewBox="0 0 120 120" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="abdulBg" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#a3e635" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#4d7c0f" stop-opacity="0.05"/>
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="54" fill="url(#abdulBg)" stroke="#84cc16" stroke-width="2"/>
      <path d="M22 114 C24 92 36 84 60 84 C84 84 96 92 98 114 Z" fill="#854d0e" stroke="#0d2b52" stroke-width="2.5"/>
      <polygon points="60,84 50,98 60,114 70,98" fill="#713f12"/>
      <rect x="52" y="70" width="16" height="18" fill="#e2a374" stroke="#0d2b52" stroke-width="2"/>
      <ellipse cx="60" cy="56" rx="22" ry="24" fill="#e2a374" stroke="#0d2b52" stroke-width="2.5"/>
      <polygon points="34,44 42,22 78,22 86,44" fill="#78350f" stroke="#0d2b52" stroke-width="2.5"/>
      <line x1="35" y1="42" x2="85" y2="42" stroke="#f59e0b" stroke-width="3"/>
      <circle cx="38" cy="56" r="5" fill="#e2a374" stroke="#0d2b52" stroke-width="2"/>
      <circle cx="82" cy="56" r="5" fill="#e2a374" stroke="#0d2b52" stroke-width="2"/>
      <path d="M44 48 Q50 44 56 47" stroke="#475569" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M64 47 Q70 44 76 48" stroke="#475569" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <circle cx="50" cy="53" r="3" fill="#0f172a"/>
      <circle cx="70" cy="53" r="3" fill="#0f172a"/>
      <path d="M43 53 L45 54 M75 53 L77 54" stroke="#78350f" stroke-width="1.5"/>
      <ellipse cx="60" cy="58" rx="3.5" ry="2.5" fill="#c2410c"/>
      <path d="M45 66 C50 63 56 64 60 66 C64 64 70 63 75 66 C72 70 62 70 60 67 C58 70 48 70 45 66 Z" fill="#1e293b" stroke="#0d2b52" stroke-width="1.5"/>
      <path d="M53 71 Q60 75 67 71" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
}

export default function CharacterAvatar({ speaker = 'Tion', mood = 'normal', className = 'w-full h-full' }) {
  const svgMarkup = getCharacterAvatarSvg(speaker, mood);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}
