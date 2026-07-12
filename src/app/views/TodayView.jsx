import { useMemo } from "react";
import { CARE_MODES, TAG_KEYS, TIME_OPTIONS, TODAY_MODES } from "../constants.js";
import { getTaskStatus, getTodayTasks, taskTranslationKey } from "../lib/taskCards.js";
import { ChipRow, Seg } from "../components/ui.jsx";
import { Stamp } from "../components/Stamp.jsx";
import { stampTap } from "../native/haptics.js";
import { useT } from "../i18n/useT.js";

function PlanRow({ task, onStatusChange }) {
  const t = useT();
  const status = getTaskStatus(task);
  const toggleDone = () => {
    if (status !== "done") stampTap();
    onStatusChange(task.key, status === "done" ? "todo" : "done");
  };
  const visibleTag = task.tags.find((tag) => TAG_KEYS.includes(tag));
  const sourceLabel =
    task.source === "room" ? t.room(task.groupId, task.sourceLabel) : t(`source.${task.groupId}`);

  return (
    <article className={`row ${status === "done" ? "is-done" : ""}`}>
      <Stamp
        status={status}
        taskId={task.id}
        onClick={toggleDone}
        label={t.task(taskTranslationKey(task), task.title)}
      />
      <span className="row-main">
        <span className="row-t">{t.task(taskTranslationKey(task), task.title)}</span>
        <span className="row-m" style={{ display: "block" }}>
          <b>{sourceLabel}</b> · {t("minutes", { n: task.minutes })}
          {visibleTag ? ` · ${t(`tag.${visibleTag}`)}` : ""}
        </span>
      </span>
      <span className="row-actions">
        <button
          type="button"
          className={`btn btn-sm ${status === "done" ? "btn-ghost" : "btn-primary"}`}
          onClick={toggleDone}
        >
          {status === "done" ? t("btn.undo") : t("btn.done")}
        </button>
        {status !== "done" && (
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() =>
              onStatusChange(task.key, status === "todo" ? "started" : status === "started" ? "paused" : "started")
            }
          >
            {status === "todo" ? t("btn.start") : status === "started" ? t("btn.paused") : t("btn.resume")}
          </button>
        )}
      </span>
    </article>
  );
}

export function TodayView({ state, actions }) {
  const t = useT();
  const tasks = useMemo(() => getTodayTasks(state), [state]);
  const todayMode = state.ui.todayMode || "daily";
  const doneCount = tasks.filter((task) => task.done).length;
  const listTitle = todayMode === "daily" ? t("today.listDaily") : t("today.listOther");

  return (
    <div className="view">
      <Seg
        value={state.ui.timeBudget || "5"}
        onChange={actions.setTimeBudget}
        options={TIME_OPTIONS.map((value) => ({ value, label: t(`time.${value}`) }))}
      />
      <ChipRow
        value={state.ui.careMode || "normal"}
        onChange={actions.setCareMode}
        options={CARE_MODES.map((value) => ({ value, label: t(`care.${value}`) }))}
      />
      <ChipRow
        value={todayMode}
        onChange={actions.setTodayMode}
        options={TODAY_MODES.map((value) => ({ value, label: t(`mode.${value}`) }))}
      />

      <div className="panel">
        <div className="panel-h">
          <b>{listTitle}</b>
          <span>
            {doneCount}/{tasks.length}
          </span>
        </div>
        <div className="bar" aria-hidden="true">
          <i style={{ width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%` }} />
        </div>
        {tasks.map((task) => (
          <PlanRow task={task} onStatusChange={actions.setTaskStatus} key={task.key} />
        ))}
      </div>
    </div>
  );
}
