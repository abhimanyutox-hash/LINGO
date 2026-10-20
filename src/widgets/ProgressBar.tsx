import React from 'react';
import { X, Zap, Trophy, Infinity as InfinityIcon } from 'lucide-react';

interface ProgressBarProps {
  progress: number; // 0 to 1
  combo: number;
  trophies: number;
  onClose: () => void;
}

/**
 * Animated Lesson Header (Unlimited Hearts + Live Combo & Trophies)
 * - Left: Close IconButton
 * - Center: Animated progress bar (500ms easeOutCubic) with multi-tone gradient shine
 * - Right: Live Combo Streak multiplier & Unlimited Energy badge (no heart penalties)
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  combo,
  trophies,
  onClose,
}) => {
  const clampedPercent = Math.max(0, Math.min(100, Math.round(progress * 100)));

  return (
    <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-3 flex items-center gap-3 sm:gap-4">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close lesson"
        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[16px] text-[#AFAFAF] hover:text-[#4B4B4B] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
      >
        <X className="w-7 h-7 stroke-[2.75]" />
      </button>

      {/* Progress Bar Track */}
      <div
        role="progressbar"
        aria-label="Lesson progress"
        aria-valuenow={clampedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="flex-1 h-4 bg-[#E5E5E5] rounded-[16px] overflow-hidden relative"
      >
        {/* Animated Fill (500ms easeOutCubic) */}
        <div
          style={{
            width: `${clampedPercent}%`,
            transition: 'width 500ms cubic-bezier(0.22, 1, 0.36, 1)',
            background:
              combo >= 2
                ? 'linear-gradient(90deg, #7C3AED 0%, #EC4899 50%, #FF6B2B 100%)'
                : '#58CC02',
          }}
          className="h-full rounded-[16px] relative"
        >
          {clampedPercent > 6 && (
            <div className="absolute top-[3px] left-2 right-2 h-[4px] bg-white/35 rounded-[16px]" />
          )}
        </div>
      </div>

      {/* Live Combo Multiplier Pill */}
      <div
        data-testid="lesson-combo-badge"
        style={{
          backgroundColor: combo >= 2 ? '#FFF4E0' : '#F3E8FF',
          borderColor: combo >= 2 ? '#FF6B2B' : '#7C3AED',
          color: combo >= 2 ? '#FF6B2B' : '#7C3AED',
        }}
        className="flex items-center gap-1 px-2.5 py-1 rounded-[12px] border-2 font-extrabold text-xs sm:text-sm tabular-nums shrink-0"
      >
        <Zap className="w-4 h-4 fill-current" />
        <span>{combo}x COMBO</span>
      </div>

      {/* Unlimited Play + Trophies Indicator (Replaces Limiting Hearts) */}
      <div
        data-testid="unlimited-trophies-badge"
        className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-[12px] border-2 border-[#FFC800] bg-[#FFFBEB] text-[#D97706] font-extrabold text-xs sm:text-sm tabular-nums shrink-0"
        aria-label={`Unlimited energy enabled, ${trophies} trophies`}
      >
        <Trophy className="w-4 h-4 text-[#FFC800] fill-[#FFC800]" />
        <span>{trophies}</span>
        <span aria-hidden="true">·</span>
        <InfinityIcon className="w-4 h-4 text-[#7C3AED]" />
      </div>
    </header>
  );
};
