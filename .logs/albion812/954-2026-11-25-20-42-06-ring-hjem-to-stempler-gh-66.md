# Ring hjem fjerner to stempler (#66)

## 2026-11-25 kl. 20:42 — Albion812

### Oppgave
Thomas begynner på Story 1.7, så brukeren ville gjøre noe parallelt som ikke overlapper. Brukeren valgte å avgjøre #66: Ring hjem som gratis snarvei til målet (Tokyo-seier uten jobb, mot addendum §6 og SM-3). Beslutningen skulle føres gjennom `bmad-correct-course`.

### Plan
- #66 og analysen i issue-kommentaren ble lest. Den var gjort med ekte `apply`: 1 sett vinner bare via Ring hjem, og 0 sett med stempelstraff 2, €100 eller 21 dager.
- Fem alternativer ble lagt fram (A godta, B straff 2, C €100, D 21 dager, E Ring hjem teller ikke som mål). AI anbefalte B, og **brukeren valgte B alene**. Thomas var ikke med. Han blir bedt om å bekrefte eller utfordre valget i PR-reviewen.
- Konsekvensanalysen fant at «one stamp» står i PRD (FR-12, ordliste, tabell, UJ-2, §7), addendum §1, EXPERIENCE.md, epics (Story 3.1 og 3.2) og epic-3-context. Den fant også at UJ-2-testen (`tests/rules/end.test.ts:349`, ekte innhold) vil feile, og at balansesøket på PR #69 må prøve Ring hjem på alle tilstander før beskjæring. Sammenligningen «mest penger vinner» holder ikke for Ring hjem, som bare tilbys når pengene er lave.
- Brukeren valgte (a): én PR etter at #69 er merget, slik at balansetesten som beviser rettingen kommer i samme PR. Review i batch-modus.

### Resultat
- `7bf1338` på `main`: `.docs/planning-artifacts/sprint-change-proposal-2026-11-25.md`, godkjent av brukeren («ja»). Den inneholder alle gamle → nye endringer, Decision N for PRD §9.8 (bare «Decided by Christian Storum»), forkastede alternativer, risiko og suksesskriterier.
- Ingen kode, tester eller planleggingsdokumenter er endret ennå. Endringsforslaget beskriver dem.
- Ikke pushet.

### Åpne punkter
- Gjennomfør endringsforslaget med `bmad-build` på `gh-66-call-home-penalty` når #69 er merget. Dette dekkes av #66, som lukkes med `Closes #66` i den PR-en. Ingen ny issue.

## 2026-11-25 kl. 20:54 — Albion812

### Oppgave
Thomas godkjente PR #70 og la igjen to kommentarer. Han utfordret alternativ B for #66 og foreslo at Ring hjem aldri skal telle som «Goal reached». Brukeren sa seg enig med Thomas og valgte E.

### Plan
- Reviewene og kommentarene på #70 ble lest. Godkjenningen gjelder `ff1e92a`. `472a485` og `70791ed` ble pushet etterpå og er ikke dekket av den.
- **AI-feil rettet:** AI sa tidligere «Thomas har ikke reviewet #70 ennå» uten å sjekke. Reviewen kom kl. 20:31, før pushen kl. 20:46. Dette er sagt til brukeren, og det anbefales at Thomas ser på `70791ed` før merge.
- Fakta for svaret til Thomas: med B gir Ring hjem målet bare med 7 eller flere stempler borte. Dagens innhold gir 0 slike, men jobb (Epic 5) kan åpne smutthullet igjen. E lukker det som regel.
- Revidert endringsforslag for E lagt fram: `evaluateEnd()` krever `!calledHome`, `stampPenalty` blir værende 1, og FR-11-«literal»-testen snus. Det trengs en ny kopi-variant for hjemringt med 5 eller flere stempler: «{stamps}, safely home — next time, travel home yourself.» Godkjent av brukeren («ja, copy is fine»).

### Resultat
- `24832a1` på `main`: `sprint-change-proposal-2026-11-25.md` er skrevet om for E. Historikk-seksjonen viser B (`7bf1338`), innsigelsen fra Thomas og byttet til E. Decision N: foreslått av Thomas Rothe, godtatt av Christian Storum.
- Kode, tester og planleggingsdokumenter er ikke endret ennå.
- Ikke pushet.

### Åpne punkter
- Gjennomfør E på `gh-66-call-home-goal` med `bmad-build` (`Closes #66`). Dekket av #66.
- Svar til Thomas på #70: E er godtatt, og spørsmålene hans om `travelPreview()`, midlertidig slutt-skjerm, eierskap til 3.2 og 3.3 og #64 må besvares av brukeren. Be ham se på `70791ed` før merge.

## 2026-11-25 kl. 20:57 — Albion812

### Oppgave
Brukeren ba om svar til Thomas på PR #70: E for #66, review av commitene etter godkjenningen, og svar på spørsmålene han trenger besvart før Story 1.7.

### Plan
- Begge kommentarene ble skrevet av AI og lagt fram som utkast. Brukeren godkjente dem uendret («post it as is»).
- Brukerens svar: 3.2 og 3.3 tar den som har tid. Ja til AI-forslagene om `travelPreview()`, midlertidig slutt-skjerm og #64.

### Resultat
- [Kommentar 1 på #70](https://github.com/IBE160-2026/G113-rothe-storum/pull/70#issuecomment-7172968862): E er godtatt (Decision N, `24832a1`). Thomas blir bedt om å se på `70791ed` før merge.
- [Kommentar 2 på #70](https://github.com/IBE160-2026/G113-rothe-storum/pull/70#issuecomment-7172995488):
  - `travelPreview()` med signaturen til Thomas, i en liten regel-PR rett etter #66.
  - Midlertidig slutt-skjerm er greit.
  - 3.2 og 3.3 tar den som har tid.
  - #64: billigste tilgjengelige pris. Thomas sender teksten for tilfellet der dagene ikke rekker.

### Åpne punkter
- Gjennomfør E på `gh-66-call-home-goal` (#66). Lag deretter `travelPreview()` i en egen regel-PR, før 1.7 merges. Opprett issue for `travelPreview()` hvis brukeren ønsker det.
- Bekreft teksten fra Thomas for #64 når den kommer.

## 2026-11-25 kl. 21:10 — Albion812

### Oppgave
Brukeren ba om push, om å starte #66 (alternativ E) og om en issue for `travelPreview()`.

### Plan
- `main` ble pushet. Issue #71 (`travelPreview()`) ble opprettet etter godkjenning, og det fantes ingen duplikat.
- `bmad-build` (oneshot) på `gh-66-call-home-goal`, med spec `.docs/implementation-artifacts/spec-gh-66-call-home-goal.md` og endringsforslaget som referanse. Brukeren godkjente subagenter.
- Review med én Blind Hunter-subagent: 12 funn. Hver påstand ble sjekket mot koden. 8 ble patchet, 2 ble lagt fram for brukeren og 2 ble forkastet. Se Review Triage Log i spec-en.

### Resultat
- `b03fa4a`: `evaluateEnd()` krever nå `!calledHome` for `goalReached`, og `stampPenalty` er fortsatt 1.
- Tester:
  - FR-11-testen fra Ring hjem er snudd.
  - Grensetesten for dager forventer nå `goalNotReached`. Den var ikke med i forslaget og ble funnet ved første testkjøring.
  - Ny kontrolltest for `evaluateEnd`.
  - Ny test på ekte innhold av #66-reisen fra Sydney. Den feiler med den gamle regelen (mutasjonssjekk).
- FR-kartet: `EXPECTED_ROWS` FR-11 er endret fra 6 til 8.
- Dokumenter oppdatert: PRD, addendum, EXPERIENCE, epics, epic-3- og epic-4-context, og daterte merknader i spec-3-1, spec-4-1 og research.
- **Tekst endret i review** (brukeren valgte 1.A og 2.A):
  - Ring hjem-arket sier «Calling home ends your journey without the goal.».
  - Oppsummeringen for alle hjemringte reiser er «{stamps}, safely home.» uten «next time»-ledd. Den erstatter varianten som ble godkjent tidligere.
  - Endringsforslaget har fått en datert oppdateringsseksjon.
- Verifisert: `npm test` 398/398, `npm run lint` og `npm run build` uten feil.
- Ikke pushet, og ingen PR ennå.

### Åpne punkter
- Push `gh-66-call-home-goal` og åpne PR med `Closes #66`, med Thomas som reviewer. PR #70 ligger tett på i PRD (Decision M/N) og `fr-test-map.md`, så den som merges sist kan få en liten tekstkonflikt.
- #71: `travelPreview()` etter #66.
