// Simple world map (Story 1.6, MVP option A). EXPERIENCE → Map Data projection
// in degree units, used directly as SVG units: x = lon + 180, y = 90 − lat.
// Coordinates come unchanged from content. The view is cropped to every place
// with an 8° margin; at 375 px that is about 1.56 px per degree.
// Deferred (spec-1-6): world.svg land shapes, region loupe, zoomed region,
// region data and viaCities. Europe's markers sit a few px apart, so per Tap
// rule 2 they are decorative; the destination chips are the full path.
// The SVG is aria-hidden (EXPERIENCE → Map); pointer-only marker targets.
import type { Content, GameState, PlaceId, RouteView } from "../../rules/types";
import styles from "./WorldMap.module.css";

/** Crop in degree units: lon −82…159, lat 69…−42. */
export const VIEW = { x: 98, y: 21, width: 241, height: 111 } as const;
/** EXPERIENCE → Viewport reference width; hit circles are checked at it. */
const REFERENCE_WIDTH = 375;
const HIT_DIAMETER_PX = 44;
const UNIT_PX = REFERENCE_WIDTH / VIEW.width;
const HIT_RADIUS = HIT_DIAMETER_PX / 2 / UNIT_PX;
const MARKER_RADIUS = 2.4;

export type MarkerState = "current" | "home" | "stamped" | "noRoute" | "notYet";

export interface MapPlace {
  id: PlaceId;
  name: string;
  x: number;
  y: number;
}

/** Every place from content, projected. */
export function projectPlaces(content: Content): MapPlace[] {
  return [content.home, ...content.destinations].map((p) => ({
    id: p.id,
    name: p.name,
    x: p.lon + 180,
    y: 90 - p.lat,
  }));
}

export function markerState(
  place: MapPlace,
  game: GameState,
  routedIds: ReadonlySet<PlaceId>,
  homeId: PlaceId,
): MarkerState {
  if (place.id === game.position) return "current";
  if (place.id === homeId) return "home";
  if (game.stamps.some((s) => s.id === place.id)) return "stamped";
  if (!routedIds.has(place.id)) return "noRoute";
  return "notYet";
}

/**
 * Tap rule 2: a marker is a pointer target only if its 44 px hit circle
 * overlaps no other place's hit circle. Rule 5: never the current position or
 * a place without a route from here.
 */
export function isTarget(
  place: MapPlace,
  places: readonly MapPlace[],
  state: MarkerState,
): boolean {
  if (state === "current" || state === "noRoute") return false;
  return places.every(
    (other) =>
      other.id === place.id ||
      Math.hypot(other.x - place.x, other.y - place.y) >= 2 * HIT_RADIUS,
  );
}

/** Keeps labels near either edge inside the view. */
function labelAnchor(x: number): "start" | "middle" | "end" {
  if (x < VIEW.x + 20) return "start";
  if (x > VIEW.x + VIEW.width - 20) return "end";
  return "middle";
}

/** Straight segment, wrapped across the edge when it spans > 180° (Map Data). */
function routeSegments(
  from: MapPlace,
  to: MapPlace,
): [number, number, number, number][] {
  const dx = to.x - from.x;
  if (Math.abs(dx) <= 180) return [[from.x, from.y, to.x, to.y]];
  const shift = dx > 0 ? -360 : 360;
  return [
    [from.x, from.y, to.x + shift, to.y],
    [from.x - shift, from.y, to.x, to.y],
  ];
}

interface Props {
  content: Content;
  game: GameState;
  routes: readonly RouteView[];
  onSelect: (to: PlaceId) => void;
}

export function WorldMap({ content, game, routes, onSelect }: Props) {
  const places = projectPlaces(content);
  const byId = new Map(places.map((p) => [p.id, p]));
  const routedIds = new Set(routes.map((r) => r.to));
  const current = byId.get(game.position);

  return (
    <svg
      className={styles.map}
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`}
      aria-hidden="true"
      focusable="false"
      data-testid="world-map"
    >
      <rect
        className={styles.sea}
        x={VIEW.x}
        y={VIEW.y}
        width={VIEW.width}
        height={VIEW.height}
      />
      {current &&
        routes.map((route) => {
          const to = byId.get(route.to);
          if (!to) return null;
          return routeSegments(current, to).map(([x1, y1, x2, y2], i) => (
            <line
              key={`${route.to}-${i}`}
              className={styles.route}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            />
          ));
        })}
      {places.map((place) => {
        const state = markerState(place, game, routedIds, content.home.id);
        const target = isTarget(place, places, state);
        return (
          <g
            key={place.id}
            className={styles.marker}
            data-place={place.id}
            data-state={state}
            data-target={target ? "true" : undefined}
            onClick={target ? () => onSelect(place.id) : undefined}
          >
            {target && (
              <circle
                className={styles.hit}
                cx={place.x}
                cy={place.y}
                r={HIT_RADIUS}
              />
            )}
            <MarkerShape state={state} x={place.x} y={place.y} />
            {(state === "current" || target) && (
              <text
                className={styles.label}
                x={place.x}
                y={place.y + MARKER_RADIUS + 5}
                textAnchor={labelAnchor(place.x)}
              >
                {place.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** DESIGN → Map marker: every state differs by shape, not colour alone. */
export function MarkerShape({
  state,
  x,
  y,
  r = MARKER_RADIUS,
}: {
  state: MarkerState;
  x: number;
  y: number;
  r?: number;
}) {
  switch (state) {
    case "current":
      return (
        <>
          <circle className={styles.halo} cx={x} cy={y} r={r * 2} />
          <circle className={styles.current} cx={x} cy={y} r={r} />
        </>
      );
    case "home":
      return (
        <rect
          className={styles.home}
          x={x - r}
          y={y - r}
          width={r * 2}
          height={r * 2}
          rx={r * 0.4}
        />
      );
    case "stamped":
      return (
        <>
          <circle className={styles.stamped} cx={x} cy={y} r={r} />
          <path
            className={styles.check}
            d={`M${x - r * 0.5} ${y} l${r * 0.35} ${r * 0.4} l${r * 0.7} ${-r * 0.8}`}
          />
        </>
      );
    case "noRoute":
      return <circle className={styles.noRoute} cx={x} cy={y} r={r} />;
    case "notYet":
      return <circle className={styles.notYet} cx={x} cy={y} r={r} />;
  }
}
