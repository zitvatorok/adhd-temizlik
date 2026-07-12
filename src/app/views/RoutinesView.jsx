import { useState } from "react";
import { LevelFilter, SectionHeader, SegmentedControl } from "../components/ui.jsx";
import { TaskList } from "../components/TaskListPanel.jsx";

function ProgressHistory({ progress }) {
  const lastSeven = progress.slice(-7);

  if (!lastSeven.length) {
    return null;
  }

  return (
    <div className="history-panel">
      <div className="history-header">
        <h2>Son günler</h2>
      </div>
      <div className="history-list">
        {lastSeven.map((entry) => (
          <div className="history-row" key={entry.date}>
            <span>{new Date(`${entry.date}T12:00:00`).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</span>
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
  const [kind, setKind] = useState("daily");
  const energy = state.ui.energy || "light";
  const tasks = state.routines[kind] || [];

  return (
    <section className="page-section">
      <SectionHeader title="Rutinler" meta={kind === "daily" ? "Günlük" : "Haftalık"} />
      <SegmentedControl
        value={kind}
        onChange={setKind}
        options={[
          { value: "daily", label: "Günlük" },
          { value: "weekly", label: "Haftalık" },
        ]}
      />
      <LevelFilter value={energy} onChange={actions.setEnergy} />
      <TaskList
        title={kind === "daily" ? "Günlük rutin" : "Haftalık rutin"}
        tasks={tasks}
        levelFilter={energy}
        onToggle={(taskId) => actions.toggleRoutineTask(kind, taskId)}
      />
      <ProgressHistory progress={state.progress.daily} />
    </section>
  );
}
