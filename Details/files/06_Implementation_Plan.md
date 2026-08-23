# Implementation Plan
## FitTrack — AI-Powered Fitness & Nutrition Companion

**Version:** 1.0

---

## 1. Guiding Approach

Build backend-first for core data models, then app, then web (reusing backend APIs). AI features (camera food scan, camera exercise detection) are added as **enhancement layers** on top of a working manual-entry MVP — this de-risks the timeline since AI integration is the highest-uncertainty part of the project.

---

## 2. Phase Breakdown

### Phase 0 — Setup & Foundations (Week 1)
- Repo setup (monorepo or 3 separate repos: `backend`, `mobile`, `web`)
- Firebase project setup (Auth, Storage, FCM) — dev environment
- PostgreSQL + Redis provisioning (dev)
- Base Express + TypeScript backend skeleton with folder structure, ESLint/Prettier, env config
- Base React Native app skeleton (navigation shell, Zustand store setup, theme/design tokens)
- Base React web app skeleton (routing shell, Zustand store setup, shared design tokens)
- CI pipeline (lint + typecheck on PR)

**Deliverable:** Empty but running app/web/backend, connected to Firebase Auth, "Hello Dashboard" screen reachable after login.

---

### Phase 1 — Auth, Onboarding, Core Data (Weeks 2–3)
**Backend:**
- `users`, `user_profiles` tables + migrations
- Firebase token verification middleware → issue JWT access/refresh pair
- `/auth/refresh`, `/auth/logout`, `/users/me` (GET/PATCH) endpoints
- TDEE/macro calculation utility (based on profile inputs)

**App + Web:**
- Login/Signup screens (Firebase SDK integration)
- Onboarding wizard (all steps from App Flow doc) → submits to `/users/me`
- Auth state persistence (Zustand + AsyncStorage on app; in-memory + httpOnly cookie refresh on web)

**Deliverable:** User can sign up, complete onboarding, land on an (empty) dashboard. Profile editable.

---

### Phase 2 — Dashboard + Manual Task/Fitness Tracking (Weeks 4–5)
**Backend:**
- `exercises` table + seed data (initial exercise library — home/gym/calisthenics)
- `daily_tasks` table + **Daily Task Generator** logic (rule-based initially: pick tasks based on goal + equipment + rotate muscle groups + adjust volume based on last 7 days completion rate)
- `workout_sessions`, `workout_session_exercises` tables
- Endpoints: `/tasks/today`, `/tasks/:id/complete`, `/exercises` (browse/filter), `/workouts/sessions` (start/log/finish)

**App + Web:**
- Dashboard screen (today's tasks, completion ring, streak, weekly graph)
- Fitness tab: exercise library browse, workout session flow (manual set/rep completion only at this phase)
- `streaks` table + logic (increment/reset on day rollover — backend cron)

**Deliverable:** Full manual fitness-tracking loop working end-to-end: tasks generated daily, user completes workouts manually, dashboard reflects progress, streaks work.

---

### Phase 3 — Diet Tracking (Manual) (Weeks 6–7)
**Backend:**
- `foods` table (seed common items + integrate external nutrition API for search/lookup, cache results)
- `diet_logs`, `diet_log_items` tables
- Endpoints: `/diet/search-food`, `/diet/logs` (CRUD), `/diet/today-summary`
- Diet guidance logic (rule-based tips generated from goal + today's macro gap)

**App + Web:**
- Diet tab: today's summary, meal sections, manual "search & add food" flow
- Diet history calendar view

**Deliverable:** Users can manually log meals and see accurate macro/calorie tracking against personalized targets.

---

### Phase 4 — AI Food Scan Integration (Weeks 8–9)
**Backend:**
- Integrate vision API for food identification from photo
- Pipeline: image upload (Firebase Storage) → vision analysis → map results to `foods` table (create new entries if not cached) → return structured nutrient estimate
- Rate-limiting + caching (Redis) on this endpoint due to external API cost
- Endpoint: `/diet/scan` (POST photo → returns detected items + estimates)

**App + Web:**
- Camera capture UI → loading state → Food Scan Result screen (editable portions) → confirm & log
- Fallback to manual search if scan fails/low-confidence

**Deliverable:** Users can snap a meal photo and get an editable nutrient breakdown logged in seconds.

---

### Phase 5 — AI Exercise Detection (Weeks 10–12)
**Mobile only (App):**
- Integrate on-device pose estimation (MediaPipe/TFLite via VisionCamera frame processor)
- Implement rep-counting logic for initial exercise set (push-ups, squats, lunges, jumping jacks, plank-hold timer)
- Live camera screen with skeleton overlay + rep counter UI
- On completion, log to `workout_session_exercises` with `detection_method='camera_ai'`

**Backend:**
- No heavy processing needed (client sends final summary) — just validate & store result
- Add `confidence_score` handling / anomaly flag (e.g., reject impossible rep counts)

**Deliverable:** Core flagship AI feature — camera verifies workout completion for supported exercises, with manual fallback always available.

---

### Phase 6 — Social Layer: Profile, Search, Leaderboard (Weeks 13–14)
**Backend:**
- `public_fields` privacy logic on profile endpoints
- `/users/search?q=` endpoint
- `follows` table + endpoints (optional friend graph)
- `leaderboard_scores` table + scoring formula (weighted: streak + tasks completed + workout volume)
- Cron job: recalculate scores → push into Redis ZSET
- Endpoints: `/leaderboard/global`, `/leaderboard/weekly`, `/leaderboard/friends`
- `achievements` + `user_achievements` tables + unlock logic (streak milestones etc.)

**App + Web:**
- Public profile view screen
- User search screen
- Leaderboard screen (tabs: global/friends/weekly)
- Achievement badges on profile

**Deliverable:** Full social loop — users can find each other, compare progress, compete on leaderboard.

---

### Phase 7 — Notifications, Polish, QA (Weeks 15–16)
- FCM push notifications: daily task reminder, streak-at-risk alert
- Dark mode pass across app & web
- Empty states, error states, loading skeletons everywhere (per Design Brief)
- Performance pass: API response caching review, image optimization, app bundle size check
- Cross-device QA (various Android/iOS versions, browser matrix for web)
- Security review: rate limits, auth edge cases, privacy field leakage check on public endpoints

**Deliverable:** Production-ready MVP across App + Web + Backend.

---

### Phase 8 — Beta Launch & Iteration (Week 17+)
- Closed beta with small user group
- Monitor: task completion rates, AI scan accuracy/feedback, crash reports (Sentry)
- Iterate on task-generation logic based on real usage data
- Plan v2: improve food-recognition accuracy, expand exercise-detection library, consider wearable integration

---

## 3. Team & Effort Notes (Solo/Small-Team Adjusted)
Since this looks like a personal/portfolio-grade build, realistic solo-dev pacing:
- Phases 0–3 (backend + manual tracking core) are the most valuable to nail first — this alone is already a strong, demoable full-stack project.
- Phases 4–5 (AI features) are the differentiators — worth prioritizing right after core loop works, since they're the most "impressive" and technically interesting parts for a portfolio.
- Phase 6 (social/leaderboard) can be simplified in a first pass (skip `follows`, just do global leaderboard) if time-constrained, then expanded.
- Total realistic solo timeline: **~4–5 months** at steady part-time pace, or ~10–12 weeks full-time — adjust phase weeks above accordingly to your actual availability.

---

## 4. Risk Log
| Risk | Mitigation |
|---|---|
| Food image recognition accuracy is inconsistent | Always allow manual portion/item correction; treat AI result as a "starting estimate" |
| On-device pose detection performance varies across devices | Start with a small, well-tested exercise set; provide manual fallback always |
| External nutrition/vision API costs scale with usage | Cache aggressively (Redis + `foods` table), rate-limit scan endpoints |
| Daily task generation feels repetitive/unfair | Start rule-based (transparent, debuggable), collect data, refine logic iteratively — avoid a black-box ML approach until enough usage data exists |
| Scope creep (this is a big feature list) | Follow phase order strictly; resist adding features before Phase 0–3 core loop is solid |
