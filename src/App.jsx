import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { MaterialPage } from './pages/MaterialPage';
import { QuizPage } from './pages/QuizPage';
import { GameHubPage } from './pages/GameHubPage';
import { BehaviorPage } from './pages/BehaviorPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { WorksheetPage } from './pages/WorksheetPage';
import { ExamTestingPage } from './pages/ExamTestingPage';
import { ClassTrainingPage } from './pages/ClassTrainingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AlertTriangle, GraduationCap, MessageCircle } from 'lucide-react';

const ProtectedRoute = ({ children, teacherOnly = false, adminOnly = false }) => {
  const { isLocked } = useAuth();

  if (isLocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="glass-panel p-8 max-w-md text-center border-rose-500/40 space-y-4">
          <AlertTriangle className="w-16 h-16 text-rose-400 mx-auto animate-bounce" />
          <h2 className="text-xl font-bold text-white">Tài Khoản Đang Bị Tạm Khóa</h2>
          <p className="text-xs text-slate-300">
            Tài khoản học sinh của em hiện đang bị Tạm khóa bởi Giáo viên/Admin. Vui lòng liên hệ Giáo viên bộ môn Tiếng Anh để được mở khóa lại.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export const AppContent = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      <Navbar />
      
      <main className="flex-1 pb-16">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/materials"
            element={
              <ProtectedRoute>
                <MaterialPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quizzes"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam-testing"
            element={
              <ProtectedRoute>
                <ExamTestingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <GameHubPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/behavior"
            element={
              <ProtectedRoute>
                <BehaviorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lop-dao-tao"
            element={
              <ProtectedRoute>
                <ClassTrainingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/worksheet"
            element={
              <ProtectedRoute>
                <ClassTrainingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute teacherOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* FOOTER MATCHING SCREENSHOT 3 (CHÍNH XÁC VỚI THÔNG TIN CỦA THẦY) */}
      <footer className="py-8 px-6 border-t border-slate-800 bg-slate-950 text-xs text-slate-400">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 whitespace-nowrap">
          
          {/* Footer Brand & Subtitle Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-slate-200 text-sm">
                Sổ Tay Dạy Học THCS -:- Giáo dục công nghệ 4.0
              </p>
              <p className="text-[11px] text-slate-400">
                Nền tảng chia sẻ và trao đổi học liệu số, thiết bị dạy học tự làm chất lượng cao (Khối 6, 7, 8, 9 Global Success).
              </p>
            </div>
          </div>

          {/* Footer Copyright Right */}
          <div className="text-slate-400 font-semibold text-xs">
            © 2026 SỔ TAY DẠY HỌC THCS. Tất cả quyền được bảo lưu.
          </div>

        </div>
      </footer>

      {/* FLOATING ACTION CHAT BUBBLE (BOTTOM RIGHT - MATCHING SCREENSHOT 3) */}
      <button 
        onClick={() => alert('Kết nối hỗ trợ trực tiếp với Giáo viên bộ môn!')}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/50 transition-all hover:scale-110 active:scale-95 border-2 border-indigo-400/40"
        title="Hỗ trợ & Gửi phản hồi"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
