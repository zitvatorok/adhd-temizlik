import { useState } from "react";
import { LevelFilter, SectionHeader, SegmentedControl } from "../components/ui.jsx";
import { TaskList } from "../components/TaskListPanel.jsx";
import { useT } from "../i18n/useT.js";

function ProgressHistory({ progress }) {
  const t = useT();
  const lastSeven = progress.slice(-7);

  if (!lastSeven.length) {
    return null;
  }

  return (
    <div className="history-panel">
      <div className="history-header">
        <h2>{t("routines.history")}</h2>
      </div>
      <div className="history-list">
        {lastSeven.map((entry) => (
          <div className="history-row" key={entry.date}>
            <span>
              {new Date(`${entry.date}T12:00:00`).toLocaleDateString(t.locale, { day: "numeric", month: "short" })}
            </span>
            <div>
              <span style={{ width: `${entry.percentage}%` }} />
            </div>
            <strong>{entry.percentage}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RoutinesView({ state, actions }) {
  const t = useT();
  const [kind, setKind] = useState("daily");
  const energy = state.ui.energy || "light";
  const tasks = state.routines[kind] || [];

  return (
    <section className="page-section">
      <SectionHeader title={t("routines.title")} meta={kind === "daily" ? t("routines.daily") : t("routines.weekly")} />
      <SegmentedControl
        value={kind}
        onChange={setKind}
        options={[
          { value: "daily", label: t("routines.daily") },
          { value: "weekly", label: t("routines.weekly") },
        ]}
      />
      <LevelFilter value={energy} onChange={actions.setEnergy} />
      <TaskList
        title={kind === "daily" ? t("routines.dailyList") : t("routines.weeklyList")}
        tasks={tasks}
        levelFilter={energy}
        onToggle={(taskId) => actions.toggleRoutineTask(kind, taskId)}
        titleFor={(task) => t.task(task.id, task.title)}
      />
      <ProgressHistory progress={state.progress.daily} />
    </section>
  );
}
