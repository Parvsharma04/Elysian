// PulseAI — Health Service

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { HealthDay } from './health-day.entity';
import { CreateHealthDayDto } from './dto/create-health-day.dto';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    @InjectRepository(HealthDay)
    private readonly healthDayRepo: Repository<HealthDay>,
  ) {}

  async findByUser(userId: string, days: number = 30): Promise<HealthDay[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    return this.healthDayRepo.find({
      where: {
        user_id: userId,
        date: MoreThanOrEqual(startDateStr),
      },
      order: { date: 'ASC' },
    });
  }

  async upsert(userId: string, dto: CreateHealthDayDto): Promise<HealthDay> {
    // Check if record exists for this user+date
    const existing = await this.healthDayRepo.findOne({
      where: { user_id: userId, date: dto.date },
    });

    if (existing) {
      // Update existing record
      const merged = this.healthDayRepo.merge(existing, {
        ...dto,
        user_id: userId,
      });
      return this.healthDayRepo.save(merged);
    }

    // Create new record
    const entity = this.healthDayRepo.create({
      ...dto,
      user_id: userId,
    });
    return this.healthDayRepo.save(entity);
  }
}
