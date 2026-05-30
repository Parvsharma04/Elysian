'use client';

import { useHealthStore } from '@/store/health-store';
import { Moon } from 'lucide-react';

const segmentColors: Record<string, string> = {
  deep: '#7b61ff',
  rem: '#00d4ff',
  light: '#448aff',
  awake: '#ff4757',
};

export function SleepSummary() {
  const today = useHealthStore((s) => s.today);
  const sleepQualityScore = useHealthStore((s) => s.sleepQualityScore);

  if (!today) return null;

  const segments = [
    { key: 'deep', label: 'Deep', hours: today.sleepDeep },
    { key: 'rem', label: 'REM', hours: today.sleepRem },
    { key: 'light', label: 'Light', hours: today.sleepLight },
    { key: 'awake', label: 'Awake', hours: today.sleepAwake },
  ];

  const total = today.sleepHours || 1;

  return (
    <div className="card-base p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-md"
            style={{ background: 'rgba(123, 97, 255, 0.1)' }}
          >
            <Moon size={14} style={{ color: 'var(--accent-secondary)' }} />
          </div>
          <span className="label-medium">Sleep</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold mono" style={{ color: 'var(--text-primary)' }}>
            {today.sleepHours}h
          </span>
          <span
            className={`score-badge ${sleepQualityScore >= 70 ? 'success' : sleepQualityScore >= 50 ? 'warning' : 'danger'}`}
          >
            {sleepQualityScore}%
          </span>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="flex w-full h-2.5 rounded-full overflow-hidden gap-px">
        {segments.map((seg) => (
          <div
            key={seg.key}
            className="rounded-full transition-all duration-700"
            style={{
              width: `${(seg.hours / total) * 100}%`,
              background: segmentColors[seg.key],
              opacity: 0.85,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: segmentColors[seg.key] }} />
            <span className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
              {seg.label}
            </span>
            <span className="text-[10px] font-semibold mono" style={{ color: 'var(--text-secondary)' }}>
              {seg.hours}h
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
