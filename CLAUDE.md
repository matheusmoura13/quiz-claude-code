# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Claude Code Quiz** — a gamified true/false web quiz testing knowledge of Claude Code. Written in Portuguese (pt-BR). No user authentication; players identify by nickname only.

This is a greenfield project. The full specification lives in `prd.md`.

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL) for leaderboard persistence
- **Vercel** for deployment
- Questions served from a local JSON file (`/data/questions.json`)

## Commands

```bash
npm run dev      # start local dev server
npm run build    # production build
npm run lint     # ESLint
npm start        # production server
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Architecture

### Folder structure

```
app/
  page.tsx                    # Landing page + leaderboard preview
  quiz/page.tsx               # Quiz screen
  result/page.tsx             # Result + full question review
  api/scores/route.ts         # GET top 20 scores
  api/scores/submit/route.ts  # POST new score
components/
  QuizCard.tsx                # Current question card
  Timer.tsx                   # Countdown (bar + number)
  ProgressBar.tsx
  LevelBadge.tsx              # Iniciante / Intermediário / Avançado
  ResultSummary.tsx
  ReviewList.tsx              # All 20 questions with explanations
  Leaderboard.tsx
data/
  questions.json              # Question bank (min 30, recommended 45–50)
lib/
  supabase.ts                 # Supabase client
  quiz.ts                     # Question selection & shuffling logic
  scoring.ts                  # Score calculation & category assignment
types/
  index.ts                    # Shared TypeScript interfaces
```

### Quiz state (local, no persistence between sessions)

```typescript
interface QuizState {
  questions: Question[]        // 20 selected questions
  currentIndex: number         // 0–19
  answers: UserAnswer[]
  totalScore: number
  status: 'idle' | 'running' | 'finished'
}

interface UserAnswer {
  questionId: number
  userAnswer: boolean | null   // null = timeout
  correct: boolean
  pointsEarned: number
  timeRemaining: number
}
```

### Question bank format (`/data/questions.json`)

```typescript
interface Question {
  id: number
  level: 'iniciante' | 'intermediario' | 'avancado'
  statement: string   // the true/false claim
  answer: boolean
  explanation: string // shown on result screen
}
```

### Scoring rules

- **Base points:** Iniciante 100 | Intermediário 150 | Avançado 200
- **Speed bonus:** `remaining_seconds × 5`
- Timeout or wrong answer = 0 pts (no negative penalty)
- Max possible score: 5,125 pts

### Session question selection

20 questions per session, drawn randomly from the bank:
- 8 Iniciante (30 s timer)
- 7 Intermediário (20 s timer)
- 5 Avançado (15 s timer)

Questions are presented in strict difficulty order (easiest first).

### User categories (shown on result screen)

| Accuracy | Category |
|---|---|
| 0–39% | Curioso |
| 40–59% | Praticante |
| 60–79% | Proficiente |
| 80–94% | Expert |
| 95–100% | Claude Code Master |

### Supabase schema

```sql
CREATE TABLE scores (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname        text NOT NULL,
  score           integer NOT NULL,
  total_questions integer NOT NULL DEFAULT 20,
  correct_answers integer NOT NULL,
  category        text NOT NULL,
  created_at      timestamptz DEFAULT now()
);
CREATE INDEX idx_scores_score ON scores(score DESC);
```

Row Level Security: public INSERT and SELECT only (no auth).

### API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/scores` | Top 20 scores ordered by score DESC |
| POST | `/api/scores/submit` | Save a completed quiz score |

POST payload: `{ nickname, score, correct_answers, category }`

## Design Constraints

- Dark background (`#0F0F0F`), Anthropic orange accent (`#F59E0B`)
- Correct feedback: green (`#22C55E`), wrong: red (`#EF4444`)
- Font: Inter or Geist (Next.js default)
- Mobile-first, fully responsive
- Timer bar color transitions green → yellow → red as time runs out
- 1-second feedback delay before auto-advancing to next question

## Out of Scope (v1)

OAuth/email auth, multiplayer, i18n, admin panel, badges/achievements.
