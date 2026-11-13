# Sprint Plan — WORLDBOUND: NOMAD (2026-11-13 → 2026-12-15)

**Status:** proposal from the AI agent (Claude Code), 2026-11-13. The team confirms it in the planning pull request.
**Source:** `.docs/planning-artifacts/epics.md` · story status: `sprint-status.yaml` (BMAD tracking file).
**Deadline:** Tuesday 2026-12-15 (submission). 32 days, about 4.5 weeks.

## Principles

1. **CORE first.** Epics 1–4 must be finished, tested and playtested before any EXT work starts (PRD §9.2, SM-C1).
2. **Small and steady.** One story = one branch = one pull request, reviewed by the other team member (PRD §6). Aim for several merged PRs per week, so the history shows steady progress (assessment criterion 1).
3. **Tests in the same PR.** A rules story is not done without its FR-named tests (AD-10). A UI story is not done before the reviewer has run it.
4. **Log every session.** Use `sesjonslogg` in every Claude Code session. The PR links the log and names the story and FR ids. When AI output is rejected or corrected, write it down.
5. **Freeze before the deadline.** No new features after Sunday 2026-12-13. The last two days are for checks only.

## Timeline

| Sprint | Dates | Goal | Stories | Exit criterion |
| --- | --- | --- | --- | --- |
| **S0 — Plan and scaffold** | Fri 13 – Sun 15 Nov | Planning merged; project runs | Review and merge the planning PR · 1.1 · 1.2 | `npm run dev` and `npm test` work from the README |
| **S1 — Rules core** | Mon 16 – Sun 22 Nov | All core rules done and tested, no UI dependency | 1.3 · 1.4 · 2.1 · 3.1 · 2.2 (AI drafts, review starts) | Rules tests green for FR-1, 4, 6–14, 21, 22; UJ-1 and UJ-2 pass as rules tests |
| **S2 — Playable UI** | Mon 23 – Sun 29 Nov | Full journey playable in the browser | 1.5 · 1.6 · 1.7 · 2.3 · 2.4 · 2.5 · 3.2 · 3.3 · 2.2 finished | A full journey can be played on a phone from start to summary |
| **S3 — Verify and playtest** | Mon 30 Nov – Sun 6 Dec | CORE proven and accessible | 4.1 · 4.2 · 4.3 · 4.4 (playtest Thu 3 – Sat 5 Dec) · bug fixes | All tests green; playtest report written; Epic 1–4 retrospective |
| **S4 — Extension (only if S3 is green)** | Mon 7 – Sun 13 Dec | One EXT item, finished | Epic 5 (Work), else spend the time on bug fixes and polish | Code freeze Sun 13 Dec |
| **Final** | Mon 14 – Tue 15 Dec | Delivery | 4.5 (README test on a clean machine) · repo check · final logs · tag release | Submitted Tue 15 Dec |

Buffer: S1 is deliberately rules-only, so the UI can start in parallel if one person is ahead. If S2 slips, S4 is dropped, not S3.

## Why this order

- Rules first (S1) because they are pure, quick to test, and everything else depends on them (AD-1, AD-2). It also gives the team the strongest QA evidence early (assessment criterion 3).
- Content (2.2) starts in S1, because the three-step pipeline (AI draft → AI fact-check → Christian's final check of facts and photo licences) is the slowest step that cannot be compressed.
- The playtest sits early in S3, so there is still a week to act on the results and on SM-2b.

## Proposed team split — TEAM DECISION NEEDED

This is a proposal, not a decision (PRD Open Question 3):

| Area | Lead | Reviewer |
| --- | --- | --- |
| 1.1 scaffold, rules (1.3, 1.4, 2.1, 3.1), tests 4.1 | Christian | Thomas |
| UI (1.5–1.7, 2.3–2.5, 3.2, 3.3), e2e 4.2, a11y 4.3 | Thomas | Christian |
| Content 2.2 (AI drafts, fact-check) | Christian | Thomas |
| Playtest 4.4, README 4.5 | both | both |

## Risks and countermeasures

| Risk | Countermeasure |
| --- | --- |
| UI takes longer than planned (UX spec is detailed) | Build to the core screens first; visual polish (illustrations, loupe details) can follow placeholders. Story ACs are the minimum. |
| Content review becomes a bottleneck | Start in S1; placeholders allowed (Decision B). |
| Commits cluster at the end | One PR per story; S0–S2 already give about 15 PRs. |
| Only one person visible in the history | Both lead stories and both review PRs. |
| EXT tempts before CORE is stable | SM-C1: no EXT while core tests or the playtest fail. |
