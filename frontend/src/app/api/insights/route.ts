// PulseAI — API: AI Insights

import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error('GET /api/insights error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Generate insights from recent health data
    const { data: recentDays } = await supabase
      .from('health_days')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(7);

    if (!recentDays || recentDays.length === 0) {
      return NextResponse.json({ message: 'No health data to analyze' });
    }

    const insights = generateInsights(recentDays);

    // Insert generated insights
    if (insights.length > 0) {
      const { data, error } = await supabase
        .from('ai_insights')
        .insert(insights.map(i => ({ ...i, user_id: user.id })))
        .select();

      if (error) throw error;
      return NextResponse.json(data);
    }

    return NextResponse.json([]);
  } catch (err) {
    console.error('POST /api/insights error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

interface HealthDayRow {
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

function generateInsights(days: HealthDayRow[]) {
  const insights: { type: string; title: string; body: string; priority: string }[] = [];
  const today = days[0];
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  // HRV drop detection
  const hrvValues = days.map(d => d.hrv).filter((v): v is number => v !== null);
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

  // Sleep consistency
  const sleepHours = days.map(d => d.sleep_hours);
  const avgSleep = avg(sleepHours);
  if (avgSleep < 6.5) {
    insights.push({
      type: 'sleep',
      title: 'Sleep Deficit Detected',
      body: `You've averaged only ${avgSleep.toFixed(1)}h of sleep over the past ${days.length} days. Aim for 7-8h to optimize recovery and performance.`,
      priority: 'high',
    });
  }

  // Protein tracking
  const avgProtein = avg(days.map(d => d.protein_g));
  if (avgProtein < 100) {
    insights.push({
      type: 'nutrition',
      title: 'Protein Gap',
      body: `You averaged ${Math.round(avgProtein)}g protein/day — below the recommended 1.6g/kg for active individuals. Consider adding a post-workout protein source.`,
      priority: 'medium',
    });
  }

  // Weight projection
  const weights = days.map(d => d.weight).filter((w): w is number => w !== null);
  if (weights.length >= 5) {
    const trend = weights[0] - weights[weights.length - 1];
    const projected30 = weights[0] + (trend / weights.length) * 30;
    insights.push({
      type: 'prediction',
      title: 'Weight Projection',
      body: `At your current trajectory, you're projected to reach ${projected30.toFixed(1)}kg in 30 days. ${trend < 0 ? 'Great progress!' : 'Consider adjusting your calorie balance.'}`,
      priority: 'medium',
    });
  }

  // Elevated resting HR
  const rhrValues = days.map(d => d.heart_rate_resting).filter((v): v is number => v !== null);
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
