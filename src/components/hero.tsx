"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Arrow, ArrowRight, Spark } from "./icons";
import { FilmButton } from "./film-dialog";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      element?.style.setProperty("--hero-progress", motion.matches ? "0" : String(Math.min(1, window.scrollY / window.innerHeight)));
      frame = 0;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", scroll, { passive: true }); motion.addEventListener("change", update);
    return () => { window.removeEventListener("scroll", scroll); motion.removeEventListener("change", update); cancelAnimationFrame(frame); };
  }, []);

  return <section className="hero signal-hero" ref={ref} aria-labelledby="hero-heading">
    <div className="hero-topline"><span className="hero-badge"><span className="status-dot" /> INDEPENDENT MINDS. EXTRAORDINARY IDEAS.</span><span className="eyebrow hero-side-label">THRUX / MEDIA STUDIOS</span></div>
    <div className="hero-stage">
      <div className="hero-copy">
        <h1 id="hero-heading" className="signal-title"><span>Brands that</span><i>break</i><span className="gradient-title">through.</span></h1>
        <p className="signal-description">A different perspective changes everything.<br />We build brands, shape campaigns, and create<br className="desktop-break" /> stories that people <em>feel.</em></p>
        <div className="hero-actions"><Link href="/work" className="button button-acid magnetic-link">Explore our work <Arrow /></Link><Link href="/contact" className="text-link">Start a project <ArrowRight /></Link></div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="portal-coordinate">[ T / X ] &nbsp; CREATIVE FREQUENCY</div>
        <div className="hero-portal">
          <div className="portal-halo" /><div className="portal-grid" />
          <svg className="portal-orbits" viewBox="0 0 600 600" fill="none">
            <defs><linearGradient id="thrux-chrome" x1="80" y1="70" x2="440" y2="530" gradientUnits="userSpaceOnUse"><stop stopColor="#3c254b" /><stop offset=".18" stopColor="#f1e9ff" /><stop offset=".32" stopColor="#84768f" /><stop offset=".46" stopColor="#ffffff" /><stop offset=".56" stopColor="#302838" /><stop offset=".7" stopColor="#c3b5dd" /><stop offset=".85" stopColor="#777183" /><stop offset="1" stopColor="#dcff90" /></linearGradient></defs>
            <ellipse className="chrome-orbit orbit-a" cx="300" cy="300" rx="228" ry="108" stroke="url(#thrux-chrome)" strokeWidth="13" />
            <ellipse className="chrome-orbit orbit-b" cx="300" cy="300" rx="218" ry="110" stroke="url(#thrux-chrome)" strokeWidth="9" />
            <ellipse className="chrome-orbit orbit-c" cx="300" cy="300" rx="218" ry="113" stroke="url(#thrux-chrome)" strokeWidth="5" />
            <circle cx="300" cy="300" r="270" stroke="#ae9bcc" strokeOpacity=".13" strokeDasharray="2 12" />
          </svg>
          <div className="portal-emblem"><Spark /></div><span className="portal-satellite satellite-one" /><span className="portal-satellite satellite-two" />
        </div>
        <span className="orbit-tag tag-strategy"><span />Strategy</span><span className="orbit-tag tag-culture"><span />Culture</span><span className="orbit-tag tag-creative"><span />Creative</span>
        <div className="portal-footnote"><span className="status-dot" /> THE ORDINARY ENDS HERE.</div>
      </div>
    </div>
    <div className="hero-bottomline"><a href="#selected-work" className="signal-scroll"><span className="scroll-line" /><span>SCROLL TO DISCOVER</span><span aria-hidden="true">↓</span></a><FilmButton /></div>
    <div className="hero-pillars">{[
      ["01", "Brand identity", "A presence with a point of view."],
      ["02", "Campaigns & films", "The idea. The craft. The feeling."],
      ["03", "Digital storytelling", "Built to start conversations."],
    ].map(([number, title, text]) => <Link href="/expertise" className="glass-card pillar-card" key={number}><span className="mono">{number} / OUR WORLD</span><div><h2>{title}</h2><Arrow /></div><p>{text}</p></Link>)}</div>
  </section>;
}
