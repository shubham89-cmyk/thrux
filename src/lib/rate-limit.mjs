import { createHash } from "node:crypto";
const buckets = new Map();
const WINDOW_SECONDS = 600;
const MAX_REQUESTS = 5;
/** Optional Upstash makes this durable across serverless instances. Local fallback is best-effort only. */
export async function allowEnquiry(ip) {
    const key = `thrux:enquiry:${createHash("sha256").update(ip).digest("hex").slice(0, 32)}`;
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) {
        const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
            method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify([["INCR", key], ["EXPIRE", key, WINDOW_SECONDS, "NX"]]),
            signal: AbortSignal.timeout(4000), cache: "no-store",
        });
        if (!response.ok)
            throw new Error("Rate-limit service unavailable");
        const result = await response.json();
        if (result[0]?.error || typeof result[0]?.result !== "number")
            throw new Error("Rate-limit service returned an invalid result");
        return result[0].result <= MAX_REQUESTS;
    }
    const now = Date.now();
    for (const [id, bucket] of buckets)
        if (bucket.until <= now)
            buckets.delete(id);
    const bucket = buckets.get(key);
    if (bucket) {
        bucket.count += 1;
        return bucket.count <= MAX_REQUESTS;
    }
    // Cap memory rather than evicting entries that are actively rate-limited.
    if (buckets.size >= 2000)
        return false;
    buckets.set(key, { count: 1, until: now + WINDOW_SECONDS * 1000 });
    return true;
}
