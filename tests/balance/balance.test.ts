// SM-3 balance over the real content (Story 4.1). An exhaustive search that
// drives the game only through `apply` from startJourney, so the rules, not a
// copy of them, decide what fits. It asserts the SM-3 thresholds, not prices:
// a price change that breaks the design fails here (SM-C2: never lower prices
// to make it pass).
//
// Search: a state is keyed by position, set of stamps and days used, and only
// the state with the most money per key is kept (more money never removes an
// option, and the album and city days follow from the stamps in each run).
// Days used rise with every move, so the keys are expanded in order of days
// used. A move is a travel by any mode, then optionally one city day at an
// unstamped destination. A city day is never repeated and the search may pass
// through a city without one (stopovers). A journey counts only when `apply`
// ends it at home, which the rules allow only within the days total.
//
// Call home is not a move: a journey counts only when it travels home (PRD
// addendum §6 model). That model is complete, because a journey ended by call
// home never reaches the goal (PRD Decision N, #66).
import { describe, expect, it } from "vitest";
import { loadContent } from "../../src/content/load";
import {
  apply,
  spendCityDay,
  startJourney,
  travel,
} from "../../src/rules/apply";
import type { Action, Content, GameState } from "../../src/rules/types";
import { deepFreeze } from "../rules/helpers";

const EUROPE = ["copenhagen", "istanbul", "london", "paris", "rome"].join(",");

interface SearchResult {
  /** Sorted stamp sets that ended `goalReached`, with the best money left. */
  goalSets: Map<string, number>;
  /** Sorted stamp sets that arrived home with 6 or more stamps. */
  sixPlusHome: string[];
}

function stampSet(state: GameState): string {
  return state.stamps
    .map((s) => s.id)
    .sort()
    .join(",");
}

function keyOf(state: GameState): string {
  return `${state.position}|${stampSet(state)}|${String(state.daysUsed)}`;
}

function search(content: Content, withSights: boolean): SearchResult {
  const goalSets = new Map<string, number>();
  const sixPlusHome: string[] = [];
  const start = apply(null, startJourney({ name: "Balance" }), content);
  if (!start.ok) throw new Error(`startJourney rejected: ${start.reason}`);

  // buckets[daysUsed]: key → best state.
  const buckets: Map<string, GameState>[] = [];
  const keep = (state: GameState) => {
    const bucket = (buckets[state.daysUsed] ??= new Map());
    const key = keyOf(state);
    const best = bucket.get(key);
    if (best === undefined || state.money > best.money) bucket.set(key, state);
  };
  const record = (state: GameState) => {
    if (state.position !== content.home.id) return; // failed away from home
    if (state.stamps.length >= 6) sixPlusHome.push(stampSet(state));
    if (state.outcome === "goalReached") {
      const set = stampSet(state);
      goalSets.set(set, Math.max(goalSets.get(set) ?? -1, state.money));
    }
  };
  /** Keeps a running state, or records an ended one. */
  const next = (state: GameState) => {
    if (state.outcome === null) keep(state);
    else record(state);
  };

  const neighbours = (place: string) =>
    content.routes.flatMap(({ between: [a, b], modes }) =>
      a === place
        ? modes.map((m) => travel({ to: b, mode: m.mode }))
        : b === place
          ? modes.map((m) => travel({ to: a, mode: m.mode }))
          : [],
    );
  const cityDay = (place: string): Action =>
    spendCityDay({
      sightIds: withSights
        ? content.sights.filter((s) => s.destId === place).map((s) => s.id)
        : [],
    });

  keep(start.state);
  for (let day = 0; day < buckets.length; day++) {
    for (const state of buckets[day]?.values() ?? []) {
      for (const action of neighbours(state.position)) {
        const moved = apply(state, action, content);
        if (!moved.ok) continue;
        next(moved.state);
        const arrived = moved.state;
        if (
          arrived.outcome !== null ||
          arrived.stamps.some((s) => s.id === arrived.position)
        ) {
          continue;
        }
        const stayed = apply(arrived, cityDay(arrived.position), content);
        if (stayed.ok) next(stayed.state);
      }
    }
  }
  return { goalSets, sixPlusHome };
}

describe("SM-3 FR-6 FR-8 FR-11 FR-21 balance (real content)", () => {
  const content = deepFreeze(loadContent());

  it("at least 3 five-stamp sets reach the goal without sights, Europe among them", () => {
    const { goalSets, sixPlusHome } = search(content, false);
    expect(goalSets.has(EUROPE)).toBe(true);
    expect(goalSets.size).toBeGreaterThanOrEqual(3);
    expect(sixPlusHome).toEqual([]);
    for (const set of goalSets.keys()) {
      expect(set.split(",")).toHaveLength(content.config.goalStamps);
    }
  });

  it("detects a breaking price: a €200 Rome stay leaves fewer than 3 sets", () => {
    const pricey = deepFreeze({
      ...content,
      destinations: content.destinations.map((d) =>
        d.id === "rome" ? { ...d, costFactor: 4.0 } : d,
      ),
    });
    expect(search(pricey, false).goalSets.size).toBeLessThan(3);
  });

  it("detects six-stamp journeys: a €5 base stay lets one arrive home", () => {
    const cheap = deepFreeze({
      ...content,
      config: { ...content.config, baseAccommodationPrice: 5 },
    });
    expect(search(cheap, false).sixPlusHome).not.toEqual([]);
  });

  it("at least 1 set reaches the goal with a full photo album, Europe among them", () => {
    const { goalSets, sixPlusHome } = search(content, true);
    expect(goalSets.has(EUROPE)).toBe(true);
    expect(goalSets.size).toBeGreaterThanOrEqual(1);
    expect(sixPlusHome).toEqual([]);
    for (const set of goalSets.keys()) {
      expect(set.split(",")).toHaveLength(content.config.goalStamps);
    }
  });
});
