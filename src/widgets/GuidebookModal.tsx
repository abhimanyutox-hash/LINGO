import React from 'react';
import { X, Volume2, BookOpen } from 'lucide-react';
import type { LanguageCourse } from '../data/curriculum';
import { TactileButton } from './TactileButton';
import { soundManager } from '../utils/soundEffects';

interface GuidebookModalProps {
  course: LanguageCourse;
  unitNumber: number;
  onClose: () => void;
}

export const GuidebookModal: React.FC<GuidebookModalProps> = ({
  course,
  unitNumber,
  onClose,
}) => {
  const unitNodes = course.nodes.filter((n) => n.unitNumber === unitNumber);
  const firstNode = unitNodes[0] || course.nodes[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Unit ${unitNumber} Guidebook`}
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        style={{ boxShadow: '0 6px 0 #E5E5E5' }}
        className="bg-[#FFFFFF] border-2 border-[#E5E5E5] rounded-[16px] max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden"
      >
        <div className="px-6 py-4 border-b-2 border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[12px] bg-[#ECF9E2] text-[#58CC02] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#4B4B4B]">
                {firstNode.unitTitle} · Guidebook
              </h2>
              <p className="text-xs font-bold text-[#AFAFAF]">
                Key phrases & grammar notes for {course.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close guidebook"
            className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[#AFAFAF] hover:text-[#4B4B4B] hover:bg-[#F7F7F7] cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {unitNodes.map((node) => (
            <div
              key={node.id}
              className="rounded-[16px] border-2 border-[#E5E5E5] p-4 space-y-3"
            >
              <div className="text-sm font-extrabold text-[#58CC02] uppercase tracking-wider">
                Level {node.index + 1} · {node.title}
              </div>

              {node.questions.map((q) => {
                const answer = q.options[q.correctIndex];
                return (
                  <div
                    key={q.id}
                    className="p-3 rounded-[12px] bg-[#F7F7F7] flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="font-extrabold text-[#4B4B4B] text-sm">
                        {q.sourceSentence}
                      </div>
                      <div className="font-bold text-[#1CB0F6] text-xs mt-0.5">
                        {answer.text}
                      </div>
                      <div className="text-xs font-semibold text-[#AFAFAF] mt-1">
                        {q.grammarNote}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        soundManager.speak(q.sourceSentence, course.speechLang)
                      }
                      aria-label={`Pronounce ${q.sourceSentence}`}
                      className="w-9 h-9 rounded-[10px] bg-[#1CB0F6] text-white flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t-2 border-[#E5E5E5] flex justify-end">
          <TactileButton
            label="GOT IT"
            variant="primary"
            size="md"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};
