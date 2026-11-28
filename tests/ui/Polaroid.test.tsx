// @vitest-environment jsdom
// Polaroid, PolaroidSheet and usePolaroidSheet: every row of the I/O matrix in
// .docs/implementation-artifacts/spec-polaroid-and-polaroid-sheet.md, on the
// real content. history.back is stubbed and popstate dispatched by hand (as in
// useBackToClose.test.tsx), so each test decides when the browser answers.
// CSS clamping, the 4:3 box and the tilt need layout and are checked in the
// PR's screenshots, since jsdom does none.
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContentProvider, useContent } from "../../src/app/content";
import { loadContent } from "../../src/content/load";
import type { AlbumEntry } from "../../src/rules/types";
import {
  EmptyPolaroid,
  Polaroid,
  resolveAlbumEntry,
} from "../../src/ui/components/Polaroid";
import { copy } from "../../src/ui/copy";
import { usePolaroidSheet } from "../../src/ui/hooks/usePolaroidSheet";

const EIFFEL: AlbumEntry = { id: "paris-eiffel-tower", day: 6 };
const ESB: AlbumEntry = { id: "new-york-empire-state-building", day: 30 };
const NYHAVN: AlbumEntry = { id: "copenhagen-nyhavn", day: 1 };
const UNKNOWN: AlbumEntry = { id: "atlantis-palace", day: 3 };

const content = loadContent();
const factOf = (id: string) =>
  content.sights.find((s) => s.id === id)?.fact ?? "missing";

/** A stand-in screen, used the way 2.4, 2.5 and 3.3 will use the hook. */
function Album({ entries }: { entries: AlbumEntry[] }) {
  const albumContent = useContent();
  const polaroid = usePolaroidSheet();
  return (
    <>
      <main data-testid="screen" inert={polaroid.isOpen}>
        {entries.map((entry) => {
          const print = resolveAlbumEntry(entry, albumContent);
          return (
            print && (
              <Polaroid
                key={entry.id}
                {...print}
                onOpen={(el) => polaroid.open(entry, el)}
              />
            )
          );
        })}
        <EmptyPolaroid />
        <button type="button" onClick={() => polaroid.open(UNKNOWN, null)}>
          open unknown
        </button>
      </main>
      {polaroid.sheet}
    </>
  );
}

function renderAlbum(entries: AlbumEntry[] = [EIFFEL, ESB, NYHAVN]) {
  return render(
    <ContentProvider>
      <Album entries={entries} />
    </ContentProvider>,
  );
}

const pop = () =>
  act(() => {
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
const print = (label: string) => screen.getByRole("button", { name: label });
const dialog = () => screen.queryByRole("dialog");

let push: ReturnType<typeof vi.spyOn>;
let back: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  push = vi.spyOn(window.history, "pushState");
  back = vi.spyOn(window.history, "back").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe("Polaroid print", () => {
  it("shows the image, title, place and day, and the fact; named by title, place and day", () => {
    renderAlbum();
    const eiffel = print("Eiffel Tower, Paris, Day 6");
    const img = eiffel.querySelector("img");
    expect(img).toHaveAttribute("alt", "");
    expect(img?.getAttribute("src")).toMatch(
      /assets\/sights\/paris-eiffel-tower\.svg$/,
    );
    expect(eiffel).toHaveTextContent("Eiffel Tower");
    // jest-dom normalises the no-break space in the DOM to a space.
    expect(eiffel).toHaveTextContent("Paris · Day 6");
    // Normal case in the DOM; CSS shows it in caps.
    expect(copy.polaroid.meta("Paris", 6)).toBe("Paris · Day\u00a06");
    expect(eiffel).toHaveTextContent(factOf("paris-eiffel-tower"));
  });

  it("labels day 1 and day 30 as given", () => {
    renderAlbum();
    expect(print("Nyhavn canal tour, Copenhagen, Day 1")).toBeInTheDocument();
    expect(
      print("Empire State Building, New York, Day 30"),
    ).toBeInTheDocument();
  });

  // Structure only: the 4:3 box and paper background are CSS, checked in the
  // PR screenshots (jsdom does no layout).
  it("keeps the img inside its photo box after a load error", () => {
    renderAlbum();
    const img = print("Eiffel Tower, Paris, Day 6").querySelector("img");
    if (img === null) throw new Error("no img");
    fireEvent.error(img);
    expect(img.parentElement?.tagName).toBe("SPAN");
    expect(print("Eiffel Tower, Paris, Day 6")).toContainElement(img);
  });
});

describe("Polaroid empty tile", () => {
  it("shows the empty line and is not a button", () => {
    renderAlbum([]);
    expect(screen.getByText(copy.polaroid.empty)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: copy.polaroid.empty }),
    ).not.toBeInTheDocument();
  });
});

describe("unknown sight", () => {
  it("renders nothing for an album entry whose sight is not in the content", () => {
    renderAlbum([UNKNOWN, EIFFEL]);
    expect(screen.getAllByRole("button", { name: /, Day \d+$/ })).toHaveLength(
      1,
    );
  });

  it("opens no sheet and pushes no history entry", () => {
    renderAlbum();
    fireEvent.click(screen.getByRole("button", { name: "open unknown" }));
    expect(dialog()).not.toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});

describe("Polaroid sheet", () => {
  it("opens with focus on the title and the screen inert", () => {
    renderAlbum();
    fireEvent.click(print("Eiffel Tower, Paris, Day 6"));
    const sheet = screen.getByRole("dialog", { name: "Eiffel Tower" });
    expect(sheet).toHaveAttribute("aria-modal", "true");
    expect(document.activeElement).toBe(
      screen.getByRole("heading", { name: "Eiffel Tower" }),
    );
    expect(sheet).toHaveTextContent("Paris · Day 6");
    expect(screen.getByTestId("screen")).toHaveAttribute("inert");
    expect(push).toHaveBeenCalledTimes(1);
  });

  it("shows the whole name and fact for the longest name", () => {
    renderAlbum();
    fireEvent.click(print("Empire State Building, New York, Day 30"));
    expect(
      screen.getByRole("heading", { name: "Empire State Building" }),
    ).toBeInTheDocument();
    expect(dialog()).toHaveTextContent(
      factOf("new-york-empire-state-building"),
    );
  });

  it.each([
    [
      "Esc",
      () => fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" }),
    ],
    [
      "×",
      () =>
        fireEvent.click(
          screen.getByRole("button", { name: copy.polaroid.close }),
        ),
    ],
    [
      "the scrim",
      () => {
        const scrim = screen.getByRole("dialog").previousElementSibling;
        if (scrim === null) throw new Error("no scrim");
        fireEvent.click(scrim);
      },
    ],
  ])("%s pops the entry and focus returns to the print", (_, close) => {
    renderAlbum();
    const eiffel = print("Eiffel Tower, Paris, Day 6");
    fireEvent.click(eiffel);
    close();
    expect(back).toHaveBeenCalledTimes(1);
    // The sheet closes on the popstate that history.back() causes.
    expect(dialog()).toBeInTheDocument();
    pop();
    expect(dialog()).not.toBeInTheDocument();
    expect(screen.getByTestId("screen")).not.toHaveAttribute("inert");
    expect(document.activeElement).toBe(eiffel);
  });

  it("browser Back closes it without a second back(), focus on the print", () => {
    renderAlbum();
    const eiffel = print("Eiffel Tower, Paris, Day 6");
    fireEvent.click(eiffel);
    pop();
    expect(dialog()).not.toBeInTheDocument();
    expect(back).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(eiffel);
  });

  it("a tap before the popstate arrives opens nothing and pushes nothing", () => {
    renderAlbum();
    const eiffel = print("Eiffel Tower, Paris, Day 6");
    fireEvent.click(eiffel);
    fireEvent.click(screen.getByRole("button", { name: copy.polaroid.close }));
    // The screen is still inert; even a click that gets through is ignored.
    expect(screen.getByTestId("screen")).toHaveAttribute("inert");
    fireEvent.click(print("Nyhavn canal tour, Copenhagen, Day 1"));
    expect(screen.getByRole("dialog", { name: "Eiffel Tower" })).toBeVisible();
    expect(push).toHaveBeenCalledTimes(1);
    pop();
    expect(dialog()).not.toBeInTheDocument();
    expect(document.activeElement).toBe(eiffel);
  });

  it("wraps Shift+Tab from the title to ×, and Tab on × stays inside", () => {
    renderAlbum();
    fireEvent.click(print("Eiffel Tower, Paris, Day 6"));
    const close = screen.getByRole("button", { name: copy.polaroid.close });
    // Focus starts on the title; Shift+Tab must wrap to the last control.
    fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Tab",
      shiftKey: true,
    });
    expect(document.activeElement).toBe(close);
    // × is the only Tab stop: Tab wraps to it again instead of leaving.
    const tab = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      close.dispatchEvent(tab);
    });
    expect(tab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(close);
  });

  it("a second Esc before the popstate goes back only once", () => {
    renderAlbum();
    fireEvent.click(print("Eiffel Tower, Paris, Day 6"));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: copy.polaroid.close }));
    expect(back).toHaveBeenCalledTimes(1);
    pop();
    expect(dialog()).not.toBeInTheDocument();
  });
});
