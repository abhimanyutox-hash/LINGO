import React, { useState, useEffect } from 'react';
import {
  FRENCH_COURSE,
  type PathNodeData,
} from './data/curriculum';
import {
  applyAnswerEvaluation,
  applyLessonCompletion,
  applyDuelResult,
  calculateLessonStars,
  calculateTotalStars,
  calculateWordsLearnedCount,
  getPlayerNormalLevel,
  evaluateDailyStreakCheckIn,
  purchaseStreakFreeze,
  isChapterTestNode,
  type EvaluationState,
  type PlayerProgress,
} from './utils/gameLogic';
import { LessonsTab } from './screens/LessonsTab';
import { BattleTab } from './screens/BattleTab';
import { GamesTab } from './screens/GamesTab';
import { SettingsTab } from './screens/SettingsTab';
import { LessonScreen } from './screens/LessonScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { WordListModal } from './widgets/WordListModal';
import { DailyStreakModal } from './widgets/DailyStreakModal';
import {
  Flame3DIcon,
  Trophy3DIcon,
  NavPathIcon,
  NavBattleIcon,
  NavGamesIcon,
  NavSettingsIcon,
} from './widgets/GameIcons';
import { soundManager } from './utils/soundEffects';

export type BottomTabId = 'lessons' | 'battle' | 'games' | 'settings';

export default function App() {
  const [playerStats, setPlayerStats] = useState<PlayerProgress>({
    completedLevelIndex: 2, // Levels 1 & 2 completed (Gold), Level 3 active (Green)
    xp: 1425,
    trophies: 309, // Exact starting value from specification ("309")
    duelsWon: 12,
    streakDays: 1, // Displayed as "1/10"
    bestCombo: 5,
  });

  const [nodeStars, setNodeStars] = useState<Record<number, number>>({
    0: 3,
    1: 3,
  });
  const [passedChapterTests, setPassedChapterTests] = useState<number[]>([]);
  const [recentlyUnlockedChapter, setRecentlyUnlockedChapter] = useState<
    number | null
  >(null);
  const [revisedWordIds, setRevisedWordIds] = useState<string[]>([
    'a1-1-1',
    'a1-1-2',
    'a1-1-3',
    'a1-1-4',
  ]);
  const [lavaHighScore, setLavaHighScore] = useState<number>(1000);
  const [doorRunnerHighScore, setDoorRunnerHighScore] = useState<number>(1250);
  const [isWordListOpen, setIsWordListOpen] = useState<boolean>(false);

  const [streakFreezes, setStreakFreezes] = useState<number>(1);
  const [lastStreakClaimDate, setLastStreakClaimDate] = useState<string | null>(
    null
  );
  const [streakRewardBanner, setStreakRewardBanner] = useState<string | null>(
    null
  );
  const [isStreakModalOpen, setIsStreakModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('streak') === '1') return true;
    }
    return false;
  });

  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('welcome') === '1') return true;
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<BottomTabId>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (
        tabParam === 'lessons' ||
        tabParam === 'battle' ||
        tabParam === 'games' ||
        tabParam === 'settings'
      ) {
        return tabParam;
      }
    }
    return 'lessons';
  });

  const [activeLessonNode, setActiveLessonNode] = useState<PathNodeData | null>(
    () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('chapterTest') === '1') {
          return FRENCH_COURSE.nodes[4];
        }
        if (params.get('autostart') === '1') {
          return FRENCH_COURSE.nodes[2];
        }
      }
      return null;
    }
  );

  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Sync authoritative state from the Express backend (/api/state) on mount
  useEffect(() => {
    fetch('/api/state')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setPlayerStats((prev) => ({
          completedLevelIndex:
            typeof data.completedLevelIndex === 'number'
              ? data.completedLevelIndex
              : prev.completedLevelIndex,
          xp: typeof data.xp === 'number' ? data.xp : prev.xp,
          trophies:
            typeof data.trophies === 'number' ? data.trophies : prev.trophies,
          duelsWon:
            typeof data.duelsWon === 'number' ? data.duelsWon : prev.duelsWon,
          streakDays:
            typeof data.streakDays === 'number'
              ? data.streakDays
              : prev.streakDays,
          bestCombo:
            typeof data.bestCombo === 'number' ? data.bestCombo : prev.bestCombo,
        }));
        if (data.nodeStars && typeof data.nodeStars === 'object') {
          setNodeStars(data.nodeStars);
        }
        if (Array.isArray(data.passedChapterTests)) {
          setPassedChapterTests(
            data.passedChapterTests.map((n: unknown) => Number(n)).filter(Number.isFinite)
          );
        }
        if (Array.isArray(data.revisedWordIds)) {
          setRevisedWordIds(data.revisedWordIds);
        }
        if (typeof data.lavaHighScore === 'number') {
          setLavaHighScore(data.lavaHighScore);
        }
        if (typeof data.doorRunnerHighScore === 'number') {
          setDoorRunnerHighScore(data.doorRunnerHighScore);
        }
        if (typeof data.streakFreezes === 'number') {
          setStreakFreezes(data.streakFreezes);
        }
        if (typeof data.lastStreakClaimDate === 'string') {
          setLastStreakClaimDate(data.lastStreakClaimDate);
        }
      })
      .catch(() => {
        // Offline / fallback mode uses initial local state
      });
  }, []);

  const normalLevel = getPlayerNormalLevel(playerStats.xp);
  const totalStars = calculateTotalStars(nodeStars);
  const wordsLearned = calculateWordsLearnedCount(
    playerStats.completedLevelIndex,
    revisedWordIds
  );

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.muted = next;
  };

  const handleStartLesson = (node: PathNodeData) => {
    setActiveLessonNode(node);
  };

  const handleAnswerEvaluated = (
    evaluation: EvaluationState,
    combo: number
  ) => {
    setPlayerStats((prev) => applyAnswerEvaluation(prev, evaluation, combo));
  };

  const handleCompleteLesson = (
    nodeIndex: number,
    xpEarned: number,
    accuracy: number
  ) => {
    const earnedStars = calculateLessonStars(accuracy);
    setNodeStars((prev) => ({
      ...prev,
      [nodeIndex]: Math.max(prev[nodeIndex] || 0, earnedStars),
    }));
    setPlayerStats((prev) =>
      applyLessonCompletion(prev, nodeIndex, xpEarned)
    );
    if (isChapterTestNode(nodeIndex)) {
      setPassedChapterTests((prev) =>
        prev.includes(nodeIndex) ? prev : [...prev, nodeIndex]
      );
      const nextChapterIdx = Math.floor(nodeIndex / 5) + 1;
      if (nextChapterIdx <= 2) {
        setRecentlyUnlockedChapter(nextChapterIdx);
      }
    }
    setActiveLessonNode(null);

    fetch('/api/lessons/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeIndex, xpEarned, accuracy }),
    }).catch(() => {});
  };

  const handleQualifyChapterForTest = (chapterIndex: number) => {
    const startNode = chapterIndex * 5;
    setNodeStars((prev) => ({
      ...prev,
      [startNode]: 3,
      [startNode + 1]: 3,
      [startNode + 2]: 3,
      [startNode + 3]: 3,
    }));
    setPlayerStats((prev) => ({
      ...prev,
      completedLevelIndex: Math.max(prev.completedLevelIndex, startNode + 4),
    }));

    fetch('/api/chapter/qualify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterIndex }),
    }).catch(() => {});
  };

  const handleFinishDuel = (
    didWin: boolean,
    trophyDelta: number,
    xpEarned: number
  ) => {
    setPlayerStats((prev) =>
      applyDuelResult(prev, didWin, trophyDelta, xpEarned)
    );

    fetch('/api/duel/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ didWin, trophyDelta, xpEarned }),
    }).catch(() => {});
  };

  const handleSaveGameScore = (
    gameType: 'lava_race' | 'door_runner',
    score: number,
    xpEarned: number
  ) => {
    setPlayerStats((prev) => ({
      ...prev,
      xp: prev.xp + Math.max(0, xpEarned),
    }));
    if (gameType === 'lava_race') {
      setLavaHighScore((prev) => Math.max(prev, Math.round(score)));
    } else {
      setDoorRunnerHighScore((prev) => Math.max(prev, Math.round(score)));
    }

    fetch('/api/games/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameType, score, xpEarned }),
    }).catch(() => {});
  };

  const handleMarkWordRevised = (wordId: string) => {
    if (!revisedWordIds.includes(wordId)) {
      setRevisedWordIds((prev) => [...prev, wordId]);
      setPlayerStats((prev) => ({
        ...prev,
        xp: prev.xp + 5,
      }));
      fetch('/api/vocabulary/revise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId }),
      }).catch(() => {});
    }
  };

  const todayIso = new Date().toISOString().slice(0, 10);
  const claimedStreakToday = lastStreakClaimDate === todayIso;

  const handleClaimDailyStreak = (forceAdvanceDays?: number) => {
    const checkIn = evaluateDailyStreakCheckIn({
      currentStreak: playerStats.streakDays,
      currentXp: playerStats.xp,
      streakFreezes,
      lastClaimDate: lastStreakClaimDate,
      todayDate: todayIso,
      forceAdvanceDays,
    });

    setPlayerStats((prev) => ({
      ...prev,
      streakDays: checkIn.nextStreak,
      xp: checkIn.nextXp,
    }));
    setStreakFreezes(checkIn.freezesRemaining);
    setLastStreakClaimDate(checkIn.claimDate);

    if (checkIn.status === 'freeze_consumed') {
      setStreakRewardBanner(
        `❄️ STREAK FREEZE USED! Day ${checkIn.nextStreak} Protected (+${checkIn.bonusXp} XP)`
      );
    } else if (checkIn.status === 'streak_reset') {
      setStreakRewardBanner(
        `🔥 Streak Reset to Day 1 (+${checkIn.bonusXp} XP) — Equip a Freeze next time!`
      );
    } else if (checkIn.bonusXp > 0) {
      setStreakRewardBanner(
        `🔥 DAY ${checkIn.nextStreak} STREAK BONUS! +${checkIn.bonusXp} XP CLAIMED!`
      );
    }

    fetch('/api/streak/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ forceAdvanceDays }),
    }).catch(() => {});
  };

  const handleBuyStreakFreeze = () => {
    const result = purchaseStreakFreeze(playerStats.xp, streakFreezes);
    if (!result.success) return;

    setPlayerStats((prev) => ({
      ...prev,
      xp: result.nextXp,
    }));
    setStreakFreezes(result.nextFreezes);
    setStreakRewardBanner(result.message);

    fetch('/api/shop/streak-freeze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
  };

  // Welcome / Splash Screen when logged out
  if (isLoggedOut) {
    return (
      <WelcomeScreen
        trophies={playerStats.trophies}
        streakDays={playerStats.streakDays}
        onPlayNow={() => {
          setIsLoggedOut(false);
          setIsStreakModalOpen(true);
        }}
      />
    );
  }

  // Dedicated full-screen French lesson loop when a level node is tapped
  if (activeLessonNode) {
    return (
      <LessonScreen
        node={activeLessonNode}
        speechLang={FRENCH_COURSE.speechLang}
        trophies={playerStats.trophies}
        completedLevelIndex={playerStats.completedLevelIndex}
        nodeStars={nodeStars}
        revisedWordIds={revisedWordIds}
        onAnswerEvaluated={handleAnswerEvaluated}
        onCompleteLesson={handleCompleteLesson}
        onExitLesson={() => setActiveLessonNode(null)}
      />
    );
  }

  const bottomTabs: Array<{
    id: BottomTabId;
    label: string;
    icon: React.FC<{ className?: string }>;
  }> = [
    { id: 'lessons', label: 'Lessons', icon: NavPathIcon },
    { id: 'battle', label: '1v1 Battle', icon: NavBattleIcon },
    { id: 'games', label: 'Games', icon: NavGamesIcon },
    { id: 'settings', label: 'Settings', icon: NavSettingsIcon },
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #2B88D9 0%, #145DA0 100%)',
      }}
      className="h-screen w-full overflow-hidden flex flex-col justify-between relative text-white"
    >
      {/* Persistent Top Status Bar (Strictly 2 Badges Only: Left Streak "1/10", Right Trophies "309") */}
      <header
        data-testid="persistent-top-status-bar"
        className="w-full max-w-[460px] mx-auto px-4 pt-3 pb-1 flex items-center justify-between shrink-0 z-30"
      >
        {/* Left Badge (Streak): Red glossy 3D pill (#E53935 with #AB000D bottom lip) — Tappable to open Daily Streak & Shop */}
        <button
          type="button"
          data-testid="top-badge-streak"
          aria-label={`Daily Streak ${playerStats.streakDays} of 10 days, ${streakFreezes} Streak Freezes equipped. Click to open Daily Streak and Shop`}
          onClick={() => {
            soundManager.playTap();
            setIsStreakModalOpen(true);
          }}
          style={{
            background:
              'linear-gradient(180deg, #EF5350 0%, #E53935 60%, #C62828 100%)',
            borderBottom: '5px solid #AB000D',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          }}
          className="h-11 px-3.5 rounded-[14px] border-2 border-[#FF8A80]/60 flex items-center gap-2 select-none cursor-pointer active:translate-y-[2px] relative"
        >
          <Flame3DIcon className="w-6 h-6 -ml-0.5 drop-shadow" />
          <span
            style={{ textShadow: '0 2px 0 rgba(0,0,0,0.4)' }}
            className="text-lg font-black tracking-wide text-white tabular-nums"
          >
            {playerStats.streakDays}/10
          </span>
          {streakFreezes > 0 && (
            <span
              data-testid="top-streak-freeze-count"
              title={`${streakFreezes} Streak Freeze Equipped`}
              className="ml-0.5 px-1.5 py-0.5 rounded-[7px] bg-[#0288D1] border border-[#80DEEA] text-[10px] font-black text-white leading-none tabular-nums"
            >
              ❄️{streakFreezes}
            </span>
          )}
          {!claimedStreakToday && (
            <span
              data-testid="streak-unclaimed-dot"
              className=" -top-1 -right-1 absolute w-3 h-3 rounded-full bg-[#FFD54F] border-2 border-[#B71C1C]"
            />
          )}
        </button>

        {/* Right Badge (Trophies): Gold glossy 3D pill (#FFB300 with #C68400 bottom lip) */}
        <div
          data-testid="top-badge-trophies"
          style={{
            background:
              'linear-gradient(180deg, #FFCA28 0%, #FFB300 60%, #FF8F00 100%)',
            borderBottom: '5px solid #C68400',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          }}
          className="h-11 px-3.5 rounded-[14px] border-2 border-[#FFE082]/80 flex items-center gap-2 select-none"
        >
          <Trophy3DIcon className="w-6 h-6 -ml-0.5 drop-shadow" />
          <span
            style={{ textShadow: '0 2px 0 rgba(0,0,0,0.4)' }}
            className="text-lg font-black tracking-wide text-white tabular-nums"
          >
            {playerStats.trophies}
          </span>
        </div>
      </header>

      {/* IndexedStack Equivalent: Preserves State Across All 4 Tabs */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative">
        <div
          className={
            activeTab === 'lessons' ? 'h-full w-full block' : 'hidden'
          }
        >
          <LessonsTab
            course={FRENCH_COURSE}
            activeLevelIndex={playerStats.completedLevelIndex}
            nodeStars={nodeStars}
            passedChapterTests={passedChapterTests}
            recentlyUnlockedChapter={recentlyUnlockedChapter}
            wordsLearned={wordsLearned}
            onStartLesson={handleStartLesson}
            onQualifyChapterForTest={handleQualifyChapterForTest}
            onDismissUnlockedChapterBanner={() =>
              setRecentlyUnlockedChapter(null)
            }
            onOpenWordList={() => setIsWordListOpen(true)}
          />
        </div>

        <div
          className={
            activeTab === 'battle' ? 'h-full w-full block' : 'hidden'
          }
        >
          <BattleTab
            course={FRENCH_COURSE}
            playerTrophies={playerStats.trophies}
            playerLevel={normalLevel.level}
            duelsWon={playerStats.duelsWon}
            onFinishDuel={handleFinishDuel}
          />
        </div>

        <div
          className={activeTab === 'games' ? 'h-full w-full block' : 'hidden'}
        >
          <GamesTab
            lavaHighScore={lavaHighScore}
            doorRunnerHighScore={doorRunnerHighScore}
            onSaveGameScore={handleSaveGameScore}
          />
        </div>

        <div
          className={
            activeTab === 'settings' ? 'h-full w-full block' : 'hidden'
          }
        >
          <SettingsTab
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            totalStars={totalStars}
            wordsLearned={wordsLearned}
            xp={playerStats.xp}
            level={normalLevel.level}
            streakDays={playerStats.streakDays}
            streakFreezes={streakFreezes}
            onOpenStreakModal={() => setIsStreakModalOpen(true)}
            onBuyStreakFreeze={handleBuyStreakFreeze}
            onOpenWordList={() => setIsWordListOpen(true)}
            onLogout={() => setIsLoggedOut(true)}
          />
        </div>
      </main>

      {/* Daily Streak Bonus 3D Animation Sequence & Streak Freeze Shop Modal */}
      <DailyStreakModal
        isOpen={isStreakModalOpen}
        streakDays={playerStats.streakDays}
        xp={playerStats.xp}
        streakFreezes={streakFreezes}
        claimedToday={claimedStreakToday}
        lastRewardBanner={streakRewardBanner}
        onClaimDailyStreak={handleClaimDailyStreak}
        onBuyStreakFreeze={handleBuyStreakFreeze}
        onClose={() => setIsStreakModalOpen(false)}
      />

      {/* Official CEFR A1-B1 French Word List & Revision Modal */}
      <WordListModal
        isOpen={isWordListOpen}
        revisedWordIds={revisedWordIds}
        wordsLearned={wordsLearned}
        completedLevelIndex={playerStats.completedLevelIndex}
        speechLang={FRENCH_COURSE.speechLang}
        onClose={() => setIsWordListOpen(false)}
        onMarkWordRevised={handleMarkWordRevised}
        onSelectLessonNumber={(lessonNum) => {
          const idx = Math.max(
            0,
            Math.min(FRENCH_COURSE.nodes.length - 1, lessonNum - 1)
          );
          setActiveLessonNode(FRENCH_COURSE.nodes[idx]);
        }}
      />

      {/* Custom 4-Tab Game Navigation Bar (Height 82px, Metallic Blue #1976D2 with #64B5F6 Top Border) */}
      <nav
        aria-label="Custom 4-Tab Game Navigation Bar"
        data-testid="bottom-4-tabs-nav"
        style={{
          height: '82px',
          background:
            'linear-gradient(180deg, #2185E5 0%, #1976D2 45%, #115293 100%)',
          borderTop: '3px solid #64B5F6',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.35)',
        }}
        className="w-full shrink-0 z-40 px-2 flex items-center justify-center"
      >
        <div className="w-full max-w-[460px] h-full grid grid-cols-4 items-center gap-1.5 px-1">
          {bottomTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                data-testid={`bottom-tab-${tab.id}`}
                onClick={() => {
                  soundManager.playTap();
                  setActiveTab(tab.id);
                }}
                style={
                  isActive
                    ? {
                        background:
                          'linear-gradient(180deg, #FFF176 0%, #FFD54F 35%, #FF8F00 100%)',
                        borderBottom: '4px solid #C66900',
                        transform: 'translateY(-8px) scale(1.08)',
                        boxShadow:
                          '0 8px 18px rgba(0, 0, 0, 0.4), 0 0 18px rgba(255, 213, 79, 0.55)',
                      }
                    : undefined
                }
                className={`h-[68px] rounded-[16px] flex flex-col items-center justify-center transition-all duration-150 cursor-pointer select-none focus:outline-none ${
                  isActive
                    ? 'border-2 border-[#FFFDE7]'
                    : 'hover:bg-white/10 border border-transparent'
                }`}
              >
                <IconComponent className="w-10 h-10 shrink-0" />
                <span
                  style={{
                    textShadow: isActive
                      ? '0 1.5px 0 rgba(0, 0, 0, 0.65)'
                      : '0 1.5px 0 rgba(0, 0, 0, 0.5)',
                  }}
                  className={`text-[11px] font-black tracking-tight leading-none mt-0.5 ${
                    isActive ? 'text-white' : 'text-[#E3F2FD]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
