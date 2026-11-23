// Content loader (AD-7). parseContent() is the single validation path: it
// parses all four files with contentFilesSchema (per-file schemas plus the
// cross-file checks) and throws one ContentError listing every problem as
// "<file>: <path>: <message>".
import type { Content } from "../rules/types";
import configJson from "../../content/config.json";
import destinationsJson from "../../content/destinations.json";
import routesJson from "../../content/routes.json";
import sightsJson from "../../content/sights.json";
import { contentFilesSchema } from "./schema";

export const CONTENT_FILES = {
  config: "config.json",
  destinations: "destinations.json",
  routes: "routes.json",
  sights: "sights.json",
} as const;

export interface RawContent {
  config: unknown;
  destinations: unknown;
  routes: unknown;
  sights: unknown;
}

export class ContentError extends Error {
  readonly problems: readonly string[];

  constructor(problems: readonly string[]) {
    super(
      `Invalid content (${problems.length} problem${problems.length === 1 ? "" : "s"}):\n` +
        problems.map((p) => `- ${p}`).join("\n"),
    );
    this.name = "ContentError";
    this.problems = problems;
  }
}

function formatPath(path: readonly PropertyKey[]): string {
  return path.reduce<string>((out, key) => {
    if (typeof key === "number") return `${out}[${key}]`;
    return out ? `${out}.${String(key)}` : String(key);
  }, "");
}

/** Validates raw content and returns it typed. Throws ContentError if invalid. */
export function parseContent(raw: RawContent): Content {
  const result = contentFilesSchema.safeParse(raw);
  if (!result.success) {
    throw new ContentError(
      result.error.issues.map((issue) => {
        const [fileKey, ...rest] = issue.path;
        const file =
          typeof fileKey === "string" && fileKey in CONTENT_FILES
            ? CONTENT_FILES[fileKey as keyof typeof CONTENT_FILES]
            : "content";
        return `${file}: ${formatPath(rest) || "(root)"}: ${issue.message}`;
      }),
    );
  }
  const { config, destinations, routes, sights } = result.data;
  return {
    config,
    home: destinations.home,
    destinations: destinations.destinations,
    routes: routes.routes,
    sights: sights.sights,
  };
}

/** Loads and validates the game's content files from /content. */
export function loadContent(): Content {
  return parseContent({
    config: configJson,
    destinations: destinationsJson,
    routes: routesJson,
    sights: sightsJson,
  });
}
