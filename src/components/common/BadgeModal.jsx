import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

export const BadgeModal = ({ isOpen, onClose, badge }) => {
  useEffect(() => {
    if (isOpen && badge) {
      soundFX.playFanfare();
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, badge]);

  if (!isOpen || !badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md glass-panel p-8 text-center border-amber-500/40 relative overflow-hidden shadow-2xl">
        {/* Glow effect background */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-5">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
            <Award className="w-10 h-10 text-slate-950" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Chúc mừng em đã nhận Huy Hiệu Mới!
            </div>
            <h2 className="text-2xl font-extrabold text-white">{badge.title}</h2>
            <p className="text-sm text-slate-300 mt-2">{badge.description}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center gap-3">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-slate-200">
              Cần {badge.required_stars} Sao thành tích
            </span>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="w-full glass-button-accent py-3 font-bold text-slate-950 text-base"
          >
            Tuyệt Vời! Tiếp Tục Học Tập 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
