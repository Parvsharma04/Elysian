// PulseAI — Profile Entity

import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  display_name: string | null;

  @Column({ type: 'text', nullable: true })
  avatar_url: string | null;

  @Column({
    type: 'text',
    default: 'free',
  })
  subscription_tier: 'free' | 'pro' | 'elite';

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  target_weight: number | null;

  @Column({ type: 'int', default: 10000 })
  target_steps: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 7.5 })
  target_sleep_hours: number;

  @Column({ type: 'int', default: 140 })
  target_protein: number;

  @Column({ type: 'boolean', default: false })
  onboarded: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
