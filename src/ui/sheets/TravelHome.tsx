// Travel home content (FR-7; EXPERIENCE → Travel home sheet, Copy → home;
// DESIGN → Travel home sheet). It swaps into the Route sheet when the player
// continues on a route to Bergen; "Not now" goes back one step to the route
// content with nothing changed, and the primary commits the trip.
// Pending #71 (travelPreview(), owned by Christian): the goal line ("Goal will
// be reached" / "You have {n} of 5 stamps — goal not reached") and the money
// and day before/after boxes. They need the rules' answer, so they are not
// shown until travelPreview() is merged (spec-1-7). Nothing here computes a
// rule: the stamp count is the game state, the rest is the chosen option.
import type { Ref } from "react";
import type { TravelOption } from "../../rules/types";
import { Icon } from "../components/Icon";
import { copy } from "../copy";
import controls from "../styles/controls.module.css";
import styles from "./RouteSheet.module.css";

interface Props {
  option: TravelOption;
  fromName: string;
  stamps: number;
  goalStamps: number;
  titleId: string;
  titleRef: Ref<HTMLHeadingElement>;
  onConfirm: () => void;
  onNotNow: () => void;
}

export function TravelHome({
  option,
  fromName,
  stamps,
  goalStamps,
  titleId,
  titleRef,
  onConfirm,
  onNotNow,
}: Props) {
  const verb = copy.home.verb[option.mode];
  return (
    <>
      <p className={styles.status}>
        <Icon name={option.mode} size={16} className={styles.modeIcon} />{" "}
        {copy.home.routeLine(fromName, option.mode, option.price, option.days)}
      </p>
      <h2 id={titleId} ref={titleRef} tabIndex={-1} className={styles.title}>
        {copy.home.title(option.mode, verb)}
      </h2>
      <p className={styles.stamps}>{copy.home.stamps(stamps, goalStamps)}</p>
      <p className={styles.ends}>{copy.home.ends}</p>
      <button type="button" className={controls.primary} onClick={onConfirm}>
        {copy.home.primary(verb, option.price)}
      </button>
      <button type="button" className={styles.secondary} onClick={onNotNow}>
        {copy.home.notNow}
      </button>
    </>
  );
}
