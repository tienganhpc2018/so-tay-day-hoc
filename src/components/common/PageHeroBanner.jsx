import React from 'react';
import { Sparkles, Crown } from 'lucide-react';

export const PageHeroBanner = ({ 
  title, 
  subtitle, 
  badge = 'SỔ TAY DẠY HỌC THCS • GLOBAL SUCCESS', 
  bgGradient = 'from-slate-900 via-indigo-950 to-slate-900',
  bgImage = null,
  showVipBadge = false,
  actions = null
}) => {
  return (
    <div className={`relative rounded-[32px] overflow-hidden bg-gradient-to-r ${bgGradient} border border-brand-500/40 p-8 sm:p-12 shadow-2xl transition-all duration-300 font-sans`}>
      
      {/* Background Image Overlay if provided */}
      {bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}

      {/* Decorative Radial Backdrop */}
      <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-400 via-indigo-500 to-transparent" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-3xl">
          
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-400" />
              {badge}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
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
            <div className="px-6 py-3.5 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 text-amber-300 font-black text-sm flex items-center gap-2.5 shadow-xl backdrop-blur-md animate-pulse">
              <Crown className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>👑 Đặc quyền VIP Giáo Viên</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
