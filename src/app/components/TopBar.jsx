import { useT } from "../i18n/useT.js";

function ProgressRing({ value }) {
  return (
    <div className="progress-ring" style={{ "--progress": `${value}%` }} role="img" aria-label={`${value}%`}>
      <span>{value}</span>
    </div>
  );
}

export function TopBar({ stats }) {
  const t = useT();
  const today = new Date().toLocaleDateString(t.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const dailyDone = Math.min(stats.done, 3);
  const dailyProgress = Math.min(100, Math.round((dailyDone / 3) * 100));

  return (
    <header className="top-bar">
      <div className="top-copy">
        <p className="app-kicker">{t("topbar.kicker")}</p>
        <p className="eyebrow">{today}</p>
        <h1>Piling Up</h1>
        <p className="top-note">{t("topbar.note")}</p>
      </div>

      <div className="summary-strip">
        <ProgressRing value={dailyProgress} />
        <div className="summary-copy">
          <strong>
            {dailyDone}/3
          </strong>
          <span>{t("topbar.step")}</span>
        </div>
        <div className="summary-copy hide-small">
          <strong>00:00</strong>
          <span>{t("topbar.clean")}</span>
        </div>
      </div>
    </header>
  );
}
