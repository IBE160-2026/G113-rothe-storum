// Content validation (NFR-7, AR-6, AD-7). Proves that the real content in
// /content is valid with the expected counts, and that every rejecting row of
// the I/O matrix in spec-1-2-core-content-data-and-validation.md fails with a
// ContentError naming the file and the path.
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import {
  ContentError,
  loadContent,
  parseContent,
  type RawContent,
} from "../../src/content/load";
import type {
  Config,
  Content,
  Destination,
  Home,
  Route,
} from "../../src/rules/types";

/** The shape of valid-small.json, so defects stay type-checked. */
interface Draft {
  config: Config;
  destinations: { home: Home; destinations: Destination[] };
  routes: { routes: Route[] };
}

/** A freshly parsed fixture from tests/fixtures/content/. */
function fixture(name: string): RawContent {
  const url = new URL(`../fixtures/content/${name}`, import.meta.url);
  return JSON.parse(readFileSync(url, "utf8")) as RawContent;
}

/** valid-small with one or more defects applied. */
function withDefect(defect: (raw: Draft) => void): RawContent {
  const raw = fixture("valid-small.json") as Draft;
  defect(raw);
  return raw;
}

/** Writes a value the types would reject (wrong type, unknown key). */
function poke(target: object, key: string, value: unknown): void {
  (target as Record<string, unknown>)[key] = value;
}

function problemsOf(raw: RawContent): string[] {
  try {
    parseContent(raw);
  } catch (error) {
    expect(error).toBeInstanceOf(ContentError);
    const { message, problems } = error as ContentError;
    expect(message).toContain(`Invalid content (${problems.length} problem`);
    // The message itself must name every problem (file and path), not only .problems.
    for (const problem of problems) expect(message).toContain(problem);
    return [...problems];
  }
  throw new Error("expected parseContent to throw a ContentError");
}

function expectProblem(raw: RawContent, ...parts: string[]): void {
  const problems = problemsOf(raw);
  expect(
    problems.some((p) => parts.every((part) => p.includes(part))),
    `no problem contains ${JSON.stringify(parts)}; got ${JSON.stringify(problems)}`,
  ).toBe(true);
}

describe("NFR-7 AR-6 content", () => {
  describe("real content", () => {
    let content: Content;

    beforeAll(() => {
      // Inside a hook, so invalid real content fails as a named test with the problems listed.
      content = loadContent();
    });

    it("loads home as Bergen and exactly 8 destinations", () => {
      expect(content.home).toMatchObject({ id: "home", name: "Bergen" });
      expect(content.destinations.map((d) => d.id)).toEqual([
        "copenhagen",
        "paris",
        "london",
        "rome",
        "istanbul",
        "new-york",
        "tokyo",
        "sydney",
      ]);
    });

    it("has 21 routes with 30 mode options, each with 1–3 unique modes", () => {
      expect(content.routes).toHaveLength(21);
      expect(content.routes.flatMap((r) => r.modes)).toHaveLength(30);
      for (const route of content.routes) {
        const modes = route.modes.map((m) => m.mode);
        expect(modes.length).toBeGreaterThanOrEqual(1);
        expect(modes.length).toBeLessThanOrEqual(3);
        expect(new Set(modes).size).toBe(modes.length);
      }
    });

    it("reaches every destination from home through the route network", () => {
      const reached = new Set<string>(["home"]);
      const queue = ["home"];
      while (queue.length > 0) {
        const at = queue.shift()!;
        for (const { between } of content.routes) {
          if (!between.includes(at)) continue;
          const next = between[0] === at ? between[1] : between[0];
          if (!reached.has(next)) {
            reached.add(next);
            queue.push(next);
          }
        }
      }
      expect(reached).toEqual(
        new Set(["home", ...content.destinations.map((d) => d.id)]),
      );
    });

    it("has the Explorer core values", () => {
      expect(content.config.modes.explorer).toEqual({
        startMoney: 1500,
        totalDays: 30,
      });
    });
  });

  describe("valid fixture", () => {
    it("parses the small fixture", () => {
      const content = parseContent(fixture("valid-small.json"));
      expect(content.destinations).toHaveLength(2);
      expect(content.routes).toHaveLength(2);
    });
  });

  describe("unknown place id", () => {
    it("rejects a route endpoint that is not a place", () => {
      expectProblem(
        fixture("broken-unknown-place-id.json"),
        "routes.json",
        "routes[1].between[1]",
        '"parris"',
      );
    });
  });

  describe("negative or non-integer price/days", () => {
    it("rejects a negative price", () => {
      expectProblem(
        fixture("broken-negative-price.json"),
        "routes.json",
        "routes[0].modes[0].price",
      );
    });

    it.each<[string, (raw: Draft) => void, string, string]>([
      [
        "non-integer days",
        (r) => (r.routes.routes[0].modes[0].days = 1.5),
        "routes.json",
        "routes[0].modes[0].days",
      ],
      [
        "zero days",
        (r) => (r.routes.routes[0].modes[0].days = 0),
        "routes.json",
        "routes[0].modes[0].days",
      ],
      [
        "zero price",
        (r) => (r.routes.routes[0].modes[0].price = 0),
        "routes.json",
        "routes[0].modes[0].price",
      ],
      [
        "non-integer start money",
        (r) => (r.config.modes.explorer.startMoney = 99.5),
        "config.json",
        "modes.explorer.startMoney",
      ],
    ])("rejects %s", (_name, defect, file, path) => {
      expectProblem(withDefect(defect), file, path);
    });
  });

  describe("duplicate", () => {
    it("rejects two routes joining the same pair in reverse", () => {
      expectProblem(
        fixture("broken-duplicate-route.json"),
        "routes.json",
        "routes[2].between",
        "duplicate route",
      );
    });

    it.each<[string, (raw: Draft) => void, string, string, string]>([
      [
        "a route repeated in the same direction",
        (r) =>
          r.routes.routes.push({
            between: ["home", "alpha"],
            modes: [{ mode: "train", price: 60, days: 1 }],
          }),
        "routes.json",
        "routes[2].between",
        "duplicate route",
      ],
      [
        "a duplicate place id",
        (r) => (r.destinations.destinations[1].id = "alpha"),
        "destinations.json",
        "destinations[1].id",
        "duplicate place id",
      ],
      [
        "a destination reusing the id home",
        (r) => (r.destinations.destinations[0].id = "home"),
        "destinations.json",
        "destinations[0].id",
        "duplicate place id",
      ],
      [
        "a duplicate iata code",
        (r) => (r.destinations.destinations[1].iata = "AAA"),
        "destinations.json",
        "destinations[1].iata",
        "duplicate code",
      ],
      [
        "the same mode twice on one route",
        (r) => (r.routes.routes[0].modes[1].mode = "plane"),
        "routes.json",
        "routes[0].modes[1].mode",
        "duplicate mode",
      ],
    ])("rejects %s", (_name, defect, file, path, text) => {
      expectProblem(withDefect(defect), file, path, text);
    });
  });

  describe("self route", () => {
    it("rejects a route from a place to itself", () => {
      expectProblem(
        fixture("broken-self-route.json"),
        "routes.json",
        "routes[1].between",
        "itself",
      );
    });
  });

  describe("bad shape", () => {
    it("rejects an unknown mode", () => {
      expectProblem(
        fixture("broken-bad-shape.json"),
        "routes.json",
        "routes[0].modes[1].mode",
      );
    });

    it.each<[string, (raw: Draft) => void, string, string]>([
      [
        "missing home",
        (r) => poke(r.destinations, "home", undefined),
        "destinations.json",
        "home",
      ],
      [
        "bad id format",
        (r) => (r.destinations.destinations[1].id = "Beta Town"),
        "destinations.json",
        "destinations[1].id",
      ],
      [
        "lat above 90",
        (r) => (r.destinations.destinations[0].lat = 91),
        "destinations.json",
        "destinations[0].lat",
      ],
      [
        "lon below -180",
        (r) => (r.destinations.destinations[0].lon = -181),
        "destinations.json",
        "destinations[0].lon",
      ],
      [
        "cost factor of 0",
        (r) => (r.destinations.destinations[0].costFactor = 0),
        "destinations.json",
        "destinations[0].costFactor",
      ],
      [
        "lowercase iata code",
        (r) => (r.destinations.destinations[0].iata = "aaa"),
        "destinations.json",
        "destinations[0].iata",
      ],
      [
        "four-letter iata code",
        (r) => (r.destinations.destinations[0].iata = "AAAA"),
        "destinations.json",
        "destinations[0].iata",
      ],
      [
        "blank name",
        (r) => (r.destinations.destinations[0].name = "   "),
        "destinations.json",
        "destinations[0].name",
      ],
      [
        "extra unknown key",
        (r) => poke(r.routes.routes[0], "note", "x"),
        "routes.json",
        "routes[0]",
      ],
      [
        "route with no modes",
        (r) => (r.routes.routes[1].modes = []),
        "routes.json",
        "routes[1].modes",
      ],
      [
        "mode key that is not a kebab id",
        (r) => poke(r.config.modes, "Nomad ", { startMoney: 1, totalDays: 1 }),
        "config.json",
        "modes.Nomad ",
      ],
      [
        "file root that is null",
        (r) => poke(r, "routes", null),
        "routes.json",
        "(root)",
      ],
    ])("rejects %s", (_name, defect, file, path) => {
      expectProblem(withDefect(defect), file, path);
    });
  });

  describe("every problem in one error", () => {
    it("lists schema problems from two files together", () => {
      const problems = problemsOf(
        withDefect((r) => {
          r.config.modes.explorer.startMoney = 99.5;
          r.destinations.destinations[0].lat = 91;
        }),
      );
      expect(problems).toHaveLength(2);
      expect(problems.some((p) => p.startsWith("config.json:"))).toBe(true);
      expect(problems.some((p) => p.startsWith("destinations.json:"))).toBe(
        true,
      );
    });

    it("still reports cross-file problems when config.json is invalid", () => {
      const problems = problemsOf(
        withDefect((r) => {
          r.config.goalStamps = -1;
          r.routes.routes[1].between[1] = "parris";
        }),
      );
      expect(problems).toHaveLength(2);
      expect(problems.some((p) => p.includes("config.json: goalStamps"))).toBe(
        true,
      );
      expect(
        problems.some((p) => p.includes('unknown place id "parris"')),
      ).toBe(true);
    });
  });
});
