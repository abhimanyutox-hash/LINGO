import React from 'react';

export type CompanionCharacterId = 'kiko' | 'luna' | 'mateo' | 'nova';

interface CharacterCompanionProps {
  character: CompanionCharacterId;
  caption?: string;
  size?: 'sm' | 'md' | 'lg';
  flip?: boolean;
  hideName?: boolean;
  lightText?: boolean;
}

const CHARACTER_META: Record<
  CompanionCharacterId,
  {
    name: string;
    primaryColor: string;
    bgBubble: string;
    borderColor: string;
  }
> = {
  kiko: {
    name: 'Kiko',
    primaryColor: '#FF6B2B',
    bgBubble: '#FFF4ED',
    borderColor: '#FF6B2B',
  },
  luna: {
    name: 'Luna',
    primaryColor: '#7C3AED',
    bgBubble: '#F5F0FF',
    borderColor: '#7C3AED',
  },
  mateo: {
    name: 'Mateo',
    primaryColor: '#0EA5E9',
    bgBubble: '#ECF8FF',
    borderColor: '#0EA5E9',
  },
  nova: {
    name: 'Nova',
    primaryColor: '#EC4899',
    bgBubble: '#FDF2F8',
    borderColor: '#EC4899',
  },
};

export const CharacterCompanion: React.FC<CharacterCompanionProps> = ({
  character,
  caption,
  size = 'md',
  flip = false,
  hideName = false,
  lightText = false,
}) => {
  const meta = CHARACTER_META[character];
  const dim = size === 'lg' ? 88 : size === 'md' ? 72 : 52;

  return (
    <div
      data-testid={`character-companion-${character}`}
      className={`inline-flex flex-col items-center select-none ${
        flip ? 'scale-x-[-1]' : ''
      }`}
    >
      {caption && (
        <div
          style={{
            backgroundColor: meta.bgBubble,
            borderColor: meta.borderColor,
            color: meta.primaryColor,
            boxShadow: `0 3px 0 ${meta.borderColor}`,
          }}
          className={`mb-1.5 px-2.5 py-1 rounded-[12px] border-2 text-[11px] font-black tracking-wide whitespace-nowrap animate-tooltip-float ${
            flip ? 'scale-x-[-1]' : ''
          }`}
        >
          {caption}
        </div>
      )}

      <div
        style={{
          width: `${dim}px`,
          height: `${dim}px`,
          backgroundColor: meta.bgBubble,
          borderColor: meta.borderColor,
          boxShadow: `0 5px 0 ${meta.borderColor}`,
        }}
        className="rounded-[20px] border-2 flex items-center justify-center relative overflow-hidden animate-character-bob"
      >
        {character === 'kiko' && (
          <svg
            viewBox="0 0 80 80"
            className="w-full h-full"
            aria-label="Kiko the French Shiba"
          >
            <circle cx="14" cy="18" r="3" fill="#FFC800" />
            <circle cx="66" cy="22" r="2.5" fill="#FF6B2B" />
            <g className="animate-character-wave">
              <polygon points="18,32 24,12 36,26" fill="#FF6B2B" />
              <polygon points="22,29 25,17 33,26" fill="#FFE4D6" />
              <polygon points="62,32 56,12 44,26" fill="#FF6B2B" />
              <polygon points="58,29 55,17 47,26" fill="#FFE4D6" />
            </g>
            <ellipse cx="40" cy="44" rx="22" ry="19" fill="#FF854D" />
            <ellipse cx="40" cy="49" rx="16" ry="13" fill="#FFF7F2" />
            <ellipse cx="26" cy="47" rx="3.5" ry="2" fill="#FF4B4B" opacity="0.55" />
            <ellipse cx="54" cy="47" rx="3.5" ry="2" fill="#FF4B4B" opacity="0.55" />
            <circle cx="31" cy="40" r="3.2" fill="#2D2D2D" />
            <circle cx="32" cy="39" r="1.1" fill="#FFFFFF" />
            <circle cx="49" cy="40" r="3.2" fill="#2D2D2D" />
            <circle cx="50" cy="39" r="1.1" fill="#FFFFFF" />
            <ellipse cx="40" cy="45" rx="3" ry="2.2" fill="#2D2D2D" />
            <path
              d="M 35 49 Q 40 54 45 49"
              stroke="#2D2D2D"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M 22 58 Q 40 68 58 58 L 52 70 Q 40 74 28 70 Z" fill="#2563EB" />
            <circle cx="40" cy="64" r="3.5" fill="#FFC800" />
          </svg>
        )}

        {character === 'luna' && (
          <svg
            viewBox="0 0 80 80"
            className="w-full h-full"
            aria-label="Luna the Royal Owl"
          >
            <circle cx="16" cy="20" r="2.5" fill="#EC4899" />
            <circle cx="65" cy="16" r="3" fill="#7C3AED" />
            <polygon points="20,24 28,14 34,26" fill="#6D28D9" />
            <polygon points="60,24 52,14 46,26" fill="#6D28D9" />
            <ellipse cx="40" cy="45" rx="22" ry="21" fill="#8B5CF6" />
            <ellipse cx="40" cy="52" rx="14" ry="12" fill="#DDD6FE" />
            <circle cx="31" cy="38" r="8" fill="#FFFFFF" stroke="#5B21B6" strokeWidth="2.5" />
            <circle cx="49" cy="38" r="8" fill="#FFFFFF" stroke="#5B21B6" strokeWidth="2.5" />
            <circle cx="31" cy="38" r="4" fill="#3B0764" />
            <circle cx="32.5" cy="36.5" r="1.5" fill="#FFFFFF" />
            <circle cx="49" cy="38" r="4" fill="#3B0764" />
            <circle cx="50.5" cy="36.5" r="1.5" fill="#FFFFFF" />
            <polygon points="37,43 43,43 40,49" fill="#FFC800" />
            <polygon
              className="animate-character-wave"
              points="32,22 36,14 40,20 44,14 48,22"
              fill="#FFC800"
            />
          </svg>
        )}

        {character === 'mateo' && (
          <svg
            viewBox="0 0 80 80"
            className="w-full h-full"
            aria-label="Mateo the Bistro Capybara"
          >
            <circle cx="15" cy="22" r="2.5" fill="#0EA5E9" />
            <circle cx="65" cy="20" r="3" fill="#FFC800" />
            <circle cx="24" cy="26" r="6" fill="#B45309" />
            <circle cx="56" cy="26" r="6" fill="#B45309" />
            <rect x="18" y="24" width="44" height="38" rx="18" fill="#D97706" />
            <rect x="26" y="36" width="28" height="20" rx="10" fill="#FDE68A" />
            <rect x="22" y="30" width="15" height="9" rx="3" fill="#0284C7" />
            <rect x="43" y="30" width="15" height="9" rx="3" fill="#0284C7" />
            <line x1="37" y1="34" x2="43" y2="34" stroke="#0284C7" strokeWidth="2.5" />
            <ellipse cx="40" cy="43" rx="4" ry="2.5" fill="#78350F" />
            <path
              d="M 35 49 Q 40 53 45 49"
              stroke="#78350F"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse
              className="animate-character-wave"
              cx="40"
              cy="22"
              rx="16"
              ry="6"
              fill="#2563EB"
            />
          </svg>
        )}

        {character === 'nova' && (
          <svg
            viewBox="0 0 80 80"
            className="w-full h-full"
            aria-label="Nova the Duel Champion Fox"
          >
            <circle cx="16" cy="18" r="3" fill="#FFC800" />
            <circle cx="64" cy="18" r="2.5" fill="#EC4899" />
            <polygon points="16,34 22,10 36,26" fill="#EC4899" />
            <polygon points="20,30 24,16 32,26" fill="#FCE7F3" />
            <polygon points="64,34 58,10 44,26" fill="#EC4899" />
            <polygon points="60,30 56,16 48,26" fill="#FCE7F3" />
            <polygon points="16,42 40,24 64,42 40,64" fill="#F43F5E" />
            <polygon points="22,44 40,36 58,44 40,62" fill="#FFF1F2" />
            <path
              className="animate-character-wave"
              d="M 23 36 L 40 41 L 57 36 L 54 30 L 40 34 L 26 30 Z"
              fill="#FFC800"
            />
            <circle cx="40" cy="54" r="3" fill="#1E293B" />
          </svg>
        )}
      </div>

      {!hideName && (
        <span
          className={`mt-1 text-[11px] font-black ${
            lightText ? 'text-white' : 'text-[#2D3142]'
          } ${flip ? 'scale-x-[-1]' : ''}`}
        >
          {meta.name}
        </span>
      )}
    </div>
  );
};
