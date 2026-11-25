// Browser and Android Back close the topmost sheet, the same as Esc
// (EXPERIENCE → Back navigation, UX-DR2). Opening a sheet pushes one history
// entry; Back pops it and the `popstate` listener closes the sheet. Closing
// from the UI (×, scrim, Esc) calls `history.back()`, so the entry is removed
// and the history never grows. The entry is pushed from the event handler
// that opens the sheet, never from an effect, so StrictMode's double effects
// cannot push twice.
import { useCallback, useEffect, useRef } from "react";

export interface BackToClose {
  /** Call when the sheet opens. */
  open: () => void;
  /**
   * Call to close from the UI. Returns true when a history entry is being
   * popped (`onBack` then runs on `popstate`); false when there is none, so
   * the caller closes directly.
   */
  close: () => boolean;
}

export function useBackToClose(onBack: () => void): BackToClose {
  const onBackRef = useRef(onBack);
  /** Our entry is on the history stack and not yet being popped. */
  const pushed = useRef(false);
  /** `close()` called `history.back()`; its `popstate` has not arrived yet. */
  const closing = useRef(false);

  useEffect(() => {
    onBackRef.current = onBack;
  });

  useEffect(() => {
    function onPopState() {
      if (!pushed.current && !closing.current) return;
      pushed.current = false;
      closing.current = false;
      onBackRef.current();
    }
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      // #65: unmounting with a sheet still open (for example a confirmed trip
      // that ends the journey) would leave the entry behind, and the next
      // Back would seem to do nothing. Pop it; no listener is left to react.
      // Not when close() already popped it: that would go back twice.
      if (pushed.current) {
        pushed.current = false;
        window.history.back();
      }
    };
  }, []);

  const open = useCallback(() => {
    if (pushed.current) return;
    window.history.pushState({ worldboundSheet: true }, "");
    pushed.current = true;
  }, []);

  const close = useCallback(() => {
    if (!pushed.current) return false;
    pushed.current = false;
    closing.current = true;
    window.history.back();
    return true;
  }, []);

  return { open, close };
}
