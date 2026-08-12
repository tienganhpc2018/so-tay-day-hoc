import React, { useState } from 'react';
import { Volume2, RotateCw, CheckCircle, ArrowRight, ArrowLeft, Star, Sparkles } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const SAMPLE_VOCAB = [
  { word: 'Schoolyard', type: 'n', mean: 'Sân trường', example: 'Students are playing football in the schoolyard.' },
  { word: 'Equipment', type: 'n', mean: 'Trang thiết bị', example: 'The modern laboratory has advanced science equipment.' },
  { word: 'Creative', type: 'adj', mean: 'Sáng tạo', example: 'She has many creative ideas for the English project.' },
  { word: 'Countryside', type: 'n', mean: 'Miền quê, nông thôn', example: 'Life in the countryside is quiet and peaceful.' },
  { word: 'Volunteer', type: 'v/n', mean: 'Tình nguyện viên', example: 'They volunteer to clean up the local park every weekend.' },
  { word: 'Craftsman', type: 'n', mean: 'Thợ thủ công', example: 'The local craftsman makes famous ceramic vases.' },
  { word: 'Pressure', type: 'n', mean: 'Áp lực', example: 'Students learn coping skills to manage exam pressure.' },
];

export const FlashcardGame = ({ onRewardStars }) => {
  const { profile, refreshProfile } = useAuth();
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState({});

  const currentItem = SAMPLE_VOCAB[index];

  const handleFlip = () => {
    soundFX.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleSpeech = (text) => {
    soundFX.playClick();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMarkMastered = async () => {
    soundFX.playCorrect();
    setMastered(prev => ({ ...prev, [index]: true }));

    // Award 5 stars if mastered all
    if (Object.keys(mastered).length + 1 === SAMPLE_VOCAB.length) {
      confetti({ particleCount: 100, spread: 70 });
      soundFX.playFanfare();
      if (profile?.id) {
        await supabase.from('profiles').update({
          total_stars: (profile.total_stars || 0) + 15
        }).eq('id', profile.id);
        await refreshProfile();
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
        <span>Thẻ {index + 1} / {SAMPLE_VOCAB.length}</span>
        <span className="flex items-center gap-1 text-amber-400 font-bold">
          <Star className="w-4 h-4 fill-amber-400" />
          Đã thuộc: {Object.keys(mastered).length} từ
        </span>
      </div>

      {/* Flashcard Box */}
      <div
        onClick={handleFlip}
        className="w-full h-80 glass-panel p-8 cursor-pointer flex flex-col items-center justify-center text-center relative transition-all duration-500 transform hover:scale-[1.02] border-brand-500/30 group shadow-2xl"
      >
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSpeech(currentItem.word);
            }}
            title="Nghe phát âm chuẩn AI"
            className="p-2 rounded-full bg-brand-500/20 text-brand-400 hover:bg-brand-500/40 transition-colors"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {!isFlipped ? (
          <div className="space-y-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-brand-400 uppercase tracking-wider">
              {currentItem.type}
            </span>
            <h2 className="text-4xl font-extrabold text-white group-hover:text-brand-300 transition-colors">
              {currentItem.word}
            </h2>
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <RotateCw className="w-3.5 h-3.5" /> Chạm để xem nghĩa Tiếng Việt
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-3xl font-bold text-amber-400">{currentItem.mean}</h3>
            <p className="text-sm text-slate-300 italic max-w-md">"{currentItem.example}"</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            soundFX.playClick();
            setIsFlipped(false);
            setIndex(prev => Math.max(0, prev - 1));
          }}
          disabled={index === 0}
          className="glass-button-secondary text-sm px-4 py-2.5"
        >
          <ArrowLeft className="w-4 h-4" /> Từ Trước
        </button>

        <button
          onClick={handleMarkMastered}
          disabled={mastered[index]}
          className={`glass-button-accent text-sm px-5 py-2.5 ${mastered[index] ? 'opacity-50' : ''}`}
        >
          <CheckCircle className="w-4 h-4" />
          {mastered[index] ? 'Đã Thuộc Từ Này' : 'Đánh Dấu Đã Thuộc (+15 Sao)'}
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setIsFlipped(false);
            setIndex(prev => Math.min(SAMPLE_VOCAB.length - 1, prev + 1));
          }}
          disabled={index === SAMPLE_VOCAB.length - 1}
          className="glass-button-primary text-sm px-4 py-2.5"
        >
          Từ Tiếp <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
