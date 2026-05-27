'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '@/store/health-store';
import { WeeklySummary } from './WeeklySummary';
import { InsightCard } from '@/components/ui/InsightCard';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { FileText, Sparkles } from 'lucide-react';

export function ReportsScreen() {
  const days = useHealthStore((s) => s.days);
  const insights = useHealthStore((s) => s.insights);
  const consistencyScore = useHealthStore((s) => s.consistencyScore);

  const currentWeek = useMemo(() => days.slice(-7), [days]);
  const previousWeek = useMemo(() => days.slice(-14, -7), [days]);

  const narrative = useMemo(() => {
    if (currentWeek.length === 0) return '';
    const avgSteps = Math.round(currentWeek.reduce((s, d) => s + d.steps, 0) / currentWeek.length);
    const avgSleep = currentWeek.reduce((s, d) => s + d.sleepHours, 0) / currentWeek.length;
    const weightDelta = currentWeek[currentWeek.length - 1].weight - currentWeek[0].weight;

    return `This week you averaged **${avgSteps.toLocaleString()} steps/day** and **${avgSleep.toFixed(1)}h of sleep**. Your weight ${weightDelta < 0 ? 'decreased' : 'increased'} by **${Math.abs(weightDelta).toFixed(1)}kg**. ${avgSteps > 8000 ? 'Great activity levels!' : 'Try to increase daily movement.'} ${avgSleep >= 7 ? 'Sleep consistency is looking solid.' : 'Focus on improving sleep duration.'}`;
  }, [currentWeek]);

  return (
    <div className="screen-content flex flex-col gap-5 pb-8">
      {/* Header */}
      <motion.h1
        className="display-medium"
        style={{ color: 'var(--text-primary)' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Reports
      </motion.h1>

      {/* AI Weekly Narrative */}
      {narrative && (
        <motion.div
          className="card-base p-5 relative overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'var(--gradient-primary)' }} />

          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={13} style={{ color: 'var(--accent-primary)' }} />
            <span className="label-small" style={{ color: 'var(--accent-primary)' }}>
              AI Weekly Report
            </span>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {narrative.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={i} className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>

          <p className="text-[9px] mt-3 italic" style={{ color: 'var(--text-tertiary)' }}>
            Not medical advice. Consult healthcare professionals.
          </p>
        </motion.div>
      )}

      {/* Adherence / Consistency */}
      <motion.div
        className="card-base p-5 flex items-center gap-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
      >
        <ScoreRing score={consistencyScore} size={100} strokeWidth={8} label="Consistency" colorMode="energy" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Adherence Score
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {consistencyScore >= 75
              ? "Outstanding adherence! You're hitting your targets consistently across steps, sleep, and activity."
              : consistencyScore >= 50
                ? 'Solid progress. Focus on sleep consistency and daily step targets to push higher.'
                : "There's room for improvement. Start with hitting 7,000 steps and 7h sleep daily."}
          </p>
        </div>
      </motion.div>

      {/* Week vs Week */}
      {previousWeek.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <WeeklySummary currentWeek={currentWeek} previousWeek={previousWeek} />
        </motion.div>
      )}

      {/* All Insights */}
      {insights.length > 0 && (
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 px-1">
            <FileText size={12} style={{ color: 'var(--text-tertiary)' }} />
            <span className="label-small">All Insights</span>
          </div>
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
