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
      {/* Solid background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      />

      <div className="relative flex items-center justify-around w-full h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-[1px] w-5 h-[2px] rounded-full"
                  style={{ background: 'var(--accent-primary)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <Icon
                size={20}
                strokeWidth={isActive ? 2 : 1.5}
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  transition: 'color 150ms',
                }}
              />
              <span
                className="text-[9px] font-medium"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  transition: 'color 150ms',
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
