export function RoutineTabs({ active, onChange }) {
  return (
    <div className="chip-group">
      <button
        type="button"
        className={`chip tap-target ${active === 'daily' ? 'chip--active' : ''}`}
        onClick={() => onChange('daily')}
      >
        Günlük
      </button>
      <button
        type="button"
        className={`chip tap-target ${active === 'weekly' ? 'chip--active' : ''}`}
        onClick={() => onChange('weekly')}
      >
        Haftalık
      </button>
    </div>
  )
}

