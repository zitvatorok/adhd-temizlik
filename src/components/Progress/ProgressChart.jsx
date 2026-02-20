import { useMemo } from 'react'
import { useAppState } from '../../context/AppStateContext'
import './ProgressChart.css'

export function ProgressChart() {
  const { state } = useAppState()
  
  const { dailyProgress, weeklyProgress, currentStreak, bestStreak } = useMemo(() => {
    const daily = state.progress?.daily || []
    const weekly = state.progress?.weekly || []
    
    // Calculate streaks
    let currentStreak = 0
    let bestStreak = 0
    let tempStreak = 0
    
    for (let i = daily.length - 1; i >= 0; i--) {
      if (daily[i].percentage >= 80) {
        tempStreak++
        if (i === daily.length - 1) currentStreak = tempStreak
      } else {
        bestStreak = Math.max(bestStreak, tempStreak)
        tempStreak = 0
        if (i < daily.length - 1) break
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak)
    
    return {
      dailyProgress: daily,
      weeklyProgress: weekly,
      currentStreak,
      bestStreak
    }
  }, [state.progress])

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
  }

  const formatWeek = (weekStr) => {
    const [year, week] = weekStr.split('-W')
    return `${year}. ${week}. Hafta`
  }

  if (dailyProgress.length === 0 && weeklyProgress.length === 0) {
    return (
      <div className="progress-chart card-elevated">
        <h3 className="progress-title">İlerleme Grafiği</h3>
        <p className="progress-empty">Henüz ilerleme verisi yok. Görevleri tamamlamaya başla!</p>
      </div>
    )
  }

  return (
    <div className="progress-chart card-elevated">
      <div className="progress-header">
        <h3 className="progress-title">İlerleme Grafiği</h3>
        <div className="progress-streaks">
          <div className="streak-item">
            <span className="streak-value">{currentStreak}</span>
            <span className="streak-label">Günlük Seri</span>
          </div>
          <div className="streak-item">
            <span className="streak-value">{bestStreak}</span>
            <span className="streak-label">En İyi Seri</span>
          </div>
        </div>
      </div>

      {dailyProgress.length > 0 && (
        <div className="progress-section">
          <h4 className="progress-section-title">Son 7 Gün</h4>
          <div className="progress-bars">
            {dailyProgress.slice(-7).map((day, index) => (
              <div key={day.date} className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${day.percentage}%` }}
                  />
                </div>
                <span className="progress-label">{formatDate(day.date)}</span>
                <span className="progress-value">{day.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {weeklyProgress.length > 0 && (
        <div className="progress-section">
          <h4 className="progress-section-title">Haftalık İlerleme</h4>
          <div className="progress-bars">
            {weeklyProgress.slice(-4).map((week, index) => (
              <div key={week.week} className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill progress-bar-fill--weekly"
                    style={{ width: `${week.percentage}%` }}
                  />
                </div>
                <span className="progress-label">{formatWeek(week.week)}</span>
                <span className="progress-value">{week.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="progress-summary">
        <div className="summary-item">
          <span className="summary-label">Bu Gün</span>
          <span className="summary-value">
            {state.routines?.daily?.filter(t => t.done).length || 0} / {state.routines?.daily?.length || 0}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Bu Hafta</span>
          <span className="summary-value">
            {state.routines?.weekly?.filter(t => t.done).length || 0} / {state.routines?.weekly?.length || 0}
          </span>
        </div>
      </div>
    </div>
  )
}
