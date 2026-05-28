// Elysian — Database Type Definitions

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  subscription_tier: 'free' | 'pro' | 'elite';
  target_weight: number | null;
  target_steps: number;
  target_sleep_hours: number;
  target_protein: number;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface HealthDay {
  id: string;
  user_id: string;
  date: string;
  steps: number;
  calories: number;
  active_minutes: number;
  heart_rate_avg: number | null;
  heart_rate_resting: number | null;
  hrv: number | null;
  sleep_hours: number;
  sleep_quality: number;
  sleep_deep: number;
  sleep_rem: number;
  sleep_light: number;
  sleep_awake: number;
  weight: number | null;
  water_ml: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  created_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  date: string;
  type: 'strength' | 'cardio' | 'yoga' | 'hiit' | 'cycling' | 'running' | 'swimming';
  name: string;
  duration: number;
  calories: number;
  intensity: 'low' | 'moderate' | 'high' | 'extreme';
  heart_rate_avg: number | null;
  created_at: string;
}

export interface AIInsight {
  id: string;
  user_id: string;
  type: 'recovery' | 'nutrition' | 'training' | 'sleep' | 'prediction' | 'warning';
  title: string;
  body: string;
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
