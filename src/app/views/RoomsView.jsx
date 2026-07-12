import { DEFAULT_ROOMS } from "../../data.js";
import { LEVELS } from "../constants.js";
import { RoomPills, Seg } from "../components/ui.jsx";
import { TaskList } from "../components/TaskListPanel.jsx";
import { useT } from "../i18n/useT.js";

export function RoomsView({ state, actions }) {
  const t = useT();
  const selectedRoomId = state.ui.selectedRoomId;
  const selectedRoom = state.rooms[selectedRoomId] || DEFAULT_ROOMS[selectedRoomId];
  const energy = state.ui.energy || "light";

  return (
    <div className="view">
      <RoomPills rooms={state.rooms} selectedRoomId={selectedRoomId} onSelect={actions.setSelectedRoom} />
      <Seg
        value={energy}
        onChange={actions.setEnergy}
        options={LEVELS.map((level) => ({ value: level.id, label: t(`levels.${level.id}`) }))}
      />
      <TaskList
        title={t.room(selectedRoom.id, selectedRoom.name)}
        tasks={selectedRoom.tasks}
        levelFilter={energy}
        onToggle={(taskId) => actions.toggleRoomTask(selectedRoom.id, taskId)}
        titleFor={(task) => t.task(`${selectedRoom.id}:${task.id}`, task.title)}
      />
    </div>
  );
}
