import React from 'react';
import { Award, BookOpen, CheckCircle2, Flame, Star, Compass, Trophy } from 'lucide-react';

const ICON_MAP = {
  BookOpen: BookOpen,
  CheckCircle2: CheckCircle2,
  Flame: Flame,
  Star: Star,
  Compass: Compass,
  Trophy: Trophy
};

export const BadgeGrid = ({ badges, userBadgeIds = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {badges.map((b) => {
        const IconComponent = ICON_MAP[b.icon_name] || Award;
        const isUnlocked = userBadgeIds.includes(b.id);

        return (
          <div
            key={b.id}
            className={`glass-card p-5 space-y-3 flex flex-col justify-between border transition-all ${
              isUnlocked
                ? 'border-amber-500/50 bg-slate-900/80 shadow-amber-500/10'
                : 'border-slate-800/80 bg-slate-950/40 opacity-60 grayscale'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-md ${
                  isUnlocked
                    ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <IconComponent className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-100">{b.title}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                  {b.required_stars} Sao
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400">{b.description}</p>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] font-bold">
              {isUnlocked ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  ✓ Đã Đạt Huy Hiệu
                </span>
              ) : (
                <span className="text-slate-500">🔒 Chưa Mở Khóa</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
