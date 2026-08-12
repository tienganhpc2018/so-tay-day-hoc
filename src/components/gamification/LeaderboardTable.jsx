import React from 'react';
import { Trophy, Star, Medal, Award } from 'lucide-react';

export const LeaderboardTable = ({ students }) => {
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-400/30">
            <Trophy className="w-4 h-4" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 font-black flex items-center justify-center shadow-md">
            2
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-600 text-white font-black flex items-center justify-center shadow-md">
            3
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-xs">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="p-6 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Bảng Xếp Hạng Ngôi Sao Thành Tích
          </h3>
          <p className="text-xs text-slate-400">Tôn vinh những học sinh chăm chỉ nhất</p>
        </div>
      </div>

      <div className="divide-y divide-slate-800/60">
        {students.map((student, idx) => (
          <div
            key={student.id}
            className={`p-4 flex items-center justify-between transition-colors ${
              idx === 0 ? 'bg-amber-500/5' : 'hover:bg-slate-900/40'
            }`}
          >
            <div className="flex items-center gap-4">
              {getRankBadge(idx + 1)}
              <div>
                <h4 className="font-bold text-sm text-slate-100">{student.full_name}</h4>
                <span className="text-xs text-slate-400">Khối {student.grade_level || 8} • {student.student_code || '8A5'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 font-black text-sm border border-amber-500/30">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{student.total_stars || 0} Sao</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
