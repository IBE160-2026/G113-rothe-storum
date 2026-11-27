---
title: 'Polaroid and Polaroid sheet (shared UI for Stories 2.4, 2.5 and 3.3)'
type: 'feature'
created: '2026-11-27'
status: 'done'
baseline_commit: '5ee16d7cb907a0561bfb1f6ef78c8aa28e038e27'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/DESIGN.md'
  - '{project-root}/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** A polaroid (a photo print of a visited sight) and the Polaroid sheet that opens when it is tapped are needed in four places owned by two people: Day complete and "In your album" on the City day (Story 2.4, Thomas), and the Album tab (2.5) and the Journey summary (3.3, both Christian). Built inside one story, they would block or conflict with the others (agreed on #11, 2026-11-27).

**Approach:** Christian builds them first in a small, separate PR, reviewed by Thomas, as reusable components with no rules change: `Polaroid` (the small print, tappable, with an empty variant) and `PolaroidSheet` (a read-only modal sheet with the large print), plus a `usePolaroidSheet()` hook that gives an opener the same open, close, Back and focus behaviour as the existing sheets.

**Decision (Christian Storum, 2026-11-27): option A.** This PR adds only the components, the hook and the tests, so nothing changes in the running app until 2.4, 2.5 or 3.3 uses them. The look is checked through a temporary harness that is not committed, with screenshots in the PR. **Rejected:** a temporary "Album" row in the menu (B). It would be a piece of Story 2.5 built early, it touches `MenuSheet` and `App`, and it would have to be replaced.

## Boundaries & Constraints

**Always:**
- Follow DESIGN.md → Polaroid and Polaroid sheet, and EXPERIENCE.md → Polaroid, Polaroid sheet and Empty album.
- Use the existing sheet pattern (`MenuSheet`, `RouteSheet`): `role="dialog"`, `aria-modal`, labelled by its title, initial focus on the title, Tab wraps (`focusTrap.ts`), Esc, × and the scrim close it, browser Back closes it (`useBackToClose`), and focus returns to the opener.
- All text goes through `src/ui/copy.ts` (AD-9). Images load through `<img>` from `sight.image` as given, never rebuilt from the id and never inlined (types.ts → `Sight.image`).
- The sheet changes nothing in the game: no `dispatch`, no money, days or stamps (FR-22, Decision G).
- The sheet opens only from a screen, never over another sheet. In the core, all four openers (Album, Summary, Day complete, and the Album line on City day) are screens. A sheet over a sheet is the [EXT] Feedback box, and Epic 6 handles it.

**Never:**
- No change to `src/rules/`, `content/`, or the screens in PR #73 (`MapScreen`, `RouteSheet`, `RestingPanel`, `App`).
- No Album tab, Day complete or Summary screen: those stay in Stories 2.4, 2.5 and 3.3.
- No [EXT] opener ("You saw this in your album").
- No Album line component (DESIGN.md → Album line, the repeat-visit row): it belongs to Story 2.4, which opens this sheet through `usePolaroidSheet`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Print | sight `paris-eiffel-tower`, album entry day 6, city "Paris" | Button with the image (`alt=""`), title "Eiffel Tower", the line "Paris · Day 6" shown in caps by CSS (`text-transform`), italic fact. The accessible name is title, place and day ("Eiffel Tower, Paris, Day 6", via `aria-labelledby`); the fact is shown but is not part of the name | N/A |
| Empty | no sight | One wide dashed tile with an icon and "Your next photo goes here"; not a button. Only the Album tab uses it. The Summary's empty text ("No photos this time…") is Story 3.3, and Day complete with no sights shows nothing (EXPERIENCE → Empty album) | N/A |
| Open | tap or Enter on a print | Sheet opens, focus on the title, background inert | N/A |
| Close | Esc, ×, scrim or browser Back | Sheet closes, one history entry popped, focus back on the print that opened it | N/A |
| Unknown sight | album id not in content | Nothing is rendered for that entry (no crash) | Skips the entry |
| Unknown sight opened | `open()` with an id not in content | No sheet and no history entry | Ignored |
| Long text | "Empire State Building" (21 characters; the schema has no name limit) and a 200-character fact | On a print, the title wraps to at most 2 lines and the fact to 2 lines, each ending in "…". The sheet and the accessible name always show the whole name, and the sheet shows the whole fact | N/A |
| Image fails | `image` path that does not load | The 4:3 photo box keeps its size with a paper background, so the frame keeps its shape | `alt=""` hides the broken image |
| Close, then reopen at once | × and then a tap on a print before `popstate` arrives | The background stays inert until `popstate` closes the sheet, so the tap does nothing and no extra history entry is pushed | N/A |

</frozen-after-approval>

## Code Map

- `src/ui/sheets/MenuSheet.tsx`, `RouteSheet.tsx` -- the sheet pattern to copy (dialog semantics, title focus, Esc, × with `copy.*.close`, scrim, `wrapTab`).
- `src/ui/sheets/MenuSheet.module.css` -- `.layer`, `.scrim` and `.sheet`: the shell styles to move into the new shared `sheet.module.css`. Only `PolaroidSheet` uses it in this PR. `MenuSheet` and `RouteSheet` move over after PR #73 is merged (deferred-work).
- `src/ui/sheets/focusTrap.ts` -- `wrapTab(event, container, fallback)`.
- `src/ui/hooks/useBackToClose.ts` -- one history entry per open sheet. Per the PR #73 review, call `close()` from the UI and let `popstate` run `onBack`.
- `src/ui/screens/MapScreen.tsx` (`closeSheet`) -- `flushSync` before `focus()`, because an inert background ignores focus.
- `src/rules/types.ts` -- `Sight` (`name`, `fact`, `image`, `imageAlt`) and `AlbumEntry` (`id`, `day`). `day` is the city day's own day number (`daysUsed + 1` at the start of that day, `cityDay.ts`), so it is shown as is: "DAY 6".
- `src/app/content` (`useContent()`) -- sights and destination names.
- `src/ui/styles/controls.module.css` -- `focusRing` and `iconButton`.
- `public/assets/sights/*.svg` -- the 16 drawings. The URL is `import.meta.env.BASE_URL + sight.image`.
- `tests/ui/RouteSheet.test.tsx`, `tests/ui/useBackToClose.test.tsx` -- test patterns (jsdom, `fireEvent`, popstate).

## Tasks & Acceptance

**Execution:**
- [x] `src/ui/copy.ts` -- add `polaroid` (`meta(city, day)` → "Paris · Day 6", in normal case so screen readers do not spell it out, uppercased by CSS, `empty`, `close`, `sheetLabel(name)`) -- AD-9. The meta line comes from DESIGN → Polaroid, and the empty line from EXPERIENCE → Empty album.
- [x] `src/ui/sheets/sheet.module.css` -- the shared sheet shell (`.layer`, `.scrim`, `.sheet`, header), the same as `MenuSheet.module.css` today -- one place for Story 4.3 and the sheets in 3.2.
- [x] `src/ui/components/Polaroid.tsx` + `.module.css` -- the print. Props: `sight`, `day`, `city`, `onOpen(el)`, `tilt` (`"left"` | `"right"`), `size` (`"small"` 62 px album strip | `"medium"` 86 px Day complete | `"large"` 118 px Journey summary photo height). An empty variant is used when there is no `sight`.
- [x] `src/ui/sheets/PolaroidSheet.tsx` + `.module.css` -- the read-only sheet, built on `sheet.module.css` with `composes`. Props: `sight`, `day`, `city`, `onClose`.
- [x] `src/ui/hooks/usePolaroidSheet.tsx` -- `{ open(entry, openerEl), isOpen, sheet }`. It looks up the sight and city in content, wires `useBackToClose`, and returns focus with `flushSync`.
- [x] `tests/ui/Polaroid.test.tsx` -- every row of the I/O matrix, through a small test opener with `inert={isOpen}`. Use days 1, 6 and 30, and "Empire State Building" as the longest name. CSS clamping and the 4:3 box are checked in the screenshots, since jsdom does no layout.

**Acceptance Criteria:**
- Given a screen using `usePolaroidSheet`, when a print is tapped and the sheet is closed by any route, then the history length is back where it started and focus is on that print.
- Given light and dark mode at 375 px, when the print and the sheet are shown, then they match DESIGN.md (frame, 6/9 px padding, `rounded.xs`, object shadow, ±2–2.5° tilt, 4:3 photo at full sheet width, `typography.fact`) and do not scroll horizontally.

## Design Notes

The hook exists because four screens open the same sheet. Each one would otherwise repeat the same `useBackToClose`, `flushSync` and focus-return code that `MapScreen` has today. A screen uses it like this:

```tsx
const polaroid = usePolaroidSheet();
<main inert={polaroid.isOpen}>…<Polaroid … onOpen={(el) => polaroid.open(entry, el)} /></main>
{polaroid.sheet}
```

`usePolaroidSheet` uses only `open()` and `close()` from `useBackToClose`, which are the same on `main` and in PR #73. It always closes through `close()` and lets `popstate` run the close, and it never closes at once. That avoids the stale-`popstate` race found in the PR #73 review (finding 1). Its tests check behaviour (history length, focus), not the hook's internals, so they hold after #73 is merged.

There is no sprint-status key for this work, since it is shared groundwork for 2.4, 2.5 and 3.3. Their specs should list this spec in `context`.

## Verification

**Commands:**
- `npm test` -- all pass, including the new `Polaroid.test.tsx`
- `npm run lint` and `npm run build` -- no errors
- `npm run test:e2e` -- unchanged, 3/3

**Manual checks:**
- Screenshots of the print, the empty tile and the sheet at 375 px in light and dark mode, taken through a temporary harness that is not committed, and attached to the PR.

## Implementation Notes

Implemented directly in the planning session, from this spec, without an implementation subagent: the context was already loaded, and the user had approved the plan.

- **Files:**
  - new: `src/ui/components/Polaroid.tsx` and `.module.css`, `src/ui/sheets/PolaroidSheet.tsx` and `.module.css`, `src/ui/sheets/sheet.module.css`, `src/ui/hooks/usePolaroidSheet.tsx`, `tests/ui/Polaroid.test.tsx`
  - changed: `src/ui/copy.ts` (`polaroid`), `src/ui/components/Icon.tsx` (a `photo` icon for the empty tile), `src/ui/styles/tokens.css` (`--shadow-object` from DESIGN → Elevation → Object; no token existed)
- **Deviations from the task text (the behaviour the matrix asks for is unchanged):**
  - **Accessible name through `aria-label`, not `aria-labelledby`.** `aria-labelledby` joins its parts with spaces, so it cannot give the "Eiffel Tower, Paris, Day 6" in the matrix. The label comes from `copy.polaroid.label(name, city, day)`.
  - **`copy.polaroid` has `label`, not `sheetLabel`.** The sheet is labelled by its own title, so `sheetLabel` was not needed.
  - **The empty tile is its own component, `EmptyPolaroid`,** not a `Polaroid` without a sight. A union of props stopped TypeScript from typing `onOpen`'s argument when a caller spreads a print (`tsc -b` failed in the test), and 2.4, 2.5 and 3.3 would have hit the same problem.
  - **`resolveAlbumEntry(entry, content)`** gives the sight, city and day, or `null` for an unknown sight. Callers use it, so the "unknown sight renders nothing" rule lives in one place. `sightImageUrl(sight)` builds `BASE_URL + sight.image`.
  - **The hook also ignores `open()` while a sheet is open,** besides keeping the background inert. jsdom does not block clicks on `inert`, and the guard makes the "close, then reopen at once" row hold even without layout.
- **Found in the screenshots and fixed:**
  - "COPENHAGEN" broke mid-word on the 62 px print. The small size now uses 0.4 px letter spacing instead of the 1.6 px in `typography.label-caps`, at the normal 11 px. A check over all 16 sights in the browser found no city broken across lines. *(Corrected in the walkthrough, 2026-11-27: the first fix used 10 px, which breaks NFR-5, "All text at least 11 px" (EXPERIENCE.md → Accessibility Floor). Measured at 11 px with 0.4 px spacing: no city split. CSE rejected a "CPH" abbreviation, because DESIGN shows the full city name and three-letter codes are the stamp codes.)*
  - "Day" and its number now stay together through a no-break space.
  - A print no longer stretches to its neighbour's height (`align-self: flex-start`).
  - The large print in the sheet is tilted −1°, not ±2–2.5°, so the long fact stays easy to read. DESIGN gives the tilt for the paper objects, and the Polaroid sheet spec does not mention it.
- **Mutation check,** run by hand, restoring `usePolaroidSheet.tsx` from a backup each time:
  - without the "already open" guard: 1 test fails ("a tap before the popstate…")
  - closing at once instead of waiting for `popstate`: 4 fail
  - without the unknown-sight check: 1 fails
- **Verified:**
  - `npm test` 24 files, 419/419 (405 + 14 new) before review; 420/420 (405 + 15) after the review patches
  - `npm run lint`, `npm run build` and `npm run test:e2e` 3/3, all with no errors
  - Screenshots at 375 px in light and dark through a temporary Vite harness, deleted afterwards. `scrollWidth` was 375 in both. Tab shows the focus ring. Esc closes the sheet and focus returns to the print.

## Spec Change Log

## Review Triage Log

Three layers, one pass (2026-11-27): Blind Hunter (BH, 13 findings, floor N = 6 from about 27 kB), Edge Case Hunter (EC, 9) and Verification Gap (VG, 1 gap + 1 other). All three ran as subagents, approved by CSE.

| # | Finding | Verdict | Route | Evidence / action |
|---|---|---|---|---|
| EC1, EC9 | A second Esc or × before `popstate` calls `history.back()` twice | **medium** | patch | **Real.** On `main`, `useBackToClose.close()` leaves `pushed` true until `popstate`, so key repeat or a double tap goes back twice and can leave the app. Fixed with a `closing` ref in `usePolaroidSheet`. Test "a second Esc before the popstate goes back only once"; it fails without the guard (mutation check). |
| BH2 | Dark mode keeps the shadow; no rule top edge on the sheet | low | patch | DESIGN.md → Elevation: "Dark mode: shadows are dropped … Sheets … get a 1 px rule top edge". `--shadow-object: none` in the dark block, and a dark `border-top` on the shared `.sheet`. Checked in Chromium: shadow `none`, border `1px solid`. |
| EC7, BH3 | The shared shell is not "the same as MenuSheet" | low | patch | `.header` was `flex-end` (MenuSheet uses `space-between`), and `.sheet` follows RouteSheet. The shell header is now `space-between`, and `PolaroidSheet` sets `flex-end` itself. The deferred-work entry now names what MenuSheet must override. |
| VG1, BH6 | The Tab-trap test passes without `wrapTab` | low | patch | jsdom never moves focus. New test: Shift+Tab from the title wraps to ×, and Tab on × calls `preventDefault`. It fails with `wrapTab` removed (mutation check). |
| EC5 | Clicking the photo or text moves focus to the page, and Esc stops working | low | patch | Real in browsers: the dialog had no `tabIndex`. Added `tabIndex={-1}`. Checked in Chromium: Esc after a click on the text closes the sheet. The other sheets have the same gap (deferred). |
| BH5, VG-other | The "image fails" test proves nothing | low | patch | True: there is no `onError` code, and the box is CSS. Renamed to a structure check, with a comment that the 4:3 box is checked in the screenshots. |
| BH9 | `large` = 118 px photo height may misread DESIGN.md ("album strip of 118 px polaroids") | maybe-false (medium if true) | defer | DESIGN → Polaroid gives the photo area as 62–86 px *tall*, but the summary line may mean the whole print. Story 3.3 (CSE) is the first user and should settle it. |
| EC2, BH4 | The opener unmounts while the sheet is open, and the history entry stays | low | reject | This is #65 in `useBackToClose`, fixed in PR #73. The screen behind the sheet is `inert`, so the player cannot change it while the sheet is open. |
| EC3 | A `null` opener loses focus | low | reject | Every real opener passes the print (`onOpen(el)`). `null` is used only for the unknown-sight case, which opens nothing. |
| EC4 | Content changes while the sheet is open | false | reject | Content is loaded once in `ContentProvider` (`useState(loadContent)`) and never changes. |
| EC6 | `copy.polaroid.sheetLabel` is missing | false | reject | This is a recorded deviation (Implementation Notes): the dialog is labelled by its title. The fix would be an edit to this spec. |
| EC8 | `Polaroid` has no empty variant without a sight | false | reject | This is a recorded deviation: `EmptyPolaroid`, because of a TypeScript typing problem. The fix would be an edit to this spec. |
| BH1 | The sheet's `<img>` ignores `imageAlt` | false | reject | EXPERIENCE → Content Assets: "`imageAlt` on sight cards; `alt=""` on polaroids (title adjacent)". The sheet's photo is a polaroid with its title next to it. |
| BH7 | The unknown-sight filter lives in the caller | low | reject | `resolveAlbumEntry` returns `null` and its doc comment says the caller renders nothing. A list helper would be API that 2.5 can add if it needs one. |
| BH8 | There is no synthetic 200-character fact test | low | reject | The real longest name and fact are tested in full (label, heading, sheet). Clamping is CSS, checked over all 16 sights in Chromium. |
| BH10 | Design deviations are not recorded in DESIGN.md | low | reject | They are recorded in this spec's Implementation Notes (tighter caps on the small print, the −1° sheet tilt, the `photo` icon). Story 4.3 is the design pass. |
| BH11 | The `open()` guard reads state that may be out of date | low | reject | Two `open()` calls in one tick cannot come from the UI: each tap is its own event, and the screen is `inert` after the first commit. |
| BH12 | The spec is not in the reviewed diff | false | reject | This is by design: the workflow gives the spec only to the Edge Case Hunter. |
| WT1 | Walkthrough: 10 px caps on the small print break NFR-5 (text at least 11 px) | medium | patch | Found in the walkthrough's dig into the risk spots, not by the review layers. Now 11 px with 0.4 px spacing, measured in Chromium over all 16 sights (no city split). |
| BH13 | Redundant `--photo-height`, hard-coded `z-index`, no lazy loading, duplicate "Close" copy | low / false | reject | The `.print` default keeps a print without a size class sized. `z-index: 10` matches the existing sheets. At most 16 small SVGs, so lazy loading is not needed. Every `copy` section has its own `close`, as `intro` and `menu` already do. |
