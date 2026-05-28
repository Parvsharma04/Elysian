'use client';

import { motion, type Variants } from 'framer-motion';
import { useHealthStore } from '@/store/health-store';
import { AmbientOrb } from './AmbientOrb';
import { PulseDropCarousel } from './PulseDropCarousel';
import { StoryCard } from './StoryCard';
import { TodayStats } from './TodayStats';
import { Heart, Brain, Zap, Moon, TrendingUp } from 'lucide-react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Rest well';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Wind down';
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
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  },
};

export function HomeScreen() {
  const insights = useHealthStore((s) => s.insights);
  const recoveryScore = useHealthStore((s) => s.recoveryScore);
  const fatigueScore = useHealthStore((s) => s.fatigueScore);
  const burnoutRisk = useHealthStore((s) => s.burnoutRisk);
  const today = useHealthStore((s) => s.today);

  const topInsight = insights.find((i) => i.priority === 'high') || insights[0];

  // Generate contextual story text
  const recoveryStory = recoveryScore >= 75
    ? 'Your body is fully recovered. Today is perfect for pushing boundaries.'
    : recoveryScore >= 50
      ? 'Moderate recovery detected. Listen to your body and train smart.'
      : 'Your system needs rest. Focus on gentle movement and sleep quality.';

  const fatigueStory = fatigueScore > 60
    ? 'Fatigue is elevated. Consider scaling back intensity today.'
    : fatigueScore > 40
      ? 'Some accumulated fatigue — nothing a good night\'s sleep won\'t fix.'
      : 'Low fatigue levels. You have reserves in the tank.';

  return (
    <motion.div
      className="screen-content flex flex-col gap-6 pb-8"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Greeting — minimal, typographic */}
      <motion.div variants={stagger.item} className="flex flex-col pt-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
          {getDate()}
        </span>
        <h1
          className="text-3xl font-black tracking-tight mt-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {getGreeting()}
        </h1>
      </motion.div>

      {/* Ambient Orb — replaces ScoreRing */}
      <motion.div variants={stagger.item}>
        <AmbientOrb />
      </motion.div>

      {/* Pulse Drops Carousel — the star feature */}
      <motion.div variants={stagger.item}>
        <PulseDropCarousel />
      </motion.div>

      {/* Quick metrics row */}
      <motion.div variants={stagger.item}>
        <TodayStats />
      </motion.div>

      {/* Story Cards — editorial insights */}
      <motion.div variants={stagger.item} className="flex flex-col gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-1" style={{ color: 'var(--text-tertiary)' }}>
          Your Story Today
        </span>

        <StoryCard
          icon={Heart}
          iconColor="#ff6b6b"
          title="Recovery"
          body={recoveryStory}
          gradient="linear-gradient(135deg, #ff6b6b, #ff9a9e)"
          index={0}
        />

        <StoryCard
          icon={Zap}
          iconColor="#ffab00"
          title="Energy Levels"
          body={fatigueStory}
          gradient="linear-gradient(135deg, #ffab00, #fee140)"
          index={1}
        />

        {burnoutRisk.level !== 'low' && (
          <StoryCard
            icon={Brain}
            iconColor="#7b61ff"
            title="Burnout Alert"
            body={`Burnout risk is ${burnoutRisk.level}. Your recent patterns suggest you should prioritize recovery activities and ensure adequate sleep.`}
            gradient="linear-gradient(135deg, #7b61ff, #b388ff)"
            index={2}
          />
        )}

        {topInsight && (
          <StoryCard
            icon={TrendingUp}
            iconColor="#00d4ff"
            title={topInsight.title}
            body={topInsight.body}
            gradient="linear-gradient(135deg, #00d4ff, #4facfe)"
            index={3}
          />
        )}

        {today && today.sleepHours > 0 && (
          <StoryCard
            icon={Moon}
            iconColor="#a18cd1"
            title="Last Night"
            body={`You slept ${today.sleepHours.toFixed(1)} hours with ${today.sleepDeep.toFixed(1)}h deep sleep. ${today.sleepHours >= 7.5 ? 'Excellent recovery window.' : 'Try to get closer to 8 hours tonight.'}`}
            gradient="linear-gradient(135deg, #a18cd1, #fbc2eb)"
            index={4}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

