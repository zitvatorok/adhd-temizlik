import { LEVEL_LABELS } from "../constants.js";
import { getTaskStatus } from "../lib/taskCards.js";

function TaskItem({ task, onToggle }) {
  const status = getTaskStatus(task);

  return (
    <button
      type="button"
      className={`task-item is-${status} ${task.done ? "is-done" : ""}`}
      onClick={() => onToggle(task.id)}
      aria-pressed={task.done}
    >
      <span className="check-dot" aria-hidden="true">
        {status === "done" ? "✓" : status === "paused" ? "…" : status === "started" ? "•" : ""}
      </span>
      <span className="task-title">{task.title}</span>
      {task.level && <span className={`level-chip level-chip-${task.level}`}>{LEVEL_LABELS[task.level]}</span>}
    </button>
  );
}

export function TaskList({ title, tasks, levelFilter, onToggle }) {
  const filteredTasks = levelFilter === "all" ? tasks : tasks.filter((task) => task.level === levelFilter);
  const completed = filteredTasks.filter((task) => task.done).length;

  return (
    <div className="task-panel">
      <div className="task-panel-header">
        <div>
          <h2>{title}</h2>
          <span>
            {completed}/{filteredTasks.length}
          </span>
        </div>
        <div className="mini-progress" aria-hidden="true">
          <span style={{ width: `${filteredTasks.length ? (completed / filteredTasks.length) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="empty-state">Bu seviyede görev yok.</p>
        ) : (
          filteredTasks.map((task) => <TaskItem task={task} onToggle={onToggle} key={task.id} />)
        )}
      </div>
    </div>
  );
}
