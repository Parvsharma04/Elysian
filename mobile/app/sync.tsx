import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { clearToken } from '@/lib/api';
import {
  isHealthConnectAvailable,
  initAndRequestPermissions,
  syncHealthConnect,
} from '@/lib/health-connect';

type SyncState = 'idle' | 'checking' | 'syncing' | 'done' | 'error' | 'unavailable';

export default function SyncScreen() {
  const [state, setState] = useState<SyncState>('checking');
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState<{ days: number; workouts: number } | null>(null);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    if (Platform.OS !== 'android') {
      setState('unavailable');
      return;
    }
    const available = await isHealthConnectAvailable();
    setState(available ? 'idle' : 'unavailable');
  };

  const handleSync = async () => {
    setState('syncing');
    setProgress('Requesting permissions...');

    try {
      const permitted = await initAndRequestPermissions();
      if (!permitted) {
        Alert.alert('Permissions Required', 'Please grant Health Connect permissions to sync your data.');
        setState('idle');
        return;
      }

      const syncResult = await syncHealthConnect((msg) => setProgress(msg));
      setResult(syncResult);
      setState('done');
    } catch (e: any) {
      setState('error');
      Alert.alert('Sync Failed', e.message || 'Something went wrong');
    }
  };

  const handleSignOut = async () => {
    await clearToken();
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚡ Health Connect</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {state === 'checking' && (
          <View style={styles.statusRow}>
            <ActivityIndicator color="#e8a838" />
            <Text style={styles.statusText}>Checking Health Connect...</Text>
          </View>
        )}

        {state === 'unavailable' && (
          <View style={styles.statusRow}>
            <Text style={styles.errorDot}>●</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusText}>Health Connect Not Available</Text>
              <Text style={styles.hint}>
                {Platform.OS !== 'android'
                  ? 'Health Connect is only available on Android.'
                  : 'Install "Health Connect by Android" from the Play Store.'}
              </Text>
            </View>
          </View>
        )}

        {state === 'idle' && (
          <>
            <View style={styles.statusRow}>
              <Text style={styles.successDot}>●</Text>
              <Text style={styles.statusText}>Health Connect Available</Text>
            </View>
            <Text style={styles.description}>
              Sync your last 30 days of health data — steps, heart rate, HRV, sleep, calories, weight, and workouts.
            </Text>
            <TouchableOpacity style={styles.syncButton} onPress={handleSync}>
              <Text style={styles.syncButtonText}>Sync Now</Text>
            </TouchableOpacity>
          </>
        )}

        {state === 'syncing' && (
          <View style={styles.syncingContainer}>
            <ActivityIndicator color="#e8a838" size="large" />
            <Text style={styles.progressText}>{progress}</Text>
            <Text style={styles.hint}>This may take a moment...</Text>
          </View>
        )}

        {state === 'done' && result && (
          <>
            <View style={styles.statusRow}>
              <Text style={styles.successDot}>●</Text>
              <Text style={styles.statusText}>Sync Complete!</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{result.days}</Text>
                <Text style={styles.statLabel}>Days</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{result.workouts}</Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </View>
            </View>
            <Text style={styles.hint}>
              Open the Elysian web app to see your real health data.
            </Text>
            <TouchableOpacity style={styles.syncButton} onPress={handleSync}>
              <Text style={styles.syncButtonText}>Sync Again</Text>
            </TouchableOpacity>
          </>
        )}

        {state === 'error' && (
          <>
            <View style={styles.statusRow}>
              <Text style={styles.errorDot}>●</Text>
              <Text style={styles.statusText}>Sync Failed</Text>
            </View>
            <TouchableOpacity style={styles.syncButton} onPress={handleSync}>
              <Text style={styles.syncButtonText}>Retry</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.footer}>
        This app reads Health Connect data and syncs it to your Elysian account. No data is stored on your device.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121214',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f4f2ef',
  },
  signOutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(244,242,239,0.08)',
  },
  signOutText: {
    color: '#8d877f',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1d1c20',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(244,242,239,0.06)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  successDot: {
    color: '#3fcf6e',
    fontSize: 12,
  },
  errorDot: {
    color: '#ef5350',
    fontSize: 12,
  },
  statusText: {
    color: '#f4f2ef',
    fontSize: 15,
    fontWeight: '600',
  },
  description: {
    color: '#b3aca1',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  hint: {
    color: '#8d877f',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  syncButton: {
    backgroundColor: '#e8a838',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  syncButtonText: {
    color: '#121214',
    fontSize: 15,
    fontWeight: '700',
  },
  syncingContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  progressText: {
    color: '#e8a838',
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 16,
  },
  stat: {
    flex: 1,
    backgroundColor: '#121214',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244,242,239,0.04)',
  },
  statValue: {
    color: '#f4f2ef',
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    color: '#8d877f',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  footer: {
    color: '#8d877f',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 18,
  },
});
