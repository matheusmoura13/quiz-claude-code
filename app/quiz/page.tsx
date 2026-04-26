'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Question, UserAnswer } from '@/types'
import { TIMER_BY_LEVEL } from '@/lib/quiz'
import { calcPoints } from '@/lib/scoring'
import QuizCard from '@/components/QuizCard'

export default function QuizPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const [timerKey, setTimerKey] = useState(0)
  const [nickname, setNickname] = useState('')

  const answersRef = useRef<UserAnswer[]>([])
  const scoreRef = useRef(0)
  const questionStartRef = useRef(Date.now())
  const advancingRef = useRef(false)
  const currentIndexRef = useRef(0)
  const questionsRef = useRef<Question[]>([])

  useEffect(() => {
    const qs = sessionStorage.getItem('quiz_questions')
    const nick = sessionStorage.getItem('quiz_nickname')
    if (!qs || !nick) { router.replace('/'); return }
    try {
      const parsed: Question[] = JSON.parse(qs)
      questionsRef.current = parsed
      setQuestions(parsed)
      setNickname(nick)
      questionStartRef.current = Date.now()
    } catch {
      router.replace('/')
    }
  }, [router])

  const advance = useCallback((nextIndex: number) => {
    const total = questionsRef.current.length
    if (nextIndex >= total) {
      sessionStorage.setItem('quiz_answers', JSON.stringify(answersRef.current))
      router.push('/result')
      return
    }
    currentIndexRef.current = nextIndex
    setCurrentIndex(nextIndex)
    setFeedback(null)
    setTimerKey((k) => k + 1)
    questionStartRef.current = Date.now()
    advancingRef.current = false
  }, [router])

  const handleAnswer = useCallback((userAnswer: boolean | null) => {
    if (advancingRef.current) return
    advancingRef.current = true

    const idx = currentIndexRef.current
    const q = questionsRef.current[idx]
    if (!q) return

    const maxSeconds = TIMER_BY_LEVEL[q.level]
    const elapsed = Math.min(maxSeconds, Math.floor((Date.now() - questionStartRef.current) / 1000))
    const timeRemaining = userAnswer !== null ? Math.max(0, maxSeconds - elapsed) : 0
    const correct = userAnswer === q.answer
    const pointsEarned = calcPoints(q.level, timeRemaining, correct)

    const answer: UserAnswer = { questionId: q.id, userAnswer, correct, pointsEarned, timeRemaining }
    answersRef.current = [...answersRef.current, answer]
    scoreRef.current += pointsEarned

    setTotalScore(scoreRef.current)
    setFeedback(correct)

    setTimeout(() => advance(idx + 1), 1000)
  }, [advance])

  const handleTimerExpire = useCallback(() => handleAnswer(null), [handleAnswer])

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const q = questions[currentIndex]

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-500 text-sm">
            Olá, <span className="text-brand font-semibold">{nickname}</span>
          </span>
          <span className="text-gray-500 text-sm font-mono">
            {totalScore.toLocaleString('pt-BR')} pts
          </span>
        </div>

        <QuizCard
          question={q}
          currentIndex={currentIndex}
          total={questions.length}
          feedback={feedback}
          onAnswer={handleAnswer}
          onTimerExpire={handleTimerExpire}
          timerKey={timerKey}
        />
      </div>
    </div>
  )
}
