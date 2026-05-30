// Elysian — Integration Entity

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type IntegrationProvider = 'apple_health' | 'health_connect';
export type IntegrationStatus = 'connected' | 'disconnected' | 'syncing' | 'error';

@Entity('integrations')
export class Integration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'text' })
  provider: IntegrationProvider;

  @Column({ type: 'text', default: 'connected' })
  status: IntegrationStatus;

  @Column({ type: 'timestamptz', nullable: true })
  last_synced_at: Date | null;

  @Column({ type: 'int', default: 0 })
  records_synced: number;

  @Column({ type: 'jsonb', default: '{}' })
  metadata: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
