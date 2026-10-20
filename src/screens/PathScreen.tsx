import React from 'react';
import {
  Star,
  Lock,
  BookOpen,
  MessageCircle,
  Trophy,
  Compass,
  Utensils,
  Check,
  Award,
} from 'lucide-react';
import type { LanguageCourse, PathNodeData } from '../data/curriculum';
import {
  calculateNodeHorizontalOffset,
  getNodeStatus,
  CEFR_GATES,
  type NodeStatus,
} from '../utils/gameLogic';
import { soundManager } from '../utils/soundEffects';

interface PathScreenProps {
  course: LanguageCourse;
  activeLevelIndex: number;
  onStartLesson: (node: PathNodeData) => void;
  onOpenGuidebook: () => void;
}

const NODE_ICONS: Record<
  PathNodeData['iconType'],
  React.FC<{ className?: string }>
> = {
  star: Star,
  book: BookOpen,
  chat: MessageCircle,
  trophy: Trophy,
  compass: Compass,
  utensils: Utensils,
};

const CHAPTER_THEMES: Record<
  number,
  { bg: string; shadow: string; badge: string }
> = {
  1: {
    bg: '#58CC02',
    shadow: '#46A302',
    badge: 'UNIT 1 · CEFR A0 TRACK',
  },
  2: {
    bg: '#1CB0F6',
    shadow: '#1899D6',
    badge: 'UNIT 2 · CEFR A1 TRACK',
  },
  3: {
    bg: '#CE82FF',
    shadow: '#A55EEA',
    badge: 'UNIT 3 · CEFR A1+ TRACK',
  },
  4: {
    bg: '#FF9600',
    shadow: '#CC7800',
    badge: 'UNIT 4 · CEFR A2 TRACK',
  },
};

export const PathScreen: React.FC<PathScreenProps> = ({
  course,
  activeLevelIndex,
  onStartLesson,
  onOpenGuidebook,
}) => {
  const unitsMap = new Map<
    number,
    {
      unitNumber: number;
      unitTitle: string;
      unitDescription: string;
      nodes: PathNodeData[];
    }
  >();

  course.nodes.forEach((node) => {
    const existing = unitsMap.get(node.unitNumber);
    if (existing) {
      existing.nodes.push(node);
    } else {
      unitsMap.set(node.unitNumber, {
        unitNumber: node.unitNumber,
        unitTitle: node.unitTitle,
        unitDescription: node.unitDescription,
        nodes: [node],
      });
    }
  });

  const units = Array.from(unitsMap.values());

  return (
    <div className="w-full space-y-10 pb-28">
      {units.map((unit) => {
        const theme = CHAPTER_THEMES[unit.unitNumber] || CHAPTER_THEMES[1];
        const gateAtEnd = CEFR_GATES.find(
          (g) =>
            g.afterNodeIndex === unit.nodes[unit.nodes.length - 1]?.index
        );
        const isGateUnlocked =
          gateAtEnd && activeLevelIndex >= gateAtEnd.requiredCompletedNodes;

        return (
          <section
            key={unit.unitNumber}
            aria-label={unit.unitTitle}
            className="space-y-8"
          >
            {/* Clean Duolingo-Style Unit Header Banner */}
            <div
              style={{
                backgroundColor: theme.bg,
                boxShadow: `0 4px 0 ${theme.shadow}`,
              }}
              className="rounded-[18px] p-5 text-white flex items-center justify-between gap-4"
            >
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-white/85 mb-0.5">
                  {theme.badge}
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {unit.unitTitle}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-white/90 mt-0.5">
                  {unit.unitDescription}
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenGuidebook}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 3px 0 rgba(0, 0, 0, 0.15)',
                }}
                className="px-4 py-2.5 rounded-[14px] border-2 border-white/40 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 cursor-pointer active:translate-y-[2px] transition-transform"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Guidebook</span>
              </button>
            </div>

            {/* Winding S-Curve French Level Nodes (Zero Background Clutter) */}
            <div className="flex flex-col items-center space-y-7 py-2">
              {unit.nodes.map((node) => {
                const status: NodeStatus = getNodeStatus(
                  node.index,
                  activeLevelIndex
                );
                const offsetX = calculateNodeHorizontalOffset(node.index, 85);
                const NodeIcon = NODE_ICONS[node.iconType] || Star;

                return (
                  <div
                    key={node.id}
                    className="w-full flex justify-center items-center"
                  >
                    <div
                      style={{
                        transform: `translateX(${offsetX}px)`,
                      }}
                      className="flex flex-col items-center relative"
                    >
                      {/* Floating "START" Tooltip above Active Node */}
                      {status === 'active' && (
                        <div
                          data-testid={`start-tooltip-${node.index}`}
                          className="animate-tooltip-float mb-2.5 z-10 pointer-events-none"
                        >
                          <div
                            style={{
                              boxShadow: '0 4px 0 #E5E5E5',
                            }}
                            className="bg-white border-2 border-[#E5E5E5] rounded-[14px] px-4 py-1.5 relative"
                          >
                            <span
                              style={{ color: theme.bg }}
                              className="font-black text-xs tracking-wider uppercase block whitespace-nowrap"
                            >
                              START
                            </span>
                            <span
                              aria-hidden="true"
                              className="w-3 h-3 bg-white border-r-2 border-b-2 border-[#E5E5E5] rotate-45 absolute -bottom-[7px] left-1/2 -translate-x-1/2"
                            />
                          </div>
                        </div>
                      )}

                      {/* Completed Node (Gold #FFC800 with Star Icon) */}
                      {status === 'completed' && (
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playTap();
                            onStartLesson(node);
                          }}
                          aria-label={`Completed Level ${node.index + 1}: ${node.title}`}
                          data-testid={`path-node-${node.index}`}
                          data-node-status="completed"
                          style={{
                            width: '70px',
                            height: '70px',
                            backgroundColor: '#FFC800',
                            boxShadow: '0 6px 0 #D9A600',
                          }}
                          className="rounded-full flex items-center justify-center cursor-pointer active:translate-y-[4px] transition-transform duration-100 relative focus:outline-none"
                        >
                          <Star className="w-8 h-8 text-white fill-white" />
                          <span
                            aria-hidden="true"
                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#58CC02] border-2 border-white flex items-center justify-center"
                          >
                            <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />
                          </span>
                        </button>
                      )}

                      {/* Active Node (Primary Green #58CC02 with Pulsating Scale & Glow) */}
                      {status === 'active' && (
                        <div className="animate-node-pulse">
                          <button
                            type="button"
                            onClick={() => {
                              soundManager.playTap();
                              onStartLesson(node);
                            }}
                            aria-label={`Start Level ${node.index + 1}: ${node.title}`}
                            data-testid={`path-node-${node.index}`}
                            data-node-status="active"
                            style={{
                              width: '70px',
                              height: '70px',
                              backgroundColor: '#58CC02',
                              boxShadow:
                                '0 6px 0 #58A700, 0 0 20px rgba(88, 204, 2, 0.45)',
                            }}
                            className="rounded-full flex items-center justify-center cursor-pointer active:translate-y-[4px] transition-transform duration-100 relative focus:outline-none"
                          >
                            <NodeIcon className="w-8 h-8 text-white fill-white/15 stroke-[2.5]" />
                          </button>
                        </div>
                      )}

                      {/* Locked Node (Gray Circle, Gray Icon) */}
                      {status === 'locked' && (
                        <button
                          type="button"
                          disabled
                          aria-label={`Locked Level ${node.index + 1}: ${node.title}`}
                          data-testid={`path-node-${node.index}`}
                          data-node-status="locked"
                          style={{
                            width: '70px',
                            height: '70px',
                            backgroundColor: '#E5E5E5',
                            boxShadow: '0 6px 0 #CECECE',
                          }}
                          className="rounded-full flex items-center justify-center cursor-not-allowed relative"
                        >
                          <Lock className="w-7 h-7 text-[#AFAFAF] stroke-[2.5]" />
                        </button>
                      )}

                      {/* Clean Level Title */}
                      <div className="mt-2 text-center max-w-[170px]">
                        <div
                          className={`text-xs font-extrabold leading-tight ${
                            status === 'locked'
                              ? 'text-[#AFAFAF]'
                              : 'text-[#4B4B4B]'
                          }`}
                        >
                          Level {node.index + 1} · {node.title}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CEFR Milestone Checkpoint at End of Unit (A0, A1, A1+, A2) */}
            {gateAtEnd && (
              <div
                data-testid={`cefr-gate-${gateAtEnd.code}`}
                style={{
                  backgroundColor: isGateUnlocked ? '#FFFBEB' : '#FFFFFF',
                  borderColor: isGateUnlocked ? '#FFC800' : '#E5E5E5',
                  boxShadow: isGateUnlocked
                    ? '0 4px 0 #D9A600'
                    : '0 4px 0 #E5E5E5',
                }}
                className="mx-auto max-w-lg rounded-[18px] border-2 p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    style={{
                      backgroundColor: isGateUnlocked
                        ? '#FFC800'
                        : gateAtEnd.accentColor,
                    }}
                    className="w-12 h-12 rounded-[14px] text-white flex flex-col items-center justify-center shrink-0 font-black text-sm"
                  >
                    {gateAtEnd.code}
                  </div>

                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-[#777777]">
                      {isGateUnlocked
                        ? `UNLOCKED · ${gateAtEnd.code} COMPLETED`
                        : `COMPLETE LEVEL ${gateAtEnd.requiredCompletedNodes} TO UNLOCK ${gateAtEnd.code}`}
                    </div>
                    <h3 className="text-base font-black text-[#4B4B4B]">
                      {gateAtEnd.title}
                    </h3>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-[10px] text-xs font-black tabular-nums shrink-0 ${
                    isGateUnlocked
                      ? 'bg-[#58CC02] text-white'
                      : 'bg-[#F7F7F7] text-[#777777]'
                  }`}
                >
                  {Math.min(
                    gateAtEnd.requiredCompletedNodes,
                    activeLevelIndex
                  )}{' '}
                  / {gateAtEnd.requiredCompletedNodes}
                </span>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};
