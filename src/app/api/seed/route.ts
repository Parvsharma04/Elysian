// PulseAI — API: Seed Demo Data

import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function POST() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check if user already has data
    const { data: existing } = await supabase
      .from('health_days')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ message: 'Data already exists' });
    }

    // Generate 30 days of realistic demo data
    const days = generateDemoHealthDays(user.id);
    const workouts = generateDemoWorkouts(user.id, days);
    const insights = generateDemoInsights(user.id);
    const chatMessages = generateDemoChatHistory(user.id);

    // Insert all data
    const { error: daysErr } = await supabase.from('health_days').insert(days);
    if (daysErr) throw daysErr;

    const { error: workoutsErr } = await supabase.from('workouts').insert(workouts);
    if (workoutsErr) throw workoutsErr;

    const { error: insightsErr } = await supabase.from('ai_insights').insert(insights);
    if (insightsErr) throw insightsErr;

    const { error: chatErr } = await supabase.from('chat_messages').insert(chatMessages);
    if (chatErr) throw chatErr;

    return NextResponse.json({ message: 'Demo data seeded successfully', counts: { days: days.length, workouts: workouts.length, insights: insights.length, chatMessages: chatMessages.length } });
  } catch (err) {
    console.error('POST /api/seed error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function generateDemoHealthDays(userId: string) {
  const days = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const fatigueFactor = Math.sin((i / 7) * Math.PI) * 0.15;

    days.push({
      user_id: userId,
      date: date.toISOString().split('T')[0],
      steps: Math.round(8500 + (Math.random() - 0.3) * 4000 + (isWeekend ? -2000 : 0) + fatigueFactor * 1000),
      calories: Math.round(1800 + Math.random() * 800 + (isWeekend ? -200 : 200)),
      active_minutes: Math.round(30 + Math.random() * 60 + (isWeekend ? -10 : 15)),
      heart_rate_avg: Math.round(68 + Math.random() * 12 + fatigueFactor * 5),
      heart_rate_resting: Math.round(58 + Math.random() * 8 + fatigueFactor * 3),
      hrv: Math.round(45 + Math.random() * 25 - fatigueFactor * 10),
      sleep_hours: +(6 + Math.random() * 2.5 + (isWeekend ? 0.5 : 0)).toFixed(1),
      sleep_quality: Math.round(60 + Math.random() * 35),
      sleep_deep: +(1 + Math.random() * 1.5).toFixed(1),
      sleep_rem: +(1 + Math.random() * 1.2).toFixed(1),
      sleep_light: +(2.5 + Math.random() * 1.5).toFixed(1),
      sleep_awake: +(0.2 + Math.random() * 0.6).toFixed(1),
      weight: +(78.5 - i * 0.06 + Math.random() * 0.8 - 0.4).toFixed(1),
      water_ml: Math.round(1500 + Math.random() * 1500),
      protein_g: Math.round(80 + Math.random() * 70),
      carbs_g: Math.round(150 + Math.random() * 120),
      fat_g: Math.round(50 + Math.random() * 40),
    });
  }
  return days;
}

function generateDemoWorkouts(userId: string, days: { date: string }[]) {
  const types = ['strength', 'running', 'yoga', 'hiit', 'cycling', 'swimming', 'cardio'] as const;
  const names: Record<string, string[]> = {
    strength: ['Upper Body Push', 'Lower Body', 'Full Body', 'Pull Day'],
    running: ['Morning Run', 'Interval Sprints', 'Easy Jog', 'Long Run'],
    yoga: ['Recovery Flow', 'Power Yoga', 'Morning Stretch'],
    hiit: ['Tabata Circuit', 'EMOM Burner', 'Metabolic Blast'],
    cycling: ['Evening Ride', 'Hill Intervals', 'Steady State'],
    swimming: ['Lap Swimming', 'Sprint Intervals'],
    cardio: ['Stair Climber', 'Rowing Machine', 'Elliptical'],
  };
  const intensities = ['low', 'moderate', 'high', 'extreme'] as const;

  const workouts = [];
  // Generate ~10 workouts spread over 30 days
  const workoutDays = [0, 1, 2, 3, 5, 7, 9, 11, 14, 18];
  for (const dayIdx of workoutDays) {
    if (dayIdx >= days.length) continue;
    const type = types[Math.floor(Math.random() * types.length)];
    const name = names[type][Math.floor(Math.random() * names[type].length)];
    workouts.push({
      user_id: userId,
      date: days[days.length - 1 - dayIdx]?.date || days[days.length - 1].date,
      type,
      name,
      duration: Math.round(25 + Math.random() * 45),
      calories: Math.round(200 + Math.random() * 250),
      intensity: intensities[Math.floor(Math.random() * intensities.length)],
      heart_rate_avg: Math.round(120 + Math.random() * 50),
    });
  }
  return workouts;
}

function generateDemoInsights(userId: string) {
  return [
    { user_id: userId, type: 'recovery', title: 'Recovery Alert', body: 'Your HRV dropped 18% below your 7-day baseline. Consider reducing workout intensity today and prioritizing sleep tonight.', priority: 'high' },
    { user_id: userId, type: 'prediction', title: 'Weight Projection', body: "At your current trajectory, you're projected to reach 76.2kg in 30 days. Maintaining a 300kcal deficit with 140g+ protein will optimize body composition.", priority: 'medium' },
    { user_id: userId, type: 'training', title: 'Plateau Warning', body: 'Your running pace has stagnated over the past 2 weeks. Try incorporating interval training 2x/week to break through.', priority: 'medium' },
    { user_id: userId, type: 'sleep', title: 'Sleep Pattern Detected', body: "Your deep sleep has improved 22% this week, likely due to consistent bedtime. Keep your 11PM routine — it's working.", priority: 'low' },
    { user_id: userId, type: 'nutrition', title: 'Protein Gap', body: 'You averaged 95g protein yesterday — 45g below your target for your training load. Consider adding a post-workout shake.', priority: 'high' },
    { user_id: userId, type: 'warning', title: 'Overtraining Risk', body: "You've trained at high intensity 5 of the last 7 days. Your resting HR is elevated +6bpm. Schedule a rest day to prevent burnout.", priority: 'high' },
  ];
}

function generateDemoChatHistory(userId: string) {
  return [
    { user_id: userId, role: 'assistant', content: "Good morning! 👋 I've analyzed your overnight data. Your recovery score is **72** — moderate. Your HRV dipped slightly, but sleep quality was solid at 81%. I'd suggest a moderate-intensity workout today. Want me to generate a plan?" },
    { user_id: userId, role: 'user', content: 'Yeah, generate a workout for today. Upper body focused.' },
    { user_id: userId, role: 'assistant', content: "💪 Here's your **Upper Body Push** workout optimized for your current recovery:\n\n**Warm-up** (5 min)\n- Arm circles, band pull-aparts\n\n**Main Block** (40 min)\n1. Bench Press — 4×8 @ RPE 7\n2. OHP — 3×10 @ RPE 7\n3. Incline DB Press — 3×12\n4. Cable Flyes — 3×15\n5. Lateral Raises — 4×12\n6. Tricep Pushdowns — 3×15\n\n**Cooldown** (5 min)\n- Chest & shoulder stretches\n\n*Intensity kept at moderate given your HRV. Not medical advice.*" },
  ];
}
