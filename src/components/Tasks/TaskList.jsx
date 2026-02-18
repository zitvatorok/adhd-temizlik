import { TaskItem } from './TaskItem.jsx'

export function TaskList({ title, tasks, onToggle, levelFilter = 'all', showLevelLegend }) {
  const filtered =
    levelFilter === 'all'
      ? tasks
      : tasks.filter((t) => !t.level || t.level === levelFilter)

  const allDone = filtered.length > 0 && filtered.every((t) => t.done)

  return (
    <div className="task-list card-elevated">
      {title && (
        <div className="task-list-header">
          <h3 className="task-list-title">{title}</h3>
          {allDone && <span className="task-list-chip">Hepsi tamam 🎉</span>}
        </div>
      )}
      {showLevelLegend && (
        <p className="task-list-legend">
          Seviye: <span className="legend-dot legend-dot--light" /> hafif ·
          <span className="legend-dot legend-dot--medium" /> orta ·
          <span className="legend-dot legend-dot--deep" /> derin
        </p>
      )}
      <div className="task-list-body">
        {filtered.length === 0 ? (
          <p className="task-list-empty">
            Bu seviyede görev yok. İstersen filtreden başka seviye seçebilirsin.
          </p>
        ) : (
          filtered.map((task) => <TaskItem key={task.id} task={task} onToggle={onToggle} />)
        )}
      </div>
    </div>
  )
}

