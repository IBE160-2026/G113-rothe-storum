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

Places, routes, sights and core values live in `content/config.json`, `content/destinations.json`, `content/routes.json` and `content/sights.json`. These files are the source of truth for game values. Edit them, then run `npm test`: the content test validates them against the schemas in `src/content/schema.ts`. Invalid content fails with a `ContentError` that names the file and path, for example `routes.json: routes[1].between[1]: unknown place id "parris"`. All problems are listed together in one error. The checks for duplicates and self routes run as soon as the file they read is valid. The check for unknown place ids in routes needs both `destinations.json` and `routes.json` to be valid, so fixing a schema error in one of them can reveal an unknown id on the next run. The same holds for a sight's `destId`, which needs both `destinations.json` and `sights.json` to be valid. So does the rule that every destination has exactly 2 sights. Facts must end in `.`, `!` or `?`; a destination fact has 2–3 sentences (at most 320 characters) and a sight fact 1–2 (at most 200). Sentences are counted at each `.`, `!` or `?` followed by a space. Because that count cannot handle them, the schema rejects curly quotes, ellipses, en and em dashes, and common abbreviations with a dot (`St.`, `Dr.`, `U.S.`, `c.`, `e.g.` and similar): write "Saint", "US" or "circa" instead. A sight's `image` must be `assets/sights/<id>.svg` or `.webp`. Loading checks only the path; the content test (`npm test`) checks that every image file exists in `public/assets/sights/` with its exact name.

#### Adding a destination

The content files are validated strictly, so a new destination (for example Madrid or Cape Town, FR-19) needs all of this in the same change, or `npm test` and CI fail and the app shows a content error on start:

1. `content/destinations.json`: a lowercase kebab `id`, `name`, three-letter `iata`, `lat`, `lon`, `costFactor` (at most two decimals) and a 2–3 sentence `fact`.
2. `content/sights.json`: exactly 2 sights with ids `{destId}-{slug}`, whole-euro prices 8–20, a 1–2 sentence `fact`, `image`, an `imageAlt` starting with "Line drawing of" (for drawings), and `source`, `author` and `licence`.
3. `public/assets/sights/`: one image file per sight, named exactly as its `image` path. An SVG drawing uses `viewBox="0 0 800 600"`, starts with the theme `<style>` block and strokes in `currentColor`.
4. `content/routes.json`: at least one route that connects the destination to the network.
5. Facts and images go through the fact-check process (NFR-8, see below).

### Content and image credits

The sight images in `public/assets/sights/` are SVG line drawings by Claude (Anthropic). Each one was drawn line by line after a reference photo on Wikimedia Commons, so it is a derivative work of that photo. The scripts that draw them are in [`tools/sight-drawings/`](tools/sight-drawings/), and each script names its reference photo at the top. The photos themselves are not in the repository.

- A drawing made after a CC BY, CC BY-SA or Free Art License photo is licensed **CC BY-SA 4.0** and credits the photographer.
- A drawing made after a public-domain or CC0 photo is released under **CC0 1.0 (AI-generated; any rights waived by the Worldbound team)**. The photo is still named.

Each sight in `content/sights.json` records the photo page as `source`, `"Claude (AI), after a photo by …"` as `author`, and the drawing's `licence`.

| Sight                 | Drawing licence | Reference photo (Wikimedia Commons)                                                                                                                                                                                                                                                                        | Photographer      | Photo licence |
| --------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------- |
| Tivoli Gardens        | CC0 1.0         | [Tivoli Copenhagen Main Entrance.jpg](https://commons.wikimedia.org/wiki/File:Tivoli_Copenhagen_Main_Entrance.jpg)                                                                                                                                                                                         | Sissew            | Public domain |
| Nyhavn canal tour     | CC BY-SA 4.0    | [Colourful façades - Nyhavn (Panorama) (34784192335).jpg](<https://commons.wikimedia.org/wiki/File:Colourful_fa%C3%A7ades_-_Nyhavn_(Panorama)_(34784192335).jpg>)                                                                                                                                          | Jorge Láscar      | CC BY 2.0     |
| Eiffel Tower          | CC0 1.0         | [Eiffel Tower, full-view looking toward the Trocadero, Exposition Universal, 1900, Paris, France.jpg](https://commons.wikimedia.org/wiki/File:Eiffel_Tower,_full-view_looking_toward_the_Trocadero,_Exposition_Universal,_1900,_Paris,_France.jpg)                                                         | unknown           | Public domain |
| Louvre                | CC BY-SA 4.0    | [Cour Napoléon at night - Louvre.jpg](https://commons.wikimedia.org/wiki/File:Cour_Napol%C3%A9on_at_night_-_Louvre.jpg)                                                                                                                                                                                    | Benh LIEU SONG    | CC BY 2.5     |
| Tower of London       | CC BY-SA 4.0    | [Tower of London viewed from the River Thames.jpg](https://commons.wikimedia.org/wiki/File:Tower_of_London_viewed_from_the_River_Thames.jpg)                                                                                                                                                               | Bob Collowan      | CC BY-SA 3.0  |
| British Museum        | CC BY-SA 4.0    | [Exterior of the British Museum-London.jpg](https://commons.wikimedia.org/wiki/File:Exterior_of_the_British_Museum-London.jpg)                                                                                                                                                                             | Yair Haklai       | CC BY-SA 4.0  |
| Colosseum             | CC BY-SA 4.0    | [Rome Colosseum exterior panorama.jpg](https://commons.wikimedia.org/wiki/File:Rome_Colosseum_exterior_panorama.jpg)                                                                                                                                                                                       | Nicholas Hartmann | CC BY-SA 4.0  |
| Vatican Museums       | CC0 1.0         | [Vatican museums, spiral staircase from above - by gnuckx (11641068154).jpg](<https://commons.wikimedia.org/wiki/File:Vatican_museums,_spiral_staircase_from_above_-_by_gnuckx_(11641068154).jpg>)                                                                                                         | gnuckx            | CC0           |
| Topkapı Palace        | CC BY-SA 4.0    | [Bâb-üs Selâm.jpg](https://commons.wikimedia.org/wiki/File:B%C3%A2b-%C3%BCs_Sel%C3%A2m.jpg)                                                                                                                                                                                                                | Maksym Kozlenko   | CC BY-SA 4.0  |
| Galata Tower          | CC BY-SA 4.0    | [Istanbul asv2020-02 img48 Galata Tower.jpg](https://commons.wikimedia.org/wiki/File:Istanbul_asv2020-02_img48_Galata_Tower.jpg)                                                                                                                                                                           | A.Savin           | FAL           |
| Statue of Liberty     | CC BY-SA 4.0    | [New York City (New York, USA), Statue of Liberty -- 2012 -- 6818.jpg](<https://commons.wikimedia.org/wiki/File:New_York_City_(New_York,_USA),_Statue_of_Liberty_--_2012_--_6818.jpg>)                                                                                                                     | Dietmar Rabich    | CC BY-SA 4.0  |
| Empire State Building | CC BY-SA 4.0    | [Looking Up at Empire State Building.JPG](https://commons.wikimedia.org/wiki/File:Looking_Up_at_Empire_State_Building.JPG)                                                                                                                                                                                 | BigMac            | CC BY-SA 3.0  |
| Senso-ji              | CC0 1.0         | [Kaminarimon1500.jpg](https://commons.wikimedia.org/wiki/File:Kaminarimon1500.jpg)                                                                                                                                                                                                                         | unknown           | Public domain |
| Tokyo Skytree         | CC BY-SA 4.0    | [Asahi Breweries headquarters building with the Asahi Flame and Skytree at blue hour with full moon, Sumida-ku, Tokyo, Japan.jpg](https://commons.wikimedia.org/wiki/File:Asahi_Breweries_headquarters_building_with_the_Asahi_Flame_and_Skytree_at_blue_hour_with_full_moon,_Sumida-ku,_Tokyo,_Japan.jpg) | Basile Morin      | CC BY-SA 4.0  |
| Sydney Opera House    | CC BY-SA 4.0    | [Sydney Opera House from Circular Quay, 2023, 01.jpg](https://commons.wikimedia.org/wiki/File:Sydney_Opera_House_from_Circular_Quay,_2023,_01.jpg)                                                                                                                                                         | Kgbo              | CC BY-SA 4.0  |
| Harbour Bridge        | CC BY-SA 4.0    | [Sydney Harbour Bridge night.jpg](https://commons.wikimedia.org/wiki/File:Sydney_Harbour_Bridge_night.jpg)                                                                                                                                                                                                 | Diliff            | CC BY-SA 3.0  |

The British Museum drawing also follows the overall layout of [British Museum - panoramic (20496222784).jpg](<https://commons.wikimedia.org/wiki/File:British_Museum_-_panoramic_(20496222784).jpg>) by Elliott Brown (CC BY-SA 2.0).

When a photo replaces a drawing, save it at the same path (or as `.webp` and update `image`), record its source page, author and licence in `sights.json`, and update this table. Photos must come from Wikimedia Commons, Unsplash or Pexels, or be AI-generated, and are never hotlinked.

The destination and sight facts were drafted by one AI agent, fact-checked by a second AI agent with web sources (NFR-8), and then go through Christian's final check in the pull request. The fact-check report is in [`.docs/content-review/story-2-2-fact-check.md`](.docs/content-review/story-2-2-fact-check.md).

### Documentation

- [Product requirements (PRD)](.docs/planning-artifacts/prds/prd-worldbound-nomad-2026-10-12/prd.md)
- [Architecture spine](.docs/planning-artifacts/architecture/architecture-worldbound-nomad-2026-11-13/ARCHITECTURE-SPINE.md)
- [Epics and stories](.docs/planning-artifacts/epics.md)
- [Sprint plan](.docs/implementation-artifacts/sprint-plan.md)
- [Session logs](.logs/) (one folder per team member)
