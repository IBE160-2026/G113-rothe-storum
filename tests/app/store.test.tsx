// @vitest-environment jsdom
// Journey store (Story 1.5, AD-2, AD-3): every change goes through apply();
// a rejected action keeps the game and records the reason code.
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentProvider } from "../../src/app/content";
import {
  initialJourneyState,
  journeyReducer,
  JourneyProvider,
  useJourney,
} from "../../src/app/store";
import { loadContent } from "../../src/content/load";
import { startJourney, travel } from "../../src/rules/apply";

const content = loadContent();

describe("AD-2 journey store", () => {
  it("starts with no journey", () => {
    expect(initialJourneyState).toEqual({ game: null, rejection: null });
  });

  it("starts a journey through apply (FR-1)", () => {
    const next = journeyReducer(
      initialJourneyState,
      startJourney({ name: "  Ingrid  " }),
      content,
    );
    expect(next.rejection).toBeNull();
    expect(next.game).toMatchObject({
      travellerName: "Ingrid",
      position: "home",
      money: 1500,
      daysUsed: 0,
    });
  });

  it("keeps the state and records the reason when apply rejects", () => {
    const next = journeyReducer(
      initialJourneyState,
      travel({ to: "copenhagen", mode: "bus" }),
      content,
    );
    expect(next).toEqual({ game: null, rejection: "NO_JOURNEY" });
  });

  it("clears the reason after an accepted action", () => {
    const rejected = { game: null, rejection: "NO_JOURNEY" as const };
    const next = journeyReducer(rejected, startJourney({ name: "" }), content);
    expect(next.rejection).toBeNull();
    expect(next.game?.travellerName).toBe("Traveller");
  });

  it("provides state and dispatch to the tree", () => {
    let api: ReturnType<typeof useJourney> | undefined;
    function Probe() {
      api = useJourney();
      return <p>{api.state.game?.travellerName ?? "none"}</p>;
    }
    render(
      <ContentProvider>
        <JourneyProvider>
          <Probe />
        </JourneyProvider>
      </ContentProvider>,
    );
    expect(screen.getByText("none")).toBeInTheDocument();

    act(() => api?.dispatch(startJourney({ name: "Ada" })));
    expect(screen.getByText("Ada")).toBeInTheDocument();
  });

  it("throws a clear error outside JourneyProvider", () => {
    function Probe() {
      useJourney();
      return null;
    }
    expect(() => render(<Probe />)).toThrow(
      "useJourney() must be used inside <JourneyProvider>",
    );
  });
});
