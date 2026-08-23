# Backend Schema Document
## FitTrack — AI-Powered Fitness & Nutrition Companion

**Version:** 1.0
**Database:** PostgreSQL | **Cache:** Redis

---

## 1. Entity Relationship Overview

```
users ──┬── user_profiles
        ├── body_metrics_logs
        ├── daily_tasks ── task_exercises / task_diet_targets
        ├── workout_sessions ── workout_session_exercises
        ├── diet_logs ── diet_log_items
        ├── streaks
        ├── leaderboard_scores
        ├── achievements ── user_achievements
        └── follows (user ↔ user, self-referencing)

exercises (library, not user-owned)
foods (nutrition database reference, cached from external API)
```

---

## 2. PostgreSQL Schema (Core Tables)

### 2.1 `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);
```

### 2.2 `user_profiles`
```sql
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  age INT,
  gender VARCHAR(20),
  height_cm NUMERIC(5,2),
  current_weight_kg NUMERIC(5,2),
  target_weight_kg NUMERIC(5,2),
  goal VARCHAR(30) CHECK (goal IN ('fat_loss','muscle_gain','maintenance','endurance')),
  experience_level VARCHAR(20) CHECK (experience_level IN ('beginner','intermediate','advanced')),
  equipment_access VARCHAR(30) CHECK (equipment_access IN ('home_none','home_basic','full_gym','calisthenics')),
  dietary_preference VARCHAR(30),
  allergies TEXT[],
  activity_level VARCHAR(20),
  tdee_calories INT,               -- calculated target
  target_protein_g INT,
  target_carbs_g INT,
  target_fat_g INT,
  is_public_profile BOOLEAN DEFAULT true,
  public_fields JSONB DEFAULT '{"weight": false, "streak": true, "goal": true}',
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.3 `body_metrics_logs` (weight history over time)
```sql
CREATE TABLE body_metrics_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  weight_kg NUMERIC(5,2),
  logged_at TIMESTAMPTZ DEFAULT now(),
  note TEXT
);
CREATE INDEX idx_body_metrics_user_date ON body_metrics_logs(user_id, logged_at);
```

### 2.4 `exercises` (library reference table)
```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(20) CHECK (category IN ('home','gym','calisthenics')),
  target_muscle VARCHAR(50),
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner','intermediate','advanced')),
  instructions TEXT,
  demo_media_url TEXT,
  supports_camera_detection BOOLEAN DEFAULT false,
  default_sets INT,
  default_reps INT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.5 `daily_tasks`
```sql
CREATE TABLE daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_date DATE NOT NULL,
  task_type VARCHAR(20) CHECK (task_type IN ('workout','diet','habit')),
  title VARCHAR(150),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','completed','skipped')),
  related_exercise_id UUID REFERENCES exercises(id),   -- nullable, for workout tasks
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, task_date, title)
);
CREATE INDEX idx_daily_tasks_user_date ON daily_tasks(user_id, task_date);
```

### 2.6 `workout_sessions`
```sql
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  daily_task_id UUID REFERENCES daily_tasks(id),
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  total_duration_seconds INT,
  estimated_calories_burned INT
);
```

### 2.7 `workout_session_exercises`
```sql
CREATE TABLE workout_session_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  sets_completed INT,
  reps_completed INT,
  detection_method VARCHAR(20) CHECK (detection_method IN ('manual','camera_ai')),
  confidence_score NUMERIC(4,3),   -- for camera_ai detections
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.8 `foods` (cached nutrition reference — populated from external API on lookup)
```sql
CREATE TABLE foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  external_source VARCHAR(30),      -- e.g. 'nutritionix'
  external_id VARCHAR(100),
  calories_per_100g NUMERIC(6,2),
  protein_g NUMERIC(6,2),
  carbs_g NUMERIC(6,2),
  fat_g NUMERIC(6,2),
  fiber_g NUMERIC(6,2),
  vitamins JSONB,                   -- flexible: {"vitamin_c_mg": 12, ...}
  minerals JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.9 `diet_logs`
```sql
CREATE TABLE diet_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  source VARCHAR(20) CHECK (source IN ('manual','camera_ai','quick_add')),
  photo_url TEXT,                    -- present if camera_ai
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_diet_logs_user_date ON diet_logs(user_id, log_date);
```

### 2.10 `diet_log_items`
```sql
CREATE TABLE diet_log_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diet_log_id UUID REFERENCES diet_logs(id) ON DELETE CASCADE,
  food_id UUID REFERENCES foods(id),
  quantity_g NUMERIC(6,2),
  calories NUMERIC(6,2),
  protein_g NUMERIC(6,2),
  carbs_g NUMERIC(6,2),
  fat_g NUMERIC(6,2),
  ai_confidence NUMERIC(4,3)         -- if detected via camera_ai
);
```

### 2.11 `streaks`
```sql
CREATE TABLE streaks (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_completed_date DATE
);
```

### 2.12 `leaderboard_scores` (denormalized, recalculated periodically → mirrored into Redis sorted set)
```sql
CREATE TABLE leaderboard_scores (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  score NUMERIC(10,2) DEFAULT 0,
  weekly_score NUMERIC(10,2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.13 `achievements` & `user_achievements`
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE,          -- e.g. 'streak_7', 'streak_30'
  title VARCHAR(100),
  description TEXT,
  icon_url TEXT
);

CREATE TABLE user_achievements (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  earned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);
```

### 2.14 `follows` (optional social graph — supports "Friends" leaderboard filter)
```sql
CREATE TABLE follows (
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);
```

---

## 3. Redis Key Design

| Key Pattern | Purpose | TTL |
|---|---|---|
| `session:refresh:{userId}:{tokenId}` | valid refresh token registry (for revocation) | matches token expiry |
| `blacklist:{tokenId}` | revoked access tokens | until natural expiry |
| `ratelimit:{userId}:{route}` | sliding window counter | 1 min–1 hr window |
| `tasks:today:{userId}:{date}` | cached today's task list | 24h |
| `leaderboard:global` | sorted set (ZSET), score = points, member = userId | recalculated every 5–15 min |
| `leaderboard:weekly:{weekId}` | sorted set for weekly leaderboard | 7 days |
| `nutrition:lookup:{foodQueryHash}` | cache external nutrition API responses | 7 days |

---

## 4. Indexing & Performance Notes
- All `user_id + date` combos (tasks, diet_logs, body_metrics_logs) are composite-indexed — these are the most frequent query patterns (dashboard, history views).
- `foods` table acts as a growing cache of external nutrition lookups — avoids repeated external API calls for common items (reduces cost + latency).
- Leaderboard reads always hit Redis ZSET (`ZREVRANGE`), never PostgreSQL directly, for speed at scale — PostgreSQL `leaderboard_scores` is the durable backing store, recalculated into Redis.

---

## 5. Data Privacy Notes
- `user_profiles.public_fields` (JSONB) controls exactly what's visible on public profile queries — API layer must always filter based on this before returning another user's data.
- `diet_logs.photo_url` — original meal photos stored in Firebase Storage with signed, expiring URLs; not permanently public.
- Body metrics (`body_metrics_logs`, `current_weight_kg`) private by default — never exposed via public profile/search endpoints regardless of `public_fields`, unless explicitly whitelisted.
