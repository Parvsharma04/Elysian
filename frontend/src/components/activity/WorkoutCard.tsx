'use client';

import { motion } from 'framer-motion';
import type { WorkoutData } from '@/store/health-store';
import {
  Dumbbell,
  Bike,
  Flame,
  Waves,
  Zap,
  Wind,
  Footprints,
} from 'lucide-react';

const typeIcons: Record<WorkoutData['type'], typeof Dumbbell> = {
  strength: Dumbbell,
  cardio: Flame,
  yoga: Wind,
  hiit: Zap,
  cycling: Bike,
  running: Footprints,
  swimming: Waves,
};

const typeColors: Record<WorkoutData['type'], string> = {
  strength: '#00d4ff',
  cardio: '#ff6b6b',
  yoga: '#b388ff',
  hiit: '#ffab00',
  cycling: '#c6ff00',
  running: '#00e676',
  swimming: '#448aff',
};

const intensityColors: Record<WorkoutData['intensity'], string> = {
  low: 'var(--color-success)',
  moderate: 'var(--color-info)',
  high: 'var(--color-warning)',
  extreme: 'var(--color-danger)',
};

interface WorkoutCardProps {
  workout: WorkoutData;
  index?: number;
}

export function WorkoutCard({ workout, index = 0 }: WorkoutCardProps) {
  const Icon = typeIcons[workout.type];
  const color = typeColors[workout.type];

  return (
    <motion.div
      className="card-base p-4 flex items-center gap-3"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl"
        style={{ background: `${color}12` }}
      >
        <Icon size={20} style={{ color }} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
          {workout.name}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{workout.duration} min</span>
          <span style={{ color: 'var(--border-default)' }}>·</span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{workout.calories} kcal</span>
          {workout.heartRateAvg && (
            <>
              <span style={{ color: 'var(--border-default)' }}>·</span>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>♥ {workout.heartRateAvg}</span>
            </>
          )}
        </div>
      </div>

      <span
        className="score-badge flex-shrink-0"
        style={{
          background: `${intensityColors[workout.intensity]}10`,
          color: intensityColors[workout.intensity],
          border: `1px solid ${intensityColors[workout.intensity]}18`,
        }}
      >
        {workout.intensity}
      </span>
    </motion.div>
  );
}
