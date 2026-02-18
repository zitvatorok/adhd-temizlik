import { useAppState } from '../../context/AppStateContext.jsx'

export function PomodoroTaskBinder() {
  const {
    state: { rooms, routines, pomodoro },
    actions: { bindPomodoroToTask },
  } = useAppState()

  const options = [
    ...Object.values(rooms).flatMap((room) =>
      room.tasks.map((t) => ({
        id: t.id,
        label: `${room.name}: ${t.title}`,
      })),
    ),
    ...routines.daily.map((t) => ({
      id: t.id,
      label: `Günlük: ${t.title}`,
    })),
    ...routines.weekly.map((t) => ({
      id: t.id,
      label: `Haftalık: ${t.title}`,
    })),
  ]

  return (
    <div className="binder card-elevated">
      <label className="binder-label" htmlFor="pomodoro-task">
        Odaklanmak istediğin görevi seç:
      </label>
      <select
        id="pomodoro-task"
        className="binder-select tap-target"
        value={pomodoro.boundTaskId || ''}
        onChange={(e) => bindPomodoroToTask(e.target.value || null)}
      >
        <option value="">Sadece süreyi kullan</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

