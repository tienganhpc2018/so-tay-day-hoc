import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Gamepad2, HelpCircle, Award, Star, Flame, Sparkles, UserCheck } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export const StudentDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-8 relative overflow-hidden border-brand-500/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Góc Học Tập Cá Nhân • Khối {profile?.grade_level || 8}
          </div>
          <h1 className="text-3xl font-black text-white">
            Chào mừng em, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{profile?.full_name || 'Học Sinh'}</span>! 👋
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Sẵn sàng chinh phục môn Tiếng Anh hôm nay chưa? Hãy khám phá cây học liệu, làm quiz tích sao và tham gia các trò chơi từ vựng thú vị!
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-6 flex items-center gap-4 border-amber-500/30">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Tổng Sao Đạt Được</span>
            <span className="text-2xl font-black text-white">{profile?.total_stars || 0} Sao</span>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 border-rose-500/30">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-rose-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Chuỗi Ngày Học</span>
            <span className="text-2xl font-black text-white">7 Ngày 🔥</span>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 border-emerald-500/30">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Huy Hiệu Sở Hữu</span>
            <span className="text-2xl font-black text-white">3 Huy Hiệu</span>
          </div>
        </div>
      </div>

      {/* Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/materials"
          onClick={() => soundFX.playClick()}
          className="glass-card p-6 space-y-3 hover:border-brand-500 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white group-hover:text-brand-300">Cây Thư Mục Học Liệu</h3>
          <p className="text-xs text-slate-400">Xem giáo án, bài giảng PDF, video Tiếng Anh THCS.</p>
        </Link>

        <Link
          to="/quizzes"
          onClick={() => soundFX.playClick()}
          className="glass-card p-6 space-y-3 hover:border-indigo-500 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white group-hover:text-indigo-300">Bài Kiểm Tra & Quiz</h3>
          <p className="text-xs text-slate-400">Làm trắc nghiệm, điền từ tích Sao thưởng.</p>
        </Link>

        <Link
          to="/games"
          onClick={() => soundFX.playClick()}
          className="glass-card p-6 space-y-3 hover:border-amber-500 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white group-hover:text-amber-300">Kho Trò Chơi Tiếng Anh</h3>
          <p className="text-xs text-slate-400">Flashcards, Ghép từ, Xếp câu vui nhộn.</p>
        </Link>

        <Link
          to="/behavior"
          onClick={() => soundFX.playClick()}
          className="glass-card p-6 space-y-3 hover:border-emerald-500 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white group-hover:text-emerald-300">Sổ Nề Nếp Học Sinh</h3>
          <p className="text-xs text-slate-400">Theo dõi điểm cộng, điểm danh & tuyên dương.</p>
        </Link>
      </div>

    </div>
  );
};
