// Elysian Mobile — API client & auth token management

import * as SecureStore from 'expo-secure-store';

const API_BASE = __DEV__
  ? 'http://10.0.2.2:3001' // Android emulator → host machine
  : 'https://your-api.com'; // Production — update this

const TOKEN_KEY = 'elysian-token';

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getToken();
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
}

export { API_BASE };
