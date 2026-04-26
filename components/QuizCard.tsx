'use client'

import type { Question } from '@/types'
import LevelBadge from './LevelBadge'
import ProgressBar from './ProgressBar'
import Timer from './Timer'
import { TIMER_BY_LEVEL } from '@/lib/quiz'

interface QuizCardProps {
  question: Question
  currentIndex: number
  total: number
  feedback: boolean | null
  onAnswer: (answer: boolean) => void
  onTimerExpire: () => void
  timerKey: number
}

export default function QuizCard({
  question,
  currentIndex,
  total,
  feedback,
  onAnswer,
  onTimerExpire,
  timerKey,
}: QuizCardProps) {
  const maxSeconds = TIMER_BY_LEVEL[question.level]
  const answered = feedback !== null

  const feedbackBg =
    feedback === true
      ? 'border-correct bg-correct/10'
      : feedback === false
      ? 'border-wrong bg-wrong/10'
      : 'border-neutral bg-white/5'

  return (
    <div className={`rounded-2xl border-2 p-6 md:p-8 transition-colors duration-300 ${feedbackBg}`}>
      <div className="flex items-center justify-between mb-4">
        <LevelBadge level={question.level} />
        {answered ? (
          <span className={`text-lg font-bold ${feedback ? 'text-correct' : 'text-wrong'}`}>
            {feedback ? '✓ Correto!' : '✗ Errado'}
          </span>
        ) : null}
      </div>

      <div className="mb-6">
        <ProgressBar current={currentIndex + 1} total={total} />
      </div>

      <p className="text-lg md:text-xl font-medium text-white leading-relaxed mb-8">
        {question.statement}
      </p>

      <div className="mb-6">
        <Timer
          key={timerKey}
          seconds={maxSeconds}
          maxSeconds={maxSeconds}
          onExpire={onTimerExpire}
          paused={answered}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => !answered && onAnswer(true)}
          disabled={answered}
          className="py-4 rounded-xl font-bold text-lg border-2 border-correct text-correct hover:bg-correct/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Verdadeiro
        </button>
        <button
          onClick={() => !answered && onAnswer(false)}
          disabled={answered}
          className="py-4 rounded-xl font-bold text-lg border-2 border-wrong text-wrong hover:bg-wrong/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Falso
        </button>
      </div>
    </div>
  )
}
