import { getTaskStatus } from "../lib/taskCards.js";
import { useT } from "../i18n/useT.js";

function TaskItem({ task, onToggle, titleFor }) {
  const t = useT();
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
      <span className="task-title">{titleFor(task)}</span>
      {task.level && <span className={`level-chip level-chip-${task.level}`}>{t(`levels.${task.level}`)}</span>}
    </button>
  );
}

export function TaskList({ title, tasks, levelFilter, onToggle, titleFor = (task) => task.title }) {
  const t = useT();
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
          <p className="empty-state">{t("empty.level")}</p>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem task={task} onToggle={onToggle} titleFor={titleFor} key={task.id} />
          ))
        )}
      </div>
    </div>
  );
}
