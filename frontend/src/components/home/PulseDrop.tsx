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
    if (isSaved) {
      unsaveFact(fact.id);
    } else {
      saveFact(fact);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      await navigator.share({
        title: `PulseAI — ${fact.title}`,
        text: `${fact.emoji} ${fact.title}\n${fact.body}`,
      });
    }
  };

  return (
    <motion.div
      className={`pulse-drop relative overflow-hidden flex-shrink-0 ${compact ? 'w-[260px]' : 'w-[300px]'}`}
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileTap={{ scale: 0.96 }}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 rounded-3xl opacity-[0.08]"
        style={{ background: fact.gradient }}
      />

      {/* Glass card */}
      <div
        className={`relative rounded-3xl border border-white/[0.06] backdrop-blur-xl ${compact ? 'p-4' : 'p-5'}`}
        style={{
          background: 'rgba(15, 15, 25, 0.8)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-6 right-6 h-[1px]"
          style={{ background: fact.gradient, opacity: 0.5 }}
        />

        {/* Emoji */}
        <motion.div
          className="text-3xl mb-3"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {fact.emoji}
        </motion.div>

        {/* Title */}
        <h3
          className="text-sm font-bold tracking-tight mb-1.5"
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
        <div className="flex items-center gap-2 mt-4">
          <motion.button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all"
            style={{
              background: isSaved
                ? 'rgba(0, 230, 118, 0.12)'
                : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${isSaved ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
              color: isSaved ? 'var(--color-success)' : 'var(--text-secondary)',
            }}
            whileTap={{ scale: 0.9 }}
          >
            {isSaved ? (
              <BookmarkCheck size={11} />
            ) : (
              <Bookmark size={11} />
            )}
            {isSaved ? 'Saved' : 'Save'}
          </motion.button>

          <motion.button
            onClick={handleShare}
            className="flex items-center justify-center w-7 h-7 rounded-full transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Share2 size={11} style={{ color: 'var(--text-tertiary)' }} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
