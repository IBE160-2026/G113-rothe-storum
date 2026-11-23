// Read-only queries for the UI (AD-3). They share their checks with `apply`,
// so what the UI shows as available is exactly what `apply` accepts.
import { checkTravel, homeUnreachableAfter } from "./travel";
import type { Content, GameState, RouteView, TravelOption } from "./types";

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
