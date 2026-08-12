import React from 'react';
import { Sparkles, Crown } from 'lucide-react';

export const PageHeroBanner = ({ 
  title, 
  subtitle, 
  badge = 'SỔ TAY DẠY HỌC THCS • GLOBAL SUCCESS', 
  bgGradient = 'from-slate-950 via-slate-900/95 to-slate-900/80',
  bgImage = null,
  showVipBadge = false,
  actions = null
}) => {
  return (
    <div className="relative rounded-[32px] overflow-hidden border-2 border-brand-500/40 p-8 sm:p-12 shadow-2xl transition-all duration-300 font-sans min-h-[240px] flex flex-col justify-center bg-slate-950 group">
      
      {/* 1. Fully Visible Background Image Container */}
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={bgImage} 
            alt={title}
            className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              // Fallback to stylized gradient if image path fails
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Text backdrop gradient overlay for 100% text contrast while leaving image bright on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40 pointer-events-none" />
        </div>
      )}

      {/* Decorative Radial Glowing Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500 via-indigo-500 to-transparent z-0" />

      {/* 2. Banner Text Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-3xl">
          
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-950/90 text-brand-300 border border-brand-500/60 text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-brand-400" />
              {badge}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-semibold drop-shadow">
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
            <div className="px-6 py-3.5 rounded-2xl bg-amber-500/30 border-2 border-amber-400 text-amber-300 font-black text-sm flex items-center gap-2.5 shadow-2xl backdrop-blur-md animate-pulse">
              <Crown className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>👑 Đặc quyền VIP Giáo Viên</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
