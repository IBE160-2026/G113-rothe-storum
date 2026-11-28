# Merge av godkjente PR-er (#74–#77, #80, #81)

## 2026-11-28 kl. 12:39 — Albion812

### Oppgave
Vise sprintstatus, hente siste endringer, og finne ut om Thomas hadde reviewet PR-ene og hva som kunne merges. Brukeren godkjente deretter å merge de godkjente PR-ene med merge commit.

### Plan
- Sprintstatus med `bmad-sprint-planning` (status): 10/20 stories ferdige; anbefalingen var 1-7, men den er Thomas sin (#73, arbeidsdeling i #76), og det ble rettet opp overfor brukeren.
- Sjekket review, CI og filer for åpne PR-er, og testet å merge #74 → #75 → #76 → #77 → #80 → #81 etter hverandre i en midlertidig worktree: de fire første uten konflikt, #80 og #81 med konflikt bare i `deferred-work.md`.
- Godkjent plan: merge #74–#77, deretter oppdatere #80 og #81 med `main`, løse `deferred-work.md` ved å beholde begge sider, og merge etter grønn CI.

### Resultat
- **Merget med merge commit:** #74 (`66d379e`), #75 (`f883232`), #76 (`0d8f799`), #77 (`5c73b15`). CI på `main` er grønn på `5c73b15` (de tre tidligere kjøringene ble kansellert av den neste).
- **#80:** `main` merget inn i `stamp-component` (worktree `../Worldbound-stamp`). Konflikten i `deferred-work.md` er løst ved å beholde begge sidene, pushet som `04816da`. Lint og tester kunne ikke kjøres i den worktreen (ingen `node_modules`).
- **CI på #80 feilet to ganger** på samme test: `tests/rules/travel.test.ts` «agrees with apply on every trip, including every outcome and fail reason» (fra #74), timeout på 5 s. 435 av 436 tester var grønne. Lokalt på `main` tok testen 1434 ms, og filen passerte 3 av 3 ganger; på CI tok filen ca. 3,5 s. Testen er ikke feil, bare treg. At flere testfiler i #80 gjør CI-maskinen tregere er en antakelse, ikke bekreftet.
- **PR #84** (`fix-travel-preview-timeout`): testen har fått 30 s timeout og en kommentar om hvorfor; testtilfellene er uendret. Brukeren valgte dette framfor å redusere antall kombinasjoner. Lokalt: lint ok, prettier ok, `npm test` 428/428. CI er grønn. Venter på review fra Thomas.
- **#80 og #81 er ikke merget.** De venter på at #84 blir merget, og må deretter oppdateres med `main`.

### Åpne punkter
Opprettet som GitHub-issues etter godkjenning:
- #85 — #77: specen sier `aria-labelledby`, koden bruker `aria-label` (ikke-blokkerende funn fra Thomas sin review).
- #86 — Visuell sjekk i nettleser av Polaroid-bredden og Stamp, når Story 3.3 tar dem i bruk (fra Thomas sine reviews av #77 og #80).
- Etter #84: oppdatere #80 med `main` og merge; deretter #81 (konflikt i `deferred-work.md`).
