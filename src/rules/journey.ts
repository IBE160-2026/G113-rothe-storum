// Starting a journey (FR-1). Pure: never mutates its inputs and never throws
// for a player action (AD-1, AD-2, AD-4).
import type { Content, JourneyMode, Result } from "./types";

export const DEFAULT_TRAVELLER_NAME = "Traveller";
export const MAX_NAME_GRAPHEMES = 14;

// The one allowed use of Intl in src/rules (spec-1-3 Q1, AD-1 note).
const graphemes = new Intl.Segmenter("en", { granularity: "grapheme" });

/**
 * Trims the name, keeps the first 14 graphemes and trims again. An empty
 * result becomes "Traveller" with `nameGiven` false. The name never affects rules.
 */
export function normalizeName(raw: string): {
  travellerName: string;
  nameGiven: boolean;
} {
  const kept = Array.from(graphemes.segment(raw.trim()), (s) => s.segment)
    .slice(0, MAX_NAME_GRAPHEMES)
    .join("")
    .trim();
  return kept === ""
    ? { travellerName: DEFAULT_TRAVELLER_NAME, nameGiven: false }
    : { travellerName: kept, nameGiven: true };
}

/**
 * Starts a fresh journey at home. May replace any state; confirming the
 * discard of a running journey is the UI's job (FR-1 [EXT]).
 */
export function applyStartJourney(
  name: string,
  mode: JourneyMode,
  content: Content,
): Result {
  if (!Object.hasOwn(content.config.modes, mode)) {
    return { ok: false, reason: "UNKNOWN_MODE" };
  }
  const values = content.config.modes[mode];
  return {
    ok: true,
    state: {
      mode,
      ...normalizeName(name),
      position: "home",
      money: values.startMoney,
      daysUsed: 0,
      stamps: [],
      album: [],
      cityDays: {},
      calledHome: false,
      outcome: null,
      failReason: null,
    },
  };
}
