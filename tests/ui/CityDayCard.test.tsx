// @vitest-environment jsdom
// Story 2.3 (decision A): the city-day card on the Map. States come from
// apply() on the real content and cityDayStatus() (AD-3). "About {city}" is
// the entry that reopens the fact card (AC 2); "Plan the day" goes to City
// day (Story 2.4) and is unavailable with its reason when the city day is.
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { loadContent } from "../../src/content/load";
import { apply, startJourney } from "../../src/rules/apply";
import { cityDayStatus } from "../../src/rules/queries";
import type { GameState } from "../../src/rules/types";
import { CityDayCard } from "../../src/ui/components/CityDayCard";
import { copy } from "../../src/ui/copy";

const content = loadContent();

function state(overrides: Partial<GameState> = {}): GameState {
  const start = apply(null, startJourney({ name: "Ingrid" }), content);
  if (!start.ok) throw new Error("startJourney rejected");
  return {
    ...start.state,
    position: "paris",
    money: 1270,
    daysUsed: 5,
    ...overrides,
  };
}

function renderCard(game: GameState) {
  const onPlanDay = vi.fn();
  const onAbout = vi.fn();
  const { container } = render(
    <CityDayCard
      city="Paris"
      cityDay={cityDayStatus(game, content)}
      stamped={game.stamps.some((s) => s.id === "paris")}
      money={game.money}
      onPlanDay={onPlanDay}
      onAbout={onAbout}
    />,
  );
  return { onPlanDay, onAbout, container };
}

describe("Story 2.3 city-day card (FR-5, FR-8, FR-10)", () => {
  it("shows the city, the stay price from the rules and both actions", () => {
    const { onPlanDay } = renderCard(state());

    expect(
      screen.getByRole("region", { name: copy.map.card.title("Paris", 80) }),
    ).toBeInTheDocument();
    expect(screen.getByText(copy.map.card.eyebrow("Paris"))).toBeVisible();
    expect(
      screen.getByText(copy.map.card.hintFirst("Paris")),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: copy.map.card.planDay }),
    );
    expect(onPlanDay).toHaveBeenCalledTimes(1);
  });

  it("AC2 entry: About {city} reports the button so focus can return to it", () => {
    const { onAbout } = renderCard(state());
    const about = screen.getByRole("button", {
      name: copy.map.card.about("Paris"),
    });
    expect(about).toHaveAttribute("aria-haspopup", "dialog");

    fireEvent.click(about);
    expect(onAbout).toHaveBeenCalledExactlyOnceWith(about);
  });

  it("uses the repeat hint when Paris is already stamped", () => {
    renderCard(
      state({ stamps: [{ id: "paris", day: 6 }], cityDays: { paris: 1 } }),
    );
    expect(
      screen.getByText(copy.map.card.hintRepeat("Paris")),
    ).toBeInTheDocument();
  });

  it("shows Plan the day unavailable with the reason when money is short", () => {
    const game = state({ money: 40 });
    expect(cityDayStatus(game, content).reason).toBe("NOT_ENOUGH_MONEY");
    const { onPlanDay } = renderCard(game);

    const plan = screen.getByRole("button", { name: copy.map.card.planDay });
    expect(plan).toHaveAttribute("aria-disabled", "true");
    expect(plan).toHaveAccessibleDescription(copy.arrival.notEnoughMoney(40));
    fireEvent.click(plan);
    expect(onPlanDay).not.toHaveBeenCalled();
  });

  it("renders nothing at home (no city day there)", () => {
    const { container } = renderCard(state({ position: "home" }));
    expect(container).toBeEmptyDOMElement();
  });
});
