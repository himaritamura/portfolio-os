import { test, expect } from "@playwright/test";

test("desktop loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

// TODO: open an app by double-click
// TODO: drag a window and verify it moved
// TODO: run `ls` and `cat` in the terminal
