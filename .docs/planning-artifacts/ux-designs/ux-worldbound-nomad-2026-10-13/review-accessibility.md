# Accessibility review — WORLDBOUND: NOMAD UX spines

Reviewed: DESIGN.md, EXPERIENCE.md, .memlog.md (to 21:05), with renders screens-core-1, screens-ext-1, screens-ext-2 and direction-a3 as visual evidence. Yardstick: PRD NFR-5, measured against WCAG 2.2 AA. Spines win over renders.

## Verdict

The visual floor is unusually solid. I recomputed every pair in DESIGN.md → Contrast targets and all of them are correct. The non-colour rules (stamp code + check, solid vs dashed + words, mode word + glyph) are carried through consistently, and the 11 px floor is now explicit. The gaps are behavioural. The spines do not yet define dialog semantics and focus containment. The plan to hide the map from screen readers contradicts itself. The world map's own markers break the 44 px floor outside the loupe. The dark-mode flip of `primary` to ochre collides with every component that puts ochre on `primary`. Fixed-height layout has no strategy for 200% text. None of these block sign-off of the visual identity, but the five High items should be fixed in the spines before architecture and story breakdown use them.

Counts: **Critical 0 · High 5 · Medium 9 · Low 12**

### Contrast recomputation (WCAG relative luminance, from DESIGN.md hex)

All ten rows of the DESIGN.md table reproduce exactly (for example, `ink`/`background` 15.52 and 15.17; `on-unavailable`/`unavailable` 5.20 and 5.68; `ochre`/`background` 3.21 light; `slot-dash`/`surface` 2.01 and 2.04). The following load-bearing pairs are **not** in the table:

| Pair | Light | Dark | Note |
|---|---|---|---|
| `ochre` route dash on `map-sea` / `map-land` | 2.91 / 2.42 | 7.33 / 5.34 | Light fails 3:1 for non-text (M3) |
| Focus ring `ochre` on `map-land` | 2.42 | 5.34 | Light fails on the map (M3) |
| `ochre-text` fare text on `map-land` | 4.73 | 5.34 | Passes, but only just |
| `ink-muted` "stamped" / "you're here" on `map-land` | 4.60 | 5.64 | Passes, but only just; relies on the paper halo |
| `pin` on `map-land` | 3.53 | 4.85 | Passes as non-text |
| `ochre-light` on `primary` (dark) | — | **1.00** | Invisible (H4) |
| `on-navy` on `primary` (dark) | — | **1.94** | Fails (H4) |
| `slot-dash-on-navy` on `primary` | 3.68 | 3.39 | Passes |
| `cover-explorer-dark` vs `background-dark` | — | 1.08 | The cover edge vanishes (L8) |
| `unavailable` fill vs `surface` | 1.27 | 1.06 | The fill carries no signal (M4) |
| `surface-selected` vs `surface-row` | 1.05 | 1.11 | OK only because the 2 px ink border is mandatory |
| `slot-dash` on `unavailable` | 1.59 | 2.17 | The dashed border on unavailable rows is faint (M4) |

---

## Critical

None.

## High

### H1 — Modal sheets lack dialog semantics, focus containment and inert background
- **Where:** EXPERIENCE.md → Component Patterns → Modal sheet; Accessibility Floor → Focus.
- **What's wrong:** The spine says focus "moves into the sheet and returns to the trigger on close". It does not specify `role="dialog"`, `aria-modal`, an accessible name, a focus trap, or making the map/top stack inert. Keyboard (Tab) and screen-reader (swipe) users can leave the sheet and land on controls behind the scrim, such as the map, chips, strip and menu. That breaks "modal depth 1" and WCAG 2.4.3 Focus Order. The 318 px resting panel is also not a dialog, but it looks like one, so the two need to be told apart explicitly.
- **Fix:** Add to Modal sheet:
  - `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing at the sheet headline.
  - The rest of the app is `inert` while a sheet is open, and Tab/Shift-Tab wrap inside the sheet.
  - Background scroll is locked.
  - Initial focus goes to the headline (`tabindex="-1"`), not to the commit button.
  - Then state that the resting panel is a normal page region (a `<section>` with a heading) and not a dialog.

### H2 — "Map is `aria-hidden` apart from its tappable markers" cannot be built
- **Where:** EXPERIENCE.md → Accessibility Floor → Screen readers; Component Patterns → Map, Region loupe, Zoomed region.
- **What's wrong:** Children of an `aria-hidden` element cannot be exposed again, and focusable elements inside `aria-hidden` are a known failure: they are focusable but silent. Keyboard access to the loupe, which is the only way into the Zoomed region, is also unspecified. The renders take a third approach: `role="img"` with a prose label.
- **Fix:** Decide on one model and write it down:
  1. The SVG artwork is `aria-hidden="true"` and its markers are pointer-only (no tab stop).
  2. The loupe is an HTML `<button>` overlaid on the SVG, with the name "Zoom in on Europe" (the region name comes from inset data).
  3. Zoomed-region city pills and "Back to world" are HTML buttons, not SVG nodes.
  4. The destination chips and route sheet remain the complete accessible path. Add a visually hidden heading "Map" with one line, "You're in Paris. Routes are listed below.", so screen-reader users know where they are.

  Drop the "[ASSUMPTION]" tag once this is decided.

### H3 — World-map destination markers break the 44 px floor outside the loupe
- **Where:** DESIGN.md → Region loupe ("Outside Europe … Europe's cities become plain small markers on the world map"); EXPERIENCE.md → Component Patterns → Map ("Tap a destination marker to open its Route sheet"); Accessibility Floor → Targets.
- **What's wrong:** At 375 px the equirectangular world map is about 1 px per degree. When the traveller is in Tokyo, Sydney or New York, Paris, London, Rome and Copenhagen are plain markers only a few px apart. If they are tappable, they break NFR-5 (44 × 44) and WCAG 2.5.8 (24 px target or spacing). Their hit areas also overlap. The Zoomed region only zooms the *current* region, so there is no zoom path to Europe from Tokyo. Even inside the Europe loupe, Paris and London are only about 21 px apart. That is fine only because the whole loupe is one target, and the Map row does not say so.
- **Fix:** State a rule:
  - World-map markers are tappable only when their 44 px hit circles don't overlap. Otherwise they are decorative.
  - Markers drawn inside a loupe are never individual targets.
  - When the traveller is outside Europe, the Europe source box on the world map is either a single 44 px target that opens the Europe zoomed view, or not interactive (chips remain the path).
  - Add "every interactive marker has a ≥ 44 px hit circle and hit circles never overlap" to Accessibility Floor → Targets.

### H4 — Dark `primary` flips to ochre, so ochre-on-`primary` components lose content
- **Where:** DESIGN.md → Colors (`primary-dark` = `ochre-light-dark` = `#E0A243`); Components: Intro goal box ("`primary` fill, ochre caps caption"), Tabs ("navy fill … ochre icon"), Zoom tag ("`{colors.primary}` pill, `{colors.ochre-light}` icon"), `button-primary` icon, Feedback box correct ("navy fill, 26 px ochre check", on-navy link), Night row ("navy icon disc with an ochre moon"), "Back to world" navy pill.
- **What's wrong:** In dark mode these become ochre on ochre (**1.00:1**) and cream on ochre (**1.94:1**):
  - The intro goal-box caption is text, so it becomes invisible.
  - The correct-answer check, which is the non-colour cue for "correct", disappears.
  - The "You saw this in your album" link fails contrast.
  - The Zoom-tag icon vanishes.

  "Navy fill" is also never mapped to a token, so implementers will guess.
- **Fix:**
  - Split the roles: `primary` (the button) and a new `navy-fill` / `navy-fill-dark` (decorative navy blocks: goal box, feedback box, zoom tag, night disc, Back to world, selected tab). For example, `#0A1826` / `#0A121A`, with `ochre-light` and `on-navy` content.
  - Or define an `on-primary-accent-dark` (navy) for icons that sit on `primary`.
  - Add these pairs to the contrast table: dark goal-box caption, dark feedback link and check, dark selected tab icon.

### H5 — No strategy for 200% text; fixed heights will clip
- **Where:** EXPERIENCE.md → Accessibility Floor → Zoom ("[ASSUMPTION]"); DESIGN.md → Layout & Spacing; tokens `status-chip-height` 44, `strip-height` 38, `cover-height` 64, `cover-width` 172, `panel-height` 318; Route sheet "footprint stays 318 px"; "Content … must fit without scrolling at 375 × ~780".
- **What's wrong:** The cover width (172 px) was derived from "EXPLORER PASSPORT" at exactly 11 px. At 200% it needs about 250–270 px and cannot fit beside 163 px of slots. The status chips, strip and panel are fixed heights, so text will clip or overlap (WCAG 1.4.4, 1.4.10, 1.4.12). The spine also doesn't forbid `maximum-scale=1` / `user-scalable=no`, which games often set to stop accidental zoom. That would remove pinch zoom, the main magnification route on phones.
- **Fix:**
  - Change the fixed sizes to `min-height` and use rem-based type.
  - Write a large-text fallback:
    - The status chips stack or wrap.
    - The full cover drops to the slim strip form (already allowed below 320 px).
    - The cover's slots wrap under it.
    - The resting panel and sheets scroll internally, and the 318 px "map never resizes" rule yields: the map may shrink at large text.
    - The "fits without scrolling" target applies at 100% only.
  - Add "the viewport meta must not disable user zoom".
  - Promote the 200% target from [ASSUMPTION] to decided, or record it as out of scope with a reason.

## Medium

### M1 — Focus after in-place content swaps and screen changes is undefined
- **Where:** EXPERIENCE.md → Information Architecture (navigation model); Component Patterns → Route sheet, Menu sheet, Confirm block, Day complete, Zoomed region, Arrival fact card.
- **What's wrong:** When the route sheet becomes the Travel home sheet, or the menu becomes the confirm, the focused element is removed and focus falls to `<body>`. Full-screen changes (Map → City day → Day complete → Map, loupe → Zoomed region → Back to world) don't say where focus lands, and they don't update the document title.
- **Fix:** Add a rule: "On any content swap or screen change, move focus to the new headline (`tabindex="-1"`) and set `document.title` ('Day complete — Worldbound'). On 'Back to world' focus returns to the loupe button; on 'Back to the map' focus goes to the map screen heading." Each screen has one `h1`.

### M2 — No announcements for the stamp landing, money and day changes, or the running total
- **Where:** EXPERIENCE.md → Accessibility Floor → Screen readers (only the info banner and answer feedback are live); Component Patterns → Status chip, Running total, Day complete, Sight card.
- **What's wrong:**
  - The stamp landing is a visual moment, and the spine says nothing about what a screen-reader user hears.
  - The status chips change silently after travel.
  - The arrival card does not state the new balance.
  - Toggling a sight changes the total and the button label without any announcement.
- **Fix:**
  - The stamp animation is `aria-hidden`. Focus on the Day complete headline gives "Paris, stamped. Paris stamp added to your passport. 2 of 5."
  - The status chips are **not** live regions, because that would be too noisy.
  - The arrival card's eyebrow or arrival pill includes the balance ("€1,270 left").
  - The running total is a polite live region that announces only the new total after a toggle ("Total €120, money after €1,150").
  - Sight toggles use `aria-pressed` (or a switch) whose name includes the price.

### M3 — Light-mode map graphics and the focus ring fall below 3:1 on map colours
- **Where:** DESIGN.md → Region loupe (routes dashed `ochre`), Colors → Contrast targets; EXPERIENCE.md → State Patterns → Focus.
- **What's wrong:**
  - The routes-from-here dash is 2.91:1 on `map-sea` and **2.42:1** on `map-land` (WCAG 1.4.11).
  - The focus ring (2 px `background` + 2 px `ochre`) on the loupe sits over map colours: the ochre ring is 2.42:1 on land, and the paper inner ring is about 1.3:1 against land.
  - The contrast table only measures ochre on `background`.
- **Fix:**
  - Draw route dashes in `ochre-text` (#7A4D0F, 4.73 on land), or give them a 1 px paper casing.
  - Specify that the focus ring around the loupe and on the zoomed map uses `ink` outer + paper inner (ink on land 11.7:1).
  - Add map-colour pairs to the contrast table.

### M4 — The dashed border is overloaded; "unavailable" and "selectable with warning" differ mainly by a 1.27:1 fill
- **Where:** DESIGN.md → Option row, `option-row-warning`, Destination chip short variant, Button unavailable, Goal line, Tip; EXPERIENCE.md → Accessibility Floor → Never colour alone.
- **What's wrong:** A dashed `slot-dash` border means unavailable (not tappable), warning (tappable), short chip (tappable), goal not reached, empty slot, and tip. The visual difference between an unavailable route row and a selectable warning row is the `unavailable` fill (1.27:1 light, 1.06:1 dark), whether a radio is present, and the text. The dash itself is 1.59:1 on the unavailable fill.
- **Fix:**
  - Give unavailable rows a **block icon in place of the radio** (as `button-unavailable` already has) and text in `on-unavailable`.
  - Warning rows keep a live radio plus the ochre warning glyph.
  - Write the distinction into Never colour alone: "unavailable = block icon + no radio + reason; warning = radio + warning glyph + 'Heads up' line".

### M5 — The confirm pattern is inconsistent, and initial focus and Esc on confirms are unspecified
- **Where:** EXPERIENCE.md → Component Patterns → Buttons ("In confirms, the safe choice is the primary button"), Travel home sheet (primary "Fly home"), Call home sheet (primary "Call home"), Confirm block; Interaction Primitives → Irreversible actions confirm once.
- **What's wrong:** Three irreversible confirms use two opposite button conventions, so users can't build a habit. Enter on an auto-focused primary would commit Travel home or Call home.
- **Fix:**
  - Narrow the Buttons rule: "In data-loss confirms (New journey) the safe action is primary. In goal-action confirms (Travel home, Call home) the commit is primary and the safe exit is secondary."
  - In every confirm, initial focus goes to the headline, never to a button, and Esc/scrim = the safe action.
  - Use one safe-exit word ("Not yet" vs "Not now" → pick one).

### M6 — Esc and scrim on replaced-content sheets, and Call home re-entry
- **Where:** EXPERIENCE.md → Modal sheet, Travel home sheet, Call home sheet; UJ-2 failure paths.
- **What's wrong:** "Not yet" goes back to the Route sheet, but Esc/scrim closes the whole sheet. That's two different "back" meanings in one surface. After "Not now" or Esc on Call home, "offered again while the condition holds" has no trigger. A player whose every route is unavailable may see no actionable control on the map, which is a soft-lock for anyone who missed the sheet.
- **Fix:**
  - Define Esc on a replaced sheet as one step back (Travel home → Route sheet, Confirm → Menu list), and the scrim as close-all.
  - Add a persistent "Call home" entry: a row in the resting panel, or a button in the city-day card while FR-12 holds, with the same cost line.

### M7 — Quiz answers: the accessible result and focus after locking
- **Where:** DESIGN.md → Answer row; EXPERIENCE.md → Answer row, Feedback box.
- **What's wrong:**
  - The wrong pick is tagged only "Your answer". The cross icon carries "wrong", and it has no specified text alternative.
  - After the tap, all four rows become locked (disabled), including the focused one, so focus can be lost.
  - Answer-row spacing isn't specified, and a single tap commits.
- **Fix:**
  - Accessible names after locking: "B, Sumida, your answer, wrong" / "C, Arakawa, right answer".
  - Rows become `aria-disabled` (still focusable, not `disabled`).
  - After answering, move focus to the feedback box (`role="status"` already polite), then to "Next question".
  - Specify at least 8 px between answer rows.

### M8 — The compact sight-card toggle is 26 px
- **Where:** DESIGN.md → Component table → Sight card, compact EXT variant ("26 px round toggle").
- **What's wrong:** If the toggle is the target, it fails NFR-5. The spine doesn't say the whole 56 px card is the target.
- **Fix:** State: "The whole compact card is the toggle target (≥ 44 px tall); the 26 px circle is the state indicator only."

### M9 — The name field's hard stop gives no feedback
- **Where:** EXPERIENCE.md → Name field ("hard limit, no error message").
- **What's wrong:** Screen-reader and low-vision users get no indication that typing stopped at 14 characters. A longer name is silently cut.
- **Fix:** Add a visible counter ("8/14") linked via `aria-describedby`, and a polite announcement at the limit ("14 characters, the maximum"). Keep the hard stop.

## Low

### L1 — Stamp-code exception: approve with conditions, and correct the wording
- **Where:** DESIGN.md → typography `stamp-code`, Typography rules, Stamp; EXPERIENCE.md → Accessibility Floor → Text; memlog 21:05 (still "pending user sign-off").
- **What's wrong:**
  - The code is 8 units in a 50-unit viewBox, so it renders at **≈4.5–4.8 px** in 28–30 px strip and map stamps, 8 px at 50 px, and 12.8 px at 80 px. "8 px" understates how small it is.
  - The spines present the exception as decided while the memlog says sign-off is pending.
- **Fix:**
  - The exception is acceptable under WCAG, because the code is redundant graphic content and the city is always named elsewhere.
  - Reword to "stamp code is graphic below 70 px stamps (≈4.5 px at 28 px)".
  - Require small stamps to be `aria-hidden` when the city name is adjacent text, otherwise `role="img"` with "Paris stamp".
  - The strip's label includes stamped city names ("Explorer passport, 2 of 5 stamps: Copenhagen, Paris").
  - Mark the exception pending until the user says yes.

### L2 — 11 px weight-400 sublabels
- **Where:** DESIGN.md → `chip-label`, `label-caps`.
- **What's wrong:** "25 DAYS LEFT" is real information at 11 px, weight 400, in caps. It meets the floor but is the weakest readable text on the main screen.
- **Fix:** Use weight 600, or 12 px, for `chip-label`. Keep 11 px for eyebrows.

### L3 — The grab bar is a false affordance
- **Where:** DESIGN.md → Resting panel, Modal sheet ("a 40 × 4 grab bar"); EXPERIENCE.md → Modal sheet (no swipe-to-dismiss).
- **Fix:** Drop the grab bar, or state that it is decorative, `aria-hidden` and non-interactive. Removing it is preferable, since dragging it does nothing.

### L4 — The strip's 46 px hit area overlaps the map and loupe
- **Where:** DESIGN.md → Layout & Spacing (map starts at y = 144; loupe "placed high under the strip").
- **Fix:** Specify that the strip's extended hit area takes precedence and that the loupe's hit circle is clipped to start below it, or reserve 4 px of map padding.

### L5 — Copy: abbreviations and sensory wording
- **Where:** DESIGN.md → Region loupe fare tags ("✈ €300 · 1 d"); EXPERIENCE.md → Decided strings → Map ("Too small? Tap the Europe circle to zoom.").
- **Fix:**
  - Give "1 d" the accessible text "1 day".
  - Make the hint region-aware ("Tap the circle to zoom into East Asia").
  - Keep it out of the screen-reader path, or reword it to name the zoom button (WCAG 1.3.3).

### L6 — Keyboard models for radios and tabs
- **Where:** EXPERIENCE.md → Option row, Mode card, End-of-day choice, Tabs; Interaction Primitives → Keyboard.
- **Fix:**
  - Radio groups follow the native or ARIA radiogroup model: one tab stop, arrow keys move and select.
  - Tabs follow the tablist model (`role=tablist`, arrow keys, `aria-controls`).
  - Prefer native `<input type=radio>` styled as rows.

### L7 — No alt-text policy for content images
- **Where:** EXPERIENCE.md → Content Assets.
- **Fix:** Add an `alt` field to the content data:
  - Street drawings behind the arrival card are decorative (`alt=""`).
  - Sight photos on sight cards get a short alt.
  - Polaroid photos are `alt=""`, because the title and fact are adjacent.
  - Placeholders follow the same rule (NFR-7, NFR-8).

### L8 — The dark Explorer cover disappears into the background
- **Where:** DESIGN.md → Colors (`cover-explorer-dark` #0A121A vs `background-dark` #0F1B26 = 1.08:1; vs `surface-dark` 1.22:1).
- **Fix:** Give it a 1 px `rule-dark` or spine-tone outline, or lift it to about #1E3346, so the tappable cover has a visible edge.

### L9 — Motion details
- **Where:** EXPERIENCE.md → Motion.
- **Fix:**
  - Confirm that the loupe → zoomed scale transition is removed (not shortened) under `prefers-reduced-motion`.
  - Say that the cover count and money values change without counting or rolling animation in every mode.

### L10 — Saving failures are silent or easy to miss
- **Where:** EXPERIENCE.md → State Patterns → Storage unavailable, Unreadable save; Info banner.
- **Fix:**
  - When storage is unavailable, show one calm line on Start: "This browser can't save your journey."
  - For the unreadable-save banner, insert it into an already-present live region after first paint, or move focus to it. Content present at page load is often not announced.

### L11 — The "next slot" marker is colour-only on the strip and cover
- **Where:** DESIGN.md → Stamp slot ("2 px `ochre` dashed ring and an ochre wash").
- **Fix:** This is redundant, because slots fill in order. Either accept it as decorative and say so, or thicken the dash (2.5 px) so it differs by weight as well as colour.

### L12 — Interaction primitives: tap-only commits
- **Where:** EXPERIENCE.md → Interaction Primitives ("Everything else commits immediately").
- **What's wrong:** Answer rows and sight toggles act on a single tap, with no undo for answers. Route option rows only select, so they are fine. This is acceptable given the consequence lines, but motor-impaired users are exposed to mis-taps on targets stacked 6 px apart (`stack-tight`).
- **Fix:** Require ≥ 8 px spacing between adjacent targets that act on tap (answer rows, sight cards, destination chips).
