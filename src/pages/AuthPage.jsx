import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../utils/soundEffects';
import { GraduationCap, Mail, Lock, User, UserCheck, KeyRound, Sparkles, AlertCircle } from 'lucide-react';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { loginWithEmail, loginStudentQuick, registerUser, errorMsg } = useAuth();
  
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'teacher' | 'register'
  const [studentCode, setStudentCode] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('student');
  const [regGrade, setRegGrade] = useState('8');
  const [regStudentCode, setRegStudentCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    if (!studentCode || !studentPassword) return;
    setLoading(true);
    setLocalError(null);
    soundFX.playClick();

    const res = await loginStudentQuick(studentCode, studentPassword);
    setLoading(false);
    if (res.success) {
      soundFX.playCorrect();
      navigate('/materials');
    } else {
      soundFX.playWrong();
      setLocalError(res.error);
    }
  };

  const handleTeacherLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setLocalError(null);
    soundFX.playClick();

    const res = await loginWithEmail(email, password);
    setLoading(false);
    if (res.success) {
      soundFX.playCorrect();
      navigate('/materials');
    } else {
      soundFX.playWrong();
      setLocalError(res.error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    soundFX.playClick();

    const res = await registerUser({
      email: regEmail,
      password: regPassword,
      fullName: regFullName,
      role: regRole,
      gradeLevel: regGrade,
      studentCode: regStudentCode
    });

    setLoading(false);
    if (res.success) {
      soundFX.playFanfare();
      setActiveTab('student');
      setLocalError('Đăng ký thành công! Vui lòng đăng nhập.');
    } else {
      soundFX.playWrong();
      setLocalError(res.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 space-y-6 shadow-2xl border-brand-500/30">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">SỔ TAY TIẾNG ANH THCS</h1>
          <p className="text-xs text-slate-400">Khối 6 • 7 • 8 • 9 Global Success</p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('student');
              setLocalError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'student'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Học Sinh
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('teacher');
              setLocalError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'teacher'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Giáo Viên
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('register');
              setLocalError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'register'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Error Alert */}
        {(localError || errorMsg) && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{localError || errorMsg}</span>
          </div>
        )}

        {/* Form 1: Student Quick Login */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mã Học Sinh hoặc Tên Đăng Nhập
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="Ví dụ: hs8a5_01 hoặc email"
                  className="w-full glass-input pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mật Khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input pl-9"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button-accent py-3 font-bold text-slate-950 text-sm"
            >
              {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập Học Sinh 🚀'}
            </button>
          </form>
        )}

        {/* Form 2: Teacher Login */}
        {activeTab === 'teacher' && (
          <form onSubmit={handleTeacherLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Giáo Viên / Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="giaovien@truong.edu.vn"
                  className="w-full glass-input pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mật Khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input pl-9"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button-primary py-3 font-bold text-sm"
            >
              {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập Quản Lý / Giáo Viên'}
            </button>
          </form>
        )}

        {/* Form 3: Register */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Họ và Tên</label>
              <input
                type="text"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full glass-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="hocsinh@gmail.com"
                className="w-full glass-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mật Khẩu</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Mật khẩu tối thiểu 6 ký tự"
                className="w-full glass-input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vai Trò</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full glass-input"
                >
                  <option value="student" className="bg-slate-900">Học Sinh</option>
                  <option value="teacher" className="bg-slate-900">Giáo Viên</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Khối Lớp</label>
                <select
                  value={regGrade}
                  onChange={(e) => setRegGrade(e.target.value)}
                  className="w-full glass-input"
                >
                  <option value="6" className="bg-slate-900">Khối 6</option>
                  <option value="7" className="bg-slate-900">Khối 7</option>
                  <option value="8" className="bg-slate-900">Khối 8</option>
                  <option value="9" className="bg-slate-900">Khối 9</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button-primary py-3 font-bold text-sm mt-2"
            >
              {loading ? 'Đang Tạo Tài Khoản...' : 'Đăng Ký Tài Khoản'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
