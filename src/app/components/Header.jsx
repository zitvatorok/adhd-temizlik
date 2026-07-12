import { Icon } from "./icons.jsx";
import { useT } from "../i18n/useT.js";

function PileMeter({ done, total }) {
  const widths = [26, 22, 18];

  return (
    <div className="pile-wrap">
      <div className="pile" aria-hidden="true">
        {widths.map((width, index) => (
          <i
            className={index < done ? "" : "is-empty"}
            style={{ width: `${width}px` }}
            key={width}
          />
        ))}
      </div>
      <span className="pile-count">
        {done}/{total}
      </span>
    </div>
  );
}

export function Header({ activeTab, state, stats, actions }) {
  const t = useT();
  const isSettings = activeTab === "settings";
  const dailyDone = Math.min(stats.done, 3);

  const eyebrow =
    activeTab === "today"
      ? new Date()
          .toLocaleDateString(t.locale, { weekday: "long", day: "numeric", month: "long" })
          .toLocaleUpperCase(t.locale)
      : t(`${activeTab === "quick" ? "quick" : activeTab}.eyebrow`);

  const selectedRoom = state.rooms[state.ui.selectedRoomId];
  const roomDone = selectedRoom ? selectedRoom.tasks.filter((task) => task.done).length : 0;
  const roomTotal = selectedRoom ? selectedRoom.tasks.length : 0;

  const showTitle = ["today", "rooms", "routines", "settings"].includes(activeTab);
  const title = t(`tabs.${activeTab}`);

  return (
    <header className="hdr">
      <div className="hdr-top">
        {isSettings ? (
          <button
            type="button"
            className="hdr-btn hdr-back"
            onClick={() => actions.setActiveTab("today")}
            aria-label={t("settings.back")}
          >
            <Icon name="back" size={20} />
          </button>
        ) : (
          <span className="hdr-eyebrow">{eyebrow}</span>
        )}
        {isSettings ? (
          <span className="hdr-eyebrow">{t("settings.eyebrow")}</span>
        ) : (
          <button
            type="button"
            className="hdr-btn"
            onClick={() => actions.setActiveTab("settings")}
            aria-label={t("tabs.settings")}
          >
            <Icon name="gear" size={20} />
          </button>
        )}
      </div>

      {showTitle && (
        <div className="hdr-main">
          <h1 className="hdr-title">{title}</h1>
          {activeTab === "today" && <PileMeter done={dailyDone} total={3} />}
          {activeTab === "rooms" && selectedRoom && (
            <span className="hdr-meta">
              {t.room(selectedRoom.id, selectedRoom.name)} · {roomDone}/{roomTotal}
            </span>
          )}
        </div>
      )}

      {activeTab === "today" && <p className="hdr-sub">{t("today.sub")}</p>}
    </header>
  );
}
