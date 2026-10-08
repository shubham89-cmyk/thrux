import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import { CampaignMedia } from "@/components/media";
import { Arrow, ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return { title: project.subtitle, description: project.description, alternates: { canonical: `/work/${slug}` } };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params; const project = getProject(slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <>
    <section className="page-hero case-hero"><Link href="/work" className="back-link"><ArrowRight /> Back to work</Link><span className="eyebrow">/{project.number} / {project.category}</span><h1>{project.subtitle}</h1><div className="page-hero-bottom"><p>{project.description}</p><span className="mono">THRUX / WORK ARCHIVE</span></div></section>
    <div className="case-cover"><CampaignMedia mediaKey={project.media} alt={project.label} tone={project.tone} words={project.words} priority /></div>
    <section className="section section-light case-story"><aside><span className="eyebrow">THE COLLECTION</span><h2>{project.title}</h2><dl><dt>DISCIPLINE</dt><dd>{project.category}</dd><dt>FOCUS</dt><dd>{project.details.join(" / ")}</dd></dl></aside><div><Reveal><span className="eyebrow">A CLOSER LOOK</span><h3>{project.title}</h3><p>{project.overview}</p><span className="eyebrow">THE POINT OF VIEW</span><p>{project.approach}</p></Reveal>{!site.ready && <p className="editorial-note"><strong>Portfolio preview.</strong> This is an editorial collection of supplied assets, not a verified campaign case study. Final brief, client name, production credits and publication permission need client approval. No performance results are claimed.</p>}</div></section>
    {project.gallery.length > 0 && <section className={`case-gallery section-light ${project.gallery.length > 1 ? "gallery-pair" : ""}`} aria-label="Collection gallery">{project.gallery.map((key, index) => <Reveal key={key}><CampaignMedia mediaKey={key} alt={`${project.label}, detail ${index + 1}`} tone={project.tone} words={index ? ["LOOK", "AGAIN"] : project.words} /></Reveal>)}</section>}
    <section className="section next-project"><span className="eyebrow">KEEP EXPLORING / NEXT COLLECTION</span><Link href={`/work/${next.slug}`}><h2>{next.subtitle}</h2><Arrow /></Link><Link href="/contact" className="text-link">Have something in mind? Let&apos;s talk <ArrowRight /></Link></section>
  </>;
}
