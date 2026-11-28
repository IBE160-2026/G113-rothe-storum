import { expect, test } from "@playwright/test";
import { copy } from "../../src/ui/copy";

test("Start screen shows the title without horizontal scroll at 375 px", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: copy.start.title }),
  ).toBeVisible();
  await expect(page).toHaveTitle(copy.start.title);

  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});
