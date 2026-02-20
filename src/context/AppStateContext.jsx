import { createContext, useContext, useMemo } from 'react'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import { useDailyReset } from '../hooks/useDailyReset'
import { defaultRooms, ROOM_IDS } from '../data/defaultRooms'
import { defaultRoutines } from '../data/defaultRoutines'

// Versiyon değiştirildiğinde, uygulama localStorage'dan taze state yükler.
// Yeni odalar / görev yapıları eklendiğinde bu anahtarı arttır.
const STORAGE_KEY = 'adhd-cleaning-app-state-v2'

const AppStateContext = createContext(null)

const initialState = {
  rooms: defaultRooms,
  routines: {
    daily: defaultRoutines.daily,
    weekly: defaultRoutines.weekly,
    lastDailyReset: null,
    lastWeeklyReset: null,
  },
  progress: {
    daily: [],
    weekly: [],
  },
  pomodoro: {
    boundTaskId: null,
  },
  ui: {
    selectedRoomId: ROOM_IDS.KITCHEN,
  },
}

function migrateState(state) {
  if (!state || !state.rooms) return initialState
  
  // Eksik odaları defaultRooms'tan ekle
  const migratedRooms = { ...defaultRooms }
  for (const [roomId, defaultRoom] of Object.entries(defaultRooms)) {
    if (state.rooms[roomId]) {
      // Mevcut odayı koru ama eksik görevleri ekle
      const existingRoom = state.rooms[roomId]
      const existingTaskIds = new Set(existingRoom.tasks?.map((t) => t.id) || [])
      const defaultTasks = defaultRoom.tasks || []
      const newTasks = defaultTasks.filter((t) => !existingTaskIds.has(t.id))
      migratedRooms[roomId] = {
        ...existingRoom,
        tasks: [...(existingRoom.tasks || []), ...newTasks],
      }
    }
  }

  return {
    ...initialState,
    ...state,
    rooms: migratedRooms,
    routines: {
      ...initialState.routines,
      ...(state.routines || {}),
      daily: state.routines?.daily || initialState.routines.daily,
      weekly: state.routines?.weekly || initialState.routines.weekly,
    },
    progress: {
      ...initialState.progress,
      ...(state.progress || {}),
    },
    ui: {
      ...initialState.ui,
      ...(state.ui || {}),
      selectedRoomId: state.ui?.selectedRoomId || initialState.ui.selectedRoomId,
    },
  }
}

export function AppStateProvider({ children }) {
  const [rawState, setRawState] = useLocalStorageState(STORAGE_KEY, initialState)
  const state = migrateState(rawState)

  const setStateWithMigration = (updater) => {
    setRawState((prev) => {
      const migrated = migrateState(prev)
      const updated = typeof updater === 'function' ? updater(migrated) : updater
      return updated
    })
  }

  useDailyReset(state, setStateWithMigration)

  const value = useMemo(() => {
    const toggleRoomTask = (roomId, taskId) => {
      setRawState((prev) => {
        const migrated = migrateState(prev)
        const room = migrated.rooms[roomId]
        if (!room) return migrated
        return {
          ...migrated,
          rooms: {
            ...migrated.rooms,
            [roomId]: {
              ...room,
              tasks: room.tasks.map((t) =>
                t.id === taskId ? { ...t, done: !t.done } : t,
              ),
            },
          },
        }
      })
    }

    const toggleRoutineTask = (kind, taskId) => {
      setRawState((prev) => {
        const migrated = migrateState(prev)
        const list = migrated.routines[kind]
        if (!list) return migrated
        return {
          ...migrated,
          routines: {
            ...migrated.routines,
            [kind]: list.map((t) =>
              t.id === taskId ? { ...t, done: !t.done } : t,
            ),
          },
        }
      })
    }

    const setSelectedRoom = (roomId) => {
      setRawState((prev) => {
        const migrated = migrateState(prev)
        return {
          ...migrated,
          ui: {
            ...migrated.ui,
            selectedRoomId: roomId,
          },
        }
      })
    }

    const bindPomodoroToTask = (taskId) => {
      setRawState((prev) => {
        const migrated = migrateState(prev)
        return {
          ...migrated,
          pomodoro: {
            ...migrated.pomodoro,
            boundTaskId: taskId,
          },
        }
      })
    }

    return {
      state,
      actions: {
        toggleRoomTask,
        toggleRoutineTask,
        setSelectedRoom,
        bindPomodoroToTask,
      },
    }
  }, [setRawState, state])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return ctx
}

