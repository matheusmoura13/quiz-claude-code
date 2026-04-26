import type { QuizResults } from '@/types'

export default function ResultSummary({ results }: { results: QuizResults }) {
  const { totalScore, correctAnswers, category, byLevel } = results

  return (
    <div className="text-center space-y-6">
      <div>
        <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Pontuação</p>
        <p className="text-6xl font-black text-brand">{totalScore.toLocaleString('pt-BR')}</p>
        <p className="text-gray-400 mt-1">{correctAnswers} de 20 acertos</p>
      </div>

      <div className="inline-block bg-white/5 border border-white/10 rounded-2xl px-8 py-4">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Categoria</p>
        <p className="text-2xl font-bold text-white">{category}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <LevelStat label="Iniciante" data={byLevel.iniciante} color="text-green-400" />
        <LevelStat label="Intermediário" data={byLevel.intermediario} color="text-yellow-400" />
        <LevelStat label="Avançado" data={byLevel.avancado} color="text-red-400" />
      </div>
    </div>
  )
}

function LevelStat({
  label,
  data,
  color,
}: {
  label: string
  data: { correct: number; total: number }
  color: string
}) {
  return (
    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
      <p className={`font-bold text-lg ${color}`}>
        {data.correct}/{data.total}
      </p>
      <p className="text-gray-400 text-xs mt-0.5">{label}</p>
    </div>
  )
}
