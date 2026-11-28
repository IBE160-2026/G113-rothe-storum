// @vitest-environment jsdom
// Story 2.3 (FR-5, UX-DR1, UX-DR3): the Arrival fact card. States are built
// with apply() on the real content and cityDayStatus() from the rules, so
// availability, reason and price come from the rules, not the test (AD-3).
// AC 1: on arrival the card shows destination, day, money and the fact card,
//       with "Plan the day".
// AC 2: reopened at the destination, the same fact card is shown.
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { loadContent } from "../../src/content/load";
import { apply, startJourney } from "../../src/rules/apply";
import { cityDayStatus } from "../../src/rules/queries";
import type { GameState } from "../../src/rules/types";
import { copy } from "../../src/ui/copy";
import {
  ArrivalSheet,
  type ArrivalTrip,
} from "../../src/ui/sheets/ArrivalSheet";

const content = loadContent();
const copenhagen = content.destinations.find((d) => d.id === "copenhagen");
if (!copenhagen) throw new Error("copenhagen missing from content");

/** Bergen → Copenhagen by bus (UJ-1): €1,430, 2 days used. */
function inCopenhagen(overrides: Partial<GameState> = {}): GameState {
  const start = apply(null, startJourney({ name: "Ingrid" }), content);
  if (!start.ok) throw new Error("startJourney rejected");
  return {
    ...start.state,
    position: "copenhagen",
    money: 1430,
    daysUsed: 2,
    ...overrides,
  };
}

const bus: ArrivalTrip = { mode: "bus", from: "Bergen", days: 2, price: 70 };

function renderCard(
  game: GameState,
  mode: "arrival" | "read" = "arrival",
  handlers = { onPlanDay: vi.fn(), onClose: vi.fn() },
) {
  render(
    <ArrivalSheet
      mode={mode}
      city="Copenhagen"
      fact={copenhagen?.fact ?? ""}
      cityDay={cityDayStatus(game, content)}
      stamped={game.stamps.some((s) => s.id === "copenhagen")}
      day={game.daysUsed + 1}
      daysTotal={30}
      money={game.money}
      trip={mode === "arrival" ? bus : undefined}
      onPlanDay={handlers.onPlanDay}
      onClose={handlers.onClose}
    />,
  );
  return handlers;
}

describe("Story 2.3 AC1 / FR-5 arrival", () => {
  it("shows destination, day, money, the trip and the fact card, with Plan the day", () => {
    const handlers = renderCard(inCopenhagen());

    const dialog = screen.getByRole("dialog", {
      name: copy.arrival.welcome("Copenhagen"),
    });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(
      screen.getByText(copy.arrival.eyebrow(3, 30, 1430)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(copy.arrival.trip("bus", "Bergen", 2, 70)),
    ).toBeInTheDocument();
    expect(screen.getByText(copenhagen?.fact ?? "")).toBeInTheDocument();
    expect(
      screen.getByText(copy.arrival.costFirst(90, "Copenhagen")),
    ).toBeInTheDocument();
    expect(screen.getByText(copy.arrival.noStampYet)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: copy.arrival.welcome("Copenhagen") }),
    ).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: copy.arrival.planDay }));
    expect(handlers.onPlanDay).toHaveBeenCalledTimes(1);
    fireEvent.click(
      screen.getByRole("button", { name: copy.arrival.passThrough }),
    );
    expect(handlers.onClose).toHaveBeenCalledTimes(1);
  });

  it("uses the repeat copy when the city is already stamped", () => {
    renderCard(
      inCopenhagen({
        stamps: [{ id: "copenhagen", day: 3 }],
        cityDays: { copenhagen: 1 },
      }),
    );
    expect(
      screen.getByRole("heading", { name: copy.arrival.backIn("Copenhagen") }),
    ).toBeInTheDocument();
    expect(screen.getByText(copy.arrival.costRepeat(90))).toBeInTheDocument();
    expect(
      screen.getByText(copy.arrival.stamped("Copenhagen")),
    ).toBeInTheDocument();
    expect(screen.queryByText(copy.arrival.noStampYet)).not.toBeInTheDocument();
  });

  it("shows Plan the day unavailable with the money reason (NOT_ENOUGH_MONEY)", () => {
    const game = inCopenhagen({ money: 50 });
    expect(cityDayStatus(game, content)).toMatchObject({
      available: false,
      reason: "NOT_ENOUGH_MONEY",
    });
    const handlers = renderCard(game);

    const plan = screen.getByRole("button", { name: copy.arrival.planDay });
    expect(plan).toHaveAttribute("aria-disabled", "true");
    expect(plan).toHaveAccessibleDescription(copy.arrival.notEnoughMoney(50));
    fireEvent.click(plan);
    expect(handlers.onPlanDay).not.toHaveBeenCalled();
  });

  it("shows Plan the day unavailable with the days reason (NOT_ENOUGH_DAYS)", () => {
    const game = inCopenhagen({ daysUsed: 30 });
    expect(cityDayStatus(game, content).reason).toBe("NOT_ENOUGH_DAYS");
    renderCard(game);
    expect(
      screen.getByRole("button", { name: copy.arrival.planDay }),
    ).toHaveAccessibleDescription(copy.arrival.noDays);
  });

  it("closes on Esc and keeps Tab inside", () => {
    const handlers = renderCard(inCopenhagen());
    const dialog = screen.getByRole("dialog");
    within(dialog)
      .getByRole("button", { name: copy.arrival.passThrough })
      .focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(
      within(dialog).getByRole("button", { name: copy.arrival.close }),
    ).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(handlers.onClose).toHaveBeenCalledTimes(1);
  });
});

describe("Story 2.3 AC2 / FR-5 reopened fact card", () => {
  it("shows the same fact card in read mode, with no arrival pill or buttons", () => {
    const handlers = renderCard(inCopenhagen(), "read");

    expect(
      screen.getByRole("dialog", { name: copy.arrival.about("Copenhagen") }),
    ).toBeInTheDocument();
    expect(screen.getByText(copenhagen?.fact ?? "")).toBeInTheDocument();
    expect(
      screen.queryByText(copy.arrival.trip("bus", "Bergen", 2, 70)),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: copy.arrival.close }));
    expect(handlers.onClose).toHaveBeenCalledTimes(1);
  });
});
