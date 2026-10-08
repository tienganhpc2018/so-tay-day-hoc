import React from 'react';
import { Sparkles, Crown } from 'lucide-react';

export const PageHeroBanner = ({ 
  title, 
  subtitle, 
  badge = 'SỔ TAY DẠY HỌC THCS • GLOBAL SUCCESS', 
  bgImage = null,
  showVipBadge = false,
  actions = null
}) => {
  // Reliable high-res AI education image fallbacks
  const defaultImages = {
    school: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1600&auto=format&fit=crop',
    playground: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop',
    library: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop'
  };

  const finalBgImage = bgImage || defaultImages.school;

  return (
    <div className="relative rounded-[24px] overflow-hidden border-2 border-emerald-500/40 shadow-md transition-all duration-300 font-sans min-h-[140px] sm:min-h-[160px] flex flex-col justify-center bg-transparent group">
      
      {/* 1. BACKGROUND IMAGE (Soft & Clear) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={finalBgImage} 
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-30"
          onError={(e) => {
            e.currentTarget.src = defaultImages.school;
          }}
        />
        
        {/* 2. LIGHT TRANSPARENT OVERLAY (NO BLACK) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/40 pointer-events-none" />
      </div>

      {/* Soft highlight */}
      <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/50 via-emerald-50/20 to-transparent z-0" />

      {/* 3. Banner Text Content */}
      <div className="relative z-10 p-5 sm:p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          
          {badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 text-emerald-800 border border-emerald-400 text-xs font-black uppercase tracking-wider shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {badge}
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-bold">
            {subtitle}
          </p>

          {actions && (
            <div className="pt-1">
              {actions}
            </div>
          )}

        </div>

        {showVipBadge && (
          <div className="shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-amber-100/90 border-2 border-amber-400 text-amber-900 font-black text-xs flex items-center gap-2 shadow-md backdrop-blur-md">
              <Crown className="w-4 h-4 fill-amber-500 text-amber-600" />
              <span>👑 Đặc quyền VIP Giáo Viên</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
