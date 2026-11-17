// Shared types for the rules core (AD-1: imports nothing outside src/rules).
// Content types are defined here so the rules can take a `Content` argument
// without importing src/content/ (AD-7). Story 1.3 adds GameState, actions and
// ReasonCode to this file.

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
