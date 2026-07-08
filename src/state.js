import { DEFAULT_ROOMS, DEFAULT_ROUTINES, ROOM_IDS } from "./data.js";

export const STORAGE_KEY = "adhd-cleaning-app-state-v2";
export const SCHEMA_VERSION = 3;

const DAY_MS = 24 * 60 * 60 * 1000;

const fallbackState = {
  rooms: DEFAULT_ROOMS,
  routines: {
    daily: DEFAULT_ROUTINES.daily,
    weekly: DEFAULT_ROUTINES.weekly,
    lastDailyReset: null,
    lastWeeklyReset: null,
  },
  progress: {
    daily: [],
    weekly: [],
  },
  pomodoro: {
    boundTaskId: null,
  },
  ui: {
    selectedRoomId: ROOM_IDS.KITCHEN,
    activeTab: "rooms",
    energy: "light",
  },
  meta: {
    schemaVersion: SCHEMA_VERSION,
    lastResetDate: null,
    dailyResetHour: 0,
  },
};

const clone = (value) => structuredClone(value);

export function formatLocalDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatWeekKey(date = new Date()) {
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = current.getDay() || 7;
  current.setDate(current.getDate() + 4 - day);
  const yearStart = new Date(current.getFullYear(), 0, 1);
  const week = Math.ceil(((current - yearStart) / DAY_MS + 1) / 7);
  return `${current.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function millisecondsUntilNextLocalMidnight(now = new Date()) {
  const next = new Date(now);
  next.setDate(next.getDate() + 1);
  next.setHours(0, 0, 0, 0);
  return Math.max(1000, next.getTime() - now.getTime());
}

function mergeTasks(defaultTasks = [], savedTasks = []) {
  const savedById = new Map(savedTasks.map((task) => [task.id, task]));
  const merged = defaultTasks.map((task) => ({ ...task, ...(savedById.get(task.id) || {}) }));
  const defaultIds = new Set(defaultTasks.map((task) => task.id));
  const extras = savedTasks.filter((task) => task?.id && !defaultIds.has(task.id));
  return [...merged, ...extras].map((task) => ({ ...task, done: Boolean(task.done) }));
}

function mergeRooms(savedRooms = {}) {
  const rooms = {};

  for (const [roomId, defaultRoom] of Object.entries(DEFAULT_ROOMS)) {
    const savedRoom = savedRooms?.[roomId] || {};
    rooms[roomId] = {
      ...defaultRoom,
      ...savedRoom,
      id: defaultRoom.id,
      name: savedRoom.name || defaultRoom.name,
      tasks: mergeTasks(defaultRoom.tasks, savedRoom.tasks || []),
    };
  }

  return rooms;
}

function mergeRoutines(savedRoutines = {}) {
  return {
    ...fallbackState.routines,
    ...savedRoutines,
    daily: mergeTasks(DEFAULT_ROUTINES.daily, savedRoutines?.daily || []),
    weekly: mergeTasks(DEFAULT_ROUTINES.weekly, savedRoutines?.weekly || []),
  };
}

export function normalizeState(input) {
  const saved = input && typeof input === "object" ? input : {};
  const ui = {
    ...fallbackState.ui,
    ...(saved.ui || {}),
  };

  if (!DEFAULT_ROOMS[ui.selectedRoomId]) {
    ui.selectedRoomId = ROOM_IDS.KITCHEN;
  }

  return {
    ...fallbackState,
    ...saved,
    rooms: mergeRooms(saved.rooms),
    routines: mergeRoutines(saved.routines),
    progress: {
      ...fallbackState.progress,
      ...(saved.progress || {}),
      daily: Array.isArray(saved.progress?.daily) ? saved.progress.daily : [],
      weekly: Array.isArray(saved.progress?.weekly) ? saved.progress.weekly : [],
    },
    pomodoro: {
      ...fallbackState.pomodoro,
      ...(saved.pomodoro || {}),
    },
    ui,
    meta: {
      ...fallbackState.meta,
      ...(saved.meta || {}),
    },
  };
}

export function getTaskStats(state) {
  const rooms = Object.values(state.rooms || {});
  const roomTasks = rooms.flatMap((room) => room.tasks || []);
  const dailyTasks = state.routines?.daily || [];
  const weeklyTasks = state.routines?.weekly || [];
  const all = [...roomTasks, ...dailyTasks, ...weeklyTasks];
  const done = all.filter((task) => task.done).length;

  return {
    done,
    total: all.length,
    percentage: all.length ? Math.round((done / all.length) * 100) : 0,
    roomsDone: roomTasks.filter((task) => task.done).length,
    routinesDone: [...dailyTasks, ...weeklyTasks].filter((task) => task.done).length,
  };
}

export function clearAllDone(state) {
  const next = normalizeState(state);

  return {
    ...next,
    rooms: Object.fromEntries(
      Object.entries(next.rooms).map(([roomId, room]) => [
        roomId,
        {
          ...room,
          tasks: room.tasks.map((task) => ({ ...task, done: false })),
        },
      ]),
    ),
    routines: {
      ...next.routines,
      daily: next.routines.daily.map((task) => ({ ...task, done: false })),
      weekly: next.routines.weekly.map((task) => ({ ...task, done: false })),
    },
  };
}

function appendDailyProgress(state, previousDate) {
  if (!previousDate) return state.progress?.daily || [];
  const stats = getTaskStats(state);

  const withoutDuplicate = (state.progress?.daily || []).filter((entry) => entry.date !== previousDate);
  return [
    ...withoutDuplicate,
    {
      date: previousDate,
      completed: stats.done,
      total: stats.total,
      percentage: stats.percentage,
    },
  ].slice(-45);
}

function appendWeeklyProgress(state, previousWeek) {
  if (!previousWeek) return state.progress?.weekly || [];
  const weeklyTasks = state.routines?.weekly || [];
  const completed = weeklyTasks.filter((task) => task.done).length;
  const total = weeklyTasks.length;

  const withoutDuplicate = (state.progress?.weekly || []).filter((entry) => entry.week !== previousWeek);
  return [
    ...withoutDuplicate,
    {
      week: previousWeek,
      completed,
      total,
      percentage: total ? Math.round((completed / total) * 100) : 0,
    },
  ].slice(-16);
}

export function applyDailyRollover(input, now = new Date()) {
  const state = normalizeState(input);
  const today = formatLocalDate(now);
  const currentWeek = formatWeekKey(now);
  const previousDate = state.meta.lastResetDate || state.routines.lastDailyReset;
  const previousWeek = state.routines.lastWeeklyReset;
  const isNewSchema = state.meta.schemaVersion === SCHEMA_VERSION;
  const dateChanged = previousDate !== today;
  const schemaChanged = !isNewSchema;

  if (!dateChanged && !schemaChanged) {
    return {
      ...state,
      routines: {
        ...state.routines,
        lastDailyReset: today,
        lastWeeklyReset: currentWeek,
      },
      meta: {
        ...state.meta,
        schemaVersion: SCHEMA_VERSION,
        lastResetDate: today,
      },
    };
  }

  const shouldRecord = Boolean(previousDate && dateChanged && isNewSchema);
  const shouldRecordWeek = Boolean(previousWeek && previousWeek !== currentWeek && isNewSchema);
  const cleared = clearAllDone(state);

  return {
    ...cleared,
    progress: {
      daily: shouldRecord ? appendDailyProgress(state, previousDate) : state.progress.daily,
      weekly: shouldRecordWeek ? appendWeeklyProgress(state, previousWeek) : state.progress.weekly,
    },
    routines: {
      ...cleared.routines,
      lastDailyReset: today,
      lastWeeklyReset: currentWeek,
    },
    meta: {
      ...cleared.meta,
      schemaVersion: SCHEMA_VERSION,
      lastResetDate: today,
      lastResetAt: now.toISOString(),
    },
  };
}

export function loadStoredState(storage = window.localStorage, now = new Date()) {
  try {
    const stored = storage.getItem(STORAGE_KEY);
    return applyDailyRollover(stored ? JSON.parse(stored) : clone(fallbackState), now);
  } catch {
    return applyDailyRollover(clone(fallbackState), now);
  }
}

export function persistState(state, storage = window.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore private-mode storage failures; the app should remain usable.
  }
}

export function getDefaultState(now = new Date()) {
  return applyDailyRollover(clone(fallbackState), now);
}
