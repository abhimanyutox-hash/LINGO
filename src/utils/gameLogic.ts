export type NodeStatus = 'locked' | 'active' | 'completed';
export type EvaluationState = 'idle' | 'correct' | 'incorrect';
export type CefrCode = 'A0' | 'A1' | 'A1+' | 'A2' | 'B1';

export interface NormalPlayerLevel {
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
  rankTitle: string;
}

export interface CefrGateSpec {
  afterNodeIndex: number; // 0-based node index after which this gate sits (e.g. 4, 9, 14)
  code: CefrCode;
  title: string;
  description: string;
  requiredCompletedNodes: number;
  accentColor: string;
  shadowColor: string;
}

export interface RandomBotProfile {
  id: string;
  name: string;
  tag: string;
  trophies: number;
  level: number;
  character: 'kiko' | 'luna' | 'mateo' | 'nova';
  accuracyRate: number;
  favoriteEmote: string;
}

export interface PlayerProgress {
  completedLevelIndex: number; // Highest unlocked index (0-based active index)
  xp: number;
  trophies: number;
  duelsWon: number;
  streakDays: number;
  bestCombo: number;
}

export const CEFR_GATES: CefrGateSpec[] = [
  {
    afterNodeIndex: 4,
    code: 'A1',
    title: 'CEFR A1 Diploma · Foundation French Speaker',
    description: 'You mastered core greetings, polite basics, cafés, and bistro orders in French!',
    requiredCompletedNodes: 5,
    accentColor: '#58CC02',
    shadowColor: '#46A302',
  },
  {
    afterNodeIndex: 9,
    code: 'A2',
    title: 'CEFR A2 Diploma · Independent Traveler',
    description: 'You can navigate train stations, book hotels, and describe daily Parisian life!',
    requiredCompletedNodes: 10,
    accentColor: '#1CB0F6',
    shadowColor: '#0284C7',
  },
  {
    afterNodeIndex: 14,
    code: 'B1',
    title: 'CEFR B1 Diploma · Fluent Conversationalist',
    description: 'You can debate opinions, use subjunctive connectors, and discuss work & society!',
    requiredCompletedNodes: 15,
    accentColor: '#FFC800',
    shadowColor: '#D97706',
  },
];

export const RANDOM_BOT_POOL: RandomBotProfile[] = [
  {
    id: 'bot-1',
    name: 'Pierre_Paris',
    tag: 'Arena Striker',
    trophies: 175,
    level: 4,
    character: 'kiko',
    accuracyRate: 0.68,
    favoriteEmote: '🔥',
  },
  {
    id: 'bot-2',
    name: 'ChloéDuLouvre',
    tag: 'Bistro Queen',
    trophies: 192,
    level: 5,
    character: 'luna',
    accuracyRate: 0.72,
    favoriteEmote: '⚡',
  },
  {
    id: 'bot-3',
    name: 'Maxime_FR',
    tag: 'Combo Knight',
    trophies: 168,
    level: 4,
    character: 'mateo',
    accuracyRate: 0.65,
    favoriteEmote: '😎',
  },
  {
    id: 'bot-4',
    name: 'Camille_Lyon',
    tag: 'Speed Scholar',
    trophies: 210,
    level: 6,
    character: 'nova',
    accuracyRate: 0.76,
    favoriteEmote: '👑',
  },
  {
    id: 'bot-5',
    name: 'HugoLeRoi',
    tag: 'Royal Challenger',
    trophies: 184,
    level: 5,
    character: 'kiko',
    accuracyRate: 0.7,
    favoriteEmote: '🚀',
  },
  {
    id: 'bot-6',
    name: 'LéaCroissant',
    tag: 'Morning Sprinter',
    trophies: 160,
    level: 3,
    character: 'luna',
    accuracyRate: 0.64,
    favoriteEmote: '🥐',
  },
  {
    id: 'bot-7',
    name: 'Antoine_75',
    tag: 'Métro Tactician',
    trophies: 198,
    level: 5,
    character: 'mateo',
    accuracyRate: 0.74,
    favoriteEmote: '🎯',
  },
  {
    id: 'bot-8',
    name: 'ManonEclair',
    tag: 'Grand Duelist',
    trophies: 220,
    level: 6,
    character: 'nova',
    accuracyRate: 0.78,
    favoriteEmote: '✨',
  },
];

/**
 * Computes the horizontal X-offset (in px) for a progression path node
 * using the exact sine wave formula: sin(index) * amplitude (default 100).
 */
export function calculateNodeHorizontalOffset(index: number, amplitude: number = 100): number {
  if (index < 0 || !Number.isFinite(index)) return 0;
  const raw = Math.sin(index) * amplitude;
  return Math.round(raw * 100) / 100;
}

/**
 * Determines the visual and interactive state of a node on the path.
 */
export function getNodeStatus(nodeIndex: number, activeLevelIndex: number): NodeStatus {
  if (nodeIndex < activeLevelIndex) {
    return 'completed';
  }
  if (nodeIndex === activeLevelIndex) {
    return 'active';
  }
  return 'locked';
}

/**
 * Evaluates a user's selected multiple-choice option index against the correct index.
 */
export function evaluateAnswer(
  selectedIndex: number | null,
  correctIndex: number
): EvaluationState {
  if (selectedIndex === null || selectedIndex === undefined || selectedIndex < 0) {
    return 'idle';
  }
  return selectedIndex === correctIndex ? 'correct' : 'incorrect';
}

/**
 * Computes the clamped progress ratio [0, 1] for the animated lesson header bar.
 */
export function calculateProgressRatio(completedSteps: number, totalSteps: number): number {
  if (totalSteps <= 0) return 0;
  const clamped = Math.max(0, Math.min(completedSteps, totalSteps));
  return Math.round((clamped / totalSteps) * 1000) / 1000;
}

/**
 * Computes the normal RPG player level (Lv. 1, Lv. 2, Lv. 3...) from total XP (100 XP per level).
 */
export function getPlayerNormalLevel(xp: number): NormalPlayerLevel {
  const safeXp = Math.max(0, Math.floor(xp));
  const xpPerLevel = 100;
  const level = Math.floor(safeXp / xpPerLevel) + 1;
  const currentLevelXp = safeXp % xpPerLevel;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / xpPerLevel) * 100));

  const titles = [
    'Rookie Apprentice',
    'Parisian Explorer',
    'Café Regular',
    'Royal Contender',
    'Bistro Chevalier',
    'Grand Polyglot',
  ];
  const rankTitle = titles[Math.min(titles.length - 1, level - 1)];

  return {
    level,
    currentLevelXp,
    xpForNextLevel: xpPerLevel,
    progressPercent,
    rankTitle,
  };
}

/**
 * Returns the highest unlocked CEFR code based on completed levels.
 */
export function getHighestUnlockedCefr(completedLevels: number): CefrCode {
  if (completedLevels >= 15) return 'B1';
  if (completedLevels >= 10) return 'A2';
  if (completedLevels >= 5) return 'A1';
  return 'A0';
}

/**
 * Picks a random bot opponent from the pool with trophy scaling close to the player.
 */
export function pickRandomBotOpponent(
  playerTrophies: number,
  randomValue: number = Math.random()
): RandomBotProfile {
  const clampedRand = Math.max(0, Math.min(0.9999, randomValue));
  const index = Math.floor(clampedRand * RANDOM_BOT_POOL.length);
  const baseBot = RANDOM_BOT_POOL[index];
  const offset = (index % 3 === 0 ? 8 : index % 2 === 0 ? -6 : 4);
  return {
    ...baseBot,
    trophies: Math.max(50, playerTrophies + offset),
  };
}

/**
 * Calculates score points earned in a 1v1 Duel round with combo multiplier.
 */
export function calculateDuelRoundPoints(
  isCorrect: boolean,
  newCombo: number,
  speedBonus: number = 25
): number {
  if (!isCorrect) return 0;
  const base = 100;
  const comboBonus = Math.min(5, Math.max(1, newCombo)) * 25;
  return base + comboBonus + Math.max(0, speedBonus);
}

/**
 * Updates player progress when an answer is checked.
 */
export function applyAnswerEvaluation(
  progress: PlayerProgress,
  evaluation: EvaluationState,
  currentCombo: number = 1
): PlayerProgress {
  if (evaluation === 'correct') {
    return {
      ...progress,
      bestCombo: Math.max(progress.bestCombo, currentCombo),
    };
  }
  return progress;
}

export type ArenaLeagueId = 'bronze' | 'silver' | 'gold';

export interface ArenaLeagueSpec {
  id: ArenaLeagueId;
  name: string;
  minTrophies: number;
  nextLeagueTrophies: number | null;
  primaryColor: string;
  secondaryColor: string;
  borderColor: string;
}

export const ALL_ARENA_LEAGUES: ArenaLeagueSpec[] = [
  {
    id: 'bronze',
    name: 'Goblin Bronze Arena',
    minTrophies: 0,
    nextLeagueTrophies: 301,
    primaryColor: '#CD7F32',
    secondaryColor: '#8B4513',
    borderColor: '#FFCC80',
  },
  {
    id: 'silver',
    name: 'Spell Valley Silver',
    minTrophies: 301,
    nextLeagueTrophies: 601,
    primaryColor: '#CFD8DC',
    secondaryColor: '#607D8B',
    borderColor: '#FFFFFF',
  },
  {
    id: 'gold',
    name: 'Master Gold League',
    minTrophies: 601,
    nextLeagueTrophies: null,
    primaryColor: '#FFD54F',
    secondaryColor: '#FF8F00',
    borderColor: '#FFF59D',
  },
];

/**
 * Clash Royale-Style 1v1 League Tier Engine:
 * - 0 – 300 Trophies: Goblin Bronze Arena
 * - 301 – 600 Trophies: Spell Valley Silver
 * - 601+ Trophies: Master Gold League
 */
export function getArenaLeague(trophies: number): ArenaLeagueSpec {
  const safeTrophies = Math.max(0, Math.floor(trophies));
  if (safeTrophies <= 300) {
    return ALL_ARENA_LEAGUES[0];
  }
  if (safeTrophies <= 600) {
    return ALL_ARENA_LEAGUES[1];
  }
  return ALL_ARENA_LEAGUES[2];
}

/**
 * Evaluates a Fill-in-the-Blank selection.
 */
export function evaluateFillBlank(
  selectedWord: string | null,
  correctWord: string
): EvaluationState {
  if (!selectedWord || !selectedWord.trim()) return 'idle';
  return normalizeLavaInput(selectedWord) === normalizeLavaInput(correctWord)
    ? 'correct'
    : 'incorrect';
}

/**
 * Evaluates a Word Assembly answer tray against the expected target sequence.
 */
export function evaluateWordAssembly(
  assembledWords: string[],
  targetWords: string[]
): EvaluationState {
  if (!assembledWords || assembledWords.length === 0) return 'idle';
  const joinedAssembled = normalizeLavaInput(assembledWords.join(' '));
  const joinedTarget = normalizeLavaInput(targetWords.join(' '));
  return joinedAssembled === joinedTarget ? 'correct' : 'incorrect';
}

/**
 * Updates player progress when a French path lesson is completed.
 * Awards +50 XP (or custom XP), increments streakDays (🔥), and unlocks the next node.
 * Trophies remain unchanged because Trophies are earned/lost exclusively in 1v1 Battles.
 */
export function applyLessonCompletion(
  progress: PlayerProgress,
  nodeIndex: number,
  xpReward: number = 50
): PlayerProgress {
  const nextActiveIndex =
    nodeIndex >= progress.completedLevelIndex
      ? nodeIndex + 1
      : progress.completedLevelIndex;

  return {
    ...progress,
    completedLevelIndex: nextActiveIndex,
    xp: progress.xp + Math.max(0, xpReward),
    streakDays: Math.min(10, progress.streakDays + 1),
  };
}

/**
 * Updates player progress after a 1v1 Battle completes.
 * Trophies are earned or lost exclusively through 1v1 Battles (+30 for a win, -15 for a loss).
 */
export function applyDuelResult(
  progress: PlayerProgress,
  didWin: boolean,
  trophyDelta: number = didWin ? 30 : -15,
  xpReward: number = didWin ? 40 : 15
): PlayerProgress {
  const signedDelta = didWin ? Math.abs(trophyDelta) : -Math.abs(trophyDelta);
  return {
    ...progress,
    trophies: Math.max(0, progress.trophies + signedDelta),
    xp: progress.xp + Math.max(0, xpReward),
    duelsWon: didWin ? progress.duelsWon + 1 : progress.duelsWon,
  };
}

// ============================================================================
// "THE FLOOR IS LAVA" 60-FPS ARCADE SURVIVAL & MULTIPLAYER RACE ENGINE
// ============================================================================

export const LAVA_INITIAL_PLAYER_ALTITUDE = 15.0; // meters
export const LAVA_INITIAL_ALTITUDE = 0.0; // meters
export const LAVA_PIXELS_PER_METER = 18.0; // 1 meter = 18 logical pixels
export const LAVA_WRONG_ANSWER_SURGE_METERS = 2.5; // +2.5m surge on wrong answer

export type LavaSpeedTier = 'blazing' | 'great' | 'phew';

export interface LavaSpeedReward {
  tier: LavaSpeedTier;
  heightGain: number; // +12.0m, +8.0m, or +4.5m
  combatText: string;
  tileBgColor: string;
  tileBorderColor: string;
  tileTextColor: string;
}

export interface LavaRacerBot {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  altitude: number;
  climbRate: number; // base meters/sec
  isEliminated: boolean;
}

/**
 * Computes the player's live race standing (1 = 1st place, 2 = 2nd, etc.)
 * among all active racers in Multiplayer Floor is Lava.
 */
export function computeLavaRaceRank(
  playerAltitude: number,
  botAltitudes: number[]
): number {
  let rank = 1;
  for (const botAlt of botAltitudes) {
    if (botAlt > playerAltitude) {
      rank += 1;
    }
  }
  return rank;
}

/**
 * Escalating Difficulty:
 * lavaSpeed starts at 1.8 meters/sec and increases by 0.15 meters/sec for every 5 correct answers:
 * lavaSpeed = 1.8 + (score ~/ 5) * 0.15
 */
export function calculateLavaSpeed(score: number): number {
  const safeScore = Math.max(0, Math.floor(score));
  const tierSteps = Math.floor(safeScore / 5);
  return Math.round((1.8 + tierSteps * 0.15) * 1000) / 1000;
}

/**
 * Steps lavaAltitude forward by deltaTime (dt in seconds).
 */
export function stepLavaAltitude(
  lavaAltitude: number,
  score: number,
  dtSeconds: number
): number {
  const safeDt = Math.max(0, Math.min(2.0, dtSeconds));
  const speed = calculateLavaSpeed(score);
  return Math.round((lavaAltitude + speed * safeDt) * 1000) / 1000;
}

/**
 * Tile Rising Formula (Time-Based Reward):
 * - < 2.0 seconds (BLAZING FAST): +12.0m, Gold/Neon Blue tile, "⚡ SPEED BONUS! +12m"
 * - 2.0 to 4.5 seconds (GREAT): +8.0m, Duolingo Green (#58CC02) tile, "🔥 GREAT! +8m"
 * - > 4.5 seconds (PHEW): +4.5m, Stone Gray tile, "😅 PHEW! +4.5m"
 */
export function calculateLavaSpeedBonus(
  timeTakenSeconds: number
): LavaSpeedReward {
  const safeTime = Math.max(0, timeTakenSeconds);
  if (safeTime < 2.0) {
    return {
      tier: 'blazing',
      heightGain: 12.0,
      combatText: '⚡ SPEED BONUS! +12m',
      tileBgColor: '#00E5FF',
      tileBorderColor: '#0099B8',
      tileTextColor: '#0F172A',
    };
  }
  if (safeTime <= 4.5) {
    return {
      tier: 'great',
      heightGain: 8.0,
      combatText: '🔥 GREAT! +8m',
      tileBgColor: '#58CC02',
      tileBorderColor: '#46A302',
      tileTextColor: '#FFFFFF',
    };
  }
  return {
    tier: 'phew',
    heightGain: 4.5,
    combatText: '😅 PHEW! +4.5m',
    tileBgColor: '#78909C',
    tileBorderColor: '#455A64',
    tileTextColor: '#FFFFFF',
  };
}

/**
 * Normalizes a typed translation string (case-insensitive, trimmed of whitespace and punctuation,
 * and normalized diacritics so typing with or without French accents works reliably).
 */
export function normalizeLavaInput(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,!?;:'"’\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validates whether the player's typed string matches any accepted translation.
 */
export function validateLavaAnswer(
  typedInput: string,
  acceptedAnswers: string[]
): boolean {
  const normalizedTyped = normalizeLavaInput(typedInput);
  if (!normalizedTyped) return false;
  return acceptedAnswers.some(
    (ans) => normalizeLavaInput(ans) === normalizedTyped
  );
}

// ============================================================================
// "DOOR DASH RUNNER" 3-LANE 3D PERSPECTIVE RUNNING GAME ENGINE
// ============================================================================

export type RunnerLane = 0 | 1 | 2; // 0 = Left Door, 1 = Center Door, 2 = Right Door

export interface RunnerDoorEvaluation {
  isCorrect: boolean;
  scoreDelta: number;
  nextStreak: number;
  nextLives: number;
  isGameOver: boolean;
  feedbackText: string;
}

/**
 * Calculates forward door approach speed (in normalized depth units per second).
 * Base speed is 0.28 depth/sec and scales up smoothly with doors cleared.
 */
export function calculateRunnerDoorSpeed(doorsCleared: number): number {
  const safeCleared = Math.max(0, Math.floor(doorsCleared));
  const bonus = Math.min(0.28, Math.floor(safeCleared / 3) * 0.035);
  return Math.round((0.28 + bonus) * 1000) / 1000;
}

/**
 * Evaluates when the running player reaches the 3-door wall at depth >= 1.0.
 */
export function evaluateRunnerDoorImpact(
  playerLane: RunnerLane,
  correctLane: RunnerLane,
  currentStreak: number,
  currentLives: number
): RunnerDoorEvaluation {
  const isCorrect = playerLane === correctLane;
  if (isCorrect) {
    const nextStreak = currentStreak + 1;
    const multiplier = Math.min(5, Math.max(1, nextStreak));
    const scoreDelta = 100 + multiplier * 25;
    return {
      isCorrect: true,
      scoreDelta,
      nextStreak,
      nextLives: currentLives,
      isGameOver: false,
      feedbackText: `🚪 DOOR OPENED! +${scoreDelta} PTS (${multiplier}x)`,
    };
  }

  const nextLives = Math.max(0, currentLives - 1);
  return {
    isCorrect: false,
    scoreDelta: 0,
    nextStreak: 0,
    nextLives,
    isGameOver: nextLives <= 0,
    feedbackText: '💥 LOCKED DOOR! -1 SHIELD',
  };
}

// ============================================================================
// STAR-GATED CHAPTER PROGRESSION, END-OF-CHAPTER TESTS & WORDS LEARNED ENGINE
// ============================================================================

export const STARS_REQUIRED_FOR_CHAPTER_TEST = 8; // Out of 12 stars in Lessons 1-4 of a chapter
export const STARS_REQUIRED_FOR_A2_STAGE = 10; // Total stars needed from A1 (including A1 Chapter Test) to unlock A2
export const STARS_REQUIRED_FOR_B1_STAGE = 20; // Total stars needed from A1+A2 to unlock B1

/**
 * Computes 1 to 3 stars earned on a lesson or chapter test based on accuracy percentage.
 * - >= 90% accuracy -> 3 stars
 * - >= 70% accuracy -> 2 stars
 * - < 70% accuracy  -> 1 star
 */
export function calculateLessonStars(accuracyPercent: number): 1 | 2 | 3 {
  if (accuracyPercent >= 90) return 3;
  if (accuracyPercent >= 70) return 2;
  return 1;
}

/**
 * Returns whether a 0-based nodeIndex is an End-of-Chapter Final Test node.
 * Node 4 (Level 5 = A1 Final Test), Node 9 (Level 10 = A2 Final Test), Node 14 (Level 15 = B1 Final Test).
 */
export function isChapterTestNode(nodeIndex: number): boolean {
  return nodeIndex === 4 || nodeIndex === 9 || nodeIndex === 14 || nodeIndex === 19;
}

/**
 * Calculates total stars earned across a map of { [nodeIndex]: stars }.
 */
export function calculateTotalStars(nodeStars: Record<number, number>): number {
  return Object.values(nodeStars).reduce(
    (sum, s) => sum + Math.max(0, Math.min(3, s || 0)),
    0
  );
}

/**
 * Calculates stars earned within a specific 5-level chapter (chapterIndex 0 = A1, 1 = A2, 2 = B1).
 */
export function calculateChapterStars(
  nodeStars: Record<number, number>,
  chapterIndex: number
): number {
  const startNode = chapterIndex * 5;
  let sum = 0;
  for (let i = startNode; i < startNode + 5; i++) {
    sum += Math.max(0, Math.min(3, nodeStars[i] || 0));
  }
  return sum;
}

export interface ChapterLessonStarEntry {
  nodeIndex: number;
  lessonNumber: number; // 1..4 within chapter
  globalLevelNumber: number; // 1..15
  stars: number;
  isCompleted: boolean;
}

export interface ChapterTestUnlockStatus {
  chapterIndex: number;
  chapterCode: 'A1' | 'A2' | 'B1';
  chapterTestNodeIndex: number;
  earnedLessonStars: number;
  maxLessonStars: number;
  minStarsRequired: number;
  starsRemaining: number;
  completedLessonsCount: number;
  totalLessonsInChapter: number;
  lessonsRemaining: number;
  allLessonsCompleted: boolean;
  meetsStarThreshold: boolean;
  isUnlocked: boolean;
  isTestCompleted: boolean;
  testStarsEarned: number;
  lessonBreakdown: ChapterLessonStarEntry[];
  nextChapterCode: 'A2' | 'B1' | 'MASTER';
  nextChapterTitle: string;
}

/**
 * Evaluates whether the Final Chapter Test (the 5th node of a chapter: node 4, 9, or 14)
 * is unlocked. Unlocks ONLY after:
 * 1) Earning stars (>= 1 star) on ALL 4 lessons in the chapter, AND
 * 2) Earning at least `minStarsRequired` (default 8 out of 12) total stars across those 4 lessons.
 */
export function evaluateChapterTestUnlock(
  nodeStars: Record<number, number>,
  chapterIndex: number,
  minStarsRequired: number = STARS_REQUIRED_FOR_CHAPTER_TEST
): ChapterTestUnlockStatus {
  const safeChapter = Math.max(0, Math.min(2, Math.floor(chapterIndex)));
  const startNode = safeChapter * 5;
  const chapterCodes: Array<'A1' | 'A2' | 'B1'> = ['A1', 'A2', 'B1'];
  const nextCodes: Array<'A2' | 'B1' | 'MASTER'> = ['A2', 'B1', 'MASTER'];
  const nextTitles = [
    'Chapter 2 · CEFR A2 Independent Traveler',
    'Chapter 3 · CEFR B1 Fluent Conversationalist',
    'Grand Polyglot Master Diploma',
  ];

  const lessonBreakdown: ChapterLessonStarEntry[] = [];
  let earnedLessonStars = 0;
  let completedLessonsCount = 0;

  for (let offset = 0; offset < 4; offset++) {
    const nodeIdx = startNode + offset;
    const rawStars = Math.max(0, Math.min(3, Math.floor(nodeStars[nodeIdx] || 0)));
    const isCompleted = rawStars >= 1;
    if (isCompleted) {
      completedLessonsCount += 1;
    }
    earnedLessonStars += rawStars;
    lessonBreakdown.push({
      nodeIndex: nodeIdx,
      lessonNumber: offset + 1,
      globalLevelNumber: nodeIdx + 1,
      stars: rawStars,
      isCompleted,
    });
  }

  const chapterTestNodeIndex = startNode + 4;
  const testStarsEarned = Math.max(
    0,
    Math.min(3, Math.floor(nodeStars[chapterTestNodeIndex] || 0))
  );
  const isTestCompleted = testStarsEarned >= 1;

  const totalLessonsInChapter = 4;
  const allLessonsCompleted = completedLessonsCount === totalLessonsInChapter;
  const meetsStarThreshold = earnedLessonStars >= minStarsRequired;
  const isUnlocked = allLessonsCompleted && meetsStarThreshold;

  return {
    chapterIndex: safeChapter,
    chapterCode: chapterCodes[safeChapter],
    chapterTestNodeIndex,
    earnedLessonStars,
    maxLessonStars: 12,
    minStarsRequired,
    starsRemaining: Math.max(0, minStarsRequired - earnedLessonStars),
    completedLessonsCount,
    totalLessonsInChapter,
    lessonsRemaining: Math.max(0, totalLessonsInChapter - completedLessonsCount),
    allLessonsCompleted,
    meetsStarThreshold,
    isUnlocked,
    isTestCompleted,
    testStarsEarned,
    lessonBreakdown,
    nextChapterCode: nextCodes[safeChapter],
    nextChapterTitle: nextTitles[safeChapter],
  };
}

export interface ChapterTestSummaryReport {
  nodeIndex: number;
  isFinalChapterTest: boolean;
  chapterIndex: number;
  chapterCode: 'A1' | 'A2' | 'B1';
  accuracyPercent: number;
  earnedStars: 1 | 2 | 3;
  xpEarned: number;
  totalWordsLearned: number;
  newWordsLearned: number;
  chapterWordsMastered: number;
  totalChapterWords: number;
  unlockedNextChapter: boolean;
  nextChapterIndex: number | null;
  nextChapterCode: 'A2' | 'B1' | 'MASTER';
  nextChapterTitle: string;
}

/**
 * Builds the comprehensive Summary Results Report when a lesson or Final Chapter Test finishes,
 * including total words learned, accuracy percentage, earned stars, and next-chapter unlock state.
 */
export function buildChapterTestSummary(params: {
  nodeIndex: number;
  correctCount: number;
  totalAttempts: number;
  completedLevelIndexBefore: number;
  revisedWordIds: string[];
}): ChapterTestSummaryReport {
  const {
    nodeIndex,
    correctCount,
    totalAttempts,
    completedLevelIndexBefore,
    revisedWordIds,
  } = params;

  const accuracyPercent =
    totalAttempts > 0
      ? Math.max(0, Math.min(100, Math.round((correctCount / totalAttempts) * 100)))
      : 100;
  const earnedStars = calculateLessonStars(accuracyPercent);
  const isFinalChapterTest = isChapterTestNode(nodeIndex);
  const chapterIndex = Math.max(0, Math.min(2, Math.floor(nodeIndex / 5)));
  const chapterCodes: Array<'A1' | 'A2' | 'B1'> = ['A1', 'A2', 'B1'];
  const nextCodes: Array<'A2' | 'B1' | 'MASTER'> = ['A2', 'B1', 'MASTER'];
  const nextTitles = [
    'Chapter 2 · CEFR A2 Independent Traveler',
    'Chapter 3 · CEFR B1 Fluent Conversationalist',
    'Grand Polyglot Master Diploma',
  ];

  const nextCompletedLevelIndex = Math.max(
    completedLevelIndexBefore,
    nodeIndex + 1
  );
  const totalWordsLearned = calculateWordsLearnedCount(
    nextCompletedLevelIndex,
    revisedWordIds
  );
  const xpEarned = isFinalChapterTest ? 100 : 50;
  const lessonPosInChapter = (nodeIndex % 5) + 1;
  const chapterWordsMastered = Math.min(40, lessonPosInChapter * 8);

  return {
    nodeIndex,
    isFinalChapterTest,
    chapterIndex,
    chapterCode: chapterCodes[chapterIndex],
    accuracyPercent,
    earnedStars,
    xpEarned,
    totalWordsLearned,
    newWordsLearned: 8,
    chapterWordsMastered,
    totalChapterWords: 40,
    unlockedNextChapter: isFinalChapterTest,
    nextChapterIndex:
      isFinalChapterTest && chapterIndex < 2 ? chapterIndex + 1 : null,
    nextChapterCode: nextCodes[chapterIndex],
    nextChapterTitle: nextTitles[chapterIndex],
  };
}

/**
 * Checks whether a CEFR stage (0 = A1, 1 = A2, 2 = B1) is unlocked based on total stars earned
 * OR passing the previous chapter's Final Chapter Test.
 */
export function isCefrStageUnlocked(
  stageIndex: number,
  totalStars: number,
  passedChapterTests: number[] = []
): { unlocked: boolean; requiredStars: number } {
  if (stageIndex <= 0) {
    return { unlocked: true, requiredStars: 0 };
  }
  if (stageIndex === 1) {
    const passedA1Boss = passedChapterTests.includes(4);
    return {
      unlocked: passedA1Boss || totalStars >= STARS_REQUIRED_FOR_A2_STAGE,
      requiredStars: STARS_REQUIRED_FOR_A2_STAGE,
    };
  }
  const passedA2Boss = passedChapterTests.includes(9);
  return {
    unlocked: passedA2Boss || totalStars >= STARS_REQUIRED_FOR_B1_STAGE,
    requiredStars: STARS_REQUIRED_FOR_B1_STAGE,
  };
}

/**
 * Calculates total French words learned from completed lessons (8 core words per lesson)
 * plus any extra revised word IDs from the A1-B1 Word List.
 */
export function calculateWordsLearnedCount(
  completedLevelIndex: number,
  revisedWordIds: string[] = []
): number {
  const baseWordsFromLessons = Math.max(0, completedLevelIndex) * 8;
  const bonusRevised = revisedWordIds.length;
  return Math.min(120, baseWordsFromLessons + bonusRevised);
}

export interface CefrTierMastery {
  tier: 'A1' | 'A2' | 'B1';
  learnedCount: number;
  totalCount: number;
  percent: number;
}

/**
 * Computes mastery breakdown across CEFR A1 (Lessons 1-5 = 40 words),
 * CEFR A2 (Lessons 6-10 = 40 words), and CEFR B1 (Lessons 11-15 = 40 words).
 */
export function calculateCefrTierMastery(
  completedLevelIndex: number,
  revisedWordIds: string[] = []
): CefrTierMastery[] {
  const safeLevel = Math.max(0, Math.floor(completedLevelIndex));
  const tiers: Array<{ tier: 'A1' | 'A2' | 'B1'; prefix: string; startLesson: number }> = [
    { tier: 'A1', prefix: 'a1-', startLesson: 0 },
    { tier: 'A2', prefix: 'a2-', startLesson: 5 },
    { tier: 'B1', prefix: 'b1-', startLesson: 10 },
  ];

  return tiers.map(({ tier, prefix, startLesson }) => {
    const completedLessonsInTier = Math.max(
      0,
      Math.min(5, safeLevel - startLesson)
    );
    const fromLessons = completedLessonsInTier * 8;
    const extraRevised = revisedWordIds.filter((id) =>
      id.toLowerCase().startsWith(prefix)
    ).length;
    const learnedCount = Math.min(40, fromLessons + extraRevised);
    const totalCount = 40;
    const percent = Math.round((learnedCount / totalCount) * 100);
    return { tier, learnedCount, totalCount, percent };
  });
}

/**
 * Deterministically builds 4 multiple-choice English options (including the correct answer)
 * for the Interactive Vocabulary Revision Quiz inside WordListModal.
 */
export function buildRevisionQuizChoices(
  correctEnglish: string,
  candidatePool: string[],
  seedIndex: number
): { options: string[]; correctIndex: number } {
  const distractors = candidatePool.filter(
    (item) => item.trim().toLowerCase() !== correctEnglish.trim().toLowerCase()
  );
  const safePool =
    distractors.length >= 3
      ? distractors
      : ['Hello / Good morning', 'Thank you very much', 'Where is the train station?'];

  const d1 = safePool[(seedIndex * 3 + 1) % safePool.length];
  let d2 = safePool[(seedIndex * 5 + 2) % safePool.length];
  if (d2 === d1) {
    d2 = safePool[(seedIndex * 5 + 3) % safePool.length];
  }
  let d3 = safePool[(seedIndex * 7 + 4) % safePool.length];
  if (d3 === d1 || d3 === d2) {
    d3 = safePool[(seedIndex * 7 + 5) % safePool.length];
  }

  const correctIndex = Math.abs(seedIndex) % 4;
  const options = [d1, d2, d3];
  options.splice(correctIndex, 0, correctEnglish);

  return { options, correctIndex };
}

// ============================================================================
// DAILY STREAK BONUS & STREAK FREEZE SHOP ENGINE
// ============================================================================

export const STREAK_FREEZE_COST_XP = 200;
export const MAX_STREAK_FREEZES = 3;
export const STREAK_GOAL_DAYS = 10;

export interface DailyStreakRewardSpec {
  streakDays: number;
  bonusXp: number;
  tierTitle: string;
  isMilestone: boolean;
  flameColor: string;
}

export interface StreakDayMilestone {
  day: number;
  bonusXp: number;
  isMilestone: boolean;
  status: 'claimed' | 'current' | 'upcoming';
}

export interface StreakCheckInResult {
  status: 'streak_extended' | 'freeze_consumed' | 'streak_reset' | 'already_claimed';
  previousStreak: number;
  nextStreak: number;
  bonusXp: number;
  nextXp: number;
  freezesRemaining: number;
  freezeUsed: boolean;
  claimDate: string;
  rewardSpec: DailyStreakRewardSpec;
}

export interface StreakFreezePurchaseResult {
  success: boolean;
  nextXp: number;
  nextFreezes: number;
  costXp: number;
  message: string;
}

/**
 * Computes the bonus XP and 3D flame tier metadata for a given consecutive streak day count.
 * Base bonus starts at 30 XP on Day 1 and scales up by +15 XP per consecutive day,
 * with extra milestone boosts on Day 5 (+100 XP) and Day 10+ (+180 XP).
 */
export function calculateDailyStreakBonus(streakDays: number): DailyStreakRewardSpec {
  const safeDay = Math.max(1, Math.floor(streakDays));
  const isMilestone = safeDay % 5 === 0;
  const baseXp = 30 + Math.min(9, safeDay - 1) * 15;
  const milestoneExtra = safeDay >= 10 ? 45 : isMilestone ? 25 : 0;
  const bonusXp = baseXp + milestoneExtra;

  if (safeDay >= 10) {
    return {
      streakDays: safeDay,
      bonusXp,
      tierTitle: 'ROYAL INFERNO LEGEND',
      isMilestone: true,
      flameColor: '#00E5FF',
    };
  }
  if (safeDay >= 5) {
    return {
      streakDays: safeDay,
      bonusXp,
      tierTitle: 'BLAZING STREAK CHAMPION',
      isMilestone,
      flameColor: '#FFD54F',
    };
  }
  return {
    streakDays: safeDay,
    bonusXp,
    tierTitle: 'DAILY FLAME IGNITED',
    isMilestone,
    flameColor: '#FF9800',
  };
}

/**
 * Generates the 7-step visual milestone track leading up to the player's target streak goal.
 */
export function buildStreakMilestoneTrack(
  currentStreakDays: number,
  claimedToday: boolean
): StreakDayMilestone[] {
  const safeStreak = Math.max(1, Math.floor(currentStreakDays));
  const startDay = safeStreak > 7 ? safeStreak - 6 : 1;
  const track: StreakDayMilestone[] = [];

  for (let i = 0; i < 7; i++) {
    const dayNum = startDay + i;
    const spec = calculateDailyStreakBonus(dayNum);
    let status: 'claimed' | 'current' | 'upcoming' = 'upcoming';
    if (dayNum < safeStreak) {
      status = 'claimed';
    } else if (dayNum === safeStreak) {
      status = claimedToday ? 'claimed' : 'current';
    }
    track.push({
      day: dayNum,
      bonusXp: spec.bonusXp,
      isMilestone: spec.isMilestone,
      status,
    });
  }

  return track;
}

/**
 * Calculates calendar day difference between two YYYY-MM-DD date strings.
 */
export function calculateDayDifference(
  lastDateIso: string | null,
  currentDateIso: string
): number | null {
  if (!lastDateIso) return null;
  const prevParts = lastDateIso.split('-').map(Number);
  const currParts = currentDateIso.split('-').map(Number);
  if (prevParts.length !== 3 || currParts.length !== 3) return null;

  const prevUtc = Date.UTC(prevParts[0], prevParts[1] - 1, prevParts[2]);
  const currUtc = Date.UTC(currParts[0], currParts[1] - 1, currParts[2]);
  if (!Number.isFinite(prevUtc) || !Number.isFinite(currUtc)) return null;

  return Math.round((currUtc - prevUtc) / (1000 * 60 * 60 * 24));
}

/**
 * Evaluates a daily streak check-in when the player opens the app or claims their daily streak bonus.
 * Supports:
 * - Consecutive day (diff === 1 or first claim): increments streak & grants bonus XP
 * - Missed 1+ days with a Streak Freeze equipped: consumes 1 Streak Freeze, protects & advances streak
 * - Missed 1+ days with 0 Streak Freezes: resets streak to 1 and grants Day 1 bonus XP
 */
export function evaluateDailyStreakCheckIn(params: {
  currentStreak: number;
  currentXp: number;
  streakFreezes: number;
  lastClaimDate: string | null;
  todayDate: string;
  forceAdvanceDays?: number;
}): StreakCheckInResult {
  const {
    currentStreak,
    currentXp,
    streakFreezes,
    lastClaimDate,
    todayDate,
    forceAdvanceDays,
  } = params;

  const safeStreak = Math.max(1, Math.floor(currentStreak));
  const safeFreezes = Math.max(0, Math.floor(streakFreezes));
  const rawDiff =
    typeof forceAdvanceDays === 'number'
      ? forceAdvanceDays
      : calculateDayDifference(lastClaimDate, todayDate);

  // Already claimed today
  if (rawDiff === 0) {
    const rewardSpec = calculateDailyStreakBonus(safeStreak);
    return {
      status: 'already_claimed',
      previousStreak: safeStreak,
      nextStreak: safeStreak,
      bonusXp: 0,
      nextXp: currentXp,
      freezesRemaining: safeFreezes,
      freezeUsed: false,
      claimDate: todayDate,
      rewardSpec,
    };
  }

  // First-time claim or consecutive next day (rawDiff === null or rawDiff === 1)
  if (rawDiff === null || rawDiff === 1) {
    const nextStreak = rawDiff === null ? safeStreak + 1 : safeStreak + 1;
    const rewardSpec = calculateDailyStreakBonus(nextStreak);
    return {
      status: 'streak_extended',
      previousStreak: safeStreak,
      nextStreak,
      bonusXp: rewardSpec.bonusXp,
      nextXp: currentXp + rewardSpec.bonusXp,
      freezesRemaining: safeFreezes,
      freezeUsed: false,
      claimDate: todayDate,
      rewardSpec,
    };
  }

  // Missed day(s) (rawDiff > 1) — check if Streak Freeze protects the streak
  if (safeFreezes > 0) {
    const nextStreak = safeStreak + 1;
    const rewardSpec = calculateDailyStreakBonus(nextStreak);
    return {
      status: 'freeze_consumed',
      previousStreak: safeStreak,
      nextStreak,
      bonusXp: rewardSpec.bonusXp,
      nextXp: currentXp + rewardSpec.bonusXp,
      freezesRemaining: safeFreezes - 1,
      freezeUsed: true,
      claimDate: todayDate,
      rewardSpec,
    };
  }

  // Missed day(s) without a Streak Freeze — streak resets to 1
  const resetStreak = 1;
  const rewardSpec = calculateDailyStreakBonus(resetStreak);
  return {
    status: 'streak_reset',
    previousStreak: safeStreak,
    nextStreak: resetStreak,
    bonusXp: rewardSpec.bonusXp,
    nextXp: currentXp + rewardSpec.bonusXp,
    freezesRemaining: 0,
    freezeUsed: false,
    claimDate: todayDate,
    rewardSpec,
  };
}

/**
 * Evaluates purchasing a Streak Freeze utility in the shop using player XP.
 */
export function purchaseStreakFreeze(
  currentXp: number,
  currentFreezes: number,
  costXp: number = STREAK_FREEZE_COST_XP,
  maxFreezes: number = MAX_STREAK_FREEZES
): StreakFreezePurchaseResult {
  const safeFreezes = Math.max(0, Math.floor(currentFreezes));
  if (safeFreezes >= maxFreezes) {
    return {
      success: false,
      nextXp: currentXp,
      nextFreezes: safeFreezes,
      costXp: 0,
      message: `Maximum Streak Freezes (${maxFreezes}/${maxFreezes}) already equipped!`,
    };
  }
  if (currentXp < costXp) {
    return {
      success: false,
      nextXp: currentXp,
      nextFreezes: safeFreezes,
      costXp,
      message: `Need ${costXp} XP to equip a Streak Freeze.`,
    };
  }

  const nextFreezes = safeFreezes + 1;
  return {
    success: true,
    nextXp: currentXp - costXp,
    nextFreezes,
    costXp,
    message: `Streak Freeze Equipped! (${nextFreezes}/${maxFreezes} Active)`,
  };
}

