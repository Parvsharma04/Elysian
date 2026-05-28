'use client';

import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import { AppShell } from '@/components/layout/AppShell';
import { AuthScreen } from '@/components/auth/AuthScreen';

function AppContent() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!profile) {
    return <AuthScreen />;
  }

  return <AppShell />;
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
