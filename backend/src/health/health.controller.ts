// PulseAI — Health Controller

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/jwt.strategy';
import { HealthService } from './health.service';
import { CreateHealthDayDto } from './dto/create-health-day.dto';
import { QueryHealthDto } from './dto/query-health.dto';

@ApiTags('Health')
@ApiBearerAuth('supabase-jwt')
@UseGuards(JwtAuthGuard)
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Get health day aggregates for the last N days' })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: QueryHealthDto,
  ) {
    return this.healthService.findByUser(user.id, query.days);
  }

  @Post()
  @ApiOperation({ summary: 'Upsert a health day record (keyed by user + date)' })
  async upsert(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateHealthDayDto,
  ) {
    return this.healthService.upsert(user.id, dto);
  }
}
