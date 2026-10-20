import React, { useState, useEffect, useMemo } from 'react';
import {
  Swords,
  Trophy,
  Zap,
  Sparkles,
  Volume2,
  X,
  Crown,
  Radar,
} from 'lucide-react';
import {
  FRENCH_MASTER_QUESTIONS,
  type LanguageCourse,
} from '../data/curriculum';
import {
  calculateDuelRoundPoints,
  pickRandomBotOpponent,
  getArenaLeague,
  type RandomBotProfile,
} from '../utils/gameLogic';
import { TactileButton } from '../widgets/TactileButton';
import { soundManager } from '../utils/soundEffects';

interface DuelScreenProps {
  course: LanguageCourse;
  playerTrophies: number;
  playerLevel: number;
  duelsWon: number;
  autoStartMatch?: boolean;
  onFinishDuel: (didWin: boolean, trophyDelta: number, xpEarned: number) => void;
  onBackToLobby?: () => void;
}

const TOTAL_DUEL_ROUNDS = 7;

export const DuelScreen: React.FC<DuelScreenProps> = ({
  course,
  playerTrophies,
  playerLevel,
  duelsWon,
  autoStartMatch = false,
  onFinishDuel,
  onBackToLobby,
}) => {
  const [matchSeed, setMatchSeed] = useState<number>(() => Date.now());
  const [phase, setPhase] = useState<'lobby' | 'searching' | 'battle' | 'results'>(
    autoStartMatch ? 'searching' : 'lobby'
  );
  const [radarStep, setRadarStep] = useState<'scanning' | 'locked'>('scanning');
  const [rollingIdx, setRollingIdx] = useState<number>(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [rivalScore, setRivalScore] = useState(0);
  const [playerCrowns, setPlayerCrowns] = useState(0);
  const [rivalCrowns, setRivalCrowns] = useState(0);
  const [playerCombo, setPlayerCombo] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [roundResult, setRoundResult] = useState<{
    playerCorrect: boolean;
    rivalCorrect: boolean;
    playerDelta: number;
    rivalDelta: number;
  } | null>(null);

  const playerLeague = getArenaLeague(playerTrophies);

  const opponent: RandomBotProfile = useMemo(() => {
    const pseudoRand = ((matchSeed % 997) + 1) / 998;
    return pickRandomBotOpponent(playerTrophies, pseudoRand);
  }, [matchSeed, playerTrophies]);

  const rollingCandidateNames = [
    'Lucas_FR (🏆 315)',
    'Chloé_Paris (🏆 304)',
    'Hugo_Lyon (🏆 298)',
    'Camille_75 (🏆 322)',
    'Antoine_Bdx (🏆 311)',
  ];

  const duelQuestions = useMemo(() => {
    const pool = [...FRENCH_MASTER_QUESTIONS];
    const startOffset = matchSeed % pool.length;
    const rotated = [
      ...pool.slice(startOffset),
      ...pool.slice(0, startOffset),
    ];
    return rotated.slice(0, TOTAL_DUEL_ROUNDS);
  }, [matchSeed]);

  // Matchmaking Radar sequence: scanning (0.65s) -> locked (0.55s) -> battle
  useEffect(() => {
    if (phase !== 'searching') return;
    setRadarStep('scanning');
    const rollInterval = setInterval(() => {
      setRollingIdx((i) => (i + 1) % 5);
    }, 120);
    const lockTimer = setTimeout(() => {
      clearInterval(rollInterval);
      soundManager.playTap();
      setRadarStep('locked');
    }, 650);
    const startTimer = setTimeout(() => {
      soundManager.playCorrect();
      setPhase('battle');
    }, 1250);
    return () => {
      clearInterval(rollInterval);
      clearTimeout(lockTimer);
      clearTimeout(startTimer);
    };
  }, [phase]);

  const handleStartMatchmaking = () => {
    soundManager.playTap();
    setMatchSeed(Date.now() + Math.floor(Math.random() * 1000));
    setRoundIndex(0);
    setPlayerScore(0);
    setRivalScore(0);
    setPlayerCrowns(0);
    setRivalCrowns(0);
    setPlayerCombo(0);
    setSelectedOption(null);
    setRoundResult(null);
    setPhase('searching');
  };

  const handlePickCard = (optIndex: number) => {
    if (roundResult !== null) return;
    setSelectedOption(optIndex);

    const question = duelQuestions[roundIndex];
    const isPlayerCorrect = optIndex === question.correctIndex;
    const nextCombo = isPlayerCorrect ? playerCombo + 1 : 0;
    const pDelta = calculateDuelRoundPoints(isPlayerCorrect, nextCombo, 25);

    const isRivalCorrect =
      ((roundIndex + 1 + (matchSeed % 7)) * 37) % 100 <
      opponent.accuracyRate * 100;
    const rDelta = isRivalCorrect ? 115 : 0;

    if (isPlayerCorrect) {
      soundManager.playCorrect();
      if (nextCombo % 2 === 1 && playerCrowns < 3) {
        setPlayerCrowns((c) => Math.min(3, c + 1));
      }
    } else {
      soundManager.playIncorrect();
    }

    if (isRivalCorrect && !isPlayerCorrect && rivalCrowns < 3) {
      setRivalCrowns((c) => Math.min(3, c + 1));
    }

    setPlayerCombo(nextCombo);
    setPlayerScore((s) => s + pDelta);
    setRivalScore((s) => s + rDelta);
    setRoundResult({
      playerCorrect: isPlayerCorrect,
      rivalCorrect: isRivalCorrect,
      playerDelta: pDelta,
      rivalDelta: rDelta,
    });
  };

  const handleNextRound = () => {
    soundManager.playTap();
    if (roundIndex + 1 < duelQuestions.length) {
      setRoundIndex((i) => i + 1);
      setSelectedOption(null);
      setRoundResult(null);
    } else {
      if (playerScore >= rivalScore && playerCrowns === 0) {
        setPlayerCrowns(1);
      }
      soundManager.playCelebration();
      setPhase('results');
    }
  };

  // Phase 1: Lobby fallback
  if (phase === 'lobby') {
    return (
      <div
        data-testid="duel-lobby-view"
        className="space-y-6 animate-pop-scale"
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
            boxShadow: '0 8px 0 #0F0D26',
          }}
          className="rounded-[24px] p-6 sm:p-8 text-white border-2 border-white/15"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#FFC800] mb-1">
                <Swords className="w-4 h-4" />
                <span>{playerLeague.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                French 1v1 Battle
              </h1>
            </div>
          </div>

          <TactileButton
            label="FIND RANDOM 1V1 MATCH"
            variant="gold"
            fullWidth
            testId="start-random-duel-btn"
            onClick={handleStartMatchmaking}
          />
        </div>
      </div>
    );
  }

  // Phase 2: Matchmaking Radar Screen
  if (phase === 'searching') {
    return (
      <div
        data-testid="duel-searching-view"
        style={{
          background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)',
          boxShadow: '0 8px 0 #090D16',
        }}
        className="rounded-[24px] p-6 text-center text-white space-y-5 animate-pop-scale border-2 border-[#38BDF8]/40"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E293B] border border-[#38BDF8]/50 text-xs font-black uppercase tracking-widest text-[#38BDF8]">
          <Radar className="w-4 h-4 animate-spin" />
          <span>{playerLeague.name} Matchmaking</span>
        </div>

        {/* Concentric Sonar Radar Circle + Sweeping Beam */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          {/* Outer Sonar Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-[#38BDF8]/30 animate-ping" />
          <div className="absolute inset-3 rounded-full border-2 border-[#38BDF8]/40" />
          <div className="absolute inset-8 rounded-full border border-[#38BDF8]/35" />
          <div className="absolute inset-14 rounded-full border border-[#38BDF8]/30" />

          {/* Sweeping Conic Radar Beam */}
          <div
            style={{
              background:
                'conic-gradient(from 0deg, rgba(56, 189, 248, 0.45) 0deg, rgba(56, 189, 248, 0) 90deg, rgba(56, 189, 248, 0) 360deg)',
            }}
            className="absolute inset-2 rounded-full animate-radar-spin pointer-events-none"
          />

          {/* Center Shield Node */}
          <div
            style={{
              background:
                radarStep === 'locked'
                  ? 'linear-gradient(180deg, #76E81E 0%, #388E00 100%)'
                  : 'linear-gradient(180deg, #FFCA28 0%, #FF8F00 100%)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
            }}
            className="relative z-10 w-18 h-18 rounded-full border-3 border-white flex items-center justify-center"
          >
            <Swords className="w-9 h-9 text-white" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-[#FFD54F]">
            {radarStep === 'locked'
              ? '⚡ MATCH FOUND! ⚡'
              : 'SEARCHING FOR OPPONENT...'}
          </h2>
          <p className="text-sm font-bold text-[#94A3B8] mt-1">
            Matching in {playerLeague.name} ({playerTrophies} ± 25 🏆)
          </p>
        </div>

        {/* VS Clash Slot-Machine Preview Card */}
        <div className="grid grid-cols-3 items-center gap-2 bg-white/10 rounded-[18px] p-3.5 border border-white/15">
          <div className="text-center">
            <div className="text-xs font-black text-[#38BDF8] uppercase">YOU</div>
            <div className="text-sm font-black truncate">Lv.{playerLevel}</div>
            <div className="text-xs font-extrabold text-[#FFC800] tabular-nums">
              {playerTrophies} 🏆
            </div>
          </div>

          <div className="text-xl font-black text-[#FFC800]">VS</div>

          <div className="text-center">
            <div className="text-xs font-black text-[#F87171] uppercase truncate">
              {radarStep === 'locked'
                ? opponent.name
                : rollingCandidateNames[rollingIdx]}
            </div>
            <div className="text-sm font-black truncate">
              Lv.{opponent.level}
            </div>
            <div className="text-xs font-extrabold text-[#FFC800] tabular-nums">
              {opponent.trophies} 🏆
            </div>
          </div>
        </div>

        <TactileButton
          label="FIGHT NOW"
          variant="gold"
          fullWidth
          testId="skip-radar-btn"
          onClick={() => setPhase('battle')}
        />
      </div>
    );
  }

  // Phase 3: Victory / Defeat Results Screen with Floating Sparks
  if (phase === 'results') {
    const didWin = playerScore >= rivalScore;
    const trophyDelta = didWin ? 30 : -15;
    const xpEarned = didWin ? 40 : 15;
    const updatedLeague = getArenaLeague(Math.max(0, playerTrophies + trophyDelta));

    return (
      <div
        data-testid="duel-results-view"
        className="rounded-[24px] border-2 border-[#E5E5E5] bg-[#FFFFFF] p-6 sm:p-8 text-center space-y-6 animate-pop-scale text-[#2D3142] relative overflow-hidden"
        style={{ boxShadow: '0 6px 0 #E5E5E5' }}
      >
        {/* Floating Particle Sparks */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {[
            { left: '12%', top: '14%', size: 10 },
            { left: '86%', top: '16%', size: 12 },
            { left: '18%', top: '75%', size: 9 },
            { left: '82%', top: '70%', size: 11 },
          ].map((s, idx) => (
            <div
              key={idx}
              style={{
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                backgroundColor: didWin ? '#FFC800' : '#94A3B8',
              }}
              className="absolute rounded-full animate-node-pulse"
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 relative z-10">
          {[1, 2, 3].map((crownNum) => {
            const earned = didWin
              ? crownNum <= Math.max(1, playerCrowns)
              : crownNum <= playerCrowns;
            return (
              <div
                key={crownNum}
                style={{
                  backgroundColor: earned ? '#FFC800' : '#F3F4F6',
                  boxShadow: earned ? '0 4px 0 #D97706' : '0 4px 0 #D1D5DB',
                }}
                className="w-14 h-14 rounded-[16px] flex items-center justify-center"
              >
                <Crown
                  className={`w-8 h-8 ${
                    earned ? 'text-white fill-white' : 'text-[#9CA3AF]'
                  }`}
                />
              </div>
            );
          })}
        </div>

        <div className="relative z-10">
          <div className="text-xs font-black uppercase tracking-widest text-[#7C3AED] mb-1">
            {didWin ? '3-Crown Arena Victory!' : 'Arena Match Finished'}
          </div>
          <h2 className="text-3xl font-black text-[#2D3142]">
            {didWin ? 'You Won the 1v1 Duel!' : `${opponent.name} Edged Ahead!`}
          </h2>
          <p className="text-xs font-extrabold text-[#64748B] mt-1">
            League: {updatedLeague.name} · {duelsWon + (didWin ? 1 : 0)} Total Wins
          </p>
        </div>

        {/* Final Score Comparison */}
        <div className="grid grid-cols-2 gap-4 pt-1 relative z-10">
          <div className="rounded-[16px] border-2 border-[#58CC02] bg-[#F1FAEA] p-4">
            <div className="text-xs font-extrabold uppercase text-[#58A700]">
              You (Lv.{playerLevel})
            </div>
            <div className="text-2xl font-black text-[#2D3142] mt-1 tabular-nums">
              {playerScore} pts
            </div>
          </div>

          <div className="rounded-[16px] border-2 border-[#E5E5E5] bg-[#F9FAFB] p-4">
            <div className="text-xs font-extrabold uppercase text-[#777777]">
              {opponent.name}
            </div>
            <div className="text-2xl font-black text-[#2D3142] mt-1 tabular-nums">
              {rivalScore} pts
            </div>
          </div>
        </div>

        {/* Rewards Earned (+30 Trophies for Win, -15 for Loss) */}
        <div className="flex items-center justify-center gap-4 relative z-10">
          <div className="rounded-[16px] border-2 border-[#FFC800] bg-[#FFFBEB] px-5 py-3 flex items-center gap-2 font-black text-[#D97706] tabular-nums">
            <Trophy className="w-5 h-5 text-[#FFC800] fill-[#FFC800]" />
            <span>
              {trophyDelta > 0 ? `+${trophyDelta}` : trophyDelta} Trophies
            </span>
          </div>
          <div className="rounded-[16px] border-2 border-[#58CC02] bg-[#F1FAEA] px-5 py-3 flex items-center gap-2 font-black text-[#58A700] tabular-nums">
            <Sparkles className="w-5 h-5 text-[#58CC02]" />
            <span>+{xpEarned} XP</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 relative z-10">
          <TactileButton
            label="NEXT RANDOM 1V1"
            variant="gold"
            fullWidth
            testId="duel-rematch-button"
            onClick={() => {
              onFinishDuel(didWin, trophyDelta, xpEarned);
              handleStartMatchmaking();
            }}
          />
          <TactileButton
            label="COLLECT & BACK"
            variant="primary"
            fullWidth
            testId="duel-finish-button"
            onClick={() => {
              onFinishDuel(didWin, trophyDelta, xpEarned);
              if (onBackToLobby) {
                onBackToLobby();
              } else {
                setPhase('lobby');
              }
            }}
          />
        </div>
      </div>
    );
  }

  // Phase 4: Active 1v1 Battle Round
  const currentQuestion = duelQuestions[roundIndex];
  const totalPoints = Math.max(1, playerScore + rivalScore);
  const playerAdvantagePercent =
    playerScore === 0 && rivalScore === 0
      ? 50
      : Math.min(88, Math.max(12, Math.round((playerScore / totalPoints) * 100)));

  return (
    <div data-testid="duel-active-battle" className="space-y-4">
      {/* Head-to-Head Scoreboard */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
          boxShadow: '0 5px 0 #0F0D26',
        }}
        className="rounded-[20px] p-4 text-white space-y-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#38BDF8]">
                YOU (Lv.{playerLevel})
              </span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3].map((n) => (
                  <Crown
                    key={n}
                    className={`w-3.5 h-3.5 ${
                      n <= playerCrowns
                        ? 'text-[#FFC800] fill-[#FFC800]'
                        : 'text-white/25'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div
              data-testid="duel-player-score"
              className="text-xl font-black tabular-nums"
            >
              {playerScore}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-black uppercase tracking-wider text-[#FFC800] tabular-nums">
              Round {roundIndex + 1}/{duelQuestions.length}
            </span>
            {playerCombo > 1 && (
              <span className="text-xs font-black text-[#4ADE80] flex items-center gap-0.5 mt-1">
                <Zap className="w-3.5 h-3.5 fill-current" />
                {playerCombo}x Speed
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-right">
            <div>
              <div className="flex items-center justify-end gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((n) => (
                    <Crown
                      key={n}
                      className={`w-3.5 h-3.5 ${
                        n <= rivalCrowns
                          ? 'text-[#F87171] fill-[#F87171]'
                          : 'text-white/25'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-[#F87171]">
                  {opponent.name}
                </span>
              </div>
              <div
                data-testid="duel-rival-score"
                className="text-xl font-black tabular-nums"
              >
                {rivalScore}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onBackToLobby) {
                  onBackToLobby();
                } else {
                  setPhase('lobby');
                }
              }}
              aria-label="Forfeit duel"
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Tug-of-War Bar */}
        <div className="w-full h-3.5 bg-[#EF4444] rounded-full overflow-hidden p-0.5 flex">
          <div
            style={{ width: `${playerAdvantagePercent}%` }}
            className="h-full bg-[#38BDF8] rounded-full transition-all duration-300"
          />
        </div>
      </div>

      {/* French Question Prompt Card */}
      <div
        style={{ boxShadow: '0 4px 0 #E5E5E5' }}
        className="rounded-[20px] border-2 border-[#E5E5E5] bg-[#FFFFFF] p-5 space-y-3 text-[#2D3142]"
      >
        <div className="text-xs font-black uppercase tracking-wider text-[#7C3AED]">
          Translate faster than {opponent.name}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              soundManager.speak(
                currentQuestion.sourceSentence,
                course.speechLang
              )
            }
            aria-label="Listen to French sentence"
            style={{
              backgroundColor: '#1CB0F6',
              boxShadow: '0 4px 0 #1899D6',
            }}
            className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white shrink-0 cursor-pointer active:translate-y-[3px] transition-transform"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <h2 className="text-xl sm:text-2xl font-black text-[#2D3142]">
            {currentQuestion.sourceSentence}
          </h2>
        </div>
      </div>

      {/* 4 Clean Tactile Option Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {currentQuestion.options.map((opt, idx) => {
          const isPicked = selectedOption === idx;
          const isCorrectOption = idx === currentQuestion.correctIndex;

          let borderColor = '#E5E5E5';
          let bgColor = '#FFFFFF';
          let shadowColor = '#E5E5E5';

          if (roundResult !== null) {
            if (isCorrectOption) {
              borderColor = '#58CC02';
              bgColor = '#D7FFB8';
              shadowColor = '#58A700';
            } else if (isPicked && !isCorrectOption) {
              borderColor = '#FF4B4B';
              bgColor = '#FFDFE0';
              shadowColor = '#EA2B2B';
            }
          } else if (isPicked) {
            borderColor = '#1CB0F6';
            bgColor = '#DDF4FF';
            shadowColor = '#1899D6';
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={roundResult !== null}
              data-testid={`duel-option-${idx}`}
              onClick={() => handlePickCard(idx)}
              style={{
                backgroundColor: bgColor,
                borderColor,
                boxShadow: `0 4px 0 ${shadowColor}`,
              }}
              className="rounded-[16px] border-2 p-4 text-left flex items-center justify-between gap-3 transition-all duration-100 active:translate-y-[3px] cursor-pointer disabled:cursor-default"
            >
              <div className="font-extrabold text-[#2D3142] text-base">
                {opt.text}
              </div>
              <span className="w-7 h-7 rounded-[8px] border-2 border-black/10 text-xs font-black text-[#777777] flex items-center justify-center shrink-0 tabular-nums">
                {idx + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* Round Result Banner + Next Round CTA */}
      {roundResult && (
        <div
          data-testid="duel-round-feedback"
          style={{
            backgroundColor: roundResult.playerCorrect ? '#D7FFB8' : '#FFDFE0',
          }}
          className="rounded-[20px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-sheet-bounce"
        >
          <div className="font-extrabold text-sm sm:text-base text-[#2D3142]">
            {roundResult.playerCorrect ? (
              <span className="text-[#58A700]">
                Direct Hit! +{roundResult.playerDelta} pts · {opponent.name}{' '}
                {roundResult.rivalCorrect
                  ? `scored +${roundResult.rivalDelta}`
                  : 'missed!'}
              </span>
            ) : (
              <span className="text-[#EA2B2B]">
                Missed! Correct:{' '}
                {currentQuestion.options[currentQuestion.correctIndex].text}
              </span>
            )}
          </div>
          <div className="w-full sm:w-48 shrink-0">
            <TactileButton
              label={
                roundIndex + 1 < duelQuestions.length
                  ? 'NEXT ROUND'
                  : 'SEE WINNER'
              }
              variant={roundResult.playerCorrect ? 'primary' : 'danger'}
              fullWidth
              testId="duel-next-round-button"
              onClick={handleNextRound}
            />
          </div>
        </div>
      )}
    </div>
  );
};
