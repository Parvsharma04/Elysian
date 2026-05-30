// Elysian Mobile — Health Connect sync logic
// Reads real health data from Health Connect and pushes to the Elysian backend.

import {
  initialize,
  readRecords,
  requestPermission,
  getSdkStatus,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import { apiFetch } from './api';

const PERMISSIONS = [
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'read', recordType: 'HeartRate' },
  { accessType: 'read', recordType: 'RestingHeartRate' },
  { accessType: 'read', recordType: 'HeartRateVariabilityRmssd' },
  { accessType: 'read', recordType: 'SleepSession' },
  { accessType: 'read', recordType: 'ExerciseSession' },
  { accessType: 'read', recordType: 'TotalCaloriesBurned' },
  { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
  { accessType: 'read', recordType: 'Weight' },
] as const;

export async function isHealthConnectAvailable(): Promise<boolean> {
  try {
    const status = await getSdkStatus();
    return status === SdkAvailabilityStatus.SDK_AVAILABLE;
  } catch {
    return false;
  }
}

export async function initAndRequestPermissions(): Promise<boolean> {
  const inited = await initialize();
  if (!inited) return false;

  const granted = await requestPermission(PERMISSIONS as any);
  return granted.length > 0;
}

function dateStr(iso: string): string {
  return iso.split('T')[0];
}

function daysBetween(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const d = new Date(start);
  while (d <= end) {
    dates.push(d.toISOString().split('T')[0]);
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

export async function syncHealthConnect(
  onProgress?: (msg: string) => void,
): Promise<{ days: number; workouts: number }> {
  const endTime = new Date().toISOString();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const startTime = startDate.toISOString();
  const timeRange = { operator: 'between' as const, startTime, endTime };

  const dailyMap: Record<string, Record<string, any>> = {};
  const allDates = daysBetween(startDate, new Date());
  for (const d of allDates) {
    dailyMap[d] = { date: d };
  }

  // Steps
  onProgress?.('Reading steps...');
  try {
    const { records } = await readRecords('Steps', { timeRangeFilter: timeRange });
    for (const r of records) {
      const date = dateStr(r.startTime);
      if (dailyMap[date]) {
        dailyMap[date].steps = (dailyMap[date].steps || 0) + (r.count || 0);
      }
    }
  } catch { /* permission might not be granted */ }

  // Heart rate
  onProgress?.('Reading heart rate...');
  try {
    const { records } = await readRecords('HeartRate', { timeRangeFilter: timeRange });
    const hrByDay: Record<string, number[]> = {};
    for (const r of records) {
      const date = dateStr(r.startTime);
      if (!hrByDay[date]) hrByDay[date] = [];
      for (const sample of r.samples || []) {
        hrByDay[date].push(sample.beatsPerMinute);
      }
    }
    for (const [date, bpms] of Object.entries(hrByDay)) {
      if (dailyMap[date] && bpms.length > 0) {
        dailyMap[date].heart_rate_avg = Math.round(
          bpms.reduce((a, b) => a + b, 0) / bpms.length,
        );
      }
    }
  } catch {}

  // Resting heart rate
  onProgress?.('Reading resting heart rate...');
  try {
    const { records } = await readRecords('RestingHeartRate', { timeRangeFilter: timeRange });
    for (const r of records) {
      const date = dateStr(r.time);
      if (dailyMap[date]) {
        dailyMap[date].heart_rate_resting = r.beatsPerMinute;
      }
    }
  } catch {}

  // HRV
  onProgress?.('Reading HRV...');
  try {
    const { records } = await readRecords('HeartRateVariabilityRmssd', { timeRangeFilter: timeRange });
    for (const r of records) {
      const date = dateStr(r.time);
      if (dailyMap[date]) {
        dailyMap[date].hrv = Math.round(r.heartRateVariabilityMillis);
      }
    }
  } catch {}

  // Sleep
  onProgress?.('Reading sleep...');
  try {
    const { records } = await readRecords('SleepSession', { timeRangeFilter: timeRange });
    for (const r of records) {
      const date = dateStr(r.startTime);
      if (!dailyMap[date]) continue;

      const startMs = new Date(r.startTime).getTime();
      const endMs = new Date(r.endTime).getTime();
      const totalHours = (endMs - startMs) / 3600000;
      dailyMap[date].sleep_hours = +totalHours.toFixed(1);

      let deepMin = 0, remMin = 0, lightMin = 0, awakeMin = 0;
      for (const stage of r.stages || []) {
        const mins = (new Date(stage.endTime).getTime() - new Date(stage.startTime).getTime()) / 60000;
        switch (stage.stage) {
          case 4: deepMin += mins; break; // DEEP
          case 5: remMin += mins; break;  // REM
          case 3: lightMin += mins; break; // LIGHT
          case 1: awakeMin += mins; break; // AWAKE
        }
      }
      dailyMap[date].sleep_deep = +(deepMin / 60).toFixed(1);
      dailyMap[date].sleep_rem = +(remMin / 60).toFixed(1);
      dailyMap[date].sleep_light = +(lightMin / 60).toFixed(1);
      dailyMap[date].sleep_awake = +(awakeMin / 60).toFixed(1);

      const totalSleep = deepMin + remMin + lightMin;
      if (totalSleep > 0) {
        dailyMap[date].sleep_quality = Math.round(((deepMin + remMin) / totalSleep) * 100);
      }
    }
  } catch {}

  // Calories
  onProgress?.('Reading calories...');
  try {
    const { records } = await readRecords('TotalCaloriesBurned', { timeRangeFilter: timeRange });
    for (const r of records) {
      const date = dateStr(r.startTime);
      if (dailyMap[date]) {
        dailyMap[date].calories = (dailyMap[date].calories || 0) +
          Math.round(r.energy?.inKilocalories || 0);
      }
    }
  } catch {}

  // Weight
  onProgress?.('Reading weight...');
  try {
    const { records } = await readRecords('Weight', { timeRangeFilter: timeRange });
    for (const r of records) {
      const date = dateStr(r.time);
      if (dailyMap[date]) {
        dailyMap[date].weight = +(r.weight?.inKilograms || 0).toFixed(1);
      }
    }
  } catch {}

  // Filter to days with actual data
  const daysWithData = Object.values(dailyMap).filter((d) => Object.keys(d).length > 1);

  // Push health days to backend
  onProgress?.(`Uploading ${daysWithData.length} days...`);
  if (daysWithData.length > 0) {
    await apiFetch('/integrations/push/health-days', {
      method: 'POST',
      body: JSON.stringify({ days: daysWithData }),
    });
  }

  // Exercises / workouts
  onProgress?.('Reading workouts...');
  const workouts: Record<string, any>[] = [];
  try {
    const { records } = await readRecords('ExerciseSession', { timeRangeFilter: timeRange });
    for (const r of records) {
      const durationMin = Math.round(
        (new Date(r.endTime).getTime() - new Date(r.startTime).getTime()) / 60000,
      );
      workouts.push({
        date: dateStr(r.startTime),
        type: mapExerciseType(r.exerciseType),
        name: r.title || mapExerciseType(r.exerciseType),
        duration: durationMin,
        calories: 0,
        intensity: 'moderate',
      });
    }
  } catch {}

  if (workouts.length > 0) {
    onProgress?.(`Uploading ${workouts.length} workouts...`);
    await apiFetch('/integrations/push/workouts', {
      method: 'POST',
      body: JSON.stringify({ workouts }),
    });
  }

  // Mark Health Connect as connected
  try {
    await apiFetch('/integrations/connect', {
      method: 'POST',
      body: JSON.stringify({ provider: 'health_connect' }),
    });
  } catch { /* might already be connected */ }

  return { days: daysWithData.length, workouts: workouts.length };
}

function mapExerciseType(type: number): string {
  const map: Record<number, string> = {
    56: 'running',     // RUNNING
    57: 'running',     // RUNNING_TREADMILL
    8:  'cycling',     // BIKING
    9:  'cycling',     // BIKING_STATIONARY
    74: 'swimming',    // SWIMMING_OPEN_WATER
    75: 'swimming',    // SWIMMING_POOL
    80: 'yoga',        // YOGA
    78: 'strength',    // WEIGHTLIFTING
    0:  'cardio',      // UNKNOWN
    29: 'hiit',        // HIGH_INTENSITY_INTERVAL_TRAINING
  };
  return map[type] || 'cardio';
}
