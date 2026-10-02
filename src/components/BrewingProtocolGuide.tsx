import React from 'react';
import { X, Coffee, CheckCircle2, AlertCircle } from 'lucide-react';

interface BrewingProtocolGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrewingProtocolGuide: React.FC<BrewingProtocolGuideProps> = ({
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
            <Coffee className="text-cyan-400" size={20} />
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-100 font-display">
                Manual Panduan Menyeduh Kopi (SOP Protokol)
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Standard Operating Procedure: Tubruk / Immersion Extraction
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

        {/* Steps Detailed SOP */}
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
              01
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">
                Langkah 1: Persiapan Alat & Bahan (Input)
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Siapkan cangkir tahan panas (kapasitas 200–250ml), sendok pengaduk, bubuk kopi berkualitas (gilingan medium-fine), air mineral berkualitas, dan gula pasir murni jika diinginkan.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3">
            <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
              02
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">
                Langkah 2: Pemanasan Air ke Suhu Presisi (±90–95°C)
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Rebus air hingga mendidih (100°C), lalu diamkan selama 30–60 detik hingga suhu stabil di rentang optimal 90–95°C. Suhu ini ideal untuk mengekstraksi cita rasa manis dan asam buah alami tanpa mengekstrak kepahitan berlebih (over-extraction).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3">
            <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
              03
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">
                Langkah 3: Dosis Bubuk Kopi & Penuangan Air
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Masukkan 14–15 gram bubuk kopi ke dalam cangkir. Tuangkan 200–220 ml air panas secara melingkar dan perlahan agar seluruh bubuk terbasahi dengan sempurna.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3">
            <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
              04
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">
                Langkah 4: Pengadukan & Percabangan Gula
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Aduk merata selama 15–20 detik. Kemudian pada tahap percabangan:
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-300 pl-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-violet-400" />
                  <span><strong>Cabang "Ya":</strong> Tambahkan 1–2 sendok teh gula pasir, lalu aduk kembali hingga seluruh kristal gula larut sempurna.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-amber-400" />
                  <span><strong>Cabang "Tidak":</strong> Lewati penambahan gula untuk menikmati profil rasa asli single origin kopi hitam murni (Americano / Black Tubruk).</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
              05
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">
                Langkah 5: Kopi Siap Diminum (Output & Selesai)
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Tunggu 3–4 menit agar ampas bubuk kopi mengendap ke dasar cangkir dan suhu turun ke temperatur santap yang nyaman (sekitar 60–65°C). Kopi siap dinikmati!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
