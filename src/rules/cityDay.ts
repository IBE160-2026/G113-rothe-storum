// Spending a city day (FR-8, FR-9, FR-10, FR-21, FR-22). `checkCityDay` is the
// one check that both `apply` and the city-day queries use, so they can never
// disagree (AD-3). Pure: never mutates its inputs and never throws for a
// player action, even when `sightIds` is not an array of strings (AD-4).
import { daysRemaining } from "./days";
import { accommodationPrice } from "./money";
import type {
  Content,
  Destination,
  GameState,
  ReasonCode,
  Result,
  Sight,
} from "./types";

/** At most this many sights per city day (FR-10). */
export const MAX_SIGHTS_PER_DAY = 2;

export type CityDayCheck =
  | { ok: true; stay: number; sights: Sight[] }
  | { ok: false; reason: ReasonCode };

/**
 * The destination at the current position, or `undefined` at home. Home is
 * the only place without a destination record.
 */
export function destinationAt(
  state: GameState,
  content: Content,
): Destination | undefined {
  return content.destinations.find((d) => d.id === state.position);
}

/** The stay at a destination, from the content's base price (AD-5). */
export function stayPrice(destination: Destination, content: Content): number {
  return accommodationPrice(
    content.config.baseAccommodationPrice,
    destination.costFactor,
  );
}

/**
 * Resolves a draft to this destination's sights, in the given order, or
 * `undefined` when it is invalid: not an array of strings, an unknown id, a
 * sight at another destination, a repeated id, or more than 2 ids. The limit
 * counts every id, including sights already in the album (spec-2-1 notes).
 */
function resolveSights(
  sightIds: unknown,
  position: string,
  content: Content,
): Sight[] | undefined {
  if (!Array.isArray(sightIds)) return undefined;
  const ids: unknown[] = sightIds;
  if (ids.length > MAX_SIGHTS_PER_DAY) return undefined;
  const sights: Sight[] = [];
  for (const id of ids) {
    if (typeof id !== "string") return undefined;
    const sight = content.sights.find((s) => s.id === id);
    if (sight === undefined || sight.destId !== position) return undefined;
    if (sights.some((s) => s.id === id)) return undefined;
    sights.push(sight);
  }
  return sights;
}

/**
 * Checks a city day with a draft of sights against a running journey. The
 * first failure in the fixed order JOURNEY_ENDED, AT_HOME, NOT_ENOUGH_MONEY
 * (stay), NOT_ENOUGH_DAYS, INVALID_SIGHTS, ALREADY_IN_ALBUM, NOT_ENOUGH_MONEY
 * (sights from the money left after the stay) is the reason. NO_JOURNEY is
 * `apply`'s job, since the queries always have a state. Money equal to the
 * cost is allowed.
 */
export function checkCityDay(
  state: GameState,
  sightIds: unknown,
  content: Content,
): CityDayCheck {
  if (state.outcome !== null) return { ok: false, reason: "JOURNEY_ENDED" };
  const destination = destinationAt(state, content);
  if (destination === undefined) return { ok: false, reason: "AT_HOME" };
  const stay = stayPrice(destination, content);
  if (stay > state.money) return { ok: false, reason: "NOT_ENOUGH_MONEY" };
  if (daysRemaining(state, content) < 1) {
    return { ok: false, reason: "NOT_ENOUGH_DAYS" };
  }
  const sights = resolveSights(sightIds, destination.id, content);
  if (sights === undefined) return { ok: false, reason: "INVALID_SIGHTS" };
  if (sights.some((s) => state.album.some((entry) => entry.id === s.id))) {
    return { ok: false, reason: "ALREADY_IN_ALBUM" };
  }
  // Paying each sight in order from the money left is the same as checking
  // the sum, because every price is positive (spec-2-1 Design Notes).
  const sightsCost = sights.reduce((sum, s) => sum + s.price, 0);
  if (stay + sightsCost > state.money) {
    return { ok: false, reason: "NOT_ENOUGH_MONEY" };
  }
  return { ok: true, stay, sights };
}

/**
 * Spends a city day as one result: money falls by the stay and the sights,
 * days used rise by 1, the destination's city-day count rises by 1, the first
 * city day here earns the stamp, and each sight joins the album in the given
 * order. Every new entry's `day` is the new `daysUsed` (spine Conventions →
 * Days). The end rules (stranded, out of days) run afterwards in `apply`
 * through `evaluateEnd` in end.ts.
 */
export function applySpendCityDay(
  state: GameState,
  sightIds: unknown,
  content: Content,
): Result {
  const check = checkCityDay(state, sightIds, content);
  if (!check.ok) return check;
  const day = state.daysUsed + 1;
  const visits = state.cityDays[state.position] ?? 0;
  const sightsCost = check.sights.reduce((sum, s) => sum + s.price, 0);
  return {
    ok: true,
    state: {
      ...state,
      money: state.money - check.stay - sightsCost,
      daysUsed: day,
      cityDays: { ...state.cityDays, [state.position]: visits + 1 },
      stamps:
        visits === 0
          ? [...state.stamps, { id: state.position, day }]
          : state.stamps,
      album: [...state.album, ...check.sights.map((s) => ({ id: s.id, day }))],
    },
  };
}
