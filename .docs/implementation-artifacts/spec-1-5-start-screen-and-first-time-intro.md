---
title: 'Story 1.5 — Start screen and first-time intro'
type: 'feature'
created: '2026-11-23'
status: 'review'
baseline_commit: '47043c4e2ce4c5c150a02fc59a629c8d984b8c52'
route: 'direct'
context:
  - '{project-root}/.docs/implementation-artifacts/epic-1-context.md'
  - '{project-root}/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/EXPERIENCE.md'
  - '{project-root}/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/DESIGN.md'
---

## Intent

**Problem:** The app shows only a placeholder title. A player cannot enter a name, read how to play, or start a journey, and nothing is kept on the device (FR-1, FR-2, AR-7, UX-DR1, UX-DR7).

**Approach:** Build the Start screen and the one-screen intro from EXPERIENCE and DESIGN, a storage adapter for the intro flag and the last name (AD-8), and a minimal journey store around `apply()` so "Let's go" / "New journey" start the journey. The journey lands on a placeholder Map that Story 1.6 replaces.

## Boundaries & Constraints

**Always:**
- Only `src/app/storage.ts` touches browser storage; every access in try/catch with an in-memory fallback (AD-8). Core keeps two keys: `worldbound.introSeen` and `worldbound.lastName`.
- The journey is never saved (PRD §9.7, Decision L; FR-20 and Story 6.1 are [EXT]).
- The UI never computes rules: the name preview uses `normalizeName`, the journey starts through `apply(startJourney)` in the store (AD-2, AD-3). Money, days and goal stamps on the intro come from content, never literals.
- All text from `src/ui/copy.ts`, all colours and sizes from `tokens.css` (AD-9). No new dependencies, no router.

**Decisions (Thomas Rothe, 2026-11-23):**
- **Store ownership (option A):** Story 1.5 owns a minimal `src/app/store.ts` (`useReducer` around `apply`). Basis: Christian asked Thomas to take Story 1.5 (PR #33 comment, 2026-11-23), and `spec-1-3` Code Map says "Story 1.5's store builds on it". Recorded as provisional until Christian confirms in the review of this PR.
- **Menu:** only the "How to play" row (FR-2, AC 2). "Album" and "New journey" with confirm come with the stories that own the album and a running journey.
- **Map:** a placeholder (top bar with menu button, hidden "Map" heading) so the journey has somewhere to land; Story 1.6 replaces `MapScreen`.
- **Strings not in the EXPERIENCE copy table** are taken from the mockups instead of inventing new ones: the three intro steps, "Your journey", "The goal", "You start with", "To get home" (screens-core S2) and "Goes on your passport:" with "EXPLORER PASSPORT · {name}" (screens-ext-1 X1a). "Menu", "Close" and the hidden "Map" heading are accessible names.

**Never:** saving the journey; a store beyond `game` + `rejection`; Album, New-journey confirm, mode cards or the saved-journey card ([EXT]); map content (1.6).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior |
|----------|--------------|---------------------------|
| First visit | no intro flag, "New journey" | Intro (goal 5 stamps / 30 days, €1,500, 30 days), no ×, "Let's go" → journey starts, Map; flag stored |
| Returning | intro flag set | "New journey" → journey starts, Map, no intro |
| How to play on Start | any | Intro with × and "Got it", both back to Start |
| Reopen from menu | on Map | Menu → "How to play" → intro with × and "Back to my journey", both back to Map |
| Storage blocked | `localStorage` throws | Game works; values in memory for this load; intro on every load |
| Storage throws per call | `getItem`/`setItem` throw | No crash; memory fallback |
| Name | "  Åse 👩‍👩‍👧 " | Counter counts trimmed graphemes; preview shows `normalizeName` result |
| Name cap | 20 graphemes typed or pasted | Input stops at 14; "14 characters, the maximum." announced politely |
| Name kept | non-empty name, "New journey" | Next load prefills the trimmed, capped name |
| Name empty | "   ", "New journey" | Stored name cleared; preview "Traveller" |
| Menu keys | Menu open | Focus on title; Tab wraps; Esc, × or scrim close; focus returns to the menu button; Map is `inert` |

## Code Map

- `src/app/storage.ts` -- new: `createDeviceStorage(backend?)` with `introSeen`, `markIntroSeen`, `lastName`, `setLastName`, `persistent`.
- `src/app/store.ts` -- new: `journeyReducer` (pure, delegates to `apply`), `JourneyProvider`, `useJourney`.
- `src/ui/App.tsx` -- screen flow Start / Intro (3 variants) / Map + menu; `storage` prop for tests.
- `src/ui/screens/StartScreen.tsx` (+ css) -- logo, tagline, name field, "New journey" (form submit), "How to play". The h1 keeps the accessible name "WORLDBOUND: NOMAD" (Story 1.1 and 1.3 tests).
- `src/ui/screens/IntroScreen.tsx` (+ css) -- goal box, chips, steps, variants; focus to the headline.
- `src/ui/screens/MapScreen.tsx` (+ css) -- placeholder (see Decisions).
- `src/ui/sheets/MenuSheet.tsx` (+ css) -- modal sheet with "How to play".
- `src/ui/components/NameField.tsx` (+ css) -- grapheme counter, limit, preview, live region.
- `src/ui/components/Logo.tsx` (+ css) -- stand-in wordmark (type + inline compass O) until `assets/brand/logo.svg`.
- `src/ui/styles/controls.module.css` -- `primary`, `textLink`, `iconButton`, focus ring, visually hidden.
- `src/ui/copy.ts` -- `start.*`, `intro.*`, `menu.*`, `map.heading`.
- Tests: `tests/app/storage.test.ts`, `tests/app/store.test.tsx`, `tests/ui/NameField.test.tsx`, `tests/ui/App.test.tsx` (AC 1–4), `tests/ui/StartScreen.test.tsx` (updated to the new props; same title assertion), `tests/e2e/first-visit.spec.ts`.

## Tasks & Acceptance

**Execution:**
- [x] Storage adapter and tests -- AD-8, AR-7, AC 3–4
- [x] Journey store and tests -- AD-2, AD-3
- [x] Copy, name field, Start screen, intro, menu, placeholder map -- FR-1, FR-2, UX-DR1, UX-DR7
- [x] App flow tests for AC 1–4 and e2e at 375 × 812 -- AD-10, NFR-4

**Acceptance Criteria (epics.md, Story 1.5):**
- AC 1: first visit → "New journey" shows the intro (goal, €1,500, 30 days) before the map. -- `App.test.tsx` AC1, e2e
- AC 2: intro seen → skipped, reopenable from the menu. -- `App.test.tsx` AC2 (×2), e2e
- AC 3: storage blocked → works, intro every time. -- `App.test.tsx` AC3, `storage.test.ts`
- AC 4: name rule enforced, last name prefilled. -- `App.test.tsx` AC4 (×2), `NameField.test.tsx`, e2e

## Design Notes

- Without storage, values live in memory for the current page load (AD-8 fallback), so a second journey in the same load skips the intro, but every new load shows it again. This reads AC 3 ("when the game loads") and the FR-2 assumption as per load.
- The intro flag is set when the player leaves the intro by its button or ×, in every variant.
- The stored name is the result of `normalizeName` (trimmed, capped); an empty name clears it.
- Browser back for the intro (EXPERIENCE → Back navigation) is not wired: the app has no history integration yet. The × and buttons cover every exit.
- `MenuSheet` uses `inert` on the Map (React 19 boolean prop) instead of a full focus trap library; Tab wraps between the sheet's buttons.

## Verification

Run 2026-11-23 on Node 24.21.0, macOS 13.7.8, in the worktree of `story-1-5-start-screen` (base `47043c4`), after `npm ci`:
- `npm run lint`: exit 0 (ESLint and Prettier)
- `npm test`: 10 files, 197/197 passed (164 existing + 33 new)
- `npm run build`: ok, no type errors
- e2e: 2/2 passed (`start.spec.ts`, `first-visit.spec.ts`) at 375 × 812. Run with local Google Chrome through a temporary config outside the repo (`channel: "chrome"`), because Playwright 1.65 has no Chromium for macOS 13 (#22); tests, viewport and web server are the project's.
- Manual: screenshots of Start (light and dark), intro and menu at 375 px compared with mockups S1, S2 and X1a; no horizontal scroll.

## AI Involvement

Implemented by Claude Code (Opus 5.5) on Thomas Rothe's instruction, with the scope decisions above made by Thomas. No independent AI review subagents were run for this story; the independent review is Christian's review of the pull request.

## Open Items

- #29 (test that `main.tsx` wraps `App` in `ErrorBoundary`) was a candidate for this story but would change the entry structure; left open.
- Logo and start art: `assets/brand/logo.svg` and `start.svg` are still to come from the vector redraw (DESIGN.md → Logo); the stand-in is type plus an inline compass.
- Store ownership: confirm in the PR review (Decisions).

## Spec Change Log

- 2026-11-23, PR review (Christian Storum, with Claude Code `bmad-walkthrough`): four changes, made on Christian's instruction on the PR branch. Intent, ACs and the "Never" list are unchanged; the store still holds only `game` + `rejection`.
  1. **Focus after closing the menu.** `closeMenu` set `menuOpen` to false and called `focus()` in the same event, while the Map was still `inert`; the browser ignores `focus()` on an inert element, so focus fell to `body` (seen in Chromium, not in jsdom, which has no `inert`). Fix: `flushSync` the close before `focus()` (`src/ui/App.tsx`). New e2e check in `first-visit.spec.ts` that the menu button has focus after Esc; it fails without the fix.
  2. **Rejection shape.** `rejection` was a bare `ReasonCode`, so two identical rejections in a row looked unchanged to the UI. It is now `{ reason, seq } | null`: a new object per rejection, `seq` counts rejections in a row. The UI decides when an old rejection is stale (`src/app/store.ts`).
  3. **Stable context value.** `JourneyProvider` wraps `{ state, dispatch }` in `useMemo`, so consumers re-render only when the journey changes. New store test; it fails without the fix.
  4. **Storage after a failed write.** `read` preferred the browser value over memory, so a write that threw after the probe (for example a full quota) read back the old value. Memory now holds what this page load last wrote (null for a removal) and wins over the backend (`src/app/storage.ts`). New storage test; it fails without the fix.
  Verification after the changes: `npm test` 200/200, `npm run lint` and `npm run build` ok, `npm run test:e2e` 2/2 in Chromium (Playwright's own Chromium, macOS 26).
