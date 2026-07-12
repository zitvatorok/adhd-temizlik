import { Icon } from "./icons.jsx";
import { useT } from "../i18n/useT.js";

const TAB_IDS = ["today", "rooms", "routines", "focus", "quick"];

export function TabBar({ activeTab, onChange }) {
  const t = useT();

  return (
    <nav className="tabbar">
      <div className="tabbar-inner">
        {TAB_IDS.map((id) => (
          <button
            type="button"
            className={`tab ${activeTab === id ? "is-active" : ""}`}
            onClick={() => onChange(id)}
            key={id}
            aria-current={activeTab === id ? "page" : undefined}
          >
            <Icon name={id} />
            <span>{t(`tabs.${id}`)}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
