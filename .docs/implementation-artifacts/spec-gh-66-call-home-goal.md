---
title: 'Call home never reaches the goal (Decision N, #66)'
type: 'feature'
created: '2026-11-25'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/.docs/planning-artifacts/sprint-change-proposal-2026-11-25.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** A journey that ends by call home counts as "Goal reached" when 5 or more stamps are left. That lets a player reach 6 stamps away from home, call home for free and win with Tokyo without work (#66). This contradicts PRD addendum §6 and §4.7 ("never better than buying a ticket").

**Approach:** Option E, as in the approved sprint change proposal (`sprint-change-proposal-2026-11-25.md`, section 4). The only code change is in `evaluateEnd()` (`src/rules/end.ts`): the goal also requires `!state.calledHome`. `callHome.stampPenalty` stays 1. Tests and the planning artifacts listed in the proposal are updated to match. Proposed by Thomas Rothe, agreed by Christian Storum (CSE). It replaces option B, which CSE chose first. The summary copy for a called-home player with 5 or more stamps, «{stamps}, safely home — next time, travel home yourself.», was approved by CSE on 2026-11-25.

</frozen-after-approval>

## Implementation Notes

**Code:** in `src/rules/end.ts`, add `!state.calledHome &&` to `goalReached`. The doc comment's rule 1 gains "and the player did not call home (Decision N)". Nothing else in `src/` reads the goal.

**Tests:**

- `tests/rules/callHome.test.ts:88`: rename the test to "does not reach the goal after call home, even with enough stamps left (Decision N)". It expects `outcome: "goalNotReached"`, `calledHome: true` and `failReason: null`.
- `tests/rules/callHome.test.ts:117` ("allows days remaining equal to the call-home days"): it expects `goalReached` today and would break. Change it to expect `goalNotReached`, which still proves the boundary because the journey is not `failed`/`stranded`. The proposal did not list this test.
- `tests/rules/end.test.ts`, `describe("evaluateEnd")`: add a control test. The same home state, stamps and days give `goalReached` with `calledHome: false` and `goalNotReached` with `calledHome: true`.
- `tests/balance/balance.test.ts:16–19`: the header comment says call home is excluded because the rules make it unable to reach the goal (Decision N). Remove the "loophole, #66 tracks it" text. The search itself is unchanged.

**FR test map (`.docs/test-report/fr-test-map.md`):**

- The call-home note on lines 19–21 is rewritten the same way as the balance header.
- Row 71 (FR-11) gets the text "A journey ended by call home is goalNotReached, even with enough stamps left (Decision N)" and the new test name.
- Add one FR-11 row for the control test, and set `EXPECTED_ROWS["FR-11"]` 6 → 7 in `tests/traceability.test.ts`. This makes it a deliberate count change.

**Docs** (exact old → new in the proposal, section 4):

- PRD: FR-11 (line 240), the comparison table (line 32), §9.8 Decision N after M, and a §13 Revision Log entry ("2026-11-25 — call home never reaches the goal (issue #66, Decision N)"). The Revision Log entry is not listed in the proposal, but it follows the PRD's own convention.
- Addendum §6: one new bullet.
- EXPERIENCE.md `sum.notReached` (line 166): the new variant.
- `epics.md`: Story 3.1 AC (line 449) and Story 3.3 AC (around line 489), each with "(changed by Decision N, #66)".
- `epic-3-context.md:21`: the same rule as FR-11.

**Do not change:** `content/config.json`, the fixtures, `spec-3-1`, the brief, `.docs/planning-artifacts/ux/ux-worldbound-nomad-2026-10-13/ux-spec.md` (checked: S3b and S8 list only "goal result", no contradiction), the mockups, the spec-4-1 triage log.

**Merge note:** PR #70 changes PRD Decision M and `fr-test-map.md` lines 55 and 129, next to this work. Whichever merges second may have a small textual conflict.

**Verification:** `npm test`, `npm run lint` and `npm run build` must all succeed with no errors.

**Done (implementation):**

- `src/rules/end.ts`: `!state.calledHome &&` and the doc comment, as planned.
- Tests: the two call-home tests were changed as planned. `end.test.ts` has the control test. Mutation check: with the condition removed, exactly the 3 Decision N tests fail (the control test, the renamed test and the boundary test). Restored afterwards.
- The balance header and the FR map note were rewritten. FR-11 row 71 was updated, a control row was added, and `EXPECTED_ROWS["FR-11"]` went from 6 to 7.
- PRD: §1.1 table, FR-11, Decision N and the Revision Log. Addendum §6, EXPERIENCE `sum.notReached`, epics Story 3.1 and 3.3, and epic-3-context are also updated.
- **Side effect:** editing `epics.md` and the PRD makes the cached `epic-2-context.md` and `epic-4-context.md` older than the planning artifacts. The next `bmad-build` for those epics will recompile them. `epic-3-context.md` was edited directly.
- Verified: `npm test` 397/397 (396 + 1 new), `npm run lint` and `npm run build` with no errors.

**Human decision during review (2026-11-25, CSE: 1.A, 2.A):** these replace the summary copy in the Intent block.

- The Call home sheet adds "Calling home ends your journey without the goal." This is in EXPERIENCE `call`, the UJ-2 walkthrough, the PRD FR-12 consequence and the Story 3.2 AC.
- Every called-home summary shows "{stamps}, safely home." with no "next time" clause. This is in EXPERIENCE `sum.notReached`, the UJ-2 climax and the Story 3.3 AC.

The frozen Intent is left as approved. The sprint change proposal has a dated update section.

## Review Triage Log

Blind Hunter, one pass (12 findings; floor N = 6 from about 25 kB):

| # | Finding | Verdict | Route | Evidence / action |
|---|---|---|---|---|
| 1 | The Call home sheet does not say the goal is lost | medium | halt → CSE 1.A | EXPERIENCE `call` only gave the cost. PRD §7 requires consequences before commit, and 6 stamps away from home is reachable on real content. Added "Calling home ends your journey without the goal." to EXPERIENCE, UJ-2, PRD FR-12 and the Story 3.2 AC. |
| 2 | No real-content test of the #66 journey | medium | patch | Added `end.test.ts` "the #66 call-home loophole is closed (real content)". It fails under the old rule (mutation check) and has a FR-11 row. `EXPECTED_ROWS` FR-11 went from 7 to 8. spec-4-1 #29 rejected a pinned loophole test only while the loophole was accepted. |
| 3 | `epic-4-context.md:20` still calls call home a loophole | low | patch | Rewritten to point to Decision N. |
| 4 | spec-4-1 Implementation Notes (line 50) still describe an open loophole | low | patch | Dated update note added, following the Decision M convention. |
| 5 | spec-3-1 "FR-11 literally" has no pointer to Decision N | low | patch | Dated "superseded" note added. |
| 6 | research.md:68 says the goal can still be reached after call home | low | patch | Dated "superseded" note added. |
| 7 | FR-14 and the Story 3.3 AC disagree on summary copy | low | patch | FR-14 lists only what the summary shows. The Revision Log now says the copy lives in EXPERIENCE and Story 3.3. |
| 8 | Summary variant: "{5 − n} more" when called home, a double "next time" next to the tip, the "Almost there." headline | medium | halt → CSE 2.A | Every called-home summary now shows "{stamps}, safely home." with no "next time" clause. The tag and the tip carry the lesson. "Almost there." is kept. |
| 9 | Spec front matter is out of date | false | reject | The status is set during Finalize by the workflow. It was in progress during the review on purpose. |
| 10 | "Do not change" list uses a short `ux-spec.md` path, and the file was not checked | low | patch | Full path given. S3b and S8 list only "goal result", so there is no contradiction. |
| 11 | Boundary test no longer proves stamps matter; duplicate fixture stamp | false / low | reject | The test is about the days boundary, and it asserts position home and no failure. Stamp logic is covered by the Decision N tests. The duplicate `alpha` stamp predates this change, and a rewrite would add churn. |
| 12 | Decision N's source "(issue #66, PR #70)" reads as if #70 implements it | low | patch | Now "Proposed by Thomas Rothe in the PR #70 review comments … (issue #66)". |
