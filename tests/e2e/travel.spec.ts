// Story 1.7 in the browser at 375 × 812 (FR-6, FR-7, UX-DR2, NFR-4): travel
// Bergen → Copenhagen updates the status; Travel home opens from "Continue",
// browser Back closes it, "Not now" changes nothing; the confirmed trip home
// ends on the temporary end screen; no screen scrolls horizontally.
import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalScroll(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
}

test("travel, travel home and the temporary end at 375 px", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    window.localStorage.setItem("worldbound.introSeen", "1"),
  );
  await page.reload();
  await page.getByRole("button", { name: "New journey" }).click();

  await page.getByRole("button", { name: /^Copenhagen/ }).click();
  await page.getByRole("radio", { name: /^Bus/ }).check({ force: true });
  await page.getByRole("button", { name: "Take the bus · €70" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByText("Day 3 of 30")).toBeVisible();
  await expect(page.getByText("€1,430")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "You're in Copenhagen" }),
  ).toBeVisible();

  const bergen = page.getByRole("button", { name: /^Bergen/ });
  await bergen.click();
  await page.getByRole("radio", { name: /^Train/ }).check({ force: true });
  await page.getByRole("button", { name: "Continue · €110" }).click();
  const home = page.getByRole("dialog", {
    name: "Take the train home to Bergen?",
  });
  await expect(home).toBeVisible();
  await expect(home.getByText("Stamps 0/5")).toBeVisible();
  await expectNoHorizontalScroll(page);

  await page.goBack();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(bergen).toBeFocused();
  await expect(page.getByText("€1,430")).toBeVisible();

  await bergen.click();
  await page.getByRole("radio", { name: /^Train/ }).check({ force: true });
  await page.getByRole("button", { name: "Continue · €110" }).click();
  await page.getByRole("button", { name: "Not now" }).click();
  await expect(
    page.getByRole("dialog", { name: "Copenhagen → Bergen" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue · €110" }).click();
  await page
    .getByRole("button", { name: "Take the train home · €110" })
    .click();

  await expect(
    page.getByRole("heading", { level: 1, name: "Almost there." }),
  ).toBeVisible();
  await expect(page.getByText("Goal not reached")).toBeVisible();
  await expectNoHorizontalScroll(page);

  await page.getByRole("button", { name: "New journey" }).click();
  await expect(page.getByRole("button", { name: "New journey" })).toBeVisible();
});
