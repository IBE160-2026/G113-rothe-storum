---
title: 'Story 2.2 — Fact cards and sight content (content)'
type: 'feature'
created: '2026-11-23'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '9d8977ebbe5b189f541f5b80d00261af5471d79b'
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
- `src/content/schema.ts` -- extend `destinationSchema` and `sightSchema` (strict objects, so the fixtures must gain every field). Add a `fact(min, max, maxChars)` helper (final punctuation, sentence count, character limit) and a cross-field image path check (`image` built from `id`): a `superRefine` on the strict sight object that runs only when `id` is a string and accepts `assets/sights/${id}.svg` or `.webp`, with the issue at `image` and the message `must be assets/sights/<id>.svg or .webp`. Add `checkSightCount()`, which loops over **destinations** (not grouped sights), so a destination with 0 sights is caught. Each wrong count is reported at `["sights", "sights"]` with `destination "x" has N sights (needs exactly 2)`. Gate it on `destinationsValid && sightsValid` like `checkSightDestinations`. Update the "Story 2.1 fields only" comment.
- `content/destinations.json`, `content/sights.json` -- the drafted and fact-checked text and the licence fields.
- `public/assets/sights/{sightId}.svg` -- 16 SVG line drawings, 4:3, 800 × 600 (EXPERIENCE → Content Assets: drawings stroke in `currentColor`). Each file starts with the theme `<style>` block (see Design Notes). `public/assets/` is empty today.
- `.docs/implementation-artifacts/epic-2-context.md` -- note that `streetDrawing` moves to 2.3 and `stampAngle` to 2.5 (Q2 = A).
- `tests/fixtures/content/*.json` (6 files: `valid-small` plus 5 broken) -- add `fact` to every destination and the new sight fields to every sight, so each broken fixture still fails for exactly its one reason. All 6 already have 2 sights per destination (checked 2026-11-23), so the count check adds no second failure. The fixture images don't need to exist (only the real-content test checks files).
- `tests/content/content.test.ts` -- extend the `Draft` type; add the matrix rows; follow the existing `withDefect`/`problemsOf` pattern and the gated-check tests at lines 224 and 578–608. Real content:
  - the file names from `readdirSync("public/assets/sights")` equal the set of `image` basenames exactly. This catches case mismatches that macOS hides, as well as orphan files.
  - every SVG has `viewBox="0 0 800 600"` and the theme `<style>` block, and contains no `<text>`, `<script>` or `<image>` element and no `href`/`url(` pointing to `http`.
  - Existing tests that change a sight `id` must also set its `image`: the "a duplicate sight id" row (line ~197) and the test at line ~578 set `sights[3].id = "alpha-one"`, so they must also set `sights[3].image = "assets/sights/alpha-one.svg"`. Otherwise the image rule fails `sightsFileSchema`, the gated duplicate check never runs, and both tests fail (the line 578 test would get 3 problems instead of 2).
  - one fixture row with a `.webp` image is accepted, so both allowed endings are tested.
  - sentence-rule rows: "It is 1.5 km long. It opened in 1900." counts 2; "Wait... it opened." counts 2 (known overcount on ellipses, so content avoids them); a closing quote `"…museum." It` splits; a missing final full stop is rejected.
  - The real-content test at line 123 already asserts 2 sights per destination. It overlaps with `checkSightCount` on purpose: the test pins today's content, and the schema check guards future edits.
- `tests/rules/helpers.ts` -- read only. `smallContent()` parses `valid-small.json`, so the rules tests pick up the new fields without changes.
- `.docs/content-review/story-2-2-fact-check.md` -- new: the fact-check report with the two agent prompts.
- `src/rules/*.ts` -- do not change. The rules ignore the new fields.

## Tasks & Acceptance

**Execution:**
- [x] `src/rules/types.ts`, `src/content/schema.ts` -- new fields, fact rules (punctuation, sentences, characters), `imageAlt` limit, image path and count check -- AD-7
- [x] `tests/fixtures/content/*.json` -- new fields in all 6 fixtures -- strict schemas
- [x] `tests/content/content.test.ts` -- matrix rows, the count gate in both directions, exact image file names with no orphans, SVG content checks -- describe names start with FR/NFR ids (FR-5, FR-21, NFR-8)
- [x] `content/destinations.json`, `content/sights.json`, `public/assets/sights/*` -- drafted by a drafting subagent (facts, `imageAlt`, images, licence fields), English only (NFR-6). The drafting criteria, also given in its prompt:
  - `imageAlt` starts with "Line drawing of …" and describes what is in the drawing, not just the name.
  - no superlatives that can't be checked ("most famous", "best").
  - no national-character, food or weather clichés or other stereotypes.
  - a destination fact does not repeat its sights' facts.
  - straight quotes only (`"`, `'`), no curly quotes, ellipses or abbreviations with a dot.
- [x] `.docs/content-review/story-2-2-fact-check.md` -- a separate fact-check subagent checks every fact, alt text (against the SVG source) and licence record, with web search and a cited source per verified item. Claude applies its corrections and records each one in the report, including the Tivoli entry (original, verdict, final). A fact marked "could not verify" is either rewritten to a claim the agent can verify (and re-checked), or kept and listed as an explicit open item in Christian's checklist; the report says which.
- [x] `README.md` -- a short "Content and image credits" section: the sight images are AI-drawn placeholders (CC0), facts are fact-checked per NFR-8, with a link to the report. This is where attribution goes when photos replace the drawings.
- [ ] PR body -- the per-item checklist for Christian's final check (approve or change for each fact, the Tivoli fact and each licence, plus every "could not verify" item) and a link to the report. The body states that NFR-8's "reviewer recorded in the Git history" is met by Christian's approving GitHub review and the merge, and that the other member's GitHub review is a separate required step. Claude ticks none of these boxes.

**Acceptance Criteria:**
- Given the real content, when `loadContent()` runs, then it succeeds and each of the 8 destinations has a 2–3 sentence English fact and exactly 2 sights with every required field.
- Given the PR, when it is opened, then it links the fact-check report and has an unticked checklist for Christian's final check, separate from the other member's review.
- Given the drafted content, when the fact-check subagent has run, then `.docs/content-review/story-2-2-fact-check.md` lists, per item, what was flagged, corrected and not verifiable, with a source URL per verified item, the Tivoli entry (original, verdict, final) and both agent prompts.
- Given every sight, when content is validated, then its `image` is a file in `public/assets/sights/` (not a URL) and it has non-empty `source`, `author` and `licence`.
- Given an image file replaced at the same path, when `npm test` and `npm run build` run, then both pass with no change under `src/`.

## Spec Change Log

2026-11-23 — spec review by a subagent (15 findings), triaged by Claude and approved by the user ("yes") before it was applied. Findings #2, #5, #6, #9 and #12 were already covered by the user's elicitation update. Applied outside the frozen block: the duplicate-id tests also set `image` (#1, high, confirmed at `content.test.ts:197`/`:578`); 3 new ACs (#4); a rule for unverifiable facts (#7); a note that NFR-8's Git-history reviewer is the approving review plus the merge (#8); the image `superRefine` and a `.webp` row (#10); a README credits task (#11); exact error messages and sentence-rule test rows (#3, #15); straight quotes only. Rejected: #14 (2.1's "7 fixtures" note; 2.1 is done and this spec says 6). #13 (Vite `base`) was dropped because `vite.config` sets no `base`.

2026-11-23 — walkthrough "dig into the risk spots", approved by the user ("We follow your recommendation"). Applied: (1) README "Adding a destination" checklist and an FR-19 note in `epics.md` (Epic 7), because the strict schema makes a partial destination fail at startup; (4) a test that ties the SVG theme hex values to `--color-ink` in `tokens.css`; (5) `fact()` now rejects curly quotes, ellipses, en/em dashes and common dotted abbreviations (`St.`, `Dr.`, `U.S.`, `c.`, `e.g.` …) with a clear message, because the sentence count silently miscounted them (tested: "St. Peter is big. It is old." counted 3). This reverses the triage rejection of BH6 + EC1; the "ellipsis (known overcount)" accepted row became a rejected row. Not changed, left as proposals in Christian's PR checklist: (2) the CC0 wording (touches frozen Q1) and (3) the Harbour Bridge span, the Vatican drawing and the Statue of Liberty exception.

## Review Triage Log

Review round 1 (2026-11-23), three layers: blind hunter (BH), edge case hunter (EC), verification gap (VG). Triage proposed by Claude and approved by the user ("Yes") before any patch. No intent_gap or bad_spec, so no loopback.

| # | Finding | Verdict | Route | Evidence |
|---|---|---|---|---|
| VG1 | Sight count never tested while a file it does not read is invalid | medium | patch | The "defers" tests only assert absence; removing the `when` gate would hide the count whenever any file fails, and no test would catch it. |
| VG2 + BH13a | `LONG.padEnd(321)` is a no-op; 320/200 limits not pinned | medium | patch | `LONG` is about 371 characters; any limit from 202 to 370 passes. |
| VG3 | No accepted fact ends in a closing quote | low | patch | Dropping `["')]?` from `FINAL_PUNCTUATION` would pass every test. |
| BH3 | Fact-check reply stored only "condensed" | medium | patch | The report says so itself; AI-governance traceability. |
| BH4 | Absolute local path with username in the saved prompts | low | patch | Report lines 254 and 304. |
| BH5 | Copenhagen fact says "Danish" where the fact-check flagged Old Danish | low | patch | Report line 66; a one-word correction. |
| BH1 | Summary "Corrected: 4" vs 7 changed facts in the table | low | patch | The agent counted required corrections; the table also has 3 optional ones. |
| BH7a | "Line drawing of" alt prefix not tested | low | patch | Spec drafting criterion; only non-empty is checked. |
| EC2 + EC4 | SVG test misses `//`, `@import`, `<foreignObject>`, `<use>`; theme block not required to be first | low | patch | The test matches only `http`, and only checks the block is present. |
| BH9 + BH13b | No warning against inlining the SVG (`:root` would restyle the page); `author` has no doc comment | low | patch | `types.ts` comments; the hazard falls on 2.3–2.5. |
| BH8a + EC5 | README says the file "must exist", but `loadContent()` checks only the path | low | patch | Only the real-content test checks files. |
| BH2 | "Verified" claims rest on unread snippets | false | reject | Every verified claim cites a page that was read (Wikipedia); the snippets are labelled extra corroboration. |
| BH6 + EC1 | Curly quotes, dashes, ellipses and dotted abbreviations not enforced by the schema | low | reject | Drafting criteria, not schema rules; the fact-check script found none; the fix adds a rule. |
| BH8b + EC3 | No checks for `.webp`, and no width/height/size checks | low | reject | No `.webp` exists; the spec requires only `viewBox`. |
| BH10 | Spec `in-review` vs sprint `in-progress` | false | reject | Step 5 sets sprint status to `review`. |
| BH11 | Open content decisions not filed as GitHub issues | false | reject | They are in Christian's PR checklist; issues are created after user approval in the session log (CLAUDE.md). |
| BH12 | Destination facts repeat themes (Olympics, World's Fair) | low | reject | Subjective; the spec rule (no repeating own sights' facts) holds; left to Christian's final check. |
| BH7b | Alt texts don't name the landmark | false | reject | The spec says alt text describes the drawing; the name is next to it on the card. |
| EC6 | A replacement SVG must match the theme block, contradicting the AC | false | reject | The AC is about no change under `src/`; the format rules are intended content rules. |
| VG-o1 | The image `superRefine` is skipped when another field of the sight fails | low | reject | zod object-level behaviour; the error shows on the next run; the fix adds complexity. |
| VG-o2 | File existence only enforced for real content | false | reject | Intended (fixtures have no images); README wording is covered by BH8a. |

## Design Notes

Sentence count: a fact must end in `.`, `!` or `?`, optionally followed by a closing `"`, `'` or `)`. Sentences are the matches of `/[.!?]["')]?(?=\s|$)/g`. Because the count cannot handle them, `fact()` rejects curly quotes, ellipses, en/em dashes and common dotted abbreviations (added after the walkthrough, see Spec Change Log). Exact messages: `must end in . ! or ?`, `must have 2–3 sentences (avoid abbreviations like "St.")` (sights: `1–2`), `must be at most N characters`. A plain rule like this is easier to review than a language library. The character limits (320 / 200 / 120) are a technical recommendation from the elicitation, not an AC. They protect the fact card and the sight card at 375 px, which the sentence count alone does not.

`author` is required even though the epic AC lists only `source` and `licence`, because AD-7 and NFR-8 name all three.

Theming the SVGs: an SVG loaded through `<img>` or a CSS background does not inherit `color` from the page, so plain `currentColor` would render black in both themes. Each SVG therefore starts with `<style>:root{color:#0a1826}@media (prefers-color-scheme:dark){:root{color:#f4efe1}}</style>`, and the strokes stay in `currentColor`, so inline use still follows the page. This works because `tokens.css` themes only through `prefers-color-scheme` (no manual toggle). The two hex values copy `--color-ink` (light/dark): a change to that token must also update the 16 SVGs, and a future manual theme toggle would need inline SVG or a CSS mask instead.

## Verification

**Commands:**
- `npm test` -- expected: all pass, including the 1.3, 1.4 and 2.1 rules tests
- `npm run lint` -- expected: exit 0
- `npm run build` -- expected: no type errors; then `ls dist/assets/sights | wc -l` -- expected: 16

**Manual checks:**
- Open 2–3 images through an `<img>` tag in a browser, in both light and dark system mode, to check 4:3 and legibility (the theme `<style>` block).
