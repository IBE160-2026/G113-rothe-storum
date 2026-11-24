# Rules API-dokumentasjon (#35) og sluttsjekk av sight-innhold med nye tegninger (#45)

## 2026-11-24 kl. 16:34 — Albion812

### Oppgave
Christian ville fortsette fra i går, i rekkefølgen #35, #45, Story 3.1 og #32. #35: dokumentere rules-API-et som UI-storyene skal bygge mot. #45: ta de fire åpne innholdsavgjørelsene fra Story 2.2. Underveis ba Christian om at alle 16 sight-tegningene skulle bli mer detaljerte og realistiske, tegnet etter ekte referansefotoer.

### Plan
- #35: et API-avsnitt i ARCHITECTURE-SPINE, så commit, PR og review for Thomas.
- #45: få de fire avgjørelsene via spørsmål (lisens-tekst, Harbour Bridge, Vatikanet, Frihetsgudinnen).
- Tegningene: Python-skript i scratchpad, referansefotoer fra Wikimedia Commons (kun thumbnails, med lisens og fotograf registrert) og et galleri i nettleseren der Christian ga tilbakemelding, i seks runder (v1–v6).
- Lisens: Christian valgte alternativ A, der tegningene behandles som avledede verk av fotoene.
- Repo-endringene ble vist og godkjent ("ja, med punkt 6") før de ble skrevet, og commit, push og PR ble godkjent ("JA").

### Resultat
- **#35:** commit `d18425f` på `docs-35-rules-api-spine`, PR #51 (er flettet til `main` som `7bbaad5`).
- **Issue #52** er opprettet etter godkjenning: oppfølging for å bytte tegningene mot selve Commons-fotoene senere.
- **#45:** commit `31e10f0` på `content-45-final-check`, PR #53 med Thomas som reviewer, og `Closes #45`.
  - Christians avgjørelser: lisensmodell A, Harbour Bridge beholder 503 m, Vatikanet tegnes om som den doble spiraltrappen (Momo-trappen, 1932) uten arkitektnavn i alt-teksten, og Frihetsgudinnen godtas som monument.
  - `public/assets/sights/`: 16 nye SVG-er, totalt ca. 650 KB. Den største er Vatikanet på ca. 90 KB.
  - `content/sights.json`: nye `imageAlt`, `source` (Commons-siden), `author` ("Claude (AI), after a photo by …") og `licence`. 12 tegninger har CC BY-SA 4.0 og 4 har CC0 1.0 (Tivoli, Eiffeltårnet, Vatikanet og Sensō-ji, fordi referansene deres er PD eller CC0).
  - `README.md`: credits-seksjonen er skrevet om, med en tabell over alle referansefotoene.
  - `tools/sight-drawings/`: tegneskriptene, `lib.py` og en README. Skriptene genererer SVG-ene byte-for-byte likt det Christian godkjente i galleriet.
  - Spec 2-2 har fått en ny oppføring i Spec Change Log, og faktasjekkrapporten har fått seksjonen "Christian's decisions on the open items".
  - `npm test` (311 av 311), `npm run lint` og `npm run build` er bestått.
  - Kommentar på #46 om at alle SVG-ene er nye og må sjekkes i nettleseren.
- **Endringer etter Christians tilbakemeldinger:**
  - Mer detaljerte tegninger etter ekte fotoer, i stedet for fritt tegnede.
  - Tivoli: først med Rutschebanen, til slutt som hovedinngangen med muren rundt.
  - Nyhavn: sett rett forfra, og deretter med bredere og lavere hus.
  - Empire State: først fra bakkenivå, deretter med et litt høyere blikk.
  - British Museum: først fra lufta, så forfra med portikoen og fløyene. Luftbildet ble ikke brukt.
- **Feil som ble løst:**
  - Wikimedia svarte gjentatte ganger med HTTP 429. Løst med backoff, kun 960 px thumbnails, én fil om gangen og ren tittelsøk uten nedlasting.
  - Galleriet viste ikke bildene fordi nettleseren blokkerte filer fra en annen mappe. SVG-ene ble kopiert ved siden av siden.
  - Galata-skriptet viste til feil referansefil. Rettet med nøyaktig tittel og lisens fra API-et, og Christian ble informert.
- **Underveis svarte jeg Christian** at en ny terminal for Story 3.1 bør bruke en egen `git worktree`. Denne økten skrev bare til scratchpad mens Christian vurderte tegningene.

- **Lisenskontroll mot Commons (etter Story 3.1 og #32, godkjent med "JA"):** alle 16 referansefotoene stemmer med `sights.json`. Én kreditering var feil: det andre British Museum-fotoet er av Elliott Brown, CC BY-SA 2.0, ikke Luke Massey med CC BY 2.0. Rettet i commit `92f383c`.
  - Creative Commons bekrefter at FAL 1.3 er kompatibel med BY-SA 4.0, og at BY-SA 2.0 og 3.0 tillater en senere versjon.
  - Kommentar på PR #53.

- **Christians NFR-8-sjekk:** han gikk gjennom de 16 tegningene på en sjekkside (`dist/nfr8-check.html`, git-ignorert, med lys og mørk modus, alt-tekst, lisens og fotolenke). Han krysset av alle tre punktene i PR #53 og registrerte sjekken i en kommentar.

### Åpne punkter
- **PR #53** venter på Thomas' review og fletting. Christians NFR-8-sjekk er gjort.
- **#46:** sjekk SVG-ene i nettleseren, i lys og mørk modus. Kommentar om de nye tegningene er lagt til.
- **#52:** bytte tegningene mot Commons-fotoer senere.
- **Story 3.1 og #32** står igjen i dagens rekkefølge.
- Ingen nye issues er opprettet utover #52.
