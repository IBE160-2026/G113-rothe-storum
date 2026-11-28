---
title: 'Story 2.3 — Arrival fact card'
type: 'feature'
created: '2026-11-28'
status: 'in-progress'
baseline_commit: 'b571375a9465d95437b8be513db72e36ef4acd0d'
route: 'direct'
context:
  - '{project-root}/.docs/implementation-artifacts/epic-2-context.md'
  - '{project-root}/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/EXPERIENCE.md'
  - '{project-root}/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/DESIGN.md'
---

## Intent

**Problem:** A trip ends without any sense of place. FR-5 asks for a fact card on arrival, and the player cannot reread it later (FR-5, UX-DR1, UX-DR3).

**Approach:** Build the Arrival fact card as a sheet component first (this milestone), from `main` and without touching rules, content or schema. Wire it into the Map when Story 1.7 (PR #73) is merged, and add the street drawings once their ownership is decided.

Owner: Thomas (team split, PR #76 / #11).

## Acceptance Criteria (epics.md, Story 2.3)

| AC | Requirement | Status / evidence |
|---|---|---|
| 1 | On arrival at a destination, the card shows destination, day, money and the fact card, with "Plan the day" | Component done: `tests/ui/ArrivalSheet.test.tsx` (AC1, 5 tests). **Opening it after travel is pending #73** |
| 2 | At the destination, reopening shows the same fact card | Read mode done (`ArrivalSheet.test.tsx` AC2). **The "About {city}" entry is pending** (see Dependencies) |

## Done in this milestone

- `src/ui/sheets/ArrivalSheet.tsx` (+ css), two modes:
  - **arrival:** eyebrow "You've arrived · Day {day} of {N} · {money}", "Welcome to {city}" / repeat "Back in {city}", trip pill "{Mode} from {from} · {days} · {price}", fact card ("About {city}" caption, 4 px ochre edge), "Plan the day" (unavailable with the reason when the city day is not possible), cost line, "Just passing through", stamp line.
  - **read:** the same fact card, no pill and no buttons; × closes.
- Availability, reason and stay price come from `cityDayStatus()` (AD-3). "Stamped" is the game state. The trip pill uses the option the player confirmed (UI state, passed in by the caller).
- Dialog semantics as the other sheets: `role="dialog"`, `aria-modal`, initial focus on the headline, `wrapTab` (#49), Esc and ×.
- `src/ui/copy.ts`: `arrival.*` from EXPERIENCE → Copy (`arrival`, `arrival.repeat`, `arrival.unavailable` = `map.card.unavailable`), and "About {city}" from `map.card`.

## Dependencies (not done; no workaround in code)

1. **Opening after travel** (AC 1): the trip confirmation lives in Story 1.7 (PR #73, waiting for #74). After #73 merges, `MapScreen` opens the card after a confirmed trip to a destination, with the trip pill, and through `useBackToClose`.
2. **"About {city}" entry** (AC 2): EXPERIENCE puts it on the Map's city-day card ("Plan the day" / "About {city}"). No story in epics.md names the city-day card. **Needs a decision:** build the card in 2.3, or the entry only, or leave it to 2.4.
3. **Street drawings** (`assets/streets/{destId}.svg`, 8 SVGs, plus a `streetDrawing` field): per spec 2.2 Q2 = A they belong to Story 2.3, but they touch `content/destinations.json`, `src/content/schema.ts` and `src/rules/types.ts`, which Christian owns, and PR #81 changes the same files now. **Needs a decision on ownership and timing.** Until then the sheet sits on plain paper.
4. **"Plan the day"** opens City day, which is Story 2.4. In 2.3 the caller decides; the component only reports the tap.

## Not in 2.3

City day screen and Day complete (2.4), the home-unreachable warning on the city day (2.4, Decision M), stamps and album (2.5).

## Verification (2026-11-28, Node 24.21.0, macOS 13.7.8, worktree `story-2-3-arrival`, base `b571375`)

- `npm run lint`: exit 0
- `npm test`: 24 files, **411/411** (405 + 6 new), twice
- `npm run build`: ok
- e2e: 3/3 (existing; no screen uses the card yet), local Chrome (#22)
- Mutation checks: an always-active "Plan the day" fails 1 test; buttons in read mode fail 1 test
- Not checked in a browser: no screen renders the card yet (dependency 1)

## AI Involvement

Implemented by Claude Code (Opus 5.5) on Thomas's instruction to start the safe, independent part of 2.3. The dependencies above were raised for Thomas's decision rather than worked around.
