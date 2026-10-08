"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/** Cinematic scroll choreography for home + key sections. */
export function ScrollCinema() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".signal-title > span, .signal-title > i",
        { y: 70, opacity: 0, filter: "blur(12px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.15, stagger: 0.1, ease: "power4.out", delay: 0.15 },
      );

      gsap.fromTo(
        ".hero-actions, .signal-description, .hero-badge, .hero-side-panel",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out", delay: 0.45 },
      );

      gsap.to(".hero-media-webgl, .hero-media-fallback", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: ".signal-hero", start: "top top", end: "bottom top", scrub: true },
      });

      gsap.utils.toArray<HTMLElement>(".section, .studio-split, .brand-rail, .manifesto").forEach(section => {
        gsap.fromTo(
          section,
          { opacity: 0.35, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 82%", toggleActions: "play none none reverse" },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".project-card, .brand-chip, .process-grid article, .glass-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 56, rotateX: 8 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            delay: (i % 3) * 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
          },
        );
      });

      gsap.to(".footer-wordmark", {
        letterSpacing: "-0.12em",
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: ".site-footer", start: "top 80%", end: "bottom bottom", scrub: true },
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [pathname]);

  return null;
}
