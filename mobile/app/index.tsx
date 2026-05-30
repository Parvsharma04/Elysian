import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { getToken, setToken, API_BASE } from '@/lib/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Check existing token
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        router.replace('/sync');
      }
      setLoading(false);
    })();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Enter email and password');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        Alert.alert('Login failed', err.message || 'Check your credentials');
        return;
      }
      const data = await res.json();
      await setToken(data.access_token || data.token);
      router.replace('/sync');
    } catch (e: any) {
      Alert.alert('Error', `Could not connect to server.\n${API_BASE}\n\n${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#e8a838" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Elysian</Text>
        <Text style={styles.subtitle}>Sign in to sync Health Connect</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#8d877f"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8d877f"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#121214" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121214',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121214',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    padding: 28,
    borderRadius: 12,
    backgroundColor: '#1d1c20',
    borderWidth: 1,
    borderColor: 'rgba(244,242,239,0.06)',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f4f2ef',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#8d877f',
    textAlign: 'center',
    marginBottom: 28,
  },
  input: {
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: 'rgba(244,242,239,0.1)',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: '#f4f2ef',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#e8a838',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#121214',
    fontSize: 15,
    fontWeight: '700',
  },
});
