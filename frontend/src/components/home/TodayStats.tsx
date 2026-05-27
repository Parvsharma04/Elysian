'use client';

import { useHealthStore } from '@/store/health-store';
import { MetricCard } from '@/components/ui/MetricCard';
import { MiniChart } from '@/components/ui/MiniChart';
import { Footprints, Flame, Timer, Droplets } from 'lucide-react';

export function TodayStats() {
  const today = useHealthStore((s) => s.today);
  const yesterday = useHealthStore((s) => s.yesterday);
  const days = useHealthStore((s) => s.days);

  if (!today || !yesterday) return null;

  const stepsDelta = yesterday.steps > 0 ? Math.round(((today.steps - yesterday.steps) / yesterday.steps) * 100) : 0;
  const calDelta = yesterday.calories > 0 ? Math.round(((today.calories - yesterday.calories) / yesterday.calories) * 100) : 0;
  const stepsHistory = days.slice(-7).map((d) => d.steps);

  return (
    <div className="stats-grid">
      <MetricCard
        icon={Footprints}
        label="Steps"
        value={today.steps.toLocaleString()}
        delta={stepsDelta}
        deltaLabel="vs yesterday"
        accentColor="var(--accent-primary)"
      >
        <MiniChart data={stepsHistory} color="#00d4ff" height={28} />
      </MetricCard>

      <MetricCard
        icon={Flame}
        label="Calories"
        value={today.calories.toLocaleString()}
        unit="kcal"
        delta={calDelta}
        deltaLabel="vs yesterday"
        accentColor="var(--color-warning)"
      />

      <MetricCard
        icon={Timer}
        label="Active"
        value={today.activeMinutes}
        unit="min"
        accentColor="var(--lime-energy)"
      />

      <MetricCard
        icon={Droplets}
        label="Water"
        value={(today.waterMl / 1000).toFixed(1)}
        unit="L"
        accentColor="var(--color-info)"
      />
    </div>
  );
}
