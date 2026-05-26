'use client';

import { motion } from 'framer-motion';

interface RangeSelectorProps {
  value: '7d' | '30d' | '90d';
  onChange: (range: '7d' | '30d' | '90d') => void;
}

const options: { value: '7d' | '30d' | '90d'; label: string }[] = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
];

export function RangeSelector({ value, onChange }: RangeSelectorProps) {
  return (
    <div
      className="inline-flex items-center gap-1 p-1 rounded-xl"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="relative px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200"
            style={{
              color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="range-indicator"
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
