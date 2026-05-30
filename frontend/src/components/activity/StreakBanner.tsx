'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakBannerProps {
  days: number;
}

export function StreakBanner({ days }: StreakBannerProps) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-md p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 171, 0, 0.12), rgba(255, 82, 82, 0.08))',
        border: '1px solid rgba(255, 171, 0, 0.15)',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-md animate-pulse-glow"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 171, 0, 0.2), rgba(255, 82, 82, 0.2))',
            }}
          >
            <Flame size={24} style={{ color: 'var(--color-warning)' }} />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span
              className="text-3xl font-extrabold tabular-nums"
              style={{ color: 'var(--text-primary)' }}
            >
              {days}
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--color-warning)' }}
            >
              day streak
            </span>
          </div>
          <p
            className="text-xs mt-0.5"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {days >= 14
              ? 'Incredible consistency! 🔥'
              : days >= 7
                ? 'Keep the momentum going! 💪'
                : 'Building a habit. Stay strong! ⚡'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
