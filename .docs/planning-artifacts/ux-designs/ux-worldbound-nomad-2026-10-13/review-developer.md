# Developer / Implementability Review — WORLDBOUND: NOMAD UX spines

Reviewed: `DESIGN.md`, `EXPERIENCE.md` (both 2026-10-13), `.memlog.md`, PRD + addendum, renders in `.working/` (evidence only). Lens: a developer or coding agent building the UI without asking anyone. No spine was edited.

## Verdict

The visual system is unusually concrete: every token reference resolves, every colour role has a dark pair, and the component table is close to buildable. The behaviour spine is weaker. A builder would get stuck on navigation (no exit from City day, no back, reload or URL model), on the map (no coordinates, projection, loupe mechanics or region data schema), and on several rule-to-UI seams (when Call home and journey end actually appear, more than 5 stamps, multiple night departures). **Not ready to hand to implementation until the 4 critical and the high findings below are closed.** Most fixes are short additions, not redesigns.

Counts: **Critical 4 · High 10 · Medium 12 · Low 8**

---

## Critical

### C1. City day has no exit, and no screen defines "back"
- **Location:** EXPERIENCE → IA (City day, Passport, Day complete), Component Patterns → City day, Navigation model; render `direction-a3.html` CD1 (no back or close control).
- **Problem:** City day is a full screen whose only action is "End the day — €X". There is no back, cancel or × to return to the Map without committing. The Passport screen has a "‹ Map" back control in the render (`screens-core-1.html`), but the spine never specifies it. The navigation model says full screens "return to the Map", but not how. The browser/Android back button isn't mentioned at all.
- **Forced guess:** whether City day can be abandoned (and whether the draft selection is kept), what control does it, and what the hardware/browser back does on each surface (close sheet? leave the site?).
- **Fix:** Add a "Back navigation" table to EXPERIENCE: per surface, the visible back control (e.g. City day: "‹ Map" top-left, discards the draft), and the browser-back behaviour (recommend: back closes the open sheet, then returns full screens to the Map, and never leaves the game while a journey is in progress). Add "‹ Map" to the City day anatomy in DESIGN.

### C2. Reload, URL and deep-link model is undefined; core persistence contradicts the PRD
- **Location:** EXPERIENCE → Foundation "Persistence", State Patterns "Storage unavailable", Core vs Extension; PRD FR-20 [EXT], NFR-9.
- **Problem:** Foundation says browser storage holds "game state", but save/resume is FR-20 [EXT]. So in the core, what does a reload mid-journey do? Is the journey lost silently, or kept? Nothing says whether screens have URLs, whether "View album" is a route or in-memory state, or what a reload on City day, mid-sheet or mid-shift restores.
- **Forced guess:** whether the core persists state at all, whether to use routes or hash URLs, and whether to warn on unload.
- **Fix:** State it explicitly. Recommended: a single URL with no deep links, and an in-memory screen state. In the core, a reload returns to Start and the journey is lost (no warning, per "no pressure"), or the team pulls autosave into the core. In EXT, a reload restores the last *committed* game state and always lands on the Map (or the Journey summary if the journey ended). Drafts and open sheets are never restored.

### C3. Map geometry is left to guesswork
- **Location:** DESIGN → Region loupe, Zoomed region, Component table "Map"; EXPERIENCE → Content Assets (World map, Region insets).
- **Problem:** No city coordinates (lat/lon), no projection bounds or crop (latitude range, centre meridian), and no base scale. "5.8×" and "2.1×" don't say relative to what. "10.6 px per degree" is given for MAP-Z only, and it isn't clear whether it applies to every region. The spine also doesn't say whether the loupe is a clipped and scaled copy of the world SVG or separate inset artwork. Content Assets lists "4 (+1) region insets" as assets, while the loupe spec implies computed magnification. A coarse world outline at 5.8× will look blocky. Route lines (straight in projection, or arcs? NY–Tokyo across which ocean?) are unspecified. Hit model conflict: "Tap a destination marker" (Map) vs "the whole loupe is the tap target" (Region loupe). Paris and London are about 2–3 px apart on the world map, so markers there can't be 44 px targets. Zoomed-region pills need "no overlaps" and leader lines, but there's no placement data.
- **Forced guess:** coordinates, projection, inset implementation, which markers are tappable, and pill offsets.
- **Fix:** Add a "Map data contract" section: per place `{id, name, iata, lat, lon, regionId, labelOffset, pillOffset}`. World map: equirectangular, lon −180…180, lat crop (e.g. 72°N…−48°S), viewBox units. Region record: `{id, bounds(lat/lon box), loupeCentre(px on world), loupeRadius, scale(px per degree), sourceShape(box|circle), zoomScale(px per degree), geometry asset}`. State that the loupe renders the region's own higher-detail geometry at `scale`. Route lines are straight segments in projection, with any exceptions listed. Tap rules: in-region markers aren't individually tappable (the loupe is); out-of-region markers are tappable with 44 px hit circles; when hit circles collide, only the chip list applies.

### C4. Call home and journey-end triggers have no defined moment or persistent entry point
- **Location:** EXPERIENCE → IA (Call home sheet "Shown when the FR-12 condition holds"), Component Patterns (Call home sheet), State Patterns ("Cannot afford any travel", "No action left"), UJ-2 failure path; PRD FR-12, FR-13.
- **Problem:** The spine doesn't say whether the sheet auto-opens, when (on return to the Map? after the arrival card?), or how it is reopened after "Not now". UJ-2 says it "is offered again while the condition holds" without saying where. Jonas in Rome with €20 can't afford a city day either, so after "Not now" he has no action except a sheet with no visible entry point, which breaks FR-13 "never stuck". The FR-13 auto-end (no travel, no city day, no Call home that fits) has no transition: does the arrival card show first, or does the game cut straight to the summary? The spine also turns "call home can't fit" into a confirm that ends the journey, while FR-12 and FR-13 read as the game ending it. Who decides that the ending is a choice?
- **Forced guess:** trigger timing, re-entry control, and the end-of-journey screen sequence.
- **Fix:** Specify: (1) a persistent "Call home" entry while FR-12 holds (e.g. in the resting panel in place of the chips, plus the city-day card), (2) auto-open once on the first Map view where the condition becomes true, (3) the FR-13 end sequence (e.g. arrival card → "Continue" → Journey summary, failed-away copy), and (4) whether the can't-fit variant is a confirm or a notice. Align (4) with FR-12 or log a PRD change.

---

## High

### H1. Every visual-reference link is broken
- **Location:** DESIGN header and body, EXPERIENCE Foundation and IA "Reference" column.
- **Problem:** The spines link `mockups/screens-core.html`, `mockups/screens-ext.html` and `mockups/city-day.html`. There is no `mockups/` folder. The renders live in `.working/` under other names (`screens-core-1`, `screens-ext-1/-2`, `direction-a3`). "city-day MAP-1" is actually in `direction-a3.html`. The renders also contain known-wrong numbers (CD1 shows "Day 5 of 30 · 25 days left", which is internally inconsistent).
- **Forced guess:** which file and frame is meant.
- **Fix:** Promote the renders into `mockups/` with the referenced names (and fix the day labels on promotion, as the memlog says), or rewrite the links to the `.working/` paths with frame IDs.

### H2. Dark mode makes several icons and captions invisible
- **Location:** DESIGN tokens `primary-dark: #E0A243`, `ochre-light-dark: #E0A243`, `slot-dash-on-navy-dark`; components `button-primary.icon`, `tabs.selected`, `region-loupe.zoom-tag`, Intro goal box, Feedback box, night-row icon disc, "Back to world" pill, passport/summary "navy band".
- **Problem:** In dark mode `primary` flips to ochre, but every "ochre-light icon on primary" pairing then becomes ochre on ochre (0 contrast): the primary-button icon, the selected-tab icon, the zoom tag, and the intro caption. The intro's `slot-dash-on-navy` slots sit on ochre. Many components say "navy fill" or "cream text" in prose instead of a token, so in dark mode the developer can't tell whether they mean `primary` (ochre) or `cover-explorer` (stays navy).
- **Forced guess:** dark colours for roughly 8 components.
- **Fix:** Add `on-primary-icon` (light ochre-light, dark navy) and a `navy-surface` role (light `#0A1826`, dark `#0A121A`) with an `on-navy-surface` pair. Replace every prose "navy" and "cream" in the component table with tokens.

### H3. More than 5 stamps isn't designed
- **Location:** Stamp slot ("Five slots"), passport strip and cover, Stamp page, Journey summary ("row of five 50 px stamps"), Day complete copy ("Three to go"); PRD Goal "at least 5"; addendum §6 (6 stamps reachable in EXT).
- **Problem:** A 6th stamp has nowhere to go. Spec gaps: count display ("6/5"?), strip overflow, Day complete copy after 5, and Travel home "Stamps 5/5" with 6.
- **Forced guess:** layout and copy.
- **Fix:** Define: the count shows "6 stamps · goal 5" (or "6/5"); the strip shows 5 slots plus a "+1" badge; the Stamp page grid grows; the summary row wraps; Day complete copy after the goal: "That's 6. Goal already met." Optionally decide that the core can't reach 6 (SM-3) and tag this [EXT].

### H4. Multiple night departures per city vs one "Leave tonight" row
- **Location:** EXPERIENCE End-of-day choice, Flow 5; addendum §5 (night routes); DESIGN Option row "Night row".
- **Problem:** Routes are bidirectional. If night departures are too, Paris has three (night bus to CPH, night bus to London, night train to Rome) and London has two. The spine shows a single "Leave tonight" row naming one train. It also doesn't say whether night departures appear as rows in the Route sheet (the glossary calls them a transport mode) or only in City day.
- **Forced guess:** one row per night departure, a sub-choice, or the first one only; and the Route sheet treatment.
- **Fix:** One "Leave tonight" row per night departure ("Night bus to London · €70"). The end-of-day list grows (note the height impact). Night departures don't appear in the Route sheet (or appear as unavailable with "Leaves after a city day here"). Ask the PM whether night departures are directional.

### H5. Game state vs UI state isn't classified
- **Location:** Missing throughout. Hints: Status chip "values update only after an action completes", Earnings pill, Running total.
- **Problem:** NFR-2 needs a clean rules API. The spine never lists what is committed game state vs draft or presentational state. Most dangerous: a shift is answered one question at a time, but the money changes only at the end. Is each answer a rules action (so a mid-shift reload can't re-answer after seeing the right answer), or is the shift one atomic action?
- **Forced guess:** the action granularity and what save/restore covers.
- **Fix:** Add a "State ownership" table. Game state (rules layer, saved): position, money, days used, stamps (ordered), album, visited sights, per-destination city-day count and last tier, question index, answers in the current shift, called-home flag, ended/outcome, mode, name, intro flag. Draft UI state (discarded on leave/reload): selected route option, selected sights, selected end-of-day choice. Presentational: open sheet, sheet content variant, Passport tab, zoomed region, arrival card shown, banner dismissed, motion state. Rule: the shift commits per answer (recommended), and the payout happens on the result screen.

### H6. Content asset requirements are missing formats, sizes, naming and schema
- **Location:** EXPERIENCE → Content Assets; DESIGN Polaroid, Sight card, Arrival fact card.
- **Problem:** No file formats (SVG line art? WebP photos?), aspect ratios or pixel sizes. Display sizes vary from 44×36 thumbs and 62–86 px polaroids to 118 px summary polaroids, an 82 px sight drawing, an unsized "large" Polaroid sheet, and a full-bleed street drawing of unknown size. There's no naming convention, no data fields linking assets to content (ids), no alt text (needed for NFR-5 and screen readers), no licence/source fields (NFR-8 requires them), and no dark-mode treatment for line art drawn on paper. "Stamp art" is listed as 8 (+2) assets but is "generated from the spec", so is it a file or a component? Sight photos are "photos", yet the renders use line drawings. Which is it?
- **Forced guess:** everything about the asset pipeline.
- **Fix:** Add per-asset rows with format, master size and aspect (e.g. sight image 4:3, 800×600 WebP or an SVG drawing; street drawing SVG, 375×520 safe area, `currentColor` strokes so it themes), naming `assets/sights/<destId>-<sightId>.webp`, and a schema sketch: `sight {id, destId, name, price, fact, image, imageAlt, source, licence}`, `destination {id, iata, name, costFactor, fact, streetDrawing, streetDrawingAlt, regionId, lat, lon}`, `question {id, destId, order, text, options[4], correctIndex, sightId?}`. State that stamps are a component, not assets.

### H7. City day unavailable (FR-8) is not designed
- **Location:** State Patterns; City-day card; Arrival fact card; PRD FR-8, FR-9.
- **Problem:** FR-8 makes the city day unavailable when money is below the stay price or 0 days remain. The spine covers unaffordable sights and routes, but not "Plan the day" itself on the city-day card and the arrival card. The arrival card's "No stamp unless you spend a day here" line is wrong on a repeat visit, and no repeat-visit arrival copy is given.
- **Forced guess:** the disabled treatment and its copy.
- **Fix:** Add states: "Plan the day" uses `button-unavailable` with the reasons "Not enough money for a night here (€80, you have €45)" and "No days left for a city day". Add arrival-card copy for repeat visits ("You already have your Paris stamp.").

### H8. Copy is given as examples, not templates
- **Location:** EXPERIENCE → Decided strings.
- **Problem:** Most strings carry hard-coded sample values ("€19", "Day 7", "Paris", "Three to go"). Not defined: variable names, pluralisation ("1 day left", "1 stamp"), number formatting (€1,270, en-GB vs en-US), the numbers-as-words rule ("Three to go"), transport verbs ("Take the train / bus", "Fly", "Board the …", and the night-bus and overnight-flight variants), the "Money's tight" threshold, the via-city hint rule for "No direct route", the Tip selection logic, which city "€X to go for <City>" and "now within reach" name, the full Call home sheet copy (Open item 1), Day complete eyebrow and lede variants (repeat visit, 5th stamp), the resting-panel title at Bergen, the failed-away summary eyebrow, and Call home with 0 stamps.
- **Forced guess:** dozens of strings and rules.
- **Fix:** Convert Decided strings to a key/template table, e.g. `route.consequence = "You'll reach {city} on Day {day} with {money} left."`, with plural and format rules and a "rule source" column (rules layer vs UI) for the computed choices (via-city, target city, tip).

### H9. The Route sheet selection and transitions are ambiguous
- **Location:** Component Patterns → Option row, Route sheet, Travel home sheet; IA Route sheet.
- **Problem:** Is a row preselected (cheapest? fastest? none)? What does the primary button read and do before a selection? Does the Bergen route switch to the Travel home sheet on row tap or on primary tap, and what does its primary read? When opened from a Zoomed region city pill, does the sheet open over the zoomed view, and does closing it return there or to the world?
- **Forced guess:** default selection and return target.
- **Fix:** Specify: no preselection, and the primary is `button-unavailable` "Choose how to travel" until a row is picked (or preselect the cheapest available row). For Bergen, the primary "Continue · €X" replaces the content with Travel home. The sheet opens over the current view and closing it returns there.

### H10. "Name never truncates at 14 characters" isn't guaranteed
- **Location:** DESIGN Passport cover (172 px, `passport-name` 13.5 px 700); EXPERIENCE Name field; PRD FR-1.
- **Problem:** 14 wide glyphs ("WWWWWWWWWWWWWW", or CJK/emoji) at 13.5 px bold measure roughly 170–190 px. The available width is about 172 − spine 4 − padding 16 = 152 px. The spine doesn't say whether the 14 is counted in UTF-16 units or graphemes, whether whitespace is trimmed, or whether a whitespace-only name falls back to "Traveller". The saved card and the summary "Ingrid's journey" also have their own widths.
- **Forced guess:** counting, sanitising, and overflow handling.
- **Fix:** Count graphemes, trim, and treat empty or whitespace-only as "Traveller". Add a fallback: shrink the name row to 11 px, then ellipsis, as a safety net (or restrict input characters). Use "Ingrid's journey" only when a name is set.

---

## Medium

### M1. Viewport height isn't specified, so the map can collapse
- **Location:** DESIGN Layout (map from y = 144, panel fixed 318 px, "fits at 375 × ~780").
- **Problem:** At 375×667 (iPhone SE) the map gets about 205 px; the r112 loupe (224 px) doesn't fit. Browser chrome reduces height further. A 200% text-zoom assumption contradicts the fixed-px strip, cover and panel heights.
- **Fix:** State a minimum supported height and the behaviour below it (shrink the loupe radius by a factor, let the panel collapse to chips only, or let the page scroll). Set heights as minimums, not fixed values.

### M2. The resting panel's content may not fit
- **Location:** DESIGN Resting panel.
- **Problem:** Bergen has 8 routes, so 8 chips plus the title, hint, caption and map key in 318 px. The spine doesn't say whether the panel scrolls, wraps or truncates. The 40×4 grab bar suggests drag, but there is no drag.
- **Fix:** Chips wrap and the panel body scrolls internally. Drop the grab bar or state that it is decorative.

### M3. The core has no unaffordable state for destination chips
- **Location:** Core vs Extension (the "short" chip is [EXT]); Destination chip.
- **Problem:** In the core, a destination whose cheapest fare is above the player's money still needs a visual state. Without the [EXT] variant, the core chip would look affordable.
- **Fix:** Move the "€X short" variant into [CORE]. Work only adds the "would cover" hint.

### M4. "Safe choice is primary" contradicts Travel home and Call home
- **Location:** Component Patterns → Buttons ("In confirms, the safe choice is the primary button") vs Travel home ("Fly home" primary) and Call home ("Call home" primary).
- **Fix:** Scope the rule to the destructive New journey confirm only, or flip those sheets. State which.

### M5. Where "New journey" lands is unclear
- **Location:** Journey summary, Menu confirm, UJ-1 step 10, Flow 4; Intro reopened label.
- **Problem:** Does "New journey" go to the Start screen (name, mode) or straight to the Map? Is the core name remembered across journeys? The reopened intro says "Back to my journey" even when opened from the Start screen with no journey.
- **Fix:** New journey → Start screen with the last name prefilled → Map (the intro is skipped once the flag is set). The intro button from Start reads "Got it".

### M6. Sight affordability with tiers and night departures
- **Location:** Sight card (FR-21), End-of-day choice.
- **Problem:** FR-21 measures money "after accommodation". With [EXT] tiers or a night ticket, which cost is the baseline? If the player adds sights and then switches to Comfort, making a sight unaffordable, is the sight auto-removed, or is the choice blocked?
- **Fix:** The baseline is the currently selected end-of-day cost (stay tier or night ticket). An option whose total exceeds money is unavailable with the reason "Too much with your sights — remove one".

### M7. Surface types are ambiguous
- **Location:** IA (Passport, Arrival fact card, Zoomed region).
- **Problem:** Is the Passport a full screen or a sheet? Does the arrival card keep the top stack (status chips) over the street drawing? Read mode has both × and "Close". Does Zoomed region keep the strip and panel?
- **Fix:** Add a "Surface type" column (full screen / sheet / in-place view) and a "top stack visible" column to the IA table.

### M8. Tokens are incomplete for a CSS-variable build
- **Location:** DESIGN frontmatter and component table.
- **Problem:** Many sizes used in components aren't tokens (13.5, 12.5, 14.5, 11.5, 19, 24 px text; 18/22/26/34/40 px icons; shadows; motion durations 250/600 ms; the focus ring). Composite strings ("1px {colors.rule}, 4px left {colors.ochre}", "{colors.stamp-ring} at 12%") can't map 1:1 to variables. `stamp-code: 8px` is in viewBox units, not CSS px.
- **Fix:** Add `elevation.*`, `motion.*`, `icon.*` and the missing type roles. Split border composites into width, style and colour. Express alpha as `color-mix()` guidance or separate alpha tokens. Mark `stamp-code` as SVG units.

### M9. Logo: type tokens or a vector?
- **Location:** DESIGN Logo.
- **Problem:** The wordmark is specified as `{typography.wordmark}` (system stack, so Roboto on Android) and also as "needs a clean vector redraw". A compass-O can't be built from a system font reliably.
- **Fix:** Ship the logo as an SVG asset (a stand-in until the redraw). The typography tokens then apply only to fallback text.

### M10. Extension city-card actions are vague
- **Location:** Component Patterns → City-day card [EXT].
- **Problem:** "A second city day stays reachable from 'About <City>' and the route panel". There's no route panel; does it mean the arrival card or the resting panel? It's also unclear whether both actions show when work is unavailable (e.g. a 0-day-work state).
- **Fix:** Name the exact control (e.g. a secondary "Plan another day · €80" text link on the card).

### M11. Zoomed region per region
- **Location:** DESIGN Zoomed region.
- **Problem:** Is 10.6 px/° Europe-only? Oceania has one city, so zooming is pointless. Off-map arrow pills: are they tappable, and what do they open? The return transition is unspecified.
- **Fix:** Make zoom scale a region field. Allow `zoomable: false` (loupe not tappable, no "Zoom" tag). Arrow pills open that destination's Route sheet.

### M12. Day counter edge values
- **Location:** Decided strings → Day counter; PRD glossary ("capped at N").
- **Problem:** The cap ("Day 30 of 30" at 30 used) isn't mentioned. Neither is the "0 days left" or "1 day left" singular. The before/after box at the limit is also missing.
- **Fix:** Add the cap and plural rules.

---

## Low

- **L1. Dark-value provenance inconsistent.** DESIGN frontmatter says a2-merged / a3, while the body says city-day.html / a2-merged. Pick one.
- **L2. Core/EXT tag mismatch.** Name field is "[EXT start; core name per FR-1]" in DESIGN but [CORE] in EXPERIENCE. Region data mentions Madrid inside the core Europe inset. Make the region data extensible (an EXT city only adds a record) and tag consistently.
- **L3. Scrim vs FR-3.** The route sheet's scrim covers the status chips that FR-3 says are "always visible on the map". State whether the scrim stops below the top stack.
- **L4. Polaroid sheet openers** omit the Day complete "New in album" polaroid and the Album line. Add them or state that they aren't tappable.
- **L5. Stamp rotation and NFR-1.** "−8° to −12°, alternating ±6–9°": choose a deterministic angle per destination (data or hash) so screenshots and tests are stable.
- **L6. Under 375 px.** At 320 px the cover leaves 108 px for 152 px of slots. "May drop to its slim form" needs a breakpoint.
- **L7. Call home with 0 stamps.** The "Stamps 4 → 3 (your Rome stamp is removed)" line has no 0-stamp variant.
- **L8. Overspecification that will fight implementation.** Absolute y = 144, the cover width derived from a font measurement in Avenir Next, "verified in renders" no-scroll claims, and the exact 318 px panel shared by every sheet. Restate them as constraints (min targets, min map height, panel ≤ 40% of viewport, cover fits "EXPLORER PASSPORT" at 11 px in any fallback) so a real layout engine can satisfy them.

---

## What is solid (keep)

- All `{token}` references resolve, and every colour has a `-dark` pair (checked by script).
- The "unavailable with reason comes from the rules layer" principle (Foundation) is the right NFR-2 seam.
- The UJ-1, UJ-2 and Flow 5 numbers check out against the addendum (Day 3 €1,430; Day 6 €1,270; €423 / 16 days; Jonas Day 11 → 18, €20; Paris night train → Rome Day 7, €1,140).
- The never-colour-alone mapping and the 11 px floor are stated precisely enough to test.
