---
title: 'Story 1.1 — Project scaffold and tooling'
type: 'chore'
created: '2026-11-16'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'e5b83ebcc8854ae9abe1bbebe122744ad41c123b'
context:
  - '{project-root}/.docs/implementation-artifacts/epic-1-context.md'
  - '{project-root}/.docs/planning-artifacts/architecture/architecture-worldbound-nomad-2026-11-13/ARCHITECTURE-SPINE.md'
  - '{project-root}/.docs/planning-artifacts/epics.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The repo has no application code. Every later story needs the same build, lint, test and run setup, and the AD-1 rules boundary has to be enforced before any rules code exists (AR-1, AR-2, NFR-3).

**Approach:** Scaffold the Vite + React + TypeScript app at the repo root with pinned tooling, the Structural Seed folders, a placeholder Start screen, verification that every script exits 0, an ESLint boundary on `src/rules/**` that a test proves, and a "Getting started" section in the README.

## Boundaries & Constraints

**Always:**
- Pinned Stack versions, installed with `~`: `typescript@~6.0` (never 7), Vite 8.3, React/React DOM 19.3, @vitejs/plugin-react 6.3, zod 4.6, Vitest 5.1, @testing-library/react 16.3, @playwright/test 1.65, ESLint 10.15, typescript-eslint 8.72, Prettier 3.10.
- `"engines": { "node": "^22.22.2 || ^24.15.0 || >=26" }` (decision 2026-11-16: ESLint 10.15 and jsdom 31 do not run on 22.12; the spine and epics are updated to match).
- Scripts exactly `dev`, `build`, `preview`, `test`, `test:e2e`, `lint`. `strict: true`.
- Player text comes from `src/ui/copy.ts`, colours from `src/ui/styles/tokens.css` (AD-9). Code, UI and the new README section are in English.
- The rules boundary is an **allowlist**: `src/rules/**` may import only modules inside `src/rules/`. The I/O matrix below is the single source for what the boundary must reject; every other part of this spec refers to it.

**Never:** No game rules, content JSON or GameState (Stories 1.2–1.4). No UI kit, router, state library, CI or hosting. No committed `node_modules`, build output or test reports. Do not remove the existing Norwegian README content (course and members).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Boundary OK | `src/rules/*.ts` imports only `./x` or `../rules/x` | lint passes | N/A |
| Outside import | file in `src/rules/` imports any package (`react`, `zod`), `node:*`, or anything outside `src/rules/` (`../ui`, `../ui/x`, `../app`, `../content`) | ESLint error | lint exits non-zero |
| Import bypass | dynamic `import()`, `require()`, or JSX in `src/rules/` | ESLint error | lint exits non-zero |
| Banned globals | `Date.now()`, `new Date()`, `Math.random()`, `performance`, `crypto`, `globalThis`, `self`, `window`, `document`, `navigator`, `localStorage`, `sessionStorage`, `setTimeout`, `setInterval`, `process` in `src/rules/` | ESLint error | lint exits non-zero |
| Scope | the same code in `src/ui/` | no boundary error | N/A |

</frozen-after-approval>

## Code Map

- `.gitignore` -- already ignores `node_modules/`, `dist/`, `*.tsbuildinfo`, `coverage/`, `test-results/`, `playwright-report/`; add `blob-report/` and `playwright/.cache/`
- `README.md` -- Norwegian course/member intro; keep it, add the English section, run `prettier --write` on it
- `CLAUDE.md`, `.docs/`, `.logs/`, `_bmad/`, `.claude/` -- do not touch; exclude from ESLint and Prettier
- DESIGN.md (`.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/`) -- `colors:` frontmatter; every role has a `-dark` pair. Use those names as `--color-<role>` tokens
- Supporting dev deps (latest on 2026-11-16): `jsdom` 31, `@testing-library/dom` 10 (peer of RTL 16), `@testing-library/jest-dom` 7, `@eslint/js` 10, `globals` 17, `eslint-plugin-react-hooks` 7, `@types/react` / `@types/react-dom` 19.3, `@types/node`
- Vitest 5 has no `environmentMatchGlobs`; use a `// @vitest-environment jsdom` docblock in each UI test

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `package-lock.json` -- `"type": "module"`, `"private": true`, engines; scripts `dev` = `vite`, `build` = `tsc -b && vite build`, `preview` = `vite preview`, `test` = `vitest run`, `test:e2e` = `playwright test`, `lint` = `eslint . --max-warnings 0 && prettier --check .`; Stack and supporting deps via `npm install` -- AR-1
- [x] `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` -- references layout; app: `src`, `tests`, strict, `noEmit`, `jsx: react-jsx`, `types: ["vite/client", "node"]`; node: config files -- type-checked build
- [x] `vite.config.ts` -- React plugin; Vitest `include: tests/**/*.test.{ts,tsx}`, exclude `tests/e2e`, `setupFiles: tests/setup.ts`, `environment: node` -- one config file
- [x] `tests/setup.ts` -- jest-dom matchers for Vitest and `afterEach(cleanup)` -- UI test setup
- [x] `playwright.config.ts` -- `testDir: tests/e2e`, Chromium-only project, viewport 375×812, `baseURL`; `webServer`: `npm run build && npm run preview -- --port 4173 --strictPort`, matching `url`, 120 s timeout -- AD-10
- [x] `eslint.config.js` -- flat config: recommended + typescript-eslint + react-hooks; global ignores for `dist`, `coverage`, report folders, `_bmad`, `.claude`, `.docs`, `.logs`. Override for `src/rules/**` implementing every matrix row at level `error` (`no-restricted-imports` patterns, `no-restricted-syntax` for `ImportExpression`, `require` calls, `JSXElement`/`JSXFragment` and `new Date`, `no-restricted-globals`, `no-restricted-properties`) -- AD-1
- [x] `.prettierrc.json`, `.prettierignore` -- defaults; ignore the folders above plus `CLAUDE.md`, `package-lock.json`, `blob-report`, `playwright/.cache` -- formatting convention
- [x] `index.html`, `src/main.tsx`, `src/vite-env.d.ts`, `src/ui/screens/StartScreen.tsx`, `src/ui/copy.ts`, `src/ui/styles/tokens.css` -- `copy.start.title = 'WORLDBOUND: NOMAD'` in one `<h1>`; `main.tsx` sets `document.title` from copy; tokens for light, and dark under `prefers-color-scheme: dark` -- dev shows a screen
- [x] `.gitkeep` in `src/rules/`, `src/content/`, `src/app/`, `src/ui/sheets/`, `src/ui/components/`, `content/`, `public/assets/`, `tests/{content,balance,fixtures}/` -- Structural Seed homes
- [x] `tests/rules/boundary.test.ts` -- `describe('AR-2 AD-1 rules boundary', …)`; ESLint `lintText` with `cwd` = repo root, one `it` per matrix case, asserting `isPathIgnored` is false and the exact `ruleId`; the scope case uses `src/ui/probe.tsx`; 30 s timeout -- proves the matrix without committing a bad file
- [x] `tests/ui/StartScreen.test.tsx` -- renders the title as the single heading -- RTL smoke
- [x] `tests/e2e/start.spec.ts` -- loads `/`, sees the title, `scrollWidth <= clientWidth` at 375 px -- Playwright smoke
- [x] `README.md` -- "Getting started": Node version range and npm, no `.env` or API keys needed, `npm install`, `npx playwright install chromium`, all six scripts, the dev URL, brief structure, links to the PRD, architecture spine, epics and sprint plan -- NFR-3 (supports SM-4, owned by Story 4.5)

**Acceptance Criteria:**
- Given a clean clone and a supported Node version, when a developer runs `npm install` and `npm run dev`, then the browser shows the placeholder Start screen.
- Given the skeleton and `npx playwright install chromium` has been run, when `npm test`, `npm run test:e2e`, `npm run lint` and `npm run build` run, then each one exits 0.
- Given code in `src/rules/` matching any rejecting row of the I/O matrix, when `npm run lint` runs, then lint fails; `boundary.test.ts` proves every row.
- Given the README, when a reader follows "Getting started", then it lists the prerequisites with versions, the exact commands and links to `.docs/`.

## Design Notes

- `boundary.test.ts` uses the `AR-2` prefix instead of an FR id: it tests an architecture rule, not a functional requirement. This is a deliberate exception to the FR-prefix convention for `tests/rules/`.
- The top-level React error boundary required by the spine is out of scope here (proposed as a GitHub issue).

## Implementation Notes

- 2026-11-16, implemented directly in the main session (no implementation subagent: the user limits subagents to Build's review step).
- Installed: typescript 6.0.3, vite 8.3.8, react/react-dom 19.3.1, zod 4.6.7, vitest 5.1.0, @playwright/test 1.65.1, eslint 10.15.0, typescript-eslint 8.72.2, prettier 3.10.1 (`npm ls`). Supporting: jsdom 31.0.1, @testing-library/dom 10.4.2, @testing-library/jest-dom 7.0.1, @eslint/js 10.0.1, globals 17.14.0, eslint-plugin-react-hooks 7.1.1, @types/react(-dom) 19.3.0, @types/node 26.6.6.
- `npm audit`: one moderate advisory (minimatch ReDoS, GHSA-g3hv-75wg-m249) via typescript-eslint 8.72.2. Dev-only, input is our own glob config; the offered fix downgrades typescript-eslint, so it was not applied.
- Allowlist regex in `no-restricted-imports` (after review patch): `^(?!(?:\./|\.\./rules(?:/|$))(?!(?:.*/)?\.\.(?:/|$)))`. It permits `./x`, `./sub/x`, `../rules` and `../rules/x`, and rejects any `..` segment after that prefix. A future subfolder inside `src/rules/` importing `../x` would be rejected and need the regex widened.
- Review patch: every `Date` identifier is rejected in `src/rules/` (covers `new Date()`, `Date()`, `Date.now()` and aliases), so the `Date.now` property rule was removed. `Math` aliasing (`const M = Math; M.random()`) is a known limit of lint-only enforcement.
- `tokens.css` was generated once from the DESIGN.md frontmatter (colors with `-dark` pairs, spacing, rounded, typography) by a one-off script that is not committed; names: `--color-*`, `--space-*`, `--radius-*`, `--font-<role>-*`. If DESIGN.md changes, edit `tokens.css` by hand to match.
- `index.html` keeps a static `<title>Worldbound</title>` as the pre-JS fallback; `main.tsx` sets `document.title` from `copy.start.title`.
- `eslint.config.js` uses `defineConfig` from `eslint/config` (`tseslint.config()` is deprecated in typescript-eslint 8).
- Prettier defaults reformatted all new files to double quotes.
- First verification run 2026-11-16: `npm run lint` exit 0; `npm test` 37/37 passed; `npm run build` OK; `npm run test:e2e` 1/1 passed (Chromium headless shell 159); dev server served `index.html` on :5173. A real `src/rules/` file importing React and calling `Date.now()` made `npx eslint` exit 1 with both errors. Mutation check: removing `globalThis` from the banned list made `boundary.test.ts` fail on that row.
- Review patches (2026-11-16): traversal-safe allowlist; boundary glob covers `.ts,.tsx,.mts,.cts,.js,.jsx,.mjs,.cjs`; `TSImportType` rejected; extra banned globals beyond the matrix, all from the spine's "DOM, storage, globals" rule (`global`, `fetch`, `XMLHttpRequest`, `indexedDB`, `location`, `history`, `requestAnimationFrame`, `queueMicrotask`, `setImmediate`, `eval`, `Function`, `Intl`); boundary test asserts no fatal parse errors and exact rule ids everywhere; `tsconfig.test.json` split so `src/` has no Node types (a `process` probe in `src/ui` now fails `tsc -b`); `@types/node` pinned to ~22 (lowest supported major); `.npmrc` `engine-strict=true`; `100vh` fallback before `100dvh`; Playwright `isMobile`/`hasTouch`, failure screenshots/traces, single viewport; `data:,` favicon; README notes on placeholder folders and the e2e port; Node-floor evidence added to the architecture `.memlog.md`.
- Verification after review patches 2026-11-16: `npm run lint` exit 0; `npm test` 61/61 passed (60 boundary + 1 StartScreen); `npm run build` OK; `npm run test:e2e` 1/1 passed.
- Matrix audit: every row (OK, outside import, import bypass, banned globals, scope) is covered by `tests/rules/boundary.test.ts` and ran without skips.

## Spec Change Log

## Review Triage Log

Pass 1 (2026-11-16), reviewers: Blind Hunter (BH), Edge Case Hunter (EC), Verification Gap (VG). Claims marked *repro* were reproduced with ESLint `lintText` against the repo config before patching.

| Finding | Verdict | Evidence | Route |
|---|---|---|---|
| VG, EC-1, EC-claim, BH-1: `./../ui/copy`, `../rules/../app/store`, `./sub/../../app/store` pass the allowlist | high | *repro*: no boundary error; breaks matrix "Outside import" | patch (regex + 4 test rows) |
| BH-2: no tests for traversal or nested bypasses | high | same root cause as above | patch (merged) |
| VG-other, EC-2, EC-claim: `.js/.mts/.cts` in `src/rules/` skip the boundary | medium | *repro*: `src/rules/p.js` importing React gave no error | patch (glob + `.js` test) |
| EC-3: nested `src/rules/sub/a.ts` cannot import `../money` | false | matrix allows only `./x` and `../rules/x`; documented in Implementation Notes | reject |
| EC-4: `import('../content/schema').X` type bypasses the boundary | medium | *repro*: no error | patch (`TSImportType` + test) |
| EC-5, BH-4: `fetch`, `indexedDB`, `location`, `eval`, `Function` and so on not banned | medium | *repro* for fetch/indexedDB; the spine's rule bans DOM, storage and globals; rejecting more than the matrix does not contradict it | patch (list + tests) |
| EC-6, BH-3: `const D = Date` alias passes | low | *repro*; fix is a simpler selector | patch (`Identifier[name='Date']`) |
| BH-3 (part): `const M = Math; M.random()`, `Reflect.get` | low | real, but unlikely and needs complex selectors; `Math.floor` must stay allowed | reject (documented limit) |
| EC-7: `new Intl.DateTimeFormat().format()` reads the clock | low | real; one list entry | patch |
| EC-8: parse errors filtered, so "allows" passes vacuously | medium | *repro*: fatal message has `ruleId` null | patch (assert no fatal) |
| EC-14, BH-16: `import()`/`require()` use `toContain`, spec says exact ruleId | low | deviation from spec task | patch (`toEqual`) |
| EC-9, BH-6: engines only warn | low | npm default `engine-strict=false` | patch (`.npmrc`) |
| EC-10, BH-5: Node types visible in `src/` | medium | `process` type-checked in `src/ui` | patch (`tsconfig.test.json`) |
| BH-7: `@types/node` ~26 vs Node 22 floor | low | types describe newer APIs than supported | patch (~22) |
| EC-11: no `dvh` fallback | low | direct one-line correction | patch |
| EC-12, BH-15: port 4173 busy makes e2e fail | low | intentional (`reuseExistingServer: false` tests a fresh build) | patch (README note only) |
| BH-8: sprint status `in-progress` vs spec `in-review` | false | step 5 syncs the story to `review`; not yet run at review time | reject |
| BH-9: Node-floor change lacks cited evidence | low | spine note had no `npm view` output | patch (`.memlog.md` entry) |
| BH-10: error boundary and audit advisory have no issue numbers | low | CLAUDE.md requires user approval before creating issues | reject (proposed at session end) |
| BH-11: token generator not committed, so "regenerate" cannot be followed | low | DESIGN.md is `status: final`; committing a Python generator adds a toolchain | reject (note reworded to hand-edit) |
| BH-12: `stamp-code` lacks line-height; layout values in `--space-*`; no `data-theme` | false | tokens mirror DESIGN.md as-is (AD-9); DESIGN says "following the device" | reject |
| BH-13: font sizes in px | false | DESIGN.md specifies px; 200 % browser zoom reflows px text | reject |
| BH-14: e2e uses desktop profile; viewport set twice; no failure artifacts | low | direct corrections | patch |
| BH-17: favicon 404; fallback `<title>` outside copy | low | favicon 404 real; static fallback title is documented | patch (favicon only) |
| BH-18: global setup loads React for rules tests | low | rules tests still run in the Node env without a browser; harm negligible | reject |
| BH-19: README describes empty folders as filled | low | direct wording fix | patch |

No intent_gap or bad_spec entries; no deferrals. All patches applied directly (no implementation subagent).

## Verification

**Commands:**
- `npm run lint` -- expected: exit 0
- `npm test` -- expected: boundary and StartScreen tests pass
- `npm run build` -- expected: `dist/` produced, no type errors
- `npm run test:e2e` -- expected: start.spec passes at 375×812
- `npm ls typescript eslint vite react vitest @playwright/test` -- expected: Stack versions (TypeScript 6.0.x)

**Manual checks:**
- `npm run dev`, open http://localhost:5173: Start screen renders in light and dark mode
