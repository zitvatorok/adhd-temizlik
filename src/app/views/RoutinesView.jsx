import { useState } from "react";
import { LEVELS } from "../constants.js";
import { Seg } from "../components/ui.jsx";
import { TaskList } from "../components/TaskListPanel.jsx";
import { useT } from "../i18n/useT.js";

function ProgressHistory({ progress }) {
  const t = useT();
  const lastSeven = progress.slice(-7);

  if (!lastSeven.length) {
    return null;
  }

  return (
    <div className="panel">
      <div className="panel-h">
        <b>{t("routines.history")}</b>
      </div>
      {lastSeven.map((entry) => (
        <div className="hist-row" key={entry.date}>
          <span>
            {new Date(`${entry.date}T12:00:00`).toLocaleDateString(t.locale, { day: "numeric", month: "short" })}
          </span>
          <div>
            <i style={{ width: `${entry.percentage}%` }} />
          </div>
          <strong>{entry.percentage}%</strong>
        </div>
      ))}
    </div>
  );
}

export function RoutinesView({ state, actions }) {
  const t = useT();
  const [kind, setKind] = useState("daily");
  const energy = state.ui.energy || "light";
  const tasks = state.routines[kind] || [];

  return (
    <div className="view">
      <Seg
        value={kind}
        onChange={setKind}
        options={[
          { value: "daily", label: t("routines.daily") },
          { value: "weekly", label: t("routines.weekly") },
        ]}
      />
      <Seg
        value={energy}
        onChange={actions.setEnergy}
        options={LEVELS.map((level) => ({ value: level.id, label: t(`levels.${level.id}`) }))}
      />
      <TaskList
        title={kind === "daily" ? t("routines.dailyList") : t("routines.weeklyList")}
        tasks={tasks}
        levelFilter={energy}
        onToggle={(taskId) => actions.toggleRoutineTask(kind, taskId)}
        titleFor={(task) => t.task(task.id, task.title)}
      />
      <ProgressHistory progress={state.progress.daily} />
    </div>
  );
}
