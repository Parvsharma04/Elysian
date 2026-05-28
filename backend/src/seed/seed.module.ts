// Elysian — Seed Module

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthDay } from '../health/health-day.entity';
import { Workout } from '../workouts/workout.entity';
import { AIInsight } from '../insights/ai-insight.entity';
import { ChatMessage } from '../chat/chat-message.entity';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([HealthDay, Workout, AIInsight, ChatMessage]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
