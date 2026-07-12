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

export function TopBar({ stats }) {
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
