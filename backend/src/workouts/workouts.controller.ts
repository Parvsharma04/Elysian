// Elysian — Workouts Controller

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.types';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';

@ApiTags('Workouts')
@ApiBearerAuth('supabase-jwt')
@UseGuards(JwtAuthGuard)
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  @ApiOperation({ summary: 'List recent workouts (limit 20)' })
  async findAll(@CurrentUser() user: AuthUser) {
    return this.workoutsService.findByUser(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new workout' })
  async create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateWorkoutDto,
  ) {
    return this.workoutsService.create(user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workout by ID (owner-only)' })
  async delete(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    await this.workoutsService.delete(user.id, id);
    return { success: true };
  }
}
