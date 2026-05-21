# 🧬 Relational Blueprint (Core Engine)

A non-profit, clinically grounded, dual-blind psychological assessment platform designed for arranged marriage compatibility.

## 📌 The Mission

Most modern matchmaking apps optimize for user retention and quick swiping. Relational Blueprint is fundamentally different. Designed specifically for the arranged marriage context, this platform acts as a "costly signal" assessment. It requires a 1-to-2-hour commitment from users to complete a rigorously structured 265-item psychometric battery based on public-domain psychological instruments.

Our goal is not to maximize user bases, but to maximize human benefit by preventing toxic pairings and highlighting deep, foundational alignment.

## 🚀 Features

- **Dual-Blind Consent Architecture:** Privacy-first matching. Users take the assessment independently and must explicitly accept a username-based request before any psychological data is compared or shared.
- **7 Clinical Instruments (265 items):** IPIP-NEO, ECR-R, Short Dark Triad, TEIQue-SF, Brief COPE, NFC-18, and Custom Dealbreakers.
- **Non-Compensatory Hard Gates:** Automatically filters out pairings with incompatible dealbreakers (e.g., family planning, in-law dynamics, religion).
- **Euclidean Distance Algorithm:** Calculates personality and emotional synergy using multidimensional distance metrics across 18 trait dimensions.
- **Risk Matrix Penalty:** Backend logic that mathematically penalizes potentially abusive combinations (e.g., Anxious-Avoidant traps, high Dark Triad traits, EQ asymmetry).
- **Visual Match Dashboard:** Generates a comprehensive "Relational Blueprint" using Radar Charts to map synergies and friction points.
- **Auto-Save Assessment:** Progress saves to localStorage — users can close and resume anytime.
- **Server-Side Scoring:** Trait computation happens server-side for data integrity.

## 🧪 Psychometric Battery (265 Items)

| # | Instrument | Items | Measures |
|---|-----------|-------|----------|
| 1 | IPIP-NEO 120 | 120 | Big Five × 30 facets (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) |
| 2 | ECR-R | 36 | Attachment Anxiety & Avoidance |
| 3 | Short Dark Triad (SD3) | 27 | Machiavellianism, Narcissism, Psychopathy |
| 4 | TEIQue-SF | 30 | Well-being, Self-Control, Emotionality, Sociability |
| 5 | Brief COPE | 14 | Active Coping, Avoidant Coping, Support-Seeking |
| 6 | NFC-18 | 18 | Need for Cognition (Intellectual Match) |
| 7 | Custom Dealbreakers | 20 | Family, Finance, In-laws, Lifestyle, Religion |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (Pages Router), React, Tailwind CSS |
| Backend | Next.js API Routes (Serverless Functions) |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| Data Visualization | Recharts (Radar Charts) |
| Hosting / CI-CD | Netlify |

## 🗄️ Database Schema (Supabase)

- **users** — Unique usernames tied to Supabase Auth (UUID primary key).
- **psych_profiles** — Stores `raw_answers`, `trait_scores`, and `dealbreaker_answers` as JSONB.
- **match_requests** — Dual-blind invite system (`sender_username`, `receiver_username`, `status`, `match_result`).

## 🧮 The Matching Algorithm

The core logic resides in `lib/scoring.ts`.

### Scoring Weights
| Category | Weight |
|----------|--------|
| Personality (Big Five) | 25% |
| Emotional Intelligence (TEIQue) | 25% |
| Values Alignment | 20% |
| Intellectual Match (NFC) | 15% |
| Coping Compatibility | 15% |

### Pipeline
1. **Hard Gates** — Non-compensatory dealbreaker check. Incompatible = 0%.
2. **Euclidean Proximity** — Multidimensional distance across 18 trait dimensions.
3. **Risk Matrix Penalty** — Up to -55% for toxic combinations:
   - Anxious × Avoidant attachment (-20%)
   - Fearful-avoidant attachment (-10%)
   - High Dark Triad (-15% to -25%)
   - EQ asymmetry (-10%)
   - Neuroticism × Low Agreeableness (-10%)
   - Coping mismatch (-5%)
   - Low self-control + psychopathy (-15%)
4. **Output** — Overall %, category scores, dimension breakdown, synergies, friction points, risk warnings.

## ⚙️ Local Development Setup

```bash
git clone https://github.com/Feriwala787/match.vaivahikam.in.git
cd match.vaivahikam.in
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev
```

## 🌐 Deployment (Netlify)

Environment variables required on Netlify:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ⚖️ License & Ethics

This project is built strictly for non-profit, altruistic purposes. It utilizes public-domain items from the International Personality Item Pool (IPIP), ECR-R, Brief COPE, and NFC scales. This platform does not provide medical diagnoses and should not replace professional premarital counseling.

Contributions to improve the algorithm, UI, or accessibility are welcome.
