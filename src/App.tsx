import { AppManager } from "./apps/base/AppManager";
import { appRegistry } from "./config/appRegistry";
import { useEffect, useState } from "react";
import { applyDisplayMode } from "./utils/displayMode";
import { Toaster } from "./components/ui/sonner";
import { useAppStoreShallow } from "@/stores/helpers";
import { BootScreen } from "./components/dialogs/BootScreen";
import { getNextBootMessage, clearNextBootMessage } from "./utils/bootMessage";
import { AnyApp } from "./apps/base/types";
import { LockScreen } from "./components/LockScreen/LockScreen";
import { LockScreenProvider, useLockScreen } from "./contexts/LockScreenContext";

// Convert registry to array
const apps: AnyApp[] = Object.values(appRegistry);

const AppContent = () => {
  const { displayMode, isFirstBoot, setHasBooted } = useAppStoreShallow(
    (state) => ({
      displayMode: state.displayMode,
      isFirstBoot: state.isFirstBoot,
      setHasBooted: state.setHasBooted,
    })
  );


  useEffect(() => {
    applyDisplayMode(displayMode);
  }, [displayMode]);

  useEffect(() => {
    // Set first boot flag without showing boot screen
    if (isFirstBoot) {
      setHasBooted();
    }
  }, [isFirstBoot, setHasBooted]);

  const { isLocked, unlock } = useLockScreen();
  console.log('isLocked:', isLocked); // Debug log
  const [showBootScreen, setShowBootScreen] = useState(false);
  const [bootScreenMessage, setBootScreenMessage] = useState<string | null>(null);

  useEffect(() => {
    // Only show boot screen for system operations (reset/restore/format/debug)
    const persistedMessage = getNextBootMessage();
    if (persistedMessage) {
      setBootScreenMessage(persistedMessage);
      setShowBootScreen(true);
    }
  }, []);

  if (isLocked) {
    console.log('Rendering LockScreen'); // Debug log
    return <LockScreen onUnlock={unlock} />;
  }

  if (showBootScreen && bootScreenMessage) {
    return (
      <BootScreen
        isOpen={true}
        onOpenChange={() => {}}
        title={bootScreenMessage}
        onBootComplete={() => {
          clearNextBootMessage();
          setShowBootScreen(false);
        }}
      />
    );
  }

  return (
    <>
      <AppManager apps={apps} />
      <Toaster
        position="bottom-left"
        offset={`calc(env(safe-area-inset-bottom, 0px) + 32px)`}
      />
    </>
  );
}

const App = () => {
  return (
    <LockScreenProvider>
      <AppContent />
    </LockScreenProvider>
  );
};

export default App;
