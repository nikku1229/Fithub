# UI/UX Design Brief
## FitTrack — AI-Powered Fitness & Nutrition Companion

**Version:** 1.0

---

## 1. Design Principles

1. **Clarity over density** — a user should understand "what do I need to do today" within 3 seconds of opening the app.
2. **Progress feels rewarding** — every completed task, streak, or scan should have a small moment of visual feedback (progress rings filling, subtle animation, badge unlock).
3. **Low-friction logging** — camera-first interactions (scan food, detect exercise) should always be one tap away from any relevant screen.
4. **Consistency across App & Web** — same visual language, component library, and iconography so users feel at home switching platforms.
5. **Accessible & inclusive** — legible type sizes, sufficient color contrast, works for both gym-goers and home-workout beginners.

---

## 2. Visual Identity

### 2.1 Color Palette (suggested — adjust to taste)
| Role | Color | Usage |
|---|---|---|
| Primary | Deep Teal / Emerald (`#1E2023`-ish) | CTAs, active tab, progress rings |
| Secondary | Energetic Orange (`#FF7A45`-ish) | Streak highlights, alerts, "scan" actions |
| Background (light) | Off-white (`#F7F8FA`) | App background |
| Background (dark) | Near-black (`#121417`) | Dark mode background |
| Surface | White / Dark gray card | Cards, modals |
| Success | Green | Task complete, goal met |
| Warning | Amber | Streak at risk |
| Text primary | Near-black / off-white (dark mode) | Body text |
| Text secondary | Gray | Captions, metadata |

Support **dark mode** from day one — fitness apps are frequently opened early morning/late night.

### 2.2 Typography
- A clean, geometric sans-serif (e.g., Inter, Poppins, or similar) — good legibility at small sizes for data-heavy screens (macros, numbers).
- Type scale: Display (32–28px) for headers → Body (14–16px) → Caption (12px) for metadata.
- Numbers (calories, reps, weight) should use tabular/monospaced figures where possible for alignment in lists.

### 2.3 Iconography
- Consistent vector icon set (e.g., Feather/Lucide style — matches `react-native-vector-icons` / `react-icons` availability on both platforms)
- Category icons for exercise types (home/gym/calisthenics), food categories, and achievement badges — should feel friendly, not clinical.

---

## 3. Core Screen Design Guidance

### 3.1 Dashboard
- **Top-of-screen hierarchy**: greeting + streak flame icon → today's completion ring (large, central, satisfying) → task cards below (swipeable or scrollable list, checkbox-style complete action)
- Weekly graph: simple bar chart, 7 bars, current day highlighted
- Use **card-based layout** with soft shadows/rounded corners (12–16px radius) — avoid dense tables here; save data density for detail screens

### 3.2 Fitness — Workout Session Screen
- Full-screen focused mode during active workout (minimal chrome, large exercise name/timer)
- Camera detection view: pose skeleton overlay in primary color, rep counter large and centered at top, subtle haptic/sound feedback per rep
- Rest timer between sets: full-screen countdown with "Skip Rest" option

### 3.3 Diet — Food Scan Result Screen
- Photo thumbnail at top, detected items listed below as editable cards (item name, portion slider, calories/macros shown live-updating as portion adjusts)
- Macro breakdown shown as a simple stacked bar or donut (protein/carbs/fat) — instantly scannable
- Micronutrient info (vitamins, etc.) collapsible "See more" section — don't overwhelm by default

### 3.4 Profile & Leaderboard
- Profile header: avatar, username, goal badge, streak — Instagram-profile-like familiarity
- Public/private toggle for each stat should be visually obvious (small lock/globe icon)
- Leaderboard: numbered list, rank 1–3 visually emphasized (medal colors), current user's row highlighted/sticky if scrolled out of view

---

## 4. Interaction & Motion
- Task completion: checkbox → satisfying check animation + ring fill increment
- Streak milestones (7, 30, 100 days): a celebratory modal/animation (confetti-style, tasteful, not intrusive)
- Camera-based detection: real-time overlay must feel responsive (<200ms perceived lag) — motion/animation here should never block the camera feed
- Page transitions: subtle slide/fade, consistent easing curve across app

---

## 5. Component Library (Shared Design System)
Build a shared set of components (Figma library + code implementation) reused across dashboard/fitness/diet/profile:
- `TaskCard`, `ProgressRing`, `StatChip`, `StreakBadge`, `ExerciseCard`, `MacroBar`, `LeaderboardRow`, `PrimaryButton`, `IconButton`, `BottomSheet`, `EmptyState`, `LoadingSkeleton`

Using a shared component set keeps **App and Web visually consistent** even though implementations differ (React Native vs React DOM) — same design tokens (colors, spacing, radius, type scale) should be defined once (e.g., a shared `design-tokens.json`) and consumed by both.

---

## 6. Web-Specific UX Considerations
- Sidebar navigation (not bottom tabs) since web has more horizontal space
- Dashboard as a responsive grid (widgets rearrange on smaller browser widths)
- Data tables acceptable on web for diet/workout history (more screen real estate) — app should stay card/list-based
- Keyboard shortcuts / hover states for desktop users (nice-to-have, not MVP-critical)

---

## 7. Empty & Error States
- No tasks yet (before onboarding completes): friendly illustration + "Complete your profile to get your first tasks"
- Camera permission denied: clear explanation + manual-entry fallback always available, never a dead end
- Food scan low-confidence result: flag uncertain items clearly, prompt user to confirm/edit rather than silently trusting AI

---

## 8. Accessibility Checklist
- Minimum 4.5:1 contrast for body text
- All camera-dependent features have a manual-entry alternative (for users who can't/won't use camera)
- Tap targets ≥ 44x44px on mobile
- Screen-reader labels for icons and progress indicators
