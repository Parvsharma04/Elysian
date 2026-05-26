'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '@/store/health-store';
import { TrendChart } from './TrendChart';
import { RangeSelector } from './RangeSelector';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en', { day: 'numeric', month: 'short' });
}

export function TrendsScreen() {
  const days = useHealthStore((s) => s.days);
  const trendRange = useHealthStore((s) => s.trendRange);
  const setTrendRange = useHealthStore((s) => s.setTrendRange);

  const rangeCount = trendRange === '7d' ? 7 : trendRange === '30d' ? 30 : 90;
  const rangeDays = useMemo(() => days.slice(-Math.min(rangeCount, days.length)), [days, rangeCount]);

  type DayKey = keyof typeof rangeDays[0];
  const makeData = (key: DayKey) =>
    rangeDays.map((d) => ({
      label: formatDate(d.date),
      value: d[key] as number,
    }));

  const charts = [
    { title: 'Weight', data: makeData('weight'), color: '#00d4ff', unit: 'kg', type: 'area' as const },
    { title: 'Steps', data: makeData('steps'), color: '#c6ff00', unit: '', type: 'area' as const },
    { title: 'Sleep Hours', data: makeData('sleepHours'), color: '#7b61ff', unit: 'h', type: 'area' as const },
    { title: 'HRV', data: makeData('hrv'), color: '#b388ff', unit: 'ms', type: 'line' as const },
    { title: 'Resting HR', data: makeData('heartRateResting'), color: '#ff6b6b', unit: 'bpm', type: 'line' as const },
    { title: 'Calories', data: makeData('calories'), color: '#ffab00', unit: 'kcal', type: 'area' as const },
  ];

  return (
    <div className="screen-content flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="display-medium" style={{ color: 'var(--text-primary)' }}>
          Trends
        </h1>
        <RangeSelector value={trendRange} onChange={setTrendRange} />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {charts.map((chart, i) => (
          <motion.div
            key={chart.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            <TrendChart
              title={chart.title}
              data={chart.data}
              color={chart.color}
              unit={chart.unit}
              type={chart.type}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
