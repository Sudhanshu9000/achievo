# Achievo: Goal-Based Gamified Productivity App

## Overview
Achievo is a gamified goal-tracking web application designed to help users achieve their personal goals through structured task management and gamification elements.

## Core Features
1. **Goal Selection**: Users can choose from various goal categories such as Fitness, Study, or Entrepreneurship.
2. **Daily Task System**: AI-powered task assignment via Groq, with points and level boosts upon completion.
3. **Monthly Big Challenge**: High-difficulty tasks related to the user's chosen goal, offering substantial rewards.
4. **Leveling System**: Users start at Level 1 and earn points for completing tasks, advancing through levels.
5. **Alert System**: ScreenPipe monitors user activity, alerts are sent if no task is detected, helping users stay focused.

## UI/UX Design Principles
- **Simple**: Focuses on daily actions and user engagement.
- **Accessible**: Web-based interface for ease of access.

## Tech Stack
### Frontend + Backend
- **Next.js**: React framework for frontend development.
- **Tailwind CSS**: Utility-first CSS framework for styling.
### AI/ML Integration
- **Groq**: AI for task generation and real-time updates.
### Productivity Data Capture
- **ScreenPipe**: Local tracking of screen time during tasks, ensures privacy and data security.

## User Flow (Simplified)
1. User signs up and selects a goal category.
2. Groq generates daily tasks based on the chosen goal.
3. Completion of tasks awards XP, levels up the user, and earns rewards and points.
4. Monthly challenges provide high-reward tasks with deadline countdowns.
5. ScreenPipe ensures privacy by tracking locally and sending alerts if focus is lost.

## Security & Privacy
- **ScreenPipe**: Local data tracking to prevent cloud data leaks.
- **Encryption**: User data is encrypted and securely stored.

