// Story 1.6 in the browser at 375 × 812 (FR-3, FR-4, UX-DR2, NFR-4):
// the map with status and destinations fits without horizontal scroll; a chip
// opens the route sheet; Esc and browser Back close it and focus returns to
// the chip; Back with the sheet closed by Esc does not leave the map.
import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalScroll(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
}

test("map, route sheet, Esc and browser Back at 375 px", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    window.localStorage.setItem("worldbound.introSeen", "1"),
  );
  await page.reload();
  await page.getByRole("button", { name: "New journey" }).click();

  await expect(page.getByText("Day 1 of 30")).toBeVisible();
  await expect(page.getByText("30 days left")).toBeVisible();
  await expect(page.getByText("€1,500")).toBeVisible();
  await expect(page.locator("[data-place]")).toHaveCount(9);
  await expectNoHorizontalScroll(page);

  const copenhagen = page.getByRole("button", { name: /^Copenhagen/ });
  await copenhagen.click();
  const sheet = page.getByRole("dialog", { name: "Bergen → Copenhagen" });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("radio")).toHaveCount(3);
  await expectNoHorizontalScroll(page);

  await page.keyboard.press("Escape");
  await expect(sheet).toHaveCount(0);
  await expect(copenhagen).toBeFocused();

  await copenhagen.click();
  await expect(sheet).toBeVisible();
  await page.goBack();
  await expect(sheet).toHaveCount(0);
  await expect(copenhagen).toBeFocused();
  await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
});
