// The end rules (FR-11, FR-13, Decision H). `apply` runs `evaluateEnd` after
// every successful action except `startJourney`, so the result of the action
// that ends a journey already carries `outcome` and `failReason`. This is the
// only place an outcome is set. It imports travel.ts, cityDay.ts and
// callHome.ts, so none of them may import this module (#38).
import { callHomeFits, callHomeOffered, checkCallHome } from "./callHome";
import { checkCityDay } from "./cityDay";
import { daysTotal } from "./days";
import { checkTravel } from "./travel";
import type { Content, GameState } from "./types";

/** True when at least one mode on a route from here passes `checkTravel`. */
function anyTravelAvailable(state: GameState, content: Content): boolean {
  return content.routes.some(({ between: [a, b], modes }) => {
    const to = a === state.position ? b : b === state.position ? a : undefined;
    if (to === undefined) return false;
    return modes.some((m) => checkTravel(state, to, m.mode, content).ok);
  });
}

/**
 * Applies the end rules, in order, to a running journey; an ended journey is
 * returned as is.
 * 1. Home: `goalReached` with at least `goalStamps` stamps and days used ≤ the
 *    total, and the player did not call home (Decision N), else
 *    `goalNotReached` (FR-11). Removed stamps do not count.
 * 2. Call home offered but does not fit: `failed`/`stranded`, even if a city
 *    day is affordable (FR-13, Decision H).
 * 3. No available travel, no available city day and call home not available
 *    (`checkCallHome` fails, e.g. offered but unaffordable):
 *    `failed`/`outOfDays` (FR-13). A call home the player cannot pay never
 *    leaves them stuck.
 */
export function evaluateEnd(state: GameState, content: Content): GameState {
  if (state.outcome !== null) return state;
  if (state.position === content.home.id) {
    const goalReached =
      !state.calledHome &&
      state.stamps.length >= content.config.goalStamps &&
      state.daysUsed <= daysTotal(state, content);
    return {
      ...state,
      outcome: goalReached ? "goalReached" : "goalNotReached",
      failReason: null,
    };
  }
  const offered = callHomeOffered(state, content);
  if (offered && !callHomeFits(state, content)) {
    return { ...state, outcome: "failed", failReason: "stranded" };
  }
  if (
    !checkCallHome(state, content).ok &&
    !anyTravelAvailable(state, content) &&
    !checkCityDay(state, [], content).ok
  ) {
    return { ...state, outcome: "failed", failReason: "outOfDays" };
  }
  return state;
}
