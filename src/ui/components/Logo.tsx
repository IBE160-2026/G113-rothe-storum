// Stand-in for the WORLDBOUND wordmark (DESIGN.md → Logo) until the vector
// redraw exists as `assets/brand/logo.svg`: type plus an inline compass-rose O
// with an ochre north needle. Decorative; the accessible name is given by the
// heading or control that contains it.
import styles from "./Logo.module.css";

export function Logo({ size = "small" }: { size?: "small" | "large" }) {
  return (
    <span
      className={size === "large" ? styles.large : styles.small}
      aria-hidden="true"
    >
      W
      <svg className={styles.compass} viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path d="M16 4 L19.5 16 L12.5 16 Z" fill="var(--color-logo-ochre)" />
        <path d="M16 28 L12.5 16 L19.5 16 Z" fill="currentColor" />
      </svg>
      RLDBOUND
    </span>
  );
}
