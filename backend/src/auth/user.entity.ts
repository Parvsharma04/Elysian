// Elysian — User Entity

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  password_hash: string | null;

  @Column({ type: 'text', nullable: true })
  name: string | null;

  @Column({ type: 'text', nullable: true })
  avatar_url: string | null;

  @Column({ type: 'text', nullable: true, unique: true })
  google_id: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
