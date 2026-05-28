'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function AuthScreen() {
  const { setToken } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogle = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/login';
      const body: Record<string, string> = { email, password };
      if (mode === 'signup' && name.trim()) body.name = name.trim();

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Authentication failed. Please try again.');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="mesh-gradient-bg" />

      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 70%)',
          top: '15%',
          left: '10%',
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.01) 0%, transparent 70%)',
          bottom: '20%',
          right: '5%',
        }}
        animate={{ scale: [1.05, 0.95, 1.05], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="auth-card relative z-10"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <motion.div
          className="flex flex-col items-center gap-4 mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
            }}
          >
            <Zap size={24} style={{ color: 'var(--text-primary)' }} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Elysian</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Your private health journal
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Google sign in */}
          <button
            onClick={handleGoogle}
            disabled={isLoading}
            className="auth-btn auth-btn-secondary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
          </div>

          {/* Email + Password form */}
          <div className="flex flex-col gap-3">
            {mode === 'signup' && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="auth-input"
                disabled={isLoading}
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="auth-input"
              disabled={isLoading}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Password (min 6 characters)"
              className="auth-input"
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={!email.trim() || !password.trim() || isLoading}
              className="auth-btn auth-btn-primary"
              style={{ opacity: email.trim() && password.trim() ? 1 : 0.5 }}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {mode === 'signup' ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="text-xs text-center" style={{ color: 'var(--color-danger)' }}>
              {error}
            </p>
          )}

          {/* Toggle mode */}
          <p className="text-xs text-center mt-2" style={{ color: 'var(--text-secondary)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="font-medium"
              style={{ color: 'var(--accent-primary)' }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>

        <p className="text-[10px] text-center mt-8 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
          <br />
          Elysian is not medical advice. Always consult healthcare professionals.
        </p>
      </motion.div>
    </div>
  );
}
