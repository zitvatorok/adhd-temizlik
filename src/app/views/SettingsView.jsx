import { ROOM_ORDER } from "../../data.js";
import { isReminderSupported, syncReminder } from "../native/notifications.js";
import { useT } from "../i18n/useT.js";

export function SettingsView({ state, actions, stats }) {
  const t = useT();
  const reminder = state.ui.reminder || { enabled: false, hour: 19, minute: 0 };

  const applyReminder = async (next) => {
    actions.setReminder(next);
    const ok = await syncReminder(next, { title: t("reminder.title"), body: t("reminder.body") });
    if (next.enabled && !ok) {
      actions.setReminder({ ...next, enabled: false });
    }
  };

  return (
    <div className="view">
      <div className="set-panel">
        <h2>{t("settings.language")}</h2>
        <select
          className="select"
          value={state.ui.language || "system"}
          onChange={(event) => actions.setLanguage(event.target.value)}
        >
          <option value="system">{t("settings.lang.system")}</option>
          <option value="tr">{t("settings.lang.tr")}</option>
          <option value="en">{t("settings.lang.en")}</option>
        </select>
      </div>

      <div className="set-panel">
        <h2>{t("settings.theme")}</h2>
        <select
          className="select"
          value={state.ui.theme || "system"}
          onChange={(event) => actions.setTheme(event.target.value)}
        >
          <option value="system">{t("settings.theme.system")}</option>
          <option value="light">{t("settings.theme.light")}</option>
          <option value="dark">{t("settings.theme.dark")}</option>
        </select>
      </div>

      <div className="set-panel">
        <h2>{t("settings.defaultRoom")}</h2>
        <select
          className="select"
          value={state.ui.selectedRoomId}
          onChange={(event) => actions.setSelectedRoom(event.target.value)}
        >
          {ROOM_ORDER.map((roomId) => (
            <option value={roomId} key={roomId}>
              {t.room(roomId, state.rooms[roomId]?.name || roomId)}
            </option>
          ))}
        </select>
      </div>

      {isReminderSupported() && (
        <div className="set-panel">
          <div className="set-row">
            <h2>{t("settings.reminder")}</h2>
            <label className="switch">
              <input
                type="checkbox"
                checked={reminder.enabled}
                onChange={(event) => applyReminder({ ...reminder, enabled: event.target.checked })}
              />
              <i aria-hidden="true" />
            </label>
          </div>
          <p className="set-note">{t("settings.reminderHint")}</p>
          {reminder.enabled && (
            <input
              type="time"
              className="select"
              value={`${String(reminder.hour).padStart(2, "0")}:${String(reminder.minute).padStart(2, "0")}`}
              onChange={(event) => {
                const [hour, minute] = event.target.value.split(":").map(Number);
                applyReminder({ ...reminder, hour, minute });
              }}
            />
          )}
        </div>
      )}

      <div className="set-panel">
        <h2>{t("settings.resetTitle")}</h2>
        <p>{t("settings.lastReset", { date: state.meta.lastResetDate || t("settings.today") })}</p>
        <p>{t("settings.todayTicks", { n: stats.done })}</p>
        <div>
          <button type="button" className="btn btn-sm btn-danger" onClick={actions.clearToday}>
            {t("settings.clear")}
          </button>
        </div>
      </div>
    </div>
  );
}
