# Polaroid-spec: aria-label (#85)

## 2026-11-28 kl. 12:54 — Albion812

### Oppgave
Rette #85: specen for Polaroid sa `aria-labelledby`, mens koden bruker `aria-label`.

### Plan
- Lest `spec-polaroid-and-polaroid-sheet.md` og `Polaroid.tsx`. Specen motsa seg selv: I/O-matrisen (linje 43) sa `aria-labelledby`, mens Deviations (linje 114) sier `aria-label`, med begrunnelse. Oppgavelista (linje 71) nevnte `sheetLabel(name)`, som Deviations sier ble droppet.
- Forslag godkjent av brukeren: rette specen etter koden, ingen kodeendring.

### Resultat
- Branch `gh-85-polaroid-spec-label`, commit med `Closes #85`, **PR #87**. To linjer endret i specen.
- Lokalt: prettier ok, `npm test` 428/428.
- Venter på review fra Thomas. Bygger på [945-merge-godkjente-pr-er](945-2026-11-28-12-39-58-merge-godkjente-pr-er.md).

### Åpne punkter
Ingen nye. #85 lukkes når PR #87 merges.
