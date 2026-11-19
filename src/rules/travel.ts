// Travelling between places (FR-6, FR-7). `checkTravel` is the one check that
// both `apply` and the route query use, so they can never disagree (AD-3).
// Pure: never mutates its inputs and never throws for a player action (AD-4).
import { daysRemaining, daysTotal } from "./queries";
import type {
  Content,
  GameState,
  ModeOption,
  PlaceId,
  ReasonCode,
  Result,
  Route,
  TransportMode,
} from "./types";

export type TravelCheck =
  { ok: true; option: ModeOption } | { ok: false; reason: ReasonCode };

/** The route between two places in either direction, if content has one. */
export function routeBetween(
  a: PlaceId,
  b: PlaceId,
  content: Content,
): Route | undefined {
  return content.routes.find(
    ({ between: [x, y] }) => (x === a && y === b) || (x === b && y === a),
  );
}

/**
 * Checks a travel option against a running journey. The first failure in the
 * fixed order JOURNEY_ENDED, NO_ROUTE, NOT_ENOUGH_MONEY, NOT_ENOUGH_DAYS is
 * the reason. NO_JOURNEY is `apply`'s job, since the query always has a state.
 */
export function checkTravel(
  state: GameState,
  to: PlaceId,
  mode: TransportMode,
  content: Content,
): TravelCheck {
  if (state.outcome !== null) return { ok: false, reason: "JOURNEY_ENDED" };
  const option = routeBetween(state.position, to, content)?.modes.find(
    (m) => m.mode === mode,
  );
  if (option === undefined) return { ok: false, reason: "NO_ROUTE" };
  if (option.price > state.money) {
    return { ok: false, reason: "NOT_ENOUGH_MONEY" };
  }
  if (option.days > daysRemaining(state, content)) {
    return { ok: false, reason: "NOT_ENOUGH_DAYS" };
  }
  return { ok: true, option };
}

/**
 * Fewest days from `from` to home, using each route's fastest mode and
 * ignoring money (Dijkstra over the small content graph). `Infinity` when no
 * path exists.
 */
export function shortestDaysHome(from: PlaceId, content: Content): number {
  const dist = new Map<PlaceId, number>([[from, 0]]);
  const done = new Set<PlaceId>();
  for (;;) {
    let current: PlaceId | undefined;
    let best = Infinity;
    for (const [place, d] of dist) {
      if (!done.has(place) && d < best) {
        current = place;
        best = d;
      }
    }
    if (current === undefined) return Infinity;
    if (current === content.home.id) return best;
    done.add(current);
    for (const { between, modes } of content.routes) {
      const [a, b] = between;
      const next = a === current ? b : b === current ? a : undefined;
      if (next === undefined || done.has(next) || modes.length === 0) continue;
      const d = best + Math.min(...modes.map((m) => m.days));
      if (d < (dist.get(next) ?? Infinity)) dist.set(next, d);
    }
  }
}

/**
 * True when, after travelling to `to` in `days`, the fastest way home needs
 * more days than remain. Never true for `to` = home. Never blocks travel.
 */
export function homeUnreachableAfter(
  state: GameState,
  to: PlaceId,
  days: number,
  content: Content,
): boolean {
  if (to === content.home.id) return false;
  const remainingAfter = daysRemaining(state, content) - days;
  return shortestDaysHome(to, content) > remainingAfter;
}

/**
 * Travels to `to` by `mode`: money falls by the price, days used rise by the
 * days, and position becomes `to`. Arriving home ends the journey and
 * evaluates the goal (spec-1-4 Q1 = A, FR-11).
 */
export function applyTravel(
  state: GameState,
  to: PlaceId,
  mode: TransportMode,
  content: Content,
): Result {
  const check = checkTravel(state, to, mode, content);
  if (!check.ok) return check;
  const moved: GameState = {
    ...state,
    position: to,
    money: state.money - check.option.price,
    daysUsed: state.daysUsed + check.option.days,
  };
  if (to !== content.home.id) return { ok: true, state: moved };
  // Mirrors the FR-11 goal rule; the day limit is already guaranteed by checkTravel.
  const goalReached =
    moved.stamps.length >= content.config.goalStamps &&
    moved.daysUsed <= daysTotal(moved, content);
  return {
    ok: true,
    state: {
      ...moved,
      outcome: goalReached ? "goalReached" : "goalNotReached",
      failReason: null,
    },
  };
}
