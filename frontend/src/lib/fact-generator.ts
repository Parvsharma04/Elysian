// Elysian — AI-Powered Fact Generator
// Generates engaging, contextual fun facts from health data

import type { HealthDayData, WorkoutData } from '@/store/health-store';

export interface PulseFact {
  id: string;
  emoji: string;
  title: string;
  body: string;
  category: 'distance' | 'energy' | 'body' | 'sleep' | 'achievement' | 'cosmic';
  gradient: string;
  generatedAt: string;
  metric?: { value: number; unit: string };
}

// Earth/space constants
const EARTH_TO_MOON_KM = 384400;
const EARTH_CIRCUMFERENCE_KM = 40075;
const MARATHON_KM = 42.195;
const EIFFEL_TOWER_M = 330;
const EVEREST_M = 8849;
const AVG_STEP_M = 0.762;

// City distances (km)
const DISTANCES: Record<string, number> = {
  'Delhi to Agra': 233,
  'NYC to Boston': 346,
  'London to Paris': 450,
  'Tokyo to Osaka': 515,
  'Sydney to Melbourne': 878,
  'LA to San Francisco': 616,
  'Mumbai to Pune': 149,
  'Berlin to Munich': 585,
};

// Fun calorie equivalents
const CALORIE_FACTS = [
  { threshold: 500, fact: 'power a lightbulb for {x} hours 💡', perUnit: 100, unit: 'hours' },
  { threshold: 1000, fact: 'melt {x}kg of ice 🧊', perUnit: 334, unit: 'kg' },
  { threshold: 2000, fact: 'charge {x} smartphones 📱', perUnit: 45, unit: 'phones' },
  { threshold: 3000, fact: 'fuel a car for {x}km 🚗', perUnit: 860, unit: 'km' },
];

// Sleep comparisons
const SLEEP_ANIMALS: { name: string; emoji: string; hours: number }[] = [
  { name: 'a giraffe', emoji: '🦒', hours: 1.9 },
  { name: 'a horse', emoji: '🐴', hours: 2.9 },
  { name: 'an elephant', emoji: '🐘', hours: 3.5 },
  { name: 'a dolphin', emoji: '🐬', hours: 4.0 },
  { name: 'a human adult', emoji: '🧑', hours: 7.5 },
  { name: 'a cat', emoji: '🐱', hours: 12.5 },
  { name: 'a koala', emoji: '🐨', hours: 18.0 },
  { name: 'a sloth', emoji: '🦥', hours: 20.0 },
];

// Heartbeat facts
const HEARTBEAT_COMPARISONS = [
  { beats: 100000, fact: 'That\'s a stadium full of people clapping once 👏' },
  { beats: 500000, fact: 'Enough beats to sync with a full orchestra performance 🎵' },
  { beats: 700000, fact: 'Your heart composed a small symphony this week 🎶' },
  { beats: 1000000, fact: 'One million beats — your heart ran a marathon of rhythm 💓' },
];

function generateId(): string {
  return `pf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generatePulseFacts(
  days: HealthDayData[],
  workouts: WorkoutData[]
): PulseFact[] {
  const facts: PulseFact[] = [];
  const now = new Date().toISOString();

  if (days.length === 0) return facts;

  // === DISTANCE FACTS (Steps) ===
  const last7 = days.slice(-7);
  const last30 = days.slice(-30);
  const weekSteps = last7.reduce((s, d) => s + d.steps, 0);
  const monthSteps = last30.reduce((s, d) => s + d.steps, 0);
  const weekDistanceKm = (weekSteps * AVG_STEP_M) / 1000;
  const monthDistanceKm = (monthSteps * AVG_STEP_M) / 1000;

  // Moon distance comparison
  const moonProgress = (monthDistanceKm / EARTH_TO_MOON_KM) * 100;
  if (moonProgress > 0.001) {
    facts.push({
      id: generateId(),
      emoji: '🌙',
      title: 'Walking to the Moon',
      body: `This month you've covered ${moonProgress.toFixed(4)}% of the distance to the Moon. That's ${monthDistanceKm.toFixed(1)}km of pure determination.`,
      category: 'cosmic',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
      generatedAt: now,
      metric: { value: monthDistanceKm, unit: 'km' },
    });
  }

  // City distance comparison
  const matchingCity = Object.entries(DISTANCES).find(
    ([, dist]) => monthDistanceKm >= dist * 0.7 && monthDistanceKm <= dist * 1.5
  );
  if (matchingCity) {
    const [route, dist] = matchingCity;
    const pct = Math.round((monthDistanceKm / dist) * 100);
    facts.push({
      id: generateId(),
      emoji: '🗺️',
      title: `${route} on Foot`,
      body: `You've walked ${pct}% of the ${route} distance this month. ${pct >= 100 ? 'You made it! 🎉' : `Just ${(dist - monthDistanceKm).toFixed(0)}km to go!`}`,
      category: 'distance',
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
      generatedAt: now,
      metric: { value: monthDistanceKm, unit: 'km' },
    });
  }

  // Earth circumference
  const earthPct = (monthDistanceKm / EARTH_CIRCUMFERENCE_KM) * 100;
  if (earthPct > 0.01) {
    facts.push({
      id: generateId(),
      emoji: '🌍',
      title: 'Around the World',
      body: `Your monthly walking covers ${earthPct.toFixed(3)}% of Earth's circumference. At this pace, you'd circle the planet in ${Math.round(100 / earthPct)} months.`,
      category: 'cosmic',
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      generatedAt: now,
      metric: { value: earthPct, unit: '%' },
    });
  }

  // Everest climb (using stairs/elevation estimation from steps)
  const weeklyCalories = last7.reduce((s, d) => s + d.calories, 0);
  const estimatedClimbM = weekSteps * 0.05; // rough estimate
  const everestPct = (estimatedClimbM / EVEREST_M) * 100;
  if (everestPct > 5) {
    facts.push({
      id: generateId(),
      emoji: '⛰️',
      title: 'Climbing Everest',
      body: `Your effort this week is equivalent to climbing ${everestPct.toFixed(0)}% of Mount Everest. ${everestPct >= 100 ? 'You summited! 🏔️' : 'Keep climbing!'}`,
      category: 'achievement',
      gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
      generatedAt: now,
    });
  }

  // === ENERGY/CALORIE FACTS ===
  const monthCalories = last30.reduce((s, d) => s + d.calories, 0);
  const calorieMatch = CALORIE_FACTS.find((cf) => monthCalories >= cf.threshold);
  if (calorieMatch) {
    const units = (monthCalories / calorieMatch.perUnit).toFixed(1);
    facts.push({
      id: generateId(),
      emoji: '⚡',
      title: 'Energy Output',
      body: `You burned enough energy this month to ${calorieMatch.fact.replace('{x}', units)}`,
      category: 'energy',
      gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
      generatedAt: now,
      metric: { value: monthCalories, unit: 'kcal' },
    });
  }

  // Marathon comparison
  const marathonsWalked = monthDistanceKm / MARATHON_KM;
  if (marathonsWalked >= 0.5) {
    facts.push({
      id: generateId(),
      emoji: '🏃',
      title: 'Marathon Mode',
      body: `You've covered ${marathonsWalked.toFixed(1)} marathons worth of distance this month. ${marathonsWalked >= 3 ? 'Ultra-marathon territory! 🏆' : 'Building serious endurance.'}`,
      category: 'achievement',
      gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      generatedAt: now,
    });
  }

  // === SLEEP FACTS ===
  const todaySleep = days[days.length - 1]?.sleepHours || 0;
  if (todaySleep > 0) {
    const closestAnimal = SLEEP_ANIMALS.reduce((prev, curr) =>
      Math.abs(curr.hours - todaySleep) < Math.abs(prev.hours - todaySleep) ? curr : prev
    );
    const comparison = todaySleep > closestAnimal.hours ? 'more than' : 'about as much as';
    facts.push({
      id: generateId(),
      emoji: closestAnimal.emoji,
      title: `Sleeping Like ${closestAnimal.name.charAt(0).toUpperCase() + closestAnimal.name.slice(1)}`,
      body: `Last night you slept ${comparison} ${closestAnimal.name} (${closestAnimal.hours}h). You clocked ${todaySleep.toFixed(1)}h of rest.`,
      category: 'sleep',
      gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
      generatedAt: now,
    });
  }

  // Weekly sleep total
  const weekSleep = last7.reduce((s, d) => s + d.sleepHours, 0);
  const moviesWatched = weekSleep / 2.5; // avg movie length
  facts.push({
    id: generateId(),
    emoji: '🎬',
    title: 'Sleep Marathon',
    body: `You slept ${weekSleep.toFixed(0)} hours this week — enough time to watch ${moviesWatched.toFixed(0)} movies or read ${Math.round(weekSleep * 30)} pages of a book.`,
    category: 'sleep',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    generatedAt: now,
  });

  // === HEARTBEAT FACTS ===
  const avgHR = days[days.length - 1]?.heartRateAvg || 72;
  const weekBeats = avgHR * 60 * 24 * 7;
  const heartFact = HEARTBEAT_COMPARISONS.reduce((prev, curr) =>
    weekBeats >= curr.beats ? curr : prev
  );
  facts.push({
    id: generateId(),
    emoji: '💓',
    title: `${(weekBeats / 1000).toFixed(0)}K Heartbeats`,
    body: `Your heart beat ${weekBeats.toLocaleString()} times this week. ${heartFact.fact}`,
    category: 'body',
    gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
    generatedAt: now,
    metric: { value: weekBeats, unit: 'beats' },
  });

  // === WORKOUT FACTS ===
  const weekWorkouts = workouts.filter((w) => {
    const d = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  });

  if (weekWorkouts.length >= 3) {
    const totalDuration = weekWorkouts.reduce((s, w) => s + w.duration, 0);
    const eiffelClimbs = (totalDuration * 5) / EIFFEL_TOWER_M; // rough energy equiv
    facts.push({
      id: generateId(),
      emoji: '🗼',
      title: 'Tower of Effort',
      body: `${weekWorkouts.length} workouts totaling ${totalDuration} minutes this week. That's like climbing the Eiffel Tower ${eiffelClimbs.toFixed(1)} times in effort.`,
      category: 'achievement',
      gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
      generatedAt: now,
    });
  }

  // Shuffle and return top facts (max 8 for variety)
  return facts.sort(() => Math.random() - 0.5).slice(0, 8);
}
