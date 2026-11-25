# Sprint Change Proposal: call home never reaches the goal (#66)

- **Date:** 2026-11-25
- **Trigger:** issue #66, found in the Story 4.1 review (spec-4-1, Review Triage Log #1–#2)
- **Decision:** option E. A journey that ends by call home is never "Goal reached". Proposed by Thomas Rothe (PR #70 comments), agreed by Christian Storum (CSE).
- **Workflow:** `bmad-correct-course`, batch mode
- **Status:** approved by CSE 2026-11-25. Option E replaces option B (see History). Implementation is on branch `gh-66-call-home-goal`.

## History

1. **20:42:** CSE chose option B (`callHome.stampPenalty` 1 → 2), and this proposal was first committed with B (`7bf1338`).
2. **20:45:** in PR #70, Thomas Rothe challenged B. He asked when a called-home journey would still count as "Goal reached" (for example with 7 stamps away from home), and proposed that call home should never be a shortcut to the goal.
3. **CSE agreed:** E replaces B. B closes the loophole only for today's content. With work (Epic 5), a player can earn more money and stamps, and 7 stamps away from home could become reachable, which would reopen the loophole. E closes it as a rule.

## 1. Issue summary

Story 4.1's balance review found that call home (FR-12) works as a free shortcut to the goal. A player who reaches 6 stamps away from home and runs out of money can call home for free. Call home removes only the _last_ stamp, so the player keeps a distant one and still reaches "Goal reached" (FR-11).

The only loophole journey in today's content: bus to Copenhagen, Paris, Rome and Istanbul with a city day in each, then plane to Tokyo and to Sydney with a city day in both. In Sydney the player has 6 stamps, €25 and 17 days used, cannot afford any route out, and calls home. Sydney's stamp is removed, and the player is home on day 24 with 5 stamps, Tokyo among them.

This contradicts PRD addendum §6 ("Tokyo and Sydney need a job") and PRD §4.7 ("it is never better than buying a ticket"). The PRD balance model (addendum §6) and SM-3 counted only journeys that travel home, so call home was never checked.

**Evidence:** a temporary test through the real `apply`, run during the Story 4.1 walkthrough and reported on #66 (the test was deleted afterwards): with today's rules, 4 sets win by travelling home and 1 set (Tokyo) wins only via call home.

## 2. Impact analysis

- **Rules:** the goal condition in `evaluateEnd()` (`src/rules/end.ts`) also requires that the player did not call home. `callHome.stampPenalty` stays at 1, so there is no content change.
- **Superseded decisions:** the brief's "A player with 6 or more stamps can still reach the goal this way" and spec-3-1's "The goal follows FR-11 literally: a called-home player with 6 stamps keeps 5 and reaches the goal if the days fit". Both documents are left as history, and Decision N records that they are superseded.
- **Epic 3:** the Story 3.1 (done) AC is updated, and the code and tests change. Story 3.3 (backlog) needs a summary copy variant for a called-home player with 5 or more stamps.
- **Epic 4:** Story 4.1's balance search can keep excluding call home. The exclusion is now backed by the rule instead of only by the model, so only the header comment changes.
- **Story 1.7:** not affected. `travelPreview()` reads the outcome from `evaluateEnd()`, so it follows the new rule automatically.
- **Not affected:** Epic 2, the architecture (ARCHITECTURE-SPINE), the content schema, UJ-2 (Jonas already ends with "Goal not reached").

## 3. Recommended approach

**Direct adjustment, minor scope.** There is no rollback and no change to MVP scope. Effort is about 1–2 hours.

**Risk:** low. The change is one condition in the only place an outcome is set (`end.ts`). A new test proves that arriving home by travel with the same stamps still reaches the goal, so only call home is affected.

**Rejected options (from #66):**

- A: accept the shortcut and document it. It makes Tokyo reachable without a job.
- B: `stampPenalty` 2. Chosen first and then replaced (see History). It depends on today's prices and days, and work can reopen the loophole.
- C: call home at €100. Fragile: it works only because today's prices leave less than €100 in Sydney.
- D: 21 days. This is the §9.3 lever, used only if SM-2b fails in the Story 4.4 playtest.

## 4. Detailed change proposals

### Code

**`src/rules/end.ts`, `evaluateEnd()`**

```
OLD: const goalReached =
       state.stamps.length >= content.config.goalStamps &&
       state.daysUsed <= daysTotal(state, content);
NEW: const goalReached =
       !state.calledHome &&
       state.stamps.length >= content.config.goalStamps &&
       state.daysUsed <= daysTotal(state, content);
```

The doc comment's rule 1 gains "and the player did not call home (Decision N)".

### Tests

**`tests/rules/callHome.test.ts:88`**

```
OLD: it("reaches the goal when the stamps left still meet it (FR-11 literal)", …)  → outcome "goalReached"
NEW: it("does not reach the goal after call home, even with enough stamps left (Decision N)", …)  → outcome "goalNotReached", calledHome true
```

**`tests/rules/end.test.ts`:** a new test showing that the same stamps and days, arriving home by travel, still give "goalReached". This proves that only call home is affected.

**`tests/balance/balance.test.ts`:** the header comment says call home is excluded because the rules make it unable to reach the goal (Decision N), instead of pointing to #66 as an open loophole.

**`.docs/test-report/fr-test-map.md`:** the FR-11 row "The stamps left after call home still count when they meet the goal" gets new text and the new test name. The note on lines 19–21 is updated. The row count is unchanged.

### PRD (`prds/prd-worldbound-nomad-2026-10-12/prd.md`)

**FR-11, consequences**

```
OLD: The goal is reached if and only if the player arrives home with at least 5 stamps and days used ≤ the mode's days.
NEW: The goal is reached if and only if the player arrives home by travel with at least 5 stamps and days used ≤ the mode's days. A journey ended by call home never reaches the goal (Decision N).
```

**Comparison table (line 32)**

```
OLD: Call home always works: it costs 7 days and one stamp, no money, and the goal can still be reached
NEW: Call home always works: it costs 7 days and one stamp, no money, but the goal is not reached
```

**§9.8, new Decision N**

> **N. Call home never reaches the goal (2026-11-25).** With call home counting towards the goal, a player could reach 6 stamps away from home, call home for free, keep Tokyo and win without work, which contradicts addendum §6 and §4.7 ("never better than buying a ticket"). A journey that ends by call home is now always "Goal not reached", whatever the stamps left. This supersedes the brief's "A player with 6 or more stamps can still reach the goal this way" and spec-3-1's literal reading of FR-11. Proposed by Thomas Rothe and agreed by Christian Storum (issue #66, PR #70). **Rejected:** a two-stamp penalty (chosen first by CSE, then replaced: it depends on today's prices and days, and work can reopen the loophole), call home at €100 (it only works at today's prices), and 21 days (that is the §9.3 lever and depends on SM-2b).

### PRD addendum (`addendum.md`)

**§6, new bullet under "What this means":** "Call home can never reach the goal (Decision N), so a balance model that counts only journeys that travel home is complete."

### UX (`ux-designs/ux-worldbound-nomad-2026-10-13/EXPERIENCE.md`)

**`sum.notReached`, new variant (approved by CSE 2026-11-25)**

```
OLD: "Almost there." · "{stamps}, safely home — next time, {5 − n} more." · "Goal not reached" · "Called home" when relevant | 0 stamps: "No stamps, safely home — next time, 5 more."
NEW: (same) | 0 stamps: (same) · called home with 5 or more stamps: "{stamps}, safely home — next time, travel home yourself."
```

### Epics and stories

**`epics.md`**

- Story 3.1 AC (line 449): "the goal is reached if and only if stamps ≥ 5 and days used ≤ 30, and stamps removed by call home are not counted" gains "and the journey did not end by call home".
- Story 3.3: the summary shows the new `sum.notReached` variant for a called-home player with 5 or more stamps.
- A dated note on each: "changed by Decision N, #66".

**`implementation-artifacts/epic-3-context.md`:** the goal rule gains "never after call home (Decision N)".

### Left unchanged as history

- the brief;
- `ux/ux-worldbound-nomad-2026-10-13/ux-spec.md`;
- the mockups in `ux-designs/…/mockups` and `.working`;
- the done `spec-3-1-goal-call-home-and-end-rules.md`;
- the spec-4-1 triage log.

## 5. Implementation handoff

- **Scope:** minor. Developer (CSE, who owns the rules layer) implements directly with `bmad-build`.
- **Branch:** `gh-66-call-home-goal` from `main`.
- **Reviewer:** Thomas Rothe.
- **Success criteria:**
  - `npm test`, `npm run lint` and `npm run build` are green.
  - The call-home test proves "goalNotReached" with enough stamps left.
  - The travel test proves the same stamps still win when arriving by travel.
  - All edits in section 4 are made, and the PR says `Closes #66`.
