import React, { useEffect } from 'react';
import { GameButton } from '../widgets/GameButton';
import { Trophy3DIcon, Flame3DIcon } from '../widgets/GameIcons';
import { soundManager } from '../utils/soundEffects';

interface WelcomeScreenProps {
  trophies: number;
  streakDays: number;
  onPlayNow: () => void;
}

/**
 * Welcome / Log Out Splash Screen (mirrors screens/welcome_screen.dart)
 * - Royal blue vertical gradient background (#2B88D9 to #145DA0)
 * - Pulsing 3D Game Logo (glowing royal shield with 3D golden crown, crossed swords, and language icons)
 *   floating in the center with a smooth sine-wave hover animation
 * - Floating golden spark particles
 * - Massive, bouncy 3D green GameButton ("PLAY NOW") that enters the 4-Tab Main Shell
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  trophies,
  streakDays,
  onPlayNow,
}) => {
  useEffect(() => {
    document.body.dataset.state = 'title';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        soundManager.playTap();
        onPlayNow();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayNow]);

  return (
    <div
      data-testid="welcome-screen"
      style={{
        background: 'linear-gradient(180deg, #2B88D9 0%, #1B6EC2 50%, #145DA0 100%)',
      }}
      className="h-screen w-full overflow-hidden flex flex-col items-center justify-between py-8 px-5 relative select-none text-white"
    >
      {/* Ambient Floating Golden Spark Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[
          { left: '12%', top: '18%', size: 10, delay: '0s' },
          { left: '84%', top: '15%', size: 12, delay: '0.4s' },
          { left: '18%', top: '68%', size: 8, delay: '0.8s' },
          { left: '82%', top: '64%', size: 11, delay: '1.2s' },
          { left: '28%', top: '36%', size: 7, delay: '0.6s' },
          { left: '73%', top: '40%', size: 9, delay: '1.0s' },
        ].map((spark, idx) => (
          <div
            key={idx}
            style={{
              left: spark.left,
              top: spark.top,
              width: spark.size,
              height: spark.size,
              animationDelay: spark.delay,
              background: 'radial-gradient(circle, #FFF59D 0%, #FFB300 70%, transparent 100%)',
              boxShadow: '0 0 12px 2px rgba(255, 213, 79, 0.75)',
            }}
            className="absolute rounded-full animate-node-pulse"
          />
        ))}
      </div>

      {/* Top Player Status Strip */}
      <div className="w-full max-w-[420px] flex items-center justify-between z-10">
        <div
          style={{
            background: 'linear-gradient(180deg, #EF5350 0%, #E53935 60%, #C62828 100%)',
            borderBottom: '4px solid #AB000D',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
          className="h-10 px-3.5 rounded-[13px] border-2 border-[#FF8A80]/60 flex items-center gap-2"
        >
          <Flame3DIcon className="w-5 h-5" />
          <span
            style={{ textShadow: '0 2px 0 rgba(0,0,0,0.4)' }}
            className="text-base font-black tabular-nums"
          >
            {streakDays}/10
          </span>
        </div>

        <div
          style={{
            background: 'linear-gradient(180deg, #FFCA28 0%, #FFB300 60%, #FF8F00 100%)',
            borderBottom: '4px solid #C68400',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
          className="h-10 px-3.5 rounded-[13px] border-2 border-[#FFE082]/80 flex items-center gap-2"
        >
          <Trophy3DIcon className="w-5 h-5" />
          <span
            style={{ textShadow: '0 2px 0 rgba(0,0,0,0.4)' }}
            className="text-base font-black tabular-nums"
          >
            {trophies}
          </span>
        </div>
      </div>

      {/* Center Stage: Sine-Wave Hovering 3D Shield Emblem with Crown & Language Icons */}
      <div className="flex flex-col items-center justify-center z-10 my-auto">
        <div className="relative animate-tooltip-float flex flex-col items-center">
          {/* Outer Pulsing Aura Ring */}
          <div
            style={{
              background:
                'radial-gradient(circle, rgba(255, 213, 79, 0.42) 0%, rgba(43, 136, 217, 0) 70%)',
            }}
            className="w-64 h-64 sm:w-72 sm:h-72 rounded-full absolute -top-4 animate-node-pulse pointer-events-none"
          />

          {/* 3D Royal Shield + Golden Crown + Language Bubbles SVG */}
          <svg
            viewBox="0 0 240 240"
            className="w-52 h-52 sm:w-60 sm:h-60 drop-shadow-[0_14px_20px_rgba(0,0,0,0.45)] relative z-10"
            role="img"
            aria-label="Lingo Royale 3D Shield Logo with Crown and Language Icons"
          >
            <defs>
              <linearGradient id="welcomeGoldRim" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF59D" />
                <stop offset="45%" stopColor="#FFB300" />
                <stop offset="100%" stopColor="#C66900" />
              </linearGradient>
              <linearGradient id="welcomeShieldLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#42A5F5" />
                <stop offset="100%" stopColor="#1565C0" />
              </linearGradient>
              <linearGradient id="welcomeShieldRight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#76E81E" />
                <stop offset="100%" stopColor="#388E00" />
              </linearGradient>
              <linearGradient id="welcomeCrownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF176" />
                <stop offset="55%" stopColor="#FFC107" />
                <stop offset="100%" stopColor="#E65100" />
              </linearGradient>
            </defs>

            {/* Floating Language Pill Left ("BONJOUR" Speech Bubble) */}
            <g transform="translate(8, 52)">
              <rect
                x="0"
                y="0"
                width="68"
                height="30"
                rx="12"
                fill="#EBF4FA"
                stroke="#14365D"
                strokeWidth="3"
              />
              <text
                x="34"
                y="20"
                textAnchor="middle"
                fill="#14365D"
                fontSize="11"
                fontWeight="900"
                fontFamily="Nunito, sans-serif"
              >
                BONJOUR
              </text>
            </g>

            {/* Floating French Tricolor Emblem Right */}
            <g transform="translate(168, 52)">
              <rect
                x="0"
                y="0"
                width="62"
                height="30"
                rx="12"
                fill="#EBF4FA"
                stroke="#14365D"
                strokeWidth="3"
              />
              <rect x="8" y="6" width="15" height="18" rx="2" fill="#1565C0" />
              <rect x="23" y="6" width="15" height="18" fill="#FFFFFF" />
              <rect x="38" y="6" width="15" height="18" rx="2" fill="#E53935" />
            </g>

            {/* 3D Shield Drop Lip */}
            <path
              d="M120 44 L196 68 V130 C196 176 164 206 120 224 C76 206 44 176 44 130 V68 Z"
              fill="#5D3A00"
            />
            {/* 3D Gold Shield Outer Frame */}
            <path
              d="M120 36 L196 60 V122 C196 168 164 198 120 216 C76 198 44 168 44 122 V60 Z"
              fill="url(#welcomeGoldRim)"
              stroke="#4E2A00"
              strokeWidth="4"
            />

            {/* Split Shield Inner Faces: Royal Blue Left (PvP) + Duolingo Green Right (Lessons) */}
            <path
              d="M120 48 L56 68 V122 C56 160 82 186 120 202 Z"
              fill="url(#welcomeShieldLeft)"
            />
            <path
              d="M120 48 L184 68 V122 C184 160 158 186 120 202 Z"
              fill="url(#welcomeShieldRight)"
            />

            {/* Center Shield Divider & Emblem Star */}
            <line
              x1="120"
              y1="48"
              x2="120"
              y2="202"
              stroke="#FFF59D"
              strokeWidth="3"
            />
            <polygon
              points="120,88 130,110 154,113 136,130 141,154 120,142 99,154 104,130 86,113 110,110"
              fill="#FFD54F"
              stroke="#6D3B00"
              strokeWidth="3"
            />

            {/* 3D Golden Royal Crown Perched on Top of the Shield */}
            <g transform="translate(68, 4)">
              <polygon
                points="10,44 18,12 36,28 52,6 68,28 86,12 94,44"
                fill="url(#welcomeCrownGrad)"
                stroke="#5D2900"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <rect
                x="10"
                y="40"
                width="84"
                height="10"
                rx="5"
                fill="#FFB300"
                stroke="#5D2900"
                strokeWidth="3"
              />
              <circle cx="18" cy="10" r="5" fill="#FFF59D" stroke="#5D2900" strokeWidth="2" />
              <circle cx="52" cy="5" r="6" fill="#FF5252" stroke="#5D2900" strokeWidth="2" />
              <circle cx="86" cy="10" r="5" fill="#FFF59D" stroke="#5D2900" strokeWidth="2" />
            </g>
          </svg>
        </div>

        {/* 3D Game Title Lockup */}
        <h1
          style={{
            textShadow:
              '0 4px 0 #0D3B66, 0 8px 16px rgba(0, 0, 0, 0.45)',
          }}
          className="text-4xl sm:text-5xl font-black uppercase tracking-wider text-white text-center mt-2 leading-none"
        >
          LINGO ROYALE
        </h1>
        <p
          style={{ textShadow: '0 2px 0 rgba(0,0,0,0.35)' }}
          className="text-sm sm:text-base font-extrabold text-[#B3E5FC] tracking-wide mt-2 text-center"
        >
          French Lessons · 1v1 Clash Leagues · Lava Race
        </p>
      </div>

      {/* Bottom Massive Bouncy 3D Green "PLAY NOW" Button */}
      <div className="w-full max-w-[340px] flex flex-col items-center gap-3 z-10">
        <div className="w-full animate-node-pulse">
          <GameButton
            label="PLAY NOW"
            variant="green"
            fullWidth
            height={72}
            fontSize="1.85rem"
            testId="welcome-play-now-btn"
            onClick={onPlayNow}
          />
        </div>
        <span className="text-xs font-extrabold text-white/80 tracking-wide">
          Press Enter · Space · or Tap PLAY NOW
        </span>
      </div>
    </div>
  );
};
