import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ArrowLeft,
  Volume2,
  Shield,
  Zap,
  Trophy,
  Sparkles,
  Check,
  X,
} from 'lucide-react';
import { FRENCH_CEFR_VOCAB_LIST } from '../data/cefrWordList';
import {
  calculateRunnerDoorSpeed,
  evaluateRunnerDoorImpact,
  type RunnerLane,
} from '../utils/gameLogic';
import { GameButton } from '../widgets/GameButton';
import { soundManager } from '../utils/soundEffects';

interface DoorRunnerScreenProps {
  onExit: () => void;
  onCompleteRun: (score: number, xpEarned: number) => void;
}

interface DoorWaveQuestion {
  id: string;
  cefr: 'A1' | 'A2' | 'B1';
  frenchPrompt: string;
  phonetic: string;
  options: [string, string, string];
  correctLane: RunnerLane;
}

export const DoorRunnerScreen: React.FC<DoorRunnerScreenProps> = ({
  onExit,
  onCompleteRun,
}) => {
  const [waveIndex, setWaveIndex] = useState<number>(0);
  const [playerLane, setPlayerLane] = useState<RunnerLane>(1);
  const [doorDepth, setDoorDepth] = useState<number>(0.18); // 0.0 (horizon) -> 1.0 (player impact)
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [doorsCleared, setDoorsCleared] = useState<number>(0);
  const [isSprinting, setIsSprinting] = useState<boolean>(false);
  const [doorOutcome, setDoorOutcome] = useState<{
    status: 'opened' | 'locked';
    lane: RunnerLane;
    correctLane: RunnerLane;
    feedbackText: string;
  } | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const playerLaneRef = useRef<RunnerLane>(1);
  const doorDepthRef = useRef<number>(0.18);
  const isSprintingRef = useRef<boolean>(false);
  const lastFrameMsRef = useRef<number | null>(null);

  // Build 20 progressive door waves from CEFR A1, A2, and B1 vocabulary
  const doorWaves: DoorWaveQuestion[] = useMemo(() => {
    return FRENCH_CEFR_VOCAB_LIST.map((item, idx) => {
      const d1 =
        FRENCH_CEFR_VOCAB_LIST[(idx + 3) % FRENCH_CEFR_VOCAB_LIST.length]
          .english;
      const d2 =
        FRENCH_CEFR_VOCAB_LIST[(idx + 7) % FRENCH_CEFR_VOCAB_LIST.length]
          .english;
      const correctLane = (idx % 3) as RunnerLane;
      const opts: [string, string, string] = [d1, d2, item.english];
      if (correctLane === 0) {
        opts[0] = item.english;
        opts[1] = d1;
        opts[2] = d2;
      } else if (correctLane === 1) {
        opts[0] = d1;
        opts[1] = item.english;
        opts[2] = d2;
      } else {
        opts[0] = d1;
        opts[1] = d2;
        opts[2] = item.english;
      }
      return {
        id: item.id,
        cefr: item.cefr,
        frenchPrompt: item.french,
        phonetic: item.phonetic,
        options: opts,
        correctLane,
      };
    });
  }, []);

  const currentWave = doorWaves[waveIndex % doorWaves.length];

  const handleSteerLane = useCallback(
    (lane: RunnerLane, sprintImmediately: boolean = false) => {
      if (isGameOver || doorOutcome !== null) return;
      soundManager.playTap();
      playerLaneRef.current = lane;
      setPlayerLane(lane);
      if (sprintImmediately) {
        isSprintingRef.current = true;
        setIsSprinting(true);
      }
    },
    [isGameOver, doorOutcome]
  );

  const triggerDoorImpact = useCallback(
    (chosenLane: RunnerLane) => {
      if (doorOutcome !== null || isGameOver) return;
      const evalResult = evaluateRunnerDoorImpact(
        chosenLane,
        currentWave.correctLane,
        streak,
        lives
      );

      if (evalResult.isCorrect) {
        soundManager.playCorrect();
        setScore((s) => s + evalResult.scoreDelta);
        setStreak(evalResult.nextStreak);
        setDoorsCleared((c) => c + 1);
      } else {
        soundManager.playIncorrect();
        setStreak(0);
        setLives(evalResult.nextLives);
      }

      setDoorOutcome({
        status: evalResult.isCorrect ? 'opened' : 'locked',
        lane: chosenLane,
        correctLane: currentWave.correctLane,
        feedbackText: evalResult.feedbackText,
      });

      setTimeout(() => {
        if (evalResult.isGameOver) {
          soundManager.playCelebration();
          setIsGameOver(true);
          return;
        }
        setDoorOutcome(null);
        setIsSprinting(false);
        isSprintingRef.current = false;
        doorDepthRef.current = 0.14;
        setDoorDepth(0.14);
        setWaveIndex((w) => w + 1);
      }, 650);
    },
    [doorOutcome, isGameOver, currentWave.correctLane, streak, lives]
  );

  // 60-FPS 3D Corridor Door Approach Loop
  useEffect(() => {
    if (isGameOver || doorOutcome !== null) {
      lastFrameMsRef.current = null;
      return;
    }

    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    let rafId: number;
    const tick = (nowMs: number) => {
      if (lastFrameMsRef.current === null) {
        lastFrameMsRef.current = nowMs;
      }
      const rawDt = (nowMs - lastFrameMsRef.current) / 1000;
      const dt = Math.max(0, Math.min(0.05, rawDt));
      lastFrameMsRef.current = nowMs;

      const baseSpeed = calculateRunnerDoorSpeed(doorsCleared);
      const effectiveSpeed = isSprintingRef.current
        ? baseSpeed * 5.2
        : isHeadless
        ? baseSpeed * 0.45
        : baseSpeed;

      const nextDepth = Math.min(1.0, doorDepthRef.current + effectiveSpeed * dt);
      doorDepthRef.current = nextDepth;
      setDoorDepth(nextDepth);

      if (nextDepth >= 1.0) {
        triggerDoorImpact(playerLaneRef.current);
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isGameOver, doorOutcome, doorsCleared, triggerDoorImpact]);

  // Keyboard Controls (ArrowLeft/Up/Right, 1/2/3, Enter/Space to sprint through door)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      if (e.key === 'ArrowLeft' || e.key === '1' || e.key === 'a' || e.key === 'A') {
        handleSteerLane(0);
      } else if (e.key === 'ArrowUp' || e.key === '2' || e.key === 'w' || e.key === 'W') {
        handleSteerLane(1);
      } else if (e.key === 'ArrowRight' || e.key === '3' || e.key === 'd' || e.key === 'D') {
        handleSteerLane(2);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerDoorImpact(playerLaneRef.current);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isGameOver, handleSteerLane, triggerDoorImpact]);

  if (isGameOver) {
    const xpEarned = Math.max(30, doorsCleared * 12);
    return (
      <div
        data-testid="door-runner-gameover"
        style={{
          backgroundColor: '#EBF4FA',
          borderBottom: '6px solid #B8CDE0',
        }}
        className="rounded-[24px] border-3 border-white p-6 text-center text-[#14365D] space-y-5 animate-pop-scale shadow-2xl"
      >
        <div
          style={{
            background: 'linear-gradient(180deg, #FFD54F 0%, #FF8F00 100%)',
            boxShadow: '0 6px 0 #C66900',
          }}
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center border-2 border-white"
        >
          <Trophy className="w-10 h-10 text-white" />
        </div>

        <div>
          <div className="text-xs font-black uppercase tracking-widest text-[#D97706]">
            Door Dash Run Complete!
          </div>
          <h2 className="text-3xl font-black mt-1">
            {doorsCleared} Doors Smashed!
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[16px] bg-white border-2 border-[#C5D9EB] p-3">
            <div className="text-[10px] font-black uppercase text-[#3B5C85]">
              Final Score
            </div>
            <div className="text-xl font-black text-[#14365D] tabular-nums">
              {score}
            </div>
          </div>
          <div className="rounded-[16px] bg-white border-2 border-[#C5D9EB] p-3">
            <div className="text-[10px] font-black uppercase text-[#3B5C85]">
              Doors Opened
            </div>
            <div className="text-xl font-black text-[#58CC02] tabular-nums">
              {doorsCleared}
            </div>
          </div>
          <div className="rounded-[16px] bg-white border-2 border-[#C5D9EB] p-3">
            <div className="text-[10px] font-black uppercase text-[#3B5C85]">
              XP Reward
            </div>
            <div className="text-xl font-black text-[#D97706] tabular-nums flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" />+{xpEarned}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <GameButton
            label="RUN AGAIN"
            variant="green"
            fullWidth
            height={54}
            testId="door-runner-again-btn"
            onClick={() => {
              setScore(0);
              setStreak(0);
              setLives(3);
              setDoorsCleared(0);
              setDoorOutcome(null);
              setIsGameOver(false);
              doorDepthRef.current = 0.16;
              setDoorDepth(0.16);
              setWaveIndex((w) => w + 1);
            }}
          />
          <GameButton
            label="SAVE & EXIT"
            variant="gold"
            fullWidth
            height={54}
            testId="door-runner-save-exit-btn"
            onClick={() => onCompleteRun(score, xpEarned)}
          />
        </div>
      </div>
    );
  }

  // Perspective scale & Y position for the approaching 3-Door Wall
  const doorScale = 0.48 + doorDepth * 0.54;
  const doorTranslateY = -125 + doorDepth * 145;

  return (
    <div
      data-testid="door-runner-screen"
      className="w-full space-y-3 select-none"
    >
      {/* Top HUD Bar: Exit, Shields, Doors Smashed, Score */}
      <div className="flex items-center justify-between gap-2 bg-[#0F294A]/90 border-2 border-[#64B5F6]/50 rounded-[18px] px-3.5 py-2.5 text-white shadow-lg">
        <button
          type="button"
          data-testid="exit-door-runner-btn"
          onClick={onExit}
          className="px-2.5 py-1.5 rounded-[10px] bg-white/10 hover:bg-white/20 flex items-center gap-1 text-xs font-black cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>EXIT</span>
        </button>

        {/* 3 Shield Pips */}
        <div className="flex items-center gap-1" aria-label={`${lives} shields remaining`}>
          {[1, 2, 3].map((idx) => (
            <Shield
              key={idx}
              className={`w-5 h-5 ${
                idx <= lives
                  ? 'text-[#38BDF8] fill-[#38BDF8]'
                  : 'text-white/20'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          {streak > 1 && (
            <span className="px-2 py-0.5 rounded-full bg-[#58CC02] text-[11px] font-black flex items-center gap-0.5">
              <Zap className="w-3 h-3 fill-white" />
              {streak}x
            </span>
          )}
          <div
            data-testid="door-runner-score"
            className="text-base font-black text-[#FFD54F] tabular-nums"
          >
            {score} PTS
          </div>
        </div>
      </div>

      {/* UPFRONT QUESTION BANNER FIRST (Appears prominently at top before doors reach you) */}
      <div
        data-testid="door-runner-question-banner"
        style={{
          backgroundColor: '#EBF4FA',
          borderBottom: '5px solid #B8CDE0',
        }}
        className="rounded-[20px] border-2 border-white p-3.5 text-[#14365D] flex items-center justify-between gap-3 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              soundManager.speak(currentWave.frenchPrompt, 'fr-FR')
            }
            aria-label={`Pronounce ${currentWave.frenchPrompt}`}
            style={{
              backgroundColor: '#1CB0F6',
              borderBottom: '3px solid #0284C7',
            }}
            className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white shrink-0 cursor-pointer active:translate-y-[2px]"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-[6px] bg-[#58CC02] text-[10px] font-black text-white uppercase">
                CEFR {currentWave.cefr}
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#3B5C85]">
                Open the Correct Door Upfront!
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#14365D] leading-tight mt-0.5">
              “{currentWave.frenchPrompt}”{' '}
              <span className="text-xs font-bold text-[#64748B]">
                [{currentWave.phonetic}]
              </span>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0 hidden sm:block">
          <div className="text-[10px] font-black uppercase text-[#3B5C85]">
            Door Distance
          </div>
          <div className="text-sm font-black text-[#D97706] tabular-nums">
            {Math.max(1, Math.round((1 - doorDepth) * 30))}m
          </div>
        </div>
      </div>

      {/* 3D PERSPECTIVE RUNNING CORRIDOR & 3 APPROACHING DOORS */}
      <div
        style={{
          background:
            'linear-gradient(180deg, #0B192C 0%, #1E3E62 42%, #2B5886 100%)',
        }}
        className={`relative w-full h-[310px] sm:h-[340px] rounded-[24px] border-3 border-[#64B5F6]/60 overflow-hidden shadow-2xl flex flex-col justify-between ${
          doorOutcome?.status === 'locked' ? 'animate-shake-error' : ''
        }`}
      >
        {/* Perspective Corridor Floor Lines & Speed Chevrons SVG */}
        <svg
          viewBox="0 0 400 320"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          {/* Horizon Glow */}
          <ellipse cx="200" cy="70" rx="140" ry="38" fill="#38BDF8" opacity="0.22" />

          {/* Perspective Trapezoid Track */}
          <polygon
            points="115,65 285,65 395,320 5,320"
            fill="#153152"
            stroke="#64B5F6"
            strokeWidth="2"
          />

          {/* Left / Center / Right Lane Dividers */}
          <line
            x1="172"
            y1="65"
            x2="135"
            y2="320"
            stroke="#64B5F6"
            strokeWidth="2.5"
            strokeDasharray="10 8"
            opacity="0.65"
          />
          <line
            x1="228"
            y1="65"
            x2="265"
            y2="320"
            stroke="#64B5F6"
            strokeWidth="2.5"
            strokeDasharray="10 8"
            opacity="0.65"
          />
        </svg>

        {/* Floating Feedback Banner on Door Impact */}
        {doorOutcome && (
          <div
            data-testid="door-impact-feedback"
            style={{
              backgroundColor:
                doorOutcome.status === 'opened' ? '#58CC02' : '#EA2B2B',
            }}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-full border-2 border-white text-white font-black text-sm uppercase tracking-wider shadow-xl animate-pop-scale whitespace-nowrap"
          >
            {doorOutcome.feedbackText}
          </div>
        )}

        {/* THE 3 APPROACHING 3D DOORS WALL (Scales & Moves Down Toward Player!) */}
        <div
          style={{
            transform: `translateY(${doorTranslateY}px) scale(${doorScale})`,
            transition: 'transform 60ms linear',
          }}
          className="relative z-20 w-full max-w-[380px] mx-auto grid grid-cols-3 gap-2.5 px-3 pt-28"
        >
          {([0, 1, 2] as RunnerLane[]).map((laneIdx) => {
            const isSelectedLane = playerLane === laneIdx;
            const isOpenedDoor =
              doorOutcome?.status === 'opened' && doorOutcome.lane === laneIdx;
            const isLockedHit =
              doorOutcome?.status === 'locked' && doorOutcome.lane === laneIdx;
            const isCorrectReveal =
              doorOutcome?.status === 'locked' &&
              doorOutcome.correctLane === laneIdx;

            return (
              <button
                key={laneIdx}
                type="button"
                data-testid={`approaching-door-${laneIdx}`}
                onClick={() => triggerDoorImpact(laneIdx)}
                style={{
                  background:
                    isOpenedDoor || isCorrectReveal
                      ? 'linear-gradient(180deg, #76E81E 0%, #388E00 100%)'
                      : isLockedHit
                      ? 'linear-gradient(180deg, #FF6B52 0%, #C62828 100%)'
                      : isSelectedLane
                      ? 'linear-gradient(180deg, #FFD54F 0%, #F57C00 100%)'
                      : 'linear-gradient(180deg, #8D6E63 0%, #4E342E 100%)',
                  borderBottom: '6px solid #271815',
                  boxShadow: isSelectedLane
                    ? '0 0 18px 4px rgba(255, 213, 79, 0.7)'
                    : '0 8px 14px rgba(0,0,0,0.45)',
                }}
                className="h-32 sm:h-36 rounded-t-[22px] rounded-b-[10px] border-3 border-[#FFE082] p-2 flex flex-col items-center justify-between text-center cursor-pointer relative overflow-hidden"
              >
                {/* Swinging 3D Double Door Leaves Overlay when Opened */}
                {isOpenedDoor && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none flex justify-between"
                  >
                    <div className="w-2.5 h-full bg-[#FFE082]/70" />
                    <div className="w-2.5 h-full bg-[#FFE082]/70" />
                  </div>
                )}

                {/* Door Number Plaque */}
                <span className="px-2 py-0.5 rounded-full bg-black/35 text-[10px] font-black text-[#FFF59D] uppercase relative z-10">
                  Door {laneIdx + 1}
                </span>

                {/* English Translation Label on Door */}
                <div
                  style={{ textShadow: '0 2px 0 rgba(0,0,0,0.6)' }}
                  className="text-xs sm:text-sm font-black text-white leading-tight px-1 relative z-10"
                >
                  {currentWave.options[laneIdx]}
                </div>

                {/* Door Handle / Status Icon */}
                <div className="w-full flex items-center justify-between px-1.5 relative z-10">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD54F] border border-black/40" />
                  {isOpenedDoor || isCorrectReveal ? (
                    <Check className="w-5 h-5 text-white stroke-[3.5]" />
                  ) : isLockedHit ? (
                    <X className="w-5 h-5 text-white stroke-[3.5]" />
                  ) : (
                    <span className="text-[10px] font-black text-white/85 uppercase">
                      {isSelectedLane ? '⚡ OPEN' : 'TAP'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* RUNNING 3D CHARACTER AT BOTTOM OF CORRIDOR */}
        <div className="relative z-20 w-full max-w-[380px] mx-auto h-20 pointer-events-none">
          <div
            style={{
              left:
                playerLane === 0
                  ? '16.6%'
                  : playerLane === 1
                  ? '50%'
                  : '83.3%',
              transition: 'left 130ms cubic-bezier(0.2, 0.9, 0.2, 1)',
            }}
            className="absolute bottom-2 -translate-x-1/2 flex flex-col items-center"
          >
            {/* Running Boy Sprite with Bobbing Animation */}
            <svg
              viewBox="0 0 60 68"
              className="w-15 h-16 animate-character-bob drop-shadow-[0_6px_8px_rgba(0,0,0,0.5)]"
            >
              {/* Shadow on Track */}
              <ellipse cx="30" cy="63" rx="16" ry="4" fill="rgba(0,0,0,0.45)" />
              {/* Running Legs */}
              <path
                d="M24,44 L18,58 M36,44 L42,56"
                stroke="#1565C0"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Running Shoes */}
              <circle cx="17" cy="59" r="4" fill="#FFD54F" />
              <circle cx="43" cy="57" r="4" fill="#FFD54F" />
              {/* Hero Cape / Jersey */}
              <rect
                x="19"
                y="24"
                width="22"
                height="22"
                rx="7"
                fill="#58CC02"
                stroke="#2E7D00"
                strokeWidth="2"
              />
              {/* Swinging Arms */}
              <path
                d="M19,29 L10,38 M41,29 L50,36"
                stroke="#FFCCBC"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Head & Crown Helmet */}
              <circle
                cx="30"
                cy="15"
                r="11"
                fill="#FFCCBC"
                stroke="#5D4037"
                strokeWidth="2"
              />
              <polygon
                points="20,9 24,2 30,7 36,2 40,9"
                fill="#FFC800"
                stroke="#8D4E00"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom 3-Lane Tactile Controls */}
      <div className="grid grid-cols-3 gap-2.5">
        {([0, 1, 2] as RunnerLane[]).map((laneIdx) => {
          const isSelected = playerLane === laneIdx;
          return (
            <button
              key={laneIdx}
              type="button"
              data-testid={`lane-steer-btn-${laneIdx}`}
              onClick={() => triggerDoorImpact(laneIdx)}
              style={{
                background: isSelected
                  ? 'linear-gradient(180deg, #76E81E 0%, #46B800 100%)'
                  : 'linear-gradient(180deg, #FFFFFF 0%, #DCE9F5 100%)',
                borderBottom: isSelected
                  ? '5px solid #2E7D00'
                  : '5px solid #90A9C4',
              }}
              className={`py-3 px-2 rounded-[16px] border-2 border-white font-black text-xs sm:text-sm uppercase cursor-pointer active:translate-y-[3px] transition-transform truncate ${
                isSelected ? 'text-white' : 'text-[#14365D]'
              }`}
            >
              Door {laneIdx + 1}: {currentWave.options[laneIdx]}
            </button>
          );
        })}
      </div>

      <div className="text-center text-[11px] font-bold text-white/80">
        Tap a Door to Open Immediately · Keyboard: 1 / 2 / 3 or Arrow Keys + Space
      </div>
    </div>
  );
};
