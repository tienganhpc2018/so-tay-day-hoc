import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, UserCheck, HelpCircle, Users, Upload, Dices, Award, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export const TeacherDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Banner */}
      <div className="glass-panel p-8 relative overflow-hidden border-brand-500/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Bảng Điều Khiển Giảng Dạy • Tiếng Anh THCS
          </div>
          <h1 className="text-3xl font-black text-white">
            Kính chào <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-300">{profile?.full_name || 'Thầy/Cô'}</span>! 🎓
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Quản lý học liệu cây thư mục, cập nhật nề nếp thời gian thực, điều hành ngân hàng câu hỏi kiểm tra và quay số tương tác lớp học.
          </p>
        </div>
      </div>

      {/* Quick Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/behavior"
          onClick={() => soundFX.playClick()}
          className="glass-panel p-6 space-y-4 border-emerald-500/40 hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <UserCheck className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">Sổ Thực Chiến</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300">Quản Lý Nề Nếp & Gọi Tên 🎲</h3>
            <p className="text-xs text-slate-400 mt-1">Cộng/trừ điểm phát biểu, tuyên dương và quay số ngẫu nhiên gọi tên học sinh.</p>
          </div>
        </Link>

        <Link
          to="/materials"
          onClick={() => soundFX.playClick()}
          className="glass-panel p-6 space-y-4 border-brand-500/40 hover:border-brand-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-brand-500/20 text-brand-400">
              <Upload className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg">Cây Học Liệu</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-brand-300">Tải Lên Bài Giảng & Học Liệu</h3>
            <p className="text-xs text-slate-400 mt-1">Quản lý tệp PDF, PPTX, video và link iFrame game tương tác cho Khối 6-9.</p>
          </div>
        </Link>

        <Link
          to="/quizzes"
          onClick={() => soundFX.playClick()}
          className="glass-panel p-6 space-y-4 border-amber-500/40 hover:border-amber-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
              <HelpCircle className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">Đề Kiểm Tra</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300">Ngân Hàng Đề Thi & Chấm Điểm</h3>
            <p className="text-xs text-slate-400 mt-1">Xem thống kê kết quả làm bài trắc nghiệm và điểm số thời gian thực của học sinh.</p>
          </div>
        </Link>
      </div>

    </div>
  );
};
