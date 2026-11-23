// Optional traveller name (FR-1; EXPERIENCE → Component Patterns → Name field).
// Length is counted in graphemes after trimming, so "æ", "ø" or an emoji count
// as one; input stops at 14. The counter is linked with aria-describedby and the
// limit is announced politely. The preview shows the name exactly as the rules
// will store it (normalizeName), so the UI never re-implements the name rule.
import { useId } from "react";
import { MAX_NAME_GRAPHEMES, normalizeName } from "../../rules/journey";
import { copy } from "../copy";
import styles from "./NameField.module.css";

const graphemes = new Intl.Segmenter("en", { granularity: "grapheme" });

function splitGraphemes(text: string): string[] {
  return Array.from(graphemes.segment(text), (s) => s.segment);
}

/** Graphemes of the trimmed value: what the counter shows. */
export function nameLength(value: string): number {
  return splitGraphemes(value.trim()).length;
}

/**
 * Keeps typing and pasting within the limit: leading spaces are dropped and at
 * most 14 graphemes are kept, so the trimmed name never exceeds the limit.
 */
export function limitName(value: string): string {
  return splitGraphemes(value.trimStart())
    .slice(0, MAX_NAME_GRAPHEMES)
    .join("");
}

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function NameField({ value, onChange }: Props) {
  const id = useId();
  const inputId = `${id}-input`;
  const counterId = `${id}-counter`;
  const helpId = `${id}-help`;
  const count = nameLength(value);
  const { travellerName } = normalizeName(value);
  const t = copy.start.name;

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={inputId} className={styles.label}>
          {t.label} <span className={styles.optional}>{t.optional}</span>
        </label>
        <span id={counterId} className={styles.counter}>
          {t.counter(count, MAX_NAME_GRAPHEMES)}
        </span>
      </div>
      <div className={styles.inputWrap}>
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
          <circle
            cx="12"
            cy="8"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <input
          id={inputId}
          className={styles.input}
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder={t.placeholder}
          value={value}
          aria-describedby={`${counterId} ${helpId}`}
          onChange={(event) => onChange(limitName(event.target.value))}
        />
      </div>
      <p id={helpId} className={styles.help}>
        {t.help}{" "}
        <span className={styles.miniCover}>
          {t.passportMode} · <i>{travellerName}</i>
        </span>
      </p>
      <p className={styles.visuallyHidden} aria-live="polite">
        {count === MAX_NAME_GRAPHEMES ? t.atLimit(MAX_NAME_GRAPHEMES) : ""}
      </p>
    </div>
  );
}
