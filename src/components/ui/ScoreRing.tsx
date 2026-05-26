'use client';

import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorMode?: 'auto' | 'accent' | 'recovery' | 'energy' | 'danger';
}

function getAutoColor(score: number): string {
  if (score >= 75) return 'var(--color-success)';
  if (score >= 50) return 'var(--accent-primary)';
  if (score >= 30) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

function getGradientId(colorMode: string, score: number): string {
  return `ring-gradient-${colorMode}-${score}`;
}

export function ScoreRing({
  score,
  maxScore = 100,
  size = 160,
  strokeWidth = 10,
  label,
  sublabel,
  colorMode = 'auto',
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score / maxScore, 1);
  const offset = circumference * (1 - progress);

  const color =
    colorMode === 'auto'
      ? getAutoColor(score)
      : colorMode === 'accent'
        ? 'var(--accent-primary)'
        : colorMode === 'recovery'
          ? 'var(--recovery-purple)'
          : colorMode === 'energy'
            ? 'var(--lime-energy)'
            : 'var(--color-danger)';

  const gradId = getGradientId(colorMode, score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop
              offset="100%"
              stopColor={color}
              stopOpacity={0.5}
            />
          </linearGradient>
          <filter id={`glow-${gradId}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          filter={`url(#glow-${gradId})`}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-bold tracking-tight"
          style={{ fontSize: size * 0.28, color: 'var(--text-primary)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {score}
        </motion.span>
        {label && (
          <span
            className="font-medium tracking-wide uppercase"
            style={{
              fontSize: Math.max(9, size * 0.07),
              color: 'var(--text-secondary)',
              letterSpacing: '0.08em',
            }}
          >
            {label}
          </span>
        )}
        {sublabel && (
          <span
            className="font-normal"
            style={{
              fontSize: Math.max(8, size * 0.06),
              color: 'var(--text-tertiary)',
            }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
