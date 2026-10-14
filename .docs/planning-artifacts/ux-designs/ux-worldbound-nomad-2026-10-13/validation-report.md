# Validation Report — WORLDBOUND: NOMAD

- **DESIGN.md:** `/Users/christianstorum/Rammeverket/Worldbound/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/DESIGN.md`
- **EXPERIENCE.md:** `/Users/christianstorum/Rammeverket/Worldbound/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/EXPERIENCE.md`
- **Run at:** 2026-10-13

## Overall verdict

The pair is a solid downstream contract. Every UJ and FR from the PRD and addendum maps to a surface, a component row and a flow, all flow numbers reconcile with the addendum tables, every {token} reference resolves, and the stated contrast values match recomputation. The rubric found two high gaps that would push guesswork onto story-dev: “navy” components that collapse in dark mode because they bind to primary/ink, which flip to ochre and cream (1.0:1), and a Call home sheet with no defined trigger and no persistent entry after “Not now”.

The two extra reviewers shift the picture from “nearly ready” to “ready for architecture once behaviour is filled in”. The developer lens finds four critical gaps a builder could not resolve alone: no back or exit model, no reload/URL/persistence model, no map geometry or hit model, and the Call home trigger, which it rates critical. The accessibility lens confirms the visual floor but finds the behavioural layer thin: dialog semantics, a map screen-reader model that can't be built, and no 200% text strategy. All three reviewers independently hit the dark-mode ochre-on-ochre collision. The 8 px stamp-code exception is now approved and logged (R1); the reviewer's correction that the codes render at about 4.5–4.8 px stays open as L11. The missing mockups/ folder is a known pending promotion step (H5). After deduplication: Critical 4 · High 13 · Medium 18 · Low 25, plus 1 resolved.

## Category verdicts

- Flow coverage — strong
- Token completeness — adequate
- Component coverage — adequate
- State coverage — adequate
- Visual reference coverage — adequate
- Bloat & overspecification — adequate
- Inheritance discipline — adequate
- Shape fit — strong

## Findings by severity

### Critical (4)

**C1 · [Reviewer; developer C1, accessibility M6 (Esc part)]** — City day has no exit, and no surface defines "back" (§ EXPERIENCE → IA, Component Patterns → City day, Modal sheet, Travel home sheet; render CD1)  
City day's only action is "End the day — €X". There is no back, cancel or × to return to the Map without committing. The Passport's "‹ Map" control exists in the render but not in the spine. Browser and Android back are never mentioned. Esc on a replaced-content sheet closes the whole sheet, while "Not yet" goes one step back, so one surface has two meanings of "back".  
Fix: Add a Back-navigation table: per surface, the visible back control (City day: "‹ Map" top-left, discards the draft) and browser-back behaviour (closes the open sheet, then returns full screens to the Map, never leaves the game mid-journey). Esc on a replaced sheet = one step back; scrim = close all. Add "‹ Map" to the City day anatomy in DESIGN.

**C2 · [Reviewer; developer C2]** — Reload, URL and persistence model undefined; core persistence contradicts FR-20 [EXT] (§ EXPERIENCE → Foundation "Persistence", State Patterns "Storage unavailable", Core vs Extension; PRD FR-20, NFR-9)  
Foundation says browser storage holds game state, but save/resume is FR-20 [EXT]. What a mid-journey reload does in the core is unstated, as is whether screens have URLs and what a reload on City day, mid-sheet or mid-shift restores.  
Fix: Single URL, no deep links, in-memory screen state. Core: reload returns to Start and the journey is lost (or pull autosave into core). EXT: reload restores the last committed game state and lands on the Map (or Journey summary if ended). Drafts and open sheets are never restored.

**C3 · [Reviewer; developer C3, accessibility H3]** — Map geometry and marker hit model left to guesswork; world-map markers break the 44 px floor (§ DESIGN → Region loupe, Zoomed region, Components "Map"; EXPERIENCE → Content Assets, Component Patterns → Map, Accessibility Floor → Targets)  
No city coordinates, projection bounds, crop or base scale; "5.8×" and "2.1×" have no reference. Unclear whether the loupe is a scaled copy of the world SVG or separate inset art. Route-line shape unspecified. "Tap a destination marker" conflicts with "the whole loupe is the tap target". At 375 px the world map is about 1 px per degree, so from Tokyo or New York the European markers sit a few px apart: tappable markers break NFR-5 (44 × 44) and WCAG 2.5.8, and their hit areas overlap. There is no zoom path to Europe from outside it.  
Fix: Add a Map data contract: per place {id, name, iata, lat, lon, regionId, labelOffset, pillOffset}; world map equirectangular with stated crop and viewBox; region record {bounds, loupeCentre, loupeRadius, scale, zoomScale, geometry asset}. Tap rules: markers inside a loupe are never individual targets; other markers are tappable only with non-overlapping ≥ 44 px hit circles, otherwise decorative; outside Europe the Europe box is a single 44 px target or not interactive (chips remain the path). Add the hit-circle rule to Accessibility Floor → Targets.

**C4 · [State coverage; rubric §4 (high), developer C4, accessibility M6 (re-entry part)]** — Call home and journey end have no trigger moment and no persistent entry point (§ EXPERIENCE → IA "Call home sheet", Component Patterns "Call home sheet", State Patterns "Cannot afford any travel" / "No action left", UJ-2 failure paths; PRD FR-12, FR-13)  
"Shown when the FR-12 condition holds" never says when the sheet opens (return to Map, after the arrival card, on tapping a route). After "Not now" it is "offered again while the condition holds" with no named control. Jonas in Rome with €20 cannot afford a city day either, so a dismissed sheet leaves him stuck, which FR-13 forbids. The FR-13 auto-end has no screen sequence, and the "can't fit" variant is a confirm while FR-12/FR-13 read as the game ending the journey.  
Fix: (1) A persistent "Call home" entry while FR-12 holds (resting panel in place of the chips, plus the city-day card) with copy and cost line. (2) Auto-open once on the first Map view where the condition becomes true. (3) Define the FR-13 end sequence (e.g. arrival card → Continue → Journey summary, failed-away copy). (4) Decide whether can't-fit is a confirm or a notice; align with FR-12 or log a PRD change.

### High (13)

**H1 · [Token completeness; rubric §2, accessibility H4, developer H2]** — Dark mode: ochre content on the ochre primary-dark collapses (1.0:1) (§ DESIGN → Colors (primary-dark = ochre-light-dark = #E0A243); components button-primary icon, Tabs selected, region-loupe zoom-tag, Intro goal box, Feedback box, Night row disc, "Back to world" pill, map-marker-home)  
Components described as "navy" bind to `primary`/`ink`, which flip to ochre and cream in dark mode. Ochre-light on primary-dark is 1.00:1 and cream on it 1.94:1: the intro goal-box caption, the correct-answer check (the non-colour cue for "correct"), the selected-tab icon, the zoom-tag icon and the primary-button icon vanish, the feedback link fails, and map-marker-home's icon is #F4EFE1 on #F4EFE1. Prose "navy fill" / "cream text" is never mapped to a token. None of these pairs are in the contrast table.  
Fix: Split the roles: keep `primary` for the button, add `navy-surface` / `on-navy-surface` (e.g. light #0A1826, dark #0A121A) for decorative navy blocks, and/or `on-primary-icon` with a navy dark value. Give map-marker-home a contrasting dark icon token. Replace every prose "navy"/"cream" with tokens and add the dark pairs to the contrast table.

**H2 · [Reviewer; accessibility H1]** — Modal sheets lack dialog semantics, focus containment and an inert background (§ EXPERIENCE → Component Patterns → Modal sheet; Accessibility Floor → Focus)  
Focus "moves into the sheet and returns to the trigger", but there is no role="dialog", aria-modal, accessible name, focus trap or inert background. Keyboard and screen-reader users can leave the sheet for controls behind the scrim (WCAG 2.4.3). The resting panel looks like a dialog but isn't, and the spine doesn't separate them.  
Fix: role="dialog", aria-modal="true", aria-labelledby to the headline; rest of the app `inert`; Tab wraps; background scroll locked; initial focus on the headline (tabindex="-1"). State that the resting panel is a normal region (section with heading).

**H3 · [Reviewer; accessibility H2]** — "Map is aria-hidden apart from its tappable markers" cannot be built (§ EXPERIENCE → Accessibility Floor → Screen readers; Component Patterns → Map, Region loupe, Zoomed region)  
Children of an aria-hidden element can't be re-exposed; focusable content inside it is focusable but silent. Keyboard access to the loupe (the only way into the Zoomed region) is unspecified. The renders use a third model (role="img" with a label).  
Fix: SVG artwork aria-hidden with pointer-only markers; the loupe is an HTML button ("Zoom in on Europe"); zoomed-region city pills and "Back to world" are HTML buttons; chips and route sheet remain the full accessible path; add a visually hidden "Map" heading with a where-you-are line. Drop the [ASSUMPTION] tag.

**H4 · [Reviewer; accessibility H5, developer M1]** — No strategy for 200% text or short viewports; fixed heights will clip (§ EXPERIENCE → Accessibility Floor → Zoom; DESIGN → Layout & Spacing; tokens status-chip-height, strip-height, cover-height, cover-width, panel-height)  
Cover width (172 px) was derived from "EXPLORER PASSPORT" at 11 px and needs about 250–270 px at 200%. Chips, strip and panel are fixed heights (WCAG 1.4.4, 1.4.10, 1.4.12). At 375 × 667 the map gets about 205 px and the r112 loupe doesn't fit. Nothing forbids maximum-scale=1 / user-scalable=no.  
Fix: Fixed sizes become min-height with rem type. Large-text fallback: chips wrap, cover drops to the slim strip, slots wrap, panel and sheets scroll internally, map may shrink; "fits without scrolling" applies at 100% only. State a minimum supported height and behaviour below it. Viewport meta must not disable zoom. Promote the 200% target from [ASSUMPTION].

**H5 · [Visual reference coverage; developer H1, rubric §5 (medium, MAP-1; promotion noted as pending)]** — Visual-reference links don't resolve: mockups/ not yet promoted (known pending step) (§ DESIGN header and body; EXPERIENCE → Foundation, IA "Reference" column)  
Known pending promotion step: the spines link mockups/screens-core.html, screens-ext.html and city-day.html, but mockups/ doesn't exist yet; renders sit in .working/ under other names. The Route sheet is cited as "city-day MAP-1", but Foundation lists city-day.html as CD1/CD1b/CD2/CD2b only, and MAP-1 lives in direction-a3.html beside a superseded strip/loupe layout. CD1 shows inconsistent day labels.  
Fix: Run the promotion: copy renders into mockups/ under the referenced names, include MAP-1 in city-day.html with the note "route sheet panel only; map layout per MAP-C", list it in Foundation, and fix the day labels on promotion.

**H6 · [Reviewer; developer H3]** — More than 5 stamps isn't designed (§ DESIGN → Stamp slot, passport strip/cover, Stamp page, Journey summary; EXPERIENCE → Day complete copy; addendum §6)  
The goal is "at least 5" and 6 are reachable in EXT, but there are five slots, a "row of five" on the summary, "Three to go" copy and "Stamps 5/5" on Travel home.  
Fix: Count reads "6 stamps · goal 5"; strip shows 5 slots plus a "+1" badge; Stamp page grid grows; summary row wraps; post-goal Day complete copy ("That's 6. Goal already met."). Or tag the case [EXT] if the core can't reach 6.

**H7 · [Reviewer; developer H4]** — Multiple night departures per city vs a single "Leave tonight" row (§ EXPERIENCE → End-of-day choice, Flow 5; DESIGN → Option row "Night row"; addendum §5)  
If night routes are bidirectional, Paris has three night departures and London two, yet the spine shows one "Leave tonight" row. It doesn't say whether night departures appear in the Route sheet.  
Fix: One "Leave tonight" row per night departure, noting the height impact; night departures absent from the Route sheet (or unavailable with "Leaves after a city day here"). Confirm directionality with the PM.

**H8 · [Reviewer; developer H5]** — Game state vs UI state is not classified (§ Missing throughout (hints in Status chip, Earnings pill, Running total))  
NFR-2 needs a clean rules API, but nothing separates committed game state from draft or presentational state. Is each shift answer a rules action (so a mid-shift reload can't re-answer), or is the shift atomic?  
Fix: Add a State ownership table: game state (saved), draft UI state (discarded on leave/reload), presentational state. Recommend the shift commits per answer and pays out on the result screen.

**H9 · [Reviewer; developer H6, accessibility L7]** — Content asset spec lacks formats, sizes, naming, schema and alt-text policy (§ EXPERIENCE → Content Assets; DESIGN → Polaroid, Sight card, Arrival fact card)  
No file formats, aspect ratios, master sizes, naming, ids linking assets to content, licence/source fields (NFR-8) or dark-mode treatment for line art. Sight images are "photos" in text and line drawings in renders. Stamp art is listed as assets yet "generated from the spec". No alt-text policy for content images.  
Fix: Per-asset rows (format, master size, aspect, theming via currentColor), naming convention, and a schema sketch for sight / destination / question with imageAlt, source and licence. Alt policy: street drawings alt="", sight photos short alt, polaroids alt="". Stamps are a component, not assets.

**H10 · [State coverage; rubric §4 (two mediums), developer H7]** — City day unavailable (FR-8) and repeat-visit arrival are not designed (§ EXPERIENCE → State Patterns; Component Patterns → City-day card, Arrival fact card; Decided strings → Arrival, Map)  
FR-8 makes the city day unavailable when money is below the stay price or 0 days remain, but "Plan the day" has no unavailable variant or reason copy. On an already-stamped city the Arrival card still says "No stamp unless you spend a day here" and the card hint says "Finish the day to earn your Paris stamp"; repeat visit is defined only for City day.  
Fix: "Plan the day" uses Button unavailable with reasons ("Not enough for a night here (you have €20)" / "No days left"). Add repeat-visit variants for the Arrival fact card and City-day card ("You already have your Paris stamp.").

**H11 · [State coverage; developer H8, developer L7, rubric §4 (low)]** — Copy is given as examples, not templates; key strings still missing (§ EXPERIENCE → Decided strings, State Patterns "Call home can't fit days", Open Item 1)  
Strings carry hard-coded sample values. Undefined: variable names, pluralisation, number formatting, numbers-as-words, transport verbs, the "Money's tight" threshold, via-city hint, Tip selection, target-city choice, Day complete variants, the Bergen panel title, failed-away eyebrow. The Call home "can't fit the days" string is still [ASSUMPTION], the only FR-12 path with no player-facing string, and the Call home cost line has no 0-stamp variant.  
Fix: Convert Decided strings to a key/template table (e.g. route.consequence = "You'll reach {city} on Day {day} with {money} left.") with plural and format rules and a rule-source column. Write the can't-fit and 0-stamp Call home strings now.

**H12 · [Reviewer; developer H9]** — Route sheet selection and transitions are ambiguous (§ EXPERIENCE → Component Patterns → Option row, Route sheet, Travel home sheet; IA Route sheet)  
Unclear: default selection, the primary button before a pick, when the Bergen route swaps to Travel home, and where closing the sheet returns when opened from a Zoomed region pill.  
Fix: No preselection; primary is unavailable "Choose how to travel" until a row is picked. For Bergen, "Continue · €X" swaps to Travel home. The sheet opens over the current view and closing returns there.

**H13 · [Reviewer; developer H10]** — "Name never truncates at 14 characters" isn't guaranteed (§ DESIGN → Passport cover; EXPERIENCE → Name field; PRD FR-1)  
14 wide glyphs at 13.5 px bold measure about 170–190 px against roughly 152 px available. Counting unit (UTF-16 vs graphemes), trimming and whitespace-only fallback are unspecified.  
Fix: Count graphemes, trim, fall back to "Traveller". Safety net: shrink to 11 px, then ellipsis (or restrict input). Use "Ingrid's journey" only when a name is set.

### Medium (18)

**M1 · [Token completeness; rubric §2 (medium + low), developer M8]** — Tokens incomplete for a CSS-variable build (§ DESIGN → Components table, frontmatter, Shapes)  
Many type sizes have no role (12.5, 13.5/600, 14/600, serif 14/14.5/19/24, 16 bold, 11.5 px), plus icon sizes, shadows, motion durations and the focus ring. Literals remain (answer-row min-height 52px, progress-dot 28px, cover radii, menu row 60 px). Composite strings don't map 1:1 to variables; stamp-code is in viewBox units, not CSS px.  
Fix: Map each size to an existing role or add a few (meta, label-strong, serif-sm); add elevation.*, motion.*, icon.*; split border composites; express alpha separately; mark stamp-code as SVG units.

**M2 · [Reviewer; accessibility M1]** — Focus after in-place swaps and screen changes is undefined (§ EXPERIENCE → IA navigation model; Route sheet, Menu sheet, Confirm block, Day complete, Zoomed region, Arrival fact card)  
When content swaps (route sheet → Travel home, menu → confirm), the focused element disappears and focus falls to body. Screen changes don't set focus or document.title.  
Fix: On any swap or screen change, focus the new headline (tabindex="-1") and set document.title; "Back to world" returns focus to the loupe button; one h1 per screen.

**M3 · [Reviewer; accessibility M2]** — No announcements for stamp landing, money/day changes or running total (§ EXPERIENCE → Accessibility Floor → Screen readers; Status chip, Running total, Day complete, Sight card)  
Only the info banner and answer feedback are live; the stamp moment, balance change and total updates are silent to screen readers.  
Fix: Stamp animation aria-hidden with the Day complete headline carrying the stamp; arrival card states the balance; running total is a polite live region; sight toggles use aria-pressed with the price in the name. Status chips are not live.

**M4 · [Reviewer; accessibility M3]** — Light-mode route dashes and focus ring fall below 3:1 on map colours (§ DESIGN → Region loupe, Colors → Contrast targets; EXPERIENCE → State Patterns → Focus)  
Ochre route dash is 2.91:1 on map-sea and 2.42:1 on map-land (WCAG 1.4.11). The ochre focus ring is 2.42:1 on land; its paper inner ring is about 1.3:1. The contrast table only measures ochre on background.  
Fix: Draw dashes in ochre-text (4.73 on land) or add a paper casing; focus ring on the map uses ink outer + paper inner; add map pairs to the contrast table.

**M5 · [Reviewer; accessibility M4]** — Dashed border is overloaded; unavailable vs warning rows differ by a 1.27:1 fill (§ DESIGN → Option row, option-row-warning, Destination chip, Button unavailable; EXPERIENCE → Never colour alone)  
A dashed slot-dash border means six different things. Unavailable vs selectable-with-warning rows differ mainly by a fill at 1.27:1 (1.06:1 dark).  
Fix: Unavailable rows: block icon in place of the radio + on-unavailable text. Warning rows: live radio + warning glyph. Write the distinction into Never colour alone.

**M6 · [Reviewer; accessibility M5, developer M4]** — Confirm pattern is inconsistent; initial focus and Esc unspecified (§ EXPERIENCE → Buttons ("safe choice is primary") vs Travel home, Call home; Confirm block)  
Three irreversible confirms use two opposite button conventions; Enter on an auto-focused primary would commit Travel home or Call home. Safe-exit words differ ("Not yet" / "Not now").  
Fix: Scope the rule: data-loss confirms make the safe action primary; goal-action confirms make the commit primary. Initial focus on the headline, Esc/scrim = safe action, one safe-exit word.

**M7 · [Reviewer; accessibility M7]** — Quiz answers: accessible result and focus after locking (§ DESIGN → Answer row; EXPERIENCE → Answer row, Feedback box)  
"Wrong" is carried by an unlabelled cross; locking disables the focused row so focus is lost; answer-row spacing unspecified while a single tap commits.  
Fix: Accessible names after locking; rows aria-disabled not disabled; move focus to the feedback box then "Next question"; ≥ 8 px between rows.

**M8 · [Reviewer; accessibility M8]** — Compact sight-card toggle is 26 px (§ DESIGN → Sight card compact EXT variant)  
If the 26 px circle is the target it fails NFR-5; the spine doesn't say the whole card is the target.  
Fix: "The whole compact card is the toggle target (≥ 44 px tall); the circle is the state indicator only."

**M9 · [Reviewer; accessibility M9]** — Name field's hard stop gives no feedback (§ EXPERIENCE → Name field)  
Typing silently stops at 14 characters; screen-reader and low-vision users get no signal.  
Fix: Visible counter ("8/14") via aria-describedby and a polite announcement at the limit; keep the hard stop.

**M10 · [Reviewer; developer M2, accessibility L3]** — Resting panel content may not fit; grab bar is a false affordance (§ DESIGN → Resting panel, Modal sheet)  
Bergen has 8 routes: 8 chips plus title, hint, caption and map key in 318 px, with no wrap/scroll rule. The 40 × 4 grab bar suggests drag that doesn't exist.  
Fix: Chips wrap and the panel body scrolls internally. Drop the grab bar, or mark it decorative and aria-hidden.

**M11 · [Reviewer; developer M3]** — Core has no unaffordable state for destination chips (§ EXPERIENCE → Core vs Extension; Destination chip)  
The "€X short" chip is [EXT], so in the core an unaffordable destination looks affordable.  
Fix: Move the "short" variant into [CORE]; Work only adds the "would cover" hint.

**M12 · [Reviewer; developer M5]** — Where "New journey" lands is unclear (§ Journey summary, Menu confirm, UJ-1 step 10, Flow 4, Intro)  
Start screen or straight to Map? Name remembered? The reopened intro says "Back to my journey" even from Start with no journey.  
Fix: New journey → Start with last name prefilled → Map; intro from Start reads "Got it".

**M13 · [Reviewer; developer M6]** — Sight affordability baseline with tiers and night departures (§ Sight card (FR-21), End-of-day choice)  
FR-21 measures money "after accommodation"; the baseline with [EXT] tiers or a night ticket, and what happens when a tier switch makes a sight unaffordable, are unstated.  
Fix: Baseline = currently selected end-of-day cost; an option whose total exceeds money is unavailable with "Too much with your sights — remove one".

**M14 · [Reviewer; developer M7]** — Surface types are ambiguous (§ EXPERIENCE → IA (Passport, Arrival fact card, Zoomed region))  
Is Passport a screen or a sheet? Does the arrival card keep the top stack? Read mode has both × and Close. Does Zoomed region keep strip and panel?  
Fix: Add "Surface type" and "Top stack visible" columns to the IA table.

**M15 · [Reviewer; developer M9]** — Logo: type tokens or a vector? (§ DESIGN → Logo)  
The wordmark is both {typography.wordmark} (system stack) and "needs a vector redraw"; a compass-O can't be built from a system font.  
Fix: Ship the logo as an SVG asset (stand-in until the redraw); tokens apply to fallback text only.

**M16 · [Reviewer; developer M10]** — EXT city-card actions are vague (§ EXPERIENCE → City-day card [EXT])  
"Reachable from 'About <City>' and the route panel" names no real control; no rule for when work is unavailable.  
Fix: Name the exact control (e.g. secondary "Plan another day · €80" link).

**M17 · [Reviewer; developer M11]** — Zoomed region per region is underspecified (§ DESIGN → Zoomed region)  
Is 10.6 px/° Europe-only? Oceania has one city. Are off-map arrow pills tappable? Return transition unspecified.  
Fix: Zoom scale as a region field; allow zoomable: false; arrow pills open that destination's Route sheet.

**M18 · [Reviewer; developer M12]** — Day counter edge values (§ EXPERIENCE → Decided strings → Day counter)  
The cap ("Day 30 of 30"), "0 days left" / "1 day left" singular and the before/after box at the limit are missing.  
Fix: Add the cap and plural rules.

### Low (25)

**L1 · [Component coverage; rubric §3]** — City pill has no Components table row (§ DESIGN → Region loupe → Zoomed region)  
Visual spec exists only as a sentence in a paragraph.  
Fix: Add a row with current / no-route / off-map arrow variants.

**L2 · [Component coverage; rubric §3]** — Map markers and map key have no Components row (§ DESIGN → Map, Resting panel)  
Five marker states are tokenised but unspecified as a component; world-map treatment of a non-selectable destination and the legend content are missing.  
Fix: Add a "Map marker" row with all five states and a one-line legend spec.

**L3 · [Visual reference coverage; rubric §5, developer L1]** — References to files that won't be promoted; dark-value provenance inconsistent (§ DESIGN frontmatter comment, Colors intro; EXPERIENCE Open Item 1)  
direction-a2-merged and direction-sunrise-expedition.html are cited; frontmatter and body name different sources for the dark values.  
Fix: Say "working render, not shipped" or drop the reference; pick one provenance.

**L4 · [Visual reference coverage; rubric §5]** — Orphan frames after promotion (§ `.working/` X1c, MAP-IST, MAP-TYO)  
These frames aren't cited by either spine.  
Fix: Cite X1c on "Unreadable save", or drop the uncited frames during promotion.

**L5 · [Bloat & overspecification; rubric §6, developer L8]** — Layout overspecified as absolute values (§ DESIGN → Passport cover → Cover block, Layout (y = 144, 318 px panel))  
The cover-width derivation is rationale, not spec; absolute y, a font-measured width and "verified in renders" claims will fight a real layout engine.  
Fix: Keep {spacing.cover-width} plus one clause; restate the rest as constraints (min targets, min map height, panel ≤ 40% of viewport).

**L6 · [Bloat & overspecification; rubric §6]** — Directions B, C, D repeat boilerplate (§ EXPERIENCE → Inspiration)  
Each ends "Reason not recorded beyond the user picking A".  
Fix: Collapse to one line.

**L7 · [Bloat & overspecification; rubric §6]** — Open Items restates the memlog (§ EXPERIENCE → Open Items)  
The "Resolved 2026-10-13 (memlog)" paragraph is unused by any consumer.  
Fix: Remove it.

**L8 · [Inheritance discipline; rubric §7]** — "N days left" called a glossary term (§ EXPERIENCE → Component Patterns "Status chip")  
The PRD glossary term is "Days remaining".  
Fix: Call it a UI label for the glossary term.

**L9 · [Inheritance discipline; rubric §7]** — "stay" vs glossary "accommodation" (§ EXPERIENCE → Voice rule, Decided strings)  
Voice says use glossary terms exactly, yet the UI says "stay".  
Fix: State once that "stay" is the player-facing word for accommodation.

**L10 · [Inheritance discipline; rubric §7]** — UJ-3 failure string differs from Decided strings (§ EXPERIENCE → UJ-3 failure paths vs Work unavailable)  
"No shifts left — …" vs "No more work in Tokyo — …".  
Fix: Use the decided string in the flow.

**L11 · [Reviewer; accessibility L1]** — Stamp-code size is understated (≈4.5–4.8 px, not 8 px); small-stamp naming unspecified (§ DESIGN → typography stamp-code, Typography rules, Stamp; EXPERIENCE → Accessibility Floor → Text)  
The exception itself is approved (see Resolved). But the code is 8 units in a 50-unit viewBox, so it renders at about 4.5–4.8 px in 28–30 px stamps, 8 px at 50 px, 12.8 px at 80 px.  
Fix: Reword to "stamp code is graphic below 70 px stamps (≈4.5 px at 28 px)"; small stamps aria-hidden when the city name is adjacent, else role="img" "Paris stamp"; strip label names stamped cities.

**L12 · [Reviewer; accessibility L2]** — 11 px weight-400 chip sublabels (§ DESIGN → chip-label, label-caps)  
"25 DAYS LEFT" meets the floor but is the weakest readable text on the main screen.  
Fix: Weight 600 or 12 px for chip-label.

**L13 · [Reviewer; accessibility L4]** — Strip's 46 px hit area overlaps the map and loupe (§ DESIGN → Layout & Spacing)  
Map starts at y = 144 with the loupe placed high under the strip.  
Fix: Strip hit area takes precedence and the loupe hit circle is clipped, or reserve 4 px.

**L14 · [Reviewer; accessibility L5]** — Copy abbreviations and sensory wording (§ DESIGN → fare tags; EXPERIENCE → Decided strings → Map)  
"1 d" and "Tap the Europe circle" (WCAG 1.3.3).  
Fix: Accessible "1 day"; region-aware hint naming the zoom button.

**L15 · [Reviewer; accessibility L6]** — Keyboard models for radios and tabs (§ EXPERIENCE → Option row, Mode card, End-of-day choice, Tabs)  
No radiogroup or tablist model stated.  
Fix: Native radios styled as rows; tablist model with arrow keys and aria-controls.

**L16 · [Reviewer; accessibility L8]** — Dark Explorer cover disappears into the background (§ DESIGN → Colors)  
cover-explorer-dark vs background-dark is 1.08:1.  
Fix: Add a 1 px rule-dark outline or lift to about #1E3346.

**L17 · [Reviewer; accessibility L9]** — Motion details under reduced motion (§ EXPERIENCE → Motion)  
Loupe → zoom scale transition and counting animations not addressed.  
Fix: Remove (not shorten) the zoom transition under prefers-reduced-motion; values change without counting.

**L18 · [Reviewer; accessibility L10]** — Saving failures are silent or easy to miss (§ EXPERIENCE → State Patterns → Storage unavailable, Unreadable save)  
Content present at load is often not announced.  
Fix: One calm line on Start when storage is unavailable; insert the banner into a live region after first paint, or focus it.

**L19 · [Reviewer; accessibility L11]** — Next-slot marker is colour-only (§ DESIGN → Stamp slot)  
2 px ochre dashed ring and wash.  
Fix: Accept as decorative and say so, or thicken the dash.

**L20 · [Reviewer; accessibility L12]** — Tap-only commits on tightly stacked targets (§ EXPERIENCE → Interaction Primitives)  
Answer rows and sight toggles act on one tap with 6 px stack-tight spacing.  
Fix: ≥ 8 px between adjacent targets that act on tap.

**L21 · [Reviewer; developer L2]** — Core/EXT tag mismatch (§ DESIGN Name field vs EXPERIENCE; region data)  
Name field is [EXT start] in DESIGN but [CORE] in EXPERIENCE; Madrid sits in the core Europe inset.  
Fix: Tag consistently; make region data extensible.

**L22 · [Reviewer; developer L3]** — Scrim covers status chips that FR-3 says are always visible (§ EXPERIENCE → Route sheet)  
—  
Fix: State whether the scrim stops below the top stack.

**L23 · [Reviewer; developer L4]** — Polaroid sheet openers incomplete (§ EXPERIENCE → Polaroid sheet)  
Day complete "New in album" polaroid and the Album line are omitted.  
Fix: Add them or state they aren't tappable.

**L24 · [Reviewer; developer L5]** — Stamp rotation is non-deterministic (§ DESIGN → Stamp)  
"−8° to −12°, alternating ±6–9°" breaks stable screenshots and tests (NFR-1).  
Fix: Deterministic angle per destination.

**L25 · [Reviewer; developer L6]** — No breakpoint below 375 px (§ DESIGN → Passport cover)  
At 320 px the cover leaves 108 px for 152 px of slots.  
Fix: Give "may drop to its slim form" a breakpoint.

### Resolved (1)

**R1 · [Inheritance discipline; rubric §7 (medium), accessibility L1]** — 8 px stamp-code exception to the 11 px floor — pending sign-off (§ DESIGN → Typography rules, stamp-code, Stamp; EXPERIENCE → Accessibility Floor → Text; .memlog.md)  
Rubric (§7, medium) and accessibility (L1) flagged that the spines present the exception as decided while the memlog said sign-off was pending. Resolved: the user approved the exception and it is logged in .memlog.md (decision: stamp codes inside small (<70 px) stamps are part of the stamp graphic; the city name is always available as text or screen-reader label). The accessibility reviewer's size correction (≈4.5–4.8 px, not 8 px) stays open as L11.

## Mechanical notes

- EXPERIENCE.md frontmatter uses `title:`; the shape examples use `name:`. Consider adding `name: 'WORLDBOUND: NOMAD'` for parity with DESIGN.md.
- `scrim` / `scrim-dark` are 8-digit hex (#0A182661, #00000080). Confirm downstream token tooling accepts alpha hex, or split into colour plus opacity.
- `typography.*.note` fields (tabular-nums, uppercase) carry load-bearing rendering rules outside the standard keys. Keep `note` in the export, or promote to fontFeature / textTransform.
- UJ-1 step 3 says "the loupe shows Europe" at Bergen, but the region list never says which region Bergen belongs to. Add "Europe (incl. Bergen, Madrid [EXT])".
- No Mermaid in either spine. Internal links (DESIGN.md ↔ EXPERIENCE.md, imports/…pptx) resolve; mockups/*.html links resolve once promotion runs (known pending, H5).
- Both files are `status: draft` with `updated: 2026-10-13`, which is consistent.

## Reviewer files
- `review-rubric.md`
- `review-accessibility.md`
- `review-developer.md`
