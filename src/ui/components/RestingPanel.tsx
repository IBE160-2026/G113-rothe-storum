// Resting panel and destination chips (EXPERIENCE → Resting panel,
// Destination chip; DESIGN → Resting panel, Destination chip, Map key). The
// chips are the complete non-map path to every destination (Tap rule 6,
// UX-DR4). Everything shown comes from routesFrom(): the chip's price is the
// lowest price among the options it returns, and the short variant shows when
// that option's reason is NOT_ENOUGH_MONEY (decision B, spec-1-6).
import type { MouseEvent } from "react";
import type { PlaceId, RouteView, TravelOption } from "../../rules/types";
import { copy } from "../copy";
import styles from "./RestingPanel.module.css";
import { MarkerShape, type MarkerState } from "./WorldMap";

/** The option with the lowest price, as routesFrom() lists it. */
export function cheapestOption(route: RouteView): TravelOption | undefined {
  return route.options.reduce<TravelOption | undefined>(
    (best, option) =>
      best === undefined || option.price < best.price ? option : best,
    undefined,
  );
}

interface Props {
  place: string;
  routes: readonly RouteView[];
  nameOf: (id: PlaceId) => string;
  homeId: PlaceId;
  onOpen: (to: PlaceId, opener: HTMLElement) => void;
}

const KEY: { state: MarkerState; label: string }[] = [
  { state: "current", label: copy.map.key.here },
  { state: "home", label: copy.map.key.home },
  { state: "stamped", label: copy.map.key.stamped },
  { state: "notYet", label: copy.map.key.notYet },
];

export function RestingPanel({ place, routes, nameOf, homeId, onOpen }: Props) {
  return (
    <section className={styles.panel} aria-labelledby="resting-title">
      <span className={styles.grab} aria-hidden="true" />
      <h2 id="resting-title" className={styles.title}>
        {copy.map.panelTitle(place)}
      </h2>
      <p className={styles.hint}>{copy.map.panelHint}</p>
      <p className={styles.caption}>{copy.map.panelCaption(place)}</p>
      <ul className={styles.chips}>
        {routes.map((route) => {
          const cheapest = cheapestOption(route);
          if (!cheapest) return null;
          const short = cheapest.reason === "NOT_ENOUGH_MONEY";
          const isHome = route.to === homeId;
          const detail = short
            ? copy.map.chipShort
            : isHome
              ? copy.map.chipHome(cheapest.price)
              : copy.map.chipFrom(cheapest.price);
          return (
            <li key={route.to}>
              <button
                type="button"
                className={
                  short ? `${styles.chip} ${styles.short}` : styles.chip
                }
                data-chip={route.to}
                aria-haspopup="dialog"
                onClick={(event: MouseEvent<HTMLButtonElement>) =>
                  onOpen(route.to, event.currentTarget)
                }
              >
                <span className={styles.city}>{nameOf(route.to)}</span>
                <span className={styles.detail}>{detail}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <ul className={styles.key}>
        {KEY.map(({ state, label }) => (
          <li key={state} className={styles.keyItem}>
            <svg
              viewBox="-5 -5 10 10"
              width="14"
              height="14"
              aria-hidden="true"
            >
              <MarkerShape state={state} x={0} y={0} r={2.6} />
            </svg>
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
