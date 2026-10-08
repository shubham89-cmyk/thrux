"use client";

import type { PointerEvent as ReactPointerEvent } from "react";

const finePointer = () => typeof window !== "undefined"
  && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Spotlight + soft tilt for noir cards. Desktop / mouse only. */
export function attachPointerGlow(event: ReactPointerEvent<HTMLElement>, options?: { tilt?: boolean; magnetic?: string }) {
  if (event.pointerType !== "mouse" || !finePointer()) return;
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  card.style.setProperty("--mx", `${x * 100}%`);
  card.style.setProperty("--my", `${y * 100}%`);
  if (options?.tilt !== false) {
    card.style.setProperty("--rx", `${(y - .5) * -5}deg`);
    card.style.setProperty("--ry", `${(x - .5) * 5}deg`);
  }
  card.dataset.hover = "true";
  if (options?.magnetic) {
    const magnet = card.querySelector<HTMLElement>(options.magnetic);
    if (magnet) {
      const mr = magnet.getBoundingClientRect();
      const cx = mr.left + mr.width / 2;
      const cy = mr.top + mr.height / 2;
      const dx = Math.max(-10, Math.min(10, (event.clientX - cx) * .18));
      const dy = Math.max(-10, Math.min(10, (event.clientY - cy) * .18));
      magnet.style.setProperty("--mag-x", `${dx}px`);
      magnet.style.setProperty("--mag-y", `${dy}px`);
    }
  }
}

export function resetPointerGlow(event: ReactPointerEvent<HTMLElement>, options?: { magnetic?: string }) {
  const card = event.currentTarget;
  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
  delete card.dataset.hover;
  if (options?.magnetic) {
    const magnet = card.querySelector<HTMLElement>(options.magnetic);
    magnet?.style.setProperty("--mag-x", "0px");
    magnet?.style.setProperty("--mag-y", "0px");
  }
}
