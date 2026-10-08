"use client";
import Link from "next/link";
import type { PointerEvent } from "react";
import type { Project } from "@/content/projects";
import { CampaignMedia } from "./media";
import { Arrow } from "./icons";
export function ProjectCard({ project, className = "", priority = false }: { project: Project; className?: string; priority?: boolean }) {
  const move = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const card = event.currentTarget, rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width, y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--spot-x", `${x * 100}%`); card.style.setProperty("--spot-y", `${y * 100}%`);
    card.style.setProperty("--tilt-x", `${(y - .5) * -4}deg`); card.style.setProperty("--tilt-y", `${(x - .5) * 4}deg`); card.dataset.hover = "true";
  };
  const reset = (event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    card.style.setProperty("--tilt-x", "0deg"); card.style.setProperty("--tilt-y", "0deg"); delete card.dataset.hover;
  };
  return <article className={`project-card ${className}`} onPointerMove={move} onPointerLeave={reset}>
    <Link href={`/work/${project.slug}`} className="project-media-link" aria-label={`Explore ${project.subtitle}`}>
      <CampaignMedia mediaKey={project.media} alt={project.label} tone={project.tone} words={project.words} priority={priority} />
      <span className="project-view"><Arrow /><span>Explore collection</span></span><span className="project-number">/{project.number}</span><span className="project-micro-tag">{project.category}</span>
    </Link>
    <div className="project-caption"><div><span className="eyebrow">{project.label}</span><h3><Link href={`/work/${project.slug}`}>{project.title}</Link></h3><p>{project.description}</p><div className="project-tags">{project.details.slice(0, 2).map(tag => <span key={tag}><b aria-hidden="true" />{tag}</span>)}</div></div><span className="project-caption-arrow"><Arrow /></span></div>
  </article>;
}
