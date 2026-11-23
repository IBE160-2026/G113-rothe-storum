// @vitest-environment jsdom
// AD-8 / AR-7 storage adapter (Story 1.5): the intro flag (FR-2) and the last
// name (FR-1) are the only values kept on the device; a journey is never saved
// (Decision L). Blocked or throwing storage never crashes the game.
import { beforeEach, describe, expect, it } from "vitest";
import { createDeviceStorage } from "../../src/app/storage";

/** A Storage whose every method throws, like Safari with storage disabled. */
function throwingStorage(): Storage {
  const fail = () => {
    throw new DOMException("blocked", "SecurityError");
  };
  return {
    length: 0,
    clear: fail,
    getItem: fail,
    key: fail,
    removeItem: fail,
    setItem: fail,
  };
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("AD-8 device storage (FR-1, FR-2)", () => {
  it("starts with no intro flag and no name", () => {
    const storage = createDeviceStorage(window.localStorage);
    expect(storage.persistent).toBe(true);
    expect(storage.introSeen()).toBe(false);
    expect(storage.lastName()).toBe("");
  });

  it("keeps the intro flag and the last name across adapter instances (reloads)", () => {
    createDeviceStorage(window.localStorage).markIntroSeen();
    createDeviceStorage(window.localStorage).setLastName("Ingrid");

    const reloaded = createDeviceStorage(window.localStorage);
    expect(reloaded.introSeen()).toBe(true);
    expect(reloaded.lastName()).toBe("Ingrid");
  });

  it("clears the name when an empty name is stored", () => {
    const storage = createDeviceStorage(window.localStorage);
    storage.setLastName("Ingrid");
    storage.setLastName("");
    expect(storage.lastName()).toBe("");
    expect(window.localStorage.length).toBe(0);
  });

  it("stores only the intro flag and the name, never a journey (Decision L)", () => {
    const storage = createDeviceStorage(window.localStorage);
    storage.markIntroSeen();
    storage.setLastName("Ingrid");

    const keys = Array.from({ length: window.localStorage.length }, (_, i) =>
      window.localStorage.key(i),
    ).sort();
    expect(keys).toEqual(["worldbound.introSeen", "worldbound.lastName"]);
  });

  it("falls back to memory for this page load when storage is blocked", () => {
    const storage = createDeviceStorage(null);
    expect(storage.persistent).toBe(false);

    storage.markIntroSeen();
    storage.setLastName("Ingrid");
    expect(storage.introSeen()).toBe(true);
    expect(storage.lastName()).toBe("Ingrid");

    // A reload starts a new adapter: nothing survived, so the intro shows again.
    const reloaded = createDeviceStorage(null);
    expect(reloaded.introSeen()).toBe(false);
    expect(reloaded.lastName()).toBe("");
  });

  it("never throws when every storage call throws", () => {
    const storage = createDeviceStorage(throwingStorage());

    expect(() => storage.markIntroSeen()).not.toThrow();
    expect(() => storage.setLastName("Ingrid")).not.toThrow();
    expect(storage.introSeen()).toBe(true);
    expect(storage.lastName()).toBe("Ingrid");
  });

  it("detects blocked browser storage by default", () => {
    const original = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("blocked", "SecurityError");
      },
    });
    try {
      const storage = createDeviceStorage();
      expect(storage.persistent).toBe(false);
      expect(storage.introSeen()).toBe(false);
    } finally {
      if (original) Object.defineProperty(window, "localStorage", original);
    }
  });
});
