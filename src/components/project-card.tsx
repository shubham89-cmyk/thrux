"use client";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { CampaignMedia } from "./media";
import { Arrow } from "./icons";
import { attachPointerGlow, resetPointerGlow } from "./pointer-glow";

export function ProjectCard({ project, className = "", priority = false }: { project: Project; className?: string; priority?: boolean }) {
  return <article
    className={`project-card noir-card ${className}`}
    onPointerMove={event => attachPointerGlow(event, { magnetic: ".project-view" })}
    onPointerLeave={event => resetPointerGlow(event, { magnetic: ".project-view" })}
  >
    <Link href={`/work/${project.slug}`} className="project-media-link" aria-label={`Explore ${project.subtitle}`}>
      <CampaignMedia mediaKey={project.media} alt={project.label} tone={project.tone} words={project.words} priority={priority} />
      <span className="project-micro-tag">{project.category}</span>
      <span className="project-number">/{project.number}</span>
      <h3 className="project-overlay-title">{project.subtitle}</h3>
      <span className="project-view" aria-hidden="true"><Arrow /></span>
    </Link>
    <div className="project-caption">
      <div>
        <span className="eyebrow">{project.label}</span>
        <h3><Link href={`/work/${project.slug}`}>{project.title}</Link></h3>
        <p>{project.description}</p>
        <div className="project-tags">{project.details.slice(0, 2).map(tag => <span key={tag}><b aria-hidden="true" />{tag}</span>)}</div>
      </div>
    </div>
  </article>;
}
