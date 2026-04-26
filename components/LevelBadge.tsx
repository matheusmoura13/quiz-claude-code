import type { Question } from '@/types'

const LABEL: Record<Question['level'], string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

const COLOR: Record<Question['level'], string> = {
  iniciante: 'bg-green-900/40 text-green-400 border-green-700',
  intermediario: 'bg-yellow-900/40 text-yellow-400 border-yellow-700',
  avancado: 'bg-red-900/40 text-red-400 border-red-700',
}

export default function LevelBadge({ level }: { level: Question['level'] }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${COLOR[level]}`}>
      {LABEL[level]}
    </span>
  )
}
