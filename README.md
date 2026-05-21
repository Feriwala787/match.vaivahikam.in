# 🧬 Relational Blueprint (Core Engine)

A non-profit, clinically grounded, dual-blind psychological assessment platform designed for arranged marriage compatibility.

## 📌 The Mission

Most modern matchmaking apps optimize for user retention and quick swiping. Relational Blueprint is fundamentally different. Designed specifically for the arranged marriage context, this platform acts as a "costly signal" assessment. It requires a 1-to-2-hour commitment from users to complete a rigorously structured 200+ item psychometric battery based on public-domain psychological instruments.

Our goal is not to maximize user bases, but to maximize human benefit by preventing toxic pairings and highlighting deep, foundational alignment.

## 🚀 Features

- **Dual-Blind Consent Architecture:** Privacy-first matching. Users take the assessment independently and must explicitly accept a username-based request before any psychological data is compared or shared.
- **Open-Source Psychometrics:** Utilizes the IPIP-NEO (Big Five), ECR-R (Attachment), D-Core (Dark Traits), and World Values Survey items.
- **Non-Compensatory Hard Gates:** Automatically filters out pairings with incompatible dealbreakers (e.g., family planning, in-law dynamics).
- **Euclidean Distance Algorithm:** Calculates personality and emotional synergy using multidimensional distance metrics.
- **Risk Matrix Penalty:** Backend logic that mathematically penalizes potentially abusive combinations (e.g., Anxious-Avoidant traps, high Dark Triad traits).
- **Visual Match Dashboard:** Generates a comprehensive "Relational Blueprint" using Radar Charts to map synergies and friction points.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (Pages Router), React, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes (Serverless Functions) |
| Database & Auth | Supabase (PostgreSQL) |
| Data Visualization | Recharts |
| Hosting / CI-CD | Netlify |

## 🗄️ Database Schema Overview (Supabase)

- **users** - Manages unique usernames and ties into Supabase Auth.
- **psych_profiles** - Stores `raw_answers` (JSONB) and `trait_scores` (JSONB) to manage the massive 200-question dataset efficiently.
- **match_requests** - Handles the dual-blind invite system (`sender_username`, `receiver_username`, `status`).

## ⚙️ Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/relational-blueprint.git
cd relational-blueprint
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧮 The Matching Algorithm (Brief)

The core logic resides in `/pages/api/calculate-match.ts`.

1. **Validation:** Checks if dealbreakers align. If false, compatibility = 0%.
2. **Proximity:** Calculates the Euclidean distance for continuous variables (Big Five, EQ).
3. **Penalty:** Applies percentage deductions based on the Risk Matrix (Toxicity & Attachment Clashes).
4. **Output:** Returns a compiled JSON object mapping the exact friction points and synergies for the frontend dashboard.

## ⚖️ License & Ethics

This project is built strictly for non-profit, altruistic purposes. It utilizes public-domain items from the International Personality Item Pool (IPIP). This platform does not provide medical diagnoses and should not replace professional premarital counseling.

Contributions to improve the algorithm, UI, or accessibility are welcome.
