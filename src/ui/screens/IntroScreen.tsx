// One-screen intro, "How to play" (FR-2; EXPERIENCE → IA → Intro, Component
// Patterns → Intro, mockup S2). Goal, money and days come from content, never
// from literals. Variants:
// - firstVisit: no ×; "Let's go" starts the journey.
// - fromStart: × and "Got it", both back to Start.
// - inJourney: × and "Back to my journey", both back to the journey.
// Focus moves to the headline when the screen opens (EXPERIENCE → Focus).
import { useEffect, useRef } from "react";
import { useContent } from "../../app/content";
import { Logo } from "../components/Logo";
import { copy } from "../copy";
import controls from "../styles/controls.module.css";
import styles from "./IntroScreen.module.css";

export type IntroVariant = "firstVisit" | "fromStart" | "inJourney";

interface Props {
  variant: IntroVariant;
  /** The primary button: start the journey, or go back. */
  onContinue: () => void;
  /** The ×; only shown when the intro was reopened. */
  onClose: () => void;
}

const PRIMARY_LABEL: Record<IntroVariant, string> = {
  firstVisit: copy.intro.letsGo,
  fromStart: copy.intro.gotIt,
  inJourney: copy.intro.backToJourney,
};

export function IntroScreen({ variant, onContinue, onClose }: Props) {
  const { config } = useContent();
  const { startMoney, totalDays } = config.modes.explorer;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const t = copy.intro;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main className={styles.screen}>
      <div className={styles.topBar}>
        <Logo />
        {variant !== "firstVisit" && (
          <button
            type="button"
            className={controls.iconButton}
            aria-label={t.close}
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
        )}
      </div>

      <p className={styles.caption}>{t.caption}</p>
      <h1 ref={headingRef} tabIndex={-1} className={styles.heading}>
        {t.heading}
      </h1>

      <section className={styles.goalBox} aria-labelledby="intro-goal">
        <p id="intro-goal" className={styles.goalCaption}>
          {t.goalCaption}
        </p>
        <p className={styles.goal}>{t.goal(config.goalStamps, totalDays)}</p>
        <ol className={styles.slots} aria-hidden="true">
          {Array.from({ length: config.goalStamps }, (_, i) => (
            <li key={i} className={styles.slot}>
              {i + 1}
            </li>
          ))}
        </ol>
      </section>

      <dl className={styles.chips}>
        <div className={styles.chip}>
          <dt className={styles.chipLabel}>{t.moneyLabel}</dt>
          <dd className={styles.chipValue}>{t.money(startMoney)}</dd>
        </div>
        <div className={styles.chip}>
          <dt className={styles.chipLabel}>{t.daysLabel}</dt>
          <dd className={styles.chipValue}>{t.days(totalDays)}</dd>
        </div>
      </dl>

      <ol className={styles.steps}>
        {t.steps.map((step, i) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.stepDisc} aria-hidden="true">
              {i + 1}
            </span>
            <span>
              <strong className={styles.stepTitle}>{step.title}</strong>
              <span className={styles.stepBody}>{step.body}</span>
            </span>
          </li>
        ))}
      </ol>

      <button type="button" className={controls.primary} onClick={onContinue}>
        {PRIMARY_LABEL[variant]}
      </button>
      {variant === "firstVisit" && (
        <p className={styles.hint}>{t.reopenHint}</p>
      )}
    </main>
  );
}
