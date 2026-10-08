import Link from "next/link";
import { Hero } from "@/components/hero";
import { Arrow, ArrowRight, Spark } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { CampaignMedia } from "@/components/media";
import { Reveal } from "@/components/reveal";
import { ServiceList } from "@/components/service-list";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/content/projects";
import { process } from "@/content/services";
export default function Home() {
  return <>
    <Hero />
    <div className="discipline-marquee" aria-label="Branding, campaigns, culture, digital, impact"><div className="marquee-track">{[0, 1].map(i => <span key={i} aria-hidden={i === 1 ? "true" : undefined}>BRANDING <Spark /> CAMPAIGNS <Spark /> CULTURE <Spark /> DIGITAL <Spark /> IMPACT <Spark /> </span>)}</div></div>
    <section className="section section-light selected-work" id="selected-work"><Reveal><SectionHeading label="01 / SELECTED WORK" title="Less ordinary. More unforgettable." href="/work" linkLabel="All our work" /></Reveal><div className="featured-grid">{projects.slice(1, 4).map((project, i) => <Reveal key={project.slug} className={`featured-item featured-item-${i + 1}`}><ProjectCard project={project} /></Reveal>)}</div><div className="work-outro"><span className="eyebrow">NO TWO BRANDS ARE THE SAME.<br />THEIR STORIES SHOULDN&apos;T BE EITHER.</span><Link href="/work" className="circle-link" aria-label="Explore all work"><Arrow /></Link></div></section>
    <section className="section manifesto"><span className="eyebrow">A LITTLE ABOUT OUR POINT OF VIEW</span><Reveal><h2>Attention is easy.<br /><span className="muted">Being remembered</span><br />is the real work<Spark />.</h2></Reveal><div className="manifesto-bottom"><span className="mono">THRUX / THINK DIFFERENTLY. MAKE INTENTIONALLY.</span><p>We bring strategy and instinct into the same room. Then we turn the volume up on what makes your brand, <em>your brand.</em></p></div></section>
    <section className="section section-light expertise-preview"><Reveal><SectionHeading label="02 / WHAT WE DO" title="One studio. A wider perspective." href="/expertise" linkLabel="Explore our expertise" /></Reveal><ServiceList /></section>
    <section className="studio-split"><div className="studio-image"><CampaignMedia mediaKey="bts-01" alt="Behind-the-scenes material from the supplied studio archive" tone="bts" words={["MAKE", "IT REAL"]} /><span className="image-corner-label">OFF SCRIPT. ON PURPOSE.</span></div><div className="studio-copy"><span className="eyebrow">03 / THE STUDIO</span><Reveal><h2>Good energy.<br />Bold ideas.<br /><i>No egos.</i></h2></Reveal><p>Curious minds. Hands-on makers. A shared belief that the best work happens when people care a little more.</p><Link href="/studio" className="text-link">Meet the mindset <ArrowRight /></Link><Spark className="studio-spark" /></div></section>
    <section className="section process-section"><SectionHeading label="04 / FROM WHAT IF TO WHAT'S NEXT" title="A good idea is only the beginning." /><div className="process-grid">{process.map(step => <Reveal key={step.number}><article><span className="process-number">{step.number}<Arrow /></span><h3>{step.title}</h3><p>{step.text}</p></article></Reveal>)}</div></section>
  </>;
}
