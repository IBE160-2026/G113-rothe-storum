# Deferred Work

- source_spec: `.docs/implementation-artifacts/spec-1-3-game-state-and-starting-a-journey.md`
  summary: No automated test checks that the shipped entry point `src/main.tsx` wraps `App` in `ErrorBoundary`; removing the wrapper would leave every test green. → Done 2026-11-24 (#29).
  evidence: Verification-gap review of Story 1.3. Vitest tests build their own `<ErrorBoundary><App /></ErrorBoundary>` tree, and the only test through `main.tsx` is the Playwright e2e with valid content. Settling it needs either an exported `Root` component tested in `tests/ui/ErrorBoundary.test.tsx` (changes the entry structure) or an e2e run with invalid content (needs fixture/build plumbing). Candidate for Story 1.5, which reworks the app tree.
- source_spec: `.docs/implementation-artifacts/spec-1-4-travel-and-route-queries.md`
  summary: Update epics.md (Story 1.4 and 3.1) and epic-1-context.md so they say arriving home evaluates the goal from Story 1.4 (Q1 = A), not "ended at home" with goal evaluation in 3.1.
  evidence: Story 1.4 review (blind-hunter); `applyTravel` sets goalReached/goalNotReached on arriving home, but the planning artifacts still describe the old split. Editing them needs the team's approval.

## Deferred from: code review of spec-1-4-travel-and-route-queries (2026-11-22)

- Planning docs do not reflect Q1 = A: `epic-1-context.md:55` and `epics.md:215` still say "ended at home" with goal evaluation in 3.1, and the FR-11 row in the coverage table in `epics.md` does not list Story 1.4. This extends the earlier entry above (#32). Editing them needs the team's approval. → Done 2026-11-24 (#32).
- PR #33 (`story-1-4-travel`) also contains Story 1.3 (#31) and the architecture fixes (#28), which are not merged yet. Merge #28 and #31 first, then update #33 from `main` so its diff shows only Story 1.4 (PR-1/AD-10: one story per PR).
- No test checks that `src/main.tsx` wraps `App` in `ErrorBoundary`. Confirmed again by the verification-gap review of 1.4; see the Story 1.3 entry above (candidate for Story 1.5). → Done 2026-11-24 (#29): `tests/ui/main.test.tsx` imports the real entry point.
- The new public rules API (`apply`, `travel`, `routesFrom`, `daysRemaining`, `TravelOption`/`RouteView`, the new `ReasonCode` members) is described only in spec-1-4's Design Notes. Add a short listing to ARCHITECTURE-SPINE (AD-3/AD-4) before UI Stories 1.6 and 1.7. → Done 2026-11-24 (#35).
- source_spec: `.docs/implementation-artifacts/spec-gh-50-begin-journey-rejection.md`
  summary: When Story 3.3 adds "New journey" from the summary, test that a rejected `startJourney` with a previous journey in the store keeps the player off the Map.
  evidence: App's check uses `rejection === null && game !== null`; today every test starts with `game === null`, because the UI has no path back to Start once a journey exists (#50 review, finding 1).
