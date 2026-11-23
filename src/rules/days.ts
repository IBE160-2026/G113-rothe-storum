// Day arithmetic shared by the rule modules and the queries. A leaf module:
// it imports only types, so travel.ts and cityDay.ts can use it without an
// import cycle through queries.ts (#38).
import type { Content, GameState } from "./types";

/** Total days of the journey, derived from the mode's content values. */
export function daysTotal(state: GameState, content: Content): number {
  return content.config.modes[state.mode].totalDays;
}

/** `daysTotal − daysUsed`. */
export function daysRemaining(state: GameState, content: Content): number {
  return daysTotal(state, content) - state.daysUsed;
}
