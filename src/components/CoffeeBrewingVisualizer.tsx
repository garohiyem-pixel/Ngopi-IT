import React, { useEffect, useState } from 'react';
import { BranchDecision } from '../types/flowchart';
import {
  Thermometer,
  Flame,
  CheckCircle2,
  Sparkles,
  Coffee,
  RotateCw,
  Droplets,
  Layers,
} from 'lucide-react';

interface CoffeeBrewingVisualizerProps {
  currentStep: number;
  branchDecision: BranchDecision;
  isPlaying: boolean;
  language: 'id' | 'en' | 'dual';
}

export const CoffeeBrewingVisualizer: React.FC<CoffeeBrewingVisualizerProps> = ({
  currentStep,
  branchDecision,
  isPlaying,
  language,
}) => {
  // Dynamic temperature simulation for step 3
  const [simTemp, setSimTemp] = useState<number>(28);

  useEffect(() => {
    if (currentStep === 3) {
      setSimTemp(28);
      const interval = setInterval(() => {
        setSimTemp((prev) => {
          if (prev >= 93.5) {
            clearInterval(interval);
            return 93.5;
          }
          return +(prev + 1.2).toFixed(1);
        });
      }, 70);
      return () => clearInterval(interval);
    } else if (currentStep > 3) {
      setSimTemp(93.5);
    } else {
      setSimTemp(28);
    }
  }, [currentStep]);

  return (
    <div className="w-full h-full flex flex-col bg-[#080c1a]/95 p-2 sm:p-2.5 backdrop-blur-xl relative overflow-hidden select-none justify-between">
      {/* 1. Header Ribbon (Compact: ~28px) */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-[11px] font-bold uppercase tracking-wider font-display text-cyan-300 truncate">
            {language === 'en' ? 'Live Brewing Chamber' : 'Simulasi Alat & Kopi'}
          </h3>
        </div>
        <div className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
          STEP {String(currentStep).padStart(2, '0')}/11
        </div>
      </div>

      {/* 2. Main Center Visual Scene (Constrained height: ~135px, NEVER cut off) */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center relative py-1 overflow-hidden">
        {/* Ambient Subtle Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-violet-500/5 to-amber-500/5 pointer-events-none rounded-xl" />

        {/* STEP 1: Mulai - Standby */}
        {currentStep === 1 && (
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 border border-cyan-500/30 rounded-full animate-hud-spin" />
              <div className="absolute inset-2 border border-dashed border-slate-700 rounded-full animate-hud-spin-reverse" />
              <Coffee size={32} className="text-cyan-400 animate-pulse drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
            </div>
            <div className="mt-1 text-[11px] font-mono font-bold text-cyan-300">
              STATION READY // MEMULAI
            </div>
            <p className="text-[9.5px] text-slate-400 max-w-[220px] leading-tight">
              {language === 'en'
                ? 'Equipment & thermal baseline ready.'
                : 'Sistem siap. Inisialisasi alat dan bahan.'}
            </p>
          </div>
        )}

        {/* STEP 2: Siapkan Alat & Bahan - 5 Micro Cards (Fits completely within 110px) */}
        {currentStep === 2 && (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200 max-w-[320px]">
            <span className="text-[9.5px] font-mono text-cyan-400 font-bold uppercase mb-1">
              5 ALAT & BAHAN TERSEDIA
            </span>
            <div className="grid grid-cols-2 gap-1 w-full text-[9.5px]">
              {/* 1. Gelas */}
              <div className="py-0.5 px-1.5 rounded bg-slate-900/80 border border-cyan-500/30 flex items-center gap-1.5">
                <span className="text-xs">🥛</span>
                <span className="font-semibold text-slate-200 truncate">1. Gelas</span>
                <CheckCircle2 size={9} className="text-emerald-400 ml-auto shrink-0" />
              </div>

              {/* 2. Sendok */}
              <div className="py-0.5 px-1.5 rounded bg-slate-900/80 border border-cyan-500/30 flex items-center gap-1.5">
                <span className="text-xs">🥄</span>
                <span className="font-semibold text-slate-200 truncate">2. Sendok</span>
                <CheckCircle2 size={9} className="text-emerald-400 ml-auto shrink-0" />
              </div>

              {/* 3. Bubuk Kopi */}
              <div className="py-0.5 px-1.5 rounded bg-slate-900/80 border border-violet-500/30 flex items-center gap-1.5">
                <span className="text-xs">☕</span>
                <span className="font-semibold text-slate-200 truncate">3. Kopi (14g)</span>
                <CheckCircle2 size={9} className="text-emerald-400 ml-auto shrink-0" />
              </div>

              {/* 4. Gula */}
              <div className="py-0.5 px-1.5 rounded bg-slate-900/80 border border-amber-500/30 flex items-center gap-1.5">
                <span className="text-xs">🍬</span>
                <span className="font-semibold text-slate-200 truncate">4. Gula Pasir</span>
                <span className="text-[8px] text-amber-400 font-mono ml-auto">Opt</span>
              </div>

              {/* 5. Air Mineral */}
              <div className="py-0.5 px-1.5 rounded bg-slate-900/80 border border-cyan-500/30 col-span-2 flex items-center gap-1.5 justify-center">
                <span className="text-xs">💧</span>
                <span className="font-semibold text-slate-200">5. Air Mineral (220ml)</span>
                <CheckCircle2 size={9} className="text-emerald-400 shrink-0" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Panaskan Air (±90–95°C) - Combined Kettle & Temperature */}
        {currentStep === 3 && (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            {/* Kettle SVG with integrated steam */}
            <svg viewBox="0 0 200 115" className="h-20 w-auto drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              {/* Steam waves */}
              <g className="animate-pulse">
                <path d="M 40 35 Q 35 20 42 10" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeDasharray="5 3" />
                <path d="M 48 38 Q 54 22 47 12" fill="none" stroke="rgba(56,189,248,0.7)" strokeWidth="2" strokeDasharray="4 3" />
              </g>

              {/* Induction Base Glow */}
              <ellipse cx="100" cy="108" rx="60" ry="6" fill="rgba(239, 68, 68, 0.4)" filter="drop-shadow(0 0 6px #ef4444)" />
              <rect x="40" y="104" width="120" height="5" rx="2.5" fill="#ef4444" className="animate-pulse" />

              {/* Kettle Body */}
              <path d="M 55 102 L 64 45 L 136 45 L 145 102 Z" fill="url(#kettleGradCompact)" stroke="#94a3b8" strokeWidth="2" />
              <ellipse cx="100" cy="45" rx="36" ry="8" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="100" cy="34" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />

              {/* Gooseneck Spout */}
              <path d="M 64 80 C 30 80 32 40 45 32" fill="none" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
              <circle cx="45" cy="32" r="3" fill="#38bdf8" className="animate-ping" />

              {/* Handle */}
              <path d="M 136 55 C 165 55 165 92 143 96" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

              <defs>
                <linearGradient id="kettleGradCompact" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
            </svg>

            {/* Compact inline temperature badge */}
            <div className="mt-1 py-0.5 px-2 rounded-md bg-slate-900/90 border border-amber-500/40 flex items-center gap-2">
              <Flame size={12} className="text-orange-400 animate-bounce" />
              <span className="text-xs font-mono font-bold text-amber-300 tabular-nums">
                {simTemp}°C
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-500/40">
                Target: 90–95°C
              </span>
            </div>
          </div>
        )}

        {/* STEP 4: Masukkan Bubuk Kopi ke dalam Gelas */}
        {currentStep === 4 && (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <svg viewBox="0 0 200 125" className="h-20 w-auto">
              {/* Saucer */}
              <ellipse cx="100" cy="116" rx="46" ry="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              {/* Glass Vessel */}
              <path d="M 72 40 L 77 110 Q 100 115 123 110 L 128 40 Z" fill="rgba(6, 182, 212, 0.08)" stroke="#38bdf8" strokeWidth="2" />
              {/* Coffee powder in bottom */}
              <path d="M 77 110 Q 100 115 123 110 L 121 94 Q 100 90 79 94 Z" fill="#3f271d" stroke="#2c1810" strokeWidth="1" />
              {/* Falling particles */}
              <g className="animate-pulse">
                <circle cx="100" cy="65" r="2" fill="#5c3a21" />
                <circle cx="97" cy="74" r="1.8" fill="#3f271d" />
                <circle cx="103" cy="80" r="2" fill="#4a2e1b" />
              </g>
              {/* Spoon dispensing */}
              <g transform="translate(90, 20) rotate(-25)">
                <ellipse cx="10" cy="18" rx="12" ry="6" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.5" />
                <path d="M 22 18 L 62 10" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                <ellipse cx="8" cy="16" rx="7" ry="3.5" fill="#3f271d" />
              </g>
            </svg>

            <div className="mt-0.5 text-center">
              <span className="text-[10.5px] font-mono font-bold text-violet-300">
                14G BUBUK KOPI MASUK
              </span>
              <p className="text-[8.5px] text-slate-400">
                Gilingan medium-fine di dasar gelas.
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: Tuangkan Air Panas ke dalam Gelas */}
        {currentStep === 5 && (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <svg viewBox="0 0 200 125" className="h-20 w-auto">
              <ellipse cx="100" cy="116" rx="46" ry="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <path d="M 72 40 L 77 110 Q 100 115 123 110 L 128 40 Z" fill="rgba(6, 182, 212, 0.08)" stroke="#38bdf8" strokeWidth="2" />
              {/* Rising coffee liquid */}
              <path d="M 77 110 Q 100 115 123 110 L 126 60 Q 100 56 74 60 Z" fill="url(#coffeeLiquidCompact)" stroke="#5c3a21" strokeWidth="1" />
              {/* Pouring stream */}
              <path d="M 50 16 Q 85 30 98 60" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
              <path d="M 28 10 L 50 16" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
              {/* Steam */}
              <g className="animate-pulse">
                <path d="M 88 52 Q 84 40 90 32" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                <path d="M 104 50 Q 108 38 102 30" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              </g>

              <defs>
                <linearGradient id="coffeeLiquidCompact" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#854d0e" />
                  <stop offset="35%" stopColor="#5c3a21" />
                  <stop offset="100%" stopColor="#2c1810" />
                </linearGradient>
              </defs>
            </svg>

            <div className="mt-0.5 text-center">
              <span className="text-[10.5px] font-mono font-bold text-sky-300">
                MENUANGKAN 220ML AIR (93°C)
              </span>
              <p className="text-[8.5px] text-slate-400">
                Proses ekstraksi & blooming aktif.
              </p>
            </div>
          </div>
        )}

        {/* STEP 6: Aduk Kopi Hingga Merata */}
        {currentStep === 6 && (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <svg viewBox="0 0 200 125" className="h-20 w-auto">
              <ellipse cx="100" cy="116" rx="46" ry="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <path d="M 72 40 L 77 110 Q 100 115 123 110 L 128 40 Z" fill="rgba(6, 182, 212, 0.08)" stroke="#38bdf8" strokeWidth="2" />
              <path d="M 77 110 Q 100 115 123 110 L 126 60 Q 100 56 74 60 Z" fill="#3f271d" />
              <ellipse cx="100" cy="64" rx="20" ry="4" fill="none" stroke="#ca8a04" strokeWidth="1.2" strokeDasharray="4 2" className="animate-spin" />
              {/* Stirring spoon */}
              <g className="origin-top animate-pulse">
                <line x1="116" y1="16" x2="98" y2="96" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                <ellipse cx="96" cy="96" rx="5" ry="8" fill="#94a3b8" />
              </g>
            </svg>

            <div className="mt-0.5 text-center">
              <span className="text-[10.5px] font-mono font-bold text-violet-300 flex items-center justify-center gap-1">
                <RotateCw size={10} className="animate-spin text-cyan-400" />
                <span>PENGADUKAN VORTEX</span>
              </span>
              <p className="text-[8.5px] text-slate-400">
                Aduk merata agar ekstraksi homogen.
              </p>
            </div>
          </div>
        )}

        {/* STEP 7: Tambahkan Gula? - Bifurcation Decision Stage */}
        {currentStep === 7 && (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200 max-w-[280px]">
            <span className="text-[9.5px] font-mono font-bold text-amber-300 uppercase mb-1">
              PERCABANGAN: TAMBAHKAN GULA?
            </span>
            <div className="grid grid-cols-2 gap-1.5 w-full">
              <div
                className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                  branchDecision === 'ya' || branchDecision === 'both'
                    ? 'border-violet-500 bg-violet-950/40 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    : 'border-slate-800 bg-slate-900/40 opacity-40'
                }`}
              >
                <div className="text-lg">🍬</div>
                <div className="font-bold text-violet-300 text-[10px]">Pilihan: YA</div>
                <div className="text-[8px] text-slate-400">+ Gula Pasir</div>
              </div>

              <div
                className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                  branchDecision === 'tidak' || branchDecision === 'both'
                    ? 'border-amber-500 bg-amber-950/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'border-slate-800 bg-slate-900/40 opacity-40'
                }`}
              >
                <div className="text-lg">☕</div>
                <div className="font-bold text-amber-300 text-[10px]">Pilihan: TIDAK</div>
                <div className="text-[8px] text-slate-400">Kopi Hitam Murni</div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8 & 9 (Branch YA): Masukkan Gula & Aduk Hingga Larut */}
        {(currentStep === 8 || currentStep === 9) && branchDecision !== 'tidak' && (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <svg viewBox="0 0 200 125" className="h-20 w-auto">
              <ellipse cx="100" cy="116" rx="46" ry="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <path d="M 72 40 L 77 110 Q 100 115 123 110 L 128 40 Z" fill="rgba(6, 182, 212, 0.08)" stroke="#38bdf8" strokeWidth="2" />
              <path d="M 77 110 Q 100 115 123 110 L 126 60 Q 100 56 74 60 Z" fill="#3f271d" />
              {/* Sugar crystals */}
              <g className="animate-pulse">
                <rect x="95" y="95" width="5" height="5" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
                <rect x="103" y="100" width="4.5" height="4.5" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
                <circle cx="98" cy="85" r="1.2" fill="#ffffff" />
              </g>
              <line x1="116" y1="16" x2="100" y2="96" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="98" cy="96" rx="5" ry="8" fill="#94a3b8" />
            </svg>

            <div className="mt-0.5 text-center">
              <span className="text-[10.5px] font-mono font-bold text-amber-300 flex items-center justify-center gap-1">
                <Sparkles size={10} className="text-amber-400" />
                <span>{currentStep === 8 ? 'GULA PASIR DITAMBAHKAN' : 'MENGADUK HINGGA LARUT'}</span>
              </span>
              <p className="text-[8.5px] text-slate-400">
                Kristal sukrosa larut merata.
              </p>
            </div>
          </div>
        )}

        {/* STEP 10: Kopi Siap Diminum - Perfect Cup */}
        {currentStep === 10 && (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <svg viewBox="0 0 200 125" className="h-20 w-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <ellipse cx="100" cy="112" rx="48" ry="7" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
              <path d="M 124 64 C 150 64 150 96 120 100" fill="none" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 74 52 L 80 105 Q 100 110 120 105 L 126 52 Z" fill="url(#cupGradCompact)" stroke="#38bdf8" strokeWidth="2" />
              <ellipse cx="100" cy="60" rx="24" ry="5.5" fill="#5c3a21" stroke="#ca8a04" strokeWidth="1" />
              <ellipse cx="98" cy="60" rx="17" ry="3.5" fill="#a16207" opacity="0.8" />

              <g className="animate-pulse">
                <path d="M 88 50 Q 84 35 90 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                <path d="M 102 48 Q 106 35 100 24" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                <path d="M 112 50 Q 116 36 110 26" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              </g>

              <defs>
                <linearGradient id="cupGradCompact" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
              </defs>
            </svg>

            <div className="mt-0.5 text-center">
              <span className="text-[10.5px] font-mono font-bold text-cyan-300">
                KOPI SIAP DIMINUM
              </span>
              <p className="text-[8.5px] text-slate-400">
                Suhu saji: ±65°C. Ampas mengendap sempurna.
              </p>
            </div>
          </div>
        )}

        {/* STEP 11: Selesai - Protocol Complete */}
        {currentStep === 11 && (
          <div className="flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-emerald-500 rounded-full animate-ping opacity-25" />
              <div className="absolute inset-1 border border-emerald-400 rounded-full animate-hud-spin" />
              <div className="w-11 h-11 rounded-full bg-emerald-950/80 border border-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <Coffee size={22} className="text-emerald-300" />
              </div>
            </div>

            <div className="mt-1 text-[11px] font-mono font-bold text-emerald-300 flex items-center justify-center gap-1">
              <CheckCircle2 size={12} />
              <span>SELESAI // ALGORITMA SUKSES</span>
            </div>
            <p className="text-[8.5px] text-slate-300 max-w-[190px] leading-tight mt-0.5">
              Kopi siap dinikmati! Seluruh langkah alur tuntas.
            </p>
          </div>
        )}
      </div>

      {/* 3. Footer Status Indicators (Compact: ~22px) */}
      <div className="pt-1 border-t border-slate-800/80 shrink-0 text-[9px] font-mono flex items-center justify-between text-slate-400">
        <span className="flex items-center gap-1">
          <Droplets size={9} className="text-cyan-400" />
          <span>TDS: 1.38%</span>
        </span>
        <span className="flex items-center gap-1">
          <Thermometer size={9} className="text-amber-400" />
          <span>{currentStep >= 3 ? '93.5°C' : '28.0°C'}</span>
        </span>
        <span className="flex items-center gap-1">
          <Layers size={9} className="text-violet-400" />
          <span>GULA: {branchDecision.toUpperCase()}</span>
        </span>
      </div>
    </div>
  );
};
