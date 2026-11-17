# Epic 1 Context: Start and travel

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

The player opens WORLDBOUND: NOMAD, starts a journey from Bergen (`home`) and travels between 8 destinations (5 in Europe plus New York, Tokyo and Sydney), weighing the real price and time trade-offs of plane, train and bus. The epic also lays the project foundation (scaffold, tooling, validated content) that every later epic builds on, so its conventions bind the rest of the project.

## Stories

- Story 1.1: Project scaffold and tooling
- Story 1.2: Core content data and validation
- Story 1.3: Game state and starting a journey (rules)
- Story 1.4: Travel and route queries (rules)
- Story 1.5: Start screen and first-time intro (UI)
- Story 1.6: Map screen and route sheet (UI)
- Story 1.7: Travel and travel home (UI)

## Requirements & Constraints

- A journey starts at `home` with €1,500, 30 days, 0 days used, no stamps, empty album; optional traveller name trimmed, counted in graphemes, max 14, empty → "Traveller".
- First-time intro shows once per device (reopenable from the menu); if browser storage is blocked the game still works and the intro shows every time.
- Map shows home + 8 destinations, current position, "Day X of 30", days remaining, money and stamp count, without horizontal scroll at 375 px.
- Routes come only from content; each mode shows price and days. Unaffordable or too-long modes are unavailable with a reason; a mode after which home is no longer reachable in time carries a warning but stays available.
- Travel deducts exactly the price and adds exactly the days; travelling home ends the journey after a confirmation that shows stamp count and whether the goal is met.
- Money never goes below €0; a rejected action leaves state unchanged.
- Rules are deterministic and testable without a browser. The app runs locally from the README with no API keys. All code, content and UI text are in English. No personal data is collected.
- Content (places, routes, values) is JSON data, never hard-coded in rules.

## Technical Decisions

- **Paradigm:** functional core, imperative shell. Pure TypeScript rules over an immutable `GameState`; thin React UI.
- **Layers:** `content/*.json` → `src/content/` (zod schema + loader) → `src/rules/` (imports nothing outside itself) → `src/app/` (store, storage adapter) → `src/ui/` (React). `src/rules/` must not import React, the DOM, `src/app/` or `src/ui/`, and must not use `Date.now()`, `Math.random()` or globals; an ESLint `no-restricted-imports` rule on `src/rules/**` enforces it.
- **Single mutation path:** `apply(state, action, content)` → `{ ok: true, state } | { ok: false, reason }`. Closed action union (`startJourney`, `travel`, `spendCityDay`, `callHome`). End rules are evaluated inside `apply`; after an outcome, every action except `startJourney` is rejected with `JOURNEY_ENDED`.
- **Queries:** the UI reads availability, reasons and warnings from `src/rules/queries.ts`; query and `apply` share the same check function.
- **Reasons:** closed `ReasonCode` union in `src/rules/types.ts`; UI maps codes to copy; tests assert codes, never strings.
- **Numbers:** money in whole euros, days in whole days (integers).
- **Content:** validated by zod at load and in a test; ids lowercase kebab, `home` = Bergen; rules take a `Content` argument so tests use fixtures in `tests/fixtures/`.
- **Storage:** only `src/app/storage.ts` touches browser storage, wrapped in try/catch with in-memory fallback; core stores only the intro flag and last traveller name.
- **Copy and tokens:** player text from `src/ui/copy.ts`; colours/spacing/type from CSS custom properties in `src/ui/styles/tokens.css` (light + dark); CSS Modules, no UI kit.
- **Tests:** rules test `describe` blocks start with the FR id; Playwright e2e at 375 × 812; PRs name story id and FR ids.
- **Stack (pinned):** Node ^22.22.2 || ^24.15.0 || ≥ 26 (dev only), TypeScript 6.0.x (not 7), Vite 8.3, React 19.3, @vitejs/plugin-react 6.3, zod 4.6, Vitest 5.1, Testing Library React 16.3, Playwright 1.65, ESLint 10.15 + typescript-eslint 8.72 + Prettier 3.10. Scripts: `dev`, `build`, `preview`, `test`, `test:e2e`, `lint`.
- **Conventions:** files `camelCase.ts`, components `PascalCase.tsx` one per file; glossary terms (`journey`, `cityDay`, `stamp`, `callHome`, `photoAlbum`, `daysUsed`); state stores `daysUsed`, "Day X of N" is derived; Prettier defaults, ESLint recommended + typescript-eslint, `strict: true`. Rules never throw for player actions; a top-level error boundary catches bugs.
- **Structure:** repo root is the app root: `content/`, `public/assets/`, `src/{rules,content,app,ui}/`, `src/main.tsx`, `tests/{rules,content,balance,ui,e2e,fixtures}/`. No CI and no hosting in the plan (local run path only).

## UX & Interaction Patterns

- Mobile first at 375 px; centred ~480 px column on larger screens; text reflows at 200 %.
- Touch targets ≥ 44 px; warnings use icon + text, never colour alone.
- Sheets are dialogs with focus trap, inert background and focus return; Esc and browser back close the topmost sheet; the map is the root.
- Map is HTML buttons over SVG, with destination chips as an alternative path.
- Light and dark themes from the DESIGN tokens; non-essential motion off under `prefers-reduced-motion`.

## Cross-Story Dependencies

- 1.1 must land first: every other story relies on its scripts, lint boundary and test setup.
- 1.2 (content) and 1.3 (state, `apply`, types) feed 1.4 (travel/queries); UI stories 1.5–1.7 build against the types from 1.3 and the queries from 1.4.
- Travel home in 1.4 records an "ended at home" outcome; goal evaluation is completed in Epic 3 (Story 3.1).
- Epic 2 (city days) and Epic 3 (journey end) extend `apply`, `queries` and the content files established here.
