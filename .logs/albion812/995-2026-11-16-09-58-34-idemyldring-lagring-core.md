# Idémyldring: lagring i CORE

## 2026-11-16 kl. 09:58 — Albion812

### Oppgave
Idémyldring om punkt 1 fra PRD-vurderingen: er lagring egentlig CORE? Målet var å skaffe underlag til gruppens beslutning i issue #13 før Story 1.3.

### Plan
- Idémyldringen ble gjort etter anbefaling fra faglærer, ifølge Christian. Anbefalingen var muntlig og står ikke i de skriftlige tilbakemeldingene (`tilbakemelding-product-brief.md`, `tilbakemelding-prd.md`). I BMAD er idémyldring et valgfritt «anytime»-verktøy. Her ble det brukt etter arkitekturen. Hvis forslaget i #13 vedtas, er neste BMAD-steg `bmad-correct-course`.
- Brukte `bmad-brainstorming` i Fasilitator-modus. Brukeren valgte teknikkene i valgarket: Random Stimulation, Disney-metoden, Five Whys og First Principles. Deretter konvergerte vi med MoSCoW.
- Brukeren laget alle ideene. Fasilitatoren ga ett forslag, en reisekode, fordi brukeren ba om det. Brukeren avviste forslaget som for avansert for CORE.
- Memlog: `.docs/brainstorming/brainstorm-lagring-core-2026-11-16/.memlog.md`. Den har 39 linjer og status `complete`.

### Resultat
- **Disney-metoden.**
  - Drømmeren: passet med navn og stempler vises først, spilleren kommer tilbake der hun var, og spillet ønsker henne velkommen tilbake.
  - Realisten: velkomsthilsenen er billigst, og å fortsette der hun var er dyrest. Alt hun har gjort, må være med.
  - Kritikeren: Safari sletter lagret data etter 7 dager uten bruk, og teamet rekker kanskje ikke å bygge lagringen.
- **Five Whys.** Frykten handler egentlig ikke om localStorage. Den handler om at AI-agentene tar av i kode som berører hele spilltilstanden. Roten er at spillet bygger på fremgang.
- **First Principles.**
  - Grunnfakta: spilleren sitter 5–10 minutter av gangen, og en reise tar trolig lenger tid.
  - Reisen kan forsvinne når fanen lukkes, når telefonen går tom for strøm, eller når Safari laster siden på nytt.
  - Brukerens svar: lagre reisen automatisk etter hver handling.
- **Konvergering.** Brukeren syntes MoSCoW-tabellen ble for avansert og ba om en anbefaling.
  - Claude sjekket arkitekturen. AD-2 sier at all endring går gjennom `apply`, så tilstanden ligger i ett objekt. AD-8 sier at `storage.ts` allerede er i CORE, med try/catch og fallback. Lagring i CORE er dermed en liten utvidelse.
  - MoSCoW, anbefalt av Claude og godtatt av brukeren:
    - Must: lagre hele reisen etter hver handling.
    - Should: velkomsthilsen.
    - Could: passet vises først.
    - Won't: reisekode.
- **Brukerens forslag til #13:** flytt minimal autolagring (FR-20) til CORE, og godta Safari-slettingen.
- **Faktasjekk:** brief og PRD sier «short» og «one or two sittings», men oppgir ingen lengde i minutter. Tallet «15 minutter» kom fra brukeren i økten.

### Åpne punkter
- Forslaget må avgjøres sammen med Thomas i issue #13. Hvis det blir vedtatt, må PRD §9.1/§9.2, AD-8, epics og sprintplanen oppdateres.
- PRD §1 sier «one or two sittings», men reiselengden er ukjent. Den bør måles i playtesten (SM-2). Det dekkes av #13 og trenger ingen egen issue.

## 2026-11-16 kl. 10:44 — Albion812

### Oppgave
Gruppen har bestemt at lagring (FR-20) blir i EXT, ikke CORE, fordi lagring kan legges til der. Christian ba om at beslutningen føres inn i PRD-en, at issue #13 lukkes, og at det lages PR-er for det som lå igjen på branchene. Før det sjekket vi om Thomas hadde gjort sine endringer.

### Plan
- Sjekket bidragene til Thomas. Han har ingen commits, men han har reviewet og godkjent PR #4 (ThomasRothe88).
- PR #4 var allerede merget. Jeg hentet `main` og laget PR #15 for `research-konkurrenter`.
- Laget branchen `lagring-ext` fra `research-konkurrenter`, fordi begge legger til linjer i PRD-ens endringslogg (§13). PR #16 bygger derfor på #15.
- **Korrigert av Christian:** Claudes første versjon gikk for fort. Den sa at Thomas bestemte, og den la til et playtest-mål (SM-2c) med en grense Claude hadde funnet på. Christian ba om at beslutningen står som gruppens, med gruppens begrunnelse. Christian beholdt AD-8-henvisningen, fjernet SM-2c og ba om at commit-meldingen skrives om.

### Resultat
- **PR #15** (`research-konkurrenter` → `main`): konkurrentresearch, idémyldring og PRD §1.1. Anbefalingen om lagring i CORE er ikke tatt inn.
- **PR #16** (`lagring-ext` → `research-konkurrenter`) endrer `prd.md`:
  - §1: «one or two sittings» er endret til «one sitting».
  - Ny §9.7 med Decision L. Gruppen bestemte at lagring blir i EXT, fordi den kan legges til der uten å endre CORE (AD-8). KI-anbefalingen om autolagring i CORE (anbefaling 1 i researchen og idémyldringen over) er **avvist**. Saken vurderes på nytt hvis playtesten viser at reisene ikke holder for én økt.
  - Ny linje i endringsloggen.
- Arkitekturen (AD-8) og epics (Epic 6) har allerede lagring i EXT og er ikke endret.
- **Issue #13** er lukket med en kommentar om beslutningen. Story 1.3 trenger ikke å lagre spilltilstanden.
- Forslaget fra idémyldringen over er dermed forkastet av gruppen.

### Åpne punkter
Ingen.
