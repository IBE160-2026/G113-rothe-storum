// @vitest-environment jsdom
// #50: App goes to the Map only when the store shows that startJourney was
// accepted. Today App never passes a mode, so `startJourney` cannot be
// rejected through the UI. This file makes the action creator ask for the
// "nomad" mode, which core content does not have, so `apply` rejects it with
// UNKNOWN_MODE exactly as a future mode selection (Epic 6) could.
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDeviceStorage } from "../../src/app/storage";
import { App } from "../../src/ui/App";
import { copy } from "../../src/ui/copy";

const reject = vi.hoisted(() => ({ on: true }));

vi.mock("../../src/rules/apply", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/rules/apply")>();
  return {
    ...actual,
    startJourney: (payload: { name: string }) =>
      actual.startJourney(reject.on ? { ...payload, mode: "nomad" } : payload),
  };
});

beforeEach(() => {
  window.localStorage.clear();
  reject.on = true;
});

const deviceStorage = () => createDeviceStorage(window.localStorage);
const click = (name: string) =>
  fireEvent.click(screen.getByRole("button", { name }));
const mapHeading = () =>
  screen.queryByRole("heading", { level: 1, name: copy.map.heading });

describe("#50 FR-2 a rejected startJourney does not open the map", () => {
  it("stays on Start when the intro was already seen, keeping the name", () => {
    const storage = deviceStorage();
    storage.markIntroSeen();
    render(<App storage={storage} />);
    const input = screen.getByRole("textbox", { name: /Your name/ });
    fireEvent.change(input, { target: { value: "Jonas" } });

    click(copy.start.newJourney);

    expect(screen.getByRole("textbox", { name: /Your name/ })).toHaveValue(
      "Jonas",
    );

    expect(mapHeading()).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: copy.start.newJourney }),
    ).toBeInTheDocument();
  });

  it("goes back to Start after the first-visit intro", () => {
    render(<App storage={deviceStorage()} />);

    click(copy.start.newJourney);
    click(copy.intro.letsGo);

    expect(mapHeading()).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: copy.start.newJourney }),
    ).toBeInTheDocument();
  });

  it("opens the map once a later start is accepted", () => {
    const storage = deviceStorage();
    storage.markIntroSeen();
    render(<App storage={storage} />);

    click(copy.start.newJourney);
    expect(mapHeading()).not.toBeInTheDocument();

    reject.on = false;
    click(copy.start.newJourney);
    expect(mapHeading()).toBeInTheDocument();
  });
});
