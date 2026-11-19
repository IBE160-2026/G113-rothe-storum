// Shared types for the rules core (AD-1: imports nothing outside src/rules).
// Content types are defined here so the rules can take a `Content` argument
// without importing src/content/ (AD-7). Story 1.3 added GameState, Action,
// ReasonCode and Result (AR-3, AD-2, AD-4).

/** Lowercase kebab id; `home` is Bergen. */
export type PlaceId = string;

export type TransportMode = "plane" | "train" | "bus";

export interface Place {
  id: PlaceId;
  name: string;
  lat: number;
  lon: number;
}

/** Bergen: the start and end of every journey. Has no stamp code or cost factor. */
export interface Home extends Place {
  id: "home";
}

export interface Destination extends Place {
  /** Three-letter city code shown on the stamp. */
  iata: string;
  /** Multiplier on the base accommodation price for a city day. */
  costFactor: number;
}

export interface ModeOption {
  mode: TransportMode;
  /** Whole euros. */
  price: number;
  /** Whole days. */
  days: number;
}

/** A route works in both directions with the same price and days. */
export interface Route {
  between: [PlaceId, PlaceId];
  modes: ModeOption[];
}

export interface ModeValues {
  /** Whole euros. */
  startMoney: number;
  /** Whole days. */
  totalDays: number;
}

export interface Config {
  /** Keyed by journey mode; Nomad (EXT) adds a record. */
  modes: { explorer: ModeValues } & Record<string, ModeValues>;
  goalStamps: number;
  /** Whole euros per city day, before the destination's cost factor. */
  baseAccommodationPrice: number;
  callHome: {
    days: number;
    stampPenalty: number;
    price: number;
  };
}

export interface Content {
  config: Config;
  home: Home;
  destinations: Destination[];
  routes: Route[];
}

/** Journey mode. `nomad` is [EXT] and not in content yet. */
export type JourneyMode = "explorer" | "nomad";

/** EXPERIENCE State Model; set by Stories 1.4 and 3.1. */
export type Outcome = "goalReached" | "goalNotReached" | "failed";

export type FailReason = "outOfDays" | "stranded";

/** Stamps are ordered; the last one is the most recent. */
export interface Stamp {
  id: PlaceId;
  day: number;
}

/** `id` is a sight id. */
export interface AlbumEntry {
  id: string;
  day: number;
}

/**
 * The whole game state (AR-3). Immutable: only apply() produces a new one.
 * The total number of days is derived from content, never stored.
 */
export interface GameState {
  mode: JourneyMode;
  travellerName: string;
  /** False when the player left the name empty and "Traveller" was used. */
  nameGiven: boolean;
  position: PlaceId;
  /** Whole euros. */
  money: number;
  /** Whole days. */
  daysUsed: number;
  stamps: Stamp[];
  album: AlbumEntry[];
  cityDays: Record<PlaceId, number>;
  calledHome: boolean;
  outcome: Outcome | null;
  failReason: FailReason | null;
}

/** Closed action union (AD-2). Later stories add travel, spendCityDay, callHome. */
export type Action = { type: "startJourney"; name: string; mode?: JourneyMode };

/** Closed reason union (AD-4). Later stories add NO_JOURNEY, NOT_ENOUGH_MONEY, JOURNEY_ENDED, … */
export type ReasonCode = "UNKNOWN_MODE";

export type Result =
  { ok: true; state: GameState } | { ok: false; reason: ReasonCode };
