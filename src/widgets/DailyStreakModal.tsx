import React, { useState, useEffect } from 'react';
import { X, Check, Shield, Sparkles, Zap, Calendar, Snowflake } from 'lucide-react';
import {
  calculateDailyStreakBonus,
  buildStreakMilestoneTrack,
  STREAK_FREEZE_COST_XP,
  MAX_STREAK_FREEZES,
  STREAK_GOAL_DAYS,
} from '../utils/gameLogic';
import { Flame3DIcon, StreakFreeze3DIcon } from './GameIcons';
import { GameButton } from './GameButton';
import { soundManager } from '../utils/soundEffects';

interface DailyStreakModalProps {
  isOpen: boolean;
  streakDays: number;
  xp: number;
  streakFreezes: number;
  claimedToday: boolean;
  lastRewardBanner: string | null;
  onClaimDailyStreak: (forceAdvanceDays?: number) => void;
  onBuyStreakFreeze: () => void;
  onClose: () => void;
}

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  isOpen,
  streakDays,
  xp,
  streakFreezes,
  claimedToday,
  lastRewardBanner,
  onClaimDailyStreak,
  onBuyStreakFreeze,
  onClose,
}) => {
  const [isBursting, setIsBursting] = useState(false);
  const [freezeAnimActive, setFreezeAnimActive] = useState(false);

  const nextPreviewDay = claimedToday ? streakDays + 1 : streakDays + 1;
  const currentSpec = calculateDailyStreakBonus(
    claimedToday ? streakDays : streakDays + 1
  );
  const nextDaySpec = calculateDailyStreakBonus(nextPreviewDay);
  const milestoneTrack = buildStreakMilestoneTrack(streakDays, claimedToday);

  useEffect(() => {
    if (isOpen) {
      setIsBursting(true);
      const timer = setTimeout(() => setIsBursting(false), 900);
      return () => clearTimeout(timer);
    }
  }, [isOpen, streakDays]);

  if (!isOpen) return null;

  const handleTriggerClaim = (forceAdvanceDays?: number) => {
    soundManager.playCelebration();
    setIsBursting(true);
    setTimeout(() => setIsBursting(false), 900);
    onClaimDailyStreak(forceAdvanceDays);
  };

  const handleTriggerMissedDayTest = () => {
    soundManager.playCorrect();
    setFreezeAnimActive(true);
    setIsBursting(true);
    setTimeout(() => {
      setFreezeAnimActive(false);
      setIsBursting(false);
    }, 950);
    onClaimDailyStreak(2); // Simulate 2 days elapsed -> triggers Streak Freeze protection
  };

  const handlePurchaseFreeze = () => {
    soundManager.playCorrect();
    setFreezeAnimActive(true);
    setTimeout(() => setFreezeAnimActive(false), 700);
    onBuyStreakFreeze();
  };

  const canAffordFreeze = xp >= STREAK_FREEZE_COST_XP;
  const isFreezeMaxed = streakFreezes >= MAX_STREAK_FREEZES;

  return (
    <div
      data-testid="daily-streak-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Daily Streak Bonus and Streak Freeze Shop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 select-none"
    >
      <div
        style={{
          backgroundColor: '#EBF4FA',
          border: '3px solid #FFFFFF',
          borderBottom: '7px solid #B8CDE0',
          borderRadius: '24px',
        }}
        className="w-full max-w-[430px] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-pop-scale text-[#14365D]"
      >
        {/* Top Royal Header Banner */}
        <div
          style={{
            background: freezeAnimActive
              ? 'linear-gradient(180deg, #00ACC1 0%, #0277BD 100%)'
              : 'linear-gradient(180deg, #FF7043 0%, #E53935 55%, #B71C1C 100%)',
            borderBottom: freezeAnimActive
              ? '4px solid #01579B'
              : '4px solid #7F0000',
          }}
          className="px-4 py-3 flex items-center justify-between text-white shrink-0 transition-colors duration-300"
        >
          <div className="flex items-center gap-2">
            <Flame3DIcon className="w-7 h-7 drop-shadow" />
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#FFECB3]">
                CONSECUTIVE DAILY REWARD
              </div>
              <h2
                style={{ textShadow: '0 2px 0 rgba(0,0,0,0.4)' }}
                className="text-lg font-black tracking-wide leading-tight"
              >
                DAILY STREAK &amp; SHOP
              </h2>
            </div>
          </div>

          <button
            type="button"
            data-testid="close-streak-modal-btn"
            aria-label="Close Daily Streak Modal"
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            style={{
              backgroundColor: 'rgba(0,0,0,0.28)',
              borderBottom: '3px solid rgba(0,0,0,0.45)',
            }}
            className="w-9 h-9 rounded-[11px] flex items-center justify-center text-white cursor-pointer active:translate-y-[2px]"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
          {/* 1. SPECIAL 3D STREAK ANIMATION STAGE */}
          <div
            data-testid="streak-3d-stage"
            style={{
              background: freezeAnimActive
                ? 'radial-gradient(circle at 50% 42%, #0288D1 0%, #01579B 60%, #0A192F 100%)'
                : 'radial-gradient(circle at 50% 42%, #4A151B 0%, #240B15 65%, #110914 100%)',
              borderBottom: '5px solid #0D1B2A',
              perspective: '900px',
            }}
            className="relative rounded-[20px] p-3.5 text-white overflow-hidden border-2 border-[#FFCA28]/50 flex flex-col items-center"
          >
            {/* Top Status Pill: Equipped Streak Freezes + Current XP */}
            <div className="w-full flex items-center justify-between gap-2 z-10 mb-1">
              <div
                data-testid="stage-freeze-status"
                className="px-2.5 py-1 rounded-[10px] bg-[#0288D1]/45 border border-[#80DEEA]/60 flex items-center gap-1.5 text-[11px] font-black text-[#E0F7FA]"
              >
                <Snowflake className="w-3.5 h-3.5 text-[#80DEEA]" />
                <span>
                  FREEZES: {streakFreezes}/{MAX_STREAK_FREEZES}
                </span>
              </div>

              <div
                data-testid="stage-xp-balance"
                className="px-2.5 py-1 rounded-[10px] bg-[#58CC02]/30 border border-[#76E81E]/60 flex items-center gap-1 text-[11px] font-black text-[#B9F6CA] tabular-nums"
              >
                <Zap className="w-3.5 h-3.5 fill-[#FFD54F] text-[#FFD54F]" />
                <span>{xp.toLocaleString()} XP</span>
              </div>
            </div>

            {/* 3D Rotating Pedestal Ring + Floating 3D Flame Crest */}
            <div className="relative w-36 h-32 flex items-center justify-center my-0.5">
              {/* Outer 3D Orbit Ring */}
              <div
                className="absolute w-32 h-32 rounded-full border-4 border-dashed border-[#FFD54F]/55 animate-streak-ring pointer-events-none"
                aria-hidden="true"
              />
              {/* Inner 3D Glow Halo */}
              <div
                style={{
                  background: freezeAnimActive
                    ? 'radial-gradient(circle, rgba(0,229,255,0.55) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(255,179,0,0.55) 0%, transparent 70%)',
                }}
                className="absolute w-28 h-28 rounded-full pointer-events-none"
              />

              {/* 3D Animated Emblem */}
              <div
                className={`relative z-10 flex flex-col items-center justify-center ${
                  isBursting
                    ? 'animate-streak-3d-burst'
                    : 'animate-streak-3d-float'
                }`}
              >
                {/* 3D Octagonal Gold/Ruby Crest SVG */}
                <svg
                  viewBox="0 0 120 120"
                  className="w-26 h-26 drop-shadow-[0_10px_14px_rgba(0,0,0,0.65)]"
                  aria-label="3D Consecutive Streak Flame Crest"
                >
                  <defs>
                    <linearGradient
                      id="crestRim3D"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#FFF59D" />
                      <stop offset="50%" stopColor="#FFB300" />
                      <stop offset="100%" stopColor="#E65100" />
                    </linearGradient>
                    <linearGradient
                      id="crestCore3D"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor={freezeAnimActive ? '#4DD0E1' : '#FF8A65'}
                      />
                      <stop
                        offset="60%"
                        stopColor={freezeAnimActive ? '#0288D1' : '#D32F2F'}
                      />
                      <stop
                        offset="100%"
                        stopColor={freezeAnimActive ? '#01579B' : '#7F0000'}
                      />
                    </linearGradient>
                  </defs>

                  {/* 3D Extruded Bottom Shadow Lip */}
                  <polygon
                    points="60,12 96,28 108,64 92,98 60,112 28,98 12,64 24,28"
                    fill="#4E1402"
                  />
                  {/* Main 3D Beveled Gold Shield */}
                  <polygon
                    points="60,6 96,22 108,58 92,92 60,106 28,92 12,58 24,22"
                    fill="url(#crestRim3D)"
                    stroke="#FFFDE7"
                    strokeWidth="2.5"
                  />
                  {/* Inner Faceted Core */}
                  <polygon
                    points="60,15 88,28 98,57 85,84 60,96 35,84 22,57 32,28"
                    fill="url(#crestCore3D)"
                    stroke="#FFCA28"
                    strokeWidth="2"
                  />
                  {/* 3D Sculpted Flame Inside Crest */}
                  <path
                    d="M62 24 C62 24 84 38 84 58 C84 74 73 86 60 86 C47 86 36 74 36 58 C36 46 43 36 49 32 C49 39 54 43 54 43 C54 34 62 24 62 24 Z"
                    fill="url(#crestRim3D)"
                    stroke="#5D1900"
                    strokeWidth="2"
                  />
                  <path
                    d="M60 44 C60 44 72 52 72 64 C72 73 66 80 60 80 C54 80 48 73 48 64 C48 56 60 44 60 44 Z"
                    fill="#FFF9C4"
                  />
                  {/* Orbiting 3D Star Sparks */}
                  <circle cx="22" cy="24" r="3.5" fill="#FFF176" />
                  <circle cx="98" cy="26" r="4" fill="#00E5FF" />
                  <circle cx="102" cy="84" r="3" fill="#FFD54F" />
                  <circle cx="18" cy="82" r="3.5" fill="#FF8A80" />
                </svg>

                {/* 3D Streak Day Count Overlay */}
                <div
                  data-testid="streak-modal-day-count"
                  style={{
                    background:
                      'linear-gradient(180deg, #FFD54F 0%, #FF8F00 100%)',
                    borderBottom: '3px solid #8D4E00',
                    textShadow: '0 1.5px 0 rgba(0,0,0,0.55)',
                  }}
                  className="-mt-3 px-3.5 py-0.5 rounded-full border-2 border-white text-xs font-black tracking-wider text-white uppercase shadow-md tabular-nums whitespace-nowrap"
                >
                  🔥 {streakDays} / {STREAK_GOAL_DAYS} DAY STREAK
                </div>
              </div>
            </div>

            {/* Tier Title & Bonus XP Callout */}
            <div className="text-center z-10 mt-0.5">
              <div className="text-[11px] font-black uppercase tracking-widest text-[#FFD54F]">
                {currentSpec.tierTitle}
              </div>
              <div
                data-testid="streak-bonus-xp-banner"
                className="text-sm font-black text-white mt-0.5 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#FFD54F] shrink-0" />
                <span>
                  {lastRewardBanner
                    ? lastRewardBanner
                    : `Next Consecutive Day Bonus: +${nextDaySpec.bonusXp} XP`}
                </span>
              </div>
            </div>

            {/* Primary Claim / Consecutive Day Simulation Controls */}
            <div className="w-full mt-2.5 flex flex-col gap-2 z-10">
              {!claimedToday ? (
                <GameButton
                  label={`CLAIM DAY ${streakDays + 1} BONUS (+${nextDaySpec.bonusXp} XP)`}
                  variant="gold"
                  fullWidth
                  height={46}
                  fontSize="0.95rem"
                  testId="claim-daily-streak-btn"
                  onClick={() => handleTriggerClaim(1)}
                />
              ) : (
                <div className="grid grid-cols-2 gap-2 w-full">
                  <button
                    type="button"
                    data-testid="simulate-next-day-btn"
                    onClick={() => handleTriggerClaim(1)}
                    style={{
                      background:
                        'linear-gradient(180deg, #69F0AE 0%, #58CC02 55%, #46A302 100%)',
                      borderBottom: '4px solid #2E7D32',
                      textShadow: '0 1.5px 0 rgba(0,0,0,0.35)',
                    }}
                    className="h-11 px-2.5 rounded-[12px] border border-[#B9F6CA] text-white text-xs font-black uppercase tracking-wide flex items-center justify-center gap-1 cursor-pointer active:translate-y-[2px] whitespace-nowrap"
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>+1 Day (+{nextDaySpec.bonusXp} XP)</span>
                  </button>

                  <button
                    type="button"
                    data-testid="simulate-missed-day-btn"
                    onClick={handleTriggerMissedDayTest}
                    style={{
                      background:
                        'linear-gradient(180deg, #4DD0E1 0%, #0288D1 60%, #01579B 100%)',
                      borderBottom: '4px solid #003c6c',
                      textShadow: '0 1.5px 0 rgba(0,0,0,0.35)',
                    }}
                    className="h-11 px-2.5 rounded-[12px] border border-[#B2EBF2] text-white text-xs font-black uppercase tracking-wide flex items-center justify-center gap-1 cursor-pointer active:translate-y-[2px] whitespace-nowrap"
                  >
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {streakFreezes > 0 ? 'Test Freeze' : 'Missed Day'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. 7-DAY CONSECUTIVE STREAK MILESTONE TRACK */}
          <div className="rounded-[16px] bg-white border-2 border-[#B8CDE0] p-2.5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#14365D] whitespace-nowrap">
                7-DAY STREAK XP MULTIPLIER
              </span>
              <span className="text-[11px] font-black text-[#E65100] tabular-nums whitespace-nowrap">
                Goal: {STREAK_GOAL_DAYS} Days
              </span>
            </div>

            <div
              data-testid="streak-milestone-track"
              className="grid grid-cols-7 gap-1"
            >
              {milestoneTrack.map((node) => {
                const isClaimed = node.status === 'claimed';
                const isCurrent = node.status === 'current';
                return (
                  <div
                    key={node.day}
                    style={
                      isClaimed
                        ? {
                            background:
                              'linear-gradient(180deg, #FFF8E1 0%, #FFE082 100%)',
                            borderBottom: '3px solid #FFB300',
                          }
                        : isCurrent
                        ? {
                            background:
                              'linear-gradient(180deg, #FF8A65 0%, #E53935 100%)',
                            borderBottom: '3px solid #AB000D',
                          }
                        : {
                            backgroundColor: '#EBF4FA',
                            borderBottom: '3px solid #B8CDE0',
                          }
                    }
                    className={`rounded-[10px] py-1.5 px-0.5 flex flex-col items-center justify-between border ${
                      isCurrent
                        ? 'border-[#FFD54F] text-white scale-105 shadow-xs'
                        : isClaimed
                        ? 'border-[#FFD54F] text-[#8D4E00]'
                        : 'border-[#DCE9F5] text-[#546E7A]'
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase">
                      D{node.day}
                    </span>

                    <div className="my-0.5">
                      {isClaimed ? (
                        <div className="w-5 h-5 rounded-full bg-[#58CC02] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                        </div>
                      ) : (
                        <Flame3DIcon className="w-5 h-5" />
                      )}
                    </div>

                    <span className="text-[9px] font-black tabular-nums">
                      +{node.bonusXp}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. STREAK FREEZE UTILITY IN THE SHOP */}
          <div
            data-testid="streak-freeze-shop-card"
            style={{
              background:
                'linear-gradient(180deg, #E0F7FA 0%, #B2EBF2 60%, #80DEEA 100%)',
              borderBottom: '5px solid #0097A7',
            }}
            className="rounded-[18px] p-3 border-2 border-white space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="w-14 h-14 rounded-[14px] bg-[#01579B] border-2 border-[#80DEEA] flex items-center justify-center shrink-0 shadow-md">
                <StreakFreeze3DIcon className="w-10 h-10" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#01579B]">
                    ITEM SHOP · STREAK UTILITY
                  </span>
                  <span
                    data-testid="shop-freeze-equipped-badge"
                    className="text-[11px] font-black text-[#004D40] tabular-nums"
                  >
                    {streakFreezes}/{MAX_STREAK_FREEZES} EQUIPPED
                  </span>
                </div>

                <h3 className="text-base font-black text-[#0D2B45] leading-tight">
                  Streak Freeze Cryo-Shield
                </h3>
                <p className="text-xs font-bold text-[#144666] leading-snug mt-0.5">
                  Protects your consecutive daily streak automatically if you miss
                  a day of practice.
                </p>
              </div>
            </div>

            {/* 3D Crystal Slot Visual Indicator */}
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((slotIdx) => {
                const isEquipped = slotIdx < streakFreezes;
                return (
                  <div
                    key={slotIdx}
                    style={{
                      backgroundColor: isEquipped ? '#0288D1' : '#E0F2F1',
                      borderBottom: isEquipped
                        ? '3px solid #01579B'
                        : '3px solid #80CBC4',
                    }}
                    className={`h-7 rounded-[9px] px-2 flex items-center justify-center gap-1 text-[10px] font-black uppercase ${
                      isEquipped ? 'text-white' : 'text-[#4DB6AC]'
                    }`}
                  >
                    <Snowflake className="w-3 h-3 shrink-0" />
                    <span>{isEquipped ? 'ACTIVE' : 'EMPTY'}</span>
                  </div>
                );
              })}
            </div>

            {/* Buy Streak Freeze Button */}
            <button
              type="button"
              data-testid="buy-streak-freeze-btn"
              disabled={isFreezeMaxed || !canAffordFreeze}
              onClick={handlePurchaseFreeze}
              style={
                isFreezeMaxed
                  ? {
                      backgroundColor: '#78909C',
                      borderBottom: '4px solid #455A64',
                    }
                  : canAffordFreeze
                  ? {
                      background:
                        'linear-gradient(180deg, #29B6F6 0%, #0288D1 55%, #01579B 100%)',
                      borderBottom: '4px solid #003c6c',
                    }
                  : {
                      backgroundColor: '#90A4AE',
                      borderBottom: '4px solid #607D8B',
                    }
              }
              className={`w-full h-11 rounded-[13px] border-2 border-[#E1F5FE] text-white font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-transform ${
                isFreezeMaxed || !canAffordFreeze
                  ? 'opacity-80 cursor-not-allowed'
                  : 'cursor-pointer active:translate-y-[3px]'
              }`}
            >
              <Snowflake className="w-4 h-4" />
              <span>
                {isFreezeMaxed
                  ? `MAX STREAK FREEZES EQUIPPED (${MAX_STREAK_FREEZES}/${MAX_STREAK_FREEZES})`
                  : canAffordFreeze
                  ? `EQUIP STREAK FREEZE · ${STREAK_FREEZE_COST_XP} XP`
                  : `NEED ${STREAK_FREEZE_COST_XP} XP FOR STREAK FREEZE`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
