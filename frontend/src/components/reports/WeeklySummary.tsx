'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { HealthDayData } from '@/store/health-store';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WeeklySummaryProps {
  currentWeek: HealthDayData[];
  previousWeek: HealthDayData[];
}

interface Comparison {
  label: string;
  current: string;
  previous: string;
  delta: number;
  unit: string;
  color: string;
  invertDelta?: boolean;
}

export function WeeklySummary({ currentWeek, previousWeek }: WeeklySummaryProps) {
  const comparisons: Comparison[] = useMemo(() => {
    const avg = (arr: HealthDayData[], key: keyof HealthDayData) =>
      arr.reduce((s, d) => s + (d[key] as number), 0) / arr.length;

    const total = (arr: HealthDayData[], key: keyof HealthDayData) =>
      arr.reduce((s, d) => s + (d[key] as number), 0);

    const pairs: [string, keyof HealthDayData, string, string, boolean?][] = [
      ['Avg Steps', 'steps', '', '#00d4ff'],
      ['Avg Sleep', 'sleepHours', 'h', '#7b61ff'],
      ['Avg HRV', 'hrv', 'ms', '#b388ff'],
      ['Avg Resting HR', 'heartRateResting', 'bpm', '#ff6b6b', true],
      ['Total Calories', 'calories', 'kcal', '#ffab00'],
      ['Avg Active Min', 'activeMinutes', 'min', '#c6ff00'],
    ];

    return pairs.map(([label, key, unit, color, invert]) => {
      const useTotal = label.startsWith('Total');
      const curVal = useTotal ? total(currentWeek, key) : avg(currentWeek, key);
      const prevVal = useTotal ? total(previousWeek, key) : avg(previousWeek, key);
      const delta = prevVal !== 0 ? ((curVal - prevVal) / prevVal) * 100 : 0;

      return {
        label,
        current: useTotal
          ? Math.round(curVal).toLocaleString()
          : curVal.toFixed(key === 'sleepHours' ? 1 : 0),
        previous: useTotal
          ? Math.round(prevVal).toLocaleString()
          : prevVal.toFixed(key === 'sleepHours' ? 1 : 0),
        delta: Math.round(delta),
        unit,
        color,
        invertDelta: invert,
      };
    });
  }, [currentWeek, previousWeek]);

  return (
    <div className="card-base p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          This Week vs Last Week
        </h3>
        <span className="label-small">7-day comparison</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {comparisons.map((comp, i) => {
          const isPositive = comp.invertDelta ? comp.delta <= 0 : comp.delta >= 0;
          const DeltaIcon = comp.delta === 0 ? Minus : comp.delta > 0 ? TrendingUp : TrendingDown;

          return (
            <motion.div
              key={comp.label}
              className="flex flex-col gap-1 p-3 rounded-xl"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <span className="label-small">{comp.label}</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold mono" style={{ color: 'var(--text-primary)' }}>
                  {comp.current}
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                  {comp.unit}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <DeltaIcon
                  size={11}
                  style={{ color: isPositive ? 'var(--color-success)' : 'var(--color-danger)' }}
                />
                <span
                  className="text-[10px] font-semibold mono"
                  style={{ color: isPositive ? 'var(--color-success)' : 'var(--color-danger)' }}
                >
                  {comp.delta > 0 ? '+' : ''}{comp.delta}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
