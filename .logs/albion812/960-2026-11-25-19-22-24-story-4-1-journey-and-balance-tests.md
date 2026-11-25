# Story 4.1 – reise- og balansetester

## 2026-11-25 kl. 19:22 — Albion812

### Oppgave
Brukeren kjørte `/bmad-build 4.1` for å lage Story 4.1 (Epic 4): UJ-1 og balansesjekken (SM-3) som automatiske tester, og et kart som viser at hver testbare konsekvens i SM-1-FR-ene har en navngitt test. Story 4.1 ble valgt fordi den bare bygger på regel-storiene som er merget, og ikke kolliderer med Thomas' UI-arbeid i PR #63.

### Plan
- Fulgte BMad Build-workflowen (step 1–5) på den nye branchen `story-4-1-tests` fra `main` (`4fa59d8`). Brukeren godkjente bruk av subagenter for hele kjøringen.
- En subagent kompilerte `.docs/implementation-artifacts/epic-4-context.md` fra planleggingsdokumentene. Jeg kontrollerte UJ-1-tallene selv: €423 og 16 dager stemmer med rutene og prisene.
- Før spec-en ble skrevet, laget jeg en Python-prototype av balansesøket over ekte innhold. Den ga nøyaktig addendum §6: 4 vinnende sett uten severdigheter, 1 med fullt album og ingen reise med 6 stempler.
- Spec: [spec-4-1-journey-and-balance-tests.md](../../.docs/implementation-artifacts/spec-4-1-journey-and-balance-tests.md). Brukerens beslutninger:
  - FR-kartet blir Markdown pluss en vakttest.
  - Regeldelen av FR-14 kartlegges nå. UI-delen merkes «pending Story 3.3».
  - Hele spec-en beholdes selv om den er på rundt 2000 tokens.
- Implementering ved en subagent som bare fikk spec-en. Deretter to reviewrunder, hver med tre uavhengige reviewere (Blind Hunter, Edge Case Hunter, Verification Gap). Alle funn er triagert i spec-ens Review Triage Log (#1–#38).

### Resultat
- **Commit `696edca`** på `story-4-1-tests` (lokal, ikke pushet):
  - `tests/rules/journeys.test.ts`: UJ-1 (Ingrid) som skriptet regeltest, med kontrollpunkter i København (€1 430, dag 3) og Paris (€1 270, dag 6).
  - `tests/balance/balance.test.ts`: SM-3. Et uttømmende søk som bare går gjennom `apply`, med tre tilleggssjekker:
    - Europa-settet må alltid bli funnet, så sjekkene ikke kan bestå uten at søket faktisk finner noe.
    - En Roma-overnatting til €200 skal få testen til å feile.
    - En basispris på €5 skal gi reiser med 6 stempler.
  - Dagens funn: Europa €980, tre sett med New York til €1 390–1 480, og fullt album bare i Europa (€1 143).
  - `.docs/test-report/fr-test-map.md`: FR → test-kart med 82 rader, pluss en Flagged-tabell for konsekvenser som venter på UI-storyer.
  - `tests/traceability.test.ts`: vakt som feiler med navn når en FR mangler rad, en testfil mangler, en tittel er endret, flyttet ut av rekkefølge eller satt til `.skip`/`.todo`, eller en rad er feilformatert.
  - Nye regeltester for FR-1, FR-12 og FR-21. `play()` er flyttet til `tests/rules/helpers.ts`.
  - `sprint-status.yaml`: Epic 4 står som `in-progress`, Story 4.1 som `review`.
- **Verifisering:**
  - `npm test`: 20 filer, 376/376 grønne, 1,5 s.
  - `npm run lint` og `npm run build`: ok.
  - Ingenting er endret i `src/` eller `content/`.
- **Review runde 1:**
  - Hovedfunnet var et intent-gap: balansesøket prøvde aldri Ring hjem. Med de ekte reglene kan man nå 6 stempler borte og så ringe hjem gratis til «Goal reached». Da vinner også et sett med Tokyo.
  - Brukeren besluttet: Ring hjem holdes utenfor (PRD-modellen), unntaket dokumenteres, og det lages et issue. Koden fra runde 1 ble beholdt og rettet, ikke tilbakestilt.
  - 11 patch-funn ble rettet.
- **Review runde 2:** 4 patch-funn ble rettet. 14 ble avvist, med begrunnelse i triage-loggen.
- **Forkastede AI-forslag:**
  - En «pinnet» test av Ring hjem-smutthullet (avvist av brukeren).
  - 21-dagersparameter i balansetesten (hører til Story 4.4).
  - Telling av konsekvenser per FR og at «pending»-markøren skal utløpe (for mye kompleksitet for liten gevinst).
- **Walkthrough og advanced elicitation** (Assumption Audit, Second-Order Thinking, Chaos Monkey). Jeg gjorde 8 mutasjoner, og alle ble tilbakestilt:
  - 6 av dem ble fanget av testene.
  - `totalDays` 21 ga ingen feil. Det viser at SM-3 holder ved 21 dager, og det er nyttig for 21-dagershåndtaket i Story 4.4.
  - Å slette én rad i FR-kartet ga først ingen feil. Det er nå rettet: antall rader per FR er låst i `EXPECTED_ROWS` i vakttesten, som snur triage #25 etter brukerens beslutning.
  - Brukeren godtok alle fem forslagene, og de er lagt inn i commit `8853ddd`:
    - mutasjonsbeviset og 21-dagersfunnet står i spec-ens Implementation Notes og i `epic-4-context.md`;
    - `.github/pull_request_template.md` har fått gruppas sjekkliste, med et eget punkt for FR-kartet;
    - issue #67 er opprettet.
  - `npm test` gir 378/378 grønne, og lint er ok.
- **Issue #66** er opprettet etter brukerens godkjenning: «Balanse: Ring hjem gir 6 stempler og Tokyo-seier uten jobb (SM-3)».

### Åpne punkter
- #66: teamet må avgjøre om Ring hjem kan være en gratis snarvei til målet (eventuelt via `bmad-correct-course`).
- Forslag til issue, venter på brukerens godkjenning: advarselen på bydag om at hjemmet ikke lenger kan nås (PRD Decision M, lukket #39) har ingen regel-query, så FR-8-konsekvensen kan ikke testes ennå. Står i Flagged-tabellen med Story 2.4 som eier.
- #67: Story 3.3 må erstatte de fire FR-14-radene merket «pending Story 3.3» med tester og flytte sine Flagged-rader inn i hovedtabellen.
