// FR-11 FR-12 call home: the call-home rows of the I/O matrix in
// .docs/implementation-artifacts/spec-3-1-goal-call-home-and-end-rules.md,
// the reject order, the callHomeStatus query and a query-and-apply agreement
// grid (AD-3). Every callHome call runs through applyFrozen (see ./helpers.ts).
import { describe, expect, it } from "vitest";
import { loadContent } from "../../src/content/load";
import { callHome } from "../../src/rules/apply";
import { callHomeStatus } from "../../src/rules/queries";
import type {
  CallHomeStatus,
  Config,
  Content,
  GameState,
  Result,
  Stamp,
} from "../../src/rules/types";
import {
  applyFrozen,
  deepFreeze,
  smallContent,
  started,
  stateWith,
} from "./helpers";

/** Runs callHomeStatus on frozen inputs and asserts that neither input changed. */
function statusFrozen(state: GameState, content: Content): CallHomeStatus {
  const before = structuredClone({ state, content });
  const status = callHomeStatus(deepFreeze(state), deepFreeze(content));
  expect({ state, content }).toEqual(before);
  return status;
}

function call(state: GameState, content: Content): Result {
  return applyFrozen(state, callHome(), content);
}

/** The small fixture with some call-home values overridden. */
function withCallHome(patch: Partial<Config["callHome"]>): Content {
  const content = smallContent();
  return deepFreeze({
    ...content,
    config: {
      ...content.config,
      callHome: { ...content.config.callHome, ...patch },
    },
  });
}

const stamps = (...ids: string[]): Stamp[] =>
  ids.map((id, i) => ({ id, day: i + 1 }));

// Small fixture: alpha's cheapest mode is the €40 bus to home; callHome is
// 3 days, 1 stamp, €0; 10 days in total; goal is 2 stamps.
describe("FR-12 FR-11 call home", () => {
  describe("apply", () => {
    it("goes home, uses the days, removes the last stamp and keeps the money", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "alpha",
        money: 39,
        daysUsed: 4,
        stamps: stamps("beta-town", "alpha"),
        album: [{ id: "alpha-one", day: 2 }],
        cityDays: { "beta-town": 1, alpha: 1 },
      });
      const next = started(call(state, content));
      expect(next).toEqual({
        ...state,
        position: "home",
        money: 39,
        daysUsed: 7,
        stamps: [{ id: "beta-town", day: 1 }],
        calledHome: true,
        outcome: "goalNotReached",
        failReason: null,
      });
    });

    it("keeps empty stamps empty with no stamps", () => {
      const content = smallContent();
      const state = stateWith(content, { position: "alpha", money: 0 });
      const next = started(call(state, content));
      expect(next.stamps).toEqual([]);
      expect(next.calledHome).toBe(true);
      expect(next.outcome).toBe("goalNotReached");
    });

    it("reaches the goal when the stamps left still meet it (FR-11 literal)", () => {
      const content = smallContent();
      expect(content.config.goalStamps).toBe(2);
      const state = stateWith(content, {
        position: "alpha",
        money: 0,
        daysUsed: 5,
        stamps: stamps("alpha", "beta-town", "alpha"),
      });
      const next = started(call(state, content));
      expect(next.stamps).toHaveLength(2);
      expect(next).toMatchObject({
        daysUsed: 8,
        calledHome: true,
        outcome: "goalReached",
        failReason: null,
      });
    });

    it("allows days remaining equal to the call-home days", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "alpha",
        money: 0,
        daysUsed: 7,
        stamps: stamps("alpha", "beta-town", "alpha"),
      });
      const next = started(call(state, content));
      expect(next.daysUsed).toBe(10);
      expect(next.outcome).toBe("goalReached");
    });

    it("removes the last stampPenalty stamps, or fewer if there are fewer", () => {
      const content = withCallHome({ stampPenalty: 2 });
      const three = stateWith(content, {
        position: "alpha",
        money: 0,
        stamps: stamps("alpha", "beta-town", "alpha"),
      });
      expect(started(call(three, content)).stamps).toEqual([
        { id: "alpha", day: 1 },
      ]);
      const one = stateWith(content, {
        position: "alpha",
        money: 0,
        stamps: stamps("alpha"),
      });
      expect(started(call(one, content)).stamps).toEqual([]);
    });

    it("charges callHome.price and allows money equal to it", () => {
      const content = withCallHome({ price: 5 });
      const state = stateWith(content, { position: "alpha", money: 5 });
      expect(started(call(state, content)).money).toBe(0);
    });

    it("is offered at a destination with no routes, whatever the money", () => {
      const small = smallContent();
      const content = deepFreeze({
        ...small,
        routes: small.routes.filter((r) => !r.between.includes("beta-town")),
      });
      const state = stateWith(content, {
        position: "beta-town",
        money: 1500,
      });
      expect(statusFrozen(state, content).offered).toBe(true);
      expect(started(call(state, content)).position).toBe("home");
    });
  });

  describe("rejects, with state unchanged, in the fixed order", () => {
    const content = withCallHome({ price: 5 });
    const rows: { name: string; patch: Partial<GameState>; reason: string }[] =
      [
        {
          name: "JOURNEY_ENDED before AT_HOME",
          patch: { position: "home", money: 0, outcome: "goalNotReached" },
          reason: "JOURNEY_ENDED",
        },
        {
          name: "JOURNEY_ENDED when ended away (stranded)",
          patch: {
            position: "alpha",
            money: 0,
            daysUsed: 9,
            outcome: "failed",
            failReason: "stranded",
          },
          reason: "JOURNEY_ENDED",
        },
        {
          name: "AT_HOME before CALL_HOME_NOT_OFFERED",
          patch: { position: "home", money: 0 },
          reason: "AT_HOME",
        },
        {
          name: "CALL_HOME_NOT_OFFERED before NOT_ENOUGH_DAYS",
          patch: { position: "alpha", money: 40, daysUsed: 9 },
          reason: "CALL_HOME_NOT_OFFERED",
        },
        {
          name: "NOT_ENOUGH_DAYS before NOT_ENOUGH_MONEY",
          patch: { position: "alpha", money: 4, daysUsed: 8 },
          reason: "NOT_ENOUGH_DAYS",
        },
        {
          name: "NOT_ENOUGH_MONEY last",
          patch: { position: "alpha", money: 4 },
          reason: "NOT_ENOUGH_MONEY",
        },
      ];
    for (const { name, patch, reason } of rows) {
      it(name, () => {
        const state = stateWith(content, patch);
        expect(call(state, content)).toEqual({ ok: false, reason });
      });
    }

    it("CALL_HOME_NOT_OFFERED when money equals the cheapest fare", () => {
      const small = smallContent();
      const state = stateWith(small, { position: "alpha", money: 40 });
      expect(call(state, small)).toEqual({
        ok: false,
        reason: "CALL_HOME_NOT_OFFERED",
      });
      expect(statusFrozen(state, small).offered).toBe(false);
      const below = stateWith(small, { position: "alpha", money: 39 });
      expect(statusFrozen(below, small).offered).toBe(true);
    });

    it("NO_JOURNEY without a state", () => {
      expect(applyFrozen(null, callHome(), smallContent())).toEqual({
        ok: false,
        reason: "NO_JOURNEY",
      });
    });
  });

  describe("callHomeStatus", () => {
    it("shows the cost before confirming", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "alpha",
        money: 39,
        daysUsed: 4,
        stamps: stamps("alpha"),
      });
      expect(statusFrozen(state, content)).toEqual({
        offered: true,
        fits: true,
        available: true,
        reason: null,
        days: 3,
        stampsLost: 1,
        price: 0,
        daysUsedAfter: 7,
      });
    });

    it("gives stampsLost 0 with no stamps", () => {
      const content = smallContent();
      const state = stateWith(content, { position: "alpha", money: 0 });
      expect(statusFrozen(state, content).stampsLost).toBe(0);
    });

    it("shows offered but not fitting (stranded) as unavailable", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "alpha",
        money: 0,
        daysUsed: 8,
      });
      expect(statusFrozen(state, content)).toMatchObject({
        offered: true,
        fits: false,
        available: false,
        reason: "NOT_ENOUGH_DAYS",
        daysUsedAfter: 11,
      });
    });

    it("is not offered at home or after the end", () => {
      const content = smallContent();
      const home = stateWith(content, { money: 0 });
      expect(statusFrozen(home, content)).toMatchObject({
        offered: false,
        available: false,
        reason: "AT_HOME",
      });
      const ended = stateWith(content, {
        position: "alpha",
        money: 0,
        daysUsed: 9,
        outcome: "failed",
        failReason: "stranded",
      });
      expect(statusFrozen(ended, content)).toMatchObject({
        offered: false,
        available: false,
        reason: "JOURNEY_ENDED",
      });
    });
  });

  describe("query and apply agree (AD-3)", () => {
    const contents = [
      smallContent(),
      withCallHome({ price: 5, stampPenalty: 2 }),
      deepFreeze(loadContent()),
    ];
    it("gives the same availability and reason as apply in every case", () => {
      let checked = 0;
      for (const content of contents) {
        const places = [
          content.home.id,
          ...content.destinations.map((d) => d.id),
        ];
        for (const position of places) {
          for (const money of [0, 4, 5, 39, 40, 49, 50, 1500]) {
            for (const daysUsed of [0, 7, 8, 23, 24, 30]) {
              for (const outcome of [null, "goalNotReached" as const]) {
                const [first, second] = content.destinations;
                for (const s of [[], stamps(first.id, second.id)]) {
                  const state = stateWith(content, {
                    position,
                    money,
                    daysUsed,
                    outcome,
                    stamps: s,
                  });
                  const status = callHomeStatus(state, content);
                  const result = applyFrozen(state, callHome(), content);
                  if (status.reason === "CALL_HOME_NOT_OFFERED") {
                    expect(status.offered).toBe(false);
                  }
                  if (status.reason === "NOT_ENOUGH_DAYS") {
                    expect(status.offered && !status.fits).toBe(true);
                  }
                  if (status.available) {
                    expect(status.reason).toBeNull();
                    expect(status.offered && status.fits).toBe(true);
                    expect(result.ok).toBe(true);
                  } else {
                    expect(result).toEqual({
                      ok: false,
                      reason: status.reason,
                    });
                  }
                  checked++;
                }
              }
            }
          }
        }
      }
      expect(checked).toBeGreaterThan(1000);
    });
  });

  describe("action creator", () => {
    it("builds a callHome action", () => {
      expect(callHome()).toEqual({ type: "callHome" });
    });
  });
});
