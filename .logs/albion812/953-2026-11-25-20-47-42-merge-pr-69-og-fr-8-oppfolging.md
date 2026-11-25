# Merge av PR #69 og FR-8-oppfølging (#68)

## 2026-11-25 kl. 20:47 — Albion812

### Oppgave
Endringsforslaget for #66 ble pushet. Thomas godkjente PR #69 (Story 4.1), og brukeren ba om merge. Etterpå ba brukeren om oppfølgingen etter #69: sprint-status, FR-8-raden i FR-kartet (#68) og opprydding.

### Plan
- `main` pushet (`7bf1338`, `c51a3e8`). #69 var `APPROVED` og `CLEAN`, og ble merget med merge-commit som tidligere PR-er.
- Oppfølgingen ble lagt fram og godkjent som A, B og C:
  - A: `4-1` → `done` på `main`.
  - B: FR-8-oppfølgingen på #70-branchen. FR-8-testene finnes bare i #70, ikke på `main`, så det kunne ikke gjøres på `main`.
  - C: slett den lokale `story-4-1-tests`.

### Resultat
- PR #69 merget som `2b3d460`. Etter merge på `main`: `npm test` 396/396, lint og build uten feil.
- A: `ac3ce66` på `main`. `sprint_plan.py generate --set 4-1-…=done` ble kjørt uten `--fresh` (flettemodus). Diffen inneholdt bare `4-1` og `last_updated`, og `validate` ga `valid: true`. De to parser-advarslene gjelder overskriftene «Epic Breakdown» og «Epic List» i `epics.md` og er ufarlige.
- B, på `gh-68-city-day-home-warning`:
  - `472a485`: merge av `origin/main`, uten konflikter.
  - `70791ed`: ny regelrad for FR-8 i `.docs/test-report/fr-test-map.md` (`warns but does not block when home is out of reach after the day`). Flagged-raden dekker nå bare UI-delen (Story 2.4). `EXPECTED_ROWS` for FR-8 er endret fra 7 til 8 i `tests/traceability.test.ts`.
  - Verifisert: `npm test` 403/403, lint og build uten feil. Pushet, og CI på #70 er grønn.
  - PR #70-beskrivelsen sier nå `Closes #68` (GitHub kobler #68), og «Not in this PR»-avsnittet er erstattet med det som ble gjort.
- C: den lokale `story-4-1-tests` er slettet etter sjekk av at den var merget. Remote-branchen er beholdt.
- `ac3ce66` er ikke pushet ennå.

### Åpne punkter
- PR #70 venter på review fra Thomas. #68 lukkes automatisk ved merge.
- #66 gjennomføres etter endringsforslaget (`sprint-change-proposal-2026-11-25.md`) på `gh-66-call-home-penalty`. #69 er nå merget, så det kan startes.
