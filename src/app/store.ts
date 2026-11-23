// The journey store (Structural Seed: `useReducer` around `apply`, AD-2).
// The only way the UI changes the game is dispatching an `Action`; `apply`
// decides. A rejected action keeps the game unchanged and records its reason,
// so the UI never computes rules itself (AD-3). Nothing here is saved: the
// core keeps no journey across reloads (PRD §9.7, Decision L).
import {
  createContext,
  createElement,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { apply } from "../rules/apply";
import type { Action, Content, GameState, ReasonCode } from "../rules/types";
import { useContent } from "./content";

export interface JourneyState {
  /** `null` until a journey has started. */
  game: GameState | null;
  /** Reason of the last rejected action; cleared by the next accepted one. */
  rejection: ReasonCode | null;
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
    : { game: state.game, rejection: result.reason };
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
  return createElement(
    JourneyContext.Provider,
    { value: { state, dispatch } },
    children,
  );
}

/** The journey state and dispatch. Must be used inside JourneyProvider. */
export function useJourney(): JourneyContextValue {
  const value = useContext(JourneyContext);
  if (value === null) {
    throw new Error("useJourney() must be used inside <JourneyProvider>");
  }
  return value;
}
