---
title: 'Story 1.7 — Travel and travel home'
type: 'feature'
created: '2026-11-25'
status: 'in-progress'
baseline_commit: '74a7d42ec7dc16c736b4ee596b06338ef08d43ee'
route: 'direct'
context:
  - '{project-root}/.docs/implementation-artifacts/spec-1-6-map-screen-and-route-sheet.md'
  - '{project-root}/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/EXPERIENCE.md'
  - '{project-root}/.docs/planning-artifacts/architecture/architecture-worldbound-nomad-2026-11-13/ARCHITECTURE-SPINE.md'
---

## Intent

**Problem:** After Story 1.6 the player can see routes but not travel. Nothing moves, and travel home cannot end a journey (FR-6, FR-7, UX-DR1).

**Approach:** Wire the Route sheet's primary to `dispatch(travel)`, add the Travel home content (swap inside the Route sheet), and show a temporary end screen when the rules end the journey. The rules layer is not touched: every rule answer comes from `routesFrom()`, `apply` and, once merged, `travelPreview()` (#71).

## Acceptance Criteria (epics.md, Story 1.7)

1. Given a selected available mode, when the player confirms travel, then the store calls `apply(travel)`, the map updates position, money and day counter, and the arrival flow starts.
2. Given the selected route leads home, when the player chooses it, then the Travel home sheet shows the current stamp count and whether the goal will be reached, and "Not now" cancels without any change.

| AC | Status | Evidence |
|---|---|---|
| 1 | Done. "The arrival flow starts" is the Arrival fact card, which is Story 2.3; 1.7 ends with the Map at the new position | `tests/ui/Travel.test.tsx` (AC1), e2e `travel.spec.ts` |
| 2 | Partly done: stamp count, confirmation and "Not now" are done. **"Whether the goal will be reached" waits for `travelPreview()` (#71)** | `tests/ui/RouteSheet.test.tsx`, `tests/ui/Travel.test.tsx` (AC2), e2e |

## Approved decisions

Thomas Rothe (UI owner) and Christian Storum (rules owner), agreed on PR #70, 2026-11-25:

- **Ownership:** Christian owns `src/rules/`, including the new `travelPreview()` query (#71). This branch does not touch `src/rules/` and has no mock or copy of it.
- **Temporary journey end:** when `game.outcome` is set by the rules, `TemporaryJourneyEnd` shows the outcome headline, the failure reason, "Goal reached / not reached", "Called home" when relevant, and "New journey". It is marked temporary in code (`data-temporary="journey-end"`) and replaced by Story 3.2 (Can't-continue sheet) and Story 3.3 (Journey summary). No new mechanics.
- **#64:** a destination chip shows the cheapest *available* price from `routesFrom()`. When no mode is available it shows the short variant with the cheapest mode's reason: "Not enough money" (existing, decision B in spec-1-6) or **"Not enough days"** (wording approved by Thomas as UX owner, 2026-11-25; **pending Christian's confirmation**, asked on PR #70).
- **#65:** `useBackToClose` pops its history entry when the screen unmounts with a sheet open, and never goes back twice (a `closing` flag covers `close()` before its `popstate` arrives). Confirming travel pops the entry and closes at once.
- **Navigation:** Esc, ×, scrim and browser Back close the sheet in both contents. "Not now" swaps back to the route content with nothing changed.

## Outstanding rules dependency (#71, Christian)

`travelPreview(state, to, mode, content): { ok, reason, moneyAfter, daysUsedAfter, stampsAfter, outcome, failReason }`, using `applyTravel` and `evaluateEnd` internally. Agreed signature; not merged yet. When it is, this branch adds:

| Where | What | EXPERIENCE copy |
|---|---|---|
| Travel home | Goal line, answer first | `home`: "Goal will be reached" / "You have {n} of 5 stamps — goal not reached" |
| Travel home | Money and day before/after boxes | DESIGN → Travel home sheet |
| Route sheet | Consequence line for the selected mode (deferred from 1.6) | `route.consequence` |
| FR map | Move FR-7 "whether the goal will be reached" from Flagged into the table | — |

This PR stays a draft until then.

## Deferred (not in 1.7)

- Arrival fact card after travel: Story 2.3.
- Can't-continue sheet and Journey summary: Stories 3.2 / 3.3 (they replace the temporary end screen). Decision N (#66, call home never reaches the goal) is a rules change owned by Christian; the end screen shows whatever outcome the rules set.
- Departure cue (motion/sound, EXPERIENCE → Motion): not built.

## Code Map

- `src/ui/screens/MapScreen.tsx` -- `confirmTravel()`: `back.close()`, then `dispatch(travel)` and close in one `flushSync`, focus to the Map headline.
- `src/ui/sheets/RouteSheet.tsx` -- primary commits through `onConfirm`; to Bergen it reads "Continue" and swaps to Travel home; focus follows the headline.
- `src/ui/sheets/TravelHome.tsx` -- new: route line, title, stamps, "ends when you land", primary, "Not now".
- `src/ui/screens/TemporaryJourneyEnd.tsx` (+ css) -- new, temporary.
- `src/ui/App.tsx` -- shows the temporary end screen when `game.outcome` is set.
- `src/ui/hooks/useBackToClose.ts` -- #65.
- `src/ui/components/RestingPanel.tsx` -- #64.
- `src/ui/copy.ts` -- `home.*`, `end.*`, `map.chipNoDays`.
- `.docs/test-report/fr-test-map.md`, `tests/traceability.test.ts` -- FR-4 (3 rows) and FR-9 (1 row) for the Route sheet from Story 1.6 (finding on PR #69), FR-7 Travel home (1 row); `EXPECTED_ROWS` FR-4 6 → 9, FR-7 2 → 3, FR-9 5 → 6.

## Verification

Run 2026-11-25 on Node 24.21.0, macOS 13.7.8, worktree of `story-1-7-travel` (base `74a7d42`), after `npm ci`:
- `npm run lint`: exit 0
- `npm test`: 26 files, **415/415** (396 on base + 19 new). In 1 of 11 full runs, the existing rules test `cityDay.test.ts › query and apply agree (AD-3) › agrees in every cell of the grid over real content` failed; it was not reproduced in the other 10. It takes about 1.5 s alone, so under the full parallel suite it likely meets Vitest's default 5 s timeout. The test and `src/rules/` are unchanged on this branch (rules owner: Christian); reported on the PR.
- `npm run build`: ok
- e2e: **4/4** at 375 × 812 (`start`, `first-visit`, `map`, new `travel.spec.ts` with real `page.goBack()` on Travel home), local Google Chrome through a temporary config outside the repo (#22)
- Mutation checks on #65: removing the `closing` handoff in `close()` fails 2 tests (double back); removing the pop on unmount fails 1
- Found and fixed during testing: after a confirmed trip the sheet disappeared before `popstate`, leaving focus nowhere and the Map inert for a moment; `confirmTravel` now closes at once
- Manual: screenshots of Travel home and the temporary end screen at 375 px

## AI Involvement

Implemented by Claude Code (Opus 5.5) from the Story 1.7 preparation and the decisions above. No separate AI review subagents; the independent review is Christian's review of the pull request.
