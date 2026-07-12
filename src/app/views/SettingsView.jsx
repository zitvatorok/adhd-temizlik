import { ROOM_ORDER } from "../../data.js";
import { SectionHeader } from "../components/ui.jsx";
import { useT } from "../i18n/useT.js";

export function SettingsView({ state, actions, stats }) {
  const t = useT();

  return (
    <section className="page-section">
      <SectionHeader title={t("settings.title")} meta={t("settings.meta")} />
      <div className="settings-grid">
        <div className="settings-panel">
          <h2>{t("settings.language")}</h2>
          <select
            className="select-input"
            value={state.ui.language || "system"}
            onChange={(event) => actions.setLanguage(event.target.value)}
          >
            <option value="system">{t("settings.lang.system")}</option>
            <option value="tr">{t("settings.lang.tr")}</option>
            <option value="en">{t("settings.lang.en")}</option>
          </select>
        </div>
        <div className="settings-panel">
          <h2>{t("settings.resetTitle")}</h2>
          <p>{t("settings.lastReset", { date: state.meta.lastResetDate || t("settings.today") })}</p>
          <p>{t("settings.todayTicks", { n: stats.done })}</p>
          <button type="button" className="danger-action" onClick={actions.clearToday}>
            {t("settings.clear")}
          </button>
        </div>
        <div className="settings-panel">
          <h2>{t("settings.defaultRoom")}</h2>
          <select
            className="select-input"
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
      </div>
    </section>
  );
}
