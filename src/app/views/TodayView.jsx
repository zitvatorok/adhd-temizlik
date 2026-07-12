import { useMemo } from "react";
import { CARE_MODES, STATUS_LABELS, TAG_LABELS, TIME_OPTIONS, TODAY_MODES } from "../constants.js";
import { getTaskStatus, getTodayTasks } from "../lib/taskCards.js";
import { ChoiceRow, SectionHeader } from "../components/ui.jsx";

function PlanTaskCard({ task, onStatusChange }) {
  const status = getTaskStatus(task);
  const visibleTags = task.tags
    .filter((tag, index, all) => TAG_LABELS[tag] && all.indexOf(tag) === index)
    .slice(0, 2);

  return (
    <article className={`plan-task-card is-${status}`}>
      <div className="plan-task-main">
        <span className="plan-status-dot" aria-hidden="true">
          {status === "done" ? "✓" : status === "paused" ? "…" : status === "started" ? "•" : ""}
        </span>
        <div>
          <div className="plan-task-title-row">
            <h3>{task.title}</h3>
            <span>{STATUS_LABELS[status]}</span>
          </div>
          <div className="plan-task-meta">
            <span>{task.sourceLabel}</span>
            <span>{task.minutes} dk</span>
            {visibleTags.map((tag) => (
              <span key={tag}>{TAG_LABELS[tag]}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="plan-actions">
        {status === "todo" && (
          <button type="button" className="secondary-action" onClick={() => onStatusChange(task.key, "started")}>
            Başladım
          </button>
        )}
        {status === "started" && (
          <button type="button" className="secondary-action" onClick={() => onStatusChange(task.key, "paused")}>
            Yarım kaldı
          </button>
        )}
        {status === "paused" && (
          <button type="button" className="secondary-action" onClick={() => onStatusChange(task.key, "started")}>
            Kaldığım yer
          </button>
        )}
        <button
          type="button"
          className={status === "done" ? "secondary-action" : "primary-action"}
          onClick={() => onStatusChange(task.key, status === "done" ? "todo" : "done")}
        >
          {status === "done" ? "Geri al" : "Bitti"}
        </button>
      </div>
    </article>
  );
}

function TodayTaskPanel({ mode, tasks, onStatusChange }) {
  const doneCount = tasks.filter((task) => task.done).length;

  return (
    <div className="today-task-panel">
      <div className="task-panel-header">
        <div>
          <h2>{mode === "daily" ? "Sıradaki yapılabilirler" : "Şimdilik yeterli liste"}</h2>
          <span>
            {doneCount}/{tasks.length}
          </span>
        </div>
        <div className="mini-progress" aria-hidden="true">
          <span style={{ width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="plan-task-list">
        {tasks.map((task) => (
          <PlanTaskCard task={task} onStatusChange={onStatusChange} key={task.key} />
        ))}
      </div>
    </div>
  );
}

export function TodayView({ state, actions }) {
  const tasks = useMemo(() => getTodayTasks(state), [state]);
  const todayMode = state.ui.todayMode || "daily";
  const title =
    todayMode === "crisis" ? "Kriz modu" : todayMode === "kid" ? "Çocukla birlikte" : "Bugünün 3 adımı";
  const meta =
    todayMode === "crisis"
      ? "önce güvenli alan"
      : todayMode === "kid"
        ? "oyun gibi toparlama"
        : `${state.ui.timeBudget || "5"} dk · ${CARE_MODES.find((mode) => mode.value === state.ui.careMode)?.label || "Normal"}`;

  return (
    <section className="page-section">
      <SectionHeader title={title} meta={meta} />

      <div className="today-panel">
        <div className="today-copy">
          <p className="quick-kicker">Şu anki hedef</p>
          <h2>Bir sonraki küçük şey</h2>
          <p>Bütün evi değil, sadece akışı toparlıyoruz.</p>
        </div>

        <ChoiceRow
          label="Zaman"
          value={state.ui.timeBudget || "5"}
          onChange={actions.setTimeBudget}
          options={TIME_OPTIONS}
        />
        <ChoiceRow
          label="Durum"
          value={state.ui.careMode || "normal"}
          onChange={actions.setCareMode}
          options={CARE_MODES}
        />
        <ChoiceRow
          label="Mod"
          value={todayMode}
          onChange={actions.setTodayMode}
          options={TODAY_MODES}
        />
      </div>

      <TodayTaskPanel mode={todayMode} tasks={tasks} onStatusChange={actions.setTaskStatus} />
    </section>
  );
}
