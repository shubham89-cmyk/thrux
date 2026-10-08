import type { Metadata } from "next";
import { WorkExplorer } from "@/components/work-explorer";
import { Spark } from "@/components/icons";
import { Reveal } from "@/components/reveal";
export const metadata: Metadata = { title: "Selected work", description: "Explore the Thrux creative archive: fashion campaigns, commercial films, hospitality and behind the scenes.", alternates: { canonical: "/work" } };
export default function WorkPage() {
  return <><section className="page-hero work-hero"><span className="hero-badge"><span className="status-dot" /> SELECTED WORK</span><Reveal><h1>Different worlds.<br /><i>One creative instinct.</i><Spark /></h1></Reveal><div className="page-hero-bottom"><p>A frame. A feeling. A different point of view.<br />Explore fashion, commercial films, hospitality,<br className="desktop-break" /> and the craft behind the final cut.</p><span className="mono">THRUX CREATIVE ARCHIVE<br />FOUR COLLECTIONS. ENDLESS POSSIBILITIES.</span></div><div className="work-hero-chips"><span>Fashion & culture</span><span>Commercial stories</span><span>Food & atmosphere</span><span>Behind the frame</span></div></section><section className="section section-light work-page"><WorkExplorer /></section></>;
}
