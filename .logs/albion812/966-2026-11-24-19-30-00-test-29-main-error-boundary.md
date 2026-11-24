# Test #29: main.tsx wraps App in the error boundary

## 2026-11-24 kl. 19:30 — Albion812

### Oppgave
Christian valgte #29 mens PR-ene venter på Thomas. Ingen test sjekket at selve inngangspunktet `src/main.tsx` pakker `App` inn i `ErrorBoundary`. Uten den ville ugyldig innhold gitt en tom `#root` (AR-10).

### Plan
- Ny branch `test-29-root-error-boundary` fra `origin/main`.
- Testen importerer den ekte `main.tsx`, i stedet for issuens forslag om en egen `Root`-komponent. Da testes den koden som faktisk sendes ut, og ingen produksjonskode endres.
- Full BMAD-workflow og ekstern review ble ikke kjørt, fordi endringen bare er én test. At testen fanger feilen, er sjekket ved å fjerne `ErrorBoundary`.
- Christian godkjente commit, PR og logg ("ja, gjør alle").

### Resultat
- **Commit med `Closes #29`.** `tests/ui/main.test.tsx` har to tester:
  - ugyldig innhold gir feilskjermen i `#root`;
  - gyldig innhold gir Start-skjermen og sidetittelen, uten feillogging.
- **Uten `ErrorBoundary` i `main.tsx`** feiler testen for ugyldig innhold. `main.tsx` ble satt tilbake.
- **`deferred-work.md`:** de to oppføringene om `main.tsx` er merket som ferdige.
- **Sjekker:** `npm test` (313 av 313), lint og build er bestått.

### Åpne punkter
- **PR for #29** venter på Thomas.
