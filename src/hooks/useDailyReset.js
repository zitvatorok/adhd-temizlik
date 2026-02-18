import { useEffect } from 'react'

function getTodayKey() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function getWeekKey() {
  const d = new Date()
  const firstJan = new Date(d.getFullYear(), 0, 1)
  const pastDays = Math.floor((d - firstJan) / 86400000)
  const week = Math.floor((pastDays + firstJan.getDay()) / 7)
  return `${d.getFullYear()}-W${week}`
}

export function useDailyReset(state, setState) {
  useEffect(() => {
    const today = getTodayKey()
    const week = getWeekKey()

    setState((prev) => {
      if (!prev) return prev
      const next = { ...prev }

      if (next.routines?.lastDailyReset !== today) {
        next.routines = {
          ...next.routines,
          lastDailyReset: today,
          daily: next.routines.daily.map((t) => ({ ...t, done: false })),
        }
      }

      if (next.routines?.lastWeeklyReset !== week) {
        next.routines = {
          ...next.routines,
          lastWeeklyReset: week,
          weekly: next.routines.weekly.map((t) => ({ ...t, done: false })),
        }
      }

      return next
    })
  }, [setState])
}

