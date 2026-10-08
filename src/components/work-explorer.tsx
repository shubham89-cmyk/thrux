"use client";
import { useMemo, useState } from "react";
import { disciplines, projects, type Discipline } from "@/content/projects";
import { ProjectCard } from "./project-card";
import { Close } from "./icons";
import { Reveal } from "./reveal";
export function WorkExplorer() {
  const [category, setCategory] = useState<Discipline>("All work");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => projects.filter(project =>
    (category === "All work" || project.category === category) && `${project.title} ${project.category} ${project.description} ${project.subtitle}`.toLowerCase().includes(query.trim().toLowerCase())
  ), [category, query]);
  return <>
    <div className="work-controls"><div className="work-filters" role="group" aria-label="Filter work by discipline">{disciplines.map(item => <button key={item} className={category === item ? "filter-button active" : "filter-button"} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}<span>{item === "All work" ? projects.length : projects.filter(project => project.category === item).length}</span></button>)}</div><div className="work-search"><label className="sr-only" htmlFor="work-search">Search projects</label><input id="work-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find something good..." type="search" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><Close /></button>}</div></div>
    <div className="results-meta"><p aria-live="polite" role="status">{String(visible.length).padStart(2, "0")} {visible.length === 1 ? "collection" : "collections"}</p><span>DIFFERENT DISCIPLINES. ONE POINT OF VIEW.</span></div>
    {visible.length ? <div className="work-grid">{visible.map((project, index) => <Reveal key={project.slug} delay={index % 2 * 110}><ProjectCard project={project} /></Reveal>)}</div> : <div className="empty-state"><h2>Nothing here. Yet.</h2><p>Try a different search or explore all the work.</p><button className="button button-dark" onClick={() => { setCategory("All work"); setQuery(""); }}>Reset filters</button></div>}
  </>;
}
