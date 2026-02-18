import { TaskList } from '../Tasks/TaskList.jsx'

export function RoomTaskList({ room, onToggleTask, levelFilter }) {
  if (!room) return null
  return (
    <TaskList
      title={room.name}
      tasks={room.tasks}
      levelFilter={levelFilter}
      showLevelLegend
      onToggle={(taskId) => onToggleTask(room.id, taskId)}
    />
  )
}

