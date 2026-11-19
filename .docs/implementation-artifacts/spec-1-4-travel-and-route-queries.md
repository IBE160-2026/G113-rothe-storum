---
title: 'Story 1.4 — Travel and route queries'
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

**Problem:** A started journey cannot move. There is no `travel` action and no query telling the UI which routes exist, what they cost and why an option is unavailable, so Stories 1.6 and 1.7 have nothing to show (FR-4, FR-6, FR-7, FR-9).

**Approach:** Add `travel` to the closed `Action` union and `apply()`, and add `routesFrom(state, content)` in `src/rules/queries.ts`. A shared check function in `src/rules/travel.ts` serves both, so query and `apply` can never disagree (AD-3). Arriving home ends the journey.

## Boundaries & Constraints

**Always:**
- `apply` keeps the 1.3 contract: it returns `Result`, never mutates `state` or `content`, and never throws for a player action. A rejected action leaves state unchanged (AD-2, AD-4).
- A route works in both directions. "Days remaining" = `totalDays − daysUsed`, with `totalDays` derived from content as in 1.3.
- The check order is fixed, and the first failure is the reason:
  1. `NO_JOURNEY` (state `null`, `apply` only)
  2. `JOURNEY_ENDED` (`outcome !== null`)
  3. `NO_ROUTE` (no route between `position` and `to`, or `mode` not on it)
  4. `NOT_ENOUGH_MONEY` (`price > money`)
  5. `NOT_ENOUGH_DAYS` (`days > daysRemaining`)

  Price equal to money, or days equal to days remaining, is allowed.
- Every action except `startJourney` is rejected with `JOURNEY_ENDED` once `outcome` is set (AD-2).
- Home-unreachable warning: after the option, at `to`, the shortest route home in days (sum of each route's fewest days, ignoring money) is greater than the days remaining after travel. No path home counts as unreachable. The warning never blocks; for `to = home` it is always false.
- Valid travel: money falls by exactly the price, `daysUsed` rises by exactly the days, and `position` becomes `to`. `stamps`, `album`, `cityDays` and `calledHome` are unchanged.
- Arriving home sets `outcome` from the goal: `goalReached` if `stamps.length >= content.config.goalStamps` and `daysUsed <= daysTotal`, otherwise `goalNotReached`; `failReason: null`.

**Decisions (user, 2026-11-19):**
- Q1 = A: arriving home evaluates the goal now (FR-11); `Outcome` gets no new value. Until 2.1 adds stamps the result is always `goalNotReached`. This deviates from the epics wording "recorded as ended at home"; record it in Implementation Notes.
- Size: the spec is kept whole (about 2,000 tokens), because query and travel share one check.

**Never:** city days or stamps (2.1); call home, out-of-days and stranded endings (3.1); the travel-home confirmation and any UI (1.6, 1.7); hard-coded places or prices.

## I/O & Edge-Case Matrix

Fixture `valid-small`: home–alpha (plane €100/1, bus €40/2), alpha–beta-town (train €80/1); start €500, 10 days.

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Routes (real) | Copenhagen, €500, 10 days used | home ×3 modes, paris ×3, london, istanbul; each with price, days, `arrivalDay`; all available; no warnings | N/A |
| Routes (fixture) | at alpha | home (plane, bus), beta-town (train), in content order | N/A |
| Travel | home → alpha by bus | money 460, `daysUsed` 2, position `alpha`, outcome `null` | N/A |
| Exact fit | money = price, or days = days remaining | ok | N/A |
| Too expensive | price > money | query: unavailable `NOT_ENOUGH_MONEY`; apply: rejected | state unchanged |
| Too long | days > days remaining | `NOT_ENOUGH_DAYS` in both | state unchanged |
| Both fail | price and days too high | `NOT_ENOUGH_MONEY` | state unchanged |
| No route | home → beta-town, or alpha → home by train | `NO_ROUTE` | state unchanged |
| Warning | alpha, 8 days used → beta-town | available; `homeUnreachable` true (home needs 2 days, 1 left) | N/A |
| No warning | alpha, 8 days used → home by plane | available; `homeUnreachable` false | N/A |
| Home | alpha → home, 0 stamps | position `home`; `goalNotReached`; `failReason` `null` | N/A |
| Goal | arrives home with stamps ≥ `goalStamps` (stamps set in the test state) | `goalReached` | N/A |
| After end | ended journey, `travel` | `JOURNEY_ENDED`; query rows all `JOURNEY_ENDED`; `startJourney` still ok | state unchanged |
| No journey | `apply(null, travel)` | `NO_JOURNEY` | N/A |

</frozen-after-approval>

## Code Map

- `src/rules/types.ts` -- add the `travel` action, `ReasonCode` members, and `TravelOption`/`RouteView` (Design Notes). Keep no imports.
- `src/rules/travel.ts` -- new: `checkTravel()` (the shared check), `shortestDaysHome()`, `applyTravel()`.
- `src/rules/queries.ts` -- new: `routesFrom()`, `daysRemaining()`; move `daysTotal()` here from `journey.ts` (1.3 Implementation Notes).
- `src/rules/apply.ts` -- add `case "travel"`, the `NO_JOURNEY`/`JOURNEY_ENDED` guard, an exhaustive `never` default, and the action creator `travel({ to, mode })`. Remove `void state`.
- `src/rules/journey.ts` -- `daysTotal` moves out; nothing else changes.
- `tests/rules/startJourney.test.ts` -- reuse `fixture()`, `deepFreeze` and `applyFrozen`; update the `daysTotal` import.
- `content/routes.json` -- read only; Copenhagen has 4 routes (home, paris, london, istanbul).

## Tasks & Acceptance

**Execution:**
- [ ] `src/rules/types.ts` -- action, reason codes, query types -- AD-2, AD-4
- [ ] `src/rules/travel.ts`, `src/rules/queries.ts`, `src/rules/journey.ts` -- shared check, shortest path, travel, query; move `daysTotal` -- FR-4, FR-6, FR-9, AD-3
- [ ] `src/rules/apply.ts` -- dispatch, guards, action creator -- FR-6, FR-7, AD-2
- [ ] `tests/rules/travel.test.ts` -- `describe('FR-4 FR-6 FR-7 FR-9 travel')`; every matrix row; frozen inputs compared with `structuredClone`; for every option, `routesFrom` reason equals the `apply` result -- AC proof

**Acceptance Criteria:**
- Given any state and any route option, when `routesFrom` and `apply(travel)` both run, then the query's `reason` and the apply rejection reason are identical, and an available option is accepted by `apply`.
- Given the change, when `npm test`, `npm run lint` and `npm run build` run, then all exit 0.

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Design Notes

```ts
type Action =
  | { type: "startJourney"; name: string; mode?: JourneyMode }
  | { type: "travel"; to: PlaceId; mode: TransportMode };
type ReasonCode = "UNKNOWN_MODE" | "NO_JOURNEY" | "JOURNEY_ENDED" | "NO_ROUTE"
  | "NOT_ENOUGH_MONEY" | "NOT_ENOUGH_DAYS";
interface TravelOption { mode: TransportMode; price: number; days: number;
  arrivalDay: number;               // daysUsed + days
  available: boolean; reason: ReasonCode | null; homeUnreachable: boolean }
interface RouteView { to: PlaceId; options: TravelOption[] }
// routesFrom(state: GameState, content: Content): RouteView[]
```

The graph has 9 places, so a simple Dijkstra (or Bellman-Ford) over the fewest days per route is enough; no memoisation is needed. The query uses `checkTravel` with `to` and `mode` from content, so `NO_ROUTE` can occur only through `apply`.

## Verification

**Commands:**
- `npm test` -- expected: all pass, including the new travel tests and the existing 1.3 tests
- `npm run lint` -- expected: exit 0
- `npm run build` -- expected: no type errors
