import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const sources = JSON.parse(await readFile(`${root}/src/content/media-sources.json`, "utf8"));
const generated = JSON.parse(await readFile(`${root}/src/content/media.generated.json`, "utf8"));
let missing = 0;
for (const source of sources) {
  const entry = generated[source.key];
  try {
    if (!entry?.src?.startsWith("/media/")) throw new Error("No image");
    await access(`${root}/public${entry.src}`);
    console.log(`OK       ${source.key}`);
  } catch { missing++; console.log(`FALLBACK ${source.key}`); }
}
console.log(`\n${sources.length - missing}/${sources.length} local posters. ${sources.filter(source => source.approval !== "approved").length} assets await publication sign-off.`);
if (missing && process.env.THRUX_STRICT_MEDIA === "true") process.exitCode = 1;
