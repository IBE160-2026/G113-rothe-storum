# Sjekk mot sensorveiledningen og arbeidsdeling (#11)

## 2026-11-27 kl. 10:18 — Albion812

### Oppgave
Christian ville vite om prosjektet fortsatt følger sensorveiledningen for Del 1, og hvordan vi står på hvert kriterium. Deretter ble økten et arbeid med issue #11 (Thomas leder og reviewer stories, så begge synes i historikken): et utkast til kommentar til Thomas, og så en PR som fører den avtalte arbeidsdelingen inn i sprintplanen og README.

### Plan
- Leste `.docs/reference/sensorveiledning-ibe160-del1.txt` og gikk gjennom repoet kriterium for kriterium: git-historikk, PR-er og issues med `gh`, `sprint-status.yaml`, `sprint-plan.md`, README, `.gitignore` og sporede filer.
- Kjørte `npm run lint`, `npm test` og `npm run build`. Forsøkte `npm run test:e2e`.
- Målte bidraget i #11: commits per forfatter med og uten `Logg:`-commits, `git blame` på `src/` og `tests/`, og forfatter og reviewer per PR.
- Skrev utkast til kommentar til Thomas på #11. Christian rettet tallene og postet den selv, sammen med en kommentar om den muntlige avtalen.
- Laget PR-en i en egen worktree (`../Worldbound-gh-11`, branch `gh-11-team-split` fra `origin/main`), slik at det ucommittede Polaroid-arbeidet på `polaroid-sheet` ikke ble rørt. Viste diff og fikk godkjenning før commit, push og PR.

### Resultat
- **Vurdering mot sensorveiledningen (anslag, ikke fasit):** kriterium 1 A–B, 3 A–B, 5 A–B, 7 A–B, 6 B og 4 B (foreløpig). Kriterium 2 er D–E i dag og B hvis S2 blir ferdig: bare start, intro og kart er spillbart, og 1.7, 2.3–2.5, 3.2 og 3.3 er `backlog` med S2-frist søndag 29.11. Det gir ca. 3,5 vektet i dag og ca. 4,3–4,6 hvis S2 og S3 holder. Christian valgte å følge BMAD-rekkefølgen videre.
- **Kjørt:** `npm run lint` består, `npm test` gir 405/405 tester grønne i 23 filer, og `npm run build` består. `npm run test:e2e` kunne først ikke kjøres fordi port 4173 var i bruk av en egen `node`-prosess (PID 6202), som ikke ble stoppet. Da porten var ledig, ble testene kjørt på `main` (`b571375`): 3/3 grønne i Chromium med 375 px bredde (`start.spec.ts`, `map.spec.ts`, `first-visit.spec.ts`). Byggesteget ga en ufarlig PostCSS-advarsel om at `from` mangler. E2E kjører ikke i CI ennå, og testene dekker foreløpig bare start, intro og kart.
- **Målinger for #11:** 201 mot 7 commits (uten merges), der 124 av Christian sine er `Logg:`-commits. `git blame` gir ca. 69 % / 31 % av linjene i `src/` og `tests/`. Thomas er reviewer på ca. 22 PR-er og har ledet 1.5, 1.6 og 1.7.
- **PR #76** (https://github.com/IBE160-2026/G113-rothe-storum/pull/76), commit `e29ddb9`, med Thomas som reviewer og `Closes #11`:
  - `sprint-plan.md`: ny fordeling i Team split-tabellen (Christian: Polaroid-komponentene, 2.5, 3.2, 3.3; Thomas: 1.5–1.7, 2.3, 2.4, 4.2, 4.3), en rad for EXT-epics 5–7, en datert merknad og en setning i statuslinjen.
  - `README.md`: ny seksjon «Arbeidsdeling» med lenker til #5, #11 og sprintplanen.
  - `prettier --check` består på begge filene (Prettier fylte ut README-tabellen).

- **Review-rekkefølge til Thomas:** postet som kommentar på PR #73 (https://github.com/IBE160-2026/G113-rothe-storum/pull/73#issuecomment-7215200730). Rekkefølgen er #74 (blokkerer 1.7), så #77 (trengs i 2.4, 2.5 og 3.3), så #75 og #76.

**KI-forslag som ble rettet i økten:**
- Claude påsto først at Epic 4 ikke var fordelt. Ved kontroll viste `sprint-plan.md` at 4.2 og 4.3 tilhører Thomas, og 4.4 og 4.5 begge. Claude rettet seg selv, og oppdaget samtidig at avtalen fra 27.11 også måtte inn i sprintplanen, ikke bare i README, for å holde plan og README konsistente.
- Utkastet til kommentaren påsto at de fleste av Thomas sine reviews var uten tekst. Det bygde på at Claude bare telte PR-kommentarer, ikke selve review-teksten. Christian rettet dette før postingen: reviewene er skriftlige (akseptansekriterier, hva han sjekket, og «changes requested» på #4 og #28). Punktet ble fjernet, og tallene ble oppdatert (249/7, 21 av 30 PR-er).

### Åpne punkter
- Ingen nye issues er opprettet. #11 lukkes automatisk når PR #76 merges.
- E2E i CI og E2E-dekning av reise, bydag og slutt hører til Story 4.2. Ingen egen issue er opprettet.
