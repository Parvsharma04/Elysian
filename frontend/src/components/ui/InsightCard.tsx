'use client';

import { motion } from 'framer-motion';
import {
  ShieldAlert,
  TrendingUp,
  Dumbbell,
  Moon,
  Brain,
  AlertTriangle,
} from 'lucide-react';
import type { InsightData } from '@/store/health-store';

const typeConfig: Record<
  InsightData['type'],
  { icon: typeof ShieldAlert; color: string; gradient: string }
> = {
  recovery: { icon: ShieldAlert, color: 'var(--recovery-purple)', gradient: 'var(--gradient-recovery)' },
  nutrition: { icon: Brain, color: 'var(--lime-energy)', gradient: 'var(--gradient-energy)' },
  training: { icon: Dumbbell, color: 'var(--accent-primary)', gradient: 'var(--gradient-primary)' },
  sleep: { icon: Moon, color: 'var(--accent-secondary)', gradient: 'var(--gradient-recovery)' },
  prediction: { icon: TrendingUp, color: 'var(--accent-primary)', gradient: 'var(--gradient-primary)' },
  warning: { icon: AlertTriangle, color: 'var(--color-warning)', gradient: 'var(--gradient-warm)' },
};

interface InsightCardProps {
  insight: InsightData;
  compact?: boolean;
}

export function InsightCard({ insight, compact = false }: InsightCardProps) {
  const config = typeConfig[insight.type];
  const Icon = config.icon;

  return (
    <motion.div
      className="card-base relative overflow-hidden"
      whileTap={{ scale: 0.98 }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
        style={{ background: config.gradient }}
      />

      <div className={`flex gap-3 ${compact ? 'p-3' : 'p-4'}`}>
        {/* Icon */}
        <div
          className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-md"
          style={{ background: `color-mix(in srgb, ${config.color} 10%, transparent)` }}
        >
          <Icon size={17} style={{ color: config.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className="text-sm font-semibold truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {insight.title}
            </h3>
            {insight.priority === 'high' && (
              <span
                className="flex-shrink-0 w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'var(--color-danger)' }}
              />
            )}
          </div>
          {!compact && (
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {insight.body}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
