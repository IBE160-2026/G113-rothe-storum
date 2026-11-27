// Polaroid: a photo print of a visited sight (DESIGN.md → Polaroid;
// EXPERIENCE → Polaroid, Empty album). Shared by Stories 2.4 (Day complete),
// 2.5 (Album tab) and 3.3 (Journey summary). A print is a button that opens
// the Polaroid sheet through usePolaroidSheet(). EmptyPolaroid is the empty
// tile, which only the Album tab uses. It reads no rules and changes
// nothing in the game (FR-22, Decision G).
import type { AlbumEntry, Content, Sight } from "../../rules/types";
import { copy } from "../copy";
import { Icon } from "./Icon";
import styles from "./Polaroid.module.css";

/**
 * Where the print is used. Album strip: 62 px photo. Day complete: 86 px
 * photo. Journey summary: the whole print is 118 px wide (J1 mockup,
 * `.albumstrip .polaroid`), which gives a 78 px photo (Story 3.3, D1).
 */
export type PolaroidSize = "album" | "dayComplete" | "summary";

/** What a print shows for one album entry. */
export interface PolaroidPrint {
  sight: Sight;
  city: string;
  day: number;
}

/**
 * The sight and city for an album entry, or `null` when the sight is not in
 * the content, so the caller renders nothing for it.
 */
export function resolveAlbumEntry(
  entry: AlbumEntry,
  content: Content,
): PolaroidPrint | null {
  const sight = content.sights.find((s) => s.id === entry.id);
  if (sight === undefined) return null;
  const city =
    content.destinations.find((d) => d.id === sight.destId)?.name ??
    sight.destId;
  return { sight, city, day: entry.day };
}

/**
 * The image URL: `sight.image` as given, under the site base (types.ts →
 * `Sight.image`). Loaded through <img>, never inlined.
 */
export function sightImageUrl(sight: Sight): string {
  return `${import.meta.env.BASE_URL}${sight.image}`;
}

interface Props extends PolaroidPrint {
  /** Called with the print, so focus can return to it on close. */
  onOpen: (opener: HTMLButtonElement) => void;
  size?: PolaroidSize;
  tilt?: "left" | "right";
}

/** EXPERIENCE → Empty album: one wide dashed tile, not a button. */
export function EmptyPolaroid() {
  return (
    <div className={styles.empty}>
      <Icon name="photo" size={22} />
      <span>{copy.polaroid.empty}</span>
    </div>
  );
}

export function Polaroid({
  sight,
  city,
  day,
  onOpen,
  size = "album",
  tilt = "left",
}: Props) {
  return (
    <button
      type="button"
      className={`${styles.print} ${styles[size]} ${styles[tilt]}`}
      aria-label={copy.polaroid.label(sight.name, city, day)}
      onClick={(event) => onOpen(event.currentTarget)}
    >
      <span className={styles.photo}>
        <img src={sightImageUrl(sight)} alt="" />
      </span>
      <span className={styles.title}>{sight.name}</span>
      <span className={styles.meta}>{copy.polaroid.meta(city, day)}</span>
      <span className={styles.fact}>{sight.fact}</span>
    </button>
  );
}
