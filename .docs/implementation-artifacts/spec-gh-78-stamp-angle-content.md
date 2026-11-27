---
title: 'stampAngle in content data and schema (#78, part 1)'
type: 'feature'
created: '2026-11-27'
status: 'done'
baseline_commit: 'b571375a9465d95437b8be513db72e36ef4acd0d'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** DESIGN.md → Stamp says every destination has a fixed stamp angle from content data (`stampAngle`, −12° to +9°), so the same stamp always renders the same (NFR-1), and EXPERIENCE.md lists `stampAngle` per destination. `content/destinations.json`, the zod schema and the `Destination` type have no such field, so `Stamp` (PR #80) draws every stamp at 0° (D3 in the Story 3.3 spec).

**Approach:** Add a required `stampAngle` (whole degrees, −12 to +9) to every destination in `content/destinations.json`, to `destinationSchema` (AD-7) and to the `Destination` type, with tests for the real values and for rejected values. Part 1 of #78 only: built from `main`, with no dependency on any open PR.

## Boundaries & Constraints

**Decision (Christian, 2026-11-27, option B):** one distinct angle per destination, using the full range: CPH −10, PAR +7, LON −8, ROM −3, IST +4, NYC −12, TYO +9, SYD −6. CPH, PAR and LON match `screens-final.html`; ROM, NYC and TYO deliberately differ from the mockups so no two stamps share an angle. The −12° CPH and +8° LON variants in older mockups conflict with DESIGN (one angle per destination) and are not followed.

**Always:** The field is required for every destination (strict schema, like `costFactor`). Values are integers in −12..9 inclusive. Home has no `stampAngle`. All existing content tests stay green.

**Never:** No `angle` prop on `Stamp` and no rotation in any UI (part 2, after #80 is merged). No changes to `copy.ts`, `tokens.css` or `src/ui/`. No new rule function; the angle is read straight from the destination.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Real content | `content/destinations.json` with 8 angles | Loads; each destination has its agreed angle | N/A |
| Boundaries | `stampAngle` −12 or 9 | Accepted | N/A |
| Out of range | −13 or 10 | Rejected | `ContentError` names `destinations[i].stampAngle` |
| Not whole | 2.5 | Rejected | `ContentError` names the field |
| Missing | field left out | Rejected | `ContentError` names the field |
| Wrong type | `"5"` | Rejected | `ContentError` names the field |

</frozen-after-approval>

## Code Map

- `content/destinations.json` -- 8 destinations; add `stampAngle` after `costFactor` in each.
- `src/rules/types.ts:23-33` -- `Destination`; add `stampAngle: number` with a doc comment (DESIGN → Stamp, NFR-1). PR #74 changes this file only at line 198+, so there is no conflict.
- `src/content/schema.ts:100-113` -- `destinationSchema` (strictObject, `satisfies z.ZodType<Destination>`); add the field next to `costFactor`. Reuse the existing style: `z.number().int(...).min(-12).max(9)`.
- `tests/fixtures/content/*.json` -- 6 fixtures, each with 2 destinations; strict parse will reject them without the field. Add valid angles to all destinations, or the broken fixtures fail for the wrong reason.
- `tests/content/content.test.ts` -- helpers `withDefect`, `expectProblem`, `poke` (lines 38-78); `costFactor` cases at ~799 show the pattern for field defects. Add the real-content test in `describe("real content")` and defect cases in `describe("bad shape")`.
- `tests/balance/balance.test.ts:132`, `tests/rules/money.test.ts` -- spread or read real destinations; they compile unchanged.
- `README.md:66` -- checklist for a new destination (FR-19) lists the required fields; add `stampAngle (whole degrees, −12 to 9)`. PR #75 (line 26) and #76 (line 9) touch other hunks.

## Tasks & Acceptance

**Execution:**
- [x] `src/rules/types.ts` -- add `stampAngle` to `Destination` -- type and schema agree (`satisfies`).
- [x] `src/content/schema.ts` -- add the field to `destinationSchema` -- AD-7 validation.
- [x] `content/destinations.json` -- add the agreed angles -- the data.
- [x] `tests/fixtures/content/*.json` -- add valid angles -- keep fixtures failing only for their own defect.
- [x] `tests/content/content.test.ts` -- real values per id (fixed table in the test), and the matrix cases -- NFR-1 and AD-7.
- [x] `README.md` -- add `stampAngle` to the line 66 checklist -- FR-19 stays accurate.

**Acceptance Criteria:**
- Given the real content, when it loads, then each of the 8 destinations has exactly the angle in the test table, and two loads give the same angles (NFR-1).
- Given a new destination added per the README checklist, when `npm test` runs, then a missing `stampAngle` fails with a message that names the field.

## Implementation Notes

- Implemented directly in the main session (no implementation subagent), after the spec was approved on 2026-11-27.
- Fixtures: destinations get −5 and 3 (valid, distinct), so each broken fixture still fails only for its own defect.
- README line 66 states the range only. An earlier draft also said "different from the other destinations", but the schema does not check uniqueness, so that claim was removed. Distinctness of the real values is checked by the real-content test.
- Mutation checks: removing `.int`, `.min(-12)` or `.max(9)` from the schema each fails exactly one new test.
- Verified: `npm run lint` clean, `npm test` 412/412 (405 + 7 new); after review patches 413/413, `npm run build` OK.

## Review Triage Log

Pass 1 (2026-11-27): Blind Hunter (10 findings), Edge Case Hunter (0), Verification Gap (0, ran 108/108 content tests).

| # | Layer | Finding | Verdict | Evidence / route |
|---|---|---|---|---|
| BH1 | blind | Fixed 8-id angle table breaks the README "add a destination" promise | low | Pre-existing: "loads home as Bergen and exactly 8 destinations" already fixes the id list, and README line 64 says tests fail unless everything is done, without naming the test tables. Deferred. |
| BH2 | blind | Distinct angles not enforced by validation | false | Decision B chose distinct values; distinctness is not a content rule in the intent or DESIGN. README states range only, matching the schema. Rejected. |
| BH3 | blind | EXPERIENCE.md:487 lists `stampAngle` under "Per place", which includes home | low | Real wording gap; direct correction. Patched: "(destinations only)". |
| BH4 | blind | No test that home rejects `stampAngle` | low | `homeSchema` is strict, but the Always rule had no test. Patched: bad-shape row "stamp angle on home". |
| BH5 | blind | Second-load check comment overclaims render determinism | low | `loadContent()` re-parses static JSON; the check covers data only. Patched comment, render test noted for part 2. |
| BH6 | blind | README uses U+2212 minus, invalid if copied into JSON | low | Real; direct correction. Patched to ASCII `-12`. |
| BH7 | blind | Mockup vs content mismatch recorded only in spec | low | DESIGN already says angles come from content data; decision is in this spec, the session log and the PR. Rejected. |
| BH8 | blind | Part 2 has no tracking | false | #78 stays open; PR will say "Part of #78", not "Closes". No diff defect. |
| BH9 | blind | No rationale for asymmetric −12..+9 | false | Both comments point to DESIGN → Stamp, which is the source of the range. Rejected. |
| BH10 | blind | `stampAngle: number` looser than schema | low | Same pattern as `costFactor`; parse-time validation is the AD-7 design. Rejected (adds surface for no named harm). |

## Verification

**Commands:**
- `npm run lint` -- expected: no errors
- `npm test` -- expected: all pass, new tests included
- `npm run build` -- expected: success (`tsc -b` checks the `satisfies`)
