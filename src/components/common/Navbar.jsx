import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { soundFX } from '../../utils/soundEffects';
import { 
  BookOpen, 
  Gamepad2, 
  HelpCircle, 
  Award, 
  Users, 
  Star, 
  LogOut, 
  Volume2, 
  VolumeX, 
  Shield, 
  UserCheck, 
  GraduationCap,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { profile, logout, isTeacher, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(soundFX.isMuted());

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    soundFX.setMuted(nextState);
    if (!nextState) soundFX.playClick();
  };

  const navItems = [
    { path: '/materials', label: 'Thư Mục Học Liệu', icon: BookOpen },
    { path: '/quizzes', label: 'Ngân Hàng Đề Thi', icon: HelpCircle },
    { path: '/games', label: 'Kho Trò Chơi', icon: Gamepad2 },
    { path: '/behavior', label: 'Sổ Nề Nếp', icon: UserCheck, teacherOnly: false },
    { path: '/leaderboard', label: 'Bảng Xếp Hạng', icon: Award },
  ];

  if (isTeacher || isAdmin) {
    navItems.push({ path: '/admin', label: 'Quản Lý Lớp & SV', icon: Users, teacherOnly: true });
  }

  const handleLogout = async () => {
    soundFX.playClick();
    await logout();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link 
            to="/" 
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-brand-400">
                SỔ TAY TIẾNG ANH THCS
              </span>
              <span className="hidden md:block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Khối 6 • 7 • 8 • 9 • Global Success
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => soundFX.playClick()}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all active:scale-95"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
            </button>

            {/* Stars Counter for Student */}
            {profile && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse-fast" />
                <span>{profile.total_stars || 0} Sao</span>
              </div>
            )}

            {/* User Profile info */}
            {profile ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-100 max-w-[120px] truncate">
                    {profile.full_name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-800 text-brand-400 border border-slate-700">
                    {profile.role === 'admin' ? 'Quản trị' : profile.role === 'teacher' ? 'Giáo viên' : `Học sinh K${profile.grade_level || 8}`}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-800/60 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/30 transition-all active:scale-95"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="glass-button-primary text-xs px-4 py-2"
              >
                Đăng nhập
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Nav bar bottom */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800 bg-slate-900/95">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => soundFX.playClick()}
              className={`flex flex-col items-center gap-0.5 text-[11px] font-medium ${
                isActive ? 'text-brand-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
