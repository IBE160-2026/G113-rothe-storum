# Story 2.2 fact-check report

Content review for [spec 2.2](../implementation-artifacts/spec-2-2-fact-cards-and-sight-content.md) (FR-5, FR-21, NFR-6, NFR-8). It covers the 8 destination facts, the 16 sight facts, the 16 alt texts and the 16 image licence records in `content/destinations.json`, `content/sights.json` and `public/assets/sights/`.

## Process

The content went through three steps (NFR-8):

1. **Drafting (2026-11-23).** A drafting subagent wrote every `fact`, `imageAlt` and licence field and the 16 SVG line drawings, using the prompt in [Prompt 1](#prompt-1-drafting-agent). It did not fact-check its own work.
2. **AI fact-check (2026-11-23).** A separate fact-check subagent, which did not draft the content, checked every item with web search, using the prompt in [Prompt 2](#prompt-2-fact-check-agent). It could only read files and search the web. Its report is transcribed in [Fact-check agent report](#fact-check-agent-report) and kept verbatim in the [appendix](#appendix-fact-check-agent-reply-verbatim). Claude (the orchestrating session) then applied the corrections listed in [Corrections applied](#corrections-applied).
3. **Final check by Christian Storum (pending).** Facts, stereotypes and licences at the source are checked in the pull request, using the checklist in the PR body. This step has **not** been done at the time this report was written, and nothing in this file records an approval.

## Corrections applied

Claude applied these changes after the fact-check. Each final wording is either the one the fact-check agent proposed and sourced, or (for Copenhagen) a direct fix of a point it flagged, so no second fact-check round was needed. No item was marked "could not verify".

After the corrections, 8 of the 24 facts changed: 4 that the agent marked "corrected" (London, `copenhagen-tivoli`, `istanbul-topkapi-palace`, `tokyo-senso-ji`) and 4 optional precision fixes (Copenhagen, Tokyo, `tokyo-skytree`, `new-york-empire-state-building`). 4 of the 16 alt texts changed. The agent's own summary below counts only its required corrections.

| Item | Drafted | Final | Why |
|---|---|---|---|
| `copenhagen` (fact) | "... Its name comes from the Danish for "merchants' harbour". ..." | "... Its name comes from the Old Danish for "merchants' harbour". ..." | Fact-check flag (Destination facts, copenhagen): the name is Old Danish/Old Norse, not modern Danish. |
| `london` (fact) | "The London Underground opened in 1863 and was the world's first underground railway. Large parts of the city were rebuilt after the Great Fire of London in 1666." | "The London Underground opened in 1863 as the world's first underground passenger railway. Much of the City of London was rebuilt after the Great Fire of 1666." | Sources say "passenger" railway; the fire mainly hit the City of London. |
| `tokyo` (fact) | "... The city hosted the Summer Olympics in 1964 and again in 2021." | "... The city hosted the Summer Olympics in 1964, and the postponed 2020 Games in 2021." | Optional rewrite applied: the 2021 Games are officially "Tokyo 2020". |
| `copenhagen-tivoli` (fact) | see [Tivoli](#tivoli-ux-open-item-6-orchestrator-summary) | see [Tivoli](#tivoli-ux-open-item-6-orchestrator-summary) | Disputed ranking, vague distance. |
| `istanbul-topkapi-palace` (fact) | "... for about 400 years. ..." | "... for nearly 400 years. ..." | The source gives about 375–390 years. |
| `tokyo-senso-ji` (fact) | "... traditionally dated to 645. ..." | "... traditionally dated to 628. ..." | 628 is the traditional founding; 645 is a rebuilding. |
| `tokyo-skytree` (fact) | "It is the tallest structure in Japan." | "It is the tallest tower in Japan." | Optional rewrite applied: matches the source that was read. |
| `new-york-empire-state-building` (fact) | "... after about 13 months of construction. ..." | "... after just over 13 months of construction. ..." | Optional precision applied: the source says 13.5 months. |
| `copenhagen-tivoli` (imageAlt) | "... roller coaster track on wooden supports, above a ground line." | "... roller coaster track on tall supports, standing on a ground line." | The drawing cannot show material. |
| `london-tower-of-london` (imageAlt) | "Line drawing of a square stone keep with four domed corner turrets, battlements and a low curtain wall in front." | "Line drawing of a square keep with two domed corner turrets and battlements, behind a low crenellated wall with a gate." | Mismatch: two turrets are drawn, not four. |
| `new-york-empire-state-building` (imageAlt) | "... with vertical window bands, setbacks near the top and a slender spire." | "... with several setbacks, vertical window bands and a slender spire on top." | Setbacks start at mid-height. |
| `tokyo-skytree` (imageAlt) | "... two ring-shaped observation decks ..." | "... two box-shaped observation decks ..." | The decks are drawn as rectangles. |

**Not changed (kept, listed for Christian's check):**

- `sydney-harbour-bridge`: the span stays at 503 m. Wikipedia's infobox and ASCE give 503 m, while the article body says 504 m.
- `new-york`: kept as drafted. The 1673–74 Dutch "New Orange" interlude and the pre-1904 elevated lines do not make the sentence wrong.
- Licence wording: kept as "CC0 1.0 (AI-generated, no copyright claimed)", because the spec fixes it (Decision Q1 = A). The agent noted that a more precise form would be "CC0 1.0 (AI-generated; any rights waived by the Worldbound team)". This is a question for the team, not a correction.
- `rome-vatican-museums` drawing: the dome reads as St Peter's Basilica rather than the Museums. The alt text describes the drawing correctly, but the image choice is for Christian to judge.
- `new-york-statue-of-liberty` drawing: the only human figure in the set. It is a monument, not a person, but it sits close to the spec's "no people" rule.

## Tivoli (UX Open Item 6, orchestrator summary)

- **Original wording (UX, EXPERIENCE.md Open Item 6):** "Opened in 1843, Tivoli is the world's second-oldest amusement park still running — the oldest, Bakken, is just up the road."
- **Drafted wording:** "Opened in 1843, Tivoli is the world's second-oldest amusement park still running. The oldest, Bakken, is just up the road, north of Copenhagen."
- **Verdict (fact-check agent):** correct with caveats. The 1843 opening and Bakken's 1583 opening are verified. "Second-oldest" is the usual ranking (Wikipedia, Atlas Obscura) but is disputed by lists that rank Vienna's Prater second. "Just up the road" is imprecise, since Bakken is about 10 km north. The original's em dash breaks the content rules.
- **Final wording (in `content/sights.json`):** "Opened in 1843, Tivoli is often called the world's second-oldest amusement park still running. The oldest, Bakken from 1583, lies about 10 km to the north."

## Fact-check agent report

This is the fact-check subagent's reply, transcribed by Claude. The headings are shortened and some sentences are condensed, but the verdicts, sources, flags and proposed wordings are unchanged. "Drafted" always means the wording before the corrections above.

### Summary

- Facts checked: 24 (8 destinations, 16 sights).
- **Verified: 20** (7 destinations, 13 sights). Three carry minor caveats: New York, Tokyo and Sydney Harbour Bridge.
- **Corrected (rewrite proposed): 4**: London, `copenhagen-tivoli`, `istanbul-topkapi-palace`, `tokyo-senso-ji`.
- **Could not verify: 0.**
- **Flagged: 9**: the 4 fact wordings above; the original Tivoli wording (em dash, disputed ranking); 4 alt texts (one real mismatch, `london-tower-of-london`, which says four turrets where two are drawn; three minor: `copenhagen-tivoli`, `new-york-empire-state-building`, `tokyo-skytree`).
- Format check (script, all 24 facts): within the length and sentence limits; no curly quotes, ellipses, dashes or abbreviations with a dot; the only non-ASCII characters are `ı` in "Topkapı" and `ø` in "Jørn" (correct spellings); no destination fact repeats one of its sights' facts; no national-character, food or weather clichés; the only superlatives are checkable records, and all were checked.
- Licence records: all 16 consistent. No SVG contains `<text>`, `<script>`, `<image>`, `<use>`, `<foreignObject>`, `href`, `url(` or people. The only URL in any file is the standard `xmlns` namespace.

### Destination facts

#### copenhagen
- **Drafted:** "Copenhagen has been the capital of Denmark since the early 15th century. Its name comes from the Danish for "merchants' harbour". The Round Tower, completed in 1642, has a spiral ramp instead of stairs."
- **Verdict:** verified.
- **Sources:** capital "in the early 15th century" / "by about 1416", and Old Norse *Kaupmannahǫfn* = "merchants' harbour": https://en.wikipedia.org/wiki/Copenhagen. Round Tower completed 1642, "Instead of stairs, a 7.5-turn spiral ramp": https://en.wikipedia.org/wiki/Rundet%C3%A5rn
- **Flags:** the name is strictly Old Danish/Old Norse, not modern Danish; acceptable for a game. The Round Tower is not a sight, so no repetition.

#### paris
- **Drafted:** "Paris hosted the Summer Olympics in 1900, 1924 and 2024. The first line of the Paris Metro opened in 1900, during that year's World's Fair."
- **Verdict:** verified.
- **Sources:** https://en.wikipedia.org/wiki/Paris (Olympics); Line 1 opened 19 July 1900, the network's first: https://en.wikipedia.org/wiki/Paris_M%C3%A9tro_Line_1; Exposition 14 April to 12 November 1900: https://en.wikipedia.org/wiki/Exposition_Universelle_(1900)
- **Flags:** none.

#### london
- **Drafted:** "The London Underground opened in 1863 and was the world's first underground railway. Large parts of the city were rebuilt after the Great Fire of London in 1666."
- **Verdict:** corrected (minor precision).
- **Sources:** Metropolitan Railway "opened on 10 January 1863 as the world's first underground passenger railway": https://en.wikipedia.org/wiki/London_Underground; Great Fire 2 to 5 September 1666, the City reconstructed afterwards: https://en.wikipedia.org/wiki/Great_Fire_of_London
- **Flags:** without "passenger" the claim is too broad (earlier underground mine railways existed). The fire destroyed mainly the City of London, not the modern city.
- **Proposed:** "The London Underground opened in 1863 as the world's first underground passenger railway. Much of the City of London was rebuilt after the Great Fire of 1666."

#### rome
- **Drafted:** "According to legend, Rome was founded in 753 BC by Romulus. The city became the capital of a unified Italy in 1871."
- **Verdict:** verified.
- **Sources:** https://en.wikipedia.org/wiki/Founding_of_Rome (traditional date 753 BC, Romulus, legend); "officially made capital of Italy on 3 February 1871": https://en.wikipedia.org/wiki/Capture_of_Rome
- **Flags:** none.

#### istanbul
- **Drafted:** "Istanbul spans two continents, Europe and Asia, on either side of the Bosphorus strait. The city was once called Byzantium and later Constantinople, and its name officially became Istanbul in 1930."
- **Verdict:** verified.
- **Sources:** https://en.wikipedia.org/wiki/Istanbul (straddles the Bosphorus, two continents; name officially changed 28 March 1930); https://en.wikipedia.org/wiki/Names_of_Istanbul
- **Flags:** none.

#### new-york
- **Drafted:** "New York was called New Amsterdam until the English took control of it in 1664. The city is made up of five boroughs, and its first subway line opened in 1904."
- **Verdict:** verified, with a caveat.
- **Sources:** https://en.wikipedia.org/wiki/New_Amsterdam (seized 1664, renamed New York); https://en.wikipedia.org/wiki/Boroughs_of_New_York_City; first underground line "opened on October 27, 1904": https://en.wikipedia.org/wiki/New_York_City_Subway
- **Flags:** the Dutch briefly retook the city in 1673–74 as "New Orange"; elevated rapid transit existed from 1868. Neither falsifies the sentence. No change required.

#### tokyo
- **Drafted:** "Tokyo was called Edo until 1868, when it was renamed and became the imperial capital of Japan. The city hosted the Summer Olympics in 1964 and again in 2021."
- **Verdict:** verified, with a caveat.
- **Sources:** "Edo was renamed Tokyo (Eastern Capital) on September 3, 1868"; hosted 1964, and the postponed 2020 Games in 2021: https://en.wikipedia.org/wiki/Tokyo
- **Flags:** the emperor moved in 1868–69, so "became the imperial capital" in 1868 is slightly compressed. The 2021 Games are officially "Tokyo 2020".
- **Optional rewrite:** "Tokyo was called Edo until 1868, when it was renamed and became the imperial capital of Japan. The city hosted the Summer Olympics in 1964, and the postponed 2020 Games in 2021."

#### sydney
- **Drafted:** "Sydney was founded in 1788 as a British penal colony at Sydney Cove. The city hosted the Summer Olympics in 2000."
- **Verdict:** verified.
- **Sources:** https://en.wikipedia.org/wiki/Sydney (penal colony, Sydney Cove 26 January 1788, 2000 Olympics)
- **Flags:** none.

### Sight facts

#### copenhagen-tivoli
- **Drafted:** "Opened in 1843, Tivoli is the world's second-oldest amusement park still running. The oldest, Bakken, is just up the road, north of Copenhagen."
- **Verdict:** corrected. Ranking disputed, distance vague; see the Tivoli section.
- **Proposed:** "Opened in 1843, Tivoli is often called the world's second-oldest amusement park still running. The oldest, Bakken from 1583, lies about 10 km to the north."

#### copenhagen-nyhavn
- **Drafted:** "Nyhavn was dug in the 1670s as a canal linking the harbour to the city centre. Hans Christian Andersen lived in three of its houses."
- **Verdict:** verified.
- **Sources:** constructed 1670–1675 as "a gateway from the sea to the old inner city at Kongens Nytorv"; Andersen at No. 67 and No. 18: https://en.wikipedia.org/wiki/Nyhavn; No. 20 (1834–38): https://en.wikipedia.org/wiki/Nyhavn_20
- **Flags:** sources disagree on the end year at No. 18 (1873 vs 1875); does not affect the wording.

#### paris-eiffel-tower
- **Drafted:** "The Eiffel Tower was built for the 1889 World's Fair. It was the tallest structure in the world until 1930."
- **Verdict:** verified.
- **Sources:** built for the 1889 Exposition Universelle; tallest human-made structure until the Chrysler Building in 1930: https://en.wikipedia.org/wiki/Eiffel_Tower
- **Flags:** none.

#### paris-louvre
- **Drafted:** "The Louvre was a royal palace before it opened as a public museum in 1793. Its glass pyramid entrance was completed in 1989."
- **Verdict:** verified.
- **Sources:** royal residence from 1546, museum opened 10 August 1793: https://en.wikipedia.org/wiki/Louvre; pyramid completed 1989: https://en.wikipedia.org/wiki/Louvre_Pyramid
- **Flags:** it began as a fortress; "royal palace" is accurate for the period before 1793.

#### london-tower-of-london
- **Drafted:** "The Tower of London was founded after the Norman Conquest of 1066. Today it holds the Crown Jewels of the United Kingdom."
- **Verdict:** verified.
- **Sources:** https://en.wikipedia.org/wiki/Tower_of_London; https://en.wikipedia.org/wiki/Crown_Jewels_of_the_United_Kingdom
- **Flags:** none.

#### london-british-museum
- **Drafted:** "Founded in 1753, the British Museum opened to the public in 1759. It is home to the Rosetta Stone."
- **Verdict:** verified.
- **Sources:** https://en.wikipedia.org/wiki/British_Museum (established 1753, opened 15 January 1759, Rosetta Stone in Room 4)
- **Flags:** none.

#### rome-colosseum
- **Drafted:** "The Colosseum was completed in AD 80 under Emperor Titus. It could hold an estimated 50,000 spectators."
- **Verdict:** verified.
- **Sources:** https://en.wikipedia.org/wiki/Colosseum (completed AD 80 under Titus; estimates 50,000 to 80,000, modern estimates around 50,000)
- **Flags:** none; "estimated" is appropriately hedged.

#### rome-vatican-museums
- **Drafted:** "The Vatican Museums trace their origins to Pope Julius II in the early 1500s. Their route includes the Sistine Chapel, whose ceiling Michelangelo painted from 1508 to 1512."
- **Verdict:** verified.
- **Sources:** https://en.wikipedia.org/wiki/Vatican_Museums; https://en.wikipedia.org/wiki/Sistine_Chapel_ceiling
- **Flags:** none.

#### istanbul-topkapi-palace
- **Drafted:** "Topkapı Palace was the main residence of the Ottoman sultans for about 400 years. It became a museum in 1924."
- **Verdict:** corrected (minor).
- **Sources:** main residence from the 1460s (infobox 1478) to 1853, about 375–390 years; museum by decree of 3 April 1924: https://en.wikipedia.org/wiki/Topkap%C4%B1_Palace
- **Flags:** "about 400" rounds up; "nearly 400" is accurate for every date range in the source.
- **Proposed:** "Topkapı Palace was the main residence of the Ottoman sultans for nearly 400 years. It became a museum in 1924."

#### istanbul-galata-tower
- **Drafted:** "The Galata Tower was built in 1348 as part of the walls of the Genoese colony of Galata."
- **Verdict:** verified.
- **Sources:** https://en.wikipedia.org/wiki/Galata_Tower (built 1348, principal tower of the Galata Walls)
- **Flags:** none.

#### new-york-statue-of-liberty
- **Drafted:** "The Statue of Liberty was a gift from France and was dedicated in 1886. Its copper skin turned green over time as a patina formed."
- **Verdict:** verified.
- **Sources:** https://en.wikipedia.org/wiki/Statue_of_Liberty (gift from the people of France, dedicated 28 October 1886, oxidised green within about twenty years)
- **Flags:** none.

#### new-york-empire-state-building
- **Drafted:** "The Empire State Building opened in 1931 after about 13 months of construction. It was the tallest building in the world until 1970."
- **Verdict:** verified.
- **Sources:** construction began 17 March 1930, opened 1 May 1931, "thirteen and a half months afterward"; tallest until the WTC North Tower topped out in 1970: https://en.wikipedia.org/wiki/Empire_State_Building
- **Flags:** "about 13 months" slightly understates 13.5; "just over 13 months" is closer. The infobox is internally inconsistent about the record span; the body text supports 1970.

#### tokyo-senso-ji
- **Drafted:** "Senso-ji is Tokyo's oldest temple, traditionally dated to 645. Visitors enter through the Kaminarimon, or Thunder Gate."
- **Verdict:** corrected.
- **Sources:** "Tokyo's oldest established temple", Kaminarimon (Thunder Gate): https://en.wikipedia.org/wiki/Sens%C5%8D-ji; the temple's own site dates the origin to 18 March 628, with 645 as a rebuilding of the Kannon hall: https://www.senso-ji.jp/about/
- **Flags:** 645 is the wrong traditional founding date; it is 628.
- **Proposed:** "Senso-ji is Tokyo's oldest temple, traditionally dated to 628. Visitors enter through the Kaminarimon, or Thunder Gate."

#### tokyo-skytree
- **Drafted:** "Tokyo Skytree is 634 metres tall and opened in 2012. It is the tallest structure in Japan."
- **Verdict:** verified.
- **Sources:** 634 m, opened 22 May 2012, "the tallest tower in Japan": https://en.wikipedia.org/wiki/Tokyo_Skytree; https://www.guinnessworldrecords.com/world-records/68955-tallest-tower (found in search)
- **Flags:** the page read says "tallest tower"; "tallest structure in Japan" was corroborated only by search snippets. Optional safer wording: "It is the tallest tower in Japan."

#### sydney-opera-house
- **Drafted:** "The Sydney Opera House, designed by Danish architect Jørn Utzon, opened in 1973. It became a UNESCO World Heritage Site in 2007."
- **Verdict:** verified.
- **Sources:** https://en.wikipedia.org/wiki/Sydney_Opera_House
- **Flags:** none.

#### sydney-harbour-bridge
- **Drafted:** "The Sydney Harbour Bridge opened in 1932. Its steel arch spans 503 metres, and it is nicknamed 'the Coathanger'."
- **Verdict:** verified, with a caveat.
- **Sources:** opened 19 March 1932, "the Coathanger", infobox "Longest span 503 m": https://en.wikipedia.org/wiki/Sydney_Harbour_Bridge; ASCE and Engineers Australia snippets also give 503 m (https://asce.org/about-civil-engineering/history-and-heritage/historic-landmarks/sydney-harbour-bridge, not opened).
- **Flags:** the same article's body says 504 m; 503 m is the majority figure.

### Tivoli (UX Open Item 6)

- **Original wording:** "Opened in 1843, Tivoli is the world's second-oldest amusement park still running — the oldest, Bakken, is just up the road."
- **Drafted wording:** "Opened in 1843, Tivoli is the world's second-oldest amusement park still running. The oldest, Bakken, is just up the road, north of Copenhagen."
- **Verdict: correct with caveats** (both versions).
- **What holds:** Tivoli opened 15 August 1843: https://en.wikipedia.org/wiki/Tivoli_Gardens (also Tivoli's history page, seen via search: https://www.tivoli.dk/en/om/about/history). Bakken (Dyrehavsbakken) opened in 1583 and is "the world's oldest operating amusement park": https://en.wikipedia.org/wiki/Dyrehavsbakken. Wikipedia's Tivoli article calls it "the second-oldest operating amusement park in the world", after Dyrehavsbakken "in nearby Klampenborg"; Atlas Obscura uses the same ranking (snippet): https://atlasobscura.com/places/tivoli-gardens
- **What is shaky:** "second-oldest" is disputed. Some lists rank Vienna's Prater/Wurstelprater second (1766), making Tivoli third, e.g. https://www.adventurecoastsouthport.co.uk/blog/8-of-the-oldest-theme-parks-in-the-world/. Wikipedia's Wurstelprater article dates the amusement area to 1895 and says 1766 refers to the wider park: https://en.wikipedia.org/wiki/Wurstelprater. A hedge ("often called") makes the claim defensible. "Just up the road" is informal and imprecise: Bakken is about 10 km north of central Copenhagen (Dyrehavsbakken URL). The original contains an em dash, which breaks the content rules.
- **Recommended final wording:** "Opened in 1843, Tivoli is often called the world's second-oldest amusement park still running. The oldest, Bakken from 1583, lies about 10 km to the north."

### Alt text

- copenhagen-tivoli: minor. "Wooden" is a material the drawing cannot show; "above a ground line" is slightly off. Fix: "Line drawing of a tiered pagoda tower beside a wavy roller coaster track on tall supports, standing on a ground line."
- copenhagen-nyhavn: OK (six gabled houses with windows, quay line, boat with mast and sail, wave squiggles).
- paris-eiffel-tower: OK (curved legs, arch, three platforms, bracing, spire).
- paris-louvre: OK (gridded pyramid, long building with two rows of windows, ground line).
- london-tower-of-london: **MISMATCH.** Two domed turrets are drawn (x=230 and x=530), not four. Fix: "Line drawing of a square keep with two domed corner turrets and battlements, behind a low crenellated wall with a gate."
- london-british-museum: OK (pediment, entablature, eight columns, three steps).
- rome-colosseum: OK (jagged right-hand top, three rows of 10 arches).
- rome-vatican-museums: OK (wall with arched gateway, ribbed dome with lantern). Content note: the dome reads as St Peter's Basilica rather than the Museums.
- istanbul-topkapi-palace: OK (crenellated wall, two towers with conical roofs, arched gate).
- istanbul-galata-tower: OK (round tower, arched windows and door, gallery, conical roof).
- new-york-statue-of-liberty: OK (pedestal, robe, spiked crown, raised torch, tablet not mentioned).
- new-york-empire-state-building: minor. Five setbacks from mid-height; "near the top" understates. Fix: "Line drawing of a stepped skyscraper with several setbacks, vertical window bands and a slender spire on top."
- tokyo-senso-ji: OK (curved roof, four pillars, large lantern).
- tokyo-skytree: minor. The decks are flat rectangles, so "ring-shaped" is not visible. Fix: "Line drawing of a tall tapering lattice tower with two box-shaped observation decks and an antenna on top."
- sydney-opera-house: OK (four shells with ribs, platform, waves).
- sydney-harbour-bridge: OK (arch, 13 hangers, deck, pylons, water).

### Licence records

All 16 records pass: `image` is the relative path `assets/sights/<id>.svg` (not a URL); the file exists in `public/assets/sights/`; `source` "AI-drawn SVG (Claude, Anthropic), this repository", `author` "Claude (AI), for the Worldbound team", `licence` "CC0 1.0 (AI-generated, no copyright claimed)"; each SVG contains only `<svg>`, `<style>`, `<g>`, `<path>`, `<rect>` and `<circle>`, no external references apart from `xmlns`, and draws no people (the Statue of Liberty is a monument, not a real person).

Licence comment: "CC0 1.0 (AI-generated, no copyright claimed)" is a sensible, conservative statement. The US Copyright Office's Part 2 report (29 January 2025) concludes that purely AI-generated material is not copyrightable (https://www.copyright.gov/newsnet/2025/1060.html, read via search summary; https://www.copyright.gov/ai/). Status differs between countries, and a CC0 waiver covers any rights that do exist (https://creativecommons.org/publicdomain/zero/1.0/). Nuance: CC0 is a waiver by a rights holder, so strictly the waiver comes from the Worldbound team, not from Claude; a more precise form would be "CC0 1.0 (AI-generated; any rights waived by the Worldbound team)". The current form is acceptable. Anthropic's terms on output ownership were not verified.

### Could not verify

None. Two claims are supported only with caveats: Tokyo Skytree ("tallest structure" corroborated only by search snippets; the page read says "tallest tower") and the Harbour Bridge span (503 m vs 504 m within Wikipedia; 503 m is the majority figure).

In both prompts below, and in the verbatim reply in the appendix, the absolute local repository path was replaced with `<repo root>`. Nothing else was changed.

## Prompt 1: drafting agent

Given verbatim to the drafting subagent (through a file it was told to read and follow).

````markdown
You are the DRAFTING agent for Story 2.2 of the Worldbound travel game (repo: <repo root>). A separate agent will fact-check your work afterwards, so draft carefully but do not fact-check yourself beyond normal care. Do not run git commands. Edit only the files named below.

## Task

1. In `content/destinations.json`, add a `fact` field to each of the 8 destinations (copenhagen, paris, london, rome, istanbul, new-york, tokyo, sydney). Put it as the last key of each destination object. Do not change any other field or the `home` object.
2. In `content/sights.json`, add these fields to each of the 16 sights, after `price`, in this order: `fact`, `image`, `imageAlt`, `source`, `author`, `licence`. Do not change `id`, `destId`, `name` or `price`.
   - `image`: exactly `assets/sights/{id}.svg` (the sight's own id).
   - `source`: exactly `AI-drawn SVG (Claude, Anthropic), this repository`
   - `author`: exactly `Claude (AI), for the Worldbound team`
   - `licence`: exactly `CC0 1.0 (AI-generated, no copyright claimed)`
3. Create 16 SVG line drawings at `public/assets/sights/{id}.svg`, one per sight id (exact lowercase file names, no other files in that folder).

## Fact rules (enforced by a schema test)

- English only. Trimmed, non-empty. Must end in `.`, `!` or `?` (optionally followed by a closing `"`, `'` or `)`).
- Sentences are counted as matches of `/[.!?]["')]?(?=\s|$)/g`. So never use abbreviations with a dot ("St.", "e.g.", "Mt.", "U.S."), and never use ellipses. A decimal like "1.5" is fine, because no whitespace follows the dot.
- Destination fact: 2–3 sentences, at most 320 characters.
- Sight fact: 1–2 sentences, at most 200 characters.
- Straight quotes only (`"` and `'`), no curly quotes, no em/en dashes (use commas or "and" instead).
- No superlatives that cannot be checked ("most famous", "best", "most beautiful"). Checkable records (e.g. "tallest tower in Japan") are allowed only if clearly true and verifiable.
- No national-character, food or weather clichés, or other stereotypes.
- A destination fact must not repeat the facts of its two sights; pick different, concrete, verifiable facts (dates, numbers, history).
- Prefer well-documented, uncontroversial facts that a fact-checker can confirm on Wikipedia or an official site.

The `copenhagen-tivoli` sight fact must be based on this original pending UX wording (UX Open Item 6): "Opened in 1843, Tivoli is the world's second-oldest amusement park still running — the oldest, Bakken, is just up the road." Rewrite it to satisfy the rules above (no em dash, length limit, sentence rule), keeping its claims; the fact-checker will rule on it.

## imageAlt rules

- Non-empty, at most 120 characters, English.
- Starts with "Line drawing of " and describes what is actually drawn (shapes, elements visible), not just the name. It must match your SVG.

## SVG rules (enforced by tests)

- Each file starts with exactly this element as the first child of the root `<svg>`:
  `<style>:root{color:#0a1826}@media (prefers-color-scheme:dark){:root{color:#f4efe1}}</style>`
- Root: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">` (the literal attribute `viewBox="0 0 800 600"` must appear). 4:3.
- Line drawing: strokes in `currentColor` (`stroke="currentColor"`, `fill="none"`), consistent stroke width (e.g. 4–6), `stroke-linecap="round"` and `stroke-linejoin="round"`. Small solid fills in `currentColor` are OK sparingly.
- No `<text>`, no `<script>`, no `<image>`, no external `href` or `url(` to http(s), no people, no lettering. Keep each file small (hand-written paths, well under 10 KB).
- Recognisable simple illustration of the landmark (e.g. Eiffel Tower lattice silhouette, Colosseum arches, Opera House sails), with a ground line. The xmlns attribute is fine.

## Output

When done, reply with a short list: each sight id, its fact and imageAlt, plus the 8 destination facts, so the orchestrator can pass them on. Mention anything you were unsure about.
````

## Prompt 2: fact-check agent

Given verbatim to the fact-check subagent (through a file it was told to read and follow).

````markdown
You are the FACT-CHECK agent for Story 2.2 of the Worldbound travel game (repo: <repo root>). A different agent drafted the content; you did not write it. Your job is to check it critically. Do NOT edit any repository file and do not run git commands. Only read files and search the web. Load the WebSearch and WebFetch tools with ToolSearch ("select:WebSearch,WebFetch") before you start.

## What to check

Read `content/destinations.json` (8 destination `fact` fields), `content/sights.json` (16 sights: `fact`, `imageAlt`, `image`, `source`, `author`, `licence`) and the 16 SVG files in `public/assets/sights/`.

For every item, item by item:

1. **Destination facts (8) and sight facts (16):** verify each factual claim (dates, numbers, records, names) with web search. Cite at least one source URL for every claim you mark as verified. A claim without a source must be marked "could not verify". Flag anything wrong, imprecise, disputed or misleading, and propose a corrected wording that you can verify (with source). Also flag: superlatives that cannot be checked ("most famous", "best"), national-character, food or weather clichés or other stereotypes, a destination fact that repeats one of its sights' facts, curly quotes, ellipses, dashes, or abbreviations with a dot.
   Proposed rewrites must keep the rules: English; end in `.`, `!` or `?`; destination fact 2–3 sentences and at most 320 characters; sight fact 1–2 sentences and at most 200 characters; sentences are counted at each `.`, `!` or `?` followed by whitespace or the end, so no "St." and no ellipses; straight quotes only.
2. **Tivoli (UX Open Item 6):** the original pending wording was: "Opened in 1843, Tivoli is the world's second-oldest amusement park still running — the oldest, Bakken, is just up the road." Check both that original and the drafted `copenhagen-tivoli` fact. Give a clear verdict (correct / correct with caveats / incorrect), with sources, and a recommended final wording. Consider in particular whether "second-oldest" and "just up the road" (Bakken is at Klampenborg, north of Copenhagen) are accurate and how sources phrase Tivoli's ranking.
3. **imageAlt (16):** open each SVG source and check that its `imageAlt` starts with "Line drawing of" and describes what the drawing actually contains (do not invent elements that are not drawn). Flag mismatches and propose a fix (at most 120 characters). No web source needed for this item; cite the SVG elements you checked.
4. **Licence records (16):** check that `image` is a repo path (not a URL), that the file exists, that `source`, `author` and `licence` are consistent with an AI-drawn image made for this repo, and that no SVG contains `<text>`, `<script>`, `<image>`, people, or external references. Comment on whether "CC0 1.0 (AI-generated, no copyright claimed)" is a sensible licence statement for AI-generated content (cite a source on the copyright status of AI-generated works if you can).

## Output

Reply with a complete Markdown report (no preamble) with these sections:

- `## Summary` - counts: verified, corrected (proposed), could not verify, flagged.
- `## Destination facts` - one subsection per destination: drafted wording, verdict (verified / corrected / could not verify), the claims checked with source URLs, what you flagged, and the proposed wording if any.
- `## Sight facts` - same, one subsection per sight id.
- `## Tivoli (UX Open Item 6)` - original wording, drafted wording, verdict with sources, recommended final wording.
- `## Alt text` - one line per sight: OK or the mismatch and proposed fix.
- `## Licence records` - one line per sight plus your licence comment.
- `## Could not verify` - the full list, or "None".

Be precise and honest: do not mark anything verified unless a source you actually read supports it.
````

## Appendix: Fact-check agent reply (verbatim)

The fact-check subagent's final reply, exactly as received. The absolute local repository path was replaced with `<repo root>`; nothing else was changed.

````markdown
## Summary

- Facts checked: 24 (8 destinations, 16 sights).
- **Verified: 20.** 7 destinations and 13 sights. Three of them carry minor caveats: New York, Tokyo and Sydney Harbour Bridge.
- **Corrected (rewrite proposed): 4.** London, `copenhagen-tivoli`, `istanbul-topkapi-palace` and `tokyo-senso-ji`.
- **Could not verify: 0.**
- **Flagged: 9.**
  - 4 fact wordings (the 4 corrections above).
  - The original Tivoli wording, which has an em dash and a disputed ranking.
  - 4 alt texts. One is a real mismatch: `london-tower-of-london` says four turrets, but two are drawn. Three are minor: `copenhagen-tivoli`, `new-york-empire-state-building` and `tokyo-skytree`.
- Format check, done with a script on all 24 facts:
  - All are within the length and sentence limits.
  - None has curly quotes, ellipses, dashes or abbreviations with a dot.
  - The only non-ASCII characters are `ı` in "Topkapı" and `ø` in "Jørn". Both are correct spellings.
  - No destination fact repeats a fact from one of its sights.
  - No national-character, food or weather clichés.
  - The only superlatives are record claims that can be checked, and all were checked.
- Licence records: all 16 are consistent. All SVGs are free of `<text>`, `<script>`, `<image>`, `<use>`, `<foreignObject>`, `href`, `url(` and people. The only URL in any file is the standard `xmlns` namespace.

## Destination facts

### copenhagen
- **Drafted:** "Copenhagen has been the capital of Denmark since the early 15th century. Its name comes from the Danish for "merchants' harbour". The Round Tower, completed in 1642, has a spiral ramp instead of stairs."
- **Verdict:** verified.
- **Claims:**
  - Capital since the early 15th century: the lead says "became the capital of Denmark in the early 15th century", and the history section says "by about 1416". https://en.wikipedia.org/wiki/Copenhagen
  - "Merchants' harbour": the source gives Old Norse *Kaupmannahǫfn* = "merchants' harbour" (same URL).
  - Round Tower completed 1642, with "Instead of stairs, a 7.5-turn spiral ramp": https://en.wikipedia.org/wiki/Rundet%C3%A5rn
- **Flags:**
  - Strictly, the name comes from Old Danish/Old Norse, not modern Danish. This is acceptable for a game.
  - The Round Tower is not a sight, so there is no repetition.

### paris
- **Drafted:** "Paris hosted the Summer Olympics in 1900, 1924 and 2024. The first line of the Paris Metro opened in 1900, during that year's World's Fair."
- **Verdict:** verified.
- **Claims:**
  - Olympics in 1900, 1924 and 2024: https://en.wikipedia.org/wiki/Paris
  - Line 1 "opened to the public" on 19 July 1900 and "was the network's first to open": https://en.wikipedia.org/wiki/Paris_M%C3%A9tro_Line_1
  - The 1900 Exposition ran from 14 April to 12 November 1900, so the Metro opened during it: https://en.wikipedia.org/wiki/Exposition_Universelle_(1900)
- **Flags:** none. It does not repeat the Eiffel sight, which is about the 1889 fair.

### london
- **Drafted:** "The London Underground opened in 1863 and was the world's first underground railway. Large parts of the city were rebuilt after the Great Fire of London in 1666."
- **Verdict:** corrected (minor precision).
- **Claims:**
  - The Metropolitan Railway "opened on 10 January 1863 as the world's first underground passenger railway": https://en.wikipedia.org/wiki/London_Underground
  - Great Fire, 2 to 5 September 1666, with the city reconstructed afterwards: https://en.wikipedia.org/wiki/Great_Fire_of_London
- **Flags:**
  - Sources say "first underground *passenger* railway". Without "passenger", the claim is too broad, because there were earlier underground mine railways.
  - The fire destroyed mainly the City of London, not "the city" in the modern sense. The source says about 15% of housing.
- **Proposed (158 characters, 2 sentences):** "The London Underground opened in 1863 as the world's first underground passenger railway. Much of the City of London was rebuilt after the Great Fire of 1666."

### rome
- **Drafted:** "According to legend, Rome was founded in 753 BC by Romulus. The city became the capital of a unified Italy in 1871."
- **Verdict:** verified.
- **Claims:**
  - Traditional date of 753 BC (Varro), founded by Romulus, framed as legend: https://en.wikipedia.org/wiki/Founding_of_Rome
  - Captured 20 September 1870 and "officially made capital of Italy on 3 February 1871": https://en.wikipedia.org/wiki/Capture_of_Rome
- **Flags:** none. The "According to legend" framing is correct.

### istanbul
- **Drafted:** "Istanbul spans two continents, Europe and Asia, on either side of the Bosphorus strait. The city was once called Byzantium and later Constantinople, and its name officially became Istanbul in 1930."
- **Verdict:** verified.
- **Claims:**
  - "Istanbul straddles the Bosphorus ... a city on two continents": https://en.wikipedia.org/wiki/Istanbul
  - "officially changed as İstanbul on 28 March 1930" (same URL).
  - Byzantium and Constantinople, with Istanbul adopted as the official name in 1930: https://en.wikipedia.org/wiki/Names_of_Istanbul
- **Flags:** none.

### new-york
- **Drafted:** "New York was called New Amsterdam until the English took control of it in 1664. The city is made up of five boroughs, and its first subway line opened in 1904."
- **Verdict:** verified, with a caveat.
- **Claims:**
  - "In 1664, the English military seized control over New Amsterdam and renamed it New York": https://en.wikipedia.org/wiki/New_Amsterdam
  - Five boroughs: https://en.wikipedia.org/wiki/Boroughs_of_New_York_City
  - The first underground subway line "opened on October 27, 1904": https://en.wikipedia.org/wiki/New_York_City_Subway
- **Flags:**
  - The Dutch briefly retook the city in 1673–74 as "New Orange" (New Amsterdam URL). This does not falsify the sentence.
  - Elevated rapid transit existed from 1868. "First subway line" is still correct for the underground line.
  - No change required.

### tokyo
- **Drafted:** "Tokyo was called Edo until 1868, when it was renamed and became the imperial capital of Japan. The city hosted the Summer Olympics in 1964 and again in 2021."
- **Verdict:** verified, with a caveat.
- **Claims:**
  - "Edo was renamed Tokyo (Eastern Capital) on September 3, 1868", and the capital moved under Emperor Meiji shortly after: https://en.wikipedia.org/wiki/Tokyo
  - Hosted in 1964 "and also hosted in 2021". The 2020 Games were postponed and held 23 July to 8 August 2021 (same URL).
- **Flags:**
  - The emperor actually moved in 1868–69, so "became the imperial capital" in 1868 is slightly compressed.
  - The 2021 Games are officially "Tokyo 2020".
- **Optional rewrite (177 characters):** "Tokyo was called Edo until 1868, when it was renamed and became the imperial capital of Japan. The city hosted the Summer Olympics in 1964, and the postponed 2020 Games in 2021."

### sydney
- **Drafted:** "Sydney was founded in 1788 as a British penal colony at Sydney Cove. The city hosted the Summer Olympics in 2000."
- **Verdict:** verified.
- **Claims:**
  - "founded Sydney as a British penal colony", with "a settlement was established at Sydney Cove on 26 January 1788" and the 2000 Summer Olympics: https://en.wikipedia.org/wiki/Sydney
- **Flags:** none.

## Sight facts

### copenhagen-tivoli
- **Drafted:** "Opened in 1843, Tivoli is the world's second-oldest amusement park still running. The oldest, Bakken, is just up the road, north of Copenhagen."
- **Verdict:** corrected. The ranking is disputed and the distance is vague. Details are in the Tivoli section below.
- **Proposed (155 characters):** "Opened in 1843, Tivoli is often called the world's second-oldest amusement park still running. The oldest, Bakken from 1583, lies about 10 km to the north."

### copenhagen-nyhavn
- **Drafted:** "Nyhavn was dug in the 1670s as a canal linking the harbour to the city centre. Hans Christian Andersen lived in three of its houses."
- **Verdict:** verified.
- **Claims:**
  - Constructed 1670–1675 as "a gateway from the sea to the old inner city at Kongens Nytorv": https://en.wikipedia.org/wiki/Nyhavn
  - Andersen lived at No. 67 (1845–64) and No. 18 (1871–75), per the same URL.
  - He lived at No. 20 (1834–38): https://en.wikipedia.org/wiki/Nyhavn_20
  - That makes three houses.
- **Flags:** sources disagree on the end year at No. 18 (1873 vs 1875). This does not affect the wording.

### paris-eiffel-tower
- **Drafted:** "The Eiffel Tower was built for the 1889 World's Fair. It was the tallest structure in the world until 1930."
- **Verdict:** verified.
- **Claims:**
  - "commissioned as a temporary structure for the 1889 Exposition Universelle"
  - Held the title of tallest human-made structure "for 41 years until the Chrysler Building ... was finished in 1930": https://en.wikipedia.org/wiki/Eiffel_Tower
- **Flags:** none.

### paris-louvre
- **Drafted:** "The Louvre was a royal palace before it opened as a public museum in 1793. Its glass pyramid entrance was completed in 1989."
- **Verdict:** verified.
- **Claims:**
  - Principal residence of French kings from 1546, and the museum opened on 10 August 1793: https://en.wikipedia.org/wiki/Louvre
  - Pyramid "Completed in 1989", opened 29 March 1989: https://en.wikipedia.org/wiki/Louvre_Pyramid
- **Flags:** it began as a fortress, but "royal palace" is accurate for the period before 1793.

### london-tower-of-london
- **Drafted:** "The Tower of London was founded after the Norman Conquest of 1066. Today it holds the Crown Jewels of the United Kingdom."
- **Verdict:** verified.
- **Claims:**
  - Founded "toward the end of 1066 as part of the Norman Conquest": https://en.wikipedia.org/wiki/Tower_of_London
  - "The Crown Jewels of the United Kingdom, originally the Crown Jewels of England", housed in the Jewel House at the Tower: https://en.wikipedia.org/wiki/Crown_Jewels_of_the_United_Kingdom
- **Flags:** none.

### london-british-museum
- **Drafted:** "Founded in 1753, the British Museum opened to the public in 1759. It is home to the Rosetta Stone."
- **Verdict:** verified.
- **Claims:**
  - Established 1753, opened 15 January 1759, Rosetta Stone in Room 4: https://en.wikipedia.org/wiki/British_Museum
- **Flags:** none.

### rome-colosseum
- **Drafted:** "The Colosseum was completed in AD 80 under Emperor Titus. It could hold an estimated 50,000 spectators."
- **Verdict:** verified.
- **Claims:**
  - "completed in AD 80 under his successor and heir, Titus"
  - Estimated 50,000 to 80,000 spectators, with modern estimates around 50,000: https://en.wikipedia.org/wiki/Colosseum
- **Flags:** none. "Estimated" is appropriately hedged.

### rome-vatican-museums
- **Drafted:** "The Vatican Museums trace their origins to Pope Julius II in the early 1500s. Their route includes the Sistine Chapel, whose ceiling Michelangelo painted from 1508 to 1512."
- **Verdict:** verified.
- **Claims:**
  - "Pope Julius II founded the museums in the early 16th century", and the Sistine Chapel is "on the visitor route": https://en.wikipedia.org/wiki/Vatican_Museums
  - Ceiling painted "between 1508 and 1512": https://en.wikipedia.org/wiki/Sistine_Chapel_ceiling
- **Flags:** none.

### istanbul-topkapi-palace
- **Drafted:** "Topkapı Palace was the main residence of the Ottoman sultans for about 400 years. It became a museum in 1924."
- **Verdict:** corrected (minor).
- **Claims:**
  - Main residence "From the 1460s to the completion of Dolmabahçe Palace in 1853". The infobox gives 1478–1853, which is about 375–390 years.
  - Museum by "government decree dated April 3, 1924": https://en.wikipedia.org/wiki/Topkap%C4%B1_Palace
- **Flags:** "about 400" rounds up. "Nearly 400" is accurate for every date range in the source.
- **Proposed (110 characters):** "Topkapı Palace was the main residence of the Ottoman sultans for nearly 400 years. It became a museum in 1924."

### istanbul-galata-tower
- **Drafted:** "The Galata Tower was built in 1348 as part of the walls of the Genoese colony of Galata."
- **Verdict:** verified.
- **Claims:**
  - "The structure now known as the Galata Tower was built in 1348"
  - It "served as the principal tower of the Galata Walls, of which it formed a part": https://en.wikipedia.org/wiki/Galata_Tower
- **Flags:** none. It is one sentence, which is allowed.

### new-york-statue-of-liberty
- **Drafted:** "The Statue of Liberty was a gift from France and was dedicated in 1886. Its copper skin turned green over time as a patina formed."
- **Verdict:** verified.
- **Claims:**
  - "a gift to the United States from the people of France", dedicated 28 October 1886
  - Oxidized to green within about twenty years: https://en.wikipedia.org/wiki/Statue_of_Liberty
- **Flags:** none.

### new-york-empire-state-building
- **Drafted:** "The Empire State Building opened in 1931 after about 13 months of construction. It was the tallest building in the world until 1970."
- **Verdict:** verified.
- **Claims:**
  - Construction began 17 March 1930, and it opened 1 May 1931, "thirteen and a half months afterward"
  - "the world's tallest building until the North Tower of the World Trade Center was topped out in 1970": https://en.wikipedia.org/wiki/Empire_State_Building
- **Flags:**
  - "About 13 months" slightly understates 13.5. "Just over 13 months" is closer, but the current wording is acceptable.
  - The Wikipedia infobox is internally inconsistent about the record span. The body text supports 1970.

### tokyo-senso-ji
- **Drafted:** "Senso-ji is Tokyo's oldest temple, traditionally dated to 645. Visitors enter through the Kaminarimon, or Thunder Gate."
- **Verdict:** corrected.
- **Claims:**
  - "Tokyo's oldest established temple", and Kaminarimon is the outer gate, also called Thunder Gate: https://en.wikipedia.org/wiki/Sens%C5%8D-ji
  - The temple's own site dates the origin to 18 March 628, when the Kannon statue appeared. In 645 the monk Shōkai repaired or rebuilt the Kannon hall: https://www.senso-ji.jp/about/
  - Wikipedia likewise calls 645 a renovation, not the founding.
- **Flags:** 645 is the wrong traditional date for the founding. The traditional date is 628.
- **Proposed (119 characters):** "Senso-ji is Tokyo's oldest temple, traditionally dated to 628. Visitors enter through the Kaminarimon, or Thunder Gate."

### tokyo-skytree
- **Drafted:** "Tokyo Skytree is 634 metres tall and opened in 2012. It is the tallest structure in Japan."
- **Verdict:** verified.
- **Claims:**
  - Full height of 634 m, opened to the public 22 May 2012, "the tallest tower in Japan since opening in 2012": https://en.wikipedia.org/wiki/Tokyo_Skytree
  - The search also found Guinness's "tallest tower" record page: https://www.guinnessworldrecords.com/world-records/68955-tallest-tower
- **Flags:**
  - The page I actually read says "tallest tower". "Tallest structure in Japan" was corroborated only by search snippets.
  - It is true by implication, since no Japanese building exceeds 634 m. Safer wording would be "It is the tallest tower in Japan." This is optional.

### sydney-opera-house
- **Drafted:** "The Sydney Opera House, designed by Danish architect Jørn Utzon, opened in 1973. It became a UNESCO World Heritage Site in 2007."
- **Verdict:** verified.
- **Claims:**
  - Designed by Danish architect Jørn Utzon, formally opened 20 October 1973, UNESCO listing 2007: https://en.wikipedia.org/wiki/Sydney_Opera_House
- **Flags:** none.

### sydney-harbour-bridge
- **Drafted:** "The Sydney Harbour Bridge opened in 1932. Its steel arch spans 503 metres, and it is nicknamed 'the Coathanger'."
- **Verdict:** verified, with a caveat.
- **Claims:**
  - Formally opened 19 March 1932, nicknamed "the Coathanger": https://en.wikipedia.org/wiki/Sydney_Harbour_Bridge
  - The infobox gives "Longest span 503 m".
- **Flags:**
  - The same article's body text says "504 m". Search snippets from ASCE (https://asce.org/about-civil-engineering/history-and-heritage/historic-landmarks/sydney-harbour-bridge) and Engineers Australia also give 503 m, but I did not open those pages.
  - 503 m is the majority figure.
  - The single quotes are straight, which is OK.

## Tivoli (UX Open Item 6)

**Original wording:** "Opened in 1843, Tivoli is the world's second-oldest amusement park still running — the oldest, Bakken, is just up the road."

**Drafted wording:** "Opened in 1843, Tivoli is the world's second-oldest amusement park still running. The oldest, Bakken, is just up the road, north of Copenhagen."

**Verdict: correct with caveats** (both versions).

What holds:
- The opening year is right. Tivoli opened on 15 August 1843: https://en.wikipedia.org/wiki/Tivoli_Gardens. Tivoli's own history page says the same: https://www.tivoli.dk/en/om/about/history (seen via search result).
- Bakken (Dyrehavsbakken) "opened in 1583" and is "the world's oldest operating amusement park": https://en.wikipedia.org/wiki/Dyrehavsbakken
- Wikipedia's Tivoli article, as I fetched it, says "the second-oldest operating amusement park in the world", after Dyrehavsbakken "in nearby Klampenborg". Atlas Obscura uses the same ranking (search snippet): https://atlasobscura.com/places/tivoli-gardens

What is shaky:
- **"Second-oldest" is disputed.** Some lists rank Vienna's Prater/Wurstelprater second, based on 1766, when Joseph II opened the Prater to the public. That puts Tivoli third. For example, https://www.adventurecoastsouthport.co.uk/blog/8-of-the-oldest-theme-parks-in-the-world/ calls Tivoli "The world's third-oldest theme park".
  - Wikipedia's Wurstelprater article gives the amusement area itself an opening of 1895. It says 1766 refers to the wider Prater park: https://en.wikipedia.org/wiki/Wurstelprater
  - So Tivoli's second place depends on how you count. A hedge ("often called") makes the claim defensible.
- **"Just up the road" is imprecise and informal.** Dyrehavsbakken is in Klampenborg, Lyngby-Taarbæk Municipality, "approximately 10 km (6 mi) north of central Copenhagen" (Dyrehavsbakken URL). It is not walking distance from Tivoli. "North of Copenhagen" in the draft is fine. "Just up the road" should go.
- **The original contains an em dash (—),** which breaks the content rules. The draft already fixed this.

**Recommended final wording (155 characters, 2 sentences):** "Opened in 1843, Tivoli is often called the world's second-oldest amusement park still running. The oldest, Bakken from 1583, lies about 10 km to the north."

**Alternative that avoids the ranking entirely (149 characters):** "Opened in 1843, Tivoli is one of the oldest amusement parks still running. Only Bakken, about 10 km north of the city, has a longer unbroken history." This one is less precise: "only Bakken" again implies Tivoli is second. Prefer the first.

## Alt text

- **copenhagen-tivoli:** mostly OK.
  - Drawn: four stacked rects with curved roofs and a spire (the pagoda), a sine-wave track path, nine vertical supports, and a ground line.
  - Flag: "wooden" describes a material the drawing cannot show. "Above a ground line" is slightly off, because the objects stand on it.
  - Fix (117 characters): "Line drawing of a tiered pagoda tower beside a wavy roller coaster track on tall supports, standing on a ground line."
- **copenhagen-nyhavn:** OK. Drawn: six gabled house outlines with window rects, a quay line, a boat hull with mast and triangular sail, and three wave squiggles.
- **paris-eiffel-tower:** OK. Drawn: two curved leg paths, an arch curve, three pairs of platform lines (y 400/412, 250/262, 110/122), cross-bracing and a spire.
- **paris-louvre:** OK. Drawn: a pyramid triangle with horizontal and radial grid lines, a long building with cornice, two rows of 13 window rects, and a ground line.
- **london-tower-of-london: MISMATCH.**
  - Drawn: only two turret rects (x=230 and x=530) with domed tops and finials, not four. There is also a crenellated keep, six arched windows, and a crenellated curtain wall with an arched gate.
  - Fix (119 characters): "Line drawing of a square keep with two domed corner turrets and battlements, behind a low crenellated wall with a gate."
- **london-british-museum:** OK. Drawn: a triangular pediment, entablature, eight columns with capitals and bases, and three step lines.
- **rome-colosseum:** OK. Drawn: a wall outline with a jagged right-hand top, three bands, and three rows of 10 arches.
- **rome-vatican-museums:** OK. Drawn: a long wall with a double arched gateway and four windows, plus a ribbed dome on a windowed drum with a lantern and spike behind.
  - Content note: the dome reads as St Peter's Basilica rather than the Museums. This is not an alt-text error.
- **istanbul-topkapi-palace:** OK. Drawn: a crenellated wall, two tower rects with triangular conical roofs and finials, window rects, and a double arched gate.
- **istanbul-galata-tower:** OK. Drawn: a tower body with curved bands (suggesting it is round), two arched windows, an arched door, a gallery with three arched openings, a conical roof and a finial.
- **new-york-statue-of-liberty:** OK. Drawn: a three-step pedestal, robe, head circle with five spikes, a raised arm with torch and flame, and a tablet. The tablet is not mentioned, which is fine.
- **new-york-empire-state-building:** minor.
  - Drawn: five setbacks, from about mid-height (y=300) upwards, plus vertical window lines and a spire. "Setbacks near the top" understates this.
  - Fix (109 characters): "Line drawing of a stepped skyscraper with several setbacks, vertical window bands and a slender spire on top."
- **tokyo-senso-ji:** OK. Drawn: a wide curved roof, four pillars, a crossbeam, and a large lantern shape with ribs hanging on a cord.
- **tokyo-skytree:** minor.
  - Drawn: two tapering leg curves with cross-bracing and an antenna. The two decks are flat rects (360–440 at y 270–300, and 375–425 at y 170–192), so "ring-shaped" is not visible.
  - Fix (106 characters): "Line drawing of a tall tapering lattice tower with two box-shaped observation decks and an antenna on top."
- **sydney-opera-house:** OK. Drawn: four shell curves with rib lines, a platform made of two lines plus a box, and three wave squiggles.
- **sydney-harbour-bridge:** OK. Drawn: two arch curves, 13 vertical hangers, a double deck line, two pylon rects at the ends, piers, a water line and wave squiggles.

All 16 start with "Line drawing of" and are 98–116 characters long, so all are at most 120.

## Licence records

These checks apply to all 16 records:
- `image` is the relative repo path `assets/sights/<id>.svg`, not a URL.
- The file exists in `<repo root>/public/assets/sights/`.
- `source` is "AI-drawn SVG (Claude, Anthropic), this repository".
- `author` is "Claude (AI), for the Worldbound team".
- `licence` is "CC0 1.0 (AI-generated, no copyright claimed)".
- The SVG contains only `<svg>`, `<style>`, `<g>`, `<path>`, `<rect>` and `<circle>`. It has no `<text>`, `<script>`, `<image>`, `<use>`, `<foreignObject>`, `href` or `url(`, and no external references apart from the `xmlns` namespace. It draws no people.

Every record passed all of these checks:
- copenhagen-tivoli: OK
- copenhagen-nyhavn: OK
- paris-eiffel-tower: OK
- paris-louvre: OK
- london-tower-of-london: OK
- london-british-museum: OK
- rome-colosseum: OK
- rome-vatican-museums: OK
- istanbul-topkapi-palace: OK
- istanbul-galata-tower: OK
- new-york-statue-of-liberty: OK
- new-york-empire-state-building: OK
- tokyo-senso-ji: OK
- tokyo-skytree: OK
- sydney-opera-house: OK. The statue in `new-york-statue-of-liberty` is the one human figure in the set: a monument, not a real person.
- sydney-harbour-bridge: OK

**Licence comment:** "CC0 1.0 (AI-generated, no copyright claimed)" is a sensible, conservative statement.
- The US Copyright Office's Part 2 report (29 January 2025) concludes that purely AI-generated material, or material without enough human control over its expressive elements, is not copyrightable. https://www.copyright.gov/newsnet/2025/1060.html (I read this via search summary; the overview page https://www.copyright.gov/ai/ confirms the report's subject.)
- So there is probably no copyright to license, at least in the US.
- Copyright status differs between countries, and the team's prompting and curation could add a thin human contribution. A CC0 waiver covers any rights that do exist. The CC0 deed describes the dedicator as "waiving all of his or her rights to the work worldwide" (https://creativecommons.org/publicdomain/zero/1.0/).
- One wording nuance: CC0 is a waiver by a rights holder. Strictly speaking, the waiver comes from the Worldbound team, not from "Claude". A slightly more precise form would be "CC0 1.0 (AI-generated; any rights waived by the Worldbound team)". The current form is acceptable.
- I did not verify Anthropic's terms on ownership of outputs, so I make no claim about them.

## Could not verify

None. Two claims are supported in the cited sources only with caveats:
- Tokyo Skytree: the page I read says "tallest tower in Japan"; "tallest structure" was corroborated only by search snippets.
- Harbour Bridge: 503 m vs 504 m within Wikipedia; 503 m is the majority figure.
````
