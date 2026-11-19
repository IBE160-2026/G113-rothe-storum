// The single mutation path (AD-2): apply(state, action, content) returns a new
// state or a reason code, never mutates its inputs and never throws for a
// player action (AD-4).
import { applyStartJourney } from "./journey";
import type { Action, Content, GameState, JourneyMode, Result } from "./types";

/** Action creator for starting a journey. Mode defaults to Explorer. */
export function startJourney(payload: {
  name: string;
  mode?: JourneyMode;
}): Action {
  return payload.mode === undefined
    ? { type: "startJourney", name: payload.name }
    : { type: "startJourney", name: payload.name, mode: payload.mode };
}

/** `state` is null when no journey has started. */
export function apply(
  state: GameState | null,
  action: Action,
  content: Content,
): Result {
  switch (action.type) {
    case "startJourney":
      // Any existing state is replaced; it is not read.
      void state;
      return applyStartJourney(action.name, action.mode ?? "explorer", content);
  }
}
