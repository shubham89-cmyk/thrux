"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Ambient backdrop + custom cursor; pauses offscreen and honours reduced motion. */
export function Experience() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const node = canvas.current;
    const context = node?.getContext("2d", { alpha: true });
    if (!node || !context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let width = 0, height = 0, frame = 0, last = 0, elapsed = 0;
    let px = 0, py = 0, tx = 0, ty = 0;
    let stars: { x: number; y: number; radius: number; phase: number; speed: number }[] = [];
    let meteors: { x: number; y: number; life: number; length: number }[] = [];
    let nextMeteor = 3, seed = 831;
    const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const render = (dt: number) => {
      elapsed += dt; px += (tx - px) * .04; py += (ty - py) * .04;
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        const alpha = .15 + (Math.sin(elapsed * star.speed + star.phase) + 1) * .16;
        const drift = motion.matches ? 0 : elapsed;
        const x = (star.x + drift * star.radius * .55 + px * star.radius * 8) % width;
        const y = (star.y + drift * star.radius * .18 + py * star.radius * 8) % height;
        if (star.radius > 1.15) {
          const glow = context.createRadialGradient(x, y, 0, x, y, star.radius * 5);
          glow.addColorStop(0, `rgba(215,255,139,${alpha * .35})`); glow.addColorStop(1, "rgba(215,255,139,0)");
          context.fillStyle = glow; context.beginPath(); context.arc(x, y, star.radius * 5, 0, Math.PI * 2); context.fill();
        }
        context.fillStyle = `rgba(244,244,242,${alpha})`;
        context.beginPath(); context.arc(x, y, star.radius, 0, Math.PI * 2); context.fill();
      }
      if (!motion.matches && elapsed > nextMeteor) {
        meteors.push({ x: width * (.28 + random() * .7), y: height * random() * .45, life: 1, length: 70 + random() * 70 });
        nextMeteor = elapsed + 6 + random() * 7;
      }
      meteors = meteors.filter(m => m.life > 0);
      for (const m of meteors) {
        m.x -= dt * 220; m.y += dt * 120; m.life -= dt * .65;
        const tail = context.createLinearGradient(m.x, m.y, m.x + m.length, m.y - m.length * .56);
        tail.addColorStop(0, `rgba(215,255,139,${Math.max(0, m.life) * .5})`); tail.addColorStop(1, "rgba(215,255,139,0)");
        context.strokeStyle = tail; context.lineWidth = 1;
        context.beginPath(); context.moveTo(m.x, m.y); context.lineTo(m.x + m.length, m.y - m.length * .56); context.stroke();
      }
    };
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      node.width = Math.round(width * dpr); node.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0); seed = 831;
      stars = Array.from({ length: width < 700 ? 40 : 90 }, () => ({
        x: random() * width, y: random() * height, radius: .3 + random() * 1.2,
        phase: random() * Math.PI * 2, speed: .22 + random() * .4,
      }));
      if (motion.matches) render(0);
    };
    const start = () => {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      document.documentElement.dataset.motion = motion.matches ? "reduced" : "full";
      if (!motion.matches && !document.hidden) frame = requestAnimationFrame(tick);
      else { meteors = []; tx = 0; ty = 0; render(0); }
      if (motion.matches || !fine.matches) cursor.current?.classList.remove("is-visible", "is-interactive", "is-card");
    };
    const tick = (now: number) => {
      if (document.hidden || motion.matches) { frame = 0; last = 0; return; }
      if (!last || now - last >= 1000 / 30) { render(last ? Math.min((now - last) / 1000, .08) : 0); last = now; }
      frame = requestAnimationFrame(tick);
    };
    const pointer = (event: PointerEvent) => {
      if (motion.matches || !fine.matches || event.pointerType !== "mouse") return;
      tx = (event.clientX / width - .5) * 2; ty = (event.clientY / height - .5) * 2;
      const halo = cursor.current;
      if (!halo) return;
      halo.style.setProperty("--cursor-x", `${event.clientX}px`);
      halo.style.setProperty("--cursor-y", `${event.clientY}px`);
      halo.classList.add("is-visible");
      const target = event.target as Element | null;
      const interactive = Boolean(target?.closest("a,button,summary,input,textarea,select,.magnetic-link"));
      const onCard = Boolean(target?.closest(".noir-card,.project-card"));
      halo.classList.toggle("is-interactive", interactive && !onCard);
      halo.classList.toggle("is-card", onCard);
    };
    const leave = () => {
      tx = 0; ty = 0;
      cursor.current?.classList.remove("is-visible", "is-interactive", "is-card");
    };
    resize(); start();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", pointer, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", start);
    motion.addEventListener("change", start);
    fine.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointer);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", start);
      motion.removeEventListener("change", start);
      fine.removeEventListener("change", start);
      delete document.documentElement.dataset.motion;
    };
  }, []);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current?.style.setProperty("--reading-progress", String(max > 0 ? window.scrollY / max : 0));
      raf = 0;
    };
    const scroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    return () => { window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll); cancelAnimationFrame(raf); };
  }, [pathname]);
  return <>
    <div className="experience-backdrop" aria-hidden="true">
      <div className="ambient-light ambient-one" /><div className="ambient-light ambient-two" />
      <canvas ref={canvas} className="starfield" /><div className="screen-grain" />
    </div>
    <div className="cursor-aura" ref={cursor} aria-hidden="true"><span /></div>
    <div className="reading-progress" ref={progress} aria-hidden="true" />
  </>;
}
