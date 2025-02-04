# Vercel

# Gamified Referral System

A Next.js application with Supabase integration that creates an engaging referral system through gamification.

## Overview

This project implements a gamified referral system where users can:

- Sign up with their email
- Earn points and rewards for referring friends
- Track their referral progress
- Compete on leaderboards
- Unlock achievements through engagement

## Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Database/Auth**: Supabase
- **Styling**: TailwindCSS
- **Package Manager**: Bun

## Features

- Magic link email authentication
- Real-time referral tracking
- Point-based reward system
- Interactive leaderboards
- Achievement system
- Email notifications

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/devcoinv0/v0-landing.git
cd v0-landing
```

2. Install dependencies:

```bash
bun install
```

3. Set up Supabase:

- Create a new Supabase project
- Get your Supabase URL and anon key

```bash
cp .env.example .env
```

4. Run the development server:

```bash
bun dev
```

Open your browser and navigate to `http://localhost:3000` to see the app in action.
