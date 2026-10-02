import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Menu,
  X,
  Coffee,
  Mic,
  MicOff,
} from 'lucide-react';

interface TopBarProps {
  isPlaying: boolean;
  isCompleted: boolean;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  isVisualizerOpen: boolean;
  activeTab: 'canvas' | 'telemetry' | 'spec' | 'guide';
  onTogglePlay: () => void;
  onReset: () => void;
  onToggleSound: () => void;
  onToggleVoice: () => void;
  onToggleVisualizer: () => void;
  onSelectTab: (tab: 'canvas' | 'telemetry' | 'spec' | 'guide') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isPlaying,
  isCompleted,
  soundEnabled,
  voiceEnabled,
  isVisualizerOpen,
  activeTab,
  onTogglePlay,
  onReset,
  onToggleSound,
  onToggleVoice,
  onToggleVisualizer,
  onSelectTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 border-b border-slate-800 bg-[#070a14]/95 backdrop-blur-md sticky top-0 z-40 shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-sm sm:text-base md:text-lg font-bold tracking-wider uppercase font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
          ARIF ROHMAN
        </span>
      </div>

      {/* Zone 2: 4 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-xs sm:text-sm font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('canvas')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap ${
            activeTab === 'canvas' ? 'text-cyan-300 font-semibold' : ''
          }`}
        >
          Workflow Canvas
        </button>
        <button
          onClick={() => onSelectTab('telemetry')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap ${
            activeTab === 'telemetry' ? 'text-cyan-300 font-semibold' : ''
          }`}
        >
          Extraction Telemetry
        </button>
        <button
          onClick={() => onSelectTab('spec')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap ${
            activeTab === 'spec' ? 'text-cyan-300 font-semibold' : ''
          }`}
        >
          ISO Symbol Standard
        </button>
        <button
          onClick={() => onSelectTab('guide')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap ${
            activeTab === 'guide' ? 'text-cyan-300 font-semibold' : ''
          }`}
        >
          Brewing Protocol
        </button>
      </nav>

      {/* Zone 3: Primary actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Toggle Visualizer Button */}
        <button
          onClick={onToggleVisualizer}
          title="Toggle Coffee Equipment Visualizer"
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            isVisualizerOpen
              ? 'border-cyan-500/60 bg-cyan-950/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Toggle Coffee Visualizer"
        >
          <Coffee size={14} className={isVisualizerOpen ? 'text-cyan-400' : 'text-slate-400'} />
          <span className="hidden sm:inline">Visualizer</span>
        </button>

        {/* Male Voice Narration Toggle Button */}
        <button
          onClick={onToggleVoice}
          title={voiceEnabled ? 'Suara Narator Pria: Aktif' : 'Suara Narator Pria: Nonaktif'}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            voiceEnabled
              ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              : 'border-slate-800 bg-slate-900/60 text-slate-500 hover:text-slate-300'
          }`}
          aria-label="Toggle Male Voice Narration"
        >
          {voiceEnabled ? <Mic size={14} className="text-emerald-400 animate-pulse" /> : <MicOff size={14} />}
          <span className="hidden xs:inline text-[10px] font-mono">Suara Pria</span>
        </button>

        {/* Audio FX Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Audio FX' : 'Enable Holographic Audio FX'}
          className={`p-1.5 sm:p-2 rounded-lg border transition-colors ${
            soundEnabled
              ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300'
              : 'border-slate-800 bg-slate-900/60 text-slate-500 hover:text-slate-300'
          }`}
          aria-label={soundEnabled ? 'Mute Audio FX' : 'Enable Audio'}
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          title="Reset Synthesis"
          className="p-1.5 sm:p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Reset Workflow"
        >
          <RotateCcw size={15} />
        </button>

        {/* Play / Synthesize Action */}
        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shadow-sm ${
            isPlaying
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
              : isCompleted
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
              : 'bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause size={13} className="fill-current" />
              <span className="hidden xs:inline">Pause</span>
            </>
          ) : isCompleted ? (
            <>
              <Sparkles size={13} />
              <span className="hidden xs:inline">Re-Run</span>
            </>
          ) : (
            <>
              <Play size={13} className="fill-current" />
              <span className="hidden xs:inline">Synthesize</span>
            </>
          )}
        </button>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
          title="Menu"
          aria-label="Navigation Menu"
        >
          {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#070a14]/98 border-b border-slate-800 p-3 flex flex-col gap-2 z-50 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => {
              onSelectTab('canvas');
              setMobileMenuOpen(false);
            }}
            className={`text-left px-3 py-2 rounded-lg text-xs font-medium ${
              activeTab === 'canvas'
                ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            Workflow Canvas
          </button>
          <button
            onClick={() => {
              onSelectTab('telemetry');
              setMobileMenuOpen(false);
            }}
            className={`text-left px-3 py-2 rounded-lg text-xs font-medium ${
              activeTab === 'telemetry'
                ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            Extraction Telemetry
          </button>
          <button
            onClick={() => {
              onSelectTab('spec');
              setMobileMenuOpen(false);
            }}
            className={`text-left px-3 py-2 rounded-lg text-xs font-medium ${
              activeTab === 'spec'
                ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            ISO Symbol Standard
          </button>
          <button
            onClick={() => {
              onSelectTab('guide');
              setMobileMenuOpen(false);
            }}
            className={`text-left px-3 py-2 rounded-lg text-xs font-medium ${
              activeTab === 'guide'
                ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            Brewing Protocol
          </button>
        </div>
      )}
    </header>
  );
};
