import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

const MAX_SCORE = 5125
const VALID_CATEGORIES = ['Curioso', 'Praticante', 'Proficiente', 'Expert', 'Claude Code Master']

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nickname, score, correct_answers, category } = body

  if (
    typeof nickname !== 'string' || nickname.trim().length === 0 || nickname.length > 30 ||
    typeof score !== 'number' || score < 0 || score > MAX_SCORE ||
    typeof correct_answers !== 'number' || correct_answers < 0 || correct_answers > 20 ||
    !VALID_CATEGORIES.includes(category)
  ) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  const { data, error } = await getSupabase()
    .from('scores')
    .insert({ nickname, score, correct_answers, category, total_questions: 20 })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
