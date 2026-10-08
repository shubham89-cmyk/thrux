import test from "node:test";
import assert from "node:assert/strict";
import { validateEnquiry, briefAsText } from "../src/lib/enquiry.mjs";
const valid = () => ({ name: "Example Visitor", email: "visitor@example.com", company: "Example Company", message: "We are planning a new brand identity and launch campaign.", services: ["Branding & identity"], budget: "Not sure yet", timeline: "Let's discuss", consent: true, website: "" });
test("accepts a complete enquiry and trims whitespace", () => { const input = valid(); input.name = "  Example Visitor  "; const result = validateEnquiry(input); assert.equal(result.ok, true); assert.equal(result.data.name, "Example Visitor"); });
test("rejects malformed payloads", () => { for (const value of [null, undefined, [], 3, "hello"]) assert.equal(validateEnquiry(value).ok, false); });
test("requires name, email, a meaningful message, a service, consent", () => {
  for (const patch of [{ name: "A" }, { email: "not-an-email" }, { message: "Hello" }, { services: [] }, { consent: false }]) assert.equal(validateEnquiry({ ...valid(), ...patch }).ok, false);
});
test("enforces the honeypot", () => assert.equal(validateEnquiry({ ...valid(), website: "spam.example" }).ok, false));
test("rejects header injection and overly long fields", () => {
  for (const patch of [{ name: "Name\r\nBcc: attacker@example.com" }, { name: "n".repeat(101) }, { email: "a".repeat(260) + "@example.com" }, { company: "c".repeat(151) }, { message: "x".repeat(4001) }]) assert.equal(validateEnquiry({ ...valid(), ...patch }).ok, false);
});
test("filters unrecognised services and deduplicates", () => {
  const result = validateEnquiry({ ...valid(), services: ["Branding & identity", "Branding & identity", "bad", 5] });
  assert.equal(result.ok, true); assert.deepEqual(result.data.services, ["Branding & identity"]);
});
test("budget and timeline accept only listed options", () => { assert.equal(validateEnquiry({ ...valid(), budget: "Unlisted" }).ok, false); assert.equal(validateEnquiry({ ...valid(), timeline: "Unlisted" }).ok, false); });
test("email text is plaintext, with no HTML injection path", () => {
  const result = validateEnquiry({ ...valid(), message: "A new campaign about <script>alert('hello')</script> creativity." });
  assert.equal(result.ok, true); const text = briefAsText(result.data); assert.ok(text.includes("Name: Example Visitor")); assert.ok(text.includes("<script>")); assert.equal(typeof text, "string");
});
test("never treats truthy strings as consent", () => assert.equal(validateEnquiry({ ...valid(), consent: "true" }).ok, false));
test("missing optional fields use safe defaults", () => {
  const input = valid(); delete input.company; delete input.budget; delete input.timeline;
  const result = validateEnquiry(input); assert.equal(result.ok, true); assert.ok(briefAsText(result.data).includes("Brand: Not specified"));
});
