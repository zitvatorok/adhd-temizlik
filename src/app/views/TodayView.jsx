import { useMemo } from "react";
import { CARE_MODES, TAG_KEYS, TIME_OPTIONS, TODAY_MODES } from "../constants.js";
import { getTaskStatus, getTodayTasks, taskTranslationKey } from "../lib/taskCards.js";
import { ChoiceRow, SectionHeader } from "../components/ui.jsx";
import { useT } from "../i18n/useT.js";

function PlanTaskCard({ task, onStatusChange }) {
  const t = useT();
  const status = getTaskStatus(task);
  const visibleTags = task.tags
    .filter((tag, index, all) => TAG_KEYS.includes(tag) && all.indexOf(tag) === index)
    .slice(0, 2);
  const sourceLabel =
    task.source === "room" ? t.room(task.groupId, task.sourceLabel) : t(`source.${task.groupId}`);

  return (
    <article className={`plan-task-card is-${status}`}>
      <div className="plan-task-main">
        <span className="plan-status-dot" aria-hidden="true">
          {status === "done" ? "✓" : status === "paused" ? "…" : status === "started" ? "•" : ""}
        </span>
        <div>
          <div className="plan-task-title-row">
            <h3>{t.task(taskTranslationKey(task), task.title)}</h3>
            <span>{t(`status.${status}`)}</span>
          </div>
          <div className="plan-task-meta">
            <span>{sourceLabel}</span>
            <span>{t("minutes", { n: task.minutes })}</span>
            {visibleTags.map((tag) => (
              <span key={tag}>{t(`tag.${tag}`)}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="plan-actions">
        {status === "todo" && (
          <button type="button" className="secondary-action" onClick={() => onStatusChange(task.key, "started")}>
            {t("btn.start")}
          </button>
        )}
        {status === "started" && (
          <button type="button" className="secondary-action" onClick={() => onStatusChange(task.key, "paused")}>
            {t("btn.paused")}
          </button>
        )}
        {status === "paused" && (
          <button type="button" className="secondary-action" onClick={() => onStatusChange(task.key, "started")}>
            {t("btn.resume")}
          </button>
        )}
        <button
          type="button"
          className={status === "done" ? "secondary-action" : "primary-action"}
          onClick={() => onStatusChange(task.key, status === "done" ? "todo" : "done")}
        >
          {status === "done" ? t("btn.undo") : t("btn.done")}
        </button>
      </div>
    </article>
  );
}

function TodayTaskPanel({ mode, tasks, onStatusChange }) {
  const t = useT();
  const doneCount = tasks.filter((task) => task.done).length;

  return (
    <div className="today-task-panel">
      <div className="task-panel-header">
        <div>
          <h2>{mode === "daily" ? t("today.listDaily") : t("today.listOther")}</h2>
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
  const t = useT();
  const tasks = useMemo(() => getTodayTasks(state), [state]);
  const todayMode = state.ui.todayMode || "daily";
  const title =
    todayMode === "crisis" ? t("today.titleCrisis") : todayMode === "kid" ? t("today.titleKid") : t("today.title3");
  const meta =
    todayMode === "crisis"
      ? t("today.metaCrisis")
      : todayMode === "kid"
        ? t("today.metaKid")
        : `${t(`time.${state.ui.timeBudget || "5"}`)} · ${t(`care.${state.ui.careMode || "normal"}`)}`;

  return (
    <section className="page-section">
      <SectionHeader title={title} meta={meta} />

      <div className="today-panel">
        <div className="today-copy">
          <p className="quick-kicker">{t("today.kicker")}</p>
          <h2>{t("today.next")}</h2>
          <p>{t("today.sub")}</p>
        </div>

        <ChoiceRow
          label={t("today.time")}
          value={state.ui.timeBudget || "5"}
          onChange={actions.setTimeBudget}
          options={TIME_OPTIONS.map((value) => ({ value, label: t(`time.${value}`) }))}
        />
        <ChoiceRow
          label={t("today.situation")}
          value={state.ui.careMode || "normal"}
          onChange={actions.setCareMode}
          options={CARE_MODES.map((value) => ({ value, label: t(`care.${value}`) }))}
        />
        <ChoiceRow
          label={t("today.mode")}
          value={todayMode}
          onChange={actions.setTodayMode}
          options={TODAY_MODES.map((value) => ({ value, label: t(`mode.${value}`) }))}
        />
      </div>

      <TodayTaskPanel mode={todayMode} tasks={tasks} onStatusChange={actions.setTaskStatus} />
    </section>
  );
}
