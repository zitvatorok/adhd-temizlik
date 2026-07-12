import { useCallback, useEffect, useMemo, useState } from "react";
import {
  applyDailyRollover,
  clearAllDone,
  getTaskStats,
  loadStoredState,
  millisecondsUntilNextLocalMidnight,
  persistState,
} from "../../state.js";
import { updateTaskByKey, withTaskStatus } from "../lib/taskCards.js";
import { getStorageLike } from "../lib/storage.js";

function useMidnightRollover(setState) {
  useEffect(() => {
    let timerId;

    const runRollover = () => {
      setState((current) => applyDailyRollover(current, new Date()));
    };

    const schedule = () => {
      window.clearTimeout(timerId);
      timerId = window.setTimeout(() => {
        runRollover();
        schedule();
      }, millisecondsUntilNextLocalMidnight(new Date()));
    };

    const handleResume = () => {
      if (!document.hidden) runRollover();
    };

    schedule();
    window.addEventListener("focus", runRollover);
    document.addEventListener("visibilitychange", handleResume);

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener("focus", runRollover);
      document.removeEventListener("visibilitychange", handleResume);
    };
  }, [setState]);
}

export function useAppState() {
  const [state, setState] = useState(() => loadStoredState(getStorageLike(), new Date()));

  useMidnightRollover(setState);

  useEffect(() => {
    persistState(state, getStorageLike());
  }, [state]);

  const commit = useCallback((updater) => {
    setState((current) => {
      const fresh = applyDailyRollover(current, new Date());
      return updater(fresh);
    });
  }, []);

  const stats = useMemo(() => getTaskStats(state), [state]);

  const actions = useMemo(
    () => ({
      setActiveTab(tab) {
        commit((current) => ({ ...current, ui: { ...current.ui, activeTab: tab } }));
      },
      setTodayMode(todayMode) {
        commit((current) => ({ ...current, ui: { ...current.ui, todayMode } }));
      },
      setTimeBudget(timeBudget) {
        commit((current) => ({ ...current, ui: { ...current.ui, timeBudget } }));
      },
      setCareMode(careMode) {
        commit((current) => ({ ...current, ui: { ...current.ui, careMode } }));
      },
      setSelectedRoom(roomId) {
        commit((current) => ({ ...current, ui: { ...current.ui, selectedRoomId: roomId } }));
      },
      setEnergy(energy) {
        commit((current) => ({ ...current, ui: { ...current.ui, energy } }));
      },
      setLanguage(language) {
        commit((current) => ({ ...current, ui: { ...current.ui, language } }));
      },
      setTheme(theme) {
        commit((current) => ({ ...current, ui: { ...current.ui, theme } }));
      },
      setReminder(reminder) {
        commit((current) => ({ ...current, ui: { ...current.ui, reminder } }));
      },
      toggleRoomTask(roomId, taskId) {
        commit((current) => {
          const room = current.rooms[roomId];
          if (!room) return current;

          return {
            ...current,
            rooms: {
              ...current.rooms,
              [roomId]: {
                ...room,
                tasks: room.tasks.map((task) =>
                  task.id === taskId ? withTaskStatus(task, task.done ? "todo" : "done") : task,
                ),
              },
            },
          };
        });
      },
      toggleRoutineTask(kind, taskId) {
        commit((current) => ({
          ...current,
          routines: {
            ...current.routines,
            [kind]: current.routines[kind].map((task) =>
              task.id === taskId ? withTaskStatus(task, task.done ? "todo" : "done") : task,
            ),
          },
        }));
      },
      setTaskStatus(taskKey, status) {
        commit((current) => updateTaskByKey(current, taskKey, (task) => withTaskStatus(task, status)));
      },
      bindPomodoroToTask(taskId) {
        commit((current) => ({
          ...current,
          pomodoro: { ...current.pomodoro, boundTaskId: taskId || null },
        }));
      },
      clearToday() {
        commit((current) => clearAllDone(current));
      },
    }),
    [commit],
  );

  return { state, stats, actions };
}
