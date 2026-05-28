// Elysian — Derived Health Metrics

// Uses a generic interface so it works with both local data and Supabase data
interface DayMetrics {
  steps: number;
  calories: number;
  activeMinutes: number;
  heartRateAvg: number;
  heartRateResting: number;
  hrv: number;
  sleepHours: number;
  sleepQuality: number;
  sleepDeep: number;
  sleepRem: number;
  sleepLight: number;
  sleepAwake: number;
  weight: number;
  waterMl: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export function calcRecoveryScore(day: DayMetrics, prevDay?: DayMetrics): number {
  let score = 50;

  if (day.hrv > 55) score += 15;
  else if (day.hrv > 45) score += 8;
  else score -= 5;

  if (day.heartRateResting < 58) score += 12;
  else if (day.heartRateResting < 62) score += 6;
  else if (day.heartRateResting > 68) score -= 8;

  score += Math.round((day.sleepQuality - 50) * 0.3);

  if (day.sleepHours >= 7.5) score += 10;
  else if (day.sleepHours >= 6.5) score += 4;
  else score -= 8;

  if (prevDay) {
    if (day.heartRateResting > prevDay.heartRateResting + 4) score -= 6;
    if (day.hrv < prevDay.hrv - 10) score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}

export function calcFatigueScore(days: DayMetrics[]): number {
  if (days.length < 3) return 30;
  const recent = days.slice(-3);

  let fatigue = 20;

  const avgRHR = recent.reduce((s, d) => s + d.heartRateResting, 0) / recent.length;
  if (avgRHR > 65) fatigue += 20;
  else if (avgRHR > 62) fatigue += 10;

  const avgHRV = recent.reduce((s, d) => s + d.hrv, 0) / recent.length;
  if (avgHRV < 40) fatigue += 25;
  else if (avgHRV < 50) fatigue += 10;

  const avgSleep = recent.reduce((s, d) => s + d.sleepHours, 0) / recent.length;
  if (avgSleep < 6) fatigue += 20;
  else if (avgSleep < 7) fatigue += 10;

  const avgActive = recent.reduce((s, d) => s + d.activeMinutes, 0) / recent.length;
  if (avgActive > 80) fatigue += 10;

  return Math.max(0, Math.min(100, fatigue));
}

export function calcConsistencyScore(days: DayMetrics[]): number {
  if (days.length < 7) return 50;
  const week = days.slice(-7);

  let score = 0;

  const stepDays = week.filter(d => d.steps >= 7000).length;
  score += (stepDays / 7) * 30;

  const sleepDays = week.filter(d => d.sleepHours >= 7).length;
  score += (sleepDays / 7) * 30;

  const activeDays = week.filter(d => d.activeMinutes >= 30).length;
  score += (activeDays / 7) * 25;

  const waterDays = week.filter(d => d.waterMl >= 2000).length;
  score += (waterDays / 7) * 15;

  return Math.round(Math.max(0, Math.min(100, score)));
}

export function calcSleepQualityScore(day: DayMetrics): number {
  if (!day.sleepHours || day.sleepHours === 0) return 0;

  let score = 0;

  if (day.sleepHours >= 7.5 && day.sleepHours <= 9) score += 35;
  else if (day.sleepHours >= 7) score += 28;
  else if (day.sleepHours >= 6) score += 18;
  else score += 8;

  const deepRatio = day.sleepDeep / day.sleepHours;
  score += Math.round(deepRatio * 100);
  if (score > 60) score = 60;

  const remRatio = day.sleepRem / day.sleepHours;
  score += Math.round(remRatio * 80);

  if (day.sleepAwake < 0.3) score += 20;
  else if (day.sleepAwake < 0.5) score += 14;
  else if (day.sleepAwake < 0.8) score += 8;

  return Math.max(0, Math.min(100, score));
}

export function calcBurnoutRisk(days: DayMetrics[]): { level: 'low' | 'moderate' | 'high' | 'critical'; score: number } {
  const fatigue = calcFatigueScore(days);
  const consistency = calcConsistencyScore(days);

  const risk = Math.round(fatigue * 0.6 + (100 - consistency) * 0.4);

  let level: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  if (risk > 75) level = 'critical';
  else if (risk > 55) level = 'high';
  else if (risk > 35) level = 'moderate';

  return { level, score: risk };
}

export function calcReadinessScore(day: DayMetrics, prevDay?: DayMetrics): number {
  const recovery = calcRecoveryScore(day, prevDay);
  const sleepQ = calcSleepQualityScore(day);
  return Math.round(recovery * 0.6 + sleepQ * 0.4);
}

export function getWeightProjection(days: DayMetrics[], daysAhead: number = 30): number[] {
  if (days.length < 7) return [];
  const recent = days.slice(-14);
  const weights = recent.map(d => d.weight).filter(w => w > 0);

  if (weights.length < 3) return [];

  const n = weights.length;
  const xMean = (n - 1) / 2;
  const yMean = weights.reduce((a, b) => a + b, 0) / n;

  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (weights[i] - yMean);
    den += (i - xMean) ** 2;
  }
  const slope = den !== 0 ? num / den : 0;

  const projections: number[] = [];
  for (let i = 1; i <= daysAhead; i++) {
    projections.push(+(yMean + slope * (n + i - 1 - xMean)).toFixed(1));
  }
  return projections;
}

export function getStreakDays(days: DayMetrics[]): number {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].steps >= 5000 && days[i].activeMinutes >= 20) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
