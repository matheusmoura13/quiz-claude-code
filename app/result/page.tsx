'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Question, UserAnswer, QuizResults } from '@/types'
import { calcResults } from '@/lib/scoring'
import ResultSummary from '@/components/ResultSummary'
import ReviewList from '@/components/ReviewList'
import Leaderboard from '@/components/Leaderboard'
import type { ScoreEntry } from '@/types'

type View = 'result' | 'leaderboard'

export default function ResultPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<UserAnswer[]>([])
  const [results, setResults] = useState<QuizResults | null>(null)
  const [nickname, setNickname] = useState('')
  const [view, setView] = useState<View>('result')
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [submitError, setSubmitError] = useState(false)
  const submittedRef = useRef(false)

  useEffect(() => {
    const qs = sessionStorage.getItem('quiz_questions')
    const ans = sessionStorage.getItem('quiz_answers')
    const nick = sessionStorage.getItem('quiz_nickname')
    if (!qs || !ans || !nick) { router.replace('/'); return }

    let parsedQuestions: Question[]
    let parsedAnswers: UserAnswer[]
    try {
      parsedQuestions = JSON.parse(qs)
      parsedAnswers = JSON.parse(ans)
    } catch {
      router.replace('/')
      return
    }
    const computedResults = calcResults(parsedAnswers, parsedQuestions)

    setQuestions(parsedQuestions)
    setAnswers(parsedAnswers)
    setResults(computedResults)
    setNickname(nick)

    if (submittedRef.current) return
    submittedRef.current = true

    fetch('/api/scores/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname: nick,
        score: computedResults.totalScore,
        correct_answers: computedResults.correctAnswers,
        category: computedResults.category,
      }),
    }).then((res) => {
      if (!res.ok) setSubmitError(true)
      return fetch('/api/scores')
        .then((r) => r.json())
        .then(setScores)
        .catch(() => {})
    }).catch(() => setSubmitError(true))
  }, [router])

  function handlePlayAgain() {
    sessionStorage.removeItem('quiz_questions')
    sessionStorage.removeItem('quiz_answers')
    sessionStorage.removeItem('quiz_nickname')
    router.push('/')
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-white text-center mb-8">
          Quiz <span className="text-brand">Concluído!</span>
        </h1>

        {submitError && (
          <div className="mb-4 px-4 py-3 rounded-xl border border-wrong/40 bg-wrong/10 text-wrong text-sm text-center">
            Não foi possível salvar sua pontuação. Verifique sua conexão.
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <ResultSummary results={results} />
        </div>

        <div className="flex gap-3 mb-8">
          <button
            onClick={handlePlayAgain}
            className="flex-1 py-3 rounded-xl font-bold border-2 border-brand text-brand hover:bg-brand/10 transition-colors"
          >
            Jogar Novamente
          </button>
          <button
            onClick={() => setView(view === 'result' ? 'leaderboard' : 'result')}
            className="flex-1 py-3 rounded-xl font-bold bg-brand text-black hover:bg-brand/90 transition-colors"
          >
            {view === 'result' ? 'Ver Leaderboard' : 'Ver Revisão'}
          </button>
        </div>

        {view === 'leaderboard' ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Ranking Global</h2>
            <Leaderboard scores={scores} currentNickname={nickname} />
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <ReviewList questions={questions} answers={answers} />
          </div>
        )}
      </div>
    </div>
  )
}
