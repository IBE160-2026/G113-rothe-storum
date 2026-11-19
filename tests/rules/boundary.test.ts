// Proves the AD-1 rules boundary in eslint.config.js against every row of the
// I/O matrix in .docs/implementation-artifacts/spec-1-1-project-scaffold-and-tooling.md.
// Prefixed AR-2 rather than an FR id: this tests an architecture rule (see spec Design Notes).
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { beforeAll, describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const RULES_PROBE = "src/rules/probe.ts";
const RULES_TSX_PROBE = "src/rules/probe.tsx";
const RULES_JS_PROBE = "src/rules/probe.js";
const UI_PROBE = "src/ui/probe.tsx";

const BOUNDARY_RULES = new Set([
  "no-restricted-imports",
  "no-restricted-syntax",
  "no-restricted-globals",
  "no-restricted-properties",
]);

let eslint: ESLint;

async function boundaryRuleIds(
  code: string,
  filePath: string,
): Promise<string[]> {
  const [result] = await eslint.lintText(code, { filePath });
  // A parse error has ruleId null and would otherwise make "allows" cases pass vacuously.
  expect(result.messages.filter((m) => m.fatal)).toEqual([]);
  return result.messages
    .filter((m) => m.ruleId !== null && BOUNDARY_RULES.has(m.ruleId))
    .map((m) => {
      expect(m.severity, `${m.ruleId} must be an error`).toBe(2);
      return m.ruleId as string;
    });
}

describe("AR-2 AD-1 rules boundary", { timeout: 30_000 }, () => {
  beforeAll(async () => {
    eslint = new ESLint({ cwd: repoRoot });
    for (const probe of [
      RULES_PROBE,
      RULES_TSX_PROBE,
      RULES_JS_PROBE,
      UI_PROBE,
    ]) {
      expect(await eslint.isPathIgnored(probe)).toBe(false);
    }
  });

  describe("boundary OK", () => {
    it.each([
      ["import { a } from './money';"],
      ["import { a } from '../rules/money';"],
      ["import { a } from '../rules';"],
      ["import type { A } from './types';"],
      ["import { a } from './a..b';"],
      ["export function add(a: number, b: number): number { return a + b; }"],
      ["export const n = Math.floor(2.5);"],
    ])("allows %s", async (code) => {
      expect(
        await boundaryRuleIds(`${code}\nexport {};\n`, RULES_PROBE),
      ).toEqual([]);
    });
  });

  describe("outside import", () => {
    it.each([
      ["import React from 'react';"],
      ["import { createRoot } from 'react-dom/client';"],
      ["import { z } from 'zod';"],
      ["import { readFileSync } from 'node:fs';"],
      ["import { x } from '../ui';"],
      ["import { x } from '../ui/copy';"],
      ["import { x } from '../app';"],
      ["import { x } from '../app/store';"],
      ["import { x } from '../content/schema';"],
      ["import type { X } from '../content/schema';"],
      ["export { x } from '../ui/copy';"],
      ["import { x } from '../../src/ui/copy';"],
      ["import { x } from './../ui/copy';"],
      ["import { x } from '../rules/../app/store';"],
      ["import { x } from './sub/../../app/store';"],
      ["import { x } from './..';"],
    ])("rejects %s", async (code) => {
      expect(await boundaryRuleIds(code, RULES_PROBE)).toEqual([
        "no-restricted-imports",
      ]);
    });

    it("rejects outside imports in other module extensions (.js)", async () => {
      expect(
        await boundaryRuleIds("import React from 'react';", RULES_JS_PROBE),
      ).toEqual(["no-restricted-imports"]);
    });
  });

  describe("import bypass", () => {
    it.each([
      ["export const m = import('react');"],
      ["export const m = require('react');"],
      ["export type X = import('../content/schema').X;"],
    ])("rejects %s", async (code) => {
      expect(await boundaryRuleIds(code, RULES_PROBE)).toEqual([
        "no-restricted-syntax",
      ]);
    });

    it.each([["export const v = <div />;"], ["export const v = <></>;"]])(
      "rejects JSX: %s",
      async (code) => {
        expect(await boundaryRuleIds(code, RULES_TSX_PROBE)).toEqual([
          "no-restricted-syntax",
        ]);
      },
    );
  });

  describe("banned globals", () => {
    it.each([
      ["Date.now()", "no-restricted-syntax"],
      ["new Date()", "no-restricted-syntax"],
      ["Date()", "no-restricted-syntax"],
      ["Date", "no-restricted-syntax"],
      ["Math.random()", "no-restricted-properties"],
      ["performance.now()", "no-restricted-globals"],
      ["crypto.randomUUID()", "no-restricted-globals"],
      ["globalThis", "no-restricted-globals"],
      ["self", "no-restricted-globals"],
      ["window", "no-restricted-globals"],
      ["document", "no-restricted-globals"],
      ["navigator", "no-restricted-globals"],
      ["localStorage", "no-restricted-globals"],
      ["sessionStorage", "no-restricted-globals"],
      ["setTimeout(() => {}, 0)", "no-restricted-globals"],
      ["setInterval(() => {}, 0)", "no-restricted-globals"],
      ["process", "no-restricted-globals"],
      ["global", "no-restricted-globals"],
      ["fetch", "no-restricted-globals"],
      ["XMLHttpRequest", "no-restricted-globals"],
      ["indexedDB", "no-restricted-globals"],
      ["location", "no-restricted-globals"],
      ["history", "no-restricted-globals"],
      ["requestAnimationFrame", "no-restricted-globals"],
      ["queueMicrotask", "no-restricted-globals"],
      ["setImmediate", "no-restricted-globals"],
      ["eval", "no-restricted-globals"],
      ["Function", "no-restricted-globals"],
      ["new Intl.DateTimeFormat().format()", "no-restricted-syntax"],
    ])("rejects %s", async (expr, ruleId) => {
      expect(
        await boundaryRuleIds(`export const v = ${expr};`, RULES_PROBE),
      ).toEqual([ruleId]);
    });

    it("rejects an aliased Date", async () => {
      expect(
        await boundaryRuleIds(
          "const D = Date;\nexport const n = D.now();",
          RULES_PROBE,
        ),
      ).toEqual(["no-restricted-syntax"]);
    });
  });

  // spec-1-3 Q1: Intl.Segmenter is the only allowed use of Intl in src/rules.
  describe("Intl", () => {
    it("allows new Intl.Segmenter", async () => {
      expect(
        await boundaryRuleIds(
          'export const s = new Intl.Segmenter("en", { granularity: "grapheme" });',
          RULES_PROBE,
        ),
      ).toEqual([]);
    });

    it.each([
      ["export const v = Intl.DateTimeFormat;"],
      ["export const v = new Intl.NumberFormat();"],
      ['export const v = Intl["DateTimeFormat"];'],
      ['export const v = Intl["Segmenter"];'],
      ["export const I = Intl;"],
      ["export const { DateTimeFormat } = Intl;"],
      ["export type S = Intl.SegmentData;"],
    ])("rejects %s", async (code) => {
      expect(await boundaryRuleIds(code, RULES_PROBE)).toEqual([
        "no-restricted-syntax",
      ]);
    });
  });

  describe("scope", () => {
    it("does not apply the boundary to the same code in src/ui", async () => {
      const code = [
        "import { createRoot } from 'react-dom/client';",
        "import { copy } from './copy';",
        "import { x } from './../app/store';",
        "export const v = [createRoot, copy, x, Date.now(), Math.random(), new Date(), window, localStorage, fetch];",
        "export const el = <div />;",
      ].join("\n");
      expect(await boundaryRuleIds(code, UI_PROBE)).toEqual([]);
    });
  });
});
