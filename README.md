# 🏋️ FitQuest

> **Your fitness. Your quests. Your progress.**

FitQuest is a full-stack fitness and wellness platform designed to help users build consistent healthy habits through personalized workouts, daily fitness quests, nutrition tracking, progress analytics, gamification, and AI-powered fitness assistance.

The platform combines **fitness tracking + nutrition + gamification + social interaction + AI-powered analysis** into a single ecosystem.

---

# 🧠 About FitQuest

FitQuest is a personalized fitness companion that helps users track and improve their daily health and fitness activities.

Instead of simply displaying workout plans or calorie information, FitQuest continuously evaluates a user's:

- Fitness goals
- Body measurements
- Workout history
- Exercise performance
- Nutrition
- Daily activity
- Quest completion
- Streaks
- Progress

and uses this information to provide a more personalized fitness experience.

The core idea is simple:

> **Turn fitness into a daily progression system.**

Users don't just follow a static workout plan.

They receive **daily quests**, complete activities, earn **XP**, maintain **streaks**, unlock **achievements**, improve their fitness level, and continuously track their progress.

---

# 🎯 Vision

The goal of FitQuest is to create a fitness ecosystem where users can:

```text
Understand their fitness
        ↓
Set realistic goals
        ↓
Receive personalized tasks
        ↓
Complete workouts
        ↓
Track nutrition
        ↓
Monitor progress
        ↓
Earn XP & achievements
        ↓
Build consistency
        ↓
Improve fitness
```


# ✨ Core Features

## 🔐 Authentication
Email/password authentication
Google authentication
Firebase Authentication
Email verification
Password recovery
Secure backend token verification
Protected routes
Session management
Logout

## 👤 User Profile
Users can maintain their fitness profile including:

Name
Username
Profile picture
Height
Weight
Fitness level
Fitness goal
Workout preference
Available equipment
Activity level
Diet preferences
Privacy settings

## 📊 Fitness Dashboard
The dashboard acts as the central control center for the user.

Users can view:

Today's quests
Completed quests
Remaining quests
Workout progress
Nutrition progress
Calories
Protein
Water intake
Current streak
XP
Fitness level
Weekly progress
Recent activity

Example:
┌─────────────────────────────────────┐
│ Good Morning, User 👋               │
│                                     │
│ Today's Progress                    │
│ ███████████████░░░░ 75%             │
│                                     │
│ Daily Quests                        │
│ ☑ Complete Workout                  │
│ ☑ Drink 2L Water                    │
│ ☐ 20 Push-ups                       │
│                                     │
│ 🔥 12 Day Streak                    │
│ ⭐ 2,450 XP                         │
└─────────────────────────────────────┘


## 🏃 Fitness Module
The Fitness section contains the user's complete workout ecosystem.

Includes
Daily quests
Workout plans
Exercise library
Exercise details
Workout sessions
Sets & reps tracking
Weight tracking
Workout duration
Workout history
Exercise progression
Personal records
Fitness analytics

# 🏋️ Exercise Categories
FitQuest supports different training environments and styles.

Home Workout
Bodyweight exercises
Minimal equipment workouts
Beginner routines
Full-body workouts
Gym
Machine workouts
Free-weight workouts
Strength training
Hypertrophy routines
Calisthenics
Push-ups
Pull-ups
Dips
Squats
Handstand progression
Core training
Skill progression
Cardio
Running
Walking
Cycling
HIIT
Endurance training
Mobility
Stretching
Flexibility
Warm-up
Recovery routines

## 🎮 Daily Quest System

The Daily Quest System is one of the core features of FitQuest.

Instead of giving every user the same tasks, FitQuest generates quests based on the user's:

Fitness level
Goal
Previous performance
Workout history
Activity
Nutrition
Quest completion rate
Recent progress

Example:
Today's Quests

```bash
🏋️ Complete today's workout
+50 XP

💪 20 Push-ups
+20 XP

💧 Drink 2L Water
+15 XP

🥗 Hit today's protein goal
+25 XP

```

## 🧠 Adaptive Quest Difficulty

Quest difficulty can dynamically change based on user performance.

Example:
```bash
Beginner
10 Push-ups
      ↓
Consistent completion
      ↓
Intermediate
20 Push-ups
      ↓
Consistent completion
      ↓
Advanced
30 Push-ups
```

🔥 Streak System

Consistency is tracked through streaks.

```bash
Example:

Day 1  🔥
Day 2  🔥
Day 3  🔥
Day 4  🔥
Day 5  🔥
...
```
Streaks can be based on meaningful daily activity such as:

> Completing a workout
> Completing daily quests
> Meeting minimum activity requirements

## 🥗 Nutrition & Diet

FitQuest provides a complete nutrition tracking system.

Users can track:

Calories
Protein
Carbohydrates
Fat
Fiber
Water
Meals
Snacks
Daily nutrition goals

## 🍽️ Meal Tracking

Users can add:

Breakfast
Lunch
Dinner
Snack

Flow:

```bash
Search Food
     ↓
Select Food
     ↓
Serving Size
     ↓
Quantity
     ↓
Nutrition Calculation
     ↓
Add Meal

```

## 📸 AI Exercise Tracking

FitQuest can also provide camera-based exercise tracking.

The system can use pose estimation to identify:

Body landmarks
Exercise type
Repetitions
Movement patterns
Possible form issues

## 👥 Social Features

FitQuest includes social functionality.

Users can:

Search users
View public profiles
View achievements
View fitness statistics
Compare progress
Participate in leaderboards


# Tech Stacks

## 📱 Mobile Application

The mobile application is built using:

React Native
TypeScript
Zustand
Firebase
Camera APIs
Vector Icons

## 🌐 Web Application

The web application provides a larger-screen experience for:

Dashboard
Fitness analytics
Nutrition
Progress
Profile
Social features
Leaderboards

The web application is built using:

React
TypeScript
Zustand
Firebase
LocalStorage
SessionStorage
Cookies
Vector Icons

## ⚙️ Backend

FitQuest uses a dedicated backend built with:

Node.js
Express
TypeScript
PostgreSQL
Redis
Firebase Admin
JWT
REST API

Backend responsibilities include:

Authentication verification
User management
Fitness data
Workout tracking
Quest generation
Nutrition tracking
XP
Achievements
Leaderboards
Notifications
AI integration
Authorization
Validation
Caching

# 🤝 Contributing

Contributions are welcome.

Before creating a pull request:

Create a feature branch.
Follow the existing project architecture.
Write TypeScript-safe code.
Add tests where appropriate.
Run linting.
Run type checking.
Verify the feature locally.
Create a clear pull request description.

Example:
```bash 

git checkout -b feature/workout-tracking

Commit:

git commit -m "feat: add workout tracking"

Push:

git push origin feature/workout-tracking

```
