export interface Question {
  id: number
  level: 'iniciante' | 'intermediario' | 'avancado'
  statement: string
  answer: boolean
  explanation: string
}

export interface UserAnswer {
  questionId: number
  userAnswer: boolean | null
  correct: boolean
  pointsEarned: number
  timeRemaining: number
}

export interface QuizState {
  questions: Question[]
  currentIndex: number
  answers: UserAnswer[]
  totalScore: number
  status: 'idle' | 'running' | 'finished'
}

export interface ScoreEntry {
  id: string
  nickname: string
  score: number
  total_questions: number
  correct_answers: number
  category: string
  created_at: string
}

export interface QuizResults {
  totalScore: number
  correctAnswers: number
  category: string
  byLevel: {
    iniciante: { correct: number; total: number }
    intermediario: { correct: number; total: number }
    avancado: { correct: number; total: number }
  }
}
