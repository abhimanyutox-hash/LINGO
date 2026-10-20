import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Unlock,
  Check,
} from 'lucide-react';
import { TactileButton } from '../widgets/TactileButton';
import { soundManager } from '../utils/soundEffects';

interface SettingsScreenProps {
  playerName: string;
  onChangePlayerName: (name: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  dailyGoalXp: number;
  onChangeDailyGoalXp: (xp: number) => void;
  completedLevels: number;
  totalLevels: number;
  onUnlockAllLevels: () => void;
  onResetProgress: () => void;
}

const DAILY_GOALS = [
  { xp: 10, label: 'Casual · 10 XP / day' },
  { xp: 20, label: 'Regular · 20 XP / day' },
  { xp: 50, label: 'Serious · 50 XP / day' },
  { xp: 100, label: 'Intense · 100 XP / day' },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  playerName,
  onChangePlayerName,
  isMuted,
  onToggleMute,
  dailyGoalXp,
  onChangeDailyGoalXp,
  completedLevels,
  totalLevels,
  onUnlockAllLevels,
  onResetProgress,
}) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 2200);
  };

  return (
    <div
      data-testid="settings-screen-view"
      className="max-w-xl mx-auto space-y-6 pb-28 pt-2"
    >
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#58CC02]">
          Tab 4 · Preferences & Account
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#4B4B4B] mt-0.5">
          Settings
        </h1>
        <p className="text-sm font-bold text-[#777777] mt-1">
          Configure audio, daily French goals, and course progress.
        </p>
      </div>

      {statusMessage && (
        <div className="rounded-[14px] border-2 border-[#58CC02] bg-[#D7FFB8] px-4 py-3 text-xs font-black text-[#58A700] flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Profile Section */}
      <div
        style={{ boxShadow: '0 4px 0 #E5E5E5' }}
        className="rounded-[18px] border-2 border-[#E5E5E5] bg-white p-5 space-y-4"
      >
        <h2 className="text-base font-black text-[#4B4B4B]">
          Player Profile
        </h2>
        <div>
          <label
            htmlFor="player-name-input"
            className="block text-xs font-extrabold uppercase text-[#777777] mb-1.5"
          >
            Display Name
          </label>
          <input
            id="player-name-input"
            data-testid="settings-player-name-input"
            type="text"
            value={playerName}
            onChange={(e) => onChangePlayerName(e.target.value)}
            className="w-full h-11 rounded-[12px] border-2 border-[#E5E5E5] px-3.5 text-sm font-extrabold text-[#4B4B4B] focus:outline-none focus:border-[#1CB0F6]"
          />
        </div>
      </div>

      {/* Sound & French Pronunciation Section */}
      <div
        style={{ boxShadow: '0 4px 0 #E5E5E5' }}
        className="rounded-[18px] border-2 border-[#E5E5E5] bg-white p-5 space-y-4"
      >
        <h2 className="text-base font-black text-[#4B4B4B]">
          Audio & French Voice
        </h2>

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-black text-[#4B4B4B]">
              Sound Effects & Voice
            </div>
            <div className="text-xs font-bold text-[#777777]">
              {isMuted ? 'Audio is currently muted' : 'Tactile clicks, chimes & French TTS enabled'}
            </div>
          </div>

          <button
            type="button"
            data-testid="settings-toggle-mute-btn"
            onClick={onToggleMute}
            style={{
              backgroundColor: isMuted ? '#E5E5E5' : '#58CC02',
              boxShadow: isMuted ? '0 3px 0 #CECECE' : '0 3px 0 #58A700',
            }}
            className="px-4 py-2 rounded-[12px] text-xs font-black uppercase text-white flex items-center gap-1.5 cursor-pointer active:translate-y-[2px]"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-[#4B4B4B]" />
                <span className="text-[#4B4B4B]">MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>SOUND ON</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-1">
          <TactileButton
            label="TEST FRENCH PRONUNCIATION"
            variant="secondary"
            fullWidth
            size="md"
            testId="settings-test-voice-btn"
            onClick={() => {
              soundManager.speak('Bonjour ! Bienvenue à Paris.', 'fr-FR');
              showToast('Playing French audio: "Bonjour ! Bienvenue à Paris."');
            }}
          />
        </div>
      </div>

      {/* Daily XP Goal Section */}
      <div
        style={{ boxShadow: '0 4px 0 #E5E5E5' }}
        className="rounded-[18px] border-2 border-[#E5E5E5] bg-white p-5 space-y-3"
      >
        <h2 className="text-base font-black text-[#4B4B4B]">
          Daily French XP Goal
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DAILY_GOALS.map((goal) => {
            const selected = dailyGoalXp === goal.xp;
            return (
              <button
                key={goal.xp}
                type="button"
                data-testid={`daily-goal-${goal.xp}`}
                onClick={() => {
                  soundManager.playTap();
                  onChangeDailyGoalXp(goal.xp);
                  showToast(`Daily goal updated to ${goal.xp} XP`);
                }}
                style={{
                  backgroundColor: selected ? '#DDF4FF' : '#FFFFFF',
                  borderColor: selected ? '#1CB0F6' : '#E5E5E5',
                  boxShadow: selected ? '0 3px 0 #1CB0F6' : '0 3px 0 #E5E5E5',
                }}
                className={`p-3 rounded-[12px] border-2 text-left text-xs font-extrabold cursor-pointer ${
                  selected ? 'text-[#1CB0F6]' : 'text-[#4B4B4B]'
                }`}
              >
                {goal.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Course Progress Section */}
      <div
        style={{ boxShadow: '0 4px 0 #E5E5E5' }}
        className="rounded-[18px] border-2 border-[#E5E5E5] bg-white p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#4B4B4B]">
            French Path Progress
          </h2>
          <span className="text-xs font-black text-[#58CC02]">
            {completedLevels} / {totalLevels} Levels Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TactileButton
            label="UNLOCK ALL 20 LEVELS"
            variant="primary"
            fullWidth
            size="md"
            testId="settings-unlock-all-btn"
            icon={<Unlock className="w-4 h-4" />}
            onClick={() => {
              onUnlockAllLevels();
              showToast('Unlocked all 20 French levels & CEFR A0–A2 gates!');
            }}
          />

          <TactileButton
            label="RESET PROGRESS"
            variant="danger"
            fullWidth
            size="md"
            testId="settings-reset-btn"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => {
              onResetProgress();
              showToast('Course progress reset to Level 1.');
            }}
          />
        </div>
      </div>
    </div>
  );
};
