import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FLOW_NODES, FLOW_EDGES } from './data/flowchartData';
import { BranchDecision, NodeType } from './types/flowchart';
import { soundFx } from './utils/audio';
import { maleNarrator } from './utils/narration';
import { TopBar } from './components/TopBar';
import { HolographicCanvas } from './components/HolographicCanvas';
import { ControlToolbar } from './components/ControlToolbar';
import { TelemetryDrawer } from './components/TelemetryDrawer';
import { CoffeeBrewingVisualizer } from './components/CoffeeBrewingVisualizer';
import { ExtractionTelemetryModal } from './components/ExtractionTelemetryModal';
import { SymbolStandardsModal } from './components/SymbolStandardsModal';
import { BrewingProtocolGuide } from './components/BrewingProtocolGuide';
import { Split, Radio, Sparkles } from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [branchDecision, setBranchDecision] = useState<BranchDecision>('ya');
  const [isPausedAtDecision, setIsPausedAtDecision] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedType, setHighlightedType] = useState<NodeType | null>(null);
  const [language, setLanguage] = useState<'id' | 'en' | 'dual'>('id');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  // Male voice narration enabled by default
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'canvas' | 'telemetry' | 'spec' | 'guide'>('canvas');
  const [isVisualizerOpen, setIsVisualizerOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  const totalSteps = 11;
  const isCompleted = currentStep >= totalSteps;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Advance step logic (Deterministic & Safe)
  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => {
      // If we are at Step 7 (Decision: Tambahkan gula?), pause briefly to emphasize the bifurcation
      if (prev === 7 && !isPausedAtDecision) {
        setIsPausedAtDecision(true);
        return 7;
      }

      let next = prev + 1;
      // If branch is 'tidak', skip step 8 and 9 (sugar steps)
      if (branchDecision === 'tidak') {
        if (next === 8 || next === 9) {
          next = 10;
        }
      }

      if (next > totalSteps) {
        setIsPlaying(false);
        return totalSteps;
      }

      return next;
    });
  }, [branchDecision, isPausedAtDecision, totalSteps]);

  // Synchronized Narration & Step Execution
  // Every step waits until the male narration has 100% completed speaking!
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      maleNarrator.stop();
      return;
    }

    if (currentStep >= totalSteps) {
      setIsPlaying(false);
      return;
    }

    // Play optional sci-fi sound FX
    if (soundEnabled) {
      if (currentStep === 7) {
        soundFx.playDecisionFork();
      } else if (currentStep === totalSteps) {
        soundFx.playCompletionChord();
      } else {
        soundFx.playScanBeam();
        setTimeout(() => soundFx.playEnergyFlow(), 200);
      }
    }

    let isCancelled = false;

    // Called when the male narration has FINISHED reading the sentence
    const onNarrationComplete = () => {
      if (isCancelled) return;

      // Natural breath pause after speech ends before next step begins
      const breathPause = (isPausedAtDecision ? 2200 : 1500) / speed;
      timerRef.current = setTimeout(() => {
        if (!isCancelled) {
          if (isPausedAtDecision) {
            setIsPausedAtDecision(false);
          }
          advanceStep();
        }
      }, breathPause);
    };

    if (voiceEnabled) {
      maleNarrator.narrateStep(
        currentStep,
        branchDecision,
        language,
        onNarrationComplete
      );

      // Watchdog timeout: in case audio fails, advance after max 18 seconds
      const watchdog = setTimeout(() => {
        if (!isCancelled) {
          onNarrationComplete();
        }
      }, 18000 / speed);

      return () => {
        isCancelled = true;
        clearTimeout(watchdog);
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    } else {
      // Narration disabled: use calm timed pacing tailored to step depth
      let baseDelay = 4800;
      if (currentStep === 2) baseDelay = 7000;
      if (currentStep === 3) baseDelay = 6000;
      if (currentStep === 7) baseDelay = 6500;
      if (isPausedAtDecision) baseDelay = 6500;

      const delay = baseDelay / speed;
      timerRef.current = setTimeout(() => {
        if (!isCancelled) {
          if (isPausedAtDecision) {
            setIsPausedAtDecision(false);
          }
          advanceStep();
        }
      }, delay);

      return () => {
        isCancelled = true;
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [
    isPlaying,
    currentStep,
    speed,
    voiceEnabled,
    soundEnabled,
    branchDecision,
    language,
    isPausedAtDecision,
    advanceStep,
    totalSteps,
  ]);

  // User Actions
  const handleTogglePlay = () => {
    if (isCompleted) {
      handleReset();
      setIsPlaying(true);
      return;
    }
    soundFx.playTick();
    setIsPlaying((prev) => {
      const next = !prev;
      if (!next) {
        maleNarrator.stop();
      }
      return next;
    });
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    maleNarrator.stop();
    setIsPausedAtDecision(false);
    setCurrentStep(1);
    setSelectedNodeId(null);
    setIsPlaying(false);
    soundFx.playTick();
  };

  const handleStepForward = () => {
    if (currentStep < totalSteps) {
      setIsPlaying(false);
      setIsPausedAtDecision(false);
      maleNarrator.stop();
      advanceStep();
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setIsPlaying(false);
      setIsPausedAtDecision(false);
      maleNarrator.stop();
      setCurrentStep((prev) => {
        let prevStep = prev - 1;
        if (branchDecision === 'tidak' && (prevStep === 8 || prevStep === 9)) {
          prevStep = 7;
        }
        return prevStep;
      });
    }
  };

  const handleChooseBranch = (branch: BranchDecision) => {
    setBranchDecision(branch);
    setIsPausedAtDecision(false);
    soundFx.playDecisionFork();
    if (voiceEnabled) {
      maleNarrator.narrateStep(7, branch, language);
    }
  };

  const handleToggleSound = () => {
    const newState = soundFx.toggle();
    setSoundEnabled(newState);
  };

  const handleToggleVoice = () => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      maleNarrator.setEnabled(next);
      if (next) {
        maleNarrator.speakTest('Suara narator pria aktif.');
      }
      return next;
    });
  };

  const currentNode = FLOW_NODES.find((n) => n.stepIndex === currentStep) || null;
  const selectedNode = selectedNodeId
    ? FLOW_NODES.find((n) => n.id === selectedNodeId) || null
    : null;

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#05070e] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3-Zone Clean Top Navigation */}
      <TopBar
        isPlaying={isPlaying}
        isCompleted={isCompleted}
        soundEnabled={soundEnabled}
        voiceEnabled={voiceEnabled}
        isVisualizerOpen={isVisualizerOpen}
        activeTab={activeTab}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
        onToggleSound={handleToggleSound}
        onToggleVoice={handleToggleVoice}
        onToggleVisualizer={() => setIsVisualizerOpen(!isVisualizerOpen)}
        onSelectTab={(tab) => {
          soundFx.playTick();
          setActiveTab(tab);
        }}
      />

      {/* Main Interactive Stage Area */}
      <main className="flex-1 min-h-0 flex flex-col relative overflow-hidden bg-cyber-grid bg-cyber-dots">
        {/* Subtle Ambient Radial Glows in Canvas Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-violet-500/5 rounded-full blur-[110px] pointer-events-none" />

        {/* Compact System Status Holographic Ribbon */}
        <div className="w-full flex items-center justify-between px-3 sm:px-6 py-1 z-10 pointer-events-none shrink-0 border-b border-slate-900/60">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#080d1b]/90 border border-slate-800 text-[10px] sm:text-[11px] font-mono shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-slate-400">ALGORITMA:</span>
              <span className="text-cyan-300 font-bold">MEMBUAT_KOPI</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <span>SCANNER: HOLOGRAPHIC_BEAM</span>
              <span>·</span>
              <span>EXTRACTION: TUBRUK_IMMERSION</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isCompleted ? (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-[10px] sm:text-[11px] font-mono text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <Sparkles size={11} className="animate-pulse text-emerald-400" />
                <span className="font-bold">SYSTEM FULLY ACTIVATED</span>
              </div>
            ) : isPausedAtDecision ? (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/50 text-[10px] sm:text-[11px] font-mono text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)] animate-pulse">
                <Split size={11} />
                <span className="font-bold">GATE: PILIH YA / TIDAK</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-[10px] sm:text-[11px] font-mono text-cyan-300">
                <Radio size={11} className="animate-spin text-cyan-400" />
                <span>ANALYZING REAL TIME</span>
              </div>
            )}
          </div>
        </div>

        {/* Workspace Body: Split View between Flowchart Canvas & Animated Brewing Chamber */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Main Flowchart Canvas Area (With Mobile Active-Node Auto-Zoom) */}
          <div className="flex-1 min-h-0 relative flex items-center justify-center p-0 overflow-hidden">
            <HolographicCanvas
              nodes={FLOW_NODES}
              edges={FLOW_EDGES}
              currentStep={currentStep}
              branchDecision={branchDecision}
              isPausedAtDecision={isPausedAtDecision}
              selectedNodeId={selectedNodeId}
              highlightedType={highlightedType}
              language={language}
              isMobile={isMobile}
              onSelectNode={(nodeId) => {
                soundFx.playTick();
                setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
              }}
              onChooseBranch={(branch) => {
                handleChooseBranch(branch);
              }}
              onToggleHighlightType={(type) => {
                soundFx.playTick();
                setHighlightedType(type);
              }}
            />

            {/* Interactive Telemetry Drawer (Only shows when explicitly clicked by user) */}
            {selectedNode && (
              <div className="fixed sm:absolute inset-0 sm:inset-auto sm:right-4 sm:top-14 sm:bottom-4 z-40 flex items-center justify-center sm:block pointer-events-auto">
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm sm:hidden"
                  onClick={() => setSelectedNodeId(null)}
                />
                <TelemetryDrawer
                  node={selectedNode}
                  language={language}
                  onClose={() => setSelectedNodeId(null)}
                  onNextStep={
                    currentStep < totalSteps ? () => handleStepForward() : undefined
                  }
                />
              </div>
            )}
          </div>

          {/* Visualizer Container: Restored to Previous Correct Box Size (Bottom 230px on mobile, Side 320px/360px on desktop) */}
          {isVisualizerOpen && (
            <div className="w-full lg:w-[320px] xl:w-[360px] h-[220px] xs:h-[230px] lg:h-full border-t lg:border-t-0 lg:border-l border-slate-800/80 shrink-0 z-10 transition-all">
              <CoffeeBrewingVisualizer
                currentStep={currentStep}
                branchDecision={branchDecision}
                isPlaying={isPlaying}
                language={language}
              />
            </div>
          )}
        </div>

        {/* Bottom Responsive Control Toolbar */}
        <ControlToolbar
          currentStep={currentStep}
          totalSteps={totalSteps}
          isPlaying={isPlaying}
          speed={speed}
          branchDecision={branchDecision}
          isPausedAtDecision={isPausedAtDecision}
          language={language}
          isInspectOpen={selectedNodeId !== null}
          onToggleInspect={() => {
            soundFx.playTick();
            setSelectedNodeId((prev) =>
              prev ? null : currentNode?.id || 'mulai'
            );
          }}
          activeNodeTitle={
            currentNode
              ? language === 'en'
                ? currentNode.titleEn
                : currentNode.titleId
              : 'Idle'
          }
          onTogglePlay={handleTogglePlay}
          onStepForward={handleStepForward}
          onStepBack={handleStepBack}
          onChangeSpeed={(spd) => {
            soundFx.playTick();
            setSpeed(spd);
          }}
          onChangeBranch={(b) => {
            handleChooseBranch(b);
          }}
          onChangeLanguage={(l) => {
            soundFx.playTick();
            setLanguage(l);
          }}
        />
      </main>

      {/* Auxiliary Modals for Nav Tabs */}
      <ExtractionTelemetryModal
        isOpen={activeTab === 'telemetry'}
        onClose={() => setActiveTab('canvas')}
      />

      <SymbolStandardsModal
        isOpen={activeTab === 'spec'}
        onClose={() => setActiveTab('canvas')}
      />

      <BrewingProtocolGuide
        isOpen={activeTab === 'guide'}
        onClose={() => setActiveTab('canvas')}
      />
    </div>
  );
}
