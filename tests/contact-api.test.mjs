import test from "node:test";
import assert from "node:assert/strict";
import { handleContact } from "../src/lib/contact-handler.mjs";
const payload = () => ({ name: "Test Visitor", email: "visitor@example.com", company: "Example", services: ["Branding & identity"], budget: "Not sure yet", timeline: "Let's discuss", message: "We are starting a new brand and need a thoughtful visual identity.", consent: true, website: "" });
let sequence = 0;
const request = (body = payload(), headers = {}) => new Request("http://localhost:3000/api/contact", { method: "POST", headers: { origin: "http://localhost:3000", "content-type": "application/json", "x-forwarded-for": `test-${++sequence}`, ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) });
const reset = () => { for (const key of ["RESEND_API_KEY", "CONTACT_FROM", "CONTACT_TO", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"]) delete process.env[key]; };
test("rejects a cross-origin request", async () => { reset(); const result = await handleContact(request(payload(), { origin: "https://unrelated.example" })); assert.equal(result.status, 403); });
test("rejects non-JSON requests", async () => { const result = await handleContact(request(payload(), { "content-type": "text/plain" })); assert.equal(result.status, 415); });
test("rejects oversized Content-Length", async () => { const result = await handleContact(request(payload(), { "content-length": "25000" })); assert.equal(result.status, 413); });
test("rejects oversized streamed body even without Content-Length", async () => { const result = await handleContact(request({ ...payload(), message: "a".repeat(21000) })); assert.equal(result.status, 413); });
test("malformed JSON receives 400", async () => { const result = await handleContact(request("{broken")); assert.equal(result.status, 400); });
test("invalid fields receive field-level errors", async () => { const result = await handleContact(request({ ...payload(), email: "bad" })); assert.equal(result.status, 422); assert.ok((await result.json()).errors.email); });
test("unconfigured delivery never reports success", async () => { reset(); const result = await handleContact(request()); assert.equal(result.status, 503); assert.equal((await result.json()).success, undefined); });
test("Resend success uses server-configured recipient and plaintext body", async () => {
  reset(); process.env.RESEND_API_KEY = "test-key"; process.env.CONTACT_FROM = "studio@example.com"; process.env.CONTACT_TO = "owner@example.com";
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async (url, init) => {
      assert.equal(url, "https://api.resend.com/emails");
      const mail = JSON.parse(init.body);
      assert.deepEqual(mail.to, ["owner@example.com"]); assert.equal(mail.from, "studio@example.com"); assert.equal(mail.reply_to, "visitor@example.com"); assert.equal(mail.html, undefined); assert.ok(mail.text.includes("THRUX")); assert.ok(init.headers["Idempotency-Key"]);
      return Response.json({ id: "test-message-id" });
    };
    const result = await handleContact(request({ ...payload(), to: "attacker@example.com" }));
    assert.equal(result.status, 200); assert.equal((await result.json()).success, true);
  } finally { globalThis.fetch = original; reset(); }
});
test("provider rejection does not show a success state", async () => {
  process.env.RESEND_API_KEY = "test-key"; process.env.CONTACT_FROM = "studio@example.com"; process.env.CONTACT_TO = "owner@example.com";
  const original = globalThis.fetch;
  try { globalThis.fetch = async () => Response.json({ error: "bad" }, { status: 422 }); const result = await handleContact(request()); assert.equal(result.status, 502); assert.equal((await result.json()).success, undefined); }
  finally { globalThis.fetch = original; reset(); }
});
test("network failure does not lose the form or claim delivery", async () => {
  process.env.RESEND_API_KEY = "test-key"; process.env.CONTACT_FROM = "studio@example.com"; process.env.CONTACT_TO = "owner@example.com";
  const original = globalThis.fetch;
  try { globalThis.fetch = async () => { throw new Error("Offline"); }; const result = await handleContact(request()); assert.equal(result.status, 503); assert.equal((await result.json()).success, undefined); }
  finally { globalThis.fetch = original; reset(); }
});
