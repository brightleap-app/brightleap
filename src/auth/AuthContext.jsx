import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

// Dev-only bypass: type devlogin() in browser console on localhost to unlock all features
const IS_DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const DEV_SESSION_KEY = 'brightleap_dev_login';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [devMode, setDevMode] = useState(() => IS_DEV && localStorage.getItem(DEV_SESSION_KEY) === 'true');

  // Expose dev login to browser console
  useEffect(() => {
    if (IS_DEV) {
      window.devlogin = () => {
        localStorage.setItem(DEV_SESSION_KEY, 'true');
        setDevMode(true);
        console.log('Dev login activated — all features unlocked. Refresh to apply.');
        window.location.reload();
      };
      window.devlogout = () => {
        localStorage.removeItem(DEV_SESSION_KEY);
        setDevMode(false);
        console.log('Dev login deactivated. Refresh to apply.');
        window.location.reload();
      };
    }
  }, []);

  useEffect(() => {
    if (devMode) {
      setProfile({ child_name: 'Elizabeth (Dev)' });
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [devMode]);

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('child_name')
      .eq('id', userId)
      .single();

    setProfile(data);
    setLoading(false);
  }

  async function register(email, password, childName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          child_name: childName,
        },
      },
    });
    if (error) return { error };
    return { data };
  }

  async function loginWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login',
    });
    return { error };
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }

  const value = {
    session,
    profile,
    loading,
    isLoggedIn: !!session || devMode,
    userId: session?.user?.id || null,
    childName: profile?.child_name || null,
    register,
    loginWithEmail,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
