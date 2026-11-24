// Calling home (FR-12). `checkCallHome` is the one check that `apply` and the
// `callHomeStatus` query use, so they can never disagree (AD-3). The end rules
// use `callHomeOffered`/`callHomeFits` for stranded and `checkCallHome` for
// out of days. Pure: never mutates its inputs and never throws for a player action
// (AD-4). All values come from `content.config.callHome`.
import { destinationAt } from "./cityDay";
import { daysRemaining } from "./days";
import type { Content, GameState, ReasonCode, Result } from "./types";

export type CallHomeCheck = { ok: true } | { ok: false; reason: ReasonCode };

/**
 * True when the player is at a destination (not home) and money is below the
 * cheapest mode on every route from it. A destination with no routes counts
 * as offered. Ignores the outcome; `checkCallHome` handles an ended journey.
 */
export function callHomeOffered(state: GameState, content: Content): boolean {
  if (destinationAt(state, content) === undefined) return false;
  return content.routes.every(
    ({ between: [a, b], modes }) =>
      (a !== state.position && b !== state.position) ||
      modes.every((m) => state.money < m.price),
  );
}

/** True when the call home days fit in the days remaining. */
export function callHomeFits(state: GameState, content: Content): boolean {
  return content.config.callHome.days <= daysRemaining(state, content);
}

/**
 * Checks call home against a running journey. The first failure in the fixed
 * order JOURNEY_ENDED, AT_HOME, CALL_HOME_NOT_OFFERED, NOT_ENOUGH_DAYS,
 * NOT_ENOUGH_MONEY is the reason. NO_JOURNEY is `apply`'s job, since the query
 * always has a state. Money equal to the price is allowed.
 */
export function checkCallHome(
  state: GameState,
  content: Content,
): CallHomeCheck {
  if (state.outcome !== null) return { ok: false, reason: "JOURNEY_ENDED" };
  if (destinationAt(state, content) === undefined) {
    return { ok: false, reason: "AT_HOME" };
  }
  if (!callHomeOffered(state, content)) {
    return { ok: false, reason: "CALL_HOME_NOT_OFFERED" };
  }
  if (!callHomeFits(state, content)) {
    return { ok: false, reason: "NOT_ENOUGH_DAYS" };
  }
  if (content.config.callHome.price > state.money) {
    return { ok: false, reason: "NOT_ENOUGH_MONEY" };
  }
  return { ok: true };
}

/** Stamps call home would remove: the last `stampPenalty`, fewer if fewer. */
export function callHomeStampsLost(state: GameState, content: Content): number {
  return Math.min(content.config.callHome.stampPenalty, state.stamps.length);
}

/**
 * Calls home: days used rise by `callHome.days`, the last `stampPenalty`
 * stamps are removed, money falls by `callHome.price`, position becomes home
 * and `calledHome` becomes true. The goal is evaluated by `evaluateEnd`.
 */
export function applyCallHome(state: GameState, content: Content): Result {
  const check = checkCallHome(state, content);
  if (!check.ok) return check;
  const { days, price } = content.config.callHome;
  const lost = callHomeStampsLost(state, content);
  return {
    ok: true,
    state: {
      ...state,
      position: content.home.id,
      money: state.money - price,
      daysUsed: state.daysUsed + days,
      stamps: state.stamps.slice(0, state.stamps.length - lost),
      calledHome: true,
    },
  };
}
