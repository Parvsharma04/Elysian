'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  accentColor?: string;
  children?: React.ReactNode;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  delta,
  deltaLabel,
  accentColor = 'var(--accent-primary)',
  children,
}: MetricCardProps) {
  const isPositiveDelta = delta !== undefined && delta >= 0;

  return (
    <motion.div
      className="card-base p-3.5 flex flex-col gap-2 min-w-0"
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <Icon size={14} style={{ color: accentColor }} />
        <span
          className="text-[11px] font-medium truncate"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span
          className="text-xl font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="text-xs font-medium"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Delta */}
      {delta !== undefined && (
        <span
          className="text-[11px] font-medium"
          style={{
            color: isPositiveDelta ? 'var(--color-success)' : 'var(--color-danger)',
          }}
        >
          {isPositiveDelta ? '↑' : '↓'} {Math.abs(delta)}%
          {deltaLabel && <span style={{ color: 'var(--text-tertiary)' }}> {deltaLabel}</span>}
        </span>
      )}

      {children && <div className="mt-auto">{children}</div>}
    </motion.div>
  );
}
