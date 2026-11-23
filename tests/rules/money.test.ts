// FR-8 AD-5 accommodation price: integer hundredths, halves round up, never a
// rounded float product (spec-2-1 I/O matrix → Rounding).
import { describe, expect, it } from "vitest";
import { loadContent } from "../../src/content/load";
import { accommodationPrice } from "../../src/rules/money";

describe("FR-8 AD-5 accommodationPrice", () => {
  it.each([
    [50, 1.01, 51],
    [25, 1.5, 38],
    [50, 1.7, 85],
    [50, 1.0, 50],
    [50, 1.5, 75],
    [50, 0.8, 40],
    [50, 2.2, 110],
    [1, 0.49, 0],
    [1, 0.5, 1],
  ])("accommodationPrice(%d, %s) is %d", (base, factor, price) => {
    expect(accommodationPrice(base, factor)).toBe(price);
  });

  it("gives the stays of PRD addendum §2 for the real content", () => {
    const content = loadContent();
    const stays = Object.fromEntries(
      content.destinations.map((d) => [
        d.id,
        accommodationPrice(content.config.baseAccommodationPrice, d.costFactor),
      ]),
    );
    expect(stays).toEqual({
      copenhagen: 90,
      paris: 80,
      london: 100,
      rome: 70,
      istanbul: 40,
      "new-york": 110,
      tokyo: 90,
      sydney: 85,
    });
  });
});
