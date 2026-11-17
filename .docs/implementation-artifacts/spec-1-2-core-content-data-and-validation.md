---
title: 'Story 1.2 — Core content data and validation'
type: 'feature'
created: '2026-11-17'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '95b7f346b8753715bfacddadd957d44677a3ac98'
context:
  - '{project-root}/.docs/implementation-artifacts/epic-1-context.md'
  - '{project-root}/.docs/planning-artifacts/prds/prd-worldbound-nomad-2026-10-12/addendum.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Rules and UI need one source of truth for places, routes and core values. Without validated content data, Stories 1.3–1.7 would hard-code numbers or break on a typo in JSON (NFR-7, AR-6, FR-3: home + 8 destinations).

**Approach:** Put the core Explorer values, Bergen + 8 destinations and the 21-route network into `content/*.json`, with the content types in `src/rules/types.ts`, zod schemas and a loader in `src/content/`, and tests proving that real content is valid and matches the addendum, and that broken fixtures fail with a clear error.

## Boundaries & Constraints

**Always:**
- Values come from the PRD addendum: §1 core values (Explorer), §2 cost factors, §4 routes (both directions, same price and days). Coordinates and stamp codes (`iata`) come from EXPERIENCE → Map Data. Bergen has id `home` and no `iata` or cost factor.
- Content types live in `src/rules/types.ts` (the rules may not import `src/content/`, AD-1). `src/content/` imports only zod, `src/rules/types.ts` and the JSON files.
- Ids are lowercase kebab. Money and days are integers. Transport modes are exactly `'plane' | 'train' | 'bus'`.
- The schema checks structure and cross-file integrity, not counts, so fixtures and later EXT records (Madrid, Cape Town, Nomad) still validate. The counts (8 destinations, 21 routes, 30 mode options) are asserted on the real content in the content test.
- Invalid content throws one `ContentError` whose message names the file and every failing path in plain English.
- Matching the addendum (decision 2026-11-17, option C): a one-time comparison of the JSON with addendum §1, §2 and §4 runs in this story, and its result is recorded in Implementation Notes. The committed test checks counts and invariants only. From then on the JSON is the source of truth, as the addendum itself says; later balance changes edit only `content/`.

**Never:** No sights, fact cards, photos or map layout fields (`regionId`, `labelOffset`, `pillOffset`, `stampAngle`), which come in Stories 2.x and 1.6. No `GameState`, actions or `ReasonCode` (Story 1.3). No EXT values. No UI changes.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Real content | `content/config.json`, `destinations.json`, `routes.json` | `loadContent()` returns a typed `Content` | N/A |
| Valid fixture | small fixture: home + 2 destinations, 2 routes | `parseContent()` returns `Content` | N/A |
| Unknown place id | route endpoint `"parris"` | — | `ContentError` naming `routes.json`, the route path and `"parris"` |
| Negative or non-integer price/days | `price: -10` or `days: 1.5` | — | `ContentError` naming the path |
| Duplicate | two places share an id or `iata`; two routes join the same pair (either direction); a route lists the same mode twice | — | `ContentError` naming the duplicate |
| Self route | route from `paris` to `paris` | — | `ContentError` |
| Bad shape | missing `home`, bad id format, unknown mode `"boat"`, lat > 90, cost factor ≤ 0, extra unknown key | — | `ContentError` naming the path |

</frozen-after-approval>

## Code Map

- `src/rules/.gitkeep` -- replace with `types.ts`; Story 1.3 will add `GameState`, actions and `ReasonCode` to the same file
- `src/content/.gitkeep`, `content/.gitkeep`, `tests/content/.gitkeep`, `tests/fixtures/.gitkeep` -- replace with real files
- `eslint.config.js` -- the AD-1 allowlist applies to `src/rules/**` only; `src/content/` may import `../rules/types` (spine layer table)
- `tsconfig.app.json`, `tsconfig.test.json` -- add `resolveJsonModule: true` for JSON imports
- zod 4.6 is installed; `z.prettifyError(error)` gives readable path-based messages
- Mode options per route, from addendum §4: Bergen–Copenhagen, Copenhagen–Paris, London–Paris and Paris–Rome have 3 each; Rome–Istanbul has 2 (plane, bus); the other 16 routes have 1 (plane) = 30

## Tasks & Acceptance

**Execution:**
- [x] `src/rules/types.ts` -- `PlaceId`, `TransportMode`, `Place`, `Home`, `Destination` (`iata`, `costFactor`), `ModeOption` (`mode`, `price`, `days`), `Route` (`between: [PlaceId, PlaceId]`, `modes`), `Config` (`modes.explorer.{startMoney,totalDays}`, `goalStamps`, `baseAccommodationPrice`, `callHome.{days,stampPenalty,price}`), `Content` -- AR-6 types without importing zod
- [x] `content/config.json`, `content/destinations.json` (`{ home, destinations[] }`), `content/routes.json` (`{ routes[] }`) -- values per Always -- NFR-7
- [x] `src/content/schema.ts` -- strict zod schemas that `satisfies` the types, plus a cross-file check (`superRefine`) for every rejecting matrix row -- AD-7
- [x] `src/content/load.ts` -- `ContentError`; `parseContent({ config, destinations, routes })` (pure, throws `ContentError`); `loadContent()` imports the three JSON files and calls `parseContent` -- one validation path
- [x] `tests/fixtures/content/` -- `valid-small.json`, plus one broken fixture per rejecting matrix row (built from `valid-small` with one defect each) -- AD-7 fixtures for later rules tests
- [x] `tests/content/content.test.ts` -- `describe('NFR-7 AR-6 content', …)`: the real content loads; counts are 8 / 21 / 30; `home` is Bergen; every route has 1–3 unique modes; one `it` per matrix row asserting `ContentError` with the file and path in the message -- AC proof

**Acceptance Criteria:**
- Given the three real content files, when `npm test` runs, then they validate, the counts are 8 destinations, 21 routes and 30 mode options, and every route endpoint refers to an existing place id; the one-time comparison with addendum §1, §2 and §4 is recorded as an exact match.
- Given each broken fixture in the matrix, when it is parsed, then a `ContentError` names the file and the failing path.
- Given the change, when `npm run lint` and `npm run build` run, then both exit 0, with `src/rules/types.ts` passing the AD-1 boundary.

## Design Notes

`Content` is assembled as `{ config, home, destinations, routes }`. Routes are stored once per pair (`between`), and lookups in both directions are Story 1.4's job. `modes` is a record keyed by mode name (`explorer`, later `nomad`), so Nomad (EXT) adds data, not code. The epic context was revalidated (only `.memlog.md` was newer, with no relevant change), and its "8 European destinations" error was corrected.

## Implementation Notes

- 2026-11-17, implemented directly in the main session (subagents only in the review step, per the user).
- `src/rules/types.ts` has no imports and passes the AD-1 boundary. `src/content/load.ts` imports the JSON files with `resolveJsonModule` (added to `tsconfig.app.json` and `tsconfig.test.json`).
- Validation (after review patch): `contentFilesSchema` in `schema.ts` combines the three per-file schemas and runs the cross-file checks (unknown ids, duplicate place id or `iata`, duplicate pair in either direction, duplicate mode, self route) in a `superRefine`. Its zod 4 `when` option makes these checks run whenever destinations and routes are valid, even if `config.json` fails, so one `ContentError` lists every problem found. `parseContent()` maps each issue path to `<file>: <path>: <message>`. The message is `Invalid content (N problems):` followed by one line per problem; `ContentError.problems` holds the same lines.
- `config.modes` keys must be kebab ids (so a typo like `"Nomad "` is rejected); `explorer` is required.
- A destination with id `home` is rejected as a duplicate place id.
- Fixtures: `valid-small.json` (home + 2 destinations, 2 routes) and five `broken-*.json`, one per rejecting matrix row with a single defect each. The other variants of a row are applied in the test to a fresh copy of `valid-small` through a typed `Draft` helper.
- One-time addendum comparison (option C), 2026-11-17: a script (scratchpad, not committed) parsed the tables in `addendum.md` §1 (7 values), §2 (8 core destinations) and §4 (21 routes, 30 mode options) and compared them with `content/*.json`. **Result: 0 differences.** Mutation check: changing Paris–New York from €320 to €321 produced exactly one difference.
- Coordinates and `iata` codes are copied from EXPERIENCE → Map Data (city codes such as `LON` and `NYC`, not airport codes).
- README: new "Editing game content" section (content is the source of truth; `npm test` validates it).
- First verification 2026-11-17: 83/83 tests, lint and build clean. After review patches: `npm test` 94/94 passed (33 content, 60 boundary, 1 StartScreen); `npm run lint` exit 0; `tsc -b` clean. Mutation check: removing the problem list from `ContentError.message` made 28 content tests fail.
- Matrix audit: every row is covered by `tests/content/content.test.ts` (real content: 4 tests; valid fixture: 1; unknown id: 1; negative or non-integer: 5; duplicate: 6; self route: 1; bad shape: 13; aggregation: 2) and ran without skips.

## Spec Change Log

## Review Triage Log

Pass 1 (2026-11-17), reviewers: Blind Hunter (BH), Edge Case Hunter (EC), Verification Gap (VG).

| Finding | Verdict | Evidence | Route |
|---|---|---|---|
| BH-1, VG-other, EC-claim: addendum comparison not recorded; spec has no Implementation Notes | high | confirmed: the spec I wrote lacked the `## Implementation Notes` heading, so the notes were never inserted | patch (section added with the comparison result) |
| BH-2, EC-claim: cross-file checks in `load.ts`, not a `superRefine` in `schema.ts` as the task says | medium | deviation from the spec task; exported schemas lacked the checks | patch (moved to `contentFilesSchema.superRefine`) |
| BH-4, EC-1, VG-other, EC-claim: a schema failure in any file hides cross-file problems | medium | confirmed in old `parseContent` (early throw) | patch (`when` option; test added) |
| VG-2, BH-5: collecting problems from several files is never tested | medium | every case had one defect | patch (2 aggregation tests) |
| VG-1: `.message` never checked for file and path | medium | demonstrated: mutated message passed all tests | patch (`problemsOf` asserts every problem is in the message; mutation now fails 28 tests) |
| BH-12, EC-2: `config.modes` accepts any key | low | `catchall` accepted `"Nomad "` | patch (kebab key check + test) |
| BH-8, EC-3: `loadContent()` runs at collection time | low | invalid content would crash collection | patch (`beforeAll`) |
| BH-7: reachability from home not checked | low | the test only checked that each id appears | patch (BFS test) |
| BH-9: "unknown mode" special-cased by name in `it.each` | low | brittle label switch | patch (own `it`) |
| BH-11: untested edges (lon, zero days/price, null root, iata format, blank name, same-direction duplicate) | low | direct test additions | patch (8 cases) |
| BH-13: redundant `structuredClone`; test name says 1–3 but checks only ≥ 1 | low | direct corrections | patch |
| BH-15: README does not explain editing `content/` | low | CLAUDE.md §5 | patch (README section) |
| BH-16: `Home` doc says "no city day", a game rule | low | rule belongs to Stories 1.3/1.4 | patch (comment reworded) |
| VG-3: real prices and cost factors only checked by count | false | intent decision option C (frozen): one-time comparison, then the JSON is the source of truth | reject |
| BH-3: spec `in-review` vs sprint `in-progress`; triage log empty | false | step 5 syncs the sprint status; the triage log is filled in this step | reject |
| BH-6: no cross rules on config (goalStamps ≤ destinations, callHome.days < totalDays) | low | real, but not in the matrix and unlikely; balance test SM-3 (Epic 4) checks winnability | reject |
| BH-10: four broken fixtures duplicate `valid-small` | low | matches the spec (one fixture file per rejecting row); documented | reject |
| BH-14: no per-mode trade-off invariant (plane fastest, bus cheapest) | low | balance concern outside this story's intent | reject |

No intent_gap or bad_spec entries; no deferrals. All patches applied directly.

## Verification

**Commands:**
- `npm test` -- expected: content tests and existing tests pass
- `npm run lint` -- expected: exit 0
- `npm run build` -- expected: no type errors
- one-time addendum comparison script (scratchpad, not committed) -- expected: 0 differences
