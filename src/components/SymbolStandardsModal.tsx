import React from 'react';
import { X, BookOpen, Layers } from 'lucide-react';
import { LEGEND_ITEMS } from '../data/flowchartData';

interface SymbolStandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SymbolStandardsModal: React.FC<SymbolStandardsModalProps> = ({
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
            <Layers className="text-cyan-400" size={20} />
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-100 font-display">
                ISO 5807 / ANSI Flowchart Standard Reference
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Standardized Information Processing & Procedural Notation
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

        {/* Symbols Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {LEGEND_ITEMS.map((item) => (
            <div
              key={item.type}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-100 font-display">
                    {item.nameId} ({item.nameEn})
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${item.colorTheme.badgeBg} ${item.colorTheme.text} font-bold`}>
                    {item.roleId}
                  </span>
                </div>

                <div className="my-3 flex items-center gap-4">
                  <div className="w-16 h-10 flex items-center justify-center rounded-lg bg-black/40 border border-slate-700/60 shrink-0">
                    {item.type === 'terminator' && (
                      <div className="w-12 h-6 rounded-full border-2 border-emerald-400 bg-emerald-500/20" />
                    )}
                    {item.type === 'process' && (
                      <div className="w-12 h-6 rounded-sm border-2 border-violet-400 bg-violet-500/20" />
                    )}
                    {item.type === 'input_output' && (
                      <div className="w-12 h-6 -skew-x-12 border-2 border-cyan-400 bg-cyan-500/20" />
                    )}
                    {item.type === 'decision' && (
                      <div className="w-6 h-6 rotate-45 border-2 border-amber-400 bg-amber-500/25" />
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {item.shapeDescription}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.type === 'terminator' &&
                    'Menandakan titik awal (Mulai) atau akhir (Selesai) dari suatu alur program atau prosedur.'}
                  {item.type === 'process' &&
                    'Menyatakan kegiatan atau tindakan eksekusi pengolahan yang dilakukan oleh manusia atau mesin.'}
                  {item.type === 'input_output' &&
                    'Menyatakan proses masukan (input alat dan bahan) atau pengeluaran hasil (output kopi yang siap diminum).'}
                  {item.type === 'decision' &&
                    'Menunjukkan kondisi percabangan logika dengan minimal dua pilihan jalan keluar (misal: Ya dan Tidak).'}
                </p>
              </div>
            </div>
          ))}

          {/* Arrow Flow Line Item */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-100 font-display">
                Alur Proses / Flowline (Vector Panjang Panah)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-bold">
                ISO 5807 Vector
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Garis alir berpanah menunjukkan arah runtutan proses dari satu langkah ke langkah berikutnya. Dalam representasi holografis kami, garis ini digambarkan sebagai aliran energi digital (streams of digital energy) yang membawa muatan data antar node secara sekuensial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
