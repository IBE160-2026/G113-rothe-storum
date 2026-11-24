// @vitest-environment jsdom
// #49: modal sheets wrap Tab over every focusable element, not only buttons
// (EXPERIENCE → Component Patterns → Modal sheet: Tab wraps inside). The
// MenuSheet uses this helper; the route sheet and later sheets reuse it.
import { afterEach, describe, expect, it } from "vitest";
import { focusableIn, wrapTab } from "../../src/ui/sheets/focusTrap";

let root: HTMLDivElement;

function sheet(html: string): HTMLDivElement {
  root = document.createElement("div");
  root.innerHTML = html;
  document.body.append(root);
  return root;
}

afterEach(() => root.remove());

const byId = (id: string) => document.getElementById(id) as HTMLElement;

function tab(shiftKey = false, key = "Tab") {
  let prevented = false;
  wrapTab(
    { key, shiftKey, preventDefault: () => (prevented = true) },
    root,
    byId("title"),
  );
  return prevented;
}

const MIXED = `
  <h2 id="title" tabindex="-1">Title</h2>
  <button id="close">×</button>
  <a id="link" href="#help">Help</a>
  <input id="name" />
  <button id="off" disabled>Off</button>
  <input id="secret" type="hidden" />
  <div id="skip" tabindex="-1">Not in the Tab order</div>
  <div id="chip" tabindex="0">Chip</div>
  <section inert><button id="behind">Behind</button></section>
  <select id="mode"><option>Explorer</option></select>`;

describe("#49 modal sheet focus trap", () => {
  it("finds links, inputs, selects and tabindex elements, not only buttons", () => {
    sheet(MIXED);
    expect(focusableIn(root).map((e) => e.id)).toEqual([
      "close",
      "link",
      "name",
      "chip",
      "mode",
    ]);
  });

  it("Tab on the last element (a select) wraps to the first", () => {
    sheet(MIXED);
    byId("mode").focus();
    expect(tab()).toBe(true);
    expect(document.activeElement).toBe(byId("close"));
  });

  it("Shift+Tab on the first element, or on the title, wraps to the last", () => {
    sheet(MIXED);
    byId("close").focus();
    expect(tab(true)).toBe(true);
    expect(document.activeElement).toBe(byId("mode"));

    byId("title").focus();
    expect(tab(true)).toBe(true);
    expect(document.activeElement).toBe(byId("mode"));
  });

  it("leaves Tab alone between elements inside the sheet", () => {
    sheet(MIXED);
    byId("link").focus();
    expect(tab()).toBe(false);
    expect(tab(true)).toBe(false);
    expect(document.activeElement).toBe(byId("link"));
  });

  it("pulls focus back in when it has left the sheet", () => {
    sheet(MIXED);
    const outside = document.createElement("button");
    document.body.append(outside);
    outside.focus();
    expect(tab()).toBe(true);
    expect(document.activeElement).toBe(byId("close"));
    outside.remove();
  });

  it("keeps focus in place when the sheet has nothing to Tab to", () => {
    sheet(`<h2 id="title" tabindex="-1">Title</h2><p>Text only</p>`);
    byId("title").focus();
    expect(tab()).toBe(true);
    expect(document.activeElement).toBe(byId("title"));
  });

  it("ignores keys other than Tab", () => {
    sheet(MIXED);
    byId("mode").focus();
    expect(tab(false, "Enter")).toBe(false);
    expect(document.activeElement).toBe(byId("mode"));
  });
});
