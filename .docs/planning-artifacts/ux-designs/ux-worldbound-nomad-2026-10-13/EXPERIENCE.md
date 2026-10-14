---
name: 'WORLDBOUND: NOMAD'
title: WORLDBOUND: NOMAD — Experience
status: final
updated: 2026-10-14
sources:
  - ../../prds/prd-worldbound-nomad-2026-10-12/prd.md
  - ../../prds/prd-worldbound-nomad-2026-10-12/addendum.md
---

# WORLDBOUND: NOMAD — Experience

> Behaviour spine. Visual identity lives in [DESIGN.md](DESIGN.md), and tokens are referenced as `{path.to.token}`. Requirements are cited by PRD number (FR-n, NFR-n, UJ-n), not restated. Glossary terms follow PRD §3. **The spines win on conflict with any mockup** (for files and frames, see Visual References). Every surface and pattern is tagged **[CORE]** (MVP core, PRD §9.1) or **[EXT]** (MVP extension, PRD §9.2).

## Foundation

| Aspect | Decision |
|---|---|
| Form factor | Mobile-first browser game. The reference viewport is `{spacing.viewport-ref}` (375 px) with no horizontal scroll. Tablet and PC must work (NFR-4). No native app (PRD §8). |
| UI framework | **None decided.** Architecture (`bmad-architecture`) chooses it. These spines are framework-neutral. |
| Rules vs UI | The UI only displays and triggers rule outcomes (NFR-2). Availability, reasons, warnings, the Call home offer and the end of the journey are all queries on the rules layer; the UI never computes them. See State Model. |
| URL | One URL, single page. No per-screen URLs and no deep links. Screen and sheet changes push history entries on the same URL so the browser Back button and the Android Back button work (IA → Back navigation). |
| Persistence | [CORE] Device storage holds only the intro flag and the last traveller name (NFR-9). There is no saving: a reload returns to the Start screen and the journey is lost, with no unload warning. [EXT] The journey is saved after every committed action (FR-20). No account and no network after load (NFR-3). |
| Colour mode | Light and dark, following the device setting. There is no in-game toggle. |
| Language | English for all player-facing text (NFR-6). `lang="en"` on the document. |

## Information Architecture

Type: **screen** (full screen), **sheet** (modal sheet, IA depth 1), **view** (replaces part of a screen in place). Top stack: **full** means the logo row, the status chips and the passport (the strip on the Map, the full cover elsewhere).

| Surface | Tag | Type | Top stack | Reached from | Purpose (FR) | Reference |
|---|---|---|---|---|---|---|
| Start screen | [CORE] | screen | logo only | App open; "New journey" (summary, menu confirm) | Logo, tagline, optional name, "New journey", "How to play" (FR-1) | core S1; ext-1 X1a |
| Start · mode choice | [EXT] | part of Start | — | — | Explorer / Nomad mode cards (FR-18) | ext-1 X1a |
| Start · saved journey | [EXT] | part of Start | — | App open with a saved journey | "Welcome back" card, "Continue journey", "New journey" (FR-20) | ext-1 X1b, X1c |
| Intro ("How to play") | [CORE] | screen | logo only | First "New journey" on a device; "How to play" on Start; Menu | Goal, money, days, three steps (FR-2) | core S2 |
| Map | [CORE] | screen (root) | full, strip | After the intro or Start; "Back to the map"; "‹ Map"; "Continue journey" | Position, stamps, status, region loupe, city-day card, resting panel (FR-3, FR-4, FR-5) | core MAP-C; ext-2 X3a-R; final DM1 |
| Zoomed region | [CORE] | view (map area) | full, strip | Tap a zoomable loupe | Thumb-sized city pills for the current region (FR-3, FR-4) | core MAP-Z |
| Route sheet | [CORE] | sheet | full (inert) | Tap a destination marker, city pill, arrow pill or destination chip | Transport modes with price, days, arrival day; reasons; home-unreachable warning (FR-4, FR-6) | city-day MAP-1 (sheet panel only); final DM2, DM2-w, CH1a |
| Travel home sheet | [CORE] | sheet (swap) | full (inert) | "Continue · €X" on a route to Bergen | Stamp count, goal outcome, "ends when you land" confirm (FR-7, FR-11) | core H1, H2 |
| Call home sheet | [CORE] | sheet | full (inert) | Opens automatically on the Map; "Call home" on the city-day card or route sheet | Cost (7 days, one stamp) before confirming (FR-12) | final CH1b |
| Can't-continue sheet | [CORE] | sheet, no close | full (inert) | The rules layer ends the journey away from home | Says why, then "See your journey" (FR-12, FR-13) | final CH2 |
| Arrival fact card | [CORE] | sheet over the street drawing | full (inert) | Automatically after travel to a destination; "About <City>" (read mode) | Fact card plus the city-day decision (FR-5, FR-10) | core F1 (layout) + F2 (drawing) |
| City day | [CORE] | screen | full, cover | "Plan the day" | Stay, 0–2 sights, running total, "End the day" (FR-8, FR-21) | city-day CD1, CD1b, CD2b |
| City day · end-of-day choice | [EXT] | part of City day | — | — | Budget / Comfort / Leave tonight (FR-17, FR-23) | ext-2 X2; ext-1 X2b |
| Day complete | [CORE] | screen | full, cover | "End the day" | The stamp lands; day summary; new polaroid (FR-10, FR-22) | city-day CD2 |
| Passport (Stamps / Album tabs) | [CORE] | screen | logo row + "‹ Map" + status line | Strip or cover (Stamps); Menu → "Album", "View album" (Album) | Stamps with city and day; polaroids with facts (FR-10, FR-22) | core P1, P2 |
| Polaroid sheet | [CORE] | sheet | (as opener) | Tap any polaroid or Album line; "You saw this in your album" [EXT] | One photo plus its fact | — (spine only) |
| Journey summary | [CORE] | screen (terminal) | logo + menu | Landing home; Call home; "See your journey" | Name, stamps, album, days, money, goal, "Called home", "New journey" (FR-13, FR-14) | core J1, J2; final CH3 |
| Menu sheet | [CORE] | sheet | (as opener) | Menu button | "How to play", "Album", "New journey" (with confirm); [EXT] "Sound" toggle (FR-24) | core MENU |
| Work a shift (city-day card) | [EXT] | part of Map | — | Map, after a city day here | Shift offer: days, questions, max pay (FR-15) | ext-2 X3a-R; ext-1 X3a |
| Shift (question) | [EXT] | screen | full | "Start a shift" | One question at a time with feedback (FR-15, FR-16) | ext-1 X3b, X3c |
| Shift result | [EXT] | screen | full, cover | After the last answer | Pay, day, what it unlocks, work left (FR-15, FR-16) | ext-2 X3d |
| City-map inset | Deferred | — | — | — | Not in the MVP | ext-2 X3a-C (reference only) |

Reference prefixes: core = [mockups/screens-core.html](mockups/screens-core.html), city-day = [mockups/city-day.html](mockups/city-day.html), ext-1 = [mockups/screens-ext-1.html](mockups/screens-ext-1.html), ext-2 = [mockups/screens-ext-2.html](mockups/screens-ext-2.html), final = [mockups/screens-final.html](mockups/screens-final.html).

**Navigation model.** The Map is the root. Everything else is a sheet over the current screen, a view inside the Map, or a full screen that returns to the Map. There is no tab bar. Sheets go **one level deep**: a sheet may *replace* its own content (route sheet → Travel home; menu list → Confirm block), but sheets never stack, except that the Call home sheet opens over the route sheet, which stays visible behind it. The menu button is on every screen. Once the journey has ended, the menu offers only "How to play" and "New journey" (FR-13).

### Back navigation

Nothing is charged until the player taps a commit button. Esc, the browser Back button and the Android Back button do the same thing.

| Where | Visible back control | Esc / browser back |
|---|---|---|
| Any sheet open | × (top right), plus the sheet's safe action | Closes the topmost sheet (the safe outcome). On a swapped sheet, "Not now" / "Keep my journey" go one step back to the previous content; × and scrim close the sheet. |
| Can't-continue sheet | None | Does nothing; only "See your journey". |
| Map, nothing open | — | Stays on the Map (the Map is the root while a journey runs). |
| Zoomed region | "Back to world" | Back to the world map; focus returns to the loupe button. |
| City day | "‹ Map" | Back to the Map; the draft (sights, choice) is discarded. |
| Day complete | "Back to the map" | Back to the Map. [EXT] After a night departure: to the next Arrival fact card. |
| Passport | "‹ Map" | Back to the screen it was opened from (Map or Day complete). |
| Intro | First visit: none. Reopened: × | First visit: back to Start. Reopened: back to where it was opened. |
| Shift (question) [EXT] | None | Does nothing: answers are committed, and the shift ends on its result screen. |
| Shift result [EXT] | "Back to the map" | Back to the Map. |
| Journey summary | None | Does nothing; the only way on is "New journey". |
| Start | — | Browser default. |

## Voice and Tone

Microcopy rules. Brand posture lives in DESIGN.md → Brand & Style.

| Rule | Do | Don't |
|---|---|---|
| State the cost before the commit (PRD §7) | "A city day here costs €80 and 1 day, and earns your Paris stamp." | Reveal the cost after the tap |
| Always give the reason for "unavailable" in plain words | "Not enough left after your stay — you'd have €19" | "Unavailable", greyed out with no reason |
| Say what happened, calmly, and point forward | "Next time, keep enough for a ticket out before your last city day." | "GAME OVER", "Failed!", red banners |
| Short, warm, slightly playful | "A full day, well spent." / "A good day's work." | Hype, "Awesome!!!", emoji |
| No pressure and no guilt | "You still have 15 days, enough for more city days if you want them." | Countdowns, "Hurry!", "Don't miss out" |
| Empty states say what to do next | "Your next photo goes here" | "0 photos — you haven't visited any sights" |
| Use the glossary terms and addendum §7 strings exactly | "Goal reached", "Called home", "Continue journey", "Day 6 of 30" | "Mission accomplished", "Resume", "D6" |
| Player-facing words for glossary terms | "stay" is the word for accommodation ("Budget stay", "stay €80"); "N days left" is the label for Days remaining | Mixing "accommodation" and "stay" on screen |
| Address the player as "you". The name appears only where this spec places it | "What an adventure, Ingrid." | Using the name in every line |

### Copy templates

Variables are in `{braces}`. Values come from the rules layer or content data; the UI only formats them.

| Format rule | Output |
|---|---|
| `{money}`, `{price}` | "€" + whole euros with a comma for thousands: "€1,270", "€90". No decimals (prices round halves up, FR-8). |
| `{days}` | "1 day" / "{n} days". Fare tags may show "1 d" visually; the accessible text is always "1 day". |
| `{day}` (day counter) | `min(daysUsed + 1, N)`: a journey starts at "Day 1 of 30" and never shows "Day 31". |
| `{left}` (days left) | "{n} days left" / "1 day left" / "No days left". |
| `{stamps}` | "No stamps" / "1 stamp" / "{n} stamps". Counts "{n}/5" (shows "6/5" past the goal [EXT]). |
| `{toGoWord}` | 5 − stamps, spelled out at sentence start: "One" … "Four". |
| `{verb}` (by transport mode) | Plane "Take the plane", Train "Take the train", Bus "Take the bus". Home: "Fly home", "Take the train home", "Take the bus home". Night [EXT]: "Board the plane / train / bus". |
| `{name}` | The trimmed traveller name, or "Traveller". "{name}'s journey" only when a name is set; otherwise "Your journey". |
| `{modeWord}` | "explorer" / "nomad". |

| Key | Template | Notes |
|---|---|---|
| **Start / intro** | | |
| start.tagline | "Round trip or one-way ticket?" | |
| start.name | "Your name" · "optional" · placeholder "Traveller" · counter "{count}/14" | At the limit, announce "14 characters, the maximum." |
| start.ext | "Choose your trip" · "The classic trip" · "Tighter budget, same goal" · "Welcome back" · "Starting over replaces this journey. We'll ask first." | [EXT] |
| start.unreadable | "We couldn't read your saved journey, so it's been cleared. Fresh start!" | [EXT] |
| start.storageOff | "This browser can't save your journey." | [EXT] [ASSUMPTION] |
| menu.sound | "Sound" · "On" / "Off" · sub-line "Short effects, no music" | [EXT] FR-24 |
| intro | "Collect 5 passport stamps and get home to Bergen within {N} days." · "Let's go" (first visit) · "Back to my journey" (reopened in a journey) · "Got it" (reopened from Start) · "You can open this again from the menu." | |
| **Map** | | |
| map.panel | "You're in {place}" · "Tap a city to see routes" · "From {place} you can reach · cheapest fare" | `{place}` includes Bergen at the start. |
| map.chip | "{city}" + "from {price}" · short: "{shortfall} short" · Bergen: "{price} · ends the journey" | Short variant is [CORE]. |
| map.zoomHint | "Too small? Tap the {region} circle to zoom." | Visible only for a zoomable region; `aria-hidden` (the loupe button is named "Zoom in on {region}"). |
| map.card | "You're in {city}" · "City day in {city} — {price}" · "Finish the day to earn your {city} stamp" · "Plan the day" · "About {city}" | |
| map.card.repeat | hint: "You already have your {city} stamp." | |
| map.card.unavailable | "Not enough for a night here (you have {money})" / "No days left for a city day" | FR-8; reason from the rules layer. |
| map.card.callHome | "Call home" | Shown while FR-12 holds. |
| map.zoom | "Back to world" · "You're here" · "No direct route" · "Needs a stop on the way, via {viaCities}." · arrow pill "← {city} {price} · {days}" | `{viaCities}`: places with a direct route to both, from the rules layer, joined with "or". |
| map.srHeading | "Map" · "You're in {city}. Routes are listed below." | Visually hidden. |
| **Route sheet** | | |
| route.header | "{from} → {to}" · "{to} isn't stamped yet." / "You already have your {to} stamp." | |
| route.row | "{days} · arrive Day {arrivalDay}" | |
| route.primary | none picked: "Choose how to travel" (unavailable) · picked: "{verb} · {price}" · Bergen: "Continue · {price}" | |
| route.consequence | "You'll reach {to} on Day {arrivalDay} with {moneyAfter} left." | |
| route.unavailable | "Not enough money (you have {money})" · "You'd use {daysAfter} days, over the {N}-day limit." | FR-4, FR-6, FR-9 |
| route.warning | "Heads up: after this trip you can't get home in time." | FR-4; never blocks. |
| route.noneFits | "No route from {city} fits your {money}." | All rows unavailable (CH1a). |
| **Travel home** | | |
| home | title "Fly home to Bergen?" (plane) / "{verb} to Bergen?" (train, bus) · "Stamps {n}/5" · "Goal will be reached" / "You have {n} of 5 stamps — goal not reached" · "Your journey ends when you land." · primary "{verb} · {price}" · "Not now" | `{verb}` uses the home forms. |
| **Arrival** | | |
| arrival | "You've arrived · Day {day} of {N} · {money}" · "Welcome to {city}" · "{Mode} from {from} · {days} · {price}" · "Plan the day" · "A city day here costs {price} and 1 day, and earns your {city} stamp." · "Just passing through" · "No stamp unless you spend a day here" | |
| arrival.repeat | title "Back in {city}" · consequence "A city day here costs {price} and 1 day. No new stamp this time." · stamp line "You already have your {city} stamp." | |
| arrival.unavailable | Same reasons as map.card.unavailable | |
| **City day** | | |
| cityday | "City day · planning" · "A day in {city}" · "Guesthouse, one night" / "Always part of a city day" · "Sights · optional" / "Pick up to 2" · "Add" / "Added" · "Today: stay {stayPrice} + {sight} {sightPrice}" · "End the day — {total}" · back "Map" | |
| cityday.repeat | "Back in {city}" · "no new stamp this time" · "{sight} — in your album" | |
| cityday.sightUnavailable | "Not enough left after your stay — you'd have {moneyAfterStay}" · [EXT] "Too much with your sights — remove one" | Money after is measured from the selected end-of-day cost. |
| cityday.tight | "Money's tight: you'll have {moneyAfter} after your stay." | [ASSUMPTION] Shown when money after today's total is below the cheapest fare out of this city (rules layer). |
| **Day complete** | | |
| dc.first | eyebrow "{city} stamp added to your passport" · "{city}, stamped." · lede "A full day, well spent. That's {n} of 5 in your passport. {toGoWord} to go." | |
| dc.fifth | lede "A full day, well spent. That's 5 of 5 — now get home to Bergen." | [ASSUMPTION] |
| dc.overGoal | lede "That's {n}. Goal already met." | [EXT] |
| dc.repeat | eyebrow "Day complete" · "Another day in {city}." · lede "A full day, well spent. No new stamp this time." | [ASSUMPTION] |
| dc.actions | "New in album" · "Back to the map" · "View album" · [EXT] "{verb}" (night: "Board the train") | |
| **Call home** | | |
| call | "Call home" · "This costs 7 days and one stamp. No money needed." · "Day {day} → {dayAfter}" · "Stamps {n} → {n − 1} ({city} removed)" · "Slot {n} empties" · "Fly home to Bergen" · "Not now" / "Call home" | `{city}` = most recent stamp (FR-12). |
| call.noStamps | "This costs 7 days. You have no stamp to lose, and no money is needed." · "Stamps 0 — nothing to remove" | [ASSUMPTION] |
| **Can't continue** | | |
| end.stranded | "Calling home takes 7 days — you only have {left}." · "This journey can't be completed." · "Day {N} is the last day" · "{over} too many" (`{over}` in `{days}` form) · "See your journey" | CH2 |
| end.outOfDays | "You're out of days in {city}." · "This journey can't be completed." · "See your journey" | [ASSUMPTION] |
| **Journey summary** | | |
| sum.eyebrow | "Journey complete · home in Bergen" / failed: "Journey over · in {city}" | |
| sum.reached | "What an adventure." (with a name: "What an adventure, {name}.") · "{daysUsed} days, {stamps}, safely home — a true {modeWord}." · "Goal reached" | |
| sum.notReached | "Almost there." · "{stamps}, safely home — next time, {5 − n} more." · "Goal not reached" · "Called home" when relevant | 0 stamps: "No stamps, safely home — next time, 5 more." |
| sum.failed | "The adventure ends here." · "{reason} Every route teaches something — try again?" · "Goal not reached" | `{reason}`: out of days "Out of days in {city}." / stranded "Stranded in {city} — no way home in time." |
| sum.stats | "{daysUsed} days used" · "of {N}" · "{money} left over" · "{name}'s journey" | |
| sum.album | "No photos this time. Sights are optional." | |
| sum.tip | Called home: "Next time, keep enough for a ticket out before your last city day." · Stranded: "Calling home takes 7 days. If you're low on money, call by Day {N − 6} so you still make it." [ASSUMPTION] · Other outcomes: no tip | At most one. |
| sum.footer | "Every journey starts fresh from Bergen with €1,500." · "New journey" | |
| **Menu** | | |
| menu | "How to play" · "Album" · "New journey" · confirm "Start a new journey?" · "{journeyRef} ({city}, Day {day}, {stamps}) will be lost. It can't be brought back." · "Keep my journey" / "Start over" | `{journeyRef}` = "{name}'s journey" or "Your journey". |
| **End-of-day choice [EXT]** | | |
| eod | "How does your day end?" · "Budget stay" / "Shorter shifts here (3 questions)" · "Comfort stay" / "Longer shifts here (5 questions)" · "Leave tonight" / "Night {mode} to {to} · {days} — no stay cost tonight" · "Leaving tonight still earns your {city} stamp, and your sights still count. Only the stay is skipped." · "End the day & board — {total}" · "Day {day} → wake up in {to} on Day {arrivalDay}" | One "Leave tonight" row per night departure. |
| **Work [EXT]** | | |
| work | "Work a shift" · "1 day · {q} questions · up to {maxPay}" · "No stay cost on a work day" · "Start a shift" · "Plan another day · {price}" · "Correct! +{pay}" · "Not this time · +€0" · "You saw this in your album" · "Next question" · "Shift complete · {city}" · "A good day's work." | |
| work.unlock | "{target} ({price}) is now within reach." / "{gap} to go for {target}" | `{target}`: the cheapest destination from here that the payout made affordable / that is still unaffordable (rules layer). |
| work.left | "Work left in {city}: {q} questions, enough for {shifts} more shifts." | "1 more shift" singular. |
| work.unavailable | "Spend a city day here first to find work." · "No more work in {city} — you've answered all 15 questions here." · "Not enough questions left for a full shift here." · "No days left for a shift." [ASSUMPTION] | FR-15, FR-16 |
| **Accessible names** | | |
| a11y | strip: "{Mode} passport, {n} of 5 stamps: {stampedCities}" · loupe: "Zoom in on {region}" · stamp image: "{city} stamp" · answer after locking: "{letter}, {answer}, your answer, wrong" / "{letter}, {answer}, right answer" · running total: "Total {total}, money after {moneyAfter}" · Day complete focus: "{city}, stamped. {city} stamp added to your passport. {n} of 5." | |

Do not use these superseded strings: "Five stamps. Thirty days. One way home." (old tagline), "Home sweet home.", "Adventure: complete. Passport: full." / "Welcome home, true explorer.", "Five stamps, and home with 14 days to spare. What a trip." (J1 render lede), and "No shifts left — …". The pptx tagline "Explore • Decide • Learn • Grow" is not used in the game.

## Component Patterns

Behavioural. Visual specs are in DESIGN.md → Components, under the same names, groups and row order.

### Chrome and controls

| Component | Tag | Behavioural rules |
|---|---|---|
| Logo | [CORE] | Not interactive in-journey. Never accompanied by NOMAD or a mode badge. |
| Menu button | [CORE] | Opens the Menu sheet. 44 px hit area. On every screen. |
| Back control | [CORE] | "‹ Map" on City day and Passport. Follows IA → Back navigation; never commits anything. |
| Focus ring | [CORE] | Shown on keyboard focus (`:focus-visible`) on every control; never removed. Uses the map variant on map surfaces. |
| Navy block | [CORE] | Decorative container, never interactive; links inside it (feedback box) are ordinary text links. |
| Buttons | [CORE] | At most one `button-primary` per screen or sheet; its label names the action and price. A `text-link` navigates without committing. Confirms: in **data-loss** confirms (New journey) the safe action is primary; in **goal-action** confirms (Travel home, Call home) the commit is primary and the safe exit is secondary. Initial focus never lands on a button in a confirm. |
| Button unavailable | [CORE] | Visible, not hidden, `aria-disabled`, with a full-sentence reason next to it. |
| Tip | [CORE] | Non-interactive advice, at most one per screen; chosen by outcome (Copy templates → sum.tip). |
| Info banner | [EXT] | Inserted into an existing polite live region after first paint, so it is announced. Stays until dismissed or a journey starts. |

### Status and passport

| Component | Tag | Behavioural rules |
|---|---|---|
| Status chip | [CORE] | Day chip: "Day X of N" plus "{left}" (the UI label for the glossary term Days remaining). Money chip: balance. Always visible on the Map (FR-3). Values update only after a committed action, never mid-shift. Not a live region. |
| Passport strip | [CORE] | The whole strip is one target (46 px) that opens the Passport on the Stamps tab. Shows the mode word + count only. Accessible name lists the stamped cities (Copy templates → a11y). With more than 5 stamps it shows the "+N" badge [EXT]. |
| Passport cover | [CORE] (Nomad [EXT]) | Three stacked rows (mode / name / count) wherever the full cover appears. Tapping it opens the Passport. Name fit: DESIGN.md → Passport cover. |
| Stamp | [CORE] | Appears only at the end of a first city day at a destination (FR-10), never on arrival. On the map, a stamped city shows a stamp instead of an open marker. Small stamps are `aria-hidden` when the city name is adjacent text; otherwise `role="img"` named "{city} stamp". Each destination's angle comes from content data. |
| Stamp slot | [CORE] | Five slots (the goal is 5), filled left to right in the order stamps were earned. Call home empties the most recently filled slot (FR-12 assumption). [EXT] Past 5, the strip and cover add a "+N" badge and the Stamps page grows. |
| Stamp page | [CORE] | Read-only. Stamps show city + "Day N". Empty slots are numbered, with "Empty"; the next one is marked "Next city day". |
| Tabs | [CORE] | `role="tablist"`; each tab `role="tab"` with `aria-selected` and `aria-controls`; arrow keys move between tabs. Opens on the tab the entry point asked for. |
| Polaroid | [CORE] | Tap opens the Polaroid sheet. Tappable everywhere it appears: Album tab, Journey summary, Day complete "New in album". |
| Polaroid sheet | [CORE] | Read-only. Closes back to its opener (Album, Summary, Day complete, Album line, or Feedback box [EXT]). |
| Album line | [CORE] | Read-only on a repeat visit. Tap opens the Polaroid sheet. |

### Map

| Component | Tag | Behavioural rules |
|---|---|---|
| Map | [CORE] | The SVG artwork is `aria-hidden`. Markers outside a loupe are pointer-only targets, and only where Map Data → Tap rules allow; inside a loupe they are never targets. Places with no route from here aren't selectable (FR-4). No pan or pinch-zoom requirement. |
| Map marker | [CORE] | Shows place state by shape (current, home, stamped, not yet, no route). A target only where Map Data → Tap rules allow, and then only for pointer input; the chips carry the same action for keyboard and screen readers. |
| Map key | [CORE] | Static legend in the resting panel; read as a list. Not interactive. |
| Region loupe | [CORE] | Shows the current region. A zoomable region's loupe is one HTML `<button>` over the SVG ("Zoom in on {region}") that opens the Zoomed region; a non-zoomable loupe is not interactive and has no Zoom tag. Fare tags are labels, not buttons. |
| Zoomed region | [CORE] | City pills, arrow pills and "Back to world" are HTML buttons. "Back to world" is always visible. The current city's pill is informational. |
| City pill | [CORE] | Opens the Route sheet for that city. Arrow pills open that off-map destination's Route sheet. A no-route pill is `aria-disabled` and carries the via hint. |
| City-day card | [CORE] | "Plan the day" opens City day; "About <City>" reopens the Arrival fact card in read mode. When the city day is unavailable (FR-8), "Plan the day" is a Button unavailable with its reason. While FR-12 holds, a "Call home" button is added and stays until the condition ends. Repeat visit: hint "You already have your {city} stamp." [EXT] After a city day here, the card becomes the "Work a shift" offer and states its cost; its "Start a shift" button begins the shift at once, and a text link "Plan another day · {price}" opens City day. |
| Resting panel | [CORE] | A page region (`<section>` with a heading), not a dialog. Shown when no route sheet is open. Destination chips wrap; the body scrolls internally. The grab bar is decorative (`aria-hidden`). |
| Destination chip | [CORE] | One per route from here, with the cheapest fare. Tap opens the Route sheet. This is the complete non-map path to every destination. Short variant ("€60 short") when the cheapest fare exceeds money; it stays tappable and the sheet repeats the shortfall. |

### Sheets and travel

| Component | Tag | Behavioural rules |
|---|---|---|
| Modal sheet | [CORE] | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` the headline. Everything behind it is `inert` and background scroll is locked; Tab wraps inside the sheet. Initial focus goes to the headline (`tabindex="-1"`); focus returns to the trigger on close. Closes via ×, scrim tap, Esc or back (IA → Back navigation); there is no swipe-to-dismiss. The scrim covers the map area only, so the top stack stays visible (FR-3) though inert. Slides up (Motion). One sheet at a time (except Call home over the route sheet; IA → Navigation model). |
| Route sheet | [CORE] | Opens over the current view (Map or Zoomed region); closing returns there. No row is preselected; the primary reads "Choose how to travel" (unavailable) until a row is picked. On a route to Bergen the primary reads "Continue · {price}" and swaps the content to the Travel home sheet. Night departures do not appear here [EXT]. While FR-12 holds, a secondary "Call home" opens the Call home sheet; when every row is unavailable, it replaces the primary (final CH1a). |
| Option row | [CORE] | A native radio styled as a row; the rows form one radio group (one tab stop, arrow keys move and select). The whole row is the target. Unavailable rows (not enough money or days; FR-4, FR-9) show a block icon instead of the radio, are `aria-disabled`, and keep their reason in the accessible name. Warning rows (FR-4) keep a live radio, stay selectable, never block or add a confirm; the warning line is linked with `aria-describedby`. |
| Travel home sheet | [CORE] | Answer first (goal line), then numbers (stamps, money and day before/after), then "Your journey ends when you land." Primary "{verb} · {price}" commits; "Not now" returns to the Route sheet with nothing lost. |
| Call home sheet | [CORE] | Offered only while FR-12 holds (the rules layer says so). **Opens automatically once**, on the first Map view after the condition becomes true; never over the Arrival fact card or City day. Shows the cost before the confirm. "Not now" closes it, and the player keeps any remaining actions; it reopens only from the "Call home" button on the city-day card or route sheet. With 0 stamps it uses the no-stamp copy. If 7 days don't fit, the rules layer ends the journey and the Can't-continue sheet shows instead. |
| Can't-continue sheet | [CORE] | Shown when the rules layer ends the journey away from home (FR-13): reason **stranded** (Call home can't fit) or **out of days**. No ×, no scrim close; Esc and back do nothing. Its one button, "See your journey", opens the Journey summary. |
| Arrival fact card | [CORE] | Opens automatically after every travel to a destination (FR-5), showing the new balance. Arrival mode: "Plan the day" plus "Just passing through" (both close it; × too; the city-day card stays on the map, FR-10). Repeat visit: the repeat copy; the "No stamp unless you spend a day here" line is omitted. City day unavailable: Button unavailable with the reason. Read mode (from "About <City>"): no arrival pill and no buttons; × closes it. |
| Fact card | [CORE] | Read-only text block. |
| Menu sheet | [CORE] | Three rows. "New journey" swaps the list for the Confirm block. After the journey ends, "Album" is removed (FR-13). [EXT] A fourth row, "Sound", is a switch (`role="switch"`, state as text "On"/"Off"); it is off by default and applies immediately (Interaction Primitives → Sound). |
| Confirm block | [CORE] | Replaces the content in place; focus moves to its title. The safe action is primary. Used for New journey (Menu and Start [EXT]). "Start over" goes to the Start screen with the name prefilled. |

### City day and journey end

| Component | Tag | Behavioural rules |
|---|---|---|
| Sight card | [CORE] | Toggle with `aria-pressed`; its name includes the price. At most 2 per day (FR-21). Unavailable, with its reason, when the money left after the selected end-of-day cost (core: the stay) is below its ticket price. Already-visited sights appear as Album lines (FR-22 assumption). Compact variant [EXT]: the whole card is the target. Adjacent cards are `{spacing.stack-tap}` apart. |
| End-of-day choice | [EXT] | Single-select radio group: Budget stay / Comfort stay / one "Leave tonight" row per night departure from this city (FR-23). Picking a night row shows the keep/skip lines and changes the button to "End the day & board — {total}". An option whose total with the chosen sights exceeds money is unavailable with "Too much with your sights — remove one". |
| Running total | [CORE] | Live sum of the stay (or night ticket) plus the chosen sights; before/after boxes for money and day; the button label carries the total. A polite live region announces the new total after each toggle. |
| Day complete | [CORE] | First city day: the stamp lands (Motion) and focus goes to the headline, which announces the stamp. Repeat visit: no stamp moment. "Back to the map" returns to the Map; "View album" opens the Passport on the Album tab. [EXT] After a night departure, the button is "{verb}" and leads to the next Arrival fact card. |
| Goal line | [CORE] | Solid (reached) or dashed (not reached), with icon and words. Used in Travel home, Journey summary and Shift result. |
| Called home tag | [CORE] | Shown on the Journey summary when relevant (FR-12). Not interactive. |
| Journey summary | [CORE] | Terminal screen. The only actions are "New journey", tapping polaroids, and the reduced menu. Shows the copy for its outcome: goal reached, goal not reached at home, or failed away from home (out of days / stranded). "New journey" goes to the Start screen with the last name prefilled. |

### Start

| Component | Tag | Behavioural rules |
|---|---|---|
| Intro | [CORE] | First visit: no ×, and "Let's go" starts the journey. Reopened in a journey: ×, "Back to my journey". Reopened from Start: ×, "Got it". |
| Name field | [CORE] | Optional (FR-1). Leading and trailing spaces are trimmed; length is counted in graphemes (so "æ", "ø" or an emoji count as one); input stops at 14. A visible counter ("8/14", linked by `aria-describedby`) and a polite announcement at the limit. Empty or whitespace-only means "Traveller". The live mini cover updates as the player types. The last name is remembered on the device. |
| Mode card | [EXT] | Native radio pair, Explorer preselected. The whole card is the target. |
| Saved journey card | [EXT] | Read-only summary. "Continue journey" is the primary action. "New journey" asks for confirmation first. |

### Work [EXT]

| Component | Tag | Behavioural rules |
|---|---|---|
| Question card | [EXT] | One question per screen. No timer. |
| Answer row | [EXT] | A single tap answers (committed per answer, State Model) and locks all four rows. Rows become `aria-disabled` (still focusable) and get result names (Copy templates → a11y). Focus moves to the Feedback box. Rows are `{spacing.stack-tap}` apart. |
| Progress dots | [EXT] | One per question in the shift. Correct, missed and current states shown by icon plus text. |
| Feedback box | [EXT] | `role="status"`, receives focus after an answer; then "Next question" (which waits for the player). "You saw this in your album" appears only for a question about a visited sight (FR-16); it opens that Polaroid sheet and returns to the question. |
| Earnings pill | [EXT] | Counts the pay so far. The Money chip doesn't change until the Shift result. |
| Shift result | [EXT] | Shows the payout and the new day (applied when the shift finishes) and the work left. The unlock line is solid only if a route became affordable; otherwise dashed "{gap} to go for {target}". |

## State Patterns

| State | Surface | Tag | Treatment |
|---|---|---|---|
| First visit | Start → Intro | [CORE] | "New journey" goes through the Intro, then the Map. |
| Storage unavailable | Start | [CORE] / [EXT] | [CORE] The intro shows every time (FR-2 assumption); nothing else changes. [EXT] One calm line on Start: "This browser can't save your journey." |
| Reload mid-journey | Any | [CORE] | Returns to Start; the journey is lost (no saving in core); no unload warning. |
| Reload mid-journey | Any | [EXT] | Restores the last committed game state and lands on the Map; an in-progress shift resumes at its next question; an ended journey lands on the Journey summary. Drafts and open sheets are never restored. |
| Returning, saved journey | Start | [EXT] | Saved journey card first. The intro is skipped. |
| Unreadable save | Start | [EXT] | Info banner (ext-1 X1c), save discarded, empty form, intro flag kept (FR-20). |
| Cold load | Any | [CORE] | [ASSUMPTION] No loading state. Content is local (NFR-3, NFR-7), so the first paint is the Start screen. |
| Offline | Any | [CORE] | Not applicable after the first load (NFR-3). |
| Resting | Map | [CORE] | Resting panel with destination chips. City-day card if at a destination. |
| At home (journey start) | Map | [CORE] | No city-day card at Bergen (FR-8); the resting panel lists the routes from Bergen. Bergen is in the Europe region. |
| Destination not stamped / stamped | Map, Route sheet | [CORE] | Open marker vs stamp; "{to} isn't stamped yet." / "You already have your {to} stamp." |
| No route from here | Zoomed region, Map | [CORE] | Dashed pill, "No direct route", plus the via hint. Not selectable. |
| Destination unaffordable | Resting panel | [CORE] | Short chip "{shortfall} short"; the Route sheet repeats the reason per row. |
| Option unaffordable or too long | Route sheet, City day | [CORE] | Unavailable row with block icon and reason (FR-4, FR-9, FR-21). |
| Home unreachable after option | Route sheet | [CORE] | Warning row, never blocked (FR-4). |
| City day unavailable | City-day card, Arrival fact card | [CORE] | "Plan the day" becomes a Button unavailable with its FR-8 reason (Copy templates → map.card.unavailable). |
| Low money | City day | [CORE] | "Money's tight" line. Sights above the remaining money are unavailable (CD1b). |
| Repeat visit | Arrival, City-day card, City day, Day complete | [CORE] | No new stamp and no stamp moment; each surface uses its repeat copy (Copy templates → arrival.repeat, map.card.repeat, cityday.repeat, dc.repeat). |
| Day complete, first visit | Day complete | [CORE] | The stamp lands and the cover count increments. |
| Day complete, no sights | Day complete | [CORE] | The "New in album" polaroid is omitted. |
| More than 5 stamps | Strip, cover, Stamps page, summary, Day complete | [EXT] | "+N" badge, page grows, summary row wraps, "That's {n}. Goal already met." (Core cannot reach 6: addendum §6.) |
| Day 30 | Status chip, totals | [CORE] | "Day 30 of 30" · "No days left". Before/after boxes never show past Day 30; any option that would go past it is unavailable (FR-6). |
| Empty album | Passport · Album, Summary | [CORE] | One wide dashed "Your next photo goes here" tile. Summary: "No photos this time. Sights are optional." |
| Empty stamps | Passport · Stamps | [CORE] | Five numbered empty slots. Slot 1 is "Next city day". |
| Goal will / won't be reached | Travel home | [CORE] | H1 solid / H2 dashed. A trip home past the day limit is an unavailable route row (FR-6). |
| Cannot afford any travel | Map at a destination | [CORE] | Every route row unavailable (route.noneFits); Call home is offered (Component Patterns → Call home sheet, FR-12). |
| Call home with 0 stamps | Call home sheet | [CORE] | No-stamp copy; no slot animation. |
| Journey can't continue: stranded | Can't-continue sheet → Summary | [CORE] | Call home can't fit (FR-12): CH2 sheet, then the failed summary with "Stranded in {city} — no way home in time." |
| Journey can't continue: out of days | Can't-continue sheet → Summary | [CORE] | No days left away from home (FR-13): out-of-days sheet, then "Out of days in {city}." |
| Goal reached | Journey summary | [CORE] | "What an adventure." + line + "Goal reached". |
| Goal not reached at home / called home | Journey summary | [CORE] | "Almost there." + line + "Goal not reached", the Called home tag when relevant, and one Tip (J2). No red, no crossed-out stamps. |
| Journey ended | Menu | [CORE] | Only "How to play" and "New journey" (FR-13). |
| Work unavailable | City-day card | [EXT] | ext-1 X3e. With no city day here yet, "Plan the day" stays primary; otherwise "Start a shift" is unavailable with the matching work.unavailable reason. |
| Answer correct / wrong | Shift | [EXT] | X3b / X3c treatment. The other answers lock. |
| Night departure picked | City day | [EXT] | Keep/skip lines; "Day {day} → wake up in {to} on Day {arrivalDay}". |
| Focus (keyboard) | All interactive | [CORE] | `focus-ring` on every control, never removed; spec in DESIGN.md → Focus ring. |
| Dark mode | All | [CORE] | All `-dark` tokens. The state cues (shape, word, icon) are unchanged. |

## Interaction Primitives

- **Tap only.** Every action is a single tap on a target of at least `{spacing.touch-min}`. Whole rows, cards, pills and the passport strip are targets. No long-press, drag, swipe-required or double-tap actions. The loupe does the zooming.
- **Spacing.** Adjacent targets that act on a single tap (answer rows, sight cards, destination chips) are at least `{spacing.stack-tap}` apart.
- **One decision on screen at a time.** Confirms replace content rather than stacking.
- **Consequence before commit.** Every committing button carries its price, and a before/after or consequence line sits next to it (PRD §7).
- **Irreversible actions confirm once:** Travel home (FR-7), Call home (FR-12) and New journey with a journey in progress (FR-1). Everything else commits immediately, because the cost is on the button.
- **No time pressure.** No timers, auto-advance or countdowns anywhere, including trivia (PRD §7).
- **Stable layout.** The bottom panel and the route sheet share one footprint, so the map doesn't resize when a sheet opens. The status chips don't change mid-flow.
- **Keyboard (PC).** Tab order follows reading order. Enter/Space activate. Radio groups and tabs use arrow keys. Esc acts as Back (IA → Back navigation). [ASSUMPTION: no other shortcuts.]
- **Focus on change.** On every screen change or in-place swap, focus moves to the new headline (`tabindex="-1"`, one `h1` per screen) and `document.title` updates ("Day complete — Worldbound").

### Motion

| Moment | Behaviour | Reduce motion |
|---|---|---|
| Stamp lands (Day complete) | The stamp "lands" in its slot and the cover count increments. At most 600 ms, ease-out, scaling down slightly as it settles at its rest angle. `aria-hidden`; the headline carries the meaning. | Appears in place instantly. |
| Sheets | Slide up from the bottom; scrim fades in. About 250 ms. | Appear instantly. |
| Map zoom (loupe ↔ zoomed region) | [ASSUMPTION] A scale from the loupe, at most 250 ms. | Removed (instant switch), not shortened. |
| Numbers | Money, days and counts change without counting or rolling, in every mode. | — |
| Everything else | No decorative motion. No confetti, no looping or attention-seeking animation. | — |

All non-essential animation is off under `prefers-reduced-motion`. State changes still show, instantly.

### Sound [EXT]

Sound effects are optional (FR-24). Sound is off by default, and the player turns it on or off from the Menu sheet. There is no sound in the core and no music.

| Moment | Effect |
|---|---|
| Stamp lands (Day complete) | Short ink-stamp thud |
| Departure (any travel, including Call home and night departures) | Short departure cue for the transport mode |
| Answer feedback (shift) | One cue for a correct answer and one for a wrong answer; neither sounds like a buzzer or alarm |
| City day complete | Short closing chime, played only when no stamp lands (otherwise the stamp sound plays) |

Rules:

- No sound plays before the player's first tap (browser autoplay rules). The setting is device state (State Model).
- Every sound duplicates something already on screen. Turning sound off removes no information, and no effect carries meaning on its own.
- Effects are short (under about 1 s), never loop, and do not stack: a new effect replaces one still playing.
- Sound follows the device's mute and volume; the game has no volume control of its own.
- Sound files follow the same source and license rule as images (NFR-8). See Content Assets.

## Accessibility Floor

Behavioural. Visual contrast lives in DESIGN.md → Colors → Contrast targets. Yardstick: NFR-5, checked against WCAG 2.2 AA where a criterion is cheap to meet.

- **Targets.** At least 44 × 44 px for everything interactive (NFR-5). Drawn elements smaller than that get invisible hit areas (menu button, strip). Every interactive map marker has a ≥ 44 px hit circle, and hit circles never overlap (Map Data → Tap rules).
- **Never colour alone** (NFR-5, FR-3): stamped = stamp code + check; selected = 2 px border + filled radio + checked state; **unavailable = block icon, no radio, reason, `aria-disabled`**; **warning = live radio + warning glyph + "Heads up" line**; goal met vs not = solid + check vs dashed + open icon + words; right vs wrong answer = solid/check/"Right answer" vs dashed/cross/"Your answer"; mode = word + glyph + colour. The next-slot marker is decorative.
- **Text.** All text at least 11 px (NFR-5); inputs at least 16 px; type in `rem`. Stamp-code exception: DESIGN.md → Typography.
- **Dialogs.** Modal sheet semantics as in Component Patterns → Modal sheet. The resting panel is a region, not a dialog.
- **Map for screen readers.** The SVG is `aria-hidden` and its markers are pointer-only. The loupe (when zoomable), city pills, arrow pills and "Back to world" are HTML buttons. A visually hidden "Map" heading says where the player is. The destination chips and the Route sheet are the complete accessible path to every route.
- **Announcements.** Polite: the info banner, answer feedback, the running total after a toggle, the name-field limit. Not live: status chips. The stamp moment is carried by the focused Day complete headline; the arrival card states the balance.
- **Focus.** Visible `focus-ring` on all controls. Focus moves into sheets (headline) and returns to the trigger; on screen changes it moves to the new headline.
- **Zoom and reflow.** The layout survives 200% text without horizontal scroll (DESIGN.md → Layout & Spacing → Large text). The viewport meta never sets `maximum-scale=1` or `user-scalable=no`.
- **Reduce motion.** Honoured as in Interaction Primitives → Motion.

## Key Flows

Day X = days used + 1 (travel adds the mode's days, a city day 1, a night departure its days − 1, a shift 1, Call home 7). Numbers in these flows are checked against the addendum tables and the PRD glossary; mockup day labels may run one lower (Visual References).

### UJ-1 — Ingrid makes it home with five stamps [CORE]

Ingrid, 22, on the bus in Bergen. First visit, no saved journey.

1. The Start screen shows the logo and "Round trip or one-way ticket?". She skips the name field and taps "New journey".
2. The Intro shows the goal, €1,500 and 30 days. She taps "Let's go" and the intro flag is set.
3. Map at Bergen (Day 1 of 30): resting panel chips from Bergen; the loupe shows Europe. She taps the Copenhagen chip; the Route sheet shows Plane €140 · 1 day, Train €110 · 1 day and Bus €70 · 2 days, with nothing preselected. She picks Bus and taps "Take the bus · €70".
4. The Arrival fact card opens over the Copenhagen street drawing ("You've arrived · Day 3 of 30 · €1,430"). She taps "Plan the day", keeps no sights and taps "End the day — €90".
5. Day complete: the CPH stamp lands in slot 1. She taps "Back to the map".
6. Bus to Paris. Arrival on Day 6 of 30 with €1,270. City day: she adds the Eiffel Tower and the Louvre (€37 together); the running total shows the stay plus both sights. On Day complete the PAR stamp lands and two polaroids join the album.
7. She continues to London, flies to Rome and takes the slow bus to Istanbul, with a city day in each.
8. In Istanbul she opens Bergen → Plane and taps "Continue · €250". The Travel home sheet shows "Stamps 5/5", "Goal will be reached" and "Your journey ends when you land." She taps "Fly home · €250".
9. **Climax:** the Journey summary reads "What an adventure." and "16 days, 5 stamps, safely home — a true explorer.", with five stamps, two polaroids, 16 days used, €423 left over and "Goal reached".
10. She taps "New journey". The Start screen opens (no name to prefill); "New journey" goes straight to the Map, because the intro flag is set.

Failure paths: she taps "Just passing through", so there's no stamp; the city-day card stays on the map. She opens City day and then taps "‹ Map": nothing is charged. A sight is unaffordable after her stay, so it's unavailable with "you'd have €N". She opens Travel home with 3/5: the sheet states "goal not reached" (H2), and "Not now" returns her to the route sheet. Had she flown home with 3 stamps, the summary would read "Almost there." and "3 stamps, safely home — next time, 2 more."

### UJ-2 — Jonas calls home from Rome [CORE]

Jonas, 19.

1. From Bergen he picks New York, flies (€350), and spends three city days there. The first earns the New York stamp; the later ones show the repeat-visit state.
2. He flies to Paris, takes the train to London and flies to Rome, with a city day in each. Rome's Day complete leaves him with €20 on Day 11 of 30.
3. He taps "Back to the map". Every route from Rome is unavailable ("Not enough money (you have €20)"), so the Call home sheet opens by itself.
4. The sheet states "This costs 7 days and one stamp. No money needed.", "Day 11 → 18", "Stamps 4 → 3 (Rome removed)" with slot 4 emptying, and "Fly home to Bergen".
5. He taps "Call home".
6. **Climax:** he lands in Bergen with 17 days used. The Journey summary reads "Almost there." and "3 stamps, safely home — next time, 2 more.", and shows "Goal not reached", the "Called home" tag, three stamps (New York, Paris, London) and two empty slots, €20 left over, and the Tip "Next time, keep enough for a ticket out before your last city day."
7. He taps "New journey".

Failure paths: "Not now" closes the sheet; Jonas stays in Rome with the "Call home" button on the city-day card and in the route sheet, and the sheet does not reopen by itself. Edge case (Day 25 of 30, 24 days used, 6 left): the rules layer ends the journey, and the Can't-continue sheet reads "Calling home takes 7 days — you only have 6 days left.", "This journey can't be completed." and "1 day too many". "See your journey" opens the summary: "The adventure ends here.", "Stranded in Rome — no way home in time. Every route teaches something — try again?" and "Goal not reached", with his four stamps kept.

### UJ-3 — Amira works a shift in Tokyo [EXT] (work-shift flow)

Amira, 24. She has spent a city day in Tokyo (Comfort stay) and visited Senso-ji. She has €240; Sydney costs €300.

1. The Map shows the East Asia / Pacific loupe (no Europe loupe, not zoomable). The panel "You're in Tokyo" lists Sydney "€60 short" among the chips.
2. The city-day card reads "Tokyo · stamped", "Work a shift", "1 day · 5 questions · up to €120" and "No stay cost on a work day". She taps "Start a shift".
3. Question 1 (the river past Asakusa): she picks wrong. Her pick is dashed with a cross and "Your answer"; the right one gets a check and "Right answer"; the feedback reads "Not this time · +€0". She taps "Next question".
4. Question 2 is about Senso-ji. She answers correctly: "Correct! +€24", and "You saw this in your album" opens her polaroid sheet and returns her to the question.
5. She answers questions 3–5 and gets four right. The Money chip stays at €240 throughout.
6. **Climax:** the Shift result shows "4 of 5 correct · +€96", "€240 → €336", "Day 18 → 19", and a solid line "Sydney (€300) is now within reach." with "Work left in Tokyo: 10 questions, enough for 2 more shifts."
7. "Back to the map". Sydney's chip is no longer short, and she travels on with fewer days left.

Failure paths: no city day here yet: "Spend a city day here first to find work." After three shifts: "No more work in Tokyo — you've answered all 15 questions here." Fewer questions left than the shift needs: "Not enough questions left for a full shift here." Zero days remaining: "No days left for a shift." (FR-15). Balance caveat: PRD Open Question 5.

### Flow 4 — Start, continue and choose a mode [EXT]

Ingrid comes back the next day; her Paris journey is saved.

1. Start shows the tagline, "Welcome back", and the Saved journey card (Explorer passport, Ingrid, Paris, Day 6 of 30, €1,270, 1 of 5 stamps).
2. **Climax (continue):** she taps "Continue journey" and lands on the Map where she left off. The intro is not shown.
3. Alternative: she taps "New journey". The Confirm block reads "Ingrid's journey (Paris, Day 6, 1 stamp) will be lost. It can't be brought back." with "Keep my journey" (primary) and "Start over".
4. "Start over" opens the start form with "Ingrid" prefilled. She picks the Nomad mode card (€1,000 · 30 days) and the preview cover turns ochre with the mountain glyph.
5. "New journey" goes to the Map (the intro flag is set), and her cover reads "NOMAD PASSPORT / Ingrid / 0/5".

Failure paths: the save is unreadable, so the info banner shows over an empty form and the intro flag is kept. "Keep my journey" returns to the saved card unchanged. Storage is unavailable: no saved card, the "can't save" line, and the intro every time (FR-2).

### Flow 5 — Night departure [EXT]

Ingrid is in Paris with €1,270, about to spend her Paris city day on Day 6 (5 days used).

1. City day: "How does your day end?" lists Budget stay €56, Comfort stay €104 and one "Leave tonight" row per night departure from Paris in the route data, including "Night train to Rome · 1 day — no stay cost tonight" (€110).
2. She adds the Eiffel Tower (€20) and picks the Rome night train. The keep/skip lines appear: "Your Paris stamp is still earned", "Eiffel Tower still goes in your album", "No stay tonight, so no stay cost".
3. The total reads "Eiffel Tower €20 + night train €110 = €130", "€1,270 → €1,140" and "Day 6 → wake up in Rome on Day 7" (city day +1, 1-day night train +0: 6 days used).
4. She taps "End the day & board — €130".
5. **Climax:** Day complete plays "Paris, stamped." even though no stay was paid. The button reads "Board the train".
6. The Rome Arrival fact card opens on Day 7 with €1,140.

Failure paths: the night ticket plus sights exceeds her money, so that row is unavailable with its reason (FR-9). A city with no night departure has no "Leave tonight" rows. Shifts in Paris later count as Budget tier (PRD Decision E).

## State Model

What the rules layer owns versus what the UI owns (NFR-2). Only game state is ever saved [EXT].

| Layer | Holds | Lifetime |
|---|---|---|
| Game state (rules layer) | mode; traveller name; position; money; days used; stamps (ordered: destination, day); album (ordered: sight, day); per destination: city-day count, last tier, last city day ended with a night departure; [EXT] question index per destination and the current shift (destination, question ids, answers so far); called-home flag; outcome (none / goal reached / goal not reached / failed) and fail reason (out of days / stranded) | Whole journey. [EXT] Saved after every committed action. |
| Device state | Intro flag; last traveller name; [EXT] the saved journey; [EXT] the sound setting (FR-24) | Across journeys (NFR-9). |
| Draft UI state | Selected route option; selected sights; end-of-day choice; name-field text and mode choice before start | Discarded on leaving the surface, closing the sheet, or reload. Sent to the rules layer only at commit. |
| Presentational state | Current screen and back history; open sheet and its content step; Passport tab; zoomed region on/off; arrival card shown for this arrival; Call home auto-open done for this stay; banner dismissed; focus return target; motion in progress | Never saved. |

| Commit (rules action) | Trigger |
|---|---|
| startJourney(mode, name) | "New journey" / "Let's go" |
| travel(route, mode) | Route sheet primary, Travel home primary |
| spendCityDay(sights, tier or night departure) | "End the day" / "End the day & board" |
| callHome() | Call home primary |
| [EXT] startShift() · answer(option) per question · finishShift() | "Start a shift" · answer tap · reaching the Shift result (pays out and adds the day) |

Queries the UI reads and never computes: available actions with reasons, home-unreachable warnings, Call home offered, journey ended (with outcome and reason), via-cities, unlock targets, the "Money's tight" condition.

## Map Data

Content data for the map (NFR-7). Places and regions are records; the map is one asset.

| Aspect | Rule |
|---|---|
| Projection | Equirectangular in degree units: x = lon + 180 (0…360), y = 90 − lat. The world map is cropped to about 76° N … 50° S and scaled to the column width (≈ 1 px per degree at 375 px). |
| Inset rule | The loupe and the Zoomed region are magnified views of the **same** world-map geometry, clipped to a circle (loupe) or the map area (zoom), at the region's `scale` / `zoomScale` in px per degree. The world geometry must be detailed enough to look clean at the largest scale. Labels and markers are drawn on top at screen size, not scaled. |
| Route lines | Straight segments in projection. A line spanning more than 180° of longitude wraps across the map edge instead (New York – Tokyo crosses the Pacific). The trail follows the same rule. |
| Current region | The region of the traveller's position. The loupe shows it; when the traveller is outside Europe, there is no Europe loupe. |

**Per place:** `id`, `name`, `iata` (destinations only; the stamp code), `lat`, `lon`, `regionId`, `labelOffset` (px at loupe scale), `pillOffset` (px at zoom scale), `stampAngle`.

| Place | Lat, lon | Region | Tag |
|---|---|---|---|
| Bergen (home) | 60.39, 5.32 | Europe | [CORE] |
| Copenhagen CPH | 55.68, 12.57 | Europe | [CORE] |
| Paris PAR | 48.86, 2.35 | Europe | [CORE] |
| London LON | 51.51, −0.13 | Europe | [CORE] |
| Rome ROM | 41.90, 12.50 | Europe | [CORE] |
| Istanbul IST | 41.01, 28.98 | Europe | [CORE] |
| New York NYC | 40.71, −74.01 | North America / Atlantic | [CORE] |
| Tokyo TYO | 35.68, 139.69 | East Asia / Pacific | [CORE] |
| Sydney SYD | −33.87, 151.21 | Oceania | [CORE] |
| Madrid MAD | 40.42, −3.70 | Europe | [EXT] |
| Cape Town CPT | −33.92, 18.42 | Africa | [EXT] |

**Per region:** `id`, `name`, `bounds` (lat/lon box), `sourceShape` (box / circle), `loupeCentre` (px on the map area), `loupeRadius`, `scale`, `zoomable`, `zoomScale`. An EXT place or region only adds records.

| Region | Bounds | Loupe | Zoomable | Tag |
|---|---|---|---|---|
| Europe | lon −11…31, lat 34…63 | r 112, 5.8 px/°, high under the strip, box source | Yes, 10.6 px/° | [CORE] |
| East Asia / Pacific | centred lon 128, lat 0 | r 104, 2.1 px/°, circle source | No (one place) | [CORE] |
| North America / Atlantic | set in data | set in data | No (one place) | [CORE] |
| Oceania | set in data | set in data | No (one place) | [CORE] |
| Africa | set in data | set in data | No (one place) | [EXT] |

**Tap rules**

1. Markers inside a loupe are never individual targets. A zoomable loupe is one button; a non-zoomable loupe is not interactive.
2. A world-map marker outside the loupe is a target only if its 44 px hit circle overlaps no other hit circle, the loupe, or the strip's hit area. Otherwise it is decorative. This is computed at layout time.
3. Outside Europe, the Europe source box is not interactive.
4. In the Zoomed region, pills are the targets (DESIGN.md → City pill); dots are not.
5. The current position and places without a route from here are never targets.
6. The destination chips are always the complete non-map path to every destination.

## Content Assets

All assets are content data, separate from code (NFR-7). Placeholders are allowed in the MVP with source and licence recorded (NFR-8, Decision B). Stamps are a **component** built from the spec, `iata` and `stampAngle`, not assets.

| Asset | Count | Format and master | Shown at | Path | Theming and alt | Tag |
|---|---|---|---|---|---|---|
| Sight image | 16 (+4) | WebP photo or SVG line drawing, 4:3, master 800 × 600 | 82 px card, 44 × 36 thumb, 62–86 px polaroid, 118 px summary, full-width sheet | `assets/sights/{destId}-{sightId}.webp\|svg` | Drawings stroke in `currentColor`. Short `imageAlt` on sight cards; `alt=""` on polaroids (title adjacent). | [CORE] / [EXT] |
| Street drawing | 8 (+2) | SVG line art, 375 × 520 safe area, transparent | Arrival fact card background | `assets/streets/{destId}.svg` | `currentColor` strokes (`ink` / `ink-dark`). Decorative, `alt=""`. No people, no landmark clichés. | [CORE] / [EXT] |
| World map | 1 | SVG in projection degree units (Map Data) | Map, loupe, Zoomed region | `assets/map/world.svg` | Filled with map tokens at runtime; `aria-hidden`. | [CORE] |
| Logo | 1 | SVG (stand-in until the vector redraw) | Top bar, Start | `assets/brand/logo.svg` | `currentColor` + `logo-ochre`; named "Worldbound". | [CORE] |
| Icons | ~25 | SVG, 24 × 24 grid, single colour | 14–40 px | `assets/icons/{name}.svg` | `currentColor`; `aria-hidden` (the control carries the name). Set: plane, train, bus, moon, calendar, coin, stamp, photo, info, compass, mountain, home, pin, phone, menu, zoom, check, open circle, cross, block, alert, back, chevron, restart, bed, person. | [CORE] |
| Start art | 1 | SVG (compass with dashed routes) | Start | `assets/brand/start.svg` | Decorative. | [CORE] |
| Sound effect | ~6 | Short audio clip (under about 1 s), compressed web format; final format set by architecture | — (no visual) | `assets/sounds/{event}.{ext}` | Source and licence recorded (NFR-8). Events: stamp, depart-plane, depart-train, depart-bus, answer-correct, answer-wrong, day-complete. | [EXT] |
| Facts, sights, trivia, routes | data | JSON | — | `content/*.json` | Fact-checked and stereotype-reviewed (NFR-8). | [CORE] / trivia [EXT] |

Schema sketch (field names are a proposal for architecture):

- `destination {id, name, iata, lat, lon, regionId, costFactor, stampAngle, labelOffset, pillOffset, fact, streetDrawing}`
- `sight {id, destId, name, price, fact, image, imageAlt, source, licence}`
- `question {id, destId, order, text, options[4], correctIndex, sightId?}` [EXT]
- `route {a, b, modes[{mode, price, days, night?}]}`
- `region {id, name, bounds, sourceShape, loupeCentre, loupeRadius, scale, zoomable, zoomScale}`
## Responsive & Platform

NFR-4 requires tablet and PC to work. Layout constraints are in DESIGN.md → Layout & Spacing.

| Viewport | Behaviour |
|---|---|
| 375–480 px (reference) | As specified. |
| Under 364 px wide, under 600 px tall, tablet / PC (> 480 px), text at 200% | See DESIGN.md → Layout & Spacing (Narrow screens, Short screens, Reference viewport) and DESIGN.md → Layout & Spacing → Large text. No horizontal scroll. |
| Input | Touch on mobile and tablet; mouse + keyboard on PC. Hover adds nothing required. |
| Browser | Any current mobile browser; no install. [ASSUMPTION: last two versions of Safari iOS, Chrome Android and desktop Chrome/Firefox/Safari/Edge.] |

## Inspiration & Anti-patterns

- **Import, pitch deck** ([imports/WORLDBOUND_NOMAD_10_slides_logo_AI-agenter.pptx](imports/WORLDBOUND_NOMAD_10_slides_logo_AI-agenter.pptx)). Lifted from the slide-1 poster: the logo idea (compass-rose O, mountain line), navy + ochre, passport and grey round city stamps, and the sunrise warmth. Not lifted: the Bangkok and Rio stamps (not destinations); for the brush-script NOMAD, the tagline, the photographic scene, the palette and the font, see DESIGN.md → Logo, Colors and Typography.
- **Anti-references (PRD §7):** casino-style rewards (no reveals, coins or confetti); pressure mechanics (no timers, streaks or countdowns, including in trivia); stereotyped depictions (street drawings and sight art have no people and avoid clichés; facts are reviewed per NFR-8).
- **Directions** (working renders in `.working/`, not shipped): A is the base, with borrowings from B and D (DESIGN.md → Brand & Style); nothing was taken from C (Transit Line). No reasons were recorded beyond the user picking A.
- **Rejected variants within A:** mode as a header badge (M1) or status chip (M2), in favour of the passport cover (M3); the shrunken map (280 px) in favour of the slim strip + larger loupe; the full-screen arrival card (F2) in favour of the F1 sheet with F2's drawing; the floating strip (MAP-2) in favour of the in-flow strip; the city-map inset (X3a-C), deferred.

## Core vs Extension

| Area | [CORE] | [EXT] |
|---|---|---|
| Start | Name field, New journey, How to play, tagline | Mode cards, Saved journey card, Continue journey, unreadable-save banner, can't-save line |
| Persistence | Intro flag, last name | Saved journey, reload restore |
| Passport | Explorer cover, stamps, album, three-row cover | Nomad cover, "+N" badge past 5 stamps |
| Map | World map, region loupe (4 regions), Zoomed region, city-day card (Plan the day, unavailable, Call home), resting panel, short chips, route sheet with warning | City-day card work variant, Africa region (with Cape Town) |
| City day | Single stay line, sights, running total, repeat visit, back to map | End-of-day choice (Budget / Comfort / Leave tonight rows), compact sight cards |
| Day complete | Stamp lands, polaroid, repeat variant | "Board the …" variant, over-goal copy |
| Work | — | Shift card, question, feedback, result, work-unavailable states |
| End | Travel home, Call home, Can't-continue sheet, Journey summary | Mode shown on the summary (FR-18) |
| Sound | No sound | Optional sound effects, off by default, Menu toggle (FR-24) |
| Deferred | — | City-map insets (post-MVP) |

## Visual References

`.working/` keeps every render as the audit trail; only these files are referenced.

| File | Frames | Illustrates | Superseded by later decisions |
|---|---|---|---|
| [mockups/screens-core.html](mockups/screens-core.html) | MAP-C, MAP-Z, F1, F2, S1, S2, MENU, P1, P2, H1, H2, J1, J2 (map drawing MAP-IST sits behind H1/H2) | Map at rest and zoomed, arrival card, start, intro, menu + confirm, Passport tabs, Travel home, journey summaries | Day labels one lower (Paris "Day 5" → Day 6); text under 11 px; F2's full-screen layout (only its street drawing stands); S1 tagline; J1 lede; intro button from Start ("Got it"); fare and status sublabel sizes |
| [mockups/city-day.html](mockups/city-day.html) | MAP-1, MAP-2, CD1, CD1b, CD2, CD2b, dark proof strip | Route sheet panel (MAP-1 only); City day, low money, Day complete, repeat visit | MAP-1's strip/loupe layout and MAP-2's floating strip (map layout per MAP-C); CD1's two-row cover and day labels; no "‹ Map" on City day; text under 11 px |
| [mockups/screens-ext-1.html](mockups/screens-ext-1.html) | X1a, X1b, X1c, X2, X2b, X3a, X3b, X3c, X3d, X3e | Start [EXT], unreadable save, end-of-day choice, night departure, shift questions, work unavailable | Side-by-side cover ("EXPLORER PASSPORT · Ingrid" in X1a, X1b, X2, X3d) → three rows; name max 20 → 14; X2b timing (Rome Day 7 from a Day 5 city day) → arrival the day after the city day; X3a Europe loupe in Tokyo → X3a-R; X2 and X3d → ext-2 versions; ".50 rounding" note → halves round up; night-departure shift flag → Budget tier |
| [mockups/screens-ext-2.html](mockups/screens-ext-2.html) | PC, X2, X3d, X3a-R, X3a-C | Cover specimens, City day and Shift result with the stacked cover, region inset | PC mode row 8.5 px → 11 px; cover 146 px → 172 px; long-name ellipsis → 14-grapheme rule; X3a-C deferred (reference only) |
| [mockups/screens-final.html](mockups/screens-final.html) | CH1a, CH1b, CH2, CH3, DM1, DM2, DM2-w | Route sheet with every row unavailable, Call home, Can't-continue (stranded), failed summary, dark map, dark route sheet, dark warning row | `on-unavailable` `#635B4B` → `#625A4B`; CH3 lede "Out of days in Rome" → "Stranded in Rome — no way home in time." (CH2 is the stranded case); DM2's ochre selected border → `ink`; "Tap the Europe circle" hint → region-aware |

## Open Items

1. **C4 / PRD:** FR-12 ends the journey when Call home can't fit, but FR-13 ends it only when no action is left (a city day or [EXT] shift may still be possible). The UI follows the rules layer's `ended` flag; the PM reconciles the two rules.
2. **H7 / PM:** night-departure direction. Addendum §5 lists one direction per night route; routes are bidirectional. The UI shows one "Leave tonight" row per night departure that the data defines.
3. **H11:** sign-off for new copy tagged [ASSUMPTION] in Copy templates (0-stamp Call home, out-of-days sheet, 5th-stamp and repeat Day complete, stranded tip, can't-save line, no-days shift reason, the "Money's tight" threshold).
4. **C3:** region records for North America / Atlantic, Oceania and Africa [EXT] have no rendered radius, scale or placement; set them in data and check on a device.
5. **UJ-3 balance** (PRD Open Question 5): Amira reaches Sydney with €36 and can't afford a city day there.
6. **Fact-check** of the Tivoli Gardens fact (NFR-8), pending with the team: "Opened in 1843, Tivoli is the world's second-oldest amusement park still running — the oldest, Bakken, is just up the road."
7. **Logo:** the clean vector redraw (DESIGN.md → Logo).
