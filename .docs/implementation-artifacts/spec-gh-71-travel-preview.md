---
title: 'travelPreview() query for Story 1.7 (#71)'
type: 'feature'
created: '2026-11-27'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/.docs/planning-artifacts/architecture/architecture-worldbound-nomad-2026-11-13/ARCHITECTURE-SPINE.md'
  - '{project-root}/.docs/planning-artifacts/sprint-change-proposal-2026-11-25.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Story 1.7 (PR #73, Thomas) must show, before the player confirms a trip, the money and days after it and whether the goal will be reached (FR-6, FR-7; EXPERIENCE `home`, DESIGN → Travel home sheet). The UI may not compute rules itself (AD-3), and no query answers this today, so PR #73 is a draft that waits on #71.

**Approach:** A new read-only query, `travelPreview(state, to, mode, content): TravelPreview` in `src/rules/queries.ts`, with the signature agreed in PR #70 (Thomas proposed it, Christian Storum accepted it): `{ ok, reason, moneyAfter, daysUsedAfter, stampsAfter, outcome, failReason }`. Decisions approved by Christian Storum (CSE) on 2026-11-27:

- **Implementation:** the query runs `apply(state, travel({ to, mode }), content)` and reads the result, instead of calling `applyTravel` and `evaluateEnd` separately as issue #71 says. The result is the same as `applyTravel` + `evaluateEnd` (both reject an ended journey with `JOURNEY_ENDED`, through `checkTravel`). `apply` is used so the query and `apply` share one path and cannot drift apart if `apply` changes (AD-3). This deviation is stated in the PR. *(Corrected 2026-11-27 with CSE approval: the first version wrongly said that only `apply` covers `JOURNEY_ENDED`.)*
- **Rejected trip** (`ok: false`): `moneyAfter`, `daysUsedAfter` and `stampsAfter` are the current values, unchanged, and `outcome` and `failReason` are `null`, since the trip does not happen. The agreed fields are `number`, not nullable.
- `stampsAfter` is the stamp count of the resulting state. Travel never changes stamps, so it always equals today's count. The field is kept for the Travel home sheet.
- Tests live in `tests/rules/travel.test.ts`. `ARCHITECTURE-SPINE.md` gets a queries-table row, and `fr-test-map.md` gets FR-7 rules rows with a matching `EXPECTED_ROWS` change. Moving the flagged FR-7 UI row is left to PR #73.
- Branch `gh-71-travel-preview`. PR with `Closes #71`, reviewed by Thomas.

</frozen-after-approval>

## Implementation Notes

- `src/rules/types.ts`: new `TravelPreview` interface, next to `TravelOption`.
- `src/rules/queries.ts`: `travelPreview()` runs `apply(state, travel({ to, mode }), content)` and maps the `Result`. `queries.ts` now imports `apply.ts`. There is no cycle: `apply.ts` and the modules it imports never import `queries.ts`, and `end.ts` keeps its rule that `travel.ts`, `cityDay.ts` and `callHome.ts` must not import it (#38).
- `tests/rules/travel.test.ts`: new `describe("travel preview (#71, AD-3)")` with frozen inputs:
  - a trip that goes on (money, days and stamps after; no outcome)
  - a trip home with enough stamps (`goalReached`) and one stamp short (`goalNotReached`)
  - four rejected trips (`NOT_ENOUGH_MONEY`, `NOT_ENOUGH_DAYS`, `NO_ROUTE`, `JOURNEY_ENDED`), with unchanged values and no outcome
  - an agreement test over more than 10,000 trips on the small and real content, against `apply` and `routesFrom`. It also asserts that the cases reach every outcome (`null`, `goalReached`, `goalNotReached`, `failed/outOfDays`, `failed/stranded`) and every travel reason code, so agreement is not tested only on journeys that go on.
- Mutation check, run by hand in this session (sed edit of `src/rules/queries.ts`, `npx vitest run tests/rules/travel.test.ts`, then restored from a backup). Recorded in the session log `.logs/albion812/`:
  - With `outcome: null` always, 3 tests fail.
  - With `stampsAfter: 0` for rejected trips, 5 tests fail.
- `.docs/test-report/fr-test-map.md`: 1 FR-6 row and 3 FR-7 rows (rules part). `EXPECTED_ROWS` FR-6 went from 4 to 5 and FR-7 from 2 to 5. The flagged FR-7 UI row stays for PR #73 to move. PR #73 also changes the FR-7 count, so whichever merges second resolves that line.
- `ARCHITECTURE-SPINE.md`: `travelPreview` row in the public-API queries table.
- Verified: `npm test` 23 files, 413/413. `npm run lint` and `npm run build` pass with no errors.
- After review: the "goes on" test uses literal values from `valid-small.json` (€40, 2 days). The coverage check is an exact set. The agreement loop also checks `stampsAfter` against the input and `outcome: null` for rejected trips, independently of the mapping. A dated note in `sprint-change-proposal-2026-11-25.md` explains that Story 1.7 is still not affected, because the query runs `apply`, which runs `evaluateEnd`.

## Review Triage Log

Blind Hunter, one pass (12 findings; floor N = 5 from about 21 kB):

| # | Finding | Verdict | Route | Evidence / action |
|---|---|---|---|---|
| 1 | The agreement test builds its expected value with the same mapping as the code | low | patch | True for the loop, which tests AD-3 agreement with `apply`. Added independent checks (`stampsAfter` equals the input count, a rejected trip has no outcome). The named tests already use literal outcomes. |
| 2 | The coverage check (`arrayContaining`) lets invalid outcome/reason pairs through | low | patch | Now an exact set of 9 pairs. It passes. |
| 3 | Failed outcomes have no named test or FR-11/FR-13 row | low | reject | The end rules are traced through `apply` in `end.test.ts`. The preview reaches `failed/outOfDays` and `failed/stranded` only through `apply`, and the exact coverage set asserts both. A hand-built example would add fixture work for little gain. |
| 4 | Rejected previews have no FR map row | low | reject | "Rejected, state unchanged" is already traced for `apply` (FR-6, FR-9). The preview adds no new consequence, and the test exists. |
| 5 | The "goes on" test takes its expected values from `routesFrom` | low | patch | Now uses literal values: €460 and day 4. |
| 6 | Spec front matter: `in-progress` status, empty `context` | low / false | patch / reject | `status` is set to `done` during Finalize by the workflow, so that part is false. `context` now lists the spine and the sprint change proposal. |
| 7 | The sprint change proposal names `evaluateEnd()` as the mechanism | low | patch | Dated note added. The conclusion is unchanged. |
| 8 | The mutation check cannot be verified | low | patch | It was run in this session. The note now says how, and the session log records it. |
| 9 | Story 1.7 docs (epics, sprint-status) do not mention `travelPreview` | false | reject | `spec-1-7` on PR #73 already names `travelPreview()` (#71) as its dependency, and `sprint-status` is about status, not dependencies. |
| 10 | `TravelPreview` should be a union on `ok`; `JOURNEY_ENDED` preview | false | reject | The flat signature was agreed with Thomas in PR #70, and `routesFrom`/`TravelOption` use the same flat style. `JOURNEY_ENDED` has its own test. |
| 11 | `previewFrozen` does not freeze `content` | false | reject | `smallContent()` returns `deepFreeze(...)` (`tests/rules/helpers.ts:25`), and the real content is frozen in the loop. |
| 12 | Each preview runs the full `apply` | low | reject | The graph is small. `routesFrom` already runs `homeUnreachableAfter` (Dijkstra) for every option. No measured problem. |

