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

type DestinationsFile = z.infer<typeof destinationsFileSchema>;
type RoutesFile = z.infer<typeof routesFileSchema>;

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

// Each check runs as soon as the files it reads are valid on their own, even if
// another file fails, so one parse reports every problem it can find. Every file
// a check reads must be safeParsed in its gate (with a null/missing-file test),
// or bad input crashes with a TypeError instead of a ContentError.
const filesOf = (payload: { value: unknown }) =>
  payload.value as { destinations?: unknown; routes?: unknown } | undefined;
const destinationsValid = (payload: { value: unknown }) =>
  destinationsFileSchema.safeParse(filesOf(payload)?.destinations).success;
const routesValid = (payload: { value: unknown }) =>
  routesFileSchema.safeParse(filesOf(payload)?.routes).success;

/** All three content files together, keyed like RawContent in load.ts. */
export const contentFilesSchema = z
  .strictObject({
    config: configSchema,
    destinations: destinationsFileSchema,
    routes: routesFileSchema,
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
  );
