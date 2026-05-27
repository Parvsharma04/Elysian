'use client';

import { motion } from 'framer-motion';
import { useHealthStore } from '@/store/health-store';
import { StreakBanner } from './StreakBanner';
import { WorkoutCard } from './WorkoutCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { Flame, Timer, Dumbbell } from 'lucide-react';

export function ActivityScreen() {
  const workouts = useHealthStore((s) => s.workouts);
  const streakDays = useHealthStore((s) => s.streakDays);
  const days = useHealthStore((s) => s.days);

  const weekDays = days.slice(-7);
  const totalCals = weekDays.reduce((s, d) => s + d.calories, 0);
  const totalActive = weekDays.reduce((s, d) => s + d.activeMinutes, 0);
  const weekWorkouts = workouts.filter((w) => {
    const wDate = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return wDate >= weekAgo;
  });

  return (
    <div className="screen-content flex flex-col gap-5 pb-8">
      {/* Header */}
      <motion.h1
        className="display-medium"
        style={{ color: 'var(--text-primary)' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Activity
      </motion.h1>

      {/* Streak */}
      <StreakBanner days={streakDays} />

      {/* Week summary */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard icon={Dumbbell} label="Workouts" value={weekWorkouts.length} accentColor="var(--accent-primary)" />
        <MetricCard icon={Flame} label="Calories" value={(totalCals / 1000).toFixed(1) + 'k'} accentColor="var(--color-warning)" />
        <MetricCard icon={Timer} label="Active" value={totalActive} unit="min" accentColor="var(--lime-energy)" />
      </div>

      {/* Workout list */}
      <div className="flex flex-col gap-2">
        <span className="label-small px-1">Recent Workouts</span>
        {workouts.length > 0 ? (
          workouts.map((w, i) => (
            <WorkoutCard key={w.id} workout={w} index={i} />
          ))
        ) : (
          <div className="card-base p-6 flex flex-col items-center gap-2">
            <Dumbbell size={24} style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>No workouts yet</span>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Your workouts will appear here</span>
          </div>
        )}
      </div>
    </div>
  );
}
