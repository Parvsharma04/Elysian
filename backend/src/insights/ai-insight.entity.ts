// PulseAI — AI Insight Entity

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('ai_insights')
@Index('idx_insights_user_created', ['user_id', 'created_at'])
export class AIInsight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'text' })
  type: 'recovery' | 'nutrition' | 'training' | 'sleep' | 'prediction' | 'warning';

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'text', default: 'medium' })
  priority: 'low' | 'medium' | 'high';

  @Column({ type: 'boolean', default: false })
  is_read: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
