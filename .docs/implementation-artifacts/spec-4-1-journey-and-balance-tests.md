---
title: 'Story 4.1 — Journey and balance tests (rules)'
type: 'feature'
created: '2026-11-25'
status: 'done'
route: 'dispatch'
review_loop_iteration: 1
baseline_commit: '4fa59d87b3c6dc21797d193138e163b849e589cd'
context:
  - '{project-root}/.docs/implementation-artifacts/epic-4-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** UJ-1 has no scripted rules test, the balance claim (SM-3) is only a one-off calculation in the PRD addendum §6, and nothing shows which test covers each SM-1 FR consequence. A price or rule change could break the game without any test failing.

**Approach:** Add a UJ-1 rules test, an exhaustive SM-3 balance test over the real content driven only through `apply`, and an SM-1 FR → test map with a guard test that keeps the map honest. No rule, content or UI code changes.

## Boundaries & Constraints

**Always:**
- Use the real content (`loadContent()`), deep-frozen. Drive state only through `apply` and the action creators, and read results from state. Assert `ReasonCode`s and state, never copy strings.
- Every new `describe` starts with its FR/SM/UJ ids (AD-10).
- The balance test asserts the SM-3 thresholds (≥ 3 sets without sights, ≥ 1 with a full album, 0 journeys home with ≥ 6 stamps), not exact prices. Each search must also find the five-European set, so that a broken search cannot make "0 six-stamp journeys" pass vacuously.
- The balance search follows the rules: it may pass through a city without a city day, and a journey counts only if it arrives home within 30 days.
- The full `npm test` run stays under its current time plus 5 s.

**Never:**
- Change `src/`, `content/` or prices to make a test pass (SM-C2).
- Use fixtures for the journey or balance tests.
- Write UI or e2e tests (that is Story 4.2).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| UJ-1 win | Ingrid's 11 actions: bus to Copenhagen, city day; bus to Paris, city day with Eiffel Tower and Louvre; bus to London, city day; plane to Rome, city day; bus to Istanbul, city day; plane home | position `home`, `daysUsed` 16, money 423, 5 stamps in visit order, album of 2, `outcome: goalReached`, `calledHome: false` | Any rejected action fails the test with its reason |
| UJ-1 checkpoints | after arriving in Copenhagen and in Paris | €1,430, Day 3; €1,270, Day 6 | — |
| SM-3 no sights | every reachable journey, city days without sights | ≥ 3 distinct 5-stamp sets reach `goalReached` (today: 4) | — |
| SM-3 full album | every city day buys both sights | ≥ 1 set reaches `goalReached` (today: 1) | — |
| SM-3 six stamps | both searches | no state arrives home with ≥ 6 stamps | — |
| FR map guard | map file and test files | every SM-1 FR id has ≥ 1 entry, and every test named in the map exists | Fails and names the missing FR or test |

**Decisions (CSE, 2026-11-25):**
- **FR map:** a Markdown map `.docs/test-report/fr-test-map.md` (FR → consequence → test file and `describe › it` name), plus a guard test `tests/traceability.test.ts` that fails when an SM-1 FR has no row or a named test no longer exists. Story 4.4's test report links to the map.
- **FR-14:** map the rule part now. The end state holds everything the summary reads (traveller name, stamps, album, days used, money, outcome, `calledHome`), as asserted by UJ-1 and UJ-2. Mark the UI consequences "pending Story 3.3"; the guard allows that marker only for FR-14. AC 3 is met apart from the marked rows, and Story 3.3 must replace them with tests.
- **Scope:** keep the full spec (about 2,000 tokens) as one story and one PR.
- **Call home in the balance test (review pass 1):** the balance search keeps the PRD addendum's model and does not use call home: a journey counts only when it travels home. This exclusion is stated in the spec, the test file header and the FR map. Under the real rules call home is a loophole (6 stamps reachable away from home, and a Tokyo set wins via call home). A GitHub issue asks the team whether that is acceptable. The code from pass 1 is kept and amended, not reverted.

</frozen-after-approval>

## Code Map

- `tests/rules/end.test.ts:349` -- UJ-2 already exists, including the 24-day stranded case. Map to it; do not move or duplicate it.
- `tests/rules/end.test.ts:40` -- `play()` helper (each action through `applyFrozen`). Copy the pattern; it is local to that file.
- `tests/rules/helpers.ts` -- `deepFreeze`, `applyFrozen`, `started`. Reuse them.
- `src/rules/apply.ts` -- `apply`, `startJourney`, `travel`, `spendCityDay`. The only way to change state.
- `src/content/load.ts:72` -- `loadContent()` for the real content.
- `content/routes.json`, `content/sights.json`, `content/destinations.json` -- read-only. The search reads the routes from `content.routes` and the sights from `content.sights`.
- `tests/balance/.gitkeep` -- the folder exists; remove the `.gitkeep` once a test lives there.
- `vite.config.ts` -- includes `tests/**/*.test.{ts,tsx}`, so no config change is needed.
- `.docs/planning-artifacts/prds/prd-worldbound-nomad-2026-10-12/prd.md` §4 -- the source of the FR consequences for the map.

## Tasks & Acceptance

**Execution:**
- [x] `tests/rules/journeys.test.ts` -- new: `describe("FR-6 FR-8 FR-10 FR-11 FR-21 FR-22 UJ-1 Ingrid reaches the goal (real content)")`, with the matrix rows UJ-1 win and UJ-1 checkpoints -- UJ-1 as a scripted rules test (AD-10)
- [x] `tests/balance/balance.test.ts` -- new: `describe("SM-3 FR-6 FR-8 FR-11 FR-21 balance (real content)")`. A search over `apply` from `startJourney({ name: "Balance" })`. Key: position, set of stamps, days used; keep the state with the most money per key. Moves: travel by any mode, then optionally a city day in an unstamped city (with or without both sights, depending on the run). Assert the matrix's SM-3 rows -- SM-3 as an automated test over the content
- [x] `tests/balance/.gitkeep` -- delete -- the folder now has a test
- [x] `.docs/test-report/fr-test-map.md` -- new: one row per testable consequence in PRD §4 for FR-1, FR-4, FR-6 – FR-14, FR-21, FR-22, each with a test file and a `describe › it` name -- SM-1 evidence for Story 4.4
- [x] `tests/traceability.test.ts` -- new: parse the map; each SM-1 FR has ≥ 1 row; each named test file exists and contains the named `it`/`describe` title -- keeps the map in step with the tests
- [x] Any FR consequence that has no test yet -- add the missing rules test in the matching `tests/rules/*.test.ts` file, or flag it -- SM-1 requires a test for every consequence

**Acceptance Criteria:**
- Given the 4.1 tests, when `npm test` runs, then every test passes, including UJ-1, SM-3 and the FR map guard
- Given a price change that breaks SM-3 (for example, the Rome stay at €200), when the balance test runs, then it fails
- Given the FR map, when an SM-1 FR has no test, or a named test is renamed, then `tests/traceability.test.ts` fails and names it

## Implementation Notes

- Balance search results on today's content (2026-11-25): without sights 4 goal sets — Europe (€980), Copenhagen/London/New York/Paris/Rome (€1,390), Copenhagen/Istanbul/New York/Paris/Rome (€1,460), Istanbul/London/New York/Paris/Rome (€1,480); with a full album 1 set — Europe (€1,143); no arrival home with ≥ 6 stamps in either run. Matches the Design Notes prototype.
- Mutation checks (run, then reverted): Rome cost factor 4.0 (stay €200) fails the no-sights test (1 set < 3); base accommodation €5 fails both tests (six-stamp journeys found); renaming the UJ-2 24-day test title fails the map guard and names both rows.
- Missing FR tests added: FR-1 "the name never affects the rules" (startJourney.test.ts), FR-12 "stays offered after a rejected action and a city day until it is used" (callHome.test.ts), and a `daysUsed` assertion on the FR-21 two-sights test (no extra days).
- Flagged instead of tested (UI not built yet; listed in the map's Flagged section with owners): FR-7 travel-home confirmation (1.7), FR-8 city-day home-unreachable warning — no rules query exists yet (2.4, #39), FR-12 Call home sheet and "Not now" (3.2), FR-22 album photo/fact view (2.5), FR-4/FR-9 on-screen unavailable reasons (1.6, 2.4, 3.2), FR-1 name on passport/summary (2.5, 3.3).
- Review pass 1: AC 2 is now also an automated test (a frozen content copy with Rome at cost factor 4.0 leaves fewer than 3 sets); the balance header, the FR map and epic-4-context state that call home is excluded (#66); the guard matches titles only as the first argument of `describe`/`it`/`test` calls (also after `.each(...)`), in source order, not skipped, and names malformed map rows; `play()` moved to `tests/rules/helpers.ts`.
- `npm test`: 20 files, 375 tests, ~1.6 s wall time (baseline 1.6 s).

## Spec Change Log

- **Loop 1 (review pass 1, intent_gap #1–#2):** call home is not in the balance search, but the real rules let a player reach 6 stamps away from home and win via call home. CSE decided: exclude call home, document the exclusion, open a GitHub issue; keep the code and amend it. Amended: the Decisions in the frozen block. Known-bad state avoided: a balance test that silently claims "no 6-stamp journey" while the rules allow one. KEEP: the UJ-1 test, the `apply`-driven search with its dominance key and the Europe vacuity guard, the map's 81 rows and Flagged table, and the guard's named problem lines.

## Review Triage Log

Review pass 1 (2026-11-25; Blind Hunter, Edge Case Hunter, Verification Gap).

| # | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|
| 1 | Balance search never tries `callHome`, so journeys that win via call home are not counted (BH) | high | Prototype over real content: 6 stamps reachable away from home in 4 sets (e.g. Europe-5 + New York, €1,440, 12 days); call home fits in 36 such states; Copenhagen/Istanbul/Paris/Rome/Tokyo wins only via call home. FR-11 counts the stamps left after call home (`callHome.test.ts` "reaches the goal when the stamps left still meet it"). | intent_gap (with #2) |
| 2 | Six-stamp check only records states that arrive home (BH) | high | `record()` returns early away from home; same root as #1: whether a journey that reaches 6 stamps and then calls home counts for SM-3. | intent_gap (with #1) |
| 3 | No 21-day lever for Story 4.4 (BH) | low | Not an AC of 4.1; 4.4 can add a days parameter when it needs it. Fix adds surface. | reject |
| 4 | AC 2 checked only by a manual mutation (BH) | medium | Implementation Notes record a one-off run; nothing in CI shows the search still detects a breaking price. | patch (moot: loopback) |
| 5 | FR-12 "stays offered after a rejected action" re-checks an untouched state; map row claims "or the condition is left", untested (BH, ECH) | low | A rejected `apply` returns no state, so the second `statusFrozen(state)` cannot change; no test leaves the offer condition. | patch (moot: loopback) |
| 6 | Map guard accepts `.skip`/`.todo`, titles in comments, and wrong `describe › it` nesting (VG, BH, ECH) | medium | `hasTitle()` is a substring search for a quoted literal; `it.skip("allows money equal to the price")` still passes `checkMap`. | patch (moot: loopback) |
| 7 | A missing map file fails as "expected 0 > 13", not by name (BH) | low | `readRepoFile(MAP_PATH) ?? ""` → 0 rows. | patch (moot: loopback) |
| 8 | Parser: unescaped/escaped pipes, "—" test cells, dead `titles.length === 0` branch, escaped quotes in titles (BH, ECH) | low | No such rows exist today; each fix adds parsing branches. | reject |
| 9 | Empty file cell or directory path crashes with EISDIR (ECH) | false | The guard fails loudly in both cases, which is correct behaviour for an unreachable malformed row. | reject |
| 10 | Row with a malformed FR cell is silently dropped (ECH) | low | `/^\|\s*FR-\d+\s*\|/` skips it without a problem line; direct fix is one check. | patch (moot: loopback) |
| 11 | FR-6 "whole journey" row points at the Paris checkpoint test (BH) | low | `fr-test-map.md` FR-6 row cites "arrives in Copenhagen … Paris …". | patch (moot: loopback) |
| 12 | Flagged section says "add a test and a row here" (BH) | low | Should say: add the row to the main table and remove the Flagged entry. | patch (moot: loopback) |
| 13 | `epic-4-context.md` keeps the direct-routes model and €1,430–1,480 / 14–16 days (BH) | low | Spec Design Notes record €1,390 / 17 days with a stopover. | patch (moot: loopback) |
| 14 | Spec `in-review` vs sprint-status `in-progress` (BH) | false | Mid-workflow state; sprint status is synced when the build is presented. | reject |
| 15 | `play()` helper exists three times (BH) | low | `end.test.ts`, `journeys.test.ts`, inline in `startJourney.test.ts`; belongs in `helpers.ts`. | patch (moot: loopback) |
| 16 | "plays all 11 actions as one script" asserts only array lengths (BH, VG) | low | Runs nothing through `apply`; only used as a known title by the guard self-test. | patch (moot: loopback) |
| 17 | `goalSets` money values unused (BH) | low | Kept for debugging only; no harm. | reject |
| 18 | `goalSets.size >= 1` redundant after `has(EUROPE)` (BH) | false | It is the SM-3 threshold assertion itself, kept on purpose. | reject |
| 19 | 0-day route would break the day-ordered search (BH, ECH) | false | `src/content/schema.ts:83,119`: `days: wholeDays.positive()`, so content cannot load a 0-day mode. | reject |
| 20 | Dominance "more money never removes an option" unchecked (BH) | low | Holds for current rules: the key holds stamps; album and city days follow from them per run. | reject |

Review pass 2 (2026-11-25, after loop 1; Blind Hunter, Edge Case Hunter, Verification Gap — VG: no gaps).

| # | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|
| 21 | Six-stamp assertion can pass vacuously: nothing shows `sixPlusHome` can be non-empty (BH) | medium | Only the Rome €200 mutation is automated; the base-€5 six-stamp mutation was manual (Implementation Notes). | patch |
| 22 | "five-stamp sets" never asserted; depends on `goalStamps` = 5 (BH) | low | `goalSets` takes any `goalReached` set; direct fix is one assertion per key. | patch |
| 23 | FR-13 row "a city day or a route" maps only the city-day test (BH) | low | `end.test.ts:159` "continues while an affordable route still fits" exists but is not mapped. | patch |
| 24 | Typed `it.each<…>(` calls cannot be matched by the guard (ECH) | low | `content.test.ts:249,328,369` use `it.each<…>`; the head regex has no type-argument branch, so those titles can never be mapped. One-token regex fix. | patch |
| 25 | Guard checks one row per FR, not per consequence (BH) | low | AC 3 requires failure when an FR has no test, which holds; pinning per-consequence counts adds surface. | reject |
| 26 | `pending Story 3.3` marker and Flagged table never expire (BH) | low | True, but the fix (reading sprint-status) adds branches; Story 3.3 owns the replacement per the frozen decision. | reject |
| 27 | Source order is not containment; a parent `describe.skip` is missed (BH, ECH) | low | No duplicate titles in `tests/rules` (VG) and no `describe.skip`/`.only` anywhere in `tests/` (grep); fix needs range tracking. Carries on from #6, which was patched for order and skip. | reject |
| 28 | Rows citing `it.each` templates prove the template, not the case (BH) | low | Real, but splitting the tables into named `it`s is a refactor outside this story's risk. | reject |
| 29 | No test pins the call-home loophole of #66 (BH) | false | CSE chose "exclude, document, open an issue" over a pinned loophole test (frozen decision). | reject |
| 30 | FR-12 "until used" not checked through `callHomeStatus` (BH) | low | `callHome.test.ts` "is not offered at home or after the end" already covers it. | reject |
| 31 | Timing claim lacks a baseline (BH) | false | The verbose run shows the two balance searches take 0.17 s and 0.15 s; the full run is 1.4 s, far under the +5 s limit. | reject |
| 32 | Spec text stale (Code Map `play()`, "81 rows", Verification still manual) (BH) | low | The fix edits this build's spec. | reject |
| 33 | Head regex also matches `obj.test("…")` (BH) | low | No such call has a string matching a map title; the fix adds lookbehind logic. | reject |
| 34 | Empty file cell → EISDIR (ECH) | false | carried #9: fails loudly. | reject |
| 35 | Regex literal or JSX quote desyncs the scanner (ECH) | low | Possible at `content.test.ts:65`, but every mapped row passes today and drift fails loudly as a missing title; regex-literal detection adds complexity. | reject |
| 36 | Escaped or interpolated titles reported missing (ECH) | low | Fails loudly; no mapped title has escapes. | reject |
| 37 | Another table before Flagged, or an escaped pipe (ECH) | low | carried #8: the map has one table and no pipes in its cells. | reject |
| 38 | `.only` elsewhere in a file is not flagged (ECH) | low | No `.only` in `tests/`; Vitest's CI mode already fails on `.only`. | reject |

## Design Notes

The addendum's "every order of every set" allows only direct routes between stops. The game itself allows stopovers, so the search follows the rules instead. A Python prototype over the same content (scratchpad, 2026-11-25) gave the same 4 sets without sights and the same single full-album set, and found no set of 6 or more stamps, with and without stopovers. The only difference is the Copenhagen, London, New York, Paris, Rome set, which costs €1,390 over 17 days with a stopover against the addendum's €1,430 over 14 days. A prototype run took 0.1 s, so the search over `apply` should stay well under the time limit.

## Verification

**Commands:**
- `npm test` -- expected: all pass, with the new files listed
- `npm run lint` -- expected: exit 0
- `npm run build` -- expected: ok

**Manual checks (if no CLI):**
- Mutation check: temporarily set one stay or route price high enough to break SM-3, run `npx vitest run tests/balance`, confirm that it fails, then revert. Do the same for a renamed test title against the map guard.
