import React, { useState } from 'react';
import {
  Flame,
  Gamepad2,
  Check,
  Sparkles,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { TactileButton } from '../widgets/TactileButton';
import { LavaGameScreen } from './LavaGameScreen';
import { soundManager } from '../utils/soundEffects';

interface GamesScreenProps {
  onEarnGameXp: (xp: number) => void;
}

interface WordPair {
  id: string;
  fr: string;
  en: string;
}

const WORD_MATCH_PAIRS: WordPair[] = [
  { id: 'p1', fr: 'Bonjour', en: 'Hello' },
  { id: 'p2', fr: 'Merci', en: 'Thank you' },
  { id: 'p3', fr: 'Croissant', en: 'Croissant' },
  { id: 'p4', fr: 'Eau', en: 'Water' },
  { id: 'p5', fr: 'Gare', en: 'Train station' },
  { id: 'p6', fr: 'Addition', en: 'The check' },
];

export const GamesScreen: React.FC<GamesScreenProps> = ({ onEarnGameXp }) => {
  const [activeGameId, setActiveGameId] = useState<'lava' | 'word-match' | null>(
    null
  );
  const [bestLavaAltitude, setBestLavaAltitude] = useState<number>(15.0);
  const [selectedFrId, setSelectedFrId] = useState<string | null>(null);
  const [selectedEnId, setSelectedEnId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongFlash, setWrongFlash] = useState<boolean>(false);

  const handleStartWordMatch = () => {
    soundManager.playTap();
    setMatchedIds([]);
    setSelectedFrId(null);
    setSelectedEnId(null);
    setActiveGameId('word-match');
  };

  const evaluatePair = (frId: string, enId: string) => {
    if (frId === enId) {
      soundManager.playCorrect();
      const next = [...matchedIds, frId];
      setMatchedIds(next);
      setSelectedFrId(null);
      setSelectedEnId(null);
      if (next.length === WORD_MATCH_PAIRS.length) {
        soundManager.playCelebration();
      }
    } else {
      soundManager.playIncorrect();
      setWrongFlash(true);
      setTimeout(() => {
        setSelectedFrId(null);
        setSelectedEnId(null);
        setWrongFlash(false);
      }, 450);
    }
  };

  const handleSelectFr = (id: string) => {
    if (matchedIds.includes(id) || wrongFlash) return;
    soundManager.playTap();
    setSelectedFrId(id);
    if (selectedEnId) {
      evaluatePair(id, selectedEnId);
    }
  };

  const handleSelectEn = (id: string) => {
    if (matchedIds.includes(id) || wrongFlash) return;
    soundManager.playTap();
    setSelectedEnId(id);
    if (selectedFrId) {
      evaluatePair(selectedFrId, id);
    }
  };

  // Game #1: "The Floor is Lava" 60-FPS Arcade Typing Survival Mode
  if (activeGameId === 'lava') {
    return (
      <div className="pb-24">
        <LavaGameScreen
          onExit={() => setActiveGameId(null)}
          onCompleteRun={(xpEarned, peakAlt) => {
            setBestLavaAltitude((prev) => Math.max(prev, peakAlt));
            onEarnGameXp(xpEarned);
            setActiveGameId(null);
          }}
        />
      </div>
    );
  }

  // Game #2: French Word Match
  if (activeGameId === 'word-match') {
    const isComplete = matchedIds.length === WORD_MATCH_PAIRS.length;

    return (
      <div
        data-testid="game-word-match-view"
        className="max-w-xl mx-auto space-y-6 pb-28 pt-2"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveGameId(null)}
            className="px-3.5 py-2 rounded-[12px] border-2 border-[#E5E5E5] bg-white text-xs font-extrabold text-[#4B4B4B] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Games</span>
          </button>

          <span className="text-xs font-black uppercase tracking-wider text-[#58CC02]">
            Matched {matchedIds.length} / {WORD_MATCH_PAIRS.length}
          </span>
        </div>

        <div
          style={{ boxShadow: '0 4px 0 #E5E5E5' }}
          className="rounded-[20px] border-2 border-[#E5E5E5] bg-white p-6 space-y-6"
        >
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6]">
              Game #2 · French Vocabulary Match
            </span>
            <h2 className="text-2xl font-black text-[#4B4B4B] mt-0.5">
              Tap matching French & English pairs
            </h2>
          </div>

          {isComplete ? (
            <div className="py-6 text-center space-y-5 animate-pop-scale">
              <div
                style={{
                  backgroundColor: '#58CC02',
                  boxShadow: '0 6px 0 #58A700',
                }}
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white"
              >
                <Check className="w-9 h-9 stroke-[3.5]" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#4B4B4B]">
                  All 6 Pairs Matched!
                </h3>
                <p className="text-sm font-bold text-[#777777] mt-1">
                  You earned +25 XP toward your Player Level.
                </p>
              </div>

              <TactileButton
                label="CLAIM +25 XP"
                variant="primary"
                fullWidth
                testId="claim-game-xp-btn"
                icon={<Sparkles className="w-4 h-4" />}
                onClick={() => {
                  onEarnGameXp(25);
                  setActiveGameId(null);
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="text-xs font-black uppercase text-[#777777] text-center">
                  Français
                </div>
                {WORD_MATCH_PAIRS.map((item) => {
                  const isMatched = matchedIds.includes(item.id);
                  const isSelected = selectedFrId === item.id;
                  return (
                    <button
                      key={`fr-${item.id}`}
                      type="button"
                      disabled={isMatched}
                      data-testid={`match-fr-${item.id}`}
                      onClick={() => handleSelectFr(item.id)}
                      style={{
                        backgroundColor: isMatched
                          ? '#F7F7F7'
                          : isSelected
                          ? '#DDF4FF'
                          : '#FFFFFF',
                        borderColor: isMatched
                          ? '#E5E5E5'
                          : isSelected
                          ? '#1CB0F6'
                          : '#E5E5E5',
                        boxShadow: isMatched
                          ? 'none'
                          : isSelected
                          ? '0 4px 0 #1CB0F6'
                          : '0 4px 0 #E5E5E5',
                      }}
                      className={`w-full py-3.5 px-4 rounded-[14px] border-2 font-extrabold text-sm transition-all ${
                        isMatched
                          ? 'text-[#C4C4C4] cursor-default'
                          : isSelected
                          ? 'text-[#1CB0F6] cursor-pointer'
                          : 'text-[#4B4B4B] cursor-pointer active:translate-y-[3px]'
                      }`}
                    >
                      {item.fr}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3">
                <div className="text-xs font-black uppercase text-[#777777] text-center">
                  English
                </div>
                {[...WORD_MATCH_PAIRS].reverse().map((item) => {
                  const isMatched = matchedIds.includes(item.id);
                  const isSelected = selectedEnId === item.id;
                  return (
                    <button
                      key={`en-${item.id}`}
                      type="button"
                      disabled={isMatched}
                      data-testid={`match-en-${item.id}`}
                      onClick={() => handleSelectEn(item.id)}
                      style={{
                        backgroundColor: isMatched
                          ? '#F7F7F7'
                          : isSelected
                          ? '#DDF4FF'
                          : '#FFFFFF',
                        borderColor: isMatched
                          ? '#E5E5E5'
                          : isSelected
                          ? '#1CB0F6'
                          : '#E5E5E5',
                        boxShadow: isMatched
                          ? 'none'
                          : isSelected
                          ? '0 4px 0 #1CB0F6'
                          : '0 4px 0 #E5E5E5',
                      }}
                      className={`w-full py-3.5 px-4 rounded-[14px] border-2 font-extrabold text-sm transition-all ${
                        isMatched
                          ? 'text-[#C4C4C4] cursor-default'
                          : isSelected
                          ? 'text-[#1CB0F6] cursor-pointer'
                          : 'text-[#4B4B4B] cursor-pointer active:translate-y-[3px]'
                      }`}
                    >
                      {item.en}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="games-hub-view"
      className="max-w-xl mx-auto space-y-6 pb-28 pt-2"
    >
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#58CC02]">
          Tab 3 · French Arcade Mini-Games
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#4B4B4B] mt-0.5">
          Normal Games
        </h1>
        <p className="text-sm font-bold text-[#777777] mt-1">
          Arcade modes built one by one. Start with “The Floor is Lava” 60-FPS typing survival!
        </p>
      </div>

      <div className="space-y-4">
        {/* Game #1: The Floor is Lava (60-FPS Typing Survival) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 0 #E5E5E5',
          }}
          className="rounded-[18px] border-2 border-[#FF4B4B] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start sm:items-center gap-4">
            <div
              style={{
                backgroundColor: '#FF4B4B',
                boxShadow: '0 4px 0 #EA2B2B',
              }}
              className="w-14 h-14 rounded-[16px] flex items-center justify-center text-white shrink-0"
            >
              <Flame className="w-7 h-7 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-[#FF4B4B]">
                  Game #1 · 60-FPS Arcade Survival
                </span>
                <span className="px-2 py-0.5 rounded bg-[#FFF4ED] text-[#FF6B2B] text-[10px] font-black">
                  Best: {bestLavaAltitude.toFixed(1)}m
                </span>
              </div>
              <h2 className="text-lg font-black text-[#4B4B4B] mt-0.5">
                The Floor is Lava
              </h2>
              <p className="text-xs font-bold text-[#777777] mt-0.5">
                Type French translations fast to stack 3D tiles (+12m / +8m / +4.5m) before the rising magma catches you!
              </p>
            </div>
          </div>

          <div className="w-full sm:w-44 shrink-0">
            <TactileButton
              label="PLAY LAVA MODE"
              variant="danger"
              fullWidth
              size="md"
              testId="play-lava-game-btn"
              icon={<Flame className="w-4 h-4 fill-current" />}
              onClick={() => {
                soundManager.playTap();
                setActiveGameId('lava');
              }}
            />
          </div>
        </div>

        {/* Game #2: French Word Match */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 0 #E5E5E5',
          }}
          className="rounded-[18px] border-2 border-[#E5E5E5] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div
              style={{
                backgroundColor: '#58CC02',
                boxShadow: '0 4px 0 #58A700',
              }}
              className="w-14 h-14 rounded-[16px] flex items-center justify-center text-white shrink-0"
            >
              <Gamepad2 className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-[#58CC02]">
                Game #2 · Speed Matching
              </div>
              <h2 className="text-lg font-black text-[#4B4B4B]">
                French Word Match
              </h2>
              <p className="text-xs font-bold text-[#777777] mt-0.5">
                Pair 6 French words with their English translations (+25 XP).
              </p>
            </div>
          </div>

          <div className="w-full sm:w-44 shrink-0">
            <TactileButton
              label="PLAY WORD MATCH"
              variant="primary"
              fullWidth
              size="md"
              testId="play-word-match-btn"
              onClick={handleStartWordMatch}
            />
          </div>
        </div>

        {/* Slots #3 and #4 for upcoming games */}
        {[
          {
            slot: 3,
            title: 'Game Slot #3',
            subtitle: 'Next mini-game slot ready to build one by one',
          },
          {
            slot: 4,
            title: 'Game Slot #4',
            subtitle: 'Upcoming mini-game slot',
          },
        ].map((item) => (
          <div
            key={item.slot}
            data-testid={`game-slot-${item.slot}`}
            className="rounded-[18px] border-2 border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[16px] bg-[#E5E5E5] flex items-center justify-center text-[#AFAFAF] shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-black uppercase text-[#AFAFAF]">
                  Slot #{item.slot} · Building One by One
                </div>
                <h2 className="text-base font-black text-[#777777]">
                  {item.title}
                </h2>
                <p className="text-xs font-bold text-[#AFAFAF] mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <span className="px-3 py-1.5 rounded-[10px] bg-[#E5E5E5] text-[#777777] text-xs font-black uppercase shrink-0">
              Next Up
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
