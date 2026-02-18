import { useEffect, useState } from 'react'

const FOCUS_SECONDS = 25 * 60
const BREAK_SECONDS = 5 * 60

export function usePomodoro(initialPhase = 'focus') {
  const [phase, setPhase] = useState(initialPhase) // 'focus' | 'break'
  const [remaining, setRemaining] = useState(
    initialPhase === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS,
  )
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const id = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          const nextPhase = phase === 'focus' ? 'break' : 'focus'
          setPhase(nextPhase)
          return nextPhase === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(id)
  }, [isRunning, phase])

  const start = () => setIsRunning(true)
  const pause = () => setIsRunning(false)
  const reset = () => {
    setIsRunning(false)
    setPhase('focus')
    setRemaining(FOCUS_SECONDS)
  }

  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0')
  const seconds = String(remaining % 60).padStart(2, '0')

  return {
    phase,
    remaining,
    isRunning,
    minutes,
    seconds,
    start,
    pause,
    reset,
  }
}

