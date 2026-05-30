'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { auth } from '@/lib/firebase';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import 'firebaseui/dist/firebaseui.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function AuthScreen() {
  const { setToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const startFirebaseUI = async () => {
      try {
        const firebaseui = await import('firebaseui');
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
        
        const uiConfig = {
          signInFlow: 'popup',
          signInOptions: [
            EmailAuthProvider.PROVIDER_ID,
            GoogleAuthProvider.PROVIDER_ID,
          ],
          callbacks: {
            signInSuccessWithAuthResult: (authResult: any) => {
              authResult.user.getIdToken().then(async (idToken: string) => {
                setIsLoading(true);
                setError('');
                try {
                  const res = await fetch(`${API_BASE}/auth/firebase`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken }),
                  });

                  if (res.ok) {
                    const data = await res.json();
                    setToken(data.access_token);
                  } else {
                    const data = await res.json().catch(() => ({}));
                    setError(data.message || 'Verification with backend failed.');
                    auth.signOut();
                  }
                } catch (e) {
                  setError('Connection to backend failed.');
                  auth.signOut();
                } finally {
                  setIsLoading(false);
                }
              });
              return false; // Prevent automatic redirect
            },
          },
          credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        };

        ui.start('#firebaseui-auth-container', uiConfig);
      } catch (err) {
        console.error('Failed to initialize FirebaseUI:', err);
      }
    };

    startFirebaseUI();
  }, [setToken]);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@elysian.app', password: 'demo123' }),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
      } else {
        setError('Failed to log into Demo Sandbox.');
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
            className="flex items-center justify-center w-12 h-12 rounded-md"
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
          {isLoading && (
            <div className="flex flex-col items-center justify-center my-4 gap-2">
              <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Securing your session...</p>
            </div>
          )}

          <div id="firebaseui-auth-container" className={isLoading ? 'hidden' : 'my-2'} />

          {error && (
            <p className="text-xs text-center" style={{ color: 'var(--color-danger)' }}>
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-3 text-xs rounded-md border border-dashed text-secondary hover:text-primary transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            style={{
              borderColor: 'var(--border-strong)',
              background: 'rgba(255,255,255,0.01)',
              color: 'var(--text-secondary)'
            }}
          >
            ⚡ Try Demo Sandbox (Skip Sign-in)
          </button>
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
