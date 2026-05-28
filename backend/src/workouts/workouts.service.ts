// Elysian — Workouts Service

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from './workout.entity';
import { CreateWorkoutDto } from './dto/create-workout.dto';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepo: Repository<Workout>,
  ) {}

  async findByUser(userId: string, limit: number = 20): Promise<Workout[]> {
    return this.workoutRepo.find({
      where: { user_id: userId },
      order: { date: 'DESC' },
      take: limit,
    });
  }

  async create(userId: string, dto: CreateWorkoutDto): Promise<Workout> {
    const entity = this.workoutRepo.create({
      ...dto,
      user_id: userId,
    });
    return this.workoutRepo.save(entity);
  }

  async delete(userId: string, workoutId: string): Promise<void> {
    const workout = await this.workoutRepo.findOne({
      where: { id: workoutId },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    if (workout.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own workouts');
    }

    await this.workoutRepo.remove(workout);
  }
}
