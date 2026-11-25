// Read-only queries for the UI (AD-3). They share their checks with `apply`,
// so what the UI shows as available is exactly what `apply` accepts.
import {
  callHomeFits,
  callHomeOffered,
  callHomeStampsLost,
  checkCallHome,
} from "./callHome";
import { checkCityDay, destinationAt, stayPrice } from "./cityDay";
import { checkTravel, homeUnreachableAfter } from "./travel";
import type {
  CallHomeStatus,
  CityDayPlan,
  CityDayStatus,
  Content,
  GameState,
  RouteView,
  Sight,
  SightPlanView,
  TravelOption,
} from "./types";

// Re-exported so callers keep one entry point for queries (#38).
export { daysRemaining, daysTotal } from "./days";

/**
 * Every route from the current position, in content order, with each mode's
 * price, days, arrival day, availability, reason and home warning (FR-4, FR-9).
 */
export function routesFrom(state: GameState, content: Content): RouteView[] {
  const views: RouteView[] = [];
  for (const { between, modes } of content.routes) {
    const [a, b] = between;
    const to = a === state.position ? b : b === state.position ? a : undefined;
    if (to === undefined) continue;
    const options = modes.map(({ mode, price, days }): TravelOption => {
      const check = checkTravel(state, to, mode, content);
      return {
        mode,
        price,
        days,
        arrivalDay: state.daysUsed + days,
        available: check.ok,
        reason: check.ok ? null : check.reason,
        // Warning rows and unavailable rows are exclusive (EXPERIENCE → Option row).
        homeUnreachable:
          check.ok && homeUnreachableAfter(state, to, days, content),
      };
    });
    views.push({ to, options });
  }
  return views;
}

const priceOf = (sights: readonly Sight[]) =>
  sights.reduce((sum, s) => sum + s.price, 0);

/**
 * Whether a city day can be spent here, what the stay costs, and whether home
 * is out of reach after it (FR-8). The same check as
 * `apply(spendCityDay({ sightIds: [] }))` (AD-3). The warning is the same rule
 * as for travel (FR-4): a city day is 1 day at the current position, whatever
 * the sights, so it does not depend on the draft.
 */
export function cityDayStatus(
  state: GameState,
  content: Content,
): CityDayStatus {
  const check = checkCityDay(state, [], content);
  const destination = destinationAt(state, content);
  return {
    available: check.ok,
    reason: check.ok ? null : check.reason,
    stayPrice:
      destination === undefined ? null : stayPrice(destination, content),
    // Warning and unavailable are exclusive, as for travel options.
    homeUnreachable:
      check.ok && homeUnreachableAfter(state, state.position, 1, content),
  };
}

/**
 * The whole city-day draft for the City day screen (FR-8, FR-10, FR-21): the
 * stay, the running total, money after, the whole-draft check (exactly what
 * `apply(spendCityDay({ sightIds }))` decides) and each sight of this
 * destination in content order. A sight is available when the check accepts
 * the other valid selected sights plus this one (AD-3). Never throws, even
 * when `sightIds` is not an array of strings.
 */
export function cityDayPlan(
  state: GameState,
  sightIds: readonly string[],
  content: Content,
): CityDayPlan {
  const check = checkCityDay(state, sightIds, content);
  const ok = check.ok;
  const reason = check.ok ? null : check.reason;
  const destination = destinationAt(state, content);
  if (destination === undefined) {
    return {
      ok,
      reason,
      stay: null,
      total: null,
      moneyAfter: null,
      sights: [],
    };
  }
  const draft: unknown = sightIds;
  const selected = new Set<string>(
    Array.isArray(draft) && draft.every((id) => typeof id === "string")
      ? (draft as string[])
      : [],
  );
  const inAlbum = new Set(state.album.map((entry) => entry.id));
  const here = content.sights.filter((s) => s.destId === destination.id);
  // Σ set: distinct selected sights of this destination not in the album.
  const counted = here.filter((s) => selected.has(s.id) && !inAlbum.has(s.id));
  const stay = stayPrice(destination, content);
  const total = stay + priceOf(counted);
  const sights = here.map((sight): SightPlanView => {
    const others = counted.filter((s) => s.id !== sight.id);
    const own = checkCityDay(
      state,
      [...others.map((s) => s.id), sight.id],
      content,
    );
    return {
      id: sight.id,
      inAlbum: inAlbum.has(sight.id),
      selected: selected.has(sight.id),
      available: own.ok,
      reason: own.ok ? null : own.reason,
      moneyLeft: state.money - stay - priceOf(others),
    };
  });
  return { ok, reason, stay, total, moneyAfter: state.money - total, sights };
}

/**
 * Whether call home is offered, whether it fits, and what it costs, so the UI
 * can show the cost before the player confirms (FR-12). `available` and
 * `reason` are the same check as `apply(callHome())` (AD-3).
 */
export function callHomeStatus(
  state: GameState,
  content: Content,
): CallHomeStatus {
  const check = checkCallHome(state, content);
  const { days, price } = content.config.callHome;
  return {
    offered: state.outcome === null && callHomeOffered(state, content),
    fits: callHomeFits(state, content),
    available: check.ok,
    reason: check.ok ? null : check.reason,
    days,
    stampsLost: callHomeStampsLost(state, content),
    price,
    daysUsedAfter: state.daysUsed + days,
  };
}
