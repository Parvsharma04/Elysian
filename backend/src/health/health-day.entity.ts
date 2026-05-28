// Elysian — Health Day Entity

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('health_days')
@Unique(['user_id', 'date'])
@Index('idx_health_days_user_date', ['user_id', 'date'])
export class HealthDay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'int', default: 0 })
  steps: number;

  @Column({ type: 'int', default: 0 })
  calories: number;

  @Column({ type: 'int', default: 0 })
  active_minutes: number;

  @Column({ type: 'int', nullable: true })
  heart_rate_avg: number | null;

  @Column({ type: 'int', nullable: true })
  heart_rate_resting: number | null;

  @Column({ type: 'int', nullable: true })
  hrv: number | null;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  sleep_hours: number;

  @Column({ type: 'int', default: 0 })
  sleep_quality: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  sleep_deep: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  sleep_rem: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  sleep_light: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  sleep_awake: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  weight: number | null;

  @Column({ type: 'int', default: 0 })
  water_ml: number;

  @Column({ type: 'int', default: 0 })
  protein_g: number;

  @Column({ type: 'int', default: 0 })
  carbs_g: number;

  @Column({ type: 'int', default: 0 })
  fat_g: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
