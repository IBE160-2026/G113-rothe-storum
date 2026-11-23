---
title: 'Story 2.2 — Fact cards and sight content (content)'
type: 'feature'
created: '2026-11-23'
status: 'ready-for-dev'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/.docs/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Destinations have no fact card, and the 16 sights in `content/sights.json` have only `id`, `destId`, `name` and `price` (Story 2.1, Q1 = A). Stories 2.3–2.5 have no facts, images or licence data to show (FR-5, FR-21, NFR-6, NFR-7, NFR-8, Decision I).

**Approach:** Add `fact` to every destination and `fact`, `image`, `imageAlt`, `source`, `author`, `licence` to every sight, together with the image files under `public/assets/sights/`. Extend the zod schema and the content test so they enforce the counts, lengths, licence fields and image paths. Run the three-step content process: an AI drafting agent, then a separate AI fact-check agent whose report is saved for the PR, then Christian's final check in the PR.

## Boundaries & Constraints

**Always:**
- Content stays data (NFR-7). No game code reads a fact, price or image path other than through `Content`. Replacing an image file at the same path needs no code change.
- Schema (AD-7): `destination.fact` and `sight.fact` are trimmed, non-empty English strings that end in `.`, `!` or `?` (optionally followed by a closing `"`, `'` or `)`). A destination fact has 2–3 sentences and at most 320 characters, and a sight fact has 1–2 sentences and at most 200 characters. `image` is exactly `assets/sights/{id}.webp` or `assets/sights/{id}.svg` (a relative path, never a URL). `imageAlt` is a non-empty string of at most 120 characters, and `source`, `author` and `licence` are non-empty strings. Each of the 8 destinations has exactly 2 sights (a cross-file check gated like the existing `destId` check).
- Photos are repo files from Wikimedia Commons, Unsplash or Pexels, or are AI-generated or AI-drawn. A photo is never copied from an ordinary web page and never hotlinked. `source` is the file's source page URL, or a short note such as "AI-drawn SVG (Claude), this repo". `licence` names the licence (e.g. "CC BY-SA 4.0", "CC0", "Unsplash License").
- Sight `name`, `price` and `id` from 2.1 are unchanged.
- The fact-check agent is a separate subagent that did not draft the content. It uses web search and cites a source URL for every item it marks as verified. An item without a source is listed as "could not verify". Its report lists what it flagged, what it corrected and what it could not verify, item by item. The report is saved at `.docs/content-review/story-2-2-fact-check.md`, together with the prompts given to the drafting agent and the fact-check agent.
- The Tivoli fact (UX Open Item 6) is the `copenhagen-tivoli` sight fact. The report records its original wording, the verdict and the final wording, even if the fact is rewritten.
- Christian's final check (facts, stereotypes, licences at the source) happens in the PR and is not done by Claude. Claude prepares a per-item checklist in the PR body for it.

**Decisions (user, 2026-11-23):**
- Q1 = A, images: 16 AI-drawn SVG line drawings by Claude (4:3, `viewBox="0 0 800 600"`, strokes in `currentColor`, no text in the image, no people). Each sight gets `image` `assets/sights/{id}.svg`, `source` "AI-drawn SVG (Claude, Anthropic), this repository", `author` "Claude (AI), for the Worldbound team" and `licence` "CC0 1.0 (AI-generated, no copyright claimed)". These are placeholders under Decision B and can later be swapped for photos. The schema still allows `.webp`.
- Q2 = A: 2.2 adds only `fact` to destinations. `streetDrawing` and the 8 street SVGs belong to 2.3, and `stampAngle` to 2.5 (or 1.6).
- Size: the spec is kept whole (≈ 2,300 tokens), because the strict schema needs every field, fixture and content change in one PR.
- Renegotiated after advanced elicitation (user, 2026-11-23, "apply all"): the licence text changes from "Own work (AI-generated), no attribution required" to CC0, because "own work" claims authorship. The fact-check agent cites sources and the agent prompts are saved. Facts must end in punctuation and have character limits. The Tivoli placement is fixed. The count check covers 0 sights.

**Never:** UI for facts, sights or the album (2.3–2.5); prices or names changed; trivia (EXT); any claim in a log or PR that Christian or the other team member has approved content; images fetched at runtime.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Real content | `content/*.json` | loads; 8 facts with 2–3 sentences; 16 sights, 2 per destination, every image file exists in `public/` under its exact name | N/A |
| Fact length | destination fact with 1 or 4 sentences, or over 320 characters; sight fact with 0 or 3 sentences, or over 200 characters | rejected | ContentError naming the file and path |
| Fact ending | a fact without final `.`, `!` or `?` | rejected | ContentError naming the file and path |
| Alt length | `imageAlt` over 120 characters | rejected | ContentError naming the file and path |
| Missing field | sight without `licence`, `author` or `imageAlt`; destination without `fact` | rejected | ContentError naming the file and path |
| Hotlink | `image: "https://…"` | rejected | ContentError |
| Wrong path | `image: "assets/sights/paris-louvre.png"` or another sight's id | rejected | ContentError |
| Count | a destination with 0, 1 or 3 sights | rejected | ContentError naming `sights.json` and the destination id |
| Count gate | `destinations.json` invalid | the count check waits and nothing throws a TypeError | other problems still reported |

</frozen-after-approval>

## Code Map

- `src/rules/types.ts` -- add `fact` to `Destination`; add `fact`, `image`, `imageAlt`, `source`, `author`, `licence` to `Sight`, with doc comments. The `image` comment says the path is relative to the site root and that the UI uses it as given and never rebuilds it from `id` (NFR-7, AD-7). Keep no imports.
- `src/content/schema.ts` -- extend `destinationSchema` and `sightSchema` (strict objects, so the fixtures must gain every field). Add a `fact(min, max, maxChars)` helper (final punctuation, sentence count, character limit) and a cross-field image path refine (`image` built from `id`). Add `checkSightCount()`, which loops over **destinations** (not grouped sights), so a destination with 0 sights is caught. Each wrong count is reported at `["sights", "sights"]` with `destination "x" has N sights (needs exactly 2)`. Gate it on `destinationsValid && sightsValid` like `checkSightDestinations`. Update the "Story 2.1 fields only" comment.
- `content/destinations.json`, `content/sights.json` -- the drafted and fact-checked text and the licence fields.
- `public/assets/sights/{sightId}.svg` -- 16 SVG line drawings, 4:3, 800 × 600 (EXPERIENCE → Content Assets: drawings stroke in `currentColor`). Each file starts with the theme `<style>` block (see Design Notes). `public/assets/` is empty today.
- `.docs/implementation-artifacts/epic-2-context.md` -- note that `streetDrawing` moves to 2.3 and `stampAngle` to 2.5 (Q2 = A).
- `tests/fixtures/content/*.json` (6 files: `valid-small` plus 5 broken) -- add `fact` to every destination and the new sight fields to every sight, so each broken fixture still fails for exactly its one reason. All 6 already have 2 sights per destination (checked 2026-11-23), so the count check adds no second failure. The fixture images don't need to exist (only the real-content test checks files).
- `tests/content/content.test.ts` -- extend the `Draft` type; add the matrix rows; follow the existing `withDefect`/`problemsOf` pattern and the gated-check tests at lines 224 and 578–608. Real content:
  - the file names from `readdirSync("public/assets/sights")` equal the set of `image` basenames exactly. This catches case mismatches that macOS hides, as well as orphan files.
  - every SVG has `viewBox="0 0 800 600"` and the theme `<style>` block, and contains no `<text>`, `<script>` or `<image>` element and no `href`/`url(` pointing to `http`.
  - The real-content test at line 123 already asserts 2 sights per destination. It overlaps with `checkSightCount` on purpose: the test pins today's content, and the schema check guards future edits.
- `tests/rules/helpers.ts` -- read only. `smallContent()` parses `valid-small.json`, so the rules tests pick up the new fields without changes.
- `.docs/content-review/story-2-2-fact-check.md` -- new: the fact-check report with the two agent prompts.
- `src/rules/*.ts` -- do not change. The rules ignore the new fields.

## Tasks & Acceptance

**Execution:**
- [ ] `src/rules/types.ts`, `src/content/schema.ts` -- new fields, fact rules (punctuation, sentences, characters), `imageAlt` limit, image path and count check -- AD-7
- [ ] `tests/fixtures/content/*.json` -- new fields in all 6 fixtures -- strict schemas
- [ ] `tests/content/content.test.ts` -- matrix rows, the count gate in both directions, exact image file names with no orphans, SVG content checks -- describe names start with FR/NFR ids (FR-5, FR-21, NFR-8)
- [ ] `content/destinations.json`, `content/sights.json`, `public/assets/sights/*` -- drafted by a drafting subagent (facts, `imageAlt`, images, licence fields), English only (NFR-6). The drafting criteria, also given in its prompt:
  - `imageAlt` starts with "Line drawing of …" and describes what is in the drawing, not just the name.
  - no superlatives that can't be checked ("most famous", "best").
  - no national-character, food or weather clichés or other stereotypes.
  - a destination fact does not repeat its sights' facts.
- [ ] `.docs/content-review/story-2-2-fact-check.md` -- a separate fact-check subagent checks every fact, alt text (against the SVG source) and licence record, with web search and a cited source per verified item. Claude applies its corrections and records each one in the report, including the Tivoli entry (original, verdict, final).
- [ ] PR body -- the per-item checklist for Christian's final check (approve or change for each fact, the Tivoli fact and each licence) and a link to the report

**Acceptance Criteria:**
- Given the real content, when `loadContent()` runs, then it succeeds and each of the 8 destinations has a 2–3 sentence English fact and exactly 2 sights with every required field.
- Given the PR, when it is opened, then it links the fact-check report and has an unticked checklist for Christian's final check, separate from the other member's review.

## Design Notes

Sentence count: a fact must end in `.`, `!` or `?`, optionally followed by a closing `"`, `'` or `)`. Sentences are the matches of `/[.!?]["')]?(?=\s|$)/g`. Facts avoid abbreviations with a dot ("St.", "e.g.") so the count stays exact; the schema message says so. A plain rule like this is easier to review than a language library. The character limits (320 / 200 / 120) are a technical recommendation from the elicitation, not an AC. They protect the fact card and the sight card at 375 px, which the sentence count alone does not.

`author` is required even though the epic AC lists only `source` and `licence`, because AD-7 and NFR-8 name all three.

Theming the SVGs: an SVG loaded through `<img>` or a CSS background does not inherit `color` from the page, so plain `currentColor` would render black in both themes. Each SVG therefore starts with `<style>:root{color:#0a1826}@media (prefers-color-scheme:dark){:root{color:#f4efe1}}</style>`, and the strokes stay in `currentColor`, so inline use still follows the page. This works because `tokens.css` themes only through `prefers-color-scheme` (no manual toggle). The two hex values copy `--color-ink` (light/dark): a change to that token must also update the 16 SVGs, and a future manual theme toggle would need inline SVG or a CSS mask instead.

## Verification

**Commands:**
- `npm test` -- expected: all pass, including the 1.3, 1.4 and 2.1 rules tests
- `npm run lint` -- expected: exit 0
- `npm run build` -- expected: no type errors; then `ls dist/assets/sights | wc -l` -- expected: 16

**Manual checks:**
- Open 2–3 images through an `<img>` tag in a browser, in both light and dark system mode, to check 4:3 and legibility (the theme `<style>` block).
