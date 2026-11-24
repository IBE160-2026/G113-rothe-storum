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
  const pushed = useRef(false);

  useEffect(() => {
    onBackRef.current = onBack;
  });

  useEffect(() => {
    function onPopState() {
      if (!pushed.current) return;
      pushed.current = false;
      onBackRef.current();
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const open = useCallback(() => {
    if (pushed.current) return;
    window.history.pushState({ worldboundSheet: true }, "");
    pushed.current = true;
  }, []);

  const close = useCallback(() => {
    if (!pushed.current) return false;
    window.history.back();
    return true;
  }, []);

  return { open, close };
}
