import type { Question, UserAnswer } from '@/types'
import LevelBadge from './LevelBadge'

interface ReviewListProps {
  questions: Question[]
  answers: UserAnswer[]
}

export default function ReviewList({ questions, answers }: ReviewListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Revisão Completa</h2>
      {questions.map((q, i) => {
        const ans = answers[i]
        const isCorrect = ans?.correct
        const userAnswerText =
          ans?.userAnswer === null
            ? 'Tempo esgotado'
            : ans?.userAnswer
            ? 'Verdadeiro'
            : 'Falso'

        return (
          <div
            key={q.id}
            className={`rounded-xl border p-4 ${
              isCorrect ? 'border-correct/40 bg-correct/5' : 'border-wrong/40 bg-wrong/5'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-xs text-gray-500 font-mono mt-0.5">#{i + 1}</span>
              <LevelBadge level={q.level} />
              <span className={`ml-auto text-sm font-bold ${isCorrect ? 'text-correct' : 'text-wrong'}`}>
                {isCorrect ? '✓' : '✗'} {ans?.pointsEarned} pts
              </span>
            </div>

            <p className="text-white text-sm font-medium mb-3">{q.statement}</p>

            <div className="flex gap-4 text-xs mb-3">
              <span className="text-gray-400">
                Sua resposta:{' '}
                <span className={isCorrect ? 'text-correct' : 'text-wrong'}>{userAnswerText}</span>
              </span>
              <span className="text-gray-400">
                Resposta correta:{' '}
                <span className="text-white">{q.answer ? 'Verdadeiro' : 'Falso'}</span>
              </span>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed border-t border-white/5 pt-3">
              {q.explanation}
            </p>
          </div>
        )
      })}
    </div>
  )
}
