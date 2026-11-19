# PR #4 follow-up, Story 1.2 PR and review requests

## 2026-11-17 kl. 17:06 — Albion812

### Task
Pull the latest changes, find out what Thomas (ThomasRothe88) had done in the review of PR #19, follow up the open notes from his approval of PR #4, open a PR for Story 1.2, and request his review on the open PRs.

### Plan
- `git pull` in `Worldbound` (the `Rammeverket` folder itself is not a repo).
- Look for review activity on #19 via `gh` (reviews, inline comments, issue comments, timeline, repo events).
- Check whether the two remaining notes from the PR #4 approval were already fixed on `main` or on any open branch.
- Fix them on a new branch from `main` in a separate worktree (`../wb-pr4-fix`), so `story-1-2-content` was not touched.
- Open the Story 1.2 PR stacked on `story-1-1-scaffold`, so the diff shows only 1.2.

### Result
- **`git pull`:** `story-1-2-content` was already up to date.
- **Review of #19:** nothing yet. The user first asked about `Thomas88`, which is an unrelated GitHub account with no activity in the repo. Thomas's account is `ThomasRothe88` (the user confirmed this, and it is saved in Claude's memory). ThomasRothe88 has no review, comment or approval on #19. His only submitted reviews are on PR #4: changes requested on 2026-11-15, approved on 2026-11-16.
- **Notes from the PR #4 approval, checked on `main` and all open branches:**
  1. *Review date should be 15 Nov:* not fixed. `sprint-plan.md:37` and `prd.md:436` dated his review 2026-11-16.
  2. *Sprint 0 status should match the revised deadlines:* not fixed. S0 still said Fri 13 – Sun 15 Nov, but 1.1 and 1.2 were not merged.
  3. *Issue #13 (FR-20) must be settled before Story 1.3:* #13 is closed. PR #16 (Decision L) is still open.
- **PR #20** (`rett-pr4-merknader`, commit `7c03e84`):
  - review date changed to "2026-11-15; approved 2026-11-16" in `sprint-plan.md` and PRD §9.6, plus a new line in the PRD revision log (§13)
  - S0 extended to **Wed 19 Nov** (the user's choice), with a note under the timeline: S0 overlaps the first half of S1, S1 keeps its dates and exit criterion, and rules work from 1.3 onwards starts once 1.1 is merged
  - dates that describe the corrections and the approval on 16 Nov were kept
  - `sprint-status.yaml` was not changed, because the story PRs update it
- **Push check:** all 9 local branches matched origin, with no uncommitted changes or stashes. `story-1-2-content` was pushed but had no PR.
- **PR #21** (Story 1.2): opened with base `story-1-1-scaffold` (stacked on #19). The description follows the format of #19. Checks run again before opening: `npm test` 94/94, `npm run lint` exit 0, `npm run build` ok. `npm run test:e2e` was not run again in this session; the 1/1 result in the PR is from the build session.
- **Review requested** from ThomasRothe88 on #19, #20 and #21. Suggested order: #19 → #21, and #20 at any time.
- AI correction worth noting: Claude first looked only for `Thomas88` and found nothing. The real account was found through the repo's collaborator list.

### Open items
None new. #17 and #18 are unchanged. #19, #20 and #21 are waiting for review.
