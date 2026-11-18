// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { copy } from "../../src/ui/copy";
import { StartScreen } from "../../src/ui/screens/StartScreen";

describe("StartScreen (Story 1.1 placeholder)", () => {
  it("renders the game title from copy as the only heading", () => {
    render(<StartScreen />);

    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(copy.start.title);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
