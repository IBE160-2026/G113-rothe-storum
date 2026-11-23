// zod schemas for the content files (AD-7). Each schema `satisfies` the matching
// type in src/rules/types.ts, so the data and the rules agree on one shape.
// The per-file schemas check one file each; contentFilesSchema combines them and
// adds the checks zod cannot express per field (duplicates, self routes, unknown
// ids). Each of those runs as soon as the files it reads are valid, even if
// another file is not, so one parse reports every problem it can find.
import { z } from "zod";
import type {
  Config,
  Destination,
  Home,
  ModeOption,
  Route,
  Sight,
} from "../rules/types";

const KEBAB_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const placeId = z
  .string()
  .regex(KEBAB_ID, "must be a lowercase kebab id, for example new-york");
const wholeEuros = z.number().int("must be a whole number of euros");
const wholeDays = z.number().int("must be a whole number of days");
const latitude = z.number().min(-90).max(90);
const longitude = z.number().min(-180).max(180);
const name = z.string().trim().min(1, "must not be empty");
const text = name;

// A sentence ends in . ! or ?, optionally followed by a closing quote or
// bracket, then whitespace or the end. Facts avoid abbreviations with a dot and
// ellipses, so this simple count stays exact (spec 2.2, Design Notes).
const SENTENCE_END = /[.!?]["')]?(?=\s|$)/g;
const FINAL_PUNCTUATION = /[.!?]["')]?$/;
// What the simple count cannot handle, rejected loudly instead of miscounted:
// curly quotes, ellipses, en/em dashes and common abbreviations with a dot.
const TYPOGRAPHY = /[‘’“”…–—]|\.\.\./;
const DOTTED_ABBREVIATION =
  /\b(?:St|Dr|Mr|Mrs|Ms|No|vs|c)\.(?=\s)|\b(?:U\.S|U\.K|e\.g|i\.e)\./;

/** An English fact with min–max sentences and at most maxChars characters. */
const fact = (min: number, max: number, maxChars: number) =>
  text
    .max(maxChars, `must be at most ${maxChars} characters`)
    .refine(
      (value) => !TYPOGRAPHY.test(value),
      "must use straight quotes and no ellipses or long dashes",
    )
    .refine(
      (value) => !DOTTED_ABBREVIATION.test(value),
      'must not use abbreviations with a dot (write "Saint", "US", "circa")',
    )
    .refine((value) => FINAL_PUNCTUATION.test(value), "must end in . ! or ?")
    .refine((value) => {
      const count = value.match(SENTENCE_END)?.length ?? 0;
      return count >= min && count <= max;
    }, `must have ${min}–${max} sentences (avoid abbreviations like "St.")`);

const modeValues = z.strictObject({
  startMoney: wholeEuros.positive(),
  totalDays: wholeDays.positive(),
});

const modes = z
  .object({ explorer: modeValues })
  .catchall(modeValues)
  .superRefine((value, ctx) => {
    for (const key of Object.keys(value)) {
      if (!KEBAB_ID.test(key)) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: "mode key must be a lowercase kebab id, for example nomad",
        });
      }
    }
  });

export const configSchema = z.strictObject({
  modes,
  goalStamps: z.number().int().positive(),
  baseAccommodationPrice: wholeEuros.positive(),
  callHome: z.strictObject({
    days: wholeDays.positive(),
    stampPenalty: z.number().int().nonnegative(),
    price: wholeEuros.nonnegative(),
  }),
}) satisfies z.ZodType<Config>;

const homeSchema = z.strictObject({
  id: z.literal("home"),
  name,
  lat: latitude,
  lon: longitude,
}) satisfies z.ZodType<Home>;

const destinationSchema = z.strictObject({
  id: placeId,
  name,
  iata: z.string().regex(/^[A-Z]{3}$/, "must be three capital letters"),
  lat: latitude,
  lon: longitude,
  // At most two decimals, so accommodationPrice() can convert it exactly to
  // whole hundredths (AD-5, #26).
  costFactor: z
    .number()
    .positive()
    .multipleOf(0.01, "must have at most two decimals"),
  fact: fact(2, 3, 320),
}) satisfies z.ZodType<Destination>;

export const destinationsFileSchema = z.strictObject({
  home: homeSchema,
  destinations: z.array(destinationSchema),
});

const modeOptionSchema = z.strictObject({
  mode: z.enum(["plane", "train", "bus"]),
  price: wholeEuros.positive(),
  days: wholeDays.positive(),
}) satisfies z.ZodType<ModeOption>;

const routeSchema = z.strictObject({
  between: z.tuple([placeId, placeId]),
  modes: z.array(modeOptionSchema).min(1, "needs at least one mode"),
}) satisfies z.ZodType<Route>;

export const routesFileSchema = z.strictObject({
  routes: z.array(routeSchema),
});

// Prices are game values from PRD addendum §3, whole euros 8–20. The image is a
// repo file named after the sight id (never a URL); the "exactly 2 per
// destination" rule is the cross-file checkSightCount() below.
const sightSchema = z
  .strictObject({
    id: placeId,
    destId: placeId,
    name,
    price: wholeEuros.min(8).max(20),
    fact: fact(1, 2, 200),
    image: text,
    imageAlt: text.max(120, "must be at most 120 characters"),
    source: text,
    author: text,
    licence: text,
  })
  .superRefine((sight, ctx) => {
    if (typeof sight.id !== "string") return;
    const base = `assets/sights/${sight.id}`;
    if (sight.image !== `${base}.svg` && sight.image !== `${base}.webp`) {
      ctx.addIssue({
        code: "custom",
        path: ["image"],
        message: "must be assets/sights/<id>.svg or .webp",
      });
    }
  }) satisfies z.ZodType<Sight>;

export const sightsFileSchema = z.strictObject({
  sights: z.array(sightSchema),
});

type DestinationsFile = z.infer<typeof destinationsFileSchema>;
type RoutesFile = z.infer<typeof routesFileSchema>;
type SightsFile = z.infer<typeof sightsFileSchema>;

type Issue = (path: PropertyKey[], message: string) => void;

const issuer =
  (ctx: z.RefinementCtx): Issue =>
  (path, message) =>
    ctx.addIssue({ code: "custom", path, message });

/** Duplicate place ids and iata codes. Reads only destinations.json. */
function checkPlaces(places: DestinationsFile, issue: Issue): void {
  const ids = new Set<string>([places.home.id]);
  const codes = new Set<string>();
  places.destinations.forEach((d, i) => {
    if (ids.has(d.id)) {
      issue(
        ["destinations", "destinations", i, "id"],
        `duplicate place id "${d.id}"`,
      );
    }
    ids.add(d.id);
    if (codes.has(d.iata)) {
      issue(
        ["destinations", "destinations", i, "iata"],
        `duplicate code "${d.iata}"`,
      );
    }
    codes.add(d.iata);
  });
}

/** Self routes, duplicate routes and duplicate modes. Reads only routes.json. */
function checkRoutes(routes: RoutesFile["routes"], issue: Issue): void {
  const pairs = new Set<string>();
  routes.forEach((route, i) => {
    const at = ["routes", "routes", i];
    const [a, b] = route.between;
    if (a === b) issue([...at, "between"], `route from "${a}" to itself`);
    const pair = [a, b].sort().join("|");
    if (pairs.has(pair)) {
      issue([...at, "between"], `duplicate route between "${a}" and "${b}"`);
    }
    pairs.add(pair);
    const seen = new Set<string>();
    route.modes.forEach((option, k) => {
      if (seen.has(option.mode)) {
        issue([...at, "modes", k, "mode"], `duplicate mode "${option.mode}"`);
      }
      seen.add(option.mode);
    });
  });
}

/** Route endpoints that name no place. Reads destinations.json and routes.json. */
function checkEndpoints(
  places: DestinationsFile,
  routes: RoutesFile["routes"],
  issue: Issue,
): void {
  const ids = new Set<string>([
    places.home.id,
    ...places.destinations.map((d) => d.id),
  ]);
  routes.forEach((route, i) => {
    route.between.forEach((id, j) => {
      if (!ids.has(id)) {
        issue(
          ["routes", "routes", i, "between", j],
          `unknown place id "${id}"`,
        );
      }
    });
  });
}

/** Duplicate sight ids. Reads only sights.json. */
function checkSightIds(sights: SightsFile["sights"], issue: Issue): void {
  const ids = new Set<string>();
  sights.forEach((sight, i) => {
    if (ids.has(sight.id)) {
      issue(["sights", "sights", i, "id"], `duplicate sight id "${sight.id}"`);
    }
    ids.add(sight.id);
  });
}

/**
 * Sights whose destId names no destination (home has no sights). Reads
 * destinations.json and sights.json.
 */
function checkSightDestinations(
  places: DestinationsFile,
  sights: SightsFile["sights"],
  issue: Issue,
): void {
  const ids = new Set(places.destinations.map((d) => d.id));
  sights.forEach((sight, i) => {
    if (!ids.has(sight.destId)) {
      issue(
        ["sights", "sights", i, "destId"],
        `unknown destination id "${sight.destId}"`,
      );
    }
  });
}

/**
 * Every destination needs exactly 2 sights (FR-21). Loops over destinations,
 * so a destination with no sights is caught too. Reads destinations.json and
 * sights.json.
 */
function checkSightCount(
  places: DestinationsFile,
  sights: SightsFile["sights"],
  issue: Issue,
): void {
  for (const d of places.destinations) {
    const count = sights.filter((s) => s.destId === d.id).length;
    if (count !== 2) {
      issue(
        ["sights", "sights"],
        `destination "${d.id}" has ${count} sights (needs exactly 2)`,
      );
    }
  }
}

// Each check runs as soon as the files it reads are valid on their own, even if
// another file fails, so one parse reports every problem it can find. Every file
// a check reads must be safeParsed in its gate (with a null/missing-file test),
// or bad input crashes with a TypeError instead of a ContentError.
const filesOf = (payload: { value: unknown }) =>
  payload.value as
    { destinations?: unknown; routes?: unknown; sights?: unknown } | undefined;
const destinationsValid = (payload: { value: unknown }) =>
  destinationsFileSchema.safeParse(filesOf(payload)?.destinations).success;
const routesValid = (payload: { value: unknown }) =>
  routesFileSchema.safeParse(filesOf(payload)?.routes).success;
const sightsValid = (payload: { value: unknown }) =>
  sightsFileSchema.safeParse(filesOf(payload)?.sights).success;

/** All four content files together, keyed like RawContent in load.ts. */
export const contentFilesSchema = z
  .strictObject({
    config: configSchema,
    destinations: destinationsFileSchema,
    routes: routesFileSchema,
    sights: sightsFileSchema,
  })
  .superRefine((value, ctx) => checkPlaces(value.destinations, issuer(ctx)), {
    when: destinationsValid,
  })
  .superRefine((value, ctx) => checkRoutes(value.routes.routes, issuer(ctx)), {
    when: routesValid,
  })
  .superRefine(
    (value, ctx) =>
      checkEndpoints(value.destinations, value.routes.routes, issuer(ctx)),
    { when: (payload) => destinationsValid(payload) && routesValid(payload) },
  )
  .superRefine(
    (value, ctx) => checkSightIds(value.sights.sights, issuer(ctx)),
    {
      when: sightsValid,
    },
  )
  .superRefine(
    (value, ctx) =>
      checkSightDestinations(
        value.destinations,
        value.sights.sights,
        issuer(ctx),
      ),
    { when: (payload) => destinationsValid(payload) && sightsValid(payload) },
  )
  .superRefine(
    (value, ctx) =>
      checkSightCount(value.destinations, value.sights.sights, issuer(ctx)),
    { when: (payload) => destinationsValid(payload) && sightsValid(payload) },
  );
