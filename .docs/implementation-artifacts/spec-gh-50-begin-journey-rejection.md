---
title: 'gh-50 — App: go to the map only when startJourney is accepted'
type: 'bugfix'
created: '2026-11-24'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `beginJourney` in `src/ui/App.tsx` dispatches `startJourney` and switches to the map in the same step, without looking at the result (#50). Today `startJourney` can only be rejected with `UNKNOWN_MODE`, and App never passes a mode. Once mode selection arrives (Epic 6), a rejected start would open the Map with no journey, or with the previous journey.

**Approach:** App switches to the Map only after the store shows that the start was accepted. On a rejection, the player stays on the Start screen. The store records the reason in `rejection` as usual, and showing it is for the UI stories, since there is no reason copy yet (deferred-work). App still goes only through `dispatch` (spine Rules API: the UI never calls `apply` itself). One test proves both cases.

</frozen-after-approval>

## Implementation Notes

- `src/ui/App.tsx`: `beginJourney` now dispatches and sets a transient `starting` screen. Before the screen switch, that screen resolves in the same render to `map` when the store shows the start was accepted (`rejection === null && game !== null`) and to `start` otherwise. This uses React's "adjust state during render" pattern, so there is no effect and no extra commit. App never calls `apply` (spine Rules API). Because the check reads `rejection`, it is also correct when a previous journey exists, as a later "New journey" from the summary (Story 3.3) will have.
- `tests/ui/App.startRejected.test.tsx` (new): mocks the `startJourney` creator to ask for `mode: "nomad"`, which core content lacks, so the real `apply` rejects it with `UNKNOWN_MODE`. Three cases: intro already seen, first-visit intro, and a later accepted start. Verified that all three fail against the old `App.tsx` and pass with the fix.
- On a rejection there is no message yet. Reason copy for every `ReasonCode` is deferred to the UI stories: that `deferred-work.md` entry comes with Story 3.1 (PR #57) and is not on `main` yet.
- Deliberate, while a rejected start cannot happen through the UI (App never passes a mode): no message or live-region announcement, and no focus handling when the first-visit intro returns to Start. The intro-seen flag stays set, because the player did see the intro. Mode selection (Epic 6) must revisit these.
- The `starting` screen relies on `dispatch` and `setScreen` being batched in the same event, as the code comment says. That holds for `useReducer` dispatches from an event handler.

## Review Triage Log

One-shot review (2026-11-24), blind hunter only. Verdicts by Claude after checking each claim.

| # | Finding | Verdict | Route | Evidence |
|---|---|---|---|---|
| 1 | The "previous journey exists" case is untested, so the `rejection === null` half of the check could be dropped | low | defer | True: every test starts with `game === null`. Not reachable today, because the UI has no path from the Map back to Start. Story 3.3's "New journey" adds that path and should test it (deferred-work entry). |
| 2 | The spec points to a deferred-work entry that is not on this branch | low | patch | True: the entry is in PR #57. The note now says so. |
| 3 | A rejected start is silent: no message, no focus handling, intro flag stays set | low | reject | Not reachable through the UI today; recorded as deliberate decisions in Implementation Notes for Epic 6. |
| 4 | The spec says "one test" but there are three; status is still in-progress | low | reject | The wording is in the frozen Intent. Status is set to done at finalisation. |
| 5 | The tests never assert `UNKNOWN_MODE`, so they could pass for the wrong reason | false | reject | If the mock stopped asking for "nomad", the start would be accepted and the Map would open, so tests 1 and 2 would fail. Test 3 shows the same flow opens the Map once the mock is off. |
| 6 | The `starting` screen relies on batching | low | reject | Hypothetical (an `await` or an external store). The assumption is documented in the code comment and in Implementation Notes. |
| 7 | No session log, `Closes #50` or sprint entry | false | reject | These come at commit, PR and logging, after review. #50 is not a sprint story. |
| 8 | No test that the typed name survives a rejected start | low | patch | A direct assertion added to the first test. Other intro variants do not call `beginJourney`. |
