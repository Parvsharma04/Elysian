'use client';

import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import type { PulseFact } from '@/lib/fact-generator';
import { useHealthStore } from '@/store/health-store';

interface PulseDropProps {
  fact: PulseFact;
  index?: number;
  compact?: boolean;
}

export function PulseDrop({ fact, index = 0, compact = false }: PulseDropProps) {
  const savedFacts = useHealthStore((s) => s.savedFacts);
  const saveFact = useHealthStore((s) => s.saveFact);
  const unsaveFact = useHealthStore((s) => s.unsaveFact);

  const isSaved = savedFacts.some((f) => f.id === fact.id);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) unsaveFact(fact.id);
    else saveFact(fact);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      await navigator.share({
        title: `Elysian — ${fact.title}`,
        text: `${fact.emoji} ${fact.title}\n${fact.body}`,
      });
    }
  };

  return (
    <motion.div
      className={`pulse-drop relative flex-shrink-0 ${compact ? 'w-[240px]' : 'w-[280px]'}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileTap={{ scale: 0.97 }}
    >
      <div
        className={`relative rounded-md border ${compact ? 'p-4' : 'p-5'}`}
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {/* Emoji */}
        <div className="text-2xl mb-2.5">
          {fact.emoji}
        </div>

        {/* Title */}
        <h3
          className="text-[13px] font-semibold tracking-tight mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {fact.title}
        </h3>

        {/* Body */}
        <p
          className={`text-xs leading-relaxed ${compact ? 'line-clamp-3' : 'line-clamp-4'}`}
          style={{ color: 'var(--text-secondary)' }}
        >
          {fact.body}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors"
            style={{
              background: isSaved
                ? 'rgba(74, 159, 110, 0.1)'
                : 'var(--bg-elevated)',
              border: `1px solid ${isSaved ? 'rgba(74, 159, 110, 0.2)' : 'var(--border-subtle)'}`,
              color: isSaved ? 'var(--color-success)' : 'var(--text-secondary)',
            }}
          >
            {isSaved ? <BookmarkCheck size={10} /> : <Bookmark size={10} />}
            {isSaved ? 'Saved' : 'Save'}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center w-6 h-6 rounded-md transition-colors"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Share2 size={10} style={{ color: 'var(--text-tertiary)' }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
