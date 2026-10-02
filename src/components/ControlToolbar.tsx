import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Split,
  Languages,
  Activity,
  Gauge,
  Cpu,
} from 'lucide-react';
import { BranchDecision } from '../types/flowchart';

interface ControlToolbarProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  branchDecision: BranchDecision;
  isPausedAtDecision: boolean;
  language: 'id' | 'en' | 'dual';
  activeNodeTitle: string;
  isInspectOpen: boolean;
  onToggleInspect: () => void;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onChangeSpeed: (spd: number) => void;
  onChangeBranch: (branch: BranchDecision) => void;
  onChangeLanguage: (lang: 'id' | 'en' | 'dual') => void;
}

export const ControlToolbar: React.FC<ControlToolbarProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  branchDecision,
  isPausedAtDecision,
  language,
  activeNodeTitle,
  isInspectOpen,
  onToggleInspect,
  onTogglePlay,
  onStepForward,
  onStepBack,
  onChangeSpeed,
  onChangeBranch,
  onChangeLanguage,
}) => {
  return (
    <div className="w-full bg-[#080d1b]/95 border-t border-slate-800/80 px-2 sm:px-4 py-2 backdrop-blur-md z-30 shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
        {/* Step Progress & Current Active Action */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] shrink-0">
            <Activity
              size={12}
              className={
                isPlaying
                  ? 'text-cyan-400 animate-pulse'
                  : currentStep >= totalSteps
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }
            />
            <span className="text-slate-400 hidden xs:inline">STEP</span>
            <span className="text-cyan-300 font-bold tabular-nums">
              {String(currentStep).padStart(2, '0')}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 tabular-nums">
              {String(totalSteps).padStart(2, '0')}
            </span>
          </div>

          <div className="text-[11px] truncate max-w-[140px] xs:max-w-[200px] sm:max-w-[260px]">
            {isPausedAtDecision ? (
              <span className="text-amber-400 font-semibold animate-pulse flex items-center gap-1 truncate">
                <Split size={11} className="shrink-0" />
                <span className="truncate">Bifurcation: Pilih Ya / Tidak</span>
              </span>
            ) : currentStep > 0 ? (
              <span className="text-slate-300 truncate block">
                <span className="text-cyan-400 mr-1 font-mono font-bold">SCAN:</span>
                <span className="truncate">{activeNodeTitle}</span>
              </span>
            ) : (
              <span className="text-slate-500 font-mono">Ready</span>
            )}
          </div>
        </div>

        {/* Playback Transport Controls */}
        <div className="flex items-center gap-1.5 shrink-0 mx-auto sm:mx-0">
          <button
            onClick={onStepBack}
            disabled={currentStep <= 1}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Node"
            aria-label="Previous Node"
          >
            <SkipBack size={13} />
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={12} className="fill-current" />
                <span className="hidden xs:inline">Pause</span>
              </>
            ) : (
              <>
                <Play size={12} className="fill-current" />
                <span className="hidden xs:inline">Synthesize</span>
              </>
            )}
          </button>

          <button
            onClick={onStepForward}
            disabled={currentStep >= totalSteps}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Node"
            aria-label="Next Node"
          >
            <SkipForward size={13} />
          </button>

          {/* Speed Selector */}
          <div className="hidden xs:flex items-center ml-1 border border-slate-800 rounded-lg overflow-hidden bg-slate-900/80 p-0.5 text-[10px] font-mono">
            <div className="px-1 text-slate-500 flex items-center">
              <Gauge size={11} />
            </div>
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  speed === s
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Branch Fork, Telemetry & Language Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Branch Decision Controls */}
          <div className="flex items-center gap-0.5 border border-slate-800 rounded-lg p-0.5 bg-slate-900/80 text-[11px]">
            <span className="px-1.5 text-[10px] uppercase font-mono text-slate-500 hidden sm:flex items-center gap-0.5">
              <Split size={10} className="text-amber-400" />
              <span>Gula:</span>
            </span>
            <button
              onClick={() => onChangeBranch('ya')}
              className={`px-2 py-0.5 rounded transition-colors font-semibold ${
                branchDecision === 'ya'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ya
            </button>
            <button
              onClick={() => onChangeBranch('tidak')}
              className={`px-2 py-0.5 rounded transition-colors font-semibold ${
                branchDecision === 'tidak'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tidak
            </button>
            <button
              onClick={() => onChangeBranch('both')}
              className={`px-1.5 py-0.5 rounded transition-colors text-[10px] hidden sm:block ${
                branchDecision === 'both'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Quantum Superposition: Show Both Branches"
            >
              Both
            </button>
          </div>

          {/* Toggle Telemetry Inspector Button */}
          <button
            onClick={onToggleInspect}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              isInspectOpen
                ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300'
                : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200'
            }`}
            title="Inspect Step Telemetry"
            aria-label="Inspect Telemetry"
          >
            <Cpu size={13} className={isInspectOpen ? 'text-cyan-400' : 'text-slate-400'} />
            <span className="hidden md:inline text-[10px] font-mono">Telemetry</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center border border-slate-800 rounded-lg p-0.5 bg-slate-900/80 text-[11px]">
            <div className="px-1 text-slate-500 hidden sm:block">
              <Languages size={11} />
            </div>
            {(['id', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => onChangeLanguage(l)}
                className={`px-1.5 py-0.5 rounded font-mono uppercase text-[10px] transition-colors ${
                  language === l
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
