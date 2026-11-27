// Polaroid sheet (DESIGN.md → Polaroid sheet; EXPERIENCE → Polaroid sheet):
// a read-only modal sheet with one large print, the photo at full sheet
// width (4:3), the title, place and day, and the whole fact. It changes
// nothing in the game (FR-22, Decision G). Modal semantics as MenuSheet:
// role="dialog", aria-modal, labelled by its title; initial focus on the
// title; Tab wraps inside (focusTrap.ts); Esc, × and the scrim close it.
// usePolaroidSheet() owns Back, the inert background and focus return.
import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import type { Sight } from "../../rules/types";
import { Icon } from "../components/Icon";
import { sightImageUrl } from "../components/Polaroid";
import { copy } from "../copy";
import controls from "../styles/controls.module.css";
import { wrapTab } from "./focusTrap";
import styles from "./PolaroidSheet.module.css";

interface Props {
  sight: Sight;
  city: string;
  day: number;
  onClose: () => void;
}

export function PolaroidSheet({ sight, city, day, onClose }: Props) {
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (sheetRef.current) wrapTab(event, sheetRef.current, titleRef.current);
  }

  return (
    <div className={styles.layer}>
      <div className={styles.scrim} aria-hidden="true" onClick={onClose} />
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        // A click on the photo or text focuses the dialog rather than the page,
        // so Esc and Tab still reach onKeyDown.
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <div className={styles.header}>
          <button
            type="button"
            className={controls.iconButton}
            aria-label={copy.polaroid.close}
            onClick={onClose}
          >
            <Icon name="close" size={22} />
          </button>
        </div>
        <div className={styles.print}>
          <span className={styles.photo}>
            <img src={sightImageUrl(sight)} alt="" />
          </span>
          <h2
            id={titleId}
            ref={titleRef}
            tabIndex={-1}
            className={styles.title}
          >
            {sight.name}
          </h2>
          <p className={styles.meta}>{copy.polaroid.meta(city, day)}</p>
          <p className={styles.fact}>{sight.fact}</p>
        </div>
      </div>
    </div>
  );
}
