---
title: 'Story 3.3 — Journey summary and new journey'
type: 'feature'
created: '2026-11-27'
status: 'draft'
baseline_commit: 'b571375'
route: 'direct'
context:
  - '{project-root}/.docs/implementation-artifacts/epic-3-context.md'
  - '{project-root}/.docs/implementation-artifacts/spec-polaroid-and-polaroid-sheet.md'
  - '{project-root}/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/EXPERIENCE.md'
  - '{project-root}/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/DESIGN.md'
  - '{project-root}/.docs/planning-artifacts/architecture/architecture-worldbound-nomad-2026-11-13/ARCHITECTURE-SPINE.md'
---

## Intent

**Problem:** When the rules end a journey, Story 1.7 (PR #73) shows `TemporaryJourneyEnd`: a headline, the outcome and "New journey", but no stamps, album, days or money. The player cannot see what the journey achieved, so FR-14 is not met, and the FR test map still has "pending Story 3.3" rows for FR-14 (#67).

**Approach:** Replace `TemporaryJourneyEnd` with a `JourneySummary` screen that shows everything the rules already decided (`outcome`, `failReason`, `calledHome`, `stamps`, `album`, `daysUsed`, `money`) with the EXPERIENCE `sum.*` copy and the DESIGN → Journey summary layout. "New journey" returns to the Start screen with the last name prefilled. The rules layer is not touched: the summary only reads `GameState` and content.

**Covers:** FR-7 (arriving home shows the summary), FR-11 (goal line), FR-13 (only summary and "New journey" after the end), FR-14.

## Dependencies (implementation starts when all three are merged)

- **PR #73 (Story 1.7, Thomas):** adds `TemporaryJourneyEnd` and the `game.outcome` branch in `App.tsx`, which this story replaces. #73 waits on PR #74 (`travelPreview()`, #71).
- **Stamp PR (branch `stamp-component`):** `Stamp` and `StampSlot`.
- **PR #77 (Polaroid components):** `Polaroid`, `EmptyPolaroid`, `PolaroidSheet`, `usePolaroidSheet` and `resolveAlbumEntry`.
- This spec is written before they are merged (agreed in #11: "Fram til da skriver jeg bare spec"). `baseline_commit` is updated when implementation starts.

## Acceptance criteria (from epics.md, Story 3.3)

1. **Given** an ended journey, **when** the summary shows, **then** it shows the traveller name, stamps with destination names, the photo album, days used, money left, "Goal reached"/"Goal not reached", "Called home" when relevant, and the failure reason when relevant. A called-home journey shows "{stamps}, safely home." with no "next time" clause (Decision N, #66).
2. **Given** the summary, **when** the player taps "New journey", **then** the Start screen opens with the last name prefilled, and no other game action is possible from the summary.

## Decisions for the story owner (Christian), before implementation

| # | Question | Recommendation | Why |
|---|---|---|---|
| D1 | Polaroid size on the summary (deferred item BH9 from PR #77) | **118 px is the width of the whole print**, not the photo height. Use or add a `Polaroid` size whose print is 118 px wide. | The J1 mockup sets `.albumstrip .polaroid{width:118px}` (`mockups/screens-core.html`). This settles BH9 with the design files, as the deferred item asks. |
| D2 | Who builds the 50 px stamp? `epic-3-context.md` says 3.3 uses "the stamp and polaroid components from 2.5", but #11 puts 3.3 before 2.5. | **Decided (Christian, 2026-11-27):** `Stamp` and `StampSlot` come in their own small PR before 3.3 (`spec-stamp-and-stamp-slot.md`, branch `stamp-component`). 3.3 uses them at 50 px, and 2.5 at 80 px. | The order changed in #11. Building it once avoids two stamp implementations. This is a deviation from the epic context. |
| D3 | Stamp angle: DESIGN asks for a fixed `stampAngle` per destination from content data, but `content/destinations.json` has none. | **Decided (Christian, 2026-11-27): 0°**, built into `Stamp`. Follow-up issue for `stampAngle` in content and schema (AD-7): #78. | Adding a content field means a schema change and content review. That is not needed for FR-14, and the stamp still reads by code and check, not by angle. |
| D4 | Back on the summary "does nothing" (EXPERIENCE → Back). | **Defer**, as Story 1.6 did for Back on the Map: Back leaves the page, as today. Record it as a deviation for the later navigation story. | Trapping Back needs a history strategy shared with the Map. Doing it for one screen only would be inconsistent. |
| D5 | Reduced menu on the summary: "How to play" and "New journey". `MenuSheet` has only "How to play" today. | **Add an optional `onNewJourney` prop.** The row is shown only when the journey has ended, and it goes straight to Start with no confirm (nothing can be lost). The in-journey "New journey" with its data-loss confirm stays out of scope. | EXPERIENCE says the confirm is for "a journey in progress". After the end there is nothing to lose. |
| D6 | Failed journeys before Story 3.2 (Can't-continue sheet). | **Show the summary directly** for `failed`. 3.2 later puts the sheet in front of it with "See your journey". | `TemporaryJourneyEnd` is removed in full here, so there is no second temporary screen. |

## Scope

**In:** `JourneySummary` screen; reduced menu row (D5); `sum.*` copy in `src/ui/copy.ts`; removal of `TemporaryJourneyEnd` and its test; FR-14 rows in the FR test map (#67).

**Out:** Can't-continue sheet (3.2); Passport and Album screens (2.5); `stampAngle` (D3); Back trapping (D4); the in-journey "New journey" confirm; e2e for a full journey (4.2); the EXT "+N" stamp overflow (core cannot reach 6 stamps).

## Content of the summary (EXPERIENCE → Journey summary, DESIGN → Journey summary)

From top to bottom:

1. **Eyebrow:** "Journey complete · home in Bergen", or failed "Journey over · in {city}" (`sum.eyebrow`), where `{city}` is the current position's name.
2. **Headline with icon** in `{typography.display}`:
   - Goal reached: "What an adventure." (with a name: "What an adventure, {name}.")
   - Goal not reached at home: "Almost there."
   - Failed: "The adventure ends here."
3. **Lede:**
   - Reached: "{daysUsed} days, {stamps}, safely home — a true {modeWord}."
   - Not reached by travel: "{stamps}, safely home — next time, {5 − n} more.", or with 0 stamps "No stamps, safely home — next time, 5 more."
   - Called home (any number of stamps): "{stamps}, safely home." with no "next time" clause (Decision N).
   - Failed: "{reason} Every route teaches something — try again?", with `{reason}` = "Stranded in {city} — no way home in time." or "Out of days in {city}."
4. **Goal line:** solid with icon and "Goal reached", or dashed with icon and "Goal not reached". Plus the **"Called home" tag** when `calledHome` is true (not interactive).
5. **Passport card:** a band in the Explorer cover tokens with the three-row cover info (mode / name, default "Traveller" / count "n/5"), then a wrapping row of five 50 px places: earned stamps (`Stamp` with the destination name below) and empty slots (`StampSlot`). An emptied slot after call home stays empty. No crossed-out stamps.
6. **Two stat tiles** in `{typography.serif-md}`, tabular numerals: "{daysUsed} days used" "of {N}", and "{money} left over".
7. **Album strip:** one `Polaroid` per album entry (D1). Tapping one opens the `PolaroidSheet`, which closes back to the summary. With an empty album: `EmptyPolaroid` and "No photos this time. Sights are optional."
8. **Tip** (at most one, `sum.tip`): called home "Next time, keep enough for a ticket out before your last city day."; stranded "Calling home takes 7 days. If you're low on money, call by Day {N − 6} so you still make it."; other outcomes have no tip.
9. **Footer:** "Every journey starts fresh from Bergen with €1,500." and `button-primary` "New journey".

Number and plural formats ("1 stamp", "3 stamps", money with €) follow EXPERIENCE → Format rules and the existing helpers in `copy.ts`. Values N (30), 5 and €1,500 come from `content.config`, not from the copy.

## Code map

- `src/ui/screens/JourneySummary.tsx` (+ `.module.css`): new. Props: `game`, `content`, `onNewJourney`, `onOpenMenu`. Reads only `GameState` and content.
- `src/ui/components/Stamp.tsx`: reused from the stamp PR (D2), `<Stamp code={iata} label="{city} stamp" size={50} />` and `<StampSlot numeral={i} size={50} />`. The stamp labels are new strings in `copy.ts`.
- `src/ui/App.tsx`: the `game.outcome !== null` branch renders `JourneySummary` instead of `TemporaryJourneyEnd`. "New journey" sets the Start screen, and `StartScreen` is already prefilled from `storage.lastName()`.
- `src/ui/sheets/MenuSheet.tsx`: optional `onNewJourney` (D5).
- `src/ui/copy.ts`: `sum.eyebrow`, `sum.reached`, `sum.notReached`, `sum.failed`, `sum.stats`, `sum.album`, `sum.tip`, `sum.footer`. Replaces the temporary strings from #73.
- Removed: `src/ui/screens/TemporaryJourneyEnd.tsx`, `.module.css`, and `tests/ui/TemporaryJourneyEnd.test.tsx`.
- `.docs/test-report/fr-test-map.md`: FR-14 rows point to the new tests (#67). FR-7 and FR-13 rows are updated where they named the temporary screen.

## Tests

`tests/ui/JourneySummary.test.tsx`, with `describe` blocks named after the FR ids (AD-10):

- **FR-14 / UJ-1, goal reached:** 16 days, 5 stamps, €423, 2 polaroids. Expect "What an adventure.", the lede with "a true explorer", solid "Goal reached", five stamps with city names, no tip and no "Called home" tag.
- **FR-14 / UJ-2, called home:** Jonas, 17 days, 3 stamps (New York, Paris, London), €20. Expect "Almost there.", "3 stamps, safely home." with no "next time", "Goal not reached", the "Called home" tag, two empty slots and the called-home tip.
- **FR-13, stranded and out of days:** the failed eyebrow with the city, the reason line, "Goal not reached", and the stranded tip only for `stranded`.
- **FR-11, not reached by travel:** 3 stamps by travel gives "next time, 2 more." and no tag. 0 stamps gives "No stamps, safely home — next time, 5 more."
- **Empty album:** `EmptyPolaroid` and "No photos this time. Sights are optional."
- **No name:** "What an adventure." without a name, and the cover shows "Traveller".
- **New journey (AC 2):** tapping it shows the Start screen with the last name prefilled. The summary has no travel, city-day or call-home control.
- **Rejected start after a journey (#50, `deferred-work.md`):** with an ended journey in the store, a rejected `startJourney` from the Start screen keeps the player off the Map. This is the first story where `game !== null` can reach Start.
- **Polaroid:** tapping one opens the sheet, and closing it returns focus to the polaroid.
- **Menu (D5):** after the end, the menu has "How to play" and "New journey", and "New journey" goes straight to Start.
- **Not colour alone:** the goal line has words and an icon in both states.

Mutation checks to record in Verification: removing the Decision N branch of the lede, and showing the tip for every outcome, must each make a test fail.

Manual: screenshots at 375 px, light and dark, of UJ-1, UJ-2 and stranded; no horizontal scroll.

## Verification

Not run yet. Filled in when the story is implemented.

## AI involvement

Spec drafted by Claude Code (Opus 5.5) on 2026-11-27 from epics.md, epic-3-context.md, EXPERIENCE.md, DESIGN.md, the J1/J2/CH3 mockups, PRD FR-7/11/13/14 and the open PRs #73 and #77. The decisions D1–D6 are recommendations and wait for Christian.
