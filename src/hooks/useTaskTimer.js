import { useEffect, useState } from 'react'

const TIMER_DURATIONS = {
  light: 7 * 60, // 7 dakika
  medium: 15 * 60, // 15 dakika
  deep: 30 * 60, // 30 dakika
}

export function useTaskTimer(taskLevel) {
  const duration = TIMER_DURATIONS[taskLevel] || 7 * 60
  const [remaining, setRemaining] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const id = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(id)
  }, [isRunning])

  const start = () => {
    setRemaining(duration)
    setIsRunning(true)
  }

  const pause = () => setIsRunning(false)
  const reset = () => {
    setIsRunning(false)
    setRemaining(duration)
  }

  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0')
  const seconds = String(remaining % 60).padStart(2, '0')

  return {
    remaining,
    isRunning,
    minutes,
    seconds,
    start,
    pause,
    reset,
    duration,
  }
}
