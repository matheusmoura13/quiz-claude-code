import type { Question } from '@/types'

export const TIMER_BY_LEVEL: Record<Question['level'], number> = {
  iniciante: 30,
  intermediario: 20,
  avancado: 15,
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

export function selectQuestions(bank: Question[]): Question[] {
  const byLevel = {
    iniciante: bank.filter((q) => q.level === 'iniciante'),
    intermediario: bank.filter((q) => q.level === 'intermediario'),
    avancado: bank.filter((q) => q.level === 'avancado'),
  }

  if (byLevel.iniciante.length < 8 || byLevel.intermediario.length < 7 || byLevel.avancado.length < 5) {
    throw new Error('Banco de questões insuficiente para montar uma sessão completa')
  }

  return [
    ...pick(byLevel.iniciante, 8),
    ...pick(byLevel.intermediario, 7),
    ...pick(byLevel.avancado, 5),
  ]
}
