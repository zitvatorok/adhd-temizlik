import { ROOM_IDS } from '../../data/defaultRooms'

const ROOM_ORDER = [
  ROOM_IDS.ENTREE,
  ROOM_IDS.LIVING,
  ROOM_IDS.KITCHEN,
  ROOM_IDS.GUEST_BATHROOM,
  ROOM_IDS.STUDY,
  ROOM_IDS.KIDS,
  ROOM_IDS.BEDROOM,
  ROOM_IDS.PARENT_BATHROOM,
]

export function RoomSelector({ rooms, selectedRoomId, onSelect }) {
  return (
    <div className="chip-group">
      {ROOM_ORDER.map((id) => {
        const room = rooms[id]
        if (!room) return null
        const isActive = id === selectedRoomId
        return (
          <button
            key={id}
            type="button"
            className={`chip tap-target ${isActive ? 'chip--active' : ''}`}
            onClick={() => onSelect(id)}
          >
            {room.name}
          </button>
        )
      })}
    </div>
  )
}

