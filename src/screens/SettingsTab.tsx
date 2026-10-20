import React, { useState } from 'react';
import { Check, Volume2, BookOpen, Star, Snowflake, Sparkles } from 'lucide-react';
import { GameCard } from '../widgets/GameCard';
import { GameButton } from '../widgets/GameButton';
import { Trophy3DIcon, Flame3DIcon, StreakFreeze3DIcon } from '../widgets/GameIcons';
import {
  STREAK_FREEZE_COST_XP,
  MAX_STREAK_FREEZES,
} from '../utils/gameLogic';
import { soundManager } from '../utils/soundEffects';

interface SettingsTabProps {
  isMuted: boolean;
  onToggleMute: () => void;
  totalStars: number;
  wordsLearned: number;
  xp: number;
  level: number;
  streakDays: number;
  streakFreezes: number;
  onOpenStreakModal: () => void;
  onBuyStreakFreeze: () => void;
  onOpenWordList: () => void;
  onLogout: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  isMuted,
  onToggleMute,
  totalStars,
  wordsLearned,
  xp,
  level,
  streakDays,
  streakFreezes,
  onOpenStreakModal,
  onBuyStreakFreeze,
  onOpenWordList,
  onLogout,
}) => {
  const [sfxVolume, setSfxVolume] = useState<number>(58);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);

  const xpCap = Math.max(2000, Math.ceil((xp + 100) / 500) * 500);
  const xpPct = Math.min(100, Math.max(12, Math.round((xp / xpCap) * 100)));

  return (
    <div
      data-testid="settings-tab-view"
      className="w-full max-w-[420px] mx-auto px-4 pt-1 pb-24 flex flex-col items-center space-y-3 select-none"
    >
      {/* Header: "PROFILE & SETTINGS" */}
      <h1
        style={{
          textShadow:
            '0 3px 0 rgba(0, 0, 0, 0.45), 0 5px 10px rgba(0, 0, 0, 0.3)',
        }}
        className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white mt-1 mb-1 text-center"
      >
        PROFILE &amp; SETTINGS
      </h1>

      {/* 1. Player Profile 3D GameCard */}
      <GameCard testId="profile-card" padding="p-3.5" className="w-full space-y-3">
        {/* Top Section: Gold Shield 3D Avatar + Abhimanyu / @abhimanyu / LVL / XP Bar */}
        <div className="flex items-center gap-3.5">
          {/* Gold Shield Frame with 3D Boy Avatar */}
          <div className="w-23 h-24 shrink-0 relative">
            <svg
              viewBox="0 0 100 106"
              className="w-full h-full drop-shadow-md"
              aria-label="Abhimanyu Avatar Shield"
            >
              {/* Outer Gold Shield Crest */}
              <path
                d="M50 4 L92 18 V54 C92 78 73 94 50 102 C27 94 8 78 8 54 V18 Z"
                fill="#FFB300"
                stroke="#8D4E00"
                strokeWidth="3.5"
              />
              <path
                d="M50 10 L85 22 V53 C85 73 69 87 50 94 C31 87 15 73 15 53 V22 Z"
                fill="#42A5F5"
                stroke="#FFF59D"
                strokeWidth="2.5"
              />
              {/* Avatar Shoulders & Red Vest */}
              <path
                d="M25 84 C25 68 75 68 75 84 L68 91 C50 96 50 96 32 91 Z"
                fill="#ECEFF1"
              />
              <path d="M35 74 L50 88 L65 74 L62 90 L38 90 Z" fill="#C62828" />
              {/* Neck & Face */}
              <rect x="44" y="58" width="12" height="12" rx="4" fill="#FFCCBC" />
              <ellipse
                cx="50"
                cy="45"
                rx="18"
                ry="19"
                fill="#FFCCBC"
                stroke="#8D6E63"
                strokeWidth="1.5"
              />
              {/* Styled Brown Hair */}
              <path
                d="M31 42 C30 22 70 20 69 42 C65 31 36 31 31 42 Z"
                fill="#4E342E"
              />
              {/* Eyes & Warm Smile */}
              <circle cx="43" cy="45" r="2.4" fill="#3E2723" />
              <circle cx="57" cy="45" r="2.4" fill="#3E2723" />
              <path
                d="M44 53 Q50 58 56 53"
                stroke="#3E2723"
                strokeWidth="2.2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Right Info Column */}
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-black text-[#14365D] leading-none truncate">
              Abhimanyu
            </div>
            <div className="text-xs font-extrabold text-[#3B5C85] mt-0.5">
              @abhimanyu
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-black text-[#14365D] leading-none">
                LVL {Math.max(12, level)}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FFF8E1] border border-[#FFE082] text-[10px] font-black text-[#B26A00] flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-[#FFB300] text-[#FFB300]" />
                {totalStars} Stars
              </span>
            </div>

            {/* Neon-Green XP Progress Bar */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                style={{ textShadow: '0 1.5px 0 #1B5E20' }}
                className="text-sm font-black text-[#58CC02] shrink-0"
              >
                XP
              </span>
              <div className="flex-1 h-5 rounded-full bg-[#375375] p-0.5 relative overflow-hidden border border-[#1E3A5F]">
                <div
                  style={{
                    width: `${xpPct}%`,
                    background:
                      'linear-gradient(180deg, #76E81E 0%, #46B800 100%)',
                  }}
                  className="h-full rounded-full"
                />
                <span
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.75)' }}
                  className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white tabular-nums"
                >
                  {xp.toLocaleString()} / {xpCap.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Words Learned & A1-B1 Lexicon Summary Row */}
        <div className="rounded-[14px] bg-white border border-[#B8CDE0] px-3 py-2 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-[#3B5C85]">
              French Vocabulary Mastery
            </div>
            <div
              data-testid="settings-words-learned"
              className="text-sm font-black text-[#14365D] tabular-nums"
            >
              📚 {wordsLearned} French Words Learned (CEFR A1–B1)
            </div>
          </div>
          <button
            type="button"
            data-testid="settings-open-wordlist-btn"
            onClick={() => {
              soundManager.playTap();
              onOpenWordList();
            }}
            style={{
              backgroundColor: '#1CB0F6',
              borderBottom: '3px solid #0284C7',
            }}
            className="px-2.5 py-1.5 rounded-[10px] text-white text-xs font-black flex items-center gap-1 cursor-pointer active:translate-y-[2px]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Revise</span>
          </button>
        </div>

        {/* Recessed Achievement Shelf Tray (Gold Trophy, Crossed Swords, Streak Flame) */}
        <div
          style={{
            backgroundColor: '#C5D9EB',
            boxShadow: 'inset 0 3px 5px rgba(20, 54, 93, 0.25)',
          }}
          className="rounded-[16px] py-2 px-6 flex items-center justify-around border border-white/60"
        >
          <Trophy3DIcon className="w-10 h-10 drop-shadow" />

          {/* Crossed Swords + Mini Gold Crown Emblem */}
          <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow" aria-hidden="true">
            <polygon
              points="15,16 19,8 24,13 29,8 33,16"
              fill="#FFC800"
              stroke="#6D3B00"
              strokeWidth="1.5"
            />
            <path
              d="M10 38 L38 14 M14 14 L38 38"
              stroke="#ECEFF1"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="11" cy="38" r="4" fill="#FFB300" stroke="#4E342E" strokeWidth="1.5" />
            <circle cx="37" cy="38" r="4" fill="#FFB300" stroke="#4E342E" strokeWidth="1.5" />
          </svg>

          <Flame3DIcon className="w-10 h-10 drop-shadow" />
        </div>
      </GameCard>

      {/* 2. STREAK SHOP & DAILY BONUS 3D Card */}
      <GameCard
        testId="settings-streak-shop-card"
        padding="p-3.5"
        className="w-full space-y-2.5"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <StreakFreeze3DIcon className="w-8 h-8 shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-wider text-[#0277BD]">
                STREAK SHOP · CRYO UTILITY
              </div>
              <div className="text-sm font-black text-[#14365D] leading-tight truncate">
                Streak Freeze ({streakFreezes}/{MAX_STREAK_FREEZES} Active)
              </div>
            </div>
          </div>

          <button
            type="button"
            data-testid="settings-open-streak-modal-btn"
            onClick={() => {
              soundManager.playTap();
              onOpenStreakModal();
            }}
            style={{
              background: 'linear-gradient(180deg, #FF9800 0%, #E65100 100%)',
              borderBottom: '3px solid #8D3200',
            }}
            className="px-2.5 py-1.5 rounded-[10px] text-white text-xs font-black flex items-center gap-1 cursor-pointer active:translate-y-[2px] whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{streakDays}d Bonus</span>
          </button>
        </div>

        <p className="text-xs font-bold text-[#3B5C85] leading-snug">
          Equips an automatic Cryo-Shield that protects your consecutive daily
          streak if you miss a day.
        </p>

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((slot) => {
              const active = slot < streakFreezes;
              return (
                <span
                  key={slot}
                  className={`px-2 py-1 rounded-[8px] text-[10px] font-black flex items-center gap-1 ${
                    active
                      ? 'bg-[#0288D1] text-white border border-[#01579B]'
                      : 'bg-[#DCE9F5] text-[#607D8B] border border-[#B8CDE0]'
                  }`}
                >
                  <Snowflake className="w-3 h-3" />
                  {active ? 'ON' : 'OFF'}
                </span>
              );
            })}
          </div>

          <button
            type="button"
            data-testid="settings-buy-freeze-btn"
            disabled={
              streakFreezes >= MAX_STREAK_FREEZES || xp < STREAK_FREEZE_COST_XP
            }
            onClick={() => {
              soundManager.playCorrect();
              onBuyStreakFreeze();
            }}
            style={
              streakFreezes >= MAX_STREAK_FREEZES || xp < STREAK_FREEZE_COST_XP
                ? {
                    backgroundColor: '#90A4AE',
                    borderBottom: '3px solid #607D8B',
                  }
                : {
                    backgroundColor: '#0288D1',
                    borderBottom: '3px solid #01579B',
                  }
            }
            className={`px-3 py-1.5 rounded-[10px] text-white text-xs font-black uppercase tracking-wide flex items-center gap-1 ${
              streakFreezes >= MAX_STREAK_FREEZES || xp < STREAK_FREEZE_COST_XP
                ? 'opacity-75 cursor-not-allowed'
                : 'cursor-pointer active:translate-y-[2px]'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5" />
            <span>
              {streakFreezes >= MAX_STREAK_FREEZES
                ? 'MAX (3/3)'
                : `BUY (${STREAK_FREEZE_COST_XP} XP)`}
            </span>
          </button>
        </div>
      </GameCard>

      {/* 3. SOUND EFFECTS Card Row */}
      <GameCard testId="settings-sfx-card" padding="p-3.5" className="w-full space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-base font-black uppercase tracking-wide text-[#14365D]">
            SOUND EFFECTS
          </span>

          <button
            type="button"
            data-testid="settings-sfx-toggle"
            onClick={() => {
              soundManager.playTap();
              onToggleMute();
            }}
            style={{
              backgroundColor: isMuted ? '#90A4AE' : '#58CC02',
              borderBottom: isMuted ? '3px solid #607D8B' : '3px solid #388E00',
            }}
            className="w-7 h-7 rounded-[8px] flex items-center justify-center text-white cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3.5]" />
          </button>
        </div>

        {/* Speaker Icon + Rainbow Gradient Slider */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#DCE9F5] flex items-center justify-center text-[#7E57C2] shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>

          <div className="relative flex-1 h-4 rounded-full bg-[#90A9C4] border border-[#6E89A8] flex items-center">
            <div
              style={{
                width: `${isMuted ? 0 : sfxVolume}%`,
                background:
                  'linear-gradient(90deg, #F50057 0%, #FF9100 35%, #FFEA00 65%, #00E676 100%)',
              }}
              className="h-full rounded-l-full"
            />
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : sfxVolume}
              onChange={(e) => setSfxVolume(Number(e.target.value))}
              aria-label="Sound effects volume"
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
            />
            <div
              style={{
                left: `calc(${isMuted ? 0 : sfxVolume}% - 10px)`,
                boxShadow: '0 2px 0 #78909C',
              }}
              className="w-5 h-6 rounded-[7px] bg-[#EBF4FA] border-2 border-[#607D8B] absolute pointer-events-none"
            />
          </div>
        </div>
      </GameCard>

      {/* 3. MUSIC Card Row */}
      <GameCard testId="settings-music-card" padding="px-3.5 py-2.5" className="w-full">
        <div className="flex items-center justify-between">
          <span className="text-base font-black uppercase tracking-wide text-[#14365D]">
            MUSIC
          </span>

          <button
            type="button"
            data-testid="settings-music-toggle"
            onClick={() => {
              soundManager.playTap();
              setMusicEnabled((prev) => !prev);
            }}
            style={{
              backgroundColor: musicEnabled ? '#58CC02' : '#90A4AE',
              borderBottom: musicEnabled
                ? '3px solid #388E00'
                : '3px solid #607D8B',
            }}
            className="w-20 h-8 rounded-[10px] p-1 flex items-center justify-between cursor-pointer relative"
          >
            {musicEnabled ? (
              <>
                <span className="text-xs font-black text-white pl-1.5">ON</span>
                <span className="w-6 h-6 rounded-[6px] bg-[#EBF4FA] shadow" />
              </>
            ) : (
              <>
                <span className="w-6 h-6 rounded-[6px] bg-[#EBF4FA] shadow" />
                <span className="text-xs font-black text-white pr-1">OFF</span>
              </>
            )}
          </button>
        </div>
      </GameCard>

      {/* 4. LANGUAGE Card Row (French Flag Badge 🇫🇷) */}
      <GameCard testId="settings-language-card" padding="px-3.5 py-2.5" className="w-full">
        <div className="flex items-center justify-between">
          <span className="text-base font-black uppercase tracking-wide text-[#14365D]">
            LANGUAGE · FRANÇAIS (A1–B1)
          </span>

          {/* Rounded 3D French Flag Badge */}
          <div
            aria-label="French Language Selected"
            className="w-11 h-7 rounded-[7px] overflow-hidden border-2 border-[#607D8B] grid grid-cols-3 shadow-xs"
          >
            <span className="bg-[#1565C0] block h-full" />
            <span className="bg-[#FFFFFF] block h-full" />
            <span className="bg-[#E53935] block h-full" />
          </div>
        </div>
      </GameCard>

      {/* 5. Full-Width Crimson-Red 3D "LOG OUT" Button */}
      <div className="w-full pt-1">
        <GameButton
          label="LOG OUT"
          variant="danger"
          fullWidth
          height={54}
          fontSize="1.35rem"
          testId="settings-logout-btn"
          onClick={onLogout}
        />
      </div>
    </div>
  );
};
