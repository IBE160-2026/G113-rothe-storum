// App shell: content, journey store and the screen flow of Story 1.5
// (EXPERIENCE → IA, Navigation model, State Patterns → First visit). No router.
// - Start → "New journey": through the intro on a first visit on this device,
//   otherwise straight to the journey (FR-2).
// - Start → "How to play": intro, back to Start.
// - Map → Menu → "How to play": intro, back to the journey.
// The journey itself is never saved (PRD §9.7, Decision L); only the intro
// flag and the last name are kept on the device (AD-8).
// - Starting a journey goes to the Map only when the store shows that
//   `startJourney` was accepted; on a rejection the player stays on Start (#50).
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
import { TemporaryJourneyEnd } from "./screens/TemporaryJourneyEnd";
import { MenuSheet } from "./sheets/MenuSheet";

type Screen =
  | { name: "start" }
  | { name: "intro"; variant: IntroVariant }
  /** `startJourney` was dispatched; resolved to "map" or "start" next render. */
  | { name: "starting" }
  | { name: "map" };

function Screens({ storage }: { storage: DeviceStorage }) {
  const { state, dispatch } = useJourney();
  const [screen, setScreen] = useState<Screen>({ name: "start" });
  const [name, setName] = useState(() => storage.lastName());
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  function beginJourney() {
    dispatch(startJourney({ name }));
    setScreen({ name: "starting" });
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

  // The dispatch and the screen change are batched, so this render already
  // sees the store's answer to startJourney. An accepted action clears
  // `rejection` and sets `game`; a rejected one sets `rejection` and leaves
  // `game` as it was. Adjusting state during render (no effect, no extra
  // commit): React re-renders at once with the resolved screen.
  if (screen.name === "starting") {
    const accepted = state.rejection === null && state.game !== null;
    setScreen(accepted ? { name: "map" } : { name: "start" });
    return null;
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
      // Story 1.7: once the rules end the journey, show the TEMPORARY end
      // screen until Stories 3.2 and 3.3 (spec-1-7). "New journey" goes to
      // Start, where the last name is prefilled.
      if (state.game !== null && state.game.outcome !== null) {
        return (
          <TemporaryJourneyEnd
            game={state.game}
            onNewJourney={() => setScreen({ name: "start" })}
          />
        );
      }
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
