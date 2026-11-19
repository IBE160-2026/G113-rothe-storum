---
title: 'Story 1.3 — Game state and starting a journey'
type: 'feature'
created: '2026-11-19'
status: 'ready-for-dev'
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
- [ ] `src/rules/types.ts` -- add state, action, reason and result types -- AR-3, AD-4
- [ ] `src/rules/journey.ts`, `src/rules/apply.ts` -- name rule, handler, `apply()`, action creator -- FR-1, AD-2
- [ ] `eslint.config.js`, `tests/rules/boundary.test.ts` -- `Intl.Segmenter` exception and probes -- Q1
- [ ] `tests/rules/startJourney.test.ts` -- `describe('FR-1 start a journey')`; every rules row; freeze `state` and `content` and compare with `structuredClone(before)` -- AC proof
- [ ] `src/app/content.tsx`, `src/ui/components/ErrorBoundary.tsx`, `src/ui/App.tsx`, `src/main.tsx`, `src/ui/copy.ts` -- in-tree loading, boundary, fallback -- AR-10, #17, #24
- [ ] `tests/ui/ErrorBoundary.test.tsx` -- `// @vitest-environment jsdom`; `vi.mock("../../src/app/content")` throws `new ContentError(["config.json: x: bad"])`; a throwing child; a valid render; spy on `console.error` with `mockImplementation`, restore in `afterEach`; assert `toHaveBeenCalledWith`, never call counts; check the Reload button by its name, without clicking -- AC proof
- [ ] `README.md`, `ARCHITECTURE-SPINE.md` -- browser floor; AD-1 note -- Q1

**Acceptance Criteria:**
- Given no journey, when `apply(null, startJourney({ name }), content)` runs, then the result matches the Start rows, and the real content gives €1,500 and 30 days.
- Given any rejected action, when `apply` returns, then it is `{ ok: false, reason }` with a `ReasonCode` and the frozen input is unchanged.
- Given content that fails validation, when the app renders, then "Travel interrupted" and a "Reload" button are shown (never an empty `#root`), and `console.error` received `"Invalid content:"` with the problems.
- Given valid content, when the app renders, then the Start title is shown, no error is logged, and the e2e test passes.
- Given the change, when `npm test`, `npm run lint` and `npm run build` run, then all exit 0.

## Implementation Notes

## Spec Change Log

## Review Triage Log

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
