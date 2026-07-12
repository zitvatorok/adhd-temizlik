import { TABS } from "../constants.js";
import { useT } from "../i18n/useT.js";

export function SideNav({ activeTab, onChange }) {
  const t = useT();

  return (
    <aside className="side-nav">
      <div className="brand">
        <span className="brand-mark">P</span>
        <div>
          <p className="brand-title">Piling Up</p>
          <p className="brand-subtitle">{t("brand.subtitle")}</p>
        </div>
      </div>

      <nav className="nav-list">
        {TABS.map((tab) => (
          <button
            type="button"
            className={`nav-button ${activeTab === tab.id ? "is-active" : ""}`}
            onClick={() => onChange(tab.id)}
            key={tab.id}
            title={t(`tabs.${tab.id}`)}
          >
            <span className="nav-icon" aria-hidden="true">
              {tab.icon}
            </span>
            <span>{t(`tabs.${tab.id}`)}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export function BottomNav({ activeTab, onChange }) {
  const t = useT();

  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          type="button"
          className={`bottom-nav-button ${activeTab === tab.id ? "is-active" : ""}`}
          onClick={() => onChange(tab.id)}
          key={tab.id}
          title={t(`tabs.${tab.id}`)}
        >
          <span className="nav-icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span>{t(`tabs.${tab.id}`)}</span>
        </button>
      ))}
    </nav>
  );
}
