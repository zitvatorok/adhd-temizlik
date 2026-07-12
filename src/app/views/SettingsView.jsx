import { ROOM_ORDER } from "../../data.js";
import { useT } from "../i18n/useT.js";

export function SettingsView({ state, actions, stats }) {
  const t = useT();

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
