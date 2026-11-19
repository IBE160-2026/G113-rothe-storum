# Deferred Work

- source_spec: `.docs/implementation-artifacts/spec-1-3-game-state-and-starting-a-journey.md`
  summary: No automated test checks that the shipped entry point `src/main.tsx` wraps `App` in `ErrorBoundary`; removing the wrapper would leave every test green.
  evidence: Verification-gap review of Story 1.3. Vitest tests build their own `<ErrorBoundary><App /></ErrorBoundary>` tree, and the only test through `main.tsx` is the Playwright e2e with valid content. Settling it needs either an exported `Root` component tested in `tests/ui/ErrorBoundary.test.tsx` (changes the entry structure) or an e2e run with invalid content (needs fixture/build plumbing). Candidate for Story 1.5, which reworks the app tree.
- source_spec: `.docs/implementation-artifacts/spec-1-4-travel-and-route-queries.md`
  summary: Update epics.md (Story 1.4 and 3.1) and epic-1-context.md so they say arriving home evaluates the goal from Story 1.4 (Q1 = A), not "ended at home" with goal evaluation in 3.1.
  evidence: Story 1.4 review (blind-hunter); `applyTravel` sets goalReached/goalNotReached on arriving home, but the planning artifacts still describe the old split. Editing them needs the team's approval.
