# Thomas som bidragsyter og UX-oppgave 1 inn på main

## 2026-11-24 kl. 16:55 — Albion812

### Oppgave
Christian spurte hvorfor Thomas ikke står som bidragsyter i repoet, og om det har betydning for vurderingen av arbeidsfordeling. Da det viste seg at UX-arbeidet hans aldri kom inn på `main`, ba han om en PR som henter det inn.

### Plan
- Sammenlignet git-forfattere med GitHub sine contributors og collaborators, og sjekket koblingen mellom commit og konto via API-et.
- Søkte i sensorveiledningen etter hva sensor ser på når det gjelder historikk og samarbeid.
- Sammenlignet `feature/ux-worldbound` med `main`, og vurderte om innholdet allerede var dekket.
- Forberedte endringen i en egen worktree, så de ucommittede filene i hovedarbeidstreet ikke ble rørt. Viste diffen og fikk godkjenning før commit, push og PR.

### Resultat
- **Årsak:** Thomas sine 4 commits har e-posten `thomasrothe88@live.no`, som ikke er koblet til GitHub-kontoen `ThomasRothe88`. API-et returnerer `author: null`, og derfor vises han ikke under Contributors eller i Insights. Han har skrivetilgang og har åpnet PR #44.
- **Sensorveiledningen:** linje 62–63 sier at sensor bruker git log og GitHub Insights. Linje 94–95 sier at ujevn fordeling i commit-statistikk alene ikke gir trekk. Det finnes ingen formell regel om bidragsliste, men Insights gir i dag et feil bilde av samarbeidet.
- **UX-spesifikasjonen:** commit `45013aa` (`ux-spec.md` og `.memlog.md`, 13.10.) lå bare på `feature/ux-worldbound`. Den har aldri vært i en PR, og ingen filer på `main` viser til den. UX-arbeidet på `main` (`ux-designs/…`, `3d6c889`) erstattet den i praksis.
- Laget en melding til Thomas med fremgangsmåten for å verifisere e-posten. Christian sender den selv.
- Lagde grenen `docs-ux-task1-history` fra `45013aa`. Commit `b88260a` merker `ux-spec.md` som `status: superseded` med `superseded_by: EXPERIENCE.md` og en statusboks, og legger til «Status after merge» i `.memlog.md`. En upresis påstand om at OQ-UX var dekket i `EXPERIENCE.md` ble rettet før commit.
- `git merge-tree` mot `main` viste ingen konflikter. Ingen kodeendringer, så det er ingen tester å kjøre.
- PR #54 er åpnet: https://github.com/IBE160-2026/G113-rothe-storum/pull/54. Den er ikke flettet. Worktreen er fjernet.

### Åpne punkter
- Thomas må legge til og verifisere `thomasrothe88@live.no` på GitHub-kontoen sin. Dette er ikke en repo-endring, og meldingen er gitt til Christian.
- PR #54 må gjennomgås og flettes med vanlig merge commit, ikke squash, så `45013aa` beholder Thomas som forfatter.
- OQ-UX-1 til 7 i Thomas sin spesifikasjon er ikke sjekket mot Open Items i `EXPERIENCE.md`. Foreslått som GitHub-issue, som venter på Christians godkjenning.
