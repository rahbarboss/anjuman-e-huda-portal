import { createClient } from '@supabase/supabase-js';

// Read Vite environment variables or localStorage credentials
const getStoredUrl = () => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('anjuman_supabase_url') || '';
    }
  } catch {}
  return '';
};

const getStoredKey = () => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('anjuman_supabase_key') || '';
    }
  } catch {}
  return '';
};

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim() || getStoredUrl();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim() || getStoredKey();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project-id')
);

// Initialize Supabase client if configured, otherwise provide null
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
