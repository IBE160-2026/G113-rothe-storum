// ESLint flat config. The `src/rules/**` override enforces AD-1: the rules core
// imports nothing outside itself and never touches time, randomness, the DOM,
// storage or other globals. The rejected cases are listed in the I/O matrix of
// .docs/implementation-artifacts/spec-1-1-project-scaffold-and-tooling.md and
// proven by tests/rules/boundary.test.ts. The one exception, `Intl.Segmenter`
// for counting name graphemes, is decided in Q1 of
// .docs/implementation-artifacts/spec-1-3-game-state-and-starting-a-journey.md.
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const RULES_FILES = ["src/rules/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"];

export default defineConfig(
  {
    ignores: [
      "dist/",
      "coverage/",
      "test-results/",
      "playwright-report/",
      "blob-report/",
      "playwright/.cache/",
      "_bmad/",
      ".claude/",
      ".docs/",
      ".logs/",
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}", "tests/**/*.{ts,tsx}"],
    ...reactHooks.configs.flat.recommended,
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    files: ["*.{js,ts}", "tests/**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: RULES_FILES,
    rules: {
      // Allowlist: only `./x` and `../rules/x` may be imported, and no `..`
      // segment may follow the allowed prefix (blocks `./../ui/x`).
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex:
                "^(?!(?:\\./|\\.\\./rules(?:/|$))(?!(?:.*/)?\\.\\.(?:/|$)))",
              message:
                "AD-1: src/rules may import only modules inside src/rules.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ImportExpression",
          message: "AD-1: no dynamic import() in src/rules.",
        },
        {
          selector: "CallExpression[callee.name='require']",
          message: "AD-1: no require() in src/rules.",
        },
        { selector: "JSXElement", message: "AD-1: no JSX in src/rules." },
        { selector: "JSXFragment", message: "AD-1: no JSX in src/rules." },
        {
          selector: "TSImportType",
          message: "AD-1: no import() types from outside src/rules.",
        },
        {
          // Any use of Date (new Date(), Date(), Date.now(), aliases) reads the clock.
          selector: "Identifier[name='Date']",
          message: "AD-1: no clock access in src/rules; pass time in as data.",
        },
        {
          // Intl is locale- and runtime-dependent; only `Intl.Segmenter` (non-computed) is allowed (spec-1-3 Q1).
          selector:
            "Identifier[name='Intl']:not(MemberExpression[computed=false][property.name='Segmenter'] > .object)",
          message: "AD-1: only Intl.Segmenter is allowed in src/rules.",
        },
      ],
      "no-restricted-globals": [
        "error",
        ...[
          "performance",
          "crypto",
          "globalThis",
          "self",
          "window",
          "document",
          "navigator",
          "localStorage",
          "sessionStorage",
          "setTimeout",
          "setInterval",
          "process",
          "global",
          "fetch",
          "XMLHttpRequest",
          "indexedDB",
          "location",
          "history",
          "requestAnimationFrame",
          "queueMicrotask",
          "setImmediate",
          "eval",
          "Function",
        ].map((name) => ({
          name,
          message: `AD-1: \`${name}\` is not allowed in src/rules.`,
        })),
      ],
      "no-restricted-properties": [
        "error",
        {
          object: "Math",
          property: "random",
          message: "AD-1: no randomness in src/rules; pass a seed in as data.",
        },
      ],
    },
  },
);
