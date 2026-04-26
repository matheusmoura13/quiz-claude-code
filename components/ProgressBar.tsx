export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Pergunta {current} de {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-neutral rounded-full overflow-hidden">
        <div
          className="h-full bg-brand transition-all duration-300 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
