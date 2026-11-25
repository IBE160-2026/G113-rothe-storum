# Epic 3 Context: Journey end

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Every journey ends in exactly one clearly explained way, either home with or without the goal, called home, stranded or out of days, and always ends with a journey summary. The player must never be stuck with no available action. Running out of money is a crisis, not game over: call home is the core safety net. It always works if the days fit, but it costs a week and a stamp, so it is never better than buying a ticket. This epic closes the core game loop and makes UJ-2 (Jonas calls home from Rome) playable end to end.

## Stories

- Story 3.1: Goal, call home and end rules (rules)
- Story 3.2: Call home and can't-continue sheets (UI)
- Story 3.3: Journey summary and new journey (UI)

## Requirements & Constraints

- **Call home offered** if and only if the player is at a destination (not home) and money is below the cheapest mode on every route out. The cost (7 days, one stamp, €0) is shown before the player confirms.
- **Call home effect:** days used +7, the most recently earned stamp is removed (if any), money is unchanged, position becomes home, `calledHome = true`, and the journey ends. Declining ("Not now") never removes the offer while the condition holds.
- **Stranded:** call home is offered but 7 days exceed the days remaining. The journey ends at once as failed, even if a city day is still affordable, because nothing in core can raise money. [EXT note: once work exists, an available shift should prevent stranded. Confirm this when the Work epic starts.]
- **Out of days:** there is no affordable travel that fits the days remaining, no affordable city day and no call home that fits. The journey ends as failed.
- **Goal:** reached if and only if the player is home with at least 5 stamps and days used ≤ the mode's days (30), and the journey did not end by call home (PRD Decision N, #66). Stamps removed by call home do not count. A journey that ends away from home is always failed.
- **After the end,** every action except `startJourney` is rejected with `JOURNEY_ENDED`. Only the summary and "New journey" remain.
- **Money never below €0** holds on every path, including call home.
- **UJ-2 acceptance script:** Jonas has €20 in Rome after 10 days used. He calls home and ends at 17 days with 3 stamps (New York, Paris, London), €20 left, "Called home" and "Goal not reached". The same situation at 24 days used (6 left) ends as stranded with all 4 stamps kept.
- Mobile first at 375 px, 44 px targets, status not shown by colour alone, English copy.

## Technical Decisions

- **One mutation path:** `callHome` joins the closed action union and goes through `apply(state, action, content)`. `apply` evaluates the end rules itself after every successful action and sets `outcome` (`goalReached` / `goalNotReached` / failed) and `failReason` (`stranded` / `outOfDays`). There is no "end journey" action, and the UI never decides that a journey has ended.
- **Queries, not UI logic:** "call home offered" and "journey ended (outcome + reason)" are pure queries in `src/rules/queries.ts`. Each query shares its internal check with `apply`, so the UI cannot drift from the rules. Planned modules are `src/rules/callHome.ts` and `src/rules/end.ts`.
- **Rules API listing:** the "Rules API" table in the architecture spine lists the members the UI may call. Adding `callHome`, the new queries or any new `ReasonCode` means updating that table and adding copy for every new code in `src/ui/copy.ts`.
- **Stamp order:** stamps are an ordered `{ id, day }` array. "Most recently earned" is the last element.
- **Days:** state stores `daysUsed`. The "Day X" label is `daysUsed + 1`, and `daysRemaining = modeDays − daysUsed`. Call home's "Day {day} → {dayAfter}" adds 7.
- **Rules stay pure:** `src/rules/` imports no React, DOM, storage or app/UI code, and never throws for player actions. All copy lives in `src/ui/copy.ts`, using the EXPERIENCE keys (`call`, `call.noStamps`, `end.stranded`, `end.outOfDays`, `sum.*`). All colours come from `tokens.css`.
- **Tests:** rules tests start their `describe` with the FR id (FR-11, FR-12, FR-13). UJ-2 is scripted as a rules test, and the Playwright version follows in Epic 4. PRs name the story id and the FR ids they cover.

## UX & Interaction Patterns

- **Call home sheet:** a modal dialog (focus trap, inert background, initial focus on the headline, focus returns to the trigger). It **opens automatically once**, on the first Map view after the offer becomes true, and never over the Arrival card or City day. "Not now" closes it. It reopens only from a persistent "Call home" button on the city-day card and in the route sheet. When every route row is unavailable, that button replaces the route sheet's primary action. Call home may open over the route sheet, the only case where one sheet sits over another. With 0 stamps it uses the no-stamp copy and skips the slot animation. It is a goal-action confirm: "Call home" is the primary button and "Not now" is secondary.
- **Can't-continue sheet:** opens when the rules end the journey away from home. It has no ×, the scrim does not close it, and Esc and back do nothing. It shows the stranded or out-of-days copy, and its one button, "See your journey", opens the summary.
- **Journey summary:** a terminal screen. Back does nothing, and the menu offers only "How to play" and "New journey". It shows the traveller name, stamps with destination names (five slots, the emptied slot stays empty), tappable polaroids, days used of N, money left, a goal line (solid when reached, dashed when not, with icon and words), a "Called home" tag when relevant, the failure reason when relevant, and at most one tip (called home or stranded). Its copy follows the outcome: "What an adventure.", "Almost there." or "The adventure ends here." There are no red marks and no crossed-out stamps. The empty album shows "No photos this time. Sights are optional." "New journey" opens the Start screen with the last name prefilled.

## Cross-Story Dependencies

- 3.1 builds on the journey state (1.3), travel and route queries (1.4) and the city day check (2.1). Arriving home by travel already sets the goal outcome; 3.1 adds call home, stranded and out of days, and must stay consistent with it.
- 3.2 needs 3.1's queries plus the Map screen, city-day card and route sheet (1.6, 2.4), which are still in the backlog.
- 3.3 needs 3.1's outcome and reason, the stamp and polaroid components from 2.5, the Start screen (1.5) and the storage adapter's last traveller name. Travel home (1.7) also ends on this summary.
- Epic 4 (4.1, 4.2) adds the UJ-2 journey test and the e2e test on top of this epic.
