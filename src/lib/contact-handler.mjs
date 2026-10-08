import { createHash } from "node:crypto";
import { validateEnquiry, briefAsText } from "./enquiry.mjs";
import { allowEnquiry } from "./rate-limit.mjs";
const MAX_BYTES = 20_000;
const reply = (body, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function handleContact(request) {
    const origin = request.headers.get("origin");
    const allowed = new Set([new URL(request.url).origin, process.env.NEXT_PUBLIC_SITE_URL, ...(process.env.CONTACT_ALLOWED_ORIGINS || "").split(",").map(item => item.trim())].filter(Boolean));
    if (!origin || !allowed.has(origin))
        return reply({ error: "This request was not sent from the website." }, 403);
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
        return reply({ error: "A JSON project brief is required." }, 415);
    if (Number(request.headers.get("content-length") || 0) > MAX_BYTES)
        return reply({ error: "This brief is too large." }, 413);
    let raw;
    try {
        // Enforce size even for chunked bodies without a Content-Length header.
        const reader = request.body?.getReader();
        if (!reader)
            return reply({ error: "The project brief was empty." }, 400);
        const chunks = [];
        let bytes = 0;
        while (true) {
            const { value, done } = await reader.read();
            if (done)
                break;
            bytes += value.byteLength;
            if (bytes > MAX_BYTES) {
                await reader.cancel();
                return reply({ error: "This brief is too large." }, 413);
            }
            chunks.push(value);
        }
        raw = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    }
    catch {
        return reply({ error: "The project brief could not be read." }, 400);
    }
    const parsed = validateEnquiry(raw);
    if (!parsed.ok || !parsed.data)
        return reply({ error: "Please check your details.", errors: parsed.errors }, 422);
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM;
    const to = process.env.CONTACT_TO;
    if (!apiKey || !from || !to)
        return reply({ error: "Email delivery is not configured yet. Download your brief instead; nothing has been sent." }, 503);
    try {
        // Vercel sets the forwarded client IP. In other deployments configure a trusted proxy.
        const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        if (!(await allowEnquiry(ip)))
            return reply({ error: "Too many enquiries. Please try again in 10 minutes." }, 429);
        const text = briefAsText(parsed.data);
        // Same payload retries are idempotent; no user-controlled email destinations.
        const dateBucket = Math.floor(Date.now() / (60 * 60 * 1000));
        const idempotencyKey = `thrux-${createHash("sha256").update(`${dateBucket}:${text}`).digest("hex")}`;
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
            body: JSON.stringify({ from, to: [to], reply_to: parsed.data.email, subject: `New Thrux enquiry: ${parsed.data.name}`, text }),
            signal: AbortSignal.timeout(8000), cache: "no-store",
        });
        if (!response.ok)
            return reply({ error: "The email provider could not accept your brief. Please try again or download it." }, 502);
        const result = await response.json();
        if (!result.id)
            return reply({ error: "We could not confirm that your brief was accepted. Please try again." }, 502);
        return reply({ success: true, message: "Your brief has been accepted for delivery. Thank you for starting the conversation." });
    }
    catch {
        return reply({ error: "We could not confirm delivery. Your details are still in the form. Try again or download your brief." }, 503);
    }
}
