# App Flow Document
## FitTrack — AI-Powered Fitness & Nutrition Companion

**Version:** 1.0

---

## 1. High-Level User Journey

```
Launch App
   │
   ▼
[Splash/Auth Check] ──(logged in)──▶ Dashboard
   │ (not logged in)
   ▼
[Login / Sign Up] ──▶ [Onboarding Wizard] ──▶ Dashboard (Home)
```

---

## 2. Onboarding Flow (first-time users only)

1. **Welcome screen** — brief app pitch, "Get Started" CTA
2. **Sign up** — Email/Password or Google (Firebase)
3. **Basic Info** — name, age, gender
4. **Body Metrics** — height, weight, target weight (optional)
5. **Goal Selection** — Fat Loss / Muscle Gain / Maintenance / Endurance
6. **Experience Level** — Beginner / Intermediate / Advanced
7. **Equipment Access** — Home (no equipment) / Home (basic equipment) / Full Gym / Calisthenics focus
8. **Dietary Preference** — Veg / Non-veg / Vegan / Allergies (multi-select)
9. **Permissions** — Camera access, Notification access (with clear explanation of why)
10. **Summary + Confirm** → generates first day's tasks → lands on **Dashboard**

*Each step saved to Zustand store incrementally; final submit sends full profile payload to backend, which triggers first task-generation.*

---

## 3. Bottom Tab Navigation (Main App Shell)

```
┌───────────┬───────────┬───────────┬───────────┐
│ Dashboard │  Fitness   │   Diet    │  Profile   │
└───────────┴───────────┴───────────┴───────────┘
```

---

## 4. Dashboard Tab Flow

```
Dashboard (Home)
 ├─ Header: greeting + streak badge
 ├─ Today's Task Card list
 │    ├─ Task 1 (e.g., "Leg Day - Home Workout") → tap → Fitness Task Detail
 │    ├─ Task 2 (e.g., "Log Breakfast") → tap → Diet Log screen
 │    └─ Task 3 (e.g., "Drink 3L water") → tap → mark complete inline
 ├─ Completion Ring (X/Y tasks done today)
 ├─ Weekly Consistency Graph (last 7 days bar chart)
 ├─ Quick Stats Row: current weight | calories today | streak days
 └─ Quick Action Buttons: [Start Workout] [Scan Food] [Log Weight]
```

**Data flow:** On mount → fetch `/tasks/today` (cached in Zustand w/ TTL) → render. Pull-to-refresh re-fetches. Completing a task anywhere in the app updates this store, so Dashboard reflects it instantly (optimistic update + background sync).

---

## 5. Fitness Tab Flow

```
Fitness Tab (landing)
 ├─ Today's Workout Task (if any) — [Start] button
 ├─ Exercise Library (browse by category)
 │    ├─ Home Workout
 │    ├─ Gym
 │    └─ Calisthenics
 └─ My Workout History (calendar/list view)

[Start Workout] tapped
   ▼
Workout Session Screen
 ├─ Exercise list for the task (with sets x reps target)
 ├─ Per-exercise: [Manual Complete] OR [Use Camera Detection]
 │
 │  If Camera Detection:
 │    ▼
 │  Camera Screen (VisionCamera + pose overlay)
 │    - Live rep counter overlay
 │    - Auto-detects exercise start/end
 │    - On set complete → shows rep count → [Confirm] or [Redo]
 │    ▼
 │  Returns to Workout Session Screen with set marked done
 │
 └─ All exercises done → [Finish Workout] → Summary Screen
        (duration, total reps, calories est.) → back to Dashboard (task marked complete)
```

---

## 6. Diet Tab Flow

```
Diet Tab (landing)
 ├─ Today's Diet Summary (calories/macros consumed vs. target — progress bars)
 ├─ Meal sections: Breakfast / Lunch / Dinner / Snacks
 │     each with [+ Add] → opens Add Food options:
 │        ├─ [Scan with Camera] → AI Food Scan Flow
 │        ├─ [Search Food Database] → manual search + quantity → add
 │        └─ [Quick Add Custom] → manual macro entry
 ├─ Diet Guidance Card ("Eat more: ... Avoid: ..." based on goal)
 └─ Diet History (calendar view of past days)

AI Food Scan Flow:
 Camera capture → uploading/analyzing (loading state)
    ▼
 Result screen: detected food items + estimated calories/macros/vitamins
    ├─ [Adjust portion] sliders per item
    └─ [Confirm & Log] → adds to today's diet log → back to Diet tab
```

---

## 7. Profile Tab Flow

```
Profile Tab (own profile, default)
 ├─ Avatar, username, bio, goal badge, streak, achievements
 ├─ Body stats (private toggle)
 ├─ [Edit Profile] → edit body metrics/goal/preferences (triggers task re-generation)
 ├─ [Settings] → notifications, privacy, logout
 └─ [Search Icon] → Search Users
        ▼
     Search Results List → tap a user → Public Profile View (read-only,
     shows only what that user made public: username, goal, streak, badges)

 └─ [Leaderboard] (accessible from Profile tab or Dashboard shortcut)
        ▼
     Leaderboard Screen
       ├─ Tabs: Global | Weekly | All-time
       └─ Ranked list with rank, avatar, username, score
             tap a user → Public Profile View
```

---

## 8. Web App Flow (Mirrors Mobile, Adjusted for Browser)

```
Landing/Login Page → Auth (Firebase) → Dashboard (main layout: sidebar nav
   instead of bottom tabs: Dashboard | Fitness | Diet | Profile | Leaderboard)

- Dashboard: same widgets as app, laid out in a grid
- Fitness: exercise library browse + manual workout logging (no live camera
  rep-counting on web v1 — user marks sets complete manually, or uploads a
  photo/video for later review — future scope)
- Diet: same Add Food flow; camera scan available via webcam permission
- Profile/Leaderboard: same as app
```

---

## 9. Cross-Cutting Flows

### 9.1 Auth Token Refresh (silent, background)
```
API call fails with 401 → axios interceptor triggers refresh
   → POST /auth/refresh (using refresh token: AsyncStorage on app /
     httpOnly cookie on web)
   → new access token issued → original request retried
   → if refresh fails → force logout → redirect to Login
```

### 9.2 Offline Handling (App)
```
No network on Dashboard load → serve cached Zustand-persisted state
  (today's tasks, last known stats) with an "Offline — showing last
  synced data" banner → actions queued (e.g., "mark task complete")
  → synced when connection restored
```
