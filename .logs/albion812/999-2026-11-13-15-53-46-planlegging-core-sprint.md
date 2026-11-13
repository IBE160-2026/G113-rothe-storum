# Planlegging CORE-sprint

## 2026-11-13 kl. 15:53 — Albion812

### Oppgave
Statusanalyse av Worldbound mot sensorveiledningen IBE160, deretter første arbeidsøkt: revidere PRD etter faglærers tilbakemelding (12.11.), lage en faktisk arkitektur, CORE-epics/stories og sprintplan fram til innlevering 15.12.2026. Ingen commit/push uten eksplisitt godkjenning.

### Plan
- Statusrapport (kun lesing): ingen kode finnes; BMAD-kjeden er ferdig til og med UX; `architecture/technology.md` beskriver faglærers eget prosjekt (Pytagoras), ikke Worldbound.
- Gruppens svar i chat (Christian): bydagsrekkefølge = ja; FR-22 = besøkt severdighet tilbys igjen til full pris, gir ingenting nytt; SM-2b = alternativ A; innhold = KI-underagent skriver, Christian faktasjekker; UX-løsning for «stranded/out of days» = ja.
- Arbeidsflyt: egen branch `planlegging-core-sprint`; BMAD-skillene `bmad-architecture` (Fast path), `bmad-create-epics-and-stories` og `bmad-sprint-planning` (script) brukt, men stegvise godkjenninger komprimert etter brukerens «start arbeidsøkten».
- Modell: Claude Code, Opus 5.5.

### Resultat
- **PRD** (`.docs/planning-artifacts/prds/prd-worldbound-nomad-2026-10-12/prd.md`): UJ-3 regnet om (to skift → €456 → Sydney med €156); FR-8 fast rekkefølge (Decision F); FR-22 gjenbesøk (Decision G — gruppen valgte annerledes enn faglærers forslag); FR-12/FR-13 stranded vs out of days (H); NFR-8 innholdseierskap (I); SM-2b og spak i §9.3 (J); FR-4 inn i NFR-2/SM-1 (K); ny §9.6, Open Questions 3/5 oppdatert og 6/7 lagt til; §13 revisjonslogg + FR-indeks. Memlog oppdatert (8 oppføringer).
- **Verifisert:** UJ-1 (€423, 16 d), UJ-2 (€20, 10 d → 17 d), UJ-3 (€456 → €156 → €71) regnet med skript mot addendum — stemmer.
- **UX** (`EXPERIENCE.md`): severdighetskortet følger Decision G; Open Items 1 og 5 lukket, 2 henvist til PRD OQ7. Memlog oppdatert.
- **Arkitektur** (ny): `.docs/planning-artifacts/architecture/architecture-worldbound-nomad-2026-11-13/ARCHITECTURE-SPINE.md` + `.memlog.md`. Functional core / imperative shell; Vite 8 + React 19 + TypeScript 6.0 + Vitest 5 + Playwright 1.65 + zod 4; AD-1–AD-10. Versjoner sjekket med `npm view` 13.11. Funn: TypeScript 7 støttes ikke av typescript-eslint (<6.1) → låst til 6.0.x. `lint_spine.py`: 0 funn. Reviewer-gate kjørt inline av samme agent, ikke uavhengige underagenter. `technology.md` urørt, merket som ekstern referanse i spinen.
- **Epics/stories** (ny): `.docs/planning-artifacts/epics.md` — Epic 1–4 CORE med 20 stories og Given/When/Then-kriterier koblet til FR-ID-er; Epic 5–7 EXT som skisse.
- **Sprint** (ny): `.docs/implementation-artifacts/sprint-status.yaml` (generert med `sprint_plan.py`) og `sprint-plan.md` (S0–S4 + sluttfase, kodefrys 13.12.).
- **Konfig:** `_bmad/config.toml` `project_name` "Albion" → "Worldbound Nomad".
- **Revidert samme dag etter innvendinger fra Christian:**
  - G: besøkt severdighet kjøpes ikke igjen; kan åpnes gratis for å se bilde/fakta, ingen belønning, teller ikke på 0–2-grensen (var: full pris). Oppdatert i PRD (FR-22, §9.6 G), EXPERIENCE (severdighetskort), arkitektur (AD-6, ny reason `ALREADY_IN_ALBUM`), epics (2.1, 2.4).
  - I: tretrinns innholdsløp — KI-agent lager utkast (fakta, illustrasjonsfoto, trivia) → ny KI-agent faktasjekker og logger rettelser → Christian sluttsjekker fakta, stereotypier og fotolisenser. Foto fra databaser med fri lisens (Wikimedia Commons, Unsplash, Pexels) eller KI-generert; aldri kopiert fra vanlige nettsider. Kreditering der lisensen krever det. Oppdatert i PRD (NFR-8, §9.6 I), arkitektur (AD-7: `source`, `author`, `licence`), epics (2.2, 4.5, 5.2), sprint-plan.
  - Agenten påpekte at kopiering av vilkårlige nettbilder bryter opphavsrett, og at lisenskontroll må gjøres av et menneske. `lint_spine.py` etter endring: 0 funn.
- Ingenting committet (gruppens regel går foran skillens commit-krav). Ingen kode skrevet, ingen tester kjørt (finnes ikke ennå).

### Åpne punkter
- Gruppen må godkjenne teknologistakken (React vs. ren TS) i planleggings-PR-en.
- Gruppen må bestemme arbeidsdeling Thomas/Christian og hvem som reviewer hvem (PRD OQ3; forslag i sprint-plan.md).
- Avklar OQ6 (arbeid per destinasjon) før Epic 5, og OQ7 (retning på nattavganger) før nattavganger.
- Bekreft EXT-antakelsen i FR-13: et mulig skift hindrer «stranded» (ved start av Epic 5).
- UJ-3-flyten i EXPERIENCE.md viser fortsatt ett skift — oppdateres i Story 5.3.
- Spør faglærer hva technology.md (Pytagoras) var ment som.
- Uavhengig review av arkitekturen (andre gruppemedlem / egen review-økt) siden reviewer-gaten ble kjørt inline.
- Thomas Rothe har ingen commits i historikken — bør lede og reviewe stories.
