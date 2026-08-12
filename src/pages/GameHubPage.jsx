import React, { useState } from 'react';
import { Gamepad2, BookOpen, Layers, Dices, ExternalLink } from 'lucide-react';
import { FlashcardGame } from '../components/games/FlashcardGame';
import { MatchingPairsGame } from '../components/games/MatchingPairsGame';
import { WordScrambleGame } from '../components/games/WordScrambleGame';
import { IFrameGameViewer } from '../components/games/iFrameGameViewer';
import { soundFX } from '../utils/soundEffects';

export const GameHubPage = () => {
  const [activeTab, setActiveTab] = useState('flashcard');

  const tabs = [
    { id: 'flashcard', label: 'Flashcard Từ Vựng', icon: BookOpen },
    { id: 'matching', label: 'Nối Từ Đồng Nghĩa', icon: Layers },
    { id: 'scramble', label: 'Sắp Xếp Câu', icon: Dices },
    { id: 'iframe', label: 'Game Nhúng iFrame', icon: ExternalLink },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 border-brand-500/30">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Gamepad2 className="w-7 h-7 text-amber-400" />
            Kho Trò Chơi Tiếng Anh Tương Tác (English Game Hub)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Vừa học vừa chơi! Học từ vựng, ghép câu và tích lũy Sao thưởng danh giá.
          </p>
        </div>
      </div>

      {/* Game Mode Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playClick();
                setActiveTab(tab.id);
              }}
              className={`p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Game Content View */}
      <div className="py-4">
        {activeTab === 'flashcard' && <FlashcardGame />}
        {activeTab === 'matching' && <MatchingPairsGame />}
        {activeTab === 'scramble' && <WordScrambleGame />}
        {activeTab === 'iframe' && <IFrameGameViewer />}
      </div>

    </div>
  );
};
