// Menu sheet, Story 1.5 part (EXPERIENCE → IA → Menu sheet; Component Patterns
// → Modal sheet). Only the "How to play" row (FR-2): "Album" and "New journey"
// with its confirm come with the stories that own the album and the running
// journey. Modal semantics: role="dialog", aria-modal, labelled by its title;
// initial focus on the title; Tab wraps inside; Esc, × and the scrim close it.
// The opener returns focus to its trigger and makes the background inert.
import { useEffect, useRef, type KeyboardEvent } from "react";
import { copy } from "../copy";
import controls from "../styles/controls.module.css";
import styles from "./MenuSheet.module.css";

interface Props {
  onClose: () => void;
  onHowToPlay: () => void;
}

export function MenuSheet({ onClose, onHowToPlay }: Props) {
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
    if (event.key !== "Tab" || !sheetRef.current) return;
    const focusable = sheetRef.current.querySelectorAll<HTMLElement>("button");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === titleRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className={styles.layer}>
      <div className={styles.scrim} aria-hidden="true" onClick={onClose} />
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
        onKeyDown={onKeyDown}
      >
        <div className={styles.header}>
          <h2
            id="menu-title"
            ref={titleRef}
            tabIndex={-1}
            className={styles.title}
          >
            {copy.menu.title}
          </h2>
          <button
            type="button"
            className={controls.iconButton}
            aria-label={copy.menu.close}
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <button type="button" className={styles.row} onClick={onHowToPlay}>
          {copy.menu.howToPlay}
        </button>
      </div>
    </div>
  );
}
