// @vitest-environment jsdom
// Story 1.7 through the app (FR-6, FR-7, AD-2, UX-DR2):
// AC 1: confirming a mode applies `travel`; the map updates position, money
//       and the day counter (the arrival card is Story 2.3).
// AC 2: a route to Bergen shows Travel home; "Not now" changes nothing; the
//       confirmed trip home ends the journey on the temporary end screen.
// #65: no history entry is left behind, even when the trip ends the journey.
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
const radio = (mode: string) =>
  screen.getByRole("radio", { name: new RegExp(`^${mode}`) });

async function travelTo(city: string, mode: string, primary: string) {
  fireEvent.click(chip(city));
  fireEvent.click(radio(mode));
  fireEvent.click(screen.getByRole("button", { name: primary }));
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
}

beforeEach(() => {
  window.history.replaceState(null, "");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Story 1.7 AC1 / FR-6 confirm travel", () => {
  it("travels Bergen → Copenhagen by bus and updates position, money and day", async () => {
    startOnMap();
    await travelTo(
      "Copenhagen",
      "Bus",
      copy.route.primary(copy.route.verb.bus, 70),
    );

    expect(screen.getByText(copy.status.day(3, 30))).toBeInTheDocument();
    expect(screen.getByText(copy.status.left(28))).toBeInTheDocument();
    expect(screen.getByText("€1,430")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: copy.map.panelTitle("Copenhagen") }),
    ).toBeInTheDocument();
    expect(
      screen
        .getByTestId("world-map")
        .querySelector('[data-place="copenhagen"]'),
    ).toHaveAttribute("data-state", "current");
    expect(
      screen.getByRole("heading", { level: 1, name: copy.map.heading }),
    ).toHaveFocus();
    expect(screen.getByRole("main")).not.toHaveAttribute("inert");
  });
});

describe("Story 1.7 AC2 / FR-7 travel home", () => {
  it("Not now returns to the route sheet and nothing changes", () => {
    startOnMap();
    // At home the routes lead away; travel first so Bergen is a route.
    return travelTo(
      "Copenhagen",
      "Bus",
      copy.route.primary(copy.route.verb.bus, 70),
    ).then(() => {
      fireEvent.click(chip("Bergen"));
      fireEvent.click(radio("Train"));
      fireEvent.click(
        screen.getByRole("button", { name: copy.route.continueHome(110) }),
      );
      expect(screen.getByText(copy.home.stamps(0, 5))).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: copy.home.notNow }));

      expect(
        screen.getByRole("dialog", { name: "Copenhagen → Bergen" }),
      ).toBeInTheDocument();
      expect(screen.getByText("€1,430")).toBeInTheDocument();
      expect(screen.getByText(copy.status.day(3, 30))).toBeInTheDocument();
    });
  });

  it("the confirmed trip home ends the journey on the temporary end screen", async () => {
    startOnMap();
    await travelTo(
      "Copenhagen",
      "Bus",
      copy.route.primary(copy.route.verb.bus, 70),
    );
    fireEvent.click(chip("Bergen"));
    fireEvent.click(radio("Train"));
    fireEvent.click(
      screen.getByRole("button", { name: copy.route.continueHome(110) }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: copy.home.primary(copy.home.verb.train, 110),
      }),
    );

    expect(
      await screen.findByRole("heading", { name: copy.end.notReached }),
    ).toHaveFocus();
    expect(screen.getByText(copy.end.goalNotReached)).toBeInTheDocument();
    expect(screen.queryByText(copy.end.calledHome)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: copy.end.newJourney }));
    expect(
      screen.getByRole("button", { name: copy.start.newJourney }),
    ).toBeInTheDocument();
  });
});

describe("#65 no history entry left behind", () => {
  it("pushes one entry per sheet and pops it once, also when the trip ends the journey", async () => {
    const push = vi.spyOn(window.history, "pushState");
    const back = vi.spyOn(window.history, "back");
    startOnMap();
    await travelTo(
      "Copenhagen",
      "Bus",
      copy.route.primary(copy.route.verb.bus, 70),
    );
    expect(push).toHaveBeenCalledTimes(1);
    expect(back).toHaveBeenCalledTimes(1);

    fireEvent.click(chip("Bergen"));
    fireEvent.click(radio("Bus"));
    fireEvent.click(
      screen.getByRole("button", { name: copy.route.continueHome(70) }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: copy.home.primary(copy.home.verb.bus, 70),
      }),
    );
    await screen.findByRole("heading", { name: copy.end.notReached });
    expect(push).toHaveBeenCalledTimes(2);
    // Exactly one back per pushed entry: never twice (that would leave the app).
    expect(back).toHaveBeenCalledTimes(2);
  });
});
