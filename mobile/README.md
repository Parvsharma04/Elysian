# Elysian Mobile — Health Connect Companion

A lightweight Expo app that reads **real health data** from Android Health Connect and syncs it to your Elysian backend.

## How it works

```
┌─────────────────────────────┐
│  Elysian Expo App (Android) │
│                             │
│  1. User signs in           │
│  2. Taps "Sync Now"         │
│  3. Reads Health Connect:   │
│     • Steps                 │
│     • Heart Rate / HRV      │
│     • Resting HR            │
│     • Sleep stages          │
│     • Calories              │
│     • Weight                │
│     • Workouts              │
│  4. POSTs to backend API    │
│     /integrations/push/*    │
│  5. PWA shows real data     │
└─────────────────────────────┘
```

## Setup

```bash
cd mobile
npm install
npx expo prebuild      # generates native android/ folder
npx expo run:android   # build & run on device/emulator
```

## Requirements

- Android 9+ with Health Connect app installed
- Expo SDK 52
- Backend running with the push endpoints

## Environment

Edit `src/lib/api.ts` to set your API URL:
- Dev (emulator): `http://10.0.2.2:3001`
- Dev (physical device): `http://<your-ip>:3001`
- Production: your deployed API URL
