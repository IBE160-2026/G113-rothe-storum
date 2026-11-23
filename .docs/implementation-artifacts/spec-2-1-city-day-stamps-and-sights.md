---
title: 'Story 2.1 — City day, stamps and sights (rules)'
type: 'feature'
created: '2026-11-23'
status: 'ready-for-dev'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/.docs/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** A journey can move but never stay. There is no `spendCityDay` action, no accommodation price and no sight data, so no stamp can be earned and "goal reached" is unreachable (FR-8, FR-9, FR-10, FR-21, FR-22, AD-5, AD-6, Decisions F and G).

**Approach:** Add `accommodationPrice()` in `src/rules/money.ts`, a shared `checkCityDay()` and `applySpendCityDay()` in `src/rules/cityDay.ts`, the `spendCityDay` action in `apply()`, and city-day queries in `src/rules/queries.ts`. Query and `apply` share one check (AD-3).

## Boundaries & Constraints

**Always:**
- The 1.3/1.4 `apply` contract holds: returns `Result`, never mutates inputs, never throws for a player action; a rejection leaves state unchanged.
- `accommodationPrice(base, costFactor)` is the only place a cost factor is multiplied: `f = Math.round(costFactor * 100)`, `n = base * f * 100`, price `Math.floor((n + 5000) / 10000)` (AD-5). Never round a float product.
- Check order, first failure wins: `NO_JOURNEY` (apply only) → `JOURNEY_ENDED` → `AT_HOME` → `NOT_ENOUGH_MONEY` (money < stay) → `NOT_ENOUGH_DAYS` (0 days remaining) → `INVALID_SIGHTS` (`sightIds` not an array of strings, id unknown, not at this destination, repeated, or more than 2) → `ALREADY_IN_ALBUM` → `NOT_ENOUGH_MONEY` (sights in given order, each from the money left). Money equal to the cost is allowed.
- A valid city day, as one result: money −stay −Σ sight prices; `daysUsed` +1; `cityDays[position]` +1; if `cityDays[position]` was 0, append stamp `{ id: position, day: newDaysUsed }`; append `{ id: sightId, day: newDaysUsed }` to `album` for each sight in order. `position`, `calledHome`, `outcome`, `failReason` unchanged. No end rule fires (out-of-days is 3.1).

**Decisions (user, 2026-11-23):**
- Q1 = A: 2.1 adds a minimal `content/sights.json` (`id`, `destId`, `name`, `price`) with the 16 names and prices from PRD addendum §3, a zod schema (kebab id, known non-home `destId`, whole euros 8–20, no duplicate ids) and loader wiring. 2.2 adds `fact`, `image`, `imageAlt`, `source`, `author`, `licence` and the "exactly 2 per destination" rule. Rationale: the rules need `id`, `destId` and `price` to be testable, while the content quality process (fact-check and licences) belongs to 2.2 (rationale confirmed by the user 2026-11-23).
- Q2 = A: queries are `cityDayStatus(state, content)` (available, reason, stay price) and `cityDayPlan(state, sightIds, content)` (stay, total, money after, whole-draft check, and per sight of this destination: in album, selected, available, reason, `moneyLeft`). "Money's tight" is deferred to 2.4. Rationale: 2.3 (Arrival) needs status without a draft, while 2.4 (City day) needs the whole plan (rationale confirmed by the user 2026-11-23).
- Size: the spec is kept whole (about 2,500 words, ≈ 3,400 tokens), because action, queries and price share one check.

**Never:** "Money's tight" query and copy (2.4, which adds it to `src/rules/queries.ts`); the `ending` field, tiers or night departures (EXT); call home and out-of-days endings (3.1); fact cards, images, licences or the 8×2 count rule (2.2); any UI (2.3–2.5); prices hard-coded outside content.

## I/O & Edge-Case Matrix

Fixture `valid-small` + sights: alpha (factor 1.0, stay €50) has `alpha-one` €10 and `alpha-two` €15; beta-town (1.5, €75) has `beta-town-one` €8 and `beta-town-two` €12, so the fixture already meets the 2-per-destination rule that 2.2 adds.

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Paris (real) | Paris, €300, first city day, `[]` | money 220, `daysUsed` +1, stamp `paris` | N/A |
| First visit, no key | alpha, `cityDays` has no `alpha` key, `[]` | `cityDays.alpha` 1, stamp `alpha` (missing key counts as 0) | N/A |
| Stay exact fit | alpha, €50, `[]` | ok, money 0 | N/A |
| Last day | alpha, 1 day remaining, `[]` | ok, `daysUsed` = total, `outcome` stays `null` | N/A |
| Repeat | second city day at alpha | `cityDays.alpha` 2, no new stamp | N/A |
| Sights | alpha, €100, `[alpha-one, alpha-two]` | money 25, album gains both in order | N/A |
| Exact fit | alpha, €75, both sights | ok, money 0 | N/A |
| Sight too dear | alpha, €70, both sights | `NOT_ENOUGH_MONEY` | state unchanged |
| In album | `alpha-one` already in album, chosen again | `ALREADY_IN_ALBUM` | state unchanged |
| Invalid | `beta-town-one` at alpha; `[alpha-one, alpha-one]`; 3 ids | `INVALID_SIGHTS` | state unchanged |
| Bad type | `sightIds` is `undefined`, a string, or `[42]` (cast past the type) | `INVALID_SIGHTS`, never throws | state unchanged |
| No money / days | money < stay; 0 days left; both | `NOT_ENOUGH_MONEY`; `NOT_ENOUGH_DAYS`; `NOT_ENOUGH_MONEY` | state unchanged |
| Home / ended | position `home`; `outcome` set | `AT_HOME`; `JOURNEY_ENDED` | state unchanged |
| Rounding | `accommodationPrice(50, 1.01)`, `(25, 1.5)`, `(50, 1.7)` | 51, 38, 85 | N/A |

</frozen-after-approval>

## Code Map

- `src/rules/types.ts` -- add `{ type: "spendCityDay"; sightIds: string[] }` to `Action`; `AT_HOME`, `ALREADY_IN_ALBUM`, `INVALID_SIGHTS` to `ReasonCode`; `Sight` and `Content.sights`; the query result types. Keep no imports.
- `src/rules/money.ts` -- new: `accommodationPrice()`.
- `src/rules/cityDay.ts` -- new: `checkCityDay()`, `applySpendCityDay()`. Follow `travel.ts` (`TravelCheck` pattern, doc comments).
- `src/rules/apply.ts` -- `case "spendCityDay"` and action creator `spendCityDay({ sightIds })`; the existing `NO_JOURNEY`/`JOURNEY_ENDED` guard already runs first.
- `src/rules/queries.ts` -- `cityDayStatus`, `cityDayPlan`, built on `checkCityDay`. Reuse `daysRemaining()`.
- `src/content/schema.ts`, `src/content/load.ts`, `content/sights.json` -- sight schema in its own per-file schema plus a gated cross-file check for `destId`; add `sights` to `RawContent`/`CONTENT_FILES`. Follow the per-file schema + gated `superRefine` pattern; every gated file must be `safeParse`d in its `when`.
- `tests/fixtures/content/*.json` -- add sights to `valid-small.json` and a valid `sights` key to every broken fixture, so each still fails for its one reason.
- `tests/rules/helpers.ts` -- reuse `smallContent`, `applyFrozen`, `started`, `deepFreeze`.
- `src/rules/travel.ts` -- read only; arriving home already evaluates the goal from `stamps`.

## Tasks & Acceptance

**Execution:**
- [ ] `src/rules/types.ts` -- types and reason codes above -- closed unions (AD-2, AD-4)
- [ ] `src/rules/money.ts` -- `accommodationPrice` -- AD-5
- [ ] `src/rules/cityDay.ts` -- check + apply in the fixed order -- AD-6
- [ ] `src/rules/apply.ts` -- dispatch + action creator -- single mutation path
- [ ] `src/rules/queries.ts` -- city-day queries -- AD-3
- [ ] `content/sights.json`, `src/content/schema.ts`, `src/content/load.ts`, fixtures -- minimal sight content (Q1 = A)
- [ ] `tests/rules/money.test.ts`, `tests/rules/cityDay.test.ts` -- `describe` names start with FR ids; every `spendCityDay` test runs through `applyFrozen`:
  - every matrix row;
  - a query-and-apply agreement grid as in `travel.test.ts`, over both `valid-small` and the real content: every position including home × money (0, stay − 1, stay, stay + cheapest sight, stay + both sights, 1500) × `daysUsed` total − 1 and total × `outcome` null and `goalNotReached` × album empty and holding one sight of the position × `sightIds` `[]`, one, both, foreign, repeated, three ids and a bad type (at home only money 0 and 1500 and an empty album, since home has no stay or sights); in every cell, when the draft is valid and the city day is available, `ok` is true if and only if every selected sight is `available` (kept as a safety net even though per-sight availability uses the same check);
  - a journey test where 2 city days + home in the fixture gives `goalReached`.
- [ ] `tests/content/content.test.ts` -- sight schema cases: real file valid, unknown/home `destId`, price boundaries (7 and 21 fail, 8 and 20 pass), non-whole price (8.5) fails, duplicate id, `sights` missing or `null` gives a ContentError naming `sights.json` (not a TypeError)

**Acceptance Criteria:**
- Given every state and draft in the agreement grid (see Tasks), when the city-day queries and `apply` run, then `cityDayStatus`'s `available`/`reason` equal the result of `apply(spendCityDay({ sightIds: [] }))`, and `cityDayPlan`'s `ok`/`reason` equal the result of `apply(spendCityDay({ sightIds }))`.
- Given the fixture (goal 2 stamps), when the player spends a city day at alpha and beta-town and travels home in time, then `outcome` is `goalReached`.

## Implementation Notes

- Known interim state: a city day may use the last day away from home. The state then has `daysUsed` = total and `outcome: null`, and travel is rejected with `NOT_ENOUGH_DAYS`. This is accepted until 3.1 adds the out-of-days ending.
- The "more than 2" part of `INVALID_SIGHTS` counts every id, including sights already in the album. PRD §4.5 says album sights do not count toward the 0–2 limit, but they are rejected anyway. With exactly 2 sights per destination, 3 ids always contain a repeat or a foreign id, so the outcome is the same.

- `queries.ts` and `travel.ts` already import each other (`checkTravel` / `daysRemaining`), and `cityDay.ts` adds a second cycle. Follow the `travel.ts` pattern: only function declarations, and no top-level code that calls an import. Breaking the cycle (e.g. moving `daysTotal`/`daysRemaining` to a leaf module) is out of scope for 2.1.

**Notes for later stories (not 2.1 work):**

- 2.4 adds the city-day home-unreachable warning (PRD Decision M, #39), e.g. `homeUnreachableAfter(state, state.position, 1, content)` next to "Money's tight". 2.1 adds no such flag.
- 2.2 makes `fact`, `image`, `imageAlt`, `source`, `author` and `licence` required, so it must add them to the sights in all 7 content fixtures (`valid-small` and the 6 broken ones). Count this in 2.2's estimate.
- 3.1's out-of-days rule (FR-13: "no affordable city day") must reuse `checkCityDay`/`cityDayStatus`, not a check of its own, so the ending and the City day screen never disagree.

## Spec Change Log

2026-11-23 — seven advanced-elicitation rounds (E1–E7), every proposal approved by the user before it was applied; full detail per round in `.logs/albion812/976-2026-11-23-16-47-43-elicitation-spec-2-1.md`. Open points: #38, #39, #40.

- E1 (edge cases, pre-mortem, assumptions): matrix rows for stay exact fit, last day and missing `cityDays` key; `beta-town-two` in the fixture; 2.4 owns "Money's tight". E1-P9 (sight id prefix) rejected.
- E2 (failure modes, Socratic, chaos): `INVALID_SIGHTS` covers a bad-type `sightIds`; agreement grid; `applyFrozen`; missing/null `sights` test. Rejected: a guard for an invalid position.
- E3 (second-order, critique): per-sight `moneyLeft` (money − stay − other selected sights) instead of money after stay, matching EXPERIENCE.md.
- E4 (explain reasoning): check-order rationale with sources; rationale for Q1 = A and Q2 = A added in Claude's reading, confirmed by the user.
- E5 (audience): Design Notes regrouped with a query result-shape block; notes for later stories separated; this log compressed.
- E6 (red team): `cityDayStatus` = `checkCityDay(state, [])`; exact `apply` calls in the acceptance criterion; distinct ids in Σ; grid home cells and per-sight/`ok` invariant.
- E7 (ADRs): per-sight availability uses `checkCityDay` (AD-3); deviation from AD-6 `ending` documented; import-cycle note. Deferred to Epic 7: tier multiplier on `accommodationPrice`.

Frozen-section changes (all approved): the matrix rows and fixture above, the `INVALID_SIGHTS` definition, the "Never" line, the `moneyLeft` field in Q2 = A, the Q1/Q2 rationale and the size note.

2026-11-23 — #40 resolved by the user: sight ids keep the `{destId}-` prefix (AD-7) and image files are named `{sightId}.webp|svg` (EXPERIENCE.md and epic context updated). Design Notes → Content states the id format. No change to the frozen section.

2026-11-23 — #39 resolved by the user: the city-day home-unreachable warning goes into 2.4 (PRD Decision M). Only a note under "Notes for later stories"; no change to 2.1's scope or the frozen section.

## Review Triage Log

## Design Notes

**Check order**

Check order rationale: money before days is the same order as `checkTravel`, so the UI ranks reasons the same way for travel and city days; the stay is checked before the sights because the PRD fixes the order (1) stay, (2) sights from the money left; `cityDays`, not `stamps`, drives the first visit (epic context → Technical Decisions → State). `INVALID_SIGHTS` comes before `ALREADY_IN_ALBUM` so the draft's shape is checked before the player's state, and a repeated album id always gives one stable code (Claude's technical recommendation, accepted by the user 2026-11-23).

**Queries**

Query result shapes (the contract for 2.3 and 2.4):

```ts
cityDayStatus → { available: boolean; reason: ReasonCode | null; stayPrice: number | null }
cityDayPlan   → { ok: boolean; reason: ReasonCode | null;
                  stay: number | null; total: number | null; moneyAfter: number | null;
                  sights: { id: string; inAlbum: boolean; selected: boolean;
                            available: boolean; reason: ReasonCode | null;
                            moneyLeft: number }[] }
```

The `null` values occur only at home. `moneyLeft` is always computed the same way, also when the city day is unavailable, and may be negative; the UI shows it only with `NOT_ENOUGH_MONEY`.

`cityDayStatus` is `checkCityDay(state, [])` plus `stayPrice`. `cityDayStatus.stayPrice` is `null` at home (home has no cost factor) and otherwise the stay price, also when the city day is unavailable, so the player sees what it would cost. `cityDayPlan` at home gives `sights: []` and `stay`, `total` and `moneyAfter` as `null`.

Σ(other selected sights) counts only selected sights of this destination that are not in the album, each distinct id once (`[alpha-one, alpha-one]` counts `alpha-one` once in Σ, `total` and `moneyLeft`). When `sightIds` is not an array of strings, `cityDayPlan` treats every sight as `selected: false` and the whole draft is `ok: false`, `INVALID_SIGHTS`; the plan never throws. Unknown or foreign ids add nothing to Σ; they only make the whole-draft `reason` `INVALID_SIGHTS`.

`total` = stay + Σ prices of the valid selected sights (the set defined above). `moneyAfter` = `money − total`; it is negative only when `ok` is false, and no state ever goes below €0. The per-sight list follows content order.

`cityDayPlan` per-sight rule (AD-3: the same check as `apply`): a sight is `available` when `checkCityDay(state, [...otherValidSelected, sight])` is ok, and otherwise its `reason` is that check's code, where `otherValidSelected` is the Σ set without this sight. So a sight in the album gets `ALREADY_IN_ALBUM`, an unaffordable one `NOT_ENOUGH_MONEY`, and when the city day itself is unavailable every sight carries that same reason. `moneyLeft` = `money − stay − Σ(other selected sights)` is for copy only: it fills `{moneyAfterStay}` in `cityday.sightUnavailable` ("you'd have €N"), because EXPERIENCE.md measures money after "from the selected end-of-day cost"; it never decides availability. Example: alpha, €70, `alpha-one` (€10) selected → `alpha-two` (€15) has `moneyLeft` 10 and `NOT_ENOUGH_MONEY`; `alpha-one` has `moneyLeft` 20 and is available. The whole-draft `ok`/`reason` is `checkCityDay(state, sightIds)`, so "End the day" is enabled exactly when `apply` would accept.

**Apply semantics**

Deviation from AD-6: AD-6 writes `spendCityDay({ sightIds, ending })`. Core leaves `ending` out, because it only exists for [EXT] tiers and night departures; Epic 7 adds it as an optional field, so the closed `Action` union stays exhaustive. The architecture spine needs no change.

Paying sights "in given order, each from the money left" is equivalent to Σ sight prices ≤ money − stay, because every price is positive. The order only decides the order of the new album entries, and the tests assert that order.

A stamp's and album entry's `day` is the day the city day was spent: before it the label is "Day N" with N = `daysUsed + 1`, and after it `daysUsed` = N, so `day` = N (spine Conventions → Days). One test pins this, e.g. after a 1-day flight from home the first city day gives `day: 2`.

**Content**

Sight names and prices come from PRD addendum §3, where every value is an `[ASSUMPTION]` to be confirmed by the balance test (SM-3). They live only in `content/sights.json`, so a balance change needs no code change.

Sight ids follow AD-7: `{destId}-{slug}` in lowercase kebab, e.g. `copenhagen-tivoli` and `paris-louvre`, so they are unique across destinations (the album stores only the sight id). The schema does not enforce the prefix (E1-P9 rejected). Image files are named after the sight id alone, `assets/sights/{sightId}.webp|svg` (#40, decided by the user 2026-11-23).

## Verification

**Commands:**
- `npm test` -- expected: all pass, including existing 1.3/1.4 tests
- `npm run lint` -- expected: exit 0
- `npm run build` -- expected: no type errors
