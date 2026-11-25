// Route sheet (FR-4; EXPERIENCE → Route sheet, Option row; DESIGN → Route
// sheet, Option row). One row per mode from routesFrom(): price, days, arrival
// day, availability, reason and the home warning are shown exactly as the
// query returns them (AD-3); the UI only formats them.
// - Rows are native radios in one group (one Tab stop, arrow keys select).
// - Unavailable rows: block icon instead of the radio mark, disabled and
//   aria-disabled, reason in the accessible name.
// - Warning rows stay selectable, never block, and link the warning line with
//   aria-describedby; icon + text, never colour alone.
// - Dialog: role="dialog", aria-modal, labelled by the headline, initial focus
//   on the headline, Tab wraps inside (wrapTab, #49), Esc closes.
// Confirming travel is Story 1.7: until `onConfirm` is given, the primary
// button is shown but unavailable.
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { RouteView, TransportMode, TravelOption } from "../../rules/types";
import { Icon } from "../components/Icon";
import { copy } from "../copy";
import controls from "../styles/controls.module.css";
import { wrapTab } from "./focusTrap";
import styles from "./RouteSheet.module.css";

interface Props {
  route: RouteView;
  fromName: string;
  toName: string;
  toIsHome: boolean;
  toStamped: boolean;
  /** Current money, for the "you have" part of the reason. */
  money: number;
  /** The journey's total days (daysTotal), for the over-the-limit reason. */
  daysTotal: number;
  onRequestClose: () => void;
  /** Story 1.7. Without it the primary button stays unavailable. */
  onConfirm?: (mode: TransportMode) => void;
}

function reasonText(option: TravelOption, money: number, total: number) {
  switch (option.reason) {
    case "NOT_ENOUGH_MONEY":
      return copy.route.notEnoughMoney(money);
    case "NOT_ENOUGH_DAYS":
      return copy.route.notEnoughDays(option.arrivalDay, total);
    case null:
      return null;
    default:
      return copy.route.unavailable;
  }
}

export function RouteSheet({
  route,
  fromName,
  toName,
  toIsHome,
  toStamped,
  money,
  daysTotal,
  onRequestClose,
  onConfirm,
}: Props) {
  const id = useId();
  const titleId = `${id}-title`;
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [selected, setSelected] = useState<TransportMode | null>(null);
  const chosen = route.options.find((o) => o.mode === selected && o.available);
  const noneFits = route.options.every((o) => !o.available);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onRequestClose();
      return;
    }
    if (sheetRef.current) wrapTab(event, sheetRef.current, titleRef.current);
  }

  const primaryLabel = !chosen
    ? copy.route.choose
    : toIsHome
      ? copy.route.continueHome(chosen.price)
      : copy.route.primary(copy.route.verb[chosen.mode], chosen.price);
  const primaryEnabled = chosen !== undefined && onConfirm !== undefined;

  return (
    <div className={styles.layer}>
      <div
        className={styles.scrim}
        aria-hidden="true"
        onClick={onRequestClose}
      />
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
      >
        <div className={styles.header}>
          <div>
            <h2
              id={titleId}
              ref={titleRef}
              tabIndex={-1}
              className={styles.title}
            >
              {copy.route.header(fromName, toName)}
            </h2>
            {!toIsHome && (
              <p className={styles.status}>
                {toStamped
                  ? copy.route.stamped(toName)
                  : copy.route.notStamped(toName)}
              </p>
            )}
          </div>
          <button
            type="button"
            className={controls.iconButton}
            aria-label={copy.route.close}
            onClick={onRequestClose}
          >
            <Icon name="close" size={22} />
          </button>
        </div>

        <fieldset className={styles.options}>
          <legend className={controls.visuallyHidden}>
            {copy.route.options}
          </legend>
          {route.options.map((option) => {
            const reason = reasonText(option, money, daysTotal);
            const warningId = `${id}-${option.mode}-warning`;
            const rowClass = [
              styles.row,
              !option.available && styles.unavailable,
              selected === option.mode && styles.selected,
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <label
                key={option.mode}
                className={rowClass}
                data-mode={option.mode}
              >
                <input
                  type="radio"
                  name={`${id}-mode`}
                  value={option.mode}
                  className={controls.visuallyHidden}
                  checked={selected === option.mode}
                  disabled={!option.available}
                  aria-disabled={!option.available || undefined}
                  aria-describedby={
                    option.homeUnreachable ? warningId : undefined
                  }
                  onChange={() => setSelected(option.mode)}
                />
                <span className={styles.mark} aria-hidden="true">
                  {option.available ? (
                    <span className={styles.radio} />
                  ) : (
                    <Icon name="block" size={20} />
                  )}
                </span>
                <Icon
                  name={option.mode}
                  size={22}
                  className={styles.modeIcon}
                />
                <span className={styles.body}>
                  <span className={styles.mode}>
                    {copy.route.modeName[option.mode]}
                  </span>
                  <span className={styles.meta}>
                    {copy.route.row(option.days, option.arrivalDay + 1)}
                  </span>
                  {reason && <span className={styles.reason}>{reason}</span>}
                  {option.homeUnreachable && (
                    <span id={warningId} className={styles.warning}>
                      <Icon name="warning" size={16} />
                      {copy.route.warning}
                    </span>
                  )}
                </span>
                <span className={styles.price}>
                  {copy.route.price(option.price)}
                </span>
              </label>
            );
          })}
        </fieldset>

        {noneFits && (
          <p className={styles.noneFits}>
            {copy.route.noneFits(fromName, money)}
          </p>
        )}

        <button
          type="button"
          className={controls.primary}
          aria-disabled={!primaryEnabled || undefined}
          onClick={() => {
            if (chosen && onConfirm) onConfirm(chosen.mode);
          }}
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
}
