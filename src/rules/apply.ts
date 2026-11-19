// The single mutation path (AD-2): apply(state, action, content) returns a new
// state or a reason code, never mutates its inputs and never throws for a
// player action (AD-4).
import { applyStartJourney } from "./journey";
import { applyTravel } from "./travel";
import type {
  Action,
  Content,
  GameState,
  JourneyMode,
  PlaceId,
  Result,
  TransportMode,
} from "./types";

/** Action creator for starting a journey. Mode defaults to Explorer. */
export function startJourney(payload: {
  name: string;
  mode?: JourneyMode;
}): Action {
  return payload.mode === undefined
    ? { type: "startJourney", name: payload.name }
    : { type: "startJourney", name: payload.name, mode: payload.mode };
}

/** Action creator for travelling along a route. */
export function travel(payload: { to: PlaceId; mode: TransportMode }): Action {
  return { type: "travel", to: payload.to, mode: payload.mode };
}

/** `state` is null when no journey has started. */
export function apply(
  state: GameState | null,
  action: Action,
  content: Content,
): Result {
  // startJourney may replace any state, ended or not; it does not read it.
  if (action.type === "startJourney") {
    return applyStartJourney(action.name, action.mode ?? "explorer", content);
  }
  if (state === null) return { ok: false, reason: "NO_JOURNEY" };
  if (state.outcome !== null) return { ok: false, reason: "JOURNEY_ENDED" };
  switch (action.type) {
    case "travel":
      return applyTravel(state, action.to, action.mode, content);
    default: {
      const unhandled: never = action;
      return unhandled;
    }
  }
}
