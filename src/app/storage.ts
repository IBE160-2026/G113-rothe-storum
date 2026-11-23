// The one storage adapter (AD-8, AR-7). Only this module touches browser
// storage. Core keeps two values on the device: the intro flag (FR-2) and the
// last traveller name (FR-1). A journey is never saved in the core (PRD §9.7,
// Decision L); saving is [EXT] (FR-20, Story 6.1).
//
// Every access is wrapped in try/catch. When storage is blocked, values live in
// memory for the current page load only, so the game still works and the intro
// shows again on every load (FR-2 assumption, EXPERIENCE → Storage unavailable).

const KEYS = {
  introSeen: "worldbound.introSeen",
  lastName: "worldbound.lastName",
} as const;

type Key = (typeof KEYS)[keyof typeof KEYS];

export interface DeviceStorage {
  /** True when values survive a reload (browser storage is usable). */
  readonly persistent: boolean;
  introSeen(): boolean;
  markIntroSeen(): void;
  /** The last name the player entered, or "" if none. */
  lastName(): string;
  /** Stores the name; an empty name clears it. */
  setLastName(name: string): void;
}

/** Returns browser storage only if it can actually be written. */
function usableLocalStorage(): Storage | null {
  try {
    const storage = window.localStorage;
    const probe = "worldbound.probe";
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

/**
 * Creates the adapter. `backend` is injectable for tests; by default it is the
 * browser's localStorage, or `null` when that is blocked.
 */
export function createDeviceStorage(
  backend: Storage | null = usableLocalStorage(),
): DeviceStorage {
  // What this page load last wrote, with null for a removal. It wins over the
  // backend, so a write that throws (for example a full quota) still holds for
  // the rest of the page load instead of reading back the old stored value.
  const memory = new Map<Key, string | null>();

  const read = (key: Key): string | null => {
    if (memory.has(key)) return memory.get(key) ?? null;
    if (backend) {
      try {
        return backend.getItem(key);
      } catch {
        // Unreadable storage: treat the value as missing.
      }
    }
    return null;
  };

  const write = (key: Key, value: string | null): void => {
    memory.set(key, value);
    if (!backend) return;
    try {
      if (value === null) backend.removeItem(key);
      else backend.setItem(key, value);
    } catch {
      // Keep the in-memory value; the game must never crash on storage.
    }
  };

  return {
    persistent: backend !== null,
    introSeen: () => read(KEYS.introSeen) === "1",
    markIntroSeen: () => write(KEYS.introSeen, "1"),
    lastName: () => read(KEYS.lastName) ?? "",
    setLastName: (name) => write(KEYS.lastName, name === "" ? null : name),
  };
}
