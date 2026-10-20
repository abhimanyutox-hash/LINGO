import React, { useState } from 'react';
import { GameCard } from '../widgets/GameCard';
import { GameButton } from '../widgets/GameButton';
import { Trophy3DIcon } from '../widgets/GameIcons';
import { LavaGameScreen } from './LavaGameScreen';
import { DoorRunnerScreen } from './DoorRunnerScreen';

interface GamesTabProps {
  lavaHighScore: number;
  doorRunnerHighScore: number;
  onSaveGameScore: (
    gameType: 'lava_race' | 'door_runner',
    score: number,
    xpEarned: number
  ) => void;
}

/**
 * Tab 3: Mini Games Screen (mirrors screens/games_tab.dart)
 * Features two fully playable 60-FPS arcade games:
 * 1. "DOOR DASH RUNNER!" — 3-Lane 3D perspective running game where a question appears upfront and 3 doors approach
 * 2. "THE FLOOR IS LAVA!" — 4-Player Multiplayer Lava Race typing survival game
 */
export const GamesTab: React.FC<GamesTabProps> = ({
  lavaHighScore,
  doorRunnerHighScore,
  onSaveGameScore,
}) => {
  const [activeGame, setActiveGame] = useState<'none' | 'lava' | 'door_runner'>('none');

  if (activeGame === 'door_runner') {
    return (
      <div className="w-full max-w-2xl mx-auto px-3 pt-1 pb-24">
        <DoorRunnerScreen
          onExit={() => setActiveGame('none')}
          onCompleteRun={(score, xpEarned) => {
            onSaveGameScore('door_runner', score, xpEarned);
            setActiveGame('none');
          }}
        />
      </div>
    );
  }

  if (activeGame === 'lava') {
    return (
      <div className="w-full max-w-2xl mx-auto px-3 pt-1 pb-24">
        <LavaGameScreen
          onExit={() => setActiveGame('none')}
          onCompleteRun={(xpEarned, peakAlt) => {
            const computedScore = Math.max(1000, Math.round(peakAlt * 40));
            onSaveGameScore('lava_race', computedScore, xpEarned);
            setActiveGame('none');
          }}
        />
      </div>
    );
  }

  return (
    <div
      data-testid="games-tab-view"
      className="w-full max-w-[420px] mx-auto px-4 pt-1 pb-24 flex flex-col items-center space-y-3.5 select-none"
    >
      {/* Header: "MINI GAMES" */}
      <h1
        style={{
          textShadow:
            '0 3px 0 rgba(0, 0, 0, 0.45), 0 5px 10px rgba(0, 0, 0, 0.3)',
        }}
        className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white mt-0.5"
      >
        MINI GAMES
      </h1>

      {/* GAME 1: "DOOR DASH RUNNER!" (3-Lane 3D Door Running Game) */}
      <GameCard
        testId="door-runner-card"
        padding="p-2.5"
        className="w-full"
      >
        <div
          style={{
            background:
              'linear-gradient(180deg, #0D254C 0%, #19549C 52%, #2980B9 100%)',
          }}
          className="relative w-full h-38 rounded-[16px] overflow-hidden border-2 border-[#0A1E3C]/50 p-3 flex flex-col justify-between"
        >
          {/* SVG 3D Perspective Corridor + 3 Doors + Running Hero */}
          <svg
            viewBox="0 0 360 150"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            {/* Perspective Track */}
            <polygon points="110,45 250,45 340,150 20,150" fill="#153B6E" opacity="0.85" />
            <line x1="156" y1="45" x2="115" y2="150" stroke="#64B5F6" strokeWidth="2" strokeDasharray="6 5" />
            <line x1="204" y1="45" x2="245" y2="150" stroke="#64B5F6" strokeWidth="2" strokeDasharray="6 5" />

            {/* 3 Approaching Doors */}
            <rect x="64" y="46" width="44" height="58" rx="8" fill="#8D6E63" stroke="#FFE082" strokeWidth="2.5" />
            <rect x="130" y="42" width="48" height="62" rx="8" fill="#58CC02" stroke="#FFF59D" strokeWidth="3" />
            <rect x="200" y="46" width="44" height="58" rx="8" fill="#8D6E63" stroke="#FFE082" strokeWidth="2.5" />

            {/* Running Character */}
            <circle cx="154" cy="118" r="9" fill="#FFCCBC" />
            <rect x="146" y="127" width="16" height="16" rx="5" fill="#FFD54F" />
          </svg>

          <h2
            style={{
              textShadow: '0 3px 0 #071930, 0 4px 8px rgba(0, 0, 0, 0.55)',
            }}
            className="relative z-10 text-xl sm:text-2xl font-black uppercase tracking-tight text-white text-center leading-none pt-0.5"
          >
            DOOR DASH RUNNER!
          </h2>

          {/* Right Side Gold High Score Medallion */}
          <div className="relative z-10 ml-auto flex flex-col items-center pr-1">
            <span
              style={{ textShadow: '0 2px 0 #071930' }}
              className="text-[11px] font-black text-white mb-0.5"
            >
              High score
            </span>
            <div
              data-testid="door-runner-high-score-badge"
              style={{
                background: 'linear-gradient(180deg, #FFF176 0%, #FFB300 60%, #E65100 100%)',
                boxShadow: '0 4px 0 #8D3B00',
              }}
              className="w-14 h-14 rounded-full border-2 border-[#FFF9C4] flex flex-col items-center justify-center"
            >
              <Trophy3DIcon className="w-6 h-6 -mt-0.5" />
              <span
                style={{ textShadow: '0 1.5px 0 #5D2400' }}
                className="text-[11px] font-black text-white leading-none tabular-nums"
              >
                {doorRunnerHighScore}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 pb-1 px-2 flex items-center justify-between gap-3">
          <div className="text-[#14365D] font-black text-base leading-tight">
            Read the question &amp;
            <br />
            smash the right door!
          </div>

          <GameButton
            label="RUN"
            variant="green"
            width={136}
            height={50}
            fontSize="1.3rem"
            testId="play-door-runner-btn"
            onClick={() => setActiveGame('door_runner')}
          />
        </div>
      </GameCard>

      {/* GAME 2: "THE FLOOR IS LAVA!" */}
      <GameCard
        testId="floor-is-lava-card"
        padding="p-2.5"
        className="w-full"
      >
        <div
          style={{
            background:
              'linear-gradient(180deg, #6D2C1B 0%, #BF360C 42%, #FF5722 75%, #FF9800 100%)',
          }}
          className="relative w-full h-40 rounded-[16px] overflow-hidden border-2 border-[#5D1900]/40 p-3 flex flex-col justify-between"
        >
          <svg
            viewBox="0 0 360 170"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <polygon points="0,0 120,0 95,65 0,85" fill="#4E1F14" opacity="0.7" />
            <polygon points="240,0 360,0 360,95 275,70" fill="#4E1F14" opacity="0.7" />

            <path
              d="M0,115 Q90,102 180,116 T360,112 L360,170 L0,170 Z"
              fill="#FF6D00"
            />
            <path
              d="M0,132 Q110,120 210,135 T360,128 L360,170 L0,170 Z"
              fill="#FFD600"
              opacity="0.75"
            />

            <g transform="translate(22, 102)">
              <polygon points="0,16 38,2 76,14 38,30" fill="#A1887F" />
              <polygon points="0,16 38,30 38,48 0,34" fill="#6D4C41" />
              <polygon points="38,30 76,14 76,32 38,48" fill="#4E342E" />
            </g>

            <g transform="translate(96, 120)">
              <polygon points="0,14 36,2 72,14 36,26" fill="#BCAAA4" />
              <polygon points="0,14 36,26 36,44 0,32" fill="#795548" />
              <polygon points="36,26 72,14 72,32 36,44" fill="#4E342E" />
            </g>

            <g transform="translate(115, 46)">
              <path
                d="M18,62 L8,78 M32,62 L44,74"
                stroke="#2E7D32"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="7" cy="80" r="4.5" fill="#1565C0" />
              <circle cx="46" cy="75" r="4.5" fill="#1565C0" />
              <rect x="14" y="38" width="22" height="24" rx="7" fill="#42A5F5" stroke="#1565C0" strokeWidth="2" />
              <path
                d="M14,44 L2,36 M36,44 L48,34"
                stroke="#FFCCBC"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <circle cx="25" cy="24" r="13" fill="#FFCCBC" stroke="#5D4037" strokeWidth="2" />
              <path
                d="M12,22 C12,11 38,11 38,22 C34,16 18,16 12,22 Z"
                fill="#6D4C41"
              />
              <circle cx="21" cy="24" r="1.8" fill="#3E2723" />
              <circle cx="30" cy="24" r="1.8" fill="#3E2723" />
              <path d="M22,29 Q25,32 29,29" stroke="#3E2723" strokeWidth="1.8" fill="none" />
            </g>
          </svg>

          <h2
            style={{
              textShadow:
                '0 3px 0 #3E1104, 0 4px 8px rgba(0, 0, 0, 0.55)',
            }}
            className="relative z-10 text-xl sm:text-2xl font-black uppercase tracking-tight text-white text-center leading-none pt-0.5"
          >
            THE FLOOR IS LAVA!
          </h2>

          <div className="relative z-10 ml-auto flex flex-col items-center pr-1">
            <span
              style={{ textShadow: '0 2px 0 #3E1104' }}
              className="text-[11px] font-black text-white mb-0.5"
            >
              High score
            </span>
            <div
              data-testid="lava-high-score-badge"
              style={{
                background: 'linear-gradient(180deg, #FFF176 0%, #FFB300 60%, #E65100 100%)',
                boxShadow: '0 4px 0 #8D3B00',
              }}
              className="w-14 h-14 rounded-full border-2 border-[#FFF9C4] flex flex-col items-center justify-center"
            >
              <Trophy3DIcon className="w-6 h-6 -mt-0.5" />
              <span
                style={{ textShadow: '0 1.5px 0 #5D2400' }}
                className="text-[11px] font-black text-white leading-none tabular-nums"
              >
                {lavaHighScore}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 pb-1 px-2 flex items-center justify-between gap-3">
          <div className="text-[#14365D] font-black text-base leading-tight">
            Type fast to
            <br />
            climb high!
          </div>

          <GameButton
            label="PLAY"
            variant="gold"
            width={136}
            height={50}
            fontSize="1.3rem"
            testId="play-lava-game-btn"
            onClick={() => setActiveGame('lava')}
          />
        </div>
      </GameCard>
    </div>
  );
};
