import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNodeHorizontalOffset,
  getNodeStatus,
  evaluateAnswer,
  evaluateFillBlank,
  evaluateWordAssembly,
  calculateProgressRatio,
  getPlayerNormalLevel,
  getHighestUnlockedCefr,
  pickRandomBotOpponent,
  calculateDuelRoundPoints,
  getArenaLeague,
  applyLessonCompletion,
  applyDuelResult,
  calculateLavaSpeed,
  stepLavaAltitude,
  calculateLavaSpeedBonus,
  validateLavaAnswer,
  computeLavaRaceRank,
  calculateRunnerDoorSpeed,
  evaluateRunnerDoorImpact,
  calculateLessonStars,
  isChapterTestNode,
  calculateTotalStars,
  calculateChapterStars,
  isCefrStageUnlocked,
  calculateWordsLearnedCount,
  calculateCefrTierMastery,
  buildRevisionQuizChoices,
  evaluateChapterTestUnlock,
  buildChapterTestSummary,
  calculateDailyStreakBonus,
  buildStreakMilestoneTrack,
  evaluateDailyStreakCheckIn,
  purchaseStreakFreeze,
  STREAK_FREEZE_COST_XP,
  MAX_STREAK_FREEZES,
  CEFR_GATES,
  type PlayerProgress,
} from './gameLogic.ts';

test('calculateNodeHorizontalOffset follows sin(index) * 100 formula', () => {
  assert.equal(calculateNodeHorizontalOffset(0), 0);
  assert.equal(calculateNodeHorizontalOffset(1), Math.round(Math.sin(1) * 100 * 100) / 100);
  assert.equal(calculateNodeHorizontalOffset(2), Math.round(Math.sin(2) * 100 * 100) / 100);
});

test('getNodeStatus classifies completed, active, and locked nodes accurately', () => {
  assert.equal(getNodeStatus(0, 2), 'completed');
  assert.equal(getNodeStatus(1, 2), 'completed');
  assert.equal(getNodeStatus(2, 2), 'active');
  assert.equal(getNodeStatus(3, 2), 'locked');
});

test('evaluateAnswer, evaluateFillBlank, evaluateWordAssembly and calculateProgressRatio work accurately', () => {
  assert.equal(evaluateAnswer(null, 1), 'idle');
  assert.equal(evaluateAnswer(1, 1), 'correct');
  assert.equal(evaluateAnswer(0, 1), 'incorrect');
  assert.equal(calculateProgressRatio(2, 4), 0.5);

  assert.equal(evaluateFillBlank(null, 'croissant'), 'idle');
  assert.equal(evaluateFillBlank('croissant', 'croissant'), 'correct');
  assert.equal(evaluateFillBlank('train', 'croissant'), 'incorrect');

  assert.equal(evaluateWordAssembly([], ['Bonjour', 'le', 'monde']), 'idle');
  assert.equal(
    evaluateWordAssembly(['Bonjour', 'le', 'monde'], ['Bonjour', 'le', 'monde']),
    'correct'
  );
  assert.equal(
    evaluateWordAssembly(['le', 'Bonjour', 'monde'], ['Bonjour', 'le', 'monde']),
    'incorrect'
  );
});

test('getPlayerNormalLevel computes normal RPG level and XP progress', () => {
  const lv1 = getPlayerNormalLevel(45);
  assert.equal(lv1.level, 1);
  assert.equal(lv1.currentLevelXp, 45);
  assert.equal(lv1.progressPercent, 45);

  const lv4 = getPlayerNormalLevel(340);
  assert.equal(lv4.level, 4);
  assert.equal(lv4.currentLevelXp, 40);
  assert.equal(lv4.progressPercent, 40);
});

test('getArenaLeague classifies Clash Royale-style leagues accurately', () => {
  assert.equal(getArenaLeague(150).id, 'bronze');
  assert.equal(getArenaLeague(150).name, 'Goblin Bronze Arena');
  assert.equal(getArenaLeague(309).id, 'silver');
  assert.equal(getArenaLeague(309).name, 'Spell Valley Silver');
  assert.equal(getArenaLeague(650).id, 'gold');
  assert.equal(getArenaLeague(650).name, 'Master Gold League');
});

test('CEFR_GATES and getHighestUnlockedCefr mark A1, A2, and B1 milestones', () => {
  assert.equal(CEFR_GATES.length, 3);
  assert.equal(CEFR_GATES[0].code, 'A1');
  assert.equal(CEFR_GATES[1].code, 'A2');
  assert.equal(CEFR_GATES[2].code, 'B1');
  assert.equal(getHighestUnlockedCefr(2), 'A0');
  assert.equal(getHighestUnlockedCefr(5), 'A1');
  assert.equal(getHighestUnlockedCefr(10), 'A2');
  assert.equal(getHighestUnlockedCefr(15), 'B1');
});

test('pickRandomBotOpponent selects a valid bot opponent scaled to player trophies', () => {
  const botA = pickRandomBotOpponent(309, 0.1);
  const botB = pickRandomBotOpponent(309, 0.75);
  assert.ok(botA.name.length > 0);
  assert.ok(botB.name.length > 0);
  assert.notEqual(botA.id, botB.id);
  assert.ok(Math.abs(botA.trophies - 309) <= 20);
});

test('calculateDuelRoundPoints, applyLessonCompletion, and applyDuelResult update player progress', () => {
  assert.equal(calculateDuelRoundPoints(true, 2, 25), 175);

  const initial: PlayerProgress = {
    completedLevelIndex: 2,
    xp: 1425,
    trophies: 309,
    duelsWon: 12,
    streakDays: 1,
    bestCombo: 5,
  };

  const afterLesson = applyLessonCompletion(initial, 2, 50);
  assert.equal(afterLesson.completedLevelIndex, 3);
  assert.equal(afterLesson.xp, 1475);
  assert.equal(afterLesson.streakDays, 2);
  assert.equal(afterLesson.trophies, 309);

  const afterDuelWin = applyDuelResult(afterLesson, true, 30, 40);
  assert.equal(afterDuelWin.trophies, 339);
  assert.equal(afterDuelWin.duelsWon, 13);
  assert.equal(afterDuelWin.xp, 1515);

  const afterDuelLoss = applyDuelResult(afterDuelWin, false, -15, 15);
  assert.equal(afterDuelLoss.trophies, 324);
  assert.equal(afterDuelLoss.duelsWon, 13);
});

test('Floor is Lava physics, speed bonuses, answer validation, and multiplayer race rank work accurately', () => {
  assert.equal(calculateLavaSpeed(0), 1.8);
  assert.equal(calculateLavaSpeed(4), 1.8);
  assert.equal(calculateLavaSpeed(5), 1.95);
  assert.equal(calculateLavaSpeed(10), 2.1);

  assert.equal(stepLavaAltitude(0, 0, 1.0), 1.8);

  const blazing = calculateLavaSpeedBonus(1.4);
  assert.equal(blazing.tier, 'blazing');
  assert.equal(blazing.heightGain, 12.0);
  assert.equal(blazing.combatText, '⚡ SPEED BONUS! +12m');

  const great = calculateLavaSpeedBonus(3.2);
  assert.equal(great.tier, 'great');
  assert.equal(great.heightGain, 8.0);
  assert.equal(great.combatText, '🔥 GREAT! +8m');

  const phew = calculateLavaSpeedBonus(5.8);
  assert.equal(phew.tier, 'phew');
  assert.equal(phew.heightGain, 4.5);
  assert.equal(phew.combatText, '😅 PHEW! +4.5m');

  assert.equal(validateLavaAnswer('  Le chat boit du lait! ', ['Le chat boit du lait']), true);
  assert.equal(validateLavaAnswer('un cafe', ['un café']), true);
  assert.equal(validateLavaAnswer('wrong answer', ['un café']), false);

  assert.equal(computeLavaRaceRank(35, [20, 28, 19]), 1);
  assert.equal(computeLavaRaceRank(25, [20, 28, 19]), 2);
  assert.equal(computeLavaRaceRank(15, [20, 28, 19]), 4);
});

test('Door Dash Runner speed and door impact evaluation work accurately', () => {
  assert.equal(calculateRunnerDoorSpeed(0), 0.28);
  assert.equal(calculateRunnerDoorSpeed(3), 0.315);

  const rightHit = evaluateRunnerDoorImpact(1, 1, 2, 3);
  assert.equal(rightHit.isCorrect, true);
  assert.equal(rightHit.nextStreak, 3);
  assert.equal(rightHit.scoreDelta, 175);
  assert.equal(rightHit.nextLives, 3);
  assert.equal(rightHit.isGameOver, false);

  const wrongHit = evaluateRunnerDoorImpact(0, 2, 3, 1);
  assert.equal(wrongHit.isCorrect, false);
  assert.equal(wrongHit.nextStreak, 0);
  assert.equal(wrongHit.nextLives, 0);
  assert.equal(wrongHit.isGameOver, true);
});

test('Star-gated chapter progression, End-of-Chapter Tests, and Words Learned counter work accurately', () => {
  assert.equal(calculateLessonStars(95), 3);
  assert.equal(calculateLessonStars(75), 2);
  assert.equal(calculateLessonStars(50), 1);

  assert.equal(isChapterTestNode(4), true);
  assert.equal(isChapterTestNode(9), true);
  assert.equal(isChapterTestNode(14), true);
  assert.equal(isChapterTestNode(2), false);

  const starsMap = { 0: 3, 1: 3, 2: 2, 3: 3 };
  assert.equal(calculateTotalStars(starsMap), 11);
  assert.equal(calculateChapterStars(starsMap, 0), 11);

  assert.equal(isCefrStageUnlocked(0, 6).unlocked, true);
  assert.equal(isCefrStageUnlocked(1, 6).unlocked, false);
  assert.equal(isCefrStageUnlocked(1, 11).unlocked, true);
  assert.equal(isCefrStageUnlocked(2, 19).unlocked, false);
  assert.equal(isCefrStageUnlocked(2, 20).unlocked, true);

  assert.equal(calculateWordsLearnedCount(2, ['a1-1-1', 'a1-1-2']), 18);

  const tierMastery = calculateCefrTierMastery(2, ['a1-1-1', 'a2-6-1', 'b1-11-1']);
  assert.equal(tierMastery.length, 3);
  assert.equal(tierMastery[0].tier, 'A1');
  assert.equal(tierMastery[0].learnedCount, 17);
  assert.equal(tierMastery[1].tier, 'A2');
  assert.equal(tierMastery[1].learnedCount, 1);
  assert.equal(tierMastery[2].tier, 'B1');
  assert.equal(tierMastery[2].learnedCount, 1);

  const quiz = buildRevisionQuizChoices(
    'Hello / Good morning',
    ['Hello / Good morning', 'Good evening', 'Thank you very much', 'Please (formal)', 'Train station'],
    2
  );
  assert.equal(quiz.options.length, 4);
  assert.equal(quiz.options[quiz.correctIndex], 'Hello / Good morning');
});

test('Daily Streak Bonus calculation, consecutive check-in, and Streak Freeze shop work accurately', () => {
  const day1 = calculateDailyStreakBonus(1);
  assert.equal(day1.bonusXp, 30);
  assert.equal(day1.isMilestone, false);

  const day5 = calculateDailyStreakBonus(5);
  assert.equal(day5.bonusXp, 115); // 30 + 4*15 + 25 milestone
  assert.equal(day5.isMilestone, true);

  const day10 = calculateDailyStreakBonus(10);
  assert.equal(day10.bonusXp, 210); // 30 + 9*15 + 45 milestone
  assert.equal(day10.isMilestone, true);

  const track = buildStreakMilestoneTrack(3, false);
  assert.equal(track.length, 7);
  assert.equal(track[0].status, 'claimed');
  assert.equal(track[1].status, 'claimed');
  assert.equal(track[2].status, 'current');
  assert.equal(track[3].status, 'upcoming');

  // Consecutive day check-in increments streak and grants bonus XP
  const consecutive = evaluateDailyStreakCheckIn({
    currentStreak: 2,
    currentXp: 1425,
    streakFreezes: 1,
    lastClaimDate: '2026-10-19',
    todayDate: '2026-10-20',
  });
  assert.equal(consecutive.status, 'streak_extended');
  assert.equal(consecutive.nextStreak, 3);
  assert.equal(consecutive.bonusXp, 60);
  assert.equal(consecutive.nextXp, 1485);
  assert.equal(consecutive.freezeUsed, false);

  // Missed day with Streak Freeze equipped protects streak and consumes 1 freeze
  const freezeProtected = evaluateDailyStreakCheckIn({
    currentStreak: 4,
    currentXp: 1500,
    streakFreezes: 2,
    lastClaimDate: '2026-10-17',
    todayDate: '2026-10-20',
  });
  assert.equal(freezeProtected.status, 'freeze_consumed');
  assert.equal(freezeProtected.nextStreak, 5);
  assert.equal(freezeProtected.freezesRemaining, 1);
  assert.equal(freezeProtected.freezeUsed, true);

  // Missed day with 0 Streak Freezes resets streak to 1
  const streakReset = evaluateDailyStreakCheckIn({
    currentStreak: 6,
    currentXp: 1500,
    streakFreezes: 0,
    lastClaimDate: '2026-10-17',
    todayDate: '2026-10-20',
  });
  assert.equal(streakReset.status, 'streak_reset');
  assert.equal(streakReset.nextStreak, 1);

  // Shop purchase of Streak Freeze
  const bought = purchaseStreakFreeze(1425, 1, STREAK_FREEZE_COST_XP, MAX_STREAK_FREEZES);
  assert.equal(bought.success, true);
  assert.equal(bought.nextXp, 1225);
  assert.equal(bought.nextFreezes, 2);

  const maxedOut = purchaseStreakFreeze(1425, 3, STREAK_FREEZE_COST_XP, MAX_STREAK_FREEZES);
  assert.equal(maxedOut.success, false);
  assert.equal(maxedOut.nextFreezes, 3);
});

test('Final Chapter Test star threshold unlock and Summary Results calculation work accurately', () => {
  // 1. Only 2 of 4 lessons completed (6 stars) -> locked because not all 4 lessons completed and < 8 stars
  const partialChapter = evaluateChapterTestUnlock({ 0: 3, 1: 3 }, 0);
  assert.equal(partialChapter.isUnlocked, false);
  assert.equal(partialChapter.allLessonsCompleted, false);
  assert.equal(partialChapter.completedLessonsCount, 2);
  assert.equal(partialChapter.earnedLessonStars, 6);
  assert.equal(partialChapter.starsRemaining, 2);

  // 2. All 4 lessons completed, but only 1 star each (4 stars total < 8 threshold) -> still locked!
  const lowStarsAllCompleted = evaluateChapterTestUnlock({ 0: 1, 1: 1, 2: 2, 3: 2 }, 0);
  assert.equal(lowStarsAllCompleted.allLessonsCompleted, true);
  assert.equal(lowStarsAllCompleted.earnedLessonStars, 6);
  assert.equal(lowStarsAllCompleted.meetsStarThreshold, false);
  assert.equal(lowStarsAllCompleted.isUnlocked, false);

  // 3. 3 lessons with 3 stars (9 stars >= 8), but Lesson 4 not completed yet -> locked until all 4 lessons have stars
  const missingLessonFour = evaluateChapterTestUnlock({ 0: 3, 1: 3, 2: 3 }, 0);
  assert.equal(missingLessonFour.allLessonsCompleted, false);
  assert.equal(missingLessonFour.meetsStarThreshold, true);
  assert.equal(missingLessonFour.isUnlocked, false);

  // 4. All 4 lessons completed AND >= 8 stars earned -> Final Chapter Test UNLOCKED!
  const unlockedChapter = evaluateChapterTestUnlock({ 0: 3, 1: 3, 2: 2, 3: 2 }, 0);
  assert.equal(unlockedChapter.allLessonsCompleted, true);
  assert.equal(unlockedChapter.meetsStarThreshold, true);
  assert.equal(unlockedChapter.earnedLessonStars, 10);
  assert.equal(unlockedChapter.isUnlocked, true);
  assert.equal(unlockedChapter.chapterTestNodeIndex, 4);
  assert.equal(unlockedChapter.nextChapterCode, 'A2');

  // 5. Summary results report for Final Chapter Test (nodeIndex = 4)
  const summary = buildChapterTestSummary({
    nodeIndex: 4,
    correctCount: 4,
    totalAttempts: 4,
    completedLevelIndexBefore: 4,
    revisedWordIds: ['a1-1-1', 'a1-1-2', 'a1-1-3', 'a1-1-4'],
  });
  assert.equal(summary.isFinalChapterTest, true);
  assert.equal(summary.accuracyPercent, 100);
  assert.equal(summary.earnedStars, 3);
  assert.equal(summary.totalWordsLearned, 44); // 5 * 8 + 4 revised
  assert.equal(summary.chapterWordsMastered, 40);
  assert.equal(summary.unlockedNextChapter, true);
  assert.equal(summary.nextChapterIndex, 1);
  assert.equal(summary.nextChapterCode, 'A2');
});

test('Expanded 120 CEFR Vocabulary Words, 15 Course Material Study Guides, and 20 Curriculum Levels are complete', async () => {
  const {
    FRENCH_CEFR_VOCAB_LIST,
    FRENCH_COURSE_MATERIALS,
    getLessonVocabulary,
    getLessonCourseMaterial,
    filterCourseMaterials,
  } = await import('../data/cefrWordList.ts');
  const { FRENCH_COURSE } = await import('../data/curriculum.ts');

  assert.equal(FRENCH_CEFR_VOCAB_LIST.length, 120);
  assert.equal(FRENCH_COURSE_MATERIALS.length, 15);

  for (let lessonNum = 1; lessonNum <= 15; lessonNum++) {
    const words = getLessonVocabulary(lessonNum);
    assert.equal(words.length, 8, `Lesson ${lessonNum} should have 8 vocabulary words`);
    const material = getLessonCourseMaterial(lessonNum);
    assert.ok(material, `Lesson ${lessonNum} should have a Course Material study guide`);
    assert.equal(material.keyPatterns.length, 3);
    assert.ok(material.dialogue.length >= 2);
  }

  assert.equal(filterCourseMaterials('A1', '').length, 5);
  assert.equal(filterCourseMaterials('A2', '').length, 5);
  assert.equal(filterCourseMaterials('B1', '').length, 5);
  assert.ok(filterCourseMaterials('ALL', 'subjonctif').length >= 1);

  assert.equal(FRENCH_COURSE.nodes.length, 20);
  for (const node of FRENCH_COURSE.nodes) {
    assert.equal(node.questions.length, 4, `Node ${node.id} should have 4 questions`);
  }
});



