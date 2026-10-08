import { test, expect } from "@playwright/test";
import { writeFile } from "node:fs/promises";

test("the hero renders live motion and readable creative disciplines", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Brands thatbreakthrough.");
  await expect(page.getByRole("link", { name: "Explore our work" })).toBeVisible();
  await expect(page.getByLabel("Selected brands")).toBeVisible();
  await page.waitForFunction(() => {
    const canvas = document.querySelector("canvas.starfield") as HTMLCanvasElement | null;
    const data = canvas?.getContext("2d")?.getImageData(0, 0, innerWidth, innerHeight).data;
    return Boolean(data?.some((v: number, i: number) => i % 4 === 3 && v > 0));
  });
  const starfield = page.locator("canvas.starfield");
  const before = await starfield.evaluate((el: HTMLCanvasElement) => el.toDataURL());
  await page.waitForTimeout(350);
  const after = await starfield.evaluate((el: HTMLCanvasElement) => el.toDataURL());
  expect(after).not.toBe(before);
  expect(await page.evaluate(() => document.querySelector("canvas[data-engine]") !== null || document.querySelector(".hero-media-fallback") !== null)).toBe(true);
  expect(await page.evaluate(() => document.getAnimations().some(a => a.playState === "running") || document.documentElement.dataset.motion === "full")).toBe(true);
  expect(errors).toEqual([]);
});

test("work filters, combined searches, reset and detail navigation work", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator(".work-grid .project-card")).toHaveCount(4);
  await page.getByRole("button", { name: /^Campaigns/ }).click();
  await expect(page.locator(".work-grid .project-card")).toHaveCount(1);
  await expect(page.getByRole("status")).toHaveText("01 collection");
  await page.getByRole("searchbox", { name: "Search projects" }).fill("commercial");
  await expect(page.getByRole("heading", { name: "Nothing here. Yet." })).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator(".work-grid .project-card")).toHaveCount(4);
  await page.getByRole("searchbox", { name: "Search projects" }).fill("place");
  await expect(page.locator(".work-grid .project-card")).toHaveCount(1);
  await page.getByRole("link", { name: "Explore A taste of somewhere." }).click();
  await expect(page).toHaveURL(/\/work\/a-taste-of-place$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A taste of somewhere.");
});

test("pointer movement lights and tilts a card without interfering with its link", async ({ page }) => {
  await page.goto("/work");
  const card = page.locator(".work-grid .project-card").first();
  await card.scrollIntoViewIfNeeded();
  const initial = await card.evaluate(el => getComputedStyle(el).transform);
  const box = await card.boundingBox();
  if (!box) throw new Error("Project card did not render");
  await page.mouse.move(box.x + box.width * .8, box.y + Math.min(box.height * .35, 190));
  await expect.poll(() => card.evaluate(el => getComputedStyle(el).transform)).not.toBe(initial);
  await expect.poll(() => card.evaluate(el => Number(getComputedStyle(el, ":before").opacity))).toBe(1);
  await expect(page.locator(".cursor-aura")).toHaveClass(/is-visible/);
  await card.getByRole("link", { name: "Explore Fashion, through a different lens." }).click();
  await expect(page).toHaveURL(/\/work\/fashion-in-motion$/);
});

test("reduced motion stops decorative animation and keeps work usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.waitForFunction(() => {
    const canvas = document.querySelector("canvas.starfield") as HTMLCanvasElement | null;
    const data = canvas?.getContext("2d")?.getImageData(0, 0, innerWidth, innerHeight).data;
    return Boolean(data?.some((v: number, i: number) => i % 4 === 3 && v > 0));
  });
  const starfield = page.locator("canvas.starfield");
  const before = await starfield.evaluate((el: HTMLCanvasElement) => el.toDataURL());
  await page.waitForTimeout(300);
  expect(await starfield.evaluate((el: HTMLCanvasElement) => el.toDataURL())).toBe(before);
  expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length)).toBe(0);
  await page.getByRole("link", { name: "Explore our work" }).click();
  await page.getByRole("button", { name: /^Hospitality/ }).click();
  await expect(page.locator(".work-grid .project-card")).toHaveCount(1);
});

test("a change to reduced motion is respected while the page is open", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(300);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length)).toBe(0);
  await page.mouse.move(200, 300);
  await expect(page.locator(".cursor-aura")).not.toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("contact validates errors and downloads a brief honestly in preview mode", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Download the brief" }).click();
  await expect(page.getByPlaceholder("The person behind the idea")).toBeFocused();
  await page.getByPlaceholder("The person behind the idea").fill("Preview Test");
  await page.getByPlaceholder("Where we can reach you").fill("preview@example.com");
  await page.getByRole("button", { name: /^Branding & identity/ }).click();
  await page.getByPlaceholder("The big ambition", { exact: false }).fill("We would like to discuss a brand identity and campaign for our next launch.");
  await page.getByRole("checkbox").check();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download the brief" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("Thrux-project-brief.txt");
  await expect(page.getByRole("status")).toContainText("Nothing has been sent");
});

test.describe("touch layout", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test("the menu supports Escape, focus return and actual route navigation", async ({ page }) => {
    await page.goto("/");
    const open = page.getByRole("button", { name: "Open navigation" });
    await open.click();
    await expect(page.getByRole("dialog", { name: "Navigation", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Navigation", exact: true })).not.toBeVisible();
    await expect(open).toBeFocused();
    await open.click();
    await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: /Work/ }).click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.getByRole("dialog", { name: "Navigation", exact: true })).not.toBeVisible();
    await page.getByRole("button", { name: /^Commercial/ }).click();
    await expect(page.locator(".project-card")).toHaveCount(1);
    await expect(page.locator(".cursor-aura")).not.toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
});

for (const width of [320, 390, 768, 1440]) {
  test(`every page fits a ${width}px screen`, async ({ page }) => {
    test.setTimeout(60_000);
    const errors: string[] = [];
    const layouts: { route: string; width: number; content: number; height: number }[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
    for (const route of ["/", "/work", "/expertise", "/studio", "/contact", "/privacy", "/work/fashion-in-motion", "/work/commercial-stories", "/work/a-taste-of-place", "/work/inside-the-frame"]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      const dimensions = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth, height: innerHeight }));
      layouts.push({ route, ...dimensions });
      expect(dimensions.content, `${route} at ${width}px`).toBeLessThanOrEqual(dimensions.width + 1);
    }
    expect(errors).toEqual([]);
    await writeFile(test.info().outputPath(`layout-checks-${width}.json`), JSON.stringify(layouts, null, 2));
  });
}
