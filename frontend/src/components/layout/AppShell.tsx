'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useHealthStore } from '@/store/health-store';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './DesktopSidebar';
import { HomeScreen } from '@/components/home/HomeScreen';
import { CoachScreen } from '@/components/coach/CoachScreen';
import { TrendsScreen } from '@/components/trends/TrendsScreen';
import { ActivityScreen } from '@/components/activity/ActivityScreen';
import { ProfileScreen } from '@/components/profile/ProfileScreen';

const screens: Record<string, React.ComponentType> = {
  home: HomeScreen,
  coach: CoachScreen,
  trends: TrendsScreen,
  activity: ActivityScreen,
  profile: ProfileScreen,
};

export function AppShell() {
  const activeTab = useHealthStore((s) => s.activeTab);
  const fetchAll = useHealthStore((s) => s.fetchAll);
  const loading = useHealthStore((s) => s.loading);
  const ActiveScreen = screens[activeTab] || HomeScreen;

  // Fetch data on mount
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="relative flex min-h-dvh bg-[var(--bg-primary)] overflow-hidden">
      {/* Mesh gradient background */}
      <div className="mesh-gradient-bg" />

      {/* Desktop sidebar */}
      <DesktopSidebar />

      {/* Main content area */}
      <div className="app-container flex flex-col flex-1 min-h-dvh">
        {/* Active screen */}
        <main className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden safe-bottom no-scrollbar">
          {loading ? (
            <div className="screen-content flex flex-col items-center justify-center gap-4 min-h-[60vh]">
              <motion.div
                className="w-12 h-12 rounded-full border-2 border-t-transparent"
                style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Loading your data...
              </span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="min-h-full"
              >
                <ActiveScreen />
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        {/* Bottom navigation (mobile only) */}
        <BottomNav />
      </div>
    </div>
  );
}
