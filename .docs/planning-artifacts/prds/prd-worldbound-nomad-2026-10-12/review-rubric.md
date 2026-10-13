# PRD Quality Review — WORLDBOUND: NOMAD

## Overall verdict
A focused, testable PRD for a small deterministic game: rules have concrete consequences, scope and build order are explicit, and the glossary is used consistently. The main risk is strategic: the core does not yet deliver the "time is as scarce as money" thesis the brief and team notes put at the centre, and two definitions (day counter display, reachable-home warning) would leave implementers guessing.

## Decision-readiness — adequate
Decisions are stated as decisions (city day, call home, build order) with their trade-offs. Open Question 1 is not really open — it records an accepted trade-off — while the trade-off itself (time does not bind in the core) contradicts the thesis in §1 and the brief.

### Findings
- **high** Time thesis not met in the core (§1, §11 Q1, addendum §6) — Vision and brief say "time never comes back"; balance shows winning core journeys use 14–16 of 30 days, so only money binds. *Fix:* either record an explicit decision ("time binds from the MVP extension; the core teaches money first") in §9, or adjust a core value (e.g. fewer days) and re-run the balance check.
- **medium** Open Question 1 is a decision, not a question (§11) — *Fix:* move it to §9 as a stated trade-off with a revisit trigger (first playtest).

## Substance over theater — strong
Three named journeys each drive rules (UJ-2 drives call home and failure; UJ-3 drives work). NFRs have thresholds (375 px, 44 px). No boilerplate.

## Strategic coherence — adequate
Features follow the thesis of scarcity-driven choice; counter-metrics are named. See the time-thesis finding above.

### Findings
- **medium** Vision overstates core recovery options (§1) — "a crisis the player can work, save, or call their way out of": in the core only call home exists. *Fix:* "In the core, call home is the way out; the extension adds work and budget accommodation."

## Done-ness clarity — adequate
Almost every FR has testable consequences. Two gaps would force implementers to guess.

### Findings
- **medium** Day counter display undefined (§3 Day counter, brief "Day 1 / 30") — glossary says days used starts at 0 and is shown as "Day X of N" but does not define X. *Fix:* "X = days used + 1, capped at N; a new journey shows Day 1 of 30."
- **medium** Travel can strand the player silently (FR-4, FR-6) — a player can travel to a destination from which home is no longer reachable in the days remaining; the journey then fails with no warning. *Fix:* add to FR-4: "If no route home fits the days remaining after this travel, the option shows a warning (it is not blocked)."

## Scope honesty — strong
Non-goals, build order, "if time allows" items, and the assumptions index are explicit.

### Findings
- **medium** Source-document items not explicitly deferred (§8/§9.3) — inventory, travel journal, player profile, progression from `worldbound-grunnlag.md`. *Fix:* add to §9.3: inventory → with trade (post-MVP); travel journal → covered by stamps and photo album; player profile → no accounts (§8); progression → skills (post-MVP).

## Downstream usability — strong
Glossary terms used verbatim; FR IDs stable and unique (FR-21 – FR-23 appended rather than renumbered); UJs named; scope references FRs by ID.

## Shape fit — strong
Consumer game feeding UX → architecture → stories: UJs with named protagonists are load-bearing and present.

### Findings
- **medium** UJ-3 depends on an "if time allows" feature (§2.4, §9.2) — Amira uses comfort accommodation, but tiers are optional. *Fix:* rewrite UJ-3 around the default 5-question shift without tiers.

## Mechanical notes
- NFR-2 rule range omits FR-17 and FR-18, which are rules too. *Fix:* "FR-1, FR-6 – FR-18, FR-21 – FR-23".
- "money floor" in §9.1 is not a glossary term. *Fix:* "money never below €0".
- §7 does not mention logo and visual identity across app, presentation, and documentation (source doc §12). *Fix:* one clause.
- FR-21/FR-22 appear before FR-10 in document order — intentional (stable IDs); no action.
- Assumptions Index roundtrip: complete.
