// Read-only queries for the UI (AD-3). They share their checks with `apply`,
// so what the UI shows as available is exactly what `apply` accepts.
import { checkTravel, homeUnreachableAfter } from "./travel";
import type { Content, GameState, RouteView, TravelOption } from "./types";

/** Total days of the journey, derived from the mode's content values. */
export function daysTotal(state: GameState, content: Content): number {
  return content.config.modes[state.mode].totalDays;
}

/** `daysTotal − daysUsed`. */
export function daysRemaining(state: GameState, content: Content): number {
  return daysTotal(state, content) - state.daysUsed;
}

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
        homeUnreachable: homeUnreachableAfter(state, to, days, content),
      };
    });
    views.push({ to, options });
  }
  return views;
}
