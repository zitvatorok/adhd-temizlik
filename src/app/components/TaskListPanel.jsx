import { getTaskStatus, inferMinutes } from "../lib/taskCards.js";
import { Stamp } from "./Stamp.jsx";
import { stampTap } from "../native/haptics.js";
import { useT } from "../i18n/useT.js";

const LEVEL_CLASS = { light: "", medium: "is-mid", deep: "is-high" };

function TaskRow({ task, onToggle, titleFor }) {
  const t = useT();
  const status = getTaskStatus(task);

  return (
    <button
      type="button"
      className={`row ${task.done ? "is-done" : ""}`}
      onClick={() => {
        if (!task.done) stampTap();
        onToggle(task.id);
      }}
    >
      <Stamp status={status} taskId={task.id} />
      <span className="row-main">
        <span className="row-t">{titleFor(task)}</span>
        <span className="row-m" style={{ display: "block" }}>
          {t("minutes", { n: inferMinutes(task) })}
          {status === "started" && ` · ${t("status.started")}`}
          {status === "paused" && ` · ${t("status.paused")}`}
        </span>
      </span>
      {task.level && (
        <span className={`lvl ${LEVEL_CLASS[task.level] || ""}`}>
          {t(`levels.${task.level}`).toLocaleUpperCase(t.locale)}
        </span>
      )}
    </button>
  );
}

export function TaskList({ title, tasks, levelFilter, onToggle, titleFor = (task) => task.title }) {
  const t = useT();
  const filteredTasks = levelFilter === "all" ? tasks : tasks.filter((task) => task.level === levelFilter);
  const completed = filteredTasks.filter((task) => task.done).length;

  return (
    <div className="panel">
      <div className="panel-h">
        <b>{title}</b>
        <span>
          {completed}/{filteredTasks.length}
        </span>
      </div>
      <div className="bar" aria-hidden="true">
        <i style={{ width: `${filteredTasks.length ? (completed / filteredTasks.length) * 100 : 0}%` }} />
      </div>

      {filteredTasks.length === 0 ? (
        <p className="empty-state">{t("empty.level")}</p>
      ) : (
        filteredTasks.map((task) => (
          <TaskRow task={task} onToggle={onToggle} titleFor={titleFor} key={task.id} />
        ))
      )}
    </div>
  );
}
