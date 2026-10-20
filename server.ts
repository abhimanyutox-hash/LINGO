import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  FRENCH_CEFR_VOCAB_LIST,
  CEFR_TIER_SUMMARIES,
  filterCefrVocabulary,
  type CefrTier,
} from './src/data/cefrWordList';
import {
  applyLessonCompletion,
  applyDuelResult,
  calculateLessonStars,
  calculateTotalStars,
  calculateWordsLearnedCount,
  getArenaLeague,
  evaluateDailyStreakCheckIn,
  purchaseStreakFreeze,
  type PlayerProgress,
} from './src/utils/gameLogic';

export interface BackendState extends PlayerProgress {
  username: string;
  handle: string;
  nodeStars: Record<number, number>;
  revisedWordIds: string[];
  lavaHighScore: number;
  doorRunnerHighScore: number;
  passedChapterTests: string[];
  streakFreezes: number;
  lastStreakClaimDate: string | null;
}

const DATA_FILE_PATH = path.resolve(process.cwd(), '.backend-state.json');

const DEFAULT_STATE: BackendState = {
  username: 'Abhimanyu',
  handle: '@abhimanyu',
  completedLevelIndex: 2, // Levels 1 & 2 completed (Gold), Level 3 active (Green)
  xp: 1425,
  trophies: 309,
  duelsWon: 12,
  streakDays: 1,
  bestCombo: 5,
  nodeStars: {
    0: 3,
    1: 3,
  },
  revisedWordIds: ['a1-1-1', 'a1-1-2', 'a1-1-3', 'a1-1-4'],
  lavaHighScore: 1000,
  doorRunnerHighScore: 1250,
  passedChapterTests: [],
  streakFreezes: 1,
  lastStreakClaimDate: null,
};

function loadState(): BackendState {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch {
    // Fallback to default state if corrupted
  }
  return { ...DEFAULT_STATE };
}

function saveState(state: BackendState): void {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch {
    // Ignore write errors in read-only environments
  }
}

let serverState: BackendState = loadState();

function buildEnrichedResponse(state: BackendState) {
  const totalStars = calculateTotalStars(state.nodeStars);
  const wordsLearned = calculateWordsLearnedCount(
    state.completedLevelIndex,
    state.revisedWordIds
  );
  const currentLeague = getArenaLeague(state.trophies);

  const leaderboard = [
    {
      name: 'Camille_Lyon',
      trophies: 640,
      league: 'Master Gold League',
      isUser: false,
    },
    {
      name: 'Antoine_75',
      trophies: 420,
      league: 'Spell Valley Silver',
      isUser: false,
    },
    {
      name: state.username,
      trophies: state.trophies,
      league: currentLeague.name,
      isUser: true,
    },
    {
      name: 'ChloéDuLouvre',
      trophies: 295,
      league: 'Goblin Bronze Arena',
      isUser: false,
    },
  ].sort((a, b) => b.trophies - a.trophies);

  return {
    ...state,
    totalStars,
    wordsLearned,
    totalVocabCount: FRENCH_CEFR_VOCAB_LIST.length,
    currentLeague,
    leaderboard,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. GET /api/state — Fetch authoritative player progress, stars, words learned, and league
  app.get('/api/state', (_req, res) => {
    res.json(buildEnrichedResponse(serverState));
  });

  // 2. GET /api/vocabulary — Search & filter CEFR A1, A2, B1 French vocabulary
  app.get('/api/vocabulary', (req, res) => {
    const tierParam = (req.query.cefr as string) || 'ALL';
    const queryParam = (req.query.q as string) || '';
    const validTier =
      tierParam === 'A1' || tierParam === 'A2' || tierParam === 'B1'
        ? (tierParam as CefrTier)
        : 'ALL';

    const items = filterCefrVocabulary(validTier, queryParam);
    res.json({
      summaries: CEFR_TIER_SUMMARIES,
      items,
      revisedWordIds: serverState.revisedWordIds,
      wordsLearned: calculateWordsLearnedCount(
        serverState.completedLevelIndex,
        serverState.revisedWordIds
      ),
    });
  });

  // 3. POST /api/vocabulary/revise — Mark a French word as revised/learned
  app.post('/api/vocabulary/revise', (req, res) => {
    const { wordId } = req.body as { wordId?: string };
    if (wordId && !serverState.revisedWordIds.includes(wordId)) {
      serverState = {
        ...serverState,
        revisedWordIds: [...serverState.revisedWordIds, wordId],
        xp: serverState.xp + 5,
      };
      saveState(serverState);
    }
    res.json(buildEnrichedResponse(serverState));
  });

  // 4. POST /api/lessons/complete — Complete a Lesson or End-of-Chapter Test & award 1-3 Stars
  app.post('/api/lessons/complete', (req, res) => {
    const {
      nodeIndex = 0,
      xpEarned = 50,
      accuracy = 100,
    } = req.body as {
      nodeIndex?: number;
      xpEarned?: number;
      accuracy?: number;
    };

    const earnedStars = calculateLessonStars(accuracy);
    const prevStars = serverState.nodeStars[nodeIndex] || 0;
    const updatedNodeStars = {
      ...serverState.nodeStars,
      [nodeIndex]: Math.max(prevStars, earnedStars),
    };

    const updatedProgress = applyLessonCompletion(
      serverState,
      nodeIndex,
      xpEarned
    );

    const passedTests = [...serverState.passedChapterTests];
    if (nodeIndex === 4 && !passedTests.includes('A1')) passedTests.push('A1');
    if (nodeIndex === 9 && !passedTests.includes('A2')) passedTests.push('A2');
    if (nodeIndex === 14 && !passedTests.includes('B1')) passedTests.push('B1');

    serverState = {
      ...serverState,
      ...updatedProgress,
      nodeStars: updatedNodeStars,
      passedChapterTests: passedTests,
    };
    saveState(serverState);
    res.json(buildEnrichedResponse(serverState));
  });

  // 4b. POST /api/chapter/qualify — Award 3 stars on all 4 lessons in a chapter to unlock the Final Chapter Test
  app.post('/api/chapter/qualify', (req, res) => {
    const { chapterIndex = 0 } = req.body as { chapterIndex?: number };
    const safeChapter = Math.max(0, Math.min(2, Math.floor(chapterIndex)));
    const startNode = safeChapter * 5;
    const updatedNodeStars = {
      ...serverState.nodeStars,
      [startNode]: 3,
      [startNode + 1]: 3,
      [startNode + 2]: 3,
      [startNode + 3]: 3,
    };
    serverState = {
      ...serverState,
      nodeStars: updatedNodeStars,
      completedLevelIndex: Math.max(serverState.completedLevelIndex, startNode + 4),
    };
    saveState(serverState);
    res.json(buildEnrichedResponse(serverState));
  });

  // 5. POST /api/duel/complete — Record 1v1 Clash Royale Battle result (+30 Win / -15 Loss)
  app.post('/api/duel/complete', (req, res) => {
    const {
      didWin = true,
      trophyDelta = 30,
      xpEarned = 40,
    } = req.body as {
      didWin?: boolean;
      trophyDelta?: number;
      xpEarned?: number;
    };

    const updatedProgress = applyDuelResult(
      serverState,
      didWin,
      trophyDelta,
      xpEarned
    );
    serverState = {
      ...serverState,
      ...updatedProgress,
    };
    saveState(serverState);
    res.json(buildEnrichedResponse(serverState));
  });

  // 6. POST /api/games/score — Save High Score & XP for "Floor is Lava" or "Door Dash Runner"
  app.post('/api/games/score', (req, res) => {
    const {
      gameType = 'lava_race',
      score = 0,
      xpEarned = 30,
    } = req.body as {
      gameType?: 'lava_race' | 'door_runner';
      score?: number;
      xpEarned?: number;
    };

    serverState = {
      ...serverState,
      xp: serverState.xp + Math.max(0, xpEarned),
      lavaHighScore:
        gameType === 'lava_race'
          ? Math.max(serverState.lavaHighScore, Math.round(score))
          : serverState.lavaHighScore,
      doorRunnerHighScore:
        gameType === 'door_runner'
          ? Math.max(serverState.doorRunnerHighScore, Math.round(score))
          : serverState.doorRunnerHighScore,
    };
    saveState(serverState);
    res.json(buildEnrichedResponse(serverState));
  });

  // 7. POST /api/streak/claim — Claim consecutive daily streak bonus XP or simulate next day
  app.post('/api/streak/claim', (req, res) => {
    const { forceAdvanceDays } = req.body as { forceAdvanceDays?: number };
    const todayIso = new Date().toISOString().slice(0, 10);

    const checkIn = evaluateDailyStreakCheckIn({
      currentStreak: serverState.streakDays,
      currentXp: serverState.xp,
      streakFreezes: serverState.streakFreezes,
      lastClaimDate: serverState.lastStreakClaimDate,
      todayDate: todayIso,
      forceAdvanceDays,
    });

    serverState = {
      ...serverState,
      streakDays: checkIn.nextStreak,
      xp: checkIn.nextXp,
      streakFreezes: checkIn.freezesRemaining,
      lastStreakClaimDate: checkIn.claimDate,
    };
    saveState(serverState);
    res.json({
      ...buildEnrichedResponse(serverState),
      checkIn,
    });
  });

  // 8. POST /api/shop/streak-freeze — Purchase a Streak Freeze utility in the shop
  app.post('/api/shop/streak-freeze', (_req, res) => {
    const purchase = purchaseStreakFreeze(
      serverState.xp,
      serverState.streakFreezes
    );
    if (purchase.success) {
      serverState = {
        ...serverState,
        xp: purchase.nextXp,
        streakFreezes: purchase.nextFreezes,
      };
      saveState(serverState);
    }
    res.json({
      ...buildEnrichedResponse(serverState),
      purchase,
    });
  });

  // 9. POST /api/state/reset — Reset to initial demo state if requested
  app.post('/api/state/reset', (_req, res) => {
    serverState = { ...DEFAULT_STATE };
    saveState(serverState);
    res.json(buildEnrichedResponse(serverState));
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lingo Royale Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
