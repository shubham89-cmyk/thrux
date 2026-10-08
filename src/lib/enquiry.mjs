/** Shared validation is dependency-free and tested with Node's built-in test runner. */
export const serviceOptions = ["Branding & identity", "Campaign & production", "Digital & social", "Something else"];
export const budgetOptions = ["Not sure yet", "Under INR 1 lakh", "INR 1-3 lakh", "INR 3-5 lakh", "INR 5 lakh+"];
export const timelineOptions = ["Let's discuss", "Within a month", "1-3 months", "3+ months"];

/** @param {unknown} value */
function clean(value) { return typeof value === "string" ? value.trim() : ""; }
/** @param {unknown} raw */
export function validateEnquiry(raw) {
  /** @type {Record<string, string>} */
  const errors = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ok: false, errors: { form: "Please send a valid project brief." }, data: null };
  const input = /** @type {Record<string, unknown>} */ (raw);
  const data = {
    name: clean(input.name), email: clean(input.email), company: clean(input.company),
    message: clean(input.message), budget: clean(input.budget) || "Not sure yet", timeline: clean(input.timeline) || "Let's discuss",
    services: Array.isArray(input.services) ? [...new Set(input.services.filter((item) => typeof item === "string" && serviceOptions.includes(item)))] : [],
    consent: input.consent === true, website: clean(input.website),
  };
  if (data.website) errors.form = "We could not accept this submission. Please contact the studio directly.";
  if (data.name.length < 2 || data.name.length > 100 || /[\r\n\x00-\x1f]/.test(data.name)) errors.name = "Please enter your name (2-100 characters).";
  if (data.email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email)) errors.email = "Please enter a valid email address.";
  if (data.company.length > 150 || /[\r\n\x00-\x1f]/.test(data.company)) errors.company = "Please keep your brand name under 150 characters.";
  if (data.message.length < 20 || data.message.length > 4000) errors.message = "Tell us a little more (20-4,000 characters).";
  if (!data.services.length) errors.services = "Choose at least one area of interest.";
  if (!budgetOptions.includes(data.budget)) errors.budget = "Choose a listed budget range.";
  if (!timelineOptions.includes(data.timeline)) errors.timeline = "Choose a listed timeline.";
  if (!data.consent) errors.consent = "Please agree to being contacted about this enquiry.";
  return { ok: Object.keys(errors).length === 0, errors, data };
}
/** @param {NonNullable<ReturnType<typeof validateEnquiry>["data"]>} data */
export function briefAsText(data) {
  return ["THRUX / NEW PROJECT BRIEF", "", `Name: ${data.name}`, `Email: ${data.email}`, `Brand: ${data.company || "Not specified"}`, `Interested in: ${data.services.join(", ")}`, `Budget: ${data.budget}`, `Timeline: ${data.timeline}`, "", "THE IDEA", data.message, "", "Permission granted to respond to this project enquiry."].join("\n");
}
