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
