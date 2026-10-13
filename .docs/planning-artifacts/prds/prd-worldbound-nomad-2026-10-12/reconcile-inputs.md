# Input reconciliation — WORLDBOUND: NOMAD PRD (2026-10-13)

Each user-supplied input checked against `prd.md` + `addendum.md`.

## 1. Product brief (`briefs/.../brief.md`, commit 900e337)
Fully reconciled in the cross-check of 2026-10-13 (rules, scope order, UX handoff, test data, optional AI assistant, process criteria, Europe hub). No remaining gaps.

## 2. Instructor feedback (`tilbakemelding-product-brief.md`)
- Concrete rules and measurable end state → FR-6 – FR-14, FR-21 – FR-22, SM-3. Covered.
- Content amount (destinations, transport modes) → FR-3, addendum §2–4. Covered.
- Consistent MVP terms, one primary player and device → §2.2, §9. Covered.
- Simple stack, runs for the examiner → NFR-3, SM-4. Covered.
- Content/assets/services location → NFR-7, NFR-3. Covered.
- Sketch map and travel screens on mobile → §7 hands to `bmad-ux`. Covered.
- Pick one extension that gives most game per hour → §9.2 order. Covered.

## 3. Team economy notes (Christian/Thomas, pasted in chat)
- Gap: **"Time should be as important as money — the resource you never get back"** (Thomas, Q1). The PRD's balance check shows time does not bind in the core (Open Question 1, framed as accepted). This principle is currently not met in the MVP core and the trade-off is not recorded as a decision.
- Covered: cost levels per city, price/time per transport, zero money is a crisis not game over, work central but not in first MVP, trade post-MVP, skills post-MVP (3–5), fixed 30-day journey with summary, Explorer/Nomad direction.

## 4. Source document (`worldbound-grunnlag.md`)
- Gap: original MVP list included **inventory, travel journal, progression, player profile** ("Spillerdata"). The PRD covers progression and inventory only implicitly via post-MVP "skills" and "trade and items"; travel journal and player profile are not mentioned. Should be explicitly deferred or mapped (stamps + photo album act as the travel journal).
- Gap (minor): **logo and visual identity** across app, presentation, and documentation (§12) is not mentioned in §7.
- Covered: map/travel/economy/work/quiz, build little → test → expand, AI agent roles and process (§6), AI assistant as optional extension, ethics (NFR-8, §7 anti-references).

## 5. Backpacker 2 and comparable-games research
- Covered: inspiration not copy (brief), sights feeding trivia (FR-16), far destinations need work (Open Question 2), Europe hub (§4.2).
