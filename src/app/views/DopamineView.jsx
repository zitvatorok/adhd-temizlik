import { useState } from "react";
import { getTaskStats } from "../../state.js";
import { getRandomQuickTask } from "../lib/taskCards.js";
import { SectionHeader } from "../components/ui.jsx";

export function DopamineView({ state }) {
  const [task, setTask] = useState(() => getRandomQuickTask());
  const [doneCount, setDoneCount] = useState(0);
  const dailyStats = getTaskStats(state);

  return (
    <section className="page-section">
      <SectionHeader title="Dopamin" meta={`${dailyStats.done} tamamlandı`} />
      <div className="quick-panel">
        <p className="quick-kicker">5 dakikalık görev</p>
        <h2>{task}</h2>
        <div className="quick-actions">
          <button
            type="button"
            className="primary-action"
            onClick={() => {
              setDoneCount((count) => count + 1);
              setTask(getRandomQuickTask());
            }}
          >
            Bitirdim
          </button>
          <button type="button" className="secondary-action" onClick={() => setTask(getRandomQuickTask())}>
            Değiştir
          </button>
        </div>
        <p className="quick-count">{doneCount} kısa görev</p>
      </div>
    </section>
  );
}
