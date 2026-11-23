// App shell: content, journey store and the screen flow of Story 1.5
// (EXPERIENCE → IA, Navigation model, State Patterns → First visit). No router.
// - Start → "New journey": through the intro on a first visit on this device,
//   otherwise straight to the journey (FR-2).
// - Start → "How to play": intro, back to Start.
// - Map → Menu → "How to play": intro, back to the journey.
// The journey itself is never saved (PRD §9.7, Decision L); only the intro
// flag and the last name are kept on the device (AD-8).
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ContentProvider } from "../app/content";
import { createDeviceStorage, type DeviceStorage } from "../app/storage";
import { JourneyProvider, useJourney } from "../app/store";
import { startJourney } from "../rules/apply";
import { normalizeName } from "../rules/journey";
import { IntroScreen, type IntroVariant } from "./screens/IntroScreen";
import { MapScreen } from "./screens/MapScreen";
import { StartScreen } from "./screens/StartScreen";
import { MenuSheet } from "./sheets/MenuSheet";

type Screen =
  | { name: "start" }
  | { name: "intro"; variant: IntroVariant }
  | { name: "map" };

function Screens({ storage }: { storage: DeviceStorage }) {
  const { dispatch } = useJourney();
  const [screen, setScreen] = useState<Screen>({ name: "start" });
  const [name, setName] = useState(() => storage.lastName());
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  function beginJourney() {
    dispatch(startJourney({ name }));
    setScreen({ name: "map" });
  }

  function onNewJourney() {
    const normalized = normalizeName(name);
    storage.setLastName(normalized.nameGiven ? normalized.travellerName : "");
    if (storage.introSeen()) beginJourney();
    else setScreen({ name: "intro", variant: "firstVisit" });
  }

  function leaveIntro(variant: IntroVariant) {
    storage.markIntroSeen();
    if (variant === "firstVisit") beginJourney();
    else if (variant === "fromStart") setScreen({ name: "start" });
    else setScreen({ name: "map" });
  }

  function closeMenu() {
    // Commit the close first: until then the Map is still `inert`, and the
    // browser ignores focus() on an inert element (focus would land on body).
    flushSync(() => setMenuOpen(false));
    menuButtonRef.current?.focus();
  }

  switch (screen.name) {
    case "start":
      return (
        <StartScreen
          name={name}
          onNameChange={setName}
          onNewJourney={onNewJourney}
          onHowToPlay={() => setScreen({ name: "intro", variant: "fromStart" })}
        />
      );
    case "intro":
      return (
        <IntroScreen
          variant={screen.variant}
          onContinue={() => leaveIntro(screen.variant)}
          onClose={() => leaveIntro(screen.variant)}
        />
      );
    case "map":
      return (
        <>
          <MapScreen
            onOpenMenu={() => setMenuOpen(true)}
            menuButtonRef={menuButtonRef}
            inert={menuOpen}
          />
          {menuOpen && (
            <MenuSheet
              onClose={closeMenu}
              onHowToPlay={() => {
                setMenuOpen(false);
                setScreen({ name: "intro", variant: "inJourney" });
              }}
            />
          )}
        </>
      );
  }
}

/** `storage` is injectable for tests; the app uses the browser's storage. */
export function App({ storage }: { storage?: DeviceStorage }) {
  const [deviceStorage] = useState(() => storage ?? createDeviceStorage());
  return (
    <ContentProvider>
      <JourneyProvider>
        <Screens storage={deviceStorage} />
      </JourneyProvider>
    </ContentProvider>
  );
}
