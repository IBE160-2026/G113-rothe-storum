# Idémyldring: lagring i CORE

## 2026-11-16 kl. 09:58 — Albion812

### Oppgave
Idémyldring om punkt 1 fra PRD-vurderingen: er lagring egentlig CORE? Målet var å skaffe underlag til gruppens beslutning i issue #13 før Story 1.3.

### Plan
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
