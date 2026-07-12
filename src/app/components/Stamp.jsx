import { Icon } from "./icons.jsx";

/** Deterministik mühür açısı: aynı görev her zaman aynı eğimle damgalanır (-7°…+5°). */
function stampAngle(id) {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) % 1000003;
  }
  return (hash % 13) - 7;
}

export function Stamp({ status, taskId, onClick, label }) {
  const isDone = status === "done";
  const className = `stamp ${
    isDone ? "is-done" : status === "started" ? "is-started" : status === "paused" ? "is-paused" : ""
  }`;
  const style = isDone ? { "--stamp-rot": `${stampAngle(taskId)}deg` } : undefined;
  const mark = isDone && <Icon name="check" size={14} strokeWidth={3} />;

  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        style={style}
        onClick={onClick}
        aria-pressed={isDone}
        aria-label={label}
      >
        {mark}
      </button>
    );
  }

  return (
    <span className={className} style={style} aria-hidden="true">
      {mark}
    </span>
  );
}
