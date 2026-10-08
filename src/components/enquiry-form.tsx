"use client";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { Arrow, ArrowRight } from "./icons";
import { serviceOptions, budgetOptions, timelineOptions, validateEnquiry, briefAsText } from "@/lib/enquiry.mjs";
const serviceMap: Record<string, string> = { brand: "Branding & identity", campaign: "Campaign & production", digital: "Digital & social" };
export function EnquiryForm({ deliveryReady, initialService = "", email = "" }: { deliveryReady: boolean; initialService?: string; email?: string }) {
  const [selected, setSelected] = useState<string[]>(serviceMap[initialService] ? [serviceMap[initialService]] : []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [notice, setNotice] = useState("");
  const form = useRef<HTMLFormElement>(null);
  function read() {
    if (!form.current) return null;
    const fields = new FormData(form.current);
    return validateEnquiry({ name: fields.get("name"), email: fields.get("email"), company: fields.get("company"), services: selected, budget: fields.get("budget"), timeline: fields.get("timeline"), message: fields.get("message"), consent: fields.get("consent") === "on", website: fields.get("website") });
  }
  function validate() {
    const result = read();
    if (!result) return null;
    setErrors(result.errors); setNotice("");
    if (!result.ok || !result.data) {
      requestAnimationFrame(() => {
        const first = form.current?.querySelector<HTMLElement>('[aria-invalid="true"]'); first?.focus();
      });
      return null;
    }
    return result.data;
  }
  function download() {
    const data = validate(); if (!data) return;
    const url = URL.createObjectURL(new Blob([briefAsText(data)], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "Thrux-project-brief.txt"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Your brief was downloaded to your device. Nothing has been sent to the studio.");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!deliveryReady) { download(); return; }
    const data = validate(); if (!data) return;
    setState("sending");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: AbortSignal.timeout(18_000) });
      const result = await response.json() as { success?: boolean; error?: string; errors?: Record<string, string> };
      if (!response.ok || !result.success) { setErrors(result.errors || {}); setNotice(result.error || "We could not send your brief. Please try again."); setState("idle"); return; }
      setState("sent");
    } catch { setState("idle"); setNotice("We could not confirm delivery. Your brief is still here. Try again, or download a copy."); }
  }
  if (state === "sent") return <div className="form-success" role="status"><span className="success-mark"><Arrow /></span><span className="eyebrow">CONVERSATION STARTED</span><h2>Good things<br />are on their way.</h2><p>Your brief has been accepted for email delivery. Thanks for telling us what you have in mind.</p><Link href="/work" className="text-link">Explore the work while you&apos;re here <ArrowRight /></Link></div>;
  const fieldError = (key: string) => errors[key] ? <span className="field-error" id={`${key}-error`}>{errors[key]}</span> : null;
  return <form ref={form} onSubmit={submit} noValidate className="enquiry-form">
    {!deliveryReady && <div className="form-preview-note">Email delivery is not connected in this preview. You can fill in and download a project brief; nothing will be sent.{email && <> Or email <a href={`mailto:${email}`}>{email}</a>.</>}</div>}
    <div className="form-row"><label>Your name <span>*</span><input autoComplete="name" name="name" placeholder="The person behind the idea" maxLength={100} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />{fieldError("name")}</label><label>Email address <span>*</span><input autoComplete="email" type="email" name="email" placeholder="Where we can reach you" maxLength={254} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />{fieldError("email")}</label></div>
    <label>Your brand / company <input autoComplete="organization" name="company" placeholder="Who are we creating for?" maxLength={150} aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? "company-error" : undefined} />{fieldError("company")}</label>
    <fieldset className="service-fieldset"><legend>What are you thinking? <span>*</span></legend><div className="service-choices">{serviceOptions.map(item => <button key={item} type="button" aria-pressed={selected.includes(item)} className={selected.includes(item) ? "choice-button selected" : "choice-button"} aria-invalid={Boolean(errors.services)} aria-describedby={errors.services ? "services-error" : undefined} onClick={() => setSelected(current => current.includes(item) ? current.filter(value => value !== item) : [...current, item])}>{item}<span>{selected.includes(item) ? "-" : "+"}</span></button>)}</div>{fieldError("services")}</fieldset>
    <div className="form-row"><label>Investment range<select name="budget" defaultValue="Not sure yet" aria-invalid={Boolean(errors.budget)}>{budgetOptions.map(item => <option key={item}>{item}</option>)}</select>{fieldError("budget")}</label><label>Ideal timeline<select name="timeline" defaultValue="Let's discuss" aria-invalid={Boolean(errors.timeline)}>{timelineOptions.map(item => <option key={item}>{item}</option>)}</select>{fieldError("timeline")}</label></div>
    <label>A little about the idea <span>*</span><textarea name="message" rows={4} minLength={20} maxLength={4000} placeholder="The big ambition, the small details, the what-ifs. We're listening." required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : "message-hint"} /><small id="message-hint">20-4,000 characters. No confidential information, please.</small>{fieldError("message")}</label>
    <div className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="consent-label"><input type="checkbox" name="consent" required aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} /><span>I agree to being contacted about this enquiry and have read the <Link href="/privacy">privacy notice</Link>.</span></label>{fieldError("consent")}
    <div className="form-actions"><button disabled={state === "sending"} type="submit" className="button button-dark">{state === "sending" ? "Sending your idea..." : deliveryReady ? "Send the brief" : "Download the brief"}<Arrow /></button>{deliveryReady && <button disabled={state === "sending"} type="button" className="text-link" onClick={download}>Save a copy <ArrowRight /></button>}</div>
    {(notice || errors.form) && <div className="form-notice" role="status" aria-live="polite">{notice || errors.form}</div>}
  </form>;
}
