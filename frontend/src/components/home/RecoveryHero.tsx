'use client';

import { useHealthStore } from '@/store/health-store';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Zap, Heart, BrainCircuit, Shield } from 'lucide-react';

export function RecoveryHero() {
  const readinessScore = useHealthStore((s) => s.readinessScore);
  const recoveryScore = useHealthStore((s) => s.recoveryScore);
  const fatigueScore = useHealthStore((s) => s.fatigueScore);
  const burnoutRisk = useHealthStore((s) => s.burnoutRisk);
  const consistencyScore = useHealthStore((s) => s.consistencyScore);

  const readinessLabel = readinessScore >= 75 ? 'Ready to go' : readinessScore >= 50 ? 'Moderate' : 'Take it easy';

  return (
    <div className="card-base p-5 flex flex-col items-center gap-5 relative overflow-hidden">
      {/* Breathing glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full animate-breathe pointer-events-none"
        style={{
          background: readinessScore >= 75
            ? 'radial-gradient(circle, rgba(0, 230, 118, 0.08) 0%, transparent 70%)'
            : readinessScore >= 50
              ? 'radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(255, 71, 87, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Status label */}
      <div className="flex items-center gap-2">
        <Shield size={12} style={{ color: 'var(--text-tertiary)' }} />
        <span className="label-small">{readinessLabel}</span>
      </div>

      {/* Main ring */}
      <ScoreRing
        score={readinessScore}
        size={170}
        strokeWidth={10}
        label="Readiness"
      />

      {/* Secondary metrics row */}
      <div
        className="flex items-stretch w-full rounded-md overflow-hidden"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
      >
        <Stat icon={Heart} label="Recovery" value={recoveryScore} color="var(--recovery-purple)" />
        <div className="w-px" style={{ background: 'var(--border-subtle)' }} />
        <Stat icon={Zap} label="Fatigue" value={fatigueScore} color="var(--color-warning)" invert />
        <div className="w-px" style={{ background: 'var(--border-subtle)' }} />
        <Stat
          icon={BrainCircuit}
          label="Burnout"
          value={burnoutRisk.score}
          color={
            burnoutRisk.level === 'critical' ? 'var(--color-danger)'
              : burnoutRisk.level === 'high' ? 'var(--color-warning)'
                : 'var(--color-success)'
          }
          invert
        />
        <div className="w-px" style={{ background: 'var(--border-subtle)' }} />
        <Stat icon={Shield} label="Consistency" value={consistencyScore} color="var(--lime-energy)" />
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
  invert = false,
}: {
  icon: typeof Heart;
  label: string;
  value: number;
  color: string;
  invert?: boolean;
}) {
  const displayColor = invert
    ? value > 60 ? 'var(--color-danger)' : value > 40 ? 'var(--color-warning)' : 'var(--color-success)'
    : color;

  return (
    <div className="flex-1 flex flex-col items-center gap-1 py-3 px-2">
      <Icon size={13} style={{ color: displayColor }} />
      <span className="text-base font-bold mono" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
      <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </span>
    </div>
  );
}
