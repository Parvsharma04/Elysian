// PulseAI — Local Data Generator
// Generates realistic health data for demo/offline mode
// This replaces mock-data.ts — not used when Supabase is connected

import type { HealthDayData, WorkoutData, InsightData, ChatMessageData } from '@/store/health-store';

export const suggestedPrompts = [
  '🏋️ Generate today\'s workout',
  '😴 Analyze my sleep patterns',
  '📉 Predict my weight in 30 days',
  '🔥 Am I overtraining?',
  '🥗 Create a meal plan',
  '💪 How\'s my recovery?',
  '📊 Weekly progress summary',
  '⚡ What if I increase my steps?',
];

function generateDays(): HealthDayData[] {
  const days: HealthDayData[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const fatigueFactor = Math.sin((i / 7) * Math.PI) * 0.15;

    days.push({
      date: date.toISOString().split('T')[0],
      steps: Math.round(8500 + (Math.random() - 0.3) * 4000 + (isWeekend ? -2000 : 0) + fatigueFactor * 1000),
      calories: Math.round(1800 + Math.random() * 800 + (isWeekend ? -200 : 200)),
      activeMinutes: Math.round(30 + Math.random() * 60 + (isWeekend ? -10 : 15)),
      heartRateAvg: Math.round(68 + Math.random() * 12 + fatigueFactor * 5),
      heartRateResting: Math.round(58 + Math.random() * 8 + fatigueFactor * 3),
      hrv: Math.round(45 + Math.random() * 25 - fatigueFactor * 10),
      sleepHours: +(6 + Math.random() * 2.5 + (isWeekend ? 0.5 : 0)).toFixed(1),
      sleepQuality: Math.round(60 + Math.random() * 35),
      sleepDeep: +(1 + Math.random() * 1.5).toFixed(1),
      sleepRem: +(1 + Math.random() * 1.2).toFixed(1),
      sleepLight: +(2.5 + Math.random() * 1.5).toFixed(1),
      sleepAwake: +(0.2 + Math.random() * 0.6).toFixed(1),
      weight: +(78.5 - i * 0.06 + Math.random() * 0.8 - 0.4).toFixed(1),
      waterMl: Math.round(1500 + Math.random() * 1500),
      proteinG: Math.round(80 + Math.random() * 70),
      carbsG: Math.round(150 + Math.random() * 120),
      fatG: Math.round(50 + Math.random() * 40),
    });
  }
  return days;
}

function generateWorkouts(days: HealthDayData[]): WorkoutData[] {
  return [
    { id: 'w1', date: days[29].date, type: 'strength', name: 'Upper Body Push', duration: 52, calories: 340, intensity: 'high', heartRateAvg: 132 },
    { id: 'w2', date: days[28].date, type: 'running', name: 'Morning Run', duration: 35, calories: 420, intensity: 'moderate', heartRateAvg: 148 },
    { id: 'w3', date: days[27].date, type: 'yoga', name: 'Recovery Flow', duration: 40, calories: 120, intensity: 'low', heartRateAvg: 88 },
    { id: 'w4', date: days[26].date, type: 'hiit', name: 'Tabata Circuit', duration: 28, calories: 380, intensity: 'extreme', heartRateAvg: 162 },
    { id: 'w5', date: days[25].date, type: 'strength', name: 'Lower Body', duration: 58, calories: 360, intensity: 'high', heartRateAvg: 128 },
    { id: 'w6', date: days[24].date, type: 'cycling', name: 'Evening Ride', duration: 45, calories: 310, intensity: 'moderate', heartRateAvg: 138 },
    { id: 'w7', date: days[22].date, type: 'swimming', name: 'Lap Swimming', duration: 40, calories: 350, intensity: 'moderate', heartRateAvg: 134 },
    { id: 'w8', date: days[21].date, type: 'running', name: 'Interval Sprints', duration: 25, calories: 320, intensity: 'extreme', heartRateAvg: 168 },
    { id: 'w9', date: days[20].date, type: 'strength', name: 'Full Body', duration: 65, calories: 410, intensity: 'high', heartRateAvg: 125 },
    { id: 'w10', date: days[18].date, type: 'cardio', name: 'Stair Climber', duration: 30, calories: 280, intensity: 'moderate', heartRateAvg: 142 },
  ];
}

function generateInsights(): InsightData[] {
  const now = Date.now();
  return [
    { id: 'i1', timestamp: new Date(now).toISOString(), type: 'recovery', title: 'Recovery Alert', body: 'Your HRV dropped 18% below your 7-day baseline. Consider reducing workout intensity today and prioritizing sleep tonight.', priority: 'high' },
    { id: 'i2', timestamp: new Date(now - 3600000).toISOString(), type: 'prediction', title: 'Weight Projection', body: "At your current trajectory, you're projected to reach 76.2kg in 30 days. Maintaining a 300kcal deficit with 140g+ protein will optimize body composition.", priority: 'medium' },
    { id: 'i3', timestamp: new Date(now - 7200000).toISOString(), type: 'training', title: 'Plateau Warning', body: 'Your running pace has stagnated over the past 2 weeks. Try incorporating interval training 2x/week to break through.', priority: 'medium' },
    { id: 'i4', timestamp: new Date(now - 14400000).toISOString(), type: 'sleep', title: 'Sleep Pattern Detected', body: "Your deep sleep has improved 22% this week, likely due to consistent bedtime. Keep your 11PM routine — it's working.", priority: 'low' },
    { id: 'i5', timestamp: new Date(now - 28800000).toISOString(), type: 'nutrition', title: 'Protein Gap', body: 'You averaged 95g protein yesterday — 45g below your target for your training load. Consider adding a post-workout shake.', priority: 'high' },
    { id: 'i6', timestamp: new Date(now - 43200000).toISOString(), type: 'warning', title: 'Overtraining Risk', body: "You've trained at high intensity 5 of the last 7 days. Your resting HR is elevated +6bpm. Schedule a rest day to prevent burnout.", priority: 'high' },
  ];
}

function generateChatHistory(): ChatMessageData[] {
  const now = Date.now();
  return [
    { id: 'c1', role: 'assistant', content: "Good morning! 👋 I've analyzed your overnight data. Your recovery score is **72** — moderate. Your HRV dipped slightly, but sleep quality was solid at 81%. I'd suggest a moderate-intensity workout today. Want me to generate a plan?", timestamp: new Date(now - 3600000).toISOString() },
    { id: 'c2', role: 'user', content: 'Yeah, generate a workout for today. Upper body focused.', timestamp: new Date(now - 3500000).toISOString() },
    { id: 'c3', role: 'assistant', content: "💪 Here's your **Upper Body Push** workout optimized for your current recovery:\n\n**Warm-up** (5 min)\n- Arm circles, band pull-aparts\n\n**Main Block** (40 min)\n1. Bench Press — 4×8 @ RPE 7\n2. OHP — 3×10 @ RPE 7\n3. Incline DB Press — 3×12\n4. Cable Flyes — 3×15\n5. Lateral Raises — 4×12\n6. Tricep Pushdowns — 3×15\n\n**Cooldown** (5 min)\n- Chest & shoulder stretches\n\n*Intensity kept at moderate given your HRV. Not medical advice.*", timestamp: new Date(now - 3400000).toISOString() },
  ];
}

let cachedData: ReturnType<typeof generateLocalMockData> | null = null;

export function generateLocalMockData() {
  if (cachedData) return cachedData;

  const days = generateDays();
  const workouts = generateWorkouts(days);
  const insights = generateInsights();
  const chatMessages = generateChatHistory();

  cachedData = { days, workouts, insights, chatMessages };
  return cachedData;
}
