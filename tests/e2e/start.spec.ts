import { expect, test } from "@playwright/test";

test("Start screen shows the title without horizontal scroll at 375 px", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "WORLDBOUND: NOMAD" }),
  ).toBeVisible();
  await expect(page).toHaveTitle("WORLDBOUND: NOMAD");

  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});
