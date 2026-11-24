// Status chips and passport strip, always visible on the Map (FR-3;
// EXPERIENCE → Status chip, Passport strip; DESIGN → Status chip). Values come
// from the game state and the rules queries; the UI only formats them. Not a
// live region: values change only after a committed action.
// The strip opens the Passport in Story 2.5; here it only shows the count.
import { useContent } from "../../app/content";
import { daysRemaining, daysTotal } from "../../rules/queries";
import type { GameState } from "../../rules/types";
import { copy } from "../copy";
import { Icon } from "./Icon";
import styles from "./StatusBar.module.css";

export function StatusBar({ game }: { game: GameState }) {
  const content = useContent();
  const total = daysTotal(game, content);
  const left = daysRemaining(game, content);
  // `{day}` format rule: min(daysUsed + 1, N), never "Day 31".
  const day = Math.min(game.daysUsed + 1, total);
  const goal = content.config.goalStamps;
  const names = new Map(content.destinations.map((d) => [d.id, d.name]));
  const stampedCities = game.stamps.map((s) => names.get(s.id) ?? s.id);

  return (
    <div className={styles.bar}>
      <div className={styles.chips}>
        <p className={`${styles.chip} ${styles.dayChip}`}>
          <Icon name="calendar" size={18} className={styles.icon} />
          <span className={styles.text}>
            <span className={styles.value}>{copy.status.day(day, total)}</span>
            <span className={styles.label}>{copy.status.left(left)}</span>
          </span>
        </p>
        <p className={styles.chip}>
          <Icon name="coin" size={18} className={styles.icon} />
          <span className={styles.text}>
            <span className={styles.value}>
              {copy.status.moneyValue(game.money)}
            </span>
            <span className={styles.label}>{copy.status.money}</span>
          </span>
        </p>
      </div>
      <div
        className={styles.strip}
        role="img"
        aria-label={copy.status.stripLabel(
          game.stamps.length,
          goal,
          stampedCities,
        )}
      >
        <span className={styles.stripMode} aria-hidden="true">
          {copy.status.strip(game.stamps.length, goal)}
        </span>
        <span className={styles.slots} aria-hidden="true">
          {Array.from({ length: goal }, (_, i) => (
            <span
              key={i}
              className={
                i < game.stamps.length
                  ? `${styles.slot} ${styles.slotFilled}`
                  : styles.slot
              }
            >
              {i < game.stamps.length ? "✓" : i + 1}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
