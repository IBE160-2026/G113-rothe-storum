// Arrival fact card (Story 2.3; FR-5, UX-DR1, UX-DR3; EXPERIENCE → Arrival
// fact card, Copy → arrival / arrival.repeat; DESIGN → Arrival fact card,
// Fact card). Two modes:
// - arrival: opens after a trip to a destination (wired with Story 1.7, PR
//   #73). Eyebrow with day, total and money, "Welcome to {city}" or "Back in
//   {city}", the trip pill, the fact card, "Plan the day" (or unavailable with
//   its reason), the cost line, "Just passing through" and the stamp line.
// - read: reopened from "About {city}"; the fact card only, × closes.
// Availability, reason and the stay price come from `cityDayStatus()` (AD-3);
// "stamped" is the game state. The street drawing behind the sheet is pending
// (`streetDrawing` and the 8 SVGs, spec-2-3); a paper background stands in.
// Dialog: role="dialog", aria-modal, labelled by the headline, initial focus
// on the headline, Tab wraps inside (wrapTab), Esc and × close.
import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import type { CityDayStatus, TransportMode } from "../../rules/types";
import { Icon } from "../components/Icon";
import { copy } from "../copy";
import controls from "../styles/controls.module.css";
import styles from "./ArrivalSheet.module.css";
import { wrapTab } from "./focusTrap";

/** The trip that just ended, as the player confirmed it (UI state). */
export interface ArrivalTrip {
  mode: TransportMode;
  from: string;
  days: number;
  price: number;
}

interface Props {
  mode: "arrival" | "read";
  city: string;
  fact: string;
  /** From `cityDayStatus(state, content)`. */
  cityDay: CityDayStatus;
  /** The player already has this city's stamp (game state). */
  stamped: boolean;
  /** "Day X" label, X = daysUsed + 1 capped (spine Conventions → Days). */
  day: number;
  daysTotal: number;
  money: number;
  /** Arrival mode only. */
  trip?: ArrivalTrip;
  /** Arrival mode: "Plan the day". City day is Story 2.4. */
  onPlanDay?: () => void;
  /** ×, Esc and "Just passing through". */
  onClose: () => void;
}

function unavailableReason(cityDay: CityDayStatus, money: number) {
  switch (cityDay.reason) {
    case "NOT_ENOUGH_MONEY":
      return copy.arrival.notEnoughMoney(money);
    case "NOT_ENOUGH_DAYS":
      return copy.arrival.noDays;
    default:
      return null;
  }
}

export function ArrivalSheet({
  mode,
  city,
  fact,
  cityDay,
  stamped,
  day,
  daysTotal,
  money,
  trip,
  onPlanDay,
  onClose,
}: Props) {
  const id = useId();
  const titleId = `${id}-title`;
  const reasonId = `${id}-reason`;
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reading = mode === "read";

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

  const title = reading
    ? copy.arrival.about(city)
    : stamped
      ? copy.arrival.backIn(city)
      : copy.arrival.welcome(city);
  const reason = cityDay.available ? null : unavailableReason(cityDay, money);

  return (
    <div className={styles.layer}>
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-mode={mode}
        onKeyDown={onKeyDown}
      >
        <div className={styles.header}>
          {reading ? (
            <span />
          ) : (
            <p className={styles.eyebrow}>
              {copy.arrival.eyebrow(day, daysTotal, money)}
            </p>
          )}
          <button
            type="button"
            className={controls.iconButton}
            aria-label={copy.arrival.close}
            onClick={onClose}
          >
            <Icon name="close" size={22} />
          </button>
        </div>

        <h2 id={titleId} ref={titleRef} tabIndex={-1} className={styles.title}>
          {title}
        </h2>

        {!reading && trip && (
          <p className={styles.pill}>
            <Icon name={trip.mode} size={16} className={styles.pillIcon} />
            {copy.arrival.trip(trip.mode, trip.from, trip.days, trip.price)}
          </p>
        )}

        <section className={styles.fact} aria-label={copy.arrival.about(city)}>
          {!reading && (
            <p className={styles.factCaption}>{copy.arrival.about(city)}</p>
          )}
          <p className={styles.factText}>{fact}</p>
        </section>

        {!reading && (
          <>
            <button
              type="button"
              className={controls.primary}
              aria-disabled={!cityDay.available || undefined}
              aria-describedby={reason ? reasonId : undefined}
              onClick={() => {
                if (cityDay.available) onPlanDay?.();
              }}
            >
              {copy.arrival.planDay}
            </button>
            {reason ? (
              <p id={reasonId} className={styles.consequence}>
                {reason}
              </p>
            ) : (
              cityDay.stayPrice !== null && (
                <p className={styles.consequence}>
                  {stamped
                    ? copy.arrival.costRepeat(cityDay.stayPrice)
                    : copy.arrival.costFirst(cityDay.stayPrice, city)}
                </p>
              )
            )}
            <button
              type="button"
              className={styles.secondary}
              onClick={onClose}
            >
              {copy.arrival.passThrough}
            </button>
            <p className={styles.stampLine}>
              {stamped ? copy.arrival.stamped(city) : copy.arrival.noStampYet}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
