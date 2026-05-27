// PulseAI — Insights Controller

import {
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/jwt.strategy';
import { InsightsService } from './insights.service';

@ApiTags('Insights')
@ApiBearerAuth('supabase-jwt')
@UseGuards(JwtAuthGuard)
@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch recent AI insights' })
  async findAll(@CurrentUser() user: AuthUser) {
    return this.insightsService.findByUser(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Auto-generate AI insights from recent health data' })
  async generate(@CurrentUser() user: AuthUser) {
    const insights = await this.insightsService.generateInsights(user.id);
    if (insights.length === 0) {
      return { message: 'No health data to analyze' };
    }
    return insights;
  }
}
