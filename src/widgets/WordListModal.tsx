import React, { useState, useMemo } from 'react';
import {
  Volume2,
  Search,
  Check,
  X,
  BookOpen,
  Sparkles,
  Zap,
  RotateCw,
  ArrowRight,
  Award,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';
import {
  CEFR_TIER_SUMMARIES,
  FRENCH_CEFR_VOCAB_LIST,
  filterCefrVocabulary,
  filterCourseMaterials,
  getLessonVocabulary,
  type CefrTier,
} from '../data/cefrWordList';
import {
  calculateCefrTierMastery,
  buildRevisionQuizChoices,
} from '../utils/gameLogic';
import { GameButton } from './GameButton';
import { soundManager } from '../utils/soundEffects';

interface WordListModalProps {
  isOpen: boolean;
  revisedWordIds: string[];
  wordsLearned: number;
  completedLevelIndex?: number;
  speechLang: string;
  onClose: () => void;
  onMarkWordRevised: (wordId: string) => void;
  onSelectLessonNumber?: (lessonNumber: number) => void;
}

export const WordListModal: React.FC<WordListModalProps> = ({
  isOpen,
  revisedWordIds,
  wordsLearned,
  completedLevelIndex = 2,
  speechLang,
  onClose,
  onMarkWordRevised,
  onSelectLessonNumber,
}) => {
  const [activeMode, setActiveMode] = useState<
    'dictionary' | 'course_materials' | 'flashcard_quiz'
  >('dictionary');
  const [selectedTier, setSelectedTier] = useState<'ALL' | CefrTier>('ALL');
  const [onlyUnlearned, setOnlyUnlearned] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive Flashcard & Speed Quiz state
  const [drillIndex, setDrillIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(
    null
  );
  const [drillStreak, setDrillStreak] = useState<number>(0);

  const tierMastery = useMemo(
    () => calculateCefrTierMastery(completedLevelIndex, revisedWordIds),
    [completedLevelIndex, revisedWordIds]
  );

  const filteredItems = useMemo(() => {
    const base = filterCefrVocabulary(selectedTier, searchQuery);
    if (!onlyUnlearned) return base;
    return base.filter((w) => !revisedWordIds.includes(w.id));
  }, [selectedTier, searchQuery, onlyUnlearned, revisedWordIds]);

  const filteredMaterials = useMemo(
    () => filterCourseMaterials(selectedTier, searchQuery),
    [selectedTier, searchQuery]
  );

  const drillPool = useMemo(() => {
    const tierPool = filterCefrVocabulary(selectedTier, '');
    return tierPool.length > 0 ? tierPool : FRENCH_CEFR_VOCAB_LIST;
  }, [selectedTier]);

  const currentDrillWord = drillPool[drillIndex % drillPool.length];

  const quizChoices = useMemo(() => {
    const allEnglish = FRENCH_CEFR_VOCAB_LIST.map((w) => w.english);
    return buildRevisionQuizChoices(
      currentDrillWord.english,
      allEnglish,
      drillIndex + currentDrillWord.lessonNumber
    );
  }, [currentDrillWord, drillIndex]);

  if (!isOpen) return null;

  const handlePickQuizOption = (idx: number) => {
    if (selectedChoiceIdx !== null) return;
    setSelectedChoiceIdx(idx);
    const isCorrect = idx === quizChoices.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setDrillStreak((s) => s + 1);
      setIsCardFlipped(true);
      onMarkWordRevised(currentDrillWord.id);
    } else {
      soundManager.playIncorrect();
      setDrillStreak(0);
      setIsCardFlipped(true);
    }
  };

  const handleNextDrillWord = () => {
    soundManager.playTap();
    setSelectedChoiceIdx(null);
    setIsCardFlipped(false);
    setDrillIndex((i) => i + 1);
  };

  return (
    <div
      data-testid="word-list-modal"
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-2.5 sm:p-5 select-none"
    >
      <div
        style={{
          backgroundColor: '#EBF4FA',
          borderBottom: '6px solid #B8CDE0',
          boxShadow: '0 14px 32px rgba(0, 0, 0, 0.5)',
        }}
        className="w-full max-w-2xl max-h-[90vh] rounded-[24px] border-3 border-white flex flex-col overflow-hidden text-[#14365D] animate-pop-scale"
      >
        {/* Top Royal Header */}
        <div
          style={{
            background: 'linear-gradient(180deg, #2185E5 0%, #145DA0 100%)',
          }}
          className="px-4 sm:px-5 py-3.5 text-white flex items-center justify-between border-b-2 border-[#64B5F6] shrink-0"
        >
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#FFD54F]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-[#FFD54F]">
                Official CEFR A1 · A2 · B1 French Curriculum
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight mt-0.5">
              Words, Course Materials &amp; Revision Hub
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <div
              data-testid="modal-words-learned-badge"
              className="px-3 py-1.5 rounded-[12px] bg-white/15 border border-white/25 text-xs font-black tabular-nums whitespace-nowrap"
            >
              📚 {wordsLearned}/120 Learned
            </div>
            <button
              type="button"
              data-testid="close-word-list-btn"
              onClick={onClose}
              aria-label="Close Word List"
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Switcher + CEFR Tier Mastery Progress Bars */}
        <div className="p-3.5 bg-[#DCE9F5] border-b border-[#B8CDE0] space-y-2.5 shrink-0">
          {/* 3-Tab Mode Switcher: Dictionary (120) vs Course Materials (15) vs Flashcard Drill */}
          <div className="grid grid-cols-3 gap-1.5 bg-[#14365D]/10 p-1 rounded-[14px]">
            <button
              type="button"
              data-testid="revision-mode-dictionary"
              onClick={() => {
                soundManager.playTap();
                setActiveMode('dictionary');
              }}
              style={{
                backgroundColor:
                  activeMode === 'dictionary' ? '#14365D' : 'transparent',
              }}
              className={`py-2 px-2 rounded-[10px] text-[11px] sm:text-xs font-black uppercase tracking-wide flex items-center justify-center gap-1 cursor-pointer transition-all whitespace-nowrap ${
                activeMode === 'dictionary'
                  ? 'text-[#FFD54F] shadow'
                  : 'text-[#14365D] hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>Words (120)</span>
            </button>

            <button
              type="button"
              data-testid="revision-mode-materials"
              onClick={() => {
                soundManager.playTap();
                setActiveMode('course_materials');
              }}
              style={{
                backgroundColor:
                  activeMode === 'course_materials' ? '#0284C7' : 'transparent',
              }}
              className={`py-2 px-2 rounded-[10px] text-[11px] sm:text-xs font-black uppercase tracking-wide flex items-center justify-center gap-1 cursor-pointer transition-all whitespace-nowrap ${
                activeMode === 'course_materials'
                  ? 'text-white shadow'
                  : 'text-[#14365D] hover:bg-white/50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              <span>Course Materials</span>
            </button>

            <button
              type="button"
              data-testid="revision-mode-flashcard"
              onClick={() => {
                soundManager.playTap();
                setActiveMode('flashcard_quiz');
              }}
              style={{
                backgroundColor:
                  activeMode === 'flashcard_quiz' ? '#58CC02' : 'transparent',
              }}
              className={`py-2 px-2 rounded-[10px] text-[11px] sm:text-xs font-black uppercase tracking-wide flex items-center justify-center gap-1 cursor-pointer transition-all whitespace-nowrap ${
                activeMode === 'flashcard_quiz'
                  ? 'text-white shadow'
                  : 'text-[#14365D] hover:bg-white/50'
              }`}
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>Quiz Drill</span>
            </button>
          </div>

          {/* 3-Tier CEFR Mastery Progress Strip */}
          <div className="grid grid-cols-3 gap-2">
            {tierMastery.map((m) => {
              const barColor =
                m.tier === 'A1'
                  ? '#58CC02'
                  : m.tier === 'A2'
                  ? '#1CB0F6'
                  : '#FFB300';
              return (
                <div
                  key={m.tier}
                  className="rounded-[10px] bg-white px-2.5 py-1.5 border border-[#B8CDE0]"
                >
                  <div className="flex items-center justify-between text-[10px] font-black text-[#14365D]">
                    <span>CEFR {m.tier}</span>
                    <span className="tabular-nums">
                      {m.learnedCount}/{m.totalCount}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E2E8F0] mt-1 overflow-hidden">
                    <div
                      style={{
                        width: `${Math.max(6, m.percent)}%`,
                        backgroundColor: barColor,
                      }}
                      className="h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filter Bar: CEFR Tiers (ALL, A1, A2, B1) + Search Input */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {(['ALL', 'A1', 'A2', 'B1'] as const).map((tier) => {
                const isActive = selectedTier === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    data-testid={`vocab-filter-${tier.toLowerCase()}`}
                    onClick={() => {
                      soundManager.playTap();
                      setSelectedTier(tier);
                      setDrillIndex(0);
                      setSelectedChoiceIdx(null);
                      setIsCardFlipped(false);
                    }}
                    style={{
                      backgroundColor: isActive ? '#14365D' : '#FFFFFF',
                      borderBottom: isActive
                        ? '3px solid #0A1E36'
                        : '3px solid #B8CDE0',
                    }}
                    className={`px-3 py-1.5 rounded-[10px] text-xs font-black uppercase tracking-wider cursor-pointer transition-transform active:translate-y-[2px] ${
                      isActive ? 'text-[#FFD54F]' : 'text-[#14365D]'
                    }`}
                  >
                    {tier === 'ALL' ? 'ALL (A1–B1)' : `CEFR ${tier}`}
                  </button>
                );
              })}

              {activeMode === 'dictionary' && (
                <button
                  type="button"
                  data-testid="vocab-filter-unlearned"
                  onClick={() => {
                    soundManager.playTap();
                    setOnlyUnlearned((u) => !u);
                  }}
                  className={`px-2.5 py-1.5 rounded-[10px] text-[11px] font-black uppercase border cursor-pointer ${
                    onlyUnlearned
                      ? 'bg-[#FF8F00] text-white border-[#C66900]'
                      : 'bg-white text-[#3B5C85] border-[#B8CDE0]'
                  }`}
                >
                  {onlyUnlearned ? 'Unlearned Only ✓' : 'To Revise'}
                </button>
              )}
            </div>

            {activeMode !== 'flashcard_quiz' && (
              <div className="relative flex-1 min-w-[170px]">
                <Search className="w-4 h-4 text-[#3B5C85] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeMode === 'course_materials'
                      ? 'Search grammar, dialogues, or culture...'
                      : 'Search French, English, or theme...'
                  }
                  aria-label="Search French vocabulary"
                  className="w-full pl-9 pr-3 py-1.5 rounded-[12px] bg-white border-2 border-[#B8CDE0] text-xs font-extrabold text-[#14365D] focus:outline-none focus:border-[#2185E5]"
                />
              </div>
            )}
          </div>

          {/* CEFR Tier Summary Banner */}
          {selectedTier !== 'ALL' && activeMode !== 'flashcard_quiz' && (
            <div className="rounded-[12px] bg-white p-2.5 border border-[#B8CDE0] flex items-center justify-between gap-3">
              {CEFR_TIER_SUMMARIES.filter((s) => s.tier === selectedTier).map(
                (summary) => (
                  <div key={summary.tier} className="space-y-0.5">
                    <div className="text-xs font-black text-[#14365D]">
                      {summary.title} · {summary.wordCountTarget}
                    </div>
                    <p className="text-[11px] font-bold text-[#3B5C85]">
                      {summary.description}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* MODE 3: INTERACTIVE FLASHCARD & SPEED QUIZ DRILL */}
        {activeMode === 'flashcard_quiz' ? (
          <div
            data-testid="flashcard-quiz-view"
            className="flex-1 overflow-y-auto p-3.5 space-y-3"
          >
            {/* Top Drill Status Strip */}
            <div className="flex items-center justify-between text-xs font-black text-[#3B5C85]">
              <span>
                Card {(drillIndex % drillPool.length) + 1} of {drillPool.length}{' '}
                · CEFR {currentDrillWord.cefr} (Lesson{' '}
                {currentDrillWord.lessonNumber})
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFF8E1] border border-[#FFD54F] text-[#D97706] flex items-center gap-1 tabular-nums">
                <Award className="w-3.5 h-3.5" />
                Streak: {drillStreak}🔥
              </span>
            </div>

            {/* 3D Tactile Flashcard */}
            <div
              data-testid="interactive-flashcard"
              onClick={() => {
                soundManager.playTap();
                setIsCardFlipped((f) => !f);
              }}
              style={{
                background: isCardFlipped
                  ? 'linear-gradient(180deg, #F1FAEA 0%, #D7FFB8 100%)'
                  : 'linear-gradient(180deg, #FFFFFF 0%, #F0F7FF 100%)',
                borderBottom: isCardFlipped
                  ? '5px solid #58CC02'
                  : '5px solid #90A9C4',
              }}
              className="rounded-[20px] border-2 border-white p-3.5 text-center space-y-2 shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-[8px] bg-[#14365D] text-[10px] font-black text-[#FFD54F] uppercase">
                  {currentDrillWord.cefr} · {currentDrillWord.theme}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.speak(currentDrillWord.french, speechLang);
                  }}
                  aria-label={`Pronounce ${currentDrillWord.french}`}
                  style={{
                    backgroundColor: '#1CB0F6',
                    borderBottom: '3px solid #0284C7',
                  }}
                  className="px-2.5 py-1 rounded-[10px] text-white text-xs font-black flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              </div>

              <div className="py-1">
                <div className="text-2xl font-black text-[#14365D]">
                  {currentDrillWord.french}
                </div>
                <div className="text-xs font-bold text-[#64748B]">
                  [{currentDrillWord.phonetic}] · {currentDrillWord.partOfSpeech}
                </div>

                {isCardFlipped && (
                  <div className="mt-2 pt-2 border-t border-[#58CC02]/30 space-y-0.5 animate-pop-scale">
                    <div className="text-base font-black text-[#2E7D00]">
                      → {currentDrillWord.english}
                    </div>
                    <div className="text-[11px] font-bold text-[#14365D]">
                      “{currentDrillWord.exampleFrench}” — {currentDrillWord.exampleEnglish}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[10px] font-extrabold text-[#3B5C85] flex items-center justify-center gap-1">
                <RotateCw className="w-3 h-3" />
                <span>
                  {isCardFlipped
                    ? 'Tap card to hide translation'
                    : 'Tap card to flip or pick the matching meaning below!'}
                </span>
              </div>
            </div>

            {/* 4-Choice Quick Revision Quiz */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-black uppercase tracking-wider text-[#14365D]">
                Quick Revision Check — Select the English meaning:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quizChoices.options.map((optionText, idx) => {
                  const isPicked = selectedChoiceIdx === idx;
                  const isCorrect = idx === quizChoices.correctIndex;

                  let bg = '#FFFFFF';
                  let border = '#C5D9EB';
                  if (selectedChoiceIdx !== null) {
                    if (isCorrect) {
                      bg = '#D7FFB8';
                      border = '#58CC02';
                    } else if (isPicked && !isCorrect) {
                      bg = '#FFDFE0';
                      border = '#FF4B4B';
                    }
                  }

                  return (
                    <button
                      key={`${optionText}-${idx}`}
                      type="button"
                      disabled={selectedChoiceIdx !== null}
                      data-testid={`revision-quiz-option-${idx}`}
                      onClick={() => handlePickQuizOption(idx)}
                      style={{
                        backgroundColor: bg,
                        borderColor: border,
                        borderBottomWidth: '4px',
                      }}
                      className="rounded-[12px] border-2 p-2.5 text-left font-black text-xs sm:text-sm text-[#14365D] flex items-center justify-between gap-1.5 cursor-pointer active:translate-y-[2px] transition-all"
                    >
                      <span className="leading-tight">{optionText}</span>
                      <span className="w-5 h-5 rounded-full bg-[#EBF4FA] text-[10px] font-black text-[#3B5C85] flex items-center justify-center shrink-0 tabular-nums">
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quiz Result Feedback Banner */}
            {selectedChoiceIdx !== null && (
              <div className="rounded-[12px] bg-white px-3 py-2 border border-[#B8CDE0] flex items-center justify-between gap-2 animate-pop-scale">
                <div className="text-xs font-black">
                  {selectedChoiceIdx === quizChoices.correctIndex ? (
                    <span className="text-[#2E7D00]">
                      ✓ Correct! “{currentDrillWord.french}” marked as Revised (+5 XP)
                    </span>
                  ) : (
                    <span className="text-[#EA2B2B]">
                      Correct meaning: {currentDrillWord.english}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : activeMode === 'course_materials' ? (
          /* MODE 2: STRUCTURED CEFR A1-B1 COURSE MATERIALS & GRAMMAR GUIDES */
          <div
            data-testid="course-materials-view"
            className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5"
          >
            {filteredMaterials.map((material) => {
              const tierColor =
                material.cefr === 'A1'
                  ? '#58CC02'
                  : material.cefr === 'A2'
                  ? '#1CB0F6'
                  : '#FFB300';
              const lessonWords = getLessonVocabulary(material.lessonNumber);

              return (
                <div
                  key={material.lessonNumber}
                  data-testid={`course-material-card-${material.lessonNumber}`}
                  className="rounded-[18px] bg-white border-2 border-[#C5D9EB] p-4 space-y-3 shadow-xs animate-card-enter"
                >
                  {/* Card Header: CEFR Badge + Title + Start Lesson Button */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          style={{ backgroundColor: tierColor }}
                          className="px-2 py-0.5 rounded-[6px] text-[10px] font-black text-white uppercase"
                        >
                          CEFR {material.cefr} · Lesson {material.lessonNumber}
                        </span>
                        <span className="text-[11px] font-extrabold text-[#3B5C85]">
                          {material.subtitle}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-[#14365D] mt-0.5">
                        {material.title}
                      </h3>
                    </div>

                    {onSelectLessonNumber && (
                      <button
                        type="button"
                        data-testid={`material-start-lesson-${material.lessonNumber}`}
                        onClick={() => {
                          soundManager.playTap();
                          onSelectLessonNumber(material.lessonNumber);
                          onClose();
                        }}
                        style={{
                          backgroundColor: '#58CC02',
                          borderBottom: '3px solid #388E00',
                        }}
                        className="px-3 py-1.5 rounded-[10px] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer active:translate-y-[2px]"
                      >
                        <span>Practice Lesson {material.lessonNumber}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Grammar Rule Box */}
                  <div className="rounded-[12px] bg-[#F0F7FF] border border-[#B8CDE0] p-3 space-y-1">
                    <div className="text-[11px] font-black uppercase tracking-wider text-[#0284C7] flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Grammar Rule · {material.grammarTopic}</span>
                    </div>
                    <p className="text-xs font-bold text-[#14365D] leading-relaxed">
                      {material.grammarExplanation}
                    </p>
                  </div>

                  {/* Key Patterns Table */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#3B5C85]">
                      Key Sentence Patterns (Tap to Listen)
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {material.keyPatterns.map((pat, idx) => (
                        <div
                          key={idx}
                          className="rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-black text-[#14365D]">
                              {pat.french}{' '}
                              <span className="text-[#2E7D00] font-extrabold">
                                → {pat.english}
                              </span>
                            </div>
                            <div className="text-[10px] font-bold text-[#64748B]">
                              Note: {pat.note}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              soundManager.speak(pat.french, speechLang)
                            }
                            aria-label={`Listen to ${pat.french}`}
                            className="w-8 h-8 rounded-[8px] bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Situational Mini-Dialogue */}
                  <div className="rounded-[12px] bg-[#FFFBEB] border border-[#FDE68A] p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#B45309] flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Situational Dialogue</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          soundManager.speak(
                            material.dialogue.map((d) => d.french).join(' '),
                            speechLang
                          )
                        }
                        className="px-2 py-0.5 rounded-[8px] bg-[#FEF3C7] border border-[#F59E0B] text-[10px] font-black text-[#B45309] flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Play Dialogue</span>
                      </button>
                    </div>
                    {material.dialogue.map((line, idx) => (
                      <div key={idx} className="text-xs">
                        <span className="font-black text-[#92400E]">
                          {line.speaker}:{' '}
                        </span>
                        <span className="font-extrabold text-[#14365D]">
                          “{line.french}”
                        </span>{' '}
                        <span className="font-bold text-[#64748B]">
                          ({line.english})
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 8 Lesson Vocabulary Quick-Listen Chips */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#3B5C85]">
                      Lesson {material.lessonNumber} Core Vocabulary ({lessonWords.length} Words)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {lessonWords.map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() =>
                            soundManager.speak(w.french, speechLang)
                          }
                          className="px-2.5 py-1 rounded-[8px] bg-[#EBF4FA] hover:bg-[#DCE9F5] border border-[#B8CDE0] text-[11px] font-black text-[#14365D] flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3 text-[#1CB0F6]" />
                          <span>{w.french}</span>
                          <span className="text-[#58A700] font-bold">
                            · {w.english}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cultural Insight */}
                  <div className="text-[11px] font-bold text-[#475569] pt-1 border-t border-[#F1F5F9]">
                    <span className="font-black text-[#14365D]">
                      🇫🇷 Cultural Note:{' '}
                    </span>
                    {material.culturalNote}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* MODE 1: SCROLLABLE VOCABULARY DICTIONARY (120 WORDS) */
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filteredItems.map((item) => {
              const isRevised = revisedWordIds.includes(item.id);
              const tierBadgeColor =
                item.cefr === 'A1'
                  ? '#58CC02'
                  : item.cefr === 'A2'
                  ? '#1CB0F6'
                  : '#FFB300';

              return (
                <div
                  key={item.id}
                  data-testid={`vocab-card-${item.id}`}
                  className="rounded-[16px] bg-white border-2 border-[#C5D9EB] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-card-enter"
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        soundManager.speak(item.french, speechLang)
                      }
                      aria-label={`Pronounce ${item.french}`}
                      style={{
                        backgroundColor: '#1CB0F6',
                        borderBottom: '3px solid #0284C7',
                      }}
                      className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white shrink-0 cursor-pointer active:translate-y-[2px]"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          style={{ backgroundColor: tierBadgeColor }}
                          className="px-2 py-0.5 rounded-[6px] text-[10px] font-black text-white uppercase"
                        >
                          {item.cefr} · Lesson {item.lessonNumber}
                        </span>
                        <span className="text-[11px] font-extrabold text-[#3B5C85]">
                          {item.theme} · {item.partOfSpeech}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-baseline gap-2 mt-1">
                        <span className="text-lg font-black text-[#14365D]">
                          {item.french}
                        </span>
                        <span className="text-xs font-bold text-[#64748B]">
                          [{item.phonetic}]
                        </span>
                        <span className="text-sm font-black text-[#58A700]">
                          → {item.english}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-[#3B5C85] mt-1">
                        “{item.exampleFrench}” —{' '}
                        <span className="text-[#64748B]">
                          {item.exampleEnglish}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {onSelectLessonNumber && (
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playTap();
                          onSelectLessonNumber(item.lessonNumber);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 rounded-[10px] bg-[#EBF4FA] border border-[#B8CDE0] text-[11px] font-black text-[#14365D] hover:bg-[#DCE9F5] cursor-pointer"
                      >
                        Lesson {item.lessonNumber}
                      </button>
                    )}

                    <button
                      type="button"
                      data-testid={`revise-word-btn-${item.id}`}
                      onClick={() => {
                        soundManager.playCorrect();
                        onMarkWordRevised(item.id);
                      }}
                      style={{
                        backgroundColor: isRevised ? '#D7FFB8' : '#58CC02',
                        borderBottom: isRevised
                          ? '3px solid #58CC02'
                          : '3px solid #388E00',
                      }}
                      className={`px-3 py-1.5 rounded-[10px] text-xs font-black flex items-center gap-1 cursor-pointer active:translate-y-[2px] ${
                        isRevised ? 'text-[#2E7D00]' : 'text-white'
                      }`}
                    >
                      {isRevised ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Learned</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Revise +5 XP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sticky Footer with Next Word button in Flashcard Mode */}
        <div className="p-3 bg-[#DCE9F5] border-t border-[#B8CDE0] flex items-center justify-between gap-2 shrink-0">
          <span className="text-xs font-extrabold text-[#14365D] truncate">
            {activeMode === 'dictionary'
              ? `Showing ${filteredItems.length} of 120 CEFR French words`
              : activeMode === 'course_materials'
              ? `Showing ${filteredMaterials.length} of 15 CEFR Course Study Guides`
              : `${wordsLearned}/120 Words Mastered`}
          </span>

          <div className="flex items-center gap-2 shrink-0">
            {activeMode === 'flashcard_quiz' && (
              <button
                type="button"
                data-testid="next-flashcard-btn"
                onClick={handleNextDrillWord}
                style={{
                  backgroundColor: '#1CB0F6',
                  borderBottom: '4px solid #0284C7',
                }}
                className="px-3.5 py-2.5 rounded-[14px] text-white font-black text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer active:translate-y-[2px]"
              >
                <span>Next Word</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <GameButton
              label="DONE"
              variant="green"
              width={110}
              height={42}
              fontSize="0.9rem"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

