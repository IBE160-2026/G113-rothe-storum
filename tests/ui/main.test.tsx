// @vitest-environment jsdom
// #29, AR-10: the shipped entry point src/main.tsx wraps App in the error
// boundary. The other UI tests build their own tree, so this test imports the
// real main.tsx into a #root element. With invalid content, #root shows the
// fallback screen instead of staying empty; with valid content, Start renders.
// Removing <ErrorBoundary> from main.tsx makes the invalid-content case fail.
import { act, screen } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";
import { copy } from "../../src/ui/copy";

const mock = vi.hoisted(() => ({ invalidContent: false }));

vi.mock("../../src/content/load", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../src/content/load")>();
  return {
    ...actual,
    loadContent: () => {
      if (mock.invalidContent) {
        throw new actual.ContentError(["config.json: x: bad"]);
      }
      return actual.loadContent();
    },
  };
});

let errorSpy: MockInstance<typeof console.error>;
let rootElement: HTMLDivElement;

beforeEach(() => {
  // main.tsx renders on import, so every test needs a fresh module.
  vi.resetModules();
  mock.invalidContent = false;
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  rootElement = document.createElement("div");
  rootElement.id = "root";
  document.body.append(rootElement);
});

afterEach(() => {
  errorSpy.mockRestore();
  rootElement.remove();
});

async function importMain(): Promise<void> {
  await act(async () => {
    await import("../../src/main");
  });
}

describe("#29 AR-10 main.tsx wraps App in the error boundary", () => {
  it("shows the fallback in #root when content is invalid", async () => {
    mock.invalidContent = true;
    await importMain();

    expect(
      await screen.findByRole("heading", { level: 1, name: copy.error.title }),
    ).toBeInTheDocument();
    expect(rootElement).not.toBeEmptyDOMElement();
  });

  it("renders the Start screen in #root with valid content", async () => {
    await importMain();

    expect(
      await screen.findByRole("button", { name: copy.start.newJourney }),
    ).toBeInTheDocument();
    expect(document.title).toBe(copy.start.title);
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
