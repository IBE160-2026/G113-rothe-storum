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
