// @vitest-environment jsdom
// Story 1.7: the TEMPORARY journey end (until Stories 3.2 / 3.3) shows only
// what the rules decided (outcome, failReason, calledHome). Game states come
// from apply() on the real content, never from the UI.
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ContentProvider } from "../../src/app/content";
import { loadContent } from "../../src/content/load";
import { apply, startJourney } from "../../src/rules/apply";
import type { GameState } from "../../src/rules/types";
import { copy } from "../../src/ui/copy";
import { TemporaryJourneyEnd } from "../../src/ui/screens/TemporaryJourneyEnd";

const content = loadContent();

function ended(overrides: Partial<GameState>): GameState {
  const result = apply(null, startJourney({ name: "Ada" }), content);
  if (!result.ok) throw new Error("startJourney rejected");
  return { ...result.state, ...overrides };
}

function renderEnd(game: GameState) {
  const onNewJourney = vi.fn();
  render(
    <ContentProvider>
      <TemporaryJourneyEnd game={game} onNewJourney={onNewJourney} />
    </ContentProvider>,
  );
  return onNewJourney;
}

describe("Story 1.7 temporary journey end (FR-11, FR-13)", () => {
  it("shows goal reached", () => {
    renderEnd(ended({ outcome: "goalReached" }));
    expect(
      screen.getByRole("heading", { level: 1, name: copy.end.reached }),
    ).toHaveFocus();
    expect(screen.getByText(copy.end.goalReached)).toBeInTheDocument();
  });

  it("shows stranded with the city and Goal not reached", () => {
    renderEnd(
      ended({ position: "rome", outcome: "failed", failReason: "stranded" }),
    );
    expect(
      screen.getByRole("heading", { name: copy.end.failed }),
    ).toBeVisible();
    expect(screen.getByText(copy.end.stranded("Rome"))).toBeInTheDocument();
    expect(screen.getByText(copy.end.goalNotReached)).toBeInTheDocument();
  });

  it("shows out of days with the city", () => {
    renderEnd(
      ended({ position: "tokyo", outcome: "failed", failReason: "outOfDays" }),
    );
    expect(screen.getByText(copy.end.outOfDays("Tokyo"))).toBeInTheDocument();
  });

  it("marks a called-home journey and offers a new journey", () => {
    const onNewJourney = renderEnd(
      ended({ outcome: "goalNotReached", calledHome: true }),
    );
    expect(screen.getByText(copy.end.calledHome)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: copy.end.newJourney }));
    expect(onNewJourney).toHaveBeenCalledTimes(1);
  });

  it("is marked as temporary in the DOM", () => {
    renderEnd(ended({ outcome: "goalNotReached" }));
    expect(screen.getByRole("main")).toHaveAttribute(
      "data-temporary",
      "journey-end",
    );
  });
});
