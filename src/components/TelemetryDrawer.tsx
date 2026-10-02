import React from 'react';
import { FlowNode } from '../types/flowchart';
import { X, Cpu, ShieldCheck, FlaskConical, ChevronRight } from 'lucide-react';

interface TelemetryDrawerProps {
  node: FlowNode | null;
  language: 'id' | 'en' | 'dual';
  onClose: () => void;
  onNextStep?: () => void;
}

export const TelemetryDrawer: React.FC<TelemetryDrawerProps> = ({
  node,
  language,
  onClose,
  onNextStep,
}) => {
  if (!node) return null;

  return (
    <div className="fixed sm:absolute right-2 sm:right-4 bottom-14 sm:bottom-4 sm:top-14 z-30 w-[calc(100vw-16px)] sm:w-[320px] md:w-[340px] bg-[#090d1c]/95 border border-cyan-500/40 rounded-xl p-3.5 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.25)] flex flex-col justify-between overflow-y-auto max-h-[48vh] sm:max-h-[calc(100%-70px)] animate-in fade-in slide-in-from-bottom sm:slide-in-from-right duration-200">
      <div>
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <Cpu size={14} className="text-cyan-400" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-300 uppercase">
              NODE [{String(node.stepIndex).padStart(2, '0')}] TELEMETRY
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close Drawer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Node Title & Symbol Class */}
        <div className="mt-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase">
            {node.type.toUpperCase()} // STEP
          </div>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">
            {language === 'en' ? node.titleEn : node.titleId}
          </h3>
          {node.subtitleId && (
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === 'en' ? node.subtitleEn : node.subtitleId}
            </p>
          )}
        </div>

        {/* List Items if Input / Output */}
        {node.itemsId && (
          <div className="mt-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[9px] font-mono uppercase text-slate-400">Inventory Items:</span>
            <ul className="mt-1 space-y-0.5 text-[11px] text-slate-300">
              {(language === 'en' ? node.itemsEn : node.itemsId)?.map((item, idx) => (
                <li key={idx} className="flex items-center gap-1.5 font-mono truncate">
                  <span className="text-cyan-400">▹</span>
                  <span className="truncate">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Scientific Telemetry Metric Box */}
        <div className="mt-2.5 p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400 truncate">{node.telemetry.specName}</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0">
              <ShieldCheck size={11} />
              <span>{node.telemetry.status}</span>
            </span>
          </div>

          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-cyan-300 tabular-nums">
              {node.telemetry.value}
            </span>
            <span className="text-[10px] font-mono text-cyan-500">
              {node.telemetry.unit}
            </span>
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-cyan-500/20 text-[11px] text-slate-300 leading-relaxed font-sans">
            {node.telemetry.scientificDetail}
          </div>
        </div>

        {/* Extraction Physics Card */}
        <div className="mt-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800 text-[11px]">
          <div className="flex items-center gap-1 text-violet-400 font-mono text-[10px] font-semibold uppercase">
            <FlaskConical size={12} />
            <span>Kinetics Analysis</span>
          </div>
          <p className="mt-0.5 text-slate-400 text-[10px] leading-relaxed">
            Turbulent dispersion index: 0.92 Re. Extraction thermodynamics balanced to preserve delicate aromatics.
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[9px] font-mono text-slate-500">
          CONFIDENCE: {node.telemetry.confidence}%
        </span>
        {onNextStep && (
          <button
            onClick={onNextStep}
            className="flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <span>Next</span>
            <ChevronRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
};
