// Tab wrapping for modal sheets (EXPERIENCE → Component Patterns → Modal
// sheet: Tab wraps inside). Shared, so every sheet (menu, route sheet, call
// home, can't continue) traps focus the same way (#49).

/**
 * Everything a keyboard user can Tab to: links with an href, enabled form
 * controls, and elements given a non-negative tabindex. Elements with
 * tabindex="-1" (such as a sheet title that gets the initial focus) are left
 * out, as the browser leaves them out of the Tab order.
 */
const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "audio[controls]",
  "video[controls]",
  '[contenteditable]:not([contenteditable="false"])',
  "[tabindex]",
].join(",");

/** The elements inside `root` that Tab can reach, in document order. */
export function focusableIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.hasAttribute("disabled") &&
      element.closest("[inert]") === null,
  );
}

/**
 * Keeps Tab inside `root`: Tab on the last focusable element goes to the
 * first, Shift+Tab on the first (or on `start`, the element that holds the
 * initial focus, such as the title) goes to the last. Other keys are ignored.
 */
export function wrapTab(
  event: { key: string; shiftKey: boolean; preventDefault: () => void },
  root: HTMLElement,
  start?: HTMLElement | null,
): void {
  if (event.key !== "Tab") return;
  const focusable = focusableIn(root);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) {
    event.preventDefault();
    return;
  }
  const active = document.activeElement;
  if (event.shiftKey && (active === first || (start && active === start))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  } else if (!(active instanceof Node) || !root.contains(active)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  }
}
