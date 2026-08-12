import React from 'react';
import { HelpCircle, Clock, Award, PlayCircle, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

export const QuizCard = ({ quiz, onTakeQuiz, userResult }) => {
  return (
    <div className="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-brand-500/50">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
            Khối {quiz.grade_level}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {quiz.time_limit_minutes || 15} phút
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
          {quiz.title}
        </h3>
        {quiz.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{quiz.description}</p>
        )}
      </div>

      {userResult ? (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-xs text-slate-300 block">Đã hoàn thành</span>
              <span className="text-sm font-extrabold text-emerald-400">{userResult.score}/10 ĐT</span>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg">
            +{userResult.stars_earned} Sao
          </span>
        </div>
      ) : (
        <button
          onClick={() => {
            soundFX.playClick();
            onTakeQuiz(quiz);
          }}
          className="w-full glass-button-primary py-2.5 text-sm font-bold"
        >
          <PlayCircle className="w-4 h-4" />
          Làm Bài Kiểm Tra
        </button>
      )}
    </div>
  );
};
