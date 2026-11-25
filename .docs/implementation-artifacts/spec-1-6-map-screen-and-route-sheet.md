---
title: 'Story 1.6 — Map screen and route sheet'
type: 'feature'
created: '2026-11-24'
status: 'review'
baseline_commit: 'e3a5027ab0d7d772deae661e30c4870a58eb343f'
route: 'direct'
context:
  - '{project-root}/.docs/implementation-artifacts/epic-1-context.md'
  - '{project-root}/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/EXPERIENCE.md'
  - '{project-root}/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/DESIGN.md'
  - '{project-root}/.docs/planning-artifacts/architecture/architecture-worldbound-nomad-2026-11-13/ARCHITECTURE-SPINE.md'
---

## Intent

**Problem:** After Story 1.5 the journey lands on a placeholder Map. The player cannot see status, places or routes, so there is nothing to plan with (FR-3, FR-4, UX-DR2 – UX-DR4, NFR-4, NFR-5).

**Approach:** Replace the placeholder with the Map: status chips and passport strip, a simple SVG map with home and the 8 destinations, a resting panel with destination chips, and the route sheet. Every route value comes from `routesFrom()` (AD-3). Esc and browser Back close the sheet. Travel itself is Story 1.7.

## Decisions (Thomas Rothe, 2026-11-24)

- **Map scope, option A (MVP):** a simple, self-contained SVG map. EXPERIENCE → Map Data projection in degree units (x = lon + 180, y = 90 − lat), coordinates unchanged from `content/destinations.json`. No zoom, loupe or region views in this story.
- **One source of truth:** `routesFrom()` gives price, days, arrival day, availability, reason and the home warning. The UI does not calculate rules.
- **Short chips, option B:** when the cheapest option's reason is `NOT_ENOUGH_MONEY`, the chip shows "Not enough money" without a shortfall amount (EXPERIENCE `map.chip` short variant "{shortfall} short" would need the UI to compute price − money). A limited UX implementation choice, approved by the UX owner.
- **Story boundary:** confirming travel, any state-changing travel action and the travel-home flow are Story 1.7. The route sheet's primary button is shown with its EXPERIENCE label but stays `aria-disabled` until 1.7 passes `onConfirm`.

## Deviations for team review (deferred, not changed in PRD or UX documents)

| EXPERIENCE / DESIGN requirement | Status in 1.6 | Proposed owner |
|---|---|---|
| World map asset `assets/map/world.svg` with land shapes | Sea background only; markers and route lines | Later story / 4.3 |
| Region loupe, Zoomed region, region data (`regionId`, `labelOffset`, `pillOffset`, bounds), Map Data → Per region | Not built. Europe's markers are 3–9 px apart at 375 px; per Tap rule 2 they are decorative, and the chips are the full path (Tap rule 6) | Later story; region data needs content/schema changes (AD-7) |
| `viaCities` and "No direct route" hint (`map.zoom`) | Not built (needs a rules query) | With the zoomed region |
| `route.consequence` "You'll reach {to} on Day {arrivalDay} with {moneyAfter} left." | Not shown: `moneyAfter` would be computed in the UI | Story 1.7 (travel confirmation), or a rules field |
| Destination chip "{shortfall} short" | "Not enough money" (decision above) | Rules field `shortfall` if wanted later |
| Map, nothing open: Back "stays on the Map" | Back with no sheet open leaves the page, as since 1.5 | Later navigation story |
| Passport strip opens the Passport | Shows mode and count only; not a target | Story 2.5 |
| City-day card on the Map (FR-5, FR-8) | Not built | Story 2.3 / 2.4 |
| Icon set `assets/icons/*` | Inline SVG stand-ins (`Icon.tsx`) | When the icon assets exist |

None of the three Story 1.6 acceptance criteria depends on these items.

## Code Map

- `src/ui/screens/MapScreen.tsx` -- replaces the 1.5 placeholder; same props, so `App.tsx` is unchanged.
- `src/ui/components/StatusBar.tsx` -- day chip ("Day X of N", `{left}`), money chip, passport strip ("EXPLORER · n/5", accessible name lists stamped cities).
- `src/ui/components/WorldMap.tsx` -- projection, marker states by shape (current, home, stamped, not yet, no route), route lines (wrapped across the edge above 180°), Tap rules 2 and 5 at the 375 px reference.
- `src/ui/components/RestingPanel.tsx` -- panel copy, destination chips (cheapest option from `routesFrom()`), map key.
- `src/ui/sheets/RouteSheet.tsx` -- dialog, radio rows, reasons, warning, primary button, `wrapTab` (#49).
- `src/ui/hooks/useBackToClose.ts` -- one history entry per open sheet; `popstate` closes; closing from the UI calls `history.back()`.
- `src/ui/components/Icon.tsx` -- inline icons until the icon assets exist.
- `src/ui/copy.ts` -- `map.*`, `status.*`, `route.*` from EXPERIENCE → Copy templates and format rules.

## Design Notes

- "Day X" = `min(daysUsed + 1, N)` and the arrival label = `arrivalDay + 1` (spine Conventions → Days; EXPERIENCE format rules). Days left come from `daysRemaining()`.
- The chip's "from" price is the lowest `price` among the options `routesFrom()` returns: a selection from the query, not a rule.
- `route.unavailable` has strings only for `NOT_ENOUGH_MONEY` and `NOT_ENOUGH_DAYS`, the only reasons `routesFrom()` returns for a running journey. Other codes fall back to the placeholder "Not available" (no EXPERIENCE string exists).
- A map marker is pointer-only (EXPERIENCE → Map marker), so its sheet returns focus to the same city's chip.
- The history entry is pushed from the click handler, not an effect, so StrictMode's double effects cannot push twice.

## Verification

Run 2026-11-24 on Node 24.21.0, macOS 13.7.8, worktree of `story-1-6-map` (base `e3a5027`), after `npm ci`:
- `npm run lint`: exit 0 (ESLint and Prettier)
- `npm test`: 20 files, **382/382** (364 existing + 18 new: `RouteSheet.test.tsx` 7, `MapScreen.test.tsx` 8, `useBackToClose.test.tsx` 3)
- `npm run build`: ok
- e2e: **3/3** at 375 × 812 (`start`, `first-visit`, new `map.spec.ts` with real `page.goBack()`), in local Google Chrome through a temporary config outside the repo (#22)
- Mutation checks: removing the `popstate` close made 4 tests fail; enabling unavailable rows made 3 fail
- Manual: screenshots of the Map and the route sheet at 375 px; no horizontal scroll (`scrollWidth` 375 = `clientWidth`)

## AI Involvement

Implemented by Claude Code (Opus 5.5) from the preparation report and Thomas's decisions above. No separate AI review subagents were run; the independent review is Christian's review of the pull request.
