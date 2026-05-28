// Elysian — Insights Service

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIInsight } from './ai-insight.entity';
import { HealthDay } from '../health/health-day.entity';

interface InsightInput {
  steps: number;
  calories: number;
  heart_rate_resting: number | null;
  hrv: number | null;
  sleep_hours: number;
  sleep_quality: number;
  weight: number | null;
  protein_g: number;
  active_minutes: number;
}

@Injectable()
export class InsightsService {
  private readonly logger = new Logger(InsightsService.name);

  constructor(
    @InjectRepository(AIInsight)
    private readonly insightRepo: Repository<AIInsight>,
    @InjectRepository(HealthDay)
    private readonly healthDayRepo: Repository<HealthDay>,
  ) {}

  async findByUser(userId: string, limit: number = 20): Promise<AIInsight[]> {
    return this.insightRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async generateInsights(userId: string): Promise<AIInsight[]> {
    // Fetch recent health data
    const recentDays = await this.healthDayRepo.find({
      where: { user_id: userId },
      order: { date: 'DESC' },
      take: 7,
    });

    if (!recentDays || recentDays.length === 0) {
      return [];
    }

    const generatedInsights = this.analyzeHealthData(recentDays);

    if (generatedInsights.length === 0) {
      return [];
    }

    // Save insights to DB
    const entities = generatedInsights.map((insight) =>
      this.insightRepo.create({
        ...insight,
        user_id: userId,
      }),
    );

    return this.insightRepo.save(entities);
  }

  async markAsRead(userId: string, insightId: string): Promise<AIInsight | null> {
    const insight = await this.insightRepo.findOne({
      where: { id: insightId, user_id: userId },
    });

    if (!insight) return null;

    insight.is_read = true;
    return this.insightRepo.save(insight);
  }

  /**
   * Analyze health data and generate AI insights.
   * This is a template-based engine — designed as a plug-in point for LLM integration.
   */
  private analyzeHealthData(
    days: InsightInput[],
  ): Partial<AIInsight>[] {
    const insights: Partial<AIInsight>[] = [];
    const today = days[0];
    const avg = (arr: number[]) =>
      arr.reduce((a, b) => a + b, 0) / arr.length;

    // 1. HRV drop detection
    const hrvValues = days
      .map((d) => d.hrv)
      .filter((v): v is number => v !== null);
    if (hrvValues.length >= 3) {
      const recentAvg = avg(hrvValues.slice(0, 3));
      const weekAvg = avg(hrvValues);
      if (recentAvg < weekAvg * 0.82) {
        insights.push({
          type: 'recovery',
          title: 'Recovery Alert',
          body: `Your HRV dropped ${Math.round((1 - recentAvg / weekAvg) * 100)}% below your 7-day baseline. Consider reducing workout intensity today and prioritizing sleep tonight.`,
          priority: 'high',
        });
      }
    }

    // 2. Sleep deficit
    const sleepHours = days.map((d) => d.sleep_hours);
    const avgSleep = avg(sleepHours);
    if (avgSleep < 6.5) {
      insights.push({
        type: 'sleep',
        title: 'Sleep Deficit Detected',
        body: `You've averaged only ${avgSleep.toFixed(1)}h of sleep over the past ${days.length} days. Aim for 7-8h to optimize recovery and performance.`,
        priority: 'high',
      });
    }

    // 3. Protein gap
    const avgProtein = avg(days.map((d) => d.protein_g));
    if (avgProtein < 100) {
      insights.push({
        type: 'nutrition',
        title: 'Protein Gap',
        body: `You averaged ${Math.round(avgProtein)}g protein/day — below the recommended 1.6g/kg for active individuals. Consider adding a post-workout protein source.`,
        priority: 'medium',
      });
    }

    // 4. Weight projection
    const weights = days
      .map((d) => d.weight)
      .filter((w): w is number => w !== null);
    if (weights.length >= 5) {
      const trend = weights[0]! - weights[weights.length - 1]!;
      const projected30 = weights[0]! + (trend / weights.length) * 30;
      insights.push({
        type: 'prediction',
        title: 'Weight Projection',
        body: `At your current trajectory, you're projected to reach ${projected30.toFixed(1)}kg in 30 days. ${trend < 0 ? 'Great progress!' : 'Consider adjusting your calorie balance.'}`,
        priority: 'medium',
      });
    }

    // 5. Elevated resting heart rate
    const rhrValues = days
      .map((d) => d.heart_rate_resting)
      .filter((v): v is number => v !== null);
    if (rhrValues.length >= 3 && today.heart_rate_resting) {
      const baselineRHR = avg(rhrValues);
      if (today.heart_rate_resting > baselineRHR + 5) {
        insights.push({
          type: 'warning',
          title: 'Elevated Resting Heart Rate',
          body: `Your resting HR is ${today.heart_rate_resting}bpm — ${Math.round(today.heart_rate_resting - baselineRHR)}bpm above your recent baseline. This may indicate accumulated fatigue or stress.`,
          priority: 'high',
        });
      }
    }

    return insights;
  }
}
