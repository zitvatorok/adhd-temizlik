import { TABS } from "../constants.js";

export function SideNav({ activeTab, onChange }) {
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

export function BottomNav({ activeTab, onChange }) {
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
