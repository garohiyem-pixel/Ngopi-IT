import React from 'react';
import { X, Activity, Droplets, Thermometer, Flame, Gauge } from 'lucide-react';

interface ExtractionTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExtractionTelemetryModal: React.FC<ExtractionTelemetryModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#090d1c] border border-cyan-500/40 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-[0_0_40px_rgba(6,182,212,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Activity className="text-cyan-400" size={20} />
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-100 font-display">
                Real-Time Coffee Extraction Telemetry
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Spectroscopic Kinetics & SCA Golden Cup Matrix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Thermometer size={14} className="text-amber-400" />
              <span>BREW TEMP</span>
            </div>
            <div className="mt-2 text-2xl font-mono font-bold text-amber-300">
              93.5 <span className="text-xs text-slate-400">°C</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">±1.5°C Target Delta</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Droplets size={14} className="text-cyan-400" />
              <span>TOTAL DISSOLVED</span>
            </div>
            <div className="mt-2 text-2xl font-mono font-bold text-cyan-300">
              1.38 <span className="text-xs text-slate-400">% TDS</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">SCA Standard (1.15 - 1.45%)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Flame size={14} className="text-violet-400" />
              <span>EXTRACTION YIELD</span>
            </div>
            <div className="mt-2 text-2xl font-mono font-bold text-violet-300">
              19.6 <span className="text-xs text-slate-400">%</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">Optimal (18.0 - 22.0%)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Gauge size={14} className="text-sky-400" />
              <span>BREW RATIO</span>
            </div>
            <div className="mt-2 text-2xl font-mono font-bold text-sky-300">
              1:15.7 <span className="text-xs text-slate-400">m/m</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">14g Coffee / 220ml H2O</div>
          </div>
        </div>

        {/* Extraction Kinetic Graph Representation */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-slate-300 font-semibold uppercase">
              Extraction Phase Dissolution Dynamics (dC/dt)
            </span>
            <span className="text-cyan-400 font-bold">STEADY STATE</span>
          </div>

          <div className="h-44 w-full flex items-end gap-2 pt-6 pb-2 border-b border-l border-slate-800 relative">
            {/* Horizontal target guide */}
            <div className="absolute top-10 left-0 right-0 border-t border-dashed border-cyan-500/30 flex justify-end">
              <span className="text-[9px] font-mono text-cyan-400 -mt-3 mr-2">
                19.6% Golden Cup Optimum
              </span>
            </div>

            {/* Simulated Phase Bars */}
            {[
              { label: '0s Start', height: '10%', val: '0.0%' },
              { label: '30s Wetting', height: '35%', val: '7.2%' },
              { label: '60s Infusion', height: '65%', val: '13.8%' },
              { label: '90s Agitation', height: '82%', val: '17.4%' },
              { label: '120s Sugar', height: '94%', val: '19.6%' },
              { label: '150s Serving', height: '94%', val: '19.6%' },
            ].map((step, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                  {step.val}
                </div>
                <div
                  style={{ height: step.height }}
                  className="w-full rounded-t bg-gradient-to-t from-cyan-600/40 to-cyan-400 group-hover:from-cyan-500 group-hover:to-cyan-300 transition-all border-t border-cyan-300"
                />
                <span className="text-[10px] font-mono text-slate-400 mt-2 truncate max-w-full text-center">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Science Description */}
        <div className="mt-4 p-4 rounded-xl bg-slate-900/30 border border-slate-800 text-xs text-slate-300 space-y-2">
          <p>
            <strong className="text-cyan-300">Phase 1 (Wetting & Bloom):</strong> Hot water (±90–95°C) initiates rapid gas desorption (CO2) from roasted coffee bean cellular matrix.
          </p>
          <p>
            <strong className="text-violet-300">Phase 2 (Solubilization):</strong> Fruit acids and organic flavor compounds solubilize first, followed by aromatic caramels and caffeine.
          </p>
          <p>
            <strong className="text-amber-300">Phase 3 (Sucrose Modulation):</strong> When "Tambahkan gula?" decision resolves to "Ya", sucrose molecules (C12H22O11) physically dissolve, modulating taste receptor perception without masking origin aromatics.
          </p>
        </div>
      </div>
    </div>
  );
};
