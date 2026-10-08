#!/usr/bin/env node
/**
 * Best-effort importer for public Google Drive poster images.
 * It is safe to build offline: missing images use labelled design placeholders.
 * The live site never hotlinks expiring Drive thumbnail URLs.
 * Original films remain on Drive and are loaded only after a viewer clicks Play.
 */
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sources = JSON.parse(await readFile(join(root, "src/content/media-sources.json"), "utf8"));
const manifestPath = join(root, "src/content/media.generated.json");
const destination = join(root, "public/media");
await mkdir(destination, { recursive: true });
let previous = {};
try { previous = JSON.parse(await readFile(manifestPath, "utf8")); } catch { /* first import */ }
const manifest = {};
const offline = process.env.THRUX_SKIP_MEDIA_SYNC === "true" || process.argv.includes("--offline");
const refresh = process.argv.includes("--refresh");
const failures = [];
const exists = async path => { try { await access(path); return true; } catch { return false; } };
function imageExtension(buffer) {
  if (buffer.length < 16) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return ".jpg";
  if (buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return ".png";
  if (buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP") return ".webp";
  return null;
}
async function fetchImage(url) {
  const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(9000), headers: { "User-Agent": "ThruxMediaImport/1.0", Accept: "image/avif,image/webp,image/png,image/jpeg,*/*;q=0.5" } });
  if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
  const max = 12 * 1024 * 1024;
  if (Number(response.headers.get("content-length")) > max) throw new Error("Image too large");
  const chunks = []; let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > max) throw new Error("Image exceeds 12 MB");
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  const extension = imageExtension(buffer);
  if (!extension) throw new Error("Not a supported image; possibly a login/permission page");
  return { buffer, extension };
}
async function importOne(source) {
  const current = previous[source.key];
  // Existing local media is preferred. Drop a JPG/PNG/WebP here to replace any poster.
  let local = null;
  for (const extension of [".webp", ".jpg", ".png"]) {
    if (await exists(join(destination, source.key + extension))) { local = `/media/${source.key}${extension}`; break; }
  }
  if (local && (!refresh || offline)) {
    manifest[source.key] = { src: local, sourceId: source.id, importedAt: current?.importedAt || "manual" };
    return;
  }
  if (!offline) {
    const candidates = source.kind === "image" ? [
      `https://drive.google.com/uc?export=download&id=${source.id}`,
      `https://drive.google.com/thumbnail?id=${source.id}&sz=w1600`,
    ] : [
      `https://drive.google.com/thumbnail?id=${source.id}&sz=w1600`,
      `https://lh3.googleusercontent.com/d/${source.id}=w1600`,
    ];
    for (const url of candidates) {
      try {
        const { buffer, extension } = await fetchImage(url);
        const name = source.key + extension;
        await writeFile(join(destination, name), buffer);
        manifest[source.key] = { src: `/media/${name}`, sourceId: source.id, importedAt: new Date().toISOString() };
        console.log(`Imported ${source.key} (${Math.round(buffer.length / 1024)} KB)`);
        return;
      } catch { /* try the second public endpoint; never ask for a password */ }
    }
  }
  if (local) manifest[source.key] = { src: local, sourceId: source.id, importedAt: current?.importedAt || "manual" };
  else failures.push(source.key);
}
// Avoid overwhelming Drive or keeping eleven requests in flight at once.
let index = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (index < sources.length) { const source = sources[index++]; await importOne(source); }
}));
const stable = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(manifestPath, JSON.stringify(stable, null, 2) + "\n");
console.log(`Thrux media: ${Object.keys(manifest).length}/${sources.length} posters available locally.`);
if (failures.length) {
  console.warn(`Using labelled design fallbacks for: ${failures.join(", ")}`);
  console.warn("Run npm run media:sync on a network with Drive access, or supply matching local images in public/media. See docs/ASSETS.md.");
  if (process.env.THRUX_STRICT_MEDIA === "true") process.exitCode = 1;
}
