import { useState } from "react";
import { QUICK_TASKS } from "../../data.js";
import { getTaskStats } from "../../state.js";
import { getRandomQuickIndex } from "../lib/taskCards.js";
import { SectionHeader } from "../components/ui.jsx";
import { useT } from "../i18n/useT.js";

export function DopamineView({ state }) {
  const t = useT();
  const [taskIndex, setTaskIndex] = useState(() => getRandomQuickIndex());
  const [doneCount, setDoneCount] = useState(0);
  const dailyStats = getTaskStats(state);

  return (
    <section className="page-section">
      <SectionHeader title={t("quick.title")} meta={t("quick.metaDone", { n: dailyStats.done })} />
      <div className="quick-panel">
        <p className="quick-kicker">{t("quick.kicker")}</p>
        <h2>{t.quick(taskIndex, QUICK_TASKS[taskIndex])}</h2>
        <div className="quick-actions">
          <button
            type="button"
            className="primary-action"
            onClick={() => {
              setDoneCount((count) => count + 1);
              setTaskIndex(getRandomQuickIndex());
            }}
          >
            {t("quick.done")}
          </button>
          <button type="button" className="secondary-action" onClick={() => setTaskIndex(getRandomQuickIndex())}>
            {t("quick.change")}
          </button>
        </div>
        <p className="quick-count">{t("quick.count", { n: doneCount })}</p>
      </div>
    </section>
  );
}
