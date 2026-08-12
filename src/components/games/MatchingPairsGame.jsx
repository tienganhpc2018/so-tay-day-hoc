import React, { useState, useEffect } from 'react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const PAIRS = [
  { id: 1, english: 'Create', vietnamese: 'Tạo ra, sáng tạo' },
  { id: 2, english: 'Equipment', vietnamese: 'Trang thiết bị' },
  { id: 3, english: 'Pressure', vietnamese: 'Áp lực' },
  { id: 4, english: 'Volunteer', vietnamese: 'Tình nguyện viên' },
  { id: 5, english: 'Healthy', vietnamese: 'Lành mạnh, khỏe mạnh' },
];

export const MatchingPairsGame = () => {
  const { profile, refreshProfile } = useAuth();
  const [cards, setCards] = useState([]);
  const [selectedFirst, setSelectedFirst] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const list = [];
    PAIRS.forEach(p => {
      list.push({ cardId: `${p.id}-en`, pairId: p.id, text: p.english, type: 'en' });
      list.push({ cardId: `${p.id}-vi`, pairId: p.id, text: p.vietnamese, type: 'vi' });
    });
    // Shuffle
    setCards(list.sort(() => Math.random() - 0.5));
    setSelectedFirst(null);
    setMatchedIds([]);
    setScore(0);
  };

  const handleCardClick = async (card) => {
    if (matchedIds.includes(card.pairId) || selectedFirst?.cardId === card.cardId) return;

    soundFX.playClick();

    if (!selectedFirst) {
      setSelectedFirst(card);
    } else {
      // Check match
      if (selectedFirst.pairId === card.pairId && selectedFirst.type !== card.type) {
        soundFX.playCorrect();
        const newMatched = [...matchedIds, card.pairId];
        setMatchedIds(newMatched);
        setScore(prev => prev + 20);

        if (newMatched.length === PAIRS.length) {
          soundFX.playFanfare();
          confetti({ particleCount: 100, spread: 70 });
          if (profile?.id) {
            await supabase.from('profiles').update({
              total_stars: (profile.total_stars || 0) + 20
            }).eq('id', profile.id);
            await refreshProfile();
          }
        }
      } else {
        soundFX.playWrong();
      }
      setSelectedFirst(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Nối Từ Tiếng Anh & Nghĩa Tiếng Việt</h2>
          <p className="text-xs text-slate-400">Chọn 1 ô Tiếng Anh và 1 ô Tiếng Việt tương ứng</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/30">
            Điểm: {score}
          </span>
          <button
            onClick={() => {
              soundFX.playClick();
              initGame();
            }}
            className="glass-button-secondary text-xs px-3 py-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Chơi Lại
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {cards.map((c) => {
          const isMatched = matchedIds.includes(c.pairId);
          const isSelected = selectedFirst?.cardId === c.cardId;

          return (
            <button
              key={c.cardId}
              onClick={() => handleCardClick(c)}
              disabled={isMatched}
              className={`h-28 p-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center text-center shadow-lg ${
                isMatched
                  ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-300 opacity-60 scale-95'
                  : isSelected
                  ? 'bg-brand-600 border-2 border-amber-400 text-white scale-105 shadow-brand-500/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 hover:border-brand-500/50 hover:scale-105'
              }`}
            >
              {c.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};
