"use client";
import { useEffect, useRef, type ReactNode } from "react";
/** Content remains visible without JavaScript; motion is progressive enhancement. */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.IntersectionObserver) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    // Never hide content already in view or after it has been painted.
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (!motion.matches) animation = el.animate([{ transform: "translateY(48px) scale(.985)", opacity: 0.15, filter: "blur(5px)" }, { transform: "translateY(0) scale(1)", opacity: 1, filter: "blur(0px)" }], { duration: 950, easing: "cubic-bezier(.16,1,.3,1)", delay, fill: "none" });
          observer.unobserve(el);
        }
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    const change = () => { if (motion.matches) animation?.cancel(); };
    motion.addEventListener("change", change);
    return () => { observer.disconnect(); animation?.cancel(); motion.removeEventListener("change", change); };
  }, [delay]);
  return <div className={className} ref={ref}>{children}</div>;
}
