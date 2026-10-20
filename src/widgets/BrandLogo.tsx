import React from 'react';

export const BrandLogo: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      {/* 3D Royal Shield & Shiba Beret Emblem */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
          boxShadow: '0 4px 0 #1E3A8A',
        }}
        className="w-11 h-11 rounded-[14px] border-2 border-[#FFC800] flex items-center justify-center relative shrink-0 overflow-hidden"
      >
        <svg
          viewBox="0 0 48 48"
          className="w-9 h-9 animate-character-bob"
          aria-hidden="true"
        >
          {/* Golden Crown on top */}
          <polygon
            points="14,13 18,6 24,11 30,6 34,13"
            fill="#FFC800"
            stroke="#B45309"
            strokeWidth="1.2"
          />
          {/* Shiba Ears */}
          <polygon points="11,22 15,12 21,19" fill="#FF6B2B" />
          <polygon points="37,22 33,12 27,19" fill="#FF6B2B" />
          {/* Head */}
          <ellipse cx="24" cy="28" rx="13" ry="11" fill="#FF854D" />
          <ellipse cx="24" cy="31" rx="9.5" ry="7.5" fill="#FFF7F2" />
          {/* Eyes */}
          <circle cx="19" cy="25.5" r="2.1" fill="#1E1B4B" />
          <circle cx="19.6" cy="24.8" r="0.7" fill="#FFFFFF" />
          <circle cx="29" cy="25.5" r="2.1" fill="#1E1B4B" />
          <circle cx="29.6" cy="24.8" r="0.7" fill="#FFFFFF" />
          {/* Nose & Smile */}
          <ellipse cx="24" cy="28.5" rx="2" ry="1.5" fill="#1E1B4B" />
          <path
            d="M 21 31.5 Q 24 34.5 27 31.5"
            stroke="#1E1B4B"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          {/* French Tricolor Collar */}
          <rect x="15" y="38" width="6" height="3.5" rx="1" fill="#2563EB" />
          <rect x="21" y="38" width="6" height="3.5" rx="1" fill="#FFFFFF" />
          <rect x="27" y="38" width="6" height="3.5" rx="1" fill="#EF4444" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1">
          <span className="text-lg sm:text-2xl font-black tracking-tight text-[#1E1B4B]">
            Dog<span className="text-[#7C3AED]">Lingo</span>
          </span>
          <span className="px-1.5 py-0.5 rounded-[6px] bg-[#2563EB] text-white text-[10px] font-black uppercase tracking-wider">
            FR
          </span>
        </div>
        <span className="hidden sm:block text-[11px] font-extrabold text-[#64748B] tracking-wide mt-0.5">
          Royale French Arena
        </span>
      </div>
    </div>
  );
};
