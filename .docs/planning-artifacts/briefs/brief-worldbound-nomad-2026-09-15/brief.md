---
title: "WORLDBOUND: NOMAD — Product Brief"
status: ready
created: 2026-09-15
updated: 2026-09-15
---

# Product Brief: WORLDBOUND: NOMAD

## Executive Summary

WORLDBOUND: NOMAD is a web-based travel and decision simulator: the player starts with limited money and a limited amount of time, travels between international destinations, works to earn money at the cost of time, and continuously chooses how to spend both. Inspired by classic travel games like Backpacker 2, it is being built as an independent product with its own code, art, writing, and mechanics — not a recreation.

The project has two genuine goals that run in parallel. The **product goal** — a working, engaging simulator built around one core tension: time, money, and opportunity are all scarce, and every choice trades one against another — is what this brief is primarily about: the game itself. The **research goal** — examining how well a team of AI agents, filling architect, coder, tester, reviewer, content, and documentation roles, can carry a non-trivial software project through a full development cycle with a human retaining final say — is a real, parallel investigation the team wants to carry out well, not a box to check.

This is a two-person group project (see Project Context below), with a target completion date around mid-December 2026.

## Project Context

- **Course:** IBE160 Programmering med KI, Høgskolen i Molde, autumn 2026 (15 studiepoeng)
- **Team:** 2 people — Thomas Rothe, Christian Storum
- **Timeline:** ~mid-December 2026

## The Concept

The player is a traveler moving through a world of destinations with a finite budget and a finite amount of time. Money determines which choices are available; time determines how far the player can get; decisions in one city carry forward and shape what's possible in the next. The game surfaces this tension through recurring choices: where to go next, how to get there, whether to work before moving on, which activities are worth the cost, how to handle something unexpected.

**Core loop:** Plan → Travel → Experience/Learn → Work → Earn → Plan again — continuously balancing time, money, risk, and experience. This is the target design for the full loop; the first playable slice is intentionally narrower — see MVP-of-the-MVP under Scope.

## Two Goals, One Project

**Product goal:** ship a working, engaging travel-and-decision simulator.

**Research goal:** examine how AI agents can be used across the entire development cycle of a non-trivial application — and, just as importantly, what happens when AI-generated code has to integrate with other code, contains bugs, and has to be tested, reviewed, corrected, and maintained. The intended process is:

**Requirements → System design → Code → Testing → Code review → Debugging → Improvement → Git**

with Git/GitHub providing traceability across `prompt → AI-generated solution → testing → bugs found → evaluation → improvement → new version`. The human team stays in control of requirements, system choices, code review, testing, approval, prioritization, and quality assurance throughout — **AI proposes, humans decide.**

This dual mandate is why scope discipline matters as much as feature count: a small, well-tested, well-documented core proves the research goal better than a large, half-finished one.

## Who This Serves

**The player.** Anyone interested in travel, exploration, strategy, or decision-based games — the product is deliberately not built around a narrow demographic. A budget-conscious young traveler is a useful starting reference point, but the persona stays intentionally broad; UX work can sharpen specific personas later without narrowing who the game is for.

The experience should feel personal: the player is managing their own time, money, travel choices, and the consequences that follow from them — this is their journey, not a system playing out around them. The product should feel like a real game first; the AI-development investigation runs alongside it, not at the expense of that experience.

## What Makes This Different

- Genre-level: a modern, web-native take on the travel/decision-sim genre, built around scarcity-driven choice rather than combat or collection.
- Explicitly inspired by, not copied from, classic titles like Backpacker 2 — independent code, graphics, text, and mechanics.
- The AI-agent development process is part of the product's story, not a hidden implementation detail — how it was built matters as much as what was built.

## Scope

### MVP — the playable core

The non-negotiable slice, in priority order:

1. **Map & destinations** — several international destinations, visible and reachable
2. **Travel** — transport choice, cost, time cost, position updates
3. **Basic economy** — starting budget, income, expenses, running financial status

A player must be able to: start with limited resources, choose a destination, travel there, spend time and money, and decide what to do next. This loop must work end-to-end before anything else is added.

**Add once that core loop is stable:**
- Work (destination-specific jobs — earns money, costs time)
- Destination tasks/quiz (country/culture content)
- A save system — a minimal, working version is sufficient at this stage; it does not need to be robust or feature-complete yet

### Explicitly out of scope (for now)

- Real-money payments
- Multiplayer
- Native mobile application
- Enterprise-grade account functionality
- Any feature that adds significant infrastructure or security complexity without directly serving the core game or the research goal

The product stays a web application throughout.

### Possible post-MVP extensions

Random/unforeseen events, skills and progression, trade and items, dynamic pricing, deeper economy, alternate routes, more transport modes, richer tasks, more destinations, a more dynamic world, and an in-game AI travel assistant. None of these are MVP requirements; they are prioritized only after the core is stable, in proportion to how much they serve either the product or the research goal.

**Principle:** build little → test → quality-assure → expand. A small, coherent, playable core beats six half-finished systems.

### Difficulty levels — intended direction, not MVP

Two difficulty levels are part of the intended product direction:

- **Explorer** — an easier mode with more forgiving time and economic conditions
- **Nomad** — a more challenging mode with tighter resources and greater consequences

This establishes the direction only; exact mechanics (how forgiving, how tight, how the player chooses) are a PRD-level decision, not a brief-level one. The MVP ships as a single default experience — difficulty levels do not expand the MVP or delay the core loop.

## Success Criteria

**Product:**
- The MVP-of-the-MVP loop — plan, choose a destination, travel, spend time and money, decide what's next — is playable start to finish without breaking, using only map/destinations, travel, and basic economy
- A player can complete a full "trip" on that narrower slice alone — start on a budget, travel between destinations, watch time and money change, reach a meaningful end state — with no dependency on work or destination tasks/quiz
- Once work and destination tasks/quiz are added, the player can extend that same trip by working and completing tasks, moving the experience toward the full Plan → Travel → Experience/Learn → Work → Earn → Plan again loop
- The experience reads as a real, coherent game, not a tech demo, at each stage — the MVP-of-the-MVP included

**Process / research:**
- Git history traces the path from requirement to AI-generated output to review to fix to merge for major features
- The team can clearly explain how AI was used, what it produced, what went wrong, how output was evaluated, and what humans changed or approved
- Both team members can speak to testing, QA, and evaluation of AI-generated work — not only their own feature area

## Risks & Open Questions

- **Scope creep** is the risk named explicitly in the source material; the MVP-of-the-MVP priority order above is the mitigation.
- **Team split** by feature area is deliberately undecided — intended to firm up once the PRD and epics make the major features concrete.
- **[OPEN]** How much content (destinations, quiz questions, cultural facts) is "enough" for the MVP to feel complete — not yet sized.
- **[OPEN]** Whether to reserve any architectural room now for the in-game AI travel assistant, or treat it as fully deferred — currently the latter, by default.
- **[OPEN]** Exact mechanics for the two difficulty levels (Explorer/Nomad) — direction is set, specifics are deferred to the PRD.

## What's Next

This brief is the input to the PRD (`bmad-prd`), and — once the concept is locked — to UX (`bmad-ux`) and Architecture (`bmad-architecture`). Technology direction and system design are intentionally not decided here; see `addendum.md` for the candidate stack and process material carried forward for that later work.
