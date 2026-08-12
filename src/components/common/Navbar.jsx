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
  Sparkles,
  Home,
  FileCheck
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
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/materials', label: 'Thư Mục Học Liệu', icon: BookOpen },
    { path: '/quizzes', label: 'Ngân Hàng Đề Thi', icon: HelpCircle },
    { path: '/worksheet', label: 'Kiểm Tra & Đánh Giá', icon: FileCheck },
    { path: '/games', label: 'Kho Trò Chơi', icon: Gamepad2 },
    { path: '/behavior', label: 'Sổ Nề Nếp', icon: UserCheck },
    { path: '/leaderboard', label: 'Bảng Xếp Hạng', icon: Star },
  ];

  if (isTeacher || isAdmin) {
    navItems.push({ path: '/admin', label: 'Quản Lý Lớp & SV', icon: Users });
  }

  const handleLogout = async () => {
    soundFX.playClick();
    await logout();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Left (ETA Logo style matching Screenshot 1 & 4) */}
          <Link 
            to="/" 
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-all duration-300">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                SỔ TAY DẠY HỌC THCS
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  ETA 4.0
                </span>
              </span>
              <span className="text-[11px] text-slate-400 font-semibold tracking-wider">
                Khối 6 • 7 • 8 • 9 • Global Success
              </span>
            </div>
          </Link>

          {/* Navigation Links Center (Top Icon + Bottom Label, WHITESPACE NOWRAP - NEVER WRAPS TO VERTICAL LINES!) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 overflow-x-auto no-scrollbar py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => soundFX.playClick()}
                  className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 border border-brand-500/50 scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap leading-none">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all active:scale-95"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
            </button>

            {/* Stars Counter for Student */}
            {profile && (
              <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse-fast" />
                <span>{profile.total_stars || 0} Sao</span>
              </div>
            )}

            {/* User Profile info & Logout */}
            {profile ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-extrabold text-white max-w-[130px] truncate">
                    {profile.full_name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {profile.role === 'admin' ? 'Quản trị VIP' : profile.role === 'teacher' ? 'Giáo viên VIP' : `Học sinh K${profile.grade_level || 8}`}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/30 transition-all active:scale-95"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-600/30 transition-all"
              >
                ➔ Đăng nhập
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Nav bar bottom */}
      <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-800 bg-slate-900/95 overflow-x-auto no-scrollbar">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => soundFX.playClick()}
              className={`flex flex-col items-center gap-0.5 text-[11px] font-bold whitespace-nowrap px-2 ${
                isActive ? 'text-brand-400' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
