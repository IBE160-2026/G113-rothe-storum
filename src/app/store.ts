// The journey store (Structural Seed: `useReducer` around `apply`, AD-2).
// The only way the UI changes the game is dispatching an `Action`; `apply`
// decides. A rejected action keeps the game unchanged and records its reason,
// so the UI never computes rules itself (AD-3). Nothing here is saved: the
// core keeps no journey across reloads (PRD §9.7, Decision L).
import {
  createContext,
  createElement,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { apply } from "../rules/apply";
import type { Action, Content, GameState, ReasonCode } from "../rules/types";
import { useContent } from "./content";

/**
 * The last rejected action. Every rejection is a new object, and `seq` counts
 * rejections in a row, so the UI can show feedback again when the same reason
 * repeats (for example two INSUFFICIENT_FUNDS in a row).
 */
export interface Rejection {
  reason: ReasonCode;
  /** 1 for the first rejection after an accepted action, then 2, 3, … */
  seq: number;
}

export interface JourneyState {
  /** `null` until a journey has started. */
  game: GameState | null;
  /**
   * The last rejected action; cleared by the next accepted one. It is not
   * cleared on screen changes: the UI decides when an old rejection is stale.
   */
  rejection: Rejection | null;
}

export const initialJourneyState: JourneyState = {
  game: null,
  rejection: null,
};

/** Pure reducer: delegates every action to `apply`. */
export function journeyReducer(
  state: JourneyState,
  action: Action,
  content: Content,
): JourneyState {
  const result = apply(state.game, action, content);
  return result.ok
    ? { game: result.state, rejection: null }
    : {
        game: state.game,
        rejection: {
          reason: result.reason,
          seq: (state.rejection?.seq ?? 0) + 1,
        },
      };
}

interface JourneyContextValue {
  state: JourneyState;
  dispatch: Dispatch<Action>;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

/** Holds the journey for the app. Must sit inside ContentProvider. */
export function JourneyProvider({ children }: { children: ReactNode }) {
  const content = useContent();
  const [state, dispatch] = useReducer(
    (current: JourneyState, action: Action) =>
      journeyReducer(current, action, content),
    initialJourneyState,
  );
  // A stable value, so consumers re-render only when the journey changes.
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return createElement(JourneyContext.Provider, { value }, children);
}

/** The journey state and dispatch. Must be used inside JourneyProvider. */
export function useJourney(): JourneyContextValue {
  const value = useContext(JourneyContext);
  if (value === null) {
    throw new Error("useJourney() must be used inside <JourneyProvider>");
  }
  return value;
}
