---
title: 'competitive research: travel game benchmarks (Backpacker, 80 Days, short browser games)'
type: 'competitive'
topic: 'travel game benchmarks (Backpacker, 80 Days, short browser games)'
decision: 'How WORLDBOUND: NOMAD should design work (FR-15/16), fact cards and tone (§7), and whether save/resume (FR-20) belongs in CORE'
source: 'native run'
status: complete
preset: 'standard'
validation: 'normal'
created: '2026-11-16'
updated: '2026-11-16'
claims_verified: 5
claims_unverified: 6
---

# Competitive research: travel game benchmarks

**Decision this research serves:** how WORLDBOUND: NOMAD should design work (FR-15/16), fact cards and tone (PRD §7), and whether save/resume (FR-20) belongs in CORE.

**Scope:** Backpacker 2 (PC, 1997) and Backpacker (mobile, Qiiwi Games), 80 Days (inkle, 2014), and the short-session games Wordle and Reigns. Pricing and trajectory dimensions were pruned; the competitive pack's freshness bars were relaxed because most titles are 10–30 years old. Older sources are marked with their date.

## Executive summary

1. **Make a minimal autosave part of CORE, and treat it as best-effort.** The short-session benchmarks are built for minutes: Wordle targets "three minutes of your time a day" [15], and in Reigns "you can make a hundred decisions in five minutes" [19]. The PRD says a journey takes "one or two sittings", but saving (FR-20) is EXT, so a closed tab on the bus loses the journey. Browser storage cannot be the only safeguard either. Safari deletes all script-writable storage (localStorage, IndexedDB) for a site after 7 days of Safari use without interaction [17][18], and private browsing usually deletes it when the session ends [18]. Wordle players losing streaks stored only in localStorage made national news [16].
2. **NOMAD's work design is close to Backpacker. Document the differences.** In Backpacker, money for travel comes from jobs tied to quiz questions [1][2]. The mobile Backpacker also gives a passport stamp per city and charges a hotel every day, or you sleep in the street [4]. Those are three of NOMAD's core ideas. NOMAD's distinct choices should be written down to meet the addendum's "inspiration vs. copying" rule: a fixed 30-day journey instead of a race to circle the world fastest [1], a finite question sequence that runs out, and shifts that cost a day.
3. **Places work better as moments than as fact boxes.** 80 Days conveys cities as short, self-contained story episodes [7][9], and critics praised its writing [9][10]. One critic still named limits in "cultural understanding and respect" [14] (low confidence). Writing NOMAD's 2–3 sentence fact cards as a traveller's moment followed by one fact fits the PRD's "not a school quiz" goal (§2.1). NFR-8's stereotype review remains necessary.

**Biggest caveat:** none of the sources measures how players react to losing progress or how long a NOMAD-like journey should be. The autosave recommendation rests on technical facts (high confidence) and on design statements from other genres (medium). The playtest should time a full journey.

## 1. Mechanics: what the benchmarks actually do

**Backpacker (PC, 1995–2006).** The player "travels the world and answers questions", and "in order to get the money needed for traveling, the player have to take different jobs" [1]. Metacritic's listing independently describes Backpacker 2 as built on the questions you must answer to travel [2]. There are two alternative goals: circle the world in the shortest time while visiting as many cities as possible, or collect certificates in as many jobs as possible [1]. Backpacker 2 (1997, BMG Interactive; developed by TATI Mixedia and Aniware AB) had 70 destinations, 70 jobs, 6,000 questions and two difficulty levels [1]. It had sold 600,000 copies in the Nordics by 2010 [1]. No source retrieved in this run describes PC transport modes, a day counter, passport stamps or the pay formula (absence of evidence, not evidence of absence).

**Backpacker (mobile, Qiiwi Games).** You start "stranded in Rome with 500 coins", earn money through missions, odd jobs and job diplomas, and pay for a hotel each day or "risk sleeping in the streets" [4]. Each city gives a passport stamp and memento tokens, and there are minigames [4]. Travel has waiting time, which a weekly subscription removes; there are also ads and coin purchases [4]. It passed 2 million registered players in 2018 [5].

**80 Days (inkle, 2014).** inkle describes it as "part interactive fiction, part globe-based board-game", with nearly two hundred cities [8]. The game tracks only money, health, time and three character traits between cities. This made each city a self-contained episode that could be written in parallel [7]. Routes are locked and are unlocked by exploring cities, talking to characters or buying items [6][7][12][13]. The designers credit this change with fixing a game that "wasn't fun" with everything visible, and with making choices feel meaningful [6][7]. Money comes from banks, where a withdrawal takes days, and from trading goods between markets; sleeping rough works when funds are low [10]. Running out of money "is easy to do and can cause major delays" [9]. The game does not end at day 80; the bet is simply lost [9]. A playthrough is roughly three hours, per an IGN quote on the Steam page [11] (medium).

**Reigns (Nerial, 2016).** One reign is one run, with the goal of "the longest reign possible". Reigns are linked in a dynasty so that "some elements you trigger in one reign will have impacts over the rulers", because the designer "didn't want the player to restart the same thing and feel punished" [19]. The player sets the pace: "you can swipe very quickly or you can take your time" [20].

**Wordle (2021–).** One puzzle per day, designed for "three minutes of your time a day" [15]. Stats and streaks were never stored on a server. They live in each player's browser, tied to the site address [16].

## 2. Players' voice

- **Backpacker** is remembered with strong family nostalgia: playing with a parent who helped with the hard questions, playing until the CD wore out [3] (low; self-selected comments). One player says Backpacker 3 "removed everything that made BackPacker 2 such a great game" [3] (low).
- **Backpacker mobile** reviewers praise it as "fun and educational, just like the old PC Backpacker" (2017). They complain that job questions become repetitive (2017) and about constant ads and few free cities (2025) [4] (low-medium; only four reviews visible). Educational framing is used as praise, not as criticism, in the reviews found. No source directly addressed whether the quiz felt like schoolwork.
- **80 Days** was scored 4.5/5 by Pocket Gamer, which said the story makes you want to replay [10]; it was criticised for decisions whose outcomes are unexpected [10]. Steam reviews were "Very Positive" (91% of 1,182) when accessed [11]. Players report running out of money because direct routes cost the most, and advise detours to earn money [22] (low; search snippets).
- **Wordle**: the once-a-day limit made sharing "a huge part of the game" and made players feel like "a club" [15]. Streak loss during the move to the New York Times site was covered as a "Wordle disaster" [16].

## 3. Conveying places and consequences

- **Story, not fact boxes.** 80 Days' writing is "fragmentary, episodic, and textural", favouring "novel settings and striking imagery" [9]. Lead writer Meg Jayanth researched each city and aimed to be "inclusive and even-handed" [7]. Emily Short praises it for centring women, servants, colonised and non-Western characters marginalised in Verne's novel [9]. Slant Magazine argued it "has its limits in terms of cultural understanding and respect" [14] (low; snippet only).
- **Consequences up front.** 80 Days' designers framed travel because time, money and luggage give "every choice … ready-made context" [6]. No source in this run confirmed how its route screen shows price and duration before booking; this remains open.
- **Sharing without social features.** Wordle's emoji grid is "a way in which you can share that story really easily" and has no links [15].

## Cross-dimension insights

- **The closest competitor shares NOMAD's core loop.** Mechanics and player voice point the same way: Backpacker's quiz-for-money jobs, stamps and daily hotel costs [1][4] are what players remember fondly [3][4], and repetitive questions are the main complaint [4]. NOMAD's finite, non-repeating question sequence (FR-16) answers that complaint directly. The fixed 30-day journey is the clearest point of difference from Backpacker's race [1], which supports the brief's differentiation claim.
- **Every benchmark that runs longer than a few minutes saves progress, and no benchmark treats losing as the end.** 80 Days stores the full choice history and supports Steam Cloud [7][11]. Reigns carries progress across runs [19]. 80 Days lets a failed bet play out [9]. This matches PRD §1 ("a crisis, not game over") and suggests the journey summary should help the player try again (UJ-2).
- **Browser saves are fragile in exactly the PRD's main setting.** The PRD's primary player plays in a mobile browser in short gaps (§2.2). On iPhone that means Safari, where the 7-day rule applies [17][18]; WebKit's own bug tracker shows the behaviour is inconsistent in practice [21].

## Recommendations

1. **PRD §9.1/§9.2, FR-20:** move a minimal autosave (FR-20's first three consequences) from EXT to CORE. Add a consequence that the journey may be lost in private browsing or after 7 days without use in Safari, and that the game then starts cleanly. FR-20 already requires a non-crashing discard. *Confidence: high for the storage facts [17][18], medium for the session-length argument [15][19].* Alternative if the team keeps FR-20 in EXT: change §1 to "one sitting" and check in the playtest that a journey fits a single sitting.
2. **PRD §2 or README:** add a short "Inspiration vs. copying" paragraph naming Backpacker and listing NOMAD's own mechanics (fixed days, finite question sequences, shift costs a day, call home). *Confidence: medium [1][4].*
3. **FR-16 (EXT):** keep the finite, non-repeating question sequence. It answers the most concrete complaint about the mobile Backpacker [4]. *Confidence: low-medium (few reviews).*
4. **Fact cards (§7, NFR-8, Story 2.2):** write each card as one concrete traveller's moment plus one fact, not a list of facts, and keep the stereotype review. *Confidence: medium [7][9]; the cultural-limits critique [14] is low confidence.*
5. **Journey summary (FR-14), post-MVP idea:** a copyable text summary of the route and stamps, in the spirit of Wordle's grid, without links or social features (§8). *Confidence: medium [15].*
6. **Post-MVP backlog:** "routes as rewards" (unlocking routes by exploring) is 80 Days' strongest design lesson [6][7], but it conflicts with FR-4 (all routes visible) and should only be a future idea.

## Open questions

- How long does a NOMAD journey take in practice? Answer by timing playtesters (SM-2).
- How did the PC Backpacker handle transport modes, time and pay? Needs MobyGames (returned 403), a manual archive or a longplay video.
- How does 80 Days show price and duration before booking? Needs screenshots or the GameSpot review (returned 403).
- How many players abandon a game after losing progress? No quantitative data found.
- Does Wardle explain why he chose localStorage over accounts? Likely in the Syntax.fm interview transcript; not read.

## Source appendix

| # | Claim/finding it supports | Publisher | Pub date | Accessed | Confidence |
|---|---|---|---|---|---|
| [1] | Backpacker series: jobs and questions, goals, content, sales | [Wikipedia](https://en.wikipedia.org/wiki/Backpacker_(video_game_series)) | living article | 2026-11-16 | medium |
| [2] | Backpacker 2 built on questions answered to travel | [Metacritic](https://legacy.prod.metacritic.com/game/pc/backpacker-2/details) | unknown | 2026-11-16 | medium |
| [3] | Player nostalgia and Backpacker 3 complaint | [GOG.com Dreamlist](https://www.gog.com/dreamlist/game/backpacker-2-1997) | 2025–2026 comments | 2026-11-16 | low |
| [4] | Mobile Backpacker loop, stamps, hotel, monetisation, reviews | [Apple App Store (SE)](https://apps.apple.com/se/app/backpacker/id711435089?l=en-GB) | unknown | 2026-11-16 | high (description) / low-medium (reviews) |
| [5] | 2 million registered players | [Börsvärlden/Finwire](https://borsvarlden.com/artiklar/weareqiiwis-speltitel-backpacker-har-passerat-2-miljoner-spelare) | 2018-09-04 | 2026-11-16 | high |
| [6] | Travel gives choices context; routes unlocked by exploring | [Game Developer (IGF interview)](https://gamedeveloper.com/design/road-to-the-igf-inkle-s-i-80-days-i-) | 2015-02-13 | 2026-11-16 | high |
| [7] | Locked routes fixed fun; few tracked values; saves; inclusive writing | [Game Developer (postmortem)](https://gamedeveloper.com/business/postmortem-inkle-s-i-80-days-i-) | 2015-10-14 | 2026-11-16 | high |
| [8] | 80 Days premise and city count | [inkle blog](https://www.inklestudios.com/2014/04/15/so-what-is-eighty-days.html) | 2014-04 | 2026-11-16 | high |
| [9] | Money runs out easily; no end at day 80; writing style and representation | [Emily Short](https://emshort.blog/2014/08/05/80-days-meg-jayanth-inkle/) | 2014-08-05 | 2026-11-16 | high |
| [10] | Banks, markets, sleeping rough; 4.5/5 review | [Pocket Gamer](https://www.pocketgamer.com/80-days/review/) | 2014-07-31 | 2026-11-16 | high |
| [11] | Steam copy, Steam Cloud, reviews, ~3-hour playthrough | [Steam](https://store.steampowered.com/app/381780/) | 2015-09-28 | 2026-11-16 | high / medium (playtime) |
| [12] | Routes unlocked by exploring, characters, items | [Bit-tech](https://bit-tech.net/reviews/gaming/80-days-review/1/) | unknown | 2026-11-16 | medium |
| [13] | New routes found by exploring cities | [The Sixth Axis](https://www.thesixthaxis.com/2015/05/20/80-days-and-the-power-of-exploring-by-word-of-mouth/) | 2015-05-20 | 2026-11-16 | medium |
| [14] | Limits in cultural understanding and respect | [Slant Magazine](https://www.slantmagazine.com/games/80-days/) | unknown | 2026-11-16 | low (snippet) |
| [15] | Three minutes a day; sharing and the emoji grid | [Game Developer (Wardle)](https://www.gamedeveloper.com/marketing/josh-wardle-reflects-on-the-the-unconventional-road-to-wordle-s-success) | 2022-03-25 | 2026-11-16 | high |
| [16] | Streaks stored only in the browser; streak loss on NYT move | [Kotaku](https://kotaku.com/wordle-new-york-times-streaks-broken-nyt-migration-dail-1848525236) | 2022-02-11 | 2026-11-16 | high |
| [17] | Safari deletes script-writable storage after 7 days; home-screen exemption | [WebKit blog](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/) | 2020-03-24 | 2026-11-16 | high |
| [18] | Private browsing deletes storage; best-effort storage; 7-day rule | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) | living doc | 2026-11-16 | high |
| [19] | A hundred decisions in five minutes; dynasty avoids feeling punished | [Inverse](https://www.inverse.com/article/23117-reigns-francois-alliot-nerial-developer-interview) | 2016-11-02 | 2026-11-16 | high |
| [20] | Player sets the pace | [Game Developer (Reigns: Her Majesty)](https://gamedeveloper.com/design/why-being-trapped-in-a-loop-makes-i-reigns-her-majesty-i-so-satisfying) | 2018-02-06 | 2026-11-16 | high |
| [21] | 7-day deletion observed inconsistently | [WebKit Bugzilla 245517](https://bugs.webkit.org/show_bug.cgi?id=245517) | unknown | 2026-11-16 | medium |
| [22] | Players run out of money on direct routes | [Steam Community](https://steamcommunity.com/app/381780/discussions/0/1621724904371155519) | unknown | 2026-11-16 | low (snippet) |

## Staleness map

Computed with `recon_kit.py staleness` (windows: technical 12 months, release-fact 3 months, player-sentiment 12 months):

| Claim | Class | Published | Re-check by | Stale now |
|---|---|---|---|---|
| Safari deletes storage after 7 days [17] | technical | 2020-03 | 2021-03-01 | yes |
| Mobile Backpacker offer [4] | release-fact | 2026-11 (accessed) | 2027-02-01 | no |
| Mobile Backpacker reviews [4] | player-sentiment | 2025-09 | 2026-09-01 | yes |

The earliest re-check date, 2021-03-01, is already past. The Safari rule rests on a 2020 primary source. MDN (living document) and 2025 secondary sources still describe it [18][21], but no fresh Apple statement was found. Re-check WebKit release notes before FR-20 is implemented. The historical claims about Backpacker 2, 80 Days and Wordle describe finished events and do not go stale.
