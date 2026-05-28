'use client';

import { motion } from 'framer-motion';
import { useHealthStore } from '@/store/health-store';
import { PulseDrop } from '@/components/home/PulseDrop';
import { SavedDropsGrid } from './SavedDropsGrid';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Bookmark, Flame, Footprints, Moon, Trophy, Sparkles } from 'lucide-react';

export function ProfileScreen() {
  const savedFacts = useHealthStore((s) => s.savedFacts);
  const streakDays = useHealthStore((s) => s.streakDays);
  const days = useHealthStore((s) => s.days);
  const consistencyScore = useHealthStore((s) => s.consistencyScore);

  const totalSteps = days.reduce((s, d) => s + d.steps, 0);
  const totalCalories = days.reduce((s, d) => s + d.calories, 0);
  const avgSleep = days.length > 0
    ? (days.reduce((s, d) => s + d.sleepHours, 0) / days.length).toFixed(1)
    : '0';

  return (
    <div className="screen-content flex flex-col gap-6 pb-8">
      {/* Header */}
      <motion.div
        className="flex flex-col items-center pt-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Avatar placeholder with gradient ring */}
        <motion.div
          className="relative w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{
            background: 'linear-gradient(135deg, #00d4ff20, #7b61ff20)',
            border: '2px solid rgba(0, 212, 255, 0.2)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl">🧑‍💻</span>
          {/* Consistency ring */}
          <div className="absolute -bottom-1 -right-1">
            <ScoreRing score={consistencyScore} size={32} strokeWidth={3} colorMode="energy" />
          </div>
        </motion.div>

        <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Your Profile
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
          {days.length} days tracked
        </p>
      </motion.div>

      {/* Quick stats row */}
      <motion.div
        className="grid grid-cols-4 gap-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <QuickStat icon={Flame} label="Streak" value={`${streakDays}d`} color="#ffab00" />
        <QuickStat icon={Footprints} label="Steps" value={`${(totalSteps / 1000).toFixed(0)}k`} color="#00d4ff" />
        <QuickStat icon={Moon} label="Avg Sleep" value={`${avgSleep}h`} color="#7b61ff" />
        <QuickStat icon={Trophy} label="Drops" value={`${savedFacts.length}`} color="#fa709a" />
      </motion.div>

      {/* Saved Pulse Drops */}
      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 px-1">
          <Bookmark size={13} style={{ color: 'var(--text-secondary)' }} />
          <span className="text-xs font-bold tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
            Saved Drops
          </span>
          <span
            className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(250, 112, 154, 0.1)',
              color: '#fa709a',
            }}
          >
            {savedFacts.length}
          </span>
        </div>

        {savedFacts.length > 0 ? (
          <SavedDropsGrid facts={savedFacts} />
        ) : (
          <motion.div
            className="flex flex-col items-center gap-3 py-12 rounded-3xl border border-dashed border-white/[0.06]"
            style={{ background: 'rgba(12, 12, 20, 0.4)' }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={28} style={{ color: 'var(--text-tertiary)' }} />
            </motion.div>
            <p className="text-xs text-center px-8" style={{ color: 'var(--text-tertiary)' }}>
              Save Pulse Drops from your home feed to build your personal achievement wall
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function QuickStat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border border-white/[0.04]"
      style={{ background: 'rgba(12, 12, 20, 0.6)' }}
    >
      <Icon size={14} style={{ color }} />
      <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
      <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </span>
    </div>
  );
}
