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

      // Daily reset and progress tracking
      if (next.routines?.lastDailyReset !== today) {
        // Save yesterday's progress
        if (next.routines?.lastDailyReset) {
          const completedCount = next.routines.daily.filter(t => t.done).length
          const totalCount = next.routines.daily.length
          
          next.progress = {
            ...next.progress,
            daily: [
              ...(next.progress?.daily || []),
              {
                date: next.routines.lastDailyReset,
                completed: completedCount,
                total: totalCount,
                percentage: Math.round((completedCount / totalCount) * 100)
              }
            ].slice(-30) // Keep last 30 days
          }
        }

        next.routines = {
          ...next.routines,
          lastDailyReset: today,
          daily: next.routines.daily.map((t) => ({ ...t, done: false })),
        }
      }

      // Weekly reset and progress tracking
      if (next.routines?.lastWeeklyReset !== week) {
        // Save last week's progress
        if (next.routines?.lastWeeklyReset) {
          const completedCount = next.routines.weekly.filter(t => t.done).length
          const totalCount = next.routines.weekly.length
          
          next.progress = {
            ...next.progress,
            weekly: [
              ...(next.progress?.weekly || []),
              {
                week: next.routines.lastWeeklyReset,
                completed: completedCount,
                total: totalCount,
                percentage: Math.round((completedCount / totalCount) * 100)
              }
            ].slice(-12) // Keep last 12 weeks
          }
        }

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

