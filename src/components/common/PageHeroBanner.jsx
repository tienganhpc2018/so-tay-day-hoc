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
    <div className="relative rounded-[32px] overflow-hidden border-2 border-brand-500/50 shadow-2xl transition-all duration-300 font-sans min-h-[240px] flex flex-col justify-center bg-slate-950 group">
      
      {/* 1. CRYSTAL CLEAR BACKGROUND IMAGE (100% Sharp) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={finalBgImage} 
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.currentTarget.src = defaultImages.school;
          }}
        />
        
        {/* 2. ONLY 20% DARK GRADIENT OVERLAY ON LEFT TO KEEP TEXT READABLE WHILE IMAGE REMAINS FULLY VISIBLE */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-slate-950/20 pointer-events-none" />
      </div>

      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-brand-500/10 to-transparent z-0" />

      {/* 3. Banner Text Content */}
      <div className="relative z-10 p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/85 text-brand-300 border border-brand-500/60 text-xs font-black uppercase tracking-wider shadow-xl backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-brand-400" />
              {badge}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-bold drop-shadow-md">
            {subtitle}
          </p>

          {actions && (
            <div className="pt-2">
              {actions}
            </div>
          )}

        </div>

        {showVipBadge && (
          <div className="shrink-0">
            <div className="px-6 py-3.5 rounded-2xl bg-amber-500/40 border-2 border-amber-400 text-amber-200 font-black text-sm flex items-center gap-2.5 shadow-2xl backdrop-blur-md animate-pulse">
              <Crown className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>👑 Đặc quyền VIP Giáo Viên</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
