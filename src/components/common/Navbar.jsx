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
      icon: Gamepad2
    },
    { 
      path: '/materials', 
      label: 'Thư Mục Học Liệu', 
      icon: BookOpen,
      subMenus: [
        { label: '1. Grammar (Ngữ pháp)', path: '/materials?type=grammar' },
        { label: '2. Vocabulary (Từ vựng)', path: '/materials?type=vocabulary' },
        { label: '3. Audio & Tapescript', path: '/materials?type=audio' },
        { label: '4. Infographic (Trực quan)', path: '/materials?type=infographic' },
        { label: '5. Ý tưởng dạy học', path: '/materials?type=ideas' },
        { label: '6. Tiện ích dạy học', path: '/materials?type=utilities' },
        { label: '7. Phiếu bài tập 4 kỹ năng', path: '/materials?type=worksheet' }
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
      path: '/lop-dao-tao', 
      label: 'Lớp Đào Tạo', 
      icon: GraduationCap
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
          
          {/* Logo Left - Clean 3D Logo Image Only */}
          <Link 
            to="/" 
            onClick={() => soundFX.playClick()}
            className="flex items-center shrink-0 group py-1"
          >
            <img 
              src="/logo.png" 
              alt="Sổ Tay Dạy Học Logo" 
              className="h-12 sm:h-14 w-auto object-contain rounded-2xl group-hover:scale-105 transition-all duration-300" 
            />
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
                    className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 border border-transparent text-slate-300 hover:text-white hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-600/30 hover:border-brand-500/50 ${
                      isActive ? 'text-brand-400 font-black' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-brand-400 group-hover:text-white' : 'text-slate-400 group-hover:text-white'}`} />
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
