// Map screen (Story 1.6; FR-3, FR-4, UX-DR2 – UX-DR4, NFR-4, NFR-5). The Map
// is the root while a journey runs (EXPERIENCE → IA, Navigation model).
// - Top bar (logo, menu), status chips and passport strip (StatusBar).
// - Simple SVG world map (WorldMap; MVP option A, see spec-1-6).
// - Resting panel with destination chips, the complete non-map path.
// - Route sheet for the chosen destination. Esc, ×, scrim and browser Back
//   close it, and focus returns to the control that opened it; a pointer-only
//   map marker hands focus to the same city's chip.
// Every route value comes from routesFrom() (AD-3). Travel is Story 1.7.
import { useEffect, useRef, useState, type Ref } from "react";
import { flushSync } from "react-dom";
import { useContent } from "../../app/content";
import { useJourney } from "../../app/store";
import { daysTotal, routesFrom } from "../../rules/queries";
import type { PlaceId } from "../../rules/types";
import { Logo } from "../components/Logo";
import { RestingPanel } from "../components/RestingPanel";
import { StatusBar } from "../components/StatusBar";
import { WorldMap } from "../components/WorldMap";
import { copy } from "../copy";
import { useBackToClose } from "../hooks/useBackToClose";
import { RouteSheet } from "../sheets/RouteSheet";
import controls from "../styles/controls.module.css";
import styles from "./MapScreen.module.css";

interface Props {
  onOpenMenu: () => void;
  /** The menu button, so focus can return to it when the menu closes. */
  menuButtonRef: Ref<HTMLButtonElement>;
  /** True while the menu sheet is open over the screen. */
  inert: boolean;
}

export function MapScreen({ onOpenMenu, menuButtonRef, inert }: Props) {
  const content = useContent();
  const { state } = useJourney();
  const game = state.game;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [openTo, setOpenTo] = useState<PlaceId | null>(null);

  function closeSheet() {
    // Commit first: until then the Map is inert and ignores focus().
    flushSync(() => setOpenTo(null));
    openerRef.current?.focus();
  }

  const back = useBackToClose(closeSheet);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (game === null) return null;

  const routes = routesFrom(game, content);
  const names = new Map<PlaceId, string>([
    [content.home.id, content.home.name],
    ...content.destinations.map((d): [PlaceId, string] => [d.id, d.name]),
  ]);
  const nameOf = (id: PlaceId) => names.get(id) ?? id;
  const here = nameOf(game.position);
  const openRoute = routes.find((r) => r.to === openTo);

  function open(to: PlaceId, opener: HTMLElement | null) {
    openerRef.current = opener;
    back.open();
    setOpenTo(to);
  }

  function requestClose() {
    if (!back.close()) closeSheet();
  }

  return (
    <>
      <main
        ref={mainRef}
        className={styles.screen}
        inert={inert || openTo !== null}
      >
        <div className={styles.topBar}>
          <Logo />
          <button
            ref={menuButtonRef}
            type="button"
            className={controls.iconButton}
            aria-label={copy.menu.open}
            aria-haspopup="dialog"
            onClick={onOpenMenu}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <h1 ref={headingRef} tabIndex={-1} className={controls.visuallyHidden}>
          {copy.map.heading}
        </h1>
        <p className={controls.visuallyHidden}>{copy.map.srWhere(here)}</p>
        <StatusBar game={game} />
        <WorldMap
          content={content}
          game={game}
          routes={routes}
          onSelect={(to) =>
            open(
              to,
              mainRef.current?.querySelector<HTMLElement>(
                `[data-chip="${to}"]`,
              ) ?? null,
            )
          }
        />
        <RestingPanel
          place={here}
          routes={routes}
          nameOf={nameOf}
          homeId={content.home.id}
          onOpen={open}
        />
      </main>
      {openRoute && (
        <RouteSheet
          key={openRoute.to}
          route={openRoute}
          fromName={here}
          toName={nameOf(openRoute.to)}
          toIsHome={openRoute.to === content.home.id}
          toStamped={game.stamps.some((s) => s.id === openRoute.to)}
          money={game.money}
          daysTotal={daysTotal(game, content)}
          onRequestClose={requestClose}
        />
      )}
    </>
  );
}
