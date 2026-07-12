import { useMemo } from "react";
import { SectionHeader } from "../components/ui.jsx";
import { PomodoroPanel } from "../components/PomodoroPanel.jsx";
import { useT } from "../i18n/useT.js";

export function FocusView({ state, actions }) {
  const t = useT();
  const taskOptions = useMemo(() => {
    const rooms = Object.values(state.rooms).flatMap((room) =>
      room.tasks.map((task) => ({
        id: `${room.id}::${task.id}`,
        legacyId: task.id,
        label: `${t.room(room.id, room.name)}: ${t.task(`${room.id}:${task.id}`, task.title)}`,
      })),
    );
    const daily = state.routines.daily.map((task) => ({
      id: `daily::${task.id}`,
      legacyId: task.id,
      label: `${t("routines.daily")}: ${t.task(task.id, task.title)}`,
    }));
    const weekly = state.routines.weekly.map((task) => ({
      id: `weekly::${task.id}`,
      legacyId: task.id,
      label: `${t("routines.weekly")}: ${t.task(task.id, task.title)}`,
    }));

    return [...rooms, ...daily, ...weekly];
  }, [state.rooms, state.routines.daily, state.routines.weekly, t]);

  const selectedTask = taskOptions.find(
    (task) => task.id === state.pomodoro.boundTaskId || task.legacyId === state.pomodoro.boundTaskId,
  );

  return (
    <section className="page-section">
      <SectionHeader title={t("focus.title")} meta={selectedTask ? t("focus.bound") : t("focus.free")} />
      <PomodoroPanel selectedTask={selectedTask?.label} />
      <label className="select-label" htmlFor="task-binding">
        {t("focus.task")}
      </label>
      <select
        id="task-binding"
        className="select-input"
        value={selectedTask?.id || ""}
        onChange={(event) => actions.bindPomodoroToTask(event.target.value)}
      >
        <option value="">{t("focus.timeOnly")}</option>
        {taskOptions.map((task) => (
          <option value={task.id} key={task.id}>
            {task.label}
          </option>
        ))}
      </select>
    </section>
  );
}
