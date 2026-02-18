import { TaskList } from '../Tasks/TaskList.jsx'

export function RoutineList({ kind, routines, onToggle, levelFilter }) {
  const title = kind === 'daily' ? 'Günlük rutin' : 'Haftalık rutin'

  return (
    <TaskList
      title={title}
      tasks={routines}
      levelFilter={levelFilter}
      showLevelLegend
      onToggle={(taskId) => onToggle(kind, taskId)}
    />
  )
}

