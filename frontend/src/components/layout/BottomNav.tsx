'use client';

import { motion } from 'framer-motion';
import { useHealthStore } from '@/store/health-store';
import {
  Home,
  MessageCircle,
  TrendingUp,
  Activity,
  User,
} from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'coach', label: 'Coach', icon: MessageCircle },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const activeTab = useHealthStore((s) => s.activeTab);
  const setActiveTab = useHealthStore((s) => s.setActiveTab);

  return (
    <nav
      className="mobile-nav fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      {/* Frosted glass background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'var(--glass-bg-strong)',
          backdropFilter: 'blur(28px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      />

      <div className="relative flex items-center justify-around px-1 h-[var(--nav-height)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`nav-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Active glow */}
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute -top-1 w-10 h-10 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Active dot indicator */}
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -top-0.5 w-1 h-1 rounded-full"
                  style={{ background: 'var(--accent-primary)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <motion.div
                animate={{ scale: isActive ? 1 : 0.95 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.2 : 1.5}
                  style={{
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                    transition: 'color 200ms',
                  }}
                />
              </motion.div>
              <span
                className="text-[9px] font-semibold tracking-wide"
                style={{
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                  transition: 'color 200ms',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
