// @vitest-environment jsdom
// Start screen (Story 1.1 placeholder, extended in Story 1.5: FR-1, UX-DR1,
// UX-DR7). The game title stays the only heading; the screen reports the
// player's choices and never decides where to go.
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { copy } from "../../src/ui/copy";
import { StartScreen } from "../../src/ui/screens/StartScreen";

function renderStart(
  overrides: Partial<Parameters<typeof StartScreen>[0]> = {},
) {
  const props = {
    name: "",
    onNameChange: vi.fn(),
    onNewJourney: vi.fn(),
    onHowToPlay: vi.fn(),
    ...overrides,
  };
  render(<StartScreen {...props} />);
  return props;
}

describe("FR-1 start screen", () => {
  it("renders the game title from copy as the only heading", () => {
    renderStart();

    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(copy.start.title);
    expect(
      screen.getByRole("heading", { level: 1, name: copy.start.title }),
    ).toBeInTheDocument();
  });

  it("shows the tagline, the name field and both actions from copy", () => {
    renderStart();

    expect(screen.getByText(copy.start.tagline)).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /Your name/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: copy.start.newJourney }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: copy.start.howToPlay }),
    ).toBeInTheDocument();
  });

  it("reports New journey (button and Enter in the name field) and How to play", () => {
    const props = renderStart({ name: "Ada" });

    fireEvent.click(
      screen.getByRole("button", { name: copy.start.newJourney }),
    );
    fireEvent.submit(screen.getByRole("textbox", { name: /Your name/ }));
    fireEvent.click(screen.getByRole("button", { name: copy.start.howToPlay }));

    expect(props.onNewJourney).toHaveBeenCalledTimes(2);
    expect(props.onHowToPlay).toHaveBeenCalledTimes(1);
  });
});
