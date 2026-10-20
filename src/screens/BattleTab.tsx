import React, { useState } from 'react';
import type { LanguageCourse } from '../data/curriculum';
import {
  ALL_ARENA_LEAGUES,
  getArenaLeague,
} from '../utils/gameLogic';
import { BattleCrest220, Trophy3DIcon } from '../widgets/GameIcons';
import { GameButton } from '../widgets/GameButton';
import { GameCard } from '../widgets/GameCard';
import { DuelScreen } from './DuelScreen';

interface BattleTabProps {
  course: LanguageCourse;
  playerTrophies: number;
  playerLevel: number;
  duelsWon: number;
  onFinishDuel: (didWin: boolean, trophyDelta: number, xpEarned: number) => void;
}

/**
 * Tab 2: Clash Royale-Style 1v1 Battle & Leagues Screen (mirrors screens/battle_tab.dart)
 * - Bold white "1v1 BATTLE" header
 * - Clash Royale League & Trophy Road Card (Goblin Bronze 0-300, Spell Valley Silver 301-600, Master Gold 601+)
 * - 3D split red-and-blue shield with crossed broadswords
 * - Oversized gold 3D GameButton labeled "BATTLE"
 */
export const BattleTab: React.FC<BattleTabProps> = ({
  course,
  playerTrophies,
  playerLevel,
  duelsWon,
  onFinishDuel,
}) => {
  const [isInMatch, setIsInMatch] = useState(false);

  const currentLeague = getArenaLeague(playerTrophies);
  const leagueProgressPercent = currentLeague.nextLeagueTrophies
    ? Math.min(
        100,
        Math.max(
          5,
          Math.round(
            ((playerTrophies - currentLeague.minTrophies) /
              (currentLeague.nextLeagueTrophies - currentLeague.minTrophies)) *
              100
          )
        )
      )
    : 100;

  if (isInMatch) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 pt-1 pb-24">
        <DuelScreen
          course={course}
          playerTrophies={playerTrophies}
          playerLevel={playerLevel}
          duelsWon={duelsWon}
          autoStartMatch
          onFinishDuel={(didWin, delta, xp) => {
            onFinishDuel(didWin, delta, xp);
            setIsInMatch(false);
          }}
          onBackToLobby={() => setIsInMatch(false)}
        />
      </div>
    );
  }

  return (
    <div
      data-testid="battle-tab-view"
      className="w-full max-w-[420px] mx-auto h-full flex flex-col items-center justify-between py-1 px-4 select-none overflow-y-auto pb-6"
    >
      {/* Header: "1v1 BATTLE" */}
      <h1
        style={{
          textShadow:
            '0 3px 0 rgba(0, 0, 0, 0.45), 0 5px 10px rgba(0, 0, 0, 0.3)',
        }}
        className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white mt-0.5 shrink-0"
      >
        1v1 BATTLE
      </h1>

      {/* Clash Royale-Style League & Trophy Road Card */}
      <GameCard
        testId="clash-league-card"
        padding="p-3"
        className="w-full space-y-2.5 shrink-0 mt-1"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              style={{
                background: `linear-gradient(180deg, ${currentLeague.primaryColor} 0%, ${currentLeague.secondaryColor} 100%)`,
                borderBottom: '4px solid #37474F',
              }}
              className="w-11 h-11 rounded-[12px] border-2 border-white flex items-center justify-center shrink-0 shadow"
            >
              <Trophy3DIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-[#3B5C85]">
                Current Arena League
              </div>
              <div
                data-testid="current-league-name"
                className="text-base sm:text-lg font-black text-[#14365D] leading-tight"
              >
                {currentLeague.name}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-black text-[#D97706] tabular-nums">
              {playerTrophies} 🏆
            </div>
            <div className="text-[10px] font-extrabold text-[#3B5C85]">
              Win +30 · Loss -15
            </div>
          </div>
        </div>

        {/* Trophy Road Progress Bar */}
        <div className="space-y-1">
          <div className="h-4 rounded-full bg-[#375375] p-0.5 relative overflow-hidden border border-[#1E3A5F]">
            <div
              style={{
                width: `${leagueProgressPercent}%`,
                background: 'linear-gradient(90deg, #FFD54F 0%, #FF8F00 100%)',
              }}
              className="h-full rounded-full transition-all duration-300"
            />
            <span
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
              className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white tabular-nums"
            >
              {currentLeague.nextLeagueTrophies
                ? `${playerTrophies} / ${currentLeague.nextLeagueTrophies} Trophies to Next League`
                : `${playerTrophies} Trophies · Top League Unlocked!`}
            </span>
          </div>

          {/* 3-League Tier Strip */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {ALL_ARENA_LEAGUES.map((league) => {
              const isCurrent = league.id === currentLeague.id;
              return (
                <div
                  key={league.id}
                  style={{
                    backgroundColor: isCurrent ? '#14365D' : '#DCE9F5',
                  }}
                  className={`rounded-[10px] px-2 py-1 text-center border ${
                    isCurrent
                      ? 'border-[#FFD54F] text-white'
                      : 'border-white/70 text-[#14365D]'
                  }`}
                >
                  <div className="text-[10px] font-black leading-tight truncate">
                    {league.name.replace(' Arena', '').replace(' League', '')}
                  </div>
                  <div className="text-[9px] font-extrabold opacity-80 tabular-nums">
                    {league.nextLeagueTrophies
                      ? `${league.minTrophies}–${league.nextLeagueTrophies - 1} 🏆`
                      : `${league.minTrophies}+ 🏆`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GameCard>

      {/* Centerpiece 3D Shield Emblem + Primary Oversized Gold "BATTLE" Button */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 my-1">
        <div className="animate-tooltip-float scale-90 sm:scale-95">
          <BattleCrest220 />
        </div>

        <GameButton
          label="BATTLE"
          variant="gold"
          width={260}
          height={70}
          fontSize="2.1rem"
          testId="battle-primary-cta-btn"
          onClick={() => setIsInMatch(true)}
        />
      </div>
    </div>
  );
};
