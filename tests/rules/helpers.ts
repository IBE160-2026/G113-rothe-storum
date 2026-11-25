// Shared helpers for the rules tests. Inputs are deep-frozen and compared with
// a structuredClone taken before the call, so a mutation fails twice (a
// TypeError in strict mode, or a diff).
import { readFileSync } from "node:fs";
import { expect } from "vitest";
import { parseContent, type RawContent } from "../../src/content/load";
import { apply, startJourney } from "../../src/rules/apply";
import type { Action, Content, GameState, Result } from "../../src/rules/types";

/** A freshly parsed fixture from tests/fixtures/content/ (as in content.test.ts). */
export function fixture(name: string): RawContent {
  const url = new URL(`../fixtures/content/${name}`, import.meta.url);
  return JSON.parse(readFileSync(url, "utf8")) as RawContent;
}

export function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object") {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

export function smallContent(): Content {
  return deepFreeze(parseContent(fixture("valid-small.json")));
}

/** Runs apply on frozen inputs and asserts that neither input changed. */
export function applyFrozen(
  state: GameState | null,
  action: Action,
  content: Content,
): Result {
  const before = structuredClone({ state, content });
  deepFreeze(state);
  deepFreeze(content);
  const result = apply(state, action, content);
  expect({ state, content }).toEqual(before);
  return result;
}

export function started(result: Result): GameState {
  if (!result.ok) throw new Error(`expected ok, got ${result.reason}`);
  return result.state;
}

/** Runs actions in order through applyFrozen; each must succeed. */
export function play(
  state: GameState,
  actions: Action[],
  content: Content,
): GameState {
  return actions.reduce(
    (s, action) => started(applyFrozen(s, action, content)),
    state,
  );
}

/** A fresh journey with some fields overridden, as a frozen state. */
export function stateWith(
  content: Content,
  patch: Partial<GameState>,
): GameState {
  const fresh = started(apply(null, startJourney({ name: "Ada" }), content));
  return deepFreeze({ ...fresh, ...patch });
}
