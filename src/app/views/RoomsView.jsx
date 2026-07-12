import { DEFAULT_ROOMS } from "../../data.js";
import { LevelFilter, RoomPicker, SectionHeader } from "../components/ui.jsx";
import { TaskList } from "../components/TaskListPanel.jsx";
import { useT } from "../i18n/useT.js";

export function RoomsView({ state, actions }) {
  const t = useT();
  const selectedRoomId = state.ui.selectedRoomId;
  const selectedRoom = state.rooms[selectedRoomId] || DEFAULT_ROOMS[selectedRoomId];
  const energy = state.ui.energy || "light";
  const roomName = t.room(selectedRoom.id, selectedRoom.name);

  return (
    <section className="page-section">
      <SectionHeader title={t("rooms.title")} meta={`${roomName} · ${t(`levels.${energy}`)}`} />
      <RoomPicker rooms={state.rooms} selectedRoomId={selectedRoomId} onSelect={actions.setSelectedRoom} />
      <LevelFilter value={energy} onChange={actions.setEnergy} />
      <TaskList
        title={roomName}
        tasks={selectedRoom.tasks}
        levelFilter={energy}
        onToggle={(taskId) => actions.toggleRoomTask(selectedRoom.id, taskId)}
        titleFor={(task) => t.task(`${selectedRoom.id}:${task.id}`, task.title)}
      />
    </section>
  );
}
