// @vitest-environment jsdom
// Stamp and Stamp slot (DESIGN.md → Stamp, Stamp slot), shared by Stories
// 3.3, 2.5 and 2.4. State is never colour alone: a stamp has its code and a
// check, an empty slot has its numeral.
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadContent } from "../../src/content/load";
import { Stamp, StampSlot } from "../../src/ui/components/Stamp";

const content = loadContent();

describe("Stamp", () => {
  it("is one image named by the caller, with the code and a check inside", () => {
    render(<Stamp code="PAR" label="Paris stamp" />);
    const stamp = screen.getByRole("img", { name: "Paris stamp" });
    expect(stamp.querySelector("text")).toHaveTextContent("PAR");
    expect(stamp.querySelector("path")).toHaveAttribute("d", "M18 27l5 5 9-9");
    expect(stamp.querySelectorAll("circle")).toHaveLength(2);
  });

  it("is 50 px by default and takes any size in the same 50-unit viewBox", () => {
    const { rerender } = render(<Stamp code="PAR" label="Paris stamp" />);
    const stamp = () => screen.getByRole("img", { name: "Paris stamp" });
    expect(stamp()).toHaveAttribute("width", "50");
    expect(stamp()).toHaveAttribute("height", "50");
    for (const size of [28, 30, 80, 96]) {
      rerender(<Stamp code="PAR" label="Paris stamp" size={size} />);
      expect(stamp()).toHaveAttribute("width", String(size));
      expect(stamp()).toHaveAttribute("height", String(size));
      expect(stamp()).toHaveAttribute("viewBox", "0 0 50 50");
    }
  });

  it("draws the IATA code of every core destination", () => {
    expect(content.destinations.map((d) => d.iata).sort()).toEqual([
      "CPH",
      "IST",
      "LON",
      "NYC",
      "PAR",
      "ROM",
      "SYD",
      "TYO",
    ]);
    for (const dest of content.destinations) {
      render(<Stamp code={dest.iata} label={`${dest.name} stamp`} />);
      const stamp = screen.getByRole("img", { name: `${dest.name} stamp` });
      expect(stamp.querySelector("text")).toHaveTextContent(dest.iata);
    }
  });

  it("has a fixed angle of 0°: no rotation until stampAngle exists (D3)", () => {
    render(<Stamp code="PAR" label="Paris stamp" />);
    const stamp = screen.getByRole("img", { name: "Paris stamp" });
    expect(stamp).not.toHaveAttribute("transform");
    expect(stamp).not.toHaveAttribute("style");
  });
});

describe("StampSlot", () => {
  it("shows its numeral and is hidden from screen readers without a label", () => {
    const { container } = render(<StampSlot numeral={3} />);
    const slot = container.firstElementChild;
    expect(slot).toHaveTextContent("3");
    expect(slot).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("is an image with the caller's name when a label is given", () => {
    render(<StampSlot numeral={4} label="Empty" />);
    const slot = screen.getByRole("img", { name: "Empty" });
    expect(slot).not.toHaveAttribute("aria-hidden");
    expect(slot).toHaveTextContent("4");
  });

  it("takes the diameter the caller gives, 50 px by default", () => {
    const { container, rerender } = render(<StampSlot numeral={1} />);
    const slot = () => container.firstElementChild as HTMLElement;
    expect(slot().style.width).toBe("50px");
    expect(slot().style.height).toBe("50px");
    rerender(<StampSlot numeral={1} size={80} />);
    expect(slot().style.width).toBe("80px");
    expect(slot().style.height).toBe("80px");
  });

  it("marks only the next slot to fill", () => {
    const { container } = render(
      <>
        <StampSlot numeral={4} next />
        <StampSlot numeral={5} />
      </>,
    );
    const [next, later] = Array.from(container.children);
    expect(next).toHaveAttribute("data-next", "true");
    expect(later).not.toHaveAttribute("data-next");
  });
});
