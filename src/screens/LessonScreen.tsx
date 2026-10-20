import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Volume2,
  Check,
  X,
  Sparkles,
  Flame,
  Award,
  Star,
  BookOpen,
  Trophy,
  Unlock,
  Target,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';
import type { PathNodeData } from '../data/curriculum';
import {
  getLessonVocabulary,
  getLessonCourseMaterial,
} from '../data/cefrWordList';
import {
  evaluateAnswer,
  evaluateFillBlank,
  evaluateWordAssembly,
  calculateProgressRatio,
  isChapterTestNode,
  getHighestUnlockedCefr,
  buildChapterTestSummary,
  evaluateChapterTestUnlock,
  STARS_REQUIRED_FOR_CHAPTER_TEST,
  type EvaluationState,
} from '../utils/gameLogic';
import { ProgressBar } from '../widgets/ProgressBar';
import { TactileButton } from '../widgets/TactileButton';
import { soundManager } from '../utils/soundEffects';

interface LessonScreenProps {
  node: PathNodeData;
  speechLang: string;
  trophies: number;
  completedLevelIndex: number;
  nodeStars?: Record<number, number>;
  revisedWordIds?: string[];
  onAnswerEvaluated: (evaluation: EvaluationState, combo: number) => void;
  onCompleteLesson: (nodeIndex: number, xpEarned: number, accuracy: number) => void;
  onExitLesson: () => void;
}

type InteractiveStepMode =
  | 'match_pairs'
  | 'fill_blank'
  | 'word_assembly'
  | 'multiple_choice';

interface MatchPairItem {
  id: string;
  french: string;
  english: string;
}

export const LessonScreen: React.FC<LessonScreenProps> = ({
  node,
  speechLang,
  trophies,
  completedLevelIndex,
  nodeStars = {},
  revisedWordIds = [],
  onAnswerEvaluated,
  onCompleteLesson,
  onExitLesson,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [showRevisionSheet, setShowRevisionSheet] = useState(false);
  const [evaluationState, setEvaluationState] = useState<EvaluationState>('idle');
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [combo, setCombo] = useState(1);
  const [isLessonFinished, setIsLessonFinished] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('summary') === '1') return true;
    }
    return false;
  });
  const [activeHintIndex, setActiveHintIndex] = useState<number | null>(null);

  const isBossExam = isChapterTestNode(node.index);
  const lessonVocab = useMemo(
    () => getLessonVocabulary(node.index + 1),
    [node.index]
  );
  const lessonCourseMaterial = useMemo(
    () => getLessonCourseMaterial(node.index + 1),
    [node.index]
  );

  // Mode 1: Match Pairs state
  const [selectedLeftPairId, setSelectedLeftPairId] = useState<string | null>(null);
  const [selectedRightPairId, setSelectedRightPairId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [mismatchFlashIds, setMismatchFlashIds] = useState<string[]>([]);

  // Mode 2: Fill-in-the-blank state
  const [selectedBlankWord, setSelectedBlankWord] = useState<string | null>(null);

  // Mode 3: Word Assembly state
  const [assembledTileIndices, setAssembledTileIndices] = useState<number[]>([]);

  // Mode 4: Multiple Choice state
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  const stepModes: InteractiveStepMode[] = [
    'match_pairs',
    'fill_blank',
    'word_assembly',
    'multiple_choice',
  ];
  const totalSteps = stepModes.length;
  const currentMode = stepModes[stepIndex] || 'multiple_choice';

  const currentQuestion =
    node.questions[stepIndex % node.questions.length] || node.questions[0];

  // Derived data for Step 0: Match Pairs
  const matchPairsData: MatchPairItem[] = useMemo(() => {
    const hints = currentQuestion.wordHints.slice(0, 4);
    const fallbackPairs: MatchPairItem[] = [
      { id: 'p-1', french: 'Bonjour', english: 'Hello' },
      { id: 'p-2', french: 'Un croissant', english: 'A croissant' },
      { id: 'p-3', french: 'Un café', english: 'A coffee' },
      { id: 'p-4', french: 'S’il vous plaît', english: 'Please' },
    ];
    return hints.map((h, i) => ({
      id: `pair-${i}`,
      french: h.word.replace(/[.,?!]/g, '').trim() || fallbackPairs[i].french,
      english: h.meaning.replace(/[.,?!]/g, '').trim() || fallbackPairs[i].english,
    }));
  }, [currentQuestion]);

  const shuffledRightPairs: MatchPairItem[] = useMemo(() => {
    if (matchPairsData.length < 4) return matchPairsData;
    return [
      matchPairsData[1],
      matchPairsData[3],
      matchPairsData[0],
      matchPairsData[2],
    ];
  }, [matchPairsData]);

  // Derived data for Step 1: Fill-in-the-blank
  const fillBlankData = useMemo(() => {
    const targetHint =
      currentQuestion.wordHints[1] || currentQuestion.wordHints[0];
    const cleanWord = targetHint.word.replace(/[.,?!]/g, '').trim();
    const sentenceParts = currentQuestion.sourceSentence.split(targetHint.word);
    const prefix = sentenceParts[0] ?? 'Bonjour, ';
    const suffix = sentenceParts.slice(1).join(targetHint.word) ?? '';
    const distractors = ['baguette', 'gare', 'bibliothèque', 'château'].filter(
      (d) => d.toLowerCase() !== cleanWord.toLowerCase()
    );
    const options = [cleanWord, distractors[0], distractors[1], distractors[2]];
    return {
      prefix,
      suffix,
      correctWord: cleanWord,
      englishTranslation:
        currentQuestion.options[currentQuestion.correctIndex].text,
      options,
    };
  }, [currentQuestion]);

  // Derived data for Step 2: Word Assembly
  const wordAssemblyData = useMemo(() => {
    const targetWords = currentQuestion.wordHints.map((h) =>
      h.word.replace(/[.,?!]/g, '').trim()
    );
    const distractors = ['jamais', 'train'];
    const bankWords = [...targetWords, ...distractors];
    return {
      englishPrompt:
        currentQuestion.options[currentQuestion.correctIndex].text,
      targetWords,
      bankWords,
    };
  }, [currentQuestion]);

  const completedSteps =
    isLessonFinished
      ? totalSteps
      : evaluationState === 'correct'
      ? stepIndex + 1
      : stepIndex;

  const progressRatio = calculateProgressRatio(completedSteps, totalSteps);

  const handleSelectLeftPair = (id: string) => {
    if (evaluationState !== 'idle' || matchedPairIds.includes(id)) return;
    soundManager.playTap();
    setSelectedLeftPairId(id);

    if (selectedRightPairId) {
      if (selectedRightPairId === id) {
        soundManager.playCorrect();
        const nextMatched = [...matchedPairIds, id];
        setMatchedPairIds(nextMatched);
        setSelectedLeftPairId(null);
        setSelectedRightPairId(null);
        if (nextMatched.length === matchPairsData.length) {
          setEvaluationState('correct');
          setTotalAttempts((p) => p + 1);
          setCorrectCount((p) => p + 1);
          setCombo((c) => c + 1);
          onAnswerEvaluated('correct', combo + 1);
        }
      } else {
        soundManager.playIncorrect();
        setMismatchFlashIds([id, selectedRightPairId]);
        setTimeout(() => {
          setMismatchFlashIds([]);
          setSelectedLeftPairId(null);
          setSelectedRightPairId(null);
        }, 450);
      }
    }
  };

  const handleSelectRightPair = (id: string) => {
    if (evaluationState !== 'idle' || matchedPairIds.includes(id)) return;
    soundManager.playTap();
    setSelectedRightPairId(id);

    if (selectedLeftPairId) {
      if (selectedLeftPairId === id) {
        soundManager.playCorrect();
        const nextMatched = [...matchedPairIds, id];
        setMatchedPairIds(nextMatched);
        setSelectedLeftPairId(null);
        setSelectedRightPairId(null);
        if (nextMatched.length === matchPairsData.length) {
          setEvaluationState('correct');
          setTotalAttempts((p) => p + 1);
          setCorrectCount((p) => p + 1);
          setCombo((c) => c + 1);
          onAnswerEvaluated('correct', combo + 1);
        }
      } else {
        soundManager.playIncorrect();
        setMismatchFlashIds([selectedLeftPairId, id]);
        setTimeout(() => {
          setMismatchFlashIds([]);
          setSelectedLeftPairId(null);
          setSelectedRightPairId(null);
        }, 450);
      }
    }
  };

  const canCheckCurrentStep = useMemo(() => {
    if (evaluationState !== 'idle') return false;
    if (currentMode === 'match_pairs') {
      return matchedPairIds.length === matchPairsData.length;
    }
    if (currentMode === 'fill_blank') {
      return selectedBlankWord !== null;
    }
    if (currentMode === 'word_assembly') {
      return assembledTileIndices.length > 0;
    }
    return selectedCardIndex !== null;
  }, [
    evaluationState,
    currentMode,
    matchedPairIds.length,
    matchPairsData.length,
    selectedBlankWord,
    assembledTileIndices.length,
    selectedCardIndex,
  ]);

  const handleCheckAnswer = useCallback(() => {
    if (evaluationState !== 'idle') return;

    let result: EvaluationState = 'idle';
    if (currentMode === 'match_pairs') {
      if (matchedPairIds.length === matchPairsData.length) {
        result = 'correct';
      }
    } else if (currentMode === 'fill_blank') {
      result = evaluateFillBlank(selectedBlankWord, fillBlankData.correctWord);
    } else if (currentMode === 'word_assembly') {
      const assembledWords = assembledTileIndices.map(
        (idx) => wordAssemblyData.bankWords[idx]
      );
      result = evaluateWordAssembly(
        assembledWords,
        wordAssemblyData.targetWords
      );
    } else {
      result = evaluateAnswer(selectedCardIndex, currentQuestion.correctIndex);
    }

    if (result === 'idle') return;
    setEvaluationState(result);
    setTotalAttempts((prev) => prev + 1);

    if (result === 'correct') {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setCorrectCount((prev) => prev + 1);
      soundManager.playCorrect();
      onAnswerEvaluated(result, nextCombo);
    } else {
      setCombo(1);
      soundManager.playIncorrect();
      onAnswerEvaluated(result, 1);
    }
  }, [
    evaluationState,
    currentMode,
    matchedPairIds.length,
    matchPairsData.length,
    selectedBlankWord,
    fillBlankData.correctWord,
    assembledTileIndices,
    wordAssemblyData,
    selectedCardIndex,
    currentQuestion.correctIndex,
    combo,
    onAnswerEvaluated,
  ]);

  const handleContinue = useCallback(() => {
    if (evaluationState === 'idle') return;

    if (stepIndex + 1 < totalSteps) {
      setStepIndex((prev) => prev + 1);
      setEvaluationState('idle');
      setSelectedLeftPairId(null);
      setSelectedRightPairId(null);
      setMatchedPairIds([]);
      setMismatchFlashIds([]);
      setSelectedBlankWord(null);
      setAssembledTileIndices([]);
      setSelectedCardIndex(null);
      setActiveHintIndex(null);
    } else {
      soundManager.playCelebration();
      setIsLessonFinished(true);
    }
  }, [evaluationState, stepIndex, totalSteps]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isLessonFinished) {
        if (e.key === 'Enter') {
          const accuracy =
            totalAttempts > 0
              ? Math.round((correctCount / totalAttempts) * 100)
              : 100;
          onCompleteLesson(node.index, 50, accuracy);
        }
        return;
      }

      if (evaluationState !== 'idle' && e.key === 'Enter') {
        e.preventDefault();
        handleContinue();
      } else if (
        evaluationState === 'idle' &&
        e.key === 'Enter' &&
        canCheckCurrentStep
      ) {
        e.preventDefault();
        handleCheckAnswer();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    isLessonFinished,
    evaluationState,
    canCheckCurrentStep,
    handleCheckAnswer,
    handleContinue,
    correctCount,
    totalAttempts,
    node.index,
    onCompleteLesson,
  ]);

  if (isLessonFinished) {
    const summary = buildChapterTestSummary({
      nodeIndex: node.index,
      correctCount,
      totalAttempts,
      completedLevelIndexBefore: completedLevelIndex,
      revisedWordIds,
    });
    const nextLevelIndex = Math.max(completedLevelIndex, node.index + 1);
    const unlockedCefr = getHighestUnlockedCefr(nextLevelIndex);

    const updatedStarsMap = {
      ...nodeStars,
      [node.index]: Math.max(nodeStars[node.index] || 0, summary.earnedStars),
    };
    const updatedChapterUnlock = evaluateChapterTestUnlock(
      updatedStarsMap,
      summary.chapterIndex,
      STARS_REQUIRED_FOR_CHAPTER_TEST
    );

    return (
      <div
        data-testid="lesson-summary-screen"
        className="min-h-screen bg-[#FFFFFF] flex flex-col justify-between relative overflow-x-hidden"
      >
        {/* Floating Particle Sparks on Victory Screen */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {[
            { left: '12%', top: '16%', size: 12 },
            { left: '85%', top: '15%', size: 14 },
            { left: '18%', top: '68%', size: 10 },
            { left: '82%', top: '64%', size: 12 },
            { left: '48%', top: '11%', size: 9 },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                backgroundColor: i % 2 === 0 ? '#FFC800' : '#58CC02',
              }}
              className="absolute rounded-full animate-node-pulse opacity-80"
            />
          ))}
        </div>

        <ProgressBar
          progress={1}
          combo={combo}
          trophies={trophies}
          onClose={onExitLesson}
        />

        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-4 max-w-xl mx-auto w-full text-center animate-pop-scale relative z-10">
          {/* 3-Star Rating Display */}
          <div
            data-testid="summary-stars-earned"
            className="flex items-center justify-center gap-3 mb-2.5"
          >
            {[1, 2, 3].map((starIdx) => (
              <div
                key={starIdx}
                style={{
                  backgroundColor:
                    starIdx <= summary.earnedStars ? '#FFF8E1' : '#F1F5F9',
                  borderColor:
                    starIdx <= summary.earnedStars ? '#FFC800' : '#CBD5E1',
                  boxShadow:
                    starIdx <= summary.earnedStars
                      ? '0 5px 0 #D97706'
                      : '0 4px 0 #CBD5E1',
                }}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${
                  starIdx === 1
                    ? 'animate-star-drop-1'
                    : starIdx === 2
                    ? 'animate-star-drop-2'
                    : 'animate-star-drop-3'
                }`}
              >
                <Star
                  className={`w-8 h-8 ${
                    starIdx <= summary.earnedStars
                      ? 'text-[#FFC800] fill-[#FFC800]'
                      : 'text-[#CBD5E1]'
                  }`}
                />
              </div>
            ))}
          </div>

          {summary.isFinalChapterTest && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E1] border-2 border-[#FFC800] text-xs font-black uppercase tracking-wider text-[#B45309] mb-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#D97706]" />
              <span>CEFR {summary.chapterCode} Final Chapter Test Complete</span>
            </div>
          )}

          <h1
            data-testid="summary-heading"
            className="text-2xl sm:text-3xl font-black text-[#14365D] tracking-tight mb-1"
          >
            {summary.isFinalChapterTest
              ? 'Final Chapter Test Passed!'
              : 'Lesson Complete!'}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#64748B] mb-4">
            You earned{' '}
            <span className="font-black text-[#D97706]">
              {summary.earnedStars} / 3 Stars
            </span>{' '}
            with{' '}
            <span className="font-black text-[#0284C7]">
              {summary.accuracyPercent}% Accuracy
            </span>{' '}
            &amp; mastered{' '}
            <span className="font-black text-[#58CC02]">
              {summary.totalWordsLearned} Total French Words
            </span>
            !
          </p>

          {/* 4-Card Summary Metrics Grid (Total Words Learned, Accuracy %, XP Earned, Stars/Rank) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-4">
            {/* 1. Total Words Learned */}
            <div
              data-testid="summary-total-words-learned"
              className="rounded-[16px] border-2 border-[#58CC02] bg-[#F1FAEA] p-3 flex flex-col items-center justify-center"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-[#46A302] mb-0.5">
                Words Learned
              </span>
              <div className="flex items-center gap-1 text-lg sm:text-xl font-black text-[#14365D] tabular-nums">
                <BookOpen className="w-4 h-4 text-[#58CC02]" />
                <span data-testid="summary-words-count">
                  {summary.totalWordsLearned}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#58A700]">
                +{summary.newWordsLearned} New ({summary.chapterWordsMastered}/40 {summary.chapterCode})
              </span>
            </div>

            {/* 2. Accuracy Percentage */}
            <div
              data-testid="summary-accuracy-percentage"
              className="rounded-[16px] border-2 border-[#1CB0F6] bg-[#EFF8FF] p-3 flex flex-col items-center justify-center"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0284C7] mb-0.5">
                Accuracy
              </span>
              <div className="flex items-center gap-1 text-lg sm:text-xl font-black text-[#14365D] tabular-nums">
                <Target className="w-4 h-4 text-[#1CB0F6]" />
                <span data-testid="summary-accuracy-value">
                  {summary.accuracyPercent}%
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#0284C7]">
                {summary.earnedStars === 3 ? '3-Star Mastery' : 'Passed'}
              </span>
            </div>

            {/* 3. Total XP & Streak */}
            <div
              data-testid="summary-xp-earned"
              className="rounded-[16px] border-2 border-[#FF9800] bg-[#FFF8E1] p-3 flex flex-col items-center justify-center"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D97706] mb-0.5">
                XP Earned
              </span>
              <div className="flex items-center gap-1 text-lg sm:text-xl font-black text-[#14365D] tabular-nums">
                <Sparkles className="w-4 h-4 text-[#FF9800]" />
                <span>+{summary.xpEarned}</span>
              </div>
              <span className="text-[10px] font-bold text-[#E65100] flex items-center gap-0.5">
                <Flame className="w-3 h-3 fill-[#FF5722] text-[#FF5722]" />
                Streak +1
              </span>
            </div>

            {/* 4. CEFR Rank */}
            <div
              data-testid="summary-cefr-rank"
              className="rounded-[16px] border-2 border-[#AB47BC] bg-[#F3E5F5] p-3 flex flex-col items-center justify-center"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-[#7B1FA2] mb-0.5">
                CEFR Rank
              </span>
              <div className="flex items-center gap-1 text-lg sm:text-xl font-black text-[#14365D] tabular-nums">
                <Award className="w-4 h-4 text-[#8E24AA]" />
                <span>{unlockedCefr}</span>
              </div>
              <span className="text-[10px] font-bold text-[#7B1FA2]">
                {summary.earnedStars}/3 ⭐ Rating
              </span>
            </div>
          </div>

          {/* 3D NEXT CHAPTER UNLOCK ANIMATION SEQUENCE (or Chapter Test Star Gate Unlock) */}
          {summary.isFinalChapterTest ? (
            <div
              data-testid="next-chapter-unlock-animation"
              style={{
                background:
                  'linear-gradient(180deg, #0F294A 0%, #163C6B 60%, #0D2342 100%)',
                borderBottom: '6px solid #061326',
                boxShadow: '0 12px 28px rgba(13, 35, 66, 0.35)',
              }}
              className="w-full rounded-[22px] border-3 border-[#FFD54F] p-4 text-white relative overflow-hidden mb-2"
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFD54F]/20 border border-[#FFD54F] text-[10px] font-black uppercase tracking-widest text-[#FFD54F] mb-3">
                <Sparkles className="w-3 h-3" />
                <span>Next Chapter Unlock Sequence</span>
              </div>

              {/* 3D Animated Bridge: Completed Chapter -> Golden Energy Beam -> Unlocked Next Chapter Portal */}
              <div className="flex items-center justify-between gap-2 px-2 sm:px-6 mb-3">
                {/* Left Node: Completed Chapter */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    style={{
                      background:
                        'linear-gradient(180deg, #76E81E 0%, #46B800 100%)',
                      borderBottom: '4px solid #2E7D00',
                    }}
                    className="w-13 h-13 rounded-2xl border-2 border-[#B2FF59] flex flex-col items-center justify-center shadow-lg"
                  >
                    <Check className="w-5 h-5 text-white stroke-[3]" />
                    <span className="text-[10px] font-black leading-none mt-0.5">
                      {summary.chapterCode}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-[#B2FF59] uppercase mt-1">
                    Mastered
                  </span>
                </div>

                {/* Center Animated Golden Energy Bridge */}
                <div className="flex-1 flex flex-col items-center px-1">
                  <div className="w-full h-3.5 rounded-full bg-black/50 p-0.5 overflow-hidden border border-white/20">
                    <div
                      style={{
                        background:
                          'linear-gradient(90deg, #58CC02 0%, #FFD54F 50%, #00E5FF 100%)',
                      }}
                      className="h-full rounded-full animate-chapter-bridge-fill"
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FFD54F] mt-1">
                    ⚡ Gate Unlocked ⚡
                  </span>
                </div>

                {/* Right Node: 3D Portal Flip Unlocking Next Chapter */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    data-testid="unlocked-next-chapter-crest"
                    style={{
                      background:
                        'linear-gradient(180deg, #FFD54F 0%, #FF8F00 100%)',
                      borderBottom: '4px solid #C66900',
                      boxShadow: '0 0 22px rgba(255, 213, 79, 0.75)',
                    }}
                    className="w-14 h-14 rounded-2xl border-2 border-[#FFF8E1] flex flex-col items-center justify-center animate-chapter-portal-unlock"
                  >
                    <Unlock className="w-5 h-5 text-[#14365D] stroke-[2.75]" />
                    <span className="text-xs font-black text-[#14365D] leading-none mt-0.5">
                      {summary.nextChapterCode}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-[#FFD54F] uppercase mt-2 animate-chapter-badge-float">
                    🔓 Unlocked!
                  </span>
                </div>
              </div>

              <div
                data-testid="unlocked-next-chapter-title"
                className="text-sm sm:text-base font-black uppercase tracking-wide text-[#FFF59D]"
              >
                {summary.nextChapterTitle} Unlocked!
              </div>
              <p className="text-[11px] font-bold text-[#B3E5FC] mt-0.5">
                Congratulations! You passed the {summary.chapterCode} Final Chapter Test and unlocked the next stage on your path!
              </p>
            </div>
          ) : (
            <div
              data-testid="summary-chapter-gate-progress"
              className="w-full rounded-[18px] border-2 border-[#E2E8F0] bg-[#F8FAFC] p-3.5 text-left mb-2"
            >
              <div className="flex items-center justify-between text-xs font-black text-[#14365D] mb-1.5">
                <span className="flex items-center gap-1.5 uppercase">
                  <Trophy className="w-4 h-4 text-[#D97706]" />
                  <span>
                    {summary.chapterCode} Final Chapter Test Progress
                  </span>
                </span>
                <span className="text-[#D97706] tabular-nums">
                  {updatedChapterUnlock.earnedLessonStars}/{STARS_REQUIRED_FOR_CHAPTER_TEST} ⭐ · {updatedChapterUnlock.completedLessonsCount}/4 Lessons
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#E2E8F0] overflow-hidden p-0.5 mb-1.5">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (updatedChapterUnlock.earnedLessonStars /
                          STARS_REQUIRED_FOR_CHAPTER_TEST) *
                          100
                      )
                    )}%`,
                    background: updatedChapterUnlock.isUnlocked
                      ? 'linear-gradient(90deg, #58CC02 0%, #46A302 100%)'
                      : 'linear-gradient(90deg, #FFC800 0%, #FF8F00 100%)',
                  }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
              <div className="text-[11px] font-bold text-[#475569]">
                {updatedChapterUnlock.isUnlocked
                  ? `🔓 All 4 lessons completed & ${updatedChapterUnlock.earnedLessonStars}⭐ earned — The ${summary.chapterCode} Final Chapter Test is now UNLOCKED!`
                  : `Complete all 4 lessons in ${summary.chapterCode} and earn at least ${STARS_REQUIRED_FOR_CHAPTER_TEST}⭐ to unlock the Final Chapter Test.`}
              </div>
            </div>
          )}
        </main>

        <footer className="w-full border-t-2 border-[#E5E5E5] bg-[#FFFFFF] py-4 px-6 relative z-10">
          <div className="max-w-3xl mx-auto flex justify-end">
            <div className="w-full sm:w-72">
              <TactileButton
                label={
                  summary.isFinalChapterTest
                    ? `UNLOCK ${summary.nextChapterCode} & CONTINUE`
                    : 'CONTINUE'
                }
                variant="primary"
                fullWidth
                testId="lesson-finish-continue"
                onClick={() =>
                  onCompleteLesson(
                    node.index,
                    summary.xpEarned,
                    summary.accuracyPercent
                  )
                }
              />
            </div>
          </div>
        </footer>
      </div>
    );
  }

  const modeBadgeLabel =
    currentMode === 'match_pairs'
      ? 'Interactive Mode 1/4 · Match Pairs'
      : currentMode === 'fill_blank'
      ? 'Interactive Mode 2/4 · Fill in the Blank'
      : currentMode === 'word_assembly'
      ? 'Interactive Mode 3/4 · Word Assembly'
      : 'Interactive Mode 4/4 · Translation Choice';

  const modeHeading =
    currentMode === 'match_pairs'
      ? 'Tap the matching French and English pairs'
      : currentMode === 'fill_blank'
      ? 'Complete the French sentence'
      : currentMode === 'word_assembly'
      ? 'Assemble this sentence in French'
      : currentQuestion.promptInstruction;

  const correctSolutionLabel =
    currentMode === 'fill_blank'
      ? fillBlankData.correctWord
      : currentMode === 'word_assembly'
      ? wordAssemblyData.targetWords.join(' ')
      : currentQuestion.options[currentQuestion.correctIndex].text;

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-between relative overflow-x-hidden">
      <ProgressBar
        progress={progressRatio}
        combo={combo}
        trophies={trophies}
        onClose={onExitLesson}
      />

      <main
        key={`${stepIndex}-${currentMode}`}
        className={`flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-2 pb-32 flex flex-col justify-center animate-card-enter ${
          evaluationState === 'incorrect' ? 'animate-shake-error' : ''
        }`}
      >
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[#58CC02] mb-1">
              Level {node.index + 1} · {node.title} · {modeBadgeLabel}
            </div>
            <h1
              data-testid="lesson-prompt-heading"
              className="text-2xl sm:text-3xl font-black text-[#4B4B4B] tracking-tight"
            >
              {modeHeading}
            </h1>
          </div>

          {(lessonCourseMaterial || lessonVocab.length > 0) && (
            <button
              type="button"
              data-testid="open-lesson-materials-btn"
              onClick={() => {
                soundManager.playTap();
                setShowRevisionSheet((prev) => !prev);
              }}
              style={{
                backgroundColor: showRevisionSheet ? '#FFF8E1' : '#F0F9FF',
                borderColor: showRevisionSheet ? '#FFC800' : '#38BDF8',
                boxShadow: showRevisionSheet
                  ? '0 3px 0 #D97706'
                  : '0 3px 0 #0284C7',
              }}
              className="self-start sm:self-center px-3 py-1.5 rounded-[12px] border-2 text-xs font-black uppercase tracking-wider text-[#0369A1] flex items-center gap-1.5 cursor-pointer active:translate-y-[2px] transition-transform shrink-0"
            >
              <GraduationCap className="w-4 h-4 text-[#0284C7]" />
              <span>
                {showRevisionSheet
                  ? 'Hide Course Guide'
                  : `Course Guide & ${lessonVocab.length} Words`}
              </span>
            </button>
          )}
        </div>

        {/* In-Lesson Expandable Course Material & Study Guide Sheet */}
        {showRevisionSheet && (
          <div
            data-testid="lesson-course-material-drawer"
            className="mb-5 rounded-[20px] border-2 border-[#38BDF8] bg-[#F0F9FF] p-4 shadow-md space-y-3 animate-pop-scale"
          >
            {lessonCourseMaterial && (
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-[#0284C7] text-white text-[10px] font-black uppercase tracking-wider">
                      CEFR {lessonCourseMaterial.cefr} · Lesson{' '}
                      {lessonCourseMaterial.lessonNumber} Study Guide
                    </span>
                    <h2 className="text-base font-black text-[#0C4A6E] mt-1">
                      {lessonCourseMaterial.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowRevisionSheet(false)}
                    className="w-7 h-7 rounded-full bg-white border border-[#BAE6FD] flex items-center justify-center text-[#0369A1] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Grammar Rule */}
                <div className="rounded-[12px] bg-white border border-[#BAE6FD] p-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#0284C7] mb-0.5">
                    📐 Grammar Rule: {lessonCourseMaterial.grammarTopic}
                  </div>
                  <p className="text-xs font-bold text-[#334155] leading-relaxed">
                    {lessonCourseMaterial.grammarExplanation}
                  </p>
                </div>

                {/* Key Sentence Patterns with Audio */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {lessonCourseMaterial.keyPatterns.map((pat, idx) => (
                    <div
                      key={idx}
                      className="rounded-[10px] bg-white border border-[#BAE6FD] p-2.5 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-black text-[#0C4A6E]">
                          {pat.french}
                        </div>
                        <div className="text-[11px] font-bold text-[#0284C7]">
                          {pat.english}
                        </div>
                        <div className="text-[10px] font-semibold text-[#64748B] mt-0.5">
                          {pat.note}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          soundManager.speak(pat.french, speechLang)
                        }
                        className="w-7 h-7 rounded-lg bg-[#0284C7] text-white flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Mini-Dialogue */}
                <div className="rounded-[12px] bg-[#FFFBEB] border border-[#FDE68A] p-2.5 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#B45309] flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>Situational Mini-Dialogue</span>
                  </div>
                  {lessonCourseMaterial.dialogue.map((line, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-black text-[#92400E] mr-1">
                          {line.speaker}:
                        </span>
                        <span className="font-extrabold text-[#1E293B]">
                          {line.french}
                        </span>
                        <span className="text-[#64748B] font-semibold ml-1.5">
                          ({line.english})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          soundManager.speak(line.french, speechLang)
                        }
                        className="w-6 h-6 rounded-md bg-[#F59E0B]/20 text-[#B45309] flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lesson Vocabulary List (8 Words) */}
            {lessonVocab.length > 0 && (
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-[#0369A1] mb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>
                    Lesson Vocabulary ({lessonVocab.length} CEFR Words)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
                  {lessonVocab.map((w) => (
                    <div
                      key={w.id}
                      className="rounded-[10px] bg-white border border-[#BAE6FD] p-2 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-[#0F172A]">
                            {w.french}
                          </span>
                          <span className="text-[10px] font-bold text-[#0284C7] font-mono">
                            [{w.phonetic}]
                          </span>
                        </div>
                        <div className="text-[11px] font-extrabold text-[#16A34A]">
                          {w.english}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => soundManager.speak(w.french, speechLang)}
                        className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 1: MATCH PAIRS (Left French Column + Right English Column) */}
        {currentMode === 'match_pairs' && (
          <div data-testid="lesson-mode-match-pairs" className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Left Column: French Words */}
              <div className="space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-[#777777] px-1">
                  Français
                </div>
                {matchPairsData.map((pair, idx) => {
                  const isMatched = matchedPairIds.includes(pair.id);
                  const isSelected = selectedLeftPairId === pair.id;
                  const isMismatch = mismatchFlashIds.includes(pair.id);

                  return (
                    <button
                      key={pair.id}
                      type="button"
                      disabled={isMatched}
                      data-testid={`match-left-${idx}`}
                      onClick={() => handleSelectLeftPair(pair.id)}
                      style={{
                        backgroundColor: isMatched
                          ? '#D7FFB8'
                          : isMismatch
                          ? '#FFDFE0'
                          : isSelected
                          ? '#DDF4FF'
                          : '#FFFFFF',
                        borderColor: isMatched
                          ? '#58CC02'
                          : isMismatch
                          ? '#FF4B4B'
                          : isSelected
                          ? '#1CB0F6'
                          : '#E5E5E5',
                        boxShadow: isMatched
                          ? '0 4px 0 #58CC02'
                          : isMismatch
                          ? '0 4px 0 #FF4B4B'
                          : isSelected
                          ? '0 4px 0 #1CB0F6'
                          : '0 4px 0 #E5E5E5',
                      }}
                      className="w-full rounded-[16px] border-2 p-4 text-left font-extrabold text-base sm:text-lg text-[#4B4B4B] flex items-center justify-between transition-transform active:translate-y-[3px] cursor-pointer disabled:opacity-75"
                    >
                      <span>{pair.french}</span>
                      {isMatched && (
                        <Check className="w-5 h-5 text-[#58CC02] stroke-[3]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Shuffled English Meanings */}
              <div className="space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-[#777777] px-1">
                  English
                </div>
                {shuffledRightPairs.map((pair, idx) => {
                  const isMatched = matchedPairIds.includes(pair.id);
                  const isSelected = selectedRightPairId === pair.id;
                  const isMismatch = mismatchFlashIds.includes(pair.id);

                  return (
                    <button
                      key={pair.id}
                      type="button"
                      disabled={isMatched}
                      data-testid={`match-right-${idx}`}
                      onClick={() => handleSelectRightPair(pair.id)}
                      style={{
                        backgroundColor: isMatched
                          ? '#D7FFB8'
                          : isMismatch
                          ? '#FFDFE0'
                          : isSelected
                          ? '#DDF4FF'
                          : '#FFFFFF',
                        borderColor: isMatched
                          ? '#58CC02'
                          : isMismatch
                          ? '#FF4B4B'
                          : isSelected
                          ? '#1CB0F6'
                          : '#E5E5E5',
                        boxShadow: isMatched
                          ? '0 4px 0 #58CC02'
                          : isMismatch
                          ? '0 4px 0 #FF4B4B'
                          : isSelected
                          ? '0 4px 0 #1CB0F6'
                          : '0 4px 0 #E5E5E5',
                      }}
                      className="w-full rounded-[16px] border-2 p-4 text-left font-extrabold text-base sm:text-lg text-[#4B4B4B] flex items-center justify-between transition-transform active:translate-y-[3px] cursor-pointer disabled:opacity-75"
                    >
                      <span>{pair.english}</span>
                      {isMatched && (
                        <Check className="w-5 h-5 text-[#58CC02] stroke-[3]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: FILL-IN-THE-BLANK */}
        {currentMode === 'fill_blank' && (
          <div data-testid="lesson-mode-fill-blank" className="space-y-6">
            <div
              style={{ boxShadow: '0 4px 0 #E5E5E5' }}
              className="rounded-[16px] border-2 border-[#E5E5E5] bg-[#FFFFFF] p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    soundManager.speak(currentQuestion.sourceSentence, speechLang)
                  }
                  aria-label="Listen to sentence"
                  style={{
                    backgroundColor: '#1CB0F6',
                    boxShadow: '0 4px 0 #1899D6',
                  }}
                  className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white shrink-0 cursor-pointer active:translate-y-[3px]"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <div className="text-lg sm:text-xl font-black text-[#4B4B4B] leading-relaxed flex flex-wrap items-center gap-2">
                  <span>{fillBlankData.prefix}</span>
                  <span
                    data-testid="fill-blank-slot"
                    style={{
                      backgroundColor: selectedBlankWord ? '#DDF4FF' : '#F7F7F7',
                      borderColor: selectedBlankWord ? '#1CB0F6' : '#CCCCCC',
                      boxShadow: selectedBlankWord ? '0 3px 0 #1CB0F6' : 'none',
                    }}
                    className="inline-flex items-center justify-center min-w-[120px] px-4 py-1.5 rounded-[12px] border-2 text-[#1CB0F6] font-black"
                  >
                    {selectedBlankWord || '_______'}
                  </span>
                  <span>{fillBlankData.suffix}</span>
                </div>
              </div>
              <p className="text-sm font-bold text-[#777777]">
                Meaning: “{fillBlankData.englishTranslation}”
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {fillBlankData.options.map((word, idx) => {
                const isSelected = selectedBlankWord === word;
                return (
                  <button
                    key={word}
                    type="button"
                    disabled={evaluationState !== 'idle'}
                    data-testid={`blank-option-${idx}`}
                    onClick={() => {
                      soundManager.playTap();
                      setSelectedBlankWord(word);
                    }}
                    style={{
                      backgroundColor: isSelected ? '#DDF4FF' : '#FFFFFF',
                      borderColor: isSelected ? '#1CB0F6' : '#E5E5E5',
                      boxShadow: isSelected
                        ? '0 4px 0 #1CB0F6'
                        : '0 4px 0 #E5E5E5',
                    }}
                    className="rounded-[16px] border-2 p-4 text-center font-black text-lg text-[#4B4B4B] transition-transform active:translate-y-[3px] cursor-pointer"
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 3: WORD ASSEMBLY (Tap Word Bank Tiles to Construct French Sentence) */}
        {currentMode === 'word_assembly' && (
          <div data-testid="lesson-mode-word-assembly" className="space-y-5">
            <div
              style={{ boxShadow: '0 4px 0 #E5E5E5' }}
              className="rounded-[16px] border-2 border-[#E5E5E5] bg-[#FFFFFF] p-4 flex items-center gap-3.5"
            >
              <button
                type="button"
                onClick={() =>
                  soundManager.speak(currentQuestion.sourceSentence, speechLang)
                }
                aria-label="Listen to target sentence"
                style={{
                  backgroundColor: '#1CB0F6',
                  boxShadow: '0 4px 0 #1899D6',
                }}
                className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white shrink-0 cursor-pointer active:translate-y-[3px]"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <div className="text-lg sm:text-xl font-black text-[#4B4B4B]">
                “{wordAssemblyData.englishPrompt}”
              </div>
            </div>

            {/* 3D Answer Tray */}
            <div
              data-testid="word-assembly-tray"
              className="min-h-[84px] rounded-[16px] border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-3.5 flex flex-wrap items-center gap-2.5"
            >
              {assembledTileIndices.length === 0 ? (
                <span className="text-sm font-bold text-[#94A3B8]">
                  Tap the French word tiles below in order to build the sentence...
                </span>
              ) : (
                assembledTileIndices.map((bankIdx) => (
                  <button
                    key={`tray-${bankIdx}`}
                    type="button"
                    disabled={evaluationState !== 'idle'}
                    onClick={() => {
                      soundManager.playTap();
                      setAssembledTileIndices((prev) =>
                        prev.filter((i) => i !== bankIdx)
                      );
                    }}
                    style={{
                      backgroundColor: '#DDF4FF',
                      borderColor: '#1CB0F6',
                      boxShadow: '0 4px 0 #1CB0F6',
                    }}
                    className="px-4 py-2 rounded-[12px] border-2 font-black text-base text-[#1CB0F6] cursor-pointer active:translate-y-[2px]"
                  >
                    {wordAssemblyData.bankWords[bankIdx]}
                  </button>
                ))
              )}
            </div>

            {/* 3D Word Bank */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {wordAssemblyData.bankWords.map((word, bankIdx) => {
                const isUsed = assembledTileIndices.includes(bankIdx);
                return (
                  <button
                    key={`bank-${bankIdx}`}
                    type="button"
                    disabled={isUsed || evaluationState !== 'idle'}
                    data-testid={`word-bank-tile-${bankIdx}`}
                    onClick={() => {
                      soundManager.playTap();
                      setAssembledTileIndices((prev) => [...prev, bankIdx]);
                    }}
                    style={{
                      backgroundColor: isUsed ? '#E5E5E5' : '#FFFFFF',
                      borderColor: isUsed ? '#D4D4D4' : '#E5E5E5',
                      boxShadow: isUsed ? 'none' : '0 4px 0 #E5E5E5',
                    }}
                    className={`px-4 py-2.5 rounded-[14px] border-2 font-black text-base transition-transform ${
                      isUsed
                        ? 'text-transparent cursor-default select-none'
                        : 'text-[#4B4B4B] cursor-pointer active:translate-y-[3px]'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 4: MULTIPLE-CHOICE TRANSLATION */}
        {currentMode === 'multiple_choice' && (
          <div data-testid="lesson-mode-multiple-choice">
            <div
              style={{
                boxShadow: '0 4px 0 #E5E5E5',
              }}
              className="rounded-[16px] border-2 border-[#E5E5E5] bg-[#FFFFFF] p-4 sm:p-5 flex items-center gap-4 mb-6"
            >
              <button
                type="button"
                onClick={() =>
                  soundManager.speak(currentQuestion.sourceSentence, speechLang)
                }
                aria-label={`Listen to ${currentQuestion.sourceSentence}`}
                style={{
                  backgroundColor: '#1CB0F6',
                  boxShadow: '0 4px 0 #1899D6',
                }}
                className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white shrink-0 cursor-pointer active:translate-y-[3px] transition-transform"
              >
                <Volume2 className="w-6 h-6" />
              </button>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
                  {currentQuestion.wordHints.map((hint, idx) => {
                    const isHintOpen = activeHintIndex === idx;
                    return (
                      <div key={idx} className="relative inline-block">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveHintIndex(isHintOpen ? null : idx)
                          }
                          className="text-lg sm:text-xl font-black text-[#4B4B4B] border-b-2 border-dotted border-[#AFAFAF] hover:border-[#1CB0F6] hover:text-[#1CB0F6] transition-colors pb-0.5 cursor-pointer"
                        >
                          {hint.word}
                        </button>
                        {isHintOpen && (
                          <div
                            style={{ boxShadow: '0 3px 0 #E5E5E5' }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-[12px] bg-[#FFFFFF] border-2 border-[#E5E5E5] text-xs font-black text-[#1CB0F6] whitespace-nowrap z-20"
                          >
                            {hint.meaning}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs font-bold text-[#777777] mt-1.5">
                  Tap any underlined French word for its English meaning
                </p>
              </div>
            </div>

            <div
              role="radiogroup"
              aria-label="Translation choices"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedCardIndex === index;

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={evaluationState !== 'idle'}
                    data-testid={`option-card-${index}`}
                    data-selected={isSelected ? 'true' : 'false'}
                    onClick={() => {
                      soundManager.playTap();
                      setSelectedCardIndex(index);
                    }}
                    style={{
                      backgroundColor: isSelected ? '#DDF4FF' : '#FFFFFF',
                      borderColor: isSelected ? '#1CB0F6' : '#E5E5E5',
                      boxShadow: isSelected
                        ? '0 4px 0 #1CB0F6'
                        : '0 4px 0 #E5E5E5',
                    }}
                    className={`rounded-[16px] border-2 p-5 text-left flex items-center justify-between gap-3 transition-all duration-100 active:translate-y-[3px] focus:outline-none ${
                      evaluationState === 'idle'
                        ? 'cursor-pointer hover:border-[#1CB0F6]/60'
                        : 'cursor-default'
                    }`}
                  >
                    <div
                      className={`text-base sm:text-lg font-extrabold leading-snug ${
                        isSelected ? 'text-[#1CB0F6]' : 'text-[#4B4B4B]'
                      }`}
                    >
                      {option.text}
                    </div>

                    <span
                      style={{
                        borderColor: isSelected ? '#1CB0F6' : '#E5E5E5',
                        color: isSelected ? '#1CB0F6' : '#AFAFAF',
                        backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                      }}
                      className="w-7 h-7 rounded-[8px] border-2 text-xs font-extrabold flex items-center justify-center shrink-0 tabular-nums"
                    >
                      {index + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <footer
        data-testid="lesson-sticky-footer"
        className="fixed bottom-0 left-0 right-0 bg-[#FFFFFF] border-t-2 border-[#E5E5E5] py-4 px-4 sm:px-6 z-20"
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block text-xs font-extrabold text-[#777777]">
            {currentMode === 'match_pairs'
              ? `Matched ${matchedPairIds.length}/${matchPairsData.length} pairs`
              : 'Complete the activity above and click CHECK'}
          </div>
          <div className="w-full sm:w-52 ml-auto">
            <TactileButton
              label="CHECK"
              variant="primary"
              fullWidth
              disabled={!canCheckCurrentStep}
              testId="check-answer-button"
              onClick={handleCheckAnswer}
            />
          </div>
        </div>
      </footer>

      {evaluationState !== 'idle' && (
        <div
          role="region"
          aria-live="polite"
          aria-label="Answer evaluation feedback"
          data-testid="evaluation-bottom-sheet"
          data-evaluation-state={evaluationState}
          style={{
            backgroundColor:
              evaluationState === 'correct' ? '#D7FFB8' : '#FFDFE0',
          }}
          className="fixed bottom-0 left-0 right-0 z-30 border-t-2 border-black/5 py-5 px-4 sm:px-6 animate-sheet-bounce"
        >
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              {evaluationState === 'correct' ? (
                <div
                  style={{ backgroundColor: '#58CC02' }}
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                >
                  <Check className="w-7 h-7 text-white stroke-[3.5]" />
                </div>
              ) : (
                <div
                  style={{ backgroundColor: '#FF4B4B' }}
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                >
                  <X className="w-7 h-7 text-white stroke-[3.5]" />
                </div>
              )}

              <div>
                <div
                  style={{
                    color:
                      evaluationState === 'correct' ? '#58A700' : '#EA2B2B',
                  }}
                  className="text-xl font-extrabold leading-tight"
                >
                  {evaluationState === 'correct'
                    ? 'Awesome!'
                    : 'Correct solution:'}
                </div>

                {evaluationState === 'incorrect' ? (
                  <div
                    data-testid="correct-solution-text"
                    style={{ color: '#EA2B2B' }}
                    className="text-base font-extrabold mt-0.5"
                  >
                    {correctSolutionLabel}
                  </div>
                ) : (
                  <div className="text-sm font-bold text-[#58A700] mt-0.5">
                    {currentQuestion.grammarNote}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full sm:w-52 shrink-0">
              <TactileButton
                label={evaluationState === 'correct' ? 'CONTINUE' : 'GOT IT'}
                variant={evaluationState === 'correct' ? 'primary' : 'danger'}
                fullWidth
                testId="evaluation-continue-button"
                onClick={handleContinue}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
