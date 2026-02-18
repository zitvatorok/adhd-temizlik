import { useState } from 'react'
import { CelebrationConfetti } from './CelebrationConfetti.jsx'
import { useTaskTimer } from '../../hooks/useTaskTimer.js'

export function TaskItem({ task, onToggle }) {
  const [lastCompletedId, setLastCompletedId] = useState(null)
  const [showTimer, setShowTimer] = useState(false)
  const timer = useTaskTimer(task.level || 'light')

  const handleToggle = () => {
    const willComplete = !task.done
    onToggle(task.id)
    if (willComplete) {
      setLastCompletedId(task.id + Date.now())
      timer.reset()
      setShowTimer(false)
    }
  }

  const handleTimerClick = (e) => {
    e.stopPropagation()
    if (!showTimer) {
      setShowTimer(true)
      timer.start()
    } else if (timer.isRunning) {
      timer.pause()
    } else {
      timer.start()
    }
  }

  return (
    <>
      <div className="task-item-wrapper">
        <button
          type="button"
          className={`task-item tap-target ${task.done ? 'task-item--done' : ''}`}
          onClick={handleToggle}
        >
          <div className="task-item-checkbox" aria-hidden="true">
            {task.done ? '✓' : ''}
          </div>
          <div className="task-item-body">
            <span className="task-item-title">{task.title}</span>
          </div>
        </button>
        {!task.done && task.level && (
          <button
            type="button"
            className={`task-timer-btn ${showTimer ? 'task-timer-btn--active' : ''} ${timer.isRunning ? 'task-timer-btn--running' : ''}`}
            onClick={handleTimerClick}
            title={`${task.level === 'light' ? '7' : task.level === 'medium' ? '15' : '30'} dakika zamanlayıcı`}
          >
            {showTimer ? (
              <span className="task-timer-time">
                {timer.minutes}:{timer.seconds}
              </span>
            ) : (
              <span className="task-timer-icon">⏱</span>
            )}
          </button>
        )}
      </div>
      <CelebrationConfetti triggerKey={lastCompletedId} />
    </>
  )
}

