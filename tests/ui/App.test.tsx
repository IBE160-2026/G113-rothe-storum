// @vitest-environment jsdom
// Story 1.5 acceptance criteria, through the whole app (FR-1, FR-2, AR-7):
// 1. First visit: "New journey" shows the intro (goal, €1,500, 30 days) before the map.
// 2. Intro seen: it is skipped and can be reopened from the menu.
// 3. Storage blocked: the game works and the intro shows every time.
// 4. Name: the field enforces the FR-1 rule and the last name is prefilled.
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { createDeviceStorage } from "../../src/app/storage";
import { App } from "../../src/ui/App";
import { copy } from "../../src/ui/copy";

beforeEach(() => {
  window.localStorage.clear();
});

const deviceStorage = () => createDeviceStorage(window.localStorage);
const click = (name: string) =>
  fireEvent.click(screen.getByRole("button", { name }));
const nameInput = () => screen.getByRole("textbox", { name: /Your name/ });
const onMap = () =>
  expect(
    screen.getByRole("heading", { level: 1, name: copy.map.heading }),
  ).toBeInTheDocument();
const onIntro = () =>
  expect(
    screen.getByRole("heading", { level: 1, name: copy.intro.heading }),
  ).toBeInTheDocument();

describe("Story 1.5 / FR-2 first-time intro", () => {
  it("AC1: a first visit goes Start → intro (goal, €1,500, 30 days) → map", () => {
    render(<App storage={deviceStorage()} />);

    click(copy.start.newJourney);
    onIntro();
    expect(screen.getByText(copy.intro.goal(5, 30))).toBeInTheDocument();
    expect(screen.getByText("€1,500")).toBeInTheDocument();
    expect(screen.getByText("30 days")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: copy.intro.close }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(copy.intro.reopenHint)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();

    click(copy.intro.letsGo);
    onMap();
  });

  it("AC2: once seen, New journey skips the intro (also after a reload)", () => {
    const first = render(<App storage={deviceStorage()} />);
    click(copy.start.newJourney);
    click(copy.intro.letsGo);
    first.unmount();

    render(<App storage={deviceStorage()} />);
    click(copy.start.newJourney);
    onMap();
  });

  it("AC2: the intro reopens from the menu and goes back to the journey", () => {
    deviceStorage().markIntroSeen();
    render(<App storage={deviceStorage()} />);
    click(copy.start.newJourney);
    onMap();

    const menuButton = screen.getByRole("button", { name: copy.menu.open });
    fireEvent.click(menuButton);
    const dialog = screen.getByRole("dialog", { name: copy.menu.title });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(
      screen.getByRole("heading", { name: copy.menu.title }),
    ).toHaveFocus();

    click(copy.menu.howToPlay);
    onIntro();
    expect(
      screen.getByRole("button", { name: copy.intro.close }),
    ).toBeInTheDocument();
    click(copy.intro.backToJourney);
    onMap();

    fireEvent.click(screen.getByRole("button", { name: copy.menu.open }));
    click(copy.menu.howToPlay);
    click(copy.intro.close);
    onMap();
  });

  it("closes the menu with Esc and × and returns focus to the menu button", () => {
    deviceStorage().markIntroSeen();
    render(<App storage={deviceStorage()} />);
    click(copy.start.newJourney);

    const menuButton = screen.getByRole("button", { name: copy.menu.open });
    fireEvent.click(menuButton);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(menuButton).toHaveFocus();

    fireEvent.click(menuButton);
    click(copy.menu.close);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(menuButton).toHaveFocus();
  });

  it("How to play on Start opens the intro and Got it / × go back to Start", () => {
    render(<App storage={deviceStorage()} />);

    click(copy.start.howToPlay);
    onIntro();
    click(copy.intro.gotIt);
    expect(
      screen.getByRole("button", { name: copy.start.newJourney }),
    ).toBeInTheDocument();

    click(copy.start.howToPlay);
    click(copy.intro.close);
    expect(
      screen.getByRole("button", { name: copy.start.newJourney }),
    ).toBeInTheDocument();
  });

  it("AC3: with storage blocked the game works and the intro shows on every load", () => {
    const first = render(<App storage={createDeviceStorage(null)} />);
    click(copy.start.newJourney);
    onIntro();
    click(copy.intro.letsGo);
    onMap();
    first.unmount();

    render(<App storage={createDeviceStorage(null)} />);
    click(copy.start.newJourney);
    onIntro();
  });
});

describe("Story 1.5 / FR-1 name", () => {
  it("AC4: the last name is prefilled next time, trimmed and capped", () => {
    const first = render(<App storage={deviceStorage()} />);
    fireEvent.change(nameInput(), {
      target: { value: "  Ingrid Østby-Kalvøya Bergen" },
    });
    expect(nameInput()).toHaveValue("Ingrid Østby-K");
    click(copy.start.newJourney);
    first.unmount();

    render(<App storage={deviceStorage()} />);
    expect(nameInput()).toHaveValue("Ingrid Østby-K");
  });

  it("AC4: an empty name is not remembered", () => {
    deviceStorage().setLastName("Ingrid");
    const first = render(<App storage={deviceStorage()} />);
    fireEvent.change(nameInput(), { target: { value: "   " } });
    click(copy.start.newJourney);
    first.unmount();

    render(<App storage={deviceStorage()} />);
    expect(nameInput()).toHaveValue("");
  });
});
