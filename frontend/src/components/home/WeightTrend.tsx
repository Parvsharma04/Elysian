'use client';

import { useHealthStore } from '@/store/health-store';
import { getWeightProjection } from '@/lib/derived-metrics';
import { Scale } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from 'recharts';

export function WeightTrend() {
  const days = useHealthStore((s) => s.days);

  if (days.length < 7) return null;

  const projections = getWeightProjection(days, 14);
  const recent = days.slice(-14);

  const chartData = recent.map((d) => ({
    label: new Date(d.date).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
    actual: d.weight > 0 ? d.weight : undefined,
    projected: undefined as number | undefined,
  }));

  const lastDate = new Date(days[days.length - 1].date);
  projections.forEach((p, i) => {
    const date = new Date(lastDate);
    date.setDate(date.getDate() + i + 1);
    chartData.push({
      label: date.toLocaleDateString('en', { day: 'numeric', month: 'short' }),
      actual: undefined,
      projected: p,
    });
  });

  if (chartData.length > 14 && chartData[13]?.actual) {
    chartData[13].projected = chartData[13].actual;
  }

  const allWeights = [
    ...recent.map((d) => d.weight).filter(w => w > 0),
    ...projections,
  ];

  if (allWeights.length === 0) return null;

  const minW = Math.floor(Math.min(...allWeights) - 1);
  const maxW = Math.ceil(Math.max(...allWeights) + 1);

  const currentWeight = days[days.length - 1].weight;
  const projectedWeight = projections[projections.length - 1];

  return (
    <div className="card-base p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: 'rgba(0, 212, 255, 0.1)' }}
          >
            <Scale size={14} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <span className="label-medium">Weight</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-lg font-bold mono block" style={{ color: 'var(--text-primary)' }}>
              {currentWeight > 0 ? currentWeight : '—'}
            </span>
            <span className="text-[9px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
              kg today
            </span>
          </div>
          {projectedWeight && (
            <div className="text-right">
              <span className="text-lg font-bold mono block gradient-text">
                {projectedWeight}
              </span>
              <span className="text-[9px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                kg projected
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-36 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="wt-actual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="wt-proj" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7b61ff" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#7b61ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-tertiary)', fontSize: 9 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minW, maxW]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-tertiary)', fontSize: 9 }}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--glass-bg-strong)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                backdropFilter: 'blur(16px)',
                color: 'var(--text-primary)',
                fontSize: 12,
                boxShadow: 'var(--shadow-elevated)',
              }}
            />
            <ReferenceLine
              y={currentWeight > 0 ? currentWeight : undefined}
              stroke="var(--border-default)"
              strokeDasharray="4 4"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#00d4ff"
              strokeWidth={2}
              fill="url(#wt-actual)"
              dot={false}
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="projected"
              stroke="#7b61ff"
              strokeWidth={2}
              strokeDasharray="6 4"
              fill="url(#wt-proj)"
              dot={false}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
