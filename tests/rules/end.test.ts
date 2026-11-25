// FR-11 FR-12 FR-13 end rules: the end rows of the I/O matrix in
// .docs/implementation-artifacts/spec-3-1-goal-call-home-and-end-rules.md and
// the UJ-2 acceptance script on the real content. Every action runs through
// applyFrozen (see ./helpers.ts), so `apply`'s own result must already carry
// the outcome.
import { describe, expect, it } from "vitest";
import { loadContent } from "../../src/content/load";
import {
  callHome,
  spendCityDay,
  startJourney,
  travel,
} from "../../src/rules/apply";
import { evaluateEnd } from "../../src/rules/end";
import { callHomeStatus, routesFrom } from "../../src/rules/queries";
import type {
  Action,
  Content,
  GameState,
  Outcome,
} from "../../src/rules/types";
import {
  applyFrozen,
  deepFreeze,
  play,
  smallContent,
  started,
  stateWith,
} from "./helpers";

/** The small fixture with a €10 stay at alpha, so a city day is affordable. */
function cheapStay(): Content {
  const content = smallContent();
  return deepFreeze({
    ...content,
    config: { ...content.config, baseAccommodationPrice: 10 },
  });
}

// Small fixture: home–alpha plane €100/1 d and bus €40/2 d, alpha–beta-town
// train €80/1 d; alpha stay €50; 10 days; call home 3 days; goal 2 stamps.
describe("FR-13 FR-11 end rules", () => {
  describe("stranded", () => {
    it("a city day that leaves call home offered but not fitting ends stranded", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "alpha",
        money: 89,
        daysUsed: 7,
      });
      const next = started(
        applyFrozen(state, spendCityDay({ sightIds: [] }), content),
      );
      expect(next).toMatchObject({
        position: "alpha",
        money: 39,
        daysUsed: 8,
        stamps: [{ id: "alpha", day: 8 }],
        outcome: "failed",
        failReason: "stranded",
      });
    });

    it("ends stranded even if a city day is still affordable", () => {
      const content = cheapStay();
      const state = stateWith(content, {
        position: "beta-town",
        money: 119,
        daysUsed: 7,
      });
      const next = started(
        applyFrozen(state, travel({ to: "alpha", mode: "train" }), content),
      );
      expect(next).toMatchObject({ money: 39, daysUsed: 8 });
      expect(next.outcome).toBe("failed");
      expect(next.failReason).toBe("stranded");
    });

    it("a destination with no routes where call home does not fit ends stranded", () => {
      const small = smallContent();
      const content = deepFreeze({
        ...small,
        routes: small.routes.filter((r) => !r.between.includes("beta-town")),
      });
      const state = stateWith(content, {
        position: "beta-town",
        money: 1500,
        daysUsed: 7,
      });
      const next = started(
        applyFrozen(state, spendCityDay({ sightIds: [] }), content),
      );
      expect(next).toMatchObject({
        daysUsed: 8,
        outcome: "failed",
        failReason: "stranded",
      });
    });

    it("continues while call home is offered and fits", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "beta-town",
        money: 119,
        daysUsed: 6,
      });
      const next = started(
        applyFrozen(state, travel({ to: "alpha", mode: "train" }), content),
      );
      expect(next.daysUsed).toBe(7);
      expect(callHomeStatus(next, content)).toMatchObject({
        offered: true,
        fits: true,
      });
      expect(next.outcome).toBeNull();
      expect(next.failReason).toBeNull();
    });
  });

  describe("out of days", () => {
    it("ends outOfDays when call home is offered and fits but cannot be paid", () => {
      const small = smallContent();
      const content = deepFreeze({
        ...small,
        config: {
          ...small.config,
          callHome: { ...small.config.callHome, price: 50 },
        },
      });
      const state = stateWith(content, {
        position: "beta-town",
        money: 119,
        daysUsed: 0,
      });
      // At alpha: €39, 9 days left. Every fare is above €39, the €50 stay is
      // unaffordable, and call home is offered and fits but costs €50.
      const next = started(
        applyFrozen(state, travel({ to: "alpha", mode: "train" }), content),
      );
      const running = stateWith(content, {
        position: "alpha",
        money: 39,
        daysUsed: 1,
      });
      expect(callHomeStatus(running, content)).toMatchObject({
        offered: true,
        fits: true,
        available: false,
        reason: "NOT_ENOUGH_MONEY",
      });
      expect(next).toMatchObject({
        money: 39,
        daysUsed: 1,
        outcome: "failed",
        failReason: "outOfDays",
      });
    });

    it("continues while an affordable route still fits", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "beta-town",
        money: 125,
        daysUsed: 0,
      });
      // At alpha: €45, 9 days left. The €50 stay is unaffordable and €45 ≥ €40
      // so call home is not offered; only the €40 bus home (found through
      // between[1] of home–alpha) passes.
      const next = started(
        applyFrozen(state, travel({ to: "alpha", mode: "train" }), content),
      );
      expect(next).toMatchObject({ money: 45, daysUsed: 1 });
      const passing = routesFrom(next, content).flatMap((r) =>
        r.options.filter((o) => o.available).map((o) => [r.to, o.mode]),
      );
      expect(passing).toEqual([["home", "bus"]]);
      expect(callHomeStatus(next, content).offered).toBe(false);
      expect(next.outcome).toBeNull();
      expect(next.failReason).toBeNull();
    });

    it("affordable routes but none fits and 0 days left ends outOfDays", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "alpha",
        money: 150,
        daysUsed: 9,
      });
      const next = started(
        applyFrozen(state, spendCityDay({ sightIds: [] }), content),
      );
      expect(next).toMatchObject({
        money: 100,
        daysUsed: 10,
        outcome: "failed",
        failReason: "outOfDays",
      });
    });

    it("an affordable route that does not fit and an unaffordable city day ends outOfDays", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "beta-town",
        money: 125,
        daysUsed: 8,
      });
      // At alpha: €45, 1 day left. Bus €40 needs 2 days, plane and train are
      // unaffordable, the €50 stay is unaffordable, and €45 ≥ €40 so call home
      // is not offered.
      const next = started(
        applyFrozen(state, travel({ to: "alpha", mode: "train" }), content),
      );
      expect(next).toMatchObject({
        money: 45,
        daysUsed: 9,
        outcome: "failed",
        failReason: "outOfDays",
      });
    });

    it("continues while a city day is still possible", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "beta-town",
        money: 140,
        daysUsed: 8,
      });
      // At alpha: €60, 1 day left. No route fits or is affordable in time,
      // but the €50 stay fits.
      const next = started(
        applyFrozen(state, travel({ to: "alpha", mode: "train" }), content),
      );
      expect(next).toMatchObject({ money: 60, daysUsed: 9 });
      expect(next.outcome).toBeNull();
      expect(next.failReason).toBeNull();
    });
  });

  describe("home", () => {
    it("arriving home with no money is goalNotReached, not failed", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "alpha",
        money: 40,
        daysUsed: 8,
      });
      const next = started(
        applyFrozen(state, travel({ to: "home", mode: "bus" }), content),
      );
      expect(next).toMatchObject({
        money: 0,
        daysUsed: 10,
        outcome: "goalNotReached",
        failReason: null,
      });
    });

    it("a new journey is not ended at home", () => {
      const content = smallContent();
      const fresh = started(
        applyFrozen(null, startJourney({ name: "Ada" }), content),
      );
      expect(fresh.position).toBe("home");
      expect(fresh.outcome).toBeNull();
    });
  });

  describe("evaluateEnd", () => {
    it("returns an ended state as is", () => {
      const content = smallContent();
      const ended = stateWith(content, {
        position: "home",
        stamps: [
          { id: "alpha", day: 1 },
          { id: "beta-town", day: 2 },
        ],
        outcome: "goalNotReached",
      });
      expect(evaluateEnd(ended, content)).toBe(ended);
    });

    it("home with enough stamps but more days than the total is goalNotReached", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "home",
        daysUsed: 11,
        stamps: [
          { id: "alpha", day: 1 },
          { id: "beta-town", day: 2 },
        ],
      });
      expect(evaluateEnd(state, content)).toMatchObject({
        outcome: "goalNotReached",
        failReason: null,
      });
    });

    it("home with enough stamps in time is goalReached only when not called home (Decision N)", () => {
      const content = smallContent();
      const home = (calledHome: boolean) =>
        stateWith(content, {
          position: "home",
          daysUsed: 8,
          calledHome,
          stamps: [
            { id: "alpha", day: 1 },
            { id: "beta-town", day: 2 },
          ],
        });
      expect(content.config.goalStamps).toBe(2);
      expect(evaluateEnd(home(false), content)).toMatchObject({
        outcome: "goalReached",
        failReason: null,
      });
      expect(evaluateEnd(home(true), content)).toMatchObject({
        outcome: "goalNotReached",
        failReason: null,
      });
    });

    it("leaves a running journey with options unchanged", () => {
      const content = smallContent();
      const state = stateWith(content, { position: "alpha", money: 500 });
      expect(evaluateEnd(state, content)).toBe(state);
    });
  });

  describe("after the end", () => {
    const endings: { outcome: Outcome; failReason: GameState["failReason"] }[] =
      [
        { outcome: "goalReached", failReason: null },
        { outcome: "goalNotReached", failReason: null },
        { outcome: "failed", failReason: "stranded" },
        { outcome: "failed", failReason: "outOfDays" },
      ];
    const actions: Action[] = [
      travel({ to: "home", mode: "plane" }),
      travel({ to: "beta-town", mode: "train" }),
      spendCityDay({ sightIds: [] }),
      callHome(),
    ];
    for (const ending of endings) {
      it(`rejects every action except startJourney (${ending.outcome} ${String(ending.failReason)})`, () => {
        const content = smallContent();
        const state = stateWith(content, {
          position: "alpha",
          money: 0,
          ...ending,
        });
        for (const action of actions) {
          expect(applyFrozen(state, action, content)).toEqual({
            ok: false,
            reason: "JOURNEY_ENDED",
          });
        }
        const restarted = started(
          applyFrozen(state, startJourney({ name: "Ada" }), content),
        );
        expect(restarted.outcome).toBeNull();
      });
    }
  });
});

describe("FR-11 FR-12 FR-13 UJ-2 Jonas calls home from Rome (real content)", () => {
  const content = deepFreeze(loadContent());
  const fresh = () =>
    started(applyFrozen(null, startJourney({ name: "Jonas" }), content));
  const city = (...sightIds: string[]) => spendCityDay({ sightIds });

  /**
   * UJ-2 as the PRD tells it: plane to New York (€350) and three city days
   * there, plane to Paris, train to London, plane to Rome, with a city day in
   * each. This list stops before the Rome city day, which leaves €20 after 10
   * days used.
   */
  const toRome: Action[] = [
    travel({ to: "new-york", mode: "plane" }),
    city(),
    city(),
    city(),
    travel({ to: "paris", mode: "plane" }),
    city(),
    travel({ to: "london", mode: "train" }),
    city(),
    travel({ to: "rome", mode: "plane" }),
  ];

  it("calls home at 10 days: 17 days, 3 stamps, €20, goal not reached", () => {
    const before = play(fresh(), toRome, content);
    expect(before).toMatchObject({ position: "rome", money: 90, daysUsed: 9 });
    expect(callHomeStatus(before, content).offered).toBe(false);

    const rome = play(before, [city()], content);
    expect(rome).toMatchObject({
      position: "rome",
      money: 20,
      daysUsed: 10,
      outcome: null,
    });
    expect(rome.stamps.map((s) => s.id)).toEqual([
      "new-york",
      "paris",
      "london",
      "rome",
    ]);
    expect(callHomeStatus(rome, content)).toEqual({
      offered: true,
      fits: true,
      available: true,
      reason: null,
      days: 7,
      stampsLost: 1,
      price: 0,
      daysUsedAfter: 17,
    });

    const home = started(applyFrozen(rome, callHome(), content));
    expect(home).toMatchObject({
      position: "home",
      daysUsed: 17,
      money: 20,
      calledHome: true,
      outcome: "goalNotReached",
      failReason: null,
    });
    expect(home.stamps.map((s) => s.id)).toEqual([
      "new-york",
      "paris",
      "london",
    ]);
  });

  it("the same situation at 24 days used ends stranded with 4 stamps", () => {
    // 14 more days: buses London → Paris → Rome, then three Rome ↔ Paris
    // round trips by bus, so the last Rome city day leaves €20 at 24 days.
    const bus = (to: string) => travel({ to, mode: "bus" });
    const late: Action[] = [
      travel({ to: "new-york", mode: "plane" }),
      city(),
      travel({ to: "paris", mode: "plane" }),
      city(),
      bus("london"),
      city(),
      bus("paris"),
      bus("rome"),
      bus("paris"),
      bus("rome"),
      bus("paris"),
      bus("rome"),
      bus("paris"),
      bus("rome"),
    ];
    const before = play(fresh(), late, content);
    expect(before).toMatchObject({
      position: "rome",
      money: 90,
      daysUsed: 23,
      outcome: null,
    });

    const end = started(applyFrozen(before, city(), content));
    expect(end).toMatchObject({
      position: "rome",
      money: 20,
      daysUsed: 24,
      calledHome: false,
      outcome: "failed",
      failReason: "stranded",
    });
    expect(end.stamps.map((s) => s.id)).toEqual([
      "new-york",
      "paris",
      "london",
      "rome",
    ]);
    expect(applyFrozen(end, callHome(), content)).toEqual({
      ok: false,
      reason: "JOURNEY_ENDED",
    });
  });
});

describe("FR-11 FR-12 Decision N the #66 call-home loophole is closed (real content)", () => {
  const content = deepFreeze(loadContent());
  const city = () => spendCityDay({ sightIds: [] });

  /**
   * The only journey that won via call home under the old rule (#66): bus
   * through Copenhagen, Paris, Rome and Istanbul, then plane to Tokyo and
   * Sydney, with a city day in each. Sydney leaves too little money for any
   * route out, so call home is offered and fits.
   */
  const toSydney: Action[] = [
    travel({ to: "copenhagen", mode: "bus" }),
    city(),
    travel({ to: "paris", mode: "bus" }),
    city(),
    travel({ to: "rome", mode: "bus" }),
    city(),
    travel({ to: "istanbul", mode: "bus" }),
    city(),
    travel({ to: "tokyo", mode: "plane" }),
    city(),
    travel({ to: "sydney", mode: "plane" }),
    city(),
  ];

  it("calls home from Sydney with 6 stamps and ends with Tokyo kept but the goal not reached", () => {
    const start = started(
      applyFrozen(null, startJourney({ name: "Loophole" }), content),
    );
    const sydney = play(start, toSydney, content);
    expect(sydney).toMatchObject({ position: "sydney", outcome: null });
    expect(sydney.stamps).toHaveLength(6);
    expect(callHomeStatus(sydney, content)).toMatchObject({
      offered: true,
      fits: true,
      available: true,
    });

    const home = started(applyFrozen(sydney, callHome(), content));
    expect(home.stamps.map((s) => s.id)).toEqual([
      "copenhagen",
      "paris",
      "rome",
      "istanbul",
      "tokyo",
    ]);
    expect(home).toMatchObject({
      position: "home",
      calledHome: true,
      outcome: "goalNotReached",
      failReason: null,
    });
    expect(home.daysUsed).toBeLessThanOrEqual(
      content.config.modes.explorer.totalDays,
    );
  });
});
