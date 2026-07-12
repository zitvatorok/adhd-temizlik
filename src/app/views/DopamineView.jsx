import { useState } from "react";
import { QUICK_TASKS } from "../../data.js";
import { getRandomQuickIndex } from "../lib/taskCards.js";
import { useT } from "../i18n/useT.js";

export function DopamineView() {
  const t = useT();
  const [taskIndex, setTaskIndex] = useState(() => getRandomQuickIndex());
  const [doneCount, setDoneCount] = useState(0);

  return (
    <div className="view">
      <div className="dopa-stage">
        <span className="dopa-kicker">{t("quick.roll")}</span>
        <h2 className="dopa-task">{t.quick(taskIndex, QUICK_TASKS[taskIndex])}</h2>
        <span className="dopa-meta">{t("quick.meta")}</span>
        <div className="dopa-actions">
          <button
            type="button"
            className="btn btn-lg btn-clay"
            onClick={() => {
              setDoneCount((count) => count + 1);
              setTaskIndex(getRandomQuickIndex());
            }}
          >
            {t("quick.done")}
          </button>
          <button type="button" className="btn btn-lg btn-ghost" onClick={() => setTaskIndex(getRandomQuickIndex())}>
            {t("quick.change")}
          </button>
        </div>
        {doneCount > 0 && (
          <div className="dopa-hist">
            <div className="mini-stamps" aria-hidden="true">
              {Array.from({ length: Math.min(doneCount, 8) }).map((_, index) => (
                <i key={index} />
              ))}
            </div>
            <span>{t("quick.count", { n: doneCount })}</span>
          </div>
        )}
      </div>
    </div>
  );
}
