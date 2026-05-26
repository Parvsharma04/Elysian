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
      className="card-base p-4 flex flex-col gap-2.5 relative overflow-hidden"
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Subtle top accent line */}
      <div
        className="absolute top-0 left-4 right-4 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg"
          style={{ background: `${accentColor}15` }}
        >
          <Icon size={15} style={{ color: accentColor }} />
        </div>
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Delta */}
      {delta !== undefined && (
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs font-semibold"
            style={{
              color: isPositiveDelta
                ? 'var(--color-success)'
                : 'var(--color-danger)',
            }}
          >
            {isPositiveDelta ? '↑' : '↓'} {Math.abs(delta)}
            {unit === 'bpm' || unit === 'ms' ? unit : '%'}
          </span>
          {deltaLabel && (
            <span
              className="text-xs"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {deltaLabel}
            </span>
          )}
        </div>
      )}

      {/* Optional child content (e.g. sparkline) */}
      {children && <div className="mt-auto">{children}</div>}
    </motion.div>
  );
}
