'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const TOKEN_KEY = 'elysian-token';

export interface AuthUserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  profile: AuthUserProfile | null;
  loading: boolean;
  token: string | null;
  signOut: () => void;
  refreshProfile: () => Promise<void>;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  loading: true,
  token: null,
  signOut: () => {},
  refreshProfile: async () => {},
  setToken: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AuthUserProfile | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (jwt?: string) => {
    const t = jwt || token || getStoredToken();
    if (!t) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        // Token expired or invalid
        localStorage.removeItem(TOKEN_KEY);
        setTokenState(null);
        setProfile(null);
      }
    } catch {
      // Backend unavailable
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const stored = getStoredToken();
    if (stored) {
      setTokenState(stored);
      fetchProfile(stored);
    } else {
      // Check for token from OAuth callback in URL
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const callbackToken = params.get('token');
        if (callbackToken) {
          localStorage.setItem(TOKEN_KEY, callbackToken);
          setTokenState(callbackToken);
          fetchProfile(callbackToken);
          // Clean URL
          window.history.replaceState({}, '', window.location.pathname);
          return;
        }
      }
      setLoading(false);
    }
  }, []);

  const handleSetToken = (t: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    setTokenState(t);
    fetchProfile(t);
  };

  const handleSignOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    setTokenState(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        loading,
        token,
        signOut: handleSignOut,
        refreshProfile: () => fetchProfile(),
        setToken: handleSetToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
