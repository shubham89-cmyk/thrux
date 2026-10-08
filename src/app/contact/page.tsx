import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { Spark, Arrow } from "@/components/icons";
import { site } from "@/lib/site";
export const metadata: Metadata = { title: "Start a project", description: "A new brand, a fresh campaign, a bigger idea. Start a conversation with Thrux.", alternates: { canonical: "/contact" } };
export const dynamic = "force-dynamic";
export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const search = await searchParams;
  const service = typeof search.service === "string" ? search.service : "";
  const ready = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM && process.env.CONTACT_TO);
  return <><section className="page-hero contact-hero"><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h1>Big idea?<br /><i>Let&apos;s hear it.</i><Spark /></h1><div className="page-hero-bottom"><p>A first thought is enough.<br />We can figure out the rest together.</p><span className="mono">NO PERFECT BRIEF REQUIRED.</span></div></section><section className="section section-light contact-section"><aside><span className="eyebrow">01 / START THE CONVERSATION</span><h2>Tell us what<br />you have in mind.</h2><p>The more we know about your brand, the better the conversation. Start wherever you are.</p>{site.email && <a href={`mailto:${site.email}`} className="text-link">{site.email} <Arrow /></a>}{site.whatsapp && <a href={`https://wa.me/${site.whatsapp}`} className="text-link" target="_blank" rel="noopener noreferrer">Talk on WhatsApp <Arrow /></a>}<div className="contact-aside-note"><span className="small-cross">+</span><p>Good partnerships start<br />with good conversations.</p></div></aside><EnquiryForm deliveryReady={ready} initialService={service} email={site.email} /></section></>;
}
