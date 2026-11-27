// @vitest-environment jsdom
// #64 (Story 1.7): a destination chip shows the cheapest *available* price;
// when no mode is available it names the reason of the cheapest mode. All
// values come from routesFrom() on states built with apply() (AD-3).
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadContent } from "../../src/content/load";
import { apply, startJourney } from "../../src/rules/apply";
import { routesFrom } from "../../src/rules/queries";
import type { GameState } from "../../src/rules/types";
import { RestingPanel } from "../../src/ui/components/RestingPanel";
import { copy } from "../../src/ui/copy";

const content = loadContent();

function journey(overrides: Partial<GameState> = {}): GameState {
  const result = apply(null, startJourney({ name: "Ada" }), content);
  if (!result.ok) throw new Error("startJourney rejected");
  return { ...result.state, ...overrides };
}

function renderPanel(game: GameState) {
  const routes = routesFrom(game, content);
  render(
    <RestingPanel
      place="Bergen"
      routes={routes}
      nameOf={(id) => content.destinations.find((d) => d.id === id)?.name ?? id}
      homeId={content.home.id}
      onOpen={() => {}}
    />,
  );
  return routes;
}

const chip = (city: string) =>
  screen.getByRole("button", { name: new RegExp(`^${city}`) });

describe("#64 destination chips", () => {
  it("shows the cheapest available price, not a cheaper mode that does not fit", () => {
    const routes = renderPanel(journey({ daysUsed: 29 }));
    const copenhagen = routes.find((r) => r.to === "copenhagen");
    expect(copenhagen?.options.map((o) => [o.mode, o.reason])).toEqual([
      ["plane", null],
      ["train", null],
      ["bus", "NOT_ENOUGH_DAYS"],
    ]);
    expect(chip("Copenhagen")).toHaveTextContent(copy.map.chipFrom(110));
  });

  it('names "Not enough days" when no mode fits the days left', () => {
    renderPanel(journey({ daysUsed: 30 }));
    expect(chip("Copenhagen")).toHaveTextContent(copy.map.chipNoDays);
  });

  it('names "Not enough money" when no mode is affordable', () => {
    renderPanel(journey({ money: 10 }));
    expect(chip("Copenhagen")).toHaveTextContent(copy.map.chipShort);
  });
});
