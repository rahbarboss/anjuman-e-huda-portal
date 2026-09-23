import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminUser {
  username: string;
  role: string;
}

interface AuthContextType {
  isAdminLoggedIn: boolean;
  adminUser: AdminUser | null;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  activeView: 'site' | 'admin';
  setActiveView: (view: 'site' | 'admin') => void;
  logoClickCount: number;
  handleLogoClick: () => void;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('anjuman_admin_logged') === 'true';
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('anjuman_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'site' | 'admin'>(() => {
    return localStorage.getItem('anjuman_admin_logged') === 'true' ? 'admin' : 'site';
  });

  const [logoClickCount, setLogoClickCount] = useState<number>(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    // 1. If currently in admin view, return directly to site/home view
    if (activeView === 'admin') {
      setActiveView('site');
    }

    // 2. Set hash to home so page router switches to home
    if (typeof window !== 'undefined') {
      window.location.hash = 'home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 3. Keep secret 5-click admin modal trigger
    if (!isAdminLoggedIn) {
      setLogoClickCount((prev) => {
        const next = prev + 1;
        if (next >= 5) {
          setIsLoginModalOpen(true);
          return 0;
        }
        return next;
      });

      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      clickTimerRef.current = setTimeout(() => {
        setLogoClickCount(0);
      }, 2500);
    }
  };

  useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    };
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // 1. If Supabase is configured and input looks like an email or Supabase is preferred
      if (isSupabaseConfigured && supabase) {
        const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({
          email: username.includes('@') ? username : `${username}@anjumanehuda.org`,
          password,
        });

        if (!supaError && supaData.user) {
          setIsAdminLoggedIn(true);
          const user = {
            username: supaData.user.email || username,
            role: 'Central Union Administrator',
          };
          setAdminUser(user);
          localStorage.setItem('anjuman_admin_logged', 'true');
          localStorage.setItem('anjuman_admin_user', JSON.stringify(user));
          setIsLoginModalOpen(false);
          setActiveView('admin');
          return { success: true };
        }
      }

      // 2. Standard backend check
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdminLoggedIn(true);
        const user = data.user || { username: 'anjuman', role: 'Central Union Administrator' };
        setAdminUser(user);
        localStorage.setItem('anjuman_admin_logged', 'true');
        localStorage.setItem('anjuman_admin_user', JSON.stringify(user));
        setIsLoginModalOpen(false);
        setActiveView('admin');
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Invalid credentials.' };
      }
    } catch (err) {
      // Local fallback for offline/preview robustness
      if (username === 'anjuman' && password === 'anjuman2026') {
        setIsAdminLoggedIn(true);
        const user = { username: 'anjuman', role: 'Central Union Administrator' };
        setAdminUser(user);
        localStorage.setItem('anjuman_admin_logged', 'true');
        localStorage.setItem('anjuman_admin_user', JSON.stringify(user));
        setIsLoginModalOpen(false);
        setActiveView('admin');
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials. Required: anjuman / anjuman2026' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signout warning:', err);
      }
    }
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('anjuman_admin_logged');
    localStorage.removeItem('anjuman_admin_user');
    setActiveView('site');
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminLoggedIn,
        adminUser,
        isLoginModalOpen,
        setIsLoginModalOpen,
        activeView,
        setActiveView,
        logoClickCount,
        handleLogoClick,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
