import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Helper: Create default active profile if DB row missing
  const ensureProfile = async (authUser) => {
    if (!authUser) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data) return data;

      // Auto detect admin / teacher from email or metadata
      const isTeacherEmail = authUser.email && (
        authUser.email.includes('teacher') || 
        authUser.email.includes('giaovien') || 
        authUser.email.includes('onlineteaching') ||
        !authUser.email.endsWith('@student.sotay.edu.vn')
      );

      const defaultRole = isTeacherEmail ? 'teacher' : 'student';
      const fullName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Người Dùng';

      const newProfile = {
        id: authUser.id,
        email: authUser.email,
        full_name: fullName,
        role: authUser.user_metadata?.role || defaultRole,
        status: 'active',
        grade_level: authUser.user_metadata?.grade_level || 8,
        total_stars: 0
      };

      const { data: upsertData, error: upsertErr } = await supabase
        .from('profiles')
        .upsert([newProfile])
        .select('*')
        .single();

      if (upsertErr) {
        console.warn('Upsert profile notice:', upsertErr);
        return newProfile;
      }
      return upsertData;
    } catch (err) {
      console.error('ensureProfile exception:', err);
      return {
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.email?.split('@')[0] || 'Người Dùng',
        role: 'teacher',
        status: 'active',
        grade_level: 8,
        total_stars: 0
      };
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        const userProfile = await ensureProfile(session.user);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const userProfile = await ensureProfile(session.user);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Standard Email Login
  const loginWithEmail = async (email, password) => {
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data?.user) {
        const userProfile = await ensureProfile(data.user);
        if (userProfile && userProfile.status === 'locked') {
          await supabase.auth.signOut();
          const lockedError = 'Tài khoản của bạn hiện đang bị TẠM KHÓA bởi Giáo viên/Admin. Vui lòng liên hệ để được hỗ trợ.';
          setErrorMsg(lockedError);
          return { success: false, error: lockedError };
        }
        setProfile(userProfile);
      }
      return { success: true, data };
    } catch (err) {
      const msg = err.message === 'Invalid login credentials' 
        ? 'Sai thông tin email hoặc mật khẩu.' 
        : err.message || 'Đăng nhập thất bại.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }
  };

  // Student Quick Login (Username / Student Code)
  const loginStudentQuick = async (identifier, password) => {
    setErrorMsg(null);
    try {
      const formattedEmail = identifier.includes('@') 
        ? identifier 
        : `${identifier.trim().toLowerCase()}@student.sotay.edu.vn`;

      return await loginWithEmail(formattedEmail, password);
    } catch (err) {
      setErrorMsg(err.message);
      return { success: false, error: err.message };
    }
  };

  // Register New Account (Simplified: FullName, Email, Password)
  const registerUser = async ({ fullName, email, password }) => {
    setErrorMsg(null);
    try {
      // Auto assign role: teacher if email doesn't end with student domain, or teacher/admin email
      const isTeacherEmail = email && (
        email.includes('teacher') || 
        email.includes('giaovien') || 
        email.includes('onlineteaching') ||
        !email.endsWith('@student.sotay.edu.vn')
      );
      const role = isTeacherEmail ? 'teacher' : 'student';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            status: 'active',
            grade_level: 8
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        await ensureProfile(data.user);
      }

      return { success: true, data };
    } catch (err) {
      setErrorMsg(err.message);
      return { success: false, error: err.message };
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user?.id) {
      const updatedProfile = await ensureProfile(user);
      setProfile(updatedProfile);
    }
  };

  const value = {
    user,
    profile,
    loading,
    errorMsg,
    loginWithEmail,
    loginStudentQuick,
    registerUser,
    logout,
    refreshProfile,
    isAdmin: profile?.role === 'admin' || profile?.email?.includes('onlineteaching'),
    isTeacher: profile?.role === 'teacher' || profile?.role === 'admin' || profile?.email?.includes('onlineteaching'),
    isStudent: profile?.role === 'student' && !profile?.email?.includes('onlineteaching'),
    isLocked: profile?.status === 'locked'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
