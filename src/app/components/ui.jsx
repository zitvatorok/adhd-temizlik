import { ROOM_ORDER } from "../../data.js";
import { useT } from "../i18n/useT.js";

export function Seg({ value, onChange, options }) {
  return (
    <div className="seg">
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

export function ChipRow({ value, onChange, options }) {
  return (
    <div className="chiprow">
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

export function RoomPills({ rooms, selectedRoomId, onSelect }) {
  const t = useT();

  return (
    <div className="roompills">
      {ROOM_ORDER.map((roomId) => {
        const room = rooms[roomId];
        if (!room) return null;
        return (
          <button
            type="button"
            className={selectedRoomId === roomId ? "is-active" : ""}
            onClick={() => onSelect(roomId)}
            key={roomId}
          >
            {t.room(roomId, room.name)}
          </button>
        );
      })}
    </div>
  );
}
