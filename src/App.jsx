import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { AuthPage } from './pages/AuthPage';
import { MaterialPage } from './pages/MaterialPage';
import { QuizPage } from './pages/QuizPage';
import { GameHubPage } from './pages/GameHubPage';
import { BehaviorPage } from './pages/BehaviorPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { AlertTriangle } from 'lucide-react';

const ProtectedRoute = ({ children, teacherOnly = false, adminOnly = false }) => {
  const { user, profile, loading, isTeacher, isAdmin, isLocked } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm font-semibold">
        Đang khởi động hệ thống Sổ Tay Tiếng Anh THCS...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

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

  if (teacherOnly && !isTeacher) {
    return <Navigate to="/materials" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/materials" replace />;
  }

  return children;
};

const DashboardRouter = () => {
  const { isTeacher, isAdmin } = useAuth();
  if (isAdmin) return <AdminDashboard />;
  if (isTeacher) return <TeacherDashboard />;
  return <StudentDashboard />;
};

export const AppContent = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pb-16">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardRouter />
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

      <footer className="py-6 border-t border-slate-800 text-center text-xs text-slate-500 bg-slate-950">
        <p>© 2026 Sổ Tay Dạy Học Tiếng Anh THCS (Khối 6, 7, 8, 9) • Global Success Curriculum</p>
      </footer>
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
