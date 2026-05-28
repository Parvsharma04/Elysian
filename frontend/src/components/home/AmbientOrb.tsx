'use client';

import { motion } from 'framer-motion';
import { useHealthStore } from '@/store/health-store';

export function AmbientOrb() {
  const readinessScore = useHealthStore((s) => s.readinessScore);

  // Dynamic color based on readiness
  const orbColor = readinessScore >= 75
    ? { primary: '#00e676', secondary: '#00d4ff', glow: 'rgba(0, 230, 118, 0.15)' }
    : readinessScore >= 50
      ? { primary: '#00d4ff', secondary: '#7b61ff', glow: 'rgba(0, 212, 255, 0.12)' }
      : { primary: '#ff4757', secondary: '#ffab00', glow: 'rgba(255, 71, 87, 0.12)' };

  const readinessLabel = readinessScore >= 75
    ? 'You\'re on fire today'
    : readinessScore >= 50
      ? 'Steady energy'
      : 'Rest & recover';

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center py-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-56 h-56 rounded-full"
          style={{
            background: `radial-gradient(circle, ${orbColor.glow} 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Secondary glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-40 h-40 rounded-full"
          style={{
            background: `radial-gradient(circle, ${orbColor.glow} 0%, transparent 60%)`,
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
      </div>

      {/* Main orb */}
      <motion.div
        className="relative w-44 h-44 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(from 0deg, ${orbColor.primary}20, ${orbColor.secondary}20, ${orbColor.primary}20)`,
          border: `2px solid ${orbColor.primary}30`,
          boxShadow: `0 0 60px ${orbColor.glow}, inset 0 0 40px ${orbColor.glow}`,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Inner static content (counter-rotate to stay upright) */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {/* Score */}
          <motion.span
            className="text-5xl font-black tracking-tighter"
            style={{ color: 'var(--text-primary)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {readinessScore}
          </motion.span>

          {/* Label */}
          <span
            className="text-[10px] font-bold uppercase tracking-[0.15em] mt-1"
            style={{ color: orbColor.primary }}
          >
            Readiness
          </span>
        </motion.div>
      </motion.div>

      {/* Status text below orb */}
      <motion.p
        className="mt-5 text-sm font-medium text-center"
        style={{ color: 'var(--text-secondary)' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {readinessLabel}
      </motion.p>
    </motion.div>
  );
}
