// Elysian — Workout Entity

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('workouts')
@Index('idx_workouts_user_date', ['user_id', 'date'])
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text' })
  type: 'strength' | 'cardio' | 'yoga' | 'hiit' | 'cycling' | 'running' | 'swimming';

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'int', default: 0 })
  calories: number;

  @Column({ type: 'text' })
  intensity: 'low' | 'moderate' | 'high' | 'extreme';

  @Column({ type: 'int', nullable: true })
  heart_rate_avg: number | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
