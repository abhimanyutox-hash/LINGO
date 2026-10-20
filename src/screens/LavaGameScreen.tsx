import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Flame,
  Zap,
  ArrowLeft,
  Code2,
  Copy,
  Check,
  X,
  Trophy,
  Sparkles,
  Lightbulb,
  Users,
} from 'lucide-react';
import {
  LAVA_QUESTIONS_BANK,
  LAVA_FLUTTER_FILES,
} from '../data/lavaData';
import {
  LAVA_INITIAL_PLAYER_ALTITUDE,
  LAVA_INITIAL_ALTITUDE,
  LAVA_PIXELS_PER_METER,
  LAVA_WRONG_ANSWER_SURGE_METERS,
  calculateLavaSpeed,
  stepLavaAltitude,
  calculateLavaSpeedBonus,
  computeLavaRaceRank,
  validateLavaAnswer,
} from '../utils/gameLogic';
import { TactileButton } from '../widgets/TactileButton';
import { soundManager } from '../utils/soundEffects';

interface LavaGameScreenProps {
  onExit: () => void;
  onCompleteRun: (xpEarned: number, peakAltitude: number) => void;
}

interface TowerTileItem {
  id: string;
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  heightGain: number;
}

interface RivalClimber {
  id: string;
  name: string;
  altitude: number;
  baseSpeed: number;
  color: string;
  stunnedUntilMs: number;
}

export const LavaGameScreen: React.FC<LavaGameScreenProps> = ({
  onExit,
  onCompleteRun,
}) => {
  const [playerAltitude, setPlayerAltitude] = useState<number>(
    LAVA_INITIAL_PLAYER_ALTITUDE
  );
  const [peakAltitude, setPeakAltitude] = useState<number>(
    LAVA_INITIAL_PLAYER_ALTITUDE
  );
  const [lavaAltitude, setLavaAltitude] = useState<number>(
    LAVA_INITIAL_ALTITUDE
  );
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [typedText, setTypedText] = useState<string>('');
  const [elapsedQuestionSec, setElapsedQuestionSec] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPausedForCode, setIsPausedForCode] = useState<boolean>(false);
  const [activeDartFileIdx, setActiveDartFileIdx] = useState<number>(0);
  const [copiedDart, setCopiedDart] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // 4-Player Multiplayer Lava Race Rivals
  const [rivals, setRivals] = useState<RivalClimber[]>([
    {
      id: 'rival-1',
      name: 'Lucas_FR',
      altitude: 14.5,
      baseSpeed: 2.05,
      color: '#FFB300',
      stunnedUntilMs: 0,
    },
    {
      id: 'rival-2',
      name: 'Chloé_75',
      altitude: 13.8,
      baseSpeed: 1.85,
      color: '#CE82FF',
      stunnedUntilMs: 0,
    },
    {
      id: 'rival-3',
      name: 'Hugo_Lyon',
      altitude: 13.0,
      baseSpeed: 1.65,
      color: '#1CB0F6',
      stunnedUntilMs: 0,
    },
  ]);

  // Visual states for camera shake, wrong border flash, tile boost, rock drop, and combat text
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isWrongBorder, setIsWrongBorder] = useState<boolean>(false);
  const [isTileBoosting, setIsTileBoosting] = useState<boolean>(false);
  const [rockAttackBanner, setRockAttackBanner] = useState<string | null>(null);
  const [combatText, setCombatText] = useState<string | null>(
    'RACE 3 RIVALS · TYPE IN FRENCH TO CLIMB!'
  );

  const [towerTiles, setTowerTiles] = useState<TowerTileItem[]>([
    {
      id: 'base-tile',
      label: 'DÉPART 15m',
      bgColor: '#58CC02',
      borderColor: '#46A302',
      textColor: '#FFFFFF',
      heightGain: 15.0,
    },
  ]);

  // Mutable refs for 60-FPS Ticker loop accuracy
  const playerAltRef = useRef<number>(LAVA_INITIAL_PLAYER_ALTITUDE);
  const lavaAltRef = useRef<number>(LAVA_INITIAL_ALTITUDE);
  const scoreRef = useRef<number>(0);
  const questionStartMsRef = useRef<number>(performance.now());
  const wavePhaseRef = useRef<number>(0);
  const lastFrameMsRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const arenaContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentQuestion =
    LAVA_QUESTIONS_BANK[questionIndex % LAVA_QUESTIONS_BANK.length];

  // Calculate live 4-player Race Standings (1st to 4th)
  const playerRank = computeLavaRaceRank(
    playerAltitude,
    rivals.map((r) => r.altitude)
  );

  // Keep input focused for rapid typing
  const focusInput = useCallback(() => {
    if (!isGameOver && !isPausedForCode) {
      inputRef.current?.focus();
    }
  }, [isGameOver, isPausedForCode]);

  useEffect(() => {
    focusInput();
  }, [focusInput, questionIndex]);

  // Dual-sine-wave magma CustomPainter on HTML5 Canvas + 60-FPS physics Ticker
  useEffect(() => {
    if (isGameOver || isPausedForCode) {
      lastFrameMsRef.current = null;
      return;
    }

    let rafId: number;
    let lastUiSyncMs = 0;

    const tick = (nowMs: number) => {
      if (lastFrameMsRef.current === null) {
        lastFrameMsRef.current = nowMs;
      }
      const rawDt = (nowMs - lastFrameMsRef.current) / 1000.0;
      const dt = Math.min(rawDt, 0.1);
      lastFrameMsRef.current = nowMs;

      // 1. Update Lava Altitude with Escalating Difficulty Formula
      const nextLava = stepLavaAltitude(
        lavaAltRef.current,
        scoreRef.current,
        dt
      );
      lavaAltRef.current = nextLava;

      // Throttle React state updates to ~15 FPS so headless browsers never stall
      if (nowMs - lastUiSyncMs >= 65) {
        lastUiSyncMs = nowMs;
        setLavaAltitude(nextLava);
        setElapsedQuestionSec(
          Math.max(0, (nowMs - questionStartMsRef.current) / 1000.0)
        );
        // Advance AI rival climbers smoothly in the 4-player race
        setRivals((prev) =>
          prev.map((r) => {
            if (nowMs < r.stunnedUntilMs) return r;
            const climbDelta = r.baseSpeed * 0.065;
            const minSafe = nextLava + 1.2;
            return {
              ...r,
              altitude: Math.max(minSafe, r.altitude + climbDelta),
            };
          })
        );
      }

      // 2. Check Game Over Condition: lavaAltitude >= playerAltitude
      if (nextLava >= playerAltRef.current) {
        setLavaAltitude(nextLava);
        setIsGameOver(true);
        soundManager.playIncorrect();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([90, 50, 140]);
        }
        return;
      }

      // 3. Paint Dual-Sine-Wave Magma on Canvas
      const canvas = canvasRef.current;
      const container = arenaContainerRef.current;
      if (canvas && container) {
        const width = container.clientWidth || 640;
        const height = container.clientHeight || 420;
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, width, height);

          wavePhaseRef.current += dt * 4.2;
          const phase = wavePhaseRef.current;

          const playerAnchorY = height * 0.52;
          const altitudeGap = playerAltRef.current - nextLava;
          const lavaTopY =
            playerAnchorY + altitudeGap * LAVA_PIXELS_PER_METER;
          const clampedLavaTopY = Math.max(
            20,
            Math.min(height - 16, lavaTopY)
          );

          // Intense upward glow above the lava surface
          const glowGrad = ctx.createLinearGradient(
            0,
            clampedLavaTopY - 85,
            0,
            clampedLavaTopY + 15
          );
          glowGrad.addColorStop(0, 'rgba(255, 69, 0, 0)');
          glowGrad.addColorStop(0.65, 'rgba(255, 87, 34, 0.35)');
          glowGrad.addColorStop(1, 'rgba(255, 193, 7, 0.72)');
          ctx.fillStyle = glowGrad;
          ctx.fillRect(0, clampedLavaTopY - 85, width, 100);

          // Secondary background magma wave
          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 8) {
            const waveY =
              clampedLavaTopY +
              Math.sin((x / width) * Math.PI * 3 - phase * 0.85) * 7 +
              Math.cos((x / width) * Math.PI * 2 + phase * 0.6) * 4;
            ctx.lineTo(x, waveY);
          }
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fillStyle = 'rgba(255, 111, 0, 0.55)';
          ctx.fill();

          // Primary foreground dual-sine magma wave
          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 6) {
            const waveY =
              clampedLavaTopY +
              Math.sin((x / width) * Math.PI * 2 + phase) * 8 +
              Math.cos((x / width) * Math.PI * 4 - phase * 1.35) * 4.5;
            ctx.lineTo(x, waveY);
          }
          ctx.lineTo(width, height);
          ctx.closePath();

          const bodyGrad = ctx.createLinearGradient(
            0,
            clampedLavaTopY - 10,
            0,
            height
          );
          bodyGrad.addColorStop(0, '#FFE000');
          bodyGrad.addColorStop(0.18, '#FF5722');
          bodyGrad.addColorStop(0.6, '#C62828');
          bodyGrad.addColorStop(1, '#3E0000');
          ctx.fillStyle = bodyGrad;
          ctx.fill();

          // Bright molten crust line
          ctx.beginPath();
          for (let x = 0; x <= width; x += 6) {
            const waveY =
              clampedLavaTopY +
              Math.sin((x / width) * Math.PI * 2 + phase) * 8 +
              Math.cos((x / width) * Math.PI * 4 - phase * 1.35) * 4.5;
            if (x === 0) ctx.moveTo(x, waveY);
            else ctx.lineTo(x, waveY);
          }
          ctx.strokeStyle = '#FFF59D';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isGameOver, isPausedForCode]);

  const submitCandidateAnswer = useCallback(
    (candidateString: string) => {
      if (isGameOver || isPausedForCode) return;
      if (!candidateString.trim()) return;

      const isCorrect = validateLavaAnswer(
        candidateString,
        currentQuestion.acceptedTranslations
      );

      if (isCorrect) {
        const nowMs = performance.now();
        const timeTakenSeconds =
          (nowMs - questionStartMsRef.current) / 1000.0;
        const reward = calculateLavaSpeedBonus(timeTakenSeconds);

        const nextPlayerAlt = playerAltRef.current + reward.heightGain;
        playerAltRef.current = nextPlayerAlt;
        setPlayerAltitude(nextPlayerAlt);
        setPeakAltitude((prev) => Math.max(prev, nextPlayerAlt));

        const nextScore = scoreRef.current + 1;
        scoreRef.current = nextScore;
        setScore(nextScore);
        setStreak((prev) => prev + 1);

        const displayFrench = currentQuestion.primaryFrench.toUpperCase();
        setTowerTiles((prev) => [
          {
            id: `tile-${nowMs}`,
            label: `${displayFrench} (+${reward.heightGain}m)`,
            bgColor: reward.tileBgColor,
            borderColor: reward.tileBorderColor,
            textColor: reward.tileTextColor,
            heightGain: reward.heightGain,
          },
          ...prev.slice(0, 5),
        ]);

        // If blazing fast (< 2.0s), drop a volcanic rock on the leading rival!
        if (reward.tier === 'blazing') {
          setRivals((prev) =>
            prev.map((r, idx) =>
              idx === 0
                ? {
                    ...r,
                    altitude: Math.max(lavaAltRef.current + 2, r.altitude - 3.0),
                    stunnedUntilMs: nowMs + 2200,
                  }
                : r
            )
          );
          setRockAttackBanner('☄️ METEOR DROP! Lucas_FR -3.0m!');
          setTimeout(() => setRockAttackBanner(null), 1600);
        }

        setCombatText(reward.combatText);
        setIsTileBoosting(true);
        soundManager.playCorrect();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(25);
        }

        setTypedText('');
        setShowHint(false);
        setQuestionIndex((prev) => prev + 1);
        questionStartMsRef.current = performance.now();
        setElapsedQuestionSec(0);

        setTimeout(() => {
          setIsTileBoosting(false);
        }, 400);
      } else {
        // Wrong Answer Penalty: Horizontal camera shake + #FF4B4B flash + Lava surges +2.5m
        soundManager.playIncorrect();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([45, 30, 45]);
        }

        const surgedLava =
          lavaAltRef.current + LAVA_WRONG_ANSWER_SURGE_METERS;
        lavaAltRef.current = surgedLava;
        setLavaAltitude(surgedLava);
        setStreak(0);
        setTypedText('');
        setCombatText('⚠️ WRONG! LAVA SURGE +2.5m!');
        setIsShaking(true);
        setIsWrongBorder(true);

        if (surgedLava >= playerAltRef.current) {
          setIsGameOver(true);
        }

        setTimeout(() => {
          setIsShaking(false);
          setIsWrongBorder(false);
        }, 420);
      }
    },
    [
      currentQuestion.acceptedTranslations,
      currentQuestion.primaryFrench,
      isGameOver,
      isPausedForCode,
    ]
  );

  // Handle Enter / Form submission
  const handleSubmitAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    submitCandidateAnswer(typedText);
  };

  // Restart game cleanly
  const handleRestartGame = () => {
    soundManager.playTap();
    playerAltRef.current = LAVA_INITIAL_PLAYER_ALTITUDE;
    lavaAltRef.current = LAVA_INITIAL_ALTITUDE;
    scoreRef.current = 0;
    questionStartMsRef.current = performance.now();
    lastFrameMsRef.current = null;

    setPlayerAltitude(LAVA_INITIAL_PLAYER_ALTITUDE);
    setPeakAltitude(LAVA_INITIAL_PLAYER_ALTITUDE);
    setLavaAltitude(LAVA_INITIAL_ALTITUDE);
    setScore(0);
    setStreak(0);
    setTypedText('');
    setShowHint(false);
    setElapsedQuestionSec(0);
    setQuestionIndex((prev) => prev + 1);
    setRivals([
      {
        id: 'rival-1',
        name: 'Lucas_FR',
        altitude: 14.5,
        baseSpeed: 2.05,
        color: '#FFB300',
        stunnedUntilMs: 0,
      },
      {
        id: 'rival-2',
        name: 'Chloé_75',
        altitude: 13.8,
        baseSpeed: 1.85,
        color: '#CE82FF',
        stunnedUntilMs: 0,
      },
      {
        id: 'rival-3',
        name: 'Hugo_Lyon',
        altitude: 13.0,
        baseSpeed: 1.65,
        color: '#1CB0F6',
        stunnedUntilMs: 0,
      },
    ]);
    setTowerTiles([
      {
        id: 'base-tile-restart',
        label: 'DÉPART 15m',
        bgColor: '#58CC02',
        borderColor: '#46A302',
        textColor: '#FFFFFF',
        heightGain: 15.0,
      },
    ]);
    setCombatText('RACE 3 RIVALS · TYPE IN FRENCH TO CLIMB!');
    setIsGameOver(false);
  };

  const handleCopyDartCode = async () => {
    const file = LAVA_FLUTTER_FILES[activeDartFileIdx];
    try {
      await navigator.clipboard.writeText(file.code);
      setCopiedDart(true);
      setTimeout(() => setCopiedDart(false), 1800);
    } catch {
      setCopiedDart(false);
    }
  };

  const currentLavaSpeed = calculateLavaSpeed(score);
  const safetyGapMeters = Math.max(0, playerAltitude - lavaAltitude);
  const isDangerZone = safetyGapMeters < 6.0;

  // Quick helper chips (correct answer + 2 distractors) so mobile/desktop players can also tap to race fast
  const quickWordChips = [
    currentQuestion.primaryFrench,
    LAVA_QUESTIONS_BANK[(questionIndex + 3) % LAVA_QUESTIONS_BANK.length]
      .primaryFrench,
    LAVA_QUESTIONS_BANK[(questionIndex + 7) % LAVA_QUESTIONS_BANK.length]
      .primaryFrench,
  ];

  return (
    <div
      data-testid="lava-game-screen"
      className={`space-y-3 select-none ${isShaking ? 'animate-shake' : ''}`}
    >
      {/* Top Bar: Exit + 4-Player Race Rank Pill + Altitude & Lava Speed + Flutter Code */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#1A0D18] text-white px-3.5 py-2.5 border-2 border-[#3D1E36] shadow-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="lava-exit-btn"
            onClick={() => {
              soundManager.playTap();
              onExit();
            }}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
            aria-label="Exit Floor is Lava"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#FF9600] fill-[#FF9600]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#FF9600]">
                4-Player Lava Race
              </span>
            </div>
            <p className="text-[11px] font-bold text-white/75">
              Outclimb 3 rivals &amp; rising magma ({currentLavaSpeed.toFixed(2)} m/s)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live 4-Player Race Position Pill */}
          <div
            data-testid="lava-race-rank-pill"
            className="px-2.5 py-1 rounded-xl bg-[#FFB300]/20 border border-[#FFB300] text-center"
          >
            <div className="text-[9px] font-black uppercase tracking-wider text-[#FFD54F] flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Race Rank</span>
            </div>
            <div className="text-xs font-black text-white tabular-nums">
              {playerRank === 1
                ? '1st 🏆'
                : playerRank === 2
                ? '2nd 🥈'
                : playerRank === 3
                ? '3rd 🥉'
                : '4th'}
            </div>
          </div>

          <div
            data-testid="lava-altitude-pill"
            className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-right"
          >
            <div className="text-[9px] font-black uppercase tracking-wider text-white/60">
              Player / Lava
            </div>
            <div className="text-xs font-black tabular-nums text-[#58CC02]">
              {playerAltitude.toFixed(1)}m{' '}
              <span className="text-white/40">/</span>{' '}
              <span className="text-[#FF4B4B]">{lavaAltitude.toFixed(1)}m</span>
            </div>
          </div>

          <button
            type="button"
            data-testid="toggle-lava-dart-btn"
            onClick={() => {
              soundManager.playTap();
              setIsPausedForCode((prev) => !prev);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-[#1CB0F6] hover:bg-[#1899D6] text-white font-black text-xs flex items-center gap-1 cursor-pointer border-b-3 border-[#0077B5] active:translate-y-[2px]"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isPausedForCode ? 'Resume' : 'Flutter Code'}
            </span>
          </button>
        </div>
      </div>

      {/* Optional Flutter 60-FPS Ticker & CustomPainter Code Inspector */}
      {isPausedForCode && (
        <div
          data-testid="lava-dart-modal"
          className="rounded-3xl bg-[#0F172A] text-white border-2 border-[#334155] p-4 space-y-3 shadow-xl animate-pop-scale"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              {LAVA_FLUTTER_FILES.map((file, idx) => (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setActiveDartFileIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                    activeDartFileIdx === idx
                      ? 'bg-[#FF9600] text-[#0F172A]'
                      : 'bg-white/10 text-white/80 hover:bg-white/15'
                  }`}
                >
                  {file.title}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyDartCode}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedDart ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#58CC02]" />
                    <span className="text-[#58CC02]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Dart</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsPausedForCode(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-300">
            {LAVA_FLUTTER_FILES[activeDartFileIdx].description}
          </p>
          <pre className="text-xs font-mono text-amber-200 overflow-x-auto max-h-64 p-3 rounded-2xl bg-black/50 border border-white/10 leading-relaxed">
            <code>{LAVA_FLUTTER_FILES[activeDartFileIdx].code}</code>
          </pre>
        </div>
      )}

      {/* Main Split-View / Camera Rig Stack Arena */}
      <div
        ref={arenaContainerRef}
        style={{
          background:
            'linear-gradient(180deg, #1A091E 0%, #3B0D2C 52%, #7F1D1D 100%)',
        }}
        className="relative rounded-3xl border-3 border-[#4A153B] overflow-hidden min-h-[430px] flex flex-col justify-between p-4 shadow-xl"
      >
        {/* Layer 1: Floating Ember Particles & Rival Climber Trackers */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {[14, 28, 46, 64, 82, 91].map((leftPct, i) => (
            <span
              key={i}
              style={{
                left: `${leftPct}%`,
                bottom: `${(i * 17) % 65}%`,
                animationDelay: `${i * 0.35}s`,
              }}
              className="absolute w-2 h-2 rounded-full bg-[#FFC800]/60 blur-[0.5px] animate-pulse"
            />
          ))}

          {/* Right-Side Live 4-Player Tower Race Ladder */}
          <div className="absolute right-3 top-20 bottom-24 w-28 rounded-2xl bg-black/40 border border-white/15 p-2 flex flex-col justify-between z-20">
            <div className="text-[9px] font-black uppercase tracking-wider text-[#FFD54F] text-center">
              🏁 Race Ladder
            </div>
            <div className="space-y-1.5 my-auto">
              {[
                {
                  name: 'YOU',
                  alt: playerAltitude,
                  color: '#58CC02',
                  isUser: true,
                },
                ...rivals.map((r) => ({
                  name: r.name,
                  alt: r.altitude,
                  color: r.color,
                  isUser: false,
                })),
              ]
                .sort((a, b) => b.alt - a.alt)
                .map((climber, idx) => (
                  <div
                    key={climber.name}
                    className={`px-2 py-1 rounded-lg flex items-center justify-between text-[10px] font-black ${
                      climber.isUser
                        ? 'bg-[#58CC02]/30 border border-[#58CC02] text-white'
                        : 'bg-white/10 text-white/85'
                    }`}
                  >
                    <span className="truncate">
                      {idx + 1}. {climber.name}
                    </span>
                    <span
                      style={{ color: climber.color }}
                      className="tabular-nums ml-1"
                    >
                      {climber.alt.toFixed(0)}m
                    </span>
                  </div>
                ))}
            </div>
            <div className="text-[9px] font-extrabold text-[#FF8A80] text-center tabular-nums">
              🔥 Lava: {lavaAltitude.toFixed(1)}m
            </div>
          </div>
        </div>

        {/* Layer 2: Top Floating HUD Question Card + Speed Bonus Bar */}
        <div className="relative z-20 rounded-2xl bg-white/95 text-[#3C3C3C] p-3.5 border-2 border-white shadow-lg space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0D6] text-[#D97706] text-[10px] font-black uppercase tracking-wider">
                Translate to French · Score {score}
              </span>
              {streak >= 2 && (
                <span className="px-2 py-0.5 rounded-full bg-[#FFE2E2] text-[#EA2B2B] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-[#EA2B2B]" />
                  {streak}x Streak
                </span>
              )}
            </div>

            <span
              className={`text-xs font-black tabular-nums ${
                elapsedQuestionSec < 2.0
                  ? 'text-[#00B4D8]'
                  : elapsedQuestionSec <= 4.5
                  ? 'text-[#58CC02]'
                  : 'text-[#777777]'
              }`}
            >
              ⏱ {elapsedQuestionSec.toFixed(1)}s{' '}
              {elapsedQuestionSec < 2.0
                ? '(⚡ +12m + Meteor!)'
                : elapsedQuestionSec <= 4.5
                ? '(🔥 +8m)'
                : '(+4.5m)'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <h2
                data-testid="lava-prompt-english"
                className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight"
              >
                “{currentQuestion.englishPrompt}”
              </h2>
              {showHint && (
                <p
                  data-testid="lava-hint-text"
                  className="text-xs font-extrabold text-[#1CB0F6] mt-0.5"
                >
                  Hint: Type{' '}
                  <span className="underline font-black">
                    {currentQuestion.primaryFrench}
                  </span>
                </p>
              )}
            </div>

            <button
              type="button"
              data-testid="lava-hint-btn"
              onClick={() => {
                soundManager.playTap();
                setShowHint((prev) => !prev);
                focusInput();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#F7F7F7] hover:bg-[#EFEFEF] border border-[#E5E5E5] text-xs font-extrabold text-[#777777] flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-[#FF9600]" />
              <span>{showHint ? 'Hide' : 'Hint'}</span>
            </button>
          </div>
        </div>

        {/* Layer 3: Center Camera Rig — Player Avatar + Growing Word Tower */}
        <div className="relative z-10 my-auto py-3 flex flex-col items-center justify-center">
          {/* Meteor Attack Notification */}
          {rockAttackBanner && (
            <div className="mb-1.5 px-3 py-1 rounded-full bg-[#FF5722] text-white text-xs font-black uppercase tracking-wider shadow-lg animate-bounce">
              {rockAttackBanner}
            </div>
          )}

          {/* Floating Combat Text */}
          {combatText && (
            <div
              data-testid="lava-combat-text"
              className={`mb-2 px-3.5 py-1 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider shadow-md border ${
                combatText.includes('WRONG')
                  ? 'bg-[#FF4B4B] text-white border-white/40'
                  : combatText.includes('SPEED BONUS')
                  ? 'bg-[#00F5D4] text-[#0F172A] border-[#FFC800]'
                  : 'bg-[#58CC02] text-white border-white/40'
              }`}
            >
              {combatText}
            </div>
          )}

          {/* Player Avatar with elasticOut Boost + Danger Sweat Indicator */}
          <div
            className={`relative flex flex-col items-center transition-transform duration-300 ${
              isTileBoosting ? 'scale-115 -translate-y-3' : 'scale-100'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border-3 shadow-lg ${
                isDangerZone
                  ? 'bg-[#FF4B4B] border-white animate-bounce'
                  : 'bg-[#58CC02] border-white'
              }`}
            >
              <svg viewBox="0 0 64 64" className="w-11 h-11" aria-hidden="true">
                <circle cx="32" cy="34" r="20" fill="#58CC02" />
                <circle cx="23" cy="30" r="6" fill="white" />
                <circle cx="41" cy="30" r="6" fill="white" />
                <circle cx="24" cy="30" r="3" fill="#1F2937" />
                <circle cx="40" cy="30" r="3" fill="#1F2937" />
                <polygon points="32,34 27,41 37,41" fill="#FFC800" />
              </svg>
            </div>

            <div className="mt-1 px-2.5 py-0.5 rounded-full bg-black/65 text-white text-[10px] font-black uppercase tracking-wider border border-white/20">
              {isDangerZone
                ? `🔥 DANGER! ${safetyGapMeters.toFixed(1)}m GAP`
                : `⛰️ SAFE GAP: +${safetyGapMeters.toFixed(1)}m`}
            </div>
          </div>

          {/* 3D Stacked Word Tower Directly Underneath the Player */}
          <div
            data-testid="lava-word-tower"
            className="mt-2 w-full max-w-xs flex flex-col items-center space-y-1.5"
          >
            {towerTiles.slice(0, 4).map((tile, idx) => (
              <div
                key={tile.id}
                style={{
                  backgroundColor: tile.bgColor,
                  borderBottom: `5px solid ${tile.borderColor}`,
                  color: tile.textColor,
                  width: `${Math.max(68, 92 - idx * 6)}%`,
                  opacity: Math.max(0.45, 1 - idx * 0.16),
                }}
                className="px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider text-center shadow-md transition-all duration-300"
              >
                {tile.label}
              </div>
            ))}
          </div>
        </div>

        {/* Layer 4: Rising Dual-Sine-Wave Magma Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Layer 5: Quick French Word Helper Chips + Keyboard Input Bar */}
        <div className="relative z-20 space-y-1.5">
          {/* Quick-Tap French Word Chips so players can also tap to climb fast */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {quickWordChips.map((chipWord, cIdx) => (
              <button
                key={`${chipWord}-${cIdx}`}
                type="button"
                data-testid={`lava-quick-chip-${cIdx}`}
                onClick={() => submitCandidateAnswer(chipWord)}
                className="px-3 py-1 rounded-xl bg-black/65 hover:bg-black/85 border border-white/25 text-white text-xs font-black uppercase tracking-wide cursor-pointer active:translate-y-[1px]"
              >
                ⚡ {chipWord}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmitAnswer}
            className={`rounded-2xl bg-white p-2 flex items-center gap-2 border-3 shadow-xl transition-colors ${
              isWrongBorder ? 'border-[#FF4B4B] bg-[#FFF5F5]' : 'border-white'
            }`}
          >
            <input
              ref={inputRef}
              type="text"
              data-testid="lava-input"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              disabled={isGameOver}
              placeholder={`Type French translation (e.g. "${currentQuestion.primaryFrench}")...`}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              className="flex-1 px-3 py-2 text-base font-black text-[#1E293B] placeholder:text-[#94A3B8] placeholder:font-bold focus:outline-none"
            />
            <TactileButton
              label="CLIMB"
              variant="primary"
              size="md"
              testId="lava-submit-btn"
              disabled={isGameOver}
              onClick={() => handleSubmitAnswer()}
            />
          </form>
        </div>

        {/* Layer 6: Game Over Modal Overlay */}
        {isGameOver && (
          <div
            data-testid="lava-game-over-modal"
            className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center p-4 animate-pop-scale"
          >
            <div className="w-full max-w-md rounded-3xl bg-white text-[#3C3C3C] p-6 border-2 border-[#E5E5E5] shadow-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF0F0] border-2 border-[#FF4B4B] text-[#FF4B4B] flex items-center justify-center mx-auto">
                <Flame className="w-9 h-9 fill-[#FF4B4B]" />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-black uppercase tracking-widest text-[#FF4B4B]">
                  The Lava Caught Up! · Finished #{playerRank}
                </div>
                <h3 className="text-2xl font-black text-[#1E293B]">
                  Peak Altitude: {peakAltitude.toFixed(1)}m
                </h3>
                <p className="text-xs font-bold text-[#777777]">
                  Correct Answer:{' '}
                  <span className="font-black text-[#1CB0F6]">
                    {currentQuestion.englishPrompt} ={' '}
                    {currentQuestion.primaryFrench}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-[#F7F7F7] p-2.5 border border-[#E5E5E5]">
                  <div className="text-[10px] font-black uppercase text-[#777777]">
                    Words
                  </div>
                  <div className="text-lg font-black text-[#3C3C3C]">
                    {score}
                  </div>
                </div>
                <div className="rounded-2xl bg-[#FFFBEB] p-2.5 border border-[#FDE68A]">
                  <div className="text-[10px] font-black uppercase text-[#D97706]">
                    Peak Height
                  </div>
                  <div className="text-lg font-black text-[#D97706]">
                    {peakAltitude.toFixed(1)}m
                  </div>
                </div>
                <div className="rounded-2xl bg-[#F0FDF4] p-2.5 border border-[#BBF7D0]">
                  <div className="text-[10px] font-black uppercase text-[#16A34A]">
                    Bonus XP
                  </div>
                  <div className="text-lg font-black text-[#16A34A]">
                    +{Math.max(15, score * 10)} XP
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <TactileButton
                  label="RACE AGAIN"
                  icon={<Sparkles className="w-4 h-4" />}
                  variant="primary"
                  size="lg"
                  fullWidth
                  testId="lava-play-again-btn"
                  onClick={handleRestartGame}
                />
                <TactileButton
                  label="CLAIM XP & EXIT"
                  icon={<Trophy className="w-4 h-4" />}
                  variant="gold"
                  size="lg"
                  fullWidth
                  testId="lava-claim-xp-btn"
                  onClick={() => {
                    soundManager.playCelebration();
                    onCompleteRun(Math.max(15, score * 10), peakAltitude);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
