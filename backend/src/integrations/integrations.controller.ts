// Elysian — Integrations Controller

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
import { IntegrationsService } from './integrations.service';
import { ConnectIntegrationDto } from './dto/connect-integration.dto';
import { IntegrationProvider } from './integration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthDay } from '../health/health-day.entity';
import { Workout } from '../workouts/workout.entity';

@ApiTags('Integrations')
@ApiBearerAuth('supabase-jwt')
@UseGuards(JwtAuthGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(
    private readonly integrationsService: IntegrationsService,
    @InjectRepository(HealthDay)
    private readonly healthDayRepo: Repository<HealthDay>,
    @InjectRepository(Workout)
    private readonly workoutRepo: Repository<Workout>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all integrations for the current user' })
  async findAll(@CurrentUser() user: AuthUser) {
    return this.integrationsService.findByUser(user.id);
  }

  @Post('connect')
  @ApiOperation({ summary: 'Connect a health data provider' })
  async connect(
    @CurrentUser() user: AuthUser,
    @Body() dto: ConnectIntegrationDto,
  ) {
    return this.integrationsService.connect(user.id, dto);
  }

  @Delete(':provider')
  @ApiOperation({ summary: 'Disconnect a health data provider' })
  async disconnect(
    @CurrentUser() user: AuthUser,
    @Param('provider') provider: IntegrationProvider,
  ) {
    return this.integrationsService.disconnect(user.id, provider);
  }

  @Post(':provider/sync')
  @ApiOperation({ summary: 'Trigger a manual sync for a provider' })
  async triggerSync(
    @CurrentUser() user: AuthUser,
    @Param('provider') provider: IntegrationProvider,
  ) {
    const integration = await this.integrationsService.syncStatus(user.id, provider);
    if (!integration || integration.status !== 'connected') {
      return { error: 'Integration not connected' };
    }
    return this.integrationsService.updateSyncStatus(user.id, provider, 0);
  }

  @Post('push/health-days')
  @ApiOperation({ summary: 'Push health day data from native Health Connect bridge' })
  async pushHealthDays(
    @CurrentUser() user: AuthUser,
    @Body() body: { days: Record<string, any>[] },
  ) {
    let count = 0;
    for (const day of body.days || []) {
      const date = day.date;
      if (!date) continue;

      const updates: Record<string, any> = {};
      for (const [key, value] of Object.entries(day)) {
        if (key === 'date') continue;
        if (value !== null && value !== undefined && value !== 0) {
          updates[key] = value;
        }
      }

      const existing = await this.healthDayRepo.findOne({
        where: { user_id: user.id, date },
      });

      if (existing) {
        this.healthDayRepo.merge(existing, updates);
        await this.healthDayRepo.save(existing);
      } else {
        await this.healthDayRepo.save(
          this.healthDayRepo.create({ user_id: user.id, date, ...updates }),
        );
      }
      count++;
    }

    // Update integration sync status
    try {
      await this.integrationsService.updateSyncStatus(user.id, 'health_connect', count);
    } catch { /* integration might not exist */ }

    return { synced: count };
  }

  @Post('push/workouts')
  @ApiOperation({ summary: 'Push workout data from native Health Connect bridge' })
  async pushWorkouts(
    @CurrentUser() user: AuthUser,
    @Body() body: { workouts: Record<string, any>[] },
  ) {
    let count = 0;
    for (const w of body.workouts || []) {
      if (!w.date) continue;
      await this.workoutRepo.save(
        this.workoutRepo.create({
          user_id: user.id,
          date: w.date,
          type: w.type || 'cardio',
          name: w.name || 'Workout',
          duration: w.duration || 0,
          calories: w.calories || 0,
          intensity: w.intensity || 'moderate',
          heart_rate_avg: w.heart_rate_avg || null,
        }),
      );
      count++;
    }

    try {
      await this.integrationsService.updateSyncStatus(user.id, 'health_connect', count);
    } catch { /* integration might not exist */ }

    return { synced: count };
  }
}
