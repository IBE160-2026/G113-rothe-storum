// SM-1 traceability guard (Story 4.1): keeps .docs/test-report/fr-test-map.md
// in step with the tests. It fails, naming the problem, when an SM-1 FR has
// no row, when a map row is malformed, or when a row names a test file that
// does not exist or has no `describe`/`it`/`test` call for every title of the
// row's `describe › it` path, in source order and not skipped. The marker
// "pending Story 3.3" is allowed only for FR-14 (spec 4.1 decision). The
// number of rows per FR is pinned in EXPECTED_ROWS, so a deleted row fails.
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const ROOT = new URL("../", import.meta.url);
const MAP_PATH = ".docs/test-report/fr-test-map.md";
const PENDING = "pending Story 3.3";
const PENDING_ALLOWED = new Set(["FR-14"]);

/** The FR ids whose consequences SM-1 requires a test for. */
const SM1_FRS = [
  "FR-1",
  "FR-4",
  "FR-6",
  "FR-7",
  "FR-8",
  "FR-9",
  "FR-10",
  "FR-11",
  "FR-12",
  "FR-13",
  "FR-14",
  "FR-21",
  "FR-22",
];

/**
 * Rows per FR in the map, pinned so a deleted row fails by name (Story 4.1
 * elicitation, chaos check M5). Change a count only together with the map:
 * a UI story that moves a Flagged consequence into the table adds 1 here.
 */
const EXPECTED_ROWS: Record<string, number> = {
  "FR-1": 7,
  "FR-4": 6,
  "FR-6": 5,
  "FR-7": 5,
  "FR-8": 8,
  "FR-9": 5,
  "FR-10": 6,
  "FR-11": 8,
  "FR-12": 12,
  "FR-13": 11,
  "FR-14": 7,
  "FR-21": 6,
  "FR-22": 4,
};

interface MapRow {
  fr: string;
  consequence: string;
  file: string;
  test: string;
}

interface ParsedMap {
  rows: MapRow[];
  /** Problems with data rows whose FR cell is not a single `FR-<n>`. */
  malformed: string[];
}

function cells(line: string): string[] {
  return line
    .replace(/^\||\|\s*$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

/**
 * The rows of the map's first table. The "Flagged" section after it lists
 * consequences with no test yet and is not part of the map.
 */
function parseMap(markdown: string): ParsedMap {
  const [mapped = ""] = markdown.split(/^## Flagged/m);
  const rows: MapRow[] = [];
  const malformed: string[] = [];
  for (const line of mapped.split("\n")) {
    if (!line.startsWith("|")) continue;
    const [fr = "", consequence = "", file = "", test = ""] = cells(line);
    if (fr === "FR" || /^:?-{3,}:?$/.test(fr)) continue; // header, separator
    if (!/^FR-\d+$/.test(fr)) {
      malformed.push(`malformed map row (FR cell "${fr}"): ${line}`);
      continue;
    }
    rows.push({ fr, consequence, file: file.replace(/`/g, ""), test });
  }
  return { rows, malformed };
}

/** Blanks comments so a title in a comment never counts; keeps strings. */
function stripComments(source: string): string {
  let out = "";
  let i = 0;
  while (i < source.length) {
    const c = source[i] ?? "";
    const next = source[i + 1];
    if (c === "/" && next === "/") {
      const end = source.indexOf("\n", i);
      const stop = end === -1 ? source.length : end;
      out += " ".repeat(stop - i);
      i = stop;
    } else if (c === "/" && next === "*") {
      const end = source.indexOf("*/", i + 2);
      const stop = end === -1 ? source.length : end + 2;
      out += source.slice(i, stop).replace(/[^\n]/g, " ");
      i = stop;
    } else if (c === '"' || c === "'" || c === "`") {
      const stop = skipString(source, i);
      out += source.slice(i, stop);
      i = stop;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

/** The index just after the string literal that starts at `start`. */
function skipString(source: string, start: number): number {
  const quote = source[start];
  let i = start + 1;
  while (i < source.length && source[i] !== quote) {
    i += source[i] === "\\" ? 2 : 1;
  }
  return i + 1;
}

/** The index just after the `)` that closes the `(` at `open`. */
function skipParens(source: string, open: number): number {
  let depth = 0;
  let i = open;
  while (i < source.length) {
    const c = source[i];
    if (c === '"' || c === "'" || c === "`") {
      i = skipString(source, i);
      continue;
    }
    if (c === "(") depth++;
    if (c === ")" && --depth === 0) return i + 1;
    i++;
  }
  return i;
}

interface TestCall {
  title: string;
  index: number;
  skipped: boolean;
}

/** The index just after the type arguments `<…>` that start at `open`. */
function skipTypeArgs(source: string, open: number): number {
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    const c = source[i];
    if (c === "<") depth++;
    // `=>` inside a function type is not a closing bracket.
    if (c === ">" && source[i - 1] !== "=" && --depth === 0) return i + 1;
  }
  return source.length;
}

/** Skips whitespace and optional type arguments; the index of what follows. */
function skipToParen(source: string, from: number): number {
  let i = from;
  while (/\s/.test(source[i] ?? "")) i++;
  if (source[i] === "<") i = skipTypeArgs(source, i);
  while (/\s/.test(source[i] ?? "")) i++;
  return i;
}

/**
 * Every `describe`/`it`/`test` call whose first argument is a string literal,
 * also after `.each(...)` and type arguments such as `it.each<[string]>(…)`. `.skip` and `.todo` calls are marked skipped.
 */
function testCalls(raw: string): TestCall[] {
  const source = stripComments(raw);
  const calls: TestCall[] = [];
  const head =
    /\b(?:describe|it|test)((?:\.(?:skip|todo|only|each|concurrent))*)/g;
  for (const match of source.matchAll(head)) {
    const modifiers = match[1] ?? "";
    let i = skipToParen(source, match.index + match[0].length);
    if (source[i] !== "(") continue;
    if (modifiers.includes(".each")) {
      i = skipToParen(source, skipParens(source, i));
      if (source[i] !== "(") continue;
    }
    i++;
    while (/\s/.test(source[i] ?? "")) i++;
    const quote = source[i];
    if (quote !== '"' && quote !== "'" && quote !== "`") continue;
    const end = skipString(source, i);
    calls.push({
      title: source.slice(i + 1, end - 1),
      index: match.index,
      skipped: /\.(?:skip|todo)\b/.test(modifiers),
    });
  }
  return calls;
}

/** Problems with one row's `describe › it` path in a test file. */
function checkPath(where: string, file: string, source: string, path: string) {
  const titles = path.split(" › ").map((t) => t.trim());
  if (titles.some((t) => t === "")) return [`${where}: no test named`];
  const calls = testCalls(source);
  let after = -1;
  for (const title of titles) {
    const same = calls.filter((c) => c.title === title);
    const next = same.find((c) => !c.skipped && c.index > after);
    if (next !== undefined) {
      after = next.index;
      continue;
    }
    if (same.some((c) => !c.skipped)) {
      return [`${where}: ${file} has "${title}" out of source order`];
    }
    if (same.length > 0) {
      return [`${where}: ${file} skips the test titled "${title}"`];
    }
    return [`${where}: ${file} has no test titled "${title}"`];
  }
  return [];
}

/** Every problem in the map, as readable lines; empty when the map is honest. */
function checkMap(
  { rows, malformed }: ParsedMap,
  read: (file: string) => string | undefined,
): string[] {
  const problems = [...malformed];
  for (const fr of SM1_FRS) {
    if (!rows.some((r) => r.fr === fr)) problems.push(`${fr}: no row`);
  }
  for (const row of rows) {
    const where = `${row.fr} "${row.consequence}"`;
    if (!SM1_FRS.includes(row.fr)) {
      problems.push(`${where}: ${row.fr} is not an SM-1 FR`);
    }
    if (row.file === PENDING) {
      if (!PENDING_ALLOWED.has(row.fr)) {
        problems.push(`${where}: "${PENDING}" is allowed only for FR-14`);
      }
      continue;
    }
    const source = read(row.file);
    if (source === undefined) {
      problems.push(`${where}: test file ${row.file} does not exist`);
      continue;
    }
    problems.push(...checkPath(where, row.file, source, row.test));
  }
  return problems;
}

/** FRs whose row count differs from the pinned one, as readable lines. */
function checkRowCounts(
  rows: MapRow[],
  expected: Record<string, number>,
): string[] {
  return Object.entries(expected).flatMap(([fr, want]) => {
    const got = rows.filter((r) => r.fr === fr).length;
    return got === want
      ? []
      : [`${fr}: ${String(got)} rows, expected ${String(want)}`];
  });
}

function readRepoFile(file: string): string | undefined {
  const url = new URL(file, ROOT);
  return existsSync(url) ? readFileSync(url, "utf8") : undefined;
}

describe("SM-1 FR → test map guard", () => {
  const markdown = readRepoFile(MAP_PATH);
  const parsed = parseMap(markdown ?? "");

  it("finds the map and parses its rows", () => {
    expect(markdown, `${MAP_PATH} is missing`).toBeDefined();
    expect(parsed.rows.length).toBeGreaterThan(SM1_FRS.length);
  });

  it("maps every SM-1 FR to tests that exist", () => {
    expect(checkMap(parsed, readRepoFile)).toEqual([]);
  });

  it("keeps the pinned number of rows for every SM-1 FR", () => {
    expect(Object.keys(EXPECTED_ROWS).sort()).toEqual([...SM1_FRS].sort());
    expect(checkRowCounts(parsed.rows, EXPECTED_ROWS)).toEqual([]);
  });

  it("names an FR whose row count changed", () => {
    const row = { fr: "FR-7", consequence: "c", file: "f", test: "t" };
    expect(checkRowCounts([row], { "FR-7": 2, "FR-13": 0 })).toEqual([
      "FR-7: 1 rows, expected 2",
    ]);
  });

  it("names a missing FR, a renamed, skipped or misordered test, a missing file and a misplaced pending marker", () => {
    const file = "tests/rules/journeys.test.ts";
    const real =
      "FR-6 FR-8 FR-10 FR-11 FR-21 FR-22 UJ-1 Ingrid reaches the goal (real content) › ends home after 16 days with €423, 5 stamps, 2 photos and the goal reached";
    const fake = "fake.test.ts";
    const fakeSource = [
      '// it("in a comment", () => {});',
      'describe("outer", () => {',
      '  it.skip("skipped", () => {});',
      '  it.each([["a (b"]])("each %s", () => {});',
      '  it.each<[string, (raw: number) => void]>([["x", () => {}]])(',
      '    "typed %s",',
      "    () => {},",
      "  );",
      "});",
      'describe("other", () => {});',
    ].join("\n");
    const read = (f: string) => (f === fake ? fakeSource : readRepoFile(f));
    const row = (fr: string, consequence: string, f: string, test: string) => ({
      fr,
      consequence,
      file: f,
      test,
    });
    const rows = [
      ...SM1_FRS.filter((fr) => fr !== "FR-4").map((fr) =>
        row(fr, "c", file, real),
      ),
      row("FR-6", "renamed", file, "no such title"),
      row("FR-6", "gone", "tests/nope.ts", "x"),
      row("FR-8", "pending", PENDING, "—"),
      row("FR-14", "pending ok", PENDING, "—"),
      row("FR-9", "each", fake, "outer › each %s"),
      row("FR-9", "typed", fake, "outer › typed %s"),
      row("FR-9", "skipped", fake, "outer › skipped"),
      row("FR-9", "order", fake, "other › each %s"),
      row("FR-9", "comment", fake, "in a comment"),
    ];
    expect(checkMap({ rows, malformed: ["malformed x"] }, read)).toEqual([
      "malformed x",
      "FR-4: no row",
      `FR-6 "renamed": ${file} has no test titled "no such title"`,
      'FR-6 "gone": test file tests/nope.ts does not exist',
      `FR-8 "pending": "${PENDING}" is allowed only for FR-14`,
      `FR-9 "skipped": ${fake} skips the test titled "skipped"`,
      `FR-9 "order": ${fake} has "each %s" out of source order`,
      `FR-9 "comment": ${fake} has no test titled "in a comment"`,
    ]);
  });

  it("reads only the first table, and names a malformed FR cell", () => {
    const md = [
      "| FR | Consequence | Test file | Test |",
      "| --- | --- | --- | --- |",
      "| FR-1 | a | `tests/a.ts` | d › i |",
      "| FR4 | b | `tests/b.ts` | d › i |",
      "| FR-6 FR-8 | c | `tests/c.ts` | d › i |",
      "## Flagged",
      "| FR-7 | b | Story 1.7 |",
    ].join("\n");
    expect(parseMap(md)).toEqual({
      rows: [
        { fr: "FR-1", consequence: "a", file: "tests/a.ts", test: "d › i" },
      ],
      malformed: [
        'malformed map row (FR cell "FR4"): | FR4 | b | `tests/b.ts` | d › i |',
        'malformed map row (FR cell "FR-6 FR-8"): | FR-6 FR-8 | c | `tests/c.ts` | d › i |',
      ],
    });
  });
});
