'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { selectQuestions } from '@/lib/quiz'
import Leaderboard from '@/components/Leaderboard'
import type { ScoreEntry } from '@/types'
import questionsBank from '@/data/questions.json'
import type { Question } from '@/types'

export default function LandingClient({ topScores }: { topScores: ScoreEntry[] }) {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')

  function handleStart() {
    const trimmed = nickname.trim()
    if (!trimmed) { setError('Digite um apelido para continuar.'); return }
    if (trimmed.length > 30) { setError('Apelido deve ter no máximo 30 caracteres.'); return }

    const questions = selectQuestions(questionsBank as Question[])
    sessionStorage.setItem('quiz_questions', JSON.stringify(questions))
    sessionStorage.setItem('quiz_nickname', trimmed)
    router.push('/quiz')
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3">
            Claude Code <span className="text-brand">Quiz</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Quanto você realmente sabe sobre o Claude Code?
          </p>
        </div>

        {/* Rules */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-sm text-gray-300 space-y-2">
          <p className="font-semibold text-white mb-3">Como funciona</p>
          <p>• 20 perguntas de Verdadeiro ou Falso, do mais fácil ao mais difícil</p>
          <p>• Cada questão tem um timer — quanto mais rápido, mais pontos</p>
          <p>• Ao final, veja sua pontuação, categoria e revise todas as respostas</p>
          <p>• Seu score vai para o leaderboard público</p>
        </div>

        {/* Nickname input */}
        <div className="mb-4">
          <input
            type="text"
            value={nickname}
            onChange={(e) => { setNickname(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="Seu apelido (nickname)"
            maxLength={30}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
          />
          {error && <p className="text-wrong text-sm mt-1.5">{error}</p>}
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 rounded-xl font-bold text-lg bg-brand text-black hover:bg-brand/90 transition-colors mb-10"
        >
          Iniciar Quiz
        </button>

        {/* Leaderboard preview */}
        {topScores.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="text-white font-bold mb-4">Top 5 — Leaderboard</h2>
            <Leaderboard scores={topScores} />
          </div>
        )}
      </div>
    </div>
  )
}
