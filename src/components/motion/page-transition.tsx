"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

/** Soft cinematic wipe between routes. */
export function PageTransition() {
  const pathname = usePathname();
  const veil = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (prefersReducedMotion() || !veil.current) return;
    if (first.current) {
      first.current = false;
      gsap.set(veil.current, { autoAlpha: 0, yPercent: -100 });
      return;
    }
    const tl = gsap.timeline();
    tl.set(veil.current, { autoAlpha: 1, yPercent: 0 })
      .to(veil.current, { yPercent: -100, duration: 0.7, ease: "power4.inOut", delay: 0.05 })
      .set(veil.current, { autoAlpha: 0 });
    return () => { tl.kill(); };
  }, [pathname]);

  return <div className="page-veil" ref={veil} aria-hidden="true"><span>THRUX</span></div>;
}
