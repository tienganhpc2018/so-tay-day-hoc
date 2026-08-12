import React, { useState } from 'react';
import { ExternalLink, Gamepad2, Layers } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

const SAMPLE_EXTERNAL_GAMES = [
  {
    title: 'Wordwall - Vocabulary Grade 8 Unit 1',
    provider: 'Wordwall',
    url: 'https://wordwall.net/embed/41a1a7b4f5ef4cbfae6d3f25c34e8156',
    desc: 'Trò chơi nối từ vựng và câu trắc nghiệm nhanh trên Wordwall'
  },
  {
    title: 'Quizizz - English Grammar Challenge',
    provider: 'Quizizz',
    url: 'https://quizizz.com/embed/quiz/60c91834927f8a001b97ad89',
    desc: 'Thử thách ngữ pháp Tiếng Anh THCS sống động'
  }
];

export const IFrameGameViewer = () => {
  const [selectedGame, setSelectedGame] = useState(SAMPLE_EXTERNAL_GAMES[0]);

  return (
    <div className="space-y-6">
      {/* Game Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SAMPLE_EXTERNAL_GAMES.map((game, i) => (
          <button
            key={i}
            onClick={() => {
              soundFX.playClick();
              setSelectedGame(game);
            }}
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              selectedGame.title === game.title
                ? 'bg-brand-600/20 border-brand-500 text-white shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{game.title}</h4>
                <p className="text-xs text-slate-400">{game.desc}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-brand-300 uppercase">
              {game.provider}
            </span>
          </button>
        ))}
      </div>

      {/* Embedded iFrame Frame */}
      <div className="w-full h-[600px] glass-panel border-slate-700/80 rounded-2xl overflow-hidden relative shadow-2xl">
        <iframe
          src={selectedGame.url}
          title={selectedGame.title}
          className="w-full h-full border-none"
          allowFullScreen
        />
      </div>
    </div>
  );
};
