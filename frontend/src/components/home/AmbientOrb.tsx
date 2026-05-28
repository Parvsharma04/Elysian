'use client';

import { motion } from 'framer-motion';
import { useHealthStore } from '@/store/health-store';

export function AmbientOrb() {
  const readinessScore = useHealthStore((s) => s.readinessScore);

  const label = readinessScore >= 75
    ? 'Ready to perform'
    : readinessScore >= 50
      ? 'Moderate energy'
      : 'Prioritize rest';

  const ringColor = readinessScore >= 75
    ? '#3fcf6e'
    : readinessScore >= 50
      ? '#f0b429'
      : '#ef5350';

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (readinessScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112">
          <circle cx="56" cy="56" r="52" fill="none" stroke="var(--border-subtle)" strokeWidth="4" />
          <motion.circle
            cx="56" cy="56" r="52" fill="none"
            stroke={ringColor} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {readinessScore}
          </span>
          <span className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            readiness
          </span>
        </div>
      </div>
      <p className="mt-2 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </p>
    </div>
  );
}
