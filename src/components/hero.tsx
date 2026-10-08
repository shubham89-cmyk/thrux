"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Arrow, ArrowRight } from "./icons";
import { FilmButton } from "./film-dialog";
import { CampaignMedia } from "./media";

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
    <div className="hero-media" aria-hidden="true" style={{ transform: "translateY(calc(var(--hero-progress) * 40px))" }}>
      <CampaignMedia mediaKey="commercial-02" alt="" tone="commercial" words={["MAKE", "FEEL"]} priority />
    </div>
    <div className="hero-veil" aria-hidden="true" />
    <div className="hero-topline">
      <span className="hero-badge"><span className="status-dot" /> INDEPENDENT MINDS. EXTRAORDINARY IDEAS.</span>
      <span className="eyebrow hero-side-label">THRUX / MEDIA STUDIOS</span>
    </div>
    <div className="hero-stage">
      <div className="hero-copy">
        <h1 id="hero-heading" className="signal-title"><span>Brands that</span><i>break</i><span className="gradient-title">through.</span></h1>
        <p className="signal-description">A different perspective changes everything.<br />We build brands, shape campaigns, and create<br className="desktop-break" /> stories that people <em>feel.</em></p>
        <div className="hero-actions">
          <Link href="/work" className="button button-acid magnetic-link">Explore our work <Arrow /></Link>
          <Link href="/contact" className="text-link">Start a project <ArrowRight /></Link>
        </div>
      </div>
      <aside className="hero-side-panel" aria-hidden="true">
        <div className="hero-stat"><strong>04</strong><span>CREATIVE COLLECTIONS</span></div>
        <div className="hero-stat"><strong>360°</strong><span>BRAND TO FILM</span></div>
        <div className="hero-stat"><strong>LIVE</strong><span>CURSOR INTERACTIVE</span></div>
      </aside>
    </div>
    <div className="hero-bottomline">
      <a href="#selected-work" className="signal-scroll"><span className="scroll-line" /><span>SCROLL TO DISCOVER</span><span aria-hidden="true">↓</span></a>
      <FilmButton />
    </div>
  </section>;
}
