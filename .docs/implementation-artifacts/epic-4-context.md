# Epic 4 Context: Verified, accessible and runnable core

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Prove the core game works and can be handed over. The rules and the two core user journeys (UJ-1 Ingrid wins, UJ-2 Jonas calls home) become automated rules tests and Playwright tests, and a balance test over the real content protects the price design. An accessibility, theme and responsive pass makes the game usable on a phone, with a keyboard and with a screen reader. Five first-time players test it. The README and the repository are checked so an examiner can run the game and the tests without asking the team. This epic is the evidence for the quality, UX, README and repository assessment criteria. Nothing in it adds features.

## Stories

- Story 4.1: Journey and balance tests (rules)
- Story 4.2: End-to-end tests on a phone viewport
- Story 4.3: Accessibility, themes and responsive pass
- Story 4.4: Playtest and test report
- Story 4.5: README, runnability and repository check

## Requirements & Constraints

- **Rules verified (SM-1):** every testable consequence of FR-1, FR-4, FR-6 – FR-14 and FR-21 – FR-22 maps to at least one named automated test, and all tests pass. The goal is coverage of rule consequences, not the number of tests. The test report shows the FR → test mapping.
- **Balance (SM-3), over the real core content in Explorer mode (€1,500, 30 days), no work:** at least 3 different 5-destination sets reach the goal without sights; at least 1 set reaches it with a full photo album (both sights everywhere); no journey with 6 or more stamps fits within €1,500. Model (Story 4.1 balance test): an exhaustive search through `apply`, one city day per stamped destination, any mode, stopovers allowed (passing through a city without a city day), and call home excluded (a journey counts only when it travels home; this model is complete because a journey ended by call home never reaches the goal, PRD Decision N, #66). Results on the content of 2026-11-25: 4 winning sets without sights (the five European destinations at €980, and three sets of four European + New York at €1,390–1,480), 1 set with a full album (Europe, €1,143). Do not lower prices to make tests pass, because a journey that ignores costs should fail.
- **UJ-1 (Ingrid) script:** start €1,500, Day 1 of 30. Bus Bergen→Copenhagen €70 / 2 d (arrive Day 3, €1,430), city day €90, no sights. Bus to Paris €70 / 2 d (arrive Day 6, €1,270), city day €80 with Eiffel Tower €20 and Louvre €17. Bus to London €50 / 2 d, city day €100. Plane to Rome €140 / 1 d, city day €70. Bus to Istanbul €80 / 3 d, city day €40. Plane home €250 / 1 d. **Assert:** home, 16 days used, €423, 5 stamps, 2 photos, goal reached. Summary copy is "What an adventure."
- **UJ-2 (Jonas) script:** plane Bergen→New York €350, three city days there (€110 each; only the first earns a stamp). Plane to Paris €320, city day €80. Train to London €90, city day €100. Plane to Rome €140, city day €70. Now €20, 10 days used (Day 11 of 30), and every route out is unaffordable. Call home is offered automatically. **Assert after call home:** home, 17 days used, €20, 3 stamps (New York, Paris, London; Rome removed), `calledHome`, goal not reached, "Almost there." **Edge case:** the same position at 24 days used (6 left) ends as stranded with all 4 stamps kept, "The adventure ends here."
- **E2E (supports SM-2):** `npm run test:e2e` plays UJ-1 and UJ-2 through the real UI at 375 × 812 and reaches the expected summary. No page may scroll horizontally.
- **Accessibility and responsive (NFR-4, NFR-5):** check every screen and sheet at 375 px, on tablet and on PC, in light and dark mode. Targets are ≥ 44 × 44 px. Text contrast is ≥ 4.5:1 and non-text state UI ≥ 3:1, matching the measured pairs in DESIGN.md. Nothing relies on colour alone. The layout survives 200 % text without horizontal scroll. Text is ≥ 11 px, inputs ≥ 16 px, type sizes in `rem`. The viewport meta never disables zoom. 4.3 ends with a short manual test report: what was checked, what failed, what was fixed.
- **Playtest:** 5 first-time players on phones, each playing one journey without help. SM-2 needs ≥ 4 of 5 to finish. SM-2b asks: "Did you at least once choose a faster and pricier (or slower and cheaper) transport mode because of the days?" and needs ≥ 3 of 5 to answer yes. If SM-2b fails, rerun the balance test with 21 days. Adopt 21 days if SM-3 still holds, otherwise keep 30 days and try slower routes. Log the decision.
- **Runnable (SM-4, NFR-3):** a person outside the team, using only the README, can run the game and the tests on a clean machine or folder in under 10 minutes. The game needs no accounts, keys, paid services or backend. Fix every gap found.
- **README content:** what the app does and who it is for (a screenshot helps); prerequisites with versions (Node ^22.22.2 || ^24.15.0 || ≥ 26); exact copy-paste commands (`npm install`, `npm run dev|build|preview|test|test:e2e|lint`, plus any Playwright browser install); how the tests run; configuration (none needed; `.env.example` only if an optional service is ever added); the folder structure; links to the planning (BMAD) and process docs (`.logs/`). It must match the code, not read like a template. External reference material, such as `architecture/technology.md` (notes from an unrelated website project), must be labelled as such. Every photo whose licence requires attribution is credited in a credits list, in the README or the in-game menu.
- **Repository:** no secrets or `.env` files, in the files or in the history. No build output (`dist/`), no `node_modules`, no loose test files, backups or stray files in the root. `.gitignore` covers these. File and folder names make sense, and code, docs and assets are clearly separated.

## Technical Decisions

- **Traceability:** every rules test `describe` starts with its FR id (for example `describe('FR-8 city day', …)`). UJ-1 and UJ-2 exist both as scripted rules tests and as Playwright e2e tests at 375 × 812. SM-3 is an automated balance test over the real content. Every PR names its story id and the FR ids it covers, goes through review by the other team member, and must pass its tests.
- **Test locations:** `tests/rules/` (one file per FR group), `tests/balance/` (SM-3), `tests/e2e/` (Playwright), `tests/ui/` (Testing Library), `tests/content/` (schema checks on real content), `tests/fixtures/` (small content sets, fixed states). Journey and balance tests use the **real** content. Other rules tests may use fixtures.
- **Rules API constraints for tests:** drive state only through `apply(state, action, content)` and the action creators `startJourney({ name, mode? })`, `travel({ to, mode })`, `spendCityDay({ sightIds })` and `callHome()`. Read availability through the queries (`routesFrom`, `cityDayStatus`, `cityDayPlan`, `callHomeStatus`, `daysTotal`, `daysRemaining`). Read the end from state (`outcome`, `failReason`, `calledHome`), not from a separate query. Assert `ReasonCode`s, never copy strings. `apply` sets the end itself, so there is no end action to call. After the end, every action except `startJourney` returns `JOURNEY_ENDED`.
- **Determinism:** the rules have no randomness or clock, so the same actions always give the same state. Money and days are integers. State stores `daysUsed`, and the label "Day X" is `daysUsed + 1`.
- **Themes and copy:** light and dark themes follow the device and come from `src/ui/styles/tokens.css`, which mirrors the DESIGN.md tokens, including the dark-mode fixes. Fixing a contrast problem means changing tokens, never hard-coding colours. All copy lives in `src/ui/copy.ts`.
- **CI:** GitHub Actions runs lint, test and build on every PR and on pushes to `main`. E2e has run locally only until now. Story 4.2 decides whether to add it to CI.

## UX & Interaction Patterns

- **Back model** (Esc = browser back = Android back): it closes the topmost sheet. On the Map root it does nothing. On the Can't-continue sheet and the Journey summary it does nothing. City day, Passport and Day complete return to the Map, and City day's draft is discarded.
- **Keyboard:** tab order follows reading order. Enter and Space activate. Arrow keys move within radio groups and tabs. A focus ring is always visible. On every screen change, focus moves to the new `h1` (`tabindex="-1"`, one per screen) and `document.title` updates. Sheets are modal dialogs with a focus trap and an inert background; focus starts on the headline and returns to the trigger.
- **Map:** the SVG is `aria-hidden`. HTML buttons (loupe, city pills, "Back to world") and the destination chips plus the Route sheet form the full accessible path. Hit circles are ≥ 44 px and never overlap.
- **Not colour alone:** unavailable = block icon + reason + `aria-disabled`, with no radio. Warning = warning glyph + "Heads up". Goal met = solid + check; goal not met = dashed + open icon, always with words.
- **Reduced motion:** with `prefers-reduced-motion`, the stamp landing, sheet slides and map zoom are instant. Numbers never count up.
- **Layout:** 375 px reference. Above 480 px, a centred single column (~480 px). Below 364 px, the cover drops to the slim strip. Below 600 px tall, the page scrolls. At 200 % text, chips wrap and panels scroll internally.

## Cross-Story Dependencies

- 4.1 needs only the finished rules (Epics 1–3). It can start now.
- 4.2, 4.3 and 4.4 need the whole core UI, much of which is still in the backlog: 1.6, 1.7, 2.3–2.5, 3.2 and 3.3.
- 4.4 depends on 4.1's balance test for the 21-day lever, and its outcome may change content values. With the content of 2026-11-25, SM-3 still holds at 21 days (all balance tests pass with `totalDays` 21), so the lever can be used without content changes. Playtest results gate the start of Epic 5: no extension work while core tests or the playtest fail.
- 4.5 comes last. It verifies the commands and the docs produced by every other story, including the e2e run from 4.2 and the photo credits from the 2.2 content records.
