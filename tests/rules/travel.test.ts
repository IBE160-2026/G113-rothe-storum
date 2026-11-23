// FR-4 FR-6 FR-7 FR-9 travel and route queries: every row of the I/O matrix in
// .docs/implementation-artifacts/spec-1-4-travel-and-route-queries.md.
// Inputs are deep-frozen and compared with a structuredClone taken before the
// call (see ./helpers.ts).
import { describe, expect, it } from "vitest";
import { loadContent } from "../../src/content/load";
import { apply, startJourney, travel } from "../../src/rules/apply";
import { daysRemaining, routesFrom } from "../../src/rules/queries";
import { shortestDaysHome } from "../../src/rules/travel";
import type {
  Content,
  GameState,
  RouteView,
  TransportMode,
} from "../../src/rules/types";
import { applyFrozen, deepFreeze, smallContent, started } from "./helpers";

/** A fresh journey with some fields overridden, as a frozen state. */
function stateWith(content: Content, patch: Partial<GameState>): GameState {
  const fresh = started(apply(null, startJourney({ name: "Ada" }), content));
  return deepFreeze({ ...fresh, ...patch });
}

/** Runs routesFrom on frozen inputs and asserts that neither input changed. */
function routesFrozen(state: GameState, content: Content): RouteView[] {
  const before = structuredClone({ state, content });
  const views = routesFrom(deepFreeze(state), content);
  expect({ state, content }).toEqual(before);
  return views;
}

function option(views: RouteView[], to: string, mode: TransportMode) {
  const found = views
    .find((v) => v.to === to)
    ?.options.find((o) => o.mode === mode);
  if (found === undefined) throw new Error(`no option ${to} by ${mode}`);
  return found;
}

describe("FR-4 FR-6 FR-7 FR-9 travel", () => {
  describe("route query", () => {
    it("lists Copenhagen's routes from the real content", () => {
      const content = deepFreeze(loadContent());
      const state = stateWith(content, {
        position: "copenhagen",
        money: 500,
        daysUsed: 10,
      });
      const views = routesFrozen(state, content);
      expect(views.map((v) => v.to)).toEqual([
        "home",
        "paris",
        "london",
        "istanbul",
      ]);
      expect(views.map((v) => v.options.map((o) => o.mode))).toEqual([
        ["plane", "train", "bus"],
        ["plane", "train", "bus"],
        ["plane"],
        ["plane"],
      ]);
      expect(option(views, "home", "bus")).toEqual({
        mode: "bus",
        price: 70,
        days: 2,
        arrivalDay: 12,
        available: true,
        reason: null,
        homeUnreachable: false,
      });
      for (const o of views.flatMap((v) => v.options)) {
        expect(o.arrivalDay).toBe(10 + o.days);
        expect(o.available).toBe(true);
        expect(o.reason).toBeNull();
        expect(o.homeUnreachable).toBe(false);
      }
    });

    it("lists the fixture's routes from alpha in content order", () => {
      const content = smallContent();
      const views = routesFrozen(
        stateWith(content, { position: "alpha" }),
        content,
      );
      expect(views).toEqual([
        {
          to: "home",
          options: [
            {
              mode: "plane",
              price: 100,
              days: 1,
              arrivalDay: 1,
              available: true,
              reason: null,
              homeUnreachable: false,
            },
            {
              mode: "bus",
              price: 40,
              days: 2,
              arrivalDay: 2,
              available: true,
              reason: null,
              homeUnreachable: false,
            },
          ],
        },
        {
          to: "beta-town",
          options: [
            {
              mode: "train",
              price: 80,
              days: 1,
              arrivalDay: 1,
              available: true,
              reason: null,
              homeUnreachable: false,
            },
          ],
        },
      ]);
    });
  });

  describe("travel", () => {
    it("travels home to alpha by bus", () => {
      const content = smallContent();
      const state = stateWith(content, {});
      const result = applyFrozen(
        state,
        travel({ to: "alpha", mode: "bus" }),
        content,
      );
      expect(result).toEqual({
        ok: true,
        state: {
          ...state,
          money: 460,
          daysUsed: 2,
          position: "alpha",
          outcome: null,
        },
      });
    });

    it("leaves stamps, album, cityDays and calledHome unchanged", () => {
      const content = smallContent();
      const state = stateWith(content, {
        stamps: [{ id: "alpha", day: 1 }],
        album: [{ id: "alpha-sight", day: 1 }],
        cityDays: { alpha: 1 },
        calledHome: true,
      });
      const next = started(
        applyFrozen(state, travel({ to: "alpha", mode: "plane" }), content),
      );
      expect(next.stamps).toEqual(state.stamps);
      expect(next.album).toEqual(state.album);
      expect(next.cityDays).toEqual(state.cityDays);
      expect(next.calledHome).toBe(true);
    });

    it("allows money equal to the price", () => {
      const content = smallContent();
      const state = stateWith(content, { money: 100 });
      expect(
        option(routesFrozen(state, content), "alpha", "plane").available,
      ).toBe(true);
      const next = started(
        applyFrozen(state, travel({ to: "alpha", mode: "plane" }), content),
      );
      expect(next.money).toBe(0);
    });

    it("allows days equal to the days remaining", () => {
      const content = smallContent();
      const state = stateWith(content, { daysUsed: 8 });
      expect(daysRemaining(state, content)).toBe(2);
      expect(
        option(routesFrozen(state, content), "alpha", "bus").available,
      ).toBe(true);
      const next = started(
        applyFrozen(state, travel({ to: "alpha", mode: "bus" }), content),
      );
      expect(next.daysUsed).toBe(10);
      expect(daysRemaining(next, content)).toBe(0);
    });
  });

  describe("rejected", () => {
    it.each([
      {
        name: "too expensive",
        patch: { money: 99 },
        mode: "plane" as const,
        reason: "NOT_ENOUGH_MONEY",
      },
      {
        name: "too long",
        patch: { daysUsed: 9 },
        mode: "bus" as const,
        reason: "NOT_ENOUGH_DAYS",
      },
      {
        name: "both too expensive and too long",
        patch: { money: 39, daysUsed: 9 },
        mode: "bus" as const,
        reason: "NOT_ENOUGH_MONEY",
      },
    ])("$name: $reason in query and apply", ({ patch, mode, reason }) => {
      const content = smallContent();
      const state = stateWith(content, patch);
      const o = option(routesFrozen(state, content), "alpha", mode);
      expect(o.available).toBe(false);
      expect(o.reason).toBe(reason);
      expect(
        applyFrozen(state, travel({ to: "alpha", mode }), content),
      ).toEqual({ ok: false, reason });
    });

    it.each([
      { position: "home", to: "beta-town", mode: "train" as const },
      { position: "alpha", to: "home", mode: "train" as const },
      { position: "home", to: "nowhere", mode: "plane" as const },
      { position: "home", to: "home", mode: "plane" as const },
    ])("$position → $to by $mode: NO_ROUTE", ({ position, to, mode }) => {
      const content = smallContent();
      const state = stateWith(content, { position });
      expect(applyFrozen(state, travel({ to, mode }), content)).toEqual({
        ok: false,
        reason: "NO_ROUTE",
      });
    });

    it("rejects travel with no journey", () => {
      expect(
        applyFrozen(
          null,
          travel({ to: "alpha", mode: "plane" }),
          smallContent(),
        ),
      ).toEqual({ ok: false, reason: "NO_JOURNEY" });
    });

    it("rejects everything but startJourney after the journey ended", () => {
      const content = smallContent();
      const state = stateWith(content, { outcome: "goalNotReached" });
      expect(
        applyFrozen(state, travel({ to: "alpha", mode: "plane" }), content),
      ).toEqual({ ok: false, reason: "JOURNEY_ENDED" });
      // JOURNEY_ENDED comes before NO_ROUTE.
      expect(
        applyFrozen(state, travel({ to: "nowhere", mode: "bus" }), content),
      ).toEqual({ ok: false, reason: "JOURNEY_ENDED" });
      const options = routesFrozen(state, content).flatMap((v) => v.options);
      expect(options).toHaveLength(2);
      for (const o of options) {
        expect(o.available).toBe(false);
        expect(o.reason).toBe("JOURNEY_ENDED");
      }
      const restarted = started(
        applyFrozen(state, startJourney({ name: "Bo" }), content),
      );
      expect(restarted.outcome).toBeNull();
      expect(restarted.position).toBe("home");
    });
  });

  describe("home-unreachable warning", () => {
    it("warns but stays available when home is out of reach after travel", () => {
      const content = smallContent();
      const state = stateWith(content, { position: "alpha", daysUsed: 8 });
      expect(shortestDaysHome("beta-town", content)).toBe(2);
      const o = option(routesFrozen(state, content), "beta-town", "train");
      expect(o).toMatchObject({ available: true, homeUnreachable: true });
      expect(
        applyFrozen(state, travel({ to: "beta-town", mode: "train" }), content)
          .ok,
      ).toBe(true);
    });

    it("never warns for travel home", () => {
      const content = smallContent();
      const state = stateWith(content, { position: "alpha", daysUsed: 8 });
      const views = routesFrozen(state, content);
      expect(option(views, "home", "plane")).toMatchObject({
        available: true,
        homeUnreachable: false,
      });
      expect(option(views, "home", "bus").homeUnreachable).toBe(false);
    });

    it("does not warn when the fastest way home just fits", () => {
      const content = smallContent();
      // beta-town on day 8, then 2 days home (train 1 + plane 1) = day 10.
      const state = stateWith(content, { position: "alpha", daysUsed: 7 });
      expect(
        option(routesFrozen(state, content), "beta-town", "train")
          .homeUnreachable,
      ).toBe(false);
    });

    it("uses the fewest days per route, ignoring money", () => {
      const content = smallContent();
      // Money for nothing: the warning still uses the plane's 1 day.
      const state = stateWith(content, {
        position: "alpha",
        daysUsed: 7,
        money: 80,
      });
      expect(
        option(routesFrozen(state, content), "beta-town", "train")
          .homeUnreachable,
      ).toBe(false);
    });

    it("treats no path home as unreachable", () => {
      const raw = smallContent();
      const content = deepFreeze({
        ...raw,
        routes: raw.routes.filter((r) => r.between.includes("beta-town")),
      });
      expect(shortestDaysHome("beta-town", content)).toBe(Infinity);
      const state = stateWith(content, { position: "alpha" });
      expect(
        option(routesFrozen(state, content), "beta-town", "train"),
      ).toMatchObject({ available: true, homeUnreachable: true });
    });

    it("uses each route's fastest mode and the true shortest path", () => {
      const raw = smallContent();
      // The slow mode is listed first, and a slow direct route home is listed
      // before the faster path via alpha.
      const content = deepFreeze({
        ...raw,
        routes: [
          {
            between: ["home", "alpha"] as [string, string],
            modes: [
              { mode: "bus" as const, price: 40, days: 3 },
              { mode: "plane" as const, price: 100, days: 1 },
            ],
          },
          {
            between: ["home", "beta-town"] as [string, string],
            modes: [{ mode: "bus" as const, price: 30, days: 5 }],
          },
          {
            between: ["alpha", "beta-town"] as [string, string],
            modes: [{ mode: "train" as const, price: 80, days: 1 }],
          },
        ],
      });
      expect(shortestDaysHome("alpha", content)).toBe(1);
      expect(shortestDaysHome("beta-town", content)).toBe(2);
      // alpha on day 7 → beta-town on day 8; 2 days home just fit.
      const fits = stateWith(content, { position: "alpha", daysUsed: 7 });
      expect(
        option(routesFrozen(fits, content), "beta-town", "train")
          .homeUnreachable,
      ).toBe(false);
      const late = stateWith(content, { position: "alpha", daysUsed: 8 });
      expect(
        option(routesFrozen(late, content), "beta-town", "train")
          .homeUnreachable,
      ).toBe(true);
    });

    it("finds the shortest path home in the real content", () => {
      const content = deepFreeze(loadContent());
      expect(shortestDaysHome("home", content)).toBe(0);
      expect(shortestDaysHome("copenhagen", content)).toBe(1);
      expect(shortestDaysHome("sydney", content)).toBe(2);
    });
  });

  describe("arriving home", () => {
    it("ends the journey with goalNotReached and 0 stamps", () => {
      const content = smallContent();
      const state = stateWith(content, { position: "alpha", daysUsed: 3 });
      const next = started(
        applyFrozen(state, travel({ to: "home", mode: "plane" }), content),
      );
      expect(next).toMatchObject({
        position: "home",
        money: 400,
        daysUsed: 4,
        outcome: "goalNotReached",
        failReason: null,
      });
    });

    it("ends the journey with goalReached when stamps meet the goal", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "alpha",
        daysUsed: 8,
        stamps: [
          { id: "alpha", day: 2 },
          { id: "beta-town", day: 5 },
        ],
      });
      expect(content.config.goalStamps).toBe(2);
      const next = started(
        applyFrozen(state, travel({ to: "home", mode: "bus" }), content),
      );
      expect(next).toMatchObject({
        position: "home",
        daysUsed: 10,
        outcome: "goalReached",
        failReason: null,
      });
    });

    it("ends the journey with goalNotReached one stamp short of the goal", () => {
      const content = smallContent();
      const state = stateWith(content, {
        position: "alpha",
        daysUsed: 8,
        stamps: [{ id: "alpha", day: 2 }],
      });
      expect(content.config.goalStamps).toBe(2);
      const next = started(
        applyFrozen(state, travel({ to: "home", mode: "bus" }), content),
      );
      expect(next).toMatchObject({
        position: "home",
        daysUsed: 10,
        outcome: "goalNotReached",
        failReason: null,
      });
    });

    it("rejects further travel after arriving home", () => {
      const content = smallContent();
      const home = started(
        apply(
          stateWith(content, { position: "alpha" }),
          travel({ to: "home", mode: "plane" }),
          content,
        ),
      );
      expect(
        applyFrozen(home, travel({ to: "alpha", mode: "plane" }), content),
      ).toEqual({ ok: false, reason: "JOURNEY_ENDED" });
    });
  });

  describe("query and apply agree (AD-3)", () => {
    const small = smallContent();
    const real = deepFreeze(loadContent());
    const places = (content: Content) => [
      content.home.id,
      ...content.destinations.map((d) => d.id),
    ];
    const cases = [small, real].flatMap((content) =>
      places(content).flatMap((position) =>
        [0, 40, 99, 100, 250, 1500].flatMap((money) =>
          [0, 7, 8, 9, 10, 28, 29, 30].flatMap((daysUsed) =>
            [null, "goalNotReached" as const].map((outcome) => ({
              content,
              state: stateWith(content, { position, money, daysUsed, outcome }),
            })),
          ),
        ),
      ),
    );

    it("gives the same reason for every option, and accepts every available one", () => {
      let checked = 0;
      for (const { content, state } of cases) {
        for (const view of routesFrom(state, content)) {
          for (const o of view.options) {
            const result = apply(
              state,
              travel({ to: view.to, mode: o.mode }),
              content,
            );
            if (o.available) {
              expect(o.reason).toBeNull();
              expect(result.ok).toBe(true);
            } else {
              expect(result).toEqual({ ok: false, reason: o.reason });
              // Warning and unavailable rows are exclusive.
              expect(o.homeUnreachable).toBe(false);
            }
            checked++;
          }
        }
      }
      expect(checked).toBeGreaterThan(1000);
    });
  });

  describe("action creator", () => {
    it("builds a travel action", () => {
      expect(travel({ to: "alpha", mode: "bus" })).toEqual({
        type: "travel",
        to: "alpha",
        mode: "bus",
      });
    });
  });
});
