import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../utils/soundEffects';
import { GraduationCap, Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { loginWithEmail, loginStudentQuick, registerUser, errorMsg } = useAuth();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Login State
  const [emailOrCode, setEmailOrCode] = useState('');
  const [password, setPassword] = useState('');

  // Register State (Strictly: Full Name, Email, Password)
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailOrCode || !password) return;
    setLoading(true);
    setLocalError(null);
    soundFX.playClick();

    const res = emailOrCode.includes('@')
      ? await loginWithEmail(emailOrCode, password)
      : await loginStudentQuick(emailOrCode, password);

    setLoading(false);
    if (res.success) {
      soundFX.playCorrect();
      navigate('/');
    } else {
      soundFX.playWrong();
      setLocalError(res.error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !regEmail || !regPassword) return;
    setLoading(true);
    setLocalError(null);
    soundFX.playClick();

    const res = await registerUser({
      fullName,
      email: regEmail,
      password: regPassword
    });

    setLoading(false);
    if (res.success) {
      soundFX.playFanfare();
      setIsRegisterMode(false);
      setEmailOrCode(regEmail);
      setPassword(regPassword);
      setLocalError('Đăng ký thành công! Đang tự động đăng nhập...');
      // Auto login
      await loginWithEmail(regEmail, regPassword);
      navigate('/');
    } else {
      soundFX.playWrong();
      setLocalError(res.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 space-y-6 shadow-2xl border-brand-500/30">
        
        {/* Header Logo & Title (Bỏ dòng Khối 6-9 theo yêu cầu) */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">SỔ TAY DẠY HỌC</h1>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              soundFX.playClick();
              setIsRegisterMode(false);
              setLocalError(null);
            }}
            className={`py-2.5 rounded-lg transition-all ${
              !isRegisterMode
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng Nhập
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setIsRegisterMode(true);
              setLocalError(null);
            }}
            className={`py-2.5 rounded-lg transition-all ${
              isRegisterMode
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Error / Alert Notice */}
        {(localError || errorMsg) && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{localError || errorMsg}</span>
          </div>
        )}

        {/* Form 1: Đăng Nhập (Email hoặc Mã Học Sinh) */}
        {!isRegisterMode ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email hoặc Mã Học Sinh / Tên Đăng Nhập
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={emailOrCode}
                  onChange={(e) => setEmailOrCode(e.target.value)}
                  placeholder="giaovien@gmail.com hoặc hs8a5_01"
                  className="w-full glass-input pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mật Khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button-primary py-3 font-bold text-sm"
            >
              {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập 🚀'}
            </button>
          </form>
        ) : (
          /* Form 2: Đăng Ký (Chỉ đúng 3 trường: Họ tên, Email, Mật khẩu - Bỏ hẳn dropdown Vai Trò & Khối Lớp) */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Họ và Tên</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full glass-input pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full glass-input pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mật Khẩu</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full glass-input pl-9 text-sm"
                  required
                />
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
