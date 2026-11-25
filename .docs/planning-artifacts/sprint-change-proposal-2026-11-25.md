# Sprint Change Proposal: call home removes two stamps (#66)

- **Date:** 2026-11-25
- **Trigger:** issue #66, found in the Story 4.1 review (spec-4-1, Review Triage Log #1–#2)
- **Decision:** option B, `callHome.stampPenalty` 1 → 2. Decided by Christian Storum (CSE). Thomas Rothe is asked to confirm or challenge the decision in the implementation PR review.
- **Workflow:** `bmad-correct-course`, batch mode
- **Status:** approved 2026-11-25. Implementation waits until PR #69 (Story 4.1) is merged.

## 1. Issue summary

Story 4.1's balance review found that call home (FR-12) works as a free shortcut to the goal. A player who reaches 6 stamps away from home and runs out of money can call home for free. Call home removes only the _last_ stamp, so the player keeps a distant one and still reaches "Goal reached" (FR-11).

The only loophole journey in today's content: bus to Copenhagen, Paris, Rome and Istanbul with a city day in each, then plane to Tokyo and to Sydney with a city day in both. In Sydney the player has 6 stamps, €25 and 17 days used, cannot afford any route out, and calls home. Sydney's stamp is removed, and the player is home on day 24 with 5 stamps, Tokyo among them.

This contradicts PRD addendum §6 ("Tokyo and Sydney need a job"). The PRD balance model (addendum §6) and SM-3 counted only journeys that travel home, so call home was never checked.

**Evidence:** a temporary test through the real `apply`, run during the Story 4.1 walkthrough and reported on #66 (the test was deleted afterwards):

| Variant (no sights) | Wins by travelling home | Wins only via call home |
| --- | --- | --- |
| Today (`stampPenalty: 1`) | 4 | 1 (Tokyo) |
| `stampPenalty: 2` | 4 | 0 |
| Call home costs €100 | 4 | 0 |
| 21 days (§9.3 lever) | 4 | 0 |

The `stampPenalty: 2` row must be confirmed by the new balance test (section 4).

## 2. Impact analysis

- **Epic 3:** Story 3.1 (done) has its ACs updated in the docs only; the rules code already reads the penalty from `content.config` (`src/rules/callHome.ts:59`). Story 3.2 (backlog) gets new sheet copy, based on `CallHomeStatus.stampsLost`, which already exists.
- **Epic 4:** Story 4.1's balance test gains call home as a move.
- **Not affected:** Story 1.7, Epic 2, the architecture (ARCHITECTURE-SPINE), the content schema.
- **Code:** one value in `content/config.json`.
- **Tests:** UJ-2 in `tests/rules/end.test.ts` uses real content and changes from 3 to 2 stamps. The balance test gains call home. The fixture files in `tests/fixtures/content/*.json` keep their own `stampPenalty: 1`, so the tests that use them are unaffected.
- **Design intent kept:** the brief's rule that calling home is always worse than buying a ticket still holds, and more strongly.

## 3. Recommended approach

**Direct adjustment, minor scope.** There is no rollback and no change to MVP scope. Effort is about 1–2 hours.

**Risk:** the balance search keeps only the state with the most money for each position, stamp set and day. That is safe for travel (more money never removes an option), but not for call home, which is offered only when money is low. Pruning could drop the poorer state that can call home. Call home must therefore be tried on **every** generated state before pruning.

**Rejected options (from #66):**

- A: accept the shortcut and document it. It makes Tokyo reachable without a job.
- C: call home at €100. Fragile: it works only because today's prices leave less than €100 in Sydney.
- D: 21 days. This is the §9.3 lever, used only if SM-2b fails in the Story 4.4 playtest.
- E: a call-home journey never counts as the goal. It changes FR-11 and needs code and test changes.

## 4. Detailed change proposals

### Content and code

**`content/config.json`**

```
OLD: "callHome": { "days": 7, "stampPenalty": 1, "price": 0 }
NEW: "callHome": { "days": 7, "stampPenalty": 2, "price": 0 }
```

### Tests

**`tests/rules/end.test.ts`, UJ-2 (Jonas calls home from Rome, real content)**

- After call home, the stamps are `["new-york", "paris"]` instead of three.
- The test name changes to "17 days, 2 stamps, €20, goal not reached".

**`tests/balance/balance.test.ts`** (on `main` once PR #69 is merged)

- Call home is tried on every generated state before pruning.
- New assertion: no stamp set reaches the goal only via call home.
- Guard test: a frozen content copy with `stampPenalty: 1` finds the Tokyo set, which proves the assertion can fail.
- The header comment's exclusion text and #66 reference are replaced.

### PRD (`prds/prd-worldbound-nomad-2026-10-12/prd.md`)

**FR-12, consequences**

```
OLD: The offer shows its cost before the player confirms: 7 days and one stamp.
NEW: The offer shows its cost before the player confirms: 7 days and two stamps (fewer if the player has fewer).

OLD: Call home adds 7 days to days used, removes one stamp (if the player has any), costs no money, and moves the player home.
NEW: Call home adds 7 days to days used, removes the two most recently earned stamps (fewer if the player has fewer), costs no money, and moves the player home.

OLD: Which stamp is removed does not affect the goal; the most recently earned stamp is removed. [ASSUMPTION]
NEW: The most recently earned stamps are removed. Which stamps are removed does affect the goal: with a one-stamp penalty a player could sacrifice an expensive last city and keep a distant one (#66). The two-stamp penalty closes this (Decision N).
```

**"a stamp" / "one stamp" → "two stamps"** in the FR-12 description (line 245), the glossary (line 92), the comparison table (line 32) and the §7 voice example (line 395: "This costs 7 days and two stamps").

**UJ-2 (line 67)**

```
OLD: the summary shows three stamps (four minus one)
NEW: the summary shows two stamps (four minus two)
```

**§9.8, new Decision N**

> **N. Call home removes two stamps (2026-11-25).** With one stamp, call home was a free shortcut to the goal: 6 stamps away from home, then call home, kept Tokyo and won without work, which contradicts addendum §6. A check through the real rules found 1 such set with a penalty of 1 and 0 with a penalty of 2. Decided by Christian Storum (issue #66), found in the Story 4.1 review. **Rejected:** call home at €100 (it only works at today's prices), 21 days (that is the §9.3 lever and depends on SM-2b), and "call home never counts as the goal" (it changes FR-11 and needs code). The balance test now includes call home.

### PRD addendum (`addendum.md`)

**§1**

```
OLD: | Call home | 7 days, −1 stamp, €0 |
NEW: | Call home | 7 days, −2 stamps, €0 |
```

**§6, new bullet under "What this means":** "Call home is included in the balance test since Decision N: no set wins only by calling home."

### UX (`ux-designs/ux-worldbound-nomad-2026-10-13/EXPERIENCE.md`)

**Call home sheet (lines 41, 158)**

```
OLD: "This costs 7 days and one stamp. No money needed." · "Stamps {n} → {n − 1} ({city} removed)" · "Slot {n} empties"
NEW: "This costs 7 days and {k} stamps. No money needed." · "Stamps {n} → {n − k} ({cities} removed)" · "Slots empty"
     k = stampsLost: 2, or fewer if the player has fewer; "1 stamp" in the singular; the 0-stamp wording is unchanged
```

**UJ-2 walkthrough (line 409 and the climax)**

- "Stamps 4 → 2 (London and Rome removed)".
- "2 stamps, safely home — next time, 3 more."
- The summary shows two stamps (New York, Paris).

### Epics and stories

**`epics.md`**

- Story 3.1 AC: "(7 days, one stamp)" → "(7 days, two stamps)".
- Story 3.1 AC: "the most recently earned stamp is removed (if any)" → "the two most recently earned stamps are removed (fewer if fewer)".
- Story 3.1 UJ-2 AC: "17 days with 3 stamps" → "17 days with 2 stamps".
- A dated note on each: "changed by Decision N, #66".

**`implementation-artifacts/epic-3-context.md:17`:** "(7 days, one stamp, €0)" → "(7 days, two stamps, €0)".

### Test report and spec (on `main` after PR #69)

- `.docs/test-report/fr-test-map.md`: replace the "call home excluded" note (lines 19–21), update the FR-12 rows that say "one stamp", and add the new balance tests.
- `spec-4-1-journey-and-balance-tests.md`: a short dated note that Decision N lifts the call-home exclusion. The triage log stays as history.

### Left unchanged as history

- the brief;
- `ux/ux-worldbound-nomad-2026-10-13/ux-spec.md`;
- the mockups in `ux-designs/…/mockups` and `.working`;
- the done `spec-3-1-goal-call-home-and-end-rules.md` (the code follows config).

## 5. Implementation handoff

- **Scope:** minor. Developer implements directly with `bmad-build`.
- **Branch:** `gh-66-call-home-penalty` from `main`, after PR #69 is merged.
- **Reviewer:** Thomas Rothe. The PR description asks him to confirm or challenge option B, since the decision was made by one team member.
- **Success criteria:**
  - `npm test`, `npm run lint` and `npm run build` are green.
  - The balance test proves 0 wins only via call home with `stampPenalty: 2`.
  - The guard test proves the assertion fails with `stampPenalty: 1`.
  - All edits in section 4 are made, and the PR says `Closes #66`.
