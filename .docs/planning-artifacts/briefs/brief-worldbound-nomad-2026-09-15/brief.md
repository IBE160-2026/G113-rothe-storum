---
title: "WORLDBOUND: NOMAD — Product Brief"
status: ready
created: 2026-09-15
updated: 2026-10-13
---

# Product Brief: WORLDBOUND: NOMAD

## Executive Summary

WORLDBOUND: NOMAD is a responsive, browser-based travel and decision simulator, playable on PC, tablet, and mobile without installing a native app. The player leaves Bergen with €1,500 and has 30 days to collect at least five stamps and still make it home. Every choice trades time against money: fast travel is expensive, cheap travel eats days, and expensive cities drain the budget. Inspired by classic travel games like Backpacker 2, it is being built as an independent product with its own code, art, writing, and mechanics — not a recreation.

The project has two parallel goals: a working, engaging game, which is this brief's focus, and an investigation of how AI agents can carry a non-trivial project through a full development cycle under human control — see Two Goals, One Project.

## Project Context

- **Course:** IBE160 Programmering med KI, Høgskolen i Molde, autumn 2026 (15 studiepoeng)
- **Team:** 2 people — Thomas Rothe, Christian Storum
- **Timeline:** ~mid-December 2026

## The Concept

The player is a traveler with a finite budget and a fixed number of days. Money determines which choices are available; time determines how far the player can get. Unlike money, time never comes back. Decisions in one city carry forward and shape what's possible in the next. The game surfaces this tension through recurring choices: where to go next, how to get there, which sights are worth the money, whether to work before moving on, and when to head home.

**Core loop:** Plan → Travel → Experience → Decide → Work → Earn → Plan again — continuously balancing time, money, risk, and experience. This is the target design for the full loop; the first playable version is intentionally narrower — see MVP core under Scope.

## Why This Game

Travel games like Backpacker turned geography, budgeting, and work into real decisions, and the series later got a mobile version. None of the titles we found asks the player to plan a whole journey against a hard deadline and make it home. Today's geography games on app stores are mostly quick trivia or guessing games. NOMAD offers a short, replayable 30-day journey in the browser — no install, no account — where every choice costs time or money. (Based on a quick web search in October 2026, not a market study.)

## Two Goals, One Project

**Product goal:** ship a working, engaging travel-and-decision simulator.

**Research goal:** examine how AI agents can be used across the entire development cycle of a non-trivial application — and, just as importantly, what happens when AI-generated code has to integrate with other code, contains bugs, and has to be tested, reviewed, corrected, and maintained. The intended process is:

**Requirements → System design → Code → Testing → Code review → Debugging → Improvement → Git**

AI agents fill the architect, coder, tester, reviewer, content, and documentation roles. Git/GitHub traces each change from prompt to reviewed, corrected version, and prompts and AI sessions for major features are kept in the repository. The human team stays in control of requirements, system choices, code review, testing, approval, prioritization, and quality assurance throughout — **AI proposes, humans decide.**

This dual mandate is why scope discipline matters as much as feature count: a small, well-tested, well-documented core proves the research goal better than a large, half-finished one.

## Who This Serves

**Primary player for v1:** a young, budget-conscious traveler playing in a mobile browser. Screens, controls, and session length are designed for this player first; PC and tablet must work, but mobile is the reference device. The game is in English.

The game is not closed to anyone else — players interested in travel, exploration, strategy, or decision-based games are welcome — but design trade-offs in v1 are settled in favor of the primary player.

The experience should feel personal: the player is managing their own time, money, travel choices, and the consequences that follow from them.

## What Makes This Different

- Genre-level: a modern, web-native take on the travel/decision-sim genre, built around scarcity-driven choice rather than combat or collection.
- A fixed-length journey instead of a race: Backpacker 2 asked how fast you could get around the world; NOMAD locks the clock at 30 days and asks what you can make of them — and whether you get home.
- Explicitly inspired by, not copied from, classic titles like Backpacker 2 — independent code, graphics, text, and mechanics.
- The AI-agent development process is part of the product's story, not a hidden implementation detail — how it was built matters as much as what was built.

## Game Rules (MVP)

Starting values are set; all other numbers are examples to be balanced in the PRD. All prices and rewards are in euros. In the MVP, the same choices always give the same result — no randomness — so every rule can be covered by automated tests.

### MVP core rules

- **Start (Explorer mode):** Bergen, Day 1 / 30, €1,500.
- **Goal:** collect at least 5 stamps and be back in Bergen before day 30 ends. A stamp is earned on the first city day at a destination; revisits and Bergen give no stamp.
- **Travel:** each route offers one or more transport modes with a price/time trade-off — plane (fast, expensive), train (medium), bus (cheap, slow). Not every pair of destinations is connected, not every route has every mode, and intercontinental routes are plane-only. *Examples: Bergen → Tokyo by plane, €600, 1 day. Paris → Rome: plane €150, 1 day · train €90, 1 day · bus €50, 2 days.*
- **City day:** staying at a destination takes 1 day and includes accommodation, priced at a base accommodation price × the destination's cost factor. *Example: Tokyo and London are expensive; Istanbul is cheap.* During the day the player may visit 0–2 sights.
- **Sights:** every destination has 2 sights with a ticket price of €8–20 each. Sights are optional; each visited sight adds a photo and a short fact to the player's photo album.
- **Money:** money can never go below €0. A player who cannot pay for a city day must travel on or call home.
- **Call home:** available when the player cannot afford any transport out of the current destination — running out of money is a crisis, not game over. The player gets a ticket back to Bergen; it costs 7 days of waiting (the waiting days cost no money) and always removes one stamp. The summary marks the journey "Called home". A player with 6 or more stamps can still reach the goal this way, but calling home is always worse than paying for the ticket.
- **End:** the game ends when the player is back in Bergen or day 30 ends, and shows a summary: stamps collected, photo album, days used, money left, and whether the goal was reached. Not being home by the end of day 30 — including when call home's 7 days run past it — means the journey failed.

### MVP extension rules

- **Accommodation:** two tiers in every destination — budget and comfort. Comfort costs more but gives a 5-question job quiz; budget gives a 3-question quiz. Budget is also a way to stretch money before calling home.
- **Work:** a job is a trivia quiz. Pay depends on how many questions the player answers correctly; a work shift costs days. Each destination has 15 questions in a fixed, predefined sequence, so the same play gives the same questions; each shift takes the next questions, and when a destination's questions are used up, it offers no more work. 2 of each destination's 15 questions are about its sights — a player who visited them has already seen the answer. *Example: one shift in Sydney costs 1 day and pays €24 per correct answer — up to €120 (comfort) or €72 (budget).*
- **Night departures:** selected routes have a night departure. Leaving on one ends the city day without paying accommodation.
- **Nomad mode:** the same goal under tighter conditions than Explorer (e.g. €1,000 or 25 days — set in the PRD).

## Scope

The MVP is MVP core + MVP extension. The core is built and stabilized first; the extension is added on top, one item at a time.

### MVP core — the first playable version

The non-negotiable slice, in priority order:

1. **Map & destinations** — Bergen plus 8 destinations: Copenhagen, Paris, London, Rome, Istanbul, New York, Tokyo, Sydney. Europe is the hub, with plane, train, and bus; New York, Tokyo, and Sydney are far goals reached by plane. The route network is set in the PRD; not every pair is connected.
2. **Travel** — three transport modes (plane, train, bus), price, time cost, position updates
3. **Economy & time** — starting budget, day counter, destination cost factors, one accommodation price per destination, call home, end state and journey summary — in a single mode, Explorer
4. **Sights & photo album** — 2 optional sights per destination, each adding a photo and a fact to the photo album

A player must be able to start in Bergen, travel, spend time and money, and reach an end state — win or lose — using the MVP core alone. This loop must work end-to-end before anything else is added.

### MVP extension — added once the core is stable

Added in this order; each item is finished and tested before the next starts:

1. Work: jobs played as a trivia quiz, paid per correct answer (earns money, costs days); 15 questions per destination
2. A save system — a minimal, working version is sufficient
3. Nomad mode

If time allows, in this order:

4. Two accommodation tiers — budget (3-question job quiz) and comfort (5-question job quiz)
5. Night departures on selected routes
6. Two more destinations: Madrid and Cape Town (10 in total, 150 trivia questions)

### Technology principle

The MVP uses the simplest stack that delivers the MVP core: it runs locally in the browser from the README, with no accounts, API keys, paid services, or required backend. Supabase, Python, and Docker are deferred until a concrete need appears. The stack is chosen and justified in Architecture.

### Content, assets, and external services

Game content — destinations, routes, prices, cost factors, sights, and trivia questions — lives as data files in the repository, separate from the game code, so it can be reviewed, fact-checked, and balanced without touching logic. Graphics and sight photos live in their own assets folder; photos are made by the team, AI-generated, or freely licensed, and each photo's source is recorded. Test data (fixed game states and small test routes) lives with the automated tests, not in the game content files. The MVP needs no external services; if one is added later, its configuration goes through `.env.example` and no keys are committed. The exact folder structure is set in Architecture.

### Explicitly out of scope (for now)

- Real-money payments
- Multiplayer
- Native mobile application
- Enterprise-grade account functionality
- Any feature that adds significant infrastructure or security complexity without directly serving the core game or the research goal

The product stays a single responsive, browser-based web application throughout — it must be playable on PC, tablet, and mobile without the player installing a native app.

### Possible post-MVP extensions

Random/unforeseen events, skills and progression (3–5 skills with simple thresholds that unlock better jobs — no large skill tree), trade and souvenirs, dynamic pricing, more transport consequences (comfort, delays, environmental impact), more destinations, and an in-game AI travel assistant. None of these are MVP requirements. After the MVP is stable, pick **one** extension first and finish it before starting another.

**Principle:** build little → test → quality-assure → expand. A small, coherent, playable core beats six half-finished systems.

## Success Criteria

**Product:**
- A new game starts in Bergen on Day 1 / 30 with €1,500.
- Every journey deducts the chosen route's price and days; in the MVP core, every city day deducts the base accommodation price × the destination's cost factor plus the tickets for any sights visited.
- Each visited sight enters the photo album once; sights are never required to reach the goal.
- Money never goes below €0, and running out of money never ends the game by itself; when the player cannot afford any transport, call home is available, costs 7 days, and removes one stamp.
- Each destination gives at most one stamp; Bergen gives none.
- The game always ends in exactly one way — back in Bergen or day 30 ended — and shows the journey summary.
- The goal (5 stamps and home within 30 days) is reachable with the MVP core alone, without work, but not without careful choices.
- The core rules are covered by automated tests.
- The game is fully playable in a mobile browser and also works on PC and tablet.
- A first-time player can finish a game without explanation from the team (checked by a simple playtest).

**Process / research:**
- Git history traces the path from requirement to AI-generated output to review to fix to merge for major features
- The team can clearly explain how AI was used, what it produced, what went wrong, how output was evaluated, and what humans changed or approved
- Prompts and AI sessions for major features are stored in the repository
- Both team members can speak to testing, QA, and evaluation of AI-generated work — not only their own feature area

## Risks & Open Questions

- **Scope creep** is the main risk; the MVP core → MVP extension order above is the mitigation.
- **Balancing:** the goal must be reachable without work but still demand real trade-offs. Numbers are tuned in the PRD and verified by tests and playtests.
- **AI-generated content:** trivia questions and destination facts must be fact-checked and reviewed for stereotypes before they ship.
- **Team split** by feature area is deliberately undecided — intended to firm up once the PRD and epics make the major features concrete.
- **[OPEN]** Whether to reserve any architectural room now for the in-game AI travel assistant, or treat it as fully deferred — currently the latter, by default. If it is added, the game must still run without an API key: the assistant is optional, the key goes in `.env` (documented in `.env.example`), and tests use a mock instead of a live model.

## What's Next

This brief is the input to the PRD (`bmad-prd`), and — once the concept is locked — to UX (`bmad-ux`) and Architecture (`bmad-architecture`). UX starts with sketches of the two key mobile screens: the map (choose destination and route) and the city day (accommodation, sights, travel on). Exact numbers and balancing are PRD work. Technology is chosen in Architecture under the principle above; see `addendum.md` for the candidate stack and process material carried forward for that later work.
