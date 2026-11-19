---
title: 'Story 1.3 — Game state and starting a journey'
type: 'feature'
created: '2026-11-19'
status: 'done'
baseline_commit: '4d51af20355f2c06321847b22e647ed9f7bb7845'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/.docs/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** There is no game state and no way to start a journey, so Stories 1.4–1.7 have nothing to build on. Content is never loaded in the app, and invalid content would give a blank page (FR-1, FR-9 base, AR-3, AR-5, AR-10, #17, #24).

**Approach:** Add the `GameState` type, closed `Action` and `ReasonCode` unions and `apply()` to `src/rules/`, with `startJourney` as the first action. Load content inside the React tree through a provider in `src/app/`, under a top-level error boundary that shows a fallback screen and logs `ContentError.problems`.

## Boundaries & Constraints

**Always:**
- `apply(state, action, content)` with `state: GameState | null` (`null` = no journey) returns `Result`. It never mutates `state` or `content` and never throws for a player action (AD-2, AD-4).
- `startJourney` may replace any state; the confirm before discarding is UI (FR-1 [EXT]). Money and days come from `content.config.modes[mode]`; the mode exists only if `Object.hasOwn(content.config.modes, mode)`, otherwise `UNKNOWN_MODE`.
- Name: trim, keep the first 14 graphemes, trim again; empty → `"Traveller"`. Inner spaces and other characters are kept. Graphemes are counted with `new Intl.Segmenter("en", { granularity: "grapheme" })`. The name never affects rules.
- `daysTotal` is derived from `content.config.modes[state.mode].totalDays`, never stored.
- `loadContent()` runs only inside `ContentProvider` (`src/app/content.tsx`), in a lazy `useState` initialiser, never at module scope. The UI reads content through `useContent()` and never imports `src/content/`.
- The boundary logs `console.error("Invalid content:", error.problems)` for a `ContentError`, otherwise `console.error(error)`. React 19 also logs caught errors; the duplicate is accepted.

**Decisions (user, 2026-11-19):**
- Q1 = A: only `Intl.Segmenter` is allowed in `src/rules/`, through the selector in Design Notes; every other use of `Intl` is still rejected. AD-1 gets a one-line note.
- Q2 = B (user's wording, spelling checked): heading "Travel interrupted", body "Reload the page to try again.", and a "Reload" button that reloads the page.

**Never:** travel, city days, call home, end rules or queries (1.4, 2.1, 3.1); a start screen form, a store or storage (1.5, AD-8); `Intl` type names in `src/rules/`; content in the fallback screen.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Start (fixture) | `null`, name `"Ada"`, `valid-small` | ok; `home`, money 500, `daysUsed` 0, `daysTotal` 10, `stamps` `[]`, `album` `[]`, `cityDays` `{}`, `calledHome` false, `outcome` and `failReason` `null` | N/A |
| Start (real) | `null`, `loadContent()` | money 1500, `daysTotal` 30 | N/A |
| Restart | an existing state | ok; fresh state, `not.toBe(old)`; old unchanged | N/A |
| Trim | `"  Ada  "` | `"Ada"`, `nameGiven` true | N/A |
| Empty | `""` or `"   "` | `"Traveller"`, `nameGiven` false | N/A |
| Graphemes | `"Åse 👩‍👩‍👧"` | 5 graphemes, kept whole | N/A |
| Cap | 20 graphemes incl. æøå | first 14 kept | N/A |
| Cap then trim | `"a" + 13 spaces + "bc"` | `"a"` | N/A |
| Unknown mode | `mode: "nomad"` (not in content) | `{ ok: false, reason: "UNKNOWN_MODE" }`, no `state` key | input unchanged |
| Prototype key | `mode` cast to `"constructor"` | `UNKNOWN_MODE` | input unchanged |
| Bad content | `loadContent` throws `ContentError` | fallback shown; problems logged | boundary |
| Render error | a child throws | fallback shown; error logged | boundary |

</frozen-after-approval>

## Code Map

- `src/rules/types.ts` -- content types from 1.2; add the types in Design Notes. Keep no imports.
- `src/rules/journey.ts` -- new: `normalizeName()`, `applyStartJourney()`.
- `src/rules/apply.ts` -- new: `apply()`, and the action creator `startJourney(payload): Action`.
- `src/content/load.ts` -- reuse `loadContent()` and `ContentError` unchanged.
- `src/app/content.tsx` -- new: `ContentProvider`, `useContent()`, re-export of `ContentError`. Story 1.5's store builds on it.
- `src/ui/components/ErrorBoundary.tsx` -- new: class boundary; fallback is `<main>`, `<h1>`, `<p>`, `<button type="button">`; `onReload` prop defaults to `() => location.reload()`.
- `src/ui/App.tsx` -- new: `<ContentProvider><StartScreen /></ContentProvider>`.
- `src/main.tsx` -- render `<ErrorBoundary><App /></ErrorBoundary>`; keep `document.title`.
- `src/ui/copy.ts` -- add `error.title`, `error.body`, `error.reload`.
- `eslint.config.js` -- remove `"Intl"` from `no-restricted-globals`; add the selector to `no-restricted-syntax`; mention spec-1-3 in the header comment.
- `tests/rules/boundary.test.ts` -- `Intl.DateTimeFormat` now expects `no-restricted-syntax`; add the probes from Design Notes.
- `tests/content/content.test.ts` -- reuse its `fixture()` pattern for `valid-small.json`.
- `README.md` -- browser floor.
- `ARCHITECTURE-SPINE.md` -- AD-1 note on `Intl.Segmenter`.

## Tasks & Acceptance

**Execution:**
- [x] `src/rules/types.ts` -- add state, action, reason and result types -- AR-3, AD-4
- [x] `src/rules/journey.ts`, `src/rules/apply.ts` -- name rule, handler, `apply()`, action creator -- FR-1, AD-2
- [x] `eslint.config.js`, `tests/rules/boundary.test.ts` -- `Intl.Segmenter` exception and probes -- Q1
- [x] `tests/rules/startJourney.test.ts` -- `describe('FR-1 start a journey')`; every rules row; freeze `state` and `content` and compare with `structuredClone(before)` -- AC proof
- [x] `src/app/content.tsx`, `src/ui/components/ErrorBoundary.tsx`, `src/ui/App.tsx`, `src/main.tsx`, `src/ui/copy.ts` -- in-tree loading, boundary, fallback -- AR-10, #17, #24
- [x] `tests/ui/ErrorBoundary.test.tsx` -- `// @vitest-environment jsdom`; `vi.mock("../../src/app/content")` throws `new ContentError(["config.json: x: bad"])`; a throwing child; a valid render; spy on `console.error` with `mockImplementation`, restore in `afterEach`; assert `toHaveBeenCalledWith`, never call counts; check the Reload button by its name, without clicking -- AC proof
- [x] `README.md`, `ARCHITECTURE-SPINE.md` -- browser floor; AD-1 note -- Q1

**Acceptance Criteria:**
- Given no journey, when `apply(null, startJourney({ name }), content)` runs, then the result matches the Start rows, and the real content gives €1,500 and 30 days.
- Given any rejected action, when `apply` returns, then it is `{ ok: false, reason }` with a `ReasonCode` and the frozen input is unchanged.
- Given content that fails validation, when the app renders, then "Travel interrupted" and a "Reload" button are shown (never an empty `#root`), and `console.error` received `"Invalid content:"` with the problems.
- Given valid content, when the app renders, then the Start title is shown, no error is logged, and the e2e test passes.
- Given the change, when `npm test`, `npm run lint` and `npm run build` run, then all exit 0.

## Implementation Notes

- Deviations from EXPERIENCE: `GameState.nameGiven` (lets copy say "Your journey" when no name was given) and the new copy keys `error.title`, `error.body`, `error.reload`.
- `daysTotal(state, content)` is exported from `src/rules/journey.ts` so tests (and later stories) derive the total from `content.config.modes[state.mode].totalDays`; it is not stored in state. Story 1.4 may move it into `queries.ts`.
- `apply()` does not read `state` yet (only `startJourney` exists); it is marked `void state` to satisfy `noUnusedParameters` until 1.4 adds actions that read it.
- The fallback screen got its own `src/ui/components/ErrorBoundary.module.css` (tokens only), not listed in the Code Map, to keep one stylesheet per component.
- `tests/ui/ErrorBoundary.test.tsx` mocks `src/content/load` (not `src/app/content` as the task wording says; a deliberate deviation after code review) with `importOriginal` and a hoisted flag: the mocked `loadContent` throws `new ContentError(["config.json: x: bad"])` when the flag is set, otherwise delegates to the real loader. The real `ContentProvider` runs, so the in-tree `useState(loadContent)` path is tested, and the invalid and valid renders share one file.
- Browser floor corrected from the Known limits (Chrome ≥ 87, Safari ≥ 14.1): `Object.hasOwn` needs Chrome 93 / Safari 15.4, and Vite 8's default build target (baseline-widely-available) needs Chrome 107 / Safari 16 / Firefox 104. With `Intl.Segmenter` (Firefox ≥ 125) the README now says Chrome ≥ 107, Safari ≥ 16, Firefox ≥ 125.
- Removed placeholder `.gitkeep` files in `src/app/` and `src/ui/components/` now that they hold code.
- Mutation checks (run by hand, then reverted): replacing `Object.hasOwn` with `in` fails the prototype-key test; capping at 15 graphemes fails 3 name tests; logging the bare error for a `ContentError` fails the UI test.

## Spec Change Log

## Review Triage Log

Review pass 1 (2026-11-19): blind-hunter, edge-case-hunter, verification-gap.

| # | Layer | Finding | Verdict | Evidence | Route |
|---|-------|---------|---------|----------|-------|
| 1 | verification-gap, blind | UI test mocked `ContentProvider` itself, so the real `useState(loadContent)` path was untested | medium | Pre-verified gap; moving `loadContent` to module scope kept the test green | patch: mock `src/content/load` instead (re-checked: the module-scope mutation now fails the test) |
| 2 | verification-gap | No test checks that `main.tsx` wraps `App` in `ErrorBoundary` | medium | Pre-verified; only e2e runs through `main.tsx`, with valid content | defer (deferred-work.md); the fix changes entry structure or e2e plumbing |
| 3 | verification-gap (other) | Default `location.reload()` is never exercised | low | The spec says to check the button without clicking | reject |
| 4 | blind | Spec `in-review` vs sprint `in-progress` | false | Intermediate workflow state; step 5 sets spec `done` and sprint `review` | reject |
| 5 | blind, edge | Module-level `new Intl.Segmenter` throws before the boundary mounts on browsers without it | low | Only below the stated browser floor; a lazy segmenter would just move the throw into a 1.5 event handler, which the boundary does not catch either | reject |
| 6 | blind, edge | Lint selector allows any `Intl.Segmenter` member, but the AD-1 note claims only the `"en"`/grapheme constructor | low | The selector is the one decided in Design Notes; the note overstated it | patch: reword the AD-1 note to match the selector |
| 7 | blind, edge | Invisible, control or bidi characters give `nameGiven: true` | false | Frozen intent: "Inner spaces and other characters are kept" | reject |
| 8 | blind | 14/15 grapheme boundary not tested | false | The 20→14 test fails for any cap other than 14 (cap 15 failed 3 tests) | reject |
| 9 | blind | `onReload` prop unused/untested | false | The prop is required by the Code Map | reject |
| 10 | blind | StrictMode double logging | low | The spec accepts duplicate logs; the valid render logs nothing either way | reject |
| 11 | blind | `fixture()` copied instead of shared | low | The spec says to reuse the pattern; it is a 3-line helper | reject |
| 12 | blind | No test-run evidence recorded | false | Verification commands were run (135 tests, lint, build, e2e exit 0) and are recorded in the session log | reject |
| 13 | blind | Fallback not announced to assistive technology | low | It replaces the whole page on load and the `<h1>` is the first content; a live region adds complexity for little gain | reject |
| 14 | blind | Deviations not written into EXPERIENCE.md | false | The spec decides to record them in Implementation Notes | reject |
| 15 | edge | `daysTotal` with a mode missing from content throws | false | Only `apply` creates states, and it checks the mode; restored states belong to AD-8/1.5 | reject |
| 16 | edge | Unknown action type at runtime returns `undefined` | false | `Action` is a closed TS union and every caller is typed | reject |
| 17 | edge | README browser floor below what `Object.hasOwn` and Vite 8's default target need | medium | `Object.hasOwn` needs Chrome 93/Safari 15.4; Vite 8 baseline-widely-available is Chrome 107/Safari 16/Firefox 104 | patch: floor raised to Chrome ≥ 107, Safari ≥ 16, Firefox ≥ 125 |

## Design Notes

```ts
type JourneyMode = "explorer" | "nomad"; // nomad is [EXT], not in content yet
type Outcome = "goalReached" | "goalNotReached" | "failed"; // EXPERIENCE State Model; 1.4/3.1 set it
type FailReason = "outOfDays" | "stranded";
interface Stamp { id: PlaceId; day: number }    // ordered, last = most recent
interface AlbumEntry { id: string; day: number } // sight id
interface GameState {
  mode: JourneyMode; travellerName: string; nameGiven: boolean; position: PlaceId;
  money: number; daysUsed: number; stamps: Stamp[]; album: AlbumEntry[];
  cityDays: Record<PlaceId, number>; calledHome: boolean;
  outcome: Outcome | null; failReason: FailReason | null;
}
type Action = { type: "startJourney"; name: string; mode?: JourneyMode };
type ReasonCode = "UNKNOWN_MODE"; // later stories add NO_JOURNEY, NOT_ENOUGH_MONEY, JOURNEY_ENDED, …
type Result = { ok: true; state: GameState } | { ok: false; reason: ReasonCode };
```

Lint selector (tested against probes on 2026-11-19): `Identifier[name='Intl']:not(MemberExpression[computed=false][property.name='Segmenter'] > .object)`. Allowed: `new Intl.Segmenter("en", …)`. Rejected: `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl["DateTimeFormat"]`, `Intl["Segmenter"]`, `const I = Intl`, `const { DateTimeFormat } = Intl`, `Intl.SegmentData` types. A property named `Intl` is also flagged; that is accepted.

Deviations from EXPERIENCE, to record in Implementation Notes: `nameGiven` (lets copy say "Your journey"), and the new copy keys `error.*`.

Known limits: error boundaries do not catch event-handler or async errors, so Story 1.5 handles rejected `apply` results and listener errors itself. `Intl.Segmenter` needs Firefox ≥ 125, Safari ≥ 14.1 or Chrome ≥ 87. Unicode-version drift between runtimes can count new emoji sequences differently; that is accepted.

## Verification

**Commands:**
- `npm test` -- expected: all pass, including the new rules, boundary and UI tests
- `npm run lint` -- expected: exit 0
- `npm run build` -- expected: no type errors
- `npm run test:e2e` -- expected: start screen test passes
