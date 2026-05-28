'use client';

import { useEffect, useCallback } from 'react';
import { useHealthStore } from '@/store/health-store';
import { useAuth } from '@/components/auth/AuthProvider';

export function useHealthData() {
  const { profile } = useAuth();
  const {
    loading,
    error,
    days,
    workouts,
    insights,
    chatMessages,
    fetchAll,
    today,
    yesterday,
    recoveryScore,
    readinessScore,
    fatigueScore,
    consistencyScore,
    sleepQualityScore,
    burnoutRisk,
    streakDays,
  } = useHealthStore();

  const refresh = useCallback(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    loading,
    error,
    days,
    workouts,
    insights,
    chatMessages,
    today,
    yesterday,
    recoveryScore,
    readinessScore,
    fatigueScore,
    consistencyScore,
    sleepQualityScore,
    burnoutRisk,
    streakDays,
    refresh,
    profile,
  };
}
