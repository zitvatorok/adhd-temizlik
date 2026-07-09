import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_ROOMS, QUICK_TASKS, ROOM_ORDER } from "./data.js";
import {
  applyDailyRollover,
  clearAllDone,
  getTaskStats,
  loadStoredState,
  millisecondsUntilNextLocalMidnight,
  persistState,
} from "./state.js";

const TABS = [
  { id: "today", label: "Bugün", icon: "◌" },
  { id: "rooms", label: "Odalar", icon: "⌂" },
  { id: "routines", label: "Rutinler", icon: "✓" },
  { id: "focus", label: "Odak", icon: "◷" },
  { id: "quick", label: "Dopamin", icon: "✦" },
  { id: "settings", label: "Ayarlar", icon: "⚙" },
];

const LEVELS = [
  { id: "light", label: "Hafif", tone: "low" },
  { id: "medium", label: "Orta", tone: "mid" },
  { id: "deep", label: "Derin", tone: "high" },
];

const LEVEL_LABELS = Object.fromEntries(LEVELS.map((level) => [level.id, level.label]));

const TIME_OPTIONS = [
  { value: "2", label: "2 dk" },
  { value: "5", label: "5 dk" },
  { value: "10", label: "10 dk" },
];

const CARE_MODES = [
  { value: "normal", label: "Normal" },
  { value: "baby-awake", label: "Bebek uyanık" },
  { value: "baby-sleeping", label: "Bebek uyuyor" },
  { value: "one-hand", label: "Tek el" },
  { value: "kid", label: "Çocukla" },
];

const TODAY_MODES = [
  { value: "daily", label: "3 adım" },
  { value: "crisis", label: "Kriz" },
  { value: "kid", label: "Çocukla" },
];

const TAG_LABELS = {
  "baby-awake": "bebek uyanık",
  "baby-sleeping": "sessiz",
  "one-hand": "tek el",
  kid: "çocukla",
  crisis: "kriz",
  quiet: "sessiz",
};

const STATUS_LABELS = {
  todo: "hazır",
  started: "başlandı",
  paused: "yarım kaldı",
  done: "bitti",
};

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

function getRandomQuickTask() {
  return QUICK_TASKS[Math.floor(Math.random() * QUICK_TASKS.length)];
}

function getTaskStatus(task) {
  if (task.done || task.status === "done") return "done";
  if (task.status === "started" || task.status === "paused") return task.status;
  return "todo";
}

function withTaskStatus(task, status) {
  return {
    ...task,
    status,
    done: status === "done",
  };
}

function getTaskKey(source, groupId, taskId) {
  return `${source}:${groupId}:${taskId}`;
}

function updateTaskList(tasks, taskId, updater) {
  return tasks.map((task) => (task.id === taskId ? updater(task) : task));
}

function updateTaskByKey(state, taskKey, updater) {
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

function inferMinutes(task) {
  if (task.minutes) return task.minutes;

  const explicit = task.title.match(/(\d+)\s*dk/i);
  if (explicit) return Number(explicit[1]);
  if (task.level === "deep") return 10;
  if (task.level === "medium") return 5;
  return 2;
}

function inferTags(task, context = {}) {
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

function makeTaskCard(task, source, groupId, sourceLabel, extra = {}) {
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

function getAllTaskCards(state) {
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

function matchesCareMode(card, careMode) {
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

function getRecommendedTasks(state) {
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

function getTodayTasks(state) {
  if (state.ui.todayMode === "crisis") {
    return (state.support?.crisis || []).map((task) => makeTaskCard(task, "support", "crisis", "Kriz"));
  }

  if (state.ui.todayMode === "kid") {
    return (state.support?.kid || []).map((task) => makeTaskCard(task, "support", "kid", "Çocukla"));
  }

  return getRecommendedTasks(state);
}

function App() {
  const [state, setState] = useState(() => loadStoredState(window.localStorage, new Date()));

  useMidnightRollover(setState);

  useEffect(() => {
    persistState(state, window.localStorage);
  }, [state]);

  const commit = useCallback((updater) => {
    setState((current) => {
      const fresh = applyDailyRollover(current, new Date());
      return updater(fresh);
    });
  }, []);

  const activeTab = state.ui.activeTab || "rooms";
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

  return (
    <div className="app-shell">
      <SideNav activeTab={activeTab} onChange={actions.setActiveTab} />

      <div className="workspace">
        <TopBar stats={stats} />

        <main className="content-area">
          {activeTab === "today" && <TodayPage state={state} actions={actions} />}
          {activeTab === "rooms" && <RoomsPage state={state} actions={actions} />}
          {activeTab === "routines" && <RoutinesPage state={state} actions={actions} />}
          {activeTab === "focus" && <FocusPage state={state} actions={actions} />}
          {activeTab === "quick" && <QuickPage state={state} />}
          {activeTab === "settings" && <SettingsPage state={state} actions={actions} stats={stats} />}
        </main>
      </div>

      <BottomNav activeTab={activeTab} onChange={actions.setActiveTab} />
    </div>
  );
}

function SideNav({ activeTab, onChange }) {
  return (
    <aside className="side-nav" aria-label="Ana menü">
      <div className="brand">
        <span className="brand-mark">P</span>
        <div>
          <p className="brand-title">Piling Up</p>
          <p className="brand-subtitle">Ev akışı</p>
        </div>
      </div>

      <nav className="nav-list">
        {TABS.map((tab) => (
          <button
            type="button"
            className={`nav-button ${activeTab === tab.id ? "is-active" : ""}`}
            onClick={() => onChange(tab.id)}
            key={tab.id}
            title={tab.label}
          >
            <span className="nav-icon" aria-hidden="true">
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="Ana menü">
      {TABS.map((tab) => (
        <button
          type="button"
          className={`bottom-nav-button ${activeTab === tab.id ? "is-active" : ""}`}
          onClick={() => onChange(tab.id)}
          key={tab.id}
          title={tab.label}
        >
          <span className="nav-icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

function TopBar({ stats }) {
  const today = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const dailyDone = Math.min(stats.done, 3);
  const dailyProgress = Math.min(100, Math.round((dailyDone / 3) * 100));

  return (
    <header className="top-bar">
      <div className="top-copy">
        <p className="app-kicker">Bugün</p>
        <p className="eyebrow">{today}</p>
        <h1>Piling Up</h1>
        <p className="top-note">Küçük adımlar, gerçek ilerleme.</p>
      </div>

      <div className="summary-strip" aria-label="Bugünkü ilerleme">
        <ProgressRing value={dailyProgress} />
        <div className="summary-copy">
          <strong>
            {dailyDone}/3
          </strong>
          <span>bugünün küçük adımı</span>
        </div>
        <div className="summary-copy hide-small">
          <strong>00:00</strong>
          <span>temiz sayfa</span>
        </div>
      </div>
    </header>
  );
}

function ProgressRing({ value }) {
  return (
    <div
      className="progress-ring"
      style={{ "--progress": `${value}%` }}
      role="img"
      aria-label={`İlerleme ${value}%`}
    >
      <span>{value}</span>
    </div>
  );
}

function TodayPage({ state, actions }) {
  const tasks = useMemo(() => getTodayTasks(state), [state]);
  const todayMode = state.ui.todayMode || "daily";
  const title =
    todayMode === "crisis" ? "Kriz modu" : todayMode === "kid" ? "Çocukla birlikte" : "Bugünün 3 adımı";
  const meta =
    todayMode === "crisis"
      ? "önce güvenli alan"
      : todayMode === "kid"
        ? "oyun gibi toparlama"
        : `${state.ui.timeBudget || "5"} dk · ${CARE_MODES.find((mode) => mode.value === state.ui.careMode)?.label || "Normal"}`;

  return (
    <section className="page-section">
      <SectionHeader title={title} meta={meta} />

      <div className="today-panel">
        <div className="today-copy">
          <p className="quick-kicker">Şu anki hedef</p>
          <h2>Bir sonraki küçük şey</h2>
          <p>Bütün evi değil, sadece akışı toparlıyoruz.</p>
        </div>

        <ChoiceRow
          label="Zaman"
          value={state.ui.timeBudget || "5"}
          onChange={actions.setTimeBudget}
          options={TIME_OPTIONS}
        />
        <ChoiceRow
          label="Durum"
          value={state.ui.careMode || "normal"}
          onChange={actions.setCareMode}
          options={CARE_MODES}
        />
        <ChoiceRow
          label="Mod"
          value={todayMode}
          onChange={actions.setTodayMode}
          options={TODAY_MODES}
        />
      </div>

      <TodayTaskPanel mode={todayMode} tasks={tasks} onStatusChange={actions.setTaskStatus} />
    </section>
  );
}

function ChoiceRow({ label, value, onChange, options }) {
  return (
    <div className="choice-row">
      <span>{label}</span>
      <div>
        {options.map((option) => (
          <button
            type="button"
            className={value === option.value ? "is-active" : ""}
            onClick={() => onChange(option.value)}
            key={option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TodayTaskPanel({ mode, tasks, onStatusChange }) {
  const doneCount = tasks.filter((task) => task.done).length;

  return (
    <div className="today-task-panel">
      <div className="task-panel-header">
        <div>
          <h2>{mode === "daily" ? "Sıradaki yapılabilirler" : "Şimdilik yeterli liste"}</h2>
          <span>
            {doneCount}/{tasks.length}
          </span>
        </div>
        <div className="mini-progress" aria-hidden="true">
          <span style={{ width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="plan-task-list">
        {tasks.map((task) => (
          <PlanTaskCard task={task} onStatusChange={onStatusChange} key={task.key} />
        ))}
      </div>
    </div>
  );
}

function PlanTaskCard({ task, onStatusChange }) {
  const status = getTaskStatus(task);
  const visibleTags = task.tags
    .filter((tag, index, all) => TAG_LABELS[tag] && all.indexOf(tag) === index)
    .slice(0, 2);

  return (
    <article className={`plan-task-card is-${status}`}>
      <div className="plan-task-main">
        <span className="plan-status-dot" aria-hidden="true">
          {status === "done" ? "✓" : status === "paused" ? "…" : status === "started" ? "•" : ""}
        </span>
        <div>
          <div className="plan-task-title-row">
            <h3>{task.title}</h3>
            <span>{STATUS_LABELS[status]}</span>
          </div>
          <div className="plan-task-meta">
            <span>{task.sourceLabel}</span>
            <span>{task.minutes} dk</span>
            {visibleTags.map((tag) => (
              <span key={tag}>{TAG_LABELS[tag]}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="plan-actions">
        {status === "todo" && (
          <button type="button" className="secondary-action" onClick={() => onStatusChange(task.key, "started")}>
            Başladım
          </button>
        )}
        {status === "started" && (
          <button type="button" className="secondary-action" onClick={() => onStatusChange(task.key, "paused")}>
            Yarım kaldı
          </button>
        )}
        {status === "paused" && (
          <button type="button" className="secondary-action" onClick={() => onStatusChange(task.key, "started")}>
            Kaldığım yer
          </button>
        )}
        <button
          type="button"
          className={status === "done" ? "secondary-action" : "primary-action"}
          onClick={() => onStatusChange(task.key, status === "done" ? "todo" : "done")}
        >
          {status === "done" ? "Geri al" : "Bitti"}
        </button>
      </div>
    </article>
  );
}

function RoomsPage({ state, actions }) {
  const selectedRoomId = state.ui.selectedRoomId;
  const selectedRoom = state.rooms[selectedRoomId] || DEFAULT_ROOMS[selectedRoomId];
  const energy = state.ui.energy || "light";

  return (
    <section className="page-section">
      <SectionHeader title="Odalar" meta={`${selectedRoom.name} · ${LEVEL_LABELS[energy]}`} />
      <RoomPicker rooms={state.rooms} selectedRoomId={selectedRoomId} onSelect={actions.setSelectedRoom} />
      <LevelFilter value={energy} onChange={actions.setEnergy} />
      <TaskList
        title={selectedRoom.name}
        tasks={selectedRoom.tasks}
        levelFilter={energy}
        onToggle={(taskId) => actions.toggleRoomTask(selectedRoom.id, taskId)}
      />
    </section>
  );
}

function RoutinesPage({ state, actions }) {
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

function FocusPage({ state, actions }) {
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

function QuickPage({ state }) {
  const [task, setTask] = useState(() => getRandomQuickTask());
  const [doneCount, setDoneCount] = useState(0);
  const dailyStats = getTaskStats(state);

  return (
    <section className="page-section">
      <SectionHeader title="Dopamin" meta={`${dailyStats.done} tamamlandı`} />
      <div className="quick-panel">
        <p className="quick-kicker">5 dakikalık görev</p>
        <h2>{task}</h2>
        <div className="quick-actions">
          <button
            type="button"
            className="primary-action"
            onClick={() => {
              setDoneCount((count) => count + 1);
              setTask(getRandomQuickTask());
            }}
          >
            Bitirdim
          </button>
          <button type="button" className="secondary-action" onClick={() => setTask(getRandomQuickTask())}>
            Değiştir
          </button>
        </div>
        <p className="quick-count">{doneCount} kısa görev</p>
      </div>
    </section>
  );
}

function SettingsPage({ state, actions, stats }) {
  return (
    <section className="page-section">
      <SectionHeader title="Ayarlar" meta="Yerel kayıt" />
      <div className="settings-grid">
        <div className="settings-panel">
          <h2>Günlük reset</h2>
          <p>Son reset: {state.meta.lastResetDate || "bugün"}</p>
          <p>Bugünkü tikler: {stats.done}</p>
          <button type="button" className="danger-action" onClick={actions.clearToday}>
            Bugünkü tikleri temizle
          </button>
        </div>
        <div className="settings-panel">
          <h2>Varsayılan oda</h2>
          <select
            className="select-input"
            value={state.ui.selectedRoomId}
            onChange={(event) => actions.setSelectedRoom(event.target.value)}
          >
            {ROOM_ORDER.map((roomId) => (
              <option value={roomId} key={roomId}>
                {state.rooms[roomId]?.name || roomId}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, meta }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      <span>{meta}</span>
    </div>
  );
}

function RoomPicker({ rooms, selectedRoomId, onSelect }) {
  return (
    <div className="pill-row" aria-label="Odalar">
      {ROOM_ORDER.map((roomId) => {
        const room = rooms[roomId];
        if (!room) return null;
        return (
          <button
            type="button"
            className={`pill-button ${selectedRoomId === roomId ? "is-active" : ""}`}
            onClick={() => onSelect(roomId)}
            key={roomId}
          >
            {room.name}
          </button>
        );
      })}
    </div>
  );
}

function LevelFilter({ value, onChange }) {
  return (
    <div className="level-row" aria-label="Enerji seviyesi">
      {LEVELS.map((level) => (
        <button
          type="button"
          className={`level-button tone-${level.tone} ${value === level.id ? "is-active" : ""}`}
          onClick={() => onChange(level.id)}
          key={level.id}
        >
          <span aria-hidden="true" />
          {level.label}
        </button>
      ))}
    </div>
  );
}

function SegmentedControl({ value, onChange, options }) {
  return (
    <div className="segmented-control">
      {options.map((option) => (
        <button
          type="button"
          className={value === option.value ? "is-active" : ""}
          onClick={() => onChange(option.value)}
          key={option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function TaskList({ title, tasks, levelFilter, onToggle }) {
  const filteredTasks = levelFilter === "all" ? tasks : tasks.filter((task) => task.level === levelFilter);
  const completed = filteredTasks.filter((task) => task.done).length;

  return (
    <div className="task-panel">
      <div className="task-panel-header">
        <div>
          <h2>{title}</h2>
          <span>
            {completed}/{filteredTasks.length}
          </span>
        </div>
        <div className="mini-progress" aria-hidden="true">
          <span style={{ width: `${filteredTasks.length ? (completed / filteredTasks.length) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="empty-state">Bu seviyede görev yok.</p>
        ) : (
          filteredTasks.map((task) => <TaskItem task={task} onToggle={onToggle} key={task.id} />)
        )}
      </div>
    </div>
  );
}

function TaskItem({ task, onToggle }) {
  const status = getTaskStatus(task);

  return (
    <button
      type="button"
      className={`task-item is-${status} ${task.done ? "is-done" : ""}`}
      onClick={() => onToggle(task.id)}
      aria-pressed={task.done}
    >
      <span className="check-dot" aria-hidden="true">
        {status === "done" ? "✓" : status === "paused" ? "…" : status === "started" ? "•" : ""}
      </span>
      <span className="task-title">{task.title}</span>
      {task.level && <span className={`level-chip level-chip-${task.level}`}>{LEVEL_LABELS[task.level]}</span>}
    </button>
  );
}

function PomodoroPanel({ selectedTask }) {
  const [phase, setPhase] = useState("focus");
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    intervalRef.current = window.setInterval(() => {
      setRemaining((seconds) => {
        if (seconds > 1) return seconds - 1;
        const nextPhase = phase === "focus" ? "break" : "focus";
        setPhase(nextPhase);
        return nextPhase === "focus" ? 25 * 60 : 5 * 60;
      });
    }, 1000);

    return () => window.clearInterval(intervalRef.current);
  }, [phase, running]);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  const reset = () => {
    setRunning(false);
    setPhase("focus");
    setRemaining(25 * 60);
  };

  return (
    <div className="pomodoro-panel">
      <div className="pomodoro-meta">
        <span className={`phase-badge phase-${phase}`}>{phase === "focus" ? "Odak" : "Mola"}</span>
        {selectedTask && <span className="bound-task">{selectedTask}</span>}
      </div>
      <div className="pomodoro-time">
        {minutes}:{seconds}
      </div>
      <div className="pomodoro-actions">
        <button type="button" className="primary-action" onClick={() => setRunning((value) => !value)}>
          {running ? "Duraklat" : "Başlat"}
        </button>
        <button type="button" className="secondary-action" onClick={reset}>
          Sıfırla
        </button>
      </div>
    </div>
  );
}

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

export default App;
