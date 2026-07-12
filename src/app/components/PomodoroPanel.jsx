import { useEffect, useRef, useState } from "react";
import { useT } from "../i18n/useT.js";

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

export function PomodoroPanel({ selectedTask }) {
  const t = useT();
  const [phase, setPhase] = useState("focus");
  const [remaining, setRemaining] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    intervalRef.current = window.setInterval(() => {
      setRemaining((seconds) => {
        if (seconds > 1) return seconds - 1;
        const nextPhase = phase === "focus" ? "break" : "focus";
        setPhase(nextPhase);
        return nextPhase === "focus" ? FOCUS_SECONDS : BREAK_SECONDS;
      });
    }, 1000);

    return () => window.clearInterval(intervalRef.current);
  }, [phase, running]);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  const total = phase === "focus" ? FOCUS_SECONDS : BREAK_SECONDS;
  const progress = Math.round(((total - remaining) / total) * 100);

  const reset = () => {
    setRunning(false);
    setPhase("focus");
    setRemaining(FOCUS_SECONDS);
  };

  return (
    <div className="focus-stage">
      <span className="phase-pill">
        {(phase === "focus" ? t("focus.phaseFocus") : t("focus.phaseBreak")).toLocaleUpperCase(t.locale)}
      </span>
      <div className="timer">
        {minutes}:{seconds}
      </div>
      <span className="focus-bound">{selectedTask || t("focus.timeOnly")}</span>
      <div className="focus-bar" aria-hidden="true">
        <i style={{ width: `${progress}%` }} />
      </div>
      <div className="focus-actions">
        <button type="button" className="btn btn-lg btn-primary" onClick={() => setRunning((value) => !value)}>
          {running ? t("focus.pause") : t("focus.start")}
        </button>
        <button type="button" className="btn btn-lg btn-ghost" onClick={reset}>
          {t("focus.reset")}
        </button>
      </div>
    </div>
  );
}
