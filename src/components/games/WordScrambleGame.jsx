import React, { useState, useEffect } from 'react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const SENTENCES = [
  { original: 'My new school has a modern laboratory.', words: ['My', 'new', 'school', 'has', 'a', 'modern', 'laboratory.'] },
  { original: 'Students learn coping skills to manage stress.', words: ['Students', 'learn', 'coping', 'skills', 'to', 'manage', 'stress.'] },
  { original: 'We should protect local environment and crafts.', words: ['We', 'should', 'protect', 'local', 'environment', 'and', 'crafts.'] },
];

export const WordScrambleGame = () => {
  const { profile, refreshProfile } = useAuth();
  const [level, setLevel] = useState(0);
  const [scrambled, setScrambled] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentTask = SENTENCES[level];

  useEffect(() => {
    initLevel();
  }, [level]);

  const initLevel = () => {
    if (!currentTask) return;
    const shuffled = [...currentTask.words].sort(() => Math.random() - 0.5);
    setScrambled(shuffled);
    setSelectedWords([]);
    setIsCorrect(false);
  };

  const handleWordClick = (word, index) => {
    soundFX.playClick();
    setSelectedWords(prev => [...prev, word]);
    setScrambled(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveWord = (word, index) => {
    soundFX.playClick();
    setScrambled(prev => [...prev, word]);
    setSelectedWords(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckAnswer = async () => {
    const userSentence = selectedWords.join(' ');
    if (userSentence === currentTask.original) {
      soundFX.playFanfare();
      confetti({ particleCount: 90, spread: 60 });
      setIsCorrect(true);

      if (profile?.id) {
        await supabase.from('profiles').update({
          total_stars: (profile.total_stars || 0) + 10
        }).eq('id', profile.id);
        await refreshProfile();
      }
    } else {
      soundFX.playWrong();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Sắp Xếp Từ Thành Câu Hoàn Chỉnh</h2>
          <p className="text-xs text-slate-400">Câu {level + 1} / {SENTENCES.length}</p>
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            initLevel();
          }}
          className="glass-button-secondary text-xs px-3 py-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Luyện Lại
        </button>
      </div>

      {/* Result Drop Zone */}
      <div className="glass-panel p-6 min-h-[120px] flex flex-wrap items-center gap-2 border-brand-500/40">
        {selectedWords.length === 0 ? (
          <span className="text-xs text-slate-500 italic">Chạm vào các thẻ từ phía dưới để xếp thành câu hoàn chỉnh...</span>
        ) : (
          selectedWords.map((word, i) => (
            <button
              key={i}
              onClick={() => handleRemoveWord(word, i)}
              className="px-3.5 py-2 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-md hover:bg-rose-600 transition-colors animate-fadeIn"
            >
              {word}
            </button>
          ))
        )}
      </div>

      {/* Available Word Bank */}
      <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-wrap gap-2.5">
        {scrambled.map((word, i) => (
          <button
            key={i}
            onClick={() => handleWordClick(word, i)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 transition-all hover:scale-105"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Action Check */}
      <div className="flex justify-between items-center pt-2">
        {isCorrect ? (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            Chính xác tuyệt vời! (+10 Sao)
          </div>
        ) : (
          <div />
        )}

        {isCorrect && level < SENTENCES.length - 1 ? (
          <button
            onClick={() => {
              soundFX.playClick();
              setLevel(prev => prev + 1);
            }}
            className="glass-button-primary text-sm px-5 py-2.5"
          >
            Câu Tiếp Theo <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedWords.length === 0}
            className="glass-button-accent text-sm px-6 py-2.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Kiểm Tra Đáp Án
          </button>
        )}
      </div>
    </div>
  );
};
