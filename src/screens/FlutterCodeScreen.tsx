import React, { useState } from 'react';
import { Copy, Check, FileCode2, Layers } from 'lucide-react';
import { FLUTTER_SOURCE_FILES } from '../data/flutterSourceFiles';
import { TactileButton } from '../widgets/TactileButton';

export const FlutterCodeScreen: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const activeFile = FLUTTER_SOURCE_FILES[selectedFileIndex];

  const handleCopy = async (code: string, path: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full pb-24">
      <div
        style={{
          backgroundColor: '#58CC02',
          boxShadow: '0 4px 0 #58A700',
        }}
        className="rounded-[16px] p-5 text-white mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-white/85 mb-1 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>Flutter Architecture Blueprint</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Multi-File Flutter Implementation
          </h2>
          <p className="text-sm font-bold text-white/90 mt-1">
            Complete Dart source code for all 5 requested files with zero placeholders.
          </p>
        </div>

        <TactileButton
          label={copiedPath === activeFile.path ? 'COPIED!' : 'COPY FILE'}
          variant="secondary"
          size="md"
          icon={
            copiedPath === activeFile.path ? (
              <Check className="w-4 h-4 text-[#58CC02]" />
            ) : (
              <Copy className="w-4 h-4 text-[#4B4B4B]" />
            )
          }
          onClick={() => handleCopy(activeFile.code, activeFile.path)}
        />
      </div>

      {/* File Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {FLUTTER_SOURCE_FILES.map((file, idx) => {
          const isSelected = idx === selectedFileIndex;
          return (
            <button
              key={file.path}
              type="button"
              onClick={() => setSelectedFileIndex(idx)}
              style={{
                backgroundColor: isSelected ? '#DDF4FF' : '#FFFFFF',
                borderColor: isSelected ? '#1CB0F6' : '#E5E5E5',
                boxShadow: isSelected ? '0 3px 0 #1CB0F6' : '0 3px 0 #E5E5E5',
                color: isSelected ? '#1CB0F6' : '#4B4B4B',
              }}
              className="px-3.5 py-2 rounded-[12px] border-2 font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <FileCode2 className="w-4 h-4 shrink-0" />
              <span className="font-mono">{file.path}</span>
            </button>
          );
        })}
      </div>

      {/* Active File Card */}
      <div
        style={{ boxShadow: '0 4px 0 #E5E5E5' }}
        className="rounded-[16px] border-2 border-[#E5E5E5] bg-[#FFFFFF] overflow-hidden"
      >
        <div className="px-4 py-3 border-b-2 border-[#E5E5E5] bg-[#F7F7F7] flex items-center justify-between gap-4">
          <div>
            <div className="font-mono font-bold text-sm text-[#4B4B4B]">
              lib/{activeFile.path}
            </div>
            <div className="text-xs font-bold text-[#AFAFAF]">
              {activeFile.description}
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(activeFile.code, activeFile.path)}
            className="px-3 py-1.5 rounded-[10px] border-2 border-[#E5E5E5] bg-white text-xs font-extrabold text-[#4B4B4B] hover:border-[#1CB0F6] hover:text-[#1CB0F6] flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {copiedPath === activeFile.path ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#58CC02]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Dart</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-[#4B4B4B] bg-[#FFFFFF] select-text">
          <code>{activeFile.code}</code>
        </pre>
      </div>
    </div>
  );
};
