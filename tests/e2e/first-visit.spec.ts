// Story 1.5 in the browser at 375 × 812 (FR-1, FR-2, NFR-4): first visit goes
// Start → intro → map; after a reload the intro is skipped and the name is
// prefilled. No screen scrolls horizontally.
import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalScroll(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
}

test("first visit shows the intro, then later visits skip it and keep the name", async ({
  page,
}) => {
  await page.goto("/");
  await expectNoHorizontalScroll(page);

  await page.getByRole("textbox", { name: /Your name/ }).fill("Ingrid");
  await expect(page.getByText("6/14")).toBeVisible();
  await page.getByRole("button", { name: "New journey" }).click();

  const intro = page.getByRole("heading", { level: 1, name: "How to play" });
  await expect(intro).toBeVisible();
  await expect(intro).toBeFocused();
  await expect(page.getByText("€1,500")).toBeVisible();
  await expect(page.getByText("30 days", { exact: true })).toBeVisible();
  await expectNoHorizontalScroll(page);

  await page.getByRole("button", { name: "Let's go" }).click();
  await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("textbox", { name: /Your name/ })).toHaveValue(
    "Ingrid",
  );
  await page.getByRole("button", { name: "New journey" }).click();
  await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
  await expect(intro).toHaveCount(0);

  // Focus must return to the menu button in a real browser, where the Map is
  // inert while the menu is open (jsdom does not implement inert).
  const menuButton = page.getByRole("button", { name: "Menu" });
  await menuButton.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(menuButton).toBeFocused();

  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("button", { name: "How to play" }).click();
  await expect(intro).toBeVisible();
  await page.getByRole("button", { name: "Back to my journey" }).click();
  await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
});
