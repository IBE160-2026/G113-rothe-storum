// City-day card on the Map (Story 2.3, decision A by Thomas 2026-11-28;
// EXPERIENCE → Component Patterns → City-day card, Copy → map.card,
// map.card.repeat, map.card.unavailable; DESIGN → City-day card). Shown at a
// destination, never at home. "Plan the day" opens City day (Story 2.4; the
// caller decides), "About {city}" reopens the Arrival fact card in read mode
// (FR-5). When the city day is unavailable (FR-8), "Plan the day" is
// unavailable with its reason. Availability, reason and price come from
// `cityDayStatus()` (AD-3); "stamped" is the game state.
// Not here: the "Call home" button while FR-12 holds (Story 3.2) and the
// [EXT] work variant.
import type { CityDayStatus } from "../../rules/types";
import { copy } from "../copy";
import controls from "../styles/controls.module.css";
import styles from "./CityDayCard.module.css";
import { Icon } from "./Icon";

interface Props {
  city: string;
  /** From `cityDayStatus(state, content)`; `stayPrice` is set away from home. */
  cityDay: CityDayStatus;
  stamped: boolean;
  /** Current money, for the "you have" part of the reason. */
  money: number;
  onPlanDay?: () => void;
  /** Reopens the fact card; the button is passed so focus can return to it. */
  onAbout: (opener: HTMLButtonElement) => void;
}

export function CityDayCard({
  city,
  cityDay,
  stamped,
  money,
  onPlanDay,
  onAbout,
}: Props) {
  if (cityDay.stayPrice === null) return null;
  const reason = cityDay.available
    ? null
    : cityDay.reason === "NOT_ENOUGH_DAYS"
      ? copy.arrival.noDays
      : cityDay.reason === "NOT_ENOUGH_MONEY"
        ? copy.arrival.notEnoughMoney(money)
        : null;

  return (
    <section className={styles.card} aria-labelledby="city-day-card-title">
      <p className={styles.eyebrow}>{copy.map.card.eyebrow(city)}</p>
      <h2 id="city-day-card-title" className={styles.title}>
        {copy.map.card.title(city, cityDay.stayPrice)}
      </h2>
      <p className={styles.hint}>
        <Icon name="stamp" size={16} className={styles.hintIcon} />
        {stamped
          ? copy.map.card.hintRepeat(city)
          : copy.map.card.hintFirst(city)}
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.small}
          aria-disabled={!cityDay.available || undefined}
          aria-describedby={reason ? "city-day-card-reason" : undefined}
          onClick={() => {
            if (cityDay.available) onPlanDay?.();
          }}
        >
          {copy.map.card.planDay}
        </button>
        <button
          type="button"
          className={controls.textLink}
          aria-haspopup="dialog"
          onClick={(event) => onAbout(event.currentTarget)}
        >
          {copy.map.card.about(city)}
        </button>
      </div>
      {reason && (
        <p id="city-day-card-reason" className={styles.reason}>
          {reason}
        </p>
      )}
    </section>
  );
}
