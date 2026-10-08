import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, Spark } from "@/components/icons";
import { CampaignMedia } from "@/components/media";
import { FilmButton } from "@/components/film-dialog";
import { Reveal } from "@/components/reveal";
export const metadata: Metadata = { title: "The studio", description: "Independent minds, shared ambition. Get to know the creative point of view behind Thrux Media Studios.", alternates: { canonical: "/studio" } };
const values = [
  ["Stay curious.", "Ask the question that nobody asked. Look for the detail that everyone walked past."],
  ["Care about the craft.", "The big idea matters. So does the last frame, the right word and the smallest detail."],
  ["Make it together.", "The strongest work is a conversation. Clear thinking, honest feedback and shared ambition."],
];
export default function StudioPage() {
  return <><section className="page-hero studio-hero"><span className="eyebrow">THRUX / MEDIA STUDIOS</span><h1>Different minds.<br /><i>One wavelength.</i></h1><div className="page-hero-bottom"><p>We are not here to do more of the same.<br />We are here to find what comes next.</p><FilmButton /></div></section><section className="studio-wide"><CampaignMedia mediaKey="bts-01" alt="Behind the scenes from the supplied creative production archive" tone="bts" words={["WORK", "IN PLAY"]} priority /><span>THE SPACE BETWEEN AN IDEA AND REALITY.</span></section><section className="section section-light about-statement"><span className="eyebrow">THE MINDSET</span><Reveal><h2>Strategy gives it purpose.<br />Creativity gives it life.<br /><i>Care makes the difference.</i></h2></Reveal><div className="about-description"><Spark /><p>Thrux brings brand thinking, campaign ideas and digital storytelling together. We believe in work with a clear point of view, a reason to exist and enough character to stand apart.</p><p>Less noise for the sake of noise. More meaningful ideas, made with intention. That is the kind of creative partnership we want to build.</p></div></section><section className="section values-section"><span className="eyebrow">A FEW THINGS WE BELIEVE</span>{values.map(([title, text], index) => <Reveal key={title}><article><span className="mono">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article></Reveal>)}</section><section className="section section-acid studio-end"><Spark /><div><span className="eyebrow">YOUR TEAM, MEET YOUR NEXT IDEA.</span><h2>Good chemistry.<br />Even better work.</h2></div><Link href="/contact" className="circle-link dark-circle" aria-label="Start a conversation"><Arrow /></Link></section></>;
}
