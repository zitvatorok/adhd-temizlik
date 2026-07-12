import { useEffect, useRef } from "react";
import { useAppState } from "./useAppState.js";
import { I18nProvider } from "../i18n/index.jsx";
import { Header } from "../components/Header.jsx";
import { TabBar } from "../components/TabBar.jsx";
import { TodayView } from "../views/TodayView.jsx";
import { RoomsView } from "../views/RoomsView.jsx";
import { RoutinesView } from "../views/RoutinesView.jsx";
import { FocusView } from "../views/FocusView.jsx";
import { DopamineView } from "../views/DopamineView.jsx";
import { SettingsView } from "../views/SettingsView.jsx";
import { hideSplash, syncStatusBar } from "../native/system.js";
import { dayComplete } from "../native/haptics.js";

function useNativeChrome(theme) {
  useEffect(() => {
    hideSplash();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light" || theme === "dark") {
      root.dataset.theme = theme;
    } else {
      delete root.dataset.theme;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      syncStatusBar(theme === "dark" || (theme !== "light" && media.matches));
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
}

function useDayCompleteHaptic(dailyDone) {
  const previous = useRef(dailyDone);

  useEffect(() => {
    if (previous.current < 3 && dailyDone >= 3) {
      dayComplete();
    }
    previous.current = dailyDone;
  }, [dailyDone]);
}

export default function AppShell() {
  const { state, stats, actions } = useAppState();
  const activeTab = state.ui.activeTab || "today";

  useNativeChrome(state.ui.theme);
  useDayCompleteHaptic(Math.min(stats.done, 3));

  return (
    <I18nProvider language={state.ui.language}>
      <div className="shell">
        <Header activeTab={activeTab} state={state} stats={stats} actions={actions} />

        <main className="shell-main">
          {activeTab === "today" && <TodayView state={state} actions={actions} />}
          {activeTab === "rooms" && <RoomsView state={state} actions={actions} />}
          {activeTab === "routines" && <RoutinesView state={state} actions={actions} />}
          {activeTab === "focus" && <FocusView state={state} actions={actions} />}
          {activeTab === "quick" && <DopamineView />}
          {activeTab === "settings" && <SettingsView state={state} actions={actions} stats={stats} />}
        </main>

        {activeTab !== "settings" && <TabBar activeTab={activeTab} onChange={actions.setActiveTab} />}
      </div>
    </I18nProvider>
  );
}
