import { LEVELS } from "../constants.js";
import { ROOM_ORDER } from "../../data.js";

export function SectionHeader({ title, meta }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      <span>{meta}</span>
    </div>
  );
}

export function ChoiceRow({ label, value, onChange, options }) {
  return (
    <div className="choice-row">
      <span>{label}</span>
      <div>
        {options.map((option) => (
          <button
            type="button"
            className={value === option.value ? "is-active" : ""}
            onClick={() => onChange(option.value)}
            key={option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SegmentedControl({ value, onChange, options }) {
  return (
    <div className="segmented-control">
      {options.map((option) => (
        <button
          type="button"
          className={value === option.value ? "is-active" : ""}
          onClick={() => onChange(option.value)}
          key={option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function RoomPicker({ rooms, selectedRoomId, onSelect }) {
  return (
    <div className="pill-row" aria-label="Odalar">
      {ROOM_ORDER.map((roomId) => {
        const room = rooms[roomId];
        if (!room) return null;
        return (
          <button
            type="button"
            className={`pill-button ${selectedRoomId === roomId ? "is-active" : ""}`}
            onClick={() => onSelect(roomId)}
            key={roomId}
          >
            {room.name}
          </button>
        );
      })}
    </div>
  );
}

export function LevelFilter({ value, onChange }) {
  return (
    <div className="level-row" aria-label="Enerji seviyesi">
      {LEVELS.map((level) => (
        <button
          type="button"
          className={`level-button tone-${level.tone} ${value === level.id ? "is-active" : ""}`}
          onClick={() => onChange(level.id)}
          key={level.id}
        >
          <span aria-hidden="true" />
          {level.label}
        </button>
      ))}
    </div>
  );
}
