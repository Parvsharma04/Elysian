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
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
        >
          <Zap size={16} style={{ color: 'var(--text-primary)' }} />
        </div>
        <div>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Elysian</span>
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
                background: isActive ? 'var(--bg-elevated)' : 'transparent',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-[3px] h-5 rounded-full"
                  style={{ background: 'var(--text-primary)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={18}
                strokeWidth={isActive ? 2 : 1.5}
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
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
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              {(profile.name || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {profile.name || profile.email}
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
