import { usePomodoro } from '../../hooks/usePomodoro'
import { useAppState } from '../../context/AppStateContext.jsx'

export function PomodoroTimer() {
  const { phase, minutes, seconds, isRunning, start, pause, reset } = usePomodoro()
  const {
    state: { pomodoro, rooms, routines },
  } = useAppState()

  const boundTaskName = getTaskNameById(pomodoro.boundTaskId, rooms, routines)

  return (
    <div className="pomodoro card-elevated">
      <div className="pomodoro-header">
        <span className={`pomodoro-phase pomodoro-phase--${phase}`}>
          {phase === 'focus' ? 'Odak' : 'Mola'}
        </span>
        {boundTaskName && <span className="pomodoro-task-label">{boundTaskName}</span>}
      </div>
      <div className="pomodoro-time">
        {minutes}:{seconds}
      </div>
      <div className="pomodoro-actions">
        {!isRunning ? (
          <button type="button" className="primary-btn tap-target" onClick={start}>
            Başlat
          </button>
        ) : (
          <button type="button" className="secondary-btn tap-target" onClick={pause}>
            Duraklat
          </button>
        )}
        <button type="button" className="ghost-btn tap-target" onClick={reset}>
          Sıfırla
        </button>
      </div>
      <p className="pomodoro-hint">
        25 dakika odaklan, sonra 5 dakika mola ver. Sadece bir görevi seçmen yeterli.
      </p>
    </div>
  )
}

function getTaskNameById(taskId, rooms, routines) {
  if (!taskId) return null

  for (const room of Object.values(rooms)) {
    const found = room.tasks.find((t) => t.id === taskId)
    if (found) return `${room.name}: ${found.title}`
  }

  for (const list of [routines.daily, routines.weekly]) {
    const found = list.find((t) => t.id === taskId)
    if (found) return found.title
  }

  return null
}

