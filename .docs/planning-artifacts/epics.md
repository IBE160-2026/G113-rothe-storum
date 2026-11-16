---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments:
  - .docs/planning-artifacts/prds/prd-worldbound-nomad-2026-10-12/prd.md
  - .docs/planning-artifacts/prds/prd-worldbound-nomad-2026-10-12/addendum.md
  - .docs/planning-artifacts/architecture/architecture-worldbound-nomad-2026-11-13/ARCHITECTURE-SPINE.md
  - .docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/EXPERIENCE.md
  - .docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/DESIGN.md
created: 2026-11-13
note: >-
  Generated in one pass by the AI agent (Claude Code) on 2026-11-13 at the team's request
  ("start the session"), without the workflow's step-by-step approval. The team reviews and
  approves this breakdown in the planning pull request. MVP core is detailed in full; MVP
  extension epics are outlined and get detailed acceptance criteria when they start.
---

# WORLDBOUND: NOMAD - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for WORLDBOUND: NOMAD, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**MVP core**
- FR-1 Start a new journey (Explorer, €1,500, 30 days, optional name ≤ 14 chars)
- FR-2 First-time intro (reopenable from menu)
- FR-3 Show the map (home + 8 destinations, stamps marked, status always visible)
- FR-4 Show routes from the current position (prices, days, unavailable with reason, home-unreachable warning)
- FR-5 Fact card on arrival (reopenable)
- FR-6 Travel along a route
- FR-7 Travel home ends the journey (confirmation)
- FR-8 Spend a city day (fixed order, Decision F)
- FR-9 Money never below €0
- FR-10 Earn a stamp
- FR-11 Goal evaluation
- FR-12 Call home
- FR-13 End the journey (stranded / out of days, Decision H)
- FR-14 Journey summary
- FR-21 Visit sights
- FR-22 Photo album (a visited sight is not bought again; free viewing, no reward, Decision G)

**MVP extension** — FR-15 Work a shift · FR-16 Question sequence · FR-17 Accommodation tiers · FR-18 Nomad mode · FR-19 Madrid and Cape Town · FR-20 Save automatically · FR-23 Night departures · FR-24 Sound effects

### NonFunctional Requirements

NFR-1 Determinism · NFR-2 Testability (rules without browser) · NFR-3 Runs locally from README, no keys · NFR-4 Mobile first, 375 px · NFR-5 Accessibility basics (44 px targets, not colour alone) · NFR-6 English · NFR-7 Content as data · NFR-8 Content quality (fact-check, licence) · NFR-9 No personal data

### Additional Requirements

From the architecture spine (AD-1 – AD-10):
- AR-1 Project scaffold: Vite 8 + React 19 + TypeScript 6.0, ESLint, Prettier, Vitest, Playwright; `npm run dev|build|preview|test|test:e2e|lint`.
- AR-2 Rules in `src/rules/` are pure and isolated, enforced by lint (AD-1).
- AR-3 One mutation path `apply(state, action, content)` with closed action and `ReasonCode` unions; end rules evaluated inside `apply` (AD-2, AD-4).
- AR-4 Queries for every availability shown in the UI (AD-3).
- AR-5 Integer money/days, single `accommodationPrice()` (AD-5).
- AR-6 Content JSON validated by zod; rules take content as an argument (AD-7).
- AR-7 Single storage adapter with fallback (AD-8).
- AR-8 Copy in `copy.ts`, tokens in `tokens.css` (AD-9).
- AR-9 Tests named by FR id; story and FR ids in every PR (AD-10).

From PRD §6 (process):
- PR-1 Every change reaches `main` through a pull request reviewed by the other team member.
- PR-2 Prompts and AI sessions for each story are logged (`.logs/`, sesjonslogg).
- PR-3 AI-generated code is not merged without passing tests and human review.

### UX Design Requirements

- UX-DR1 Screens and sheets per EXPERIENCE → Information Architecture (Start, Intro, Map, Route sheet, Arrival card, City day, Day complete, Passport/Album, Travel home sheet, Call home sheet, Can't-continue sheet, Journey summary, Menu).
- UX-DR2 Back navigation per EXPERIENCE → Back navigation (browser/Android back and Esc close the topmost sheet; Map is the root).
- UX-DR3 Sheets are dialogs with focus trap, inert background and focus return (accessibility review H-items).
- UX-DR4 Accessible map: HTML buttons over SVG; destination chips as the alternative path; 44 px targets.
- UX-DR5 Light and dark themes from DESIGN.md tokens, including the dark-mode token fixes.
- UX-DR6 Reduced motion: non-essential animation off with `prefers-reduced-motion`.
- UX-DR7 Copy from EXPERIENCE → Copy templates (English).
- UX-DR8 Layout: 375 px reference, centred ~480 px column on tablet/PC, 200 % text reflow.

### FR Coverage Map

| FR | Story |
| --- | --- |
| FR-1 | 1.3, 1.5 |
| FR-2 | 1.5 |
| FR-3 | 1.6, 2.5 |
| FR-4 | 1.4, 1.6 |
| FR-5 | 2.2, 2.3 |
| FR-6 | 1.4, 1.7 |
| FR-7 | 1.4, 1.7, 3.3 |
| FR-8 | 2.1, 2.4 |
| FR-9 | 1.3, 1.4, 2.1, 3.1 |
| FR-10 | 2.1, 2.4 |
| FR-11 | 3.1, 3.3 |
| FR-12 | 3.1, 3.2 |
| FR-13 | 3.1, 3.2 |
| FR-14 | 3.3 |
| FR-21 | 2.1, 2.2, 2.4 |
| FR-22 | 2.1, 2.5 |
| FR-15, FR-16 | Epic 5 |
| FR-20, FR-18 | Epic 6 |
| FR-17, FR-23, FR-19, FR-24 | Epic 7 (if time allows) |

## Epic List

1. **Epic 1 — Start and travel** [CORE]: the player can start a journey, see the map and travel between places. Includes the project scaffold.
2. **Epic 2 — City days, stamps and sights** [CORE]: the player can stay, earn stamps, read fact cards and fill a photo album.
3. **Epic 3 — Journey end** [CORE]: every journey ends in exactly one way: home with or without the goal, called home, stranded or out of days, with a summary.
4. **Epic 4 — Verified, accessible and runnable core** [CORE]: end-to-end tests, balance test, accessibility pass, playtest, README and delivery checks.
5. **Epic 5 — Work** [EXT, planned]
6. **Epic 6 — Save and resume, Nomad mode** [EXT, planned]
7. **Epic 7 — If time allows** [EXT]: accommodation tiers, night departures, Madrid and Cape Town, sound.

## Epic 1: Start and travel

The player opens the game, starts a journey from Bergen and travels between destinations with real price and time trade-offs.

### Story 1.1: Project scaffold and tooling

As a developer on the team,
I want a working project skeleton with lint, tests and a documented run path,
So that every later story builds, runs and is tested the same way.

**Covers:** AR-1, AR-2, NFR-3 · **Architecture:** Stack, Structural Seed, AD-1

**Acceptance Criteria:**

**Given** a clean clone and Node.js ≥ 22.12
**When** a developer runs `npm install` and `npm run dev`
**Then** the app opens in the browser and shows a placeholder Start screen
**And** `npm test`, `npm run test:e2e`, `npm run lint` and `npm run build` all exist and pass on the skeleton

**Given** a file in `src/rules/` that imports React or `src/ui/`
**When** `npm run lint` runs
**Then** lint fails (AD-1 enforced)

**Given** the README
**When** a reader follows "Getting started"
**Then** it lists prerequisites with versions and the exact commands above, and links to `.docs/`

### Story 1.2: Core content data and validation

As a developer,
I want the core places, routes and values as validated JSON,
So that rules and UI use one source of truth and values can change without code changes.

**Covers:** NFR-7, AR-6, FR-3 (8 destinations) · **Values:** addendum §1, §2, §4

**Acceptance Criteria:**

**Given** `content/config.json`, `content/destinations.json` and `content/routes.json`
**When** the content test runs
**Then** they validate against the zod schemas: home + exactly 8 destinations with ids, names, IATA codes, lat/lon, cost factors; 21 routes with 30 mode options matching addendum §4
**And** every route endpoint refers to an existing place id

**Given** a deliberately broken fixture (unknown place id, negative price)
**When** it is loaded
**Then** loading fails with a clear validation error

### Story 1.3: Game state and starting a journey (rules)

As a player,
I want a new journey to start with the right money, days and position,
So that every journey begins on equal terms.

**Covers:** FR-1, FR-9 (base), AR-3, AR-5

**Acceptance Criteria:**

**Given** no journey
**When** `apply(startJourney({ name }))` runs
**Then** the state is at `home` with €1,500, 0 days used, 30 days, 0 stamps, an empty album and no outcome

**Given** a name with leading/trailing spaces, emoji or æøå
**When** the journey starts
**Then** the name is trimmed, counted in graphemes, capped at 14, and an empty name becomes "Traveller"

**Given** any rejected action
**When** `apply` returns
**Then** it returns `{ ok: false, reason }` with a `ReasonCode` and the input state is unchanged

### Story 1.4: Travel and route queries (rules)

As a player,
I want to see every route from where I am and travel along one,
So that I can choose between plane, train and bus.

**Covers:** FR-4, FR-6, FR-7 (rules), FR-9

**Acceptance Criteria:**

**Given** the player at Copenhagen with €500 and 10 days used
**When** `routesFrom(state)` is queried
**Then** it returns only routes defined in content, each mode with price and days

**Given** a mode whose price exceeds money or whose days exceed days remaining
**When** it is queried or applied
**Then** the query marks it unavailable with `NOT_ENOUGH_MONEY` / `NOT_ENOUGH_DAYS`, and `apply(travel)` rejects it with state unchanged

**Given** a travel option after which the shortest route home (in days, ignoring money) no longer fits days remaining
**When** it is queried
**Then** it carries a home-unreachable warning but stays available

**Given** a valid travel
**When** it is applied
**Then** money falls by exactly the price, days used rise by exactly the days, and position is the other end

**Given** a travel to `home`
**When** it is applied
**Then** the journey ends with an outcome (goal evaluated in Story 3.1; until then the outcome is recorded as ended at home)

### Story 1.5: Start screen and first-time intro (UI)

As a first-time player,
I want a clear start screen and a one-screen intro,
So that I understand the goal before I begin.

**Covers:** FR-1, FR-2, AR-7, UX-DR1, UX-DR7

**Acceptance Criteria:**

**Given** a first visit on a device
**When** the player taps "New journey"
**Then** the intro shows the goal (5 stamps, home within the days), €1,500 and 30 days before the map

**Given** the intro has been seen
**When** the player starts another journey
**Then** the intro is skipped and can be reopened from the menu

**Given** browser storage is blocked
**When** the game loads
**Then** it still works and the intro shows every time

**Given** the start screen
**When** the player enters an optional name
**Then** the field enforces the FR-1 name rule and the last name is prefilled next time

### Story 1.6: Map screen and route sheet (UI)

As a player,
I want a map with my status and the routes from my position,
So that I can plan where to go next.

**Covers:** FR-3, FR-4, UX-DR2, UX-DR3, UX-DR4, NFR-4, NFR-5

**Acceptance Criteria:**

**Given** a journey in progress
**When** the map is shown on a 375 px viewport
**Then** home and the 8 destinations, the current position, "Day X of 30", days remaining, money and stamp count are visible without horizontal scrolling

**Given** the player selects a destination (marker or chip)
**When** the route sheet opens
**Then** each mode shows price and days; unavailable modes show their reason; warnings show icon + text, not colour alone

**Given** the route sheet is open
**When** the player presses Esc or browser back
**Then** the sheet closes and focus returns to the control that opened it

### Story 1.7: Travel and travel home (UI)

As a player,
I want to confirm a trip and see my money and days change,
So that the trade-off of each choice is tangible.

**Covers:** FR-6, FR-7, UX-DR1

**Acceptance Criteria:**

**Given** a selected available mode
**When** the player confirms travel
**Then** the store calls `apply(travel)`, the map updates position, money and day counter, and the arrival flow starts

**Given** the selected route leads home
**When** the player chooses it
**Then** the Travel home sheet shows the current stamp count and whether the goal will be reached, and "Not now" cancels without any change

## Epic 2: City days, stamps and sights

The player stays at destinations, earns stamps, reads about places and builds a photo album, with sights competing with tickets for money.

### Story 2.1: City day, stamps and sights (rules)

As a player,
I want a city day to cost a stay and a day and give me my stamp,
So that collecting stamps means really visiting.

**Covers:** FR-8, FR-9, FR-10, FR-21, FR-22, AD-6, Decisions F and G

**Acceptance Criteria:**

**Given** the player in Paris with €300 (cost factor 1.6)
**When** `spendCityDay({ sightIds: [] })` is applied
**Then** €80 is deducted, days used +1, and the Paris stamp is added (first city day)

**Given** a second city day in Paris
**When** it is applied
**Then** no new stamp is added

**Given** sights chosen for the day
**When** the city day is applied
**Then** accommodation is charged first, then each sight from the money left; a sight is rejected with `NOT_ENOUGH_MONEY` if the money left after accommodation is below its price, and the whole action is rejected with state unchanged

**Given** a sight already in the album
**When** it is chosen on a later city day
**Then** the action is rejected with `ALREADY_IN_ALBUM` and state is unchanged, and the sight does not count toward the 2-sight limit

**Given** money below the accommodation price or 0 days remaining, or the player at home
**When** a city day is queried or applied
**Then** it is unavailable/rejected with the matching reason

**Given** an accommodation price ending in .50 (test fixture)
**When** it is computed
**Then** it rounds half up

### Story 2.2: Fact cards and sight content (content)

As a player,
I want short, correct facts and pictures for each place and sight,
So that I learn a little about where I travel.

**Covers:** FR-5, FR-21, NFR-6, NFR-7, NFR-8, Decision I

**Acceptance Criteria:**

**Given** the 8 core destinations
**When** content is validated
**Then** each has a 2–3 sentence English fact card and exactly 2 sights with price €8–20 (addendum §3), a fact, an image path, `imageAlt`, `source` and `licence`

**Given** facts and photos drafted by the AI content agent
**When** a second AI agent fact-checks them
**Then** its report (what it flagged, what it corrected, what it could not verify) is saved with the pull request

**Given** the content pull request
**When** Christian Storum does the final check
**Then** every fact (including the Tivoli fact, UX Open Item 6) is fact-checked and stereotype-reviewed, every photo's licence is verified at its source, and the PR records what he approved and changed

**Given** a sight photo
**When** content is validated
**Then** it is a file in the repo (not a hotlink) from a freely licensed source (e.g. Wikimedia Commons, Unsplash, Pexels) or AI-generated, with `source`, `author` and `licence` recorded; photos copied from ordinary web pages are not allowed

**Given** a photo needs replacing
**When** a new file with the same path is added
**Then** it is replaced without code changes

### Story 2.3: Arrival fact card (UI)

As a player,
I want to see a fact card when I arrive,
So that each place feels distinct.

**Covers:** FR-5, UX-DR1, UX-DR3

**Acceptance Criteria:**

**Given** the player arrives at a destination
**When** travel completes
**Then** the arrival card shows the destination, day, money and fact card, with "Plan the day"

**Given** the player is at the destination
**When** they reopen the fact card
**Then** the same fact card is shown

### Story 2.4: City day screen and day complete (UI)

As a player,
I want to plan my day with a running total and see my stamp land,
So that I can weigh sights against my next ticket.

**Covers:** FR-8, FR-10, FR-21, UX-DR1, UX-DR6, UX-DR7

**Acceptance Criteria:**

**Given** the city day screen
**When** the player toggles up to 2 sights
**Then** the running total ("End the day — €X") updates from rules queries, unaffordable sights show their reason, and nothing is charged before "End the day"

**Given** "Back to map" before ending the day
**When** it is tapped
**Then** no money or days change

**Given** "End the day"
**When** it is confirmed
**Then** the Day complete screen shows the stamp (first city day), new polaroids, and the animation is skipped with reduced motion

**Given** a sight already in the album
**When** the city day screen lists it
**Then** it shows "In your album", is not selectable, and tapping it opens its Polaroid sheet for free with no change to money or days

### Story 2.5: Passport, stamps and photo album (UI)

As a player,
I want to see my stamps and photo album during the journey,
So that I can see my progress.

**Covers:** FR-3 (stamps on map), FR-22, UX-DR1

**Acceptance Criteria:**

**Given** stamps earned
**When** the map and passport are shown
**Then** stamped destinations are marked by shape/icon plus text, not colour alone, and the stamp strip shows the count

**Given** the photo album
**When** it is opened
**Then** each visited sight appears exactly once with its photo and fact, and the album is empty at the start of a journey

## Epic 3: Journey end

Every journey ends in exactly one clearly explained way and ends with a summary.

### Story 3.1: Goal, call home and end rules (rules)

As a player,
I want a safety net when money runs out and a fair end to every journey,
So that I am never stuck and always know the result.

**Covers:** FR-9, FR-11, FR-12, FR-13, Decision H, AD-2

**Acceptance Criteria:**

**Given** the player at a destination with money below the cheapest mode on every route out
**When** queries run
**Then** call home is offered with its cost (7 days, one stamp)

**Given** call home is applied with 7 or more days remaining
**When** it completes
**Then** days used +7, the most recently earned stamp is removed (if any), money is unchanged, position is home, `calledHome` is true and the journey ends

**Given** call home is offered and fewer than 7 days remain
**When** any action is applied
**Then** the journey ends as failed with reason `stranded`, even if a city day is still affordable

**Given** no affordable travel that fits, no affordable city day and no call home that fits
**When** the last action completes
**Then** the journey ends as failed with reason `out of days`

**Given** the player arrives home
**When** the journey ends
**Then** the goal is reached if and only if stamps ≥ 5 and days used ≤ 30, and stamps removed by call home are not counted

**Given** an ended journey
**When** any action other than `startJourney` is applied
**Then** it is rejected with `JOURNEY_ENDED`

**Given** UJ-2 (Jonas) scripted as actions
**When** it runs
**Then** he calls home from Rome with €20 after 10 days used and ends at 17 days with 3 stamps, "Called home", goal not reached; on day 25 the same situation ends as stranded

### Story 3.2: Call home and can't-continue sheets (UI)

As a player who has run out of money,
I want the way out explained before I commit,
So that I understand the cost.

**Covers:** FR-12, FR-13, UX-DR3, UX-DR7

**Acceptance Criteria:**

**Given** call home becomes offered
**When** the player is on the map
**Then** the Call home sheet opens once by itself; "Not now" closes it and a persistent "Call home" button stays while the condition holds

**Given** the journey ended away from home
**When** the rules set the outcome
**Then** the Can't-continue sheet shows the stranded or out-of-days copy; it cannot be dismissed; "See your journey" opens the summary

### Story 3.3: Journey summary and new journey (UI)

As a player,
I want a summary of my journey,
So that I can see what I achieved and try again.

**Covers:** FR-7, FR-11, FR-14

**Acceptance Criteria:**

**Given** an ended journey
**When** the summary shows
**Then** it shows the traveller name, stamps with destination names, photo album, days used, money left, "Goal reached"/"Goal not reached", "Called home" when relevant, and the failure reason when relevant

**Given** the summary
**When** the player taps "New journey"
**Then** the Start screen opens with the last name prefilled, and no other game action is possible from the summary

## Epic 4: Verified, accessible and runnable core

The core is proven by tests and a playtest, is accessible on a phone, and runs from the README on someone else's machine.

### Story 4.1: Journey and balance tests (rules)

As the team,
I want the user journeys and the balance check as automated tests,
So that rule or price changes cannot silently break the game.

**Covers:** SM-1, SM-3, UJ-1, UJ-2, AD-10

**Acceptance Criteria:**

**Given** UJ-1 scripted as rules actions
**When** it runs
**Then** Ingrid ends home after 16 days with €423, 5 stamps, 2 photos and "Goal reached"

**Given** the real core content
**When** the balance test runs
**Then** at least 3 five-destination sets win without sights, at least 1 wins with a full album, and no 6-stamp journey fits €1,500

**Given** the SM-1 list of FRs
**When** the test report is produced
**Then** every testable consequence of FR-1, FR-4, FR-6 – FR-14, FR-21 – FR-22 maps to at least one named test, and all pass

### Story 4.2: End-to-end tests on a phone viewport

As the team,
I want UJ-1 and UJ-2 played through the real UI,
So that the screens and rules work together.

**Covers:** SM-2 (prep), NFR-4, UX-DR8

**Acceptance Criteria:**

**Given** Playwright with a 375 × 812 viewport
**When** `npm run test:e2e` runs
**Then** UJ-1 and UJ-2 complete through the UI with the expected summary, and no page has horizontal scroll

### Story 4.3: Accessibility, themes and responsive pass

As a player using a phone, keyboard or screen reader,
I want the game to be usable and readable,
So that nobody is locked out by the design.

**Covers:** NFR-4, NFR-5, UX-DR2 – UX-DR6, UX-DR8

**Acceptance Criteria:**

**Given** every screen and sheet
**When** checked on 375 px, tablet and PC, in light and dark mode
**Then** targets are ≥ 44 px, text contrast meets the DESIGN.md values, nothing relies on colour alone, and layout works at 200 % text

**Given** keyboard only
**When** a full journey is played
**Then** every action is reachable, sheets trap and return focus, and Esc/back follow the back model

**Given** the findings
**When** the pass is done
**Then** a short manual test report lists what was checked, what failed and what was fixed

### Story 4.4: Playtest and test report

As the team,
I want five first-time players to try the game,
So that we know whether it is playable and whether time matters.

**Covers:** SM-2, SM-2b, §9.3

**Acceptance Criteria:**

**Given** 5 first-time playtesters on phones
**When** each plays one journey without help
**Then** the report records whether they finished (SM-2: ≥ 4 of 5) and their answer to the SM-2b question (≥ 3 of 5)

**Given** SM-2b fails
**When** the team reviews the result
**Then** the §9.3 lever is applied (balance test with 21 days) and the decision is logged

### Story 4.5: README, runnability and repository check

As an examiner,
I want to run the game and the tests from the README alone,
So that I can assess the work without asking the team.

**Covers:** SM-4, NFR-3, assessment criteria 6 and 7

**Acceptance Criteria:**

**Given** a clean machine or folder
**When** someone outside the team follows only the README
**Then** the game runs and the tests pass in under 10 minutes, and any gap found is fixed

**Given** the repository
**When** it is checked before the deadline
**Then** it holds no secrets, build output or `node_modules`; the README describes the app, the folder structure and links to the planning and process documents; external references (e.g. `architecture/technology.md`) are labelled; and every photo whose licence requires attribution is credited in a credits list (README or in-game menu)

## Epic 5: Work [EXT, planned]

Outline. Acceptance criteria are written when the epic starts, after the core passes its tests and the playtest (PRD §9.2, SM-C1). Decide PRD Open Question 6 first.

- Story 5.1: Shift and question sequence rules (FR-15, FR-16; confirm the FR-13 [EXT] stranded assumption)
- Story 5.2: Trivia content for the 8 core destinations (FR-16, NFR-8; AI drafts, AI fact-check agent, Christian final check)
- Story 5.3: Work shift UI and update of the UJ-3 flow in EXPERIENCE.md (FR-15)

## Epic 6: Save and resume, Nomad mode [EXT, planned]

Outline.

- Story 6.1: Autosave and continue journey (FR-20, AD-8)
- Story 6.2: Nomad mode (FR-18; Nomad values checked with the balance test, PRD Open Question 2)

## Epic 7: If time allows [EXT]

Outline, in PRD §9.2 order: accommodation tiers (FR-17) → night departures (FR-23, decide Open Question 7) → Madrid and Cape Town (FR-19) → sound effects (FR-24).
