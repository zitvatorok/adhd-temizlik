import { QUICK_TASKS } from "../../data.js";

export function getRandomQuickTask() {
  return QUICK_TASKS[Math.floor(Math.random() * QUICK_TASKS.length)];
}

export function getTaskStatus(task) {
  if (task.done || task.status === "done") return "done";
  if (task.status === "started" || task.status === "paused") return task.status;
  return "todo";
}

export function withTaskStatus(task, status) {
  return {
    ...task,
    status,
    done: status === "done",
  };
}

export function getTaskKey(source, groupId, taskId) {
  return `${source}:${groupId}:${taskId}`;
}

function updateTaskList(tasks, taskId, updater) {
  return tasks.map((task) => (task.id === taskId ? updater(task) : task));
}

export function updateTaskByKey(state, taskKey, updater) {
  const [source, groupId, taskId] = taskKey.split(":");

  if (source === "room") {
    const room = state.rooms[groupId];
    if (!room) return state;

    return {
      ...state,
      rooms: {
        ...state.rooms,
        [groupId]: {
          ...room,
          tasks: updateTaskList(room.tasks, taskId, updater),
        },
      },
    };
  }

  if (source === "routine") {
    return {
      ...state,
      routines: {
        ...state.routines,
        [groupId]: updateTaskList(state.routines[groupId] || [], taskId, updater),
      },
    };
  }

  if (source === "support") {
    return {
      ...state,
      support: {
        ...state.support,
        [groupId]: updateTaskList(state.support[groupId] || [], taskId, updater),
      },
    };
  }

  return state;
}

export function inferMinutes(task) {
  if (task.minutes) return task.minutes;

  const explicit = task.title.match(/(\d+)\s*dk/i);
  if (explicit) return Number(explicit[1]);
  if (task.level === "deep") return 10;
  if (task.level === "medium") return 5;
  return 2;
}

export function inferTags(task, context = {}) {
  const text = task.title.toLocaleLowerCase("tr-TR");
  const tags = new Set(task.tags || []);
  const isLoud = /süpür|makine|çöpü çıkar|duş kabini|klozet|derin temizlik/.test(text);

  if (task.level === "light") {
    tags.add("one-hand");
    tags.add("baby-awake");
  }

  if (!isLoud) {
    tags.add("quiet");
    tags.add("baby-sleeping");
  }

  if (context.roomId === "kids" || /çocuk|oyuncak|çorap|kitap|kıyafet/.test(text)) {
    tags.add("kid");
  }

  if (/çöp|bulaşık|tezg|yerde|lavabo|güvenli/.test(text)) {
    tags.add("crisis");
  }

  return [...tags];
}

export function makeTaskCard(task, source, groupId, sourceLabel, extra = {}) {
  const tags = inferTags(task, extra);

  return {
    ...task,
    source,
    groupId,
    sourceLabel,
    key: getTaskKey(source, groupId, task.id),
    minutes: inferMinutes(task),
    status: getTaskStatus(task),
    tags,
  };
}

export function getAllTaskCards(state) {
  const roomCards = Object.values(state.rooms || {}).flatMap((room) =>
    (room.tasks || []).map((task) => makeTaskCard(task, "room", room.id, room.name, { roomId: room.id })),
  );
  const dailyCards = (state.routines?.daily || []).map((task) =>
    makeTaskCard(task, "routine", "daily", "Günlük rutin"),
  );
  const weeklyCards = (state.routines?.weekly || []).map((task) =>
    makeTaskCard(task, "routine", "weekly", "Haftalık rutin"),
  );
  const crisisCards = (state.support?.crisis || []).map((task) => makeTaskCard(task, "support", "crisis", "Kriz"));
  const kidCards = (state.support?.kid || []).map((task) => makeTaskCard(task, "support", "kid", "Çocukla"));

  return [...roomCards, ...dailyCards, ...weeklyCards, ...crisisCards, ...kidCards];
}

export function matchesCareMode(card, careMode) {
  if (careMode === "normal") return true;
  if (careMode === "baby-awake") return card.tags.includes("baby-awake") || card.tags.includes("one-hand");
  if (careMode === "baby-sleeping") return card.tags.includes("baby-sleeping") || card.tags.includes("quiet");
  if (careMode === "one-hand") return card.tags.includes("one-hand");
  if (careMode === "kid") return card.tags.includes("kid");
  return true;
}

function stableScore(key, dateKey) {
  const input = `${dateKey}:${key}`;
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) % 1000003;
  }

  return hash;
}

export function getRecommendedTasks(state) {
  const dateKey = state.meta?.lastResetDate || new Date().toISOString().slice(0, 10);
  const timeBudget = Number(state.ui.timeBudget || 5);
  const careMode = state.ui.careMode || "normal";
  const candidates = getAllTaskCards(state).filter((card) => card.source !== "support");
  const filtered = candidates.filter((card) => card.minutes <= timeBudget && matchesCareMode(card, careMode));
  const pool = filtered.length >= 3 ? filtered : candidates;

  return [...pool]
    .sort((a, b) => {
      const statusBoost = (status) => (status === "paused" ? 0 : status === "started" ? 1 : 2);
      const statusDifference = statusBoost(a.status) - statusBoost(b.status);
      if (statusDifference) return statusDifference;

      const levelBoost = (level) => (level === "light" ? 0 : level === "medium" ? 1 : 2);
      const levelDifference = levelBoost(a.level) - levelBoost(b.level);
      if (levelDifference) return levelDifference;

      return stableScore(a.key, dateKey) - stableScore(b.key, dateKey);
    })
    .slice(0, 3);
}

export function getTodayTasks(state) {
  if (state.ui.todayMode === "crisis") {
    return (state.support?.crisis || []).map((task) => makeTaskCard(task, "support", "crisis", "Kriz"));
  }

  if (state.ui.todayMode === "kid") {
    return (state.support?.kid || []).map((task) => makeTaskCard(task, "support", "kid", "Çocukla"));
  }

  return getRecommendedTasks(state);
}
