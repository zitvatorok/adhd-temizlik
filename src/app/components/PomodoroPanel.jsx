import { useEffect, useRef, useState } from "react";

export function PomodoroPanel({ selectedTask }) {
  const [phase, setPhase] = useState("focus");
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    intervalRef.current = window.setInterval(() => {
      setRemaining((seconds) => {
        if (seconds > 1) return seconds - 1;
        const nextPhase = phase === "focus" ? "break" : "focus";
        setPhase(nextPhase);
        return nextPhase === "focus" ? 25 * 60 : 5 * 60;
      });
    }, 1000);

    return () => window.clearInterval(intervalRef.current);
  }, [phase, running]);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  const reset = () => {
    setRunning(false);
    setPhase("focus");
    setRemaining(25 * 60);
  };

  return (
    <div className="pomodoro-panel">
      <div className="pomodoro-meta">
        <span className={`phase-badge phase-${phase}`}>{phase === "focus" ? "Odak" : "Mola"}</span>
        {selectedTask && <span className="bound-task">{selectedTask}</span>}
      </div>
      <div className="pomodoro-time">
        {minutes}:{seconds}
      </div>
      <div className="pomodoro-actions">
        <button type="button" className="primary-action" onClick={() => setRunning((value) => !value)}>
          {running ? "Duraklat" : "Başlat"}
        </button>
        <button type="button" className="secondary-action" onClick={reset}>
          Sıfırla
        </button>
      </div>
    </div>
  );
}
