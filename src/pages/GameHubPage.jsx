import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Gamepad2, BookOpen, Layers, Dices, ExternalLink, Sparkles, CheckCircle2, Rocket } from 'lucide-react';
import { FlashcardGame } from '../components/games/FlashcardGame';
import { MatchingPairsGame } from '../components/games/MatchingPairsGame';
import { WordScrambleGame } from '../components/games/WordScrambleGame';
import { IFrameGameViewer } from '../components/games/iFrameGameViewer';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';

export const GameHubPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || 'flashcard';

  const [activeTab, setActiveTab] = useState(typeParam);

  useEffect(() => {
    if (typeParam) setActiveTab(typeParam);
  }, [typeParam]);

  const tabs = [
    { id: 'flashcard', label: '1. Flashcard Từ Vựng', icon: BookOpen },
    { id: 'matching', label: '2. Trò Chơi Ghép Cặp', icon: Layers },
    { id: 'racing', label: '3. Đua Xe Từ Vựng (Word Scramble)', icon: Dices },
    { id: 'iframe', label: '4. iFrame Game Project', icon: ExternalLink },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* HERO BANNER MATCHING SCREENSHOT 2 */}
      <PageHeroBanner
        title="Sân Trường Tương Tác 🎮"
        subtitle="Bộ sưu tập các trò chơi giáo dục công nghệ cao giúp giờ học sinh động và thú vị hơn. Giáo viên có thể quản lý câu hỏi riêng tư và đồng bộ trực tiếp vào game!"
        badge="SÂN TRƯỜNG TƯƠNG TÁC • HỌC LIỆU SỐ THCS"
        bgGradient="from-slate-900 via-indigo-950 to-slate-900"
        showVipBadge={true}
      />

      {/* 4 MENU CON CORRESPONDING TO 4 GAME MODES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playClick();
                setActiveTab(tab.id);
                setSearchParams({ type: tab.id });
              }}
              className={`p-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/30 scale-102 border border-brand-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Game Content View */}
      <div className="py-2">
        {activeTab === 'flashcard' && <FlashcardGame />}
        {activeTab === 'matching' && <MatchingPairsGame />}
        {activeTab === 'racing' && <WordScrambleGame />}
        {activeTab === 'iframe' && <IFrameGameViewer />}
      </div>

    </div>
  );
};
