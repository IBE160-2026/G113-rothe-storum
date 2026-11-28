// usePolaroidSheet: one place for opening the Polaroid sheet from a screen
// (Album tab, Journey summary, Day complete, the Album line on City day).
// It gives every opener the same behaviour as the other sheets: one history
// entry while open, so browser Back closes it (useBackToClose, UX-DR2);
// focus back on the print that opened it; and `isOpen` for the screen's
// `inert`. The sheet always closes through `close()` and the `popstate` that
// follows, never at once, so a late `popstate` cannot close a newer sheet
// (PR #73 review, finding 1). It opens only from a screen, never over
// another sheet (spec-polaroid-and-polaroid-sheet).
//
//   const polaroid = usePolaroidSheet();
//   <main inert={polaroid.isOpen}>
//     <Polaroid {...print} onOpen={(el) => polaroid.open(entry, el)} />
//   </main>
//   {polaroid.sheet}
import { useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { useContent } from "../../app/content";
import type { AlbumEntry } from "../../rules/types";
import { resolveAlbumEntry } from "../components/Polaroid";
import { PolaroidSheet } from "../sheets/PolaroidSheet";
import { useBackToClose } from "./useBackToClose";

export interface PolaroidSheetControl {
  /**
   * Opens the sheet for an album entry. Does nothing for a sight that is not
   * in the content, or while a sheet is already open.
   */
  open: (entry: AlbumEntry, opener: HTMLElement | null) => void;
  /** True while the sheet is open: the screen behind it is `inert`. */
  isOpen: boolean;
  /** The sheet to render after the screen, or `null`. */
  sheet: ReactNode;
}

export function usePolaroidSheet(): PolaroidSheetControl {
  const content = useContent();
  const [entry, setEntry] = useState<AlbumEntry | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  // A close is under way: history.back() has been called and its popstate has
  // not arrived. On `main`, useBackToClose keeps its entry marked until then,
  // so a second Esc or × (key repeat, double tap) would go back twice and
  // could leave the app.
  const closing = useRef(false);

  function closeSheet() {
    // Commit first: until then the screen is inert and ignores focus().
    closing.current = false;
    flushSync(() => setEntry(null));
    openerRef.current?.focus();
  }

  const back = useBackToClose(closeSheet);

  function open(next: AlbumEntry, opener: HTMLElement | null) {
    if (entry !== null) return;
    if (resolveAlbumEntry(next, content) === null) return;
    openerRef.current = opener;
    back.open();
    setEntry(next);
  }

  function requestClose() {
    if (closing.current) return;
    closing.current = true;
    if (!back.close()) closeSheet();
  }

  const print = entry === null ? null : resolveAlbumEntry(entry, content);
  return {
    open,
    isOpen: print !== null,
    sheet:
      print === null ? null : (
        <PolaroidSheet
          sight={print.sight}
          city={print.city}
          day={print.day}
          onClose={requestClose}
        />
      ),
  };
}
