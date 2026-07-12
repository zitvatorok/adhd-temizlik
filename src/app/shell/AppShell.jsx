import { useAppState } from "./useAppState.js";
import { I18nProvider } from "../i18n/index.jsx";
import { BottomNav, SideNav } from "../components/TabBar.jsx";
import { TopBar } from "../components/TopBar.jsx";
import { TodayView } from "../views/TodayView.jsx";
import { RoomsView } from "../views/RoomsView.jsx";
import { RoutinesView } from "../views/RoutinesView.jsx";
import { FocusView } from "../views/FocusView.jsx";
import { DopamineView } from "../views/DopamineView.jsx";
import { SettingsView } from "../views/SettingsView.jsx";

export default function AppShell() {
  const { state, stats, actions } = useAppState();
  const activeTab = state.ui.activeTab || "rooms";

  return (
    <I18nProvider language={state.ui.language}>
      <div className="app-shell">
        <SideNav activeTab={activeTab} onChange={actions.setActiveTab} />

        <div className="workspace">
          <TopBar stats={stats} />

          <main className="content-area">
            {activeTab === "today" && <TodayView state={state} actions={actions} />}
            {activeTab === "rooms" && <RoomsView state={state} actions={actions} />}
            {activeTab === "routines" && <RoutinesView state={state} actions={actions} />}
            {activeTab === "focus" && <FocusView state={state} actions={actions} />}
            {activeTab === "quick" && <DopamineView state={state} />}
            {activeTab === "settings" && <SettingsView state={state} actions={actions} stats={stats} />}
          </main>
        </div>

        <BottomNav activeTab={activeTab} onChange={actions.setActiveTab} />
      </div>
    </I18nProvider>
  );
}
