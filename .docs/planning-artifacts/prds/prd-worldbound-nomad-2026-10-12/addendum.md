# Addendum: WORLDBOUND: NOMAD — PRD

Values and supporting depth for the PRD. Every number here is a proposal `[ASSUMPTION]`, to be confirmed by the balance test (PRD SM-3) and playtests. The PRD states the rules; this file states the values. When the game is built, these values move into the content data files (PRD NFR-7) and this table becomes their source of truth until then.

## 1. Core values (Explorer)

| Value | Proposal |
|---|---|
| Start money | €1,500 |
| Days | 30 |
| Goal | 5 stamps, home within the days |
| Base accommodation price | €50 per city day |
| Call home | 7 days, −1 stamp, €0 |

## 2. Destinations and cost factors

| Destination | Cost factor | City day (€50 × factor) | In |
|---|---|---|---|
| Copenhagen | 1.8 | €90 | Core |
| Paris | 1.6 | €80 | Core |
| London | 2.0 | €100 | Core |
| Rome | 1.4 | €70 | Core |
| Istanbul | 0.8 | €40 | Core |
| New York | 2.2 | €110 | Core |
| Tokyo | 1.8 | €90 | Core |
| Sydney | 1.7 | €85 | Core |
| Madrid | TBD | — | Extension |
| Cape Town | TBD | — | Extension |

## 3. Sights (MVP core)

| Destination | Sight 1 | Sight 2 | Both |
|---|---|---|---|
| Copenhagen | Tivoli Gardens €20 | Nyhavn canal tour €12 | €32 |
| Paris | Eiffel Tower €20 | Louvre €17 | €37 |
| London | Tower of London €20 | British Museum €8 | €28 |
| Rome | Colosseum €18 | Vatican Museums €20 | €38 |
| Istanbul | Topkapı Palace €18 | Galata Tower €10 | €28 |
| New York | Statue of Liberty €20 | Empire State Building €20 | €40 |
| Tokyo | Senso-ji €8 | Tokyo Skytree €15 | €23 |
| Sydney | Sydney Opera House €20 | Harbour Bridge €15 | €35 |

Ticket prices are game values, not real prices. Each sight needs a photo (source and license recorded) and a short fact that also answers one trivia question in the MVP extension.

## 4. Route network (MVP core)

Routes work in both directions with the same price and days. Pairs not listed have no route.

| Route | Plane | Train | Bus |
|---|---|---|---|
| Bergen – Copenhagen | €140 · 1 d | €110 · 1 d | €70 · 2 d |
| Bergen – London | €150 · 1 d | — | — |
| Bergen – Paris | €180 · 1 d | — | — |
| Bergen – Rome | €200 · 1 d | — | — |
| Bergen – Istanbul | €250 · 1 d | — | — |
| Bergen – New York | €350 · 1 d | — | — |
| Bergen – Tokyo | €600 · 1 d | — | — |
| Bergen – Sydney | €800 · 2 d | — | — |
| Copenhagen – Paris | €130 · 1 d | €120 · 1 d | €70 · 2 d |
| Copenhagen – London | €120 · 1 d | — | — |
| Copenhagen – Istanbul | €200 · 1 d | — | — |
| London – Paris | €110 · 1 d | €90 · 1 d | €50 · 2 d |
| London – Rome | €140 · 1 d | — | — |
| London – New York | €300 · 1 d | — | — |
| Paris – Rome | €150 · 1 d | €90 · 1 d | €50 · 2 d |
| Paris – New York | €320 · 1 d | — | — |
| Rome – Istanbul | €160 · 1 d | — | €80 · 3 d |
| Istanbul – Tokyo | €450 · 1 d | — | — |
| Istanbul – Sydney | €600 · 2 d | — | — |
| New York – Tokyo | €500 · 1 d | — | — |
| Tokyo – Sydney | €300 · 1 d | — | — |

21 routes, 30 route/transport-mode combinations.

## 5. Extension values

| Value | Proposal |
|---|---|
| Pay per correct answer | €24 |
| Budget tier | accommodation × 0.7, 3-question shift (max €72) |
| Comfort tier | accommodation × 1.3, 5-question shift (max €120) |
| Questions per destination | 15 (5-question shifts: 3 per destination; with tiers, budget: 5 shifts, comfort: 3 shifts) |
| Build order | Work → save → Nomad; if time allows: tiers → night departures → Madrid and Cape Town |
| Nomad mode | €1,000, 30 days |
| Night departures | Copenhagen–Paris night bus €90 · 1 d; Paris–Rome night train €110 · 1 d; London–Paris night bus €70 · 1 d; London–New York overnight flight €330 · 1 d; Rome–Istanbul night bus €100 · 2 d |
| Madrid, Cape Town | cost factors, routes, fact cards, and 15 questions each — set when the extension starts |

## 6. Balance check (2026-10-13)

**Model:** each visited destination gets exactly one city day (needed for its stamp); travel uses the cheapest combination of transport modes that fits within 30 days; no work. Every order of every destination set was checked, with and without visiting both sights everywhere.

**MVP core (Explorer, no work):**

| Player | Winning 5-stamp destination sets | Cost | Days |
|---|---|---|---|
| Skips all sights | 4 — the five European destinations (€980), or four European + New York (€1,430–1,480) | €980–1,480 | 14–16 |
| Visits every sight (full photo album) | 1 — the five European destinations | €1,143 | 16 |
| Any | 6 stamps or more: none | — | — |

**MVP extension preview (night departures, no work):**

| Player | Winning 5-stamp sets | Note |
|---|---|---|
| Skips all sights | 6 | 6 stamps become reachable (€1,360) |
| Full photo album | 3 | New York becomes possible with a full album |

**What this means:**
- The goal is reachable without work in several ways (SM-3), and the photo album creates a real choice: a full album in Europe, or New York with fewer sights.
- 6 stamps or more requires work in the core — this gives the MVP extension a clear purpose.
- Tokyo and Sydney are not part of any winning core journey; they need work (PRD Open Question 1).
- Winning core journeys use 14–16 of 30 days; money, not time, is the binding constraint (PRD §9.3, a deliberate decision).
- Night departures make the game easier; their prices and Nomad's values must be rechecked once work exists (PRD Open Question 2).

The check should become an automated balance test over the content data once the game is built, so that any price change is checked against SM-3.

## 7. Key UI strings (English)

| Glossary term | UI string |
|---|---|
| Day counter | Day X of 30 |
| Goal reached / not reached | Goal reached / Goal not reached |
| Call home | Call home / Called home |
| New journey / Continue | New journey / Continue journey |
| Accommodation tiers | Budget / Comfort |
| Transport modes | Plane / Train / Bus |
