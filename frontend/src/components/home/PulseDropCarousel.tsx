'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useHealthStore } from '@/store/health-store';
import { PulseDrop } from './PulseDrop';

export function PulseDropCarousel() {
  const pulseFacts = useHealthStore((s) => s.pulseFacts);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (pulseFacts.length === 0) return null;

  return (
    <motion.div
      className="flex flex-col gap-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Section header */}
      <div className="flex items-center gap-2 px-1">
        <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
        <span className="text-xs font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
          Your Pulse Drops
        </span>
      </div>

      {/* Horizontal scroll — matches screen padding */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-[20px] px-[20px] snap-x snap-mandatory"
      >
        {pulseFacts.map((fact, i) => (
          <div key={fact.id} className="snap-start">
            <PulseDrop fact={fact} index={i} compact />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
