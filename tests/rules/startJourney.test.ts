// FR-1 start a journey: every rules row of the I/O matrix in
// .docs/implementation-artifacts/spec-1-3-game-state-and-starting-a-journey.md.
// Inputs are deep-frozen and compared with a structuredClone taken before the
// call (see ./helpers.ts).
import { describe, expect, it } from "vitest";
import { loadContent } from "../../src/content/load";
import {
  apply,
  spendCityDay,
  startJourney,
  travel,
} from "../../src/rules/apply";
import { daysTotal } from "../../src/rules/queries";
import type { GameState, JourneyMode } from "../../src/rules/types";
import {
  applyFrozen,
  deepFreeze,
  play,
  smallContent,
  started,
} from "./helpers";

function nameOf(name: string): Pick<GameState, "travellerName" | "nameGiven"> {
  const { travellerName, nameGiven } = started(
    applyFrozen(null, startJourney({ name }), smallContent()),
  );
  return { travellerName, nameGiven };
}

describe("FR-1 start a journey", () => {
  it("starts at home with the fixture's Explorer values", () => {
    const content = smallContent();
    const state = started(
      applyFrozen(null, startJourney({ name: "Ada" }), content),
    );
    expect(state).toEqual({
      mode: "explorer",
      travellerName: "Ada",
      nameGiven: true,
      position: "home",
      money: 500,
      daysUsed: 0,
      stamps: [],
      album: [],
      cityDays: {},
      calledHome: false,
      outcome: null,
      failReason: null,
    });
    expect(daysTotal(state, content)).toBe(10);
    expect(state).not.toHaveProperty("daysTotal");
  });

  it("uses the real content: €1,500 and 30 days", () => {
    const content = deepFreeze(loadContent());
    const state = started(
      applyFrozen(null, startJourney({ name: "Ada" }), content),
    );
    expect(state.money).toBe(1500);
    expect(daysTotal(state, content)).toBe(30);
  });

  it("restarts from an existing state with a fresh state", () => {
    const content = smallContent();
    const old: GameState = {
      mode: "explorer",
      travellerName: "Old",
      nameGiven: true,
      position: "alpha",
      money: 120,
      daysUsed: 7,
      stamps: [{ id: "alpha", day: 3 }],
      album: [{ id: "alpha-sight", day: 4 }],
      cityDays: { alpha: 2 },
      calledHome: true,
      outcome: "failed",
      failReason: "outOfDays",
    };
    const fresh = started(
      applyFrozen(old, startJourney({ name: "Ada" }), content),
    );
    expect(fresh).not.toBe(old);
    expect(fresh).toEqual(
      started(apply(null, startJourney({ name: "Ada" }), content)),
    );
    expect(old.money).toBe(120);
  });

  it("does not share arrays or objects between two started journeys", () => {
    const content = smallContent();
    const a = started(apply(null, startJourney({ name: "A" }), content));
    const b = started(apply(null, startJourney({ name: "A" }), content));
    expect(a.stamps).not.toBe(b.stamps);
    expect(a.album).not.toBe(b.album);
    expect(a.cityDays).not.toBe(b.cityDays);
  });

  describe("traveller name", () => {
    it("trims surrounding spaces", () => {
      expect(nameOf("  Ada  ")).toEqual({
        travellerName: "Ada",
        nameGiven: true,
      });
    });

    it.each([[""], ["   "]])("uses Traveller for %j", (name) => {
      expect(nameOf(name)).toEqual({
        travellerName: "Traveller",
        nameGiven: false,
      });
    });

    it("counts graphemes and keeps a family emoji whole", () => {
      const name = "Åse 👩‍👩‍👧";
      const { travellerName } = nameOf(name);
      expect(travellerName).toBe(name);
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      expect([...segmenter.segment(travellerName)]).toHaveLength(5);
    });

    it("keeps the first 14 of 20 graphemes, including æøå", () => {
      const name = "æøåÆØÅabcdefghijklmn"; // 20 graphemes
      expect([...name]).toHaveLength(20);
      expect(nameOf(name).travellerName).toBe("æøåÆØÅabcdefgh");
    });

    it("caps a name of long emoji sequences by grapheme, not code unit", () => {
      const name = "👩‍👩‍👧".repeat(15);
      expect(nameOf(name).travellerName).toBe("👩‍👩‍👧".repeat(14));
    });

    it("trims again after the cap", () => {
      expect(nameOf("a" + " ".repeat(13) + "bc")).toEqual({
        travellerName: "a",
        nameGiven: true,
      });
    });

    it("keeps inner spaces and other characters", () => {
      expect(nameOf(" Ada  O'Neil-2 ").travellerName).toBe("Ada  O'Neil-2");
    });

    it("never affects the rules: the same actions give the same journey", () => {
      const content = smallContent();
      const actions = [
        travel({ to: "alpha", mode: "bus" }),
        spendCityDay({ sightIds: ["alpha-one"] }),
        travel({ to: "home", mode: "plane" }),
      ];
      const journey = (name: string) =>
        play(
          started(applyFrozen(null, startJourney({ name }), content)),
          actions,
          content,
        );
      const named = journey("Ada");
      const unnamed = journey("");
      expect(unnamed).toEqual({
        ...named,
        travellerName: "Traveller",
        nameGiven: false,
      });
      expect(named.outcome).not.toBeNull();
    });
  });

  describe("rejected", () => {
    it("rejects a mode that is not in content", () => {
      const content = smallContent();
      const result = applyFrozen(
        null,
        startJourney({ name: "Ada", mode: "nomad" }),
        content,
      );
      expect(result).toEqual({ ok: false, reason: "UNKNOWN_MODE" });
      expect(result).not.toHaveProperty("state");
    });

    it("rejects a prototype key as a mode", () => {
      const content = smallContent();
      const result = applyFrozen(
        null,
        startJourney({ name: "Ada", mode: "constructor" as JourneyMode }),
        content,
      );
      expect(result).toEqual({ ok: false, reason: "UNKNOWN_MODE" });
      expect(result).not.toHaveProperty("state");
    });

    it("leaves an existing frozen state unchanged when rejected", () => {
      const content = smallContent();
      const old = started(apply(null, startJourney({ name: "Ada" }), content));
      const result = applyFrozen(
        old,
        startJourney({ name: "Bo", mode: "nomad" }),
        content,
      );
      expect(result).toEqual({ ok: false, reason: "UNKNOWN_MODE" });
    });
  });

  describe("action creator", () => {
    it("omits mode when it is not given", () => {
      expect(startJourney({ name: "Ada" })).toEqual({
        type: "startJourney",
        name: "Ada",
      });
      expect(startJourney({ name: "Ada" })).not.toHaveProperty("mode");
    });

    it("passes an explicit mode through", () => {
      expect(startJourney({ name: "Ada", mode: "explorer" })).toEqual({
        type: "startJourney",
        name: "Ada",
        mode: "explorer",
      });
    });
  });
});
