# Arkitekturrettelser

## 2026-11-19 kl. 09:33 — Albion812

### Oppgave
Starten av økten var verifisering og koordinering: legge til Thomas som reviewer, hente `main`, kjøre alle sjekker, og varsle Thomas om ventende reviews. Etter en statusgjennomgang av BMAD-stegene (UX, arkitektur, epics, sprintstatus) ba brukeren om å «løse problemene med arkitekturen først», før code review av Story 1.2.

### Plan
- Verifisere `main` etter at Story 1.1-scaffold ble flettet inn: `npm ci`, `npm test`, `npm run lint`, `npm run build`, `npm run test:e2e`.
- Gå gjennom `ARCHITECTURE-SPINE.md` og `.memlog.md` mot åpne issues og PR-historikk, og foreslå rettelser (vist brukeren før endring, godkjent med «ja, go ahead with A–D»).
- Gjøre rettelsene på ny branch `architecture-fixes` fra `main`, verifisere, committe, og (etter ny godkjenning) pushe og åpne PR med Thomas som reviewer.

### Resultat
**Koordinering og verifisering**
- ThomasRothe88 lagt til som reviewer på PR #21 og #27.
- `main` fast-forwardet 9 commits (Story 1.1-scaffold). På `main`: `npm ci` OK (229 pakker, 7 moderate audit-funn, `fsevents` install-script ikke godkjent), `npm test` 61/61 bestått, `npm run lint` rent, `npm run build` OK, `npm run test:e2e` 1/1 bestått.
- `ci-github-actions` inneholdt allerede `main` (merge var no-op). `gh pr checks 27`: bestått (20 s). PR #21 har ingen checks fordi workflowen ikke er på `main` ennå.
- Påminnelseskommentarer med @-omtale av Thomas på PR #27, #21 og #16 (godkjent av brukeren, alternativ B). #22–#26 er issues, ikke PR-er.
- Sprintstatus (`bmad-sprint-planning`, status): 1 story done, 1 i review (1.2), 18 backlog; anbefalt neste steg `bmad-code-review` på 1.2. `sprint-status.yaml` på `main` er utdatert, men riktig på `story-1-2-content`.

**Arkitekturgjennomgang – fem funn**
- A. Det åpne spørsmålet om stackvalg i `.memlog.md` var besvart i Thomas' review av PR #4 (godkjent 2026-11-15), men ikke dokumentert.
- B. AD-5 foreskrev `Math.floor(x + 0.5)` på et flyttallsprodukt; Sydney budget gir €59 i stedet for €60 (#26).
- C. Errors-konvensjonen antok at feilgrensen fanger `ContentError`, men en error boundary fanger bare render-feil; ingen story eide feilgrensen (#17, #24).
- D. `updated` i spine sto på 2026-11-13 til tross for senere endringer.
- E. `technology.md` (#10) – kun faglærer kan avklare; ikke endret.

**Rettelser A–D** (commit `2498eeb` på `architecture-fixes`, PR #28 med ThomasRothe88 som reviewer)
- `ARCHITECTURE-SPINE.md`: AD-5 bruker heltall i hundredeler og avrunding halv opp med heltallsdivisjon, faktorer maks to desimaler; Errors-raden sier at `loadContent()` kalles inne i komponenttreet under feilgrensen og at `ContentError` gir fallback-skjerm; teamets bekreftelse av stacken sitert under Stack; `updated: '2026-11-19'`.
- `.memlog.md`: tre nye oppføringer (resolved stack-spørsmål, AD-5-endring, Errors-endring).
- `epics.md`: ny AR-10 og nytt akseptansekriterium i Story 1.3.
- Verifisert: node-sjekk av ny prisformel over alle 8 destinasjoner (7 ulike kostnadsfaktorer fra `content/destinations.json` på `story-1-2-content`) × core/budget/comfort – alle priser lik eksakt verdi avrundet halv opp (Sydney budget €60, Sydney comfort €111). `lint_spine.py`: 0 funn. Ingen andre dokumenter beskriver den gamle avrundingsregelen. Ingen kode endret, så testene ble ikke kjørt på nytt for denne endringen.

### Åpne punkter
- #10 – Spør faglærer hva `technology.md` (Pytagoras) var ment som.
- #17 og #24 – Feilgrense og `loadContent()`-plassering implementeres i Story 1.3 (krav nå i spine og epics.md).
- #26 – `accommodationPrice()` med heltallsaritmetikk og tabelldrevet test implementeres i Story 2.1.
- Neste steg: `bmad-code-review` på Story 1.2 (PR #21); PR #28 og #27 venter på Thomas' review.
