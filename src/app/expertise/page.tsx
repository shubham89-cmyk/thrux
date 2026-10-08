import type { Metadata } from "next";
import Link from "next/link";
import { ServiceList } from "@/components/service-list";
import { Arrow, Spark } from "@/components/icons";
import { process } from "@/content/services";
import { Reveal } from "@/components/reveal";
export const metadata: Metadata = { title: "Expertise", description: "Brand building, campaign creation and a connected digital presence. Discover the Thrux creative approach.", alternates: { canonical: "/expertise" } };
export default function ExpertisePage() {
  return <><section className="page-hero"><span className="eyebrow">WHAT WE DO / HOW WE THINK</span><h1>Built around<br /><i>your next.</i><Spark /></h1><div className="page-hero-bottom"><p>Not a menu of disconnected services.<br />A bigger-picture approach to your brand.</p><Link href="/contact" className="button button-acid">Find your direction <Arrow /></Link></div></section><section className="section section-light expertise-page"><ServiceList expanded /></section><section className="section process-section"><span className="eyebrow">THE APPROACH</span><h2 className="large-heading">A little structure.<br />A lot of possibility.</h2><div className="process-grid">{process.map(step => <Reveal key={step.number}><article><span className="process-number">{step.number}<Arrow /></span><h3>{step.title}</h3><p>{step.text}</p></article></Reveal>)}</div></section><section className="section section-acid service-end"><span className="eyebrow">START WHERE YOU ARE.</span><h2>A new brand.<br />A fresh direction.<br />A much bigger idea.</h2><Link href="/contact" className="button button-dark">Let&apos;s figure it out <Arrow /></Link></section></>;
}
