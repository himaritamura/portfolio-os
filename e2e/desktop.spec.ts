import { test, expect } from "@playwright/test";

// test("desktop loads", async ({ page }) => {
//   await page.goto("/");
//   await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
// });

test("opens an app from the taskbar", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open About" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("maximize gets rid of resize handle", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open About" }).click();
  await expect(page.getByTestId("resize-handle")).toBeVisible();
  await page.getByRole("button", { name: "Maximize" }).click();
  await expect(page.getByTestId("resize-handle")).toBeHidden();
  await page.getByRole("button", { name: "Maximize" }).click(); // toggles back
  await expect(page.getByTestId("resize-handle")).toBeVisible();
});

// TODO: open an app by double-click
// TODO: drag a window and verify it moved
// TODO: run `ls` and `cat` in the terminal

// test("resize handle hides when maximized", async ({ page }) => {
//   await page.goto("/");
//   await page.getByRole("button", { name: "Open About" }).click();
//   // ...check the handle exists, click Maximize, check it's gone
//   // page.getByRole("button", { name: ""})
// });