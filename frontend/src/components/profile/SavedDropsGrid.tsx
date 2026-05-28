'use client';

import { motion } from 'framer-motion';
import { PulseDrop } from '@/components/home/PulseDrop';
import type { PulseFact } from '@/lib/fact-generator';

interface SavedDropsGridProps {
  facts: PulseFact[];
}

export function SavedDropsGrid({ facts }: SavedDropsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {facts.map((fact, i) => (
        <motion.div
          key={fact.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <PulseDrop fact={fact} index={i} />
        </motion.div>
      ))}
    </div>
  );
}
