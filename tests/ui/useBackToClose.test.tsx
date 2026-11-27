// @vitest-environment jsdom
// UX-DR2: one history entry per open sheet; Back closes it; closing from the
// UI pops the entry, so the history does not grow.
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useBackToClose } from "../../src/ui/hooks/useBackToClose";

const pop = () =>
  act(() => {
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

describe("UX-DR2 useBackToClose", () => {
  it("pushes one entry on open and calls onBack on popstate", () => {
    const onBack = vi.fn();
    const push = vi.spyOn(window.history, "pushState");
    const { result } = renderHook(() => useBackToClose(onBack));

    act(() => {
      result.current.open();
      result.current.open();
    });
    expect(push).toHaveBeenCalledTimes(1);

    pop();
    expect(onBack).toHaveBeenCalledTimes(1);
    push.mockRestore();
  });

  it("ignores popstate when no sheet entry is open", () => {
    const onBack = vi.fn();
    renderHook(() => useBackToClose(onBack));
    pop();
    expect(onBack).not.toHaveBeenCalled();
  });

  it("close() goes back one entry when open, and reports false otherwise", () => {
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
    const { result } = renderHook(() => useBackToClose(() => {}));

    expect(result.current.close()).toBe(false);
    act(() => result.current.open());
    expect(result.current.close()).toBe(true);
    expect(back).toHaveBeenCalledTimes(1);
    back.mockRestore();
  });

  it("#65: unmounting with an entry still open pops it once", () => {
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
    const { result, unmount } = renderHook(() => useBackToClose(() => {}));
    act(() => result.current.open());

    unmount();
    expect(back).toHaveBeenCalledTimes(1);
    back.mockRestore();
  });

  it("#65: close() then unmount before popstate goes back only once", () => {
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
    const { result, unmount } = renderHook(() => useBackToClose(() => {}));
    act(() => result.current.open());
    expect(result.current.close()).toBe(true);

    unmount();
    expect(back).toHaveBeenCalledTimes(1);
    back.mockRestore();
  });

  it("calls onBack once when the popstate for close() arrives", () => {
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
    const onBack = vi.fn();
    const { result } = renderHook(() => useBackToClose(onBack));
    act(() => result.current.open());
    result.current.close();

    pop();
    pop();
    expect(onBack).toHaveBeenCalledTimes(1);
    back.mockRestore();
  });
});
