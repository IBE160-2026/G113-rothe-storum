---
title: 'Story 3.1 — Goal, call home and end rules (rules)'
type: 'feature'
created: '2026-11-24'
status: 'done'
route: 'dispatch'
review_loop_iteration: 1
baseline_commit: '7bbaad5f8c3effc97bbbfc0ef801c0b7f424935c'
context:
  - '{project-root}/.docs/implementation-artifacts/epic-3-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The rules can end a journey only by travelling home. A player who runs out of money away from home has no action, and nothing ends the journey as stranded or out of days (FR-11, FR-12, FR-13, Decision H). Stories 3.2 and 3.3 have nothing to read.

**Approach:** Add `callHome` to the closed action union, a `callHomeStatus` query, and one end-rule function that `apply` runs after every successful action. That function also owns the goal evaluation for arriving home, so travel and call home share it. All values come from `content.config` (`callHome.days`, `stampPenalty`, `price`, `goalStamps`).

## Boundaries & Constraints

**Always:**
- Call home is offered if and only if the position is a destination (not home) and money is below the cheapest mode on every route from it. A destination with no routes counts as offered.
- Call home fits if and only if `callHome.days ≤ daysRemaining`.
- Call home: days used rise by `callHome.days`, the last `stampPenalty` stamps are removed (fewer if there are fewer), money falls by `callHome.price` (€0 in content), position becomes home, and `calledHome` becomes `true`.
- End rules, in this order, after every successful action while `outcome` is `null`:
  1. Position is home → `goalReached` if stamps ≥ `goalStamps` and days used ≤ the total, else `goalNotReached`. `failReason` stays `null`.
  2. Call home is offered and does not fit → `failed`, `stranded`. This holds even if a city day is affordable.
  3. No available travel option, no available city day and call home not available (`checkCallHome` fails) → `failed`, `outOfDays`. Decision 2026-11-24 (review round 1, EC1): "not available" instead of "not offered", so a call home the player cannot pay never leaves them stuck.
- The goal follows FR-11 literally: a called-home player with 6 stamps keeps 5 and reaches the goal if the days fit.
- `callHome` is rejected, with state unchanged, in this order: `JOURNEY_ENDED`, `AT_HOME`, `CALL_HOME_NOT_OFFERED` (new `ReasonCode`), `NOT_ENOUGH_DAYS`, `NOT_ENOUGH_MONEY`.
- `callHomeStatus` and `apply(callHome())` use the same check (AD-3). The end rules use `checkTravel`, `checkCityDay` and the same call-home check.
- Pure functions: no mutation of inputs, no throws for player actions, and no imports outside `src/rules/` (AD-1, AD-4).

**Never:**
- No UI, copy, sheets or summary (Stories 3.2 and 3.3).
- No EXT work rules.
- No end evaluation outside `apply`, and no "end journey" action.
- Do not change the content files or the schema.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| UJ-2 call home | Real content. Rome, €20, 10 days used, stamps NY, Paris, London, Rome | Offered and fits. `callHome` gives home, 17 days, 3 stamps (Rome removed), €20, `calledHome`, `goalNotReached` | N/A |
| UJ-2 day 25 | Same path with 14 more days, so the Rome city day leaves €20 at 24 days used | That city day ends the journey `failed`/`stranded` with 4 stamps | N/A |
| No stamps | Offered, 0 stamps | `callHome` succeeds and stamps stay empty | N/A |
| Money equals the cheapest fare | money = cheapest price | Not offered | `callHome` → `CALL_HOME_NOT_OFFERED` |
| Out of days | Affordable routes but none fits, city day unaffordable or 0 days left | The action that leads here ends the journey `failed`/`outOfDays` | N/A |
| A city day still possible | Affordable route that does not fit, affordable city day | Journey continues | N/A |
| Ended | `outcome` set | Every action except `startJourney` | `JOURNEY_ENDED` |

</frozen-after-approval>

## Code Map

- `src/rules/types.ts` -- add `{ type: "callHome" }` to `Action`, `CALL_HOME_NOT_OFFERED` to `ReasonCode`, and a `CallHomeStatus` view. `Outcome`/`FailReason` and `GameState.calledHome` already exist.
- `src/rules/apply.ts` -- add the `callHome()` creator and switch case. Wrap every successful non-start result in `evaluateEnd`.
- `src/rules/travel.ts:111` -- `applyTravel` currently sets the home outcome itself. Move that to `end.ts` so there is one goal rule. `end.ts` imports `travel.ts`, so `travel.ts` must not import `end.ts` (this would be an import cycle, as in #38).
- `src/rules/cityDay.ts` -- reuse `checkCityDay(state, [], content)`. Update the "No end rule fires here" comment.
- `src/rules/days.ts` -- `daysRemaining`/`daysTotal`.
- `src/rules/queries.ts` -- add `callHomeStatus`, following `cityDayStatus`.
- `tests/rules/helpers.ts` -- `applyFrozen`, `started`, `smallContent`. The UJ-2 script uses the real `content/*.json` via `parseContent`, as `tests/content/content.test.ts` does.
- `tests/rules/travel.test.ts:379` -- the "arriving home" tests must still pass unchanged.
- Spine `ARCHITECTURE-SPINE.md` "Rules API" table -- the listing to extend.

## Tasks & Acceptance

**Execution:**
- [x] `src/rules/types.ts` -- the action, reason code and `CallHomeStatus { offered, fits, available, reason, days, stampsLost, price, daysUsedAfter }` -- the UI needs the cost before confirming (FR-12). `stampsLost` is 0 with no stamps (no-stamp copy).
- [x] `src/rules/callHome.ts` -- `checkCallHome` and `applyCallHome` -- the shared check (AD-3).
- [x] `src/rules/end.ts` -- `evaluateEnd(state, content): GameState`, with the three rules in order.
- [x] `src/rules/travel.ts` -- `applyTravel` only moves. The goal moves to `end.ts`.
- [x] `src/rules/apply.ts`, `src/rules/queries.ts` -- the creator, the case, `evaluateEnd`, and `callHomeStatus`.
- [x] `tests/rules/callHome.test.ts`, `tests/rules/end.test.ts` -- `describe` starting with FR-11/FR-12/FR-13. Cover every row of the matrix, the reject order, query–apply agreement, frozen inputs and the UJ-2 script.
- [x] `ARCHITECTURE-SPINE.md` -- add `callHome`, `callHomeStatus` and the new `ReasonCode` to the Rules API table and remove "not listed until". `src/ui/copy.ts` has no reason copy yet; the UI stories add it.

**Acceptance Criteria:**
- Given any successful action, when it leaves the player home or in an end condition, then `apply`'s result already has `outcome` set. No query or UI step is needed.
- Given the existing rules tests, when `npm test` runs, then they pass unchanged.

## Implementation Notes

- **One existing test changed (deviation from "pass unchanged").** `tests/rules/cityDay.test.ts` "allows the last day, and no end rule fires" asserted `outcome: null` after a city day that uses the last day at alpha. spec-2-1 recorded this as a known interim state "accepted until 3.1 adds the out-of-days ending". The frozen end rule 3 (out of days) requires `failed`/`outOfDays` there, so the two cannot both hold. The test was renamed and now asserts `failed`/`outOfDays`; the rest of the test is unchanged. Every other existing rules test, including the travel "arriving home" tests, passes unchanged.
- **UJ-2 day-25 path.** The scripted path reaches Rome at 23 days used with €90 (buses London → Paris → Rome, then three Rome ↔ Paris bus round trips), so the last Rome city day leaves €20 at 24 days used. It is 14 days longer than the 10-day path, but not the same actions plus 14 days, because €1500 does not pay for 14 extra days on top of the 10-day path.
- **Position check.** "At a destination" uses `destinationAt` (as `checkCityDay` does), so `AT_HOME` covers home and any id without a destination record.
- **`callHomeStatus.offered`** is `false` once `outcome` is set, so the UI never shows the offer after the end. The end rules use the raw position/money check, which only runs while `outcome` is `null`.
- **Rule 3 amended (review round 1, EC1):** the first version used "call home not offered", so an offered but unaffordable call home (price > money) could leave a player stuck. Rule 3 now uses `checkCallHome(state, content).ok`, with a test on a content copy where the price exceeds the money.
- **UJ-2 10-day path (orchestrator, after verification).** The subagent's 10-day script reached the right state (Rome, €20, 10 days, 4 stamps) by a different route (one New York city day with two sights, plane to London, two Rome city days). It was changed to the PRD's UJ-2 story: three New York city days, plane to Paris, train to London, plane to Rome, one Rome city day. That path costs exactly €1480, so the test now follows the acceptance script as written.

## Spec Change Log

2026-11-24 — review round 1, intent_gap EC1 resolved by the human ("Change rule 3"). Amended inside the frozen block: end rule 3 uses "call home not available" (`checkCallHome` fails) instead of "not offered". Known-bad state avoided: a player offered call home who cannot pay it, with no travel and no city day, would never be ended. Instead of reverting and re-deriving all code, the one-line rule change was sent with the patch findings to the same implementation subagent, because the rest of the code is unaffected by the amendment. KEEP: `evaluateEnd` as the only place an outcome is set, the shared checks, the `travel.ts` → no `end.ts` import rule, and the UJ-2 script as the PRD tells it.


## Review Triage Log

Review round 1 (2026-11-24), three layers: blind hunter (BH), edge case hunter (EC), verification gap (VG). Verdicts by Claude (orchestrator) after checking each claim in the code.

| # | Finding | Verdict | Route | Evidence |
|---|---|---|---|---|
| EC1 + EC2 | Call home offered and fits but `callHome.price > money`: no end rule fires, `callHome` is rejected, the player is stuck | low | intent_gap → resolved | Real: `end.ts` rule 3 requires `!offered`, and the schema allows `price` ≥ 0 (`schema.ts:85`). Not reachable with content (€0). The human chose "Change rule 3": frozen rule 3 now says "not available". |
| EC3 + BH1 | Comments say the end rules use `checkCallHome`; `end.ts` uses `callHomeOffered`/`callHomeFits` | low | patch | True: `callHome.ts:1-3` versus `end.ts` imports. Comment fix, or settled by the EC1 decision. |
| EC4 | AC "existing tests pass unchanged" while one cityDay test changed | low | reject | Recorded in Implementation Notes; the only fix is editing this spec. |
| VG1 | `anyTravelAvailable` untested: mutations M1/M2 survive all 349 tests | medium | patch | Pre-verified by the layer (mutation run). Add "continues while an affordable route still fits", including the `between[1]` direction. |
| BH2 | Same as EC1 | low | intent_gap | Grouped with EC1. |
| BH3 | No "journey ended" query, as the epic context suggested | low | patch | The UI already reads `GameState` fields; harm is that the spine table does not say `outcome`/`failReason`/`calledHome` are read from state. Add one line to the spine. |
| BH4 | `CALL_HOME_NOT_OFFERED` has no copy | low | defer | Pre-existing: no `ReasonCode` has copy in `copy.ts` yet; the UI stories add reason copy. |
| BH5 | Sprint status `in-progress` versus spec `in-review` | false | reject | The workflow syncs sprint status when the story reaches review/done (step 5). |
| BH6 | Spec not in the diff; process sections empty | false | reject | By design: the spec goes to the edge-case layer only, and the logs are filled during triage. |
| BH7 | Nothing guards against the import cycle (#38) | low | reject | Unlikely in daily work, and the fix adds a lint rule (more than a direct correction). |
| BH8 | Agreement grid: does not assert `offered`/`fits` against the reason, uses `apply` not `applyFrozen`, fixture stamp ids on real content | low | patch | True at `callHome.test.ts` grid; small test-only fixes. |
| BH9 | Missing edge tests: no-routes destination that does not fit, `stampPenalty: 0`, stranded by travel, home-versus-fail priority | low | patch (no-routes stranded only) | No-routes stranded is a direct test. The others are unreachable with content or already implied by rule order; rejected as low. |
| BH10 | `stateWith` duplicated in two test files | low | patch | Identical helper; move to `tests/rules/helpers.ts`. |
| BH11 | Doc nits: `withEnd` doc, `fits` meaningless at home, epic context "money unchanged", spec says `parseContent` | low | patch (code comments only) | The two code comments are direct fixes. Epic context is equal at €0 (reject); the spec nit edits this spec (reject). |

## Verification

**Commands:**
- `npm test` -- expected: all pass, including the new FR-11/12/13 tests
- `npm run lint` -- expected: no warnings
- `npm run build` -- expected: success
