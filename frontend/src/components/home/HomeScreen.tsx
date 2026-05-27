'use client';

import { motion, type Variants } from 'framer-motion';
import { useHealthStore } from '@/store/health-store';
import { RecoveryHero } from './RecoveryHero';
import { DailyInsight } from './DailyInsight';
import { TodayStats } from './TodayStats';
import { SleepSummary } from './SleepSummary';
import { WeightTrend } from './WeightTrend';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

function getDate(): string {
  return new Date().toLocaleDateString('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const stagger: { container: Variants; item: Variants } = {
  container: {
    animate: {
      transition: { staggerChildren: 0.06, delayChildren: 0.08 },
    },
  },
  item: {
    initial: { opacity: 0, y: 14 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  },
};

export function HomeScreen() {
  const insights = useHealthStore((s) => s.insights);
  const topInsight = insights.find((i) => i.priority === 'high') || insights[0];

  return (
    <motion.div
      className="screen-content flex flex-col gap-5 pb-8"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Greeting */}
      <motion.div variants={stagger.item} className="flex flex-col">
        <span className="label-medium" style={{ color: 'var(--text-tertiary)' }}>
          {getDate()}
        </span>
        <h1 className="display-large mt-1" style={{ color: 'var(--text-primary)' }}>
          {getGreeting()}
        </h1>
      </motion.div>

      {/* Recovery Hero */}
      <motion.div variants={stagger.item}>
        <RecoveryHero />
      </motion.div>

      {/* AI Insight */}
      {topInsight && (
        <motion.div variants={stagger.item}>
          <DailyInsight insight={topInsight} />
        </motion.div>
      )}

      {/* Today Stats */}
      <motion.div variants={stagger.item}>
        <TodayStats />
      </motion.div>

      {/* Sleep + Weight side by side on desktop */}
      <motion.div variants={stagger.item} className="two-col-layout">
        <SleepSummary />
        <WeightTrend />
      </motion.div>
    </motion.div>
  );
}
