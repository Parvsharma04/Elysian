# AI FITNESS STARTUP — MASTER PRODUCT + DESIGN + ENGINEERING PROMPT

You are an elite startup team consisting of:
- senior product designers
- YC-level founders
- FAANG engineers
- health-tech architects
- growth marketers
- AI researchers
- fitness coaches
- behavioral psychologists

Your task is to design and build a modern AI-powered fitness intelligence platform called:

# "PulseAI"

A cross-platform:
- AI fitness coach
- predictive health intelligence system
- wearable analytics platform
- adaptive health operating system

The platform should feel like:
- Apple Health meets Whoop
- combined with ChatGPT
- combined with a futuristic AI operating system

The product should:
- feel emotionally rewarding
- hyper-modern
- minimal
- premium
- intelligent
- addictive in a healthy way

---

# CORE PRODUCT IDEA

Users connect:
- Google Fit
- Fitbit
- Samsung Health
- WearOS
- Strava
- MyFitnessPal

through Health Connect on Android.

The platform:
1. syncs health/activity data
2. builds longitudinal profiles
3. predicts future health trends
4. generates AI insights
5. adapts plans dynamically
6. forecasts outcomes
7. acts as a personalized AI fitness copilot

---

# PRIMARY PRODUCT GOAL

Turn passive health data into:
- predictive intelligence
- adaptive coaching
- personalized recommendations
- actionable insights

NOT:
```txt
another static dashboard
```

BUT:
```txt
an AI operating system for personal health
```

---

# TECH STACK REQUIREMENTS

# FRONTEND

## PWA-FIRST ARCHITECTURE

The primary product experience MUST be:
- an installable Progressive Web App
- mobile-first
- app-like
- smooth on iPhone + Android
- responsive desktop dashboard

Use:
- Next.js 15
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- Zustand
- TanStack Query
- Recharts

---

# PWA REQUIREMENTS

The app MUST:
- support Add to Home Screen
- work fullscreen
- support splash screens
- support push notifications
- support offline caching
- feel like a native app

The app should NOT feel like:
```txt
a website wrapped as an app
```

It SHOULD feel like:
```txt
a futuristic mobile fitness OS
```

---

# ANDROID COMPANION APP

A lightweight Android sync app MUST exist.

Purpose:
- connect to Health Connect
- request permissions
- sync health data
- upload aggregates
- send notifications

Use:
- Kotlin
- Jetpack Compose
- WorkManager
- Health Connect SDK

Keep UI minimal.

---

# BACKEND

Use:
- Supabase
- PostgreSQL
- Edge Functions
- Object Storage
- Realtime subscriptions

---

# AUTHENTICATION

Use:
- Firebase Auth

Support:
- Google login
- Email OTP
- Apple login (future)

---

# PAYMENTS

Use:
- Stripe subscriptions

---

# SUBSCRIPTION TIERS

# FREE — $0

Purpose:
Hook users aggressively using AI.

Features:
- step tracking
- sleep tracking
- AI daily insights
- weekly summaries
- recovery score
- weight trend prediction
- 3 AI prompts/day
- streaks
- calorie estimation

Viral hooks:
- Fitness Age
- Burnout Risk
- Consistency Score
- Shareable AI cards

---

# PRO — $14.99/month

Target:
Fitness enthusiasts.

Features:
- unlimited AI plans
- workout generation
- AI diet plans
- predictive analytics
- trend forecasting
- adaptive recommendations
- advanced sleep analysis
- HRV trends
- plateau detection
- overtraining detection

---

# ELITE — $39.99/month

Target:
Athletes and power users.

Features:
- voice AI coach
- unlimited AI chat
- long-term forecasting
- injury risk prediction
- AI memory/context
- adaptive scheduling
- advanced dashboards
- behavioral intelligence
- experimental AI labs
- “What If” simulations

---

# FEATURE FLAGS

Use:
- Firebase Remote Config

Flags:
```txt
ai_chat_enabled
voice_coach_enabled
advanced_predictions
future_projection
macro_optimizer
habit_ai
elite_dashboard
recovery_engine
```

---

# AI SYSTEM DESIGN

# THE AI MUST:

- analyze trends
- forecast outcomes
- explain health patterns
- recommend adjustments
- generate adaptive plans
- predict fatigue/recovery
- optimize user behavior

---

# AI INPUTS

The AI system should use:
- steps
- calories
- workouts
- heart rate
- resting HR
- HRV
- sleep
- nutrition
- sedentary time
- adherence
- body weight

---

# AI OUTPUTS

Examples:

```txt
Projected weight in 30 days:
73.1kg
```

```txt
Your elevated resting HR suggests accumulated fatigue.
Reduce workout intensity by 20%.
```

```txt
If you increase daily walking to 8k steps:
Projected fat loss over 30 days:
1.1kg
```

```txt
Protein intake appears insufficient for your training load.
Increase by 30g/day.
```

---

# AI SAFETY

NEVER:
- give medical diagnoses
- recommend starvation diets
- recommend unsafe workouts
- claim medical certainty

Always include:
```txt
Not medical advice.
Consult healthcare professionals.
```

---

# ANALYTICS ENGINE

Build:
- aggregation engine
- trend engine
- forecasting engine
- anomaly detection
- deduplication
- smoothing
- source prioritization

NEVER send raw health JSON directly into LLMs.

Instead:
1. aggregate
2. derive metrics
3. summarize context
4. send optimized prompts

---

# DERIVED METRICS

Create:
- Recovery Score
- Fatigue Score
- Adherence Score
- Burnout Risk
- Consistency Score
- Sleep Quality Score

---

# MOBILE UX PHILOSOPHY

The app should feel:
- emotionally rewarding
- futuristic
- alive
- smooth
- premium
- adaptive

NOT:
- clinical
- spreadsheet-heavy
- overwhelming

---

# MOBILE UX RULES

Prioritize:
- cards
- gestures
- conversational UI
- animations
- swipe flows
- beautiful charts
- gradients
- adaptive layouts

Avoid:
- dense tables
- enterprise UI
- clutter

---

# DESIGN STYLE

Visual direction:
- Apple Health
- Arc Browser
- Linear
- Oura
- Whoop
- Teenage Engineering
- Nothing
- cyberpunk minimalism

Use:
- glassmorphism subtly
- blur layers
- floating cards
- animated gradients
- depth
- motion
- breathing UI
- dynamic color systems

---

# COLOR THEMES

Support:
- dark mode first
- adaptive themes
- AMOLED mode
- dynamic accent colors

Suggested themes:
- graphite
- neon blue
- lime energy
- recovery purple
- bio-red
- minimal monochrome

---

# SOUND + HAPTICS

Include:
- subtle haptics
- microinteractions
- satisfying transitions
- soft notification sounds

The product should feel:
```txt
emotionally intelligent
```

---

# MAIN SCREENS

# HOME
Contains:
- recovery score
- daily AI insight
- sleep summary
- weight trend
- readiness score
- step progress
- AI recommendations

---

# COACH
AI chat interface.

Capabilities:
- answer health questions
- generate plans
- explain trends
- simulate outcomes
- suggest improvements

Should feel like:
```txt
ChatGPT for your body
```

---

# TRENDS
Show:
- weight projections
- fatigue forecasting
- recovery trends
- HRV analysis
- adherence patterns

---

# ACTIVITY
Show:
- workouts
- calories
- streaks
- movement
- active minutes

---

# REPORTS
Generate:
- weekly AI reports
- progress snapshots
- summaries
- adherence analysis

---

# NOTIFICATION SYSTEM

Examples:
```txt
Recovery score dropped below baseline.
```

```txt
You may be under-recovered today.
```

```txt
Projected calorie deficit achieved.
```

```txt
You are likely to plateau within 9 days.
```

---

# DATABASE SCHEMA

Create tables for:
- users
- health_samples
- aggregates
- subscriptions
- AI insights
- notifications
- plans
- goals

---

# DATA MODELING RULES

DO NOT tightly couple internal schema to Health Connect.

Create abstract entities:
- Workout
- SleepSession
- HeartRateSample
- RecoveryScore
- NutritionEntry

This allows future support for:
- Apple Health
- Garmin
- Oura
- Whoop

---

# FUTURE FEATURES

Plan future support for:
- voice AI coach
- body recomposition simulation
- AI-generated meal images
- computer vision form analysis
- smartwatch apps
- Apple Health
- Garmin
- Oura
- Whoop
- social features
- AI accountability groups

---

# GROWTH STRATEGY

Build for virality.

Create:
- shareable AI cards
- recovery screenshots
- burnout forecasts
- physique simulations
- weekly recaps

Encourage posting on:
- TikTok
- Instagram Reels
- Reddit
- X/Twitter

---

# POSITIONING

The startup should be positioned as:
```txt
The AI operating system for human health.
```

NOT:
```txt
another fitness tracker
```

---

# ENGINEERING RULES

Code quality should be:
- scalable
- production-ready
- modular
- typed
- performant

Use:
- feature flags
- analytics
- observability
- event-driven architecture
- reusable components

---

# STARTUP GOAL

Build:
- a billion-dollar AI health platform
- an emotionally engaging fitness product
- a predictive intelligence system
- the future of adaptive personal health

The platform should feel:
```txt
alive
adaptive
intelligent
beautiful
predictive
human
```

The final output should include:
- full UI system
- complete UX flows
- frontend architecture
- backend architecture
- AI system design
- monetization system
- database schema
- feature flag architecture
- notification architecture
- onboarding flows
- growth systems
- subscription/paywall flows
- dashboard concepts
- mobile-first responsive layouts
- PWA implementation details
- Android sync implementation
- analytics engine design
- deployment architecture
- startup positioning
- launch strategy
- MVP roadmap
- future roadmap
- premium visual design direction
- component system
- AI interaction philosophy
- animation system
- branding direction
- scalable folder structure
- developer experience standards
- production deployment strategy