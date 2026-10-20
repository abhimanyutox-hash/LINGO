import React, { useState } from 'react';
import { soundManager } from '../utils/soundEffects';

export type TactileButtonVariant =
  | 'primary'
  | 'violet'
  | 'coral'
  | 'cyan'
  | 'magenta'
  | 'gold'
  | 'danger'
  | 'secondary';

interface TactileButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: TactileButtonVariant;
  fullWidth?: boolean;
  size?: 'md' | 'lg';
  icon?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  testId?: string;
}

const VARIANT_STYLES: Record<
  TactileButtonVariant,
  { bg: string; shadow: string; text: string; border?: string }
> = {
  primary: {
    bg: '#58CC02',
    shadow: '#58A700',
    text: '#FFFFFF',
  },
  violet: {
    bg: '#7C3AED',
    shadow: '#5B21B6',
    text: '#FFFFFF',
  },
  coral: {
    bg: '#FF6B2B',
    shadow: '#D94E14',
    text: '#FFFFFF',
  },
  cyan: {
    bg: '#0EA5E9',
    shadow: '#0284C7',
    text: '#FFFFFF',
  },
  magenta: {
    bg: '#EC4899',
    shadow: '#BE185D',
    text: '#FFFFFF',
  },
  gold: {
    bg: '#FFC800',
    shadow: '#E5B400',
    text: '#FFFFFF',
  },
  danger: {
    bg: '#FF4B4B',
    shadow: '#EA2B2B',
    text: '#FFFFFF',
  },
  secondary: {
    bg: '#FFFFFF',
    shadow: '#E5E5E5',
    text: '#4B4B4B',
    border: '2px solid #E5E5E5',
  },
};

/**
 * Tactile 3D Button Widget (mirrors widgets/tactile_button.dart)
 * Translates on the Y-axis by 4.0px over 100ms when pressed to cover its bottom 3D shadow.
 */
export const TactileButton: React.FC<TactileButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  size = 'lg',
  icon,
  ariaLabel,
  className = '',
  testId,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const palette = VARIANT_STYLES[variant];
  const topBg = disabled ? '#E5E5E5' : palette.bg;
  const bottomShadow = disabled ? '#E5E5E5' : palette.shadow;
  const textColor = disabled ? '#C4C4C4' : palette.text;

  const heightPx = size === 'lg' ? 50 : 42;
  const shadowDepth = 4;
  const translateY = !disabled && isPressed ? shadowDepth : 0;

  const handlePointerDown = () => {
    if (disabled) return;
    setIsPressed(true);
    soundManager.playTap();
  };

  const handlePointerUp = () => {
    if (disabled) return;
    setIsPressed(false);
  };

  const handlePointerLeave = () => {
    if (isPressed) setIsPressed(false);
  };

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel || label}
      data-testid={testId}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      onClick={handleClick}
      style={{ height: `${heightPx + shadowDepth}px` }}
      className={`relative select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1CB0F6] focus-visible:ring-offset-2 rounded-[16px] ${
        fullWidth ? 'w-full' : 'inline-block'
      } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {/* Bottom 3D Shadow Container */}
      <span
        aria-hidden="true"
        style={{
          backgroundColor: bottomShadow,
          height: `${heightPx}px`,
          bottom: 0,
          borderRadius: '16px',
        }}
        className="absolute inset-x-0 block"
      />

      {/* Top Interactive Surface that translates Y by 4px over 100ms */}
      <span
        style={{
          backgroundColor: topBg,
          color: textColor,
          height: `${heightPx}px`,
          borderRadius: '16px',
          border: disabled ? 'none' : palette.border,
          transform: `translateY(${translateY}px)`,
          transition: 'transform 100ms ease-out, background-color 120ms ease',
        }}
        className="relative inset-x-0 top-0 flex items-center justify-center gap-2 px-5 font-extrabold tracking-wider text-[14px] sm:text-[15px] whitespace-nowrap shrink-0"
      >
        {icon}
        <span>{label}</span>
      </span>
    </button>
  );
};
