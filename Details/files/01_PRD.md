# Product Requirements Document (PRD)
## FitTrack — AI-Powered Fitness & Nutrition Companion

**Version:** 1.0
**Date:** August 2026
**Owner:** Nitish Sharma(Full Stack Developer)
**Status:** Draft for Development

---

## 1. Executive Summary

FitTrack is a cross-platform (mobile + web) fitness companion that gives users a personalized, gamified daily fitness routine, tracks workouts and diet, uses camera-based AI to detect food nutrition and verify exercise completion, and layers a social/competitive experience on top through public profiles and leaderboards.

The core differentiator versus generic fitness apps: **AI-driven verification and analysis** — instead of manually logging everything, the camera does the heavy lifting for both diet (nutrient detection from a photo) and workout (exercise-form/rep detection).

---

## 2. Problem Statement

Most fitness apps fall into one of two buckets:
- **Trackers** (MyFitnessPal-style): great for logging, but require tedious manual data entry and don't adapt daily tasks to the user's real progress.
- **Workout planners** (gym apps): give static plans, don't verify if the user actually performed the exercise, and rarely connect diet + workout + progress into one loop.

Users struggle with:
1. Not knowing what to do *today* based on their actual body metrics and recent performance.
2. Manual diet logging being slow and inaccurate.
3. No way to confirm they actually completed a workout correctly.
4. Lack of motivation from doing it alone — no social accountability.

---

## 3. Goals & Objectives

| Goal | Success Metric |
|---|---|
| Give users a personalized daily task system | 70%+ daily task completion rate among active users |
| Reduce diet-logging friction via AI photo analysis | <10 sec average time to log a meal |
| Verify workouts automatically via camera | 80%+ accuracy on exercise detection (MVP: rep counting for 5–10 common exercises) |
| Build social engagement | 40%+ of users view/interact with leaderboard weekly |
| Retain users long term | 30-day retention ≥ 35% |

---

## 4. Target Users / Personas

1. **Beginner Bhavya (22, college student)** — New to fitness, doesn't know what exercises to do, needs guided daily tasks and simple diet rules.
2. **Home-workout Harsh (28, working professional)** — No gym access, wants bodyweight/calisthenics routines, tracks progress from home.
3. **Gym-goer Aditya (25, intermediate)** — Goes to gym regularly, wants structured splits, progress tracking, and competition via leaderboard.
4. **Diet-conscious Diya (30, weight-loss goal)** — Prioritizes nutrition tracking, wants quick photo-based calorie/macro logging.

---

## 5. Scope

### 5.1 In Scope (MVP)
- User authentication (email/password + social login via Firebase)
- Onboarding: collect height, weight, age, gender, fitness goal, experience level, equipment access
- **Dashboard**: today's tasks, completion %, streaks, quick stats
- **Fitness module**: daily auto-generated tasks (2–3/day) based on profile + history; exercise library (home/gym/calisthenics); manual + camera-based exercise completion tracking
- **Diet module**: daily diet suggestions, manual food logging, **camera-based food recognition** returning calories/macros/micros, "what to eat / avoid" guidance
- **Profile module**: public profile, search other users, view their public stats
- **Leaderboard**: ranking by streak/points/consistency
- Push notifications (task reminders)
- Web app mirroring core dashboard/profile/diet features (read + log, not necessarily camera-heavy on web v1)

### 5.2 Out of Scope (MVP — future phases)
- Real-time video-based rep-perfect form correction (advanced pose-correction feedback)
- Wearable device integrations (Fitbit, Apple Watch, etc.)
- Paid coaching / marketplace

---

## 6. Feature Requirements

### 6.1 Authentication & Onboarding
- Sign up / login via Email-Password, Google (Firebase Auth)
- Onboarding wizard: body metrics (height, weight, age, gender), activity level, goal (fat loss / muscle gain / maintenance / endurance), equipment access (home / gym / calisthenics), dietary preference (veg/non-veg/vegan, allergies)
- Editable profile settings anytime — triggers task/diet plan recalculation

### 6.2 Dashboard (Home)
- Today's task list (2–3 tasks: workout + diet + optional habit task)
- Completion ring/progress bar (X of Y tasks done today)
- Current streak counter (consecutive days maintained)
- Weekly consistency graph (tasks completed per day, last 7/30 days)
- Quick stats: current weight, weight trend, calories today vs. goal
- Shortcut CTAs: "Start Workout", "Log Meal", "Scan Food"

### 6.3 Fitness Module
- **Daily Task Engine**: generates 2–3 tasks/day based on:
  - user's goal, experience level, equipment access
  - recent completion history (adapts difficulty — progressive overload logic)
  - rest-day logic (avoid same muscle group 2 days straight)
- **Exercise Library**: categorized by Home Workout / Gym / Calisthenics; each exercise has instructions, target muscle, difficulty, suggested sets/reps, demo (image/gif or looped video)
- **Workout Session Flow**: user starts a task → sees exercise list with sets/reps → marks each set complete OR uses camera detection
- **Camera-based Exercise Detection (AI)**:
  - Uses device camera + pose-estimation model to detect exercise type and count reps (MVP scope: push-ups, squats, lunges, jumping jacks, plank timer — a manageable initial set)
  - On completion, auto-updates task status and logs reps/sets/duration to dashboard
- **Manual fallback**: user can mark complete manually if camera detection unavailable/declined

### 6.4 Diet Module
- **Daily Diet Suggestions**: based on TDEE calculation (from body metrics + activity + goal), suggests calorie/macro targets and meal ideas
- **Manual Food Log**: search food database, log quantity, auto-calculates calories/macros
- **AI Camera Food Scan**:
  - User takes a photo of their meal
  - Backend/AI service identifies food items and estimates calories, protein, carbs, fats, key vitamins/minerals
  - User can adjust portion size to refine estimate
  - Logged entry auto-adds to daily diet tracker
- **Diet Guidance**: "What to eat / what to avoid" based on goal (e.g., fat loss → calorie deficit + high protein guidance)
- **Diet History**: calendar view of past logged meals & totals

### 6.5 Profile Module
- Public profile: username, avatar, fitness goal, streak badge, achievements, public stats (opt-in — weight/body metrics stay private by default)
- Search other users by username
- View another user's public profile (stats they've chosen to share, streak, badges)
- Privacy settings: control what's public vs private

### 6.6 Leaderboard
- Global + Friends leaderboard
- Ranking basis: consistency points (weighted score from streak + tasks completed + workout volume)
- Weekly reset option (weekly leaderboard) + all-time leaderboard
- Filters: by goal type / by region (future)

### 6.7 Notifications
- Daily task reminder
- Streak-at-risk reminder ("Don't break your 7-day streak!")
- Leaderboard rank change alerts (optional)

---

## 7. Non-Functional Requirements
- **Performance**: Dashboard load < 2s; camera detection feedback < 1.5s per frame batch
- **Scalability**: Backend must support horizontal scaling (stateless API + Redis cache + PostgreSQL)
- **Security**: JWT-based auth, hashed credentials (Firebase handles this), rate-limited APIs, input validation everywhere
- **Cross-platform consistency**: Core data model shared between app & web via same backend APIs
- **Offline tolerance (app)**: Cache today's tasks locally (Zustand persisted state) so dashboard is viewable offline; sync on reconnect
- **Privacy**: Camera images processed for detection are not stored permanently unless user opts in (for progress photos)

---

## 8. Assumptions & Constraints
- MVP AI exercise detection limited to a fixed set of well-defined bodyweight exercises (pose estimation is unreliable for complex gym machine movements initially)
- Food recognition AI accuracy depends on food image quality/lighting — always allow manual correction
- Firebase used for Auth + possibly storage of images; PostgreSQL is source of truth for relational data (users, tasks, workouts, diet logs); Redis for caching leaderboard & session data

---

## 9. Release Plan (High-Level Phases)
1. **Phase 1 (MVP core)**: Auth, onboarding, dashboard, manual task/exercise tracking, manual diet logging
2. **Phase 2**: Camera-based food scan AI integration
3. **Phase 3**: Camera-based exercise detection AI integration
4. **Phase 4**: Social layer — public profiles, search, leaderboard
5. **Phase 5**: Polish — notifications, analytics, web app parity

*(Full breakdown in the Implementation Plan document.)*

---

## 10. Open Questions
- Which AI/ML approach for pose detection — on-device (TensorFlow Lite / MediaPipe) vs. server-side? (Recommendation in TRD)
- Which food recognition API/model — custom-trained vs. third-party (e.g., LogMeal, Nutritionix, or Gemini Vision)? (Recommendation in TRD)
- Monetization strategy — not defined yet, out of scope for MVP
