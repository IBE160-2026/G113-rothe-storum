// TEMPORARY journey end (Story 1.7, approved by Thomas and Christian on PR
// #70) until Story 3.2 (Can't-continue sheet) and Story 3.3 (Journey summary)
// replace it. It only shows what the rules already decided: `outcome`,
// `failReason` and `calledHome` from the game state (evaluateEnd, AD-2). No
// new mechanics, no summary details (stamps, album, days): those are 3.3.
// Headlines and labels come from EXPERIENCE → Copy templates → sum.*.
import { useEffect, useRef } from "react";
import { useContent } from "../../app/content";
import type { GameState } from "../../rules/types";
import { Logo } from "../components/Logo";
import { copy } from "../copy";
import controls from "../styles/controls.module.css";
import styles from "./TemporaryJourneyEnd.module.css";

interface Props {
  game: GameState;
  onNewJourney: () => void;
}

export function TemporaryJourneyEnd({ game, onNewJourney }: Props) {
  const content = useContent();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const city =
    content.destinations.find((d) => d.id === game.position)?.name ??
    content.home.name;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const headline =
    game.outcome === "goalReached"
      ? copy.end.reached
      : game.outcome === "failed"
        ? copy.end.failed
        : copy.end.notReached;
  const reason =
    game.failReason === "stranded"
      ? copy.end.stranded(city)
      : game.failReason === "outOfDays"
        ? copy.end.outOfDays(city)
        : null;

  return (
    <main className={styles.screen} data-temporary="journey-end">
      <Logo />
      <h1 ref={headingRef} tabIndex={-1} className={styles.title}>
        {headline}
      </h1>
      {reason && <p className={styles.reason}>{reason}</p>}
      <ul className={styles.labels}>
        <li>
          {game.outcome === "goalReached"
            ? copy.end.goalReached
            : copy.end.goalNotReached}
        </li>
        {game.calledHome && <li>{copy.end.calledHome}</li>}
      </ul>
      <button type="button" className={controls.primary} onClick={onNewJourney}>
        {copy.end.newJourney}
      </button>
    </main>
  );
}
