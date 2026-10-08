"use client";

import Link from "next/link";
import { Arrow, ArrowRight } from "./icons";
import { FilmButton } from "./film-dialog";
import { HeroCanvas } from "./webgl/hero-canvas";
import { Magnetic } from "./motion/magnetic";

export function Hero() {
  return (
    <section className="hero signal-hero" aria-labelledby="hero-heading">
      <HeroCanvas />
      <div className="hero-veil" aria-hidden="true" />
      <div className="hero-topline">
        <span className="hero-badge"><span className="status-dot" /> IMMERSIVE STUDIO EXPERIENCE</span>
        <span className="eyebrow hero-side-label">THRUX / MEDIA STUDIOS</span>
      </div>
      <div className="hero-stage">
        <div className="hero-copy">
          <h1 id="hero-heading" className="signal-title">
            <span>Brands that</span>
            <i>break</i>
            <span className="gradient-title">through.</span>
          </h1>
          <p className="signal-description">
            A different perspective changes everything.<br />
            We build brands, shape campaigns, and create<br className="desktop-break" />
            stories that people <em>feel.</em>
          </p>
          <div className="hero-actions">
            <Magnetic>
              <Link href="/work" className="button button-acid magnetic-link">Explore our work <Arrow /></Link>
            </Magnetic>
            <Link href="/contact" className="text-link">Start a project <ArrowRight /></Link>
          </div>
        </div>
        <aside className="hero-side-panel" aria-hidden="true">
          <div className="hero-stat"><strong>3D</strong><span>LIVE WEBGL STAGE</span></div>
          <div className="hero-stat"><strong>04</strong><span>CREATIVE COLLECTIONS</span></div>
          <div className="hero-stat"><strong>∞</strong><span>SCROLL CINEMATICS</span></div>
        </aside>
      </div>
      <div className="hero-bottomline">
        <a href="#selected-work" className="signal-scroll">
          <span className="scroll-line" /><span>SCROLL TO ENTER</span><span aria-hidden="true">↓</span>
        </a>
        <FilmButton />
      </div>
    </section>
  );
}
