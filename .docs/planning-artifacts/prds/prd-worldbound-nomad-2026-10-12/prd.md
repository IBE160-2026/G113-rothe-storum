---
title: "WORLDBOUND: NOMAD — PRD"
status: final
created: 2026-10-12
updated: 2026-10-13
---

# PRD: WORLDBOUND: NOMAD

## 0. Document Purpose

This PRD turns the revised product brief (`.docs/planning-artifacts/briefs/brief-worldbound-nomad-2026-09-15/brief.md`, updated 2026-10-13, commit 856b16a) into requirements that UX (`bmad-ux`), Architecture (`bmad-architecture`), and epics and stories (`bmad-create-epics-and-stories`) can build on directly. It is written for the two-person team, the instructor, and the AI agents that will design, implement, and test the game.

Vocabulary is anchored in the Glossary (§3); every requirement uses those terms exactly. Features (§4) are grouped, with functional requirements numbered globally (FR-1 …) and a testable consequence list under each. Every feature is marked **[CORE]** (MVP core) or **[EXT]** (MVP extension). Assumptions are tagged inline as `[ASSUMPTION]` and indexed in §12. Balancing numbers and the route network live in `addendum.md`; this PRD states the rules, the addendum states the values.

## 1. Vision

WORLDBOUND: NOMAD is a browser-based travel and decision game. The player leaves Bergen with €1,500 and 30 days, travels between world destinations, and has to collect at least five passport stamps and make it home before time runs out. Every choice trades time against money: the plane is fast and expensive, the bus is cheap and slow, London drains the budget faster than Istanbul, every sight is a choice between a memory and the next ticket, and a day spent working is a day not spent travelling.

The game is short, replayable, and played on the phone the player already carries — no install, no account. A journey takes one or two sittings. Losing is possible but rarely brutal: running out of money is a crisis, not game over. In the core, the way out is to call home, at a price; the MVP extension adds work and budget accommodation.

NOMAD is also the vehicle for a research goal: examining how AI agents perform across a full development cycle under human control. That goal shapes how the game is built — small, deterministic, testable rules; content as reviewable data; traceable Git history — but never at the expense of the game being a real game.

## 2. Target User

### 2.1 Jobs To Be Done

- **Functional:** play a complete, meaningful game in short sessions on a phone, without installing anything.
- **Emotional:** feel the tension of a real backpacking trip — stretching a budget, making a risky call, getting home just in time.
- **Self-expression:** plan *my* route; two players should take different journeys and compare them.
- **Learning (light):** pick up a few facts about the places visited, without the game feeling like a school quiz.

### 2.2 Primary Player

A young, budget-conscious traveler (roughly 18–30) who plays in a mobile browser — often in short gaps such as a bus ride. Screens, controls, text length, and session length are designed for this player first. PC and tablet must work, but mobile is the reference device.

### 2.3 Non-Users (v1)

- Players looking for multiplayer, competition, or leaderboards.
- Players looking for a realistic travel planner or real-world price data — prices are game values, not facts.
- Players who need an interface in another language — v1 is English only.

### 2.4 Key User Journeys

All three journeys are illustrative `[ASSUMPTION]` — written by the PM agent from the brief, to be confirmed by the team.

- **UJ-1. Ingrid makes it home with five stamps.** **[CORE]**
  Ingrid, 22, a student in Bergen, opens the game on her phone on the bus. **Entry state:** first visit, no saved journey. She reads the one-screen intro (goal, 30 days, €1,500) and starts. On the map she sees eight destinations; Copenhagen is reachable by bus (€70, 2 days) or plane (€140, 1 day). She takes the bus, spends a city day there (€90), gets her first stamp, and reads the fact card. She takes the bus on to Paris, where she spends €37 on the Eiffel Tower and the Louvre and adds two photos to her album, then on to London, flies to Rome, takes the slow bus to Istanbul, and flies home after 16 days with €423 left. **Climax:** the journey summary shows five stamps, two photos, and "Goal reached". **Resolution:** she starts a new journey to try a route via New York.

- **UJ-2. Jonas calls home from Rome.** **[CORE]**
  Jonas, 19, flies straight from Bergen to New York (€350) and enjoys three city days there, then flies to Paris, takes the train to London, and flies to Rome. After his city day in Rome he has €20 left — not enough for any transport out. **Path:** the game shows that he cannot afford to travel; "Call home" is offered with its cost: 7 days of waiting and one stamp. He accepts. **Climax:** he lands in Bergen after 17 days; the summary shows three stamps (four minus one), "Called home", and "Goal not reached". **Resolution:** he understands what went wrong and starts again. **Edge case:** had he been on day 25, calling home would have taken him past day 30; the game would have told him the journey could not be completed and ended it as failed.

- **UJ-3. Amira works a shift in Tokyo.** **[EXT]**
  Amira, 24, has just spent a city day in Tokyo, visiting Senso-ji, and has €240 left; Sydney costs €300. **Path:** she starts a five-question shift and answers five trivia questions — one is about Senso-ji, which she already knows from her album. She gets four right and earns €96 for one day. **Climax:** with €336 she can now afford Sydney. **Resolution:** she travels on with fewer days left. **Edge case:** after three shifts the destination's 15 questions are used up; the game says there is no more work in Tokyo.

## 3. Glossary

Terms are used exactly as defined. Quoted UI labels are the exact English strings the game shows.

- **Journey** — one complete game from start to end. A journey has one mode, one day counter, one money balance, and one set of stamps.
- **Mode** — the difficulty setting of a journey: **Explorer** (MVP core, the default) or **Nomad** (MVP extension, harder). A mode defines start money and number of days.
- **Home** — Bergen. Every journey starts and ends there. Home is not a destination, gives no stamp, and cannot be used as a stopover: travelling home always ends the journey (§9.5, Decision A).
- **Destination** — a city the player can visit. MVP core has 8; MVP extension adds 2. Each destination has a cost factor, a fact card, and (in MVP extension) a question sequence.
- **Route** — a connection between two places (home or destinations). A route offers one or more transport modes. Not every pair of places has a route.
- **Transport mode** — plane, train, or bus. On a given route, each transport mode has a price and a number of days.
- **Travel** — moving along a route with a chosen transport mode. Travel deducts the price and advances the day counter by the transport mode's days. No accommodation is paid while travelling.
- **Day counter** — days used in the journey, shown as "Day X of N", where X = days used + 1 (capped at N) and N is the mode's number of days. A new journey has 0 days used and shows "Day 1 of 30".
- **Days remaining** — the mode's number of days minus days used.
- **Money** — the player's balance in euros. Never below €0.
- **City day** — one day spent at a destination. A city day advances the day counter by 1 and costs the accommodation price, unless it ends with a night departure. During a city day the player may visit 0–2 sights.
- **Base accommodation price** — the game-wide price of accommodation for one city day before the cost factor.
- **Cost factor** — a per-destination multiplier for accommodation price.
- **Accommodation price** — base accommodation price × cost factor (× tier multiplier in MVP extension), rounded to whole euros.
- **Stamp** — awarded on the player's first city day at a destination. One stamp per destination per journey.
- **Goal** — at least 5 stamps and being home before days remaining run out.
- **Call home** — the emergency option when the player cannot afford any travel out of the current destination: a ticket home that costs 7 days and one stamp, but no money.
- **Journey summary** — the end screen: stamps, photo album, days used, money left, whether the goal was reached, and whether the player called home.
- **Fact card** — 2–3 sentences about a destination, shown on arrival.
- **Sight** — one of a destination's 2 attractions. A sight has a ticket price (€8–20), a photo, and a short fact. Visiting sights is optional.
- **Photo album** — the collection of sights visited in a journey: one photo and fact per sight, shown in the journey summary.
- **Accommodation tier** **[EXT]** — budget or comfort. Changes the accommodation price and the number of questions in a shift.
- **Shift** **[EXT]** — one work session at a destination: a number of trivia questions (3 or 5) that costs 1 day and pays per correct answer. A shift is not a city day: it gives no stamp and costs no accommodation.
- **Question sequence** **[EXT]** — the fixed, ordered list of 15 trivia questions belonging to a destination. Each shift takes the next questions in the sequence.
- **Night departure** **[EXT]** — a transport mode on selected routes that leaves at the end of a city day; that city day costs no accommodation.
- **Saved journey** **[EXT]** — a journey in progress stored in the browser.

## 4. Features

### 4.1 Start a Journey [CORE]

**Description:** The player starts a new journey from the start screen. A first-time player sees a one-screen intro explaining the goal, the days, and the money before the map. Realizes UJ-1.

#### FR-1: Start a new journey

The player can start a new journey in Explorer mode. Realizes UJ-1.

**Consequences (testable):**
- A new Explorer journey starts at home with €1,500, 0 days used, 30 days total, and 0 stamps.
- Starting a new journey discards any journey in progress after the player confirms. [EXT: applies once saved journeys exist]

#### FR-2: First-time intro

The player sees a single intro screen before their first journey. Realizes UJ-1.

**Consequences (testable):**
- The intro states the goal (5 stamps, home within the days), the start money, and the number of days.
- The intro is shown before the first journey on a device and can be reopened from the menu. [ASSUMPTION: "first" detected via browser storage; if storage is unavailable, the intro is shown every time]

### 4.2 Map and Destinations [CORE]

**Description:** The map is the main screen. It shows home, the destinations, the player's position, and which destinations have stamps. Selecting a destination shows the routes from the current position to it. Europe is the hub, where plane, train, and bus compete on most routes; New York, Tokyo, and Sydney are far goals reached by plane. Realizes UJ-1, UJ-2.

#### FR-3: Show the map

The player can see home, all destinations, their current position, and their stamps on the map.

**Consequences (testable):**
- MVP core shows exactly home + 8 destinations: Copenhagen, Paris, London, Rome, Istanbul, New York, Tokyo, Sydney.
- Destinations with a stamp are visibly marked, and not by color alone.
- The day counter, days remaining, money, and stamp count are always visible on the map screen.

#### FR-4: Show routes from the current position

The player can see every route from the current position, with each transport mode's price and days.

**Consequences (testable):**
- Only routes defined in the route data are shown; places without a route from the current position cannot be selected as a travel target.
- Each transport mode shows its price in euros and its number of days.
- Transport modes the player cannot afford, or whose days exceed days remaining, are shown as unavailable with the reason.
- If, after a travel option, home can no longer be reached within the days remaining (shortest route home in days, ignoring money), the option shows a warning; it is not blocked.

#### FR-5: Show a fact card on arrival

The player sees the destination's fact card when arriving at a destination.

**Consequences (testable):**
- Each of the 8 core destinations has a fact card of 2–3 sentences in English.
- The fact card can be reopened while the player is at the destination.

### 4.3 Travel [CORE]

**Description:** Travel moves the player along a route. The choice between plane, train, and bus is the main time-versus-money decision. Travel to home ends the journey, so the game asks for confirmation. Realizes UJ-1, UJ-2.

#### FR-6: Travel along a route

The player can travel along a route from the current position using one of its transport modes.

**Consequences (testable):**
- Travel deducts exactly the transport mode's price and adds exactly its days to days used.
- After travel, the player's position is the route's other end.
- Travel is rejected when the price exceeds money or the days exceed days remaining; state is unchanged.

#### FR-7: Travel home ends the journey

The player can travel home, which ends the journey after confirmation.

**Consequences (testable):**
- Before travel home, the game shows the current stamp count and whether the goal will be reached, and asks for confirmation.
- Arriving home ends the journey and shows the journey summary (FR-14).

### 4.4 City Days and Money [CORE]

**Description:** Staying at a destination costs a city day: one day plus the accommodation price, which depends on the destination's cost factor. During the city day the player may visit sights (§4.5). Money can never go below zero; anything the player cannot afford is unavailable rather than allowed into debt. Realizes UJ-1, UJ-2.

#### FR-8: Spend a city day

The player can spend a city day at the current destination.

**Consequences (testable):**
- A city day deducts the accommodation price (base accommodation price × cost factor, rounded to whole euros) and adds 1 day to days used.
- A city day is unavailable when money is below the accommodation price or days remaining is 0.
- A city day is not possible at home (arriving home ends the journey).

#### FR-9: Money never goes below €0

**Consequences (testable):**
- No action in the game can result in money below €0.
- Every action whose cost exceeds money is shown as unavailable with the reason.

### 4.5 Sights and Photo Album [CORE]

**Description:** Each destination has 2 sights. During a city day the player may visit none, one, or both, paying the ticket for each. A visited sight adds its photo and fact to the photo album. Sights are optional and never required for the goal; they compete with travel for money. Realizes UJ-1, UJ-3.

#### FR-21: Visit sights

The player can visit 0–2 of the current destination's sights as part of a city day.

**Consequences (testable):**
- Visiting a sight deducts its ticket price; visiting sights adds no days beyond the city day itself.
- A sight is unavailable when the money left after the city day's accommodation price is below its ticket price.
- Each of the 8 core destinations has exactly 2 sights, each with a ticket price between €8 and €20, a photo, and a fact in English.

#### FR-22: Photo album

The player can view the photo album during the journey and in the journey summary.

**Consequences (testable):**
- Each visited sight appears in the photo album exactly once per journey, with its photo and fact; revisiting a sight adds nothing and costs nothing extra. [ASSUMPTION: an already visited sight is not offered again]
- The photo album is empty at the start of a journey.

### 4.6 Stamps and Goal [CORE]

**Description:** A stamp is the proof of a visit. It requires at least one city day, so the player cannot collect stamps by passing through. Realizes UJ-1.

#### FR-10: Earn a stamp

The player earns a stamp on their first city day at a destination.

**Consequences (testable):**
- The first city day at a destination adds one stamp; later city days or later visits to the same destination add none.
- Home never gives a stamp.
- Arriving at a destination without spending a city day gives no stamp.

#### FR-11: Goal evaluation

The game evaluates the goal when the journey ends.

**Consequences (testable):**
- The goal is reached if and only if the player arrives home with at least 5 stamps and days used ≤ the mode's days.
- Stamps removed by call home (FR-12) are not counted.

### 4.7 Call Home [CORE]

**Description:** Call home is the safety net when money runs out. It always brings the player home, but costs a week of waiting and a stamp, so it is never better than buying a ticket. Realizes UJ-2.

#### FR-12: Call home

The player can call home when they cannot afford any travel out of the current destination.

**Consequences (testable):**
- Call home is offered if and only if the player is at a destination and money is below the cheapest transport mode on every route from it.
- The offer shows its cost before the player confirms: 7 days and one stamp.
- Call home adds 7 days to days used, removes one stamp (if the player has any), costs no money, and moves the player home.
- If 7 days exceed days remaining, call home cannot bring the player home in time; the game says so and the journey ends as failed (FR-13).
- The journey summary marks the journey as "Called home".
- Which stamp is removed does not affect the goal; the most recently earned stamp is removed. [ASSUMPTION]

### 4.8 Journey End and Summary [CORE]

**Description:** A journey always ends in exactly one way and always shows a summary. The player must never be stuck in a state with no available action. Realizes UJ-1, UJ-2.

#### FR-13: End the journey

**Consequences (testable):**
- The journey ends when the player arrives home (by travel or call home), or when the player has no available action: no affordable travel that fits days remaining, no affordable city day, and no call home that fits days remaining.
- A journey that ends away from home is failed.
- When the journey ends, no further actions are possible except viewing the summary and starting a new journey.

#### FR-14: Journey summary

The player sees a journey summary when the journey ends.

**Consequences (testable):**
- The summary shows stamps (with destination names), the photo album, days used, money left, "Goal reached" or "Goal not reached", and "Called home" when relevant.
- The summary offers "New journey".

### 4.9 Work [EXT]

**Description:** Work turns days into money. A shift is a short trivia quiz in English; pay depends on correct answers. Each destination has a fixed sequence of 15 questions, so results are reproducible and testable, and work at one destination is limited. Realizes UJ-3.

#### FR-15: Work a shift

The player can work a shift at the current destination.

**Consequences (testable):**
- A shift presents the next 3 questions (budget tier) or 5 questions (comfort tier) from the destination's question sequence. Until accommodation tiers exist (§9.2), every shift presents 5 questions. The tier of the player's most recent city day at this destination applies.
- Work is unavailable at a destination where the player has not spent a city day in this journey (§9.5, Decision C).
- Each question is multiple choice with 4 options and exactly one correct answer; the correct answer is shown after each question.
- A shift adds 1 day to days used and pays €24 per correct answer (example value — see addendum).
- A shift is unavailable when days remaining is 0, or when fewer questions remain in the sequence than the shift needs. [ASSUMPTION: a partial shift is not offered]

#### FR-16: Question sequence

**Consequences (testable):**
- Each destination has exactly 15 questions in a fixed order; 2 of them are about the destination's sights, and their answers appear in those sights' facts.
- Within a journey, each question is asked at most once; the next shift starts where the previous one stopped.
- When the sequence is used up, the game states that there is no more work at that destination.

### 4.10 Accommodation Tiers [EXT]

**Description:** Two accommodation tiers replace the single core price: budget is cheaper, comfort costs more but gives longer, better-paid shifts. Realizes UJ-3.

#### FR-17: Choose an accommodation tier

The player chooses budget or comfort when spending a city day.

**Consequences (testable):**
- Budget and comfort each have a tier multiplier applied to the accommodation price (values in addendum).
- The chosen tier determines the shift length at that destination (FR-15).

### 4.11 Night Departures [EXT]

**Description:** Selected routes have a night departure — a night bus, night train, or overnight flight. Leaving on one ends the city day without paying accommodation, which saves money at the cost of a fixed, often pricier ticket.

#### FR-23: Leave on a night departure

The player can end a city day by leaving on a night departure from the current destination.

**Consequences (testable):**
- Only transport modes marked as night departures in the route data offer this option.
- The city day still costs 1 day and still gives the stamp and any sights visited; only its accommodation price is not charged.
- The night departure then deducts its price and adds its days, like any travel (FR-6).

### 4.12 Nomad Mode [EXT]

#### FR-18: Choose a mode

The player can choose Explorer or Nomad when starting a journey.

**Consequences (testable):**
- Nomad uses the same goal and rules as Explorer, with less start money and/or fewer days (values in addendum).
- The journey summary shows which mode was played.

### 4.13 Two More Destinations [EXT]

#### FR-19: Madrid and Cape Town

**Consequences (testable):**
- MVP extension adds Madrid and Cape Town as destinations with cost factors, routes, fact cards, sights, and question sequences, for 10 destinations, 20 sights, and 150 questions in total.

### 4.14 Save and Resume [EXT]

#### FR-20: Save automatically

**Consequences (testable):**
- The journey is saved in the browser after every completed action.
- Reopening the game offers "Continue journey" or "New journey" when a saved journey exists.
- A saved journey that cannot be read is discarded with a message; the game does not crash.

## 5. Cross-Cutting NFRs

- **NFR-1 Determinism:** given the same content data and the same sequence of player actions, the game reaches exactly the same state. No randomness in the MVP.
- **NFR-2 Testability:** game rules are implemented separately from the user interface, so every FR consequence for the rules (FR-1, FR-6 – FR-18, FR-21 – FR-23) can be tested automatically without a browser.
- **NFR-3 Runs locally:** the game runs locally in a browser by following the README, with no accounts, API keys, paid services, or required backend. Any external service added later is optional: the game still runs without it, its keys live in `.env` (documented in `.env.example`, never committed), and automated tests use a mock instead of the live service.
- **NFR-4 Mobile first:** a full journey can be played on a 375 px-wide viewport without horizontal scrolling; it also works on tablet and PC.
- **NFR-5 Accessibility basics:** readable text on mobile, touch targets of at least 44 × 44 px, and information never conveyed by color alone. No formal WCAG certification.
- **NFR-6 Language:** all player-facing text, including fact cards, sights, and trivia, is in English, as are planning documents and code.
- **NFR-7 Content as data:** destinations, routes, prices, cost factors, fact cards, sights, and trivia are stored as data files separate from game code and can be changed without code changes. Graphics and sight photos live in their own assets folder. Test data (fixed game states and small test routes) lives with the automated tests, not in the game content files.
- **NFR-8 Content quality:** every fact card and trivia question is fact-checked by a team member and reviewed for stereotypes before it is merged; the reviewer is recorded in the Git history. Every sight photo is made by the team, AI-generated, or freely licensed, and its source and license are recorded with the content. Placeholder photos (typically AI-generated) are allowed in the MVP core and follow the same source and license rule; they can be replaced later without code changes (NFR-7, §9.5 Decision B).
- **NFR-9 No personal data:** the game collects and sends no personal data. Browser storage holds only game state and the intro flag.

## 6. Development Process Constraints

These serve the research goal and apply to how the product is built.

- Major features are developed through the BMAD chain (PRD → architecture → epics and stories) and implemented with Claude Code.
- Prompts and AI sessions for major features are stored in the repository.
- Every change reaches `main` through a pull request reviewed by the other team member.
- AI-generated code is not merged without passing automated tests and human review.
- The team can explain how AI was used, what it produced, what went wrong, how output was evaluated, and what humans changed or approved.
- Both team members can speak to testing, QA, and evaluation of AI-generated work — not only their own feature area.

## 7. Aesthetic and Tone

- **Visual direction:** world map, compass, travel routes, transport icons, passport and stamps; a sense of adventure with a clean, modern feel. The stamp and the photo album are the visual rewards. A logo and visual identity carry across the game, presentations, and documentation. Details belong to `bmad-ux`, which starts with sketches of the two key mobile screens: the map (choose destination and route) and the city day (accommodation, sights, travel on).
- **Voice:** short, warm, slightly playful English. Consequences are stated plainly before the player commits ("This costs 7 days and one stamp").
- **Anti-references:** no casino-style rewards, no pressure mechanics (timers, streak punishments), no stereotyped depictions of places or people.

## 8. Non-Goals (Explicit)

- Not a real travel planner: prices, routes, and times are game values, not real data.
- No multiplayer, leaderboards, or social features.
- No accounts, cloud saves, or backend in the MVP.
- No real-money payments, ads, or in-app purchases.
- No native mobile app.
- No randomness in the MVP (random events are post-MVP).
- No languages other than English in v1.

## 9. MVP Scope

The MVP is MVP core + MVP extension. The core is built and stabilized first; the extension is added on top.

### 9.1 MVP Core

FR-1 – FR-14, FR-21 – FR-22: start a journey with intro, map with home + 8 destinations and fact cards, travel by plane/train/bus, city days with cost factors, sights and photo album, money never below €0, stamps and goal, call home, journey end and summary — Explorer mode only. Plus NFR-1 – NFR-9.

### 9.2 MVP Extension

Built only after the core passes its tests and a playtest, one item at a time; each item is finished and tested before the next starts.

**Planned, in this order:**
1. Work — FR-15, FR-16
2. Save and resume — FR-20
3. Nomad mode — FR-18

**If time allows, in this order:**

4. Accommodation tiers — FR-17 (until then, every shift has 5 questions) [ASSUMPTION]
5. Night departures — FR-23
6. Madrid and Cape Town — FR-19

### 9.3 Decision: Time in the Core

In the MVP core, time is deliberately roomy: winning journeys use 14–16 of 30 days, and money is the binding constraint (addendum §6). Time only binds at about 14 days, which would give up the 30-day journey. The MVP extension makes time scarce: work turns spare days into money, so every day spent travelling or sightseeing is a day not earned. **Given up:** a core where time already hurts. **Revisit:** after the first playtest (SM-2) — if players never feel the clock, test fewer days or slower routes.

### 9.4 Out of Scope for MVP

- Random events, skills and progression, trade and souvenirs, dynamic pricing, more transport consequences, more destinations, in-game AI travel assistant — post-MVP; pick one at a time. If the AI travel assistant is added, it is optional and follows NFR-3: the game runs without an API key, and tests use a mock.
- Items from the source document: inventory comes with trade and items (post-MVP); the travel journal is covered by stamps and the photo album; a player profile is not needed without accounts (§8); progression comes with skills (post-MVP).
- `[NOTE FOR PM]` Skills are the most requested post-MVP item in the team notes; revisit first if the MVP finishes early.

### 9.5 Decisions Before Development (2026-10-13)

- **A. Bergen is start and end point only.** Home has a direct plane route to every destination (addendum §4); allowing stopovers would make it a hub that bypasses Europe's plane/train/bus choices and would need a separate "end journey" rule. Travelling home always ends the journey (FR-7).
- **B. All 16 sights stay in the MVP core, with placeholder photos.** UJ-1, FR-21/22, SM-3, and the sight questions in FR-16 depend on them. The cost lies in photos and licensing, not facts, so the first version uses placeholder photos under NFR-8, swapped later via the assets folder.
- **C. Work has a fixed time cost; accommodation affects pay, not time.** A shift always costs 1 day. The accommodation tier sets shift length and thus pay (FR-15, FR-17). Work requires a city day at the destination in the current journey (confirmed rule, formerly an assumption).

## 10. Success Metrics

**Primary**
- **SM-1 Rules are verified:** every testable consequence of FR-1, FR-6 – FR-14, and FR-21 – FR-22 has at least one automated test, and all pass. Validates FR-1, FR-6 – FR-14, FR-21, FR-22.
- **SM-2 A first-time player can finish:** at least 4 of 5 first-time playtesters complete a journey on a phone without help from the team. Validates FR-2 – FR-14, NFR-4.
- **SM-3 The goal is reachable with real choices:** in Explorer mode without work or sights, at least 3 different sets of 5 destinations can reach the goal; with a full photo album, at least 1 set can; and no journey that reaches 6 stamps fits within €1,500 (verified by a balance test over the content data). Validates FR-6, FR-8, FR-11, FR-21.

**Secondary**
- **SM-4 Runs for others:** a person outside the team can run the game locally from the README in under 10 minutes. Validates NFR-3.
- **SM-5 Traceable process:** every major feature has a pull request with linked prompts/AI session, test results, and a human review. Validates §6.

**Counter-metrics (do not optimize)**
- **SM-C1 Feature count:** do not add extension or post-MVP features to raise the feature count while core tests or the playtest fail. Counterbalances SM-1, SM-2.
- **SM-C2 Ease:** do not lower prices until every player wins; a journey that ignores costs should fail. Counterbalances SM-2, SM-3.
- **SM-C3 Test count:** the number of tests is not a goal; coverage of rule consequences is. Counterbalances SM-1.

## 11. Open Questions

1. **Tokyo and Sydney in the core.** With the proposed prices, no winning core journey includes Tokyo or Sydney; they become reachable once work exists. Keep this as a deliberate "far destinations need work" design, or lower long-haul prices?
2. **Nomad values and night departures.** Proposed Nomad: €1,000 and 30 days. Night departures make the game easier (6 stamps become reachable without work); prices for both are checked with the balance test once work exists.
3. **Content ownership and team split.** Who writes and fact-checks the fact cards (8, then 10), the sights with photos (16, then 20), and the 150 trivia questions? How is the remaining work split by feature area — to be settled with the epics.
4. **AI travel assistant.** Reserve architectural room for it now, or treat it as fully deferred? Currently fully deferred.

## 12. Assumptions Index

- §2.4 — UJ-1, UJ-2, UJ-3 are illustrative journeys written from the brief.
- FR-2 — "first visit" is detected via browser storage; without storage, the intro shows every time.
- FR-12 — call home removes the most recently earned stamp.
- FR-22 — an already visited sight is not offered again in the same journey.
- §9.2 — until accommodation tiers exist, every shift has 5 questions.
- FR-15 — partial shifts are not offered when too few questions remain.
- Addendum — all prices, days, cost factors, the base accommodation price, sight names and ticket prices, night departure routes, tier multipliers, and Nomad values are proposals to be confirmed by the balance test and playtests.
