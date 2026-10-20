import React, { useState } from 'react';
import { soundManager } from '../utils/soundEffects';

export type GameButtonVariant = 'gold' | 'green' | 'danger';

interface GameButtonProps {
  label: string;
  variant?: GameButtonVariant;
  onClick?: () => void;
  width?: string | number;
  height?: string | number;
  fullWidth?: boolean;
  fontSize?: string;
  disabled?: boolean;
  testId?: string;
}

const VARIANT_STYLES: Record<
  GameButtonVariant,
  {
    gradient: string;
    bottomLip: string;
    border: string;
    textShadow: string;
  }
> = {
  gold: {
    gradient: 'linear-gradient(180deg, #FFD43B 0%, #FFA800 55%, #F08C00 100%)',
    bottomLip: '#CC7A00',
    border: '#FFE066',
    textShadow: '0 2px 0 #995500, 0 3px 4px rgba(0,0,0,0.35)',
  },
  green: {
    gradient: 'linear-gradient(180deg, #7AE81C 0%, #58CC02 55%, #46A302 100%)',
    bottomLip: '#368000',
    border: '#9BF646',
    textShadow: '0 2px 0 #2B6600, 0 3px 4px rgba(0,0,0,0.35)',
  },
  danger: {
    gradient: 'linear-gradient(180deg, #FF6B52 0%, #EA2B2B 55%, #D11F1F 100%)',
    bottomLip: '#B81D1D',
    border: '#FF8A75',
    textShadow: '0 2px 0 #801111, 0 3px 4px rgba(0,0,0,0.35)',
  },
};

/**
 * 3D Tactile GameButton (mirrors widgets/game_button.dart)
 * Face color + 6px darker bottom border + 4px Y-axis shift over 80ms on press.
 */
export const GameButton: React.FC<GameButtonProps> = ({
  label,
  variant = 'gold',
  onClick,
  width,
  height = 56,
  fullWidth = false,
  fontSize = '1.25rem',
  disabled = false,
  testId,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const styleSpec = VARIANT_STYLES[variant];

  const handlePointerDown = () => {
    if (disabled) return;
    setIsPressed(true);
    soundManager.playTap();
  };

  const handlePointerUp = () => {
    if (disabled) return;
    setIsPressed(false);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      data-testid={testId}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => setIsPressed(false)}
      onPointerCancel={() => setIsPressed(false)}
      onClick={() => {
        if (!disabled && onClick) onClick();
      }}
      style={{
        width: fullWidth ? '100%' : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      className={`relative select-none focus:outline-none ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {/* 6px Darker Bottom Lip */}
      <span
        aria-hidden="true"
        style={{
          backgroundColor: styleSpec.bottomLip,
          borderRadius: '18px',
        }}
        className="absolute inset-x-0 top-[6px] bottom-0 block shadow-lg"
      />

      {/* Top Face Container (shifts down 4px over 80ms on press) */}
      <span
        style={{
          background: styleSpec.gradient,
          borderColor: styleSpec.border,
          borderRadius: '18px',
          transform: isPressed ? 'translateY(4px)' : 'translateY(0px)',
          transition: 'transform 80ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="absolute inset-x-0 top-0 bottom-[6px] border-2 flex items-center justify-center px-5 overflow-hidden"
      >
        {/* Glossy Top Specular Highlight */}
        <span
          aria-hidden="true"
          className="absolute top-1 left-3 right-3 h-2.5 rounded-full bg-white/35 pointer-events-none"
        />

        <span
          style={{
            fontSize,
            textShadow: styleSpec.textShadow,
          }}
          className="relative z-10 font-black uppercase tracking-wider text-white leading-none"
        >
          {label}
        </span>
      </span>
    </button>
  );
};
