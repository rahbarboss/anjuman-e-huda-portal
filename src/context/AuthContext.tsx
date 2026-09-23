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
  // If Supabase is configured, login status must be verified by Supabase session rather than blind localStorage
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (isSupabaseConfigured) return false;
    return localStorage.getItem('anjuman_admin_logged') === 'true';
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    if (isSupabaseConfigured) return null;
    const saved = localStorage.getItem('anjuman_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'site' | 'admin'>('site');

  const [logoClickCount, setLogoClickCount] = useState<number>(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Helper: Check whether authenticated user possesses admin privileges in public.admin_profiles
   */
  const verifyAdminProfile = async (userId: string): Promise<{ authorized: boolean; fullName?: string }> => {
    if (!supabase) return { authorized: false };
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('id, role, full_name')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data && (data.role === 'admin' || data.role === 'superadmin')) {
        return { authorized: true, fullName: data.full_name || undefined };
      }
      return { authorized: false };
    } catch {
      return { authorized: false };
    }
  };

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

  // Restore and synchronize Supabase Auth session across browser refreshes
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(async ({ data, error }) => {
        if (!error && data?.session?.user) {
          const verification = await verifyAdminProfile(data.session.user.id);
          if (verification.authorized) {
            setIsAdminLoggedIn(true);
            const user: AdminUser = {
              username: verification.fullName || data.session.user.email || 'Administrator',
              role: 'Central Union Administrator',
            };
            setAdminUser(user);
            localStorage.setItem('anjuman_admin_logged', 'true');
            localStorage.setItem('anjuman_admin_user', JSON.stringify(user));
            localStorage.setItem('anjuman_supabase_session', 'true');
          } else {
            setIsAdminLoggedIn(false);
            setAdminUser(null);
            localStorage.removeItem('anjuman_admin_logged');
            localStorage.removeItem('anjuman_admin_user');
            localStorage.removeItem('anjuman_supabase_session');
          }
        } else {
          setIsAdminLoggedIn(false);
          setAdminUser(null);
          localStorage.removeItem('anjuman_admin_logged');
          localStorage.removeItem('anjuman_admin_user');
          localStorage.removeItem('anjuman_supabase_session');
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const verification = await verifyAdminProfile(session.user.id);
          if (verification.authorized) {
            setIsAdminLoggedIn(true);
            const user: AdminUser = {
              username: verification.fullName || session.user.email || 'Administrator',
              role: 'Central Union Administrator',
            };
            setAdminUser(user);
            localStorage.setItem('anjuman_admin_logged', 'true');
            localStorage.setItem('anjuman_admin_user', JSON.stringify(user));
            localStorage.setItem('anjuman_supabase_session', 'true');
          } else {
            setIsAdminLoggedIn(false);
            setAdminUser(null);
            localStorage.removeItem('anjuman_admin_logged');
            localStorage.removeItem('anjuman_admin_user');
            localStorage.removeItem('anjuman_supabase_session');
          }
        } else {
          setIsAdminLoggedIn(false);
          setAdminUser(null);
          localStorage.removeItem('anjuman_admin_logged');
          localStorage.removeItem('anjuman_admin_user');
          localStorage.removeItem('anjuman_supabase_session');
        }
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // 1. Production Path: Supabase Auth
      if (isSupabaseConfigured && supabase) {
        const email = username.includes('@')
          ? username.trim()
          : (username.trim() === 'admin' || username.trim() === 'anjuman'
              ? 'admin@anjumanehuda.org'
              : `${username.trim()}@anjumanehuda.org`);

        const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (supaError) {
          return {
            success: false,
            message: supaError.message || 'Authentication failed. Please verify your credentials.',
          };
        }

        if (!supaData?.user) {
          return { success: false, message: 'Authentication failed. No user session returned.' };
        }

        // Verify that user is officially granted administrator rights in public.admin_profiles
        const verification = await verifyAdminProfile(supaData.user.id);
        if (!verification.authorized) {
          await supabase.auth.signOut();
          return {
            success: false,
            message: 'Access Denied: Authenticated user is not registered as an administrator in admin_profiles.',
          };
        }

        setIsAdminLoggedIn(true);
        const user: AdminUser = {
          username: verification.fullName || supaData.user.email || username,
          role: 'Central Union Administrator',
        };
        setAdminUser(user);
        localStorage.setItem('anjuman_admin_logged', 'true');
        localStorage.setItem('anjuman_admin_user', JSON.stringify(user));
        localStorage.setItem('anjuman_supabase_session', 'true');
        setIsLoginModalOpen(false);
        setActiveView('admin');
        return { success: true };
      }

      // 2. Offline / Local Development Fallback (only when Supabase is not configured)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdminLoggedIn(true);
        const user = data.user || { username: 'Administrator', role: 'Central Union Administrator' };
        setAdminUser(user);
        localStorage.setItem('anjuman_admin_logged', 'true');
        localStorage.setItem('anjuman_admin_user', JSON.stringify(user));
        setIsLoginModalOpen(false);
        setActiveView('admin');
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Invalid credentials.' };
      }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Authentication service unavailable.' };
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
    localStorage.removeItem('anjuman_supabase_session');
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
