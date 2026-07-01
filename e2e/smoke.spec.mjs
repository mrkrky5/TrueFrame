/**
 * Web E2E smoke tests (Expo web).
 * Default locale: TR. Run: npm run e2e
 */
import { test, expect } from "@playwright/test";

const tabs = {
  home: "Ana Sayfa",
  explore: "Keşfet",
  routes: "Rotalar",
  saved: "Kitaplık",
  settings: "Ayarlar",
};

async function waitForApp(page) {
  await page.goto("/");
  await expect(page.getByRole("button", { name: tabs.home, exact: true })).toBeVisible({
    timeout: 45_000,
  });
}

test.describe("True Frame web smoke", () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page);
  });

  test("primary tab bar is visible", async ({ page }) => {
    for (const label of Object.values(tabs)) {
      await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
    }
  });

  test("explore tab navigation", async ({ page }) => {
    await page.getByRole("button", { name: tabs.explore, exact: true }).click();
    await expect(page).toHaveURL(/\/explore/);
    await expect(page.getByText("Keşfet").first()).toBeVisible();
  });

  test("settings tab shows language picker", async ({ page }) => {
    await page.getByRole("button", { name: tabs.settings, exact: true }).click();
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByText("Dil", { exact: true })).toBeVisible();
    await expect(page.getByText("Türkçe")).toBeVisible();
  });

  test("daily card opens and back returns home", async ({ page }) => {
    const dailyOpen = page.getByRole("button", { name: /Her gün yeni bir gerçeklik kontrolü/i });
    await expect(dailyOpen).toBeVisible();
    await dailyOpen.click();
    await expect(page).toHaveURL(/\/card\//, { timeout: 20_000 });
    await expect(page.getByRole("button", { name: "Geri", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Geri", exact: true }).click();
    await expect(page).toHaveURL(/\/(\?.*)?$/);
    await expect(page.getByRole("button", { name: tabs.home, exact: true })).toBeVisible();
  });

  test("routes tab lists at least one route", async ({ page }) => {
    await page.getByRole("button", { name: tabs.routes, exact: true }).click();
    await expect(page).toHaveURL(/\/routes/);
    await expect(page.getByText("Rotalar").first()).toBeVisible();
    await expect(page.getByRole("button").filter({ hasText: /%/ }).first()).toBeVisible();
  });
});
