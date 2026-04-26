import { Suspense } from 'react'
import LandingClient from './LandingClient'
import { getSupabase } from '@/lib/supabase'
import type { ScoreEntry } from '@/types'

async function getTopScores(): Promise<ScoreEntry[]> {
  try {
    const { data } = await getSupabase()
      .from('scores')
      .select('id, nickname, score, total_questions, correct_answers, category, created_at')
      .order('score', { ascending: false })
      .limit(5)
    return data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const topScores = await getTopScores()
  return (
    <Suspense>
      <LandingClient topScores={topScores} />
    </Suspense>
  )
}
