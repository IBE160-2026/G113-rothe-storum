// The single mutation path (AD-2): apply(state, action, content) returns a new
// state or a reason code, never mutates its inputs and never throws for a
// player action (AD-4).
import { applyCallHome } from "./callHome";
import { applySpendCityDay } from "./cityDay";
import { evaluateEnd } from "./end";
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

/**
 * Action creator for spending a city day at the current destination with 0–2
 * sights (FR-8, FR-10). AD-6's `ending` field is [EXT] and left out in core.
 */
export function spendCityDay(payload: { sightIds: string[] }): Action {
  return { type: "spendCityDay", sightIds: payload.sightIds };
}

/**
 * Action creator for calling home (FR-12). Offered only at a destination when
 * money is below the cheapest mode on every route from it.
 */
export function callHome(): Action {
  return { type: "callHome" };
}

/** Runs the end rules on a successful action's result (FR-11, FR-13). */
function withEnd(result: Result, content: Content): Result {
  return result.ok
    ? { ok: true, state: evaluateEnd(result.state, content) }
    : result;
}

/**
 * `state` is null when no journey has started. Every successful action except
 * `startJourney` runs the end rules, so the result already carries `outcome`.
 */
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
      return withEnd(
        applyTravel(state, action.to, action.mode, content),
        content,
      );
    case "spendCityDay":
      return withEnd(
        applySpendCityDay(state, action.sightIds, content),
        content,
      );
    case "callHome":
      return withEnd(applyCallHome(state, content), content);
    default: {
      const unhandled: never = action;
      return unhandled;
    }
  }
}
