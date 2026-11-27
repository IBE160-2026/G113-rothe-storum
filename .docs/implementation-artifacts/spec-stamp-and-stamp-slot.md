---
title: 'Stamp and Stamp slot (shared UI for Stories 3.3, 2.5 and 2.4)'
type: 'feature'
created: '2026-11-27'
status: 'done'
baseline_commit: 'b571375a9465d95437b8be513db72e36ef4acd0d'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/DESIGN.md'
  - '{project-root}/.docs/planning-artifacts/ux-designs/ux-worldbound-nomad-2026-10-13/mockups/screens-core.html'
  - '{project-root}/.docs/implementation-artifacts/spec-3-3-journey-summary-and-new-journey.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Story 3.3 (Journey summary) needs 50 px stamps and empty slots, and Stories 2.5 (Passport, 80 px) and 2.4 (Day complete, 96 px) need the same stamp at other sizes. No stamp component exists. The map's status strip draws its slots inline. Since #11 put 3.3 before 2.5, the stamp is built first as its own small PR, so 3.3 and 2.5 share one implementation, as the Polaroid components did (PR #77).

**Approach:** Add `Stamp` and `StampSlot` in `src/ui/components/Stamp.tsx` with a `.module.css`, following DESIGN.md → Stamp and Stamp slot and the `st-cph` symbol in `mockups/screens-core.html`. The geometry is a 50-unit viewBox, an outer ring of r 22 and 2.5 stroke with a 12% wash, a dashed inner ring of r 17, the IATA code at y 22, and the check `M18 27l5 5 9-9`. A `size` prop in CSS px covers 28–96 px. The colours come from tokens, so dark mode follows the device. Decisions (Christian, 2026-11-27):
- **Angle 0°.** `stampAngle` is not in the content yet; it gets a follow-up issue (Story 3.3 spec, D3).
- **No `copy.ts` changes.** The accessible name (for example "Paris stamp") is passed in by the caller, so this PR does not overlap with #73 or #77.
- The `StatusBar` slot strip is Thomas's UI and is not changed here.

</frozen-after-approval>

## Implementation Notes

- **Files:** `src/ui/components/Stamp.tsx` (`Stamp`, `StampSlot`), `src/ui/components/Stamp.module.css` and `tests/ui/Stamp.test.tsx`. Nothing existing is changed, and no tokens are added: `--color-stamp-ring`, `--color-stamp-ink`, `--color-slot-dash`, `--color-ink-muted`, `--color-ochre`, `--font-stamp-code-*` and `--font-slot-numeral-*` already exist on `main`, with dark values.
- **API:** `Stamp({ code, label, size = 50 })` is one `<svg role="img" aria-label={label}>`. `StampSlot({ numeral, size = 50, next, label })` is hidden from screen readers without `label`, and `role="img"` with it. `data-next` marks the next slot, following the `data-state` convention in `MapScreen`.
- **Colours** are CSS classes, not SVG presentation attributes, because `var()` in presentation attributes is not reliable across browsers. Inside the SVG, `font-size: 8px` is in viewBox units, which matches DESIGN's stamp-code note (8 px at 50 px, 4.8 px at 30 px).
- **Surprise:** the 8% ochre wash on the next slot cannot use `color-mix()`, because it needs Chrome 111 and Safari 16.2, and the README's floor is Chrome 107 and Safari 16. A `::before` with `opacity: 0.08` is used instead.
- **Slot numeral** stays at the 11 px token at every size (NFR-5 floor), as DESIGN gives one `slot-numeral` style.

- **After review (Blind Hunter, pass 1):** the numeral is positioned so the next-slot wash paints under it. The next-slot CSS is keyed on `[data-next="true"]` instead of a separate class. The destinations test pins the 8 core codes. The `size` comments say the caller chooses. Follow-up issues: #78 (`stampAngle`) and #79 (`StatusBar` strip onto `StampSlot`/`Stamp`).

## Review Triage Log

Pass 1, Blind Hunter (context-free subagent, Opus), 12 findings, each checked against the code and DESIGN.md by the main session and confirmed by Christian:

| # | Finding | Verdict | Evidence / action |
|---|---|---|---|
| 1 | The next-slot wash paints over the numeral | medium, patched | `::before` is positioned and the numeral was not, so the wash painted on top. The numeral now has `position: relative` |
| 2 | `StampSlot` cannot show the word "Empty" | false | In the mockup the word is a sibling below the slot (`screens-core.html:973`), so it is the caller's layout |
| 3 | "Same diameter" conflicts with DESIGN's 72 px slots | low, patched | DESIGN contradicts itself (line 811 against line 775). The comment and test name now say the caller chooses |
| 4 | No `angle` prop | rejected | 0° was decided (D3). The API comes with #78 |
| 5 | The `stampAngle` follow-up has no issue | medium, done | #78 |
| 6 | The `StatusBar` migration is not tracked | low, done | #79, owner Thomas |
| 7 | Call home, 34/26 px and "+N" variants are not acknowledged | low, patched (comment) | The fixed size list was removed. The variants belong to 3.2 and EXT |
| 8 | The next test checks `data-next`, not the styling | low, patched | The CSS is keyed on `data-next` |
| 9 | The destinations test passes with an empty list | low, patched | It now pins the 8 IATA codes |
| 10 | Bad input is not handled | false | The schema enforces `^[A-Z]{3}$` (`schema.ts:99`), and `label` is required by type |
| 11 | Spec metadata is incomplete | low, rejected | `in-progress` is correct until review ends. The traceability is in the Intent |
| 12 | Contrast and forced colours are not addressed | false | DESIGN's contrast table has `slot-dash` on line 658 (decorative), and the next marker is decorative by spec |

Pass 2, Blind Hunter (new context-free subagent, Opus), 11 findings on the patched files:

| # | Finding | Verdict | Evidence / action |
|---|---|---|---|
| 1 | No on-navy slot variant | false for this PR | Nothing in this PR draws a slot on navy. #79 already says to add the variant when the strip moves over |
| 2 | One 11 px serif numeral, while the mockup's 72 px slot uses 15 px sans 700 | low, deferred | DESIGN gives one `slot-numeral` style, and the mockup differs. This matters for 2.5, not 3.3 (50 px). Logged in `deferred-work.md` |
| 3 | The 0° test is weak (a class or `<g>` rotation would pass) | low, rejected | It documents the current decision, and #78 will rewrite it with the angle API |
| 4 | Nothing checks that the CSS variables exist | false | Checked by hand: all 13 `var(--…)` names exist in `tokens.css`, and the 5 colours have dark values |
| 5 | `Stamp` is `block` and `StampSlot` is `inline-flex` | low, patched | Both are now inline with `vertical-align: middle` |
| 6 | No `className`/`style` passthrough | rejected | No caller needs it yet; it would be added when 2.4 or 3.2 needs it |
| 7 | Empty labels; a slot named "Empty" loses its number | low, patched (doc) | `label` is required by type. The comment now asks for "Slot 4, empty"-style names |
| 8 | The geometry assertions pin the markup | rejected | They pin the mockup's geometry on purpose; a change to it should be deliberate |
| 9 | Triage row 12 did not cover forced colours | maybe-false, low, rejected | The next marker is decorative by spec, and the stamp keeps its code and check in any colours |
| 10 | Spec `context` is incomplete | low, patched | The mockup and the 3.3 spec are added to `context` |
| 11 | `size` is not validated; slot border px do not scale | false / rejected | All callers are internal and typed. A fixed 1.5 px slot border matches DESIGN |

## Verification

Run 2026-11-27 on `stamp-component` (base `b571375`), in a worktree that uses the main checkout's `node_modules`:
- `npm run lint`: ESLint and Prettier pass
- `npm test`: 24 files, **413/413** (405 existing + 8 new in `Stamp.test.tsx`)
- `npm run build`: ok
- After both review passes: lint, 413/413 and build were run again and pass.
- Mutation checks: removing the check path, removing `aria-hidden` from an unlabelled slot, and marking every slot as next each make exactly one test fail
- Not checked: how the stamp looks in a browser. Nothing renders it yet, so the visual check (light and dark, 30/50/80/96 px against the mockup) happens in Story 3.3.
