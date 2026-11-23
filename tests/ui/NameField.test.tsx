// @vitest-environment jsdom
// FR-1 name field (Story 1.5; EXPERIENCE → Name field): graphemes, trimming,
// the 14 limit, the counter and the passport preview.
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import {
  limitName,
  NameField,
  nameLength,
} from "../../src/ui/components/NameField";
import { copy } from "../../src/ui/copy";

function Harness({ initial = "" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return <NameField value={value} onChange={setValue} />;
}

const input = () => screen.getByRole("textbox", { name: /Your name/ });

describe("FR-1 name rule in the field", () => {
  it.each([
    ["Ingrid", 6],
    ["  Åse  ", 3],
    ["æøå", 3],
    ["👩‍👩‍👧", 1],
    ["", 0],
  ])("counts %j as %i graphemes after trimming", (value, expected) => {
    expect(nameLength(value)).toBe(expected);
  });

  it("drops leading spaces and stops at 14 graphemes", () => {
    expect(limitName("   Ingrid")).toBe("Ingrid");
    expect(limitName("æ".repeat(20))).toBe("æ".repeat(14));
    expect(limitName("👩‍👩‍👧".repeat(15))).toBe("👩‍👩‍👧".repeat(14));
  });

  it("shows the label, the optional hint, the placeholder and a linked counter", () => {
    render(<Harness />);

    expect(input()).toHaveAttribute("placeholder", copy.start.name.placeholder);
    expect(screen.getByText(copy.start.name.optional)).toBeInTheDocument();
    const counter = screen.getByText("0/14");
    expect(input().getAttribute("aria-describedby")).toContain(counter.id);
  });

  it("updates the counter and the passport preview as the player types", () => {
    render(<Harness />);
    expect(screen.getByText("Traveller")).toBeInTheDocument();

    fireEvent.change(input(), { target: { value: "Ingrid" } });

    expect(input()).toHaveValue("Ingrid");
    expect(screen.getByText("6/14")).toBeInTheDocument();
    expect(screen.getByText("Ingrid")).toBeInTheDocument();
  });

  it("stops input at 14 and announces the limit", () => {
    render(<Harness />);

    fireEvent.change(input(), { target: { value: "abcdefghijklmnopqrst" } });

    expect(input()).toHaveValue("abcdefghijklmn");
    expect(screen.getByText("14/14")).toBeInTheDocument();
    expect(screen.getByText(copy.start.name.atLimit(14))).toBeInTheDocument();
  });

  it("previews a whitespace-only name as Traveller", () => {
    render(<Harness initial="   " />);
    expect(screen.getByText("0/14")).toBeInTheDocument();
    expect(screen.getByText("Traveller")).toBeInTheDocument();
  });
});
