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
  gradient,
  children,
  index = 0,
}: StoryCardProps) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background gradient accent */}
      {gradient && (
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ background: gradient }}
        />
      )}

      {/* Card body */}
      <div
        className="relative p-5 border border-white/[0.04] rounded-3xl"
        style={{
          background: 'rgba(12, 12, 20, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: `${iconColor}12` }}
          >
            <Icon size={17} style={{ color: iconColor }} />
          </div>
          <div className="flex-1">
            <h3
              className="text-sm font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Body text */}
        <p
          className="text-xs leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {body}
        </p>

        {/* Optional child content */}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </motion.div>
  );
}
