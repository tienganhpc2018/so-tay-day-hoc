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
import { AiTeachingAssistantWidget } from './components/common/AiTeachingAssistantWidget';
import { AlertTriangle, GraduationCap, MessageCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("LMS Error Boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50 text-slate-900 font-sans">
          <div className="bg-white p-8 rounded-3xl max-w-lg w-full text-center border border-slate-200 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Đã Xảy Ra Lỗi Khởi Tạo Giao Diện</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hệ thống đã tự động bảo vệ dữ liệu. Thầy/Cô vui lòng nhấp vào nút bên dưới để tải lại trang hoặc reset bộ nhớ tạm.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('lms_classes_v1');
                    localStorage.removeItem('lms_assignments_v1');
                    localStorage.removeItem('lms_lessons_v1');
                    localStorage.removeItem('lms_submissions_v1');
                  } catch (e) {}
                  window.location.reload();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow hover:bg-emerald-700"
              >
                🔄 Tự Động Khôi Phục & Tải Lại Trang
              </button>
              <button
                onClick={() => {
                  try { localStorage.clear(); } catch (e) {}
                  window.location.href = '/admin';
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-extrabold text-xs hover:bg-slate-300"
              >
                🧹 Xóa Toàn Bộ Cache & Thử Lại
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ProtectedRoute = ({ children, teacherOnly = false, adminOnly = false }) => {
  const { isLocked, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-600">Đang khởi tạo hệ thống...</p>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="glass-panel p-8 max-w-md text-center border-rose-500/40 space-y-4">
          <AlertTriangle className="w-16 h-16 text-rose-400 mx-auto animate-bounce" />
          <h2 className="text-xl font-bold text-slate-900">Tài Khoản Đang Bị Tạm Khóa</h2>
          <p className="text-xs text-slate-600">
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
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative">
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
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
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

      {/* FOOTER EMERALD GREEN THEME */}
      <footer className="py-8 px-6 border-t border-emerald-800 bg-emerald-900 text-xs text-emerald-100">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 whitespace-nowrap">
          
          {/* Footer Brand & Subtitle Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">
                Sổ Tay Dạy Học THCS -:- Giáo dục công nghệ 4.0
              </p>
              <p className="text-[11px] text-emerald-200">
                Nền tảng chia sẻ và trao đổi học liệu số, thiết bị dạy học tự làm chất lượng cao (Khối 6, 7, 8, 9 Global Success).
              </p>
            </div>
          </div>

          {/* Footer Copyright Right */}
          <div className="text-emerald-200 font-semibold text-xs">
            © 2026 SỔ TAY DẠY HỌC THCS. Tất cả quyền được bảo lưu.
          </div>

        </div>
      </footer>

      {/* FLOATING AI TEACHING ASSISTANT CHATBOT (BOTTOM RIGHT) */}
      <AiTeachingAssistantWidget />

    </div>
    </ErrorBoundary>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
