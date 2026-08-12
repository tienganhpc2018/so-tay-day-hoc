import React from 'react';
import { PlusCircle, MinusCircle, Star, ThumbsUp, UserCheck, UserX } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

export const StudentBehaviorCard = ({ student, isTeacher, onLogBehavior }) => {
  return (
    <div className="glass-card p-4 flex flex-col justify-between space-y-3 hover:border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md text-sm">
            {student.full_name ? student.full_name.charAt(0) : 'S'}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">{student.full_name}</h4>
            <span className="text-[11px] text-slate-400">Mã: {student.student_code || 'HS8A5'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 font-extrabold text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{student.total_stars || 0} Sao</span>
        </div>
      </div>

      {/* Teacher Direct Quick Actions */}
      {isTeacher && (
        <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => {
              soundFX.playCorrect();
              onLogBehavior(student, 'plus', 1, 'Hăng hái phát biểu trong giờ Tiếng Anh');
            }}
            title="Cộng điểm phát biểu"
            className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundFX.playWrong();
              onLogBehavior(student, 'minus', 1, 'Mất trật tự / Chưa làm bài tập về nhà');
            }}
            title="Trừ điểm vi phạm"
            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-all active:scale-95"
          >
            <MinusCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundFX.playFanfare();
              onLogBehavior(student, 'praise', 2, 'Tuyên dương bài tập xuất sắc');
            }}
            title="Tuyên dương học sinh"
            className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 flex items-center justify-center transition-all active:scale-95"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onLogBehavior(student, 'attendance', 0, 'Điểm danh có mặt');
            }}
            title="Điểm danh"
            className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 flex items-center justify-center transition-all active:scale-95"
          >
            <UserCheck className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
