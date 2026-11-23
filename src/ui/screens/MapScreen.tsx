// Placeholder for the Map until Story 1.6 builds it (EXPERIENCE → IA → Map).
// Story 1.5 only needs the journey to land somewhere after the start, and the
// menu button so the intro can be reopened from the menu (FR-2). It has the
// top bar (logo + menu button) and the visually hidden "Map" heading that
// EXPERIENCE → Accessibility names; focus moves to it when the screen opens.
import { useEffect, useRef, type Ref } from "react";
import { Logo } from "../components/Logo";
import { copy } from "../copy";
import controls from "../styles/controls.module.css";
import styles from "./MapScreen.module.css";

interface Props {
  onOpenMenu: () => void;
  /** The menu button, so focus can return to it when the menu closes. */
  menuButtonRef: Ref<HTMLButtonElement>;
  /** True while a sheet is open over the screen (the screen is then inert). */
  inert: boolean;
}

export function MapScreen({ onOpenMenu, menuButtonRef, inert }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main className={styles.screen} inert={inert}>
      <div className={styles.topBar}>
        <Logo />
        <button
          ref={menuButtonRef}
          type="button"
          className={controls.iconButton}
          aria-label={copy.menu.open}
          aria-haspopup="dialog"
          onClick={onOpenMenu}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <h1 ref={headingRef} tabIndex={-1} className={controls.visuallyHidden}>
        {copy.map.heading}
      </h1>
    </main>
  );
}
