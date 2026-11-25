# Sprint-status: 1.6 og 4.1 til review

_Seksjonen ble først logget i `959-2026-11-25-19-59-30-fr-8-bydag-advarsel-gh-68.md` på branchen `gh-68-city-day-home-warning` (commit `ced346a`). Flyttet hit 2026-11-25, uendret, fordi arbeidet ble gjort på `main` og ikke gjelder FR-8._

## 2026-11-25 kl. 20:06 — Albion812

### Oppgave
Brukeren ba om å rette sprint-status (`bmad-sprint-planning`, «fix sprint status»).

### Plan
- `sprint_plan.py validate`: fila var gyldig, men utdatert mot GitHub.
- Foreslått tabell, godkjent av brukeren: `1-6` backlog → review (PR #63 åpen, godkjent), `4-1` backlog → review (PR #69 åpen), `epic-4` backlog → in-progress. Ingen `done` før PR-ene er merget.
- Brukeren valgte alternativ 1: commit rett på `main`.

### Resultat
- Feil underveis: skillens fix-oppskrift bruker `generate --fresh`. Det nullstilte alle statuser til `backlog` (f.eks. 1.1–1.5, 2.1, 2.2 og 3.1, som er `done`). Det ble oppdaget i diffen før commit. Fila ble gjenopprettet fra backup, og `generate` ble kjørt på nytt uten `--fresh` (flettemodus) med de tre `--set`. Diffen inneholdt da bare de tre godkjente endringene pluss `last_updated`, og `validate` ga `valid: true`.
- Commit `fee64ab` på `main` («docs: sprint status, 1.6 and 4.1 in review»). Ikke pushet ennå.

### Åpne punkter
- Når #69 er merget: sett `4-1` til `done`.
