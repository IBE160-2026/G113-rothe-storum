// @vitest-environment jsdom
// AR-10, #17, #24: invalid content or a render error shows the fallback screen
// (never an empty #root) and logs to the console; valid content renders the
// Start screen with nothing logged.
import { render, screen } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";
import { ContentError } from "../../src/content/load";
import { App } from "../../src/ui/App";
import { ErrorBoundary } from "../../src/ui/components/ErrorBoundary";
import { copy } from "../../src/ui/copy";

const mock = vi.hoisted(() => ({ invalidContent: false }));

vi.mock("../../src/content/load", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../src/content/load")>();
  return {
    ...actual,
    // The real ContentProvider calls this in its lazy useState initialiser.
    loadContent: () => {
      if (mock.invalidContent) {
        throw new actual.ContentError(["config.json: x: bad"]);
      }
      return actual.loadContent();
    },
  };
});

function Thrower(): never {
  throw new Error("boom");
}

let errorSpy: MockInstance<typeof console.error>;

beforeEach(() => {
  mock.invalidContent = false;
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  errorSpy.mockRestore();
});

function expectFallback(container: HTMLElement): void {
  expect(
    screen.getByRole("heading", { level: 1, name: copy.error.title }),
  ).toBeInTheDocument();
  expect(screen.getByText(copy.error.body)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: copy.error.reload }),
  ).toHaveAttribute("type", "button");
  expect(container).not.toBeEmptyDOMElement();
}

describe("AR-10 error boundary", () => {
  it("shows the fallback and logs the problems when content is invalid", () => {
    mock.invalidContent = true;
    const { container } = render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>,
    );

    expectFallback(container);
    expect(screen.queryByText(copy.start.title)).not.toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalledWith("Invalid content:", [
      "config.json: x: bad",
    ]);
  });

  it("shows the fallback and logs the error when a child throws", () => {
    const { container } = render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>,
    );

    expectFallback(container);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ message: "boom" }),
    );
    expect(errorSpy).not.toHaveBeenCalledWith(
      "Invalid content:",
      expect.anything(),
    );
  });

  it("renders the Start screen with valid content and logs nothing", () => {
    render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: copy.start.title }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: copy.error.reload }),
    ).not.toBeInTheDocument();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("keeps ContentError as the class re-exported by src/app/content", async () => {
    const app = await import("../../src/app/content");
    expect(app.ContentError).toBe(ContentError);
  });
});
