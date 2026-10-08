import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const root = new URL("../", import.meta.url);
const sources = JSON.parse(readFileSync(new URL("src/content/media-sources.json", root), "utf8"));
const media = JSON.parse(readFileSync(new URL("src/content/media.generated.json", root), "utf8"));
test("source manifest contains unique keys and valid Drive IDs", () => {
  assert.equal(new Set(sources.map(item => item.key)).size, sources.length);
  for (const item of sources) { assert.match(item.key, /^[a-z0-9-]+$/); assert.match(item.id, /^[a-zA-Z0-9_-]{20,80}$/); assert.ok(item.approval); }
});
test("all generated media paths stay inside the public media folder", () => {
  for (const [key, entry] of Object.entries(media)) { assert.ok(sources.some(item => item.key === key)); assert.match(entry.src, /^\/media\/[a-z0-9-]+\.(jpg|png|webp)$/); assert.ok(existsSync(new URL(`public${entry.src}`, root))); }
});
test("preview defaults do not claim live contact configuration", () => {
  const environment = readFileSync(new URL(".env.example", root), "utf8");
  assert.ok(environment.includes("NEXT_PUBLIC_SITE_READY=false"));
  assert.match(environment, /^CONTACT_TO=$/m); assert.match(environment, /^RESEND_API_KEY=$/m);
});
test("every required page exists", () => {
  for (const file of ["page.tsx", "work/page.tsx", "work/[slug]/page.tsx", "expertise/page.tsx", "studio/page.tsx", "contact/page.tsx", "privacy/page.tsx", "not-found.tsx", "api/contact/route.ts"]) assert.ok(existsSync(new URL(`src/app/${file}`, root)), file);
});
