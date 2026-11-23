# Epic 2 Context: City days, stamps and sights

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

The player stays at destinations instead of just passing through: a city day costs a stay and a day, earns the destination's stamp the first time, and lets the player visit up to 2 sights that fill a photo album. Each destination gets a short fact card shown on arrival. This turns travel into real choices, because sights and stays compete with the next ticket for the same money. The epic adds the `spendCityDay` rules action, the sight and fact-card content (with a three-step fact-check and licence process), and the Arrival, City day, Day complete and Passport/Album screens.

## Stories

- Story 2.1: City day, stamps and sights (rules)
- Story 2.2: Fact cards and sight content (content)
- Story 2.3: Arrival fact card (UI)
- Story 2.4: City day screen and day complete (UI)
- Story 2.5: Passport, stamps and photo album (UI)

## Requirements & Constraints

- A city day deducts the accommodation price (€50 base × the destination's cost factor, whole euros, halves round up) and adds 1 day. It is unavailable when money is below that price or 0 days remain, and impossible at home.
- Fixed order, applied as one action: (1) stay + 1 day + stamp if this is the first city day at the destination; (2) 0–2 chosen sights paid from the money left; (3) the day is over. No sight can be bought for a day that is over.
- A sight is unavailable (`NOT_ENOUGH_MONEY`) when the money left after the stay is below its price. If any step fails, the whole action is rejected and state is unchanged. Sights add no extra days. Money never goes below €0.
- Stamps: only the first city day at a destination gives one. Later city days, arriving without a city day, and home give none.
- Album: each visited sight appears exactly once per journey, with photo and fact, and the album starts empty. A sight already in the album is rejected with `ALREADY_IN_ALBUM` if chosen again and does not count toward the 2-sight limit. Viewing it again is free and changes nothing (no money, days, stamp or reward).
- Content: each of the 8 core destinations has a 2–3 sentence English fact card (reopenable while there) and exactly 2 sights priced €8–20, each with name, fact, image path, `imageAlt`, `source`, `author` and `licence`. Sight names and prices are fixed game values, not real prices (e.g. Paris: Eiffel Tower €20, Louvre €17).
- Content quality: an AI agent drafts, a second AI agent fact-checks and its report (flagged, corrected, unverifiable) is saved with the PR. Christian Storum then does the final check of facts, stereotypes and photo licences (including the pending Tivoli fact), recorded in the PR separately from the other member's review.
- Photos are repo files (never hotlinks) from free sources (Wikimedia Commons, Unsplash, Pexels) or AI-generated. Never copy them from ordinary web pages. Placeholders are allowed under the same rule. Replacing a file at the same path needs no code change.

## Technical Decisions

- **Action:** `spendCityDay({ sightIds })` goes through the single `apply` path. AD-6 also names an `ending` field, which is only for [EXT] tiers and night departures, so core ignores it. The logic lives in `src/rules/cityDay.ts`. End rules are still evaluated inside `apply` after success.
- **Pricing:** `accommodationPrice()` in `src/rules/money.ts` is the only place a cost factor is multiplied. It uses integer hundredths: `Math.floor((n + 5000) / 10000)`. Never round a float product. A .50 test fixture must round up.
- **Queries:** city-day availability and reason, per-sight availability and reason, the running total of the draft ("End the day — €X") and the "Money's tight" condition come from `src/rules/queries.ts`, sharing the check function with `apply`. The UI computes none of them. "Money's tight" means money after today is below the cheapest fare out; this threshold is still marked as an assumption.
- **Reasons:** reuse or extend the closed `ReasonCode` union (`NOT_ENOUGH_MONEY`, `NOT_ENOUGH_DAYS`, `AT_HOME`, `ALREADY_IN_ALBUM`, `JOURNEY_ENDED`). Tests assert codes.
- **State:** `stamps` and `album` are ordered arrays of `{ id, day }` (last = most recent). `cityDays` counts city days per destination and drives the first-visit and repeat logic.
- **Content data:** add `content/sights.json` (`id`, `destId`, `name`, `price`, `fact`, `image`, `imageAlt`, `source`, `author`, `licence`). Destinations gain `fact`, plus `streetDrawing` and `stampAngle` for the UI. Sight ids are lowercase kebab (`copenhagen-tivoli`). Extend the zod schema and the content test to enforce count, price range, licence fields and the fact length. Images go in `public/assets/sights/{sightId}.webp|svg` (the sight id already carries the destination prefix, so `copenhagen-tivoli.webp`; #40) (4:3, master 800 × 600), and street drawings in `public/assets/streets/{destId}.svg`.
- **Tests:** rules `describe` blocks start with FR ids (FR-8, FR-9, FR-10, FR-21, FR-22). Use the small fixtures in `tests/fixtures/`.

## UX & Interaction Patterns

- **Arrival fact card:** a sheet over the street drawing that opens automatically after every trip to a destination. It shows "You've arrived · Day X of N · €money", the fact card, the cost line, "Plan the day" and "Just passing through". On a repeat visit it uses the repeat copy and drops the no-stamp line. When a city day is unavailable, "Plan the day" is shown unavailable with its reason. "About <City>" on the map's city-day card reopens it in read mode, with no buttons.
- **City day:** a planning screen with the stay always included. The player toggles sights on and off (`aria-pressed`, price in the name, max 2), and the running total is announced politely. Unaffordable sights show "Not enough left after your stay — you'd have €N". A sight already in the album shows "In your album", cannot be selected, and opens its Polaroid sheet when tapped. "‹ Map" discards the draft and charges nothing. Nothing is committed before "End the day".
- **Day complete:** on a first visit the stamp lands (≤ 600 ms, ease-out, instant under reduced motion, `aria-hidden`). Focus moves to the headline, which announces the stamp. A repeat visit has no stamp moment. "New in album" lists new polaroids and is hidden when no sights were visited. The screen offers "Back to the map" and "View album".
- **Passport:** Stamps and Album tabs. Five slots fill in earn order, each with city and "Day N". Empty slots are numbered, and the next one is marked "Next city day". On the map, a stamped city is marked by shape/icon plus text, never colour alone. The empty album shows a dashed "Your next photo goes here" tile. Polaroids open a read-only Polaroid sheet that closes back to whatever opened it.
- All text comes from `copy.ts` under the copy keys (`arrival`, `arrival.repeat`, `cityday`, `cityday.repeat`, `cityday.sightUnavailable`, `cityday.tight`, `dc.first`, `dc.repeat`, `dc.actions`, `map.card`, `a11y`). Each screen change moves focus to the new `h1`.

## Cross-Story Dependencies

- 2.1 builds on 1.3 (`GameState`, `apply`, types) and 1.4 (queries, travel). Arriving home already evaluates the goal from stamps, so 2.1 is what makes "goal reached" reachable.
- 2.2 extends the content schema and loader from 1.2. UI stories 2.3–2.5 need its fact and sight data (placeholders allowed) and the street drawings.
- 2.3–2.5 render inside the Map, sheet and store foundation from Stories 1.5–1.7, and read 2.1's queries. 2.4 needs 2.1's running-total and availability queries. 2.5 adds stamp marking to the map from 1.6.
- The album and stamps are reused by Epic 3 (call home removes the most recent stamp, and the summary shows the album). Epic 7 [EXT] adds tiers and night departures to `spendCityDay` and `accommodationPrice()`.
