# G113 — Worldbound

Gruppeprosjekt i **IBE160 Programmering med KI** ved Høgskolen i Molde, høsten 2026 (15 studiepoeng).

Repoet inneholder gruppens applikasjon og dokumentasjon av utvikling, testing og kvalitetssikring med KI.

## Medlemmer

- Thomas Rothe (GitHub: ThomasRothe88)
- Christian Storum (GitHub: Albion812)

## Getting started

WORLDBOUND: NOMAD is a mobile-first browser travel game built with Vite, React and TypeScript. It runs locally; no `.env` file, API keys or accounts are needed.

### Prerequisites

- Node.js `^22.22.2 || ^24.15.0 || >=26` (tested with 26.8.1)
- npm (bundled with Node.js; tested with 11.19.0)
- To play: a current browser (Chrome ≥ 107, Safari ≥ 16, Firefox ≥ 125). The floor comes from `Intl.Segmenter` (counts the traveller name in graphemes; Firefox ≥ 125) and Vite's default build target (baseline-widely-available; Chrome ≥ 107, Safari ≥ 16).

### Install

```sh
npm install
npx playwright install chromium   # one-time browser download for the end-to-end tests
```

### Scripts

| Command            | What it does                                                         |
| ------------------ | -------------------------------------------------------------------- |
| `npm run dev`      | Starts the dev server at http://localhost:5173                       |
| `npm run build`    | Type-checks (`tsc -b`) and builds to `dist/`                         |
| `npm run preview`  | Serves the built `dist/` at http://localhost:4173                    |
| `npm test`         | Runs unit and component tests (Vitest)                               |
| `npm run test:e2e` | Builds, serves and runs the Playwright tests at a 375 × 812 viewport |
| `npm run lint`     | Runs ESLint (zero warnings allowed) and checks formatting (Prettier) |

### Project structure

Folders that only contain `.gitkeep` are placeholders that later stories fill in.

```text
content/         game data as JSON (places, routes, sights, values)
public/assets/   images and icons
src/rules/       pure game rules; imports nothing outside itself (enforced by ESLint)
src/content/     content schema and loader
src/app/         state store and browser storage adapter
src/ui/          React screens, sheets, components, copy.ts and styles/tokens.css
tests/           rules, content, balance, ui, e2e and fixtures
```

`npm run test:e2e` builds the app first and serves it on port 4173, so stop any running `npm run preview` before you start it.

GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs `npm run lint`, `npm test` and `npm run build` on every pull request and on pushes to `main`. Run `npm run test:e2e` locally; it is not part of CI yet.

### Editing game content

Places, routes, sights and core values live in `content/config.json`, `content/destinations.json`, `content/routes.json` and `content/sights.json`. These files are the source of truth for game values. Edit them, then run `npm test`: the content test validates them against the schemas in `src/content/schema.ts`. Invalid content fails with a `ContentError` that names the file and path, for example `routes.json: routes[1].between[1]: unknown place id "parris"`. All problems are listed together in one error. The checks for duplicates and self routes run as soon as the file they read is valid. The check for unknown place ids in routes needs both `destinations.json` and `routes.json` to be valid, so fixing a schema error in one of them can reveal an unknown id on the next run. The same holds for a sight's `destId`, which needs both `destinations.json` and `sights.json` to be valid.

### Documentation

- [Product requirements (PRD)](.docs/planning-artifacts/prds/prd-worldbound-nomad-2026-10-12/prd.md)
- [Architecture spine](.docs/planning-artifacts/architecture/architecture-worldbound-nomad-2026-11-13/ARCHITECTURE-SPINE.md)
- [Epics and stories](.docs/planning-artifacts/epics.md)
- [Sprint plan](.docs/implementation-artifacts/sprint-plan.md)
- [Session logs](.logs/) (one folder per team member)
