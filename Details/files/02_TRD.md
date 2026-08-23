# Technical Requirements Document (TRD)
## FitTrack — AI-Powered Fitness & Nutrition Companion

**Version:** 1.0
**Date:** August 2026

---

## 1. Tech Stack Overview

| Layer | Stack |
|---|---|
| Mobile App | React Native + TypeScript, Zustand, react-native-vector-icons, react-native-vision-camera, Firebase (Auth, Storage, Push/FCM) |
| Web App | React.js + TypeScript, Zustand, localStorage/sessionStorage, cookies, vector icons, Firebase (Auth only — data via backend API) |
| Backend | Node.js + Express.js + TypeScript, JWT auth, Firebase Admin SDK, PostgreSQL, Redis (cache + session/leaderboard), REST API |
| AI/ML Services | Pose estimation (exercise detection) + Food/Nutrition recognition (image analysis) — see Section 5 |
| Infra | Cloud hosting (e.g., Render/Railway/AWS), PostgreSQL managed DB (e.g., Supabase/RDS), Redis managed (Upstash/ElastiCache), Firebase project (Auth + Cloud Storage for images) |

---

## 2. Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐
│  React Native    │     │    React Web     │
│  App (TS)         │     │    App (TS)       │
└────────┬─────────┘     └────────┬─────────┘
         │  REST (Axios) + JWT             │
         └───────────────┬──────────────────┘
                          │
                 ┌────────▼─────────┐
                 │  Express.js API   │
                 │  (Node + TS)      │
                 │  - Auth middleware │
                 │  - Rate limiting   │
                 │  - Controllers     │
                 └───┬───────┬───────┘
                     │       │
        ┌────────────▼┐   ┌─▼─────────────┐
        │ PostgreSQL   │   │ Redis Cache    │
        │ (source of   │   │ (sessions,     │
        │  truth)      │   │ leaderboard,   │
        │              │   │ rate-limit)    │
        └──────────────┘   └────────────────┘

  External Services:
  - Firebase Auth (identity) + Firebase Cloud Storage (photos)
  - AI Food Recognition Service (image → nutrients)
  - Pose Estimation Service (on-device primarily; optional server verification)
```

**Auth flow note:** Firebase handles identity (sign-up/login/social auth) and issues a Firebase ID token. The backend verifies this token via Firebase Admin SDK on first contact, then issues its **own JWT (access + refresh token pair)** for subsequent API calls — this keeps the backend authorization logic independent of Firebase and allows custom claims (roles, subscription tier later).

---

## 3. Mobile App (React Native + TypeScript)

### 3.1 Core Libraries
- **Navigation**: `@react-navigation/native` (bottom tabs: Dashboard, Fitness, Diet, Profile)
- **State management**: `zustand` (with `zustand/middleware persist` + AsyncStorage for offline cache of today's tasks/user profile)
- **Icons**: `react-native-vector-icons`
- **Camera**: `react-native-vision-camera` (high-performance frame processor support — needed for real-time pose estimation)
- **Auth**: `@react-native-firebase/auth`
- **Push Notifications**: `@react-native-firebase/messaging`
- **Networking**: `axios` with interceptor for JWT attach + refresh
- **Forms**: `react-hook-form` + `zod` for validation
- **Charts**: `react-native-svg` + `victory-native` or `react-native-chart-kit` for weekly progress graphs

### 3.2 On-device AI (Exercise Detection)
- Use **MediaPipe (via `react-native-fast-tflite` or a MediaPipe RN wrapper)** or **TensorFlow Lite pose model (MoveNet Lightning)** running on-device via the VisionCamera frame processor.
- On-device is strongly preferred over server-side streaming for:
  - Real-time feedback (no network latency)
  - Privacy (raw frames never leave device)
  - Battery/data efficiency
- Rep-counting logic: track key joint angles (e.g., knee angle for squats, elbow angle for push-ups) frame-by-frame in JS worklets, count a rep on a full up-down-up angle cycle.
- Only the **final result** (exercise type, rep count, duration) is sent to backend — not video/frames.

### 3.3 State Management Structure (Zustand stores)
- `useAuthStore` — user session, tokens, login state
- `useProfileStore` — body metrics, goals, preferences
- `useDashboardStore` — today's tasks, streak, completion cache
- `useFitnessStore` — active workout session state, exercise library cache
- `useDietStore` — today's diet log, food search cache
- `useLeaderboardStore` — cached leaderboard data (short TTL)

---

## 4. Web App (React.js + TypeScript)

### 4.1 Core Libraries
- **Routing**: `react-router-dom`
- **State**: `zustand` (persist to `localStorage` for non-sensitive cache; `sessionStorage` for per-tab transient state)
- **Auth tokens**: JWT access token in memory/Zustand only (not localStorage, to reduce XSS risk); **refresh token in httpOnly secure cookie** set by backend
- **Icons**: `react-icons` or same vector icon set as app for consistency
- **Auth**: Firebase Auth Web SDK (same project as app)
- **Camera (food scan on web)**: `getUserMedia` API for optional webcam-based food scan (secondary priority vs. app)
- **Charts**: `recharts`

### 4.2 Web vs App Feature Parity
| Feature | App | Web |
|---|---|---|
| Dashboard | ✅ | ✅ |
| Manual task tracking | ✅ | ✅ |
| Camera exercise detection | ✅ (primary) | ⛔ MVP (phone camera better UX) |
| Camera food scan | ✅ | ✅ (via webcam, secondary priority) |
| Profile/search/leaderboard | ✅ | ✅ |
| Push notifications | ✅ | Web push (future) |

### 4.3 Security Notes for Web
- Never store JWT access token in `localStorage` (XSS risk) — keep in memory (Zustand, non-persisted slice) and rely on short expiry + silent refresh via httpOnly cookie.
- CSRF protection on the refresh-token cookie endpoint (SameSite=strict + CSRF token).
- `sessionStorage` used only for ephemeral UI state (e.g., active tab, unsaved form draft).

---

## 5. AI Services

### 5.1 Food Recognition (Diet Photo Analysis)
**Recommended approach for MVP:** Use a hosted multimodal vision API (e.g., a vision-capable LLM API) to identify food items + estimate portions from the photo, then cross-reference a **nutrition database** (e.g., USDA FoodData Central / Nutritionix API / Edamam) for accurate calorie/macro/micro values.

Flow:
1. User captures photo → uploaded to Firebase Storage → URL sent to backend
2. Backend calls vision model: "identify food items and estimate quantity in this image"
3. Backend maps identified items to nutrition DB entries → aggregates calories, protein, carbs, fat, key vitamins
4. Returns structured JSON to client for user confirmation/adjustment before logging

**Why hosted vision API over custom model for MVP:** food recognition is a hard, data-intensive CV problem; a custom-trained model needs a large labeled dataset. Using an existing vision-capable API + nutrition DB gets an accurate, launchable MVP faster. A custom fine-tuned model can be a v2 optimization once you have logged-meal data to train on.

### 5.2 Exercise Detection (Workout Verification)
**Recommended approach:** On-device pose estimation (MoveNet/MediaPipe Pose) as described in 3.2. Server does **not** need to process video — it only receives the final rep/set/duration summary, which keeps backend load light and preserves privacy.

For future accuracy improvements: allow optional short video clip upload of a set for server-side double-check using a more powerful pose model, but this is a Phase 3+/4 nice-to-have, not MVP-critical.

---

## 6. Backend (Express + TypeScript)

### 6.1 Structure
```
src/
 ├── config/          # env, firebase admin init, db pool, redis client
 ├── middlewares/      # auth, error handler, rate limiter, validation
 ├── modules/
 │    ├── auth/
 │    ├── users/
 │    ├── profile/
 │    ├── fitness/       (tasks, exercises, workout logs)
 │    ├── diet/          (food logs, food db, ai-scan)
 │    ├── leaderboard/
 │    └── notifications/
 ├── services/          # external service wrappers (firebase, nutrition API, vision API)
 ├── utils/
 └── server.ts
```

### 6.2 Key Middleware
- `authenticate` — verifies JWT, attaches `req.user`
- `rateLimiter` — Redis-backed rate limiting per user/IP (especially for AI-scan endpoints, which are costly)
- `validateRequest` — Zod schema validation per route
- `errorHandler` — centralized error formatting

### 6.3 Caching Strategy (Redis)
- Leaderboard rankings — computed periodically (e.g., every 5–15 min via cron/worker) and cached; read-heavy endpoint served from cache
- Session/refresh-token blacklist (for logout/revocation)
- Rate-limit counters
- Today's task-generation result cached per user for the day (avoid recomputation on every dashboard load)

### 6.4 Background Jobs
- **Daily Task Generator** (cron, runs nightly): generates next day's 2–3 tasks per active user based on profile + recent history
- **Leaderboard Recalculation** (cron, every few minutes): recompute consistency scores → update Redis sorted set
- **Streak Evaluator** (cron, daily at day-rollover): checks task completion → updates/resets streaks

### 6.5 Database
PostgreSQL as system of record — full schema in the **Backend Schema** document. Use an ORM (Prisma recommended for TypeScript ergonomics + migrations) or Knex if raw SQL control preferred.

---

## 7. API Design Principles
- RESTful resource-based routes (e.g., `/api/v1/tasks/today`, `/api/v1/diet/logs`, `/api/v1/leaderboard`)
- Versioned APIs (`/api/v1/...`) for future-proofing
- Consistent response envelope:
```json
{ "success": true, "data": {}, "message": "" }
```
- Pagination via `?page=&limit=` for list endpoints (search, leaderboard, history)
- All AI-related endpoints (`/diet/scan`, `/fitness/verify-exercise`) rate-limited and queued if needed to control cost

---

## 8. Non-Functional / Infra Requirements
- **Environments**: dev / staging / production with separate Firebase projects & DB instances
- **CI/CD**: GitHub Actions — lint, typecheck, test, build, deploy on merge to main/staging branches
- **Monitoring**: basic error tracking (Sentry) + API logging (Winston/Pino) + uptime monitoring
- **Testing**: unit tests (Jest) for task-generation logic & nutrition calculations; integration tests for critical API routes
- **Secrets management**: `.env` per environment, never committed; secrets manager in production

---

## 9. Third-Party Services Summary
| Purpose | Service |
|---|---|
| Auth (identity) | Firebase Authentication |
| Image storage | Firebase Cloud Storage |
| Push notifications | Firebase Cloud Messaging |
| Nutrition database | Nutritionix / Edamam / USDA FoodData Central |
| Food image recognition | Vision-capable AI API |
| Pose estimation | MediaPipe Pose / TFLite MoveNet (on-device) |
| Error tracking | Sentry |
| Hosting | Render / Railway / AWS (backend); Vercel/Netlify (web); App Store & Play Store (mobile) |
