'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useHealthStore } from '@/store/health-store';
import { PulseDrop } from './PulseDrop';

export function PulseDropCarousel() {
  const pulseFacts = useHealthStore((s) => s.pulseFacts);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (pulseFacts.length === 0) return null;

  return (
    <motion.div
      className="flex flex-col gap-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Section header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-6 h-6 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(250, 112, 154, 0.15), rgba(254, 225, 64, 0.15))',
            }}
          >
            <Sparkles size={12} style={{ color: '#fa709a' }} />
          </div>
          <span className="text-xs font-bold tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
            Pulse Drops
          </span>
        </div>
        <button
          className="flex items-center gap-0.5 text-[10px] font-semibold"
          style={{ color: 'var(--text-tertiary)' }}
        >
          See all <ChevronRight size={10} />
        </button>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5 snap-x snap-mandatory"
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
