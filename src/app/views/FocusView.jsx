import { useMemo } from "react";
import { SectionHeader } from "../components/ui.jsx";
import { PomodoroPanel } from "../components/PomodoroPanel.jsx";

export function FocusView({ state, actions }) {
  const taskOptions = useMemo(() => {
    const rooms = Object.values(state.rooms).flatMap((room) =>
      room.tasks.map((task) => ({
        id: `${room.id}::${task.id}`,
        legacyId: task.id,
        label: `${room.name}: ${task.title}`,
      })),
    );
    const daily = state.routines.daily.map((task) => ({
      id: `daily::${task.id}`,
      legacyId: task.id,
      label: `Günlük: ${task.title}`,
    }));
    const weekly = state.routines.weekly.map((task) => ({
      id: `weekly::${task.id}`,
      legacyId: task.id,
      label: `Haftalık: ${task.title}`,
    }));

    return [...rooms, ...daily, ...weekly];
  }, [state.rooms, state.routines.daily, state.routines.weekly]);

  const selectedTask = taskOptions.find(
    (task) => task.id === state.pomodoro.boundTaskId || task.legacyId === state.pomodoro.boundTaskId,
  );

  return (
    <section className="page-section">
      <SectionHeader title="Odak" meta={selectedTask ? "Göreve bağlı" : "Serbest"} />
      <PomodoroPanel selectedTask={selectedTask?.label} />
      <label className="select-label" htmlFor="task-binding">
        Görev
      </label>
      <select
        id="task-binding"
        className="select-input"
        value={selectedTask?.id || ""}
        onChange={(event) => actions.bindPomodoroToTask(event.target.value)}
      >
        <option value="">Sadece süre</option>
        {taskOptions.map((task) => (
          <option value={task.id} key={task.id}>
            {task.label}
          </option>
        ))}
      </select>
    </section>
  );
}
