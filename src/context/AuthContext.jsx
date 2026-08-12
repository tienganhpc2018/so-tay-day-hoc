import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch full profile from Supabase DB
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Profile fetch exception:', err);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        const userProfile = await fetchUserProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const userProfile = await fetchUserProfile(session.user.id);
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

      // Check account status
      if (data?.user) {
        const userProfile = await fetchUserProfile(data.user.id);
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
      // Map username or student code to formatted email domain
      const formattedEmail = identifier.includes('@') 
        ? identifier 
        : `${identifier.trim().toLowerCase()}@student.sotay.edu.vn`;

      return await loginWithEmail(formattedEmail, password);
    } catch (err) {
      setErrorMsg(err.message);
      return { success: false, error: err.message };
    }
  };

  // Register New Account
  const registerUser = async ({ email, password, fullName, role = 'student', gradeLevel = 8, studentCode = '', username = '' }) => {
    setErrorMsg(null);
    try {
      const finalEmail = email || `${username.trim().toLowerCase()}@student.sotay.edu.vn`;
      
      const { data, error } = await supabase.auth.signUp({
        email: finalEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            grade_level: parseInt(gradeLevel, 10),
            student_code: studentCode || username,
            username: username || studentCode
          }
        }
      });

      if (error) throw error;
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

  // Refresh profile details (e.g. after earning stars or badge)
  const refreshProfile = async () => {
    if (user?.id) {
      const updatedProfile = await fetchUserProfile(user.id);
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
    isAdmin: profile?.role === 'admin',
    isTeacher: profile?.role === 'teacher' || profile?.role === 'admin',
    isStudent: profile?.role === 'student',
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
