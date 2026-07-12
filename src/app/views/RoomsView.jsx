import { DEFAULT_ROOMS } from "../../data.js";
import { LEVEL_LABELS } from "../constants.js";
import { LevelFilter, RoomPicker, SectionHeader } from "../components/ui.jsx";
import { TaskList } from "../components/TaskListPanel.jsx";

export function RoomsView({ state, actions }) {
  const selectedRoomId = state.ui.selectedRoomId;
  const selectedRoom = state.rooms[selectedRoomId] || DEFAULT_ROOMS[selectedRoomId];
  const energy = state.ui.energy || "light";

  return (
    <section className="page-section">
      <SectionHeader title="Odalar" meta={`${selectedRoom.name} · ${LEVEL_LABELS[energy]}`} />
      <RoomPicker rooms={state.rooms} selectedRoomId={selectedRoomId} onSelect={actions.setSelectedRoom} />
      <LevelFilter value={energy} onChange={actions.setEnergy} />
      <TaskList
        title={selectedRoom.name}
        tasks={selectedRoom.tasks}
        levelFilter={energy}
        onToggle={(taskId) => actions.toggleRoomTask(selectedRoom.id, taskId)}
      />
    </section>
  );
}
