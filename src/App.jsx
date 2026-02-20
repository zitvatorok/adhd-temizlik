import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import { AppStateProvider, useAppState } from './context/AppStateContext.jsx'
import { RoomSelector } from './components/Rooms/RoomSelector.jsx'
import { RoomTaskList } from './components/Rooms/RoomTaskList.jsx'
import { RoutineTabs } from './components/Routines/RoutineTabs.jsx'
import { RoutineList } from './components/Routines/RoutineList.jsx'
import { PomodoroTimer } from './components/Pomodoro/PomodoroTimer.jsx'
import { PomodoroTaskBinder } from './components/Pomodoro/PomodoroTaskBinder.jsx'
import { DopaminTemizlik } from './components/Dopamin/DopaminTemizlik.jsx'
import { CelebrationConfetti } from './components/Tasks/CelebrationConfetti.jsx'
import { ProgressChart } from './components/Progress/ProgressChart.jsx'
import { dopamin_odakli_gorev } from './utils/dopamin_odakli_gorev.js'

const TABS = {
  ROOMS: 'rooms',
  ROUTINES: 'routines',
  POMODORO: 'pomodoro',
  DOPAMIN: 'dopamin',
  SETTINGS: 'settings',
}

const TAB_IDS = [TABS.ROOMS, TABS.ROUTINES, TABS.POMODORO, TABS.DOPAMIN, TABS.SETTINGS]

function App() {
  return (
    <AppStateProvider>
      <AppShell />
    </AppStateProvider>
  )
}

function AppShell() {
  const [activeTab, setActiveTab] = useState(TABS.ROOMS)
  const scrollRef = useRef(null)
  const isScrollingProgrammatically = useRef(false)
  const index = TAB_IDS.indexOf(activeTab)

  // Açılışta tek rastgele görev (M4: lazy init, tek sefer)
  const [acilisGorevi, setAcilisGorevi] = useState(() => dopamin_odakli_gorev())
  const [gorevTamamlandi, setGorevTamamlandi] = useState(false)
  const [kutlamaKey, setKutlamaKey] = useState(0)

  const goreviBitirdim = useCallback(() => {
    setGorevTamamlandi(true)
    setKutlamaKey((k) => k + 1)
  }, [])

  const yeniGorev = useCallback(() => {
    setGorevTamamlandi(false)
    setAcilisGorevi(dopamin_odakli_gorev())
  }, [])

  useEffect(() => {
    if (!scrollRef.current) return
    isScrollingProgrammatically.current = true
    scrollRef.current.scrollTo({ left: index * scrollRef.current.clientWidth, behavior: 'smooth' })
    setTimeout(() => {
      isScrollingProgrammatically.current = false
    }, 300)
  }, [activeTab, index])

  const handleScroll = () => {
    if (isScrollingProgrammatically.current) return
    const el = scrollRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    const id = TAB_IDS[i]
    if (id != null && id !== activeTab) setActiveTab(id)
  }

  return (
    <div className="app-shell">
      <header className="app-header fade-in">
        <div className="app-header-content">
          <h1 className="app-title">Piling Up!</h1>
          <p className="app-subtitle">Küçük adımlar, gerçek ilerleme.</p>
          <MotivationBanner />
        </div>
      </header>

      <DopaminAcilisGorevi
        gorev={acilisGorevi}
        tamamlandi={gorevTamamlandi}
        kutlamaKey={kutlamaKey}
        onBitirdim={goreviBitirdim}
        onYeniGorev={yeniGorev}
      />

      <main className="app-main">
        <div
          ref={scrollRef}
          className="swipe-pages"
          onScroll={handleScroll}
          role="region"
          aria-label="Sayfalar arası kaydır"
        >
          <div className="swipe-page">
            <RoomsPage />
          </div>
          <div className="swipe-page">
            <RoutinesPage />
          </div>
          <div className="swipe-page">
            <PomodoroPage />
          </div>
          <div className="swipe-page">
            <DopaminPage />
          </div>
          <div className="swipe-page">
            <SettingsPage />
          </div>
        </div>
      </main>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}

function DopaminAcilisGorevi({ gorev, tamamlandi, kutlamaKey, onBitirdim, onYeniGorev }) {
  return (
    <div className="dopamin-acilis card-elevated">
      {!tamamlandi ? (
        <>
          <p className="dopamin-acilis-label">5 dakikalık görevin</p>
          <p className="dopamin-acilis-gorev">{gorev}</p>
          <button
            type="button"
            className="dopamin-acilis-btn tap-target"
            onClick={onBitirdim}
          >
            Bitirdim
          </button>
        </>
      ) : (
        <>
          <CelebrationConfetti triggerKey={kutlamaKey} />
          <p className="dopamin-acilis-kutlama">Harika! Tebrikler!</p>
          <p className="dopamin-acilis-kutlama-alt">Dopamin kazandın.</p>
          <button
            type="button"
            className="dopamin-acilis-btn tap-target"
            onClick={onYeniGorev}
          >
            Yeni görev al
          </button>
        </>
      )}
    </div>
  )
}

function MotivationBanner() {
  const messages = [
    'Sadece 5 dakikalık bir adım bile sayılır.',
    'Mükemmel değil, ilerleme önemli.',
    'Bugün sadece bir köşeyi düzeltmek bile yeter.',
  ]
  const index = new Date().getDate() % messages.length

  return <p className="motivation-text">{messages[index]}</p>
}

function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="bottom-nav card-elevated">
      <BottomNavItem
        label="Odalar"
        tabId={TABS.ROOMS}
        activeTab={activeTab}
        onChange={onChange}
      />
      <BottomNavItem
        label="Rutinler"
        tabId={TABS.ROUTINES}
        activeTab={activeTab}
        onChange={onChange}
      />
      <BottomNavItem
        label="Zamanlayıcı"
        tabId={TABS.POMODORO}
        activeTab={activeTab}
        onChange={onChange}
      />
      <BottomNavItem
        label="Dopamin"
        tabId={TABS.DOPAMIN}
        activeTab={activeTab}
        onChange={onChange}
      />
      <BottomNavItem
        label="Ayarlar"
        tabId={TABS.SETTINGS}
        activeTab={activeTab}
        onChange={onChange}
      />
    </nav>
  )
}

function BottomNavItem({ label, tabId, activeTab, onChange }) {
  const isActive = activeTab === tabId
  return (
    <button
      type="button"
      className={`bottom-nav-item tap-target ${isActive ? 'bottom-nav-item--active' : ''}`}
      onClick={() => onChange(tabId)}
    >
      <span className="bottom-nav-label">{label}</span>
    </button>
  )
}

function RoomsPage() {
  const {
    state: { rooms, ui },
    actions: { setSelectedRoom, toggleRoomTask },
  } = useAppState()
  const [levelFilter, setLevelFilter] = useState('light')

  const selectedRoom = rooms[ui.selectedRoomId]

  return (
    <section className="page fade-in">
      <h2 className="page-title">Odalara göre temizlik</h2>
      <p className="page-description">
        Sadece bir odayı seç ve küçük, yönetilebilir adımlarla ilerle.
      </p>
      <RoomSelector
        rooms={rooms}
        selectedRoomId={ui.selectedRoomId}
        onSelect={setSelectedRoom}
      />
      <LevelFilter value={levelFilter} onChange={setLevelFilter} />
      <RoomTaskList
        room={selectedRoom}
        levelFilter={levelFilter}
        onToggleTask={toggleRoomTask}
      />
    </section>
  )
}

function RoutinesPage() {
  const {
    state: { routines },
    actions: { toggleRoutineTask },
  } = useAppState()
  const [activeKind, setActiveKind] = useState('daily')
  const [levelFilter, setLevelFilter] = useState('light')

  return (
    <section className="page fade-in">
      <h2 className="page-title">Günlük & haftalık rutinler</h2>
      <p className="page-description">
        Tekrar eden işleri buradan takip edeceksin. Her gün otomatik sıfırlanacak.
      </p>
      
      <ProgressChart />
      
      <RoutineTabs active={activeKind} onChange={setActiveKind} />
      <RoutineList
        kind={activeKind}
        routines={routines[activeKind]}
        levelFilter={levelFilter}
        onToggle={toggleRoutineTask}
      />
      <LevelFilter value={levelFilter} onChange={setLevelFilter} />
    </section>
  )
}

function PomodoroPage() {
  return (
    <section className="page fade-in">
      <h2 className="page-title">Odak zamanlayıcısı</h2>
      <p className="page-description">
        25 dakika odaklan, 5 dakika mola ver. Görevlerine bağlanacak.
      </p>
      <PomodoroTimer />
      <PomodoroTaskBinder />
    </section>
  )
}

function DopaminPage() {
  return (
    <section className="page fade-in">
      <h2 className="page-title">Dopamin odaklı temizlik</h2>
      <p className="page-description">
        5 dakikalık rastgele bir görev al, bitirince kutlama senin.
      </p>
      <DopaminTemizlik />
    </section>
  )
}

function SettingsPage() {
  return (
    <section className="page fade-in">
      <h2 className="page-title">Ayarlar</h2>
      <p className="page-description">
        Animasyonlar, sesler ve varsayılan oda gibi ayarlar burada olacak.
      </p>
      <div className="placeholder-card card-elevated">
        <p>Basit ayarlar paneli sonraki adımda.</p>
      </div>
    </section>
  )
}

function LevelFilter({ value, onChange }) {
  return (
    <div className="level-filter">
      <span className="level-filter-label">Şu anki enerjin:</span>
      <div className="chip-group">
        <button
          type="button"
          className={`chip tap-target ${value === 'light' ? 'chip--active' : ''}`}
          onClick={() => onChange('light')}
        >
          Hafif
        </button>
        <button
          type="button"
          className={`chip tap-target ${value === 'medium' ? 'chip--active' : ''}`}
          onClick={() => onChange('medium')}
        >
          Orta
        </button>
        <button
          type="button"
          className={`chip tap-target ${value === 'deep' ? 'chip--active' : ''}`}
          onClick={() => onChange('deep')}
        >
          Derin
        </button>
      </div>
    </div>
  )
}

export default App
