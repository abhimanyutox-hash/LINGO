import React from 'react';

export const Flame3DIcon: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="flameOuter" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFF176" />
        <stop offset="45%" stopColor="#FF9800" />
        <stop offset="100%" stopColor="#E65100" />
      </linearGradient>
    </defs>
    <path
      d="M19 3C19 3 28 10 28 19C28 26 23 32 18 32C13 32 8 26 8 19C8 14 11 9 14 7C14 10 16 12 16 12C16 8 19 3 19 3Z"
      fill="url(#flameOuter)"
      stroke="#5D1900"
      strokeWidth="1.5"
    />
    <path
      d="M18 14C18 14 23 18 23 23C23 27 20.5 30 18 30C15.5 30 13 27 13 23C13 19.5 18 14 18 14Z"
      fill="#FFF59D"
    />
  </svg>
);

export const Trophy3DIcon: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF176" />
        <stop offset="50%" stopColor="#FFB300" />
        <stop offset="100%" stopColor="#E65100" />
      </linearGradient>
    </defs>
    <path
      d="M9 8H27V15C27 20 23 24 18 24C13 24 9 20 9 15V8Z"
      fill="url(#trophyGold)"
      stroke="#6D3B00"
      strokeWidth="1.6"
    />
    <path
      d="M9 10H5C5 15 7 18 10 18M27 10H31C31 15 29 18 26 18"
      fill="none"
      stroke="#FFB300"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <rect
      x="15.5"
      y="23.5"
      width="5"
      height="5"
      rx="1"
      fill="#FFA000"
      stroke="#6D3B00"
      strokeWidth="1.4"
    />
    <rect
      x="11"
      y="28"
      width="14"
      height="4"
      rx="2"
      fill="#FFC107"
      stroke="#6D3B00"
      strokeWidth="1.5"
    />
  </svg>
);

/**
 * Tab 0 Icon: Winding S-Curve Path
 */
export const NavPathIcon: React.FC<{ className?: string }> = ({
  className = 'w-11 h-11',
}) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path
      d="M 14 12 H 32 C 37 12 37 22 31 23 L 18 25 C 12 26 12 36 18 36 H 34"
      fill="none"
      stroke="#3E2723"
      strokeWidth="9"
      strokeLinecap="round"
    />
    <path
      d="M 14 12 H 32 C 37 12 37 22 31 23 L 18 25 C 12 26 12 36 18 36 H 34"
      fill="none"
      stroke="#E1BEE7"
      strokeWidth="5.5"
      strokeLinecap="round"
    />
    <circle cx="14" cy="12" r="5" fill="#FF7043" stroke="#3E2723" strokeWidth="2" />
    <circle cx="34" cy="36" r="5.5" fill="#58CC02" stroke="#1B5E20" strokeWidth="2" />
  </svg>
);

/**
 * Tab 1 Icon: Shield & Crossed Swords
 */
export const NavBattleIcon: React.FC<{ className?: string }> = ({
  className = 'w-11 h-11',
}) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    {/* Shield */}
    <path
      d="M24 6 L38 11 V24 C38 33 31 39 24 42 C17 39 10 33 10 24 V11 Z"
      fill="#90CAF9"
      stroke="#1A237E"
      strokeWidth="2.5"
    />
    <path
      d="M24 9 L35 13 V23 C35 30 29 35 24 38 C19 35 13 30 13 23 V13 Z"
      fill="#42A5F5"
    />
    {/* Crossed Swords */}
    <path
      d="M11 37 L37 11 M15 11 L37 33"
      stroke="#ECEFF1"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="36" r="3.5" fill="#FFB300" stroke="#4E342E" strokeWidth="1.5" />
    <circle cx="36" cy="36" r="3.5" fill="#FFB300" stroke="#4E342E" strokeWidth="1.5" />
  </svg>
);

/**
 * Tab 2 Icon: Gamepad + Glowing Lava Orb
 */
export const NavGamesIcon: React.FC<{ className?: string }> = ({
  className = 'w-11 h-11',
}) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    {/* Blue Gamepad */}
    <rect
      x="6"
      y="14"
      width="26"
      height="18"
      rx="8"
      fill="#5C6BC0"
      stroke="#1A237E"
      strokeWidth="2.2"
    />
    <path d="M13 20 V26 M10 23 H16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="24" cy="21" r="2" fill="#FFCA28" />
    <circle cx="27" cy="24" r="2" fill="#66BB6A" />
    {/* Glowing Lava Orb */}
    <circle
      cx="33"
      cy="28"
      r="10"
      fill="#FF5722"
      stroke="#5D1900"
      strokeWidth="2.2"
    />
    <circle cx="30" cy="25" r="3" fill="#FFD54F" />
    <circle cx="36" cy="30" r="2" fill="#FFD54F" />
  </svg>
);

/**
 * Tab 3 Icon: 3D Metallic Gear
 */
export const NavSettingsIcon: React.FC<{ className?: string }> = ({
  className = 'w-11 h-11',
}) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <circle
      cx="24"
      cy="24"
      r="14"
      fill="#CFD8DC"
      stroke="#37474F"
      strokeWidth="3"
    />
    <circle
      cx="24"
      cy="24"
      r="10"
      fill="#ECEFF1"
      stroke="#90A4AE"
      strokeWidth="2"
    />
    <circle cx="24" cy="24" r="5" fill="#455A64" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <rect
        key={deg}
        x="21.5"
        y="5"
        width="5"
        height="5"
        rx="1.5"
        fill="#CFD8DC"
        stroke="#37474F"
        strokeWidth="1.5"
        transform={`rotate(${deg} 24 24)`}
      />
    ))}
  </svg>
);

/**
 * Tab 2 Centerpiece: 220x220 Split Red & Blue 3D Shield with Crossed Broadswords
 */
export const BattleCrest220: React.FC = () => (
  <div className="relative w-[220px] h-[220px] mx-auto select-none animate-tooltip-float">
    <svg viewBox="0 0 220 220" className="w-full h-full drop-shadow-2xl" aria-label="1v1 Battle Crest">
      <defs>
        <linearGradient id="shieldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ECEFF1" />
          <stop offset="50%" stopColor="#90A4AE" />
          <stop offset="100%" stopColor="#455A64" />
        </linearGradient>
        <linearGradient id="bladeLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#CFD8DC" />
          <stop offset="100%" stopColor="#78909C" />
        </linearGradient>
      </defs>

      {/* Corner Action Sparks */}
      <polygon points="34,36 42,26 48,38 38,44" fill="#FFC800" />
      <polygon points="184,36 174,26 168,38 178,44" fill="#FF5252" />
      <polygon points="44,175 34,185 48,188" fill="#FFFFFF" />
      <polygon points="174,175 184,185 170,188" fill="#FFC800" />

      {/* Outer Metallic 3D Shield Frame */}
      <path
        d="M110 22 L178 48 V114 C178 158 146 186 110 202 C74 186 42 158 42 114 V48 Z"
        fill="url(#shieldMetal)"
        stroke="#263238"
        strokeWidth="5"
      />

      {/* Left Red Half of Inner Shield */}
      <path
        d="M110 36 L56 56 V112 C56 147 81 170 110 184 Z"
        fill="#D32F2F"
      />
      {/* Right Blue Half of Inner Shield */}
      <path
        d="M110 36 L164 56 V112 C164 147 139 170 110 184 Z"
        fill="#1976D2"
      />

      {/* Shield Inner Bevel Border */}
      <path
        d="M110 36 L164 56 V112 C164 147 139 170 110 184 C81 170 56 147 56 112 V56 Z"
        fill="none"
        stroke="#37474F"
        strokeWidth="4"
      />

      {/* Sword 1 (Bottom-Left Gold Hilt to Top-Right Blade) */}
      <g>
        <polygon
          points="72,134 156,50 170,44 164,58 80,142"
          fill="url(#bladeLight)"
          stroke="#263238"
          strokeWidth="3.5"
        />
        <rect
          x="58"
          y="134"
          width="34"
          height="10"
          rx="4"
          transform="rotate(45 75 139)"
          fill="#FFB300"
          stroke="#4E342E"
          strokeWidth="3"
        />
        <rect
          x="48"
          y="148"
          width="22"
          height="12"
          rx="4"
          transform="rotate(-45 59 154)"
          fill="#F57C00"
          stroke="#4E342E"
          strokeWidth="3"
        />
      </g>

      {/* Sword 2 (Bottom-Right Blue Hilt to Top-Left Blade) */}
      <g>
        <polygon
          points="148,134 64,50 50,44 56,58 140,142"
          fill="url(#bladeLight)"
          stroke="#263238"
          strokeWidth="3.5"
        />
        <rect
          x="128"
          y="134"
          width="34"
          height="10"
          rx="4"
          transform="rotate(-45 145 139)"
          fill="#90A4AE"
          stroke="#263238"
          strokeWidth="3"
        />
        <rect
          x="150"
          y="148"
          width="22"
          height="12"
          rx="4"
          transform="rotate(45 161 154)"
          fill="#5C6BC0"
          stroke="#263238"
          strokeWidth="3"
        />
      </g>
    </svg>
  </div>
);

/**
 * 3D Cryo-Crystal Streak Freeze Shield Icon for the Shop & Streak Bar
 */
export const StreakFreeze3DIcon: React.FC<{ className?: string }> = ({
  className = 'w-8 h-8',
}) => {
  const uid = React.useId().replace(/:/g, '');
  const outerId = `cryoOuter-${uid}`;
  const coreId = `cryoCore-${uid}`;

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F7FA" />
          <stop offset="45%" stopColor="#26C6DA" />
          <stop offset="100%" stopColor="#0277BD" />
        </linearGradient>
        <linearGradient id={coreId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#80DEEA" />
          <stop offset="100%" stopColor="#00ACC1" />
        </linearGradient>
      </defs>
      {/* 3D Hexagonal Ice Shield */}
      <path
        d="M24 3 L41 11 V25 C41 35 33 42 24 45 C15 42 7 35 7 25 V11 Z"
        fill={`url(#${outerId})`}
        stroke="#01579B"
        strokeWidth="2.4"
      />
      <path
        d="M24 8 L36 14 V24 C36 31 30 37 24 40 C18 37 12 31 12 24 V14 Z"
        fill={`url(#${coreId})`}
        stroke="#E0F7FA"
        strokeWidth="1.5"
      />
      {/* Frozen Flame / Snowflake Core */}
      <path
        d="M24 13 V33 M15 18 L33 28 M33 18 L15 28"
        stroke="#01579B"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="24" cy="23" r="3.5" fill="#FFFFFF" stroke="#0288D1" strokeWidth="1.5" />
    </svg>
  );
};

