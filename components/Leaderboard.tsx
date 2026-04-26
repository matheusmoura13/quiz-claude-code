import type { ScoreEntry } from '@/types'

interface LeaderboardProps {
  scores: ScoreEntry[]
  currentNickname?: string
  limit?: number
}

export default function Leaderboard({ scores, currentNickname, limit }: LeaderboardProps) {
  const displayed = limit ? scores.slice(0, limit) : scores

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-white/10 text-left">
            <th className="pb-2 pr-3 w-8">#</th>
            <th className="pb-2 pr-3">Nickname</th>
            <th className="pb-2 pr-3 text-right">Pontuação</th>
            <th className="pb-2 pr-3 hidden sm:table-cell">Categoria</th>
            <th className="pb-2 hidden md:table-cell">Data</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((entry, i) => {
            const isCurrentUser =
              currentNickname && entry.nickname.toLowerCase() === currentNickname.toLowerCase()
            return (
              <tr
                key={entry.id}
                className={`border-b border-white/5 ${
                  isCurrentUser ? 'bg-brand/10 text-brand font-bold' : 'text-gray-200'
                }`}
              >
                <td className="py-2.5 pr-3 text-gray-500 font-mono">{i + 1}</td>
                <td className="py-2.5 pr-3 max-w-[120px] truncate">{entry.nickname}</td>
                <td className="py-2.5 pr-3 text-right font-mono">
                  {entry.score.toLocaleString('pt-BR')}
                </td>
                <td className="py-2.5 pr-3 text-gray-400 hidden sm:table-cell">{entry.category}</td>
                <td className="py-2.5 text-gray-500 hidden md:table-cell">
                  {new Date(entry.created_at).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            )
          })}
          {displayed.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-500">
                Nenhum resultado ainda. Seja o primeiro!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
