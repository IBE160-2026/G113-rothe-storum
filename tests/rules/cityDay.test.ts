// FR-8 FR-9 FR-10 FR-21 FR-22 city days, stamps and sights: every row of the
// I/O matrix in .docs/implementation-artifacts/spec-2-1-city-day-stamps-and-sights.md,
// the city-day queries, and a query-and-apply agreement grid (AD-3).
// Every spendCityDay call runs through applyFrozen (see ./helpers.ts).
import { describe, expect, it } from "vitest";
import { loadContent } from "../../src/content/load";
import {
  apply,
  spendCityDay,
  startJourney,
  travel,
} from "../../src/rules/apply";
import { cityDayPlan, cityDayStatus, daysTotal } from "../../src/rules/queries";
import type {
  CityDayPlan,
  Content,
  GameState,
  Result,
} from "../../src/rules/types";
import { applyFrozen, deepFreeze, smallContent, started } from "./helpers";

/** A fresh journey with some fields overridden, as a frozen state. */
function stateWith(content: Content, patch: Partial<GameState>): GameState {
  const fresh = started(apply(null, startJourney({ name: "Ada" }), content));
  return deepFreeze({ ...fresh, ...patch });
}

/** Runs cityDayPlan on frozen inputs and asserts that neither input changed. */
function planFrozen(
  state: GameState,
  sightIds: readonly string[],
  content: Content,
): CityDayPlan {
  const before = structuredClone({ state, content });
  const plan = cityDayPlan(deepFreeze(state), sightIds, deepFreeze(content));
  expect({ state, content }).toEqual(before);
  return plan;
}

/** Spends a city day at the state's position through applyFrozen. */
function spend(state: GameState, sightIds: unknown, content: Content): Result {
  return applyFrozen(
    state,
    spendCityDay({ sightIds: sightIds as string[] }),
    content,
  );
}

/** A frozen state at alpha in the small fixture. */
function atAlpha(patch: Partial<GameState> = {}) {
  const content = smallContent();
  return {
    content,
    state: stateWith(content, { position: "alpha", ...patch }),
  };
}

describe("FR-8 FR-9 FR-10 FR-21 FR-22 city day", () => {
  describe("stay and stamp", () => {
    it("spends a city day in Paris with the real content", () => {
      const content = deepFreeze(loadContent());
      const state = stateWith(content, {
        position: "paris",
        money: 300,
        daysUsed: 4,
      });
      expect(spend(state, [], content)).toEqual({
        ok: true,
        state: {
          ...state,
          money: 220,
          daysUsed: 5,
          cityDays: { paris: 1 },
          stamps: [{ id: "paris", day: 5 }],
        },
      });
    });

    it("counts a missing cityDays key as 0 on the first visit", () => {
      const { content, state } = atAlpha({ cityDays: { "beta-town": 1 } });
      expect(Object.hasOwn(state.cityDays, "alpha")).toBe(false);
      const next = started(spend(state, [], content));
      expect(next.cityDays).toEqual({ "beta-town": 1, alpha: 1 });
      expect(next.stamps).toEqual([{ id: "alpha", day: 1 }]);
    });

    it("allows money equal to the stay", () => {
      const { content, state } = atAlpha({ money: 50 });
      expect(started(spend(state, [], content)).money).toBe(0);
    });

    // Until Story 3.1 this asserted outcome null (spec-2-1 "known interim
    // state"). The 3.1 end rules now end the journey out of days here.
    it("allows the last day, and the end rules then end it out of days", () => {
      const { content, state } = atAlpha({ daysUsed: 9 });
      const next = started(spend(state, [], content));
      expect(next.daysUsed).toBe(daysTotal(next, content));
      expect(next.outcome).toBe("failed");
      expect(next.failReason).toBe("outOfDays");
    });

    it("gives no new stamp on a repeat city day", () => {
      const { content, state } = atAlpha();
      const first = started(spend(state, [], content));
      const second = started(spend(first, [], content));
      expect(second.cityDays.alpha).toBe(2);
      expect(second.stamps).toEqual([{ id: "alpha", day: 1 }]);
      expect(second.money).toBe(400);
      expect(second.daysUsed).toBe(2);
    });

    it("dates the stamp with the day it was spent", () => {
      const content = smallContent();
      const flown = started(
        apply(
          stateWith(content, {}),
          travel({ to: "alpha", mode: "plane" }),
          content,
        ),
      );
      expect(flown.daysUsed).toBe(1);
      const next = started(spend(flown, ["alpha-one"], content));
      expect(next.stamps).toEqual([{ id: "alpha", day: 2 }]);
      expect(next.album).toEqual([{ id: "alpha-one", day: 2 }]);
    });

    it("keeps position, calledHome, outcome and failReason", () => {
      const { content, state } = atAlpha({ calledHome: true });
      const next = started(spend(state, [], content));
      expect(next).toMatchObject({
        position: "alpha",
        calledHome: true,
        outcome: null,
        failReason: null,
      });
    });

    it("keeps earlier stamps and appends the new one last", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "beta-town",
        stamps: [{ id: "alpha", day: 2 }],
        cityDays: { alpha: 1 },
        daysUsed: 3,
      });
      const next = started(spend(state, [], content));
      expect(next.money).toBe(425);
      expect(next.stamps).toEqual([
        { id: "alpha", day: 2 },
        { id: "beta-town", day: 4 },
      ]);
    });
  });

  describe("sights", () => {
    it("pays both sights and adds them to the album in order", () => {
      const { content, state } = atAlpha({ money: 100 });
      const next = started(spend(state, ["alpha-one", "alpha-two"], content));
      expect(next.money).toBe(25);
      expect(next.album).toEqual([
        { id: "alpha-one", day: 1 },
        { id: "alpha-two", day: 1 },
      ]);
    });

    it("keeps the given order in the album", () => {
      const { content, state } = atAlpha({
        album: [{ id: "beta-town-one", day: 1 }],
      });
      const next = started(spend(state, ["alpha-two", "alpha-one"], content));
      expect(next.album.map((e) => e.id)).toEqual([
        "beta-town-one",
        "alpha-two",
        "alpha-one",
      ]);
    });

    it("allows money equal to the stay and both sights", () => {
      const { content, state } = atAlpha({ money: 75 });
      expect(
        started(spend(state, ["alpha-one", "alpha-two"], content)).money,
      ).toBe(0);
    });

    it("rejects a sight the money left cannot pay", () => {
      const { content, state } = atAlpha({ money: 70 });
      expect(spend(state, ["alpha-one", "alpha-two"], content)).toEqual({
        ok: false,
        reason: "NOT_ENOUGH_MONEY",
      });
    });

    it("rejects a sight already in the album", () => {
      const { content, state } = atAlpha({
        album: [{ id: "alpha-one", day: 1 }],
        cityDays: { alpha: 1 },
      });
      expect(spend(state, ["alpha-one"], content)).toEqual({
        ok: false,
        reason: "ALREADY_IN_ALBUM",
      });
      expect(spend(state, ["alpha-two", "alpha-one"], content)).toEqual({
        ok: false,
        reason: "ALREADY_IN_ALBUM",
      });
    });

    it.each([
      ["a sight of another destination", ["beta-town-one"], []],
      ["an unknown id", ["alpha-three"], []],
      ["a repeated id", ["alpha-one", "alpha-one"], []],
      ["three ids", ["alpha-one", "alpha-two", "beta-town-one"], []],
      [
        "a repeated album id",
        ["alpha-one", "alpha-one"],
        [{ id: "alpha-one", day: 1 }],
      ],
    ])("rejects %s with INVALID_SIGHTS", (_name, ids, album) => {
      const { content, state } = atAlpha({ album });
      expect(spend(state, ids, content)).toEqual({
        ok: false,
        reason: "INVALID_SIGHTS",
      });
    });

    it.each([
      ["undefined", undefined],
      ["a string", "alpha-one"],
      ["an array with a number", [42]],
      ["null", null],
      ["an object", { 0: "alpha-one", length: 1 }],
    ])("rejects sightIds that is %s without throwing", (_name, ids) => {
      const { content, state } = atAlpha();
      expect(spend(state, ids, content)).toEqual({
        ok: false,
        reason: "INVALID_SIGHTS",
      });
      expect(
        cityDayPlan(state, ids as unknown as string[], content),
      ).toMatchObject({
        ok: false,
        reason: "INVALID_SIGHTS",
        total: 50,
      });
    });
  });

  describe("rejected", () => {
    it.each([
      {
        name: "money below the stay",
        patch: { money: 49 },
        reason: "NOT_ENOUGH_MONEY",
      },
      {
        name: "0 days left",
        patch: { daysUsed: 10 },
        reason: "NOT_ENOUGH_DAYS",
      },
      {
        name: "both",
        patch: { money: 49, daysUsed: 10 },
        reason: "NOT_ENOUGH_MONEY",
      },
      {
        name: "0 days left and invalid sights",
        patch: { daysUsed: 10 },
        sightIds: ["beta-town-one"],
        reason: "NOT_ENOUGH_DAYS",
      },
      {
        name: "money below the stay and a sight in the album",
        patch: { money: 49, album: [{ id: "alpha-one", day: 1 }] },
        sightIds: ["alpha-one"],
        reason: "NOT_ENOUGH_MONEY",
      },
      {
        name: "a sight in the album that the money left cannot pay",
        patch: { money: 55, album: [{ id: "alpha-one", day: 1 }] },
        sightIds: ["alpha-one"],
        reason: "ALREADY_IN_ALBUM",
      },
      {
        name: "at home",
        patch: { position: "home" },
        reason: "AT_HOME",
      },
      {
        name: "at home with no money and no days",
        patch: { position: "home", money: 0, daysUsed: 10 },
        reason: "AT_HOME",
      },
      {
        name: "the journey ended",
        patch: { outcome: "goalNotReached" as const },
        reason: "JOURNEY_ENDED",
      },
      {
        name: "the journey ended at home",
        patch: { position: "home", outcome: "goalReached" as const },
        reason: "JOURNEY_ENDED",
      },
    ])("$name: $reason", ({ patch, sightIds = [], reason }) => {
      const { content, state } = atAlpha(patch);
      expect(spend(state, sightIds, content)).toEqual({ ok: false, reason });
      expect(cityDayPlan(state, sightIds, content)).toMatchObject({
        ok: false,
        reason,
      });
      if (sightIds.length === 0) {
        expect(cityDayStatus(state, content)).toMatchObject({
          available: false,
          reason,
        });
      }
    });

    it("rejects a city day with no journey", () => {
      expect(
        applyFrozen(null, spendCityDay({ sightIds: [] }), smallContent()),
      ).toEqual({ ok: false, reason: "NO_JOURNEY" });
    });
  });

  describe("queries", () => {
    it("shows the stay price, also when the city day is unavailable", () => {
      const { content, state } = atAlpha();
      expect(cityDayStatus(state, content)).toEqual({
        available: true,
        reason: null,
        stayPrice: 50,
      });
      const broke = stateWith(content, { position: "beta-town", money: 10 });
      expect(cityDayStatus(broke, content)).toEqual({
        available: false,
        reason: "NOT_ENOUGH_MONEY",
        stayPrice: 75,
      });
      const home = stateWith(content, {});
      expect(cityDayStatus(home, content)).toEqual({
        available: false,
        reason: "AT_HOME",
        stayPrice: null,
      });
    });

    it("plans an empty draft at alpha", () => {
      const { content, state } = atAlpha({ money: 100 });
      expect(planFrozen(state, [], content)).toEqual({
        ok: true,
        reason: null,
        stay: 50,
        total: 50,
        moneyAfter: 50,
        sights: [
          {
            id: "alpha-one",
            inAlbum: false,
            selected: false,
            available: true,
            reason: null,
            moneyLeft: 50,
          },
          {
            id: "alpha-two",
            inAlbum: false,
            selected: false,
            available: true,
            reason: null,
            moneyLeft: 50,
          },
        ],
      });
    });

    it("measures moneyLeft from the other selected sights", () => {
      const { content, state } = atAlpha({ money: 70 });
      const plan = planFrozen(state, ["alpha-one"], content);
      expect(plan).toMatchObject({
        ok: true,
        reason: null,
        stay: 50,
        total: 60,
        moneyAfter: 10,
      });
      expect(plan.sights).toEqual([
        {
          id: "alpha-one",
          inAlbum: false,
          selected: true,
          available: true,
          reason: null,
          moneyLeft: 20,
        },
        {
          id: "alpha-two",
          inAlbum: false,
          selected: false,
          available: false,
          reason: "NOT_ENOUGH_MONEY",
          moneyLeft: 10,
        },
      ]);
    });

    it("marks a sight in the album and leaves it out of the total", () => {
      const { content, state } = atAlpha({
        money: 100,
        album: [{ id: "alpha-one", day: 1 }],
      });
      const plan = planFrozen(state, ["alpha-one", "alpha-two"], content);
      expect(plan).toMatchObject({
        ok: false,
        reason: "ALREADY_IN_ALBUM",
        total: 65,
        moneyAfter: 35,
      });
      expect(plan.sights[0]).toMatchObject({
        inAlbum: true,
        selected: true,
        available: false,
        reason: "ALREADY_IN_ALBUM",
      });
      expect(plan.sights[1]).toMatchObject({
        selected: true,
        available: true,
        moneyLeft: 50,
      });
    });

    it("counts a repeated id once and ignores foreign ids in the total", () => {
      const { content, state } = atAlpha({ money: 100 });
      expect(
        planFrozen(state, ["alpha-one", "alpha-one"], content),
      ).toMatchObject({
        ok: false,
        reason: "INVALID_SIGHTS",
        total: 60,
        moneyAfter: 40,
      });
      expect(
        planFrozen(state, ["alpha-two", "beta-town-one"], content),
      ).toMatchObject({ ok: false, reason: "INVALID_SIGHTS", total: 65 });
    });

    it("gives every sight the city day's reason when it is unavailable", () => {
      const { content, state } = atAlpha({ daysUsed: 10 });
      const plan = planFrozen(state, [], content);
      expect(plan.reason).toBe("NOT_ENOUGH_DAYS");
      expect(plan.sights.map((s) => s.reason)).toEqual([
        "NOT_ENOUGH_DAYS",
        "NOT_ENOUGH_DAYS",
      ]);
    });

    it("plans nothing at home", () => {
      const content = smallContent();
      expect(planFrozen(stateWith(content, {}), [], content)).toEqual({
        ok: false,
        reason: "AT_HOME",
        stay: null,
        total: null,
        moneyAfter: null,
        sights: [],
      });
    });
  });

  describe("query and apply agree (AD-3)", () => {
    const small = smallContent();
    const real = deepFreeze(loadContent());

    function cases(content: Content) {
      const total = content.config.modes.explorer.totalDays;
      const out: { state: GameState; drafts: string[][] }[] = [];
      const home = content.home.id;
      const anySight = content.sights[0].id;
      for (const position of [home, ...content.destinations.map((d) => d.id)]) {
        const here = content.sights.filter((s) => s.destId === position);
        // At home, a sight from another destination than anySight's, so the
        // home draft names two distinct real sights.
        const foreign = content.sights.find(
          (s) =>
            s.destId !== position &&
            (position !== home || s.destId !== content.sights[0].destId),
        )!;
        let moneys = [0, 1500];
        let albums: GameState["album"][] = [[]];
        let drafts: string[][] = [
          [],
          [anySight],
          [anySight, anySight],
          [anySight, foreign.id, home],
          undefined as unknown as string[],
        ];
        if (position !== home) {
          const status = cityDayStatus(
            stateWith(content, { position }),
            content,
          );
          const stay = status.stayPrice!;
          const prices = here.map((s) => s.price);
          moneys = [
            0,
            stay - 1,
            stay,
            stay + Math.min(...prices),
            stay + prices.reduce((a, b) => a + b, 0),
            1500,
          ];
          albums = [[], [{ id: here[0].id, day: 1 }]];
          drafts = [
            [],
            [here[0].id],
            [here[1].id],
            [here[0].id, here[1].id],
            [foreign.id],
            [here[0].id, here[0].id],
            [here[0].id, here[1].id, foreign.id],
            [42] as unknown as string[],
          ];
        }
        for (const money of moneys) {
          for (const daysUsed of [total - 1, total]) {
            for (const outcome of [null, "goalNotReached" as const]) {
              for (const album of albums) {
                out.push({
                  state: stateWith(content, {
                    position,
                    money,
                    daysUsed,
                    outcome,
                    album,
                  }),
                  drafts,
                });
              }
            }
          }
        }
      }
      return out;
    }

    it.each([
      ["valid-small", small],
      ["real content", real],
    ])("agrees in every cell of the grid over %s", (_name, content) => {
      let checked = 0;
      for (const { state, drafts } of cases(content)) {
        const status = cityDayStatus(state, content);
        const empty = spend(state, [], content);
        expect(status.available).toBe(empty.ok);
        expect(status.reason).toBe(empty.ok ? null : empty.reason);
        for (const sightIds of drafts) {
          const plan = cityDayPlan(state, sightIds, content);
          const result = spend(state, sightIds, content);
          expect(plan.ok).toBe(result.ok);
          expect(plan.reason).toBe(result.ok ? null : result.reason);
          if (result.ok) {
            expect(plan.moneyAfter).toBe(result.state.money);
            expect(result.state.money).toBeGreaterThanOrEqual(0);
          }
          if (status.available && plan.reason !== "INVALID_SIGHTS") {
            const selected = plan.sights.filter((s) => s.selected);
            expect(plan.ok).toBe(selected.every((s) => s.available));
          }
          checked++;
        }
      }
      expect(checked).toBeGreaterThan(500);
    });
  });

  describe("journey", () => {
    it("reaches the goal with 2 city days and the way home in time", () => {
      const content = smallContent();
      let state = started(
        applyFrozen(null, startJourney({ name: "Ada" }), content),
      );
      const steps = [
        travel({ to: "alpha", mode: "plane" }),
        spendCityDay({ sightIds: ["alpha-one"] }),
        travel({ to: "beta-town", mode: "train" }),
        spendCityDay({ sightIds: [] }),
        travel({ to: "alpha", mode: "train" }),
        travel({ to: "home", mode: "plane" }),
      ];
      for (const action of steps) {
        state = started(applyFrozen(state, action, content));
      }
      expect(state).toMatchObject({
        position: "home",
        money: 5,
        daysUsed: 6,
        stamps: [
          { id: "alpha", day: 2 },
          { id: "beta-town", day: 4 },
        ],
        album: [{ id: "alpha-one", day: 2 }],
        cityDays: { alpha: 1, "beta-town": 1 },
        outcome: "goalReached",
      });
    });
  });

  describe("action creator", () => {
    it("builds a spendCityDay action", () => {
      expect(spendCityDay({ sightIds: ["alpha-one"] })).toEqual({
        type: "spendCityDay",
        sightIds: ["alpha-one"],
      });
    });
  });
});
