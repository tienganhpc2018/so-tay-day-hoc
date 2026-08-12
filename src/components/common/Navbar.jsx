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
  GraduationCap,
  Home,
  FileCheck,
  ChevronDown,
  Zap
} from 'lucide-react';

export const Navbar = () => {
  const { profile, logout, isTeacher, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(soundFX.isMuted());
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    soundFX.setMuted(nextState);
    if (!nextState) soundFX.playClick();
  };

  const handleLogout = async () => {
    soundFX.playClick();
    await logout();
    navigate('/auth');
  };

  const navItems = [
    { 
      path: '/', 
      label: 'Trang chủ', 
      icon: Home 
    },
    { 
      path: '/games', 
      label: 'Sân trường', 
      icon: Gamepad2,
      subMenus: [
        { label: '1. Flashcard Từ Vựng', path: '/games?type=flashcard' },
        { label: '2. Trò Chơi Ghép Cặp', path: '/games?type=matching' },
        { label: '3. Đua Xe Từ Vựng', path: '/games?type=racing' },
        { label: '4. iFrame Game Project', path: '/games?type=iframe' }
      ]
    },
    { 
      path: '/materials', 
      label: 'Thư Mục Học Liệu', 
      icon: BookOpen,
      subMenus: [
        { label: '1. Grammar (Ngữ pháp)', path: '/materials?type=grammar' },
        { label: '2. Vocabulary (Từ vựng)', path: '/materials?type=vocabulary' },
        { label: '3. Infographic (Trực quan)', path: '/materials?type=infographic' },
        { label: '4. Ý tưởng dạy học', path: '/materials?type=ideas' }
      ]
    },
    { 
      path: '/quizzes', 
      label: 'Ngân Hàng Đề Thi', 
      icon: HelpCircle,
      subMenus: [
        { label: 'Đề Thi Khối 6', path: '/quizzes?grade=6' },
        { label: 'Đề Thi Khối 7', path: '/quizzes?grade=7' },
        { label: 'Đề Thi Khối 8', path: '/quizzes?grade=8' },
        { label: 'Đề Thi Khối 9', path: '/quizzes?grade=9' }
      ]
    },
    { 
      path: '/exam-testing', 
      label: 'Thi Thử', 
      icon: Zap,
      subMenus: [
        { label: 'Thi Thử Khối 6', path: '/exam-testing?grade=6' },
        { label: 'Thi Thử Khối 7', path: '/exam-testing?grade=7' },
        { label: 'Thi Thử Khối 8', path: '/exam-testing?grade=8' },
        { label: 'Thi Thử Khối 9', path: '/exam-testing?grade=9' }
      ]
    },
    { 
      path: '/worksheet', 
      label: 'Kiểm Tra & Đánh Giá', 
      icon: FileCheck,
      subMenus: [
        { label: '1. Listening (Nghe hiểu)', path: '/worksheet?sec=listening' },
        { label: '2. Speaking (Nói & Chấm AI)', path: '/worksheet?sec=speaking' },
        { label: '3. Reading (Đọc hiểu)', path: '/worksheet?sec=reading' },
        { label: '4. Writing (Viết & Chấm AI)', path: '/worksheet?sec=writing' }
      ]
    },
    { 
      path: '/behavior', 
      label: 'Sổ Nề Nếp', 
      icon: Users,
      subMenus: [
        { label: 'Năm học 2025 - 2026', path: '/behavior?year=2025-2026' },
        { label: 'Năm học 2026 - 2027', path: '/behavior?year=2026-2027' }
      ]
    },
    { 
      path: '/leaderboard', 
      label: 'Bảng Xếp Hạng', 
      icon: Star 
    },
  ];

  if (isTeacher || isAdmin) {
    navItems.push({ path: '/admin', label: 'Quản Lý Lớp & SV', icon: Users });
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Left */}
          <Link 
            to="/" 
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-brand-400 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all duration-300">
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

          {/* Navigation Links Center */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const hasSubMenus = item.subMenus && item.subMenus.length > 0;

              return (
                <div 
                  key={item.path} 
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.path)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.path}
                    onClick={() => soundFX.playClick()}
                    className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 border border-brand-500/50 scale-105'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {hasSubMenus && <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform" />}
                    </div>
                    <span className="whitespace-nowrap leading-none">{item.label}</span>
                  </Link>

                  {/* Dropdown Sub-menu Modal */}
                  {hasSubMenus && activeDropdown === item.path && (
                    <div className="absolute top-full left-0 mt-1 w-60 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 space-y-1 animate-fadeIn">
                      {item.subMenus.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          to={sub.path}
                          onClick={() => {
                            soundFX.playClick();
                            setActiveDropdown(null);
                          }}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                        >
                          <span>{sub.label}</span>
                          <span className="text-[10px] text-indigo-400 font-mono">→</span>
                        </Link>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleSound}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
            </button>

            {profile && (
              <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{profile.total_stars || 0} Sao</span>
              </div>
            )}

            {profile ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-extrabold text-white max-w-[130px] truncate">
                    {profile.full_name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {profile.role === 'admin' ? 'Quản trị VIP' : profile.role === 'teacher' ? 'Giáo viên VIP' : `Học sinh K${profile.grade_level || 8}`}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/30 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg">
                ➔ Đăng nhập
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
