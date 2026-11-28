// Round ink stamp and empty stamp slot (DESIGN.md → Stamp, Stamp slot), shared
// by the Journey summary (50 px), the Passport (80 px) and Day complete (96 px).
// Geometry from the `st-cph` symbol in mockups/screens-core.html, in a 50-unit
// viewBox. The angle is 0° until `stampAngle` exists in the content (Story 3.3
// spec, D3). Text for screen readers comes from the caller, so all copy stays
// in copy.ts with the screen that uses the stamp.
import type { CSSProperties } from "react";
import styles from "./Stamp.module.css";

interface StampProps {
  /** The destination's 3-letter IATA code, drawn inside the stamp. */
  code: string;
  /** Accessible name, for example "Paris stamp". */
  label: string;
  /** Diameter in CSS px, chosen by the caller (for example 50 on the summary). */
  size?: number;
}

export function Stamp({ code, label, size = 50 }: StampProps) {
  return (
    <svg
      className={styles.stamp}
      viewBox="0 0 50 50"
      width={size}
      height={size}
      role="img"
      aria-label={label}
    >
      <circle className={styles.ring} cx="25" cy="25" r="22" />
      <circle className={styles.innerRing} cx="25" cy="25" r="17" />
      {/* Below 70 px the code is part of the graphic, not text (DESIGN →
          Typography, stamp-code exception); the label carries the city. */}
      <text className={styles.code} x="25" y="22" textAnchor="middle">
        {code}
      </text>
      <path className={styles.check} d="M18 27l5 5 9-9" />
    </svg>
  );
}

interface StampSlotProps {
  /** Slot number, 1 to the goal's stamp count. */
  numeral: number;
  /**
   * Diameter in CSS px, chosen by the caller. Usually the same as the stamps
   * beside it (DESIGN → Stamp slot), but the Stamps page uses 72 px slots
   * next to 80 px stamps (DESIGN → Stamp page).
   */
  size?: number;
  /**
   * The next slot to fill: an ochre ring and wash, decorative only. The CSS
   * is keyed on `data-next`, so the attribute and the styling cannot drift.
   */
  next?: boolean;
  /**
   * Accessible name. Include the number, for example "Slot 4, empty",
   * because the visible numeral is hidden from screen readers. Without a
   * label the slot is hidden too, and the caller describes the row as a whole.
   */
  label?: string;
}

export function StampSlot({
  numeral,
  size = 50,
  next = false,
  label,
}: StampSlotProps) {
  const style: CSSProperties = { width: size, height: size };
  return (
    <span
      className={styles.slot}
      style={style}
      data-next={next ? "true" : undefined}
      {...(label === undefined
        ? { "aria-hidden": true }
        : { role: "img", "aria-label": label })}
    >
      <span className={styles.numeral} aria-hidden="true">
        {numeral}
      </span>
    </span>
  );
}
