import type { Question, UserAnswer, QuizResults } from '@/types'

export const BASE_POINTS: Record<Question['level'], number> = {
  iniciante: 100,
  intermediario: 150,
  avancado: 200,
}

export function calcPoints(level: Question['level'], timeRemaining: number, correct: boolean): number {
  if (!correct) return 0
  return BASE_POINTS[level] + timeRemaining * 5
}

export function calcCategory(correctAnswers: number, total = 20): string {
  const pct = (correctAnswers / total) * 100
  if (pct >= 95) return 'Claude Code Master'
  if (pct >= 80) return 'Expert'
  if (pct >= 60) return 'Proficiente'
  if (pct >= 40) return 'Praticante'
  return 'Curioso'
}

export function calcResults(answers: UserAnswer[], questions: Question[]): QuizResults {
  const byLevel = {
    iniciante: { correct: 0, total: 0 },
    intermediario: { correct: 0, total: 0 },
    avancado: { correct: 0, total: 0 },
  }

  let totalScore = 0
  let correctAnswers = 0

  answers.forEach((ans, i) => {
    const q = questions[i]
    if (!q) return
    byLevel[q.level].total++
    if (ans.correct) {
      byLevel[q.level].correct++
      correctAnswers++
    }
    totalScore += ans.pointsEarned
  })

  return {
    totalScore,
    correctAnswers,
    category: calcCategory(correctAnswers),
    byLevel,
  }
}
