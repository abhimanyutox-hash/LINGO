import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Check, Star, BookOpen, Trophy, Sparkles, X, ArrowRight } from 'lucide-react';
import type { LanguageCourse, PathNodeData } from '../data/curriculum';
import {
  STARS_REQUIRED_FOR_CHAPTER_TEST,
  calculateTotalStars,
  evaluateChapterTestUnlock,
  isCefrStageUnlocked,
} from '../utils/gameLogic';
import { soundManager } from '../utils/soundEffects';

interface LessonsTabProps {
  course: LanguageCourse;
  activeLevelIndex: number;
  nodeStars: Record<number, number>;
  passedChapterTests?: number[];
  recentlyUnlockedChapter?: number | null;
  wordsLearned: number;
  onStartLesson: (node: PathNodeData) => void;
  onQualifyChapterForTest?: (chapterIndex: number) => void;
  onDismissUnlockedChapterBanner?: () => void;
  onOpenWordList: () => void;
}

/**
 * Tab 1: Star-Gated Winding Lessons Map across CEFR A1, A2, and B1 (mirrors screens/lessons_tab.dart)
 * - Displays Total Stars Earned, Words Learned counter, and "A1-B1 WORD LIST" button
 * - 3 CEFR Stages: Stage 1 (CEFR A1: Levels 1-5), Stage 2 (CEFR A2: Levels 6-10, requires 10 Stars or A1 Test passed),
 *   Stage 3 (CEFR B1: Levels 11-15, requires 20 Stars or A2 Test passed)
 * - Node 5 of each Stage (Level 5, Level 10, Level 15) is the End-of-Chapter Final Test
 *   which unlocks ONLY after completing all 4 lessons in the chapter and earning >= 8 Chapter Stars.
 */
export const LessonsTab: React.FC<LessonsTabProps> = ({
  course,
  activeLevelIndex,
  nodeStars,
  passedChapterTests = [],
  recentlyUnlockedChapter = null,
  wordsLearned,
  onStartLesson,
  onQualifyChapterForTest,
  onDismissUnlockedChapterBanner,
  onOpenWordList,
}) => {
  const [selectedStageIdx, setSelectedStageIdx] = useState<0 | 1 | 2>(0);
  const [isTestGateModalOpen, setIsTestGateModalOpen] = useState<boolean>(false);

  // Automatically switch to the newly unlocked chapter when returning from a Final Chapter Test
  useEffect(() => {
    if (
      recentlyUnlockedChapter === 1 ||
      recentlyUnlockedChapter === 2
    ) {
      setSelectedStageIdx(recentlyUnlockedChapter);
    }
  }, [recentlyUnlockedChapter]);

  const totalStars = calculateTotalStars(nodeStars);
  const chapterTestStatus = evaluateChapterTestUnlock(
    nodeStars,
    selectedStageIdx,
    STARS_REQUIRED_FOR_CHAPTER_TEST
  );
  const currentChapterStars = chapterTestStatus.earnedLessonStars;
  const stageUnlockInfo = isCefrStageUnlocked(
    selectedStageIdx,
    totalStars,
    passedChapterTests
  );

  // Each stage has 5 nodes on the winding S-curve road:
  // Stage 0 (A1): indices 0..4 (Level 5 = A1 Final Test)
  // Stage 1 (A2): indices 5..9 (Level 10 = A2 Final Test)
  // Stage 2 (B1): indices 10..14 (Level 15 = B1 Final Test)
  const baseIdx = selectedStageIdx * 5;

  const handleTapNode = (nodeIndex: number) => {
    soundManager.playTap();
    const isBossTest = nodeIndex % 5 === 4;
    if (isBossTest && !chapterTestStatus.isUnlocked && !chapterTestStatus.isTestCompleted) {
      setIsTestGateModalOpen(true);
      return;
    }
    const targetNode =
      course.nodes[Math.min(nodeIndex, course.nodes.length - 1)] ||
      course.nodes[0];
    onStartLesson(targetNode);
  };

  const getNodeState = (nodeIndex: number) => {
    if (!stageUnlockInfo.unlocked) return 'locked';
    const isBossTest = nodeIndex % 5 === 4;
    if (isBossTest) {
      if (chapterTestStatus.isTestCompleted) return 'completed';
      if (chapterTestStatus.isUnlocked) return 'active';
      return 'locked';
    }
    if ((nodeStars[nodeIndex] || 0) >= 1 || nodeIndex < activeLevelIndex) {
      return 'completed';
    }
    if (nodeIndex === activeLevelIndex) return 'active';
    return 'locked';
  };

  const stages = [
    { idx: 0 as const, label: 'CEFR A1', reqStars: 0 },
    { idx: 1 as const, label: 'CEFR A2', reqStars: 10 },
    { idx: 2 as const, label: 'CEFR B1', reqStars: 20 },
  ];

  const renderEarnedStars = (nodeIndex: number) => {
    const count = nodeStars[nodeIndex] || 3;
    return (
      <div className="flex items-center gap-0.5 -mt-2 relative z-10">
        {[1, 2, 3].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 drop-shadow ${
              s <= count
                ? 'text-[#FFC800] fill-[#FFC800]'
                : 'text-white/40 fill-white/20'
            }`}
          />
        ))}
        <span className="w-4 h-4 rounded-full bg-[#FF8F00] border border-white flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
        </span>
      </div>
    );
  };

  const renderStartTooltip = (nodeIndex: number, text: string = 'START') => (
    <div
      data-testid={`start-tooltip-${nodeIndex}`}
      onClick={() => handleTapNode(nodeIndex)}
      style={{
        background: 'linear-gradient(180deg, #FFB72B 0%, #FF8000 100%)',
        borderBottom: '5px solid #B85000',
        boxShadow: '0 6px 12px rgba(0,0,0,0.35)',
      }}
      className="mb-1.5 px-4 py-1 rounded-[14px] border-2 border-[#FFE082] cursor-pointer animate-tooltip-float relative z-30"
    >
      <span
        style={{ textShadow: '0 2px 0 #8A3800' }}
        className="text-sm sm:text-base font-black uppercase tracking-wider text-white block leading-none"
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        className="w-3 h-3 bg-[#FF8000] border-r-2 border-b-2 border-[#B85000] rotate-45 absolute -bottom-[7px] left-1/2 -translate-x-1/2"
      />
    </div>
  );

  const getShortTopic = (nodeIndex: number) => {
    const node = course.nodes[nodeIndex];
    if (!node) return `Lv.${nodeIndex + 1}`;
    const raw = node.title.replace(/^CEFR\s+[A-B][0-9]\s+Test:\s*/i, '');
    return raw.length > 12 ? `${raw.slice(0, 11)}…` : raw;
  };

  const bossNodeIdx = baseIdx + 4;
  const bossState = getNodeState(bossNodeIdx);
  const node4Idx = baseIdx + 3;
  const node4State = getNodeState(node4Idx);
  const node3Idx = baseIdx + 2;
  const node3State = getNodeState(node3Idx);
  const node2Idx = baseIdx + 1;
  const node2State = getNodeState(node2Idx);
  const node1Idx = baseIdx + 0;
  const node1State = getNodeState(node1Idx);

  const chapterStarPercent = Math.min(
    100,
    Math.round((currentChapterStars / STARS_REQUIRED_FOR_CHAPTER_TEST) * 100)
  );

  const nextIncompleteLessonEntry =
    chapterTestStatus.lessonBreakdown.find((l) => !l.isCompleted) ||
    chapterTestStatus.lessonBreakdown[0];

  return (
    <div
      data-testid="lessons-tab-view"
      className="relative w-full h-full flex flex-col items-center overflow-hidden select-none"
    >
      {/* Top Compact Header + Words Learned + A1-B1 Word List Button */}
      <div className="w-full max-w-[460px] px-4 flex items-center justify-between gap-2 z-20 mt-0.5 mb-1.5">
        <div>
          <h1
            style={{
              textShadow:
                '0 3px 0 rgba(0, 0, 0, 0.45), 0 5px 10px rgba(0, 0, 0, 0.3)',
            }}
            className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white leading-none"
          >
            LESSONS
          </h1>
          <div
            data-testid="words-learned-counter"
            className="text-[11px] font-black text-[#FFF59D] mt-0.5 tabular-nums"
          >
            ⭐ {totalStars} Stars · 📚 {wordsLearned} Words Learned
          </div>
        </div>

        <button
          type="button"
          data-testid="open-word-list-btn"
          onClick={() => {
            soundManager.playTap();
            onOpenWordList();
          }}
          style={{
            background: 'linear-gradient(180deg, #FFE57F 0%, #FFB300 100%)',
            borderBottom: '4px solid #C67100',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
          className="px-3 py-2 rounded-[14px] border-2 border-[#FFF8E1] flex items-center gap-1.5 text-[#14365D] font-black text-xs uppercase tracking-wide cursor-pointer active:translate-y-[2px]"
        >
          <BookOpen className="w-4 h-4 text-[#14365D]" />
          <span>Words &amp; Materials</span>
        </button>
      </div>

      {/* 3-Stage CEFR Selector (A1 -> A2 [10⭐] -> B1 [20⭐]) */}
      <div className="w-full max-w-[460px] px-4 mb-1.5 z-20">
        <div className="grid grid-cols-3 gap-1.5 bg-[#0F3D6E]/60 p-1 rounded-[14px] border border-white/20">
          {stages.map((st) => {
            const isSelected = selectedStageIdx === st.idx;
            const unlocked = isCefrStageUnlocked(
              st.idx,
              totalStars,
              passedChapterTests
            ).unlocked;
            return (
              <button
                key={st.label}
                type="button"
                data-testid={`stage-tab-${st.label.toLowerCase().replace(' ', '-')}`}
                onClick={() => {
                  soundManager.playTap();
                  setSelectedStageIdx(st.idx);
                }}
                style={{
                  background: isSelected
                    ? 'linear-gradient(180deg, #76E81E 0%, #46B800 100%)'
                    : 'transparent',
                }}
                className={`py-1.5 px-2 rounded-[10px] font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  isSelected ? 'text-white shadow' : 'text-white/80 hover:text-white'
                }`}
              >
                {!unlocked && <Lock className="w-3 h-3 text-[#FFD54F]" />}
                <span>{st.label}</span>
                {st.reqStars > 0 && !unlocked && (
                  <span className="text-[10px] text-[#FFD54F] tabular-nums">
                    ({st.reqStars}⭐)
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Newly Unlocked Chapter Celebration Banner */}
      {recentlyUnlockedChapter !== null && (
        <div
          data-testid="chapter-unlocked-banner"
          className="w-full max-w-[460px] px-4 mb-1.5 z-30 animate-pop-scale"
        >
          <div
            style={{
              background: 'linear-gradient(90deg, #1B5E20 0%, #2E7D32 50%, #0277BD 100%)',
              borderBottom: '3px solid #004D40',
            }}
            className="rounded-[12px] border-2 border-[#B9F6CA] px-3 py-1.5 flex items-center justify-between gap-2 shadow-lg"
          >
            <div className="flex items-center gap-2 text-xs font-black text-white">
              <Sparkles className="w-4 h-4 text-[#FFD54F] shrink-0" />
              <span>
                🔓 {stages[recentlyUnlockedChapter]?.label || 'NEXT CHAPTER'} UNLOCKED! Final Chapter Test Passed!
              </span>
            </div>
            {onDismissUnlockedChapterBanner && (
              <button
                type="button"
                aria-label="Dismiss chapter unlocked banner"
                onClick={onDismissUnlockedChapterBanner}
                className="text-white/80 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stage Star-Lock Banner OR Interactive Chapter Final Test Gate Progress Bar */}
      {!stageUnlockInfo.unlocked ? (
        <div
          data-testid="stage-star-lock-banner"
          className="w-full max-w-[460px] px-4 mb-2 z-30"
        >
          <div className="rounded-[14px] bg-[#14365D]/95 border-2 border-[#FFD54F] px-3 py-1.5 text-center shadow-lg">
            <div className="text-[11px] font-black text-[#FFD54F] uppercase">
              🔒 Star Gate: Pass Previous Chapter Test or Earn {stageUnlockInfo.requiredStars} ⭐ to Unlock{' '}
              {stages[selectedStageIdx].label}
            </div>
            <div className="text-[10px] font-bold text-white/90">
              You have {totalStars} ⭐ · Complete earlier lessons &amp; chapter tests!
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[460px] px-4 mb-1.5 z-20">
          <button
            type="button"
            data-testid="chapter-exam-progress-strip"
            onClick={() => {
              soundManager.playTap();
              setIsTestGateModalOpen(true);
            }}
            className="w-full rounded-[12px] bg-[#0F3D6E]/85 hover:bg-[#0F3D6E] border border-[#FFD54F]/50 px-3 py-1.5 flex items-center justify-between gap-2 cursor-pointer transition-all active:translate-y-[1px] shadow"
          >
            <div className="text-[11px] font-black text-white flex items-center gap-1.5">
              {chapterTestStatus.isUnlocked || chapterTestStatus.isTestCompleted ? (
                <Unlock className="w-3.5 h-3.5 text-[#76E81E]" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-[#FFD54F]" />
              )}
              <span>
                {stages[selectedStageIdx].label} Final Chapter Test:
              </span>
            </div>
            <div className="flex items-center gap-2 flex-1 max-w-[205px] justify-end">
              <div className="flex-1 h-2.5 rounded-full bg-black/40 overflow-hidden p-0.5 max-w-[90px]">
                <div
                  style={{
                    width: `${Math.max(12, chapterStarPercent)}%`,
                    background:
                      chapterTestStatus.isUnlocked || chapterTestStatus.isTestCompleted
                        ? 'linear-gradient(90deg, #76E81E 0%, #46B800 100%)'
                        : 'linear-gradient(90deg, #FFD54F 0%, #FF8F00 100%)',
                  }}
                  className="h-full rounded-full transition-all duration-300"
                />
              </div>
              <span
                data-testid="chapter-exam-gate-status-text"
                className="text-[10px] font-black text-[#FFF59D] tabular-nums whitespace-nowrap"
              >
                {currentChapterStars}/{STARS_REQUIRED_FOR_CHAPTER_TEST}⭐ · {chapterTestStatus.completedLessonsCount}/4 Lsns
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Stylized Green Valley & Winding 3D S-Curve Road Container */}
      <div
        style={{
          background:
            'linear-gradient(180deg, rgba(43,136,217,0) 0%, #6EDB9A 14%, #8BE03B 36%, #59C11B 72%, #3D9E10 100%)',
        }}
        className="relative flex-1 w-full max-w-[460px] rounded-t-[36px] overflow-hidden"
      >
        {/* SVG Valley Scenery: Clouds, Pine Trees, Red Flags & 3D Winding Road */}
        <svg
          viewBox="0 0 400 600"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="completedRoad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#F46B27" />
              <stop offset="50%" stopColor="#FFA726" />
              <stop offset="100%" stopColor="#FFD54F" />
            </linearGradient>
          </defs>

          {/* Soft Floating White Clouds with Gentle Drift Animation */}
          <g fill="#FFFFFF" opacity="0.92" className="animate-cloud-drift">
            <ellipse cx="75" cy="115" rx="34" ry="16" />
            <circle cx="62" cy="106" r="16" />
            <circle cx="86" cy="108" r="14" />

            <ellipse cx="42" cy="260" rx="36" ry="17" />
            <circle cx="32" cy="248" r="16" />
            <circle cx="56" cy="250" r="14" />
          </g>
          <g fill="#FFFFFF" opacity="0.92" className="animate-cloud-drift-reverse">
            <ellipse cx="348" cy="145" rx="38" ry="16" />
            <circle cx="335" cy="135" r="15" />
            <circle cx="360" cy="137" r="13" />

            <ellipse cx="330" cy="405" rx="40" ry="17" />
            <circle cx="315" cy="393" r="17" />
            <circle cx="344" cy="395" r="15" />
          </g>

          {/* Stylized Pine Tree Clusters */}
          {[
            { x: 108, y: 175, scale: 0.9 },
            { x: 86, y: 192, scale: 0.75 },
            { x: 312, y: 245, scale: 0.95 },
            { x: 74, y: 495, scale: 0.95 },
            { x: 98, y: 508, scale: 0.78 },
          ].map((tree, idx) => (
            <g
              key={idx}
              transform={`translate(${tree.x}, ${tree.y}) scale(${tree.scale})`}
            >
              <g className="animate-tree-sway">
                <rect x="-4" y="18" width="8" height="10" rx="2" fill="#6D4C41" />
                <polygon points="0,-16 -18,8 18,8" fill="#2E7D32" />
                <polygon points="0,-6 -22,20 22,20" fill="#1B5E20" />
              </g>
            </g>
          ))}

          {/* Locked Stone-Gray Road Segment (Top Half) */}
          <path
            d="M 255 305 C 235 265, 130 245, 130 205 C 130 160, 265 155, 265 112 C 265 75, 200 60, 200 20"
            fill="none"
            stroke="#6E6E6E"
            strokeWidth="58"
            strokeLinecap="round"
          />
          <path
            d="M 255 305 C 235 265, 130 245, 130 205 C 130 160, 265 155, 265 112 C 265 75, 200 60, 200 20"
            fill="none"
            stroke="#9E9E9E"
            strokeWidth="46"
            strokeLinecap="round"
          />

          {/* Completed Gold/Orange Road Segment (Bottom Half) */}
          <path
            d="M 225 590 C 215 540, 195 510, 195 485 C 195 455, 118 445, 118 415 C 118 380, 165 365, 175 348 C 190 328, 255 330, 255 305"
            fill="none"
            stroke="#C26412"
            strokeWidth="58"
            strokeLinecap="round"
          />
          <path
            d="M 225 590 C 215 540, 195 510, 195 485 C 195 455, 118 445, 118 415 C 118 380, 165 365, 175 348 C 190 328, 255 330, 255 305"
            fill="none"
            stroke="url(#completedRoad)"
            strokeWidth="46"
            strokeLinecap="round"
          />

          {/* Little Red Checkpoint Flags along the Valley */}
          {[
            { x: 295, y: 82 },
            { x: 92, y: 340 },
            { x: 282, y: 482 },
          ].map((flag, i) => (
            <g key={i} transform={`translate(${flag.x}, ${flag.y})`}>
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="28"
                stroke="#8D6E63"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <polygon points="0,0 20,7 0,14" fill="#FF5722" />
            </g>
          ))}
        </svg>

        {/* END-OF-CHAPTER FINAL TEST NODE: Node 5 of Stage (Top Right of S-Curve) */}
        <div
          style={{ left: '66%', top: '15%' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
        >
          {bossState === 'active' && renderStartTooltip(bossNodeIdx, 'FINAL TEST')}
          <button
            type="button"
            data-testid={`path-node-${bossNodeIdx}`}
            data-node-status={bossState}
            aria-label={`${stages[selectedStageIdx].label} Final Chapter Test (${bossState})`}
            onClick={() => handleTapNode(bossNodeIdx)}
            className="flex flex-col items-center cursor-pointer active:translate-y-[2px] transition-transform focus:outline-none"
          >
            <div className="px-2 py-0.5 rounded-full bg-[#14365D] border border-[#FFD54F] text-[9px] font-black text-[#FFD54F] uppercase mb-1 shadow">
              {stages[selectedStageIdx].label} Test · {currentChapterStars}/{STARS_REQUIRED_FOR_CHAPTER_TEST}⭐
            </div>
            <div
              style={{
                background:
                  bossState === 'locked'
                    ? '#9E9E9E'
                    : bossState === 'active'
                    ? 'linear-gradient(180deg, #76E81E 0%, #46B800 100%)'
                    : 'linear-gradient(180deg, #FFD54F 0%, #FF8F00 100%)',
                borderBottom:
                  bossState === 'locked'
                    ? '6px solid #616161'
                    : bossState === 'active'
                    ? '6px solid #2E7D00'
                    : '6px solid #C66900',
                boxShadow:
                  bossState === 'active'
                    ? '0 0 0 5px rgba(255, 213, 79, 0.55), 0 6px 14px rgba(0,0,0,0.4)'
                    : '0 6px 10px rgba(0,0,0,0.35)',
              }}
              className="w-18 h-15 rounded-full border-2 border-[#FFF59D] flex flex-col items-center justify-center text-white relative"
            >
              {bossState === 'locked' ? (
                <Lock className="w-4 h-4 text-[#ECEFF1] -mt-0.5" />
              ) : (
                <Trophy className="w-4 h-4 text-white -mt-0.5" />
              )}
              <span
                style={{ textShadow: '0 2px 0 rgba(0,0,0,0.5)' }}
                className="text-xs font-black leading-none mt-0.5 uppercase"
              >
                TEST {bossNodeIdx + 1}
              </span>
            </div>
          </button>
          {bossState === 'completed' && renderEarnedStars(bossNodeIdx)}
        </div>

        {/* Node 4 of Stage (Upper Left of S-Curve) */}
        <div
          style={{ left: '33%', top: '31%' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
        >
          {node4State === 'active' && renderStartTooltip(node4Idx)}
          <button
            type="button"
            disabled={node4State === 'locked'}
            data-testid={`path-node-${node4Idx}`}
            data-node-status={node4State}
            onClick={() => handleTapNode(node4Idx)}
            className="flex flex-col items-center cursor-pointer disabled:cursor-default focus:outline-none"
          >
            <div
              style={{
                background:
                  node4State === 'completed'
                    ? 'linear-gradient(180deg, #FFD54F 0%, #FFA000 100%)'
                    : node4State === 'active'
                    ? 'linear-gradient(180deg, #76E81E 0%, #46B800 100%)'
                    : '#9E9E9E',
                borderBottom:
                  node4State === 'completed'
                    ? '6px solid #C67100'
                    : node4State === 'active'
                    ? '6px solid #2E7D00'
                    : '6px solid #616161',
                boxShadow: '0 6px 10px rgba(0,0,0,0.35)',
              }}
              className="w-16 h-14 rounded-full border-2 border-[#BDBDBD] flex flex-col items-center justify-center text-white relative"
            >
              {node4State === 'locked' && (
                <Lock className="w-4 h-4 text-[#ECEFF1] -mt-1" />
              )}
              <span
                style={{ textShadow: '0 2px 0 #424242' }}
                className="text-base font-black leading-none mt-0.5"
              >
                {node4Idx + 1}
              </span>
            </div>
          </button>
          {node4State === 'completed' ? (
            renderEarnedStars(node4Idx)
          ) : (
            <span className="mt-1 px-2 py-0.5 rounded-full bg-black/40 text-[9px] font-black text-white whitespace-nowrap">
              {getShortTopic(node4Idx)}
            </span>
          )}
        </div>

        {/* Node 3 of Stage (Center-Right of S-Curve: Active Node in Stage 1) */}
        <div
          style={{ left: '63%', top: '47%' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
        >
          {node3State === 'active' && renderStartTooltip(node3Idx)}

          <button
            type="button"
            disabled={node3State === 'locked'}
            data-testid={`path-node-${node3Idx}`}
            data-node-status={node3State}
            onClick={() => handleTapNode(node3Idx)}
            style={{
              boxShadow:
                node3State === 'active'
                  ? '0 0 0 6px rgba(255,255,255,0.65), 0 0 26px 8px rgba(88, 204, 2, 0.75)'
                  : '0 6px 10px rgba(0,0,0,0.35)',
            }}
            className={`w-22 h-20 rounded-full p-1.5 flex items-center justify-center cursor-pointer active:translate-y-[3px] transition-transform focus:outline-none ${
              node3State === 'active'
                ? 'bg-[#E8F8D8] animate-node-pulse'
                : 'bg-[#FFF3D1]'
            }`}
          >
            <div
              style={{
                background:
                  node3State === 'completed'
                    ? 'linear-gradient(180deg, #FFD54F 0%, #FFA000 100%)'
                    : node3State === 'active'
                    ? 'linear-gradient(180deg, #76E81E 0%, #46B800 100%)'
                    : '#9E9E9E',
                borderBottom:
                  node3State === 'completed'
                    ? '6px solid #C67100'
                    : node3State === 'active'
                    ? '6px solid #2E7D00'
                    : '6px solid #616161',
              }}
              className="w-full h-full rounded-full border-2 border-[#B2FF59] flex flex-col items-center justify-center text-white"
            >
              <span
                style={{ textShadow: '0 2px 0 #1B5E20' }}
                className="text-[11px] font-black leading-none"
              >
                Level
              </span>
              <span
                style={{ textShadow: '0 2px 0 #1B5E20' }}
                className="text-2xl font-black leading-none mt-0.5"
              >
                {node3Idx + 1}
              </span>
            </div>
          </button>
          {node3State === 'completed' ? (
            renderEarnedStars(node3Idx)
          ) : (
            <span className="mt-1 px-2 py-0.5 rounded-full bg-black/45 text-[9px] font-black text-white whitespace-nowrap">
              {getShortTopic(node3Idx)}
            </span>
          )}
        </div>

        {/* Node 2 of Stage (Completed Gold 3D Button with Stars) */}
        <div
          style={{ left: '43%', top: '58%' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
        >
          {node2State === 'active' && renderStartTooltip(node2Idx)}
          <button
            type="button"
            disabled={node2State === 'locked'}
            data-testid={`path-node-${node2Idx}`}
            data-node-status={node2State}
            onClick={() => handleTapNode(node2Idx)}
            className="flex flex-col items-center cursor-pointer active:translate-y-[3px] transition-transform focus:outline-none"
          >
            <div className="w-18 h-16 rounded-full bg-[#FFF3D1] p-1 shadow-lg border-2 border-[#E0C088] flex items-center justify-center">
              <div
                style={{
                  background:
                    node2State === 'locked'
                      ? '#9E9E9E'
                      : node2State === 'active'
                      ? 'linear-gradient(180deg, #76E81E 0%, #46B800 100%)'
                      : 'linear-gradient(180deg, #FFD54F 0%, #FFA000 100%)',
                  borderBottom:
                    node2State === 'locked'
                      ? '5px solid #616161'
                      : node2State === 'active'
                      ? '5px solid #2E7D00'
                      : '5px solid #C67100',
                }}
                className="w-full h-full rounded-full border border-[#FFE082] flex flex-col items-center justify-center text-white"
              >
                <span
                  style={{ textShadow: '0 1.5px 0 #8D4E00' }}
                  className="text-[10px] font-black leading-none"
                >
                  Level
                </span>
                <span
                  style={{ textShadow: '0 2px 0 #8D4E00' }}
                  className="text-lg font-black leading-none"
                >
                  {node2Idx + 1}
                </span>
              </div>
            </div>
          </button>
          {node2State === 'completed' && renderEarnedStars(node2Idx)}
        </div>

        {/* Node 1 of Stage (Left Curve Gold 3D Button) */}
        <div
          style={{ left: '30%', top: '71%' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
        >
          {node1State === 'active' && renderStartTooltip(node1Idx)}
          <button
            type="button"
            disabled={node1State === 'locked'}
            data-testid={`path-node-${node1Idx}`}
            data-node-status={node1State}
            onClick={() => handleTapNode(node1Idx)}
            className="flex flex-col items-center cursor-pointer active:translate-y-[3px] transition-transform focus:outline-none"
          >
            <div className="w-18 h-16 rounded-full bg-[#FFF3D1] p-1 shadow-lg border-2 border-[#E0C088] flex items-center justify-center">
              <div
                style={{
                  background:
                    node1State === 'locked'
                      ? '#9E9E9E'
                      : node1State === 'active'
                      ? 'linear-gradient(180deg, #76E81E 0%, #46B800 100%)'
                      : 'linear-gradient(180deg, #FFD54F 0%, #FFA000 100%)',
                  borderBottom:
                    node1State === 'locked'
                      ? '5px solid #616161'
                      : node1State === 'active'
                      ? '5px solid #2E7D00'
                      : '5px solid #C67100',
                }}
                className="w-full h-full rounded-full border border-[#FFE082] flex flex-col items-center justify-center text-white"
              >
                <span
                  style={{ textShadow: '0 1.5px 0 #8D4E00' }}
                  className="text-[10px] font-black leading-none"
                >
                  Level
                </span>
                <span
                  style={{ textShadow: '0 2px 0 #8D4E00' }}
                  className="text-lg font-black leading-none"
                >
                  {node1Idx + 1}
                </span>
              </div>
            </div>
          </button>
          {node1State === 'completed' && renderEarnedStars(node1Idx)}
        </div>

        {/* CROWN ORIGIN NODE (Bottom Center Gold 3D Button with 3D Crown & 3 Stars) */}
        <button
          type="button"
          onClick={() => handleTapNode(node1Idx)}
          style={{ left: '49%', top: '84%' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer active:translate-y-[3px] transition-transform focus:outline-none z-10"
        >
          <svg
            viewBox="0 0 48 32"
            className="w-11 h-7 -mb-2.5 relative z-20 drop-shadow"
            aria-hidden="true"
          >
            <polygon
              points="6,26 10,8 24,18 38,8 42,26"
              fill="#FFC800"
              stroke="#8D4E00"
              strokeWidth="2.5"
            />
            <circle cx="10" cy="7" r="3" fill="#FFD54F" />
            <circle cx="24" cy="6" r="3.5" fill="#FF5252" />
            <circle cx="38" cy="7" r="3" fill="#FFD54F" />
          </svg>

          <div className="w-20 h-17 rounded-full bg-[#FFF3D1] p-1.5 shadow-xl border-2 border-[#E0C088] flex items-center justify-center">
            <div
              style={{
                background: 'linear-gradient(180deg, #FFD54F 0%, #FFA000 100%)',
                borderBottom: '5px solid #C67100',
              }}
              className="w-full h-full rounded-full border border-[#FFE082] flex items-center justify-center text-white"
            >
              <span
                style={{ textShadow: '0 2px 0 #8D4E00' }}
                className="text-xl font-black leading-none"
              >
                {stages[selectedStageIdx].label.split(' ')[1]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-0.5 -mt-2 relative z-10">
            <Star className="w-4 h-4 text-[#FFC800] fill-[#FFC800] drop-shadow" />
            <Star className="w-5 h-5 text-[#FFC800] fill-[#FFC800] drop-shadow" />
            <Star className="w-4 h-4 text-[#FFC800] fill-[#FFC800] drop-shadow" />
          </div>
        </button>
      </div>

      {/* FINAL CHAPTER TEST STAR-GATE MODAL */}
      {isTestGateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chapter-test-gate-title"
          data-testid="chapter-test-gate-modal"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3.5 select-none"
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #163C6B 0%, #0D2342 100%)',
              borderBottom: '7px solid #061326',
              boxShadow: '0 20px 45px rgba(0,0,0,0.65)',
            }}
            className="w-full max-w-[430px] rounded-[26px] border-3 border-[#64B5F6] p-4 text-white relative animate-pop-scale"
          >
            <button
              type="button"
              data-testid="close-chapter-test-gate-modal"
              aria-label="Close Final Chapter Test Gate"
              onClick={() => {
                soundManager.playTap();
                setIsTestGateModalOpen(false);
              }}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 flex items-center justify-center text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 pr-9 mb-3">
              <div
                style={{
                  background:
                    chapterTestStatus.isUnlocked || chapterTestStatus.isTestCompleted
                      ? 'linear-gradient(180deg, #76E81E 0%, #46B800 100%)'
                      : 'linear-gradient(180deg, #FFD54F 0%, #FF8F00 100%)',
                  borderBottom:
                    chapterTestStatus.isUnlocked || chapterTestStatus.isTestCompleted
                      ? '4px solid #2E7D00'
                      : '4px solid #C66900',
                }}
                className="w-12 h-12 rounded-2xl border-2 border-white/80 flex items-center justify-center shrink-0 shadow-lg"
              >
                {chapterTestStatus.isUnlocked || chapterTestStatus.isTestCompleted ? (
                  <Trophy className="w-6 h-6 text-white" />
                ) : (
                  <Lock className="w-6 h-6 text-[#14365D]" />
                )}
              </div>
              <div className="min-w-0">
                <span className="inline-block px-2 py-0.5 rounded-full bg-[#FFD54F]/20 border border-[#FFD54F] text-[9px] font-black uppercase tracking-wider text-[#FFD54F]">
                  {stages[selectedStageIdx].label} · End of Chapter Exam
                </span>
                <h2
                  id="chapter-test-gate-title"
                  className="text-base sm:text-lg font-black uppercase tracking-wide text-white leading-tight mt-0.5"
                >
                  Final Chapter Test Gate
                </h2>
              </div>
            </div>

            {/* Dual Unlock Threshold Progress Box */}
            <div className="rounded-[16px] bg-[#091A32]/90 border-2 border-[#64B5F6]/35 p-3 mb-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-[#90CAF9] uppercase">
                  1. All Chapter Lessons Completed
                </span>
                <span
                  data-testid="gate-lessons-completed-count"
                  className={
                    chapterTestStatus.allLessonsCompleted
                      ? 'text-[#76E81E]'
                      : 'text-[#FFD54F]'
                  }
                >
                  {chapterTestStatus.completedLessonsCount} / {chapterTestStatus.totalLessonsInChapter} Lessons
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-[#90CAF9] uppercase">
                  2. Minimum Chapter Star Threshold
                </span>
                <span
                  data-testid="gate-stars-earned-count"
                  className={
                    chapterTestStatus.meetsStarThreshold
                      ? 'text-[#76E81E]'
                      : 'text-[#FFD54F]'
                  }
                >
                  {chapterTestStatus.earnedLessonStars} / {chapterTestStatus.minStarsRequired} ⭐ Required
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-black/50 p-0.5 overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (chapterTestStatus.earnedLessonStars /
                          chapterTestStatus.minStarsRequired) *
                          100
                      )
                    )}%`,
                    background: chapterTestStatus.isUnlocked
                      ? 'linear-gradient(90deg, #76E81E 0%, #46B800 100%)'
                      : 'linear-gradient(90deg, #FFD54F 0%, #FF8F00 100%)',
                  }}
                  className="h-full rounded-full transition-all duration-300"
                />
              </div>
              <p className="text-[11px] font-bold text-[#B3E5FC] leading-snug">
                {chapterTestStatus.isUnlocked
                  ? `🔓 Threshold met! Pass the ${stages[selectedStageIdx].label} Final Chapter Test to unlock ${chapterTestStatus.nextChapterTitle}!`
                  : `🔒 Earn stars on all 4 lessons in ${stages[selectedStageIdx].label} and reach at least ${chapterTestStatus.minStarsRequired} ⭐ total to unlock the Final Chapter Test.`}
              </p>
            </div>

            {/* 4 Chapter Lessons Star Breakdown Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3.5">
              {chapterTestStatus.lessonBreakdown.map((item) => {
                const lessonNode = course.nodes[item.nodeIndex];
                return (
                  <button
                    key={item.nodeIndex}
                    type="button"
                    data-testid={`gate-lesson-card-${item.lessonNumber}`}
                    onClick={() => {
                      soundManager.playTap();
                      setIsTestGateModalOpen(false);
                      if (lessonNode) onStartLesson(lessonNode);
                    }}
                    className={`rounded-[12px] p-2.5 border-2 text-left flex flex-col justify-between cursor-pointer transition-transform active:translate-y-[1px] ${
                      item.isCompleted
                        ? 'bg-[#102A4C] border-[#FFD54F]/70'
                        : 'bg-white/5 border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[10px] font-black uppercase text-[#90CAF9]">
                        Lesson {item.lessonNumber}
                      </span>
                      {item.isCompleted ? (
                        <span className="text-[10px] font-black text-[#76E81E] flex items-center gap-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Done</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-[#FFD54F]">
                          Needs ⭐
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-black text-white truncate mb-1.5">
                      {lessonNode ? lessonNode.title : `Level ${item.globalLevelNumber}`}
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= item.stars
                              ? 'text-[#FFC800] fill-[#FFC800]'
                              : 'text-white/25'
                          }`}
                        />
                      ))}
                      <span className="ml-auto text-[10px] font-black text-[#FFF59D] tabular-nums">
                        {item.stars}/3⭐
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            {chapterTestStatus.isUnlocked || chapterTestStatus.isTestCompleted ? (
              <button
                type="button"
                data-testid="gate-start-final-test-btn"
                onClick={() => {
                  soundManager.playTap();
                  setIsTestGateModalOpen(false);
                  const testNode = course.nodes[bossNodeIdx];
                  if (testNode) onStartLesson(testNode);
                }}
                style={{
                  background: 'linear-gradient(180deg, #76E81E 0%, #46B800 100%)',
                  borderBottom: '5px solid #2E7D00',
                }}
                className="w-full py-3 rounded-[16px] border-2 border-[#B2FF59] font-black text-sm uppercase tracking-wider text-white flex items-center justify-center gap-2 cursor-pointer active:translate-y-[2px] shadow-lg"
              >
                <Trophy className="w-4 h-4" />
                <span>START {stages[selectedStageIdx].label} FINAL CHAPTER TEST</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  data-testid="gate-play-next-lesson-btn"
                  onClick={() => {
                    soundManager.playTap();
                    setIsTestGateModalOpen(false);
                    const nextNode =
                      course.nodes[nextIncompleteLessonEntry.nodeIndex];
                    if (nextNode) onStartLesson(nextNode);
                  }}
                  style={{
                    background: 'linear-gradient(180deg, #FFB72B 0%, #FF8000 100%)',
                    borderBottom: '5px solid #B85000',
                  }}
                  className="w-full py-2.5 rounded-[14px] border-2 border-[#FFE082] font-black text-xs uppercase tracking-wider text-white flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-[2px]"
                >
                  <span>
                    PLAY LESSON {nextIncompleteLessonEntry.lessonNumber} TO EARN STARS
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onQualifyChapterForTest && (
                  <button
                    type="button"
                    data-testid="gate-qualify-chapter-stars-btn"
                    onClick={() => {
                      soundManager.playCelebration();
                      onQualifyChapterForTest(selectedStageIdx);
                    }}
                    style={{
                      background: 'linear-gradient(180deg, #29B6F6 0%, #0288D1 100%)',
                      borderBottom: '4px solid #01579B',
                    }}
                    className="w-full py-2 rounded-[12px] border border-[#81D4FA] font-black text-[11px] uppercase tracking-wider text-white flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-[2px]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFF59D]" />
                    <span>
                      COMPLETE ALL 4 LESSONS WITH 3⭐ (UNLOCK FINAL TEST)
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
