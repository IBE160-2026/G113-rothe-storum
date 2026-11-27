// @vitest-environment jsdom
// Story 1.6, AC 2 (FR-4, AD-3, UX-DR3): the route sheet shows every mode's
// price and days exactly as routesFrom() returns them; unavailable modes show
// their reason; the home warning is icon + text and never blocks. States are
// built with apply() and the real content, so the expected values come from
// the rules, not from the test.
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { loadContent } from "../../src/content/load";
import { apply, startJourney } from "../../src/rules/apply";
import { daysTotal, routesFrom } from "../../src/rules/queries";
import type { GameState, PlaceId, TransportMode } from "../../src/rules/types";
import { copy } from "../../src/ui/copy";
import { RouteSheet } from "../../src/ui/sheets/RouteSheet";

const content = loadContent();

function journey(overrides: Partial<GameState> = {}): GameState {
  const result = apply(null, startJourney({ name: "Ada" }), content);
  if (!result.ok) throw new Error("startJourney rejected");
  return { ...result.state, ...overrides };
}

function renderSheet(
  game: GameState,
  to: PlaceId,
  onRequestClose = vi.fn(),
  onConfirm?: (mode: TransportMode) => void,
) {
  const route = routesFrom(game, content).find((r) => r.to === to);
  if (!route) throw new Error(`no route to ${to}`);
  const name = (id: PlaceId) =>
    id === "home"
      ? content.home.name
      : (content.destinations.find((d) => d.id === id)?.name ?? id);
  render(
    <RouteSheet
      route={route}
      fromName={name(game.position)}
      toName={name(to)}
      toIsHome={to === "home"}
      toStamped={game.stamps.some((s) => s.id === to)}
      money={game.money}
      daysTotal={daysTotal(game, content)}
      stamps={game.stamps.length}
      goalStamps={content.config.goalStamps}
      onRequestClose={onRequestClose}
      onConfirm={onConfirm}
    />,
  );
  return { route, onRequestClose, onConfirm };
}

const row = (mode: string) =>
  screen.getByRole("radio", { name: new RegExp(`^${mode}`) });

describe("Story 1.6 AC2 / FR-4 route sheet", () => {
  it("shows every mode's price and days from routesFrom (Bergen → Copenhagen)", () => {
    const { route } = renderSheet(journey(), "copenhagen");

    expect(
      screen.getByRole("dialog", { name: "Bergen → Copenhagen" }),
    ).toHaveAttribute("aria-modal", "true");
    expect(screen.getAllByRole("radio")).toHaveLength(route.options.length);
    for (const option of route.options) {
      const name = copy.route.modeName[option.mode];
      const label = row(name).closest("label");
      expect(label).toHaveTextContent(copy.route.price(option.price));
      expect(label).toHaveTextContent(
        copy.route.row(option.days, option.arrivalDay + 1),
      );
    }
    expect(screen.getByText("Copenhagen isn't stamped yet.")).toBeVisible();
  });

  it("marks modes the player cannot afford with the reason (NOT_ENOUGH_MONEY)", () => {
    const game = journey({ money: 100 });
    const { route } = renderSheet(game, "copenhagen");
    expect(route.options.map((o) => o.reason)).toEqual([
      "NOT_ENOUGH_MONEY",
      "NOT_ENOUGH_MONEY",
      null,
    ]);

    for (const mode of ["Plane", "Train"]) {
      expect(row(mode)).toBeDisabled();
      expect(row(mode)).toHaveAttribute("aria-disabled", "true");
      expect(row(mode)).toHaveAccessibleName(
        expect.stringContaining(copy.route.notEnoughMoney(100)),
      );
    }
    expect(row("Bus")).toBeEnabled();
  });

  it("marks modes whose days exceed the days remaining (NOT_ENOUGH_DAYS)", () => {
    const game = journey({ daysUsed: 29 });
    const { route } = renderSheet(game, "copenhagen");
    const bus = route.options.find((o) => o.mode === "bus");
    expect(bus?.reason).toBe("NOT_ENOUGH_DAYS");

    expect(row("Bus")).toBeDisabled();
    expect(row("Bus")).toHaveAccessibleName(
      expect.stringContaining(
        copy.route.notEnoughDays(bus?.arrivalDay ?? 0, 30),
      ),
    );
    expect(row("Plane")).toBeEnabled();
  });

  it("shows the home warning as icon + text on a selectable row", () => {
    const game = journey({ daysUsed: 27 });
    const { route } = renderSheet(game, "sydney");
    expect(route.options[0]).toMatchObject({
      available: true,
      homeUnreachable: true,
    });

    const plane = row("Plane");
    expect(plane).toBeEnabled();
    expect(plane).toHaveAccessibleDescription(copy.route.warning);
    const warning = screen.getByText(copy.route.warning);
    expect(warning.querySelector("svg")).not.toBeNull();

    fireEvent.click(plane);
    expect(plane).toBeChecked();
  });

  it("names every unavailable option the same way routesFrom does (AD-3)", () => {
    const game = journey({ money: 60, daysUsed: 28 });
    for (const route of routesFrom(game, content)) {
      const { unmount } = render(
        <RouteSheet
          route={route}
          fromName="Bergen"
          toName={route.to}
          toIsHome={false}
          toStamped={false}
          money={game.money}
          daysTotal={30}
          stamps={0}
          goalStamps={5}
          onRequestClose={() => {}}
        />,
      );
      const radios = screen.getAllByRole("radio");
      route.options.forEach((option, i) => {
        expect(radios[i]).toHaveProperty("disabled", !option.available);
      });
      unmount();
    }
  });

  it("keeps the primary button unavailable until Story 1.7 wires travel", () => {
    renderSheet(journey(), "copenhagen");
    const primary = screen.getByRole("button", { name: copy.route.choose });
    expect(primary).toHaveAttribute("aria-disabled", "true");

    fireEvent.click(row("Bus"));
    expect(
      screen.getByRole("button", {
        name: copy.route.primary("Take the bus", 70),
      }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("focuses the headline, wraps Tab and closes on Esc and ×", () => {
    const { onRequestClose } = renderSheet(journey(), "copenhagen");
    const dialog = screen.getByRole("dialog");
    expect(
      within(dialog).getByRole("heading", { name: "Bergen → Copenhagen" }),
    ).toHaveFocus();

    const primary = within(dialog).getByRole("button", {
      name: copy.route.choose,
    });
    primary.focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(
      within(dialog).getByRole("button", { name: copy.route.close }),
    ).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Escape" });
    fireEvent.click(
      within(dialog).getByRole("button", { name: copy.route.close }),
    );
    expect(onRequestClose).toHaveBeenCalledTimes(2);
  });
});

// Story 1.7 (FR-6, FR-7): the primary commits the chosen mode; a route to
// Bergen swaps to Travel home first, and "Not now" swaps back unchanged.
describe("Story 1.7 / FR-6 FR-7 confirm travel in the route sheet", () => {
  it("commits the chosen available mode through onConfirm", () => {
    const onConfirm = vi.fn();
    renderSheet(journey(), "copenhagen", vi.fn(), onConfirm);

    const choose = screen.getByRole("button", { name: copy.route.choose });
    fireEvent.click(choose);
    expect(onConfirm).not.toHaveBeenCalled();

    fireEvent.click(row("Bus"));
    fireEvent.click(
      screen.getByRole("button", {
        name: copy.route.primary("Take the bus", 70),
      }),
    );
    expect(onConfirm).toHaveBeenCalledExactlyOnceWith("bus");
  });

  it("cannot commit an unavailable mode (NOT_ENOUGH_MONEY)", () => {
    const onConfirm = vi.fn();
    renderSheet(journey({ money: 100 }), "copenhagen", vi.fn(), onConfirm);

    // A browser never dispatches clicks to a disabled radio; jsdom may still
    // tick it, so assert on what matters: nothing becomes committable.
    expect(row("Plane")).toBeDisabled();
    fireEvent.click(row("Plane"));
    const primary = screen.getByRole("button", { name: copy.route.choose });
    expect(primary).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(primary);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("swaps to Travel home on a route to Bergen; Not now swaps back unchanged", () => {
    const onConfirm = vi.fn();
    const game = journey({
      position: "copenhagen",
      money: 900,
      daysUsed: 4,
      stamps: [{ id: "copenhagen", day: 3 }],
    });
    renderSheet(game, "home", vi.fn(), onConfirm);

    fireEvent.click(row("Train"));
    fireEvent.click(
      screen.getByRole("button", { name: copy.route.continueHome(110) }),
    );
    expect(onConfirm).not.toHaveBeenCalled();

    const title = copy.home.title("train", copy.home.verb.train);
    expect(screen.getByRole("dialog", { name: title })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: title })).toHaveFocus();
    expect(screen.getByText(copy.home.stamps(1, 5))).toBeInTheDocument();
    expect(screen.getByText(copy.home.ends)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: copy.home.notNow }));
    expect(
      screen.getByRole("dialog", { name: "Copenhagen → Bergen" }),
    ).toBeInTheDocument();
    expect(row("Train")).toBeChecked();
    expect(onConfirm).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: copy.route.continueHome(110) }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: copy.home.primary("Take the train home", 110),
      }),
    );
    expect(onConfirm).toHaveBeenCalledExactlyOnceWith("train");
  });

  it("closes Travel home on Esc and keeps Tab inside", () => {
    const onRequestClose = vi.fn();
    const game = journey({ position: "copenhagen", money: 900 });
    renderSheet(game, "home", onRequestClose, vi.fn());
    fireEvent.click(row("Bus"));
    fireEvent.click(
      screen.getByRole("button", { name: copy.route.continueHome(70) }),
    );

    const dialog = screen.getByRole("dialog");
    within(dialog).getByRole("button", { name: copy.home.notNow }).focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(
      within(dialog).getByRole("button", { name: copy.route.close }),
    ).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });
});
