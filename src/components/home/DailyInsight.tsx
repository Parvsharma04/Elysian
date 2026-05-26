'use client';

import { InsightCard } from '@/components/ui/InsightCard';
import type { InsightData } from '@/store/health-store';
import { Sparkles } from 'lucide-react';

interface DailyInsightProps {
  insight: InsightData;
}

export function DailyInsight({ insight }: DailyInsightProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-1">
        <Sparkles size={12} style={{ color: 'var(--accent-primary)' }} />
        <span className="label-small" style={{ color: 'var(--accent-primary)' }}>
          AI Insight
        </span>
      </div>
      <InsightCard insight={insight} />
    </div>
  );
}
