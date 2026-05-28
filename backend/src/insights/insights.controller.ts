// Elysian — Insights Controller

import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.types';
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

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark an insight as read' })
  async markAsRead(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    await this.insightsService.markAsRead(user.id, id);
    return { success: true };
  }
}
