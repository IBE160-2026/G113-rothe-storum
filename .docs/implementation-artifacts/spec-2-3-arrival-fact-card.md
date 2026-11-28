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
| 2 | At the destination, reopening shows the same fact card | Read mode done (`ArrivalSheet.test.tsx` AC2); the "About {city}" entry on the city-day card done (`CityDayCard.test.tsx`). **Wiring both into the Map is pending #73** |

## Decisions (Thomas, 2026-11-28)

- **City-day card in 2.3 (option A):** Story 2.3 builds the full city-day card on the Map ("You're in {city}", "City day in {city} — {price}", stamp hint, "Plan the day", "About {city}"), because it is the entry to both the fact card (AC 2) and City day. The "Call home" button on it is Story 3.2 (Christian); the [EXT] work variant is not built.
- **Street drawings:** Christian owns the content schema and the `streetDrawing` data (`content/destinations.json`, `src/content/schema.ts`, `src/rules/types.ts`); Thomas owns rendering the drawing behind the Arrival fact card and the integration.
- **Story 2.4** waits until #77 (Polaroid) and #80 (Stamp) are merged; their components are not duplicated.

## Done in this milestone

- `src/ui/sheets/ArrivalSheet.tsx` (+ css), two modes:
  - **arrival:** eyebrow "You've arrived · Day {day} of {N} · {money}", "Welcome to {city}" / repeat "Back in {city}", trip pill "{Mode} from {from} · {days} · {price}", fact card ("About {city}" caption, 4 px ochre edge), "Plan the day" (unavailable with the reason when the city day is not possible), cost line, "Just passing through", stamp line.
  - **read:** the same fact card, no pill and no buttons; × closes.
- Availability, reason and stay price come from `cityDayStatus()` (AD-3). "Stamped" is the game state. The trip pill uses the option the player confirmed (UI state, passed in by the caller).
- Dialog semantics as the other sheets: `role="dialog"`, `aria-modal`, initial focus on the headline, `wrapTab` (#49), Esc and ×.
- `src/ui/components/CityDayCard.tsx` (+ css): the city-day card with eyebrow, title with the stay price from `cityDayStatus()`, stamp hint (first / repeat), "Plan the day" (unavailable with its reason) and "About {city}" (`aria-haspopup="dialog"`, reports its button so focus can return to it). Renders nothing at home.
- `src/ui/components/Icon.tsx`: a `stamp` icon stand-in for the card's hint (DESIGN: ochre stamp icon).
- `src/ui/copy.ts`: `arrival.*` from EXPERIENCE → Copy (`arrival`, `arrival.repeat`, `arrival.unavailable` = `map.card.unavailable`) and `map.card.*` (`map.card`, `map.card.repeat`).

## Dependencies (not done; no workaround in code)

Summary: **#73** for all wiring into the Map; **Christian's `streetDrawing` schema and data** for the drawing; **#77 / #80** only for Story 2.4, not for 2.3; **Story 3.2** for the card's "Call home" button.

1. **Opening after travel** (AC 1): the trip confirmation lives in Story 1.7 (PR #73, waiting for #74). After #73 merges, `MapScreen` opens the card after a confirmed trip to a destination, with the trip pill, and through `useBackToClose`.
2. **City-day card on the Map** (AC 2 entry): decided (option A) and built as a component. Placing it on the Map and opening the fact card in read mode through `useBackToClose` is done together with dependency 1, since #73 reworks `MapScreen`.
3. **Street drawings** (`assets/streets/{destId}.svg`, 8 SVGs, plus a `streetDrawing` field): decided: Christian adds the schema and data (after #81), Thomas renders the drawing behind the sheet. Until then the sheet sits on plain paper.
4. **"Plan the day"** opens City day, which is Story 2.4. In 2.3 the caller decides; the component only reports the tap.

## Not in 2.3

City day screen and Day complete (2.4), the home-unreachable warning on the city day (2.4, Decision M), stamps and album (2.5).

## Verification (2026-11-28, Node 24.21.0, macOS 13.7.8, worktree `story-2-3-arrival`, base `b571375`)

- `npm run lint`: exit 0
- `npm test`: 25 files, **416/416** (405 + 11 new: ArrivalSheet 6, CityDayCard 5), twice
- `npm run build`: ok
- e2e: 3/3 (existing; no screen uses the card yet), local Chrome (#22)
- Mutation checks: an always-active "Plan the day" fails 1 test (sheet) and 1 test (card); buttons in read mode fail 1 test
- Not checked in a browser: no screen renders the sheet or the card yet (dependency 1)

## AI Involvement

Implemented by Claude Code (Opus 5.5) on Thomas's instruction to start the safe, independent part of 2.3. The dependencies above were raised for Thomas's decision rather than worked around.
