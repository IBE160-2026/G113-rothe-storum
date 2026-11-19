# Review-plan til Thomas

## 2026-11-19 kl. 10:59 — Albion812

### Oppgave
Sprint-statusen viste at seks PR-er venter på Thomas' review, og at sprinten slutter søndag 22. november. Brukeren fulgte anbefalingen om å prioritere fletting framfor nye stories, og ba om at meldingen til Thomas ble lagt inn som kommentar på PR #27. Deretter spurte brukeren hvordan den andre terminalen avsluttes, slik at alt er oppdatert for Thomas.

### Plan
- Lage et utkast til melding med flettekø og fokuspunkter, og vise det til brukeren før posting.
- Poste meldingen på #27 etter godkjenning.
- Sjekke at alle brancher er pushet før den andre terminalen avsluttes.

### Resultat
- Kommentaren på #27 er postet ([issuecomment-7005681932](https://github.com/IBE160-2026/G113-rothe-storum/pull/27#issuecomment-7005681932)). Én endring fra det godkjente utkastet: «Hei Thomas!» ble til «Hei @ThomasRothe88!», slik at han varsles.
  - Flettekø: #27 (CI) → #28 (arkitektur) → #21 (Story 1.2) → #31 (Story 1.3). #30 og #16 er uavhengige av rekkefølgen.
  - Fokuspunkter: typene i `src/rules/types.ts` og fallback-teksten.
  - Spørsmål til Thomas: rekker han Story 1.5 denne sprinten?
- Sjekket med `git fetch`: arbeidsmappa er ren, og alle lokale brancher er i sync med `origin`. Den andre terminalen (spec for Story 1.4, `07e8bcf` og `df4638b`) var ferdig og kunne avsluttes med `/exit` uten tap. Forslaget `bmad build …` i input-feltet ble ikke sendt.
- Loggnummer 986 finnes nå to ganger (`986-…-typescript-eslint-8-73.md` og `986-…-story-1-4-spec.md`), fordi to terminaler logget parallelt. Det gir ingen git-konflikt, siden filnavnene er ulike.

### Åpne punkter
- Venter på Thomas' review av #27, #28, #21, #31, #30 og #16, og på svar om Story 1.5.
- Story 1.4 er `ready-for-dev`-spec på `story-1-4-travel`. Implementeres når flettekøen er i gang.
