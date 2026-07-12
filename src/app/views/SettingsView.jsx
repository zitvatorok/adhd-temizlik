import { ROOM_ORDER } from "../../data.js";
import { SectionHeader } from "../components/ui.jsx";

export function SettingsView({ state, actions, stats }) {
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
