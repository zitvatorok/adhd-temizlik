import assert from "node:assert/strict";
import {
  SCHEMA_VERSION,
  applyDailyRollover,
  clearAllDone,
  formatLocalDate,
  millisecondsUntilNextLocalMidnight,
} from "./state.js";
import { DEFAULT_ROOMS, ROOM_IDS } from "./data.js";

const yesterday = new Date(2026, 6, 7, 23, 50);
const today = new Date(2026, 6, 8, 0, 1);

const oldState = {
  rooms: {
    [ROOM_IDS.KITCHEN]: {
      ...DEFAULT_ROOMS[ROOM_IDS.KITCHEN],
      tasks: DEFAULT_ROOMS[ROOM_IDS.KITCHEN].tasks.map((task, index) => ({
        ...task,
        done: index === 0,
        status: index === 0 ? "done" : "todo",
      })),
    },
  },
  routines: {
    daily: [{ id: "d-test", title: "Daily", done: true, status: "done" }],
    weekly: [{ id: "w-test", title: "Weekly", done: true, status: "done" }],
    lastDailyReset: formatLocalDate(yesterday),
    lastWeeklyReset: "2026-W28",
  },
  progress: { daily: [], weekly: [] },
  support: {
    crisis: [{ id: "crisis-test", title: "Crisis", done: false, status: "paused" }],
    kid: [{ id: "kid-test", title: "Kid", done: false, status: "started" }],
  },
  meta: { schemaVersion: SCHEMA_VERSION, lastResetDate: formatLocalDate(yesterday) },
};

const rolled = applyDailyRollover(oldState, today);

assert.equal(rolled.rooms[ROOM_IDS.KITCHEN].tasks.some((task) => task.done), false);
assert.equal(rolled.routines.daily.some((task) => task.done), false);
assert.equal(rolled.routines.weekly.some((task) => task.done), false);
assert.equal(rolled.support.crisis.some((task) => task.status !== "todo"), false);
assert.equal(rolled.support.kid.some((task) => task.status !== "todo"), false);
assert.equal(rolled.meta.lastResetDate, "2026-07-08");
assert.equal(rolled.progress.daily.at(-1).date, "2026-07-07");
assert.equal(rolled.progress.daily.at(-1).completed > 0, true);

const sameDay = applyDailyRollover(rolled, new Date(2026, 6, 8, 18, 30));
assert.equal(sameDay.progress.daily.length, rolled.progress.daily.length);

const migrated = applyDailyRollover(
  {
    ...oldState,
    ui: { activeTab: "rooms" },
    meta: { schemaVersion: SCHEMA_VERSION - 1, lastResetDate: formatLocalDate(today) },
  },
  today,
);
assert.equal(migrated.ui.activeTab, "today");

const cleared = clearAllDone(oldState);
assert.equal(cleared.rooms[ROOM_IDS.KITCHEN].tasks.some((task) => task.done), false);
assert.equal(cleared.support.crisis.some((task) => task.status !== "todo"), false);

assert.equal(millisecondsUntilNextLocalMidnight(new Date(2026, 6, 8, 23, 59, 50)) <= 10_000, true);

console.log("state tests passed");
