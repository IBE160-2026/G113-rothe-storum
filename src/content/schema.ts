// zod schemas for the content files (AD-7). Each schema `satisfies` the matching
// type in src/rules/types.ts, so the data and the rules agree on one shape.
// The per-file schemas check one file each; contentFilesSchema combines them and
// adds the cross-file checks (unknown ids, duplicates, self routes) in a
// superRefine that runs whenever destinations and routes are valid, even if
// config.json is not, so one parse reports every problem it can find.
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
  costFactor: z.number().positive(),
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

function checkCrossFile(
  places: DestinationsFile,
  routes: RoutesFile["routes"],
  ctx: z.RefinementCtx,
): void {
  const issue = (path: PropertyKey[], message: string) =>
    ctx.addIssue({ code: "custom", path, message });

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

  const pairs = new Set<string>();
  routes.forEach((route, i) => {
    const at = ["routes", "routes", i];
    const [a, b] = route.between;
    route.between.forEach((id, j) => {
      if (!ids.has(id))
        issue([...at, "between", j], `unknown place id "${id}"`);
    });
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

/** All three content files together, keyed like RawContent in load.ts. */
export const contentFilesSchema = z
  .strictObject({
    config: configSchema,
    destinations: destinationsFileSchema,
    routes: routesFileSchema,
  })
  .superRefine(
    (value, ctx) =>
      checkCrossFile(value.destinations, value.routes.routes, ctx),
    {
      // Run the cross-file checks even when config.json fails, as long as the
      // two files they read are valid.
      when: (payload) => {
        const value = payload.value as {
          destinations?: unknown;
          routes?: unknown;
        };
        return (
          destinationsFileSchema.safeParse(value?.destinations).success &&
          routesFileSchema.safeParse(value?.routes).success
        );
      },
    },
  );
