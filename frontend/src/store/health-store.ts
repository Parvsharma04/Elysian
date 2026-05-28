// Elysian — Zustand Health Store (Hybrid: local mock + Supabase)

import { create } from 'zustand';
import {
  calcRecoveryScore,
  calcFatigueScore,
  calcConsistencyScore,
  calcSleepQualityScore,
  calcBurnoutRisk,
  calcReadinessScore,
  getStreakDays,
} from '@/lib/derived-metrics';
import { generatePulseFacts, type PulseFact } from '@/lib/fact-generator';

// Unified types that work with both mock data and Supabase
export interface HealthDayData {
  date: string;
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

export interface WorkoutData {
  id: string;
  date: string;
  type: 'strength' | 'cardio' | 'yoga' | 'hiit' | 'cycling' | 'running' | 'swimming';
  name: string;
  duration: number;
  calories: number;
  intensity: 'low' | 'moderate' | 'high' | 'extreme';
  heartRateAvg?: number;
}

export interface InsightData {
  id: string;
  type: 'recovery' | 'nutrition' | 'training' | 'sleep' | 'prediction' | 'warning';
  title: string;
  body: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
}

export interface ChatMessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface HealthStore {
  // Data
  days: HealthDayData[];
  workouts: WorkoutData[];
  insights: InsightData[];
  chatMessages: ChatMessageData[];
  pulseFacts: PulseFact[];
  savedFacts: PulseFact[];

  // Derived
  today: HealthDayData | null;
  yesterday: HealthDayData | null;
  recoveryScore: number;
  readinessScore: number;
  fatigueScore: number;
  consistencyScore: number;
  sleepQualityScore: number;
  burnoutRisk: { level: 'low' | 'moderate' | 'high' | 'critical'; score: number };
  streakDays: number;

  // UI state
  activeTab: string;
  trendRange: '7d' | '30d' | '90d';
  loading: boolean;
  error: string | null;
  dataSource: 'local' | 'remote';

  // Actions
  setActiveTab: (tab: string) => void;
  setTrendRange: (range: '7d' | '30d' | '90d') => void;
  addChatMessage: (message: ChatMessageData) => void;
  saveFact: (fact: PulseFact) => void;
  unsaveFact: (factId: string) => void;
  fetchAll: () => Promise<void>;
  setLocalData: (days: HealthDayData[], workouts: WorkoutData[], insights: InsightData[], chatMessages: ChatMessageData[]) => void;
}

const emptyDay: HealthDayData = {
  date: new Date().toISOString().split('T')[0],
  steps: 0, calories: 0, activeMinutes: 0,
  heartRateAvg: 0, heartRateResting: 0, hrv: 0,
  sleepHours: 0, sleepQuality: 0, sleepDeep: 0, sleepRem: 0, sleepLight: 0, sleepAwake: 0,
  weight: 0, waterMl: 0, proteinG: 0, carbsG: 0, fatG: 0,
};

function computeDerived(days: HealthDayData[]) {
  // Map to the format derived-metrics expects
  const mapped = days.map(d => ({
    date: d.date, steps: d.steps, calories: d.calories, activeMinutes: d.activeMinutes,
    heartRateAvg: d.heartRateAvg, heartRateResting: d.heartRateResting, hrv: d.hrv,
    sleepHours: d.sleepHours, sleepQuality: d.sleepQuality,
    sleepDeep: d.sleepDeep, sleepRem: d.sleepRem, sleepLight: d.sleepLight, sleepAwake: d.sleepAwake,
    weight: d.weight, waterMl: d.waterMl, proteinG: d.proteinG, carbsG: d.carbsG, fatG: d.fatG,
  }));

  const today = mapped[mapped.length - 1] || emptyDay;
  const yesterday = mapped[mapped.length - 2] || emptyDay;

  return {
    today: days[days.length - 1] || null,
    yesterday: days[days.length - 2] || null,
    recoveryScore: calcRecoveryScore(today, yesterday),
    readinessScore: calcReadinessScore(today, yesterday),
    fatigueScore: calcFatigueScore(mapped),
    consistencyScore: calcConsistencyScore(mapped),
    sleepQualityScore: calcSleepQualityScore(today),
    burnoutRisk: calcBurnoutRisk(mapped),
    streakDays: getStreakDays(mapped),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSupabaseDayToLocal(d: any): HealthDayData {
  return {
    date: d.date,
    steps: d.steps || 0,
    calories: d.calories || 0,
    activeMinutes: d.active_minutes || 0,
    heartRateAvg: d.heart_rate_avg || 0,
    heartRateResting: d.heart_rate_resting || 0,
    hrv: d.hrv || 0,
    sleepHours: d.sleep_hours || 0,
    sleepQuality: d.sleep_quality || 0,
    sleepDeep: d.sleep_deep || 0,
    sleepRem: d.sleep_rem || 0,
    sleepLight: d.sleep_light || 0,
    sleepAwake: d.sleep_awake || 0,
    weight: d.weight || 0,
    waterMl: d.water_ml || 0,
    proteinG: d.protein_g || 0,
    carbsG: d.carbs_g || 0,
    fatG: d.fat_g || 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSupabaseWorkout(w: any): WorkoutData {
  return {
    id: w.id,
    date: w.date,
    type: w.type,
    name: w.name,
    duration: w.duration,
    calories: w.calories,
    intensity: w.intensity,
    heartRateAvg: w.heart_rate_avg,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSupabaseInsight(i: any): InsightData {
  return {
    id: i.id,
    type: i.type,
    title: i.title,
    body: i.body,
    priority: i.priority,
    timestamp: i.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSupabaseChat(c: any): ChatMessageData {
  return {
    id: c.id,
    role: c.role,
    content: c.content,
    timestamp: c.created_at,
  };
}

// Load saved facts from localStorage
function loadSavedFacts(): PulseFact[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('elysian-saved-facts');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function persistSavedFacts(facts: PulseFact[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('elysian-saved-facts', JSON.stringify(facts));
  } catch { /* ignore */ }
}

export const useHealthStore = create<HealthStore>((set, get) => ({
  days: [],
  workouts: [],
  insights: [],
  chatMessages: [],
  pulseFacts: [],
  savedFacts: loadSavedFacts(),
  today: null,
  yesterday: null,
  recoveryScore: 0,
  readinessScore: 0,
  fatigueScore: 0,
  consistencyScore: 0,
  sleepQualityScore: 0,
  burnoutRisk: { level: 'low', score: 0 },
  streakDays: 0,
  activeTab: 'home',
  trendRange: '7d',
  loading: true,
  error: null,
  dataSource: 'local',

  setActiveTab: (tab) => set({ activeTab: tab }),
  setTrendRange: (range) => set({ trendRange: range }),

  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),

  saveFact: (fact) => {
    const updated = [...get().savedFacts, fact];
    persistSavedFacts(updated);
    set({ savedFacts: updated });
  },

  unsaveFact: (factId) => {
    const updated = get().savedFacts.filter((f) => f.id !== factId);
    persistSavedFacts(updated);
    set({ savedFacts: updated });
  },

  setLocalData: (days, workouts, insights, chatMessages) => {
    const derived = computeDerived(days);
    const pulseFacts = generatePulseFacts(days, workouts);
    set({
      days,
      workouts,
      insights,
      chatMessages,
      pulseFacts,
      ...derived,
      loading: false,
      error: null,
      dataSource: 'local',
    });
  },

  fetchAll: async () => {
    set({ loading: true, error: null });

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const token = typeof window !== 'undefined' ? localStorage.getItem('elysian-token') : null;
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const [healthRes, workoutsRes, insightsRes, chatRes] = await Promise.all([
        fetch(`${API_BASE}/health?days=90`, { headers }),
        fetch(`${API_BASE}/workouts`, { headers }),
        fetch(`${API_BASE}/insights`, { headers }),
        fetch(`${API_BASE}/chat`, { headers }),
      ]);

      // If API calls fail, fall back to local mock data
      if (!healthRes.ok || !workoutsRes.ok) {
        const { generateLocalMockData } = await import('@/lib/local-data');
        const mock = generateLocalMockData();
        const derived = computeDerived(mock.days);
        const pulseFacts = generatePulseFacts(mock.days, mock.workouts);
        set({
          days: mock.days,
          workouts: mock.workouts,
          insights: mock.insights,
          chatMessages: mock.chatMessages,
          pulseFacts,
          ...derived,
          loading: false,
          error: null,
          dataSource: 'local',
        });
        return;
      }

      const [healthData, workoutsData, insightsData, chatData] = await Promise.all([
        healthRes.json(),
        workoutsRes.json(),
        insightsRes.ok ? insightsRes.json() : [],
        chatRes.ok ? chatRes.json() : [],
      ]);

      const days = (healthData as unknown[]).map(mapSupabaseDayToLocal);
      const workouts = (workoutsData as unknown[]).map(mapSupabaseWorkout);
      const insights = (insightsData as unknown[]).map(mapSupabaseInsight);
      const chatMessages = (chatData as unknown[]).map(mapSupabaseChat);

      // If no data from Supabase, use local mock
      if (days.length === 0) {
        const { generateLocalMockData } = await import('@/lib/local-data');
        const mock = generateLocalMockData();
        const derived = computeDerived(mock.days);
        const pulseFacts = generatePulseFacts(mock.days, mock.workouts);
        set({
          days: mock.days,
          workouts: mock.workouts,
          insights: mock.insights,
          chatMessages: mock.chatMessages,
          pulseFacts,
          ...derived,
          loading: false,
          error: null,
          dataSource: 'local',
        });
        return;
      }

      const derived = computeDerived(days);
      const pulseFacts = generatePulseFacts(days, workouts);
      set({
        days,
        workouts,
        insights,
        chatMessages,
        pulseFacts,
        ...derived,
        loading: false,
        error: null,
        dataSource: 'remote',
      });
    } catch {
      // Network error → fall back to local mock data
      try {
        const { generateLocalMockData } = await import('@/lib/local-data');
        const mock = generateLocalMockData();
        const derived = computeDerived(mock.days);
        const pulseFacts = generatePulseFacts(mock.days, mock.workouts);
        set({
          days: mock.days,
          workouts: mock.workouts,
          insights: mock.insights,
          chatMessages: mock.chatMessages,
          pulseFacts,
          ...derived,
          loading: false,
          error: null,
          dataSource: 'local',
        });
      } catch {
        set({ loading: false, error: 'Failed to load data' });
      }
    }
  },
}));
