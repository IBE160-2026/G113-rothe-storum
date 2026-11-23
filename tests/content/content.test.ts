// Content validation (NFR-7, AR-6, AD-7). Proves that the real content in
// /content is valid with the expected counts, and that every rejecting row of
// the I/O matrices in spec-1-2-core-content-data-and-validation.md and
// spec-2-2-fact-cards-and-sight-content.md fails with a ContentError naming the
// file and the path.
import { readdirSync, readFileSync } from "node:fs";
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
  Sight,
} from "../../src/rules/types";

/** The shape of valid-small.json, so defects stay type-checked. */
interface Draft {
  config: Config;
  destinations: { home: Home; destinations: Destination[] };
  routes: { routes: Route[] };
  sights: { sights: Sight[] };
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

/** Same rule as the schema (spec 2.2, Design Notes). */
const sentences = (text: string) =>
  text.match(/[.!?]["')]?(?=\s|$)/g)?.length ?? 0;

const SIGHTS_DIR = new URL("../../public/assets/sights/", import.meta.url);
const SVG_THEME =
  "<style>:root{color:#0a1826}@media (prefers-color-scheme:dark){:root{color:#f4efe1}}</style>";
const TOKENS_CSS = new URL("../../src/ui/styles/tokens.css", import.meta.url);

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

    it("has 2 sights for each destination, priced as in PRD addendum §3", () => {
      expect(content.sights).toHaveLength(16);
      for (const d of content.destinations) {
        expect(content.sights.filter((s) => s.destId === d.id)).toHaveLength(2);
      }
      expect(
        content.sights.find((s) => s.id === "paris-eiffel-tower"),
      ).toMatchObject({ destId: "paris", name: "Eiffel Tower", price: 20 });
      expect(content.sights.find((s) => s.id === "paris-louvre")?.price).toBe(
        17,
      );
      expect(new Set(content.sights.map((s) => s.id)).size).toBe(16);
    });

    it("FR-5 NFR-6 gives every destination a 2–3 sentence fact", () => {
      for (const d of content.destinations) {
        const count = sentences(d.fact);
        expect(count, d.id).toBeGreaterThanOrEqual(2);
        expect(count, d.id).toBeLessThanOrEqual(3);
      }
    });

    it("FR-21 NFR-8 gives every sight a fact, image and licence record", () => {
      for (const s of content.sights) {
        expect(s.image, s.id).toMatch(
          /^assets\/sights\/[a-z0-9-]+\.(svg|webp)$/,
        );
        expect(sentences(s.fact), s.id).toBeGreaterThanOrEqual(1);
        expect(sentences(s.fact), s.id).toBeLessThanOrEqual(2);
        for (const field of [
          "imageAlt",
          "source",
          "author",
          "licence",
        ] as const) {
          expect(s[field].trim(), `${s.id}.${field}`).not.toBe("");
        }
        expect(s.imageAlt.startsWith("Line drawing of "), s.id).toBe(true);
      }
    });

    // Exact names catch case mismatches that macOS hides, and orphan files.
    it("NFR-7 has exactly one image file per sight, named as in sights.json", () => {
      const files = readdirSync(SIGHTS_DIR).filter((f) => !f.startsWith("."));
      expect(new Set(files)).toEqual(
        new Set(
          content.sights.map((s) => s.image.replace("assets/sights/", "")),
        ),
      );
      expect(files).toHaveLength(16);
    });

    it("NFR-7 has 4:3 themed SVG line drawings with no text, script or remote reference", () => {
      for (const s of content.sights.filter((x) => x.image.endsWith(".svg"))) {
        const svg = readFileSync(
          new URL(s.image.replace("assets/sights/", ""), SIGHTS_DIR),
          "utf8",
        );
        expect(svg, s.id).toContain('viewBox="0 0 800 600"');
        // The theme block must be the first child of the root <svg>.
        const rootEnd = svg.indexOf(">", svg.indexOf("<svg")) + 1;
        expect(svg.slice(rootEnd).trimStart().startsWith(SVG_THEME), s.id).toBe(
          true,
        );
        expect(svg, s.id).toContain("currentColor");
        expect(svg, s.id).not.toMatch(
          /<(text|script|image|foreignObject|use)\b/i,
        );
        expect(svg, s.id).not.toMatch(/@import/i);
        expect(svg, s.id).not.toMatch(/href\s*=\s*["']\s*(https?:|\/\/)/i);
        expect(svg, s.id).not.toMatch(/url\(\s*["']?\s*(https?:|\/\/)/i);
      }
    });

    it("NFR-7 themes the SVGs with the current --color-ink tokens", () => {
      // The SVG theme block copies --color-ink (light, dark) as hex, because an
      // SVG in <img> cannot read CSS variables. A token change must update the
      // 16 files in public/assets/sights/ and SVG_THEME together.
      const css = readFileSync(TOKENS_CSS, "utf8");
      const [light, dark] = [
        ...css.matchAll(/--color-ink:\s*(#[0-9a-f]{6});/gi),
      ].map((m) => m[1]?.toLowerCase());
      expect(SVG_THEME).toContain(`:root{color:${light}}`);
      expect(SVG_THEME).toContain(
        `@media (prefers-color-scheme:dark){:root{color:${dark}}}`,
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
      expect(content.sights.map((s) => s.id)).toEqual([
        "alpha-one",
        "alpha-two",
        "beta-town-one",
        "beta-town-two",
      ]);
    });
  });

  describe("FR-10 FR-21 sights", () => {
    it.each([8, 20])("accepts a price of %i", (price) => {
      const raw = withDefect((r) => (r.sights.sights[0].price = price));
      expect(parseContent(raw).sights[0].price).toBe(price);
    });

    it.each<[string, (raw: Draft) => void, string, string]>([
      [
        "an unknown destId",
        (r) => (r.sights.sights[1].destId = "gamma"),
        "sights[1].destId",
        'unknown destination id "gamma"',
      ],
      [
        "home as destId",
        (r) => (r.sights.sights[0].destId = "home"),
        "sights[0].destId",
        'unknown destination id "home"',
      ],
      [
        "a price of 7",
        (r) => (r.sights.sights[0].price = 7),
        "sights[0].price",
        "",
      ],
      [
        "a price of 21",
        (r) => (r.sights.sights[0].price = 21),
        "sights[0].price",
        "",
      ],
      [
        "a price of 8.5",
        (r) => (r.sights.sights[0].price = 8.5),
        "sights[0].price",
        "whole number of euros",
      ],
      [
        "a duplicate sight id",
        (r) => {
          r.sights.sights[3].id = "alpha-one";
          r.sights.sights[3].image = "assets/sights/alpha-one.svg";
        },
        "sights[3].id",
        'duplicate sight id "alpha-one"',
      ],
      [
        "a sight id that is not a kebab id",
        (r) => (r.sights.sights[0].id = "Alpha One"),
        "sights[0].id",
        "kebab",
      ],
      [
        "sights.json that is null",
        (r) => poke(r, "sights", null),
        "(root)",
        "",
      ],
      [
        "a missing sights.json",
        (r) => poke(r, "sights", undefined),
        "(root)",
        "",
      ],
    ])("rejects %s", (_name, defect, path, text) => {
      expectProblem(withDefect(defect), "sights.json", path, text);
    });

    it("defers the destId check while destinations.json is invalid", () => {
      const problems = problemsOf(
        withDefect((r) => {
          r.destinations.destinations[0].lat = 91;
          r.sights.sights[0].destId = "gamma";
        }),
      );
      expect(problems).toHaveLength(1);
      expect(problems[0]).toContain("destinations.json");
    });
  });

  describe("FR-5 FR-21 NFR-8 fact cards and sight content", () => {
    /** A valid 2-sentence fact of exactly `length` characters. */
    const factOf = (length: number) =>
      `It opened in 1900. ${"a".repeat(length - 20)}.`;

    it.each<[string, string]>([
      ["a decimal number", "It is 1.5 km long. It opened in 1900."],
      ["a closing quote", 'It was called "the museum." It opened in 1900.'],
      ["a closing bracket", "It opened in 1900 (in May.) It is still open!"],
      [
        "a final closing quote",
        'It opened in 1932. It is nicknamed "the Coathanger."',
      ],
    ])("counts %s as 2 sentences", (_name, text) => {
      expect(sentences(text)).toBe(2);
      // 2 is the only count both a destination (2–3) and a sight (1–2) accept.
      const content = parseContent(
        withDefect((r) => {
          r.destinations.destinations[0].fact = text;
          r.sights.sights[0].fact = text;
        }),
      );
      expect(content.destinations[0].fact).toBe(text);
      expect(content.sights[0].fact).toBe(text);
    });

    it("accepts a 320-character destination fact and a 200-character sight fact", () => {
      const content = parseContent(
        withDefect((r) => {
          r.destinations.destinations[0].fact = factOf(320);
          r.sights.sights[0].fact = factOf(200);
        }),
      );
      expect(content.destinations[0].fact).toHaveLength(320);
      expect(content.sights[0].fact).toHaveLength(200);
    });

    it("accepts a .webp image", () => {
      const raw = withDefect(
        (r) => (r.sights.sights[0].image = "assets/sights/alpha-one.webp"),
      );
      expect(parseContent(raw).sights[0].image).toBe(
        "assets/sights/alpha-one.webp",
      );
    });

    it.each<[string, (raw: Draft) => void, string, string, string]>([
      [
        "a destination fact with curly quotes",
        (r) =>
          (r.destinations.destinations[0].fact = "He said “hi.” Then he left."),
        "destinations.json",
        "destinations[0].fact",
        "must use straight quotes",
      ],
      [
        "a destination fact with an ellipsis",
        (r) =>
          (r.destinations.destinations[0].fact = "Wait... it opened. Yes."),
        "destinations.json",
        "destinations[0].fact",
        "no ellipses",
      ],
      [
        "a sight fact with an em dash",
        (r) => (r.sights.sights[0].fact = "It opened in 1900 — in May."),
        "sights.json",
        "sights[0].fact",
        "no ellipses or long dashes",
      ],
      [
        'a destination fact with "St."',
        (r) =>
          (r.destinations.destinations[0].fact =
            "St. Peter is big. It is old."),
        "destinations.json",
        "destinations[0].fact",
        "abbreviations with a dot",
      ],
      [
        'a sight fact with "U.S."',
        (r) => (r.sights.sights[0].fact = "It is in the U.S. today."),
        "sights.json",
        "sights[0].fact",
        "abbreviations with a dot",
      ],
      [
        'a sight fact with "c."',
        (r) => (r.sights.sights[0].fact = "Built c. 1850."),
        "sights.json",
        "sights[0].fact",
        "abbreviations with a dot",
      ],
      [
        "a destination fact with 1 sentence",
        (r) => (r.destinations.destinations[0].fact = "One sentence only."),
        "destinations.json",
        "destinations[0].fact",
        "must have 2–3 sentences",
      ],
      [
        "a destination fact with 4 sentences",
        (r) => (r.destinations.destinations[0].fact = "One. Two. Three. Four."),
        "destinations.json",
        "destinations[0].fact",
        "must have 2–3 sentences",
      ],
      [
        "a destination fact over 320 characters",
        (r) => (r.destinations.destinations[0].fact = factOf(321)),
        "destinations.json",
        "destinations[0].fact",
        "must be at most 320 characters",
      ],
      [
        "a destination fact without final punctuation",
        (r) => (r.destinations.destinations[0].fact = "It opened. It is open"),
        "destinations.json",
        "destinations[0].fact",
        "must end in . ! or ?",
      ],
      [
        "a missing destination fact",
        (r) => poke(r.destinations.destinations[1], "fact", undefined),
        "destinations.json",
        "destinations[1].fact",
        "",
      ],
      [
        "a sight fact with 0 sentences",
        (r) => (r.sights.sights[0].fact = "Opened in 1843"),
        "sights.json",
        "sights[0].fact",
        "must have 1–2 sentences",
      ],
      [
        "a sight fact with 3 sentences",
        (r) => (r.sights.sights[0].fact = "One. Two. Three."),
        "sights.json",
        "sights[0].fact",
        "must have 1–2 sentences",
      ],
      [
        "a sight fact over 200 characters",
        (r) => (r.sights.sights[0].fact = factOf(201)),
        "sights.json",
        "sights[0].fact",
        "must be at most 200 characters",
      ],
      [
        "a sight fact without a final full stop",
        (r) => (r.sights.sights[0].fact = "It opened in 1843"),
        "sights.json",
        "sights[0].fact",
        "must end in . ! or ?",
      ],
      [
        "a blank sight fact",
        (r) => (r.sights.sights[0].fact = "   "),
        "sights.json",
        "sights[0].fact",
        "must not be empty",
      ],
      [
        "an imageAlt over 120 characters",
        (r) => (r.sights.sights[0].imageAlt = "x".repeat(121)),
        "sights.json",
        "sights[0].imageAlt",
        "must be at most 120 characters",
      ],
      [
        "a missing imageAlt",
        (r) => poke(r.sights.sights[0], "imageAlt", undefined),
        "sights.json",
        "sights[0].imageAlt",
        "",
      ],
      [
        "a missing licence",
        (r) => poke(r.sights.sights[1], "licence", undefined),
        "sights.json",
        "sights[1].licence",
        "",
      ],
      [
        "a missing author",
        (r) => poke(r.sights.sights[2], "author", undefined),
        "sights.json",
        "sights[2].author",
        "",
      ],
      [
        "a blank source",
        (r) => (r.sights.sights[0].source = " "),
        "sights.json",
        "sights[0].source",
        "must not be empty",
      ],
      [
        "a hotlinked image",
        (r) =>
          (r.sights.sights[0].image =
            "https://upload.wikimedia.org/alpha-one.svg"),
        "sights.json",
        "sights[0].image",
        "must be assets/sights/<id>.svg or .webp",
      ],
      [
        "a .png image",
        (r) => (r.sights.sights[0].image = "assets/sights/alpha-one.png"),
        "sights.json",
        "sights[0].image",
        "must be assets/sights/<id>.svg or .webp",
      ],
      [
        "another sight's image",
        (r) => (r.sights.sights[0].image = "assets/sights/alpha-two.svg"),
        "sights.json",
        "sights[0].image",
        "must be assets/sights/<id>.svg or .webp",
      ],
    ])("rejects %s", (_name, defect, file, path, text) => {
      expectProblem(withDefect(defect), file, path, text);
    });

    it.each<[string, (raw: Draft) => void, number]>([
      ["0 sights", (r) => (r.sights.sights = r.sights.sights.slice(2)), 0],
      ["1 sight", (r) => r.sights.sights.splice(1, 1), 1],
      [
        "3 sights",
        (r) =>
          r.sights.sights.push({
            ...r.sights.sights[0],
            id: "alpha-three",
            image: "assets/sights/alpha-three.svg",
          }),
        3,
      ],
    ])("rejects a destination with %s", (_name, defect, count) => {
      const problems = problemsOf(withDefect(defect));
      expect(problems).toEqual([
        `sights.json: sights: destination "alpha" has ${count} sights (needs exactly 2)`,
      ]);
    });

    it("defers the sight count while destinations.json is invalid", () => {
      const problems = problemsOf(
        withDefect((r) => {
          poke(r.destinations, "destinations", null);
          r.sights.sights = r.sights.sights.slice(2);
          r.sights.sights[0].price = 7;
        }),
      );
      expect(problems).toHaveLength(2);
      expect(problems.some((p) => p.startsWith("destinations.json:"))).toBe(
        true,
      );
      expect(problems.some((p) => p.includes("sights[0].price"))).toBe(true);
      expect(problems.some((p) => p.includes("needs exactly 2"))).toBe(false);
    });

    it("defers the sight count while sights.json is invalid", () => {
      const problems = problemsOf(
        withDefect((r) => {
          r.sights.sights = r.sights.sights.slice(2);
          r.sights.sights[0].price = 7;
          r.destinations.destinations[1].iata = "AAA";
        }),
      );
      expect(problems).toHaveLength(2);
      expect(problems.some((p) => p.includes("sights[0].price"))).toBe(true);
      expect(problems.some((p) => p.includes("duplicate code"))).toBe(true);
      expect(problems.some((p) => p.includes("needs exactly 2"))).toBe(false);
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
      [
        "non-integer price",
        (r) => (r.routes.routes[0].modes[0].price = 60.5),
        "routes.json",
        "routes[0].modes[0].price",
      ],
      [
        "zero start money",
        (r) => (r.config.modes.explorer.startMoney = 0),
        "config.json",
        "modes.explorer.startMoney",
      ],
      [
        "zero total days",
        (r) => (r.config.modes.explorer.totalDays = 0),
        "config.json",
        "modes.explorer.totalDays",
      ],
      [
        "negative base accommodation price",
        (r) => (r.config.baseAccommodationPrice = -1),
        "config.json",
        "baseAccommodationPrice",
      ],
      [
        "zero base accommodation price",
        (r) => (r.config.baseAccommodationPrice = 0),
        "config.json",
        "baseAccommodationPrice",
      ],
      [
        "zero call-home days",
        (r) => (r.config.callHome.days = 0),
        "config.json",
        "callHome.days",
      ],
      [
        "negative call-home price",
        (r) => (r.config.callHome.price = -1),
        "config.json",
        "callHome.price",
      ],
      [
        "negative call-home stamp penalty",
        (r) => (r.config.callHome.stampPenalty = -1),
        "config.json",
        "callHome.stampPenalty",
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
        "cost factor with three decimals",
        (r) => (r.destinations.destinations[0].costFactor = 1.005),
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

    // Each check runs once the files it reads are valid (code review of PR #21):
    // checks inside one file are not held back by a schema error in another
    // file, while unknown place ids wait until both files are valid.
    it("reports duplicate place ids while routes.json fails its own schema", () => {
      const problems = problemsOf(
        withDefect((r) => {
          poke(r.routes.routes[0].modes[0], "mode", "boat");
          r.destinations.destinations[1].id = "alpha";
          // beta-town no longer exists, so drop its sights (Story 2.1).
          r.sights.sights = r.sights.sights.slice(0, 2);
        }),
      );
      expect(problems).toHaveLength(2);
      expect(problems.some((p) => p.includes("routes[0].modes[0].mode"))).toBe(
        true,
      );
      expect(
        problems.some((p) =>
          p.includes('destinations[1].id: duplicate place id "alpha"'),
        ),
      ).toBe(true);
    });

    it("reports duplicate routes while destinations.json fails its own schema", () => {
      const problems = problemsOf(
        withDefect((r) => {
          r.destinations.destinations[0].lat = 91;
          r.routes.routes.push({
            between: ["home", "alpha"],
            modes: [{ mode: "train", price: 60, days: 1 }],
          });
        }),
      );
      expect(problems).toHaveLength(2);
      expect(problems.some((p) => p.includes("destinations[0].lat"))).toBe(
        true,
      );
      expect(
        problems.some((p) => p.includes("routes[2].between: duplicate route")),
      ).toBe(true);
    });

    it("reports the sight count while routes.json fails its own schema", () => {
      const problems = problemsOf(
        withDefect((r) => {
          poke(r.routes.routes[0].modes[0], "mode", "boat");
          r.sights.sights.splice(1, 1);
        }),
      );
      expect(problems).toHaveLength(2);
      expect(problems.some((p) => p.includes("routes[0].modes[0].mode"))).toBe(
        true,
      );
      expect(problems).toContain(
        'sights.json: sights: destination "alpha" has 1 sights (needs exactly 2)',
      );
    });

    it("defers unknown place ids while routes.json fails its own schema", () => {
      const problems = problemsOf(
        withDefect((r) => {
          poke(r.routes.routes[0].modes[0], "mode", "boat");
          r.routes.routes[1].between[1] = "parris";
        }),
      );
      expect(problems).toHaveLength(1);
      expect(problems[0]).toContain("routes.json: routes[0].modes[0].mode");
      expect(problems.some((p) => p.includes("parris"))).toBe(false);
    });

    it("reports duplicate sight ids while destinations.json fails its own schema", () => {
      const problems = problemsOf(
        withDefect((r) => {
          r.destinations.destinations[0].lat = 91;
          r.sights.sights[3].id = "alpha-one";
          r.sights.sights[3].image = "assets/sights/alpha-one.svg";
        }),
      );
      expect(problems).toHaveLength(2);
      expect(problems.some((p) => p.includes("destinations.json"))).toBe(true);
      expect(
        problems.some(
          (p) =>
            p.startsWith("sights.json:") &&
            p.includes('duplicate sight id "alpha-one"'),
        ),
      ).toBe(true);
    });

    it("defers unknown sight destIds while sights.json fails its own schema", () => {
      const problems = problemsOf(
        withDefect((r) => {
          r.sights.sights[0].price = 7;
          r.sights.sights[1].destId = "gamma";
        }),
      );
      expect(problems).toHaveLength(1);
      expect(problems[0]).toContain("sights.json: sights[0].price");
      expect(problems.some((p) => p.includes("gamma"))).toBe(false);
    });
  });
});
