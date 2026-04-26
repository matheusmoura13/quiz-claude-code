'use client'

import { useEffect, useState } from 'react'

interface TimerProps {
  seconds: number
  maxSeconds: number
  onExpire: () => void
  paused?: boolean
}

export default function Timer({ seconds, maxSeconds, onExpire, paused = false }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    setRemaining(seconds)
  }, [seconds, maxSeconds])

  useEffect(() => {
    if (paused) return
    if (remaining <= 0) {
      onExpire()
      return
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(id)
  }, [remaining, paused, onExpire])

  const pct = (remaining / maxSeconds) * 100
  const barColor = pct > 50 ? 'bg-green-500' : pct > 25 ? 'bg-yellow-500' : 'bg-red-500'
  const textColor = pct > 50 ? 'text-green-400' : pct > 25 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="w-full">
      <div className={`text-right text-sm font-mono font-bold mb-1 ${textColor}`}>
        {remaining}s
      </div>
      <div className="h-2 bg-neutral rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 rounded-full ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
