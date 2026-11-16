# Konkurrentresearch

## 2026-11-16 kl. 09:30 — Albion812

### Oppgave
Brukeren ba Claude vurdere PRD-en og foreslå research- og idémyldringstemaer. Deretter ba brukeren om konkurrentresearch på tre av punktene: (1) Backpacker 2 og Backpacker mobil, (2) 80 Days, og (6) korte nettleserspill (Wordle, Reigns).

### Plan
- Claude vurderte PRD-en og ga en liste i chat med 8 konkurranse-temaer, annen research og 8 idémyldringstemaer. Det viktigste funnet var at §1 sier «one or two sittings», mens lagring (FR-20) er EXT.
- Researchen ble kjørt med `bmad-deep-recon` (Run, competitive). Brukeren godkjente planen:
  - 3 parallelle researchere, én per spillgruppe
  - dimensjonene mekanikk, spillernes stemme og formidling
  - pris og utviklingsretning tatt ut
  - pakkens krav til ferske kilder lempet for gamle spill
  - lagring i `planning-artifacts/research` i stedet for `.docs/research`, som Claude først foreslo
- Avvik fra skillen, logget i memlog:
  - Hver researcher kjørte én runde innenfor 15 verktøykall, ikke to separate runder.
  - Den semantiske kildesjekken med subagent, HTML-briefing og `bmad-review`-polering ble hoppet over for å spare kostnad.

### Resultat
- Rapport: `.docs/planning-artifacts/research/competitive-travel-game-benchmarks-2026-11-16/research.md`. Den har digests fra hver researcher og en `.memlog.md`. Ikke committet ennå; venter på brukerens godkjenning.
- Verifisering: tre påstander ble stikkprøvekontrollert mot uavhengige kilder: Backpacker-jobber er quiz, Safari sletter lagret data etter 7 dager, og 80 Days låser opp ruter ved utforsking. Telling: 5 verifisert, 6 uverifisert. Den mekaniske kildesjekken er OK, med 22 kilder.
- Hovedanbefalinger:
  1. Flytt en minimal autolagring (FR-20) til CORE og behandle den som best-effort. Alternativt endres §1 til «one sitting».
  2. Dokumenter forskjellene fra Backpacker. Mobilversjonen har stempel per by og hotell hver dag, og PC-versjonen har quiz-jobber.
  3. Behold den endelige spørsmålssekvensen i FR-16, siden repetitive spørsmål var hovedklagen på Backpacker mobil.
  4. Skriv faktakort som et reiseøyeblikk pluss ett faktum.
  5. Post-MVP: et sammendrag som kan kopieres og deles, og ruter som belønning.
- Ingen PRD-endringer er gjort. Anbefalingene venter på at gruppen tar beslutninger.

### Åpne punkter
- Gruppen må ta stilling til anbefaling 1 (FR-20 i CORE eller §1 til «one sitting») og 2 (avsnitt om inspirasjon kontra kopiering). Dette bør bli GitHub-issues når brukeren har godkjent det.
- Safari-regelen bygger på en primærkilde fra 2020. Den må sjekkes mot WebKits release notes før FR-20 implementeres.

## 2026-11-16 kl. 09:32 — Albion812

### Oppgave
Brukeren spurte hva Claude anbefaler for videre håndtering av researchen, og godkjente forslaget.

### Plan
- Researchen holdes utenfor PR #4, slik at Thomas' godkjenning ikke trekker ut. Den legges på en egen branch og får en egen PR etter at #4 er merget.
- Det opprettes issues for de to beslutningene, og Thomas varsles om FR-20 fordi den påvirker Sprint 1.

### Resultat
- Branch `research-konkurrenter` er laget fra `planlegging-core-sprint`. Commit `7fce047` inneholder research-mappen (rapport, 3 digests, memlog). Branchen er pushet.
- Issue #13: «Avgjør om FR-20 (autolagring) flyttes til CORE før Story 1.3», med label `question`. Thomas og Christian er tildelt. Kommentaren til Thomas ber ham se på den før 1.3.
- Issue #14: «Skriv avsnitt om inspirasjon kontra kopi (Backpacker)», med label `documentation`.
- PR for researchen er ikke åpnet ennå. Den venter på at PR #4 merges, slik at diffen mot `main` bare viser researchen.

### Åpne punkter
- Beslutningene ligger i issue #13 og #14.
- Åpne PR for `research-konkurrenter` mot `main` når PR #4 er merget.

## 2026-11-16 kl. 10:13 — Albion812

### Oppgave
Brukeren ba om mer research på to punkter for tabellen i §1.1 (#14): (1) hva som skjer i Backpacker når pengene er brukt opp, også via YouTube, utgivelser og andre kilder, og (2) bedre kilder.

### Plan
- Researchen ble utdypet med `bmad-deep-recon` (Deepen), men bare for Backpacker. Brukeren godkjente planen.
- To researchere jobbet parallelt, en for PC og en for mobil. I tillegg kjørte Claude ett eget verifiseringssøk.
- Claude sa fra på forhånd at verktøyene ikke kan se video, bare lese tittel, beskrivelse og tekst rundt den.

### Resultat
- Funnene står i ny seksjon 4 i `research.md`, med kildene [23]–[33]. Kildesjekken er OK. Telling: 7 verifisert, 9 uverifisert, 1 omstridt.
- **Backpacker 1 (1995):** Spilleren som er tom for penger, ringer hjem fra en telefonkiosk. Familien sender penger, eller spilleren sendes hjem og har tapt. Reisen starter og slutter i Göteborg. Kildene er MobyGames via svensk Wikipedia og en uavhengig spillerminne-tråd på Flashback.
- NOMADs «call home» og Bergen som start og slutt har dermed et klart forbilde. Anbefaling 2 og sammendraget er oppdatert.
- **Backpacker 2 og 3:** Ingen kilde viser hva som skjer når pengene er brukt opp. Kildene er uenige om hvem som utviklet spillet.
- **Backpacker mobil:** Tomme mynter avslutter ikke spillet. Man kan sove på gata gratis, men får mindre energi og risikerer å bli ranet. Spillet ble lansert globalt 12. oktober 2017.
- **Ikke tilgjengelig for verktøyene:** MobyGames, Wayback, Reddit, Google Play og svenske aviser. Det ble ikke funnet noen PC-video. To mobilvideoer er listet slik at et menneske kan se dem.
- Endringene i `research.md` er ikke committet ennå.

### Åpne punkter
- Hva som skjer i Backpacker 2 og 3 når pengene er brukt opp, må eventuelt sjekkes manuelt via MobyGames i en vanlig nettleser eller i en video. Dette hører til #14.
