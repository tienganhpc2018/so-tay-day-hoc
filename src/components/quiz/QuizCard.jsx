import React from 'react';
import { Clock, CheckCircle2, Eye, Edit3, PlayCircle, BookOpen } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

export const QuizCard = ({ quiz, onStart, onEdit, result, isAssigned = false }) => {
  return (
    <div className="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-brand-500/50 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl font-sans">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
            Khối {quiz.grade_level || 8}
          </span>
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {quiz.time_limit_minutes || 45} phút
          </span>
        </div>

        <h3 className="text-base font-black text-slate-100 group-hover:text-brand-300 transition-colors line-clamp-2">
          {quiz.title}
        </h3>
        {quiz.description && (
          <p className="text-xs text-slate-400 font-bold mt-1 line-clamp-2">{quiz.description}</p>
        )}
      </div>

      {result ? (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-xs text-slate-300 block font-bold">Đã hoàn thành</span>
              <span className="text-sm font-black text-emerald-400">{result.score}/10 ĐT</span>
            </div>
          </div>
          <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-xl">
            +{result.stars_earned || 20} ⭐
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 pt-2">
          {/* NÚT XEM NGAY THAY CHO LÀM BÀI NGHUYÊN BẢN ACCORDING TO USER DIRECTIVE */}
          <button
            onClick={() => {
              soundFX.playClick();
              if (onStart) onStart(quiz);
            }}
            className="flex-1 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-1.5"
          >
            {isAssigned ? (
              <>
                <PlayCircle className="w-4 h-4" /> Làm Bài Ngay
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> Xem Ngay
              </>
            )}
          </button>

          {/* NÚT CHỈNH SỬA NẾU CÒN LỖI ACCORDING TO USER DIRECTIVE */}
          <button
            onClick={() => {
              soundFX.playClick();
              if (onEdit) onEdit(quiz);
            }}
            className="px-3 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-extrabold text-xs shadow flex items-center gap-1"
            title="Chỉnh sửa lại đề thi nếu còn lỗi"
          >
            <Edit3 className="w-4 h-4" /> Sửa
          </button>
        </div>
      )}
    </div>
  );
};
