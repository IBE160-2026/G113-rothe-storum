# Fix #50: open the map only when startJourney is accepted

## 2026-11-24 kl. 19:15 — Albion812

### Oppgave
Mens PR #53, #57 og #58 venter på Thomas, valgte Christian å ta #50: `beginJourney` i `src/ui/App.tsx` gikk rett til kartet uten å se om `startJourney` ble godtatt.

### Plan
- `bmad-build`, som valgte one-shot-ruten: ingen intensjonshull spilleren merker i dag, ingenting som ikke kan angres, og en liten endring. Spec: [spec-gh-50-begin-journey-rejection.md](../../.docs/implementation-artifacts/spec-gh-50-begin-journey-rejection.md).
- Ny branch `fix-50-begin-journey-rejection` fra `origin/main`.
- Review med én kontekstfri reviewer.
- Christian godkjente commit, PR, logg og lukking av #34 ("ja, gjør alle").

### Resultat
- **Commit med `Closes #50`.** App bruker en kortvarig `starting`-skjerm som avgjøres i samme render: kartet hvis starten ble godtatt, ellers tilbake til Start. App kaller aldri `apply` selv.
- **Test:** `tests/ui/App.startRejected.test.tsx` ber om modusen "nomad", som kjerneinnholdet ikke har, så de ekte reglene avviser starten.
  - Tre tilfeller, og alle tre feiler mot den gamle koden.
  - Det første tilfellet sjekker også at navnet spilleren har skrevet beholdes.
- **Sjekker:** `npm test` (314 av 314), lint og build er bestått.
- **Review:** 8 funn. 2 er rettet, 5 er avvist, og 1 er utsatt i `deferred-work.md`: Story 3.3 bør teste en avvist start mens en tidligere reise ligger i store.
- **Bevisste valg til Epic 6:** ved en avvist start vises ingen melding og fokus håndteres ikke. Flagget for at introen er sett, beholdes.
- **#34 er lukket med kommentar:** #28, #31 og #33 ble flettet 2026-11-23 i riktig rekkefølge.
- **Avvik:** jeg brukte `/tmp` kort for en sikkerhetskopi av `App.tsx` mens jeg kjørte testene mot den gamle koden. Kopien er slettet.

### Åpne punkter
- **PR for #50** venter på Thomas.
