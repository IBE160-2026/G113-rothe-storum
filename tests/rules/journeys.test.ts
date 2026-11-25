// UJ-1 as a scripted rules test on the real content (AD-10, Story 4.1):
// Ingrid's 11 actions from PRD §2.4 / epic-4-context. Every action runs
// through applyFrozen (see ./helpers.ts); a rejected action fails the test
// with its ReasonCode. UJ-2 lives in ./end.test.ts.
import { describe, expect, it } from "vitest";
import { loadContent } from "../../src/content/load";
import { spendCityDay, startJourney, travel } from "../../src/rules/apply";
import type { Action } from "../../src/rules/types";
import { applyFrozen, deepFreeze, play, started } from "./helpers";

describe("FR-6 FR-8 FR-10 FR-11 FR-21 FR-22 UJ-1 Ingrid reaches the goal (real content)", () => {
  const content = deepFreeze(loadContent());
  const fresh = () =>
    started(applyFrozen(null, startJourney({ name: "Ingrid" }), content));
  const city = (...sightIds: string[]) => spendCityDay({ sightIds });

  const toCopenhagen: Action[] = [travel({ to: "copenhagen", mode: "bus" })];
  const toParis: Action[] = [city(), travel({ to: "paris", mode: "bus" })];
  const rest: Action[] = [
    city("paris-eiffel-tower", "paris-louvre"),
    travel({ to: "london", mode: "bus" }),
    city(),
    travel({ to: "rome", mode: "plane" }),
    city(),
    travel({ to: "istanbul", mode: "bus" }),
    city(),
    travel({ to: "home", mode: "plane" }),
  ];

  it("arrives in Copenhagen with €1,430 on Day 3 and in Paris with €1,270 on Day 6", () => {
    const copenhagen = play(fresh(), toCopenhagen, content);
    // "Day X" is daysUsed + 1 (spine Conventions → Days).
    expect(copenhagen).toMatchObject({
      position: "copenhagen",
      money: 1430,
      daysUsed: 2,
      stamps: [],
      outcome: null,
    });

    const paris = play(copenhagen, toParis, content);
    expect(paris).toMatchObject({
      position: "paris",
      money: 1270,
      daysUsed: 5,
      outcome: null,
    });
    expect(paris.stamps.map((s) => s.id)).toEqual(["copenhagen"]);
  });

  it("ends home after 16 days with €423, 5 stamps, 2 photos and the goal reached", () => {
    const end = play(fresh(), [...toCopenhagen, ...toParis, ...rest], content);
    expect(end).toMatchObject({
      travellerName: "Ingrid",
      position: "home",
      daysUsed: 16,
      money: 423,
      calledHome: false,
      outcome: "goalReached",
      failReason: null,
    });
    expect(end.stamps.map((s) => s.id)).toEqual([
      "copenhagen",
      "paris",
      "london",
      "rome",
      "istanbul",
    ]);
    expect(end.album.map((a) => a.id)).toEqual([
      "paris-eiffel-tower",
      "paris-louvre",
    ]);
    expect(applyFrozen(end, city(), content)).toEqual({
      ok: false,
      reason: "JOURNEY_ENDED",
    });
  });
});
