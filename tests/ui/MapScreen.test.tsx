// @vitest-environment jsdom
// Story 1.6 through the app (FR-3, FR-4, UX-DR2, UX-DR4):
// AC 1: status, home and the 8 destinations on the map.
// AC 2: a chip or a marker opens the route sheet.
// AC 3: Esc and browser Back close the sheet and focus returns to the opener.
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { createDeviceStorage } from "../../src/app/storage";
import { App } from "../../src/ui/App";
import { copy } from "../../src/ui/copy";

function startOnMap() {
  window.localStorage.clear();
  const storage = createDeviceStorage(window.localStorage);
  storage.markIntroSeen();
  render(<App storage={storage} />);
  fireEvent.click(screen.getByRole("button", { name: copy.start.newJourney }));
}

const chip = (city: string) =>
  screen.getByRole("button", { name: new RegExp(`^${city}`) });

beforeEach(() => {
  window.history.replaceState(null, "");
});

describe("Story 1.6 AC1 / FR-3 map and status", () => {
  it("shows Day 1 of 30, days left, money and 0/5 stamps on a new journey", () => {
    startOnMap();

    expect(screen.getByText(copy.status.day(1, 30))).toBeInTheDocument();
    expect(screen.getByText(copy.status.left(30))).toBeInTheDocument();
    expect(screen.getByText("€1,500")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Explorer passport, 0 of 5 stamps" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: copy.map.panelTitle("Bergen") }),
    ).toBeInTheDocument();
  });

  it("draws home and the 8 destinations, each state by shape", () => {
    startOnMap();

    const map = screen.getByTestId("world-map");
    expect(map).toHaveAttribute("aria-hidden", "true");
    const markers = map.querySelectorAll("[data-place]");
    expect(markers).toHaveLength(9);
    expect(map.querySelector('[data-place="home"]')).toHaveAttribute(
      "data-state",
      "current",
    );
    expect(
      map.querySelectorAll('[data-state="notYet"]').length,
    ).toBeGreaterThan(0);
  });

  it("lists one chip per route from here with its cheapest price", () => {
    startOnMap();
    expect(chip("Copenhagen")).toHaveTextContent(copy.map.chipFrom(70));
    expect(chip("Sydney")).toHaveTextContent(copy.map.chipFrom(800));
    expect(
      within(screen.getByRole("region")).getAllByRole("button"),
    ).toHaveLength(8);
  });
});

describe("Story 1.6 AC2 / UX-DR4 opening the route sheet", () => {
  it("opens from a chip, with the map behind made inert", () => {
    startOnMap();
    fireEvent.click(chip("Copenhagen"));

    expect(
      screen.getByRole("dialog", { name: "Bergen → Copenhagen" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("inert");
  });

  it("opens from a separate map marker (pointer only); Europe's are decorative", () => {
    startOnMap();
    const map = screen.getByTestId("world-map");
    expect(map.querySelector('[data-place="paris"]')).not.toHaveAttribute(
      "data-target",
    );

    const tokyo = map.querySelector('[data-place="tokyo"]');
    expect(tokyo).toHaveAttribute("data-target", "true");
    fireEvent.click(tokyo as Element);
    expect(
      screen.getByRole("dialog", { name: "Bergen → Tokyo" }),
    ).toBeInTheDocument();
  });
});

describe("Story 1.6 AC3 / UX-DR2 closing the route sheet", () => {
  it("Esc closes and focus returns to the chip that opened it", async () => {
    startOnMap();
    fireEvent.click(chip("Copenhagen"));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(chip("Copenhagen")).toHaveFocus();
    expect(screen.getByRole("main")).not.toHaveAttribute("inert");
  });

  it("browser Back closes and focus returns to the chip", () => {
    startOnMap();
    fireEvent.click(chip("Paris"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(chip("Paris")).toHaveFocus();
  });

  it("a marker's sheet hands focus back to the same city's chip", async () => {
    startOnMap();
    const tokyo = screen
      .getByTestId("world-map")
      .querySelector('[data-place="tokyo"]');
    fireEvent.click(tokyo as Element);
    fireEvent.click(screen.getByRole("button", { name: copy.route.close }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(chip("Tokyo")).toHaveFocus();
  });
});
