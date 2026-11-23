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
  /**
   * The fact card shown on arrival (FR-5): 2–3 English sentences, at most 320
   * characters (AD-7, NFR-6). Fact-checked per NFR-8.
   */
  fact: string;
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

/**
 * A sight at a destination (FR-10, FR-21). The rules read only `id`, `destId`
 * and `price`; Story 2.2 added the fact, image and licence fields for the UI.
 */
export interface Sight {
  /** Lowercase kebab id, `{destId}-{slug}` (AD-7), e.g. `paris-louvre`. */
  id: string;
  /** The destination the sight belongs to; never `home`. */
  destId: PlaceId;
  name: string;
  /** Whole euros. */
  price: number;
  /** 1–2 English sentences, at most 200 characters (AD-7, NFR-6, NFR-8). */
  fact: string;
  /**
   * `assets/sights/{id}.svg` or `.webp`, relative to the site root (never a
   * URL). The UI uses it as given and never rebuilds it from `id`, so the file
   * can be replaced at the same path with no code change (NFR-7, AD-7).
   * Load it through `<img>` (or CSS), never inline it: the SVG's `:root` theme
   * rule would restyle the page.
   */
  image: string;
  /** Short alt text for the sight card, at most 120 characters. */
  imageAlt: string;
  /** The image's source page URL, or a short note for AI-made images (NFR-8). */
  source: string;
  /**
   * Who made the image; for a photo, the photographer as credited at the
   * source.
   */
  author: string;
  /** Licence name, e.g. "CC BY-SA 4.0" or "CC0 1.0". */
  licence: string;
}

export interface Content {
  config: Config;
  home: Home;
  destinations: Destination[];
  routes: Route[];
  sights: Sight[];
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

/** Closed action union (AD-2). Later stories add callHome. */
export type Action =
  | { type: "startJourney"; name: string; mode?: JourneyMode }
  | { type: "travel"; to: PlaceId; mode: TransportMode }
  | { type: "spendCityDay"; sightIds: string[] };

/** Closed reason union (AD-4). The UI maps each code to copy. */
export type ReasonCode =
  | "UNKNOWN_MODE"
  | "NO_JOURNEY"
  | "JOURNEY_ENDED"
  | "NO_ROUTE"
  | "NOT_ENOUGH_MONEY"
  | "NOT_ENOUGH_DAYS"
  | "AT_HOME"
  | "INVALID_SIGHTS"
  | "ALREADY_IN_ALBUM";

export type Result =
  { ok: true; state: GameState } | { ok: false; reason: ReasonCode };

/** One transport mode on a route, as the route query shows it (FR-4, FR-9). */
export interface TravelOption {
  mode: TransportMode;
  /** Whole euros. */
  price: number;
  /** Whole days. */
  days: number;
  /**
   * `daysUsed + days`: days used once the player has arrived. The "Day X"
   * label after arrival is `arrivalDay + 1` (spine Conventions → Days).
   */
  arrivalDay: number;
  available: boolean;
  /** Why the option is unavailable; `null` when it is available. */
  reason: ReasonCode | null;
  /**
   * After this option, home can no longer be reached in time. Never blocks.
   * Only an available option can carry it: always `false` when `available` is
   * false, so the UI shows it as is (warning and unavailable rows are exclusive).
   */
  homeUnreachable: boolean;
}

/** All modes from the current position to one neighbour. */
export interface RouteView {
  to: PlaceId;
  options: TravelOption[];
}

/** Whether a city day can be spent here at all (FR-8): the draft is empty. */
export interface CityDayStatus {
  available: boolean;
  /** Why the city day is unavailable; `null` when it is available. */
  reason: ReasonCode | null;
  /**
   * Whole euros for the stay, also when the city day is unavailable, so the
   * player sees what it would cost. `null` at home (no cost factor).
   */
  stayPrice: number | null;
}

/** One sight of the current destination in a city-day draft (FR-10, FR-21). */
export interface SightPlanView {
  id: string;
  inAlbum: boolean;
  selected: boolean;
  /** `checkCityDay` with the other valid selected sights plus this one (AD-3). */
  available: boolean;
  reason: ReasonCode | null;
  /**
   * `money − stay − Σ(other selected sights)`, for copy only ("you'd have
   * €N"); may be negative and never decides availability.
   */
  moneyLeft: number;
}

/** A whole city-day draft, as the City day screen shows it (FR-8, FR-10). */
export interface CityDayPlan {
  /** Exactly what `apply(spendCityDay({ sightIds }))` would decide. */
  ok: boolean;
  reason: ReasonCode | null;
  /** The next three are `null` only at home. */
  stay: number | null;
  /** Stay + the distinct valid selected sights not in the album. */
  total: number | null;
  /** `money − total`; negative only when `ok` is false. */
  moneyAfter: number | null;
  /** This destination's sights in content order; empty at home. */
  sights: SightPlanView[];
}
