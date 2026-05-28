'use client';

import { motion } from 'framer-motion';
import { useHealthStore } from '@/store/health-store';
import {
  Home,
  MessageCircle,
  TrendingUp,
  Activity,
  User,
  Zap,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'coach', label: 'Coach', icon: MessageCircle },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'profile', label: 'Profile', icon: User },
];

export function DesktopSidebar() {
  const activeTab = useHealthStore((s) => s.activeTab);
  const setActiveTab = useHealthStore((s) => s.setActiveTab);
  const { profile, signOut } = useAuth();

  return (
    <aside className="desktop-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.12), rgba(123, 97, 255, 0.12))',
            border: '1px solid rgba(0, 212, 255, 0.08)',
          }}
        >
          <Zap size={18} style={{ color: 'var(--accent-primary)' }} />
        </div>
        <div>
          <span className="text-sm font-bold tracking-tight gradient-text">PulseAI</span>
          <span className="block text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
            {profile?.subscription_tier === 'pro' ? 'Pro' : profile?.subscription_tier === 'elite' ? 'Elite' : 'Free'}
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-150 group"
              style={{
                background: isActive ? 'rgba(0, 212, 255, 0.06)' : 'transparent',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-[3px] h-5 rounded-full"
                  style={{ background: 'var(--accent-primary)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={18}
                strokeWidth={isActive ? 2 : 1.5}
                style={{
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                  transition: 'color 150ms',
                }}
              />
              <span
                className="text-sm font-medium"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'color 150ms',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="mt-auto pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        {profile && (
          <div className="flex items-center gap-3 px-2 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: 'var(--gradient-primary)',
                color: '#000',
              }}
            >
              {(profile.display_name || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {profile.display_name || 'User'}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs w-full transition-colors duration-150 hover:bg-[var(--bg-tertiary)]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
