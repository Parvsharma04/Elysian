'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StoryCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  body: string;
  gradient?: string;
  children?: React.ReactNode;
  index?: number;
}

export function StoryCard({
  icon: Icon,
  iconColor,
  title,
  body,
  children,
  index = 0,
}: StoryCardProps) {
  return (
    <motion.div
      className="relative rounded-2xl border"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: `${iconColor}14` }}
          >
            <Icon size={16} style={{ color: iconColor }} />
          </div>
          <h3
            className="text-[13px] font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h3>
        </div>

        {/* Body */}
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {body}
        </p>

        {children && <div className="mt-3">{children}</div>}
      </div>
    </motion.div>
  );
}
